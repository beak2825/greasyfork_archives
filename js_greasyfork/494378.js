// ==UserScript==
// @name         保持屏幕常亮：唤醒锁定
// @namespace    https://viayoo.com/
// @version      0.2
// @description  根据Wake Lock API的唤醒功能来保持屏幕常亮
// @author       You
// @run-at       document-idle
// @match        https://*/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/494378/%E4%BF%9D%E6%8C%81%E5%B1%8F%E5%B9%95%E5%B8%B8%E4%BA%AE%EF%BC%9A%E5%94%A4%E9%86%92%E9%94%81%E5%AE%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/494378/%E4%BF%9D%E6%8C%81%E5%B1%8F%E5%B9%95%E5%B8%B8%E4%BA%AE%EF%BC%9A%E5%94%A4%E9%86%92%E9%94%81%E5%AE%9A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 用于存储唤醒锁定
    let wakeLock = null;

    // 异步函数，用于请求唤醒锁定
    const requestWakeLock = async () => {
        if (!('wakeLock' in navigator)) {
            console.error('当前浏览器不支持Wake Lock API');
            return;
        }
        try {
            // 请求屏幕唤醒锁定
            wakeLock = await navigator.wakeLock.request("screen");
            console.log('唤醒锁定成功');
        } catch (err) {
            console.error(`唤醒锁定请求失败：${err.name}, ${err.message}`);
        }
    };

    // 页面加载时自动请求唤醒锁定
    requestWakeLock();
})();