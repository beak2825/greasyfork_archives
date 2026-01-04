// ==UserScript==
// @name         VideoHelper
// @namespace    https://github.com/Cocowwy/Tampermonkey-Tools
// @version      1.2
// @description  看片小助肘 - 支持片头跳过设置，倍速播放记忆，自动全屏设置，音量记忆、截屏功能和自动播放功能
// @author       Cocowwy
// @match        *://*/*
// @updateUrl    https://github.com/Cocowwy/Tampermonkey-Tools/blob/master/VideoHelper.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530443/VideoHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/530443/VideoHelper.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEY = 'video_auto_jump_time';
    const SPEED_STORAGE_KEY = 'video_playback_speed';
    const AUTO_FULLSCREEN_KEY = 'video_auto_fullscreen';
    const VOLUME_STORAGE_KEY = 'video_volume';
    const AUTO_PLAY_KEY = 'video_auto_play';
    let isPanelVisible = false;
    let isDragging = false;
    let startX, startY, initialX, initialY;

    // 创建折叠按钮
    const toggleBtn = document.createElement('div');
    toggleBtn.innerHTML = '📽️';
    toggleBtn.style.cssText = `
        position: fixed;
        left: 10px;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
        z-index: 9999;
        opacity: 0.7;
        transition: opacity 0.3s;
        font-size: 20px;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        background: rgba(0, 0, 0, 0.85);
    `;
    toggleBtn.addEventListener('mouseenter', () => toggleBtn.style.opacity = '1');
    toggleBtn.addEventListener('mouseleave', () => toggleBtn.style.opacity = '0.7');
    document.body.appendChild(toggleBtn);

    // 创建配置面板
    const panel = document.createElement('div');
    panel.style.cssText = `
        position: fixed;
        left: -300px; /* 初始隐藏位置 */
        top: 50%;
        transform: translateY(-50%);
        background: rgba(0, 0, 0, 0.85);
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 0 15px rgba(0,0,0,0.3);
        transition: all 0.3s ease;
        color: white;
        width: 260px;
        z-index: 9998;
        backdrop-filter: blur(5px);
    `;

    // 拖动处理函数
    const handleMouseDown = (e) => {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        initialX = panel.offsetLeft;
        initialY = panel.offsetTop;
        panel.style.transition = 'none';
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        panel.style.left = `${initialX + dx}px`;
        panel.style.top = `${initialY + dy}px`;
    };

    const handleMouseUp = () => {
        isDragging = false;
        panel.style.transition = 'all 0.3s ease';
    };

    // 面板内容
    panel.innerHTML = `
        <div style="margin-bottom: 15px; font-weight: bold; font-size: 16px;">
            🎬 视频小助肘
            <div style="float: right; cursor: pointer; opacity: 0.7;" id="closeBtn">×</div>
        </div>
        <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 8px; font-size: 14px;">
                跳过片头时间（秒）:
            </label>
            <input type="number"
                   id="timeInput"
                   style="width: 95%;
                          padding: 8px;
                          border: 1px solid rgba(255,255,255,0.2);
                          border-radius: 4px;
                          background: rgba(255,255,255,0.1);
                          color: white;
                          margin-bottom: 15px;">
            </input>
            <label style="display: block; margin-bottom: 8px; font-size: 14px;">
                播放倍速:
            </label>
            <input type="number"
                   id="speedInput"
                   style="width: 95%;
                          padding: 8px;
                          border: 1px solid rgba(255,255,255,0.2);
                          border-radius: 4px;
                          background: rgba(255,255,255,0.1);
                          color: white;
                          margin-bottom: 15px;">
            </input>
            <label style="display: block; margin-bottom: 8px; font-size: 14px;">
                音量 (0 - 100):
            </label>
            <input type="number"
                   id="volumeInput"
                   min="0"
                   max="100"
                   style="width: 95%;
                          padding: 8px;
                          border: 1px solid rgba(255,255,255,0.2);
                          border-radius: 4px;
                          background: rgba(255,255,255,0.1);
                          color: white;
                          margin-bottom: 15px;">
            </input>
            <label style="display: block; margin-bottom: 8px; font-size: 14px;">
                自动全屏:
            </label>
            <input type="checkbox" id="autoFullscreenCheckbox">
            <label style="display: block; margin-bottom: 8px; font-size: 14px;">
                自动播放:
            </label>
            <input type="checkbox" id="autoPlayCheckbox">
            <button id="saveBtn"
                    style="width: 100%;
                           padding: 8px;
                           background: #2196F3;
                           border: none;
                           border-radius: 4px;
                           color: white;
                           cursor: pointer;
                           transition: background 0.3s;">
                保存
            </button>
            <button id="screenshotBtn"
                    style="width: 100%;
                           padding: 8px;
                           background: #4CAF50;
                           border: none;
                           border-radius: 4px;
                           color: white;
                           cursor: pointer;
                           transition: background 0.3s;
                           margin-top: 10px;">
                视频截屏
            </button>
        </div>
    `;

    // 元素引用
    const timeInput = panel.querySelector('#timeInput');
    const speedInput = panel.querySelector('#speedInput');
    const volumeInput = panel.querySelector('#volumeInput');
    const autoFullscreenCheckbox = panel.querySelector('#autoFullscreenCheckbox');
    const autoPlayCheckbox = panel.querySelector('#autoPlayCheckbox');
    const saveBtn = panel.querySelector('#saveBtn');
    const closeBtn = panel.querySelector('#closeBtn');
    const screenshotBtn = panel.querySelector('#screenshotBtn');

    // 事件监听
    saveBtn.addEventListener('mouseenter', () => saveBtn.style.background = '#1976D2');
    saveBtn.addEventListener('mouseleave', () => saveBtn.style.background = '#2196F3');
    closeBtn.addEventListener('click', () => togglePanel(false));
    panel.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    // 功能函数
    function togglePanel(show) {
        isPanelVisible = show;
        panel.style.left = show ? '60px' : '-300px'; // 展开时距离左侧60px
        toggleBtn.innerHTML = show ? 'X' : '📽️';
    }

    toggleBtn.addEventListener('click', () => togglePanel(!isPanelVisible));

    // 初始化存储值
    timeInput.value = localStorage.getItem(STORAGE_KEY) || 0;
    speedInput.value = localStorage.getItem(SPEED_STORAGE_KEY) || 1;
    volumeInput.value = localStorage.getItem(VOLUME_STORAGE_KEY) || 100;
    autoFullscreenCheckbox.checked = localStorage.getItem(AUTO_FULLSCREEN_KEY) === 'true';
    autoPlayCheckbox.checked = localStorage.getItem(AUTO_PLAY_KEY) === 'true';

    saveBtn.addEventListener('click', () => {
        const jumpTime = parseInt(timeInput.value, 10);
        const playbackSpeed = parseFloat(speedInput.value);
        const volume = parseInt(volumeInput.value, 10);
        const autoFullscreen = autoFullscreenCheckbox.checked;
        const autoPlay = autoPlayCheckbox.checked;

        if (!isNaN(jumpTime) && !isNaN(playbackSpeed) && !isNaN(volume) && volume >= 0 && volume <= 100) {
            localStorage.setItem(STORAGE_KEY, jumpTime);
            localStorage.setItem(SPEED_STORAGE_KEY, playbackSpeed);
            localStorage.setItem(VOLUME_STORAGE_KEY, volume);
            localStorage.setItem(AUTO_FULLSCREEN_KEY, autoFullscreen);
            localStorage.setItem(AUTO_PLAY_KEY, autoPlay);

            const video = document.querySelector('video');
            if (video) {
                video.currentTime = jumpTime;
                video.playbackRate = playbackSpeed;
                video.volume = volume / 100;
                
                if (autoPlay) {
                    video.play().catch(() => {
                        showToast('⚠️ 自动播放被浏览器阻止，请手动播放');
                    });
                }
            }

            showToast('✅ 设置已保存');
        } else {
            showToast('⚠️ 请输入有效数字，音量范围为 0 - 100');
        }
    });

    // 视频处理
    const video = document.querySelector('video');
    if (video) {
        video.addEventListener('loadedmetadata', () => {
            const jumpTime = parseInt(localStorage.getItem(STORAGE_KEY), 10);
            const playbackSpeed = parseFloat(localStorage.getItem(SPEED_STORAGE_KEY));
            const volume = parseFloat(localStorage.getItem(VOLUME_STORAGE_KEY));
            const autoFullscreen = localStorage.getItem(AUTO_FULLSCREEN_KEY) === 'true';

            if (!isNaN(jumpTime) && jumpTime <= video.duration) {
                video.currentTime = jumpTime;
            }
            if (!isNaN(playbackSpeed)) {
                video.playbackRate = playbackSpeed;
            }
            if (!isNaN(volume) && volume >= 0 && volume <= 100) {
                video.volume = volume / 100;
            }
        });

        video.addEventListener('play', () => {
            const autoFullscreen = localStorage.getItem(AUTO_FULLSCREEN_KEY) === 'true';
            if (autoFullscreen) {
                if (video.requestFullscreen) {
                    video.requestFullscreen();
                } else if (video.webkitRequestFullscreen) {
                    video.webkitRequestFullscreen();
                } else if (video.msRequestFullscreen) {
                    video.msRequestFullscreen();
                } else if (video.mozRequestFullscreen) {
                    video.mozRequestFullscreen();
                } else {
                    showToast('⚠️ 当前浏览器不支持全屏功能');
                }
            }
        });
    }

    // 截屏功能
    screenshotBtn.addEventListener('click', () => {
        const video = document.querySelector('video');
        if (video) {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = 'video_screenshot.png';
            link.click();

            showToast('📸 截屏已保存');
        } else {
            showToast('⚠️ 未找到视频元素');
        }
    });

    // 提示信息函数
    function showToast(message) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 12px 24px;
            border-radius: 4px;
            font-size: 14px;
            z-index: 10000;
            animation: fadeInOut 2.5s;
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2500);
    }

    // 注入CSS动画
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInOut {
            0% { opacity: 0; transform: translate(-50%, 10px); }
            15% { opacity: 1; transform: translate(-50%, 0); }
            85% { opacity: 1; transform: translate(-50%, 0); }
            100% { opacity: 0; transform: translate(-50%, -10px); }
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(panel);
})();
