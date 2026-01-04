// ==UserScript==
// @name         MissAV Disable Auto Pause
// @namespace    coolrice.scripts
// @description  Stop MissAV pause video when page blur
// @version      0.2
// @author       CoolRice
// @match        https://missav.ws/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526783/MissAV%20Disable%20Auto%20Pause.user.js
// @updateURL https://update.greasyfork.org/scripts/526783/MissAV%20Disable%20Auto%20Pause.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // 备份原始的事件监听器方法
    const originalAddEventListener = document.addEventListener;
    const originalRemoveEventListener = document.removeEventListener;
    const originalWindowRemoveEventListener = window.removeEventListener;

    // 创建新的 addEventListener，屏蔽 visibilitychange 和 blur 事件
    document.addEventListener = function(event, callback, options) {
        if (event === 'visibilitychange' || event === 'blur') {
            // 直接不添加监听器，避免触发
            return;
        }
        else {
            originalAddEventListener.call(document, event, callback, options);
        }
    };

    // 创建新的 addEventListener，屏蔽 visibilitychange 和 blur 事件
    window.addEventListener = function(event, callback, options) {
        if (event === 'visibilitychange' || event === 'blur') {

            // 直接不添加监听器，避免触发
            return;
        }
        else {
            originalAddEventListener.call(window, event, callback, options);
        }
    };
})();