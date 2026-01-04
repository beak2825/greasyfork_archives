// ==UserScript==
// @name         （德诚）Auto Watch Video
// @namespace    http://your.namespace.com
// @version      0.1
// @description  Automatically watch videos with status "学习中" or "未学习", mute them, and set playback speed to 1.5x
// @author       Your Name
// @match        https://v3.dconline.net.cn/student.html
// @match        https://edu.wkw.net.cn/student.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492329/%EF%BC%88%E5%BE%B7%E8%AF%9A%EF%BC%89Auto%20Watch%20Video.user.js
// @updateURL https://update.greasyfork.org/scripts/492329/%EF%BC%88%E5%BE%B7%E8%AF%9A%EF%BC%89Auto%20Watch%20Video.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let playbackSpeedSet = false;

    function clickNextVideo() {
        const videos = document.querySelectorAll('.video-status');
        let foundUnwatched = false;
        for (let i = 0; i < videos.length; i++) {
            const video = videos[i];
            if (video.classList.contains('success')) {
                console.log('已学习视频处理逻辑');
                // 可以在这里添加对已学习视频的处理逻辑，比如标记为已完成
            } else if (video.textContent.trim() === '未学习' || video.textContent.trim() === '学习中') {
                video.click();
                setTimeout(clickConfirmButton, 1000); // 等待1秒后点击确定按钮
                setTimeout(clickPlayButton, 2000); // 再等待1秒后点击播放按钮
                setTimeout(setPlaybackSpeed, 3000, 1.2); // 等待2秒后设置播放速度为1.5倍
                foundUnwatched = true;
                break;
            }
        }

        if (!foundUnwatched) {
            // 检查是否有视频列表中的视频需要处理
            handleVideoList();
        }
    }

    function handleVideoList() {
        const videoItems = document.querySelectorAll('.video_list_warp .nav_menu');
        for (let i = 0; i < videoItems.length; i++) {
            const videoItem = videoItems[i];
            const statusIcon = videoItem.querySelector('.video_round');
            const status = statusIcon.getAttribute('title');
            if (status === '未学习' || status === '学习中') {
                videoItem.click();
                setTimeout(tryPlayVideo, 3000); // 等待3秒后尝试播放视频
                setTimeout(setPlaybackSpeed, 4000, 1.2); // 等待1秒后设置播放速度为1.5倍
                break;
            }
        }
    }

    function clickConfirmButton() {
        const confirmButton = document.querySelector('.el-button--default.el-button--small.el-button--primary');
        if (confirmButton) {
            confirmButton.click();
        }
    }

    function clickPlayButton() {
        const playButton = document.querySelector('[data-title="点击播放"]');
        if (playButton) {
            playButton.click();
            setTimeout(clickMuteButton, 1000); // 等待1秒后点击静音按钮
        }
    }

    function clickMuteButton() {
        const muteButton = document.querySelector('[data-title="点击静音"]');
        if (muteButton) {
            muteButton.click();
        }
    }

    function setPlaybackSpeed(speed) {
        const videoPlayer = document.querySelector('video');
        if (videoPlayer) {
            videoPlayer.playbackRate = speed;
            playbackSpeedSet = true;
        }
    }

    function tryPlayVideo() {
        const videoPlayer = document.querySelector('video');
        if (videoPlayer && !videoPlayer.paused) {
            console.log('视频已经开始播放');
        } else {
            console.log('视频尚未开始播放，重新尝试播放');
            clickPlayButton();
        }

        // 检查播放速度是否已设置，如果未设置，则再次设置
        if (!playbackSpeedSet) {
            setPlaybackSpeed(1.2);
        }
    }

    setInterval(clickNextVideo, 5000); // 每隔5秒检查一次是否有新视频
})();
