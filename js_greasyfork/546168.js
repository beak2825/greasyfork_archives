// ==UserScript==
// @name         B站直播防画质降级
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  阻止B站直播页面因切换后台导致的画质降低
// @author       YourName
// @match        *://live.bilibili.com/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546168/B%E7%AB%99%E7%9B%B4%E6%92%AD%E9%98%B2%E7%94%BB%E8%B4%A8%E9%99%8D%E7%BA%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/546168/B%E7%AB%99%E7%9B%B4%E6%92%AD%E9%98%B2%E7%94%BB%E8%B4%A8%E9%99%8D%E7%BA%A7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 覆盖 document.hidden 属性，始终返回 false（页面未隐藏）
    Object.defineProperty(document, 'hidden', {
        get: () => false
    });

    // 阻止 visibilitychange 事件传播
    document.addEventListener('visibilitychange', e => {
        e.stopImmediatePropagation();
    }, true);

    // 移除已有 blur 监听并阻止新事件
    window.onblur = null;
    window.addEventListener('blur', e => {
        e.stopImmediatePropagation();
    }, true);

    // 可选：添加调试日志（控制台可见）
    console.log("[防画质降级] 脚本已生效！");
})();