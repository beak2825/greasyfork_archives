// ==UserScript==
// @name         Touch Event Detection
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Detect touch events and output touch count
// @author       Your Name
// @match        *://*/*
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/496454/Touch%20Event%20Detection.user.js
// @updateURL https://update.greasyfork.org/scripts/496454/Touch%20Event%20Detection.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置信息
    const config = {
        hotkey: 'DoubleClickScreen' // 设置为你的配置项
    };

    const constants = {
        DoubleClickScreen: 'DoubleClickScreen' // 设置常量
    };

    let touchCount = 0;
    let touchTimer;

    document.body.addEventListener('touchstart', event => {
        if (config.hotkey !== constants.DoubleClickScreen) return;
        touchCount++; // 记录触摸次数
        if (touchCount === 1) { // 如果是第一次触摸，设置定时器
            touchTimer = setTimeout(() => touchCount = 0, 300);
        } else if (touchCount === 2) {
            clearTimeout(touchTimer); // 清除定时器
            console.log(`双击检测到，触摸次数: ${touchCount}`);
            console.log(event.touches[0].clientX, event.touches[0].clientY);
            touchCount = 0;
        }
    });
})();
