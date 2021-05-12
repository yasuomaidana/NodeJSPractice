const express = require("express");
 
//Import routes
const dishIdRoutes = require('./dishId')

const dishRouter = express.Router();

//Import dish model
const Dishes = require("../../models/dishes");

//
const authenticate = require('../../authenticate');
const cors = require('../cors');
dishRouter.use(express.json());

dishRouter.route('/')
.options(cors.corsWithOptions,(req,res)=>{
    res.statusCode = 200;
    res.end('');
})
.get(cors.cors,(req,res,next) => {
    Dishes.find({}).populate('comments.author')
    .then(dishes=>{
        res.status = 200;
        res.setHeader("Content-Type",'aplication/json');
        res.json(dishes); 
    },err=>{next(err);})
    .catch(err=>{next(err);});
})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    Dishes.create(req.body)
    .then( dish =>{
        console.log("Created dish :",dish);
        res.status = 200;
        res.setHeader("Content-Type",'aplication/json');
        res.json(dish); 
    },err=>{next(err);})
    .catch(err=>{next(err);});
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes');
    //return next(res);
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    Dishes.remove({}).then(resp=>{
        res.status = 200;
        res.setHeader("Content-Type","aplication/json");
        res.json(resp);
    },err=>{next(err);}).catch(err=>{next(err);});
});

dishRouter.use("/",dishIdRoutes);

module.exports = dishRouter;