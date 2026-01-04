// ==UserScript==
// @name         新开标签页
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Open external links in a new tab (解决用户在谷歌点击链接的时候不自动新开标签页的烦恼,增加浏览的可读性)人性化操作:确保只有外部链接才会在新标签页中打开，而内部链接仍然在当前标签页
// @author       橙PingAn
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/495922/%E6%96%B0%E5%BC%80%E6%A0%87%E7%AD%BE%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/495922/%E6%96%B0%E5%BC%80%E6%A0%87%E7%AD%BE%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取当前页面的主机名
    const currentHost = window.location.hostname;

    document.querySelectorAll('a').forEach(function(link) {
        // 创建一个a元素来解析链接的URL
        const url = new URL(link.href);

        // 判断链接的主机名是否与当前页面的主机名相同
        if (url.hostname !== currentHost) {
            link.setAttribute('target', '_blank');
        }
    });
})();