// ==UserScript==
// @name         XJTU美育平台视频加速器
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  xjtu美育平台视频加速器，支持倍速选择（最高支持16倍速），后台播放，自动连播，解放你的时间！
// @author       JL
// @match        https://vpahw.xjtu.edu.cn/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xjtu.edu.cn
// @grant        none
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/481207/XJTU%E7%BE%8E%E8%82%B2%E5%B9%B3%E5%8F%B0%E8%A7%86%E9%A2%91%E5%8A%A0%E9%80%9F%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/481207/XJTU%E7%BE%8E%E8%82%B2%E5%B9%B3%E5%8F%B0%E8%A7%86%E9%A2%91%E5%8A%A0%E9%80%9F%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var globalVideoIndex = 0;
    function ensureVideoPlays() {
        let video = document.querySelector('video');
        if (video && video.paused) {
            if (document.visibilityState !== 'visible'){
                if(video.ended)autoPlayNextVideo();
                else video.play();
            }
        }
    }
    function muteAllMedia() {
        const mediaElements = document.querySelectorAll('audio, video');
        mediaElements.forEach(media => {
            media.muted = true;
        });
    }

    // 页面加载时执行静音操作
    window.addEventListener('load', muteAllMedia);

    // 可以根据需要重复执行静音操作，以确保动态加载的媒体也被静音
    setInterval(muteAllMedia, 1000);
    function checkVideoStatus() {
        if (globalVideoIndex === -1) {
            // 当所有视频都已播放时执行的操作
            let video = document.querySelector('video');
            if (video) {
             //   video.pause();
                // 可以在这里添加其他所需的操作，例如关闭标签页等
                setTimeout(() => {
                    let newVideo = document.querySelector('video');
                    newVideo.muted = true;
                    newVideo.pause();
                }, 750);
            }
        }
    }
    function setVideoSpeed(speed) {
        let video = document.querySelector('video');
        if (video && !isNaN(speed) && isFinite(speed)) {
            video.playbackRate = speed;
        }
    }
    function findNextVideoIndex(videos) {
        for (let i = 0; i < videos.length; i++) {
            if (!videos[i].querySelector('.anticon-check-circle')) {
                return i;
            }
        }
        return -1; // 如果所有视频都已播放，返回 -1
    }
    function autoPlayNextVideo() {
        // 移除之前所有视频的 'ended' 事件监听器
        document.querySelectorAll('video').forEach(v => v.removeEventListener('ended', autoPlayNextVideo));
        let video = document.querySelector('video');
        if (video) {
            video.addEventListener('ended', function() {
                // 延迟一段时间后再寻找下一个视频
                setTimeout(() => {
                    let videos = document.querySelectorAll('ul.list-none li');
                    let nextVideoIndex = findNextVideoIndex(videos);
                    if (nextVideoIndex !== -1 && nextVideoIndex < videos.length) {
                        videos[nextVideoIndex].click();
                        setTimeout(() => {
                            setVideoSpeed(16); // 为新视频设置速度
                            let newVideo = document.querySelector('video');
                            newVideo.muted = true;
                            autoPlayNextVideo();
                        }, 750);
                    }else {
                    // 所有视频都已播放或达到列表末尾
                        globalVideoIndex = -1;
                        checkVideoStatus();
                    }
                }, 750); // 延迟时间根据实际情况调整
            });
        }
    }
    function createSpeedControlPanel() {
        let controlPanel = document.createElement('div');
        controlPanel.style.position = 'fixed';
        controlPanel.style.bottom = '10px';
        controlPanel.style.right = '10px';
        controlPanel.style.backgroundColor = 'white';
        controlPanel.style.padding = '10px';
        controlPanel.style.zIndex = '1000';
        controlPanel.style.border = '1px solid black';

        let speedInput = document.createElement('input');
        speedInput.type = 'number';
        speedInput.value = '16';
        speedInput.style.marginRight = '5px';

        let setSpeedButton = document.createElement('button');
        setSpeedButton.textContent = 'Set Speed';
        setSpeedButton.onclick = function() {
            setVideoSpeed(parseFloat(speedInput.value));
        };

        controlPanel.appendChild(speedInput);
        controlPanel.appendChild(setSpeedButton);
        document.body.appendChild(controlPanel);
    }

    function initializeVideoPlayer() {
        let video = document.querySelector('video');
        let muteButton = document.querySelector('.ck-bar-btn.ck-btn-muted');
        if (video) {
            if (muteButton) {
                var clickEvent = new MouseEvent("click", {
                    "view": window,
                    "bubbles": true,
                    "cancelable": false
                });
                muteButton.dispatchEvent(clickEvent);
            }
            video.playbackRate = 16;
            video.play();
            createSpeedControlPanel();
            autoPlayNextVideo();
        } else {
            setTimeout(initializeVideoPlayer, 1000);
        }
    }
    function initializeButton() {
        let button = document.createElement('button');
        button.textContent = '开始播放';
        button.style.position = 'absolute';
        button.style.top = '50%';
        button.style.left = '50%';
        button.style.transform = 'translate(-50%, -50%)';
        button.style.padding = '10px 20px';
        button.style.fontSize = '1.5em';
        button.style.color = 'white';
        button.style.backgroundColor = '#007bff';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.zIndex = '1000';
        button.addEventListener('click', function() {
            initializeVideoPlayer();
            button.style.display = 'none';
        });
        document.body.appendChild(button);
    }
    initializeButton();
    autoPlayNextVideo();
    setInterval(ensureVideoPlays, 1000); // 每1000毫秒检查一次
})();