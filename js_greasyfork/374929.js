// ==UserScript==
// @name         知乎专栏时间放上面
// @namespace    zhangolve@gmail.com
// @version      0.01
// @description  把知乎专栏文章的更新时间放上面
// @author       zhangolve
// @match        *://zhuanlan.zhihu.com/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/374929/%E7%9F%A5%E4%B9%8E%E4%B8%93%E6%A0%8F%E6%97%B6%E9%97%B4%E6%94%BE%E4%B8%8A%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/374929/%E7%9F%A5%E4%B9%8E%E4%B8%93%E6%A0%8F%E6%97%B6%E9%97%B4%E6%94%BE%E4%B8%8A%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
   window.onload= function() {
   var a = document.querySelector('.ContentItem-time')
   var b = document.querySelector('.Post-Header')
   b.appendChild(a);
   }
    // Your code here...
})();