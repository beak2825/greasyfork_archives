// ==UserScript==
// @name         PikPak AI番号重命名助手
// @namespace    http://tampermonkey.net/
// @version      1.1.3.1
// @description  自动从多个来源查询AV番号信息并填充到mypikpak.com网站上的重命名对话框中，支持LLM模型选择和自定义API设置。
// @author       Aeron
// @match        *://*mypikpak.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_getTab
// @grant        GM_saveTab
// @connect      javbus.com
// @connect      dmm.co.jp
// @connect      javdb.com
// @connect      av-wiki.net
// @connect      api.x.ai
// @connect      api.openai.com
// @connect      *
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536649/PikPak%20AI%E7%95%AA%E5%8F%B7%E9%87%8D%E5%91%BD%E5%90%8D%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/536649/PikPak%20AI%E7%95%AA%E5%8F%B7%E9%87%8D%E5%91%BD%E5%90%8D%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log("脚本已加载");

    // 存储设置的键名
    const STORAGE_KEYS = {
        JAVBUS_COOKIE: 'javbus_cookie',
        API_KEY: 'llm_api_key',
        SOURCE_CONFIG: 'search_source_config',
        LLM_MODEL: 'llm_model',
        LLM_PROVIDER: 'llm_provider',
        LLM_TEMPERATURE: 'llm_temperature',
        CUSTOM_API_URL: 'custom_api_url',
        CUSTOM_PROMPT: 'custom_prompt'
    };

    // 默认LLM设置
    const DEFAULT_LLM_SETTINGS = {
        model: "grok-2-1212",
        provider: "x.ai",  // 可选值: "x.ai", "openai", "custom"
        temperature: 0.4,
        customApiUrl: ""
    };

    // 定义所有搜索源及其默认启用状态
    const DEFAULT_SOURCE_CONFIG = {
        avwiki: { enabled: true, name: "AV-Wiki", order: 1 },
        dmm: { enabled: true, name: "DMM", order: 2 },
        javbus: { enabled: true, name: "JavBus", order: 3 },
        javdb: { enabled: true, name: "JavDB", order: 4 }
    };

    // 从持久化存储初始化设置
    let settings = {
        javbusCookie: GM_getValue(STORAGE_KEYS.JAVBUS_COOKIE, ""),
        apiKey: GM_getValue(STORAGE_KEYS.API_KEY, ""),
        sourceConfig: GM_getValue(STORAGE_KEYS.SOURCE_CONFIG, DEFAULT_SOURCE_CONFIG),
        llmModel: GM_getValue(STORAGE_KEYS.LLM_MODEL, DEFAULT_LLM_SETTINGS.model),
        llmProvider: GM_getValue(STORAGE_KEYS.LLM_PROVIDER, DEFAULT_LLM_SETTINGS.provider),
        llmTemperature: GM_getValue(STORAGE_KEYS.LLM_TEMPERATURE, DEFAULT_LLM_SETTINGS.temperature),
        customApiUrl: GM_getValue(STORAGE_KEYS.CUSTOM_API_URL, DEFAULT_LLM_SETTINGS.customApiUrl),
        customPrompt: GM_getValue(STORAGE_KEYS.CUSTOM_PROMPT, "")
    };

    // 注册基本菜单命令
    GM_registerMenuCommand("设置JavBus Cookie", setJavBusCookie);
    GM_registerMenuCommand("设置API密钥", setApiKey);
    GM_registerMenuCommand("管理搜索源", manageSearchSources);
    GM_registerMenuCommand("设置LLM模型参数", setLLMParameters);
    GM_registerMenuCommand("设置自定义Prompt", setCustomPrompt);

    // 为每个搜索源注册单独的开关菜单
    // registerSourceToggleMenus();

    // DOM 监听器，监听文档变更以识别对话框弹出
    const observer = new MutationObserver(async mutations => {
        for (const mutation of mutations) {
            if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
                for (const node of mutation.addedNodes) {
                    if (node.className === "el-dialog") {
                        await handleDialog(node);
                    }
                }
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 错误信息常量定义
    const ERROR_MESSAGES = {
        KEYWORD_EXTRACTION_FAILED: "关键词提取失败，无法重命名文件",
        NETWORK_ERROR: "网络请求错误，请检查连接",
        API_ERROR: "API 请求失败",
        NO_RESULTS_FOUND: "未找到相关作品信息",
        PARSING_ERROR: "解析结果错误",
        CUSTOM_API_URL_REQUIRED: "使用第三方模型时，必须提供API URL"
    };

    /**
     * 设置LLM模型参数
     */
    function setLLMParameters() {
        // 创建配置界面
        const container = document.createElement('div');
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.7);
            z-index: 10000;
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: Arial, sans-serif;
        `;

        const panel = document.createElement('div');
        panel.style.cssText = `
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            width: 450px;
            max-width: 90%;
            max-height: 90%;
            overflow-y: auto;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        `;

        const title = document.createElement('h2');
        title.textContent = 'LLM模型参数设置';
        title.style.cssText = `
            margin-top: 0;
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
        `;
        panel.appendChild(title);

        // 模型提供方选择
        const providerLabel = document.createElement('div');
        providerLabel.textContent = '模型提供方:';
        providerLabel.style.cssText = `
            font-weight: bold;
            margin-top: 15px;
            margin-bottom: 5px;
        `;
        panel.appendChild(providerLabel);

        const providerSelect = document.createElement('select');
        providerSelect.id = 'provider-select';
        providerSelect.style.cssText = `
            width: 100%;
            padding: 8px;
            border-radius: 4px;
            border: 1px solid #ccc;
            margin-bottom: 15px;
        `;

        const providers = [
            { value: 'x.ai', label: 'X.AI (默认)' },
            { value: 'openai', label: 'OpenAI' },
            { value: 'custom', label: '第三方模型' }
        ];

        providers.forEach(provider => {
            const option = document.createElement('option');
            option.value = provider.value;
            option.textContent = provider.label;
            option.selected = provider.value === settings.llmProvider;
            providerSelect.appendChild(option);
        });

        panel.appendChild(providerSelect);

        // 自定义API URL输入（初始隐藏）
        const urlContainer = document.createElement('div');
        urlContainer.id = 'custom-url-container';
        urlContainer.style.cssText = `
            margin-bottom: 15px;
            display: ${settings.llmProvider === 'custom' ? 'block' : 'none'};
        `;

        const urlLabel = document.createElement('div');
        urlLabel.textContent = '第三方API URL:';
        urlLabel.style.cssText = `
            font-weight: bold;
            margin-bottom: 5px;
        `;
        urlContainer.appendChild(urlLabel);

        const urlInput = document.createElement('input');
        urlInput.type = 'text';
        urlInput.id = 'custom-api-url';
        urlInput.placeholder = '例如: https://your-api-endpoint/v1/chat/completions';
        urlInput.value = settings.customApiUrl;
        urlInput.style.cssText = `
            width: 100%;
            padding: 8px;
            border-radius: 4px;
            border: 1px solid #ccc;
            box-sizing: border-box;
        `;
        urlContainer.appendChild(urlInput);

        const urlNote = document.createElement('div');
        urlNote.textContent = '注意: 第三方API应兼容OpenAI接口格式';
        urlNote.style.cssText = 'font-size: 0.8em; color: #555; margin-top: 5px;';
        urlContainer.appendChild(urlNote);

        panel.appendChild(urlContainer);

        // 模型名称输入
        const modelLabel = document.createElement('div');
        modelLabel.textContent = '模型名称:';
        modelLabel.style.cssText = `
            font-weight: bold;
            margin-bottom: 5px;
        `;
        panel.appendChild(modelLabel);

        const modelInput = document.createElement('input');
        modelInput.type = 'text';
        modelInput.value = settings.llmModel;
        modelInput.placeholder = 'grok-2-1212';
        modelInput.style.cssText = `
            width: 100%;
            padding: 8px;
            border-radius: 4px;
            border: 1px solid #ccc;
            margin-bottom: 15px;
            box-sizing: border-box;
        `;
        panel.appendChild(modelInput);

        // 模型温度输入
        const temperatureLabel = document.createElement('div');
        temperatureLabel.textContent = '模型温度 (0.0-1.0):';
        temperatureLabel.style.cssText = `
            font-weight: bold;
            margin-bottom: 5px;
        `;
        panel.appendChild(temperatureLabel);

        const temperatureInput = document.createElement('input');
        temperatureInput.type = 'number';
        temperatureInput.min = '0';
        temperatureInput.max = '1';
        temperatureInput.step = '0.1';
        temperatureInput.value = settings.llmTemperature;
        temperatureInput.style.cssText = `
            width: 100%;
            padding: 8px;
            border-radius: 4px;
            border: 1px solid #ccc;
            margin-bottom: 15px;
            box-sizing: border-box;
        `;
        panel.appendChild(temperatureInput);

        // 模型说明
        const modelInfo = document.createElement('div');
        modelInfo.innerHTML = `
            <strong>常用模型:</strong><br>
            - X.AI: grok-2-1212, grok-3-beta 等<br>
            - OpenAI: gpt-4o, gpt-4o-mini 等<br>
            - 第三方模型: deepseek-v3, qwen-72b 等
        `;
        modelInfo.style.cssText = `
            margin-top: 10px;
            padding: 10px;
            background-color: #f5f5f5;
            border-radius: 4px;
            font-size: 0.9em;
            line-height: 1.5;
            margin-bottom: 15px;
        `;
        panel.appendChild(modelInfo);

        // 添加按钮
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            margin-top: 20px;
        `;

        const cancelButton = document.createElement('button');
        cancelButton.textContent = '取消';
        cancelButton.style.cssText = `
            padding: 8px 16px;
            background-color: #f44336;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        `;

        cancelButton.addEventListener('click', () => {
            document.body.removeChild(container);
        });

        const saveButton = document.createElement('button');
        saveButton.textContent = '保存';
        saveButton.style.cssText = `
            padding: 8px 16px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        `;

        saveButton.addEventListener('click', () => {
            // 验证输入
            const temperature = parseFloat(temperatureInput.value);
            if (isNaN(temperature) || temperature < 0 || temperature > 1) {
                alert("温度必须是0到1之间的数值");
                return;
            }

            if (!modelInput.value.trim()) {
                alert("模型名称不能为空");
                return;
            }

            // 如果选择了自定义提供方，检查URL是否已填写
            const provider = providerSelect.value;
            if (provider === 'custom' && !urlInput.value.trim()) {
                alert("使用第三方模型时，必须提供API URL");
                return;
            }

            // 保存设置
            settings.llmModel = modelInput.value.trim();
            settings.llmProvider = provider;
            settings.llmTemperature = temperature;
            settings.customApiUrl = urlInput.value.trim();

            GM_setValue(STORAGE_KEYS.LLM_MODEL, settings.llmModel);
            GM_setValue(STORAGE_KEYS.LLM_PROVIDER, settings.llmProvider);
            GM_setValue(STORAGE_KEYS.LLM_TEMPERATURE, settings.llmTemperature);
            GM_setValue(STORAGE_KEYS.CUSTOM_API_URL, settings.customApiUrl);

            showNotification("LLM模型参数已更新", "success");
            document.body.removeChild(container);
        });

        buttonContainer.appendChild(cancelButton);
        buttonContainer.appendChild(saveButton);
        panel.appendChild(buttonContainer);

        container.appendChild(panel);
        document.body.appendChild(container);

        // 为提供方选择添加事件监听，控制自定义URL输入框的显示
        providerSelect.addEventListener('change', function () {
            const customUrlContainer = document.getElementById('custom-url-container');
            customUrlContainer.style.display = this.value === 'custom' ? 'block' : 'none';
        });

        // 允许点击外部关闭
        container.addEventListener('click', (e) => {
            if (e.target === container) {
                document.body.removeChild(container);
            }
        });
    }

    /**
     * 为每个搜索源注册开关菜单
     */
    function registerSourceToggleMenus() {
        for (const [sourceId, sourceInfo] of Object.entries(settings.sourceConfig)) {
            const menuTitle = `${sourceInfo.enabled ? '✅' : '❌'} ${sourceInfo.name}`;
            GM_registerMenuCommand(menuTitle, () => toggleSource(sourceId));
        }
    }

    /**
     * 切换特定搜索源的启用状态
     * @param {string} sourceId - 搜索源ID
     */
    function toggleSource(sourceId) {
        if (settings.sourceConfig[sourceId]) {
            settings.sourceConfig[sourceId].enabled = !settings.sourceConfig[sourceId].enabled;
            GM_setValue(STORAGE_KEYS.SOURCE_CONFIG, settings.sourceConfig);

            // 显示状态变更通知
            const status = settings.sourceConfig[sourceId].enabled ? "启用" : "禁用";
            showNotification(`已${status}搜索源: ${settings.sourceConfig[sourceId].name}`, "success");

            // 重新注册菜单以更新状态显示
            registerSourceToggleMenus();
        }
    }

    /**
     * 显示源管理界面
     */
    function manageSearchSources() {
        // 创建管理界面
        const container = document.createElement('div');
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.7);
            z-index: 10000;
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: Arial, sans-serif;
        `;

        const panel = document.createElement('div');
        panel.style.cssText = `
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            width: 400px;
            max-width: 90%;
            max-height: 90%;
            overflow-y: auto;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        `;

        // 添加标题
        const title = document.createElement('h2');
        title.textContent = '管理搜索源';
        title.style.cssText = `
            margin-top: 0;
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
        `;
        panel.appendChild(title);

        // 添加说明
        const description = document.createElement('p');
        description.textContent = '启用或禁用搜索源，并通过拖动调整搜索顺序。';
        description.style.cssText = `
            margin-bottom: 20px;
            color: #666;
        `;
        panel.appendChild(description);

        // 创建源列表
        const sourceList = document.createElement('div');
        sourceList.id = 'source-list';
        sourceList.style.cssText = `
            margin-bottom: 20px;
        `;
        panel.appendChild(sourceList);

        // 排序源配置，使其按照order排序
        const sortedSources = Object.entries(settings.sourceConfig)
            .sort((a, b) => a[1].order - b[1].order);

        // 添加每个源的条目
        sortedSources.forEach(([id, info], index) => {
            const sourceItem = document.createElement('div');
            sourceItem.dataset.id = id;
            sourceItem.className = 'source-item';
            sourceItem.style.cssText = `
                padding: 10px;
                margin-bottom: 10px;
                background-color: #f5f5f5;
                border-radius: 4px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                cursor: move;
                border: 1px solid #ddd;
            `;

            // 左侧区域：拖动手柄和名称
            const leftSection = document.createElement('div');
            leftSection.style.cssText = `
                display: flex;
                align-items: center;
            `;

            const dragHandle = document.createElement('div');
            dragHandle.innerHTML = '⋮⋮';
            dragHandle.style.cssText = `
                margin-right: 10px;
                cursor: move;
                color: #999;
                font-weight: bold;
            `;
            leftSection.appendChild(dragHandle);

            const nameSpan = document.createElement('span');
            nameSpan.textContent = info.name;
            leftSection.appendChild(nameSpan);

            sourceItem.appendChild(leftSection);

            // 右侧区域：开关
            const toggle = document.createElement('label');
            toggle.className = 'switch';
            toggle.style.cssText = `
                position: relative;
                display: inline-block;
                width: 40px;
                height: 20px;
            `;

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = info.enabled;
            checkbox.style.cssText = `
                opacity: 0;
                width: 0;
                height: 0;
            `;
            checkbox.addEventListener('change', () => {
                toggleSourceInManager(id, checkbox.checked);
                // 更新滑块背景颜色
                slider.style.backgroundColor = checkbox.checked ? '#4CAF50' : '#ccc';
            });
            toggle.appendChild(checkbox);

            const slider = document.createElement('span');
            slider.className = 'slider';
            slider.style.cssText = `
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: ${info.enabled ? '#4CAF50' : '#ccc'};
                transition: .4s;
                border-radius: 20px;
            `;
            slider.innerHTML = `
                <style>
                    .slider:before {
                        position: absolute;
                        content: "";
                        height: 16px;
                        width: 16px;
                        left: 2px;
                        bottom: 2px;
                        background-color: white;
                        transition: .4s;
                        border-radius: 50%;
                    }
                    input:checked + .slider:before {
                        transform: translateX(20px);
                    }
                </style>
            `;
            toggle.appendChild(slider);

            sourceItem.appendChild(toggle);
            sourceList.appendChild(sourceItem);
        });

        // 添加按钮
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            margin-top: 20px;
        `;

        const saveButton = document.createElement('button');
        saveButton.textContent = '保存';
        saveButton.style.cssText = `
            padding: 8px 16px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        `;
        saveButton.addEventListener('click', () => {
            saveSourceConfig();
            document.body.removeChild(container);
        });

        const cancelButton = document.createElement('button');
        cancelButton.textContent = '取消';
        cancelButton.style.cssText = `
            padding: 8px 16px;
            background-color: #f44336;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        `;
        cancelButton.addEventListener('click', () => {
            document.body.removeChild(container);
        });

        buttonContainer.appendChild(cancelButton);
        buttonContainer.appendChild(saveButton);
        panel.appendChild(buttonContainer);

        container.appendChild(panel);
        document.body.appendChild(container);

        // 允许点击外部关闭
        container.addEventListener('click', (e) => {
            if (e.target === container) {
                document.body.removeChild(container);
            }
        });

        // 实现拖放功能
        setupDragAndDrop();

    }

    /**
     * 设置拖放功能
     */
    function setupDragAndDrop() {
        const sourceList = document.getElementById('source-list');
        let draggedItem = null;

        // 为每个item添加拖放事件
        document.querySelectorAll('.source-item').forEach(item => {
            item.setAttribute('draggable', 'true');

            item.addEventListener('dragstart', function () {
                draggedItem = this;
                setTimeout(() => {
                    this.style.opacity = '0.5';
                }, 0);
            });

            item.addEventListener('dragend', function () {
                this.style.opacity = '1';
                draggedItem = null;
            });

            item.addEventListener('dragover', function (e) {
                e.preventDefault();
            });

            item.addEventListener('dragenter', function (e) {
                e.preventDefault();
                this.style.backgroundColor = '#e9e9e9';
            });

            item.addEventListener('dragleave', function () {
                this.style.backgroundColor = '#f5f5f5';
            });

            item.addEventListener('drop', function (e) {
                e.preventDefault();
                this.style.backgroundColor = '#f5f5f5';

                if (draggedItem !== this) {
                    const allItems = [...sourceList.querySelectorAll('.source-item')];
                    const draggedIndex = allItems.indexOf(draggedItem);
                    const targetIndex = allItems.indexOf(this);

                    if (draggedIndex < targetIndex) {
                        sourceList.insertBefore(draggedItem, this.nextSibling);
                    } else {
                        sourceList.insertBefore(draggedItem, this);
                    }
                }
            });
        });
    }

    /**
     * 在管理界面中切换源状态
     * @param {string} id - 源ID
     * @param {boolean} enabled - 是否启用
     */
    function toggleSourceInManager(id, enabled) {
        const sourceItem = document.querySelector(`.source-item[data-id="${id}"]`);
        if (sourceItem) {
            sourceItem.style.opacity = enabled ? '1' : '0.6';
        }
    }

    /**
     * 保存源配置
     */
    function saveSourceConfig() {
        const sourceItems = document.querySelectorAll('.source-item');
        const newConfig = { ...settings.sourceConfig };

        // 更新顺序和启用状态
        sourceItems.forEach((item, index) => {
            const id = item.dataset.id;
            const enabled = item.querySelector('input[type="checkbox"]').checked;

            newConfig[id] = {
                ...newConfig[id],
                enabled: enabled,
                order: index + 1
            };
        });

        // 更新设置并保存
        settings.sourceConfig = newConfig;
        GM_setValue(STORAGE_KEYS.SOURCE_CONFIG, newConfig);

        // 重新注册菜单以更新状态显示
        registerSourceToggleMenus();

        showNotification("搜索源配置已保存", "success");
    }

    /**
     * 设置JavBus Cookie并持久化保存
     */
    function setJavBusCookie() {
        const currentCookie = settings.javbusCookie;
        const newCookie = prompt("请输入JavBus Cookie：", currentCookie);

        if (newCookie !== null) {
            settings.javbusCookie = newCookie;
            GM_setValue(STORAGE_KEYS.JAVBUS_COOKIE, newCookie); // 持久化保存
            showNotification("JavBus Cookie已更新并保存", "success");
            console.log("JavBus Cookie已更新为:", newCookie);
        }
    }

    /**
     * 设置API密钥并持久化保存
     */
    function setApiKey() {
        const currentApiKey = settings.apiKey;
        const newApiKey = prompt("请输入API密钥：", currentApiKey);

        if (newApiKey !== null) {
            settings.apiKey = newApiKey;
            GM_setValue(STORAGE_KEYS.API_KEY, newApiKey); // 持久化保存
            showNotification("API密钥已更新并保存", "success");
            console.log("API密钥已更新为:", newApiKey);
        }
    }

    /**
     * 设置自定义Prompt
        * @param {string} prompt - 自定义Prompt内容
        * @returns {string} - 更新后的Prompt内容
    */
    function setCustomPrompt() {
        const currentPrompt = settings.customPrompt;
        const newPrompt = prompt("请输入自定义Prompt内容（可使用 {{input}} 占位原始文件名）：", currentPrompt);

        if (newPrompt !== null) {
            settings.customPrompt = newPrompt;
            GM_setValue(STORAGE_KEYS.CUSTOM_PROMPT, newPrompt);
            showNotification("自定义Prompt已更新", "success");
        }
    }


    /**
     * 显示通知
     * @param {string} message - 消息内容
     * @param {string} type - 通知类型 ('error' 或 'success')
     */
    function showNotification(message, type = 'error') {
        // 创建一个临时的通知元素
        const notification = document.createElement('div');
        notification.textContent = message;

        // 根据类型设置不同的样式
        const backgroundColor = type === 'error' ? '#f44336' : '#4caf50';

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 10px 20px;
            background-color: ${backgroundColor};
            color: white;
            border-radius: 4px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            z-index: 10000;
            font-family: Arial, sans-serif;
            max-width: 300px;
        `;

        document.body.appendChild(notification);

        // 2秒后移除通知
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.5s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500);
        }, 2000);
    }

    /**
     * 显示错误提示
     * @param {string} message - 错误消息
     */
    function showErrorNotification(message) {
        showNotification(message, 'error');
    }

    /**
     * 处理弹出对话框
     * @param {Element} node - 对话框DOM节点
     */
    async function handleDialog(node) {
        const input = node.querySelector('input.el-input__inner[type="text"]');
        if (!input) return;

        const originalValue = input.value; // 保存原始文件名

        try {
            const cid = input.value;
            const keyword = await extractKeywordLLM(cid);
            console.log("提取的关键字:", keyword);
            showNotification(`提取的关键字: ${keyword}`, 'success');

            if (!keyword) {
                console.log("未能提取有效关键字");
                showErrorNotification(ERROR_MESSAGES.KEYWORD_EXTRACTION_FAILED);
                return; // 保留原始文件名
            }

            // 按照顺序查询已启用的源
            await startSearchSequence(keyword, input, originalValue);
        } catch (error) {
            console.error("处理过程发生错误:", error);
            showErrorNotification(ERROR_MESSAGES.PARSING_ERROR);
            // 保留原始文件名
        }
    }

    /**
     * 启动搜索序列
     * @param {string} keyword - 搜索关键词
     * @param {HTMLElement} input - DOM输入元素
     * @param {string} originalValue - 原始输入值
     */
    async function startSearchSequence(keyword, input, originalValue) {
        try {
            // 获取排序后且已启用的搜索源
            const enabledSources = Object.entries(settings.sourceConfig)
                .filter(([_, info]) => info.enabled)
                .sort((a, b) => a[1].order - b[1].order)
                .map(([id, _]) => id);

            console.log("将按以下顺序查询启用的搜索源:", enabledSources);

            // 对每个启用的源进行查询
            for (const sourceId of enabledSources) {
                let result = null;

                // 根据源ID调用对应的查询方法
                switch (sourceId) {
                    case 'avwiki':
                        result = await queryAVwiki(keyword);
                        break;
                    case 'dmm':
                        result = await queryDMM(keyword);
                        break;
                    case 'javbus':
                        result = await getJavJavbus(keyword);
                        break;
                    case 'javdb':
                        result = await getJavJavdb(keyword);
                        break;
                }

                if (result) {
                    console.log(`从 ${settings.sourceConfig[sourceId].name} 获取到结果`);
                    input.value = result;
                    triggerInputChange(input);
                    return;
                }
            }

            // 所有来源都没有找到结果
            console.log("所有已启用的搜索源都没有找到匹配结果");
            showNotification("未找到相关作品信息", "error");
        } catch (error) {
            console.error("搜索序列执行过程中出错:", error);
            showErrorNotification(ERROR_MESSAGES.PARSING_ERROR);
        }
    }

    /**
     * 使用LLM提取作品编号
     * @param {string} text - 包含可能的作品编号的文本
     * @returns {Promise<string|null>} - 提取的关键词或null
     */
    async function extractKeywordLLM(text) {
        // system prompt：定义模型角色、背景知识和规则
        const systemPrompt = `提取AV番号

        任务描述：
        你是一个专门用于提取日本AV（成人视频）番号的助手。你的目标是从给定的文件名中提取AV番号，忽略文件名中的无关信息。只需要输出提取出的番号，不需要进一步解析或解释。

        背景知识：
        AV番号是日本成人视频的唯一标识，通常由厂商代码（字母部分）和作品编号（数字部分）组成，中间多以"-"分隔，例如"S1-123"。以下是番号规律的简要总结：
        1. 基本结构：厂商代码（字母或字母组合） + "-" + 作品编号（数字或数字+字母）。
        2. 常见规律：厂商代码如"S1""IPX"，编号如"123""456A"。
        3. 不常见规律：
           - 平台专属代码如"FC2-",注意对于FC2作品，若存在'ppv'，则去除'ppv'；"TokyoHot-"。
           - 非连续或随机编号。
           - 嵌入式信息如日期（"20210315"）。
           - 特殊前缀如"FES-""Fan-"。
        4. 文件名特点：文件名可能包含女优名字、日期、质量标识（如"1080p"）等无关信息，番号可能以大写或小写出现，可能有下划线"_"或无分隔符。

        指令：
        1. 从给定的文件名中提取可能的AV番号，忽略无关信息。
        2. 输出格式如下：
           - 如果成功提取到番号，直接输出提取出的番号（单个番号，无需列表格式）。
           - 如果无法提取到番号，统一返回"null"（小写，无引号，仅输出此值）。

        注意事项：
        - 优先考虑以"-"分隔的字母+数字组合作为番号。
        - 忽略文件名中的非番号部分（如"[1080p]""(2021)"）。
        - 考虑大小写不敏感，例如"S1-123"和"s1-123"视为相同。
        - 厂商代码或平台专属代码在输出时应统一为大写处理。
        - 如果文件名中没有明显番号，必须返回"null"。`;

        // user prompt：具体任务输入
        const userPrompt = settings.customPrompt
        ? settings.customPrompt.replace('{{input}}', text)
        : `开始任务：
        请根据上述规则和示例，从以下文件名中提取AV番号，并提供结果。
        文件名：${text}`;

        // 获取当前API密钥和LLM设置
        const apiKey = settings.apiKey;
        const modelName = settings.llmModel;
        const provider = settings.llmProvider;
        const temperature = settings.llmTemperature;
        const customApiUrl = settings.customApiUrl;

        console.log(`使用API密钥进行关键词提取，模型: ${modelName}, 提供方: ${provider}, 温度: ${temperature}`);

        try {
            // 为所有提供方准备基本请求体
            const body = {
                model: modelName,
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt }
                ],
                temperature: temperature,
            };

            // 准备请求头
            const headers = {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            };

            let response;
            let apiUrl;

            // 根据提供方选择不同的API端点
            switch (provider) {
                case 'x.ai':
                    apiUrl = "https://api.x.ai/v1/chat/completions";
                    break;

                case 'openai':
                    apiUrl = "https://api.openai.com/v1/chat/completions";
                    break;

                case 'custom':
                    if (!customApiUrl) {
                        console.error("未设置自定义API URL");
                        showErrorNotification(ERROR_MESSAGES.CUSTOM_API_URL_REQUIRED);
                        return null;
                    }
                    apiUrl = customApiUrl;
                    break;

                default:
                    console.error("未知的LLM提供方:", provider);
                    showErrorNotification("未知的LLM提供方");
                    return null;
            }

            // 执行API请求
            response = await fetch(apiUrl, {
                method: "POST",
                headers: headers,
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`${provider} API请求失败:`, errorText);
                showErrorNotification(ERROR_MESSAGES.API_ERROR);
                return null;
            }

            const resJson = await response.json();
            let result = resJson.choices?.[0]?.message?.content?.trim() || null;

            // 结果清洗
            if (result === "null" || result === "" || result === "未找到番号") return null;
            return result;

        } catch (error) {
            console.error("提取关键词时出错:", error);
            showErrorNotification(ERROR_MESSAGES.API_ERROR);
            return null;
        }
    }

    /**
     * 执行GM_xmlhttpRequest并返回Promise
     * @param {Object} options - 请求选项
     * @returns {Promise<Object>} - 响应对象
     */
    function promiseRequest(options) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: options.method || "GET",
                url: options.url,
                headers: options.headers || {},
                data: options.data,
                onload: resolve,
                onerror: reject
            });
        });
    }

    /**
     * 查询AV-Wiki
     * @param {string} keyword - 搜索关键词
     * @returns {Promise<string|null>} - 处理结果
     */
    async function queryAVwiki(keyword) {
        // 检查源是否启用
        if (!settings.sourceConfig.avwiki.enabled) {
            console.log("AV-Wiki 搜索已禁用，跳过");
            return null;
        }

        console.log("AV-Wiki搜索关键词:", keyword);
        const encodedKeyword = encodeURIComponent(keyword);
        const url = `https://av-wiki.net/?s=${encodedKeyword}&post_type=product`;

        console.log("AV-Wiki 搜索URL:", url);

        try {
            // 1. 搜索页请求
            const response = await promiseRequest({ url });
            const parser = new DOMParser();
            const doc = parser.parseFromString(response.responseText, "text/html");
            const listItems = doc.querySelectorAll('.post .archive-list .read-more a');

            // 提取关键字中的字母部分用于匹配
            const keywordLetters = keyword.match(/[a-zA-Z]+/);
            if (!keywordLetters) {
                throw new Error("无法从关键词中提取字母部分");
            }

            const keywordRegex = new RegExp(keywordLetters[0], 'i');

            // 查找第一个有效链接
            for (let item of listItems) {
                if (item.href && keywordRegex.test(item.href)) {
                    const detailUrl = item.href;
                    console.log("找到AV-Wiki详情页URL:", detailUrl);

                    // 2. 详情页请求
                    const detailResponse = await promiseRequest({ url: detailUrl });
                    return parseResponseWiki(detailResponse.responseText);
                }
            }

            // 未找到匹配结果
            console.log("AV-Wiki未找到匹配结果");
            return null;
        } catch (error) {
            console.error("AV-Wiki查询过程中出错:", error);
            return null;
        }
    }

    /**
     * 解析AV-Wiki响应
     * @param {string} html - 响应HTML
     * @returns {string|null} - 处理后的作品名称
     */
    function parseResponseWiki(html) {
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");

            // 获取作品标题
            const ogTitle = doc.querySelector('.blockquote-like p');

            if (!ogTitle) {
                console.log("AV-Wiki解析未找到标题");
                return null;
            }

            let name = ogTitle.textContent;

            // 清理名称中的特殊字符
            name = name.replace(/[\/:*?"<>|\x00-\x1F]/g, '_');
            return name;
        } catch (error) {
            console.error("解析AV-Wiki响应时出错:", error);
            return null;
        }
    }

    /**
     * 查询DMM
     * @param {string} keyword - 搜索关键词
     * @returns {Promise<string|null>} - 处理结果
     */
    async function queryDMM(keyword) {
        // 检查源是否启用
        if (!settings.sourceConfig.dmm.enabled) {
            console.log("DMM 搜索已禁用，跳过");
            return null;
        }

        console.log("DMM搜索关键词:", keyword);
        const encodedKeyword = encodeURIComponent(keyword);
        const url = `https://www.dmm.co.jp/digital/videoa/-/detail/=/cid=${encodedKeyword}/?i3_ref=search&i3_ord=1`;

        console.log("DMM URL:", url);

        try {
            // 主查询
            const response = await promiseRequest({ url });

            if (response.responseText.includes('404 Not Found')) {
                // 非直接匹配，尝试搜索
                return await dmmFallbackSearch(encodedKeyword);
            } else {
                // 直接匹配，解析结果
                return parseResponseDMM(response.responseText);
            }
        } catch (error) {
            console.error("DMM主查询失败:", error);
            return null;
        }
    }

    /**
     * DMM搜索备选方案
     * @param {string} keyword - 搜索关键词
     * @returns {Promise<string|null>} - 处理结果
     */
    async function dmmFallbackSearch(keyword) {
        const searchUrl = `https://www.dmm.co.jp/search/=/searchstr=${keyword}/limit=30/sort=rankprofile/`;
        console.log("DMM备选搜索URL:", searchUrl);

        try {
            const response = await promiseRequest({ url: searchUrl });
            const parser = new DOMParser();
            const doc = parser.parseFromString(response.responseText, "text/html");
            const listItems = doc.querySelectorAll('#list li .tmb a');

            // 提取输入中的连续字母部分
            const keywordDecoded = decodeURIComponent(keyword);
            const keywordLetters = keywordDecoded.match(/[a-zA-Z]+/);
            if (!keywordLetters) {
                throw new Error("无法从关键词中提取字母部分");
            }

            const keywordRegex = new RegExp(keywordLetters[0], 'i');
            const digiRegex = new RegExp("digital", 'i');
            const monoRegex = new RegExp("mono", 'i');

            // 查找第一个有效链接
            for (let item of listItems) {
                if (item.href &&
                    keywordRegex.test(item.href) &&
                    (digiRegex.test(item.href) || monoRegex.test(item.href))) {

                    const detailUrl = item.href;
                    console.log("找到DMM详情页URL:", detailUrl);

                    // 请求详情页
                    const detailResponse = await promiseRequest({ url: detailUrl });
                    return parseResponseDMM(detailResponse.responseText);
                }
            }

            // 没有找到有效链接
            console.log("DMM备选搜索未找到匹配结果");
            return null;
        } catch (error) {
            console.error("DMM备选搜索过程中出错:", error);
            return null;
        }
    }

    /**
     * 解析DMM响应
     * @param {string} html - 响应HTML
     * @returns {string|null} - 处理后的作品名称
     */
    function parseResponseDMM(html) {
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");

            // 尝试从meta标签中提取备选信息
            const ogTitle = doc.querySelector('#title');
            const ogUrl = doc.querySelector('meta[property="og:url"]');

            if (!ogTitle) {
                console.log("DMM解析未找到标题");
                return null;
            }

            let name = ogTitle.textContent;
            let sku = '未找到产品SKU';

            if (ogUrl && ogUrl.content) {
                const match = ogUrl.content.match(/cid=([^\/]+)/);
                if (match) {
                    sku = match[1].toLowerCase();
                }
            }

            const script = doc.querySelector('script[type="application/ld+json"]');

            if (script) {
                try {
                    const data = JSON.parse(script.textContent);
                    name = data.name || name;
                    sku = data.sku?.toLowerCase() || sku;
                } catch (error) {
                    console.error("解析JSON-LD数据时出错:", error);
                }
            }

            // 清理名称中的特殊字符
            name = name.replace(/[\/:*?"<>|\x00-\x1F]/g, '_');
            return `${sku} ${name}`;
        } catch (error) {
            console.error("解析DMM响应时出错:", error);
            return null;
        }
    }

    /**
     * 从JavBus获取作品信息
     * @param {string} id - 作品ID
     * @returns {Promise<string|null>} - 处理结果
     */
    async function getJavJavbus(id) {
        // 检查源是否启用
        if (!settings.sourceConfig.javbus.enabled) {
            console.log("JavBus 搜索已禁用，跳过");
            return null;
        }

        const url = `https://www.javbus.com/${id}`;
        console.log("JavBus URL:", url);

        // 获取当前保存的Cookie - 从settings对象中读取
        const cookie = settings.javbusCookie || "age=verified";
        console.log("使用JavBus Cookie进行请求");

        const headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
            'cookie': cookie,
            'cache-control': 'max-age=0'
        };

        try {
            const response = await promiseRequest({ url, headers });
            const parser = new DOMParser();
            const doc = parser.parseFromString(response.responseText, "text/html");
            const h3 = doc.querySelector('h3');

            if (!h3) {
                console.log("JavBus未找到结果");
                return null;
            }

            let h3_text = h3.textContent.trim();
            // 去除ID本身并拼接成"【ID】标题"
            h3_text = `【${id}】` + h3_text.replace(id, '').replace(/^\s+/, '');

            return h3_text;
        } catch (error) {
            console.error("JavBus查询过程中出错:", error);
            return null;
        }
    }

    /**
     * 从JavaDB获取作品信息
     * @param {string} id - 作品ID
     * @returns {Promise<string|null>} - 处理结果
     */
    async function getJavJavdb(id) {
        // 检查源是否启用
        if (!settings.sourceConfig.javdb.enabled) {
            console.log("JavDB 搜索已禁用，跳过");
            return null;
        }

        // 将id转换为大写以匹配Python代码中的处理方式
        const upperId = id.toUpperCase();
        const url = `https://javdb.com/search?q=${encodeURIComponent(upperId)}&f=all`;
        console.log("JavaDB URL:", url);

        const headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
            'cache-control': 'max-age=0, private, must-revalidate'
        };

        try {
            const response = await promiseRequest({ url, headers });
            const parser = new DOMParser();
            const doc = parser.parseFromString(response.responseText, "text/html");
            const movieListDiv = doc.querySelector('div.movie-list.h.cols-4.vcols-8');

            if (!movieListDiv) {
                console.log("JavaDB未找到电影列表");
                return null;
            }

            const movieDivs = movieListDiv.querySelectorAll('div.item');

            if (movieDivs.length === 0) {
                console.log("JavaDB未找到电影列表中的作品");
                return null;
            }

            const firstMovieDiv = movieDivs[0];
            const videoTitleDiv = firstMovieDiv.querySelector('div.video-title');

            if (!videoTitleDiv) {
                console.log("JavaDB未找到视频标题");
                return null;
            }

            const movieName = videoTitleDiv.textContent.trim();

            // 检查标题中是否包含ID（大写比较）
            if (movieName.toUpperCase().includes(upperId)) {
                return `【${upperId}】` + movieName.replace(new RegExp(upperId, 'i'), '').trim();
            } else {
                console.log("在JavaDB找到的标题中未包含搜索ID");
                return null;
            }
        } catch (error) {
            console.error("JavaDB查询过程中出错:", error);
            return null;
        }
    }

    /**
     * 触发输入框变更事件
     * @param {HTMLElement} element - DOM输入元素
     */
    function triggerInputChange(element) {
        // 创建输入事件
        var event = new Event('input', {
            bubbles: true,
            cancelable: true,
        });

        element.value = element.value.trim(); // 移除空格
        element.dispatchEvent(event); // 触发input事件
    }

    // 启动时检查是否有保存的设置，并输出日志
    console.log("脚本启动，已加载设置：",
        "API密钥: " + (settings.apiKey ? "已设置" : "未设置"),
        "JavBus Cookie: " + (settings.javbusCookie ? "已设置" : "未设置"),
        "LLM模型: " + settings.llmModel,
        "LLM提供方: " + settings.llmProvider,
        "LLM温度: " + settings.llmTemperature,
        "自定义API URL: " + (settings.customApiUrl ? settings.customApiUrl : "未设置"),
        "搜索源配置:", settings.sourceConfig
    );
})();