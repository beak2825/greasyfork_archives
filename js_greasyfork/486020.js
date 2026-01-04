// ==UserScript==
// @name         bilibili 视频快进
// @namespace    https://github.com/shiquda/shiquda_UserScript
// @supportURL   https://github.com/shiquda/shiquda_UserScript/issues
// @version      0.1.0
// @description  把长按方向右键的倍速播放改为连续快进，类似于快退
// @author       shiquda
// @match        https://*.bilibili.com/video/*
// @grant        none
// @icon         https://experiments.sparanoid.net/favicons/v2/www.bilibili.com.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/486020/bilibili%20%E8%A7%86%E9%A2%91%E5%BF%AB%E8%BF%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/486020/bilibili%20%E8%A7%86%E9%A2%91%E5%BF%AB%E8%BF%9B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const interval = 200; // 每隔 200 ms 快进一次
    const fastForwardTime = 5; // 快进 5 秒

    // 获取视频元素
    let video = document.querySelector('video');

    let isLongPressing = false;
    let shouldFastForward = false;

    // 定义一个变量来存储定时器的ID
    let intervalId = null;

    // 监听键盘按下事件
    window.addEventListener('keydown', (event) => {
        // 判断是否是方向右键
        if (event.key === 'ArrowRight') {
            isLongPressing = true;
            shouldFastForward = true;
            // 如果没有定时器在运行，创建一个新的定时器
            if (intervalId === null) {
                intervalId = setInterval(() => {
                    if (shouldFastForward) {
                        video.currentTime += fastForwardTime;
                    } else {
                        clearInterval(intervalId);
                        intervalId = null;
                    }
                }, interval);
            }
        }
    });

    // 监听键盘松开事件
    window.addEventListener('keyup', (event) => {
        if (event.key === 'ArrowRight') {
            isLongPressing = false;
            shouldFastForward = false;
        }
    });
})();
