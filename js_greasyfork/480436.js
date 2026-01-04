// ==UserScript==
// @name         扇贝阅读夜间模式
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  将扇贝阅读颜色修改为夜间模式
// @author       津酒奈杰
// @match        https://web.shanbay.com/reading/web-news/articles
// @match         https://web.shanbay.com/reading/web-news/articles/*
// @icon        https://assets0.baydn.com/static/img/shanbay_favicon.png
// @grant        none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/480436/%E6%89%87%E8%B4%9D%E9%98%85%E8%AF%BB%E5%A4%9C%E9%97%B4%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/480436/%E6%89%87%E8%B4%9D%E9%98%85%E8%AF%BB%E5%A4%9C%E9%97%B4%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==


(function() {
   'use strict';
     window.onload = function() {
       // Your plugin code here
       // ...
         // Your code here...
   const style = document.createElement('style');
   style.innerHTML = `
       .article-body .article-content {
           color: #cecece;
       }
       .sideBar li .hot-news-title,
       h2,
       h3,
       .news li .news-title,
       .news li .news-summary,
       .weekly-pop-news-title{
        color: #cecece;
       }
       span.word.word-bold{
       font-weight: bold;
       color: #209e85
       }
       .app-container {
           background-color: #1c1c1c;
       }
       .app-main {
           background-color: #1c1c1c;
       }
   `;
   document.head.appendChild(style);
   };

})();