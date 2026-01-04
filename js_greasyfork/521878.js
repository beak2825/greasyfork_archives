// ==UserScript==
// @name         小鹅通增强版视频控制面板(修复版)
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  支持方向键和自定义快捷键的视频控制面板,包含全屏模式下的迷你控制面板
// @author       Claude
// @match        *://*.xiaoeknow.com/*
// @match        *://*.xe-live.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/521878/%E5%B0%8F%E9%B9%85%E9%80%9A%E5%A2%9E%E5%BC%BA%E7%89%88%E8%A7%86%E9%A2%91%E6%8E%A7%E5%88%B6%E9%9D%A2%E6%9D%BF%28%E4%BF%AE%E5%A4%8D%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/521878/%E5%B0%8F%E9%B9%85%E9%80%9A%E5%A2%9E%E5%BC%BA%E7%89%88%E8%A7%86%E9%A2%91%E6%8E%A7%E5%88%B6%E9%9D%A2%E6%9D%BF%28%E4%BF%AE%E5%A4%8D%E7%89%88%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 元素ID常量
    const PANEL_ID = 'xe-video-control-panel';
    const TIME_DISPLAY_ID = 'xe-time-display';
    const SPEED_INDICATOR_ID = 'xe-speed-indicator';
    const MINI_BUTTON_ID = 'xe-mini-control-button';

    // 配置参数（支持本地存储）
    let config = {
        seekTime: GM_getValue('seekTime', 5),        // 步进时间
        speedUp: GM_getValue('speedUp', 1.5),        // 加速倍率
        longPressTime: 300,                          // 长按判定时间
        seekBackward: GM_getValue('seekBackward', 'arrowleft'), // 默认后退键
        seekForward: GM_getValue('seekForward', 'arrowright')   // 默认前进键
    };

    // 状态管理
    let state = {
        keyPressTime: {},           // 记录按键按下时间
        keyStates: {},             // 记录按键状态
        originalPlaybackRate: 1,    // 原始播放速度
        timeDisplay: null,          // 时间显示元素
        speedIndicator: null,       // 速度显示元素
        isControlPanelMinimized: false,  // 控制面板是否最小化
        isFullscreen: false,        // 是否全屏
        miniControlButton: null,    // 迷你控制按钮
        currentKeyCapturing: null,  // 当前正在捕获的快捷键类型
        monitorTimer: null,         // 监控定时器
        recoveryAttempts: 0,        // 恢复尝试次数
    };

    const MAX_RECOVERY_ATTEMPTS = 5;  // 最大恢复尝试次数

    // 工具函数：移除指定ID的元素
    function removeElementById(id) {
        const element = document.getElementById(id);
        if (element) {
            element.remove();
        }
    }

    // 工具函数：检查面板是否已存在
    function isPanelExists() {
        return !!document.getElementById(PANEL_ID);
    }

    // 创建视觉反馈指示器
    function createIndicators() {
        // 先清理已存在的指示器
        removeElementById(TIME_DISPLAY_ID);
        removeElementById(SPEED_INDICATOR_ID);

        // 创建时间显示器
        state.timeDisplay = document.createElement('div');
        state.timeDisplay.id = TIME_DISPLAY_ID;
        state.timeDisplay.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 12px 24px;
            border-radius: 24px;
            font-size: 16px;
            font-weight: bold;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s;
            z-index: 999999;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
        `;
        document.body.appendChild(state.timeDisplay);

        // 创建速度显示器
        state.speedIndicator = document.createElement('div');
        state.speedIndicator.id = SPEED_INDICATOR_ID;
        state.speedIndicator.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(33, 150, 243, 0.9);
            color: white;
            padding: 10px 20px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: bold;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s;
            z-index: 999999;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        `;
        document.body.appendChild(state.speedIndicator);
    }

    // 显示提示信息
    function showIndicator(element, text, duration = 800) {
        if (!element) return;

        element.textContent = text;
        element.style.opacity = '1';

        // 使用防抖处理
        clearTimeout(element.fadeTimeout);
        element.fadeTimeout = setTimeout(() => {
            element.style.opacity = '0';
        }, duration);
    }

    // 执行视频步进
    function performSeek(direction) {
        const video = document.querySelector('video');
        if (!video) {
            console.log('未找到视频元素，尝试恢复...');
            attemptRecovery();
            return;
        }

        try {
            const newTime = direction === 'forward' ?
                Math.min(video.duration, video.currentTime + config.seekTime) :
                Math.max(0, video.currentTime - config.seekTime);

            video.currentTime = newTime;

            showIndicator(state.timeDisplay,
                direction === 'forward' ?
                    `⏩ ${config.seekTime}秒` :
                    `⏪ ${config.seekTime}秒`
            );
        } catch (error) {
            console.error('步进操作失败:', error);
            attemptRecovery();
        }
    }

    // 控制播放速度
    function controlPlaybackRate(shouldSpeedUp) {
        const video = document.querySelector('video');
        if (!video) {
            attemptRecovery();
            return;
        }

        try {
            if (shouldSpeedUp && video.playbackRate !== config.speedUp) {
                state.originalPlaybackRate = video.playbackRate;
                video.playbackRate = config.speedUp;
                showIndicator(state.speedIndicator, `⚡ ${config.speedUp}x`, 1000);
            } else if (!shouldSpeedUp && video.playbackRate !== state.originalPlaybackRate) {
                video.playbackRate = state.originalPlaybackRate;
                showIndicator(state.speedIndicator, `► ${state.originalPlaybackRate}x`, 1000);
            }
        } catch (error) {
            console.error('播放速度控制失败:', error);
            attemptRecovery();
        }
    }

    // 创建迷你控制按钮
    function createMiniControlButton() {
        // 先清理已存在的迷你按钮
        removeElementById(MINI_BUTTON_ID);

        const button = document.createElement('div');
        button.innerHTML = `
            <div id="${MINI_BUTTON_ID}" style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(33, 33, 33, 0.7);
                color: white;
                padding: 8px;
                border-radius: 50%;
                font-size: 16px;
                cursor: pointer;
                z-index: 999999;
                opacity: 0;
                transition: opacity 0.3s;
            "⚙️</div>
        `;
        document.body.appendChild(button);

        const miniButton = button.querySelector(`#${MINI_BUTTON_ID}`);

        miniButton.addEventListener('mouseenter', () => {
            miniButton.style.opacity = '1';
        });

        miniButton.addEventListener('mouseleave', () => {
            if (!state.isControlPanelMinimized) {
                miniButton.style.opacity = '0';
            }
        });

        miniButton.addEventListener('click', () => {
            const panel = document.getElementById(PANEL_ID);
            if (panel) {
                panel.style.display = 'block';
                state.isControlPanelMinimized = false;
            }
        });

        return miniButton;
    }

    // 创建快捷键配置界面
    function createKeyConfigPanel() {
        const keyConfig = document.createElement('div');
        keyConfig.innerHTML = `
            <div style="margin-top: 12px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 12px;">
                <div style="margin-bottom: 8px;">快捷键设置</div>
                <div style="display: grid; grid-template-columns: auto 1fr; gap: 8px; align-items: center;">
                    <span>后退键:</span>
                    <button id="backward-key" class="hotkey-button" style="
                        padding: 4px 8px;
                        background: rgba(255,255,255,0.1);
                        border: 1px solid rgba(255,255,255,0.2);
                        border-radius: 4px;
                        color: white;
                        cursor: pointer;
                    ">${config.seekBackward === 'arrowleft' ? '←' : config.seekBackward.toUpperCase()}</button>

                    <span>前进键:</span>
                    <button id="forward-key" class="hotkey-button" style="
                        padding: 4px 8px;
                        background: rgba(255,255,255,0.1);
                        border: 1px solid rgba(255,255,255,0.2);
                        border-radius: 4px;
                        color: white;
                        cursor: pointer;
                    ">${config.seekForward === 'arrowright' ? '→' : config.seekForward.toUpperCase()}</button>
                </div>
                <div style="margin-top: 8px; font-size: 11px; color: #aaa;">
                    点击按钮后按下新的按键来更改快捷键
                </div>
            </div>
        `;
        return keyConfig;
    }

    // 设置快捷键配置功能
    function setupHotkeyConfiguration() {
        const backwardBtn = document.getElementById('backward-key');
        const forwardBtn = document.getElementById('forward-key');
        if (!backwardBtn || !forwardBtn) return;

        function startKeyCapture(button, keyType) {
            button.textContent = '请按键...';
            state.currentKeyCapturing = keyType;
            button.style.background = 'rgba(33, 150, 243, 0.3)';
        }

        function stopKeyCapture(button, key) {
            button.textContent = key === 'arrowleft' ? '←' :
                key === 'arrowright' ? '→' :
                    key.toUpperCase();
            state.currentKeyCapturing = null;
            button.style.background = 'rgba(255,255,255,0.1)';
        }

        backwardBtn.addEventListener('click', () => {
            startKeyCapture(backwardBtn, 'backward');
        });

        forwardBtn.addEventListener('click', () => {
            startKeyCapture(forwardBtn, 'forward');
        });

        // 只添加一次全局按键监听
        if (!window.hotkeyListenerAdded) {
            document.addEventListener('keydown', (e) => {
                if (state.currentKeyCapturing) {
                    e.preventDefault();
                    const key = e.key.toLowerCase();

                    if (state.currentKeyCapturing === 'backward') {
                        if (key !== config.seekForward) {
                            config.seekBackward = key;
                            GM_setValue('seekBackward', key);
                            stopKeyCapture(backwardBtn, key);
                            state.keyStates = {};
                            state.keyPressTime = {};
                        }
                    } else {
                        if (key !== config.seekBackward) {
                            config.seekForward = key;
                            GM_setValue('seekForward', key);
                            stopKeyCapture(forwardBtn, key);
                            state.keyStates = {};
                            state.keyPressTime = {};
                        }
                    }
                }
            });
            window.hotkeyListenerAdded = true;
        }
    }

    // 创建主控制面板
    function createControlPanel() {
        // 检查是否已存在面板
        if (isPanelExists()) {
            return document.getElementById(PANEL_ID);
        }

        const panel = document.createElement('div');
        panel.innerHTML = `
            <div id="${PANEL_ID}" style="
                position: fixed;
                top: 100px;
                right: 20px;
                background: rgba(33, 33, 33, 0.9);
                border-radius: 8px;
                padding: 12px;
                color: white;
                font-size: 12px;
                z-index: 9999999;
                min-width: 200px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.3);
                transition: transform 0.3s;
            ">
                <div id="panel-header" style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 10px;
                    cursor: move;
                    user-select: none;
                ">
                    <span style="font-weight: bold;">视频控制面板</span>
                    <div style="display: flex; gap: 8px;">
                        <button id="minimize-panel" style="
                            background: none;
                            border: none;
                            color: white;
                            cursor: pointer;
                            padding: 0 4px;
                        ">_</button>
                        <button id="close-panel" style="
                            background: none;
                            border: none;
                            color: white;
                            cursor: pointer;
                            padding: 0 4px;
                        ">×</button>
                    </div>
                </div>
                <div id="panel-content">
                    <div style="margin-bottom: 12px;">
                        <div style="margin-bottom: 4px;">步进时间 (秒)</div>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <input type="range" id="seek-time" min="1" max="30" step="1"
                                value="${config.seekTime}"
                                style="flex: 1;"
                            >
                            <span id="seek-time-value">${config.seekTime}s</span>
                        </div>
                    </div>
                    <div style="margin-bottom: 12px;">
                        <div style="margin-bottom: 4px;">长按加速倍率</div>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <input type="range" id="speed-up"
                                min="1" max="3" step="0.25"
                                value="${config.speedUp}"
                                style="flex: 1;"
                            >
                            <span id="speed-up-value">${config.speedUp}x</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(panel);

        // 添加快捷键配置界面
        const panelContent = panel.querySelector('#panel-content');
        panelContent.appendChild(createKeyConfigPanel());

        // 设置控制面板的基本功能
        setupControlPanel(panel);

        // 设置快捷键配置功能
        setupHotkeyConfiguration();

        return panel;
    }

    // 设置控制面板的基本功能
    function setupControlPanel(panel) {
        const controlPanel = panel.querySelector(`#${PANEL_ID}`);
        const minimizeBtn = panel.querySelector('#minimize-panel');
        const closeBtn = panel.querySelector('#close-panel');
        const seekTimeSlider = panel.querySelector('#seek-time');
        const speedUpSlider = panel.querySelector('#speed-up');
        const seekTimeValue = panel.querySelector('#seek-time-value');
        const speedUpValue = panel.querySelector('#speed-up-value');
        const panelHeader = panel.querySelector('#panel-header');

        // 拖动功能实现
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

        panelHeader.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);

        function dragStart(e) {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
            if (e.target === panelHeader) {
                isDragging = true;
            }
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                xOffset = currentX;
                yOffset = currentY;
                controlPanel.style.transform = `translate(${currentX}px, ${currentY}px)`;
            }
        }

        function dragEnd() {
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
        }

        // 最小化功能
        minimizeBtn.addEventListener('click', () => {
            state.isControlPanelMinimized = !state.isControlPanelMinimized;
            panel.querySelector('#panel-content').style.display =
                state.isControlPanelMinimized ? 'none' : 'block';
            minimizeBtn.textContent = state.isControlPanelMinimized ? '□' : '_';
            controlPanel.style.minWidth = state.isControlPanelMinimized ? 'auto' : '200px';

            // 如果在全屏模式下，显示/隐藏迷你按钮
            if (state.miniControlButton) {
                state.miniControlButton.style.opacity = state.isControlPanelMinimized ? '1' : '0';
            }
        });

        // 关闭功能
        closeBtn.addEventListener('click', () => {
            controlPanel.style.display = 'none';
            if (state.miniControlButton) {
                state.miniControlButton.style.opacity = '1';
            }
        });

        // 滑块控制
        seekTimeSlider.addEventListener('input', function () {
            config.seekTime = parseInt(this.value);
            seekTimeValue.textContent = `${config.seekTime}s`;
            GM_setValue('seekTime', config.seekTime);
        });

        speedUpSlider.addEventListener('input', function () {
            config.speedUp = parseFloat(this.value);
            speedUpValue.textContent = `${config.speedUp}x`;
            GM_setValue('speedUp', config.speedUp);
        });
    }

    // 视频状态监控
    function startVideoMonitoring() {
        let lastPlaybackTime = 0;

        function checkVideoState() {
            const video = document.querySelector('video');
            if (!video) {
                console.log('视频元素丢失，尝试恢复...');
                attemptRecovery();
                return;
            }

            // 检查视频是否卡住
            if (!video.paused && lastPlaybackTime === video.currentTime) {
                console.log('视频可能卡住了，尝试恢复...');
                attemptRecovery();
            }

            lastPlaybackTime = video.currentTime;
        }

        // 清理已存在的监控
        if (state.monitorTimer) {
            clearInterval(state.monitorTimer);
        }

        // 启动新的监控
        state.monitorTimer = setInterval(checkVideoState, 1000);
        return state.monitorTimer;
    }

    // 恢复机制
    function attemptRecovery() {
        if (state.recoveryAttempts >= MAX_RECOVERY_ATTEMPTS) {
            console.log('达到最大恢复尝试次数');
            return;
        }

        state.recoveryAttempts++;
        console.log(`尝试恢复控制 (${state.recoveryAttempts}/${MAX_RECOVERY_ATTEMPTS})`);

        // 清理现有状态
        cleanup();

        // 延迟重新初始化
        setTimeout(() => {
            initializeControls();
            if (document.querySelector('video')) {
                state.recoveryAttempts = 0; // 如果成功找到视频元素，重置计数器
            }
        }, 1000 * state.recoveryAttempts);
    }

    // 清理函数
    function cleanup() {
        if (state.monitorTimer) {
            clearInterval(state.monitorTimer);
            state.monitorTimer = null;
        }
        state.keyStates = {};
        state.keyPressTime = {};
    }

    // 监听全屏变化
    function setupFullscreenTracking() {
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('mozfullscreenchange', handleFullscreenChange);
        document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    }

    // 处理全屏变化
    function handleFullscreenChange() {
        state.isFullscreen = document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement;

        if (state.isFullscreen) {
            if (!state.miniControlButton) {
                state.miniControlButton = createMiniControlButton();
            }
            state.miniControlButton.style.display = 'block';
        } else {
            if (state.miniControlButton) {
                state.miniControlButton.style.display = 'none';
            }
        }
    }

    // 处理按键按下事件
    function handleKeyDown(e) {
        const key = e.key.toLowerCase();
        if (key !== config.seekBackward && key !== config.seekForward) return;
        if (state.currentKeyCapturing) return;

        e.preventDefault();
        e.stopPropagation();

        if (!state.keyStates[key]) {
            state.keyStates[key] = true;
            state.keyPressTime[key] = Date.now();
        }
    }

    // 处理按键释放事件
    function handleKeyUp(e) {
        const key = e.key.toLowerCase();
        if (key !== config.seekBackward && key !== config.seekForward) return;
        if (state.currentKeyCapturing) return;

        e.preventDefault();
        e.stopPropagation();

        const pressDuration = Date.now() - state.keyPressTime[key];
        state.keyStates[key] = false;

        // 如果不是长按，执行步进
        if (pressDuration < config.longPressTime) {
            performSeek(key === config.seekForward ? 'forward' : 'backward');
        }

        // 检查是否需要恢复正常速度
        if (!state.keyStates[config.seekBackward] && !state.keyStates[config.seekForward]) {
            controlPlaybackRate(false);
        }
    }

    // 检查长按状态
    function checkLongPress() {
        Object.keys(state.keyStates).forEach(key => {
            if (state.keyStates[key] && (Date.now() - state.keyPressTime[key] >= config.longPressTime)) {
                controlPlaybackRate(true);
            }
        });
    }

    // 初始化所有控制功能
    function initializeControls() {
        // 检查是否已经初始化
        if (isPanelExists()) {
            console.log('控制面板已存在，跳过初始化');
            return;
        }

        createIndicators();
        createControlPanel();
        setupFullscreenTracking();

        // 初始化按键状态
        state.keyStates[config.seekBackward] = false;
        state.keyStates[config.seekForward] = false;

        // 添加键盘事件监听
        document.removeEventListener('keydown', handleKeyDown, true);
        document.removeEventListener('keyup', handleKeyUp, true);
        document.addEventListener('keydown', handleKeyDown, true);
        document.addEventListener('keyup', handleKeyUp, true);

        // 启动视频监控
        startVideoMonitoring();

        // 启动长按检测
        setInterval(checkLongPress, 100);

        // 监听进度条拖动
        const video = document.querySelector('video');
        if (video) {
            video.addEventListener('seeking', () => {
                console.log('检测到进度条拖动，重新初始化控制...');
                setTimeout(attemptRecovery, 100);
            });

            video.addEventListener('error', (e) => {
                console.error('视频错误:', e);
                attemptRecovery();
            });
        }

        console.log('视频控制已初始化：\n- 左右方向键：后退/前进\n- 长按方向键：加速播放\n- 支持全屏模式下的迷你控制面板');
    }

    // 等待视频元素加载
    function waitForVideo() {
        if (isPanelExists()) {
            console.log('控制面板已存在，无需重新等待');
            return;
        }

        const observer = new MutationObserver((mutations, observer) => {
            if (document.querySelector('video')) {
                initializeControls();
                observer.disconnect();
            }
        });

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    }

    // 页面可见性变化监听
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            console.log('页面重新可见，检查控制状态...');
            if (!isPanelExists()) {
                attemptRecovery();
            }
        }
    });

    // 网络状态变化监听
    window.addEventListener('online', () => {
        console.log('网络恢复，检查控制状态...');
        if (!isPanelExists()) {
            attemptRecovery();
        }
    });

    // 初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForVideo);
    } else {
        waitForVideo();
    }
})();