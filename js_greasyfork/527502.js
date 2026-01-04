// ==UserScript==
// @name         Florr.io Super Ping(开发版)
// @namespace    http://tampermonkey.net/
// @version      2.1
// @license      MIT
// @description  Detects Super spawns in Florr.io, displays notifications, styled Super Ping messages, always visible, edge collision, language support, resizable UI, and hotkey recording. Includes a movable log window and UI toggles, with persistent UI positions.
// @author       william
// @match        https://florr.io/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/527502/Florrio%20Super%20Ping%28%E5%BC%80%E5%8F%91%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/527502/Florrio%20Super%20Ping%28%E5%BC%80%E5%8F%91%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加 CSS 样式
    GM_addStyle(`
        /* 设置按钮和语言按钮的共同容器 */
        #button-container {
            position: fixed;
            bottom: 10px;
            right: 10px;
            display: flex; /* 使用 Flexbox 布局 */
            align-items: center; /* 垂直居中 */
            gap: 5px; /* 按钮之间的间距 */
            z-index: 10001; /* 确保按钮在容器上方 */
        }

        #super-ping-container {
            position: fixed;
            top: 50%; /* 垂直居中 */
            right: 10px; /* 靠右侧 */
            transform: translateY(-50%); /* 垂直居中 */
            background-color: rgba(0, 100, 0, 0.7); /* 深绿色背景 */
            color: white;
            padding: 15px; /* 增加内边距 */
            border-radius: 5px;
            z-index: 9999;
            resize: both; /* 允许用户调整大小 */
            overflow: auto; /* 确保内容不会溢出 */
            font-family: sans-serif; /* 使用更清晰的字体 */
            border: 2px solid #8FBC8F; /* 添加边框 */
            box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3); /* 添加阴影 */
            font-size: 1.0em; /* 稍微增大字体大小 */
            width: 300px; /* 设置初始宽度 */
            height: 200px; /* 设置初始高度 */
        }

        #super-ping-container h3 {
            margin-top: 0;
            margin-bottom: 5px;
            font-size: 1.4em; /* 稍微增大标题字体 */
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5); /* 添加文字阴影 */
        }

        #super-ping-container p {
            margin: 0;
            font-size: 1.0em; /* 稍微增大字体大小 */
            line-height: 1.4; /* 增加行高 */
        }

        #super-ping-history {
            max-height: 200px; /* 增加历史记录高度 */
            overflow-y: auto;
            margin-top: 10px;
            padding: 5px;
            border: 1px solid #555;
            border-radius: 3px;
            background-color: rgba(0, 0, 0, 0.3); /* 历史记录背景 */
        }

        #super-ping-history p {
            margin: 5px 0; /* 增加历史记录条目间距 */
            font-size: 0.9em;
            border-bottom: 1px solid #444; /* 添加分割线 */
            padding-bottom: 5px; /* 增加底部内边距 */
        }

        #super-ping-history p:last-child {
            border-bottom: none; /* 移除最后一个条目的分割线 */
        }

        #settings-container {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 20px;
            border-radius: 10px;
            z-index: 10000;
            display: none; /* 初始状态隐藏 */
        }

        #settings-container label {
            display: block;
            margin-bottom: 5px;
        }

        #settings-container input,
        #settings-container select {
            margin-bottom: 10px;
            padding: 5px;
            border-radius: 3px;
            border: none;
            background-color: #333;
            color: white;
        }

        #settings-container button {
            background-color: #4CAF50;
            color: white;
            padding: 10px 15px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }

        #settings-container button:hover {
            background-color: #3e8e41;
        }

        /* 调整大小手柄的样式 (可选) */
        #super-ping-container::-webkit-resizer {
            background: #444;
            border: 1px solid #666;
        }

        /* Super Ping 消息样式 */
        .super-text {
            color: yellow; /* 修改为黄色 */
            font-weight: bold; /* 加粗 */
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5); /* 添加文字阴影 */
        }

        .entity-text {
            color: lightblue; /* 修改为淡蓝色 */
        }

        /* 设置按钮样式 */
        #settings-button {
            background-color: rgba(0, 0, 0, 0.5);
            color: white;
            width: auto; /* 宽度自适应内容 */
            height: auto; /* 高度自适应内容 */
            min-width: 50px; /* 最小宽度 */
            min-height: 50px; /* 最小高度 */
            padding: 8px 12px; /* 内边距 */
            border-radius: 0px; /* 设置为方形 */
            cursor: pointer;
            border: none; /* 移除边框 */
            font-size: 16px; /* 调整字体大小 */
            display: flex; /* 使用 Flexbox 布局 */
            justify-content: center; /* 水平居中 */
            align-items: center; /* 垂直居中 */
            text-align: center; /* 确保文字居中 */
            box-sizing: border-box; /* 确保内边距不影响总尺寸 */
        }

        #settings-button:hover {
            background-color: rgba(0, 0, 0, 0.8);
        }

        /* 快捷语言切换按钮样式 */
        #language-switch-button {
            background-color: rgba(0, 0, 0, 0.5);
            color: white;
            width: auto; /* 宽度自适应内容 */
            height: auto; /* 高度自适应内容 */
            min-width: 50px; /* 最小宽度 */
            min-height: 50px; /* 最小高度 */
            padding: 8px 12px; /* 内边距 */
            border-radius: 0px; /* 设置为方形 */
            cursor: pointer;
            border: none; /* 移除边框 */
            font-size: 16px; /* 调整字体大小 */
            display: flex; /* 使用 Flexbox 布局 */
            justify-content: center; /* 水平居中 */
            align-items: center; /* 垂直居中 */
            text-align: center; /* 确保文字居中 */
            box-sizing: border-box; /* 确保内边距不影响总尺寸 */
            /* 限制语言切换按钮的最大宽度 */
            max-width: 80px; /* 根据需要调整 */
            overflow: hidden; /* 隐藏溢出的文本 */
            white-space: nowrap; /* 防止文本换行 */
        }

        #language-switch-button:hover {
            background-color: rgba(0, 0, 0, 0.8);
        }

        /* 快捷键录制样式 */
        #hotkey-input {
            cursor: pointer; /* 指示可点击 */
        }

        #hotkey-input.recording {
            background-color: #ffc107; /* 醒目的颜色 */
            color: black;
            cursor: wait; /* 指示正在录制 */
        }

        /* 最后的 Super 样式 */
        #last-super-info {
            font-size: 1.2em; /* 增大字体 */
            font-weight: bold; /* 加粗 */
            margin-bottom: 5px; /* 增加间距 */
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5); /* 添加文字阴影 */
        }

        /* Super 和 Server 标签样式 */
        #super-type-label,
        #super-server-label {
            font-size: 0.9em; /* 减小字体 */
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5); /* 添加文字阴影 */
        }

        /* Super 类型图标样式 */
        #super-type {
            display: inline-block; /* 确保 span 可以设置宽度和高度 */
            width: 20px; /* 设置图标宽度 */
            height: 20px; /* 设置图标高度 */
            background-size: contain; /* 确保图标缩放到合适的大小 */
            background-repeat: no-repeat; /* 防止图标重复 */
            background-position: center; /* 居中显示图标 */
            margin-right: 5px; /* 调整图标与文字的间距 */
        }

        /* Log Window Styles */
        #log-container {
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: rgba(0, 0, 0, 0.7); /* 半透明黑色背景 */
            color: white;
            padding: 10px;
            border-radius: 5px;
            z-index: 9998; /* 确保在 Super Ping 容器下方 */
            resize: both;
            overflow: auto;
            font-family: monospace; /* 使用等宽字体 */
            border: 1px solid #555;
            box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
            max-height: 400px; /* 设置最大高度 */
            max-width: 500px; /* 设置最大宽度 */
            font-size: 0.9em; /* 稍微增大字体大小 */
            line-height: 1.4; /* 增加行高 */
            min-width: 200px; /* 添加最小宽度 */
            min-height: 100px; /* 添加最小高度 */
            display: none; /* 初始状态隐藏 */
        }

        #log-container h3 {
            margin-top: 0;
            margin-bottom: 5px;
            font-size: 1.1em;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
        }

        #log-output {
            white-space: pre-wrap; /* 保留空格和换行 */
            font-size: 0.8em;
            line-height: 1.3;
            word-break: break-word; /* 允许单词断行 */
        }

        /* Server Info Styles */
        #server-info-container {
            position: fixed;
            bottom: 70px; /* 调整到 Settings 按钮上方 */
            right: 10px; /* 与 Settings 按钮对齐 */
            background-color: rgba(0, 0, 0, 0.5);
            color: white;
            padding: 8px;
            border-radius: 3px;
            font-size: 0.9em;
            text-align: center;
            z-index: 9997; /* 确保在 Super Ping 容器下方 */
            display: none; /* 初始状态隐藏 */
        }

        /* Fullscreen Suggestion Styles */
        #fullscreen-suggestion {
            position: fixed;
            top: 10px;
            left: 50%;
            transform: translateX(-50%);
            background-color: rgba(255, 0, 0, 0.7); /* 设置背景颜色为红色，透明度为 0.7 */
            color: yellow; /* 设置字体颜色为黄色 */
            padding: 5px 10px; /* 稍微减小内边距 */
            border-radius: 5px;
            z-index: 10002; /* 确保在所有其他 UI 元素之上 */
            font-size: 0.8em; /* 稍微减小字体大小 */
            font-weight: bold;
            text-align: center;
            opacity: 0.9; /* 设置初始透明度 */
            transition: opacity 1s ease-in-out; /* 添加过渡效果 */
            display: flex; /* 使用 Flexbox 布局 */
            align-items: center; /* 垂直居中 */
            justify-content: center; /* 水平居中 */
        }

        #fullscreen-suggestion.fade-out {
            opacity: 0; /* 设置透明度为 0 */
        }

        /* 警示图标样式 */
        #fullscreen-suggestion::before {
            content: "\\26A0"; /* Unicode 字符，表示警告符号 */
            margin-right: 5px; /* 调整图标与文字的间距 */
            font-size: 1em; /* 调整图标大小 */
        }

        /* FPS Counter Styles */
        #fps-counter {
            position: fixed;
            bottom: 10px;
            right: 150px; /* Adjust as needed to position next to other buttons */
            background-color: rgba(0, 0, 0, 0.5);
            color: white;
            padding: 5px;
            border-radius: 3px;
            font-size: 0.9em;
            z-index: 10001;
        }
    `);

    // 全局变量
    let lastSuperType = 'N/A';
    let lastLocation = 'N/A';
    let lastDirection = 'N/A';
    let settingsVisible = false; // 添加一个变量来跟踪设置的可见性

    // Super 类型图标映射
    const superTypeIcons = {
        'Super Queen Ant': 'https://i.imgur.com/your_queen_ant_icon.png',
        'Super Beetle': 'https://i.imgur.com/your_beetle_icon.png',
        'Super Spider': 'https://i.imgur.com/your_spider_icon.png'
    };

    // 服务器信息相关变量
    let serverInfo = {
        serverId: 'N/A'
    };

    // 函数：提取服务器 ID
    function extractServerId(url) {
        const match = url.match(/wss:\/\/([a-z0-9]*).s.m28n.net\//);
        return match ? match[1] : null;
    }

    // 函数：获取服务器信息
    function getServerInfo() {
        const wsAddress = window.WebSocket.address; // 假设 WebSocket 地址存储在这个变量中
        if (!wsAddress) return;

        const serverId = extractServerId(wsAddress);
        if (serverId) {
            serverInfo.serverId = serverId;
            updateServerInfoDisplay();
        }
    }

    // 延迟执行，确保页面加载完成
    setTimeout(() => {
        // 创建 Super Ping 容器
        let superPingContainer = document.createElement('div');
        superPingContainer.id = 'super-ping-container';
        superPingContainer.innerHTML = `
            <h3 id="super-spawned-title">Super Ping</h3>
            <div id="super-ping-history"></div>
        `;
        document.body.appendChild(superPingContainer);

        // 创建设置容器
        let settingsContainer = document.createElement('div');
        settingsContainer.id = 'settings-container';
        settingsContainer.style.display = 'none';
        settingsContainer.innerHTML = `
            <h2 id="settings-title">Settings</h2>
            <label for="language" id="language-label">Language:</label>
            <select id="language">
                <option value="en">English</option>
                <option value="zh">中文</option>
            </select>

            <label for="hotkey" id="hotkey-label">UI Hotkey (Show/Hide All):</label>
            <input type="text" id="hotkey-input" value="Ctrl+Shift+S" readonly>

            <label for="enable-log" id="enable-log-label">Enable Log UI:</label>
            <input type="checkbox" id="enable-log">

            <label for="enable-server-info" id="enable-server-info-label">Enable Server Info UI:</label>
            <input type="checkbox" id="enable-server-info">

            <button id="save-settings-button">Save Settings</button>
        `;
        document.body.appendChild(settingsContainer);

        // 创建按钮容器
        const buttonContainer = document.createElement('div');
        buttonContainer.id = 'button-container';
        document.body.appendChild(buttonContainer);

        // 创建设置按钮
        let settingsButton = document.createElement('button');
        settingsButton.id = 'settings-button';
        settingsButton.textContent = 'Settings';
        buttonContainer.appendChild(settingsButton);

        // 创建快捷语言切换按钮
        let languageSwitchButton = document.createElement('button');
        languageSwitchButton.id = 'language-switch-button';
        buttonContainer.appendChild(languageSwitchButton);

        console.log("Settings button:", settingsButton); // 调试：检查按钮元素是否被找到

        // 创建日志容器
        let logContainer = document.createElement('div');
        logContainer.id = 'log-container';
        logContainer.innerHTML = `
            <h3>Log</h3>
            <div id="log-output"></div>
        `;
        document.body.appendChild(logContainer);

        // 创建服务器信息容器
        let serverInfoContainer = document.createElement('div');
        serverInfoContainer.id = 'server-info-container';
        serverInfoContainer.innerHTML = `
            Server ID: <span id="server-id">N/A</span>
            <br>
            Server: <span id="server-name">N/A</span>
        `;
        document.body.appendChild(serverInfoContainer);

        // 获取服务器信息显示元素
        const serverIdElement = document.getElementById('server-id');
        const serverNameElement = document.getElementById('server-name');

        // 函数：更新服务器信息显示
        function updateServerInfoDisplay() {
            serverIdElement.textContent = serverInfo.serverId;
            serverNameElement.textContent = serverInfo.serverId; // 假设服务器名称与 ID 相同
        }

        // 获取设置元素
        const languageSelect = document.getElementById('language');
        let hotkeyInput = document.getElementById('hotkey-input'); // 获取快捷键输入框
        const enableLogCheckbox = document.getElementById('enable-log');
        const enableServerInfoCheckbox = document.getElementById('enable-server-info');
        const saveSettingsButton = document.getElementById('save-settings-button');

        // 加载设置
        let language = GM_getValue('language', 'en');

        // **自动检测浏览器语言**
        const browserLanguage = navigator.language || navigator.userLanguage; // 获取浏览器语言
        if (browserLanguage.startsWith('zh')) {
            language = 'zh'; // 如果是中文，则设置为中文
        } else {
            language = 'en'; // 否则设置为英文
        }

        let hotkey = GM_getValue('hotkey', 'Ctrl+Shift+S');
        let enableLog = GM_getValue('enableLog', false); // 默认隐藏 Log UI
        let enableServerInfo = GM_getValue('enableServerInfo', true);

        languageSelect.value = language;
        hotkeyInput.value = hotkey;
        enableLogCheckbox.checked = enableLog;
        enableServerInfoCheckbox.checked = enableServerInfo;

        // 初始化 UI 的显示状态
        logContainer.style.display = enableLog ? 'block' : 'none';
        serverInfoContainer.style.display = enableServerInfo ? 'block' : 'none';

        // 保存设置
        saveSettingsButton.addEventListener('click', () => {
            language = languageSelect.value;
            hotkey = hotkeyInput.value;
            enableLog = enableLogCheckbox.checked;
            enableServerInfo = enableServerInfoCheckbox.checked;

            GM_setValue('language', language);
            GM_setValue('hotkey', hotkey);
            GM_setValue('enableLog', enableLog);
            GM_setValue('enableServerInfo', enableServerInfo);

            alert(getTranslation('settingsSaved'));
            settingsContainer.style.display = 'none';
            updateLanguage();

            // 应用新的 UI 显示状态
            logContainer.style.display = enableLog ? 'block' : 'none';
            serverInfoContainer.style.display = enableServerInfo ? 'block' : 'none';
        });

        // 热键处理
        document.addEventListener('keydown', (e) => {
            const keys = [];
            if (e.ctrlKey) keys.push('Ctrl');
            if (e.shiftKey) keys.push('Shift');
            if (e.altKey) keys.push('Alt');
            keys.push(e.key.toUpperCase());
            const pressedHotkey = keys.join('+');

            // 全局 UI 快捷键
            if (pressedHotkey === hotkey.toUpperCase()) {
                settingsContainer.style.display = settingsContainer.style.display === 'none' ? 'block' : 'none';
                superPingContainer.style.display = superPingContainer.style.display === 'none' ? 'block' : 'none';
                logContainer.style.display = (enableLog && logContainer.style.display === 'none') ? 'block' : 'none';
                serverInfoContainer.style.display = (enableServerInfo && serverInfoContainer.style.display === 'none') ? 'block' : 'none';
            }
        });

        // 设置按钮点击事件
        settingsButton.addEventListener('click', () => {
            console.log("Settings button clicked"); // 调试：检查事件监听器是否被触发
            console.log("settingsVisible before:", settingsVisible); // 调试：查看 settingsVisible 的值
            settingsVisible = !settingsVisible; // 切换可见性
            console.log("settingsVisible after:", settingsVisible); // 调试：查看 settingsVisible 的值
            settingsContainer.style.display = settingsVisible ? 'block' : 'none'; // 根据可见性设置显示
            console.log("settingsContainer.style.display:", settingsContainer.style.display); // 调试：查看 display 属性
        });

        // 快捷语言切换按钮点击事件
        languageSwitchButton.addEventListener('click', () => {
            language = (language === 'en') ? 'zh' : 'en';
            GM_setValue('language', language);
            updateLanguage();
        });

        // 获取 Super Server 和 Super Type 显示元素
        const superPingHistoryElement = document.getElementById('super-ping-history');

        // 获取需要翻译的元素
        const superSpawnedTitle = document.getElementById('super-spawned-title');
        const settingsTitle = document.getElementById('settings-title');
        const languageLabel = document.getElementById('language-label');
        const hotkeyLabel = document.getElementById('hotkey-label');
        const enableLogLabel = document.getElementById('enable-log-label');
        const enableServerInfoLabel = document.getElementById('enable-server-info-label');
        const settingsButtonText = document.getElementById('settings-button');

        // 翻译文本
        const translations = {
            en: {
                superSpawned: 'Super Ping',
                settings: 'Settings',
                language: 'Language:',
                hotkey: 'UI Hotkey (Show/Hide All):',
                enableLog: 'Enable Log UI:',
                enableServerInfo: 'Enable Server Info UI:',
                saveSettings: 'Save Settings',
                settingsSaved: 'Settings saved!',
                spawnedOn: 'spawned on',
                superSpawnedSomewhere: 'A Super has spawned somewhere!',
                serverId: 'Server ID:',
                server: 'Server:',
                chinese: '中文',
                fullscreenSuggestion: '⚠️ For the best experience, it is recommended to play in fullscreen.'
            },
            zh: {
                superSpawned: 'Super Ping',
                settings: '设置',
                language: '语言:',
                hotkey: 'UI 快捷键 (显示/隐藏全部):',
                enableLog: '启用日志 UI:',
                enableServerInfo: '启用服务器信息 UI:',
                saveSettings: '保存设置',
                settingsSaved: '设置已保存！',
                spawnedOn: '生成于',
                superSpawnedSomewhere: '某个地方生成了一个 Super!',
                serverId: '服务器 ID:',
                server: '服务器:',
                chinese: 'English',
                fullscreenSuggestion: '⚠️ 为了获得最佳体验，建议全屏游玩。'
            }
        };

        // 函数：获取翻译文本
        function getTranslation(key) {
            return translations[language][key] || translations['en'][key] || key;
        }

        // 函数：更新语言
        function updateLanguage() {
            language = GM_getValue('language', 'en');
            superSpawnedTitle.textContent = getTranslation('superSpawned');
            settingsTitle.textContent = getTranslation('settings');
            languageLabel.textContent = getTranslation('language');
            hotkeyLabel.textContent = getTranslation('hotkey');
            enableLogLabel.textContent = getTranslation('enableLog');
            enableServerInfoLabel.textContent = getTranslation('enableServerInfo');
            saveSettingsButton.textContent = getTranslation('saveSettings');
            settingsButtonText.textContent = getTranslation('settings');
            languageSwitchButton.textContent = getTranslation('chinese');

            // 翻译 Super Ping 历史记录
            const historyEntries = document.querySelectorAll('#super-ping-history p');
            historyEntries.forEach(entry => {
                // 获取原始消息中的位置和时间信息
                const parts = entry.textContent.split(' - ');
                const locationAndTime = parts.slice(0, 2).join(' - '); // 位置和时间
                const translatedMessage = getTranslation('superSpawnedSomewhere'); // 翻译后的消息

                // 组合位置、时间和翻译后的消息
                entry.textContent = `${locationAndTime} - ${translatedMessage}`;
            });

            // 翻译服务器信息
            document.querySelector('#server-info-container').innerHTML = `${getTranslation('serverId')} <span id="server-id">${serverInfo.serverId}</span><br>${getTranslation('server')} <span id="server-name">${serverInfo.serverId}</span>`;

            // 翻译全屏提示
            if (fullscreenSuggestion) { // 检查 fullscreenSuggestion 是否存在
                fullscreenSuggestion.textContent = getTranslation('fullscreenSuggestion');
            }

            // Update FPS counter position after language change
            updateFPSCounterPosition();
        }

        // 函数：显示 Super Ping
        function showSuperPing(superType, location, direction) {
            console.log('showSuperPing called', superType, location, direction);

            try {
                const historyEntry = document.createElement('p');
                const translatedMessage = getTranslation('superSpawnedSomewhere');
                historyEntry.textContent = `${location} - ${new Date().toLocaleTimeString()} - ${translatedMessage}`;
                superPingHistoryElement.insertBefore(historyEntry, superPingHistoryElement.firstChild);

                while (superPingHistoryElement.children.length > 10) {
                    superPingHistoryElement.removeChild(superPingHistoryElement.lastChild);
                }

                logMessage(`Super spawned: ${superType} at ${location}`);
            } catch (error) {
                console.error('Error in showSuperPing:', error);
                logMessage(`Error showing Super Ping: ${error.message}`);
            }
        }

        // 模拟 Super 生成
        setInterval(() => {
            const superTypes = ['Super Queen Ant', 'Super Beetle', 'Super Spider'];
            const randomSuperType = superTypes[Math.floor(Math.random() * superTypes.length)];
            const randomLocation = ['US-Desert-1k73-2025/2/19', 'EU-Forest-2j84-2025/2/19', 'AS-Mountain-3l95-2025/2/19'][Math.floor(Math.random() * 3)];
            const randomDirection = ['North', 'South', 'East', 'West'][Math.floor(Math.random() * 4)];
            showSuperPing(randomSuperType, randomLocation, randomDirection);
        }, 15000);

        // 快捷键录制
        let isRecording = false;
        //const hotkeyInput = document.getElementById('hotkey-input'); // 获取快捷键输入框
        hotkeyInput.addEventListener('click', () => {
            startRecordingHotkey(hotkeyInput);
        });

        function startRecordingHotkey(inputElement) {
            isRecording = true;
            inputElement.value = 'Recording...';
            inputElement.classList.add('recording');
        }

        document.addEventListener('keydown', (e) => {
            if (isRecording) {
                e.preventDefault();

                const keys = [];
                if (e.ctrlKey) keys.push('Ctrl');
                if (e.shiftKey) keys.push('Shift');
                if (e.altKey) keys.push('Alt');
                keys.push(e.key.toUpperCase());
                const recordedHotkey = keys.join('+');

                if (hotkeyInput.classList.contains('recording')) {
                    hotkeyInput.value = recordedHotkey;
                    GM_setValue('hotkey', recordedHotkey);
                }

                isRecording = false;
                hotkeyInput.classList.remove('recording');
            } else {
                // 如果不是在录制快捷键，则检查是否按下了隐藏/显示 UI 的快捷键
                const keys = [];
                if (e.ctrlKey) keys.push('Ctrl');
                if (e.shiftKey) keys.push('Shift');
                if (e.altKey) keys.push('Alt');
                keys.push(e.key.toUpperCase());
                const pressedHotkey = keys.join('+');

                // 全局 UI 快捷键
                if (pressedHotkey === hotkey.toUpperCase()) {
                    settingsContainer.style.display = settingsContainer.style.display === 'none' ? 'block' : 'none';
                    superPingContainer.style.display = superPingContainer.style.display === 'none' ? 'block' : 'none';
                    logContainer.style.display = (enableLog && logContainer.style.display === 'none') ? 'block' : 'none';
                    serverInfoContainer.style.display = (enableServerInfo && serverInfoContainer.style.display === 'none') ? 'block' : 'none';
                }
            }
        });

        // 日志功能
        const logOutput = document.getElementById('log-output');
        function logMessage(message) {
            const timestamp = new Date().toLocaleTimeString();
            logOutput.textContent += `[${timestamp}] ${message}\n`;
            logOutput.scrollTop = logOutput.scrollHeight;
        }

        // 初始日志消息
        logMessage('Script started.');

        // --- 服务器信息相关 ---
        // Hook WebSocket
        const originalWebSocket = window.WebSocket;
        window.WebSocket = function(url, protocols) {
            window.WebSocket.address = url; // 存储 WebSocket 地址
            getServerInfo(); // 获取服务器信息
            if (protocols) {
                return new originalWebSocket(url, protocols);
            } else {
                return new originalWebSocket(url);
            }
        };
        window.WebSocket.prototype = originalWebSocket.prototype;

        // 初始化服务器信息
        getServerInfo();

        // 使用 MutationObserver 监听 Super Ping 历史记录的变化
        const observer = new MutationObserver((mutationsList, observer) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    // 当有节点被添加或删除时，更新语言
                    updateLanguage();
                }
            }
        });

        // 开始监听 Super Ping 历史记录容器
        const superPingHistoryElementForObserver = document.getElementById('super-ping-history');
        observer.observe(superPingHistoryElementForObserver, { childList: true });

        // 创建全屏提示 UI
        const fullscreenSuggestion = document.createElement('div');
        console.log("Fullscreen suggestion element created:", fullscreenSuggestion); // Debugging
        fullscreenSuggestion.id = 'fullscreen-suggestion';
        document.body.appendChild(fullscreenSuggestion);
        console.log("Fullscreen suggestion element appended:", fullscreenSuggestion); // Debugging

        // 20 秒后移除全屏提示
        setTimeout(() => {
            fullscreenSuggestion.classList.add('fade-out');
            setTimeout(() => {
                fullscreenSuggestion.remove();
            }, 1000); // 1 秒后移除元素，与 CSS 过渡时间一致
        }, 20000);

        // --- FPS Counter ---
        let fpsCounter = document.createElement('div');
        fpsCounter.id = 'fps-counter';
        document.body.appendChild(fpsCounter);

        let lastFrameTime = performance.now();
        let frameCount = 0;
        let fps = 0;

        function updateFPS() {
            const now = performance.now();
            const delta = now - lastFrameTime;
            lastFrameTime = now;
            fps = Math.round(1000 / delta);
            fpsCounter.textContent = `FPS: ${fps}`;
            frameCount++;
            requestAnimationFrame(
() => updateFPS());
        }

        // Function to update FPS counter position
        function updateFPSCounterPosition() {
            const settingsButton = document.getElementById('settings-button');

            const fpsCounter = document.getElementById('fps-counter');

            if (settingsButton && fpsCounter) {
                // Calculate the left position based on the settings button's position
                const settingsButtonRect = settingsButton.getBoundingClientRect();
                const fpsCounterWidth = fpsCounter.offsetWidth;
                const newLeft = settingsButtonRect.left - fpsCounterWidth - 5; // 5px gap

                // Set the new left position
                fpsCounter.style.left = `${newLeft}px`;
                fpsCounter.style.right = 'auto'; // Important: Reset right style
            }
        }

        updateFPS(); // Start the FPS counter

        // --- Initial Language Update ---
        updateLanguage();

    }, 1000);
})();
