// ==UserScript==
// @name         Redirect Script 重定向网页
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  这个脚本将会监听特定的URL，并在用户访问该URL时将其重定向到一个新的URL。
// @author       mingfeng
// @match        http://192.168.1.254:8000/portal/local/index.html?weburl=http%3A%2F%2Fwww.msftconnecttest.com%2Fredirect
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/499639/Redirect%20Script%20%E9%87%8D%E5%AE%9A%E5%90%91%E7%BD%91%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/499639/Redirect%20Script%20%E9%87%8D%E5%AE%9A%E5%90%91%E7%BD%91%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 监听页面加载完成事件
    window.addEventListener('load', function() {
        // 获取当前URL
        var currentURL = window.location.href;

        // 检查当前URL是否匹配目标URL
        if (currentURL.indexOf('http://192.168.1.254:8000/portal/local/index.html?weburl=http%3A%2F%2Fwww.msftconnecttest.com%2Fredirect') !== -1) {
            // 重定向到新的URL
            window.location.href = 'http://192.168.1.254:8000/portal/local/index.html';
        }
    });
})();
