// ==UserScript==
// @name         Floating Play/Pause Button for Continuous Play
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Adds a floating button to toggle auto-play of videos continuously on Missav.com
// @author       You
// @match        https://missav.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/528280/Floating%20PlayPause%20Button%20for%20Continuous%20Play.user.js
// @updateURL https://update.greasyfork.org/scripts/528280/Floating%20PlayPause%20Button%20for%20Continuous%20Play.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let autoPlayInterval;

    // 创建一个悬浮按钮
    const button = document.createElement('button');
    button.id = 'video-control';
    button.style.position = 'fixed';
    button.style.top = '50%';
    button.style.left = '0';
    button.style.transform = 'translateY(-50%)';
    button.style.zIndex = '1000';
    button.style.padding = '15px 20px';
    button.style.fontSize = '16px';
    button.style.background = 'rgba(0,0,0,0.7)';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.textContent = '暂停'; // 默认显示为“暂停”
    document.body.appendChild(button);

    // 切换视频自动播放的函数
    function toggleAutoPlay() {
        const video = document.querySelector('video.player');
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
            button.textContent = '播放';
            if (video) {
                video.pause(); // 确保视频暂停
            }
        } else {
            if (video && video.paused) {
                video.play(); // 如果视频已暂停，则立即播放
            }
            autoPlayInterval = setInterval(function() {
                if (video && video.paused) {
                    video.play();
                }
            }, 1000);
            button.textContent = '暂停';
        }
    }

    // 为按钮设置点击事件
    button.addEventListener('click', toggleAutoPlay);

    // 默认启动自动播放
    toggleAutoPlay();
})();
