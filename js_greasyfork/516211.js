// ==UserScript==
// @name         B站全屏显示时间并固定进度条
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  在B站视频播放器中显示播放时间、总时间和剩余时间，并固定显示进度条，显示当前倍速下的预计剩余播放时间
// @match        *://*.bilibili.com/video/*
// @grant        none
// @license Proprietary
// @developer    PassionYoungz
// @downloadURL https://update.greasyfork.org/scripts/516211/B%E7%AB%99%E5%85%A8%E5%B1%8F%E6%98%BE%E7%A4%BA%E6%97%B6%E9%97%B4%E5%B9%B6%E5%9B%BA%E5%AE%9A%E8%BF%9B%E5%BA%A6%E6%9D%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/516211/B%E7%AB%99%E5%85%A8%E5%B1%8F%E6%98%BE%E7%A4%BA%E6%97%B6%E9%97%B4%E5%B9%B6%E5%9B%BA%E5%AE%9A%E8%BF%9B%E5%BA%A6%E6%9D%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 显示时间的功能
    const timeDisplay = document.createElement('div');
    timeDisplay.style.position = 'absolute';
    timeDisplay.style.bottom = '10px';
    timeDisplay.style.right = '10px';
    timeDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    timeDisplay.style.color = 'white';
    timeDisplay.style.padding = '5px 10px';
    timeDisplay.style.fontSize = '14px';
    timeDisplay.style.zIndex = '9999';
    timeDisplay.style.pointerEvents = 'none';
    timeDisplay.style.userSelect = 'none';

    function addTimeDisplayToPlayer() {
        const player = document.querySelector('.bpx-player-video-area');
        if (player && !player.contains(timeDisplay)) {
            player.appendChild(timeDisplay);
        }
    }

    function updateTime() {
        const currentTime = document.querySelector('.bpx-player-ctrl-time-current');
        const totalTime = document.querySelector('.bpx-player-ctrl-time-duration');
        const videoElement = document.querySelector('video');

        if (currentTime && totalTime && videoElement) {
            const [currentMinutes, currentSeconds] = currentTime.textContent.split(':').map(Number);
            const [totalMinutes, totalSeconds] = totalTime.textContent.split(':').map(Number);
            const currentTotalSeconds = currentMinutes * 60 + currentSeconds;
            const totalTotalSeconds = totalMinutes * 60 + totalSeconds;
            const remainingSeconds = totalTotalSeconds - currentTotalSeconds;

            // 计算剩余时间
            const remainingMinutes = Math.floor(remainingSeconds / 60);
            const remainingDisplaySeconds = remainingSeconds % 60;

            // 获取实际播放倍速
            const speed = videoElement.playbackRate;

            // 计算预计剩余播放时间（在当前倍速下）
            const estimatedRemainingSeconds = remainingSeconds / speed;
            const estimatedRemainingMinutes = Math.floor(estimatedRemainingSeconds / 60);
            const estimatedRemainingDisplaySeconds = Math.floor(estimatedRemainingSeconds % 60);

            // 显示当前时间、总时间、剩余时间和预计剩余播放时间
            timeDisplay.textContent = `播放时间: ${currentTime.textContent} / 总时间: ${totalTime.textContent} / 剩余时间: ${remainingMinutes}:${remainingDisplaySeconds.toString().padStart(2, '0')} / 预计剩余时间: ${estimatedRemainingMinutes}:${estimatedRemainingDisplaySeconds.toString().padStart(2, '0')}`;
        }
    }

    const observer = new MutationObserver(() => {
        addTimeDisplayToPlayer();
        updateTime();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    setInterval(updateTime, 1000);

    // 固定进度条的功能
    function enableModification(control_top) {
        control_top.setAttribute("style", "opacity: 1; visibility: visible; bottom: -6px; padding: 0px;");
    }

    function disableModification(control_top) {
        control_top.removeAttribute("style");
    }

    window.onload = function(){
        const controlEntity = document.querySelector(".bpx-player-control-entity");
        const controlTop = document.querySelector(".bpx-player-control-top");

        if (controlEntity.getAttribute("data-shadow-show") === "true") {
            enableModification(controlTop);
        }

        let id = setInterval(() => {
            if (document.querySelector(".bpx-player-shadow-progress-area") !== null) {
                document.querySelector(".bpx-player-shadow-progress-area").setAttribute("style", "opacity: 0; visibility: hidden");
                clearInterval(id);
            }
        }, 500);

        const observerConfig = { attributes: true, attributeName: "data-shadow-show", attributeOldValue: true };
        const observerCallback = function(mutationsList) {
            for(let mutation of mutationsList) {
                if (mutation.type === "attributes") {
                    if (controlEntity.getAttribute("data-shadow-show") === "true") {
                        enableModification(controlTop);
                    } else {
                        disableModification(controlTop);
                    }
                }
            }
        };
        const controllerObserver = new MutationObserver(observerCallback);
        controllerObserver.observe(controlEntity, observerConfig);
    }
})();
