// ==UserScript==
// @name         udemy 自动脚本
// @namespace    http://tampermonkey.net/
// @version      0.12
// @description  udemy自动点击，自动调整视频进度，自动答题，自动跳过评分
// @author       xiaoyuyu
// @match        https://eylearning.udemy.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=udemy.com
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/462820/udemy%20%E8%87%AA%E5%8A%A8%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/462820/udemy%20%E8%87%AA%E5%8A%A8%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置
    const CONFIG = {
        commonDelay: GM_getValue('commonDelay', 1000),
        artDelay: GM_getValue('artDelay', 10000),
        threadDelay: GM_getValue('threadDelay', 1000),
        answerDelay: GM_getValue('answerDelay', 500),
        videoCheckInterval: GM_getValue('videoCheckInterval', 2000), // 检查视频状态的间隔
        maxRetries: GM_getValue('maxRetries', 3), // 设置进度条的最大重试次数
        codeSubmitDelay: GM_getValue('codeSubmitDelay', 5000), // 代码提交后等待时间
        scriptEnabled: GM_getValue('scriptEnabled', true), // 脚本是否启用
        sijiLiudongAPI: GM_getValue('sijiLiudongAPI', ''), // 硅基流动API KEY
        selectedModel: GM_getValue('selectedModel', '') // 选择的模型ID
    };

    // 保存配置到GM存储
    function saveConfig() {
        Object.keys(CONFIG).forEach(key => {
            GM_setValue(key, CONFIG[key]);
        });
        log('配置已保存', 'success');
    }

    // 硅基流动API相关
    const SIJI_API = {
        baseUrl: 'https://api.siliconflow.cn/v1',
        maxRetries: 3, // 最大重试次数
        fetchModels: async (apiKey) => {
            try {
                const response = await fetch(`${SIJI_API.baseUrl}/models`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`
                    }
                });
                
                if (!response.ok) {
                    throw new Error(`API请求失败: ${response.status}`);
                }
                
                const data = await response.json();
                return data.data || [];
            } catch (error) {
                log(`获取模型列表失败: ${error.message}`, 'error');
                return [];
            }
        },
        generateCode: async (apiKey, modelId, prompt, retryCount = 0) => {
            try {
                log(`尝试生成代码 (尝试 ${retryCount + 1}/${SIJI_API.maxRetries + 1})`, 'info');
                const response = await fetch(`${SIJI_API.baseUrl}/chat/completions`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`
                    },
                    body: JSON.stringify({
                        model: modelId,
                        messages: [
                            {
                                role: 'system',
                                content: '你是一个代码助手，请仅返回代码，不要有任何解释或额外的文字。'
                            },
                            {
                                role: 'user',
                                content: prompt
                            }
                        ],
                        temperature: 0.3
                    })
                });
                
                if (!response.ok) {
                    const status = response.status;
                    // 处理504超时错误，进行重试
                    if ((status === 504 || status === 503 || status === 502) && retryCount < SIJI_API.maxRetries) {
                        log(`API请求超时(${status})，${retryCount + 1}/${SIJI_API.maxRetries}次重试中...`, 'warning');
                        // 指数退避，每次重试等待更长时间
                        const waitTime = 1000 * Math.pow(2, retryCount);
                        await sleep(waitTime);
                        return SIJI_API.generateCode(apiKey, modelId, prompt, retryCount + 1);
                    }
                    throw new Error(`API请求失败: ${status}`);
                }
                
                const data = await response.json();
                return data.choices && data.choices[0] && data.choices[0].message ? 
                       data.choices[0].message.content : '';
            } catch (error) {
                // 处理网络错误，也进行重试
                if (retryCount < SIJI_API.maxRetries) {
                    log(`生成代码出错: ${error.message}，${retryCount + 1}/${SIJI_API.maxRetries}次重试中...`, 'warning');
                    const waitTime = 1000 * Math.pow(2, retryCount);
                    await sleep(waitTime);
                    return SIJI_API.generateCode(apiKey, modelId, prompt, retryCount + 1);
                }
                log(`生成代码失败: ${error.message}`, 'error');
                return '';
            }
        }
    };

    // 添加样式
    GM_addStyle(`
        #script-control-panel {
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 9999;
            background-color: rgba(255, 255, 255, 0.9);
            border: 1px solid #ccc;
            border-radius: 5px;
            padding: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
            font-family: Arial, sans-serif;
            font-size: 14px;
            transition: all 0.3s ease;
            min-width: 250px;
        }
        #script-control-panel.minimized {
            width: 30px;
            height: 30px;
            overflow: hidden;
            padding: 0;
            border-radius: 50%;
            cursor: pointer;
            background-color: rgba(0, 120, 215, 0.8);
        }
        #script-control-panel.minimized:before {
            content: "+";
            color: white;
            font-size: 24px;
            line-height: 30px;
            text-align: center;
            display: block;
        }
        #script-control-panel .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            cursor: move;
        }
        #script-control-panel .title {
            font-weight: bold;
            user-select: none;
        }
        #script-control-panel .minimize-btn {
            cursor: pointer;
            background: none;
            border: none;
            font-size: 16px;
        }
        #script-control-panel .controls {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        #script-control-panel .switch-container {
            display: flex;
            align-items: center;
        }
        #script-control-panel .switch {
            position: relative;
            display: inline-block;
            width: 40px;
            height: 20px;
            margin-right: 10px;
        }
        #script-control-panel .switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }
        #script-control-panel .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            transition: .3s;
            border-radius: 20px;
        }
        #script-control-panel .slider:before {
            position: absolute;
            content: "";
            height: 16px;
            width: 16px;
            left: 2px;
            bottom: 2px;
            background-color: white;
            transition: .3s;
            border-radius: 50%;
        }
        #script-control-panel input:checked + .slider {
            background-color: #2196F3;
        }
        #script-control-panel input:checked + .slider:before {
            transform: translateX(20px);
        }
        #script-control-panel .status {
            margin-top: 10px;
            font-style: italic;
            font-size: 12px;
            color: #666;
        }
        #log-container {
            max-height: 150px;
            overflow-y: auto;
            border-top: 1px solid #eee;
            margin-top: 10px;
            padding-top: 5px;
            font-size: 12px;
        }
        .log-entry {
            margin: 2px 0;
            color: #333;
        }
        .log-entry.info {
            color: #0066cc;
        }
        .log-entry.success {
            color: #009900;
        }
        .log-entry.warning {
            color: #cc6600;
        }
        .log-entry.error {
            color: #cc0000;
        }
        #script-control-panel input[type="text"],
        #script-control-panel input[type="number"],
        #script-control-panel select {
            width: 100%;
            padding: 5px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 12px;
            margin-top: 3px;
        }
        #script-control-panel select {
            background-color: white;
        }
        #script-control-panel .form-group {
            margin-bottom: 8px;
        }
        #script-control-panel .form-group label {
            display: block;
            font-size: 12px;
            margin-bottom: 3px;
        }
        #script-control-panel .btn {
            background-color: #4CAF50;
            border: none;
            color: white;
            padding: 5px 10px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 12px;
            margin: 4px 2px;
            cursor: pointer;
            border-radius: 4px;
        }
        #script-control-panel .btn:hover {
            background-color: #45a049;
        }
        #script-control-panel .btn:disabled {
            background-color: #cccccc;
            cursor: not-allowed;
        }
        #script-control-panel .api-status {
            font-size: 11px;
            margin-top: 2px;
        }
        #script-control-panel .api-status.success {
            color: #009900;
        }
        #script-control-panel .api-status.error {
            color: #cc0000;
        }
        .siji-settings {
            border-top: 1px solid #eee;
            margin-top: 10px;
            padding-top: 10px;
        }
        .config-settings {
            border-top: 1px solid #eee;
            margin-top: 10px;
            padding-top: 10px;
        }
        .button-group {
            display: flex;
            justify-content: space-between;
        }
        .tab-container {
            display: flex;
            border-bottom: 1px solid #ddd;
            margin-bottom: 10px;
        }
        .tab {
            padding: 5px 10px;
            cursor: pointer;
            border: 1px solid transparent;
            border-bottom: none;
            border-radius: 4px 4px 0 0;
            margin-right: 2px;
            font-size: 12px;
        }
        .tab.active {
            background-color: #f5f5f5;
            border-color: #ddd;
        }
        .tab-content {
            display: none;
        }
        .tab-content.active {
            display: block;
        }
    `);

    // 创建UI控制面板
    async function createControlPanel() {
        const panel = document.createElement('div');
        panel.id = 'script-control-panel';
        
        // 基本控制UI
        panel.innerHTML = `
            <div class="header">
                <div class="title">Udemy自动脚本</div>
                <button class="minimize-btn">−</button>
            </div>
            
            <div class="tab-container">
                <div class="tab active" data-tab="main">主要</div>
                <div class="tab" data-tab="siji">硅基流动</div>
                <div class="tab" data-tab="config">配置</div>
            </div>
            
            <div class="controls">
                <div class="tab-content active" id="tab-main">
                    <div class="switch-container">
                        <label class="switch">
                            <input type="checkbox" id="script-toggle" ${CONFIG.scriptEnabled ? 'checked' : ''}>
                            <span class="slider"></span>
                        </label>
                        <span>启用脚本</span>
                    </div>
                </div>
                
                <div class="tab-content" id="tab-siji">
                    <div class="siji-settings">
                        <div class="form-group">
                            <label for="siji-api-key">硅基流动 API KEY</label>
                            <input type="text" id="siji-api-key" value="${CONFIG.sijiLiudongAPI}" placeholder="输入硅基流动API KEY">
                            <div class="api-status" id="api-key-status"></div>
                        </div>
                        
                        <div class="form-group">
                            <label for="model-select">选择模型</label>
                            <select id="model-select">
                                <option value="">-- 请先设置API KEY --</option>
                            </select>
                        </div>
                        
                        <button id="save-api-btn" class="btn">保存并获取模型</button>
                    </div>
                </div>
                
                <div class="tab-content" id="tab-config">
                    <div class="config-settings">
                        <div class="form-group">
                            <label for="common-delay">通用延迟 (ms)</label>
                            <input type="number" id="common-delay" value="${CONFIG.commonDelay}" min="0">
                        </div>
                        
                        <div class="form-group">
                            <label for="art-delay">阅读文章延迟 (ms)</label>
                            <input type="number" id="art-delay" value="${CONFIG.artDelay}" min="0">
                        </div>
                        
                        <div class="form-group">
                            <label for="thread-delay">循环间隔 (ms)</label>
                            <input type="number" id="thread-delay" value="${CONFIG.threadDelay}" min="0">
                        </div>
                        
                        <div class="form-group">
                            <label for="answer-delay">答题间隔 (ms)</label>
                            <input type="number" id="answer-delay" value="${CONFIG.answerDelay}" min="0">
                        </div>
                        
                        <div class="form-group">
                            <label for="video-check-interval">视频检查间隔 (ms)</label>
                            <input type="number" id="video-check-interval" value="${CONFIG.videoCheckInterval}" min="0">
                        </div>
                        
                        <div class="form-group">
                            <label for="max-retries">最大重试次数</label>
                            <input type="number" id="max-retries" value="${CONFIG.maxRetries}" min="1">
                        </div>
                        
                        <div class="form-group">
                            <label for="code-submit-delay">代码提交延迟 (ms)</label>
                            <input type="number" id="code-submit-delay" value="${CONFIG.codeSubmitDelay}" min="0">
                        </div>
                        
                        <div class="button-group">
                            <button id="save-config-btn" class="btn">保存配置</button>
                            <button id="reset-config-btn" class="btn">重置默认</button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="status" id="script-status">
                状态: ${CONFIG.scriptEnabled ? '运行中' : '已停止'}
            </div>
            <div id="log-container"></div>
        `;
        
        document.body.appendChild(panel);
        
        // 添加事件监听器
        const toggle = document.getElementById('script-toggle');
        toggle.addEventListener('change', function() {
            CONFIG.scriptEnabled = this.checked;
            document.getElementById('script-status').textContent = `状态: ${CONFIG.scriptEnabled ? '运行中' : '已停止'}`;
            log(`脚本已${CONFIG.scriptEnabled ? '启用' : '禁用'}`, CONFIG.scriptEnabled ? 'success' : 'warning');
            saveConfig();
        });

        // 标签切换
        const tabs = document.querySelectorAll('.tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // 移除所有active类
                tabs.forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                
                // 添加当前标签active类
                this.classList.add('active');
                document.getElementById(`tab-${this.dataset.tab}`).classList.add('active');
            });
        });

        // 硅基流动API保存和获取模型
        const saveApiBtn = document.getElementById('save-api-btn');
        saveApiBtn.addEventListener('click', async function() {
            const apiKey = document.getElementById('siji-api-key').value.trim();
            if (!apiKey) {
                updateApiStatus('请输入有效的API KEY', false);
                return;
            }
            
            saveApiBtn.disabled = true;
            saveApiBtn.textContent = '获取中...';
            updateApiStatus('正在验证API KEY...', null);
            
            // 保存API KEY
            CONFIG.sijiLiudongAPI = apiKey;
            GM_setValue('sijiLiudongAPI', apiKey);
            
            // 获取模型列表
            try {
                const models = await SIJI_API.fetchModels(apiKey);
                if (models.length > 0) {
                    updateModelSelect(models);
                    updateApiStatus('API KEY有效，已获取模型列表', true);
                    log('硅基流动API连接成功', 'success');
                } else {
                    updateApiStatus('获取模型列表失败，请检查API KEY', false);
                }
            } catch (error) {
                updateApiStatus('API连接失败: ' + error.message, false);
                log('硅基流动API连接失败: ' + error.message, 'error');
            }
            
            saveApiBtn.disabled = false;
            saveApiBtn.textContent = '保存并获取模型';
        });
        
        // 模型选择变更事件
        const modelSelect = document.getElementById('model-select');
        modelSelect.addEventListener('change', function() {
            CONFIG.selectedModel = this.value;
            GM_setValue('selectedModel', this.value);
            log(`已选择模型: ${this.options[this.selectedIndex].text}`, 'info');
        });
        
        // 配置保存按钮
        const saveConfigBtn = document.getElementById('save-config-btn');
        saveConfigBtn.addEventListener('click', function() {
            // 读取所有配置值
            CONFIG.commonDelay = parseInt(document.getElementById('common-delay').value) || 1000;
            CONFIG.artDelay = parseInt(document.getElementById('art-delay').value) || 10000;
            CONFIG.threadDelay = parseInt(document.getElementById('thread-delay').value) || 1000;
            CONFIG.answerDelay = parseInt(document.getElementById('answer-delay').value) || 500;
            CONFIG.videoCheckInterval = parseInt(document.getElementById('video-check-interval').value) || 2000;
            CONFIG.maxRetries = parseInt(document.getElementById('max-retries').value) || 3;
            CONFIG.codeSubmitDelay = parseInt(document.getElementById('code-submit-delay').value) || 5000;
            
            // 保存配置
            saveConfig();
        });
        
        // 重置配置按钮
        const resetConfigBtn = document.getElementById('reset-config-btn');
        resetConfigBtn.addEventListener('click', function() {
            // 重置为默认值
            document.getElementById('common-delay').value = 1000;
            document.getElementById('art-delay').value = 10000;
            document.getElementById('thread-delay').value = 1000;
            document.getElementById('answer-delay').value = 500;
            document.getElementById('video-check-interval').value = 2000;
            document.getElementById('max-retries').value = 3;
            document.getElementById('code-submit-delay').value = 5000;
            
            // 更新CONFIG对象
            CONFIG.commonDelay = 1000;
            CONFIG.artDelay = 10000;
            CONFIG.threadDelay = 1000;
            CONFIG.answerDelay = 500;
            CONFIG.videoCheckInterval = 2000;
            CONFIG.maxRetries = 3;
            CONFIG.codeSubmitDelay = 5000;
            
            // 保存配置
            saveConfig();
            
            log('已重置为默认配置', 'info');
        });
        
        // 如果已有API KEY，尝试获取模型列表
        if (CONFIG.sijiLiudongAPI) {
            try {
                const models = await SIJI_API.fetchModels(CONFIG.sijiLiudongAPI);
                if (models.length > 0) {
                    updateModelSelect(models);
                    updateApiStatus('API KEY有效', true);
                }
            } catch (error) {
                updateApiStatus('加载模型失败: ' + error.message, false);
            }
        }

        // 可拖动功能
        let isDragging = false;
        let offsetX, offsetY;
        
        panel.querySelector('.header').addEventListener('mousedown', function(e) {
            if (panel.classList.contains('minimized')) return;
            isDragging = true;
            offsetX = e.clientX - panel.getBoundingClientRect().left;
            offsetY = e.clientY - panel.getBoundingClientRect().top;
        });
        
        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            panel.style.left = (e.clientX - offsetX) + 'px';
            panel.style.top = (e.clientY - offsetY) + 'px';
            panel.style.right = 'auto';
        });
        
        document.addEventListener('mouseup', function() {
            isDragging = false;
        });
        
        // 最小化功能
        const minimizeBtn = panel.querySelector('.minimize-btn');
        minimizeBtn.addEventListener('click', function() {
            panel.classList.toggle('minimized');
            minimizeBtn.textContent = panel.classList.contains('minimized') ? '+' : '−';
        });
        
        // 点击最小化面板时展开
        panel.addEventListener('click', function(e) {
            if (panel.classList.contains('minimized') && e.target === panel) {
                panel.classList.remove('minimized');
                minimizeBtn.textContent = '−';
            }
        });
        
        return panel;
    }
    
    // 更新API状态显示
    function updateApiStatus(message, isSuccess) {
        const statusElement = document.getElementById('api-key-status');
        if (!statusElement) return;
        
        statusElement.textContent = message;
        statusElement.className = 'api-status';
        
        if (isSuccess === true) {
            statusElement.classList.add('success');
        } else if (isSuccess === false) {
            statusElement.classList.add('error');
        }
    }
    
    // 更新模型选择下拉框
    function updateModelSelect(models) {
        const select = document.getElementById('model-select');
        if (!select) return;
        
        // 清空现有选项
        select.innerHTML = '';
        
        // 添加默认选项
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = '-- 请选择一个模型 --';
        select.appendChild(defaultOption);
        
        // 添加模型选项
        models.forEach(model => {
            const option = document.createElement('option');
            option.value = model.id;
            option.textContent = model.id;
            // 如果有保存的模型ID，则选中
            if (model.id === CONFIG.selectedModel) {
                option.selected = true;
            }
            select.appendChild(option);
        });
    }

    // 更新日志功能
    let logCounter = 0;
    const maxLogEntries = 50;
    
    function log(message, type = 'info') {
        console.log(`[Udemy自动脚本] ${message}`);
        
        const logContainer = document.getElementById('log-container');
        if (!logContainer) return;
        
        // 限制日志条目数量
        if (logCounter >= maxLogEntries) {
            const firstEntry = logContainer.firstChild;
            if (firstEntry) logContainer.removeChild(firstEntry);
        } else {
            logCounter++;
        }
        
        const logEntry = document.createElement('div');
        logEntry.className = `log-entry ${type}`;
        logEntry.textContent = `${new Date().toLocaleTimeString()}: ${message}`;
        logContainer.appendChild(logEntry);
        logContainer.scrollTop = logContainer.scrollHeight;
    }

    function sleep(time) {
        return new Promise(function(resolve) {
            setTimeout(resolve, time);
        });
    }

    // 检测代码练习 - 更精确的检测方法
    async function checkCodeExercise() {
        // 首先检查是否有运行代码按钮
        const runCodeButton = document.querySelector("[data-purpose='run-code-button']");
        
        // 同时检查是否有编辑器存在，这是代码练习的更可靠标志
        const editorElement = document.getElementById("editor") || document.querySelector(".ace_editor");
        
        // 检查是否有练习标题，这是代码练习的特有标志
        const exerciseTitle = document.querySelector("[data-purpose='exercise-title']");
        
        // 只有当关键条件满足时才认为是代码练习
        if (!runCodeButton || !editorElement) return false;
        
        // 如果有练习标题，这几乎确定是代码练习
        if (exerciseTitle) {
            log(`检测到代码练习: "${exerciseTitle.textContent.trim()}"`, "info");
        } else {
            log("检测到可能的代码练习，但未找到练习标题", "info");
        }
        
        // 检查是否有API KEY和选择的模型
        if (!CONFIG.sijiLiudongAPI || !CONFIG.selectedModel) {
            log("请设置硅基流动API KEY和选择模型", "warning");
            return false;
        }
        
        // 获取代码练习要求
        const instructionsElement = document.querySelector("[data-purpose='instructions-content']");
        if (!instructionsElement) {
            log("无法获取代码练习要求", "error");
            return false;
        }
        
        // 确认一下这真的是代码练习而不是其他类型的测试
        if (!document.querySelector("[data-purpose='check-button']")) {
            log("可能不是代码练习，没有找到提交按钮", "warning");
            return false;
        }
        
        const instructions = instructionsElement.textContent.trim();
        log("获取到代码练习要求", "info");
        
        let generatedCode = '';
        let retryAttempt = 0;
        const maxAttempts = 3; // 最大尝试次数
        
        while (retryAttempt < maxAttempts) {
            // 使用硅基流动API生成代码
            log("正在使用硅基流动生成代码...", "info");
            generatedCode = await SIJI_API.generateCode(
                CONFIG.sijiLiudongAPI, 
                CONFIG.selectedModel, 
                `请帮我完成以下代码练习，只返回代码，不要有任何解释或额外的文字，不需要markdown格式包围：\n\n${instructions}`
            );
            
            if (!generatedCode) {
                log(`第 ${retryAttempt + 1} 次代码生成失败`, "error");
                retryAttempt++;
                if (retryAttempt < maxAttempts) {
                    log(`等待后重试...`, "info");
                    await sleep(2000);
                    continue;
                } else {
                    log("达到最大尝试次数，放弃生成代码", "error");
                    return false;
                }
            }
            
            log("代码生成成功，准备填入编辑器", "success");
            break;
        }
        
        // 等待编辑器加载
        await sleep(1000);
        
        // 填入代码到编辑器
        const fillCodeResult = await fillCodeToEditor(generatedCode);
        if (!fillCodeResult) {
            log("将代码填入编辑器失败", "error");
            return false;
        }
        
        // 不运行代码，直接检查
        log("跳过运行代码步骤", "info");
        
        // 检查结果并提交
        const checkButton = document.querySelector("[data-purpose='check-button']");
        if (!checkButton) {
            log("未找到检查按钮", "error");
            return false;
        }
        
        log("直接点击检查按钮提交代码", "info");
        checkButton.click();
        
        // 等待结果出现
        log("等待结果...", "info");
        let resultRibbon = null;
        let resultMessage = null;
        let waitTime = 0;
        const maxWaitTime = 30000; // 最多等待30秒
        
        while (waitTime < maxWaitTime) {
            // 尝试获取结果条幅
            resultRibbon = document.querySelector("[class^='ribbon-module--ribbon']");
            
            if (resultRibbon) {
                const ribbonText = resultRibbon.textContent || '';
                log(`检测到结果: ${ribbonText}`, "info");
                
                // 检查是否成功
                if (ribbonText.includes("成功")) {
                    log("代码提交成功!", "success");
                    
                    // 等待一段时间后点击下一步
                    await sleep(2000);
                    const nextButton = document.querySelector("[data-purpose='go-to-next']");
                    if (nextButton) {
                        log("点击下一步按钮继续", "success");
                        nextButton.click();
                        return true;
                    } else {
                        log("未找到下一步按钮", "warning");
                    }
                    return true;
                } else {
                    log("代码提交失败，获取错误信息并重新生成", "warning");
                    // 获取错误信息
                    resultMessage = document.querySelector("[class^='result-container--result-formatted-message']");
                    break;
                }
            }
            
            await sleep(500);
            waitTime += 500;
        }
        
        // 如果没有找到结果或者结果不成功，尝试根据错误信息重新生成代码
        if (!resultRibbon || (resultRibbon && !resultRibbon.textContent.includes("成功"))) {
            log("需要根据错误信息重新生成代码", "info");
            
            // 获取错误信息
            let errorMessage = "未知错误";
            if (resultMessage) {
                errorMessage = resultMessage.textContent || "未知错误";
                log(`错误信息: ${errorMessage}`, "info");
            }
            
            // 使用原始指令和错误信息重新生成代码
            log("根据错误信息重新生成代码...", "info");
            const newGeneratedCode = await SIJI_API.generateCode(
                CONFIG.sijiLiudongAPI, 
                CONFIG.selectedModel, 
                `请帮我完成以下代码练习，代码需要满足要求。我之前的尝试有错误，请修复：
                
要求: ${instructions}

错误信息: ${errorMessage}

请给出完整的修复后代码，只返回代码，不要有任何解释或额外的文字。`
            );
            
            if (!newGeneratedCode) {
                log("重新生成代码失败", "error");
                return false;
            }
            
            log("重新生成代码成功，准备填入编辑器", "success");
            
            // 填入新代码
            const fillNewCodeResult = await fillCodeToEditor(newGeneratedCode);
            if (!fillNewCodeResult) {
                log("将新代码填入编辑器失败", "error");
                return false;
            }
            
            // 点击检查按钮
            const newCheckButton = document.querySelector("[data-purpose='check-button']");
            if (newCheckButton) {
                log("点击检查按钮提交新代码", "info");
                newCheckButton.click();
                
                // 等待指定时间后继续
                log(`等待 ${CONFIG.codeSubmitDelay/1000} 秒后继续...`, "info");
                await sleep(CONFIG.codeSubmitDelay);
                
                // 不管结果如何，尝试点击下一步继续
                const nextButton = document.querySelector("[data-purpose='go-to-next']");
                if (nextButton) {
                    log("点击下一步按钮继续", "info");
                    nextButton.click();
                } else {
                    log("未找到下一步按钮", "warning");
                }
            }
        }
        
        return true;
    }
    
    // 填入代码到编辑器
    async function fillCodeToEditor(code) {
        // 尝试查找编辑器
        const editorElement = document.getElementById("editor");
        if (!editorElement) {
            log("找不到代码编辑器", "error");
            return false;
        }
        
        // 获取ace编辑器实例
        try {
            // 使用多种方法尝试获取ace编辑器实例
            let aceEditor = null;
            
            // 方法1: 通过全局ace对象
            if (window.ace && window.ace.edit) {
                try {
                    aceEditor = window.ace.edit("editor");
                } catch (e) {
                    log("尝试方法1获取编辑器失败", "warning");
                }
            }
            
            // 方法2: 通过元素上的ace属性
            if (!aceEditor && editorElement.env && editorElement.env.editor) {
                aceEditor = editorElement.env.editor;
            }
            
            // 方法3: 通过查找已存在的编辑器实例
            if (!aceEditor) {
                const possibleEditors = document.querySelectorAll(".ace_editor");
                if (possibleEditors.length > 0) {
                    for (const editorEl of possibleEditors) {
                        if (editorEl.env && editorEl.env.editor) {
                            aceEditor = editorEl.env.editor;
                            break;
                        }
                    }
                }
            }
            
            if (aceEditor) {
                // 清空编辑器
                aceEditor.setValue("");
                // 插入生成的代码
                aceEditor.insert(code);
                log("代码已成功填入编辑器", "success");
                return true;
            } else {
                // 最后尝试: 使用剪贴板和键盘事件
                log("尝试使用剪贴板方法填入代码", "warning");
                
                // 创建一个临时文本区域
                const textarea = document.createElement('textarea');
                textarea.value = code;
                document.body.appendChild(textarea);
                textarea.select();
                
                // 复制到剪贴板
                document.execCommand('copy');
                
                // 移除临时元素
                document.body.removeChild(textarea);
                
                // 聚焦编辑器
                editorElement.click();
                
                // 模拟Ctrl+A和Ctrl+V
                // Ctrl+A (全选)
                const selectAllEvent = new KeyboardEvent('keydown', {
                    key: 'a',
                    code: 'KeyA',
                    ctrlKey: true,
                    bubbles: true
                });
                editorElement.dispatchEvent(selectAllEvent);
                
                await sleep(100);
                
                // Ctrl+V (粘贴)
                const pasteEvent = new KeyboardEvent('keydown', {
                    key: 'v',
                    code: 'KeyV',
                    ctrlKey: true,
                    bubbles: true
                });
                editorElement.dispatchEvent(pasteEvent);
                
                log("尝试使用键盘事件填入代码", "info");
                return true;
            }
        } catch (error) {
            log(`填入代码到编辑器时出错: ${error.message}`, "error");
            return false;
        }
    }

    async function findVideo() {
        const videos = document.getElementsByTagName('video');
        if (videos.length > 0) {
            return videos[0];
        }
        return null;
    }

    async function getVideoDuration(video) {
        if (!video) return 0;
        
        // 如果已经读取过时长，直接返回
        if (video.hasAddEvent && video.readedDuration) return video.readedDuration;
        
        // 如果视频时长可用，直接返回
        if (video.duration && !isNaN(video.duration)) {
            video.readedDuration = video.duration;
            return video.duration;
        }
        
        log("等待视频元数据加载...");
        
        // 等待视频加载元数据
        return new Promise(function(resolve, reject) {
            const checkDuration = () => {
                if (video.duration && !isNaN(video.duration)) {
                    video.readedDuration = video.duration;
                    log(`视频时长: ${video.duration}秒`);
                    resolve(video.duration);
                } else {
                    setTimeout(checkDuration, 500);
                }
            };
            
            video.addEventListener('loadedmetadata', function() {
                log("视频元数据已加载");
                video.readedDuration = video.duration;
                resolve(video.duration);
            });
            
            video.addEventListener('error', function(e) {
                log("视频加载错误: " + (e.message || "未知错误"), "error");
                reject("视频加载错误");
            });
            
            // 立即检查一次，可能视频已经加载好了
            checkDuration();
            
            video.hasAddEvent = true;
        });
    }

    async function setCurrentTime(video, time) {
        if (!video) return false;
        
        // 确保目标时间有效
        const targetTime = Math.max(0, Math.min(time - 0.5, video.duration));
        
        if (video.currentTime >= targetTime) {
            log("视频已经接近结束位置");
            return true;
        }

        log(`设置视频时间到: ${targetTime}秒 (总时长: ${video.duration}秒)`);
        
        // 尝试多次设置时间
        let retries = 0;
        while (retries < CONFIG.maxRetries) {
            try {
                video.currentTime = targetTime;
                
                // 查找并点击播放按钮
                const playButton = document.querySelector("[data-purpose='play-button']");
                if (playButton) {
                    log("点击播放按钮");
                    playButton.click();
                } else {
                    // 如果找不到播放按钮，尝试直接播放视频
                    video.play();
                }
                
                // 等待一小段时间，确认时间设置成功
                await sleep(500);
                
                // 检查是否成功设置
                if (Math.abs(video.currentTime - targetTime) < 2) {
                    log("成功设置视频时间", "success");
                    return true;
                }
                
                log(`时间设置未生效，当前时间: ${video.currentTime}，重试...`, "warning");
                retries++;
                await sleep(200);
            } catch (err) {
                log(`设置视频时间出错: ${err.message}`, "error");
                retries++;
                await sleep(200);
            }
        }
        
        log("视频时间设置失败，达到最大重试次数", "error");
        return false;
    }

    function goNext() {
        // 此函数已不再使用，保留函数但不执行任何操作
        log("自动跳转被禁用，等待系统自动跳转", "info");
        return false;
    }

    function checkTest() {
        const testBtn = document.querySelector("[data-purpose='go-to-next']:not(#go-to-next-item)");
        if (!testBtn) return false;
        
        log("检测到测试，点击继续");
        testBtn.click();
        return true;
    }

    // 检测并点击"不再询问"按钮
    function checkDontAskButton() {
        const dontAskButton = document.querySelector("[data-purpose='dont-ask-button']");
        if (!dontAskButton) return false;
        
        log("检测到评分弹窗，点击'不再询问'按钮", "success");
        dontAskButton.click();
        
        // 需要点击关闭按钮
        setTimeout(() => {
            const closeButtons = document.querySelectorAll("button[aria-label='关闭']");
            if (closeButtons.length > 0) {
                log("点击关闭按钮");
                closeButtons[0].click();
            }
        }, 500);
        
        return true;
    }

    async function checkViewer() {
        const viewer = document.querySelector("[class^=text-viewer--scroll-container]");
        if (!viewer) return false;
        if (viewer.hasSkip) return false;
        
        log("检测到阅读文章，等待后自动跳过");
        
        await sleep(CONFIG.artDelay);
        const nextBtn = document.querySelector("*#go-to-next-item[data-purpose='go-to-next']");
        if (nextBtn) {
            viewer.hasSkip = true;
            nextBtn.click();
            log("已跳过阅读文章", "success");
            return true;
        }
        return false;
    }

    async function autoTest() {
        const startBtn = document.querySelector("[data-purpose='start-or-resume-quiz']");
        if (!startBtn) return false;
        
        log("发现测验，开始自动答题");
        startBtn.click();
        
        while (true) {
            await chooseAnswer();
            await sleep(CONFIG.answerDelay);
            
            const nextBtn = document.querySelector("[data-purpose='go-to-next']");
            if (nextBtn) {
                log("测验完成，继续下一步", "success");
                nextBtn.click();
                return true;
            }
            
            await sleep(CONFIG.answerDelay);
        }
    }

    async function chooseAnswer() {
        log('选择答案');
        const option = document.querySelector("label[class^=mc-quiz-answer]:not(.ud-toggle-input-disabled)");
        if (option) {
            option.click();
            log('已选择一个选项');
        }
        
        await sleep(300);
        
        const checkBtn = document.querySelector("[data-purpose='next-question-button']");
        if (checkBtn) {
            checkBtn.click();
            log('已提交答案');
        }
    }

    async function checkAndHandleVideoEnd(video) {
        if (!video) return false;
        
        // 如果视频已经接近结束
        if (video.duration && video.currentTime >= video.duration - 1) {
            log("视频即将结束，等待自动跳转...");
            
            // 确保视频在播放状态
            const playButton = document.querySelector("[data-purpose='play-button']");
            if (playButton) {
                log("视频暂停中，点击播放按钮");
                playButton.click();
            }
            
            // 不再主动点击下一步按钮，让系统自动跳转
            await sleep(2000);
            return false; // 返回false，让主循环继续检测页面变化
        }
        
        return false;
    }

    async function processCurrentPage() {
        // 如果脚本被禁用，直接返回
        if (!CONFIG.scriptEnabled) {
            return false;
        }
        
        // 检查并点击"不再询问"按钮
        if (checkDontAskButton()) return true;
        
        // 检查是否有代码练习 - 优先检测代码练习
        if (await checkCodeExercise()) return true;
        
        // 检查是否有测验 - 将测试检测放到更低优先级
        if (await autoTest()) return true;
        
        // 检查是否是阅读文章
        if (await checkViewer()) return true;
        
        // 检查其他测试类型 - 将常规测试检测放到最低优先级
        if (checkTest()) return true;
        
        // 处理视频
        const video = await findVideo();
        if (video) {
            log("检测到视频");
            video.muted = true;
            
            try {
                const duration = await getVideoDuration(video);
                if (duration > 0) {
                    log(`视频总时长: ${duration}秒`);
                    await setCurrentTime(video, duration);
                    
                    // 检查视频是否已结束，需要进入下一步
                    if (await checkAndHandleVideoEnd(video)) {
                        return true;
                    }
                }
            } catch (err) {
                log(`处理视频时出错: ${err.message}`, "error");
            }
        }
        
        return false;
    }

    // 主循环
    async function mainLoop() {
        let loopCount = 0;
        
        while (true) {
            // 只有在脚本启用时才执行操作
            if (CONFIG.scriptEnabled) {
                loopCount++;
                
                try {
                    await processCurrentPage();
                } catch (err) {
                    log(`处理页面时出错: ${err.message}`, "error");
                }
            }
            
            await sleep(CONFIG.threadDelay);
        }
    }

    // 页面加载后启动脚本
    window.addEventListener('load', function() {
        log("页面加载完成，启动自动脚本");
        createControlPanel();
        mainLoop();
    });
})();