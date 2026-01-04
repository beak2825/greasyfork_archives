// ==UserScript==
// @name         ApiRequester
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @description  apirequester
// @author       author
// @match        *://*.tokyomotion.net/*
// @match        *://tokyomotion.net/*
// @match        *://*.rule34video.com/*
// @match        *://rule34video.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/534904/ApiRequester.user.js
// @updateURL https://update.greasyfork.org/scripts/534904/ApiRequester.meta.js
// ==/UserScript==

(function () {
    // http://ip:port/api/ytdlp/tokyomotion-download?url={currnet_page_url}
    'use strict';

    // 添加所有CSS样式
    GM_addStyle(`
        /* 按钮容器样式 */
        #api-requester-button-container {
            position: fixed;
            left: 5px;
            top: 50%;
            transform: translateY(-50%);
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        
        /* 设置和API按钮样式 */
        #api-requester-button-container button {
            padding: 8px 12px;
            background-color: cornflowerblue;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            width: 5vh;
            height: 10vh;
        }
        
        /* 通知样式 */
        #api-requester-notification {
            position: fixed;
            top: 20%;
            left: 50%;
            transform: translateX(-50%);
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            font-size: 16px;
            z-index: 9999;
        }
        
        /* 通知成功样式 */
        #api-requester-notification.success {
            background-color: green;
        }
        
        /* 通知错误样式 */
        #api-requester-notification.error {
            background-color: red;
        }
        
        /* 通知信息样式 */
        #api-requester-notification.info {
            background-color: blue;
        }
        
        /* 面板基础样式 */
        .api-requester-panel {
            position: fixed;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            background-color: white;
            color: black;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.3);
            z-index: 10000;
        }
        
        /* 设置面板样式 */
        #api-requester-settings-panel {
            min-width: 400px;
            max-height: 80vh;
            overflow-y: auto;
        }
        
        /* API面板样式 */
        #api-requester-api-panel {
            min-width: 260px;
        }
        
        /* 模板列表样式 */
        .api-requester-template-list {
            max-height: 200px;
            overflow-y: auto;
            margin-bottom: 15px;
            border: 1px solid #eee;
            padding: 10px;
        }
        
        /* 模板项目样式 */
        .api-requester-template-item {
            padding: 8px;
            border-bottom: 1px solid #eee;
            margin-bottom: 5px;
        }
        
        /* 模板名称样式 */
        .api-requester-template-name {
            font-weight: bold;
            margin-bottom: 5px;
        }
        
        /* 模板URL样式 */
        .api-requester-template-url {
            word-break: break-all;
            font-size: 12px;
            color: #666;
        }
        
        /* 表单容器样式 */
        .api-requester-form-container {
            margin-bottom: 15px;
        }
        
        /* 表单项目样式 */
        .api-requester-form-item {
            margin-bottom: 10px;
        }
        
        /* 表单标签样式 */
        .api-requester-form-label {
            margin-right: 5px;
        }
        
        /* 表单输入框样式 */
        .api-requester-form-input {
            width: 70%; 
            padding: 5px;
            border: 1px solid #ccc;
            border-radius: 4px;
        }
        
        /* 帮助文本样式 */
        .api-requester-help-text {
            display: block; 
            margin-top: 5px; 
            color: #666; 
            font-size: 12px;
        }
        
        /* 按钮容器样式 */
        .api-requester-button-container {
            display: flex; 
            gap: 10px;
        }
        
        /* 保存按钮样式 */
        .api-requester-save-button {
            padding: 6px 12px; 
            background: #4CAF50; 
            color: #fff; 
            border: none; 
            border-radius: 4px; 
            cursor: pointer;
        }
        
        /* 取消按钮样式 */
        .api-requester-cancel-button {
            padding: 6px 12px; 
            background: #f44336; 
            color: #fff; 
            border: none; 
            border-radius: 4px; 
            cursor: pointer;
        }
        
        /* API列表项目样式 */
        .api-requester-api-item {
            padding: 8px;
            border-bottom: 1px solid #eee;
            display: flex;
            align-items: center;
        }
        
        /* API名称样式 */
        .api-requester-api-name {
            flex-grow: 1;
        }
        
        /* 发送按钮样式 */
        .api-requester-send-button {
            padding: 5px 10px;
            background-color: #2196F3;
            color: white;
            border: none;
            border-radius: 4px;
            margin-right: 5px;
        }
        
        /* 删除按钮样式 */
        .api-requester-delete-button {
            padding: 5px 10px;
            background-color: #f44336;
            color: white;
            border: none;
            border-radius: 4px;
        }
        
        /* 关闭按钮样式 */
        .api-requester-close-button {
            padding: 8px 12px;
            background-color: #f44336;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            width: 100%;
        }
    `);

    class VariableProcessor {
        constructor() {
            // 注册可用的变量处理函数
            this.customVariables = {
                'current_page_url': this.getCurrentPageUrl
            };
        }

        // 获取当前页面URL
        getCurrentPageUrl() {
            return window.location.href;
        }

        // 处理API URL中的所有变量
        processVariables(apiUrl) {
            let processedUrl = apiUrl;

            // 遍历所有注册的变量
            for (const [varName, varFunction] of Object.entries(this.customVariables)) {
                const placeholder = `{${varName}}`;
                if (processedUrl.includes(placeholder)) {
                    processedUrl = processedUrl.replace(placeholder, varFunction());
                }
            }

            return processedUrl;
        }

        // 添加新的变量处理函数（用于扩展）
        registerVariable(name, processorFunction) {
            this.customVariables[name] = processorFunction;
        }
    }

    class StorageManager {
        constructor() {
            this.storageKey = 'api_templates';
            // 初始化存储
            if (!GM_getValue(this.storageKey)) {
                GM_setValue(this.storageKey, {});
            }
        }

        // 获取所有模板
        getAllTemplates() {
            return GM_getValue(this.storageKey) || {};
        }

        // 保存模板
        saveTemplate(name, apiUrl) {
            const templates = this.getAllTemplates();
            templates[name] = apiUrl;
            GM_setValue(this.storageKey, templates);
        }

        // 删除模板
        deleteTemplate(name) {
            const templates = this.getAllTemplates();
            if (templates[name]) {
                delete templates[name];
                GM_setValue(this.storageKey, templates);
                return true;
            }
            return false;
        }
    }

    class ApiRequester {
        constructor(variableProcessor) {
            this.variableProcessor = variableProcessor; // 使用传入的实例
        }

        // 发送API请求
        sendRequest(apiUrl) {
            // 处理URL中的变量
            const processedUrl = this.variableProcessor.processVariables(apiUrl);

            // 显示请求已发送的通知
            showNotification("已发送API请求", false, "info");

            // 发送请求
            GM_xmlhttpRequest({
                method: "GET",
                url: processedUrl,
                onload: function (response) {
                    console.log("API请求成功:", response.responseText);
                    try {
                        // 尝试解析JSON响应
                        const jsonResponse = JSON.parse(response.responseText);
                        // 显示API返回的消息
                        if (jsonResponse.message) {
                            showNotification(jsonResponse.message);
                        } else if (jsonResponse.status === "success") {
                            showNotification("请求成功: " + (jsonResponse.message || "操作完成"));
                        } else {
                            showNotification("API请求已完成");
                        }
                    } catch (e) {
                        // 如果不是JSON或解析出错，显示默认消息
                        showNotification("API请求已完成");
                    }
                },
                onerror: function (error) {
                    console.error("API请求失败:", error);
                    showNotification("API请求失败，请查看控制台获取详情", true);
                }
            });
        }
    }

    function showNotification(message, isError = false, type = "default") {
        // 检查通知是否已存在
        let notification = document.getElementById('api-requester-notification');

        if (!notification) {
            // 创建通知元素
            notification = document.createElement('div');
            notification.id = 'api-requester-notification';
            document.body.appendChild(notification);
        }

        // 设置通知内容
        notification.textContent = message;

        // 移除所有类
        notification.className = '';

        // 根据类型添加相应的类
        if (isError) {
            notification.classList.add('error');
        } else if (type === "info") {
            notification.classList.add('info');
        } else {
            notification.classList.add('success');
        }

        // 显示通知
        notification.style.display = 'block';

        // 3秒后隐藏通知
        setTimeout(function () {
            notification.style.display = 'none';
        }, 3000);
    }

    class UiManager {
        constructor(storageManager, apiRequester) {
            this.storageManager = storageManager; // 使用传入的实例
            this.apiRequester = apiRequester; // 使用传入的实例
            this.settingsPanel = null;
            this.apiPanel = null;

            // 创建基本UI
            this.createButtons();
        }

        // 创建按钮
        createButtons() {
            // 创建容器
            const buttonContainer = document.createElement('div');
            buttonContainer.id = 'api-requester-button-container';

            // 创建设置按钮
            const settingsButton = document.createElement('button');
            settingsButton.textContent = '设置';
            settingsButton.addEventListener('click', () => this.toggleSettingsPanel());

            // 创建API按钮
            const apiButton = document.createElement('button');
            apiButton.textContent = 'API';
            apiButton.addEventListener('click', () => this.toggleApiPanel());

            // 添加按钮到容器
            buttonContainer.appendChild(settingsButton);
            buttonContainer.appendChild(apiButton);

            // 添加容器到页面
            document.body.appendChild(buttonContainer);
        }

        // 切换设置面板显示状态
        toggleSettingsPanel() {
            if (this.settingsPanel) {
                document.body.removeChild(this.settingsPanel);
                this.settingsPanel = null;
                return;
            }

            // 如果API面板已打开，先关闭它
            if (this.apiPanel) {
                document.body.removeChild(this.apiPanel);
                this.apiPanel = null;
            }

            // 获取所有模板
            const templates = this.storageManager.getAllTemplates();
            const templateNames = Object.keys(templates);

            // 创建设置面板
            this.settingsPanel = document.createElement('div');
            this.settingsPanel.id = 'api-requester-settings-panel';
            this.settingsPanel.className = 'api-requester-panel';

            // 添加标题
            const title = document.createElement('h2');
            title.textContent = 'API设置';
            this.settingsPanel.appendChild(title);

            // 添加现有模板列表
            if (templateNames.length > 0) {
                const templatesTitle = document.createElement('h3');
                templatesTitle.textContent = '现有API模板';
                templatesTitle.style.marginTop = '15px';
                this.settingsPanel.appendChild(templatesTitle);

                const templateList = document.createElement('div');
                templateList.className = 'api-requester-template-list';

                templateNames.forEach(name => {
                    const templateItem = document.createElement('div');
                    templateItem.className = 'api-requester-template-item';

                    const templateNameElem = document.createElement('div');
                    templateNameElem.className = 'api-requester-template-name';
                    templateNameElem.textContent = `名称: ${name}`;

                    const templateUrlElem = document.createElement('div');
                    templateUrlElem.className = 'api-requester-template-url';
                    templateUrlElem.textContent = `URL: ${templates[name]}`;

                    templateItem.appendChild(templateNameElem);
                    templateItem.appendChild(templateUrlElem);
                    templateList.appendChild(templateItem);
                });

                this.settingsPanel.appendChild(templateList);
            }

            // 添加表单标题
            const formTitle = document.createElement('h3');
            formTitle.textContent = '添加新模板';
            this.settingsPanel.appendChild(formTitle);

            // 创建表单容器
            const formContainer = document.createElement('div');
            formContainer.className = 'api-requester-form-container';

            // 创建API名称输入区域
            const nameContainer = document.createElement('div');
            nameContainer.className = 'api-requester-form-item';

            const nameLabel = document.createElement('label');
            nameLabel.className = 'api-requester-form-label';
            nameLabel.textContent = 'API名称:';
            nameLabel.setAttribute('for', 'api-name');

            const nameInput = document.createElement('input');
            nameInput.className = 'api-requester-form-input';
            nameInput.type = 'text';
            nameInput.id = 'api-name';

            nameContainer.appendChild(nameLabel);
            nameContainer.appendChild(nameInput);
            formContainer.appendChild(nameContainer);

            // 创建API内容输入区域
            const urlContainer = document.createElement('div');
            urlContainer.className = 'api-requester-form-item';

            const urlLabel = document.createElement('label');
            urlLabel.className = 'api-requester-form-label';
            urlLabel.textContent = 'API内容:';
            urlLabel.setAttribute('for', 'api-url');

            const urlInput = document.createElement('input');
            urlInput.className = 'api-requester-form-input';
            urlInput.type = 'text';
            urlInput.id = 'api-url';

            const helpText = document.createElement('small');
            helpText.className = 'api-requester-help-text';
            helpText.innerHTML = '支持变量: {current_page_url}<br>示例: http://127.0.0.1:40002/api/ytdlp/download?url={current_page_url}';

            urlContainer.appendChild(urlLabel);
            urlContainer.appendChild(urlInput);
            urlContainer.appendChild(helpText);
            formContainer.appendChild(urlContainer);

            // 创建按钮区域
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'api-requester-button-container';

            const saveButton = document.createElement('button');
            saveButton.className = 'api-requester-save-button';
            saveButton.type = 'button';
            saveButton.id = 'save-btn';
            saveButton.textContent = '保存';

            const cancelButton = document.createElement('button');
            cancelButton.className = 'api-requester-cancel-button';
            cancelButton.type = 'button';
            cancelButton.id = 'cancel-btn';
            cancelButton.textContent = '取消';

            buttonContainer.appendChild(saveButton);
            buttonContainer.appendChild(cancelButton);
            formContainer.appendChild(buttonContainer);

            this.settingsPanel.appendChild(formContainer);
            document.body.appendChild(this.settingsPanel);

            // 添加事件监听器
            saveButton.addEventListener('click', () => {
                const name = nameInput.value.trim();
                const url = urlInput.value.trim();

                if (name && url) {
                    this.storageManager.saveTemplate(name, url);
                    showNotification(`模板 "${name}" 已保存`);
                    document.body.removeChild(this.settingsPanel);
                    this.settingsPanel = null;
                } else {
                    showNotification('请填写API名称和内容', true);
                }
            });

            cancelButton.addEventListener('click', () => {
                document.body.removeChild(this.settingsPanel);
                this.settingsPanel = null;
            });
        }

        // 切换API面板显示状态
        toggleApiPanel() {
            if (this.apiPanel) {
                document.body.removeChild(this.apiPanel);
                this.apiPanel = null;
                return;
            }

            // 如果设置面板已打开，先关闭它
            if (this.settingsPanel) {
                document.body.removeChild(this.settingsPanel);
                this.settingsPanel = null;
            }

            // 获取所有模板
            const templates = this.storageManager.getAllTemplates();
            const templateNames = Object.keys(templates);

            // 创建API面板
            this.apiPanel = document.createElement('div');
            this.apiPanel.id = 'api-requester-api-panel';
            this.apiPanel.className = 'api-requester-panel';

            // 添加标题
            const title = document.createElement('h3');
            title.textContent = '选择API模板';
            title.style.marginTop = '0';
            this.apiPanel.appendChild(title);

            // 如果没有模板，显示提示
            if (templateNames.length === 0) {
                const noTemplates = document.createElement('p');
                noTemplates.textContent = '没有保存的API模板，请先创建模板';
                this.apiPanel.appendChild(noTemplates);
            } else {
                // 创建模板列表
                const templateList = document.createElement('div');
                templateList.className = 'api-requester-template-list';

                templateNames.forEach(name => {
                    const templateItem = document.createElement('div');
                    templateItem.className = 'api-requester-api-item';

                    const templateName = document.createElement('span');
                    templateName.className = 'api-requester-api-name';
                    templateName.textContent = name;

                    const sendButton = document.createElement('button');
                    sendButton.className = 'api-requester-send-button';
                    sendButton.textContent = '发送';

                    const deleteButton = document.createElement('button');
                    deleteButton.className = 'api-requester-delete-button';
                    deleteButton.textContent = '删除';

                    templateItem.appendChild(templateName);
                    templateItem.appendChild(sendButton);
                    templateItem.appendChild(deleteButton);
                    templateList.appendChild(templateItem);

                    // 添加事件监听器
                    sendButton.addEventListener('click', () => {
                        this.apiRequester.sendRequest(templates[name]);
                    });

                    deleteButton.addEventListener('click', () => {
                        if (confirm(`确定要删除模板 "${name}" 吗？`)) {
                            this.storageManager.deleteTemplate(name);
                            templateList.removeChild(templateItem);

                            // 如果删除后没有模板了，显示提示
                            if (templateList.children.length === 0) {
                                const noTemplates = document.createElement('p');
                                noTemplates.textContent = '没有保存的API模板，请先创建模板';
                                this.apiPanel.insertBefore(noTemplates, this.apiPanel.lastChild);
                            }
                        }
                    });
                });

                this.apiPanel.appendChild(templateList);
            }

            // 添加关闭按钮
            const closeButton = document.createElement('button');
            closeButton.className = 'api-requester-close-button';
            closeButton.textContent = '关闭';
            closeButton.addEventListener('click', () => {
                document.body.removeChild(this.apiPanel);
                this.apiPanel = null;
            });

            this.apiPanel.appendChild(closeButton);
            document.body.appendChild(this.apiPanel);
        }
    }

    function initApp() {
        const variableProcessor = new VariableProcessor();
        const storageManager = new StorageManager();
        const apiRequester = new ApiRequester(variableProcessor);
        const uiManager = new UiManager(storageManager, apiRequester);
    }

    // 当DOM加载完成后初始化应用
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initApp);
    } else {
        initApp();
    }
})();
