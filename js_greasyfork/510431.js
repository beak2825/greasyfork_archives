// ==UserScript==
// @name         Douyin Live Clock
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Add Beijing time clock to Douyin live streams in fullscreen mode
// @author       Your Name
// @match        https://live.douyin.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/510431/Douyin%20Live%20Clock.user.js
// @updateURL https://update.greasyfork.org/scripts/510431/Douyin%20Live%20Clock.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let clock = null;

    function createClock() {
        clock = document.createElement('div');
        clock.style.position = 'fixed';
        clock.style.bottom = '130px'; // 提高120像素
        clock.style.right = '10px';
        clock.style.color = 'white';
        clock.style.textShadow = '0 0 5px white'; // 白色描边效果
        clock.style.fontSize = '24px';
        clock.style.fontFamily = '微软雅黑'; // 字体设置为微软雅黑
        clock.style.zIndex = '1000';
        clock.style.userSelect = 'none'; // 让文字不可被选中
        document.body.appendChild(clock);
    }

    function updateClock() {
        const now = new Date();
        const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000); // 转为UTC时间
        const beijingTime = new Date(utcTime + (8 * 60 * 60 * 1000)); // 北京时间
        const hours = String(beijingTime.getHours()).padStart(2, '0');
        const minutes = String(beijingTime.getMinutes()).padStart(2, '0');
        clock.textContent = `${hours}:${minutes}`;
    }

    function toggleClock() {
        if (document.fullscreenElement) {
            if (!clock) {
                createClock();
                setInterval(updateClock, 1000);
                updateClock(); // 初始化时钟
            }
        } else {
            if (clock) {
                document.body.removeChild(clock);
                clock = null;
            }
        }
    }

    document.addEventListener('fullscreenchange', toggleClock);
    toggleClock(); // 初始化时钟显示状态
})();
