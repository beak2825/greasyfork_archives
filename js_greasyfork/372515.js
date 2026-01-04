// ==UserScript==
// @name         去除网页复制文字添加水印
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       kooro@github
// @match    *://*.juejin.im/*
// @match    *://*.jianshu.com/*
// @match    *://*.csdn.net/*
// @match    *://*.geekbang.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372515/%E5%8E%BB%E9%99%A4%E7%BD%91%E9%A1%B5%E5%A4%8D%E5%88%B6%E6%96%87%E5%AD%97%E6%B7%BB%E5%8A%A0%E6%B0%B4%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/372515/%E5%8E%BB%E9%99%A4%E7%BD%91%E9%A1%B5%E5%A4%8D%E5%88%B6%E6%96%87%E5%AD%97%E6%B7%BB%E5%8A%A0%E6%B0%B4%E5%8D%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    setTimeout(function(){
        console.log('去除网页复制文字添加水印')
       document.addEventListener("copy", function (e) {
             var i =window.getSelection().toString().trim();
             e.clipboardData.setData("text/plain", i),
             e.clipboardData.setData("text/html", i)
        });
    },1000)
})();