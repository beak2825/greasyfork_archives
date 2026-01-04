// ==UserScript==
// @name         自定义网站图标
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  尝试在特定网站上更改图标
// @author       哒哒伽
// @match        *://*.*.*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/480504/%E8%87%AA%E5%AE%9A%E4%B9%89%E7%BD%91%E7%AB%99%E5%9B%BE%E6%A0%87.user.js
// @updateURL https://update.greasyfork.org/scripts/480504/%E8%87%AA%E5%AE%9A%E4%B9%89%E7%BD%91%E7%AB%99%E5%9B%BE%E6%A0%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 自定义图标的URL
    var newFaviconUrl = 'https://i.cnki.net/favicon.ico';

    // 创建一个新的<link>元素
    var link = document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = newFaviconUrl;

    // 移除现有的所有图标
    var head = document.getElementsByTagName('head')[0];
    var links = head.getElementsByTagName('link');
    for (var i = 0; i < links.length; i++) {
        if (links[i].rel === 'shortcut icon' || links[i].rel === 'icon') {
            head.removeChild(links[i]);
        }
    }

    // 添加新的图标
    head.appendChild(link);
})();