// ==UserScript==
// @name         去除百度LOGO
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  try to take over the world!
// @author       You
// @match        *://www.baidu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383607/%E5%8E%BB%E9%99%A4%E7%99%BE%E5%BA%A6LOGO.user.js
// @updateURL https://update.greasyfork.org/scripts/383607/%E5%8E%BB%E9%99%A4%E7%99%BE%E5%BA%A6LOGO.meta.js
// ==/UserScript==

(function() {
    'use strict';

   var count = 0;
var sbTx = setInterval(function(){
        count++;
        var txDd = document.querySelectorAll("[class^='s_lg_img_gold_show']")
        if(txDd.length || count > 300) {
           txDd[0].style.opacity = 0;
           clearInterval(sbTx)
         }
     },500)

   var count1 = 0;
var sbTx1 = setInterval(function(){
        count1++;
        var txDd1 = document.querySelectorAll("[class^='s_lg_img_gold_showre']")
        if(txDd1.length || count1 > 300) {
           txDd1[0].style.opacity = 0;
           clearInterval(sbTx1)
         }
     },500)

})();