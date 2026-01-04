// ==UserScript==
// @name         自动选择横屏或竖屏播放
// @namespace    yournamespace
// @version      1.2.1
// @description  根据视频是横板还是竖版，在视频全屏时自动选择横屏播放或竖屏播放
// @match       *://m.bilibili.com/video/*
// @grant        none
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/469965/%E8%87%AA%E5%8A%A8%E9%80%89%E6%8B%A9%E6%A8%AA%E5%B1%8F%E6%88%96%E7%AB%96%E5%B1%8F%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/469965/%E8%87%AA%E5%8A%A8%E9%80%89%E6%8B%A9%E6%A8%AA%E5%B1%8F%E6%88%96%E7%AB%96%E5%B1%8F%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取视频元素
    const videoElement = document.querySelector('video');
console.log('i test fuck')
    // 监听视频全屏事件
    videoElement.addEventListener('fullscreenchange', handleFullscreenChange);

    function handleFullscreenChange(event) {
        event.preventDefault(); // 阻止浏览器默认的全屏操作
console.log('i test fuck2')
        // 根据视频是横板还是竖版，在视频全屏时执行你的逻辑
        if (document.fullscreenElement === videoElement) {
            // 视频进入全屏模式
            const aspectRatio = videoElement.videoWidth / videoElement.videoHeight;
console.log('i test fuck1')
            // 根据宽高比例判断是横板还是竖版视频
            if (aspectRatio > 1) {
                // 横板视频，选择横屏播放
                videoElement.requestFullscreen();
            } else if (aspectRatio < 1) {
                // 竖版视频，选择竖屏播放
                videoElement.style.transform = 'rotate(90deg)';
                videoElement.style.width = '100vh';
                videoElement.style.height = '100vw';
                videoElement.requestFullscreen();
            }
        } else {
console.log('i test fuck3')
            // 视频退出全屏模式
            videoElement.style.transform = 'none';
            videoElement.style.width = 'auto';
            videoElement.style.height = 'auto';
        }
    }
})();
