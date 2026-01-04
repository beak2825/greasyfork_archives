// ==UserScript==
// @name         快手网页版专用快捷键
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  视频快捷键控制，带音量反馈 -小键盘左右键跳跃时长 上下键声音调控 F全屏
// @author       jitian
// @match        *://*.kuaishou.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/525844/%E5%BF%AB%E6%89%8B%E7%BD%91%E9%A1%B5%E7%89%88%E4%B8%93%E7%94%A8%E5%BF%AB%E6%8D%B7%E9%94%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/525844/%E5%BF%AB%E6%89%8B%E7%BD%91%E9%A1%B5%E7%89%88%E4%B8%93%E7%94%A8%E5%BF%AB%E6%8D%B7%E9%94%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const skipForwardSeconds = 5;
    const skipBackwardSeconds = 5;
    const volumeStep = 0.05;

    const volumeFeedback = document.createElement('div');
    volumeFeedback.style.position = 'fixed';
    volumeFeedback.style.left = '50%';
    volumeFeedback.style.bottom = '60px';
    volumeFeedback.style.transform = 'translateX(-50%)';
    volumeFeedback.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    volumeFeedback.style.color = 'white';
    volumeFeedback.style.padding = '5px 10px';
    volumeFeedback.style.borderRadius = '5px';
    volumeFeedback.style.fontSize = '14px';
    volumeFeedback.style.display = 'none';
    volumeFeedback.style.zIndex = '9999';
    document.body.appendChild(volumeFeedback);

    window.addEventListener('keydown', function(event) {
        const video = document.querySelector('video');

        if (!video) return;

        if (event.key === "ArrowRight") {
            video.currentTime += skipForwardSeconds;
        }

        if (event.key === "ArrowLeft") {
            video.currentTime -= skipBackwardSeconds;
        }

        if (event.key === " ") {
            if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
        }

        if (event.key === "f" || event.key === "F") {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                video.requestFullscreen();
            }
        }

        if (event.key === "ArrowUp") {
            video.volume = Math.min(1, video.volume + volumeStep);
            showVolumeFeedback(video.volume);
        }

        if (event.key === "ArrowDown") {
            video.volume = Math.max(0, video.volume - volumeStep);
            showVolumeFeedback(video.volume);
        }
    });

    function showVolumeFeedback(volume) {
        const volumePercent = Math.round(volume * 100);
        volumeFeedback.textContent = `音量: ${volumePercent}%`;
        volumeFeedback.style.display = 'block';
        setTimeout(() => {
            volumeFeedback.style.display = 'none';
        }, 2000);
    }
})();
