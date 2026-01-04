// ==UserScript==
// @name         B站视频拖动控制
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  在B站视频全页面的任意位置按住鼠标左键，左右拖动即可拖动视频的进度条。
// @author       lhr
// @match        https://www.bilibili.com/video/*
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/535670/B%E7%AB%99%E8%A7%86%E9%A2%91%E6%8B%96%E5%8A%A8%E6%8E%A7%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/535670/B%E7%AB%99%E8%A7%86%E9%A2%91%E6%8B%96%E5%8A%A8%E6%8E%A7%E5%88%B6.meta.js
// ==/UserScript==
/*
 * Your Script Name - Script description
 * Copyright (C) 2023 Your Name
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
(function() {
    'use strict';

    // 创建显示进度信息的元素
    const progressInfo = document.createElement('div');
    progressInfo.style.position = 'fixed';
    progressInfo.style.bottom = '20px';
    progressInfo.style.right = '20px';
    progressInfo.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    progressInfo.style.color = 'white';
    progressInfo.style.padding = '10px';
    progressInfo.style.borderRadius = '5px';
    progressInfo.style.zIndex = '9999';
    progressInfo.style.fontFamily = 'Arial, sans-serif';
    progressInfo.style.userSelect = 'none';
    document.body.appendChild(progressInfo);

    // 创建拖动指示器
    const dragIndicator = document.createElement('div');
    dragIndicator.style.position = 'fixed';
    dragIndicator.style.width = '0';
    dragIndicator.style.height = '0';
    dragIndicator.style.backgroundColor = 'rgba(0, 161, 214, 0.5)';
    dragIndicator.style.borderRadius = '50%';
    dragIndicator.style.zIndex = '9998';
    dragIndicator.style.pointerEvents = 'none';
    dragIndicator.style.transition = 'width 0.2s, height 0.2s';
    document.body.appendChild(dragIndicator);

    let video = null;
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let startTime = 0;
    let baseSensitivity = 1; // 基础灵敏度（针对默认窗口大小）
    let currentSensitivity = baseSensitivity;
    let wasPlaying = false;
    let hasMoved = false;
    let defaultVideoWidth = 0; // 默认窗口大小（将根据首次检测到的视频大小设置）

    // 初始化视频元素
    function initVideo() {
        video = document.querySelector('video');
        if (video) {
            // 设置默认窗口大小（只在第一次初始化时设置）
            if (defaultVideoWidth === 0) {
                defaultVideoWidth = video.offsetWidth;
                console.log('默认视频宽度设置为:', defaultVideoWidth);
            }

            updateSensitivity(); // 初始化灵敏度
            video.addEventListener('timeupdate', updateProgressInfo);
            updateProgressInfo();

            // 阻止视频元素的所有鼠标默认行为
            video.addEventListener('mousedown', handleVideoMouseDown, { capture: true });
            video.addEventListener('click', handleVideoClick, { capture: true });

            // 找到B站的播放器容器
            const playerWrap = document.querySelector('.bpx-player-video-wrap, .bilibili-player-video');
            if (playerWrap) {
                playerWrap.addEventListener('mousedown', handleVideoMouseDown, { capture: true });
                playerWrap.addEventListener('click', handleVideoClick, { capture: true });

                // 监听窗口大小变化
                const resizeObserver = new ResizeObserver(() => {
                    updateSensitivity();
                });
                resizeObserver.observe(playerWrap);
            }
        } else {
            setTimeout(initVideo, 500);
        }
    }

    // 根据当前视频窗口大小更新灵敏度
    function updateSensitivity() {
        if (!video) return;

        const currentWidth = video.offsetWidth;
        if (defaultVideoWidth > 0 && currentWidth > 0) {
            // 灵敏度与窗口大小成反比（窗口越大，灵敏度越低）
            currentSensitivity = baseSensitivity * (defaultVideoWidth / currentWidth);
            console.log(`更新灵敏度: 窗口宽度 ${currentWidth}px, 灵敏度 ${currentSensitivity.toFixed(2)}`);
        }
    }

    function handleVideoMouseDown(e) {
        if (e.button === 0) { // 只处理左键
            e.stopImmediatePropagation();
            e.preventDefault();
            startDrag(e);
        }
    }

    function handleVideoClick(e) {
        if (e.button === 0) {
            e.stopImmediatePropagation();
            e.preventDefault();
        }
    }

    // 更新进度信息
    function updateProgressInfo() {
        try {
            if (!video || isDragging) return;

            const currentTime = video.currentTime;
            const duration = video.duration;
            const progressPercent = (currentTime / duration * 100).toFixed(2);

            progressInfo.innerHTML = `
                <div>当前时间: ${formatTime(currentTime)}</div>
                <div>总时长: ${formatTime(duration)}</div>
                <div>进度: ${progressPercent}%</div>
                <div>剩余时间: ${formatTime(duration - currentTime)}</div>
                <div style="font-size:12px;color:#ccc;">在任意位置按住鼠标左右拖动可调整进度</div>
                <div style="font-size:12px;color:#ccc;">单击暂停/播放</div>
                <div style="font-size:12px;color:#ccc;">当前灵敏度: ${currentSensitivity.toFixed(2)}</div>
            `;
        } catch (e) {
            progressInfo.textContent = '获取进度出错: ' + e.message;
        }
    }

    // 格式化时间为HH:MM:SS
    function formatTime(seconds) {
        if (isNaN(seconds)) return '00:00:00';

        seconds = Math.floor(seconds);
        const hours = Math.floor(seconds / 3600);
        seconds %= 3600;
        const minutes = Math.floor(seconds / 60);
        seconds %= 60;

        return [
            hours.toString().padStart(2, '0'),
            minutes.toString().padStart(2, '0'),
            seconds.toString().padStart(2, '0')
        ].join(':');
    }

    // 全局鼠标事件监听
    function startDrag(e) {
        if (!video || e.button !== 0) return;

        isDragging = true;
        hasMoved = false;
        startX = e.clientX;
        startY = e.clientY;
        startTime = video.currentTime;
        wasPlaying = !video.paused;

        // 显示拖动指示器
        dragIndicator.style.width = '40px';
        dragIndicator.style.height = '40px';
        dragIndicator.style.opacity = '1';
        dragIndicator.style.left = e.clientX + 'px';
        dragIndicator.style.top = e.clientY + 'px';

        document.body.style.userSelect = 'none';
    }

    function handleDrag(e) {
        if (!isDragging || !video) return;

        // 检查鼠标是否移动（超过5像素视为拖动）
        if (!hasMoved && (Math.abs(e.clientX - startX) > 5 || Math.abs(e.clientY - startY) > 5)) {
            hasMoved = true;
        }

        if (hasMoved) {
            const deltaX = e.clientX - startX;
            const deltaTime = deltaX * currentSensitivity;
            let newTime = startTime + deltaTime;

            newTime = Math.max(0, Math.min(video.duration, newTime));
            video.currentTime = newTime;

            dragIndicator.style.left = e.clientX + 'px';
            dragIndicator.style.top = e.clientY + 'px';
            dragIndicator.style.width = (40 + Math.abs(deltaX)/5) + 'px';
            dragIndicator.style.height = (40 + Math.abs(deltaX)/5) + 'px';

            const progressPercent = (newTime / video.duration * 100).toFixed(2);
            progressInfo.innerHTML = `
                <div>当前时间: ${formatTime(newTime)}</div>
                <div>总时长: ${formatTime(video.duration)}</div>
                <div>进度: ${progressPercent}%</div>
                <div>剩余时间: ${formatTime(video.duration - newTime)}</div>
                <div style="color: #ff9; font-weight: bold;">拖动中 (${deltaTime > 0 ? '+' : ''}${deltaTime.toFixed(1)}秒)</div>
                <div style="font-size:12px;color:#ccc;">当前灵敏度: ${currentSensitivity.toFixed(2)}</div>
            `;
        }
    }

    function endDrag(e) {
        if (!isDragging) return;

        isDragging = false;
        dragIndicator.style.width = '0';
        dragIndicator.style.height = '0';
        dragIndicator.style.opacity = '0';
        document.body.style.userSelect = '';

        // 如果没有移动（视为点击），则切换播放状态
        if (!hasMoved && video) {
            if (video.paused) {
                video.play().catch(e => console.log('播放失败:', e));
            } else {
                video.pause();
            }
        } else if (wasPlaying && video.paused) {
            video.play().catch(e => console.log('自动播放失败:', e));
        }

        updateProgressInfo();
    }

    // 初始化
    document.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', endDrag);

    initVideo();
})();