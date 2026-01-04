
// ==UserScript==
// @name         BI自动切换Tab
// @namespace    http://hello.world.net/
// @version      1.0
// @description  自动点击Tab
// @author       sugz
// @match        *://bi/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426493/BI%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/426493/BI%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2Tab.meta.js
// ==/UserScript==
 
 
var interval=20000;//初始切换Tab的时间间隔

//tab集合
var tab;
var flag=true;

(function() {
    'use strict';
    //6秒后获取标签，先等网页加载出来
    setTimeout(function() {
    var content=document.getElementsByClassName("viewer pbi-frame");
    tab=content[0].contentWindow.document.getElementsByClassName("section dynamic thumbnail-container ui-draggable ui-draggable-handle pbi-focus-outline droppableElement ui-droppable");
    interval=(tab.length+1)*20000;
    console.log("tab的length:"+tab.length);
    console.log("interval:"+interval);
    }, 6000);
  
  function tabClick (tabTmp) {
     tabTmp.addEventListener('click', function (event) {
     }, false);
     var ev = new MouseEvent('click', {
         cancelable: true,
         bubble: true,
         view: window
     });
     tabTmp.dispatchEvent(ev);
  }
  
    setInterval(function() {
        console.log("setInterval执行时间："+new Date());
        for (let i = 0; i < tab.length; i++) {
            (function(a){
                //首次进入不执行点击
                if(a==0&&flag==true){
                    console.log("首次进入不执行点击");
                }else{
                    flag=false;
                    console.log(a);
                    setTimeout(function(){
                        tabClick(tab[a]);
                    console.log("tab"+a+"执行时间："+new Date());
                    },20000*a);
                }
               
            }(i))
        }

    },interval)

})();
