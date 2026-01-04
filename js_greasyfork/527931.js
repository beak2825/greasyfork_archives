// ==UserScript==
// @name        GitHub链接精简
// @version      1.02
// @description  删除GitHub链接多余的参数。GitHub Remove /refs/heads from URL.
// @match        *://github.com/*/refs/heads/*
// @match        *://raw.githubusercontent.com/*/refs/heads/*
// @author         yzcjd
// @author2       Lama AI 辅助
// @run-at       document-start
// @grant        none
// @namespace    https://greasyfork.org/users/1171320
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527931/GitHub%E9%93%BE%E6%8E%A5%E7%B2%BE%E7%AE%80.user.js
// @updateURL https://update.greasyfork.org/scripts/527931/GitHub%E9%93%BE%E6%8E%A5%E7%B2%BE%E7%AE%80.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // 检查并更改 URL
    function removeRefsHeads() {
        const currentUrl = window.location.href;
        const newUrl = currentUrl.replace('/refs/heads', '');
 
        if (currentUrl !== newUrl) {
            window.location.replace(newUrl); // 重定向到新 URL
        }
    }
 
    // 立即执行以确保在页面加载时应用更改
    removeRefsHeads();
})();