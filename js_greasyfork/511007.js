// ==UserScript==
// @name         NodeSeek 附加样式移除
// @namespace    https://www.nodeseek.com/
// @version      0.0.2
// @description  去除 NodeSeek 的附加样式
// @author       TomyJan
// @match        *://www.nodeseek.com/*
// @icon         https://www.nodeseek.com/static/image/favicon/android-chrome-192x192.png
// @grant        none
// @run-at       document-start
// @license      MPL-2.0 License
// @supportURL   https://www.nodeseek.com/post-167870-1
// @homepageURL  https://www.nodeseek.com/post-167870-1
// @downloadURL https://update.greasyfork.org/scripts/511007/NodeSeek%20%E9%99%84%E5%8A%A0%E6%A0%B7%E5%BC%8F%E7%A7%BB%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/511007/NodeSeek%20%E9%99%84%E5%8A%A0%E6%A0%B7%E5%BC%8F%E7%A7%BB%E9%99%A4.meta.js
// ==/UserScript==

/**
 * 
 * 
 * 当前版本更新日志
 * 0.0.2 - 2024.10.01          !!!更新前注意备份您的配置!!!
 * - 新增 脚本支持链接
 */

(function() {
    'use strict';

    var links = document.querySelectorAll('link[rel="stylesheet"]');
    links.forEach(function(link) {
        if (link.href.includes('/systemstyle/append.css')) {
            link.parentNode.removeChild(link);
        }
    });
})();
