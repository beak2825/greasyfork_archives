// ==UserScript==
// @name         missav 防止自動暫停
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  直接覆寫 HTMLMediaElement.pause() 以阻止任何方式的自動暫停
// @match        *://missav.ai/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537133/missav%20%E9%98%B2%E6%AD%A2%E8%87%AA%E5%8B%95%E6%9A%AB%E5%81%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/537133/missav%20%E9%98%B2%E6%AD%A2%E8%87%AA%E5%8B%95%E6%9A%AB%E5%81%9C.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 儲存原始 pause 函式
    const originalPause = HTMLMediaElement.prototype.pause;

    // 覆寫 pause
    HTMLMediaElement.prototype.pause = function () {
        if (!document.hasFocus()) {
            console.log("[Tampermonkey] 阻止 video.pause() 觸發（失焦狀態）");
            return;
        }
        return originalPause.apply(this, arguments);
    };

    // 測試影片存在時是否被控制
    const logVideo = () => {
        const video = document.querySelector('video');
        if (video) {
            console.log('[Tampermonkey] 已偵測 video 元素:', video);
        } else {
            console.log('[Tampermonkey] 尚未找到 video 元素，將持續偵測...');
        }
    };

    const checkInterval = setInterval(() => {
        logVideo();
    }, 2000);

    setTimeout(() => clearInterval(checkInterval), 10000); // 最多觀察 10 秒
})();
