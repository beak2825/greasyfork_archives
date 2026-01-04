// ==UserScript==
// @name         视频自动播放（我不是大王）
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  倍速 播放
// @author       我不是大王
// @match        *://study.neutech.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498423/%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%EF%BC%88%E6%88%91%E4%B8%8D%E6%98%AF%E5%A4%A7%E7%8E%8B%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/498423/%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%EF%BC%88%E6%88%91%E4%B8%8D%E6%98%AF%E5%A4%A7%E7%8E%8B%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建速度控制面板
    const speedControlPanel = document.createElement('div');
    speedControlPanel.innerHTML = `
        <label for="speed">Speed:</label>
        <select id="speed">
            <option value="0.25">0.25x</option>
            <option value="0.5">0.5x</option>
            <option value="1" selected>1x</option>
            <option value="1.5">1.5x</option>
            <option value="2">2x</option>
            <option value="2.5">2.5x</option>
            <option value="3">3x</option>
            <option value="3.5">3.5x</option>
            <option value="4">4x</option>
            <option value="4.5">4.5x</option>
            <option value="5">5x</option>
            <option value="5.5">5.5x</option>
            <option value="6">6x</option>
            <option value="6.5">6.5x</option>
            <option value="7">7x</option>
            <option value="7.5">7.5x</option>
            <option value="8">8x</option>
        </select>
        <button id="startButton">Start</button>
    `;
    speedControlPanel.style.position = 'fixed';
    speedControlPanel.style.bottom = '40px';
    speedControlPanel.style.right = '40px';
    speedControlPanel.style.background = 'LightSkyBlue';
    speedControlPanel.style.padding = '30px';
    speedControlPanel.style.border = '1px solid #B0C4DE';
    speedControlPanel.style.zIndex = '9999';
    document.body.appendChild(speedControlPanel);

    // 等待页面元素加载完成
    function waitForElement(selector, callback) {
        const element = document.querySelector(selector);
        if (element) {
            callback(element);
        } else {
            setTimeout(() => waitForElement(selector, callback), 500);
        }
    }

    // 自动播放视频
    function autoPlayVideo(video) {
        if (video) {
            video.playbackRate = parseFloat(document.getElementById('speed').value);
            video.play().then(() => {
                console.log('视频自动播放');
            }).catch((error) => {
                console.log('视频自动播放失败:', error);
                video.muted = true;
                video.play().then(() => {
                    console.log('静音视频自动播放');
                }).catch((error) => {
                    console.log('静音视频自动播放仍然失败:', error);
                });
            });
        } else {
            console.log('未找到视频元素');
        }
    }

    // 视频播放结束处理
    function handleVideoEnd() {
        console.log('视频播放结束');

        waitForElement('.netxsection.goNextOne', function(nextButton) {
            console.log('找到下一节按钮');
            nextButton.click();
        });
    }

    // 监听新视频元素并自动播放
    function observeNewVideo() {
        waitForElement('#dPlayerVideoMain', function(newVideo) {
            console.log('找到新的视频元素');
            autoPlayVideo(newVideo);
            newVideo.addEventListener('ended', handleVideoEnd);
        });
    }

    // 点击按钮开始播放视频
    document.getElementById('startButton').addEventListener('click', function() {
        waitForElement('#dPlayerVideoMain', function(video) {
            console.log('视频元素已找到');
            autoPlayVideo(video);
            video.addEventListener('ended', handleVideoEnd);

            // 使用 MutationObserver 监控页面变化
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.addedNodes.length) {
                        observeNewVideo();
                    }
                });
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    });

    // 添加倍速功能
    document.getElementById('speed').addEventListener('change', function() {
        const video = document.querySelector('video');
        if (video) {
            video.playbackRate = parseFloat(this.value);
            console.log('当前倍速:', video.playbackRate);
        }
    });
})();
