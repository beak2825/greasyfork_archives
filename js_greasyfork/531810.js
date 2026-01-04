// ==UserScript==
// @name         NodeSeek Plugin
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  NodeSeek插件: 图床粘贴
// @license      GPL License
// @author       beibiele
// @match        https://www.nodeseek.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/531810/NodeSeek%20Plugin.user.js
// @updateURL https://update.greasyfork.org/scripts/531810/NodeSeek%20Plugin.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 常量定义
    const CONFIG = {
        STORAGE_KEY: 'nodeseek_plus_config',
        API_LIST: [
            {
                id: '111666',
                name: '111666图床'
            },
            {
                id: 'uhsea',
                name: '屋舍图床'
            }
        ]
    };

    // 默认配置
    const defaultConfig = {
        apiId: CONFIG.API_LIST[0].id
    };

    // 当前选择的图床 ID（用于缓存）
    let currentApiId = null;

    // 获取当前配置
    function getConfig() {
        const config = GM_getValue(CONFIG.STORAGE_KEY, defaultConfig);
        // 更新缓存
        currentApiId = config.apiId;
        return config;
    }

    // 保存配置
    function saveConfig(config) {
        GM_setValue(CONFIG.STORAGE_KEY, config);
        // 更新缓存
        currentApiId = config.apiId;
    }

    // 显示配置界面
    function showConfigDialog() {
        const config = getConfig();
        const currentApi = CONFIG.API_LIST.find(api => api.id === config.apiId) || CONFIG.API_LIST[0];

        // 创建对话框
        const dialog = document.createElement('div');
        dialog.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            font-family: Arial, sans-serif;
        `;

        // 创建标题
        const title = document.createElement('h3');
        title.textContent = '选择图床';
        title.style.margin = '0 0 15px 0';
        dialog.appendChild(title);

        // 创建下拉选择框
        const select = document.createElement('select');
        select.style.cssText = `
            width: 100%;
            padding: 8px;
            margin-bottom: 15px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
        `;

        // 添加选项
        CONFIG.API_LIST.forEach(api => {
            const option = document.createElement('option');
            option.value = api.id;
            option.textContent = api.name;
            if (api.id === currentApi.id) {
                option.selected = true;
            }
            select.appendChild(option);
        });

        dialog.appendChild(select);

        // 创建按钮容器
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            display: flex;
            justify-content: flex-end;
            gap: 10px;
        `;

        // 创建取消按钮
        const cancelButton = document.createElement('button');
        cancelButton.textContent = '取消';
        cancelButton.style.cssText = `
            padding: 8px 15px;
            border: 1px solid #ddd;
            border-radius: 4px;
            background: #f5f5f5;
            cursor: pointer;
        `;
        cancelButton.onclick = () => {
            document.body.removeChild(dialog);
            document.body.removeChild(overlay);
        };

        // 创建确定按钮
        const confirmButton = document.createElement('button');
        confirmButton.textContent = '确定';
        confirmButton.style.cssText = `
            padding: 8px 15px;
            border: none;
            border-radius: 4px;
            background: #4CAF50;
            color: white;
            cursor: pointer;
        `;
        confirmButton.onclick = () => {
            const newApiId = select.value;
            saveConfig({
                ...config,
                apiId: newApiId
            });
            const newApi = CONFIG.API_LIST.find(api => api.id === newApiId);
            alert(`已切换到：${newApi.name}，需要重新复制图片哦~`);
            document.body.removeChild(dialog);
            document.body.removeChild(overlay);

            // 重新注册菜单命令以更新显示
            try {
                GM_unregisterMenuCommand("当前图床: " + currentApi.name);
                initMonkeyMenu();
            } catch (e) {
                console.error("无法更新菜单");
            }
        };

        buttonContainer.appendChild(cancelButton);
        buttonContainer.appendChild(confirmButton);
        dialog.appendChild(buttonContainer);

        // 创建遮罩层
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 9999;
        `;

        // 添加到页面
        document.body.appendChild(overlay);
        document.body.appendChild(dialog);
    }

    // 初始化脚本菜单
    function initMonkeyMenu() {
        try {
            const config = getConfig();
            const currentApi = CONFIG.API_LIST.find(api => api.id === config.apiId) || CONFIG.API_LIST[0];
            GM_registerMenuCommand(`当前图床: ${currentApi.name}`, showConfigDialog);
        } catch (e) {
            console.error("无法使用Tampermonkey");
        }
    }

    // 初始化菜单和配置
    initMonkeyMenu();
    getConfig(); // 初始化当前图床 ID

    document.addEventListener('keyup', doc_keyUp, false);
    async function doc_keyUp(event) {
        if (event.ctrlKey && event.code == "KeyV") {
            handlePaste();
        }
    }

    async function handlePaste() {
        let imageFiles = [];
        const clipboardItems = await navigator.clipboard.read();
        for (const clipboardItem of clipboardItems) {
            for (const type of clipboardItem.types) {
                if (type.indexOf('image/') !== -1) {
                    let blob = await clipboardItem.getType(type);
                    imageFiles.push(blob);
                }
            }
        }

        if (imageFiles.length > 0) {
            for (let file of imageFiles) {
                await uploadToImageHost(file);
            }
        }
    }

    // 111666图床上传函数
    function upload_111666(file) {
        const apiUrl = 'https://i.111666.best';
        const uploadEndpoint = '/image';

        return new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append('file', file);

            GM_xmlhttpRequest({
                method: 'POST',
                url: apiUrl + uploadEndpoint,
                data: formData,
                headers: {
                    'Auth-Token': crypto.randomUUID()
                },
                onload: (response) => {
                    let jsonResponse = JSON.parse(response.responseText);
                    if (response.status === 200 && jsonResponse && jsonResponse.ok) {
                        insertToEditor(apiUrl + jsonResponse.src);
                    } else {
                        mscAlert('图片上传成功，但未获取到Markdown链接');
                    }
                    resolve();
                },
                onerror: (error) => {
                    mscAlert('图片上传遇到错误，请检查网络或稍后重试。');
                    reject(error);
                }
            });
        });
    }

    // 屋舍图床上传函数
    function upload_uhsea(file) {
        const apiUrl = 'https://uhsea.com/Frontend/upload';

        return new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append('file', file);

            GM_xmlhttpRequest({
                method: 'POST',
                url: apiUrl,
                data: formData,
                onload: (response) => {
                    let jsonResponse = JSON.parse(response.responseText);
                    if (response.status === 200 && jsonResponse && jsonResponse.data) {
                        insertToEditor(jsonResponse.data);
                    } else {
                        mscAlert('图片上传成功，但未获取到Markdown链接');
                    }
                    resolve();
                },
                onerror: (error) => {
                    mscAlert('图片上传遇到错误，请检查网络或稍后重试。');
                    reject(error);
                }
            });
        });
    }

    // 根据当前选择的图床调用对应的上传函数
    function uploadToImageHost(file) {
        // 使用缓存的图床 ID
        const apiId = currentApiId || defaultConfig.apiId;
        const apiConfig = CONFIG.API_LIST.find(api => api.id === apiId);

        // 如果没有找到配置，使用默认图床
        if (!apiConfig) {
            console.warn('未找到对应的图床配置，使用默认图床');
            return upload_111666(file);
        }

        switch (apiConfig.id) {
            case '111666':
                return upload_111666(file);
            case 'uhsea':
                return upload_uhsea(file);
            default:
                console.warn('不支持的图床，使用默认图床');
                return upload_111666(file);
        }
    }

    function insertToEditor(Link) {
        const codeMirrorElement = document.querySelector('.CodeMirror');
        if (codeMirrorElement) {
            const codeMirrorInstance = codeMirrorElement.CodeMirror;
            if (codeMirrorInstance) {
                const cursor = codeMirrorInstance.getCursor();
                let markdownLink = '![](' + Link + ')';
                GM_setClipboard(markdownLink);
                codeMirrorInstance.replaceRange(markdownLink + '\n', cursor);
            }
        }
    }
})();