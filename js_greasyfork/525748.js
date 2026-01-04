// ==UserScript==
// @name         ChatGPT防降智
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Modify User-Agent to iOS mobile and block fingerprinting for ChatGPT website
// @author       AMT
// @match        *://chatgpt.com/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/525748/ChatGPT%E9%98%B2%E9%99%8D%E6%99%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/525748/ChatGPT%E9%98%B2%E9%99%8D%E6%99%BA.meta.js
// ==/UserScript==

(function() {
    // 修改 User-Agent 为移动端 iOS UA
    Object.defineProperty(navigator, 'userAgent', {
        get: function() {
            return 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/537.36 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/537.36';
        }
    });

    // 禁用浏览器指纹
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
    Object.defineProperty(navigator, 'language', { get: () => 'en-US' });

    // 禁用请求头中的一些敏感信息
    (function() {
        const open = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function() {
            if (arguments[1].includes('https://chat.openai.com/')) {
                this.setRequestHeader('User-Agent', 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/537.36 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/537.36');
            }
            return open.apply(this, arguments);
        };
    })();

    // 阻止浏览器特征信息收集
    window.addEventListener('beforeunload', () => {
        if (navigator && navigator.plugins) {
            Object.defineProperty(navigator, 'plugins', { get: () => [] });
        }
    });
})();
