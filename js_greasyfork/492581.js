// ==UserScript==
// @name         Restore Original Links (Mobile)
// @namespace    http://your.website.com
// @version      0.1.1
// @description  Restore original links after removing auto redirect (Mobile)
// @author       Your Name
// @match        *://v1.xianbao.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492581/Restore%20Original%20Links%20%28Mobile%29.user.js
// @updateURL https://update.greasyfork.org/scripts/492581/Restore%20Original%20Links%20%28Mobile%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取所有需要处理的链接
    var links = document.querySelectorAll('a[href^="http://link.hou5.com/go/jd?u="]');

    // 遍历链接并处理
    links.forEach(function(link) {
        // 获取原始链接
        var originalUrl = decodeURIComponent(link.getAttribute('href').split('=')[1]);

        // 创建一个新的链接元素
        var newLink = document.createElement('a');
        newLink.href = originalUrl;
        newLink.innerHTML = link.innerHTML;

        // 替换原始链接
        link.parentNode.replaceChild(newLink, link);
    });
})();