// ==UserScript==
// @name         有谱吗网站去除15秒播放限制yopu.co #音乐#吉他#乐谱
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Unlock the 15-second playback limit on yopu.co guitar tabs website
// @author       YourName
// @match        https://yopu.co/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/526241/%E6%9C%89%E8%B0%B1%E5%90%97%E7%BD%91%E7%AB%99%E5%8E%BB%E9%99%A415%E7%A7%92%E6%92%AD%E6%94%BE%E9%99%90%E5%88%B6yopuco%20%E9%9F%B3%E4%B9%90%E5%90%89%E4%BB%96%E4%B9%90%E8%B0%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/526241/%E6%9C%89%E8%B0%B1%E5%90%97%E7%BD%91%E7%AB%99%E5%8E%BB%E9%99%A415%E7%A7%92%E6%92%AD%E6%94%BE%E9%99%90%E5%88%B6yopuco%20%E9%9F%B3%E4%B9%90%E5%90%89%E4%BB%96%E4%B9%90%E8%B0%B1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 检查是否有播放限制的回调函数或计时器
    const originalSetTimeout = window.setTimeout;
    window.setTimeout = function(callback, delay) {
        // 如果发现播放限制逻辑（例如 15000ms），将其屏蔽或修改
        if (delay === 15000) {
            console.log("Bypassing 15-second limit...");
            return; // 阻止限制
        }
        return originalSetTimeout(callback, delay);
    };

    // 如果播放逻辑是通过 JavaScript 的变量控制，可以尝试覆盖变量
    Object.defineProperty(window, "isTrialMode", {
        get: function() {
            return false; // 强制解除试播模式
        },
        set: function(value) {
            console.log("Attempt to set trial mode blocked.");
        }
    });

    // 检测音频播放 API 请求
    const originalFetch = window.fetch;
    window.fetch = async function(resource, init) {
        console.log("Intercepting fetch request:", resource);
        // 如果发现播放请求中存在 trial 参数，可以尝试修改
        if (typeof resource === "string" && resource.includes("trial=true")) {
            resource = resource.replace("trial=true", "trial=false");
        }
        return originalFetch(resource, init);
    };

    console.log("Yopu.co Unlock Script Loaded!");
})();