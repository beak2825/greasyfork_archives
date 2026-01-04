// ==UserScript==
// @name         AI网页内容总结
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  自动调用AI总结网页内容并流式显示
// @author       AiCoder
// @match        *://*/*
// @connect *
// @license MIT
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://cdn.jsdelivr.net/npm/turndown@7.1.1/dist/turndown.min.js
// @downloadURL https://update.greasyfork.org/scripts/529783/AI%E7%BD%91%E9%A1%B5%E5%86%85%E5%AE%B9%E6%80%BB%E7%BB%93.user.js
// @updateURL https://update.greasyfork.org/scripts/529783/AI%E7%BD%91%E9%A1%B5%E5%86%85%E5%AE%B9%E6%80%BB%E7%BB%93.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置参数
    const CONFIG = {
        // 替换为你的API密钥和端点
        apiKey: 'YOUR_API_KEY_HERE',
        apiEndpoint: 'https://api.openai.com/v1/chat/completions',
        model: 'gpt-3.5-turbo',
        maxTokens: 1000,
        temperature: 0.7,
        // UI配置
        uiPosition: 'top-right', // 可选: top-left, top-right, bottom-left, bottom-right
        theme: 'light', // 可选: light, dark
        // 自动触发设置
        autoSummarize: true, // 是否自动总结
        delay: 500, // 页面加载后延迟多少毫秒开始总结
        // 自动总结域名列表
        autoSummarizeDomains: ['juejin.cn', 'zhihu.com', 'csdn.net', 'jianshu.com'],
        // 域名黑名单，支持通配符 *
        blacklistDomains: ['*google.com', '*facebook.com', '*twitter.com', '*baidu.com', "*youtube.com", "*greasyfork.org"]
    };

    // 保存用户配置
    const savedConfig = GM_getValue('aiSummaryConfig');
    if (savedConfig) {
        Object.assign(CONFIG, JSON.parse(savedConfig));
    }

    // 添加样式
    GM_addStyle(`
        #ai-summary-container {
            position: fixed;
            width: 350px;
            max-height: 500px;
            background-color: ${CONFIG.theme === 'light' ? '#ffffff' : '#2d2d2d'};
            color: ${CONFIG.theme === 'light' ? '#333333' : '#f0f0f0'};
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            z-index: 9999;
            overflow: hidden;
            font-family: Arial, sans-serif;
            transition: all 0.3s ease;
            opacity: 0.95;
        }
        #ai-summary-container:hover {
            opacity: 1;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
        #ai-summary-header {
            padding: 10px 15px;
            background-color: ${CONFIG.theme === 'light' ? '#f0f0f0' : '#444444'};
            border-bottom: 1px solid ${CONFIG.theme === 'light' ? '#e0e0e0' : '#555555'};
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: move;
        }
        #ai-summary-title {
            font-weight: bold;
            font-size: 14px;
            margin: 0;
        }
        #ai-summary-controls {
            display: flex;
            gap: 5px;
        }
        #ai-summary-controls button {
            background: none;
            border: none;
            cursor: pointer;
            font-size: 16px;
            color: ${CONFIG.theme === 'light' ? '#555' : '#ccc'};
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
        }
        #ai-summary-controls button:hover {
            background-color: ${CONFIG.theme === 'light' ? '#e0e0e0' : '#555555'};
        }
        #ai-summary-content {
            padding: 15px;
            overflow-y: auto;
            max-height: 400px;
            font-size: 14px;
            line-height: 1.5;
        }
        #ai-summary-content.loading {
            opacity: 0.7;
        }
        #ai-summary-content p {
            margin: 0 0 10px 0;
        }
        #ai-summary-footer {
            padding: 8px 15px;
            border-top: 1px solid ${CONFIG.theme === 'light' ? '#e0e0e0' : '#555555'};
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            color: ${CONFIG.theme === 'light' ? '#888' : '#aaa'};
        }
        #ai-summary-settings {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: ${CONFIG.theme === 'light' ? '#ffffff' : '#2d2d2d'};
            border: 1px solid ${CONFIG.theme === 'light' ? '#e0e0e0' : '#555555'};
            border-radius: 8px;
            padding: 0;
            width: 450px;
            max-height: 85vh;
            z-index: 10001;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            overflow: hidden;
            display: none;
            flex-direction: column;
        }
        #ai-summary-settings.visible {
            display: flex;
        }
        .settings-header {
            padding: 12px 15px;
            background-color: ${CONFIG.theme === 'light' ? '#f5f5f5' : '#333333'};
            border-bottom: 1px solid ${CONFIG.theme === 'light' ? '#e0e0e0' : '#555555'};
            font-weight: bold;
            font-size: 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .settings-header .close-settings {
            cursor: pointer;
            font-size: 20px;
            color: ${CONFIG.theme === 'light' ? '#666' : '#aaa'};
        }
        .settings-header .close-settings:hover {
            color: ${CONFIG.theme === 'light' ? '#333' : '#fff'};
        }
        .settings-scroll-area {
            flex: 1;
            overflow-y: auto;
            padding: 15px;
            max-height: 60vh;
        }
        .settings-group {
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 1px dashed ${CONFIG.theme === 'light' ? '#eee' : '#444'};
        }
        .settings-group:last-child {
            border-bottom: none;
        }
        .settings-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
            font-size: 14px;
        }
        .checkbox-group label {
            display: flex;
            align-items: center;
            font-weight: bold;
        }
        .checkbox-group input {
            margin-right: 8px;
        }
        .settings-group small {
            display: block;
            margin-top: 4px;
            font-size: 12px;
            color: ${CONFIG.theme === 'light' ? '#888' : '#aaa'};
        }
        .settings-group input[type="text"],
        .settings-group input[type="password"],
        .settings-group input[type="number"],
        .settings-group select,
        .settings-group textarea {
            width: 100%;
            padding: 8px;
            border: 1px solid ${CONFIG.theme === 'light' ? '#e0e0e0' : '#555555'};
            border-radius: 4px;
            background-color: ${CONFIG.theme === 'light' ? '#ffffff' : '#333333'};
            color: ${CONFIG.theme === 'light' ? '#333333' : '#f0f0f0'};
            font-size: 14px;
        }
        .settings-group textarea {
            min-height: 80px;
            resize: vertical;
        }
        .settings-group input[type="range"] {
            width: 100%;
            margin: 8px 0;
        }
        .settings-group input[type="checkbox"] {
            width: auto;
        }
        .settings-actions {
            padding: 12px 15px;
            background-color: ${CONFIG.theme === 'light' ? '#f5f5f5' : '#333333'};
            border-top: 1px solid ${CONFIG.theme === 'light' ? '#e0e0e0' : '#555555'};
            display: flex;
            justify-content: flex-end;
            gap: 10px;
        }
        .settings-actions button {
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            transition: all 0.2s;
        }
        #save-settings {
            background-color: #4CAF50;
            color: white;
        }
        #save-settings:hover {
            background-color: #45a049;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
        #cancel-settings {
            background-color: ${CONFIG.theme === 'light' ? '#e0e0e0' : '#444444'};
            color: ${CONFIG.theme === 'light' ? '#333333' : '#f0f0f0'};
        }
        #cancel-settings:hover {
            background-color: ${CONFIG.theme === 'light' ? '#d0d0d0' : '#555555'};
        }
        .cursor-pointer {
            cursor: pointer;
        }
        .typing-effect {
            border-right: 2px solid ${CONFIG.theme === 'light' ? '#333' : '#f0f0f0'};
            white-space: nowrap;
            overflow: hidden;
            animation: typing 3.5s steps(40, end), blink-caret 0.75s step-end infinite;
        }
        @keyframes typing {
            from { width: 0 }
            to { width: 100% }
        }
        @keyframes blink-caret {
            from, to { border-color: transparent }
            50% { border-color: ${CONFIG.theme === 'light' ? '#333' : '#f0f0f0'} }
        }
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        .settings-backdrop {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 10000;
            display: none;
        }
        .settings-backdrop.visible {
            display: block;
        }
    `);

    // 检查域名是否匹配通配符规则
    function domainMatchesPattern(domain, pattern) {
        // 转换通配符为正则表达式
        try {
            const regexPattern = pattern.replace(/\./g, '\\.').replace(/\*/g, '.*');
            const regex = new RegExp(`^${regexPattern}$`);
            return regex.test(domain);
        } catch (error) {
            console.error('域名匹配错误:', error);
            return false;
        }
    }

    // 检查当前域名是否在黑名单中
    function isCurrentDomainBlacklisted() {
        const currentDomain = window.location.hostname;

        for (const pattern of CONFIG.blacklistDomains) {
            if (domainMatchesPattern(currentDomain, pattern)) {
                console.log(`当前域名 ${currentDomain} 匹配黑名单规则 ${pattern}，不创建UI`);
                return true;
            }
        }

        return false;
    }

    // 创建UI
    function createUI() {
        console.log('创建UI组件...');

        // 创建主容器
        const container = document.createElement('div');
        container.id = 'ai-summary-container';
        container.innerHTML = `
            <div id="ai-summary-header">
                <h3 id="ai-summary-title">AI网页内容总结</h3>
                <div id="ai-summary-controls">
                    <button id="ai-summary-refresh" title="刷新总结">🔄</button>
                    <button id="ai-summary-settings-btn" title="设置">⚙️</button>
                    <button id="ai-summary-minimize" title="最小化">_</button>
                    <button id="ai-summary-close" title="关闭">✕</button>
                </div>
            </div>
            <div id="ai-summary-content">
                <p>点击刷新按钮开始总结当前网页内容...</p>
            </div>
            <div id="ai-summary-footer">
                <span>由AI提供支持</span>
                <span id="ai-summary-toggle" class="cursor-pointer">自动总结: ${CONFIG.autoSummarize ? '开启' : '关闭'}</span>
            </div>
        `;
        document.body.appendChild(container);

        // 创建背景遮罩和设置面板
        const backdrop = document.createElement('div');
        backdrop.className = 'settings-backdrop';
        document.body.appendChild(backdrop);

        const settingsPanel = document.createElement('div');
        settingsPanel.id = 'ai-summary-settings';
        settingsPanel.innerHTML = `
            <div class="settings-header">
                <span>AI总结设置</span>
                <span class="close-settings">×</span>
            </div>
            <div class="settings-scroll-area">
                <div class="settings-group">
                    <label for="api-key">API密钥</label>
                    <input type="password" id="api-key" value="${CONFIG.apiKey}" placeholder="输入你的API密钥">
                    <small>用于访问AI服务的密钥</small>
                </div>
                <div class="settings-group">
                    <label for="api-endpoint">API端点</label>
                    <input type="text" id="api-endpoint" value="${CONFIG.apiEndpoint}" placeholder="API端点URL">
                    <small>例如: https://api.openai.com/v1/chat/completions</small>
                </div>
                <div class="settings-group">
                    <label for="model">AI模型</label>
                    <input type="text" id="model" value="${CONFIG.model}" placeholder="AI模型名称">
                    <small>例如: gpt-3.5-turbo, gpt-4</small>
                </div>
                <div class="settings-group">
                    <label for="max-tokens">最大令牌数</label>
                    <input type="number" id="max-tokens" value="${CONFIG.maxTokens}" min="100" max="4000">
                    <small>生成内容的最大长度(100-4000)</small>
                </div>
                <div class="settings-group">
                    <label for="temperature">温度</label>
                    <input type="range" id="temperature" value="${CONFIG.temperature}" min="0" max="2" step="0.1">
                    <small>值: ${CONFIG.temperature} (0=精确, 2=创意)</small>
                </div>
                <div class="settings-group">
                    <label for="position">UI位置</label>
                    <select id="position">
                        <option value="top-left" ${CONFIG.uiPosition === 'top-left' ? 'selected' : ''}>左上角</option>
                        <option value="top-right" ${CONFIG.uiPosition === 'top-right' ? 'selected' : ''}>右上角</option>
                        <option value="bottom-left" ${CONFIG.uiPosition === 'bottom-left' ? 'selected' : ''}>左下角</option>
                        <option value="bottom-right" ${CONFIG.uiPosition === 'bottom-right' ? 'selected' : ''}>右下角</option>
                    </select>
                    <small>浮窗显示的位置</small>
                </div>
                <div class="settings-group">
                    <label for="theme">主题</label>
                    <select id="theme">
                        <option value="light" ${CONFIG.theme === 'light' ? 'selected' : ''}>浅色</option>
                        <option value="dark" ${CONFIG.theme === 'dark' ? 'selected' : ''}>深色</option>
                    </select>
                    <small>UI界面主题风格</small>
                </div>
                <div class="settings-group">
                    <label for="delay">延迟时间(毫秒)</label>
                    <input type="number" id="delay" value="${CONFIG.delay}" min="0" max="10000" step="100">
                    <small>页面加载后延迟多久开始自动总结</small>
                </div>
                <div class="settings-group checkbox-group">
                    <label>
                        <input type="checkbox" id="auto-summarize" ${CONFIG.autoSummarize ? 'checked' : ''}>
                        <span>自动总结</span>
                    </label>
                    <small>在支持的网站上自动开始总结</small>
                </div>
                <div class="settings-group">
                    <label for="auto-domains">自动总结域名列表</label>
                    <textarea id="auto-domains" placeholder="输入域名，每行一个或用逗号分隔">${CONFIG.autoSummarizeDomains.join(', ')}</textarea>
                    <small>在这些域名上自动总结，例如: juejin.cn, zhihu.com</small>
                </div>
                <div class="settings-group">
                    <label for="blacklist-domains">域名黑名单</label>
                    <textarea id="blacklist-domains" placeholder="输入黑名单域名，每行一个或用逗号分隔">${CONFIG.blacklistDomains.join(', ')}</textarea>
                    <small>在这些域名上不显示总结工具，支持通配符*</small>
                </div>
            </div>
            <div class="settings-actions">
                <button id="cancel-settings">取消</button>
                <button id="save-settings">保存设置</button>
            </div>
        `;
        document.body.appendChild(settingsPanel);

        // 初始化UI位置
        updateUIPosition(CONFIG.uiPosition);

        // 添加拖动功能
        if (typeof makeElementDraggable === 'function') {
            makeElementDraggable(container);
        } else {
            console.error('拖动功能未定义');
        }

        // 重要：等待DOM更新后再绑定事件
        setTimeout(() => {
            bindEventListeners();
        }, 0);
    }

    // 更新温度显示
    function updateTemperatureValue() {
        const temp = document.getElementById('temperature');
        const small = temp.nextElementSibling;
        small.textContent = `值: ${temp.value} (0=精确, 2=创意)`;
    }

    // 绑定所有事件监听器
    function bindEventListeners() {

        // 设置按钮
        const settingsBtn = document.getElementById('ai-summary-settings-btn');
        if (settingsBtn) {
            console.log('找到设置按钮，绑定点击事件');
            settingsBtn.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                showSettings();
                return false;
            };
        } else {
            console.error('找不到设置按钮元素');
        }

        // 刷新按钮
        const refreshBtn = document.getElementById('ai-summary-refresh');
        if (refreshBtn) {
            refreshBtn.onclick = function() {
                summarizeContent();
            };
        }

        // 最小化按钮
        const minimizeBtn = document.getElementById('ai-summary-minimize');
        if (minimizeBtn) {
            minimizeBtn.onclick = function() {
                toggleMinimize();
            };
        }

        // 关闭按钮
        const closeBtn = document.getElementById('ai-summary-close');
        if (closeBtn) {
            closeBtn.onclick = function() {
                document.getElementById('ai-summary-container').style.display = 'none';
            };
        }

        // 自动总结开关
        const toggleBtn = document.getElementById('ai-summary-toggle');
        if (toggleBtn) {
            toggleBtn.onclick = function() {
                toggleAutoSummarize();
            };
        }

        // 设置面板的关闭按钮
        const closeSettingsBtn = document.querySelector('.close-settings');
        if (closeSettingsBtn) {
            closeSettingsBtn.onclick = function() {
                hideSettings();
            };
        }

        // 取消按钮
        const cancelBtn = document.getElementById('cancel-settings');
        if (cancelBtn) {
            cancelBtn.onclick = function() {
                hideSettings();
            };
        }

        // 保存按钮
        const saveBtn = document.getElementById('save-settings');
        if (saveBtn) {
            saveBtn.onclick = function() {
                saveSettings();
            };
        }

        // 设置背景点击关闭
        const backdrop = document.querySelector('.settings-backdrop');
        if (backdrop) {
            backdrop.onclick = function() {
                hideSettings();
            };
        }

        // 阻止设置面板点击冒泡
        const settingsPanel = document.getElementById('ai-summary-settings');
        if (settingsPanel) {
            settingsPanel.onclick = function(e) {
                e.stopPropagation();
            };
        }

        // 添加温度滑块事件
        const tempSlider = document.getElementById('temperature');
        if (tempSlider) {
            tempSlider.oninput = function() {
                updateTemperatureValue();
            };
        }

        console.log('所有事件绑定完成');
    }

    // 显示设置面板
    function showSettings() {
        console.log('显示设置面板');
        document.querySelector('.settings-backdrop').style.display = 'block';
        document.getElementById('ai-summary-settings').style.display = 'flex';
    }

    // 隐藏设置面板
    function hideSettings() {
        console.log('隐藏设置面板');
        document.querySelector('.settings-backdrop').style.display = 'none';
        document.getElementById('ai-summary-settings').style.display = 'none';
    }

    // 切换最小化状态
    function toggleMinimize() {
        const content = document.getElementById('ai-summary-content');
        const footer = document.getElementById('ai-summary-footer');
        const button = document.getElementById('ai-summary-minimize');

        if (content.style.display === 'none') {
            content.style.display = 'block';
            footer.style.display = 'flex';
            button.textContent = '_';
        } else {
            content.style.display = 'none';
            footer.style.display = 'none';
            button.textContent = '□';
        }
    }

    // 切换自动总结
    function toggleAutoSummarize() {
        CONFIG.autoSummarize = !CONFIG.autoSummarize;
        document.getElementById('ai-summary-toggle').textContent = `自动总结: ${CONFIG.autoSummarize ? '开启' : '关闭'}`;
        // 如果设置面板已创建
        const autoCheckbox = document.getElementById('auto-summarize');
        if (autoCheckbox) {
            autoCheckbox.checked = CONFIG.autoSummarize;
        }
        saveConfig();
    }

    // 保存设置
    function saveSettings() {
        console.log('保存设置');

        // 获取用户输入的配置
        CONFIG.apiKey = document.getElementById('api-key').value;
        CONFIG.apiEndpoint = document.getElementById('api-endpoint').value;
        CONFIG.model = document.getElementById('model').value;
        CONFIG.maxTokens = parseInt(document.getElementById('max-tokens').value) || 1000;
        CONFIG.temperature = parseFloat(document.getElementById('temperature').value) || 0.7;
        CONFIG.uiPosition = document.getElementById('position').value;
        CONFIG.theme = document.getElementById('theme').value;
        CONFIG.delay = parseInt(document.getElementById('delay').value) || 500;
        CONFIG.autoSummarize = document.getElementById('auto-summarize').checked;

        // 获取并处理自动总结域名列表和黑名单
        const domainsInput = document.getElementById('auto-domains').value;
        CONFIG.autoSummarizeDomains = domainsInput.split(/[,\n]/).map(domain => domain.trim()).filter(domain => domain);

        const blacklistInput = document.getElementById('blacklist-domains').value;
        CONFIG.blacklistDomains = blacklistInput.split(/[,\n]/).map(domain => domain.trim()).filter(domain => domain);

        // 保存配置
        saveConfig();

        // 更新UI
        updateUIWithConfig();

        // 隐藏设置面板
        hideSettings();

        // 显示保存成功提示
        const contentElement = document.getElementById('ai-summary-content');
        contentElement.innerHTML = '<p>设置已保存</p>';
        setTimeout(() => {
            contentElement.innerHTML = '<p>点击刷新按钮开始总结当前网页内容...</p>';
        }, 2000);
    }

    // 根据配置更新UI
    function updateUIWithConfig() {
        // 更新位置
        updateUIPosition(CONFIG.uiPosition);

        // 更新主题
        if (CONFIG.theme === 'light') {
            const container = document.getElementById('ai-summary-container');
            container.style.backgroundColor = '#ffffff';
            container.style.color = '#333333';
        } else {
            const container = document.getElementById('ai-summary-container');
            container.style.backgroundColor = '#2d2d2d';
            container.style.color = '#f0f0f0';
        }

        // 更新自动总结开关文本
        document.getElementById('ai-summary-toggle').textContent = `自动总结: ${CONFIG.autoSummarize ? '开启' : '关闭'}`;
    }

    // 使元素可拖拽
    function makeElementDraggable(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        const header = document.getElementById('ai-summary-header');

        if (header) {
            header.onmousedown = dragMouseDown;
        } else {
            element.onmousedown = dragMouseDown;
        }

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            // 获取鼠标位置
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // 鼠标移动时调用elementDrag
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // 计算新位置
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // 设置元素的新位置
            element.style.top = (element.offsetTop - pos2) + 'px';
            element.style.left = (element.offsetLeft - pos1) + 'px';
            // 重置位置配置，因为用户手动拖动了
            CONFIG.uiPosition = 'custom';
        }

        function closeDragElement() {
            // 停止移动
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    // 提取网页内容
    function extractPageContent() {
        // 获取页面标题
        const title = document.title;

        // 使用Turndown将HTML转换为Markdown
        const turndownService = new TurndownService({
            headingStyle: 'atx',
            codeBlockStyle: 'fenced',
            emDelimiter: '_',
            hr: '---',
            bulletListMarker: '-',
        });

        // 自定义规则以更好地处理内容
        turndownService.addRule('removeAds', {
            filter: function(node) {
                // 过滤掉可能的广告元素
                return node.className && (
                    node.className.includes('ad') ||
                    node.className.includes('banner') ||
                    node.className.includes('sidebar') ||
                    node.id && (node.id.includes('ad') || node.id.includes('banner'))
                );
            },
            replacement: function() {
                return '';
            }
        });

        // 添加自定义规则，忽略一些不需要的元素
        turndownService.addRule('ignoreNavAndFooter', {
            filter: function(node) {
                return (
                    node.nodeName.toLowerCase() === 'nav' ||
                    node.nodeName.toLowerCase() === 'footer' ||
                    node.classList.contains('nav') ||
                    node.classList.contains('footer') ||
                    node.classList.contains('menu') ||
                    node.id === 'footer' ||
                    node.id === 'nav' ||
                    node.id === 'menu'
                );
            },
            replacement: function() {
                return '';
            }
        });

        // 尝试获取文章内容
        let content = '';
        let htmlContent = '';

        // 尝试获取文章内容
        const articleElements = document.querySelectorAll('article, .article, .post, .content, main, .main-content, [role="main"]');
        if (articleElements.length > 0) {
            // 使用第一个找到的文章元素
            htmlContent = articleElements[0].innerHTML;
        } else {
            // 如果没有找到文章元素，尝试获取所有段落
            const paragraphs = document.querySelectorAll('p');
            if (paragraphs.length > 0) {
                // 创建一个临时容器来存放所有段落
                const tempContainer = document.createElement('div');
                paragraphs.forEach(p => {
                    // 只添加有实际内容的段落
                    if (p.textContent.trim().length > 0) {
                        tempContainer.appendChild(p.cloneNode(true));
                    }
                });
                htmlContent = tempContainer.innerHTML;
            } else {
                // 如果没有找到段落，获取body的内容
                // 但排除一些常见的非内容区域
                const body = document.body.cloneNode(true);
                const elementsToRemove = body.querySelectorAll('header, footer, nav, aside, script, style, .sidebar, .ad, .advertisement, .banner, .navigation, .related, .recommended');
                elementsToRemove.forEach(el => el.remove());
                htmlContent = body.innerHTML;
            }
        }

        // 将HTML转换为Markdown
        content = turndownService.turndown(htmlContent);

        // 清理内容（删除多余空白行）
        content = content.replace(/\n{3,}/g, '\n\n').trim();

        // 如果内容太长，截取前10000个字符
        if (content.length > 10000) {
            content = content.substring(0, 10000) + '...';
        }

        return { title, content };
    }

    // 调用AI API进行总结
    function summarizeContent(isAuto = false) {
        // 显示加载状态
        const contentElement = document.getElementById('ai-summary-content');
        contentElement.classList.add('loading');
        contentElement.innerHTML = isAuto
            ? '<p>正在自动总结内容，请稍候...</p>'
            : '<p>正在总结内容，请稍候...</p>';

        // 提取页面内容
        const { title, content } = extractPageContent();

        // 如果API密钥未设置，显示提示
        if (CONFIG.apiKey === 'YOUR_API_KEY_HERE') {
            contentElement.classList.remove('loading');
            contentElement.innerHTML = '<p>请先在设置中配置你的API密钥</p>';
            return;
        }

        // 准备请求数据
        const requestData = {
            model: CONFIG.model,
            messages: [
                {
                    role: 'system',
                    content: '你是一个专业的内容总结助手。请简洁明了地总结以下网页内容的要点，包含主要观点、关键信息和重要细节。通俗易懂，突出重点。'
                },
                {
                    role: 'user',
                    content: `网页标题: ${title}\n\n网页内容: ${content}\n\n请总结这个网页的主要内容，突出关键信息。`
                }
            ],
            max_tokens: CONFIG.maxTokens,
            temperature: CONFIG.temperature,
            stream: true
        };

        // 发送API请求
        let summaryText = '';
        let lastResponseLength = 0; // 添加此变量来跟踪响应长度
        contentElement.innerHTML = '';

        GM_xmlhttpRequest({
            method: 'POST',
            url: CONFIG.apiEndpoint,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${CONFIG.apiKey}`
            },
            data: JSON.stringify(requestData),
            timeout: 30000, // 设置30秒超时
            onloadstart: function() {
                // 创建一个段落用于显示流式响应
                const paragraph = document.createElement('p');
                contentElement.appendChild(paragraph);
                console.log('开始接收流式响应...');
            },
            onreadystatechange: function(response) {
                try {
                    // 处理流式响应
                    const responseText = response.responseText || '';

                    // 只处理新数据
                    if (responseText.length <= lastResponseLength) {
                        return;
                    }

                    // 计算新数据
                    const newResponseText = responseText.substring(lastResponseLength);
                    lastResponseLength = responseText.length;

                    console.log(`接收到新数据，长度: ${newResponseText.length}, 总长度: ${responseText.length}`);

                    // 将新响应拆分为各个数据行
                    const lines = newResponseText.split('\n');
                    let newContent = '';

                    for (const line of lines) {
                        if (line.startsWith('data: ') && line !== 'data: [DONE]') {
                            try {
                                const jsonStr = line.substring(6);
                                if (jsonStr.trim() === '') continue;

                                const data = JSON.parse(jsonStr);
                                if (data.choices && data.choices[0].delta && data.choices[0].delta.content) {
                                    newContent += data.choices[0].delta.content;
                                }
                            } catch (e) {
                                // 可能是不完整的JSON，忽略错误
                                console.log('解析单行数据时出错 (可能是不完整的JSON):', e.message);
                            }
                        }
                    }

                    // 只要有新内容就立即更新UI
                    if (newContent) {
                        summaryText += newContent;
                        const paragraph = contentElement.querySelector('p');
                        if (paragraph) {
                            paragraph.innerHTML = renderMarkdown(summaryText);
                            contentElement.scrollTop = contentElement.scrollHeight; // 滚动到底部
                        }
                    }
                } catch (error) {
                    console.error('处理流式响应时出错:', error);
                }
            },
            onload: function(response) {
                contentElement.classList.remove('loading');

                if (response.status !== 200) {
                    contentElement.innerHTML = `<p>API请求失败: ${response.status} ${response.statusText}</p>`;
                    console.error('API请求失败:', response.status, response.statusText, response.responseText);
                    return;
                }

                // 确保我们有完整的内容
                if (summaryText.trim() === '') {
                    console.log('尝试从完整响应中提取内容...');
                    // 提取完整响应内容的逻辑...
                    // ... existing code for handling complete response ...
                } else {
                    console.log('流式响应已完成，总内容长度:', summaryText.length);
                }
            },
            onerror: function(error) {
                contentElement.classList.remove('loading');
                contentElement.innerHTML = `<p>请求出错: ${error}</p>`;
                console.error('API请求出错:', error);
            },
            ontimeout: function() {
                contentElement.classList.remove('loading');
                contentElement.innerHTML = '<p>请求超时，请检查网络连接或API端点是否正确</p>';
                console.error('API请求超时');
            }
        });
    }

    // 在页面加载完成后初始化
    // 渲染Markdown文本为HTML
    function renderMarkdown(text) {
        if (!text) return '';

        // 基本Markdown语法转换
        let html = text
            // 标题
            .replace(/^### (.+)$/gm, '<h3>$1</h3>')
            .replace(/^## (.+)$/gm, '<h2>$1</h2>')
            .replace(/^# (.+)$/gm, '<h1>$1</h1>')
            // 粗体
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            // 斜体
            .replace(/\*(.+?)\*/g, '<em>$1</em>')
            // 代码块
            .replace(/```([\s\S]+?)```/g, '<pre><code>$1</code></pre>')
            // 行内代码
            .replace(/`(.+?)`/g, '<code>$1</code>')
            // 链接
            .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank">$1</a>')
            // 无序列表
            .replace(/^- (.+)$/gm, '<li>$1</li>')
            // 有序列表
            .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
            // 段落
            .replace(/\n\n/g, '</p><p>');

        // 包装在段落标签中
        html = '<p>' + html + '</p>';

        // 修复列表
        html = html.replace(/<p><li>/g, '<ul><li>').replace(/<\/li><\/p>/g, '</li></ul>');

        return html;
    }

    // 使用事件监听器确保DOM已加载
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeScript);
    } else {
        initializeScript();
    }

    // 初始化脚本
    function initializeScript() {
        // 检查当前域名是否在黑名单中
        if (isCurrentDomainBlacklisted()) {
            return;
        }

        console.log('初始化UI...');
        createUI();

        // 如果配置为自动总结，且当前域名在自动总结列表中，则自动开始总结
        if (CONFIG.autoSummarize && isAutoSummarizeDomain()) {
            console.log('符合自动总结条件，延迟开始总结...');
            setTimeout(() => {
                summarizeContent(true);
            }, CONFIG.delay);
        }
    }

    // 更新UI位置
    function updateUIPosition(position) {
        const container = document.getElementById('ai-summary-container');
        if (!container) return;

        // 重置所有位置
        container.style.top = 'auto';
        container.style.bottom = 'auto';
        container.style.left = 'auto';
        container.style.right = 'auto';

        // 根据配置设置位置
        if (position.includes('top')) {
            container.style.top = '10px';
        } else {
            container.style.bottom = '10px';
        }

        if (position.includes('right')) {
            container.style.right = '20px';
        } else {
            container.style.left = '20px';
        }

        console.log(`UI位置已更新为: ${position}`);
    }

    // 检查当前域名是否在自动总结列表中
    function isAutoSummarizeDomain() {
        const currentDomain = window.location.hostname;
        return CONFIG.autoSummarizeDomains.some(domain => currentDomain.includes(domain));
    }

    // 保存配置到本地存储
    function saveConfig() {
        try {
            GM_setValue('aiSummaryConfig', JSON.stringify(CONFIG));
            console.log('配置已保存');
        } catch (error) {
            console.error('保存配置时出错:', error);
            alert('保存配置失败，请查看控制台获取详细信息');
        }
    }
})();