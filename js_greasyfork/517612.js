// ==UserScript==
// @name         星芒下载站辅助程序
// @namespace    https://Star-Search.cn/
// @version      1.4
// @description 通过修改星芒下载站所使用的浏览器UA，绕过百度网盘的限制       
// @icon         https://logo.star-search.cn/logo.ico
// @author       胡黄成霖
// @match        https://pan.star-search.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/517612/%E6%98%9F%E8%8A%92%E4%B8%8B%E8%BD%BD%E7%AB%99%E8%BE%85%E5%8A%A9%E7%A8%8B%E5%BA%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/517612/%E6%98%9F%E8%8A%92%E4%B8%8B%E8%BD%BD%E7%AB%99%E8%BE%85%E5%8A%A9%E7%A8%8B%E5%BA%8F.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // 保存原始方法
    const originalFetch = window.fetch;
    const originalXhrOpen = XMLHttpRequest.prototype.open;

    // 修改 Fetch API 的请求头
    window.fetch = function(...args) {
        let url = args[0];
        if (typeof url === 'string') {
            url = new URL(url, location.href);
        } else if (url instanceof Request) {
            url = url.url;
        }

        if (url.hostname === 'pan.star-search.cn') {
            if (args[0] instanceof Request) {
                args[0].headers.set('User-Agent', 'pan.baidu.com');
            } else {
                const headers = new Headers(args[1]?.headers);
                headers.set('User-Agent', 'pan.baidu.com');
                args[1] = { ...args[1], headers };
            }
        }
        return originalFetch.apply(this, args);
    };

    // 修改 XMLHttpRequest 的请求头
    XMLHttpRequest.prototype.open = function(method, url) {
        this.addEventListener('beforesend', function() {
            if (new URL(url).hostname === 'pan.star-search.cn') {
                this.setRequestHeader('User-Agent', 'pan.baidu.com');
            }
        });
        return originalXhrOpen.apply(this, arguments);
    };
})();