// ==UserScript==
// @name         学习公社自动播放脚本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  学习公社自动播放脚本!
// @author       You
// @match        https://study.enaea.edu.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=enaea.edu.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/448823/%E5%AD%A6%E4%B9%A0%E5%85%AC%E7%A4%BE%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/448823/%E5%AD%A6%E4%B9%A0%E5%85%AC%E7%A4%BE%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
     window.setInterval(function (){
        // var buttonlist=document.getElementsByTagName("button");
         var bu = document.querySelector('#rest_tip button');
         var timestamp=new Date().getTime();
         if(bu)
         {
             document.querySelector('#rest_tip button').click();
             console.log('成功点击。'+ new Date(parseInt(timestamp)).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " "));

         }
         else
         {

         }
     },1000);
    console.log("hello")
    // Your code here...
})();