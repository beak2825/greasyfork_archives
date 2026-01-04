// ==UserScript==
// @license MIT
// @name         Auto Press Down Key for Changjiang Yuketang
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  每隔15秒模拟按下向下键，仅在长江雨课堂下执行
// @author       Your Name
// @match        https://changjiang.yuketang.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498059/Auto%20Press%20Down%20Key%20for%20Changjiang%20Yuketang.user.js
// @updateURL https://update.greasyfork.org/scripts/498059/Auto%20Press%20Down%20Key%20for%20Changjiang%20Yuketang.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义按键函数
    function pressDownKey() {
        // 创建按下向下键的事件
        const event = new KeyboardEvent('keydown', {
            key: 'ArrowDown',
            keyCode: 40,
            code: 'ArrowDown',
            which: 40,
            bubbles: true
        });
        // 触发事件
        document.dispatchEvent(event);
    }

    // 定义一个函数来设置下一个随机间隔时间
    function scheduleNextPress() {
        const minInterval = 15000; // 最小间隔时间15秒
        const maxInterval = 20000; // 最大间隔时间20秒
        const randomInterval = Math.floor(Math.random() * (maxInterval - minInterval + 1)) + minInterval;
        
        setTimeout(() => {
            pressDownKey();
            scheduleNextPress();
        }, randomInterval);
    }

    // 开始第一次调度
    scheduleNextPress();
})();

