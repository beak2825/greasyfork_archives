// ==UserScript==
// @name         限制网站“claude4.ai1.bar”使用SwitchyOmega扩展后遗留的唯一API请求尝试次数(避免死循环报错)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  让特定 api 地址（如 https://154.9.255.107/v1）最多请求2次，之后阻断请求
// @author       PPPotatooo
// @match        *://claude4.ai1.bar/*
// @license      All Rights Reserved
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544162/%E9%99%90%E5%88%B6%E7%BD%91%E7%AB%99%E2%80%9Cclaude4ai1bar%E2%80%9D%E4%BD%BF%E7%94%A8SwitchyOmega%E6%89%A9%E5%B1%95%E5%90%8E%E9%81%97%E7%95%99%E7%9A%84%E5%94%AF%E4%B8%80API%E8%AF%B7%E6%B1%82%E5%B0%9D%E8%AF%95%E6%AC%A1%E6%95%B0%28%E9%81%BF%E5%85%8D%E6%AD%BB%E5%BE%AA%E7%8E%AF%E6%8A%A5%E9%94%99%29.user.js
// @updateURL https://update.greasyfork.org/scripts/544162/%E9%99%90%E5%88%B6%E7%BD%91%E7%AB%99%E2%80%9Cclaude4ai1bar%E2%80%9D%E4%BD%BF%E7%94%A8SwitchyOmega%E6%89%A9%E5%B1%95%E5%90%8E%E9%81%97%E7%95%99%E7%9A%84%E5%94%AF%E4%B8%80API%E8%AF%B7%E6%B1%82%E5%B0%9D%E8%AF%95%E6%AC%A1%E6%95%B0%28%E9%81%BF%E5%85%8D%E6%AD%BB%E5%BE%AA%E7%8E%AF%E6%8A%A5%E9%94%99%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 要拦截的 API 地址前缀
    const blockUrl = 'https://154.9.255.107/v1';
    // 请求计数
    let requestCount = 0;
    // 最大允许请求次数
    const maxTries = 2;

    // 拦截 fetch
    const origFetch = window.fetch;
    window.fetch = function(input, init) {
        let url = (typeof input === 'string') ? input : input.url;
        if (url && url.startsWith(blockUrl)) {
            requestCount++;
            if (requestCount > maxTries) {
                // 模拟失败response/可以自定义Response内容
                return Promise.resolve(new Response(JSON.stringify({error: "请求次数限制，阻断执行"}), {status: 400, headers: {"Content-Type": "application/json"}}));
            }
        }
        return origFetch.apply(this, arguments);
    };

    // 拦截 XMLHttpRequest
    const origOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        this._isTarget = url && url.startsWith(blockUrl);
        return origOpen.apply(this, arguments);
    };
    const origSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function() {
        if (this._isTarget) {
            requestCount++;
            if (requestCount > maxTries) {
                // 直接触发error事件
                setTimeout(() => {
                    this.onerror && this.onerror(new Event('error'));
                    this.abort();
                }, 0);
                return;
            }
        }
        return origSend.apply(this, arguments);
    };
})();