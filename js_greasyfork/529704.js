// ==UserScript==
// @name         B站鼠标滚轮调倍速-shuijiaowang
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  无需点击，鼠标悬停倍速区域时通过滚轮快速调整B站视频播放速度（0.1x-10x）
// @author       shuijiaowang
// @match        https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      MIT  // 这是新增的许可证声明
// @downloadURL https://update.greasyfork.org/scripts/529704/B%E7%AB%99%E9%BC%A0%E6%A0%87%E6%BB%9A%E8%BD%AE%E8%B0%83%E5%80%8D%E9%80%9F-shuijiaowang.user.js
// @updateURL https://update.greasyfork.org/scripts/529704/B%E7%AB%99%E9%BC%A0%E6%A0%87%E6%BB%9A%E8%BD%AE%E8%B0%83%E5%80%8D%E9%80%9F-shuijiaowang.meta.js
// ==/UserScript==
(function() {
    'use strict';
/*
 * B站(bilibili) 鼠标滚轮 倍速调节 调速 快捷键
 */
    let isHovering = false;
    const STEP = 0.1; // 每次滚动的倍率变化量
    const MIN_RATE = 0.25;
    const MAX_RATE = 10.0;
    let targetElement = null;
    let videoElement = null;

    // 定义命名函数以便移除监听器
    function handleMouseEnter() {
        isHovering = true;
    }

    function handleMouseLeave() {
        isHovering = false;
        if (videoElement) {
            videoElement.playbackRate = Number(videoElement.playbackRate.toFixed(2));
        }
    }

    function handleWheel(event) {
        if (!isHovering) return;
        event.preventDefault();

        // 计算滚动方向（向上滚动加速，向下滚动减速）
        const direction = event.deltaY > 0 ? -1 : 1;

        // 计算新倍率并限制范围
        let newRate = videoElement.playbackRate + (STEP * direction);
        newRate = Math.min(Math.max(newRate, MIN_RATE), MAX_RATE);

        // 应用新倍率
        videoElement.playbackRate = newRate;
    }

    function init() {
        // 移除旧的元素监听器
        if (targetElement) {
            targetElement.removeEventListener('mouseenter', handleMouseEnter);
            targetElement.removeEventListener('mouseleave', handleMouseLeave);
            targetElement.removeEventListener('wheel', handleWheel);
        }

        // 查询最新元素
        targetElement = document.querySelector('.bpx-player-ctrl-playbackrate');
        videoElement = document.querySelector('video');

        if (!targetElement || !videoElement) {
            setTimeout(init, 1000);
            return;
        }

        // 添加新的事件监听
        targetElement.addEventListener('mouseenter', handleMouseEnter);
        targetElement.addEventListener('mouseleave', handleMouseLeave);
        targetElement.addEventListener('wheel', handleWheel);
    }

    // 初始化并监听DOM变化
    init();
    new MutationObserver(init).observe(document.body, {
        childList: true,
        subtree: true
    });
})();