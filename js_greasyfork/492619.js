// ==UserScript==
// @name         去除新赚客吧返利链接
// @namespace    http://your.website.com
// @version      0.1.1
// @description  Restore original links after removing auto redirect
// @author       Your Name
// @match        https://v1.xianbao.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492619/%E5%8E%BB%E9%99%A4%E6%96%B0%E8%B5%9A%E5%AE%A2%E5%90%A7%E8%BF%94%E5%88%A9%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/492619/%E5%8E%BB%E9%99%A4%E6%96%B0%E8%B5%9A%E5%AE%A2%E5%90%A7%E8%BF%94%E5%88%A9%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取所有需要处理的链接
    var links = document.querySelectorAll('a[href^="http://link.hou5.com/go/jd?u="]');

    // 遍历链接并处理
    links.forEach(function(link) {
        // 获取原始链接
        var originalUrl = decodeURIComponent(link.getAttribute('href').split('=')[1]);

        // 设置原始链接
        link.setAttribute('href', originalUrl);

        // 移除自动跳转属性
        link.removeAttribute('target');
        link.removeAttribute('rel');
    });
})();
