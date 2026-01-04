// ==UserScript==
// @name         思源在线视频时间戳和截图
// @namespace    https://github.com/KuiyueRO/siyuan-media-timestamp
// @version      1.2
// @description  捕获视频时间戳和当前帧截图和点击跳转
// @author       A_Cai
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      127.0.0.1
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/523628/%E6%80%9D%E6%BA%90%E5%9C%A8%E7%BA%BF%E8%A7%86%E9%A2%91%E6%97%B6%E9%97%B4%E6%88%B3%E5%92%8C%E6%88%AA%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/523628/%E6%80%9D%E6%BA%90%E5%9C%A8%E7%BA%BF%E8%A7%86%E9%A2%91%E6%97%B6%E9%97%B4%E6%88%B3%E5%92%8C%E6%88%AA%E5%9B%BE.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 添加样式
    GM_addStyle(`
        .settings-panel {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #ffffff;
            padding: 24px;
            border-radius: 12px;
            box-shadow: 0 4px 24px rgba(0,0,0,0.15);
            z-index: 100000;
            display: none;
            width: 460px;
            max-height: 85vh;
            overflow-y: auto;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            box-sizing: border-box; // 添加这行确保padding不会影响总宽度
        }
        .settings-panel h3 {
            margin: 0 0 24px 0;
            color: #1a1a1a;
            font-size: 20px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .settings-panel h3::before {
            content: '';
            display: inline-block;
            width: 4px;
            height: 20px;
            background: #4CAF50;
            border-radius: 2px;
        }
        .settings-section {
            padding: 16px;
            background: #f8f9fa;
            border-radius: 8px;
            margin-bottom: 16px;
            box-sizing: border-box;
        }
        .settings-section-title {
            font-size: 16px;
            font-weight: 500;
            color: #2c3e50;
            margin-bottom: 16px;
        }
        .settings-field {
            margin-bottom: 20px;
            padding: 0 12px;
            box-sizing: border-box;
        }
        .settings-field label {
            display: block;
            color: #2c3e50;
            font-size: 14px;
            font-weight: 500;
            margin-bottom: 8px;
            opacity: 0.85;
        }
        .settings-field label:hover {
            opacity: 1;
        }
        .settings-field input[type="text"],
        .settings-field select {
            width: calc(100% - 24px);
            padding: 10px 12px;
            border: 1px solid #e0e0e0;
            border-radius: 6px;
            font-size: 14px;
            transition: all 0.2s ease;
            background: #ffffff;
            box-sizing: border-box;
        }
        .settings-field input[type="text"]:hover,
        .settings-field select:hover {
            border-color: #d0d0d0;
        }
        .settings-field input[type="text"]:focus,
        .settings-field select:focus {
            border-color: #4CAF50;
            box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.1);
            outline: none;
        }
        .select-wrapper {
            position: relative;
            width: 100%;
            box-sizing: border-box;
        }
        .select-wrapper::after {
            content: '';
            position: absolute;
            right: 16px; // 调整箭头位置
            top: 50%;
            transform: translateY(-50%);
            width: 0;
            height: 0;
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            border-top: 5px solid #666;
            pointer-events: none;
            transition: all 0.2s ease;
        }
        .select-wrapper:hover::after {
            border-top-color: #333;
        }
        .custom-select {
            appearance: none;
            width: calc(100% - 24px) !important;
            padding-right: 36px !important; // 为下拉箭头留出更多空间
            cursor: pointer;
            box-sizing: border-box;
            background: #ffffff;
        }
        .match-list {
            background: #ffffff;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            padding: 16px;
            max-height: 180px;
            overflow-y: auto;
        }
        .match-item {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 12px;
            padding: 4px;
            background: transparent;
            border-radius: 6px;
            transition: all 0.2s ease;
        }
        .match-input {
            flex: 1;
            padding: 10px 12px;
            border: 1px solid #e0e0e0;
            border-radius: 6px;
            font-size: 14px;
            transition: all 0.3s ease;
            background: #ffffff;
        }
        .match-input:hover {
            border-color: #d0d0d0;
        }
        .match-input:focus {
            border-color: #4CAF50;
            box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.1);
            outline: none;
        }
        .delete-match-btn {
            width: 24px;
            height: 24px;
            padding: 0;
            border: none;
            background: transparent;
            color: #999;
            font-size: 18px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
            border-radius: 4px;
        }
        .delete-match-btn:hover {
            color: #ff4444;
            background: transparent;
            transform: scale(1.1);
        }
        .add-match-btn {
            margin-top: 12px;
            padding: 10px;
            height: 40px;
            background: #f8f9fa;
            color: #666;
            border: 1px dashed #ddd;
            border-radius: 6px;
            cursor: pointer;
            width: 100%;
            font-size: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            transition: all 0.2s ease;
        }
        .add-match-btn:hover {
            background: #f0f0f0;
            border-color: #999;
            color: #333;
            transform: translateY(-1px);
        }
        .add-match-btn svg {
            width: 14px;
            height: 14px;
            stroke: currentColor;
            transition: transform 0.2s ease;
        }
        .add-match-btn:hover svg {
            transform: scale(1.1);
        }
        .settings-buttons {
            margin-top: 24px;
            display: flex;
            justify-content: flex-end;
            gap: 12px;
        }
        .settings-btn {
            padding: 10px 20px;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s;
        }
        .settings-btn.primary {
            background: #4CAF50;
            color: white;
        }
        .settings-btn.secondary {
            background: #f5f5f5;
            color: #333;
        }
        .settings-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .toast-notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 12px 24px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            border-radius: 6px;
            font-size: 14px;
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
        }
        @keyframes slideIn {
            from {
                transform: translateY(100%);
                opacity: 0.2;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
        .timestamp-list-panel {
            background: rgba(24, 24, 27, 0.95);
            padding: 0;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
            width: 300px;
            max-height: 400px;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            opacity: 0.95;
            transition: all 0.3s ease;
            color: rgba(255, 255, 255, 0.9);
            border: 1px solid rgba(255, 255, 255, 0.1);
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 999999;
        }

        /* Dark Reader 支持 */
        @media (prefers-color-scheme: dark) {
            .timestamp-list-panel {
                background: rgba(24, 24, 27, 0.95);
                color: rgba(255, 255, 255, 0.9);
                border: 1px solid rgba(255, 255, 255, 0.1);
            }
        }

        [data-darkreader-scheme="dark"] .timestamp-list-panel {
            background: rgba(24, 24, 27, 0.95);
            color: rgba(255, 255, 255, 0.9);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .timestamp-list-panel:hover,
        .timestamp-list-header:hover ~ * {
            opacity: 1 !important;
            box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
        }

        .timestamp-list-header {
            cursor: grab;
            user-select: none;
            opacity: 1;
            transition: opacity 0.3s ease;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            padding: 12px 16px;
            margin-bottom: 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: rgba(36, 36, 42, 0.95);
        }

        .timestamp-list-header:hover {
            opacity: 1;
        }

        .timestamp-list-header:hover .timestamp-list-title {
            opacity: 1;
        }

        .timestamp-header-buttons {
            display: flex;
            gap: 8px;
            opacity: 1;
            transition: opacity 0.3s ease;
        }

        .timestamp-header-btn {
            opacity: 0.8;
            transition: all 0.2s ease;
            padding: 6px;
            background: rgba(255, 255, 255, 0.1);
            border: none;
            border-radius: 6px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .timestamp-header-btn:hover {
            opacity: 1;
            background: rgba(255, 255, 255, 0.2);
            transform: translateY(-1px);
        }

        .timestamp-list-header:hover .timestamp-header-buttons {
            opacity: 1;
        }

        .timestamp-item {
            padding: 12px 16px;
            margin: 0;
            cursor: pointer;
            transition: all 0.2s;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            color: rgba(255, 255, 255, 0.9);
            display: flex;
        }

        .timestamp-item:hover {
            background: rgba(255, 255, 255, 0.05);
        }

        .timestamp-item.active {
            background: rgba(76, 175, 80, 0.15);
            border-left: 3px solid rgba(76, 175, 80, 0.8);
        }

        .no-timestamps {
            color: rgba(255, 255, 255, 0.6);
            text-align: center;
            padding: 20px;
            font-style: italic;
        }

        #timestamp-list {
            overflow-y: auto;
            flex: 1;
            max-height: 320px;
            scrollbar-width: thin;
            scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
        }

        #timestamp-list::-webkit-scrollbar {
            width: 6px;
        }

        #timestamp-list::-webkit-scrollbar-track {
            background: transparent;
        }

        #timestamp-list::-webkit-scrollbar-thumb {
            background-color: rgba(255, 255, 255, 0.2);
            border-radius: 3px;
        }

        .timestamp-list-title {
            font-size: 14px;
            font-weight: 600;
            color: rgba(255, 255, 255, 0.9);
        }

        .timestamp-header-btn img {
            width: 16px;
            height: 16px;
            filter: invert(1);
        }
        .match-list-field {
            flex-direction: column !important;
            align-items: stretch !important;
        }

        .match-list {
            margin-top: 10px;
            max-height: 200px;
            overflow-y: auto;
            border: 1px solid #ddd;
            border-radius: 6px;
            padding: 8px;
        }

        .match-item {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
            gap: 8px;
        }

        .match-input {
            flex: 1;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
        }

        .delete-match-btn {
            padding: 4px 8px;
            background: #ff4444;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }

        .delete-match-btn:hover {
            background: #ff6666;
        }

        .add-match-btn {
            margin-top: 8px;
            padding: 8px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            width: 100%;
        }

        .add-match-btn:hover {
            background: #45a049;
        }

        .timestamp-item {
            display: flex;
            padding: 8px;
            margin: 4px 0;
            border-radius: 4px;
            transition: all 0.2s;
        }

        .timestamp-left {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .timestamp-text {
            font-weight: 500;
            cursor: pointer;
        }

        .timestamp-text:hover {
            color: #4CAF50;
        }

        .timestamp-note-container {
            display: flex;
            align-items: center;
        }

        .timestamp-note-input {
            width: 100%;
            min-height: 24px;
            padding: 6px 8px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 4px;
            background: rgba(0, 0, 0, 0.1);
            color: var(--b3-theme-on-background);
            font-size: 14px;
            line-height: 1.5;
            font-family: var(--b3-font-family);
            transition: all 0.2s ease;
            resize: vertical;
            overflow-y: hidden;
            box-sizing: border-box;
        }

        .timestamp-note-input:hover {
            border-color: rgba(255, 255, 255, 0.2);
            background: rgba(0, 0, 0, 0.15);
        }

        .timestamp-note-input:focus {
            border-color: var(--b3-theme-primary);
            background: rgba(0, 0, 0, 0.2);
            outline: none;
            box-shadow: 0 0 0 2px rgba(var(--b3-theme-primary-rgb), 0.1);
        }

        .timestamp-note-container {
            margin: 4px 0;
            width: 100%;
            position: relative;
        }

        .timestamp-note-input::placeholder {
            color: rgba(255, 255, 255, 0.3);
            font-style: italic;
        }

        .timestamp-note-input::-webkit-scrollbar {
            width: 4px;
        }

        .timestamp-note-input::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 2px;
        }

        .timestamp-note-input::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.2);
        }

        /* 拖拽相关样式 */
        .drag-handle {
            display: flex;
            align-items: center;
            justify-content: center;
            color: rgba(255, 255, 255, 0.7);
            cursor: grab;
        }

        .timestamp-list-panel.dragging {
            box-shadow: 0 8px 28px rgba(0, 0, 0, 0.4) !important;
            opacity: 0.95 !important;
        }

        .timestamp-list-header:hover .drag-handle {
            color: rgba(255, 255, 255, 0.9);
        }

        /* 类似GitHub Copilot的动画效果 */
        .timestamp-list-panel {
            animation: slide-up 0.3s ease-out;
        }

        @keyframes slide-up {
            from {
                transform: translateY(20px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 0.95;
            }
        }

        /* 添加一个隐藏/显示面板的按钮和小药丸样式 */
        .timestamp-toggle-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 40px;
            height: 40px;
            background: rgba(24, 24, 27, 0.95);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 999998;
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            transition: all 0.2s ease;
            opacity: 0;
        }

        .timestamp-pills-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            display: flex;
            align-items: center;
            z-index: 999998;
            gap: 10px;
            opacity: 0;
            transition: all 0.3s ease;
        }

        .timestamp-pills-container.visible {
            opacity: 1;
        }

        .timestamp-pill {
            background: rgba(24, 24, 27, 0.95);
            border-radius: 50px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            display: flex;
            align-items: center;
            padding: 6px 14px;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .timestamp-pill:hover {
            transform: translateY(-2px);
            background: rgba(36, 36, 42, 0.95);
        }

        .timestamp-pill img {
            width: 18px;
            height: 18px;
            filter: invert(1);
            margin-right: 8px;
        }

        .timestamp-pill-text {
            color: rgba(255, 255, 255, 0.9);
            font-size: 13px;
            font-weight: 500;
        }

        .timestamp-expand-btn {
            background: rgba(24, 24, 27, 0.95);
            border-radius: 50%;
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            transition: all 0.2s ease;
        }

        .timestamp-expand-btn:hover {
            transform: scale(1.1);
            background: rgba(36, 36, 42, 0.95);
        }

        .timestamp-expand-btn img {
            width: 16px;
            height: 16px;
            filter: invert(1);
        }

        /* 底部按钮栏 */
        .timestamp-footer {
            display: flex;
            padding: 12px 16px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            background: rgba(36, 36, 42, 0.95);
            justify-content: space-between;
        }

        .timestamp-footer-buttons {
            display: flex;
            gap: 8px;
        }

        .timestamp-footer-btn {
            opacity: 0.8;
            transition: all 0.2s ease;
            padding: 6px;
            background: rgba(255, 255, 255, 0.1);
            border: none;
            border-radius: 6px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .timestamp-footer-btn:hover {
            opacity: 1;
            background: rgba(255, 255, 255, 0.2);
            transform: translateY(-1px);
        }

        .timestamp-footer-btn img {
            width: 16px;
            height: 16px;
            filter: invert(1);
        }

        .timestamp-panel-toggle {
            display: flex;
            align-items: center;
            gap: 6px;
            color: rgba(255, 255, 255, 0.7);
            font-size: 12px;
            cursor: pointer;
            padding: 4px 8px;
            border-radius: 4px;
            transition: all 0.2s ease;
        }

        .timestamp-panel-toggle:hover {
            color: rgba(255, 255, 255, 0.9);
            background: rgba(255, 255, 255, 0.05);
        }

        .timestamp-list-panel.hidden + .timestamp-toggle-btn {
            opacity: 1;
        }

        /* 时间戳项样式 */
        .timestamp-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
            cursor: pointer;
        }

        .timestamp-time {
            font-size: 12px;
            color: rgba(255, 255, 255, 0.6);
            background: rgba(255, 255, 255, 0.1);
            padding: 2px 6px;
            border-radius: 4px;
            transition: all 0.2s ease;
        }

        .timestamp-item:hover .timestamp-time {
            background: rgba(255, 255, 255, 0.15);
            color: rgba(255, 255, 255, 0.8);
        }

        .timestamp-item.active .timestamp-time {
            background: rgba(76, 175, 80, 0.2);
            color: rgba(76, 175, 80, 0.9);
        }
    `);

    // 配置管理
    const configManager = {
        defaults: {
            API_ENDPOINT: 'http://127.0.0.1:6806',
            API_TOKEN: '',
            TARGET_DOC_ID: '',
            NOTEBOOK_ID: '',
            NOTEBOOK_NAME: '',
            CREATE_NOTE_HOTKEY: '',
            TIMESTAMP_HOTKEY: '',
            SCREENSHOT_HOTKEY: '',
            MATCH_LIST: [
                'https://www.youtube.com/watch?v=',
                'https://www.bilibili.com/video/',
                'https://pan.baidu.com/play/'  // 添加百度网盘匹配
            ]
        },

        // 获取配置
        get: function() {
            const config = {};
            for (const [key, defaultValue] of Object.entries(this.defaults)) {
                config[key] = GM_getValue(key, defaultValue);
            }
            return config;
        },

        // 保存配置
        save: function(newConfig) {
            for (const [key, value] of Object.entries(newConfig)) {
                GM_setValue(key, value);
            }
        }
    };

    // 添加缓存机制
    const cache = {
        notebooks: null,
        notebookExpiry: 0,
        CACHE_DURATION: 5 * 60 * 1000, // 5分钟缓存

        async getNotebooks() {
            const now = Date.now();
            if (this.notebooks && now < this.notebookExpiry) {
                return this.notebooks;
            }

            const notebooks = await getNotebooks();
            this.notebooks = notebooks;
            this.notebookExpiry = now + this.CACHE_DURATION;
            return notebooks;
        },

        clearCache() {
            this.notebooks = null;
            this.notebookExpiry = 0;
        }
    };

    // 添加重试机制的 API 调用包装器
    async function retryApiCall(apiCall, maxRetries = 3, delay = 1000) {
        let lastError;

        for (let i = 0; i < maxRetries; i++) {
            try {
                return await apiCall();
            } catch (error) {
                lastError = error;
                if (i < maxRetries - 1) {
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        }

        throw lastError;
    }

    // 使用示例
    async function getNotebooks() {
        return retryApiCall(async () => {
            const config = getConfig();
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: `${config.API_ENDPOINT}/api/notebook/lsNotebooks`,
                    headers: {
                        'Authorization': `Token ${config.API_TOKEN}`,
                        'Content-Type': 'application/json'
                    },
                    onload: function(response) {
                        if (response.status === 200) {
                            const result = JSON.parse(response.responseText);
                            if (result.code === 0) {
                                resolve(result.data.notebooks);
                            } else {
                                reject(new Error(result.msg));
                            }
                        } else {
                            reject(new Error('请求失败'));
                        }
                    },
                    onerror: reject
                });
            });
        });
    }

    // 创建设置面板
    function createSettingsPanel() {
        const panel = document.createElement('div');
        panel.className = 'settings-panel';
        const currentConfig = configManager.get();

        // 创建标题
        const title = document.createElement('h3');
        title.textContent = '思源笔记设置';
        panel.appendChild(title);

        // 基本设置部分
        const basicSection = document.createElement('div');
        basicSection.className = 'settings-section';

        const basicTitle = document.createElement('div');
        basicTitle.className = 'settings-section-title';
        basicTitle.textContent = '基本设置';
        basicSection.appendChild(basicTitle);

        // API 地址设置
        const apiField = document.createElement('div');
        apiField.className = 'settings-field';

        const apiLabel = document.createElement('label');
        apiLabel.textContent = 'API 地址';

        const apiInput = document.createElement('input');
        apiInput.type = 'text';
        apiInput.id = 'api-endpoint';
        apiInput.value = currentConfig.API_ENDPOINT;
        apiInput.placeholder = 'http://127.0.0.1:6806';

        // 添加API端点输入事件监听
        apiInput.addEventListener('change', async () => {
            // 获取当前的API端点和Token
            const apiEndpoint = apiInput.value.trim();
            const apiToken = panel.querySelector('#api-token').value.trim();

            if (apiEndpoint && apiToken) {
                // 临时保存配置以加载笔记本
                const tempConfig = {
                    ...currentConfig,
                    API_ENDPOINT: apiEndpoint,
                    API_TOKEN: apiToken
                };
                configManager.save(tempConfig);

                // 清空笔记本选择器并显示加载中状态
                const notebookSelect = panel.querySelector('#notebook-select');
                notebookSelect.innerHTML = '<option value="">加载中...</option>';

                try {
                    // 清除缓存并重新加载笔记本列表
                    cache.clearCache();
                    await loadNotebookList(panel);
                    showNotification('笔记本列表已更新');
                } catch (error) {
                    console.error('加载笔记本列表失败:', error);
                    notebookSelect.innerHTML = '<option value="">加载失败</option>';
                    showNotification('加载笔记本列表失败: ' + error.message);
                }
            }
        });

        apiField.appendChild(apiLabel);
        apiField.appendChild(apiInput);
        basicSection.appendChild(apiField);

        // API Token 设置
        const tokenField = document.createElement('div');
        tokenField.className = 'settings-field';

        const tokenLabel = document.createElement('label');
        tokenLabel.textContent = 'API Token';

        const tokenInput = document.createElement('input');
        tokenInput.type = 'text';
        tokenInput.id = 'api-token';
        tokenInput.value = currentConfig.API_TOKEN;
        tokenInput.placeholder = '输入你的 API Token';

        // 添加API Token输入事件监听
        tokenInput.addEventListener('change', async () => {
            // 获取当前的API端点和Token
            const apiEndpoint = panel.querySelector('#api-endpoint').value.trim();
            const apiToken = tokenInput.value.trim();

            if (apiEndpoint && apiToken) {
                // 临时保存配置以加载笔记本
                const tempConfig = {
                    ...currentConfig,
                    API_ENDPOINT: apiEndpoint,
                    API_TOKEN: apiToken
                };
                configManager.save(tempConfig);

                // 清空笔记本选择器并显示加载中状态
                const notebookSelect = panel.querySelector('#notebook-select');
                notebookSelect.innerHTML = '<option value="">加载中...</option>';

                try {
                    // 清除缓存并重新加载笔记本列表
                    cache.clearCache();
                    await loadNotebookList(panel);
                    showNotification('笔记本列表已更新');
                } catch (error) {
                    console.error('加载笔记本列表失败:', error);
                    notebookSelect.innerHTML = '<option value="">加载失败</option>';
                    showNotification('加载笔记本列表失败: ' + error.message);
                }
            }
        });

        tokenField.appendChild(tokenLabel);
        tokenField.appendChild(tokenInput);
        basicSection.appendChild(tokenField);

        // 笔记本选择
        const notebookField = document.createElement('div');
        notebookField.className = 'settings-field';

        const notebookLabel = document.createElement('label');
        notebookLabel.textContent = '选择笔记本';

        const selectWrapper = document.createElement('div');
        selectWrapper.className = 'select-wrapper';

        const notebookSelect = document.createElement('select');
        notebookSelect.id = 'notebook-select';
        notebookSelect.className = 'custom-select';

        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = '加载中...';
        notebookSelect.appendChild(defaultOption);

        selectWrapper.appendChild(notebookSelect);

        // 添加刷新笔记本按钮
        const refreshButton = document.createElement('button');
        refreshButton.className = 'refresh-notebooks-btn';
        refreshButton.textContent = '刷新笔记本';
        refreshButton.onclick = async () => {
            const apiEndpoint = panel.querySelector('#api-endpoint').value.trim();
            const apiToken = panel.querySelector('#api-token').value.trim();

            if (!apiEndpoint || !apiToken) {
                showNotification('请先填写API地址和Token');
                return;
            }

            // 清空笔记本选择器并显示加载中状态
            notebookSelect.innerHTML = '<option value="">加载中...</option>';

            // 临时保存配置以加载笔记本
            const tempConfig = {
                ...currentConfig,
                API_ENDPOINT: apiEndpoint,
                API_TOKEN: apiToken
            };
            configManager.save(tempConfig);

            try {
                // 清除缓存并重新加载笔记本列表
                cache.clearCache();
                await loadNotebookList(panel);
                showNotification('笔记本列表已更新');
            } catch (error) {
                console.error('加载笔记本列表失败:', error);
                notebookSelect.innerHTML = '<option value="">加载失败</option>';
                showNotification('加载笔记本列表失败: ' + error.message);
            }
        };

        selectWrapper.appendChild(refreshButton);
        notebookField.appendChild(notebookLabel);
        notebookField.appendChild(selectWrapper);
        basicSection.appendChild(notebookField);

        panel.appendChild(basicSection);

        // 快捷键设置部分
        const hotkeySection = document.createElement('div');
        hotkeySection.className = 'settings-section';

        const hotkeyTitle = document.createElement('div');
        hotkeyTitle.className = 'settings-section-title';
        hotkeyTitle.textContent = '快捷键设置';
        hotkeySection.appendChild(hotkeyTitle);

        // 创建笔记快捷键
        const createNoteField = document.createElement('div');
        createNoteField.className = 'settings-field';

        const createNoteLabel = document.createElement('label');
        createNoteLabel.textContent = '创建笔记快捷键';

        const createNoteInput = document.createElement('input');
        createNoteInput.type = 'text';
        createNoteInput.id = 'create-note-hotkey';
        createNoteInput.value = currentConfig.CREATE_NOTE_HOTKEY;
        createNoteInput.placeholder = '点击设置快捷键';
        createNoteInput.readOnly = true;

        createNoteField.appendChild(createNoteLabel);
        createNoteField.appendChild(createNoteInput);
        hotkeySection.appendChild(createNoteField);

        // 时间戳快捷键
        const timestampField = document.createElement('div');
        timestampField.className = 'settings-field';

        const timestampLabel = document.createElement('label');
        timestampLabel.textContent = '时间戳快捷键';

        const timestampInput = document.createElement('input');
        timestampInput.type = 'text';
        timestampInput.id = 'timestamp-hotkey';
        timestampInput.value = currentConfig.TIMESTAMP_HOTKEY;
        timestampInput.placeholder = '点击设置快捷键';
        timestampInput.readOnly = true;

        timestampField.appendChild(timestampLabel);
        timestampField.appendChild(timestampInput);
        hotkeySection.appendChild(timestampField);

        // 截图+时间戳快捷键
        const screenshotField = document.createElement('div');
        screenshotField.className = 'settings-field';

        const screenshotLabel = document.createElement('label');
        screenshotLabel.textContent = '截图+时间戳快捷键';

        const screenshotInput = document.createElement('input');
        screenshotInput.type = 'text';
        screenshotInput.id = 'screenshot-hotkey';
        screenshotInput.value = currentConfig.SCREENSHOT_HOTKEY;
        screenshotInput.placeholder = '点击设置快捷键';
        screenshotInput.readOnly = true;

        screenshotField.appendChild(screenshotLabel);
        screenshotField.appendChild(screenshotInput);
        hotkeySection.appendChild(screenshotField);

        panel.appendChild(hotkeySection);

        // 网站匹配规则部分
        const matchSection = document.createElement('div');
        matchSection.className = 'settings-section';

        const matchTitle = document.createElement('div');
        matchTitle.className = 'settings-section-title';
        matchTitle.textContent = '网站匹配规则';
        matchSection.appendChild(matchTitle);

        const matchList = document.createElement('div');
        matchList.id = 'match-list';
        matchList.className = 'match-list';

        // 添加现有的匹配规则
        currentConfig.MATCH_LIST.forEach(match => {
            const matchItem = createMatchItem(match);
            matchList.appendChild(matchItem);
        });

        matchSection.appendChild(matchList);

        // 添加规则按钮
        const addMatchBtn = document.createElement('button');
        addMatchBtn.className = 'add-match-btn';

        const addBtnSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        addBtnSvg.setAttribute('width', '16');
        addBtnSvg.setAttribute('height', '16');
        addBtnSvg.setAttribute('viewBox', '0 0 16 16');
        addBtnSvg.setAttribute('fill', 'none');

        const addBtnPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        addBtnPath.setAttribute('d', 'M8 3v10M3 8h10');
        addBtnPath.setAttribute('stroke', 'currentColor');
        addBtnPath.setAttribute('stroke-width', '2');
        addBtnPath.setAttribute('stroke-linecap', 'round');

        addBtnSvg.appendChild(addBtnPath);
        addMatchBtn.appendChild(addBtnSvg);

        const addBtnText = document.createTextNode('添加匹配规则');
        addMatchBtn.appendChild(addBtnText);

        matchSection.appendChild(addMatchBtn);
        panel.appendChild(matchSection);

        // 按钮组
        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'settings-buttons';

        const cancelBtn = document.createElement('button');
        cancelBtn.id = 'cancel-settings';
        cancelBtn.className = 'settings-btn secondary';
        cancelBtn.textContent = '取消';
        buttonsContainer.appendChild(cancelBtn);

        const saveBtn = document.createElement('button');
        saveBtn.id = 'save-settings';
        saveBtn.className = 'settings-btn primary';
        saveBtn.textContent = '保存';
        buttonsContainer.appendChild(saveBtn);

        panel.appendChild(buttonsContainer);

        document.body.appendChild(panel);

        // 加载笔记本列表
        loadNotebookList(panel);

        // 设置事件监听
        setupEventListeners(panel);

        // 初始化时尝试加载笔记本列表
        if (currentConfig.API_ENDPOINT && currentConfig.API_TOKEN) {
            try {
                // 延迟一点加载，确保面板已完全创建
                setTimeout(async () => {
                    await loadNotebookList(panel);
                }, 100);
            } catch (error) {
                console.error('初始加载笔记本列表失败:', error);
            }
        }

        return panel;
    }

    // 修改 loadNotebookList 使用缓存
    async function loadNotebookList(panel) {
        const select = panel.querySelector('#notebook-select');
        const currentConfig = configManager.get();

        try {
            const notebooks = await cache.getNotebooks();

            // 清空现有选项
            while (select.firstChild) {
                select.removeChild(select.firstChild);
            }

            // 添加新的选项
            notebooks.forEach(notebook => {
                const option = document.createElement('option');
                option.value = notebook.id;
                option.textContent = notebook.name;
                if (notebook.id === currentConfig.NOTEBOOK_ID) {
                    option.selected = true;
                }
                select.appendChild(option);
            });
        } catch (error) {
            // 创建错误提示选项
            const errorOption = document.createElement('option');
            errorOption.value = '';
            errorOption.textContent = `加载失败: ${error.message}`;

            // 清空现有选项
            while (select.firstChild) {
                select.removeChild(select.firstChild);
            }

            select.appendChild(errorOption);
        }
    }

    // 添加创建匹配项的辅助函数
    function createMatchItem(value) {
        const item = document.createElement('div');
        item.className = 'match-item';

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'match-input';
        input.value = value;
        input.placeholder = '输入匹配规则，例如: https://www.youtube.com/watch?v=';

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-match-btn';
        deleteBtn.title = '移除规则';

        // 创建 × 符号
        const deleteText = document.createTextNode('×');
        deleteBtn.appendChild(deleteText);

        // 添加删除按钮的点击事件
        deleteBtn.onclick = () => {
            item.style.opacity = '0';
            setTimeout(() => item.remove(), 200);
        };

        item.appendChild(input);
        item.appendChild(deleteBtn);

        return item;
    }

    // 显示设置面板
    async function showSettings() {
        const panel = createSettingsPanel();
        panel.style.display = 'block';

        // 加载笔记本列表
        try {
            const notebooks = await getNotebooks();
            const notebookList = panel.querySelector('#notebook-list');
            const currentConfig = configManager.get();

            // 清空现有列表
            notebookList.innerHTML = '';

            // 添加笔记本选项
            notebooks.forEach(notebook => {
                const item = document.createElement('div');
                item.className = 'notebook-item';
                if (notebook.id === currentConfig.NOTEBOOK_ID) {
                    item.classList.add('selected');
                }
                item.dataset.id = notebook.id;
                item.dataset.name = notebook.name;
                item.textContent = notebook.name;
                notebookList.appendChild(item);
            });

            // 绑定点击事件
            notebookList.addEventListener('click', (e) => {
                const item = e.target.closest('.notebook-item');
                if (item) {
                    notebookList.querySelectorAll('.notebook-item').forEach(i => {
                        i.classList.remove('selected');
                    });
                    item.classList.add('selected');
                }
            });
        } catch (error) {
            panel.querySelector('#notebook-list').innerHTML = `
                <div class="notebook-item" style="color: red">
                    加载失败: ${error.message}
                </div>
            `;
        }
    }

    // 配置项
    function getConfig() {
        return configManager.get();
    }

    // 添加发送到思源的函数
    async function sendToSiYuan(content) {
        const config = getConfig();
        const data = {
            dataType: "markdown",
            data: content,
            parentID: config.TARGET_DOC_ID
        };

        try {
            const result = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: `${config.API_ENDPOINT}/api/block/appendBlock`,
                    headers: {
                        'Authorization': `Token ${config.API_TOKEN}`,
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify(data),
                    onload: function(response) {
                        if (response.status === 200) {
                            const result = JSON.parse(response.responseText);
                            if (result.code === 0) {
                                resolve(result);
                            } else {
                                reject(new Error(result.msg));
                            }
                        } else {
                            reject(new Error('请求失败'));
                        }
                    },
                    onerror: reject
                });
            });

            // 获取新创建的块ID
            const newBlockId = result.data[0].doOperations[0].id;

            // 设置自定义属性
            await setBlockAttrs({
                id: newBlockId,
                attrs: {
                    "custom-media": "timestamp"
                }
            });

            return result;
        } catch (error) {
            throw error;
        }
    }

    // 查找匹配的视频笔记
    async function findMatchingVideoNote(mediaUrl) {
        const config = getConfig();
        const sql = `SELECT block_id FROM attributes WHERE name = 'custom-type' AND value = 'MediaNote'
                     AND block_id IN (
                         SELECT block_id FROM attributes WHERE name = 'custom-mediaurl' AND value = '${mediaUrl}'
                     )`;

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: `${config.API_ENDPOINT}/api/query/sql`,
                headers: {
                    'Authorization': `Token ${config.API_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({ stmt: sql }),
                onload: function(response) {
                    if (response.status === 200) {
                        const result = JSON.parse(response.responseText);
                        if (result.code === 0 && result.data.length > 0) {
                            resolve(result.data[0].block_id);
                        } else {
                            resolve(null);
                        }
                    } else {
                        reject(new Error('查询失败'));
                    }
                },
                onerror: reject
            });
        });
    }

    // 优化视频元素获取，支持不同网站的适配，包括全屏状态
    function getVideoElement() {
        // 检查当前网站
        const currentUrl = window.location.href;
        let videoElement = null;

        // 针对Bilibili的适配
        if (currentUrl.includes('bilibili.com')) {
            // 常规模式
            videoElement = document.querySelector('.bilibili-player-video video') ||
                          document.querySelector('.bpx-player-video-wrap video');

            // 全屏模式 - 多种检测方式
            if (!videoElement) {
                // 检查标准全屏
                if (document.fullscreenElement) {
                    videoElement = document.fullscreenElement.querySelector('video');
                }

                // 检查B站特有的全屏容器
                if (!videoElement) {
                    const bpxFullscreen = document.querySelector('.bpx-player-container[data-screen="full"]');
                    if (bpxFullscreen) {
                        videoElement = bpxFullscreen.querySelector('video');
                    }
                }

                // 检查网页全屏模式
                if (!videoElement) {
                    const webFullscreen = document.querySelector('.bilibili-player-video-web-fullscreen') ||
                                         document.querySelector('.bpx-player-container[data-screen="web"]');
                    if (webFullscreen) {
                        videoElement = webFullscreen.querySelector('video');
                    }
                }
            }
        }
        // 针对YouTube的适配
        else if (currentUrl.includes('youtube.com')) {
            // 常规模式
            videoElement = document.querySelector('.html5-main-video');

            // 全屏模式
            if (!videoElement && document.fullscreenElement) {
                videoElement = document.fullscreenElement.querySelector('video');
            }

            // 备用查找方法
            if (!videoElement) {
                const ytApp = document.querySelector('ytd-app');
                if (ytApp && ytApp.hasAttribute('is-fullscreen')) {
                    videoElement = document.querySelector('video');
                }
            }
        }
        // 针对百度网盘的适配
        else if (currentUrl.includes('pan.baidu.com')) {
            // 常规模式
            videoElement = document.querySelector('.vjs-tech') ||
                          document.querySelector('.video-player video');

            // 全屏模式
            if (!videoElement && document.fullscreenElement) {
                videoElement = document.fullscreenElement.querySelector('video');
            }

            // 百度网盘的内部全屏
            if (!videoElement) {
                const bdFullscreen = document.querySelector('.vp-fulled');
                if (bdFullscreen) {
                    videoElement = bdFullscreen.querySelector('video');
                }
            }
        }

        // 通用回退方案
        if (!videoElement) {
            videoElement = document.querySelector('video');
        }

        return videoElement;
    }

    // 修改获取时间戳功能
    async function getVideoTimestamp() {
        const video = getVideoElement();
        if (!video) {
            showNotification('未找到视频元素！');
            return;
        }

        const cleanedUrl = cleanUrl(window.location.href);
        const matchingNoteId = await findMatchingVideoNote(cleanedUrl);

        if (!matchingNoteId) {
            showNotification('请先创建视频笔记！');
            return;
        }

        // 更新配置中的目标文档ID
        const config = getConfig();
        configManager.save({
            ...config,
            TARGET_DOC_ID: matchingNoteId
        });

        const currentTime = video.currentTime;
        const timestamp = formatTime(currentTime);
        const timeUrl = generateTimeUrl(currentTime);
        const markdownLink = `[${timestamp}](${timeUrl})`;

        try {
            // 获取现有时间戳
            const existingTimestamps = await getExistingTimestamps(matchingNoteId);
            const existingTimestamp = existingTimestamps.find(ts => Math.abs(ts.time - currentTime) < 1);

            if (existingTimestamp) {
                showNotification('该时间戳已存在');
                return;
            }

            // 发送到思源
            const result = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: `${config.API_ENDPOINT}/api/block/appendBlock`,
                    headers: {
                        'Authorization': `Token ${config.API_TOKEN}`,
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify({
                        dataType: "markdown",
                        data: markdownLink,
                        parentID: matchingNoteId
                    }),
                    onload: function(response) {
                        if (response.status === 200) {
                            const result = JSON.parse(response.responseText);
                            if (result.code === 0) {
                                resolve(result);
                            } else {
                                reject(new Error(result.msg));
                            }
                        } else {
                            reject(new Error('请求失败'));
                        }
                    },
                    onerror: reject
                });
            });

            // 获取新创建的块ID
            const newBlockId = result.data[0].doOperations[0].id;

            // 设置自定义属性
            await setBlockAttrs({
                id: newBlockId,
                attrs: {
                    "custom-media": "timestamp"
                }
            });

            showNotification('已添加时间戳');
            await updateTimestampList();
        } catch (error) {
            showNotification('发送失败：' + error.message);
        }
    }

    // 添加文件上传函数
    async function uploadFile(blob, fileName) {
        const config = getConfig(); // 动态获取最新配置
        const formData = new FormData();
        formData.append('assetsDirPath', '/assets/');
        formData.append('file[]', blob, fileName);

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: `${config.API_ENDPOINT}/api/asset/upload`,
                headers: {
                    'Authorization': `Token ${config.API_TOKEN}`
                },
                data: formData,
                onload: function(response) {
                    if (response.status === 200) {
                        const result = JSON.parse(response.responseText);
                        if (result.code === 0) {
                            resolve(result.data.succMap[fileName]);
                        } else {
                            reject(new Error(result.msg));
                        }
                    } else {
                        reject(new Error('Upload failed'));
                    }
                },
                onerror: function(error) {
                    reject(error);
                }
            });
        });
    }

    // 添加一个检查截图块是否存在的辅助函数
    async function findScreenshotBlock(timestampBlockId) {
        const config = getConfig();
        const sql = `SELECT id FROM blocks
                     WHERE parent_id = '${timestampBlockId}'
                     AND id IN (
                         SELECT block_id FROM attributes
                         WHERE name = 'custom-media'
                         AND value = 'tsscreenshot'
                     )`;

        try {
            const result = await query(sql);
            return result.length > 0 ? result[0].id : null;
        } catch (error) {
            console.error('查询截图块失败:', error);
            return null;
        }
    }

    // 修改 isInSuperBlock 函数
    async function isInSuperBlock(blockId) {
        const config = getConfig();
        try {
            // 使用更简单的查询语句
            const sql = `
                WITH RECURSIVE parents AS (
                    SELECT id, parent_id, type
                    FROM blocks
                    WHERE id = '${blockId}'

                    UNION ALL

                    SELECT b.id, b.parent_id, b.type
                    FROM blocks b
                    JOIN parents p ON b.id = p.parent_id
                )
                SELECT p.id
                FROM parents p
                JOIN attributes a ON p.id = a.block_id
                WHERE p.type = 's'
                AND a.name = 'custom-media'
                AND a.value = 'mediacard'
                LIMIT 1
            `;

            const result = await query(sql);
            return result.length > 0;
        } catch (error) {
            console.error('检查超级块失败:', error);
            return false;
        }
    }

    // 添加一个获取父超级块ID的函数，修复SQL语法错误
    async function getParentSuperBlockId(blockId) {
        const config = getConfig();
        try {
            // 修复SQL语法，避免ON关键字错误
            const sql = `
                SELECT parent.id
                FROM blocks child, blocks parent, attributes attrs
                WHERE child.id = '${blockId}'
                AND child.parent_id = parent.id
                AND parent.id = attrs.block_id
                AND attrs.name = 'custom-media'
                AND attrs.value = 'mediacard'
                LIMIT 1
            `;

            const result = await query(sql);
            return result.length > 0 ? result[0].id : null;
        } catch (error) {
            console.error('获取父超级块ID失败:', error);
            return null;
        }
    }

    // 修改 getParentMediaCard 函数以解决循环引用问题
    async function getParentMediaCard(blockId) {
        const config = getConfig();
        try {
            const sql = `
                WITH RECURSIVE parents(id, parent_id, level, path) AS (
                    -- 基础查询：获取起始块
                    SELECT
                        b.id,
                        b.parent_id,
                        0 as level,
                        b.id as path
                    FROM blocks b
                    WHERE b.id = '${blockId}'

                    UNION ALL

                    -- 递归查询：获取父块
                    SELECT
                        b.id,
                        b.parent_id,
                        p.level + 1,
                        p.path || ',' || b.id
                    FROM blocks b
                    JOIN parents p ON b.id = p.parent_id
                    WHERE p.level < 10  -- 限制递归深度
                    AND p.path NOT LIKE '%' || b.id || '%'  -- 防止循环
                )
                SELECT DISTINCT p.id
                FROM parents p
                JOIN attributes a ON p.id = a.block_id
                WHERE a.name = 'custom-media'
                AND a.value = 'mediacard'
                ORDER BY p.level ASC
                LIMIT 1
            `;

            const result = await query(sql);
            return result.length > 0 ? result[0].id : null;
        } catch (error) {
            console.error('检查父块mediacard属性失败:', error);
            return null;
        }
    }

    // 修改 createMemoBlock 函数
    async function createMemoBlock(timestampBlockId, content) {
        const config = getConfig();

        try {
            // 1. 获取或创建超级块
            const superBlockId = await createOrGetSuperBlock(timestampBlockId);

            // 2. 创建备注块
            const memoResult = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: `${config.API_ENDPOINT}/api/block/appendBlock`,
                    headers: {
                        'Authorization': `Token ${config.API_TOKEN}`,
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify({
                        dataType: "markdown",
                        data: content,
                        parentID: superBlockId
                    }),
                    onload: async function(response) {
                        if (response.status === 200) {
                            const result = JSON.parse(response.responseText);
                            if (result.code === 0 && result.data && result.data.length > 0 &&
                                result.data[0].doOperations && result.data[0].doOperations.length > 0) {
                                const newBlockId = result.data[0].doOperations[0].id;
                                try {
                                    await setBlockAttrs({
                                        id: newBlockId,
                                        attrs: {
                                            "custom-media": "memos"
                                        }
                                    });
                                    resolve(newBlockId);
                                } catch (error) {
                                    reject(error);
                                }
                            } else {
                                console.error('API返回结果异常:', result);
                                reject(new Error(result.msg || '返回数据结构异常'));
                            }
                        } else {
                            reject(new Error('创建备注块失败'));
                        }
                    },
                    onerror: reject
                });
            });

            // 3. 清理临时块
            await removeTemporaryBlocks();

            return memoResult;
        } catch (error) {
            console.error('创建备注块失败:', error);
            throw error;
        }
    }

    // 修改 getVideoScreenshot 函数
    async function getVideoScreenshot() {
        const video = getVideoElement();
        if (!video) {
            showNotification('未找到视频元素！');
            return;
        }

        const cleanedUrl = cleanUrl(window.location.href);
        const matchingNoteId = await findMatchingVideoNote(cleanedUrl);

        if (!matchingNoteId) {
            showNotification('请先创建视频笔记！');
            return;
        }

        // 更新配置中的目标文档ID
        const config = getConfig();
        configManager.save({
            ...config,
            TARGET_DOC_ID: matchingNoteId
        });

        const currentTime = video.currentTime;
        const timestamp = formatTime(currentTime);
        const timeUrl = generateTimeUrl(currentTime);
        const markdownLink = `[${timestamp}](${timeUrl})`;

        try {
            // 获取现有时间戳
            const existingTimestamps = await getExistingTimestamps(matchingNoteId);
            const existingTimestamp = existingTimestamps.find(ts => Math.abs(ts.time - currentTime) < 1);

            // 创建截图相关数据
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const blob = await new Promise(resolve => {
                canvas.toBlob(resolve, 'image/png');
            });
            const fileName = `screenshot-${Date.now()}.png`;
            const filePath = await uploadFile(blob, fileName);

            if (existingTimestamp) {
                try {
                    // 查找时间戳块对应的截图块
                    const timestampBlockId = await findTimestampBlockId(timeUrl, matchingNoteId);
                    if (!timestampBlockId) {
                        showNotification('时间戳块查找失败');
                        return;
                    }

                    // 检查时间戳块是否已在超级块内
                    const isInSuper = await isInSuperBlock(timestampBlockId);
                    let superBlockId;

                    if (isInSuper) {
                        // 如果已在超级块内,获取超级块ID
                        superBlockId = await getParentSuperBlockId(timestampBlockId);
                    } else {
                        // 如果不在超级块内,创建新的超级块
                        superBlockId = await new Promise((resolve, reject) => {
                            GM_xmlhttpRequest({
                                method: 'POST',
                                url: `${config.API_ENDPOINT}/api/block/insertBlock`,
                                headers: {
                                    'Authorization': `Token ${config.API_TOKEN}`,
                                    'Content-Type': 'application/json'
                                },
                                data: JSON.stringify({
                                    dataType: "markdown",
                                    data: `{{{row
                                        内容\n{: custom-media="temp" }\n
                                        }}}\n{: custom-media="mediacard" }\n`,
                                    previousID: timestampBlockId
                                }),
                                onload: function(response) {
                                    if (response.status === 200) {
                                        const result = JSON.parse(response.responseText);
                                        if (result.code === 0) {
                                            resolve(result.data[0].doOperations[0].id);
                                        } else {
                                            reject(new Error(result.msg));
                                        }
                                    } else {
                                        reject(new Error('创建超级块失败'));
                                    }
                                },
                                onerror: reject
                            });
                        });

                        // 移动时间戳块到超级块内
                        await new Promise((resolve, reject) => {
                            GM_xmlhttpRequest({
                                method: 'POST',
                                url: `${config.API_ENDPOINT}/api/block/moveBlock`,
                                headers: {
                                    'Authorization': `Token ${config.API_TOKEN}`,
                                    'Content-Type': 'application/json'
                                },
                                data: JSON.stringify({
                                    id: timestampBlockId,
                                    parentID: superBlockId
                                }),
                                onload: function(response) {
                                    if (response.status === 200) {
                                        const result = JSON.parse(response.responseText);
                                        if (result.code === 0) {
                                            resolve();
                                        } else {
                                            reject(new Error(result.msg));
                                        }
                                    } else {
                                        reject(new Error('移动时间戳块失败'));
                                    }
                                },
                                onerror: reject
                            });
                        });
                    }

                    // 添加截图块到超级块
                    const screenshotResult = await new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({
                            method: 'POST',
                            url: `${config.API_ENDPOINT}/api/block/appendBlock`,
                            headers: {
                                'Authorization': `Token ${config.API_TOKEN}`,
                                'Content-Type': 'application/json'
                            },
                            data: JSON.stringify({
                                dataType: "markdown",
                                data: `![${timestamp}](${filePath})`,
                                parentID: superBlockId
                            }),
                            onload: function(response) {
                                if (response.status === 200) {
                                    const result = JSON.parse(response.responseText);
                                    if (result.code === 0) {
                                        resolve(result.data[0].doOperations[0].id);
                                    } else {
                                        reject(new Error(result.msg));
                                    }
                                } else {
                                    reject(new Error('添加截图块失败'));
                                }
                            },
                            onerror: reject
                        });
                    });

                    // 为截图块设置属性
                    await setBlockAttrs({
                        id: screenshotResult,
                        attrs: {
                            "custom-media": "tsscreenshot"
                        }
                    });

                    // 设置超级块属性
                    await setBlockAttrs({
                        id: superBlockId,
                        attrs: {
                            "layout": "row"
                        }
                    });

                    showNotification('已为现有时间戳添加截图');
                } catch (error) {
                    console.error('处理已有时间戳失败:', error);
                    showNotification('处理已有时间戳失败: ' + error.message);
                    return;
                }
            } else {
                // 创建新的超级块
                const superBlockResult = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: `${config.API_ENDPOINT}/api/block/appendBlock`,
                        headers: {
                            'Authorization': `Token ${config.API_TOKEN}`,
                            'Content-Type': 'application/json'
                        },
                        data: JSON.stringify({
                            dataType: "markdown",
                            data: `{{{row
                                内容\n{: custom-media="temp" }\n
                                }}}\n{: custom-media="mediacard" }\n`,
                            parentID: matchingNoteId
                        }),
                        onload: function(response) {
                            if (response.status === 200) {
                                const result = JSON.parse(response.responseText);
                                if (result.code === 0) {
                                    resolve(result.data[0].doOperations[0].id);
                                } else {
                                    reject(new Error(result.msg));
                                }
                            } else {
                                reject(new Error('创建超级块失败'));
                            }
                        },
                        onerror: reject
                    });
                });

                // 添加时间戳块
                const timestampResult = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: `${config.API_ENDPOINT}/api/block/appendBlock`,
                        headers: {
                            'Authorization': `Token ${config.API_TOKEN}`,
                            'Content-Type': 'application/json'
                        },
                        data: JSON.stringify({
                            dataType: "markdown",
                            data: markdownLink,
                            parentID: superBlockResult
                        }),
                        onload: async function(response) {
                            if (response.status === 200) {
                                const result = JSON.parse(response.responseText);
                                if (result.code === 0) {
                                    const newBlockId = result.data[0].doOperations[0].id;
                                    try {
                                        // 为时间戳块设置属性
                                        await setBlockAttrs({
                                            id: newBlockId,
                                            attrs: {
                                                "custom-media": "timestamp"
                                            }
                                        });
                                        resolve(newBlockId);
                                    } catch (error) {
                                        reject(error);
                                    }
                                } else {
                                    reject(new Error(result.msg));
                                }
                            } else {
                                reject(new Error('添加时间戳块失败'));
                            }
                        },
                        onerror: reject
                    });
                });

                // 添加截图块
                const screenshotResult = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: `${config.API_ENDPOINT}/api/block/appendBlock`,
                        headers: {
                            'Authorization': `Token ${config.API_TOKEN}`,
                            'Content-Type': 'application/json'
                        },
                        data: JSON.stringify({
                            dataType: "markdown",
                            data: `![${timestamp}](${filePath})`,
                            parentID: superBlockResult
                        }),
                        onload: function(response) {
                            if (response.status === 200) {
                                const result = JSON.parse(response.responseText);
                                if (result.code === 0) {
                                    resolve(result.data[0].doOperations[0].id);
                                } else {
                                    reject(new Error(result.msg));
                                }
                            } else {
                                reject(new Error('添加截图块失败'));
                            }
                        },
                        onerror: reject
                    });
                });

                // 为截图块设置属性
                await setBlockAttrs({
                    id: screenshotResult,
                    attrs: {
                        "custom-media": "tsscreenshot"
                    }
                });

                // 设置超级块属性
                await setBlockAttrs({
                    id: superBlockResult,
                    attrs: {
                        "layout": "row"
                    }
                });

                showNotification('已添加时间戳和截图');
            }

            // 清理临时块
            await removeTemporaryBlocks();

            await updateTimestampList();
        } catch (error) {
            showNotification('发送失败：' + error.message);
            console.error(error);
        }
    }

    // 生成带时间戳的URL
    function generateTimeUrl(seconds) {
        const currentUrl = window.location.href;
        const timeParam = Math.floor(seconds);

        if (currentUrl.includes('youtube.com')) {
            const urlObj = new URL(currentUrl);
            const videoId = urlObj.searchParams.get('v');
            return `https://youtu.be/${videoId}?t=${timeParam}`;
        } else if (currentUrl.includes('bilibili.com')) {
            const urlObj = new URL(currentUrl);
            const bvidMatch = urlObj.pathname.match(/\/video\/(BV[a-zA-Z0-9]+)/);
            if (bvidMatch) {
                const bvid = bvidMatch[1];
                return `https://www.bilibili.com/video/${bvid}?t=${timeParam}`;
            }
        } else if (currentUrl.includes('pan.baidu.com')) {
            // 保留所有必要的查询参数,只修改时间戳
            const urlObj = new URL(currentUrl);
            const path = urlObj.searchParams.get('path');
            let baseUrl = `https://pan.baidu.com/pfile/video?path=${encodeURIComponent(path)}`;
            // 添加其他可能需要的查询参数
            if (urlObj.searchParams.get('theme')) {
                baseUrl += `&theme=${urlObj.searchParams.get('theme')}`;
            }
            return `${baseUrl}#t=${timeParam}`;
        }
        // 默认格式
        const baseUrl = currentUrl.split('#')[0];
        return `${baseUrl}#t=${timeParam}`;
    }

    // 格式化时间
    function formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        const ms = Math.floor((seconds % 1) * 1000);

        return `${padZero(hours)}:${padZero(minutes)}:${padZero(secs)}.${padZero(ms, 3)}`;
    }

    // 补零函数
    function padZero(num, length = 2) {
        return String(num).padStart(length, '0');
    }

    // 复制到剪贴板
    function copyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }

    // 添加通知函数
    function showNotification(message, duration = 3000) {
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideIn 0.3s ease-out reverse';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    // 清理URL参数
    function cleanUrl(url) {
        const urlObj = new URL(url);
        if (urlObj.hostname.includes('bilibili.com')) {
            const bvidMatch = urlObj.pathname.match(/\/video\/(BV[a-zA-Z0-9]+)/);
            if (bvidMatch) {
                return `https://www.bilibili.com/video/${bvidMatch[1]}`;
            }
        } else if (urlObj.hostname.includes('youtube.com')) {
            const videoId = urlObj.searchParams.get('v');
            if (videoId) {
                return `https://www.youtube.com/watch?v=${videoId}`;
            }
        } else if (urlObj.hostname.includes('pan.baidu.com')) {
            // 保留百度网盘视频的必要参数
            const path = urlObj.searchParams.get('path');
            if (path) {
                return `https://pan.baidu.com/pfile/video?path=${encodeURIComponent(path)}`;
            }
        }
        return url.split('#')[0];  // 移除hash部分但保留其他查询参数
    }

    // 添加为现有块添加属性的函数
    async function addAttributesToExistingBlocks(docId) {
        const config = getConfig();
        try {
            // 获取文档下的所有块
            const sql = `SELECT * FROM blocks WHERE root_id = '${docId}' AND type = 'p' ORDER BY created`;
            const blocks = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: `${config.API_ENDPOINT}/api/query/sql`,
                    headers: {
                        'Authorization': `Token ${config.API_TOKEN}`,
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify({ stmt: sql }),
                    onload: function(response) {
                        if (response.status === 200) {
                            const result = JSON.parse(response.responseText);
                            if (result.code === 0) {
                                resolve(result.data);
                            } else {
                                reject(new Error(result.msg));
                            }
                        } else {
                            reject(new Error('查询失败'));
                        }
                    },
                    onerror: reject
                });
            });

            // 遍历所有块
            for (let i = 0; i < blocks.length; i++) {
                const block = blocks[i];
                const content = block.content;

                // 检查是否是时间戳块
                if (content.match(/\[\d{2}:\d{2}:\d{2}\.\d{3}\]/)) {
                    await setBlockAttrs({
                        id: block.id,
                        attrs: {
                            "custom-media": "timestamp"
                        }
                    });

                    // 检查下一个块是否是对应的截图
                    if (i + 1 < blocks.length && blocks[i + 1].content.startsWith('![')) {
                        await setBlockAttrs({
                            id: blocks[i + 1].id,
                            attrs: {
                                "custom-media": "tsScreenShot"
                            }
                        });
                    }
                }
            }
        } catch (error) {
            console.error('添加属性失败:', error);
            throw error;
        }
    }

    // 修改 createVideoNote 函数中获取标题的部分
    async function createVideoNote() {
        try {
            const config = getConfig();
            const cleanedUrl = cleanUrl(window.location.href);

            // 检查当前网址是否在匹配列表中
            const isUrlMatched = config.MATCH_LIST.some(pattern => cleanedUrl.includes(pattern));
            if (!isUrlMatched) {
                showNotification('当前网址不在匹配列表中');
                return;
            }

            // 检查是否已存在对应笔记
            const matchingNoteId = await findMatchingVideoNote(cleanedUrl);
            if (matchingNoteId) {
                try {
                    await addAttributesToExistingBlocks(matchingNoteId);
                    showNotification('已为现有时间戳添加属性');
                } catch (error) {
                    handleError(error, '添加属性');
                }
                return;
            }

            // 针对百度网盘特殊处理获取标题
            let title;
            if (cleanedUrl.includes('pan.baidu.com')) {
                // 尝试从工具栏标题获取
                const titleElement = document.querySelector('.vp-toolsbar__title');
                if (titleElement) {
                    title = titleElement.getAttribute('title') || titleElement.textContent;
                }
                // 如果还是获取不到,尝试从URL中获取
                if (!title) {
                    const urlParams = new URLSearchParams(window.location.search);
                    const path = urlParams.get('path');
                    if (path) {
                        title = decodeURIComponent(path.split('/').pop());
                    }
                }
            } else {
                title = document.title;
            }

            // 如果还是没有标题,使用默认标题
            if (!title) {
                title = '未命名视频笔记';
            }

            // 创建一个安全的文件路径（只保留基本字符）
            const safePath = title.replace(/[^\w\s\u4e00-\u9fa5]/g, '_');

            // 创建笔记内容（保留原始标题）
            const content = `# ${title}\n\n> 视频链接：[${title}](${cleanedUrl})`;

            // 使用 retryApiCall 包装 API 调用
            const response = await retryApiCall(async () => {
                // 创建文档
                const docData = {
                    notebook: config.NOTEBOOK_ID,
                    path: `/视频笔记/${safePath}`,
                    markdown: content
                };

                return new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: `${config.API_ENDPOINT}/api/filetree/createDocWithMd`,
                        headers: {
                            'Authorization': `Token ${config.API_TOKEN}`,
                            'Content-Type': 'application/json'
                        },
                        data: JSON.stringify(docData),
                        onload: function(response) {
                            if (response.status === 200) {
                                const result = JSON.parse(response.responseText);
                                if (result.code === 0) {
                                    resolve(result.data);
                                } else {
                                    reject(new Error(result.msg));
                                }
                            } else {
                                reject(new Error('请求失败'));
                            }
                        },
                        onerror: reject
                    });
                });
            });

            // 设置文档属性
            await retryApiCall(async () => {
                const attrs = {
                    id: response,
                    attrs: {
                        "custom-type": "MediaNote",
                        "custom-mediaurl": cleanedUrl
                    }
                };

                return new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: `${config.API_ENDPOINT}/api/attr/setBlockAttrs`,
                        headers: {
                            'Authorization': `Token ${config.API_TOKEN}`,
                            'Content-Type': 'application/json'
                        },
                        data: JSON.stringify(attrs),
                        onload: function(response) {
                            if (response.status === 200) {
                                const result = JSON.parse(response.responseText);
                                if (result.code === 0) {
                                    resolve();
                                } else {
                                    reject(new Error(result.msg));
                                }
                            } else {
                                reject(new Error('请求失败'));
                            }
                        },
                        onerror: reject
                    });
                });
            });

            // 更新配置中的目标文档ID
            configManager.save({
                ...config,
                TARGET_DOC_ID: response
            });

            showNotification('视频笔记创建成功');

            // 更新时间戳列表
            await debouncedUpdateTimestampList();

            // 更新创建按钮状态
            await updateCreateNoteButtonState();

        } catch (error) {
            handleError(error, '创建视频笔记');
        }
    }

    // 修改更新按钮状态的函数
    async function updateCreateNoteButtonState() {
        const createNoteBtn = document.querySelector('.timestamp-header-btn[title="创建视频笔记"]');
        if (!createNoteBtn) return;

        if (!getVideoElement()) {
            createNoteBtn.disabled = true;
            createNoteBtn.style.opacity = '0.5';
            createNoteBtn.title = '未找到视频';
            return;
        }

        try {
            const cleanedUrl = cleanUrl(window.location.href);
            const matchingNoteId = await findMatchingVideoNote(cleanedUrl);

            if (matchingNoteId) {
                createNoteBtn.disabled = true;
                createNoteBtn.style.opacity = '0.5';
                createNoteBtn.title = '已存在对应笔记';
            } else {
                createNoteBtn.disabled = false;
                createNoteBtn.style.opacity = '1';
                createNoteBtn.title = '创建视频笔记';
            }
        } catch (error) {
            console.error('检查现有笔记失败:', error);
            createNoteBtn.disabled = true;
            createNoteBtn.style.opacity = '0.5';
            createNoteBtn.title = '检查失败';
        }
    }

    // 初始检查按钮状态
    setTimeout(updateCreateNoteButtonState, 1000);

    // 定期检查更新按钮状态（每30秒）
    setInterval(updateCreateNoteButtonState, 30000);

    // 当URL变化时更新按钮状态
    let lastUrl = window.location.href;
    new MutationObserver(() => {
        if (lastUrl !== window.location.href) {
            lastUrl = window.location.href;
            setTimeout(updateCreateNoteButtonState, 1000);
        }
    }).observe(document, {subtree: true, childList: true});

    // 修改 getExistingTimestamps 函数,添加获取备注内容的功能
    async function getExistingTimestamps(docId) {
        const config = getConfig();

        try {
            // 获取文档块的 kramdown 源码
            const kramdownData = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: `${config.API_ENDPOINT}/api/block/getBlockKramdown`,
                    headers: {
                        'Authorization': `Token ${config.API_TOKEN}`,
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify({ id: docId }),
                    onload: function(response) {
                        if (response.status === 200) {
                            const result = JSON.parse(response.responseText);
                            if (result.code === 0) {
                                resolve(result.data);
                            } else {
                                reject(new Error(result.msg));
                            }
                        } else {
                            reject(new Error('请求失败'));
                        }
                    },
                    onerror: reject
                });
            });

            // 使用 parseTimestampLinks 解析时间戳
            const timestamps = parseTimestampLinks(kramdownData.kramdown);

            // 为每个时间戳获取对应的备注内容
            for (const ts of timestamps) {
                try {
                    // 获取时间戳块ID
                    const timestampBlockId = await findTimestampBlockId(ts.url, docId);
                    if (timestampBlockId) {
                        // 获取备注块内容，添加空值检查
                        const memoBlocks = await findAllMemoBlocks(timestampBlockId);
                        if (memoBlocks && memoBlocks.length > 0) {
                            // 获取所有备注块的内容
                            const memoContents = await Promise.all(memoBlocks.map(async (blockId) => {
                                try {
                                    const blockData = await getBlockKramdown(blockId);
                                    if (blockData && blockData.kramdown) {
                                        return blockData.kramdown.replace(/\{:[^\}]+\}/g, '').trim();
                                    }
                                    return '';
                                } catch (error) {
                                    console.error('获取备注块内容失败:', error);
                                    return '';
                                }
                            }));
                            // 过滤掉空字符串并合并
                            ts.note = memoContents.filter(content => content).join('\n');
                        } else {
                            ts.note = ''; // 如果没有备注块，设置为空字符串
                        }
                    }
                } catch (error) {
                    console.error('获取备注失败:', error);
                    ts.note = ''; // 发生错误时设置为空字符串
                }
            }

            // 按时间排序
            return timestamps.sort((a, b) => a.time - b.time);

        } catch (error) {
            console.error('获取时间戳失败:', error);
            throw error;
        }
    }

    // 添加获取块内容的辅助函数
    async function getBlockKramdown(blockId) {
        const config = getConfig();
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: `${config.API_ENDPOINT}/api/block/getBlockKramdown`,
                headers: {
                    'Authorization': `Token ${config.API_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({ id: blockId }),
                onload: function(response) {
                    if (response.status === 200) {
                        const result = JSON.parse(response.responseText);
                        if (result.code === 0) {
                            resolve(result.data);
                        } else {
                            reject(new Error(result.msg));
                        }
                    } else {
                        reject(new Error('获取块内容失败'));
                    }
                },
                onerror: reject
            });
        });
    }

    // 修改 findAllMemoBlocks 函数，添加空值检查
    async function findAllMemoBlocks(timestampBlockId) {
        const sql = `WITH RECURSIVE parents AS (
            SELECT id, parent_id, type
            FROM blocks
            WHERE id = '${timestampBlockId}'

            UNION ALL

            SELECT b.id, b.parent_id, b.type
            FROM blocks b
            JOIN parents p ON b.id = p.parent_id
            WHERE b.type = 's'
        )
        SELECT b.id
        FROM blocks b
        JOIN attributes a ON b.id = a.block_id
        WHERE b.parent_id IN (SELECT id FROM parents)
        AND a.name = 'custom-media'
        AND a.value = 'memos'
        ORDER BY b.created`;

        try {
            const result = await query(sql);
            // 添加空值检查
            if (!result) {
                return [];
            }
            return result.map(row => row.id || '').filter(id => id !== '');
        } catch (error) {
            console.error('查询备注块失败:', error);
            return [];
        }
    }

    // 从test.js中提取的辅助函数
    function parseTimestampLinks(kramdown) {
        const timestamps = [];
        // 按块分割内容
        const blocks = kramdown.split(/\n\s*\n/);

        blocks.forEach(block => {
            // 清理块属性标记
            const cleanBlock = block.replace(/\{:[^\}]+\}/g, '').trim();
            if (!cleanBlock) return;

            // 使用更严格的正则表达式匹配链接
            const regex = /(?<!\\)\[([^\]]+?)\]\(([^)]+?)\)/g;
            let match;

            while ((match = regex.exec(cleanBlock)) !== null) {
                const [fullMatch, text, href] = match;

                // 验证链接格式
                if (!isValidTimestampLink(href)) continue;

                try {
                    const timeValue = extractTime(href);
                    if (timeValue === null) continue;

                    // 清理和格式化文本
                    const cleanText = cleanTimestampText(text);

                    timestamps.push({
                        text: cleanText,
                        url: normalizeUrl(href),
                        time: timeValue,
                        originalText: text,
                        note: '' // 初始化为空字符串，后续会从备注块中获取
                    });
                } catch (e) {
                    console.warn('解析时间戳失败:', e, {text, href});
                }
            }
        });

        return timestamps;
    }

    // 修改 parseTimestampLinks 函数中的 isValidTimestampLink 函数
    function isValidTimestampLink(href) {
        // 检查是否是视频网站链接
        const validDomains = [
            'youtube.com', 'youtu.be',
            'bilibili.com', 'b23.tv',
            'pan.baidu.com'  // 添加百度网盘域名
        ];

        try {
            const url = new URL(href);
            const isDomainValid = validDomains.some(domain => url.hostname.includes(domain));
            // 修改时间戳检查逻辑，支持百度网盘的 #t= 格式
            const hasTimestamp = href.includes('?t=') || href.includes('&t=') || href.includes('#t=');

            return isDomainValid && hasTimestamp;
        } catch (e) {
            return false;
        }
    }

    // 修改 extractTime 函数
    function extractTime(url) {
        try {
            const urlObj = new URL(url);

            // 尝试从不同位置获取时间参数
            let timeStr = null;

            // 检查查询参数
            timeStr = urlObj.searchParams.get('t');

            // 检查哈希参数
            if (!timeStr && urlObj.hash) {
                const hashMatch = urlObj.hash.match(/[?&]t=(\d+)/);
                if (hashMatch) {
                    timeStr = hashMatch[1];
                } else {
                    // 处理 #t=xxx 格式
                    const simpleHashMatch = urlObj.hash.match(/#t=(\d+)/);
                    if (simpleHashMatch) {
                        timeStr = simpleHashMatch[1];
                    }
                }
            }

            // 处理时间格式
            if (timeStr) {
                // 处理 HH:MM:SS 格式
                if (timeStr.includes(':')) {
                    const parts = timeStr.split(':').map(Number);
                    let seconds = 0;
                    if (parts.length === 3) { // HH:MM:SS
                        seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
                    } else if (parts.length === 2) { // MM:SS
                        seconds = parts[0] * 60 + parts[1];
                    }
                    return seconds;
                }

                // 处理纯数字格式
                return parseInt(timeStr, 10);
            }

            return null;
        } catch (e) {
            console.warn('解析时间戳失败:', e, url);
            return null;
        }
    }

    // 修改 normalizeUrl 函数
    function normalizeUrl(url) {
        try {
            const urlObj = new URL(url);

            // 处理YouTube链接
            if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
                const videoId = urlObj.searchParams.get('v') || urlObj.pathname.split('/').pop();
                const timestamp = extractTime(url);
                return `https://youtu.be/${videoId}?t=${timestamp}`;
            }

            // 处理Bilibili链接
            if (urlObj.hostname.includes('bilibili.com')) {
                const bvid = url.match(/BV[\w]+/)?.[0];
                const timestamp = extractTime(url);
                if (bvid) {
                    return `https://www.bilibili.com/video/${bvid}?t=${timestamp}`;
                }
            }

            // 百度网盘处理
            if (urlObj.hostname.includes('pan.baidu.com')) {
                const timestamp = extractTime(url);
                const path = urlObj.searchParams.get('path');
                let baseUrl = `https://pan.baidu.com/pfile/video?path=${encodeURIComponent(path)}`;
                // 添加其他可能需要的查询参数
                if (urlObj.searchParams.get('theme')) {
                    baseUrl += `&theme=${urlObj.searchParams.get('theme')}`;
                }
                return `${baseUrl}#t=${timestamp}`;
            }

            return url;
        } catch (e) {
            return url;
        }
    }

    function cleanTimestampText(text) {
        // 移除多余空格和特殊字符
        return text.trim()
                  .replace(/\s+/g, ' ')
                  .replace(/[\u200B-\u200D\uFEFF]/g, ''); // 移除零宽字符
    }

    // 修改更新时间戳列表的函数
    async function updateTimestampList() {
        // 如果正在编辑，跳过更新
        if (document.querySelector('.timestamp-note-input:focus')) {
            return;
        }

        const video = getVideoElement();
        if (!video) return;

        const cleanedUrl = cleanUrl(window.location.href);
        const matchingNoteId = await findMatchingVideoNote(cleanedUrl);
        const list = document.getElementById('timestamp-list');

        if (!list) return;

        if (!matchingNoteId) {
            const noTimestamps = document.createElement('div');
            noTimestamps.className = 'no-timestamps';
            noTimestamps.textContent = '请先创建视频笔记';
            list.replaceChildren(noTimestamps);
            return;
        }

        try {
            const timestamps = await getExistingTimestamps(matchingNoteId);

            if (timestamps.length === 0) {
                const noTimestamps = document.createElement('div');
                noTimestamps.className = 'no-timestamps';
                noTimestamps.textContent = '暂无时间戳记录';
                list.replaceChildren(noTimestamps);
                return;
            }

            // 清空现有列表
            list.replaceChildren();

            // 添加新的时间戳项
            timestamps.forEach(ts => {
                const item = document.createElement('div');
                item.className = 'timestamp-item';
                item.dataset.time = ts.time;

                // 创建左侧容器用于时间戳和备注
                const leftContainer = document.createElement('div');
                leftContainer.className = 'timestamp-left';

                // 创建时间戳文本元素
                const timestampText = document.createElement('div');
                timestampText.className = 'timestamp-text';
                timestampText.textContent = ts.text;

                // 创建时间链接
                const timeLink = document.createElement('div');
                timeLink.className = 'timestamp-time';
                timeLink.textContent = formatTime(ts.time);

                // 创建时间戳标题行，包含时间戳文本和时间
                const timestampHeader = document.createElement('div');
                timestampHeader.className = 'timestamp-header';
                timestampHeader.appendChild(timestampText);
                timestampHeader.appendChild(timeLink);

                leftContainer.appendChild(timestampHeader);

                // 创建备注容器
                const noteContainer = document.createElement('div');
                noteContainer.className = 'timestamp-note-container';

                // 创建备注文本/输入框
                const noteInput = document.createElement('textarea');
                noteInput.className = 'timestamp-note-input';
                noteInput.value = ts.note || '';
                noteInput.placeholder = '添加备注... (Enter 换行, Shift+Enter 发送)';
                noteInput.rows = 1;

                // 添加自动调整高度的函数
                function adjustHeight(element) {
                    element.style.height = 'auto';
                    element.style.height = (element.scrollHeight) + 'px';
                }

                // 监听输入事件来自动调整高度
                noteInput.addEventListener('input', () => {
                    adjustHeight(noteInput);
                });

                // 在初始化和值改变时调整高度
                noteInput.addEventListener('focus', () => {
                    adjustHeight(noteInput);
                });

                // 添加一个小延时来确保初始高度正确设置
                setTimeout(() => {
                    adjustHeight(noteInput);
                }, 0);

                // 修改按键事件处理，交换Enter和Shift+Enter的功能
                noteInput.addEventListener('keydown', async (e) => {
                    if (e.key === 'Enter') {
                        if (e.shiftKey) {
                            // Shift+Enter: 保存并失去焦点
                            e.preventDefault();
                            noteInput.blur();
                        } else {
                            // 普通Enter: 添加换行
                            return; // 允许默认的换行行为
                        }
                    }
                });

                // 修改失去焦点事件处理
                noteInput.addEventListener('blur', async () => {
                    // 分割并过滤空行，确保每行都是有效的备注内容
                    const newNotes = noteInput.value
                        .split('\n')
                        .map(note => note.trim())
                        .filter(note => note !== '');

                    try {
                        // 获取时间戳块的ID
                        const timestampBlockId = await findTimestampBlockId(ts.url, matchingNoteId);
                        if (!timestampBlockId) {
                            throw new Error('未找到对应的时间戳块');
                        }

                        // 更新备注块，直接传入数组
                        await updateMemoBlocks(timestampBlockId, newNotes);

                        showNotification('备注已更新');
                        ts.note = newNotes.join('\n');
                    } catch (error) {
                        showNotification('更新备注失败：' + error.message);
                        noteInput.value = ts.note || '';
                    }
                });

                noteContainer.appendChild(noteInput);
                leftContainer.appendChild(noteContainer);

                item.appendChild(leftContainer);

                // 添加点击事件跳转视频
                timestampHeader.addEventListener('click', () => {
                    if (video) {
                        video.currentTime = ts.time;
                        list.querySelectorAll('.timestamp-item').forEach(i => i.classList.remove('active'));
                        item.classList.add('active');
                    }
                });

                list.appendChild(item);
            });

        } catch (error) {
            console.error('获取时间戳失败:', error);
            showNotification('获取时间戳失败: ' + error.message);
        }
    }

    // 在创建工具栏之后添加时间戳列表面板
    const timestampPanel = createTimestampListPanel(); // 保存对面板的引用

    // 初始化
    setTimeout(async () => {
        await updateTimestampList();
        addVideoTimeUpdateHandler();
    }, 1000);

    // 使用防抖优化频繁操作
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // 优化更新时间戳列表
    const debouncedUpdateTimestampList = debounce(updateTimestampList, 1000);

    // 优化视频时间更新处理
    function addVideoTimeUpdateHandler() {
        const video = getVideoElement();
        if (!video) return;

        // 增加进度节流，降低更新频率
        let lastUpdateTime = 0;
        const throttleInterval = 500; // 毫秒
        let lastHighlightedItem = null;

        const throttledTimeUpdate = (e) => {
            const now = Date.now();
            if (now - lastUpdateTime < throttleInterval) return;

            lastUpdateTime = now;
            const currentTime = Math.floor(video.currentTime);
            const items = document.querySelectorAll('.timestamp-item');

            // 清除之前的高亮
            if (lastHighlightedItem) {
                lastHighlightedItem.classList.remove('active');
            }

            // 寻找匹配的时间戳并高亮
            let highlightedItem = null;
            items.forEach(item => {
                const itemTime = parseInt(item.dataset.time);
                if (Math.abs(itemTime - currentTime) <= 1) {
                    item.classList.add('active');
                    highlightedItem = item;
                } else {
                    item.classList.remove('active');
                }
            });

            // 滚动到高亮的时间戳
            if (highlightedItem && highlightedItem !== lastHighlightedItem) {
                // 获取时间戳列表容器
                const container = document.getElementById('timestamp-list');
                if (container) {
                    // 计算滚动位置，使高亮项居中
                    const itemTop = highlightedItem.offsetTop;
                    const itemHeight = highlightedItem.offsetHeight;
                    const containerHeight = container.offsetHeight;
                    const scrollPosition = itemTop - (containerHeight / 2) + (itemHeight / 2);

                    // 使用平滑滚动
                    container.scrollTo({
                        top: Math.max(0, scrollPosition),
                        behavior: 'smooth'
                    });
                }

                // 更新lastHighlightedItem引用
                lastHighlightedItem = highlightedItem;
            }
        };

        video.addEventListener('timeupdate', throttledTimeUpdate);

        // 保存引用以便清理
        video._timestampUpdateHandler = throttledTimeUpdate;

        // 添加一次性事件监听器，当视频移除时清理事件
        const videoCleanup = () => {
            if (video._timestampUpdateHandler) {
                video.removeEventListener('timeupdate', video._timestampUpdateHandler);
                delete video._timestampUpdateHandler;
            }
        };

        video.addEventListener('emptied', videoCleanup);
    }

    // 减少轮询间隔时间，以减轻性能开销
    if (window._timestampUpdateInterval) {
        clearInterval(window._timestampUpdateInterval);
    }

    // 使用加倍的轮询间隔，减少刷新频率
    window._timestampUpdateInterval = setInterval(() => {
        // 仅在时间戳面板可见时才更新
        const panel = document.querySelector('.timestamp-list-panel');
        if (panel && panel.style.display !== 'none') {
            const list = document.getElementById('timestamp-list');
            if (list) {
                // 应用淡入淡出动画，使刷新看起来更加平滑
                list.animate([
                    { opacity: 1, filter: 'blur(0px)' },
                    { opacity: 0.95, filter: 'blur(0.5px)' },
                    { opacity: 1, filter: 'blur(0px)' }
                ], {
                    duration: 300,
                    easing: 'ease'
                });
            }

            // 一段时间后调用更新函数
            setTimeout(() => {
                updateTimestampList();
            }, 150);
        }
    }, 20000); // 增加到20秒更新一次

    // 在发送新时间戳后立即更新列表
    const originalSendToSiYuan = sendToSiYuan;
    sendToSiYuan = async function(content) {
        await originalSendToSiYuan(content);
        await updateTimestampList();
    };

    // 初始化
    setTimeout(async () => {
        await updateTimestampList();
        addVideoTimeUpdateHandler();
    }, 1000);

    // 添加时间戳列表拖动功能
    function makeDraggable(panel) {
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

        // 为面板添加硬件加速以提高拖拽性能
        panel.style.willChange = 'transform';
        panel.style.transform = 'translate(0px, 0px)';
        panel.style.transformStyle = 'preserve-3d';
        panel.style.backfaceVisibility = 'hidden';

        // 添加拖动手柄指示器到标题
        const header = panel.querySelector('.timestamp-list-header');
        const dragHandle = document.createElement('div');
        dragHandle.className = 'drag-handle';

        // 使用DOM API创建SVG而不是innerHTML
        const dragSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        dragSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        dragSvg.setAttribute("width", "14");
        dragSvg.setAttribute("height", "14");
        dragSvg.setAttribute("viewBox", "0 0 24 24");
        dragSvg.setAttribute("fill", "none");
        dragSvg.setAttribute("stroke", "currentColor");
        dragSvg.setAttribute("stroke-width", "2");
        dragSvg.setAttribute("stroke-linecap", "round");
        dragSvg.setAttribute("stroke-linejoin", "round");

        // 创建圆点
        const circles = [
            {cx: "9", cy: "12", r: "1"},
            {cx: "15", cy: "12", r: "1"},
            {cx: "9", cy: "6", r: "1"},
            {cx: "15", cy: "6", r: "1"},
            {cx: "9", cy: "18", r: "1"},
            {cx: "15", cy: "18", r: "1"}
        ];

        circles.forEach(attrs => {
            const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            circle.setAttribute("cx", attrs.cx);
            circle.setAttribute("cy", attrs.cy);
            circle.setAttribute("r", attrs.r);
            dragSvg.appendChild(circle);
        });

        dragHandle.appendChild(dragSvg);
        dragHandle.style.marginRight = '8px';
        dragHandle.style.opacity = '0.5';
        dragHandle.style.transition = 'opacity 0.2s ease';

        // 当鼠标悬停在头部时显示拖动手柄
        header.addEventListener('mouseenter', () => {
            dragHandle.style.opacity = '0.8';
        });

        header.addEventListener('mouseleave', () => {
            if (!isDragging) {
                dragHandle.style.opacity = '0.5';
            }
        });

        header.insertBefore(dragHandle, header.firstChild);

        // 移除面板的transition属性以消除拖拽延迟
        header.addEventListener('mousedown', () => {
            // 在拖拽开始前暂时移除transform的transition
            panel.style.transition = 'box-shadow 0.5s ease-in-out, opacity 0.3s ease-in-out';
        });

        header.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);

        function dragStart(e) {
            if (e.target.classList.contains('timestamp-item') ||
                e.target.classList.contains('timestamp-header-btn') ||
                e.target.tagName.toLowerCase() === 'img') {
                return; // 如果点击的是时间戳项或按钮或图片，不启动拖动
            }

            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;

            isDragging = true;
            dragHandle.style.opacity = '1';

            // 修改光标样式
            header.style.cursor = 'grabbing';

            // 添加激活样式
            panel.classList.add('dragging');
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();

                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;

                xOffset = currentX;
                yOffset = currentY;

                setTranslate(currentX, currentY, panel);
            }
        }

        function dragEnd() {
            initialX = currentX;
            initialY = currentY;

            isDragging = false;

            // 恢复光标样式
            const header = panel.querySelector('.timestamp-list-header');
            if (header) {
                header.style.cursor = 'grab';
            }

            // 移除激活样式
            panel.classList.remove('dragging');

            // 恢复拖动手柄的状态
            if (dragHandle) {
                dragHandle.style.opacity = '0.5';
            }

            // 恢复transition属性
            setTimeout(() => {
                panel.style.transition = 'box-shadow 0.5s ease-in-out, opacity 0.3s ease-in-out, transform 0.3s ease';
            }, 100);
        }

        function setTranslate(xPos, yPos, el) {
            // 使用matrix3d变换以获得更好的硬件加速
            el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
        }
    }

    // 创建时间戳列表面板
    function createTimestampListPanel() {
        const panel = document.createElement('div');
        panel.className = 'timestamp-list-panel';

        // 更新初始高亮效果和不透明度的transition，确保拖拽流畅
        panel.style.transition = 'box-shadow 0.5s ease-in-out, opacity 0.3s ease-in-out, transform 0.3s ease';
        panel.style.boxShadow = '0 0 20px rgba(46, 204, 113, 0.6)';
        panel.style.opacity = '0.95';

        // 添加硬件加速相关属性
        panel.style.willChange = 'transform';
        panel.style.transform = 'translate3d(0px, 0px, 0)';
        panel.style.transformStyle = 'preserve-3d';
        panel.style.backfaceVisibility = 'hidden';

        // 添加鼠标悬停效果
        panel.addEventListener('mouseenter', () => {
            panel.style.opacity = '1';
        });
        panel.addEventListener('mouseleave', () => {
            panel.style.opacity = '0.85';
        });

        // 固定位置到右下角
        document.body.appendChild(panel);

        // 检查页面是否有视频元素来决定是否显示面板
        const video = getVideoElement();
        panel.style.display = video ? 'flex' : 'none';

        // 在视频首次播放时移除高亮效果
        if (video) {
            const removeHighlight = () => {
                panel.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.25)';
                setTimeout(() => {
                    panel.style.opacity = '0.85';
                }, 500);
                video.removeEventListener('play', removeHighlight);
            };
            video.addEventListener('play', removeHighlight);
        }

        // 创建面板头部
        const header = document.createElement('div');
        header.className = 'timestamp-list-header';

        const title = document.createElement('div');
        title.className = 'timestamp-list-title';
        title.textContent = '视频时间戳';

        header.appendChild(title);

        // 创建时间戳列表容器
        const list = document.createElement('div');
        list.id = 'timestamp-list';

        // 创建底部按钮区域
        const footer = document.createElement('div');
        footer.className = 'timestamp-footer';

        const footerButtons = document.createElement('div');
        footerButtons.className = 'timestamp-footer-buttons';

        // 创建切换到药丸模式的按钮
        const toggleBtn = document.createElement('div');
        toggleBtn.className = 'timestamp-panel-toggle';

        // 使用DOM API创建SVG元素，而不是innerHTML
        const toggleSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        toggleSvg.setAttribute("width", "14");
        toggleSvg.setAttribute("height", "14");
        toggleSvg.setAttribute("viewBox", "0 0 24 24");
        toggleSvg.setAttribute("fill", "none");
        toggleSvg.setAttribute("stroke", "currentColor");
        toggleSvg.setAttribute("stroke-width", "2");
        toggleSvg.setAttribute("stroke-linecap", "round");
        toggleSvg.setAttribute("stroke-linejoin", "round");

        const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path1.setAttribute("d", "M18 6L6 18");
        const path2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path2.setAttribute("d", "M6 6l12 12");

        toggleSvg.appendChild(path1);
        toggleSvg.appendChild(path2);

        const span = document.createElement('span');
        span.textContent = '最小化';

        toggleBtn.appendChild(toggleSvg);
        toggleBtn.appendChild(span);

        // 创建药丸容器
        const pillsContainer = document.createElement('div');
        pillsContainer.className = 'timestamp-pills-container';

        // 创建时间戳药丸
        const timestampPill = document.createElement('div');
        timestampPill.className = 'timestamp-pill';
        timestampPill.title = '获取时间戳';

        const tsImg = document.createElement('img');
        tsImg.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWdvYWwiPjxwYXRoIGQ9Ik0xMiAxM1YybDggNC04IDQiLz48cGF0aCBkPSJNMjAuNTYxIDEwLjIyMmE5IDkgMCAxIDEtMTIuNTUtNS4yOSIvPjxwYXRoIGQ9Ik04LjAwMiA5Ljk5N2E1IDUgMCAxIDAgOC45IDIuMDIiLz48L3N2Zz4=";
        tsImg.alt = "时间戳";

        const tsSpan = document.createElement('span');
        tsSpan.className = 'timestamp-pill-text';
        tsSpan.textContent = '获取时间戳';

        timestampPill.appendChild(tsImg);
        timestampPill.appendChild(tsSpan);
        timestampPill.addEventListener('click', getVideoTimestamp);

        // 创建截图药丸
        const screenshotPill = document.createElement('div');
        screenshotPill.className = 'timestamp-pill';
        screenshotPill.title = '获取时间戳+截图';

        const ssImg = document.createElement('img');
        ssImg.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNhbWVyYSI+PHBhdGggZD0iTTE0LjUgNGgtNUw3IDdINGEyIDIgMCAwIDAtMiAydjlhMiAyIDAgMCAwIDIgMmgxNmEyIDIgMCAwIDAgMi0yVjlhMiAyIDAgMCAwLTItMmgtM2wtMi41LTN6Ii8+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMyIgcj0iMyIvPjwvc3ZnPg==";
        ssImg.alt = "截图";

        const ssSpan = document.createElement('span');
        ssSpan.className = 'timestamp-pill-text';
        ssSpan.textContent = '时间戳+截图';

        screenshotPill.appendChild(ssImg);
        screenshotPill.appendChild(ssSpan);
        screenshotPill.addEventListener('click', getVideoScreenshot);

        // 创建展开按钮
        const expandBtn = document.createElement('div');
        expandBtn.className = 'timestamp-expand-btn';
        expandBtn.title = '展开面板';

        const expandImg = document.createElement('img');
        expandImg.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWV4cGFuZCI+PHBhdGggZD0ibTE1IDMgNiA2Ii8+PHBhdGggZD0iTTIxIDMtNiA2Ii8+PHBhdGggZD0iTTMgOGw2IDYiLz48cGF0aCBkPSJNMyAyMGwxMi0xMiIvPjwvc3ZnPg==";
        expandImg.alt = "展开";

        expandBtn.appendChild(expandImg);

        // 添加药丸到容器
        pillsContainer.appendChild(timestampPill);
        pillsContainer.appendChild(screenshotPill);
        pillsContainer.appendChild(expandBtn);
        document.body.appendChild(pillsContainer);

        // 添加最小化/展开功能
        toggleBtn.addEventListener('click', () => {
            panel.classList.add('hidden');

            // 隐藏面板元素
            panel.style.display = 'none';

            // 添加移除面板的延迟处理，确保动画完成后DOM才被移除
            setTimeout(() => {
                // 将面板从DOM中移除而不是仅仅隐藏
                if (panel.parentNode) {
                    panel.parentNode.removeChild(panel);
                }

                // 显示药丸容器
                pillsContainer.classList.add('visible');
            }, 300);
        });

        expandBtn.addEventListener('click', () => {
            // 如果面板已被移除，则重新添加到DOM
            if (!document.body.contains(panel)) {
                document.body.appendChild(panel);

                // 重新初始化拖拽
                makeDraggable(panel);

                // 让面板的CSS属性先为隐藏状态，然后用setTimeout触发显示动画
                panel.style.opacity = '0';
                panel.style.transform = 'translate3d(0px, 0px, 0)';
                setTimeout(() => {
                    panel.classList.remove('hidden');
                    panel.style.display = 'flex';
                    panel.style.opacity = '0.95';
                }, 50);
            } else {
                // 如果面板仍在DOM中，只是显示它
                panel.classList.remove('hidden');
                panel.style.display = 'flex';
            }

            // 隐藏药丸容器
            pillsContainer.classList.remove('visible');
        });

        // 创建功能按钮
        const buttonConfigs = [
            {
                icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXNldHRpbmdzIj48cGF0aCBkPSJNMTIuMjIgMmgtLjQ0YTIgMiAwIDAgMC0yIDJ2LjE4YTIgMiAwIDAgMS0xIDEuNzNsLS40My4yNWEyIDIgMCAwIDEtMiAwbC0uMTUtLjA4YTIgMiAwIDAgMC0yLjczLjczbC0uMjIuMzhhMiAyIDAgMCAwIC43MyAyLjczbC4xNS4xYTIgMiAwIDAgMSAxIDEuNzJ2LjUxYTIgMiAwIDAgMS0xIDEuNzRsLS4xNS4wOWEyIDIgMCAwIDAtLjczIDIuNzNsLjIyLjM4YTIgMiAwIDAgMCAyLjczLjczbC4xNS0uMDhhMiAyIDAgMCAxIDIgMGwuNDMuMjVhMiAyIDAgMCAxIDEgMS43M1YyMGEyIDIgMCAwIDAgMiAyaC40NGEyIDIgMCAwIDAgMi0ydi0uMThhMiAyIDAgMCAxIDEtMS43M2wuNDMtLjI1YTIgMiAwIDAgMSAyIDBsLjE1LjA4YTIgMiAwIDAgMCAyLjczLS43M2wuMjItLjM5YTIgMiAwIDAgMC0uNzMtMi43M2wtLjE1LS4wOGEyIDIgMCAwIDEtMS0xLjc0di0uNWEyIDIgMCAwIDEgMS0xLjc0bC4xNS0uMDlhMiAyIDAgMCAwIC43My0yLjczbC0uMjItLjM4YTIgMiAwIDAgMC0yLjczLS43M2wtLjE1LjA4YTIgMiAwIDAgMS0yIDBsLS40My0uMjVhMiAyIDAgMCAxLTEtMS43M1Y0YTIgMiAwIDAgMC0yLTJ6Ii8+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMyIvPjwvc3ZnPg==',
                title: '设置',
                onClick: showSettings
            },
            {
                icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWZpbGUtcGx1cyI+PHBhdGggZD0iTTE1IDJINmEyIDIgMCAwIDAtMiAydjE2YTIgMiAwIDAgMCAyIDJoMTJhMiAyIDAgMCAwIDItMlY3WiIvPjxwYXRoIGQ9Ik0xNCAydjRhMiAyIDAgMCAwIDIgMmg0Ii8+PHBhdGggZD0iTTkgMTVoNiIvPjxwYXRoIGQ9Ik0xMiAxOHYtNiIvPjwvc3ZnPg==',
                title: '创建视频笔记',
                onClick: createVideoNote
            },
            {
                icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWdvYWwiPjxwYXRoIGQ9Ik0xMiAxM1YybDggNC04IDQiLz48cGF0aCBkPSJNMjAuNTYxIDEwLjIyMmE5IDkgMCAxIDEtMTIuNTUtNS4yOSIvPjxwYXRoIGQ9Ik04LjAwMiA5Ljk5N2E1IDUgMCAxIDAgOC45IDIuMDIiLz48L3N2Zz4=',
                title: '获取时间戳',
                onClick: getVideoTimestamp
            },
            {
                icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNhbWVyYSI+PHBhdGggZD0iTTE0LjUgNGgtNUw3IDdINGEyIDIgMCAwIDAtMiAydjlhMiAyIDAgMCAwIDIgMmgxNmEyIDIgMCAwIDAgMi0yVjlhMiAyIDAgMCAwLTItMmgtM2wtMi41LTN6Ii8+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMyIgcj0iMyIvPjwvc3ZnPg==',
                title: '获取时间戳+截图',
                onClick: getVideoScreenshot
            }
        ];

        buttonConfigs.forEach(config => {
            const button = document.createElement('button');
            button.className = 'timestamp-footer-btn';
            button.title = config.title;
            button.onclick = config.onClick;

            const img = document.createElement('img');
            img.src = config.icon;
            img.alt = config.title;

            button.appendChild(img);
            footerButtons.appendChild(button);
        });

        footer.appendChild(footerButtons);
        footer.appendChild(toggleBtn);

        panel.appendChild(header);
        panel.appendChild(list);
        panel.appendChild(footer);

        makeDraggable(panel);

        // 添加视频元素变化监听，使用更高效的监听策略
        let lastVideoState = !!getVideoElement();
        let observerThrottleTimer = null;

        const videoObserver = new MutationObserver(() => {
            // 使用节流来减少回调处理频率
            if (observerThrottleTimer) return;

            observerThrottleTimer = setTimeout(() => {
                const video = getVideoElement();
                const currentVideoState = !!video;

                // 只有视频状态发生变化时才更新UI
                if (currentVideoState !== lastVideoState) {
                    lastVideoState = currentVideoState;

                    if (video) {
                        if (!panel.classList.contains('hidden')) {
                            // 如果面板不在DOM中，重新添加
                            if (!document.body.contains(panel)) {
                                document.body.appendChild(panel);
                                makeDraggable(panel);
                            }

                            // 临时移除transition以避免显示延迟
                            const originalTransition = panel.style.transition;
                            panel.style.transition = 'opacity 0.3s ease-in-out';
                            panel.style.display = 'flex';

                            // 在显示后短暂延时恢复transition
                            setTimeout(() => {
                                panel.style.transition = originalTransition;
                            }, 50);

                            pillsContainer.classList.remove('visible');
                        } else {
                            pillsContainer.classList.add('visible');
                        }
                    } else {
                        panel.style.display = 'none';
                        pillsContainer.classList.remove('visible');
                    }

                    // 如果发现新的视频元素，添加播放监听器
                    if (video) {
                        // 先清除可能存在的旧监听器
                        video.removeEventListener('play', removeHighlight);

                        const removeHighlight = () => {
                            panel.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.25)';

                            // 平滑过渡到较低透明度
                            const originalTransition = panel.style.transition;
                            panel.style.transition = 'opacity 0.5s ease-in-out, box-shadow 0.5s ease-in-out';

                            setTimeout(() => {
                                panel.style.opacity = '0.85';

                                // 恢复原始transition
                                setTimeout(() => {
                                    panel.style.transition = originalTransition;
                                }, 500);
                            }, 50);

                            video.removeEventListener('play', removeHighlight);
                        };
                        video.addEventListener('play', removeHighlight);

                        // 添加video timeupdate事件监听
                        addVideoTimeUpdateHandler();
                    }
                }

                observerThrottleTimer = null;
            }, 300); // 300ms节流间隔
        });

        // 使用更精确的观察目标和配置，减少不必要的调用
        videoObserver.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['data-screen'] // 特别关注B站全屏属性变化
        });

        // 在组件卸载时清理observer
        panel._videoObserver = videoObserver;
        panel._cleanupObserver = () => {
            if (panel._videoObserver) {
                panel._videoObserver.disconnect();
                panel._videoObserver = null;
            }
            if (observerThrottleTimer) {
                clearTimeout(observerThrottleTimer);
                observerThrottleTimer = null;
            }
        };

        return panel;
    }

    // 将 hotkeyHandler 定义在全局作用域
    let hotkeyHandler;

    // 定义全局编辑状态变量
    let isEditing = false;

    // 修改 setupHotkeys 函数
    function setupHotkeys() {
        const config = configManager.get();

        // 定义 hotkeyHandler
        hotkeyHandler = function(e) {
            const pressedKeys = [];
            if (e.ctrlKey) pressedKeys.push('Ctrl');
            if (e.altKey) pressedKeys.push('Alt');
            if (e.shiftKey) pressedKeys.push('Shift');
            if (e.key !== 'Control' && e.key !== 'Alt' && e.key !== 'Shift') {
                pressedKeys.push(e.key.toUpperCase());
            }
            const pressedHotkey = pressedKeys.join('+');

            // 检查是否在输入框中
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }

            if (pressedHotkey === config.CREATE_NOTE_HOTKEY || pressedHotkey === config.TIMESTAMP_HOTKEY || pressedHotkey === config.SCREENSHOT_HOTKEY) {
                e.preventDefault();
                e.stopPropagation();

                // 防止重复触发
                if (e.repeat) return;

                // 添加防抖机制
                if (window.__lastHotkeyPress && Date.now() - window.__lastHotkeyPress < 500) {
                    return;
                }
                window.__lastHotkeyPress = Date.now();

                const video = getVideoElement();
                if (!video) {
                    showNotification('未找到视频元素！');
                    return;
                }

                const cleanedUrl = cleanUrl(window.location.href);
                findMatchingVideoNote(cleanedUrl).then(matchingNoteId => {
                    if (!matchingNoteId) {
                        if (pressedHotkey === config.CREATE_NOTE_HOTKEY) {
                            createVideoNote();
                        } else {
                            showNotification('请先创建视频笔记！');
                        }
                    } else {
                        if (pressedHotkey === config.TIMESTAMP_HOTKEY) {
                            getVideoTimestamp();
                        } else if (pressedHotkey === config.SCREENSHOT_HOTKEY) {
                            getVideoScreenshot();
                        } else if (pressedHotkey === config.CREATE_NOTE_HOTKEY) {
                            createVideoNote();
                        }
                    }
                });
            }
        };

        // 确保只添加一次事件监听器
        if (!window.__hotkeyHandlerAdded) {
            document.removeEventListener('keydown', hotkeyHandler);
            document.addEventListener('keydown', hotkeyHandler);
            window.__hotkeyHandlerAdded = true;
        }
    }

    // 添加事件监听设置函数
    function setupEventListeners(panel) {
        // 设置快捷键事件监听
        const hotkeyInputs = ['create-note-hotkey', 'timestamp-hotkey', 'screenshot-hotkey'];
        hotkeyInputs.forEach(id => {
            const input = panel.querySelector(`#${id}`);
            if (!input) return;

            input.addEventListener('focus', () => {
                input.value = '请按下快捷键组合...';
            });

            input.addEventListener('keydown', (e) => {
                e.preventDefault();
                const keys = [];
                if (e.ctrlKey) keys.push('Ctrl');
                if (e.altKey) keys.push('Alt');
                if (e.shiftKey) keys.push('Shift');
                if (e.key !== 'Control' && e.key !== 'Alt' && e.key !== 'Shift') {
                    keys.push(e.key.toUpperCase());
                }
                input.value = keys.join('+');
            });
        });

        // 绑定保存按钮事件
        const saveBtn = panel.querySelector('#save-settings');
        if (saveBtn) {
            saveBtn.onclick = function() {
                const selectedNotebook = panel.querySelector('#notebook-select');
                const matchInputs = panel.querySelectorAll('.match-input');
                const apiEndpoint = panel.querySelector('#api-endpoint').value.trim();
                const apiToken = panel.querySelector('#api-token').value.trim();

                // 检查必填项
                if (!apiToken) {
                    showNotification('请输入 API Token');
                    return;
                }

                // 检查笔记本选择 - 只有在有选项可供选择时才强制要求
                const hasNotebookOptions = selectedNotebook.options.length > 0 &&
                                          selectedNotebook.options[0].value !== '' &&
                                          !selectedNotebook.options[0].textContent.includes('加载失败') &&
                                          !selectedNotebook.options[0].textContent.includes('加载中');

                if (hasNotebookOptions && !selectedNotebook.value) {
                    showNotification('请选择一个笔记本');
                    return;
                }

                const notebookOption = selectedNotebook.selectedOptions[0];
                const newConfig = {
                    API_ENDPOINT: apiEndpoint,
                    API_TOKEN: apiToken,
                    NOTEBOOK_ID: selectedNotebook.value || '',
                    NOTEBOOK_NAME: (notebookOption && notebookOption.textContent) || '',
                    CREATE_NOTE_HOTKEY: panel.querySelector('#create-note-hotkey').value,
                    TIMESTAMP_HOTKEY: panel.querySelector('#timestamp-hotkey').value,
                    SCREENSHOT_HOTKEY: panel.querySelector('#screenshot-hotkey').value,
                    MATCH_LIST: Array.from(matchInputs)
                        .map(input => input.value.trim())
                        .filter(value => value !== '')
                };

                configManager.save(newConfig);
                setupHotkeys();
                showNotification('设置已保存');
                panel.remove();
            };
        }

        // 绑定取消按钮事件
        const cancelBtn = panel.querySelector('#cancel-settings');
        if (cancelBtn) {
            cancelBtn.onclick = function() {
                panel.remove();
            };
        }

        // 为匹配规则添加按钮绑定事件
        const addMatchBtn = panel.querySelector('.add-match-btn');
        if (addMatchBtn) {
            addMatchBtn.onclick = () => {
                const matchList = panel.querySelector('#match-list');
                const matchItem = createMatchItem('');
                matchList.appendChild(matchItem);
            };
        }
    }

    // 初始化时设置快捷键
    setupHotkeys();

    // 添加辅助函数
    async function findTimestampBlockId(url, docId) {
        const sql = `SELECT id FROM blocks
                     WHERE root_id = '${docId}'
                     AND content LIKE '%${url}%'
                     AND type = 'p'
                     AND id IN (
                         SELECT block_id FROM attributes
                         WHERE name = 'custom-media'
                         AND value = 'timestamp'
                     )`;

        const result = await query(sql);
        return result.length > 0 ? result[0].id : null;
    }

    async function findMemoBlock(parentId) {
        const sql = `SELECT id FROM blocks
                     WHERE parent_id = '${parentId}'
                     AND type = 'p'
                     AND id IN (
                         SELECT block_id FROM attributes
                         WHERE name = 'custom-media'
                         AND value = 'memos'
                     )`;

        const result = await query(sql);
        return result.length > 0 ? result[0].id : null;
    }

    // 添加 SQL 查询函数
    async function query(sql) {
        const config = getConfig();
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: `${config.API_ENDPOINT}/api/query/sql`,
                headers: {
                    'Authorization': `Token ${config.API_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({ stmt: sql }),
                onload: function(response) {
                    if (response.status === 200) {
                        const result = JSON.parse(response.responseText);
                        if (result.code === 0) {
                            resolve(result.data);
                        } else {
                            reject(new Error(result.msg));
                        }
                    } else {
                        reject(new Error('查询失败'));
                    }
                },
                onerror: reject
            });
        });
    }

    // 添加设置块属性的函数
    async function setBlockAttrs(params) {
        const config = getConfig();
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: `${config.API_ENDPOINT}/api/attr/setBlockAttrs`,
                headers: {
                    'Authorization': `Token ${config.API_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(params),
                onload: function(response) {
                    if (response.status === 200) {
                        const result = JSON.parse(response.responseText);
                        if (result.code === 0) {
                            resolve(result.data);
                        } else {
                            reject(new Error(result.msg));
                        }
                    } else {
                        reject(new Error('设置属性失败'));
                    }
                },
                onerror: reject
            });
        });
    }

    // 添加查找和删除临时块的函数
    async function removeTemporaryBlocks() {
        const config = getConfig();
        try {
            // 1. 先用SQL查询找到所有带有临时标记的块
            const result = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: `${config.API_ENDPOINT}/api/query/sql`,
                    headers: {
                        'Authorization': `Token ${config.API_TOKEN}`,
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify({
                        stmt: "SELECT id FROM blocks WHERE id IN (SELECT block_id FROM attributes WHERE name = 'custom-media' AND value = 'temp')"
                    }),
                    onload: function(response) {
                        if (response.status === 200) {
                            const result = JSON.parse(response.responseText);
                            if (result.code === 0) {
                                resolve(result.data);
                            } else {
                                reject(new Error(result.msg));
                            }
                        } else {
                            reject(new Error('查询临时块失败'));
                        }
                    },
                    onerror: reject
                });
            });

            // 2. 删除找到的所有临时块
            for (const block of result) {
                await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: `${config.API_ENDPOINT}/api/block/deleteBlock`,
                        headers: {
                            'Authorization': `Token ${config.API_TOKEN}`,
                            'Content-Type': 'application/json'
                        },
                        data: JSON.stringify({
                            id: block.id
                        }),
                        onload: function(response) {
                            if (response.status === 200) {
                                const result = JSON.parse(response.responseText);
                                if (result.code === 0) {
                                    resolve();
                                } else {
                                    reject(new Error(result.msg));
                                }
                            } else {
                                reject(new Error('删除临时块失败'));
                            }
                        },
                        onerror: reject
                    });
                });
            }

            console.log('临时块清理完成');
        } catch (error) {
            console.error('清理临时块失败:', error);
            throw error;
        }
    }

    // 添加更新块内容的函数
    async function updateBlock(params) {
        const config = getConfig();
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: `${config.API_ENDPOINT}/api/block/updateBlock`,
                headers: {
                    'Authorization': `Token ${config.API_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(params),
                onload: function(response) {
                    if (response.status === 200) {
                        const result = JSON.parse(response.responseText);
                        if (result.code === 0) {
                            resolve(result.data);
                        } else {
                            reject(new Error(result.msg));
                        }
                    } else {
                        reject(new Error('更新块失败'));
                    }
                },
                onerror: reject
            });
        });
    }

    // 添加统一的错误处理函数
    function handleError(error, operation) {
        console.error(`${operation} 失败:`, error);
        showNotification(`${operation}失败: ${error.message}`);
        throw error;
    }

    // 添加资源清理函数
    function cleanup() {
        // 清除所有事件监听器
        document.removeEventListener('keydown', hotkeyHandler);

        // 清除定时器
        if (window._timestampUpdateInterval) {
            clearInterval(window._timestampUpdateInterval);
            window._timestampUpdateInterval = null;
        }

        // 清理视频事件监听器
        const video = getVideoElement();
        if (video && video._timestampUpdateHandler) {
            video.removeEventListener('timeupdate', video._timestampUpdateHandler);
            delete video._timestampUpdateHandler;
        }

        // 清除缓存
        cache.clearCache();

        // 移除面板和相关资源
        const panel = document.querySelector('.timestamp-list-panel');
        if (panel) {
            // 调用面板的清理函数
            if (panel._cleanupObserver) {
                panel._cleanupObserver();
            }

            // 移除面板
            if (panel.parentNode) {
                panel.parentNode.removeChild(panel);
            }
        }

        // 移除药丸容器
        const pillsContainer = document.querySelector('.timestamp-pills-container');
        if (pillsContainer && pillsContainer.parentNode) {
            pillsContainer.parentNode.removeChild(pillsContainer);
        }
    }

    // 在页面卸载时清理资源
    window.addEventListener('unload', cleanup);

    // 修改 createOrGetSuperBlock 函数，将 config 作为参数传入
    async function createOrGetSuperBlock(blockId) {
        try {
            // 1. 检查是否已经在超级块内
            const isInSuper = await isInSuperBlock(blockId);
            if (isInSuper) {
                // 如果已经在超级块内，返回父超级块ID
                return await getParentSuperBlockId(blockId);
            }

            // 2. 创建新的超级块
            const superBlockId = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: `${getConfig().API_ENDPOINT}/api/block/insertBlock`,
                    headers: {
                        'Authorization': `Token ${getConfig().API_TOKEN}`,
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify({
                        dataType: "markdown",
                        data: `{{{row
                            内容\n{: custom-media="temp" }\n
                            }}}\n{: custom-media="mediacard" }\n`,
                        previousID: blockId
                    }),
                    onload: function(response) {
                        if (response.status === 200) {
                            const result = JSON.parse(response.responseText);
                            if (result.code === 0 && result.data && result.data.length > 0 &&
                                result.data[0].doOperations && result.data[0].doOperations.length > 0) {
                                resolve(result.data[0].doOperations[0].id);
                            } else {
                                console.error('API返回结果异常:', result);
                                reject(new Error(result.msg || '返回数据结构异常'));
                            }
                        } else {
                            reject(new Error('创建超级块失败'));
                        }
                    },
                    onerror: reject
                });
            });

            // 3. 移动原始块到超级块内
            await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: `${getConfig().API_ENDPOINT}/api/block/moveBlock`,
                    headers: {
                        'Authorization': `Token ${getConfig().API_TOKEN}`,
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify({
                        id: blockId,
                        parentID: superBlockId
                    }),
                    onload: function(response) {
                        if (response.status === 200) {
                            const result = JSON.parse(response.responseText);
                            if (result.code === 0) {
                                resolve();
                            } else {
                                reject(new Error(result.msg));
                            }
                        } else {
                            reject(new Error('移动块失败'));
                        }
                    },
                    onerror: reject
                });
            });

            // 4. 设置超级块属性
            await setBlockAttrs({
                id: superBlockId,
                attrs: {
                    "layout": "row"
                }
            });

            // 5. 查找并删除临时占位块
            const sql = `SELECT b.id
                        FROM blocks b
                        JOIN attributes a ON b.id = a.block_id
                        WHERE b.parent_id = '${superBlockId}'
                        AND a.name = 'custom-media'
                        AND a.value = 'temp'`;

            try {
                const result = await query(sql);
                if (result && result.length > 0) {
                    for (const row of result) {
                        await deleteBlock({ id: row.id });
                    }
                }
            } catch (error) {
                console.error('删除临时占位块失败:', error);
                // 继续执行，不影响主流程
            }

            return superBlockId;
        } catch (error) {
            console.error('创建或获取超级块失败:', error);
            throw error;
        }
    }

    // 添加删除块的函数
    async function deleteBlock(params) {
        const config = getConfig();
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: `${config.API_ENDPOINT}/api/block/deleteBlock`,
                headers: {
                    'Authorization': `Token ${config.API_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(params),
                onload: function(response) {
                    if (response.status === 200) {
                        const result = JSON.parse(response.responseText);
                        if (result.code === 0) {
                            resolve(result.data);
                        } else {
                            reject(new Error(result.msg));
                        }
                    } else {
                        reject(new Error('删除块失败'));
                    }
                },
                onerror: reject
            });
        });
    }

    // 添加安全获取块ID的辅助函数
    function getBlockIDFromResult(result) {
        if (result &&
            result.code === 0 &&
            result.data &&
            result.data.length > 0 &&
            result.data[0].doOperations &&
            result.data[0].doOperations.length > 0 &&
            result.data[0].doOperations[0].id) {
            return result.data[0].doOperations[0].id;
        }
        console.error('API返回结果无法获取块ID:', result);
        throw new Error('返回数据结构异常，无法获取块ID');
    }

    // 修改备注块更新逻辑
    async function updateMemoBlocks(timestampBlockId, newNotes) {
        try {
            // 获取超级块
            const superBlockId = await createOrGetSuperBlock(timestampBlockId);

            // 获取现有的备注块
            const existingMemoBlocks = await findAllMemoBlocks(timestampBlockId);

            // 获取现有备注块的内容
            const existingContents = await Promise.all(existingMemoBlocks.map(async (blockId) => {
                try {
                    const blockData = await getBlockKramdown(blockId);
                    return {
                        id: blockId,
                        content: blockData.kramdown.replace(/\{:[^\}]+\}/g, '').trim()
                    };
                } catch (error) {
                    console.error('获取备注块内容失败:', error);
                    return { id: blockId, content: '' };
                }
            }));

            // 更新现有块和添加新块
            const processedNotes = new Set(); // 用于跟踪已处理的备注

            // 1. 首先更新已存在的块
            for (let i = 0; i < Math.min(existingContents.length, newNotes.length); i++) {
                const note = newNotes[i].trim();
                if (note && note !== existingContents[i].content) {
                    // 只有当内容不同时才更新
                    await updateBlock({
                        id: existingContents[i].id,
                        data: note,
                        dataType: "markdown"
                    });

                    // 确保更新后重新设置属性
                    await setBlockAttrs({
                        id: existingContents[i].id,
                        attrs: {
                            "custom-media": "memos"
                        }
                    });
                }
                processedNotes.add(note);
            }

            // 2. 如果有新的备注，创建新的块
            for (const note of newNotes) {
                const trimmedNote = note.trim();
                if (trimmedNote && !processedNotes.has(trimmedNote)) {
                    try {
                        await new Promise((resolve, reject) => {
                            GM_xmlhttpRequest({
                                method: 'POST',
                                url: `${getConfig().API_ENDPOINT}/api/block/appendBlock`,
                                headers: {
                                    'Authorization': `Token ${getConfig().API_TOKEN}`,
                                    'Content-Type': 'application/json'
                                },
                                data: JSON.stringify({
                                    dataType: "markdown",
                                    data: trimmedNote,
                                    parentID: superBlockId
                                }),
                                onload: async function(response) {
                                    if (response.status === 200) {
                                        const result = JSON.parse(response.responseText);
                                        if (result.code === 0 && result.data && result.data.length > 0 &&
                                            result.data[0].doOperations && result.data[0].doOperations.length > 0) {
                                            const newBlockId = result.data[0].doOperations[0].id;
                                            try {
                                                await setBlockAttrs({
                                                    id: newBlockId,
                                                    attrs: {
                                                        "custom-media": "memos"
                                                    }
                                                });
                                                resolve();
                                            } catch (error) {
                                                reject(error);
                                            }
                                        } else {
                                            console.error('API返回结果异常:', result);
                                            reject(new Error(result.msg || '返回数据结构异常'));
                                        }
                                    } else {
                                        reject(new Error('创建备注块失败'));
                                    }
                                },
                                onerror: reject
                            });
                        });
                    } catch (error) {
                        console.error('创建备注块失败:', error);
                        // 继续处理其他备注，不中断整个过程
                    }
                    processedNotes.add(trimmedNote);
                }
            }

            // 3. 如果现有块数量多于新备注数量，删除多余的块
            if (existingContents.length > newNotes.length) {
                for (let i = newNotes.length; i < existingContents.length; i++) {
                    await deleteBlock({ id: existingContents[i].id });
                }
            }

            return true;
        } catch (error) {
            console.error('更新备注块失败:', error);
            throw error;
        }
    }
})();
