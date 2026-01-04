// ==UserScript==
// @name         视频倍速调节（Alt上下键加速减速）
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  使用Alt组合键调节网页视频倍速，并显示当前倍速
// @author       AI助手
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/519517/%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%E8%B0%83%E8%8A%82%EF%BC%88Alt%E4%B8%8A%E4%B8%8B%E9%94%AE%E5%8A%A0%E9%80%9F%E5%87%8F%E9%80%9F%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/519517/%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%E8%B0%83%E8%8A%82%EF%BC%88Alt%E4%B8%8A%E4%B8%8B%E9%94%AE%E5%8A%A0%E9%80%9F%E5%87%8F%E9%80%9F%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 最大和最小倍速
    const MAX_SPEED = 10.0;
    const MIN_SPEED = 0.1;
    const STEP = 0.1; // 每次调节的倍速
    let currentSpeed = 1.0; // 初始倍速

    // 创建控制面板
    const controlPanel = document.createElement('div');
    controlPanel.style.position = 'fixed';
    controlPanel.style.bottom = '10px';
    controlPanel.style.left = '10px';
    controlPanel.style.width = '120px';
    controlPanel.style.height = '100px';
    controlPanel.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    controlPanel.style.color = 'white';
    controlPanel.style.padding = '10px';
    controlPanel.style.borderRadius = '10px';
    controlPanel.style.zIndex = '10000';
    controlPanel.style.fontSize = '12px';
    controlPanel.style.display = 'flex';
    controlPanel.style.flexDirection = 'column';
    controlPanel.style.alignItems = 'center';
    controlPanel.style.justifyContent = 'space-between';

    // 创建显示当前倍速的区域
    const speedDisplay = document.createElement('div');
    speedDisplay.style.fontSize = '16px';
    speedDisplay.style.fontWeight = 'bold';
    speedDisplay.innerText = `倍速: ${currentSpeed.toFixed(1)}x`;
    controlPanel.appendChild(speedDisplay);

    // 创建向上按钮
    const upButton = document.createElement('button');
    upButton.innerText = '⬆️';
    upButton.style.width = '40px';
    upButton.style.height = '40px';
    upButton.style.fontSize = '14px';
    upButton.style.marginBottom = '5px';
    controlPanel.appendChild(upButton);

    // 创建向下按钮
    const downButton = document.createElement('button');
    downButton.innerText = '⬇️';
    downButton.style.width = '40px';
    downButton.style.height = '40px';
    downButton.style.fontSize = '14px';
    controlPanel.appendChild(downButton);

    document.body.appendChild(controlPanel);

    // 获取页面上的所有视频
    function getVideos() {
        return Array.from(document.querySelectorAll('video'));
    }

    // 更新所有视频的倍速
    function updateSpeed(change) {
        const videos = getVideos();
        currentSpeed = Math.min(MAX_SPEED, Math.max(MIN_SPEED, currentSpeed + change));
        videos.forEach((video) => {
            video.playbackRate = currentSpeed;
        });
        speedDisplay.innerText = `倍速: ${currentSpeed.toFixed(1)}x`;
    }

    // 按键事件
    document.addEventListener('keydown', (event) => {
        if (event.altKey) { // 检测 Alt 键是否按下
            if (event.key === 'ArrowUp') { // Alt + ↑ 加速
                updateSpeed(STEP);
            } else if (event.key === 'ArrowDown') { // Alt + ↓ 减速
                updateSpeed(-STEP);
            }
        }
    });

    // 点击按钮事件
    upButton.addEventListener('click', () => updateSpeed(STEP));
    downButton.addEventListener('click', () => updateSpeed(-STEP));
})();
