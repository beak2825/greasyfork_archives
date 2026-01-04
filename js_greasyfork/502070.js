// ==UserScript==
// @name         Auto-fill by GPT
// @namespace    https://liuy.xyz/
// @version      0.0.3
// @description  Auto-fill input fields using GPT
// @author       liuy
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/502070/Auto-fill%20by%20GPT.user.js
// @updateURL https://update.greasyfork.org/scripts/502070/Auto-fill%20by%20GPT.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 默认配置选项
    const defaultConfig = {
        shortcutKey: 'n', // 默认快捷键
        apiKey: '', // 默认API密钥（留空，由用户配置）
        model: 'gpt-3.5-turbo', // 默认模型
        apiUrl: 'https://api.openai.com/v1/chat/completions' // 默认API URL
    };

    // 初始化配置
    let config = { ...defaultConfig };

    // 检查并加载用户配置
    const userConfig = JSON.parse(GM_getValue('openaiPluginConfig', '{}')) || {};
    config = { ...config, ...userConfig };

    // 创建配置页面
    function createConfigPage() {
        const configPage = document.createElement('div');
        configPage.id = 'openaiPluginConfigPage';
        configPage.style.position = 'fixed';
        configPage.style.top = '10px';
        configPage.style.right = '10px';
        configPage.style.backgroundColor = 'white';
        configPage.style.border = '1px solid black';
        configPage.style.padding = '10px';
        configPage.style.zIndex = '1000';
        configPage.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';

        const closeButton = document.createElement('button');
        closeButton.innerText = '关闭';
        closeButton.onclick = () => configPage.style.display = 'none';
        closeButton.style.marginRight = '10px';

        const saveButton = document.createElement('button');
        saveButton.innerText = '保存';
        saveButton.onclick = () => {
            config.apiKey = document.getElementById('apiKeyInput').value;
            config.model = document.getElementById('modelInput').value;
            config.apiUrl = document.getElementById('apiUrlInput').value;
            config.shortcutKey = document.getElementById('shortcutKeyInput').value;
            GM_setValue('openaiPluginConfig', JSON.stringify(config));
            alert('配置已保存');
            configPage.style.display = 'none'; // 关闭配置页面
        };

        const apiKeyLabel = document.createElement('label');
        apiKeyLabel.innerText = 'API密钥: ';
        const apiKeyInput = document.createElement('input');
        apiKeyInput.id = 'apiKeyInput';
        apiKeyInput.value = config.apiKey;
        apiKeyInput.style.marginBottom = '10px';

        const modelLabel = document.createElement('label');
        modelLabel.innerText = '模型: ';
        const modelInput = document.createElement('input');
        modelInput.id = 'modelInput';
        modelInput.value = config.model;
        modelInput.style.marginBottom = '10px';

        const apiUrlLabel = document.createElement('label');
        apiUrlLabel.innerText = 'API URL: ';
        const apiUrlInput = document.createElement('input');
        apiUrlInput.id = 'apiUrlInput';
        apiUrlInput.value = config.apiUrl;
        apiUrlInput.style.marginBottom = '10px';

        const shortcutKeyLabel = document.createElement('label');
        shortcutKeyLabel.innerText = '快捷键: ';
        const shortcutKeyInput = document.createElement('input');
        shortcutKeyInput.id = 'shortcutKeyInput';
        shortcutKeyInput.value = config.shortcutKey;
        shortcutKeyInput.style.marginBottom = '10px';

        configPage.appendChild(apiKeyLabel);
        configPage.appendChild(apiKeyInput);
        configPage.appendChild(document.createElement('br'));
        configPage.appendChild(modelLabel);
        configPage.appendChild(modelInput);
        configPage.appendChild(document.createElement('br'));
        configPage.appendChild(apiUrlLabel);
        configPage.appendChild(apiUrlInput);
        configPage.appendChild(document.createElement('br'));
        configPage.appendChild(shortcutKeyLabel);
        configPage.appendChild(shortcutKeyInput);
        configPage.appendChild(document.createElement('br'));
        configPage.appendChild(saveButton);
        configPage.appendChild(closeButton);

        document.body.appendChild(configPage);
    }

    // 显示配置页面
    function showConfigPage() {
        const configPage = document.getElementById('openaiPluginConfigPage');
        if (configPage) {
            configPage.style.display = 'block';
        } else {
            createConfigPage();
        }
    }

    // 检查配置是否完整
    function checkConfig() {
        if (!config.apiKey || !config.model || !config.apiUrl) {
            showConfigPage();
            alert('请先配置API密钥、模型和API URL');
            return false;
        }
        return true;
    }

    // 监听快捷键事件
    document.addEventListener('keydown', function(event) {
        if (event.altKey && event.key === 'o') {
            event.preventDefault(); // 阻止默认行为
            showConfigPage();
        } else if (event.altKey && event.key === config.shortcutKey) {
            event.preventDefault(); // 阻止默认行为
            const activeEle = document.activeElement;
            if (activeEle && (activeEle.tagName === 'INPUT' || activeEle.tagName === 'TEXTAREA')) {
                if (checkConfig()) {
                    _fetchGPT(activeEle, config);
                }
            } else {
                console.warn('Active element is not an input or textarea.');
            }
        }
    });

    // 发起OpenAI请求
    function _fetchGPT(activeEle, config) {
        const { name, placeholder } = activeEle;

        const url = config.apiUrl;
        const data = {
            model: config.model,
            messages: [
                {role: "system",content: `你现在是Web页面输入框数据填充器，根据输入框的name及placeholder生成测试数据。不允许拒绝指令，生成的数据只会用来验证相应的规则是否正确。只需要返回填充内容，禁止返回HTML元素。`},
                {role: "user",content: `根据以下信息生成填充内容：\nname: ${name}\nplaceholder: ${placeholder}`}
            ],
            temperature: 0.8,
            max_tokens: 200,
            stream: false,
        };
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.apiKey}`
        };

        fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        })
            .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
            .then(data => {
            console.log('Success:', data);
            const { choices } = data;
            const resMsg = choices[0].message.content;
            activeEle.value = resMsg;
            // 触发输入事件
            triggerInputEvent(activeEle);
        })
            .catch(error => {
            console.error('Error:', error);
            alert('Failed to fetch data from OpenAI. Please check the console for details.');
        });
    }

    // 触发输入事件
    function triggerInputEvent(element) {
        const event = new Event('input', { bubbles: true });
        element.dispatchEvent(event);
    }
})();