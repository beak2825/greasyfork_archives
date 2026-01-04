// ==UserScript==
// @name         B站 & YouTube 仅激活标签播放并保持全屏
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  只允许当前标签页播放视频，其他全部暂停，并保持全屏状态
// @match        https://www.bilibili.com/video/*
// @match        https://www.youtube.com/watch*
// @grant        window.close
// @downloadURL https://update.greasyfork.org/scripts/543699/B%E7%AB%99%20%20YouTube%20%E4%BB%85%E6%BF%80%E6%B4%BB%E6%A0%87%E7%AD%BE%E6%92%AD%E6%94%BE%E5%B9%B6%E4%BF%9D%E6%8C%81%E5%85%A8%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/543699/B%E7%AB%99%20%20YouTube%20%E4%BB%85%E6%BF%80%E6%B4%BB%E6%A0%87%E7%AD%BE%E6%92%AD%E6%94%BE%E5%B9%B6%E4%BF%9D%E6%8C%81%E5%85%A8%E5%B1%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let wasFullscreen = false;

    // 检查当前标签是否全屏
    function checkFullscreen() {
        const video = document.querySelector('video');
        if (video && document.fullscreenElement) {
            wasFullscreen = true;
        } else {
            wasFullscreen = false;
        }
    }

    function setPlaybackState() {
        const video = document.querySelector('video');
        if (!video) return;

        if (document.visibilityState === 'visible') {
            if (video.paused) {
                console.log('标签页激活，恢复播放');
                video.play().catch(() => {});
                if (wasFullscreen) {
                    console.log('上一个视频全屏，设置为全屏');
                    video.requestFullscreen().catch(() => {});
                }
            }
        } else {
            if (!video.paused) {
                console.log('标签页非激活，暂停播放');
                video.pause();
            }
        }
    }

    function onVideoEnded() {
        console.log('视频播放完毕，关闭标签页');
        window.close();
        window.open('', '_self').close();
    }

    function setup() {
        const video = document.querySelector('video');
        if (video) {
            console.log('检测到视频元素');
            video.addEventListener('ended', onVideoEnded);
            document.addEventListener('visibilitychange', setPlaybackState);
            checkFullscreen();  // 检查是否全屏
            setPlaybackState(); // 初始化判断一次
        } else {
            setTimeout(setup, 1000);
        }
    }

    setup();
})();
