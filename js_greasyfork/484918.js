// ==UserScript==
// @name         bilibili记录观看进度
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  🔥🔥🔥推荐！ 网课经常忘记看到哪一集那个位置，此脚本完美解决此问题：到达网页页面后会有提示框确认，将跳转至退出时位置
// @author       cooper
// @match        https://*.bilibili.com/*
// @grant        none
// @icon chrome://favicon/http://www.bilibili.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/484918/bilibili%E8%AE%B0%E5%BD%95%E8%A7%82%E7%9C%8B%E8%BF%9B%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/484918/bilibili%E8%AE%B0%E5%BD%95%E8%A7%82%E7%9C%8B%E8%BF%9B%E5%BA%A6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const videoSelector = 'video';
    let videoElement;
    // localStorage.setItem("clean_cache", true);

    // 提取视频唯一标识符的函数
    function getVideoIdentifier() {
        // 假设URL结构是：https://www.bilibili.com/video/BV号
        const regex = /\/video\/(BV[\w]+)/;
        const match = window.location.href.match(regex);
        return match ? match[1] : null;
    }

    // 检测并保存视频进度和集数
    function saveProgressAndEpisode() {

        const videoIdentifier = getVideoIdentifier();
        if (!videoIdentifier) return; // 如果没有找到视频标识符，则不执行任何操作

        const savedProgressKey = `bilibili_video_progress_${videoIdentifier}`;
        const savedEpisodeKey = `bilibili_video_episode_${videoIdentifier}`;

        if (videoElement && localStorage.getItem("clean_cache") == "true") {
            const progress = videoElement.currentTime;
            const episode = window.location.href;
            localStorage.setItem(savedProgressKey, progress);
            localStorage.setItem(savedEpisodeKey, episode);
        }
    }


    // 检查并恢复进度和集数
    function checkAndRestoreProgressAndEpisode() {
        const videoIdentifier = getVideoIdentifier();
        if (!videoIdentifier) return; // 如果没有找到视频标识符，则不执行任何操作

        const savedProgressKey = `bilibili_video_progress_${videoIdentifier}`;
        const savedEpisodeKey = `bilibili_video_episode_${videoIdentifier}`;
        const savedProgress = localStorage.getItem(savedProgressKey);
        const savedEpisode = localStorage.getItem(savedEpisodeKey);

        if (savedEpisode && window.location.href.replace("/?", "?") !== savedEpisode.replace("/?", "?")) {
            console.log(savedEpisode)
            console.log(window.location.href.replace("/?", "?"))

            const confirmResume = confirm('检测到上次观看进度，是否继续？');
            if(confirmResume){
                localStorage.setItem("clean_cache", false);
                window.location.href = savedEpisode;


                if (savedProgress && videoElement) {
                    videoElement.currentTime = parseFloat(savedProgress);
                    localStorage.setItem("clean_cache", true);
                }
            }
            else{
                 localStorage.setItem("clean_cache", false);
            }
        }
    }

    // 监听视频元素的加载
    function setupVideoElement() {
        videoElement = document.querySelector(videoSelector);
        if (videoElement) {
            window.addEventListener('beforeunload', saveProgressAndEpisode);
            checkAndRestoreProgressAndEpisode();
        }
    }

    // 页面加载时设置视频元素
    window.addEventListener('load', setupVideoElement);
})();
