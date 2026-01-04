// ==UserScript==
// @name         跳过零信任
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Intercept request to /startTunnel and mock response
// @match        *://133.38.198.91/*
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/526266/%E8%B7%B3%E8%BF%87%E9%9B%B6%E4%BF%A1%E4%BB%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/526266/%E8%B7%B3%E8%BF%87%E9%9B%B6%E4%BF%A1%E4%BB%BB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 拦截 fetch 请求
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        // 判断请求 URL 是否为指定的 URL
        if (args[0].includes("127.0.0.1:60001/startTunnel")) {
            console.log("Intercepted fetch request to /startTunnel");
            // 返回一个 Promise，解析为我们指定的 JSON 数据
            return Promise.resolve(new Response(JSON.stringify({ code: 0 }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            }));
        }
        if (args[0].includes("127.0.0.1:60001/getMachineIdUuid")) {
            console.log("Intercepted fetch request to /getMachineIdUuid");
            // 返回一个 Promise，解析为我们指定的 JSON 数据
            return Promise.resolve(new Response("6ae640e0-eba5-5a33-b345-9de3e10ff460|", {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            }));
        }
        return originalFetch(...args);
    };

    // 拦截 XMLHttpRequest 请求
    const open = window.XMLHttpRequest.prototype.open;
    window.XMLHttpRequest.prototype.open = function(method, url) {
        // 判断请求 URL 是否为指定的 URL
        if (url.includes("127.0.0.1:60001/startTunnel")) {
            console.log("Intercepted XMLHttpRequest to /startTunnel");
            this.addEventListener("readystatechange", function() {
                if (this.readyState === 4) {
                    // 自定义响应
                    Object.defineProperty(this, "responseText", { value: JSON.stringify({ code: 0 }) });
                    Object.defineProperty(this, "status", { value: 200 });
                }
            });
        }
        if (url.includes("127.0.0.1:60001/getMachineIdUuid")) {
            console.log("Intercepted XMLHttpRequest to /getMachineIdUuid");
            this.addEventListener("readystatechange", function() {
                if (this.readyState === 4) {
                    // 自定义响应
                    Object.defineProperty(this, "responseText", { value: "6ae640e0-eba5-5a33-b345-9de3e10ff460|" });
                    Object.defineProperty(this, "status", { value: 200 });
                }
            });
        }
        return open.apply(this, arguments);
    };
})();