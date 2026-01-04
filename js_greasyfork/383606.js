// ==UserScript==
// @name         去除腾讯视频播放LOGO
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       JusTay
// @match        *://v.qq.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383606/%E5%8E%BB%E9%99%A4%E8%85%BE%E8%AE%AF%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BELOGO.user.js
// @updateURL https://update.greasyfork.org/scripts/383606/%E5%8E%BB%E9%99%A4%E8%85%BE%E8%AE%AF%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BELOGO.meta.js
// ==/UserScript==

(function() {
    'use strict';

   var count = 0;
var sbTx = setInterval(function(){
        count++;
        var txDd = document.querySelectorAll("[class^='txp-watermark']")
        if(txDd.length || count > 300) {
           txDd[0].style.opacity = 0;
           clearInterval(sbTx)
         }
     },500)
})();