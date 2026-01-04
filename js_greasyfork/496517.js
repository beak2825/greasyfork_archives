// ==UserScript==
// @name         自动播放视频
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  自动在播放器上播放视频，将播放速度设置为1.25倍，并自动点击右侧边栏下的第一个标签页
// @author       You
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/496517/%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/496517/%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 函数：播放视频并设置播放速度为1.25倍
    function playVideoAndSetSpeed() {
        const video = document.querySelector('video');
        if (video) {
            video.play().then(() => {
                console.log('视频开始播放');
                setPlaybackSpeed();
                muteVideo(video);
            }).catch(err => {
                console.log('自动播放失败：', err.message);
                // 如果自动播放失败（可能由于浏览器策略），尝试手动点击播放按钮
                const playButton = document.querySelector('.vjs-big-play-button');
                if (playButton) {
                    playButton.click();
                }
                // 仍然尝试设置播放速度和静音
                setPlaybackSpeed();
                muteVideo(video);
            });
        } else {
            console.log('未找到视频元素');
        }
    }

    // 函数：设置播放速度为1.25倍
    function setPlaybackSpeed() {
        const speedButton = document.querySelector('.vjs-playback-rate');
        if (speedButton) {
            speedButton.click(); // 点击打开速度选择菜单
            setTimeout(() => {
                const speeds = document.querySelectorAll('.vjs-menu-item');
                speeds.forEach(speed => {
                    if (speed.textContent.includes('1.25x')) {
                        speed.click();
                        console.log('已设置播放速度为1.25倍');
                    }
                });
            }, 100); // 延时以确保菜单已展开
        } else {
            console.log('未找到播放速度控制按钮');
        }
    }

    // 函数：静音视频
    function muteVideo(video) {
        if (video) {
            video.muted = true;
            console.log('视频已静音');
        }
    }

    // 函数：定期点击右侧边栏下的第一个标签页
    function clickFirstTab() {
        const firstTab = document.querySelector('.right-sidebar ul.tabs > li:first-child');
        if (firstTab) {
            firstTab.click();
            console.log('已点击第一个标签页');
        } else {
            console.log('未找到第一个标签页');
        }
    }

    // 页面加载完毕时执行
    window.addEventListener('load', function() {
        setInterval(playVideoAndSetSpeed, 5000); // 延迟5秒执行，确保页面元素已加载
        setInterval(clickFirstTab, 5000); // 每5秒点击一次右侧边栏下的第一个标签页
    });
})();
