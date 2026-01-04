// ==UserScript==
// @name         视频控制：画面缩放、进度跳转、截图、14秒进退
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  提供缩放视频画面、进度跳转、视频截图等功能。
// @author       You
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478163/%E8%A7%86%E9%A2%91%E6%8E%A7%E5%88%B6%EF%BC%9A%E7%94%BB%E9%9D%A2%E7%BC%A9%E6%94%BE%E3%80%81%E8%BF%9B%E5%BA%A6%E8%B7%B3%E8%BD%AC%E3%80%81%E6%88%AA%E5%9B%BE%E3%80%8114%E7%A7%92%E8%BF%9B%E9%80%80.user.js
// @updateURL https://update.greasyfork.org/scripts/478163/%E8%A7%86%E9%A2%91%E6%8E%A7%E5%88%B6%EF%BC%9A%E7%94%BB%E9%9D%A2%E7%BC%A9%E6%94%BE%E3%80%81%E8%BF%9B%E5%BA%A6%E8%B7%B3%E8%BD%AC%E3%80%81%E6%88%AA%E5%9B%BE%E3%80%8114%E7%A7%92%E8%BF%9B%E9%80%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取所有视频元素
    let videos = document.getElementsByTagName('video');
    let currentScale = 1.0; // 初始缩放级别
    const scaleStep = 0.2;  // 定义缩放步长

    // 视频缩放功能：Alt + z 和 Alt + x 缩放，Alt + c 重置
    document.addEventListener('keydown', function(event) {
        const video = document.querySelector('video');
        if (!video) return; // 没有找到视频则退出

        // 缩放功能
        if (event.altKey) {
            if (event.key === 'z') {
                currentScale -= scaleStep;
            } else if (event.key === 'x') {
                currentScale += scaleStep;
            } else if (event.key === 'c') {
                currentScale = 1.0;
            }
            currentScale = Math.min(2.0, Math.max(0.25, currentScale));
            video.style.transform = 'scale(' + currentScale + ')';
            video.focus(); // 确保视频保持焦点
        }

        // 进度跳转功能：按数字键跳转视频进度
        const keyCode = event.keyCode || event.which;
        if (keyCode >= 48 && keyCode <= 57) {
            const percentage = (keyCode - 48) * 10;
            const targetTime = (percentage / 100) * video.duration;
            video.currentTime = targetTime;
        }

        // 前进和后退 14 秒功能：j 后退，l 前进（不在 YouTube 生效）
        if (!window.location.href.includes("youtube.com")) {
            switch (event.key) {
                case 'j':
                    video.currentTime -= 14;
                    break;
                case 'l':
                    video.currentTime += 14;
                    break;
            }
        }

        // 视频截图功能：按 ; 键截图
        if (event.key === ';' && !event.shiftKey && !event.ctrlKey && !event.altKey && !event.metaKey) {
            captureVideoScreenshot(video);
        }
    });

    // 自动聚焦播放中的视频
    for (let i = 0; i < videos.length; i++) {
        videos[i].setAttribute('tabindex', '-1');
        videos[i].addEventListener('play', function() {
            this.focus();
        });
    }

    // 截图功能函数
    function captureVideoScreenshot(video) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const currentDate = new Date();
        const dateStr = currentDate.toISOString().slice(0, 10);
        const timeStr = currentDate.toTimeString().split(' ')[0].replace(/:/g, '-');

        let filename = 'screenshot';
        const videoTitleElement = document.querySelector('title');
        if (videoTitleElement) {
            filename = videoTitleElement.textContent.trim();
        }
        filename += '_' + dateStr + '_' + timeStr + '.png';

        const screenshotDataUrl = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = screenshotDataUrl;
        a.download = filename;
        a.click();

        console.log('截图已保存。');
    }

})();
