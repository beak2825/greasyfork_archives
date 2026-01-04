// ==UserScript==
// @name         安徽继续教育在线智能刷课 - 豪华增强版
// @namespace    合肥工业大学
// @version      2.1.2
// @description  彻底修复总时长重置问题+优化性能
// @author       继续教育学院
// @match        https://main.ahjxjy.cn/study/html/content/studying/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ahjxjy.cn
// @grant        GM_addStyle
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540381/%E5%AE%89%E5%BE%BD%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%9C%A8%E7%BA%BF%E6%99%BA%E8%83%BD%E5%88%B7%E8%AF%BE%20-%20%E8%B1%AA%E5%8D%8E%E5%A2%9E%E5%BC%BA%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/540381/%E5%AE%89%E5%BE%BD%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%9C%A8%E7%BA%BF%E6%99%BA%E8%83%BD%E5%88%B7%E8%AF%BE%20-%20%E8%B1%AA%E5%8D%8E%E5%A2%9E%E5%BC%BA%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加炫酷UI样式
    GM_addStyle(`
        .smart-course-helper {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 15px;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0,255,255,0.5);
            font-family: 'Microsoft YaHei', sans-serif;
            min-width: 250px;
            backdrop-filter: blur(5px);
            border: 1px solid #00ffff;
        }
        .helper-title {
            font-size: 18px;
            margin-bottom: 10px;
            color: #00ffff;
            display: flex;
            align-items: center;
        }
        .helper-title img {
            width: 24px;
            height: 24px;
            margin-right: 10px;
        }
        .helper-status {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
        }
        .helper-progress {
            height: 10px;
            background: #333;
            border-radius: 5px;
            margin: 10px 0;
            overflow: hidden;
        }
        .helper-progress-bar {
            height: 100%;
            background: linear-gradient(90deg, #00ffff, #0088ff);
            width: 0%;
            transition: width 0.3s;
        }
        .helper-stats {
            font-size: 12px;
            opacity: 0.8;
            margin-bottom: 5px;
        }
        .helper-time-stats {
            font-size: 11px;
            opacity: 0.7;
            margin-bottom: 3px;
        }
        .helper-buttons {
            display: flex;
            gap: 10px;
            margin-top: 10px;
        }
        .helper-btn {
            flex: 1;
            padding: 5px;
            border: none;
            border-radius: 5px;
            background: linear-gradient(135deg, #00ffff, #0088ff);
            color: black;
            cursor: pointer;
            font-weight: bold;
        }
    `);

    // 创建UI面板
    function createUI() {
        const panel = document.createElement('div');
        panel.className = 'smart-course-helper';
        panel.innerHTML = `
            <div class="helper-title">
                <span>智能刷课助手</span>
            </div>
            <div class="helper-status">
                <span>当前倍速:</span>
                <span id="helper-speed">1.0x</span>
            </div>
            <div class="helper-status">
                <span>当前进度:</span>
                <span id="helper-progress-text">0%</span>
            </div>
            <div class="helper-progress">
                <div class="helper-progress-bar" id="helper-progress-bar"></div>
            </div>
            <div class="helper-stats" id="helper-stats">
                已观看: 0节课
            </div>
            <div class="helper-time-stats">
                本节用时: <span id="current-course-time">00:00:00</span>
            </div>
            <div class="helper-time-stats">
                总用时: <span id="total-time">00:00:00</span>
            </div>
            <div class="helper-buttons">
                <button class="helper-btn" id="helper-pause">暂停</button>
                <button class="helper-btn" id="helper-settings">设置</button>
            </div>
        `;
        document.body.appendChild(panel);
    }

    // 状态变量
    const state = {
        isRunning: true,
        totalCourses: 0,
        completedCourses: GM_getValue('completedCourses', 0),
        startTime: GM_getValue('startTime', Date.now()), // 直接存储时间戳
        currentCourseStartTime: GM_getValue('currentCourseStartTime', Date.now()),
        currentSpeed: 1,
        checkInterval: null,
        video: null,
        settings: {
            targetSpeed: GM_getValue('targetSpeed', 2),
            checkInterval: 3000,
            progressThreshold: 95,
            jumpDelay: 5000
        }
    };

    // 初始化UI
    createUI();

    // 获取UI元素
    const ui = {
        speed: document.getElementById('helper-speed'),
        progressText: document.getElementById('helper-progress-text'),
        progressBar: document.getElementById('helper-progress-bar'),
        stats: document.getElementById('helper-stats'),
        currentCourseTime: document.getElementById('current-course-time'),
        totalTime: document.getElementById('total-time'),
        pauseBtn: document.getElementById('helper-pause'),
        settingsBtn: document.getElementById('helper-settings')
    };

    // 格式化时间
    function formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    // 更新UI
    function updateUI() {
        if (!ui.speed) return;

        ui.speed.textContent = `${state.currentSpeed.toFixed(1)}x`;
        ui.progressText.textContent = `${state.lastProgress || 0}%`;
        ui.progressBar.style.width = `${state.lastProgress || 0}%`;

        const totalElapsed = Math.floor((Date.now() - state.startTime) / 1000);
        const currentElapsed = Math.floor((Date.now() - state.currentCourseStartTime) / 1000);

        ui.totalTime.textContent = formatTime(totalElapsed);
        ui.currentCourseTime.textContent = formatTime(currentElapsed);
        ui.stats.textContent = `已观看: ${state.completedCourses}节课`;
    }

    // 设置倍速
    function setPlaybackSpeed() {
        state.video = document.querySelector('video') || document.querySelector('.jw-video');

        if (state.video) {
            try {
                state.video.playbackRate = state.settings.targetSpeed;
                state.currentSpeed = state.settings.targetSpeed;
                updateUI();
            } catch(e) {
                try {
                    state.video.playbackRate = 1.5;
                    state.currentSpeed = 1.5;
                } catch(e) {
                    state.currentSpeed = 1;
                }
            }
        } else {
            setTimeout(setPlaybackSpeed, 2000);
        }
    }

    // 检测进度
    function checkProgress() {
        if (!state.isRunning) return;

        if (!state.video) {
            setPlaybackSpeed();
            return;
        }

        try {
            const progressBar = document.querySelector('.jw-progress') || document.querySelector('.progress-bar');
            const videoProgress = (state.video.currentTime / state.video.duration * 100).toFixed(2);

            state.lastProgress = progressBar ?
                parseFloat(progressBar.style.width || '0') :
                parseFloat(videoProgress) || 0;

            updateUI();

            if (state.lastProgress > state.settings.progressThreshold) {
                const nextBtn = document.querySelector('.btn.btn-green') ||
                               document.querySelector('.next-button');

                if (nextBtn) {
                    state.completedCourses++;
                    GM_setValue('completedCourses', state.completedCourses);

                    // 保存当前课程开始时间
                    state.currentCourseStartTime = Date.now();
                    GM_setValue('currentCourseStartTime', state.currentCourseStartTime);

                    // 保存总开始时间（防止跳转后重置）
                    GM_setValue('startTime', state.startTime);

                    setTimeout(() => {
                        nextBtn.click();
                        setTimeout(setPlaybackSpeed, 5000);
                    }, state.settings.jumpDelay);
                }
            }
        } catch(e) {
            console.error('进度检测出错:', e);
        }
    }

    // 初始化
    function init() {
        setPlaybackSpeed();
        state.checkInterval = setInterval(checkProgress, state.settings.checkInterval);
        setInterval(updateUI, 1000);
    }

    // 按钮事件
    ui.pauseBtn.addEventListener('click', () => {
        state.isRunning = !state.isRunning;
        ui.pauseBtn.textContent = state.isRunning ? '暂停' : '继续';
    });

    ui.settingsBtn.addEventListener('click', () => {
        const newSpeed = prompt('请输入目标倍速(1-5):', state.settings.targetSpeed);
        if (newSpeed && !isNaN(newSpeed)) {
            const speed = Math.min(5, Math.max(1, parseFloat(newSpeed)));
            state.settings.targetSpeed = speed;
            GM_setValue('targetSpeed', speed);
            setPlaybackSpeed();
        }
    });

    // 启动
    init();

})();