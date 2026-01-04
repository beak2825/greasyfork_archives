// ==UserScript==
// @name         视频播放速度控制
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @description  通过按c和z键来控制网页视频的播放速度，按x键恢复初始速度，并在调整时显示当前播放速度，新增数字1、2、3设置固定倍速
// @author       hsq
// @match        *://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/517635/%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E9%80%9F%E5%BA%A6%E6%8E%A7%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/517635/%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E9%80%9F%E5%BA%A6%E6%8E%A7%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let initialPlaybackRate = 1; // 初始播放速度

    // 创建提示框元素
    const speedInfoDiv = document.createElement('div');
    speedInfoDiv.style.position = 'fixed';
    speedInfoDiv.style.top = '10%';
    speedInfoDiv.style.left = '50%';
    speedInfoDiv.style.transform = 'translateX(-50%)';
    speedInfoDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    speedInfoDiv.style.color = 'white';
    speedInfoDiv.style.padding = '10px';
    speedInfoDiv.style.borderRadius = '5px';
    speedInfoDiv.style.fontSize = '16px';
    speedInfoDiv.style.zIndex = '999999';
    speedInfoDiv.innerText = '当前播放速度: 1x';
    document.body.appendChild(speedInfoDiv);
    speedInfoDiv.style.display = 'none'; 

    // 获取视频元素
    const video = document.querySelector('video');
    if (!video) return;

    // 检测全屏状态并调整提示框位置
    let isFullscreen = false;

    function onFullscreenChange() {
        isFullscreen = document.fullscreenElement !== null;
        if (isFullscreen) {
            speedInfoDiv.style.top = '10%';
        } else {
            speedInfoDiv.style.top = '10%';
        }
    }

    document.addEventListener('fullscreenchange', onFullscreenChange);

    // 监听键盘事件
    document.addEventListener('keydown', function(event) {
        // 按下c键，增加播放速度
        if (event.key === 'c') {
            video.playbackRate += 0.1;
            showSpeedInfo();
        }
        // 按下z键，减小播放速度
        if (event.key === 'z') {
            video.playbackRate -= 0.1;
            showSpeedInfo();
        }
        // 按下x键，恢复初始播放速度
        if (event.key === 'x') {
            video.playbackRate = initialPlaybackRate;
            showSpeedInfo();
        }
        // 按下数字键1，设置播放速度为1倍
        if (event.key === '1') {
            video.playbackRate = 1;
            showSpeedInfo();
        }
        // 按下数字键2，设置播放速度为2倍
        if (event.key === '2') {
            video.playbackRate = 2;
            showSpeedInfo();
        }
        // 按下数字键3，设置播放速度为3倍
        if (event.key === '3') {
            video.playbackRate = 3;
            showSpeedInfo();
        }
    });

    // 显示播放速度提示框
    function showSpeedInfo() {
        speedInfoDiv.innerText = '当前播放速度: ' + video.playbackRate.toFixed(1) + 'x';
        speedInfoDiv.style.display = 'block'; // 显示提示框

        // 1.5秒后隐藏提示框
        setTimeout(function() {
            speedInfoDiv.style.display = 'none';
        }, 1500); // 提示框在1.5秒后消失
    }
})();
