// ==UserScript==
// @name         Auto Play Video
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically play videos on a specific page
// @match        https://elearning.tcsasac.com/#/home/myTrainingCourseList/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/497797/Auto%20Play%20Video.user.js
// @updateURL https://update.greasyfork.org/scripts/497797/Auto%20Play%20Video.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义视频列表元素的选择器
    const videoListSelector = 'div.ant-list-item';
    // 定义视频 URL 属性
    const videoUrlAttribute = 'data-video-url';

    // 检查页面 URL 是否匹配目标页面
    if (window.location.href.includes('/home/myTrainingCourseList/')) {
        // 获取视频列表元素
        const videoListItems = document.querySelectorAll(videoListSelector);

        // 遍历视频列表,为每个视频添加点击事件
        videoListItems.forEach(function(item) {
            item.addEventListener('click', function() {
                // 获取视频 URL
                const videoUrl = this.getAttribute(videoUrlAttribute);

                // 跳转到视频播放页面
                window.location.href = videoUrl;
            });
        });

        // 自动播放下一个未观看的视频
        playNextUnwatchedVideo();
    } else if (window.location.href.includes('/home/myTrainingDetail/')) {
        // 如果在视频播放页面
        // 定义视频元素的选择器
        const videoSelector = 'video';

        // 获取视频播放器元素
        const videoElement = document.querySelector(videoSelector);

        if (videoElement) {
            // 检查视频是否已经在播放
            if (videoElement.paused) {
                // 开始播放视频
                videoElement.play();
                console.log('Video started playing');
            }

            // 监听视频播放状态
            videoElement.addEventListener('timeupdate', function() {
                // 检查视频是否已播放完毕
                if (videoElement.currentTime >= videoElement.duration) {
                    console.log('Video finished playing');

                    // 记录已观看的视频
                    const currentVideoUrl = window.location.href;
                    addWatchedVideo(currentVideoUrl);

                    // 自动播放下一个未观看的视频
                    playNextUnwatchedVideo();
                }
            });
        } else {
            console.log('Video element not found on the page');
        }
    }

    function playNextUnwatchedVideo() {
        // 获取所有视频 URL
        const videoUrls = Array.from(document.querySelectorAll(videoListSelector))
            .map(item => item.getAttribute(videoUrlAttribute));

        // 获取已观看的视频 URL
        const watchedVideos = getWatchedVideos();

        // 找到第一个未观看的视频 URL
        const unwatchedVideoUrl = videoUrls.find(url => !watchedVideos.includes(url));

        if (unwatchedVideoUrl) {
            // 跳转到下一个未观看的视频
            window.location.href = unwatchedVideoUrl;
        } else {
            console.log('All videos have been watched.');
        }
    }

    function addWatchedVideo(videoUrl) {
        // 从本地存储中获取已观看的视频列表
        let watchedVideos = getWatchedVideos();

        // 添加新的已观看视频
        watchedVideos.push(videoUrl);

        // 将更新后的列表存回本地存储
        localStorage.setItem('watchedVideos', JSON.stringify(watchedVideos));
    }

    function getWatchedVideos() {
        // 从本地存储中获取已观看的视频列表
        const watchedVideos = JSON.parse(localStorage.getItem('watchedVideos')) || [];
        return watchedVideos;
    }
})();
