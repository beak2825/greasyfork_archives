// ==UserScript==
// @name         屏蔽斗鱼虎牙资源并禁用 WebRTC
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  拦截指定资源以及 URL 中包含 p2p 或 P2P 的请求，并禁用 WebRTC。
// @author       红尘
// @match        *://*/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521376/%E5%B1%8F%E8%94%BD%E6%96%97%E9%B1%BC%E8%99%8E%E7%89%99%E8%B5%84%E6%BA%90%E5%B9%B6%E7%A6%81%E7%94%A8%20WebRTC.user.js
// @updateURL https://update.greasyfork.org/scripts/521376/%E5%B1%8F%E8%94%BD%E6%96%97%E9%B1%BC%E8%99%8E%E7%89%99%E8%B5%84%E6%BA%90%E5%B9%B6%E7%A6%81%E7%94%A8%20WebRTC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 原始过滤规则
    const blockedUrls = [
        '*://*.ourdvsss.com/live?msg=getpeer',
        '*://*api.galaxyclouds.cn/p2p*',
        '*://*congyicn.com/FlashP2PMonitorNew/*',
        '*://*congyicn.com/dist/yhp2p.min.js',
        '*://proxy-tel-s.alicdn.com/f/pcdn*',
        '*://sdkapi.douyucdn.cn/p2p*',
        '*://*.va.huya.com/*',
        '*://*.p2p.huya.com/*',
        '*://statwup.huya.com/*'
    ];
    
    // 拦截并屏蔽的关键字
    const blockedKeyword = /p2p/i; // 匹配 p2p 或 P2P
    
    // 拦截网络请求的回调函数
    const blockRequest = (details) => {
        console.log(`拦截到请求：${details.url}`);
        return { cancel: true };
    };
    
    // 拦截并屏蔽网络请求
    if (window.chrome && chrome.webRequest) {
        chrome.webRequest.onBeforeRequest.addListener(
            blockRequest,
            { urls: blockedUrls.concat("<all_urls>") }, // 添加匹配所有 URL 的规则
            ['blocking']
        );
        console.log("拦截规则已启用：屏蔽指定 URL 和包含“p2p”或“P2P”的请求。");
    } else {
        console.warn("您的浏览器不支持 webRequest API，无法拦截请求。");
    }
    
    // 禁用 WebRTC
    function disableWebRTC() {
        if (typeof window.RTCPeerConnection !== "undefined") {
            window.RTCPeerConnection = undefined;
        }
        if (typeof window.webkitRTCPeerConnection !== "undefined") {
            window.webkitRTCPeerConnection = undefined;
        }
        if (typeof navigator.mediaDevices !== "undefined" && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia = () => Promise.reject(new Error("WebRTC 功能已被脚本禁用。"));
        }
        console.log("WebRTC 功能已禁用。");
    }
    
    // 手动监控 XMLHttpRequest 和 Fetch 请求
    function monitorRequests() {
        const originalOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
            if (blockedKeyword.test(url)) {
                console.warn(`拦截到包含“p2p”或“P2P”的请求：${url}`);
                return; // 不执行请求
            }
            return originalOpen.apply(this, arguments);
        };
    
        const originalFetch = window.fetch;
        window.fetch = function (input, init) {
            const url = typeof input === 'string' ? input : input.url;
            if (blockedKeyword.test(url)) {
                console.warn(`拦截到包含“p2p”或“P2P”的请求：${url}`);
                return Promise.reject(new Error("该请求已被屏蔽。"));
            }
            return originalFetch(input, init);
        };
    }
    
    // 启用功能
    disableWebRTC();
    monitorRequests();
    console.log("脚本已运行：屏蔽指定 URL 和包含 p2p 的请求，并禁用 WebRTC 功能。");
})();