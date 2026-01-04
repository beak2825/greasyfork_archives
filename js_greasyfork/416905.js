// ==UserScript==
// @name         bosshelper
// @namespace    http://tampermonkey.net/
// @version      0.23
// @description  Boss直聘企业端设定关键词自动打招呼
// @author       Cherokee
// @match        https://www.zhipin.com/vue/index/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416905/bosshelper.user.js
// @updateURL https://update.greasyfork.org/scripts/416905/bosshelper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var retryCheck = function(checkFun,interval,nextFun,times,delay,startTime){
        if(!times)times = 1;
        else times += 1;
        if(!delay)delay = 0;
        if(!startTime)startTime = (new Date()).getTime();
        setTimeout(function(){
            if(checkFun(times)){
                if(delay){
                    var detal = delay - ((new Date()).getTime() - startTime);
                    if(detal>0)setTimeout(nextFun,detal);
                    else nextFun();
                }else nextFun();
            }else retryCheck(checkFun,interval,nextFun,times,delay,startTime);
        },interval);
    }
    window.addEventListener('load',_=>{
        if(window.location.href.startsWith('https://www.zhipin.com/vue/index/#/dashboard/candidate/recommend')){
           retryCheck(_=>{
              let lst = document.querySelectorAll('#recommend-list li');
              return lst && lst.length>0;
           },500,_=>{
               let checking = null;
               let tmer = null;
               let el = document.createElement('button');
               el.setAttribute('style','width:150px;height:30px;color:white;background-color:red');
               el.innerText = '自动撩人';
               document.querySelector('.op-filter').appendChild(el);
               el.addEventListener('click',function(e){
                   if(checking){
                       window.clearInterval(checking);
                       el.innerText = '自动撩人';
                       checking = null;
                       if(tmer){
                           window.clearTimeout(tmer);
                           tmer = null;
                       }
                   }else{
                       let keyword = window.prompt('请输入关键词','行业研究');
                       let lst = document.querySelector('#recommend-list li');
                       let ct = 1;
                       let hct = 0;
                       checking = window.setInterval(_=>{
                           tmer = window.setTimeout(_=>{
                               if(lst){
                                   lst.scrollIntoView(true);
                                   let sel = lst.querySelector('.col-3');
                                   let btn = lst.querySelector('button.btn-greet');
                                   if(sel&&sel.innerText.includes(keyword)&&btn){
                                       btn.click();
                                       lst.style.backgroundColor = '#98cdbb';
                                       hct++;
                                   }else{
                                       lst.style.backgroundColor = '#ffe5e5';
                                   }
                                   lst = lst.nextSibling;
                                   ct++;
                                   el.innerText = '停止撩人('+hct+'/'+ct+')';
                               }else{
                                   window.clearInterval(checking);
                                   el.innerText = '自动撩人('+hct+'/'+ct+')';
                                   checking = null;
                               }
                           },Math.ceil(Math.random()*4000));
                       },2000);
                   }
               },false);
           });
        }
    },false);
})();