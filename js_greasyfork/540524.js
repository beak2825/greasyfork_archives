// ==UserScript==
// @name         征纳互动人数和在线监控
// @namespace    http://tampermonkey.net/
// @version      25.7.22
// @description  监控征纳互动等待人数变化，是否离线，并进行语音提示，带折叠面板
// @author       runos
// @match        https://znhd.hunan.chinatax.gov.cn:8443/*
// @icon         data:image/png;base64,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
// @grant        GM_addStyle
// @grant        unsafeWindow
// @homepage     https://scriptcat.org/zh-CN/script-show-page/3650
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540524/%E5%BE%81%E7%BA%B3%E4%BA%92%E5%8A%A8%E4%BA%BA%E6%95%B0%E5%92%8C%E5%9C%A8%E7%BA%BF%E7%9B%91%E6%8E%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/540524/%E5%BE%81%E7%BA%B3%E4%BA%92%E5%8A%A8%E4%BA%BA%E6%95%B0%E5%92%8C%E5%9C%A8%E7%BA%BF%E7%9B%91%E6%8E%A7.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 添加自定义样式
    GM_addStyle(`
        #monitorLogContainer {
            position: fixed;
            top: 10px; /* 减小 top 值，将面板向上移动 */
            right: 500px;
            width: 300px;
            background: #ffffff; /* 更纯净的白色背景 */
            border: none; /* 移除边框 */
            border-radius: 12px; /* 更大的圆角 */
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1); /* 更柔和的阴影 */
            z-index: 9999;
            font-family: 'Segoe UI', Roboto, sans-serif; /* 更现代的字体 */
            max-height: 250px;
            overflow: hidden;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); /* 更顺滑的过渡效果 */
        }

        #monitorLogContainer.collapsed {
            max-height: none; /* 移除最大高度限制，仅折叠日志部分 */
            overflow: hidden;
        }

        #monitorLogHeader {
            background-color: #f5f5f5; /* 更柔和的头部背景色 */
            padding: 10px; /* 调小头部内边距 */
            border-bottom: none; /* 移除边框 */
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
            border-top-left-radius: 12px;
            border-top-right-radius: 12px;
            font-size: 12px; /* 调小头部字体大小 */
        }

        #monitorLogs {
            padding: 16px;
            font-size: 14px; /* 更大的字体 */
            max-height: 200px;
            overflow-y: auto;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); /* 更顺滑的过渡效果 */
        }

        #monitorLogContainer.collapsed #monitorLogs {
            display: none;
        }

        .log-item {
            padding: 8px 0;
            border-bottom: 1px solid #eeeeee; /* 更柔和的分割线 */
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .log-warning {
            color: #ff9800; /* 更鲜明的警告色 */
        }

        .log-info {
            color: #2196f3; /* 更鲜明的信息色 */
        }

        .log-success {
            color: #4caf50; /* 更鲜明的成功色 */
        }

        #toggleCollapseBtn, #toggleVoiceBtn {
            background: #2196f3; /* 统一按钮颜色 */
            color: white;
            border: none;
            padding: 4px 10px; /* 调小按钮内边距 */
            border-radius: 8px; /* 按钮圆角 */
            cursor: pointer;
            font-size: 14px;
            margin-left: 8px;
            transition: background 0.2s;
        }

        #toggleCollapseBtn:hover, #toggleVoiceBtn.voice-enabled {
            background: #2196f3; /* 语音开启时的蓝色 */
        }
        #toggleVoiceBtn.voice-disabled {
            background: #f44336; /* 语音关闭时的红色 */
        }
        #toggleVoiceBtn:hover.voice-enabled {
            background: #1976d2; /* 语音开启时的深蓝色悬停效果 */
        }
        #toggleVoiceBtn:hover.voice-disabled {
            background: #d32f2f; /* 语音关闭时的深红色悬停效果 */
        }

        #toggleCollapseBtn {
            background: #9e9e9e; /* 折叠按钮颜色 */
        }

        #toggleCollapseBtn:hover {
            background: #757575; /* 折叠按钮悬停颜色 */
        }

        #monitorTitle {
            margin: 0;
            display: flex;
            align-items: center;
            color: #212121; /* 更暗的标题颜色 */
            font-size: 12px; /* 调小标题字体大小 */
        }

        .collapse-icon {
            margin-right: 12px;
            font-size: 16px; /* 更大的图标 */
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        #monitorLogContainer.collapsed .collapse-icon {
            transform: rotate(-90deg);
        }

        .control-buttons {
            display: flex;
        }
    `);

    // 语音播报开关 (true: 开启语音, false: 静音)
    let voiceEnabled = true;
    // 面板折叠状态
    let panelCollapsed = false;
    // 存储日志条目
    const logEntries = [];

    // 配置对象，集中管理可配置项
    const CONFIG = {
        // 检查间隔（毫秒）
        CHECK_INTERVAL: 3000,
        // 最大日志条目数
        MAX_LOG_ENTRIES: 5,
        WORKING_HOURS: {
            MORNING: { START: 9, END: 12 },
            AFTERNOON: { START: 13.5, END: 18 }
        }
    };
    let offlineNotifyCount = 0;
    let lastOfflineStatus = false; // 记录上次的离线状态
    // 工具函数：获取当前小时（支持小数）
    function getCurrentHour() {
        const now = new Date();
        return now.getHours() + now.getMinutes() / 60;
    }

    // 检查是否在工作时间内
    function isWorkingHours() {
        const currentHour = getCurrentHour();
        return (currentHour >= CONFIG.WORKING_HOURS.MORNING.START && currentHour <= CONFIG.WORKING_HOURS.MORNING.END) ||
            (currentHour >= CONFIG.WORKING_HOURS.AFTERNOON.START && currentHour <= CONFIG.WORKING_HOURS.AFTERNOON.END);
    }

    // 修改主要检测函数
    function checkCount() {
        if (!isWorkingHours()) {
            addLog('当前不在工作时间，已停止脚本', 'warning');
            return;
        }
        try {
            // 获取等待人数
            const ocurrentElement = document.querySelector('.count:nth-child(2)');
            if (!ocurrentElement) {
                addLog('找不到人数元素', 'warning');
                speak("找不到人数元素");
                return;
            }

            const currentCount = parseInt(ocurrentElement.textContent.trim());
            // 检查currentCount是否为有效数字
            if (isNaN(currentCount)) {
                addLog('无法解析等待人数', 'warning');
                speak("无法解析等待人数");
                return;
            }

            if (currentCount === 0) {
                addLog('当前等待人数为0', 'success');
            } else if (currentCount < 5) {
                // 使用具体数字替代length比较
                addLog(`当前等待人数: ${currentCount}`, 'info');
                speak("征纳互动有人来了");
            }

            // 检查离线状态
            const offlineElement = document.querySelector('.t-dialog__body__icon:nth-child(2)');
            const isCurrentlyOffline = offlineElement && offlineElement.textContent.trim().includes('离线');

            if (isCurrentlyOffline) {
                // 系统当前离线
                if (!lastOfflineStatus) {
                    // 刚刚从在线变为离线
                    offlineNotifyCount = 1; // 直接设置为1，表示第一次提醒
                    addLog('检测到系统刚刚离线 (第1次提醒)', 'warning');
                    speak("征纳互动已离线");
                } else {
                    // 持续离线状态
                    if (offlineNotifyCount < 5) {
                        offlineNotifyCount++;
                        addLog(`征纳互动已离线 (第${offlineNotifyCount}次提醒)`, 'warning');
                        speak("征纳互动已离线");
                    } else if (offlineNotifyCount === 5) {
                        // 第一次达到5次通知限制时，记录暂停提醒的日志
                        addLog('离线：已通知5次，暂停语音提醒', 'warning');
                        offlineNotifyCount++; // 增加计数，避免重复记录此日志
                    } else {
                        // 超过5次后，静默计数，不记录日志也不语音提醒
                        offlineNotifyCount++;
                    }
                }
                lastOfflineStatus = true;
            } else {
                // 系统当前在线
                if (lastOfflineStatus) {
                    // 刚刚从离线变为在线
                    addLog('系统已重新上线', 'success');
                    speak("征纳互动已重新上线");
                    offlineNotifyCount = 0; // 重置计数器
                }
                lastOfflineStatus = false;
            }
        } catch (error) {
            addLog(`检测错误: ${error.message}`, 'warning');
        }
    }

    const speechQueue = [];
    let isSpeaking = false;
    let voicesReady = false;

    // 确保语音加载完成
    speechSynthesis.onvoiceschanged = () => {
        voicesReady = !!speechSynthesis.getVoices().length;
    };

    let firstSpeak = true;

    function speak(text) {
        if (firstSpeak && !voicesReady) {
            const checkVoices = () => {
                if (voicesReady) {
                    firstSpeak = false;
                    addLog('语音首次加载完成，可以开始播报。', 'info');
                    speak(text);
                } else {
                    setTimeout(checkVoices, 100);
                    addLog("等待语音加载完成", "info");
                }
            };
            checkVoices();
            return;
        }
        if (!voiceEnabled || !('speechSynthesis' in window) || !voicesReady) return;

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'zh-CN';
        utterance.rate = 1.0;

        speechQueue.push(utterance);
        processSpeechQueue();
    }

    function processSpeechQueue() {
        if (isSpeaking || speechQueue.length === 0 || !voiceEnabled) return;

        isSpeaking = true;
        const utterance = speechQueue.shift();

        utterance.onend = utterance.onerror = (e) => {
            isSpeaking = false;
            processSpeechQueue();
        };

        window.speechSynthesis.speak(utterance);
    }

    // 添加日志条目
    function addLog(message, type = 'info') {
        const timestamp = new Date().toTimeString().slice(0, 8);
        const logItem = { timestamp, message, type };

        logEntries.unshift(logItem);
        if (logEntries.length > CONFIG.MAX_LOG_ENTRIES) {
            logEntries.pop();
        }

        updateLogDisplay();
        console.log(`[监控] ${timestamp} ${message}`);
    }

    // 更新日志显示（使用文档片段优化性能）
    function updateLogDisplay() {
        const logContainer = document.getElementById('monitorLogs');
        if (!logContainer) return;

        const fragment = document.createDocumentFragment();
        logEntries.forEach(log => {
            const logElement = document.createElement('div');
            logElement.className = `log-item log-${log.type}`;
            logElement.innerHTML = `<strong>${log.timestamp}</strong> - ${log.message}`;
            fragment.appendChild(logElement);
        });

        logContainer.innerHTML = '';
        logContainer.appendChild(fragment);
    }

    // 切换面板折叠状态
    function togglePanel() {
        const container = document.getElementById('monitorLogContainer');
        if (!container) return;

        panelCollapsed = !panelCollapsed;

        if (panelCollapsed) {
            container.classList.add('collapsed');
        } else {
            container.classList.remove('collapsed');
        }

        // 更新折叠按钮文本
        const collapseBtn = document.getElementById('toggleCollapseBtn');
        if (collapseBtn) {
            collapseBtn.textContent = panelCollapsed ? '展开面板' : '折叠面板';
        }
    }

    // 创建控制面板
    function createControlPanel() {
        const panel = document.createElement('div');
        panel.id = 'monitorLogContainer';

        // 面板头部
        const header = document.createElement('div');
        header.id = 'monitorLogHeader';

        // 标题区域（可点击折叠）
        const titleArea = document.createElement('div');
        titleArea.style.display = 'flex';
        titleArea.style.alignItems = 'center';

        const title = document.createElement('h4');
        title.id = 'monitorTitle';
        title.innerHTML = '<span class="collapse-icon">▼</span> 征纳互动监控';
        titleArea.appendChild(title);

        header.appendChild(titleArea);

        // 按钮容器
        const btnContainer = document.createElement('div');
        btnContainer.className = 'control-buttons';

        // 语音开关
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'toggleVoiceBtn';
        toggleBtn.textContent = voiceEnabled ? '🔊 语音' : '🔇 静音';
        toggleBtn.className = voiceEnabled ? 'voice-enabled' : 'voice-disabled';
        toggleBtn.title = voiceEnabled ? '关闭语音提示' : '开启语音提示';
        toggleBtn.onclick = (e) => {
            e.stopPropagation(); // 阻止冒泡，避免触发折叠
            voiceEnabled = !voiceEnabled;

            // 如果禁用语音，立即停止当前播放的语音并清空队列
            if (!voiceEnabled) {
                window.speechSynthesis.cancel();
                speechQueue.length = 0;
                isSpeaking = false;
            }

            toggleBtn.textContent = voiceEnabled ? '🔊 语音' : '🔇 静音';
            toggleBtn.className = voiceEnabled ? 'voice-enabled' : 'voice-disabled';
            toggleBtn.title = voiceEnabled ? '关闭语音提示' : '开启语音提示';
            addLog(`语音功能已${voiceEnabled ? '启用' : '禁用'}`);
        };
        btnContainer.appendChild(toggleBtn);

        // 折叠按钮
        const collapseBtn = document.createElement('button');
        collapseBtn.id = 'toggleCollapseBtn';
        collapseBtn.textContent = '折叠面板';
        collapseBtn.title = '折叠/展开控制面板';
        collapseBtn.onclick = (e) => {
            e.stopPropagation(); // 阻止冒泡，避免触发折叠
            togglePanel();
        };
        btnContainer.appendChild(collapseBtn);



        header.appendChild(btnContainer);
        panel.appendChild(header);

        // 日志内容区域
        const logContent = document.createElement('div');
        logContent.id = 'monitorLogs';
        logContent.innerHTML = '<div class="log-item log-info">监控启动...</div>';
        panel.appendChild(logContent);

        document.body.appendChild(panel);

        // 添加点击折叠功能（点击标题栏可折叠）
        header.addEventListener('click', togglePanel);

        // 初始添加一条日志
        addLog('监控已启动');
    }

    // 初始化监控
    function initMonitor() {
        createControlPanel();

        // 只在工作时间内播放启动语音
        if (isWorkingHours()) {
            speak("监控启动");
        } else {
            addLog('当前不在工作时间，监控已启动但暂停语音提示', 'warning');
        }

        // 每3秒检查一次
        setInterval(checkCount, 3000);
    }

    // 页面加载完成后启动监控
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMonitor);
    } else {
        initMonitor();
    }
})();