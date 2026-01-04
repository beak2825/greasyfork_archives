// ==UserScript==
// @name         自动播放视频课程
// @namespace    http://tampermonkey.net/
// @version      6.0
// @description  自动播放视频,并在一个视频结束后随机播放下一个
// @match        https://zppx.91huayi.com/exercise/ExerciseCourse/CoursePlay*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503651/%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E8%A7%86%E9%A2%91%E8%AF%BE%E7%A8%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/503651/%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E8%A7%86%E9%A2%91%E8%AF%BE%E7%A8%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面加载完成
    window.addEventListener('load', function() {
        // 获取视频元素
        const video = document.querySelector('video');
        if (!video) return;

        // 自动开始播放
        video.play();

        // 监听视频结束事件
        video.addEventListener('ended', playNextRandomVideo);
    });

    function playNextRandomVideo() {
        // 获取所有视频列表项
        const videoItems = document.querySelectorAll('.listItem');
        if (videoItems.length === 0) return;

        // 随机选择一个视频
        const randomIndex = Math.floor(Math.random() * videoItems.length);
        const randomVideo = videoItems[randomIndex];

        // 模拟点击选中的视频
        const clickEvent = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true
        });
        randomVideo.querySelector('.text').dispatchEvent(clickEvent);
    }
})();