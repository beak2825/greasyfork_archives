// ==UserScript==
// @name         知乎手机网页优化
// @namespace    https://greasyfork.org/zh-CN/users/329780-zs6
// @version      2.1
// @description  知乎手机网页优化，可查看评论区
// @author       zs6
// @license      GPL-3.0-only
// @match        https://www.zhihu.com/*
// @grant GM_addStyle
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/389371/%E7%9F%A5%E4%B9%8E%E6%89%8B%E6%9C%BA%E7%BD%91%E9%A1%B5%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/389371/%E7%9F%A5%E4%B9%8E%E6%89%8B%E6%9C%BA%E7%BD%91%E9%A1%B5%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function setUserAgent(window, userAgent) {
        if (window.navigator.userAgent != userAgent) {
            var userAgentProp = { get: function () { return userAgent; } };
            try {
                Object.defineProperty(window.navigator, 'userAgent', userAgentProp);
            } catch (e) {
                window.navigator = Object.create(navigator, {
                    userAgent: userAgentProp
                });
            }
        }
    }
    setUserAgent(window, 'Mozilla/5.0 (iPad; CPU OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1 Edg/138.0.0.0');
    // 直接注入样式
    GM_addStyle(`
        .css-h1rp11 {
            position: sticky !important;
            top: 0 !important;
            z-index: 1000 !important;
            background: #fff !important;
            box-shadow: 0 2px 4px rgba(0,0,0,.1) !important;
        }
    `);
})();