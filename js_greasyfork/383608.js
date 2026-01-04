// ==UserScript==
// @name         去除爱奇艺视频播放LOGO
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://*.iqiyi.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383608/%E5%8E%BB%E9%99%A4%E7%88%B1%E5%A5%87%E8%89%BA%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BELOGO.user.js
// @updateURL https://update.greasyfork.org/scripts/383608/%E5%8E%BB%E9%99%A4%E7%88%B1%E5%A5%87%E8%89%BA%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BELOGO.meta.js
// ==/UserScript==

(function() {
    'use strict';

   var count = 0;
var sbTx = setInterval(function(){
        count++;
        var txDd = document.querySelectorAll("[class^='iqp-logo-box']")
        if(txDd.length || count > 300) {
           txDd[0].style.opacity = 0;
           clearInterval(sbTx)
         }
     },500)
})();