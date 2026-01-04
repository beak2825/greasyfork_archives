// ==UserScript==
// @name         ChangeGhProxyAddress
// @namespace    http://tampermonkey.net/
// @version      2025-04-20
// @description  修改银河奶牛战斗模拟器中获取价格按钮的站点地址
// @author       You
// @match        https://shykai.github.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533432/ChangeGhProxyAddress.user.js
// @updateURL https://update.greasyfork.org/scripts/533432/ChangeGhProxyAddress.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    // 保存原始的 fetch 方法
    const originalFetch = window.fetch;

    // 替换 fetch 方法
    window.fetch = function(url, ...args) {
        // 检查 URL 是否包含 ghproxy.net 前缀
        if (url.startsWith('https://ghproxy.net/')) {
            // 移除 ghproxy.net 前缀
            url = url.replace('https://ghproxy.net/', 'https://gh.wangdali666.workers.dev/');
        }
        // 调用原始的 fetch 方法
        return originalFetch(url, ...args);
    };
})();