// ==UserScript==
// @name         哔哩哔哩自动全屏、点赞及倍速播放 
// @namespace    http://your.namespace.com
// @version      1.2
// @description  自动全屏并确保已点赞，倍速控制，快捷键V全屏，Q点赞/取消点赞
// @author       Your Name
// @license      MIT
// @match        *://www.bilibili.com/video/*
// @match        *://www.bilibili.com/list/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519253/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%87%AA%E5%8A%A8%E5%85%A8%E5%B1%8F%E3%80%81%E7%82%B9%E8%B5%9E%E5%8F%8A%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/519253/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%87%AA%E5%8A%A8%E5%85%A8%E5%B1%8F%E3%80%81%E7%82%B9%E8%B5%9E%E5%8F%8A%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 倍速控制相关变量
    var currentSpeedIndex = 3; // 初始倍速为1.0x
    var playbackSpeedStep = 0.25; // 每次增减的倍速值
    var speedInfo;

    // 创建倍速提示框
    function createSpeedInfo(videoElement) {
        speedInfo = document.createElement('div');
        speedInfo.style.position = 'absolute';
        speedInfo.style.top = '50%';
        speedInfo.style.left = '50%';
        speedInfo.style.transform = 'translate(-50%, -50%)';
        speedInfo.style.background = 'rgba(0, 0, 0, 0.7)';
        speedInfo.style.color = 'white';
        speedInfo.style.padding = '5px';
        speedInfo.style.borderRadius = '5px';
        speedInfo.style.zIndex = '9999';
        speedInfo.style.display = 'none'; // 初始隐藏提示框
        videoElement.parentElement.appendChild(speedInfo);
    }

    // 显示倍速提示框
    function showSpeedInfo() {
        speedInfo.style.display = 'block';
        setTimeout(function() {
            speedInfo.style.display = 'none';
        }, 2000); // 2秒后隐藏提示框
    }

    // 更新倍速和提示框内容
    function updateSpeedInfo(videoElement) {
        var newSpeed = 0.25 + currentSpeedIndex * playbackSpeedStep;
        if (newSpeed > 8.0) {
            newSpeed = 8.0; // 最大限制为8倍
        }
        videoElement.playbackRate = newSpeed.toFixed(2); // 保留两位小数
        speedInfo.textContent = newSpeed.toFixed(2) + 'x';
        showSpeedInfo();
    }

    // 触发网页全屏
    function triggerFullscreen() {
        const fullscreenButton = document.querySelector('.bpx-player-ctrl-web');
        if (fullscreenButton) {
            fullscreenButton.click();
            console.log('已自动全屏');
        }
    }

    // 触发点赞
    function triggerLike() {
        const likeButton = document.querySelector('.video-like');
        if (likeButton) {
            const isLiked = likeButton.classList.contains('on');
            if (!isLiked) {
                likeButton.click();
                showLikeNotification('点赞成功');
                console.log('已自动点赞');
            } else {
                showLikeNotification('已点赞过');
                console.log('视频已点赞，无需重复操作');
            }
        }
    }

    // 显示点赞/取消点赞提示框
    function showLikeNotification(message) {
        const videoPlayer = document.querySelector('.bpx-player-video-wrap');
        if (videoPlayer) {
            const notification = document.createElement('div');
            notification.textContent = message;
            notification.style.position = 'absolute';
            notification.style.top = '20px';
            notification.style.left = '50%';
            notification.style.transform = 'translateX(-50%)';
            notification.style.padding = '10px 20px';
            notification.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            notification.style.color = '#fff';
            notification.style.fontSize = '18px';
            notification.style.borderRadius = '5px';
            notification.style.zIndex = '9999';
            notification.style.pointerEvents = 'none';
            videoPlayer.appendChild(notification);
            setTimeout(() => {
                notification.remove();
            }, 2000); // 2秒后自动移除提示
        }
    }

    // 添加快捷键监听
    function addShortcuts(videoElement) {
        document.addEventListener('keydown', function(event) {
            // 判断是否在输入框内，如果在则不执行快捷键
            const activeElement = document.activeElement;
            if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') {
                return;
            }

            if ((event.key === 'v' || event.key === 'V') && !event.ctrlKey) {
                triggerFullscreen();
                console.log('通过快捷键V触发了全屏');
            }
            if ((event.key === 'q' || event.key === 'Q') && !event.ctrlKey) {
                triggerLike();
                console.log('通过快捷键Q触发了点赞/取消点赞');
            }
            if (event.key === '-' || event.key === '=') {
                currentSpeedIndex += (event.key === '-') ? -1 : 1;
                currentSpeedIndex = Math.max(0, Math.min(currentSpeedIndex, 32));
                updateSpeedInfo(videoElement);
            }
        }, false);
    }

    // 检查页面元素并执行全屏和点赞
    function checkAndTrigger() {
        const videoElement = document.querySelector('video');
        const fullscreenButton = document.querySelector('.bpx-player-ctrl-web');
        const likeButton = document.querySelector('.video-like');

        if (videoElement && fullscreenButton && likeButton) {
            createSpeedInfo(videoElement);
            triggerFullscreen();
            triggerLike();
            addShortcuts(videoElement);
            clearInterval(checkInterval); // 停止定时器
        }
    }

    // 每秒检查一次，直到发现所需的页面元素
    const checkInterval = setInterval(checkAndTrigger, 1000);

})();
