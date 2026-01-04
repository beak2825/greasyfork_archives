// ==UserScript==
// @name         博客园文章显示发布时间和收藏按钮
// @namespace    https://greasyfork.org/zh-CN/users/4330
// @version      0.3
// @description  修改自https://greasyfork.org/zh-CN/scripts/368104-%E6%98%BE%E7%A4%BA%E5%8D%9A%E5%AE%A2%E5%9B%AD%E6%96%87%E7%AB%A0%E7%9A%84%E5%8F%91%E5%B8%83%E6%97%A5%E6%9C%9F
// @author       x2009again
// @match        http*://www.cnblogs.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410179/%E5%8D%9A%E5%AE%A2%E5%9B%AD%E6%96%87%E7%AB%A0%E6%98%BE%E7%A4%BA%E5%8F%91%E5%B8%83%E6%97%B6%E9%97%B4%E5%92%8C%E6%94%B6%E8%97%8F%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/410179/%E5%8D%9A%E5%AE%A2%E5%9B%AD%E6%96%87%E7%AB%A0%E6%98%BE%E7%A4%BA%E5%8F%91%E5%B8%83%E6%97%B6%E9%97%B4%E5%92%8C%E6%94%B6%E8%97%8F%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var postDate = document.querySelector('#post-date').innerText;
    var insertPosition = document.querySelector('.postTitle');
    insertPosition=insertPosition!=null?insertPosition:document.querySelector('.postTitle2');
    var addToWzHtml=$("#post-date").siblings("a[onclick^=AddToWz]")[0].outerHTML;
    insertPosition.insertAdjacentHTML('afterend', '<p style="color:#c0392b;font-weight:bold;">发布于 '+postDate+' '+addToWzHtml+'</p>');
   
})();