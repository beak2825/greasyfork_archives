// ==UserScript==
// @name         oexam考试脚本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       GODZ
// @match        http://exam.nlecp.com:8082/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/414819/oexam%E8%80%83%E8%AF%95%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/414819/oexam%E8%80%83%E8%AF%95%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.fun=function(data,type){
       $.ajax({
           url:'https://cbe1a130-ac8b-4fb0-be72-8044c05be651.bspapp.com/http/serach',
           data:{
               data:data
           },
           success(res){
               res.forEach(item=>{
                   if(item.type != type){

                   }
                   else{
                        if (item.type == 2) {
                            item.answer= item.answer + '.' + item[item.answer]
                        }
                       if (item.type == 1) {
                           item.answer= item.answer == 'A' ? '正确' : '错误'
                       }

                       console.log(item.title+' '+item.answer)
                   }

               })
           }
       })
    }

     window.fun1=function(data){
       $.ajax({
           url:'https://cbe1a130-ac8b-4fb0-be72-8044c05be651.bspapp.com/http/serach',
           data:{
               data:data
           },
           success(res){
               res.forEach(item=>{

                   if (item.type == 2) {
					item.answer= item.answer + '.' + item[item.answer]
                   }
                   if (item.type == 1) {
                       item.answer= item.answer == 'A' ? '正确' : '错误'
                   }

                  console.log(item.title+' '+item.answer)
               })
           }
       })
    }
    
    // Your code here...
})();