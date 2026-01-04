// ==UserScript==
// @name         对话完成提示器(AI Moinitor)
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  监测AI聊天生成是否完成并通知提醒（带音效选择）
// @description:zh-CN 适配已做好，音效未做
// @author       who
// @license GPL-3.0-or-later
// @match https://yuanbao.tencent.com/*
// @match https://chatgpt.com/*
// @match https://chat.deepseek.com/*
// @match https://yiyan.baidu.com/*
// @match https://www.tongyi.com/*
// @grant        GM_addStyle
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/545944/%E5%AF%B9%E8%AF%9D%E5%AE%8C%E6%88%90%E6%8F%90%E7%A4%BA%E5%99%A8%28AI%20Moinitor%29.user.js
// @updateURL https://update.greasyfork.org/scripts/545944/%E5%AF%B9%E8%AF%9D%E5%AE%8C%E6%88%90%E6%8F%90%E7%A4%BA%E5%99%A8%28AI%20Moinitor%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 全局配置变量
    let CONFIG = {};
    let state = {};


    // 域名到完整配置的映射表（包含所有参数）
    const DOMAIN_CONFIG_MAP = {
        // 元宝（腾讯）
        'yuanbao.tencent.com': {
            // 元素选择器
            // 选择器可以是类名、ID或其他CSS选择器
            // 用 # . 来区分ID和类名, className里有多个值就不加.
            TARGET_CLASS: "agent-chat__toolbar__copy__icon",
            SEND_BUTTON_SELECTOR: "#yuanbao-send-btn",
            INPUT_SELECTOR: ".style__text-area__edit___d1yNy",
        },
        // ChatGPT（OpenAI）
        'chatgpt.com': {
            TARGET_CLASS: "text-center",
            SEND_BUTTON_SELECTOR: "#composer-submit-button",
            INPUT_SELECTOR: "ProseMirror",
        },
        // DeepSeek
        'chat.deepseek.com': {
            TARGET_CLASS: "._965abe9",
            SEND_BUTTON_SELECTOR: "bcc55ca1",
            INPUT_SELECTOR: "_77cefa5",
        },
        // doubao  暂不支持
        'www.doubao.com': {
            TARGET_CLASS: "suggest-message-LJeEWd",
            SEND_BUTTON_SELECTOR: ".semi-button-content",
            INPUT_SELECTOR: ".editor-wrapper-AdiwSu",
        },
        // 百度一言
        'yiyan.baidu.com': {
            TARGET_CLASS: ".copy__OMlDWQ7D",
            SEND_BUTTON_SELECTOR: "#sendBtn",
            INPUT_SELECTOR: "yc-editor",
        },
        // 通义千问
        'www.tongyi.com': {
            TARGET_CLASS: "btn--YtZqkWMA",
            SEND_BUTTON_SELECTOR: ".operateBtn--qMhYIdIu",
            INPUT_SELECTOR: ".chatTextarea--RVTXJYOh",
        },
    };

    // 根据域名获取配置
    function getSiteConfig() {
        CONFIG = {
            // 时间设置
            MONITOR_TIMEOUT: 600000, // 10分钟
            ALERT_TIMEOUT: 3000,     // 3秒

            // 音效设置
            DEFAULT_SOUND: "chime",
            DEFAULT_DURATION: 2
        }

        // 状态变量
        state = {
            currentDomain: window.location.hostname,
            toolbarDetected: false,
            sendActionTriggered: false,
            toolbarObserver: null,
            monitoringTimeout: null,
            initialToolbarCount: 0,
            alertContainer: null,
            statusIndicator: null,
            soundSelector: null,
            selectedSound: GM_getValue('selectedSound', CONFIG.DEFAULT_SOUND),
            soundDuration: GM_getValue('soundDuration', CONFIG.DEFAULT_DURATION),
            customSoundUrl: GM_getValue('customSoundUrl', '')
        };

        // 匹配域名和配置
        console.log("当前域名:", state.currentDomain);
        CONFIG = {
            ...CONFIG,
            ...DOMAIN_CONFIG_MAP[state.currentDomain]
        };
    }



    // 添加核心样式 - 确保最高优先级
    GM_addStyle(`
        /* 状态指示器 - 强制显示 */
        #tm-status-indicator {
            position: fixed !important;
            z-index: 2147483647 !important; /* 最高优先级 */
            background: white !important;
            color: black !important;
            border-radius: 8px !important;
            padding: 12px 16px !important;
            font-size: 14px !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
            border: 1px solid rgba(255,255,255,0.1) !important;
            min-width: 150px !important;
            cursor: move !important;
            user-select: none !important;
            display: block !important;
            font-family: Arial, sans-serif !important;
        }

        /* 状态点 */
        #ai-status-dot {
            width: 15px !important;
            height: 15px !important;
            border-radius: 50% !important;
            margin-right: 8px !important;
        }

        /* 状态文本 */
        #ai-status-text {
            display: inline-block !important;
            vertical-align: middle !important;
        }

        /* 设置按钮 */
        #ai-settings-btn {
            background: none !important;
            border: none !important;
            cursor: pointer !important;
        }

        /* 设置面板 */
        #ai-settings-panel {
            margin-top: 8px !important;
            display: none !important;
        }

        #ai-settings-panel.show {
            display: block !important;
        }

        /* 弹窗 - 强制显示 */
        .tm-toolbar-alert {
            position: fixed !important;
            top: 20px !important;
            right: 20px !important;
            width: 320px !important;
            background: linear-gradient(135deg, #1a2a6c, #2c3e50) !important;
            color: white !important;
            border-radius: 12px !important;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3) !important;
            padding: 20px !important;
            z-index: 2147483646 !important; /* 仅次于状态指示器 */
            font-family: 'Segoe UI', Tahoma, sans-serif !important;
            animation: slideIn 0.6s ease-out forwards !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
            display: block !important;
        }

        @keyframes slideIn {
            0% { transform: translateX(120%); opacity: 0; }
            100% { transform: translateX(0); opacity: 1; }
        }

        .tm-toolbar-header {
            display: flex !important;
            align-items: center !important;
            margin-bottom: 15px !important;
            border-bottom: 1px solid rgba(255, 255, 255, 0.15) !important;
            padding-bottom: 12px !important;
        }

        .tm-toolbar-icon {
            width: 40px !important;
            height: 40px !important;
            background: rgba(255, 255, 255, 0.15) !important;
            border-radius: 50% !important;
            margin-right: 15px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-size: 22px !important;
        }

        .tm-toolbar-title {
            font-size: 18px !important;
            font-weight: 600 !important;
        }

        .tm-toolbar-desc {
            font-size: 14px !important;
            line-height: 1.5 !important;
            margin-bottom: 18px !important;
            color: rgba(255, 255, 255, 0.85) !important;
        }

        .tm-toolbar-buttons {
            display: flex !important;
            justify-content: space-between !important;
            gap: 10px !important;
        }

        .tm-toolbar-btn {
            flex: 1 !important;
            padding: 8px 12px !important;
            background: rgba(255, 255, 255, 0.1) !important;
            border: none !important;
            color: white !important;
            border-radius: 8px !important;
            cursor: pointer !important;
            font-weight: 500 !important;
            font-size: 14px !important;
            transition: all 0.25s ease !important;
        }

        .tm-toolbar-btn:hover {
            background: rgba(255, 255, 255, 0.2) !important;
            transform: translateY(-2px) !important;
        }

        .tm-toolbar-btn.main {
            background: #3498db !important;
            font-weight: 600 !important;
        }

        .tm-toolbar-btn.main:hover {
            background: #2980b9 !important;
        }
    `);

    // 初始化函数
    function init() {
        console.log("当前域名：", window.location.hostname);
        // 允许浏览器通知
        if (Notification.permission !== "granted") {
            Notification.requestPermission();
        }

        // 根据不同AI配置选择器
        getSiteConfig();

        // 确保在DOM准备好后执行
        if (document.readyState === 'loading') {
            console.log("当前域名：", window.location.hostname);
            document.addEventListener('DOMContentLoaded', createStatusIndicator);
        } else {
            console.log("当前域名：", window.location.hostname);
            setTimeout(createStatusIndicator, 100);
        }
    }

    // 创建状态指示器 - 核心组件
    function createStatusIndicator() {
        // 如果已存在，先移除
        const existingIndicator = document.getElementById('tm-status-indicator');
        if (existingIndicator) existingIndicator.remove();

        // 创建容器
        state.statusIndicator = document.createElement('div');
        state.statusIndicator.id = 'tm-status-indicator';

        // 加载保存的位置
        const savedPosition = GM_getValue('indicatorPosition', {
            x: window.innerWidth - 280,
            y: window.innerHeight - 100
        });
        state.statusIndicator.style.left = `${savedPosition.x}px`;
        state.statusIndicator.style.top = `${savedPosition.y}px`;

        // 添加新面板结构
        state.statusIndicator.innerHTML = `
            <div style="display:flex;align-items:center;justify-content:space-between;">
                <div style="display:flex;align-items:center;">
                    <div id="ai-status-dot" style="width:15px;height:15px;border-radius:50%;margin-right:8px;"></div>
                    <span id="ai-status-text">等待初始化</span>
                </div>
                <button id="ai-settings-btn" style="background:none;border:none;cursor:pointer;">
                    <svg xmlns="http://www.w3.org/2000/svg" style="width:18px;height:18px;fill:#555;" viewBox="0 0 24 24">
                        <path d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7Zm7.43-2.06 1.97 1.54c.2.16.25.45.11.67l-1.87 3.24c-.14.23-.43.31-.66.21l-2.32-.93a7.05 7.05 0 0 1-1.52.88l-.35 2.48a.5.5 0 0 1-.5.43h-3.74a.5.5 0 0 1-.5-.43l-.35-2.48a7.05 7.05 0 0 1-1.52-.88l-2.32.93a.5.5 0 0 1-.66-.21l-1.87-3.24a.5.5 0 0 1 .11-.67l1.97-1.54a6.97 6.97 0 0 1 0-1.76l-1.97-1.54a.5.5 0 0 1-.11-.67l1.87-3.24c.14-.23.43-.31.66-.21l2.32.93c.47-.36.98-.66 1.52-.88l.35-2.48a.5.5 0 0 1 .5-.43h3.74a.5.5 0 0 1 .5.43l.35 2.48c.54.22 1.05.52 1.52.88l2.32-.93c.23-.1.52-.02.66.21l1.87 3.24c.14.22.09.51-.11.67l-1.97 1.54c.07.29.11.59.11.88s-.04.59-.11.88Z"/>
                    </svg>
                </button>
            </div>
            <div id="ai-settings-panel" style="margin-top:8px;">
                <label><input type="radio" name="soundType" value="off">关</label><br>
                <label><input type="radio" name="soundType" value="bell">铃声</label><br>
                <label><input type="radio" name="soundType" value="dingdong">叮咚</label><br>
                <label>播放时长: <input type="number" id="ai-sound-duration" min="0" max="5" step="1" style="width:40px;"> 秒</label><br>
                <button id="ai-save-settings">保存</button>
            </div>
        `;

        // 添加到文档
        document.body.appendChild(state.statusIndicator);

        // 更新初始状态
        updateStatus('idle', '已初始化');

        // 设置初始音效选择
        setupSoundSelector();

        // 添加事件监听器
        document.getElementById('ai-settings-btn').addEventListener('click', toggleSettingsPanel);
        document.getElementById('ai-save-settings').addEventListener('click', saveSoundSettings);

        // 添加拖动功能
        addDragFunctionality();

        // 初始化其他组件
        setupEventListeners();
    }

    // 添加拖动功能
    function addDragFunctionality() {
        let isDragging = false;
        let dragOffsetX = 0;
        let dragOffsetY = 0;

        state.statusIndicator.addEventListener('mousedown', function(e) {
            // 防止在设置按钮上拖动
            if (e.target.closest('#ai-settings-btn') || e.target.closest('#ai-settings-panel')) {
                return;
            }

            isDragging = true;
            dragOffsetX = e.clientX - state.statusIndicator.getBoundingClientRect().left;
            dragOffsetY = e.clientY - state.statusIndicator.getBoundingClientRect().top;
            document.addEventListener('mousemove', dragIndicator);
            document.addEventListener('mouseup', stopDragging);
        });

        function dragIndicator(e) {
            if (!isDragging) return;

            const x = e.clientX - dragOffsetX;
            const y = e.clientY - dragOffsetY;

            // 限制在窗口范围内
            const maxX = window.innerWidth - state.statusIndicator.offsetWidth;
            const maxY = window.innerHeight - state.statusIndicator.offsetHeight;

            state.statusIndicator.style.left = `${Math.max(0, Math.min(x, maxX))}px`;
            state.statusIndicator.style.top = `${Math.max(0, Math.min(y, maxY))}px`;
        }

        function stopDragging() {
            isDragging = false;

            // 保存位置
            const rect = state.statusIndicator.getBoundingClientRect();
            GM_setValue('indicatorPosition', {
                x: rect.left + window.scrollX,
                y: rect.top + window.scrollY
            });

            document.removeEventListener('mousemove', dragIndicator);
            document.removeEventListener('mouseup', stopDragging);
        }
    }

    // 切换设置面板显示
    function toggleSettingsPanel(e) {
        e.stopPropagation();
        const settingsPanel = document.getElementById('ai-settings-panel');
        settingsPanel.classList.toggle('show');
    }

    // 设置初始音效选择
    function setupSoundSelector() {
        const settingsPanel = document.getElementById('ai-settings-panel');

        // 设置选中的音效类型
        const soundTypeMap = {
            chime: 'bell',
            ding: 'dingdong',
            off: 'off'
        };

        const reverseMap = {
            bell: 'chime',
            dingdong: 'ding',
            off: 'off'
        };

        const currentSelection = reverseMap[state.selectedSound] || state.selectedSound;
        const radioBtn = settingsPanel.querySelector(`input[value="${currentSelection}"]`);
        if (radioBtn) radioBtn.checked = true;

        // 设置音效时长
        const durationInput = document.getElementById('ai-sound-duration');
        durationInput.value = state.soundDuration;
    }

    // 保存音效设置
    function saveSoundSettings() {
        const soundType = document.querySelector('input[name="soundType"]:checked')?.value || 'chime';
        const durationInput = document.getElementById('ai-sound-duration');
        const duration = parseFloat(durationInput.value) || state.soundDuration;

        // 映射到原音效类型
        const soundMap = {
            bell: 'chime',
            dingdong: 'ding',
            off: 'off'
        };

        state.selectedSound = soundMap[soundType] || soundType;
        state.soundDuration = duration;

        GM_setValue('selectedSound', state.selectedSound);
        GM_setValue('soundDuration', state.soundDuration);

        document.getElementById('ai-settings-panel').classList.remove('show');
    }

    // 更新状态显示
    function updateStatus(stateType, message) {
        const statusDot = document.getElementById('ai-status-dot');
        const statusText = document.getElementById('ai-status-text');

        if (!statusDot || !statusText) {
            // 如果元素不存在，重新创建状态指示器
            createStatusIndicator();
            return;
        }

        switch(stateType) {
            case 'idle':
                statusDot.style.background =  '#2ecc71';
                break;
            case 'waiting':
                statusDot.style.background = '#f1c40f';
                break;
            case 'active':
                statusDot.style.background = '#e74c3c';
                break;
        }

        statusText.textContent = message;
        console.log(`[AI Monitor] ${message}`);
    }

    // 设置事件监听器
    function setupEventListeners() {
        console.log("CONFIG:", CONFIG);
        console.log("发送键选择器",CONFIG.SEND_BUTTON_SELECTOR);
        console.log("输入框选择器：", CONFIG.INPUT_SELECTOR);
        console.log("当前目标个数:", getToolbarCount());
        // 查找发送按钮
        findAndMonitorElement(CONFIG.SEND_BUTTON_SELECTOR, (button) => {
            button.addEventListener('click', handleSendAction);
            console.log("发送键等待发送", button);
            updateStatus('idle', '等待发送');
        });

        // 查找输入框
        findAndMonitorElement(CONFIG.INPUT_SELECTOR, (input) => {
            input.addEventListener('keydown', handleKeyDown);
            console.log("输入框等待发送", input);
            updateStatus('idle', '等待发送');
        });
    }

    // 通用元素查找和监控
    function findAndMonitorElement(selector, callback) {
        // 处理各种选择器类型
        const normalizedSelector = normalizeSelector(selector);

        // 如果已经有匹配元素立即执行回调
        const existingElement = document.querySelector(normalizedSelector);
        if (existingElement) {
            callback(existingElement);
            return;
        }

        // 监听DOM变化以捕获动态加载的元素
        const observer = new MutationObserver(() => {
            const element = document.querySelector(normalizedSelector);
            if (element) {
                observer.disconnect(); // 找到后停止观察
                callback(element);
            }
        });

        // 开始观察整个文档
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 标准化选择器处理
    function normalizeSelector(selector) {
        // 如果选择器以#开头，直接使用（ID选择器）
        if (selector.startsWith('#')) {
            return selector;
        }

        // 如果选择器以.开头，直接使用（类选择器）
        if (selector.startsWith('.')) {
            return selector;
        }

        // 如果包含空格说明是复合选择器，直接使用
        if (selector.includes(' ')) {
            return selector;
        }

        // 尝试用类选择器查找
        return `.${selector}`;
    }

    // 处理键盘事件
    function handleKeyDown(event) {
        if ((event.key === 'Enter' || event.keyCode === 13) && !event.shiftKey) {
            handleSendAction();
        }
    }

    // 处理发送动作
    function handleSendAction() {
        // 关闭现有弹窗
        closeAlert();

        // 重置状态
        resetMonitoringState();

        // 开始新监测
        startToolbarMonitoring();
    }

    // 启动工具栏监控
    function startToolbarMonitoring() {
        // 清除现有监控
        if (state.toolbarObserver) state.toolbarObserver.disconnect();
        if (state.monitoringTimeout) clearTimeout(state.monitoringTimeout);

        // 记录初始状态
        state.toolbarDetected = false;
        state.sendActionTriggered = true;
        state.initialToolbarCount = getToolbarCount();

        updateStatus('waiting', '生成中...');

        // 初始检查
        if (checkForNewToolbar()) return;

        // 设置DOM监控
        state.toolbarObserver = new MutationObserver(() => {
            if (checkForNewToolbar()) {
                state.toolbarObserver.disconnect();
            }
        });

        state.toolbarObserver.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 设置超时
        state.monitoringTimeout = setTimeout(() => {
            if (state.toolbarObserver) state.toolbarObserver.disconnect();
            updateStatus('idle', '监控超时，准备下一次发送');
        }, CONFIG.MONITOR_TIMEOUT);
    }

    // 检查新工具栏
    function checkForNewToolbar() {
        const currentCount = getToolbarCount();
        if (currentCount > state.initialToolbarCount && !state.toolbarDetected) {
            state.toolbarDetected = true;
            showToolbarAlert();
            state.initialToolbarCount = currentCount;
            return true;
        }
        return false;
    }

    // 获取工具栏数量
    function getToolbarCount() {
        try{
            return document.querySelectorAll(`.${CONFIG.TARGET_CLASS}`).length
        }catch(e) {
            console.warn("获取工具栏数量失败:", e);
            try{
                return document.querySelectorAll(CONFIG.TARGET_CLASS).length;
            }catch(e2) {
                console.error("再次尝试获取工具栏数量失败:", e2);
                console.error("生成结束标志选择有误，尝试使用类名获取工具栏数量");
            }
        }
    }

    // 显示工具栏通知
    function showToolbarAlert() {
        // 关闭现有弹窗
        closeAlert();

        // 创建新弹窗
        state.alertContainer = document.createElement('div');
        state.alertContainer.className = 'tm-toolbar-alert';
        state.alertContainer.innerHTML = `
            <div class="tm-toolbar-desc">
                内容已生成完毕
            </div>
            <div class="tm-toolbar-buttons">
                <button class="tm-toolbar-btn" id="tm-close-alert">关闭</button>
            </div>
        `;

        // 浏览器通知
        if (Notification.permission === "granted") {
            new Notification("内容已生成完毕", { body: "请到浏览器查看" });
        }

        // Tampermonkey 系统通知
        GM_notification({
            title: "内容生成完毕",
            timeout: 5000,
            onclick: () => {
                window.focus();
            }
        });

        document.body.appendChild(state.alertContainer);

        // 添加事件
        document.getElementById('tm-close-alert').addEventListener('click', closeAlert);

        // 设置自动关闭
        setTimeout(closeAlert, CONFIG.ALERT_TIMEOUT);

        // 更新状态
        updateStatus('idle', '等待发送');
        playSound();
    }

    // 播放音效
    function playSound() {
        if (state.selectedSound === 'off') return;

        let soundUrl;

        switch(state.selectedSound) {
            case 'chime':
                soundUrl = 'https://assets.mixkit.co/sfx/preview/mixkit-melodic-bonus-collect-1938.mp3';
                break;
            case 'beep':
                soundUrl = 'https://assets.mixkit.co/sfx/preview/mixkit-retro-game-notification-212.mp3';
                break;
            case 'ding':
                soundUrl = 'https://assets.mixkit.co/sfx/preview/mixkit-correct-answer-tone-2870.mp3';
                break;
            case 'bell':
                soundUrl = 'https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3';
                break;
            case 'custom':
                soundUrl = state.customSoundUrl;
                break;
            default:
                soundUrl = 'https://assets.mixkit.co/sfx/preview/mixkit-melodic-bonus-collect-1938.mp3';
        }

        if (!soundUrl) return;

        try {
            const audio = new Audio(soundUrl);
            audio.volume = 0.5;
            audio.play();

            // 设置停止时间
            setTimeout(() => {
                audio.pause();
                audio.currentTime = 0;
            }, state.soundDuration * 1000);
        } catch (e) {
            console.error('音效播放失败:', e);
        }
    }

    // 关闭弹窗
    function closeAlert() {
        if (state.alertContainer && state.alertContainer.parentNode) {
            state.alertContainer.parentNode.removeChild(state.alertContainer);
            state.alertContainer = null;
        }
    }



    // 重置监控状态
    function resetMonitoringState() {
        if (state.toolbarObserver) {
            state.toolbarObserver.disconnect();
            state.toolbarObserver = null;
        }

        if (state.monitoringTimeout) {
            clearTimeout(state.monitoringTimeout);
            state.monitoringTimeout = null;
        }

        state.toolbarDetected = false;
        state.sendActionTriggered = false;
        updateStatus('idle', '准备下一次发送');
    }

    // 启动脚本
    init();
})();