// ==UserScript==
// @name         B站动态中隐藏直播和话题
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description   B站隐藏动态直播和话题
// @author       y-hh
// @match        https://t.bilibili.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/398760/B%E7%AB%99%E5%8A%A8%E6%80%81%E4%B8%AD%E9%9A%90%E8%97%8F%E7%9B%B4%E6%92%AD%E5%92%8C%E8%AF%9D%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/398760/B%E7%AB%99%E5%8A%A8%E6%80%81%E4%B8%AD%E9%9A%90%E8%97%8F%E7%9B%B4%E6%92%AD%E5%92%8C%E8%AF%9D%E9%A2%98.meta.js
// ==/UserScript==
var auto_close_live=document.getElementsByClassName('live-panel');
var auto_close2_huati=document.getElementsByClassName('new-topic-panel');

var myDate = new Date();
(function() {
    'use strict';

    //输出时间
    var time=setInterval(function () {
        console.log( "1.时间………………………………");
        console.log(myDate.getHours()+"H,"+myDate.getMinutes()+"M");
        clearInterval(time);

    },500);

    // B站动态中隐藏直播和话题
  var auto_close=setInterval(function () {
        console.log("2。````````````````");
         auto_close_live[0].style.display = 'none';
         auto_close2_huati[0].style.display = 'none';
        clearInterval(auto_close);
                                   },500);
     var auto_close2=setInterval(function () {
         clearInterval(auto_close);
        clearInterval(auto_close2);
                                   },1000);


}
)();
