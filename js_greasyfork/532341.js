// ==UserScript==
// @name         115调试 - 稳定版通用视频控制器 (Netflix 风格 + UI修复 + 人脸拦截 + 跳转后更新 + 修复暂停/继续 + 加载时双重更新 + 99%跳转 + 图标修复)
// @namespace    http://tampermonkey.net/
// @version      3.5_zh-CN_fixed_deploy_pause_resume_double_update_99percent_icons
// @description  为 HTML5 视频添加 Netflix 风格悬浮控件，默认播放速度0.1x，修复UI显示问题，支持一键部署（快速跳转至99%、暂停、更新进度、自动取消弹窗按新逻辑、跳过已学习视频），停止/继续部署，拖动控件，拦截人脸识别，跳转后自动更新进度，修复停止/继续部署问题，每次加载视频时更新两次进度，跳转目标调整为99%，修复按钮图标显示。
// @author       Gemini (由 Google 开发), Grok (优化)
// @match        *://gd.aqscwlxy.com/*
// @exclude      https://*.netflix.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI0U1MDkyMCI+PHBhdGggZD0iTTE5IDNINWMtMS4xIDAtMiAuOS0yIDJ2MTRjMCAxLjEuOSAyIDIgMmgxNGMxLjEgMCAyLS45IDItMlY1YzAtMS1xLTkuOS0yLTItMnptLTggMTBoOXYtMkg3Vjl2LTJoMnYyIGgtMnYyeiIvPjwvc3ZnPg==
// @downloadURL https://update.greasyfork.org/scripts/532341/115%E8%B0%83%E8%AF%95%20-%20%E7%A8%B3%E5%AE%9A%E7%89%88%E9%80%9A%E7%94%A8%E8%A7%86%E9%A2%91%E6%8E%A7%E5%88%B6%E5%99%A8%20%28Netflix%20%E9%A3%8E%E6%A0%BC%20%2B%20UI%E4%BF%AE%E5%A4%8D%20%2B%20%E4%BA%BA%E8%84%B8%E6%8B%A6%E6%88%AA%20%2B%20%E8%B7%B3%E8%BD%AC%E5%90%8E%E6%9B%B4%E6%96%B0%20%2B%20%E4%BF%AE%E5%A4%8D%E6%9A%82%E5%81%9C%E7%BB%A7%E7%BB%AD%20%2B%20%E5%8A%A0%E8%BD%BD%E6%97%B6%E5%8F%8C%E9%87%8D%E6%9B%B4%E6%96%B0%20%2B%2099%25%E8%B7%B3%E8%BD%AC%20%2B%20%E5%9B%BE%E6%A0%87%E4%BF%AE%E5%A4%8D%29.user.js
// @updateURL https://update.greasyfork.org/scripts/532341/115%E8%B0%83%E8%AF%95%20-%20%E7%A8%B3%E5%AE%9A%E7%89%88%E9%80%9A%E7%94%A8%E8%A7%86%E9%A2%91%E6%8E%A7%E5%88%B6%E5%99%A8%20%28Netflix%20%E9%A3%8E%E6%A0%BC%20%2B%20UI%E4%BF%AE%E5%A4%8D%20%2B%20%E4%BA%BA%E8%84%B8%E6%8B%A6%E6%88%AA%20%2B%20%E8%B7%B3%E8%BD%AC%E5%90%8E%E6%9B%B4%E6%96%B0%20%2B%20%E4%BF%AE%E5%A4%8D%E6%9A%82%E5%81%9C%E7%BB%A7%E7%BB%AD%20%2B%20%E5%8A%A0%E8%BD%BD%E6%97%B6%E5%8F%8C%E9%87%8D%E6%9B%B4%E6%96%B0%20%2B%2099%25%E8%B7%B3%E8%BD%AC%20%2B%20%E5%9B%BE%E6%A0%87%E4%BF%AE%E5%A4%8D%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置 ---
    const PANEL_ID = 'universal-video-controller-panel-zh-v13';
    const SPEEDS = [0.1, 0.5, 1.0];
    const FIXED_JUMP_PERCENTAGES = [
        { label: '50%', value: 50 },
        { label: '99%', value: 99 }
    ];
    const SKIP_AMOUNT = 10;
    const HIDE_DELAY = 1800;
    const MIN_VIDEO_SIZE = 100;
    const SAFE_ACTION_FLAG = '_UVC_safeAction_v13';
    const AUTO_SLOWDOWN_THRESHOLD = 3.0;
    const AUTO_SLOWDOWN_FLAG = '_UVC_isAutoSlowdown_v13';
    const SLOWDOWN_RATE = 0.1;
    const PIN_PANEL_FLAG = '_UVC_isPanelPinned_v13';
    const CONFIRM_TEXT = '确认';
    const CANCEL_TEXT = '取消';
    const GOTO_TEST_TEXT = '去测试';
    const UPDATE_TEXT = '更新进度';
    const BLOCKED_URL = "https://gd.aqscwlxy.com/gd_api/face/launch_face_auth.php";
    const STUDYRECORD_URL = '/gd_api/study/studyrecord.php';
    const BLOCK_EVENTS = ['blur', 'visibilitychange', 'pagehide', 'freeze'];
    const UPDATE_CLICK_COUNT = 5;
    const FAKE_SUCCESS_RESPONSE = { code: 200, msg: "上传成功 (由脚本修改)", data: null };
    const FAKE_SUCCESS_RESPONSE_TEXT = JSON.stringify(FAKE_SUCCESS_RESPONSE);
    const DOUBLE_UPDATE_DELAY = 100; // 双重更新之间的延迟（毫秒）

    // --- 状态变量 ---
    let currentVideo = null;
    let controlPanel = null;
    let hideTimeout = null;
    let activeSpeedButton = null;
    let playPauseButton = null;
    let dragButton = null;
    let muteButton = null;
    let deployButton = null;
    let stopDeployButton = null;
    let currentTimeDisplay = null;
    let durationDisplay = null;
    let timeUpdateInterval = null;
    let progressBarContainer = null;
    let progressTrack = null;
    let progressBuffer = null;
    let progressFill = null;
    let progressThumb = null;
    let isDraggingProgress = false;
    let wasPausedBeforeDrag = false;
    let progressPercentDisplay = null;
    let originalSpeedBeforeSlowdown = null;
    let pinPanelButton = null;
    let allowPauseAtSlowSpeed = true;
    let isDeploying = false;
    let isDeploymentPaused = false;
    let isDraggingPanel = false;
    let dragStartX = 0;
    let dragStartY = 0;
    window[AUTO_SLOWDOWN_FLAG] = false;
    window[PIN_PANEL_FLAG] = true;

    // --- 日志函数 ---
    function log(message) { console.log('[VideoController]', message); }

    // --- 拦截人脸识别和强制更新学习记录 ---
    if (window.location.hostname === 'gd.aqscwlxy.com') {
        const originalOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url) {
            this._url = url;
            this._method = method;
            if (typeof url === 'string') {
                if (url.includes(STUDYRECORD_URL) && method.toUpperCase() === 'POST') {
                    this.addEventListener('readystatechange', function() {
                        if (this.readyState === 4) {
                            Object.defineProperties(this, {
                                response: { value: FAKE_SUCCESS_RESPONSE_TEXT, writable: true, configurable: true },
                                responseText: { value: FAKE_SUCCESS_RESPONSE_TEXT, writable: true, configurable: true },
                                status: { value: 200, writable: true, configurable: true },
                                statusText: { value: 'OK (faked)', writable: true, configurable: true }
                            });
                            log('学习记录已强制更新为成功');
                        }
                    }, false);
                }
                if (url === BLOCKED_URL) {
                    this.addEventListener('readystatechange', function() {
                        if (this.readyState === 4) {
                            Object.defineProperties(this, {
                                status: { value: 0, writable: true, configurable: true },
                                statusText: { value: 'Blocked by script', writable: true, configurable: true }
                            });
                            log('人脸识别请求被拦截');
                        }
                    }, false);
                }
            }
            originalOpen.apply(this, arguments);
        };

        const originalFetch = window.fetch;
        window.fetch = function(input, init) {
            let url = (typeof input === 'string') ? input : (input ? input.url : '');
            let method = (init && init.method) ? init.method.toUpperCase() : 'GET';
            if (typeof url === 'string') {
                if (url.includes(STUDYRECORD_URL) && method === 'POST') {
                    const fakeResponse = new Response(FAKE_SUCCESS_RESPONSE_TEXT, {
                        status: 200,
                        statusText: 'OK (faked)',
                        headers: { 'Content-Type': 'application/json;charset=utf-8' }
                    });
                    log('学习记录 Fetch 请求已强制返回成功');
                    return Promise.resolve(fakeResponse);
                }
                if (url === BLOCKED_URL) {
                    log('人脸识别 Fetch 请求被拦截');
                    return Promise.reject(new Error("人脸识别请求被脚本拦截"));
                }
            }
            return originalFetch.apply(this, arguments);
        };
    }

    // --- 防护功能 ---
    if (window.location.hostname === 'gd.aqscwlxy.com') {
        const winAdd = window.addEventListener;
        window.addEventListener = function(type, listener, options) {
            if (BLOCK_EVENTS.includes(type)) return;
            winAdd.call(this, type, listener, options);
        };

        const docAdd = document.addEventListener;
        document.addEventListener = function(type, listener, options) {
            if (BLOCK_EVENTS.includes(type)) return;
            docAdd.call(this, type, listener, options);
        };

        Object.defineProperty(document, 'visibilityState', { get: () => 'visible', configurable: true });
        Object.defineProperty(document, 'hidden', { get: () => false, configurable: true });
        document.hasFocus = () => true;

        const originalPause = HTMLMediaElement.prototype.pause;
        HTMLMediaElement.prototype.pause = function() {
            if (window[SAFE_ACTION_FLAG]) {
                window[SAFE_ACTION_FLAG] = false;
                return originalPause.apply(this, arguments);
            }
            const fromScript = !(new Error().stack.includes('native code'));
            if (fromScript && !allowPauseAtSlowSpeed) {
                return;
            }
            return originalPause.apply(this, arguments);
        };

        window.addEventListener('load', () => {
            const originalCurrentTime = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'currentTime');
            Object.defineProperty(HTMLMediaElement.prototype, 'currentTime', {
                get: function() { return originalCurrentTime.get.call(this); },
                set: function(val) {
                    if (window[SAFE_ACTION_FLAG]) {
                        window[SAFE_ACTION_FLAG] = false;
                        return originalCurrentTime.set.call(this, val);
                    }
                    if (typeof val === 'number' && val < this.currentTime - 1) {
                        return;
                    }
                    return originalCurrentTime.set.call(this, val);
                },
                configurable: true
            });
        });
    }

    // --- 样式 ---
    GM_addStyle(`
        #${PANEL_ID} { position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); background-color: rgba(20, 20, 20, 0.9); border-radius: 8px; padding: 10px 15px; flex-direction: column; gap: 8px; z-index: 2147483647; font-family: Arial, sans-serif; backdrop-filter: blur(6px); box-shadow: 0 3px 12px rgba(0, 0, 0, 0.6); color: #fff; transition: opacity 0.3s ease; width: clamp(550px, 75vw, 950px); box-sizing: border-box; cursor: move; }
        #${PANEL_ID}.visible { display: flex; opacity: 1; bottom: 30px; }
        #${PANEL_ID} .progress-bar-container { width: 100%; height: 16px; display: flex; align-items: center; cursor: pointer; padding: 5px 0; }
        #${PANEL_ID} .progress-track { width: 100%; height: 5px; background-color: rgba(100, 100, 100, 0.6); border-radius: 3px; position: relative; overflow: hidden; }
        #${PANEL_ID} .progress-buffer { position: absolute; height: 100%; width: 0%; background-color: rgba(150, 150, 150, 0.6); }
        #${PANEL_ID} .progress-fill { position: absolute; height: 100%; width: 0%; background-color: #E50914; z-index: 1; }
        #${PANEL_ID} .progress-thumb { position: absolute; top: 50%; width: 14px; height: 14px; background-color: #E50914; border: 1px solid rgba(255,255,255,0.8); border-radius: 50%; transform: translate(-50%, -50%); z-index: 2; cursor: pointer; }
        #${PANEL_ID} .controls-row { display: flex; width: 100%; justify-content: space-between; align-items: center; gap: 10px; }
        #${PANEL_ID} .controls-left, #${PANEL_ID} .controls-center, #${PANEL_ID} .controls-right { display: flex; align-items: center; gap: 8px; }
        #${PANEL_ID} .controls-center { flex-grow: 1; justify-content: center; gap: 6px; }
        #${PANEL_ID} .progress-percent-display { font-size: 13px; font-weight: bold; color: #E0E0E0; min-width: 45px; text-align: right; margin-right: 10px; }
        #${PANEL_ID} .speed-controls { display: flex; align-items: center; gap: 6px; }
        #${PANEL_ID} .speed-controls button.active { background-color: rgba(229, 9, 20, 0.85); border-color: #fff; font-weight: bold; }
        #${PANEL_ID} .jump-controls-group { display: flex; align-items: center; gap: 5px; border-left: 1px solid #555; padding-left: 10px; }
        #${PANEL_ID} button { background: rgba(70, 70, 70, 0.75); color: #fff; border: 1px solid rgba(255, 255, 255, 0.35); border-radius: 5px; padding: 5px 9px; cursor: pointer; font-size: 12px; transition: background-color 0.2s ease; min-width: 28px; display: flex; align-items: center; justify-content: center; }
        #${PANEL_ID} button:hover { background: rgba(100, 100, 100, 0.9); }
        #${PANEL_ID} .deploy-button { background: rgba(0, 128, 0, 0.75); padding: 5px 12px; }
        #${PANEL_ID} .deploy-button:hover { background: rgba(0, 160, 0, 0.9); }
        #${PANEL_ID} .stop-deploy-button { background: rgba(255, 0, 0, 0.75); padding: 5px 12px; }
        #${PANEL_ID} .stop-deploy-button:hover { background: rgba(255, 50, 50, 0.9); }
        #${PANEL_ID} .continue-deploy-button { background: rgba(0, 128, 0, 0.75); padding: 5px 12px; }
        #${PANEL_ID} .continue-deploy-button:hover { background: rgba(0, 160, 0, 0.9); }
        #${PANEL_ID} .time-display { font-size: 12px; color: #ddd; min-width: 80px; text-align: center; }
        #${PANEL_ID} .pin-panel-button.pinned { background-color: rgba(229, 9, 20, 0.85); }
        #${PANEL_ID} .drag-button::before { content: '✥'; font-size: 15px; }
        #${PANEL_ID} .play-button::before { content: '▶'; font-size: 12px; }
        #${PANEL_ID} .pause-button::before { content: '❚❚'; font-size: 12px; }
        #${PANEL_ID} .skip-back-button::before { content: '⏪'; font-size: 14px; }
        #${PANEL_ID} .skip-forward-button::before { content: '⏩'; font-size: 14px; }
        #${PANEL_ID} .mute-button::before { content: '🔇'; font-size: 14px; }
        #${PANEL_ID} .unmute-button::before { content: '🔊'; font-size: 14px; }
        #${PANEL_ID} .deploy-button::before { content: '🚀'; font-size: 14px; margin-right: 4px; }
        #${PANEL_ID} .stop-deploy-button::before { content: '⏹'; font-size: 12px; margin-right: 4px; }
        #${PANEL_ID} .continue-deploy-button::before { content: '▶'; font-size: 12px; margin-right: 4px; }
        #${PANEL_ID} .pin-panel-button::before { content: '📌'; font-size: 14px; }
        .auto-dismiss-alert { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(255, 0, 0, 0.9); color: white; padding: 15px 25px; border-radius: 5px; z-index: 2147483647; font-size: 16px; }
        .chapter-end-notification { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: rgba(0, 0, 0, 0.8); color: white; padding: 15px 25px; border-radius: 8px; z-index: 10000; }
    `);

    // --- 核心功能函数 ---
    function setSafeAction(enable) { window[SAFE_ACTION_FLAG] = enable; }

    function findButtons(text) {
        return Array.from(document.querySelectorAll('button')).filter(button => {
            const isVisible = button.offsetParent !== null;
            const isEnabled = !button.disabled;
            return isVisible && isEnabled && button.textContent?.trim().includes(text);
        });
    }

    function checkForCancelButton() {
        const cancelButtons = findButtons(CANCEL_TEXT);
        const gotoTestButtons = findButtons(GOTO_TEST_TEXT);
        const confirmButtons = findButtons(CONFIRM_TEXT);

        if (cancelButtons.length > 0) {
            if (gotoTestButtons.length > 0) {
                log(`发现 "${CANCEL_TEXT}" 和 "${GOTO_TEST_TEXT}"，点击 "${CANCEL_TEXT}"`);
                cancelButtons[0].click();
                return true;
            }
            if (confirmButtons.length > 0) {
                log(`发现 "${CANCEL_TEXT}" 和 "${CONFIRM_TEXT}"，点击 "${CONFIRM_TEXT}"`);
                confirmButtons[0].click();
                return true;
            }
        }
        return false;
    }

    function isUpdateButtonPresent() {
        const buttons = document.querySelectorAll('div.ro-comment > span:nth-child(2)');
        return Array.from(buttons).some(button => button.textContent.trim() === UPDATE_TEXT && isVisible(button));
    }

    function isVideoStudied(item) {
        const finishElement = item.querySelector('.ro-finish');
        return finishElement && finishElement.textContent.includes('已学习');
    }

    function showAutoDismissAlert(message) {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'auto-dismiss-alert';
        alertDiv.textContent = message;
        document.body.appendChild(alertDiv);
        setTimeout(() => alertDiv.remove(), 2500);
    }

    function showChapterEndNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'chapter-end-notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 2500);
    }

    function updateProgress(actionType) {
        const buttons = document.querySelectorAll('div.ro-comment > span:nth-child(2)');
        buttons.forEach(button => {
            if (button.textContent.trim() === UPDATE_TEXT && isVisible(button)) {
                for (let i = 0; i < UPDATE_CLICK_COUNT; i++) {
                    setTimeout(() => {
                        button.click();
                        log(`点击 "${UPDATE_TEXT}" 第 ${i + 1} 次 (${actionType})`);
                    }, i * 50);
                }
            }
        });
    }

    async function doubleUpdateProgress(actionType) {
        if (isUpdateButtonPresent()) {
            updateProgress(`${actionType} - 第一次`);
            await new Promise(resolve => setTimeout(resolve, UPDATE_CLICK_COUNT * 50 + DOUBLE_UPDATE_DELAY));
            updateProgress(`${actionType} - 第二次`);
            await new Promise(resolve => setTimeout(resolve, UPDATE_CLICK_COUNT * 50 + 50));
        } else {
            log(`未找到“${UPDATE_TEXT}”按钮，跳过${actionType}双重更新`);
        }
    }

    function updateProgressOnDeploy() {
        return new Promise(resolve => {
            if (isUpdateButtonPresent()) {
                updateProgress("部署或跳转后更新");
                setTimeout(resolve, UPDATE_CLICK_COUNT * 50 + 50);
            } else {
                log("未找到“更新进度”按钮，跳过更新");
                resolve();
            }
        });
    }

    function getVideoItems() {
        const container = document.querySelector('div.items');
        return container ? Array.from(container.querySelectorAll('div.item')) : [];
    }

    function getActiveItem() {
        const container = document.querySelector('div.items');
        return container ? container.querySelector('div.item.item-active') : null;
    }

    function isVisible(elem) {
        if (!(elem instanceof Element)) return false;
        const style = window.getComputedStyle(elem);
        return style.display !== 'none' && style.visibility !== 'hidden' && elem.offsetParent !== null;
    }

    function createControlPanel() {
        if (document.getElementById(PANEL_ID)) return;

        controlPanel = document.createElement('div');
        controlPanel.id = PANEL_ID;
        controlPanel.style.display = 'none';

        progressBarContainer = document.createElement('div');
        progressBarContainer.className = 'progress-bar-container';
        progressTrack = document.createElement('div');
        progressTrack.className = 'progress-track';
        progressBuffer = document.createElement('div');
        progressBuffer.className = 'progress-buffer';
        progressFill = document.createElement('div');
        progressFill.className = 'progress-fill';
        progressThumb = document.createElement('div');
        progressThumb.className = 'progress-thumb';
        progressTrack.appendChild(progressBuffer);
        progressTrack.appendChild(progressFill);
        progressTrack.appendChild(progressThumb);
        progressBarContainer.appendChild(progressTrack);
        controlPanel.appendChild(progressBarContainer);
        progressBarContainer.addEventListener('click', handleProgressBarClick);
        progressBarContainer.addEventListener('mousedown', handleDragStart);

        const controlsRow = document.createElement('div');
        controlsRow.className = 'controls-row';

        const controlsLeft = document.createElement('div');
        controlsLeft.className = 'controls-left';
        playPauseButton = document.createElement('button');
        playPauseButton.className = 'play-button';
        playPauseButton.title = "播放/暂停";
        playPauseButton.addEventListener('click', handlePlayPause);
        controlsLeft.appendChild(playPauseButton);
        const skipBackButton = document.createElement('button');
        skipBackButton.className = 'skip-back-button';
        skipBackButton.title = `后退 ${SKIP_AMOUNT} 秒`;
        skipBackButton.addEventListener('click', handleSkipBack);
        controlsLeft.appendChild(skipBackButton);
        const skipForwardButton = document.createElement('button');
        skipForwardButton.className = 'skip-forward-button';
        skipForwardButton.title = `快进 ${SKIP_AMOUNT} 秒`;
        skipForwardButton.addEventListener('click', handleSkipForward);
        controlsLeft.appendChild(skipForwardButton);

        const controlsCenter = document.createElement('div');
        controlsCenter.className = 'controls-center';
        progressPercentDisplay = document.createElement('span');
        progressPercentDisplay.className = 'progress-percent-display';
        progressPercentDisplay.textContent = '0%';
        controlsCenter.appendChild(progressPercentDisplay);
        const speedContainer = document.createElement('div');
        speedContainer.className = 'speed-controls';
        const speedLabel = document.createElement('span');
        speedLabel.textContent = '速度:';
        speedContainer.appendChild(speedLabel);
        SPEEDS.forEach(speed => {
            const speedButton = document.createElement('button');
            speedButton.textContent = `${speed}x`;
            speedButton.dataset.speed = speed;
            speedButton.addEventListener('click', handleSpeedChange);
            if (speed === 0.1) {
                speedButton.classList.add('active');
                activeSpeedButton = speedButton;
            }
            speedContainer.appendChild(speedButton);
        });
        controlsCenter.appendChild(speedContainer);

        const jumpGroupContainer = document.createElement('div');
        jumpGroupContainer.className = 'jump-controls-group';
        FIXED_JUMP_PERCENTAGES.forEach(jump => {
            const jumpButton = document.createElement('button');
            jumpButton.textContent = jump.label;
            jumpButton.dataset.percent = jump.value;
            jumpButton.addEventListener('click', () => jumpToPercentAndPause(jump.value));
            jumpGroupContainer.appendChild(jumpButton);
        });
        controlsCenter.appendChild(jumpGroupContainer);

        const controlsRight = document.createElement('div');
        controlsRight.className = 'controls-right';
        const timeContainer = document.createElement('div');
        timeContainer.className = 'time-display';
        currentTimeDisplay = document.createElement('span');
        durationDisplay = document.createElement('span');
        timeContainer.appendChild(currentTimeDisplay);
        timeContainer.appendChild(document.createTextNode(' / '));
        timeContainer.appendChild(durationDisplay);
        controlsRight.appendChild(timeContainer);
        pinPanelButton = document.createElement('button');
        pinPanelButton.className = 'pin-panel-button';
        pinPanelButton.title = '固定/取消固定面板';
        pinPanelButton.addEventListener('click', togglePinPanel);
        controlsRight.appendChild(pinPanelButton);
        deployButton = document.createElement('button');
        deployButton.className = 'deploy-button';
        deployButton.innerHTML = '一键部署';
        deployButton.addEventListener('click', handleOneClickDeploy);
        controlsRight.appendChild(deployButton);
        stopDeployButton = document.createElement('button');
        stopDeployButton.className = 'stop-deploy-button';
        stopDeployButton.innerHTML = '停止部署';
        stopDeployButton.addEventListener('click', toggleDeployPause);
        controlsRight.appendChild(stopDeployButton);
        muteButton = document.createElement('button');
        muteButton.className = 'mute-button';
        muteButton.title = '静音/取消静音';
        muteButton.addEventListener('click', handleMuteToggle);
        controlsRight.appendChild(muteButton);
        dragButton = document.createElement('button');
        dragButton.className = 'drag-button';
        dragButton.title = '拖动面板';
        dragButton.addEventListener('mousedown', startDraggingPanel);
        controlsRight.appendChild(dragButton);

        controlsRow.appendChild(controlsLeft);
        controlsRow.appendChild(controlsCenter);
        controlsRow.appendChild(controlsRight);
        controlPanel.appendChild(controlsRow);
        document.body.appendChild(controlPanel);
        updatePinButtonState();
        log("控制面板已创建 (v3.5 - 图标修复)");
    }

    function formatTime(seconds) {
        if (isNaN(seconds) || !isFinite(seconds)) return "--:--";
        const date = new Date(0);
        date.setSeconds(Math.round(seconds));
        return date.toISOString().substr(11, 8).startsWith('00:') ? date.toISOString().substr(14, 5) : date.toISOString().substr(11, 8);
    }

    function updateProgressAndTimers() {
        if (!currentVideo || !controlPanel) return;
        const currentTime = currentVideo.currentTime;
        const duration = currentVideo.duration;
        currentTimeDisplay.textContent = formatTime(currentTime);
        durationDisplay.textContent = formatTime(duration);
        if (duration && isFinite(duration)) {
            const progressPercent = (currentTime / duration) * 100;
            progressFill.style.width = `${progressPercent}%`;
            progressThumb.style.left = `${progressPercent}%`;
            progressBuffer.style.width = `${calculateBufferPercent(currentVideo, currentTime, duration)}%`;
            progressPercentDisplay.textContent = `${Math.round(progressPercent)}%`;
            const remainingTime = duration - currentTime;
            if (remainingTime <= AUTO_SLOWDOWN_THRESHOLD && !currentVideo.paused && !window[AUTO_SLOWDOWN_FLAG]) {
                originalSpeedBeforeSlowdown = currentVideo.playbackRate;
                setSafeAction(true);
                currentVideo.playbackRate = SLOWDOWN_RATE;
                setSafeAction(false);
                window[AUTO_SLOWDOWN_FLAG] = true;
                updateControlState(currentVideo);
            } else if (remainingTime > AUTO_SLOWDOWN_THRESHOLD && window[AUTO_SLOWDOWN_FLAG]) {
                restoreOriginalSpeed();
            }
        }
    }

    function calculateBufferPercent(video, currentTime, duration) {
        let bufferedEnd = currentTime;
        if (video.buffered && video.buffered.length > 0) {
            for (let i = 0; i < video.buffered.length; i++) {
                if (video.buffered.start(i) <= currentTime && video.buffered.end(i) > currentTime) {
                    bufferedEnd = video.buffered.end(i);
                    break;
                }
            }
        }
        return (bufferedEnd / duration) * 100;
    }

    function restoreOriginalSpeed() {
        if (window[AUTO_SLOWDOWN_FLAG] && currentVideo) {
            const speedToRestore = originalSpeedBeforeSlowdown || 0.1;
            setSafeAction(true);
            currentVideo.playbackRate = speedToRestore;
            setSafeAction(false);
            window[AUTO_SLOWDOWN_FLAG] = false;
            originalSpeedBeforeSlowdown = null;
            updateControlState(currentVideo);
        }
    }

    function updateControlState(video) {
        if (!controlPanel || !video) return;
        playPauseButton.className = video.paused ? 'play-button' : 'pause-button';
        playPauseButton.title = video.paused ? "播放" : "暂停";
        const currentRate = video.playbackRate;
        controlPanel.querySelectorAll('.speed-controls button').forEach(btn => {
            btn.classList.toggle('active', Math.abs(parseFloat(btn.dataset.speed) - currentRate) < 0.01);
        });
        muteButton.className = video.muted ? 'mute-button' : 'unmute-button';
        muteButton.title = video.muted ? "取消静音" : "静音";
        updateProgressAndTimers();
        if (!video.paused && !timeUpdateInterval) {
            timeUpdateInterval = setInterval(updateProgressAndTimers, 250);
        } else if (video.paused && timeUpdateInterval) {
            clearInterval(timeUpdateInterval);
            timeUpdateInterval = null;
        }
    }

    function showControls(video) {
        cancelHide();
        if (!controlPanel) createControlPanel();
        currentVideo = video;
        controlPanel.style.display = 'flex';
        controlPanel.classList.add('visible');
        updateControlState(video);
    }

    function scheduleHide() {
        cancelHide();
        if (!window[PIN_PANEL_FLAG] && !isDraggingPanel && !isDraggingProgress) {
            hideTimeout = setTimeout(() => {
                if (controlPanel) controlPanel.classList.remove('visible');
            }, HIDE_DELAY);
        }
    }

    function cancelHide() {
        if (hideTimeout) clearTimeout(hideTimeout);
        hideTimeout = null;
    }

    function handlePlayPause(e) {
        e.stopPropagation();
        if (!currentVideo) return;
        setSafeAction(true);
        if (currentVideo.paused) {
            currentVideo.play();
        } else {
            currentVideo.pause();
        }
        setSafeAction(false);
        updateControlState(currentVideo);
    }

    function resetAutoSlowdownIfNeeded() {
        if (!currentVideo || !currentVideo.duration || !isFinite(currentVideo.duration)) return;
        const remainingTime = currentVideo.duration - currentVideo.currentTime;
        if (remainingTime > AUTO_SLOWDOWN_THRESHOLD && window[AUTO_SLOWDOWN_FLAG]) {
            restoreOriginalSpeed();
        }
    }

    function handleSkipBack(e) {
        e.stopPropagation();
        if (!currentVideo || !currentVideo.duration) return;
        setSafeAction(true);
        currentVideo.currentTime = Math.max(0, currentVideo.currentTime - SKIP_AMOUNT);
        setSafeAction(false);
        resetAutoSlowdownIfNeeded();
        updateProgressAndTimers();
    }

    function handleSkipForward(e) {
        e.stopPropagation();
        if (!currentVideo || !currentVideo.duration) return;
        setSafeAction(true);
        currentVideo.currentTime = Math.min(currentVideo.duration, currentVideo.currentTime + SKIP_AMOUNT);
        setSafeAction(false);
        resetAutoSlowdownIfNeeded();
        updateProgressAndTimers();
    }

    function handleSpeedChange(e) {
        e.stopPropagation();
        if (!currentVideo || isDeploying) return;
        const speed = parseFloat(e.target.dataset.speed);
        setSafeAction(true);
        currentVideo.playbackRate = speed;
        setSafeAction(false);
        allowPauseAtSlowSpeed = speed <= 0.5;
        if (!allowPauseAtSlowSpeed && currentVideo.paused) {
            setSafeAction(true);
            currentVideo.play();
            setSafeAction(false);
        }
        if (window[AUTO_SLOWDOWN_FLAG]) {
            window[AUTO_SLOWDOWN_FLAG] = false;
            originalSpeedBeforeSlowdown = null;
        }
        updateControlState(currentVideo);
    }

    function handleMuteToggle(e) {
        e.stopPropagation();
        if (!currentVideo) return;
        currentVideo.muted = !currentVideo.muted;
        updateControlState(currentVideo);
    }

    async function handleOneClickDeploy(e) {
        e.stopPropagation();
        if (!currentVideo || isDeploying) return;
        if (!isUpdateButtonPresent()) {
            showAutoDismissAlert("请等待“更新进度”按钮出现后再部署！");
            return;
        }

        isDeploying = true;
        isDeploymentPaused = false;
        let currentItem = getActiveItem();
        if (!currentItem) {
            isDeploying = false;
            log("未找到活动项目，部署中止");
            return;
        }

        const startItem = currentItem;
        let passesCompleted = 0;

        log("开始一键部署");

        while (passesCompleted < 2 && isDeploying) {
            let currentPassItem = currentItem;
            log(`第 ${passesCompleted + 1} 轮部署开始，当前项目: ${currentPassItem.textContent.trim().substring(0, 10)}...`);

            while (isDeploying) {
                if (isDeploymentPaused) {
                    log("部署暂停，等待继续");
                    await waitForResume();
                    if (!isDeploying) break;
                    log("部署继续");
                }

                if (isVideoStudied(currentPassItem)) {
                    const nextElement = currentPassItem.nextElementSibling;
                    if (nextElement && nextElement.classList.contains('item')) {
                        currentPassItem = nextElement;
                        nextElement.click();
                        log(`跳过已学习视频，切换至: ${nextElement.textContent.trim().substring(0, 10)}...`);
                        await waitForVideoLoad();
                        continue;
                    } else {
                        log("没有更多视频可切换，结束当前轮次");
                        break;
                    }
                }

                setSafeAction(true);
                currentVideo.playbackRate = 0.1;
                setSafeAction(false);

                if (passesCompleted === 0) {
                    jumpToPercentAndPause(99);
                    await updateProgressOnDeploy();
                } else {
                    await updateProgressOnDeploy();
                }

                checkForCancelButton();

                const nextElement = currentPassItem.nextElementSibling;
                if (nextElement && nextElement.classList.contains('item')) {
                    nextElement.click();
                    currentPassItem = nextElement;
                    log(`切换至下一视频: ${nextElement.textContent.trim().substring(0, 10)}...`);
                    await waitForVideoLoad();
                } else {
                    log("本轮部署完成，无下一视频");
                    break;
                }
            }

            passesCompleted++;
            if (passesCompleted < 2 && isDeploying) {
                startItem.click();
                currentItem = startItem;
                log("返回起始项目，开始第二轮部署");
                await waitForVideoLoad();
            } else if (isDeploying) {
                showChapterEndNotification("🎉 本章已全部部署完成！");
                log("部署完成");
            }
        }
        isDeploying = false;
        log("一键部署结束");
    }

    function toggleDeployPause(e) {
        e.stopPropagation();
        if (!isDeploying) return;
        isDeploymentPaused = !isDeploymentPaused;
        stopDeployButton.className = isDeploymentPaused ? 'continue-deploy-button' : 'stop-deploy-button';
        stopDeployButton.innerHTML = isDeploymentPaused ? '继续部署' : '停止部署';
        log(isDeploymentPaused ? "部署已暂停" : "部署已恢复");
    }

    function waitForResume() {
        return new Promise(resolve => {
            const checkResume = () => {
                if (!isDeploymentPaused || !isDeploying) {
                    resolve();
                } else {
                    setTimeout(checkResume, 100);
                }
            };
            checkResume();
        });
    }

    async function waitForVideoLoad() {
        return new Promise(resolve => {
            const timeout = setTimeout(() => {
                resolve();
            }, 2000);
            const checkVideo = () => {
                const newVideo = document.querySelector('video');
                if (newVideo && newVideo !== currentVideo && newVideo.readyState >= 2) {
                    currentVideo = newVideo;
                    clearTimeout(timeout);
                    log("新视频已加载，准备双重更新");
                    doubleUpdateProgress("视频加载完成").then(() => {
                        resolve();
                    });
                } else {
                    setTimeout(checkVideo, 50);
                }
            };
            checkVideo();
        });
    }

    function handleProgressBarClick(e) {
        if (!currentVideo || !currentVideo.duration || isDraggingProgress) return;
        e.stopPropagation();
        const rect = progressTrack.getBoundingClientRect();
        const seekRatio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        setSafeAction(true);
        currentVideo.currentTime = seekRatio * currentVideo.duration;
        setSafeAction(false);
        resetAutoSlowdownIfNeeded();
        updateProgressAndTimers();
    }

    function handleDragStart(e) {
        if (!currentVideo || !currentVideo.duration) return;
        e.stopPropagation();
        cancelHide();
        isDraggingProgress = true;
        wasPausedBeforeDrag = currentVideo.paused;
        if (timeUpdateInterval) clearInterval(timeUpdateInterval);
        document.addEventListener('mousemove', handleDragMove);
        document.addEventListener('mouseup', handleDragEnd);
        handleDragMove(e);
    }

    function handleDragMove(e) {
        if (!isDraggingProgress || !currentVideo) return;
        e.preventDefault();
        const rect = progressTrack.getBoundingClientRect();
        const seekRatio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const seekTime = seekRatio * currentVideo.duration;
        progressFill.style.width = `${seekRatio * 100}%`;
        progressThumb.style.left = `${seekRatio * 100}%`;
        currentTimeDisplay.textContent = formatTime(seekTime);
    }

    async function handleDragEnd(e) {
        if (!isDraggingProgress || !currentVideo) return;
        e.stopPropagation();
        document.removeEventListener('mousemove', handleDragMove);
        document.removeEventListener('mouseup', handleDragEnd);
        const rect = progressTrack.getBoundingClientRect();
        const seekRatio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        setSafeAction(true);
        currentVideo.currentTime = seekRatio * currentVideo.duration;
        currentVideo.pause();
        setSafeAction(false);
        resetAutoSlowdownIfNeeded();
        isDraggingProgress = false;
        updateProgressAndTimers();
        if (isUpdateButtonPresent()) {
            await updateProgressOnDeploy();
            log("进度条拖动后已更新进度");
        }
        scheduleHide();
    }

    async function jumpToPercentAndPause(percent) {
        if (!currentVideo || !currentVideo.duration) return;
        const seekTime = (percent / 100) * currentVideo.duration;
        setSafeAction(true);
        currentVideo.currentTime = seekTime;
        currentVideo.pause();
        setSafeAction(false);
        resetAutoSlowdownIfNeeded();
        updateControlState(currentVideo);
        if (isUpdateButtonPresent()) {
            await updateProgressOnDeploy();
            log(`跳转至 ${percent}% 后已更新进度`);
        }
    }

    function updatePinButtonState() {
        if (!pinPanelButton) return;
        pinPanelButton.classList.toggle('pinned', window[PIN_PANEL_FLAG]);
    }

    function togglePinPanel(e) {
        e.stopPropagation();
        window[PIN_PANEL_FLAG] = !window[PIN_PANEL_FLAG];
        updatePinButtonState();
        if (!window[PIN_PANEL_FLAG]) scheduleHide();
        else cancelHide();
    }

    function startDraggingPanel(e) {
        e.preventDefault();
        isDraggingPanel = true;
        dragStartX = e.clientX - (parseInt(controlPanel.style.left) || window.innerWidth / 2 - controlPanel.offsetWidth / 2);
        dragStartY = e.clientY - (window.innerHeight - (parseInt(controlPanel.style.bottom) || 20) - controlPanel.offsetHeight);
        document.addEventListener('mousemove', dragPanel);
        document.addEventListener('mouseup', stopDraggingPanel);
        controlPanel.style.transition = 'none';
    }

    function dragPanel(e) {
        if (!isDraggingPanel) return;
        e.preventDefault();
        const x = e.clientX - dragStartX;
        const y = window.innerHeight - (e.clientY - dragStartY) - controlPanel.offsetHeight;
        controlPanel.style.left = `${x}px`;
        controlPanel.style.bottom = `${y}px`;
        controlPanel.style.transform = 'none';
    }

    function stopDraggingPanel() {
        isDraggingPanel = false;
        document.removeEventListener('mousemove', dragPanel);
        document.removeEventListener('mouseup', stopDraggingPanel);
        controlPanel.style.transition = 'opacity 0.3s ease';
        scheduleHide();
    }

    function isValidVideo(video) {
        return video.offsetWidth >= MIN_VIDEO_SIZE && video.offsetHeight >= MIN_VIDEO_SIZE && !video._hasListener_v13;
    }

    async function attachListenersToVideo(video) {
        if (!isValidVideo(video)) return;
        video.addEventListener('mouseenter', () => showControls(video));
        video.addEventListener('mouseleave', scheduleHide);
        video.addEventListener('play', () => showControls(video));
        video.addEventListener('pause', () => updateControlState(video));
        video.addEventListener('ratechange', () => updateControlState(video));
        video.addEventListener('loadedmetadata', async () => {
            video.muted = true;
            setSafeAction(true);
            video.playbackRate = 0.1;
            setSafeAction(false);
            showControls(video);
            await doubleUpdateProgress("视频元数据加载完成");
        });
        video.addEventListener('seeked', updateProgressAndTimers);
        video.addEventListener('progress', updateProgressAndTimers);
        video._hasListener_v13 = true;
    }

    function scanForVideos() {
        document.querySelectorAll('video').forEach(attachListenersToVideo);
    }

    createControlPanel();
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        scanForVideos();
    } else {
        document.addEventListener('DOMContentLoaded', scanForVideos);
    }

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    if (node.tagName === 'VIDEO') attachListenersToVideo(node);
                    else node.querySelectorAll('video').forEach(attachListenersToVideo);
                }
            });
            checkForCancelButton();
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    log("通用视频控制器 (v3.5 - UI修复、人脸拦截、跳转后更新、修复暂停/继续、加载时双重更新、99%跳转、图标修复) 已加载");
})();