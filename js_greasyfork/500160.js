// ==UserScript==
// @name         Disable YouTube Autoplay
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  禁用 YouTube 页面的自动播放，包括广告跳过后的情况，并在页面加载后的3秒内停止自动暂停操作
// @author       GPT-4o（Berry Blue Prompted)
// @license      MIT
// @match        *://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/500160/Disable%20YouTube%20Autoplay.user.js
// @updateURL https://update.greasyfork.org/scripts/500160/Disable%20YouTube%20Autoplay.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 暂停视频播放的函数
    function pauseVideo() {
        var video = document.querySelector('video');
        if (video && !video.paused) {
            video.pause();
        }
    }

    // 等待页面加载完成
    window.addEventListener('load', function() {
        // 初次暂停视频播放
        pauseVideo();

        // 观察视频元素的变化，确保视频不会自动播放
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
                    pauseVideo();
                }
            });
        });

        // 开始观察
        var video = document.querySelector('video');
        if (video) {
            observer.observe(video, {
                attributes: true
            });
        }

        // 定时检查视频状态
        var intervalId = setInterval(pauseVideo, 100);

        // 在3秒后停止定时检查
        setTimeout(function() {
            clearInterval(intervalId);
        }, 3000);
    });

})();
