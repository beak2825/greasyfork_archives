// ==UserScript==
// @name         日语学习助手 - 语法分析与Anki制卡
// @namespace    http://tampermonkey.net/
// @version      2025-01-05
// @description  选中日语文本进行语法和单词分析，支持一键保存到Anki，提供更好的UI交互和错误处理
// @author       乃木流架
// @match        *://*/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAqElEQVR4nO2V3QmAMBCD6yZ1Op+EbtOZ3MPeGhHBvgin3vWw9SeQF6nkSwrq3K+L8lPEaqtzYvnPA/RTxGoA3ZHzOfMroJQgsVkwtmZSgPxeMQAJg82WgLK52RJUGKxeAkzzNM8iq5cgpkEYB5HVSxDTXArALcF+Yv3m0uZnS+zz3OMASPn8PQCh9hUEa4DmvwN0N0D1f0EzAFnVgpsByKoW3AzAr9dqAc7mUbe0kIcIAAAAAElFTkSuQmCC
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM.xmlHttpRequest
// @connect      api.openai.com
// @connect      localhost
// @connect      127.0.0.1
// @connect      *
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/522859/%E6%97%A5%E8%AF%AD%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B%20-%20%E8%AF%AD%E6%B3%95%E5%88%86%E6%9E%90%E4%B8%8EAnki%E5%88%B6%E5%8D%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/522859/%E6%97%A5%E8%AF%AD%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B%20-%20%E8%AF%AD%E6%B3%95%E5%88%86%E6%9E%90%E4%B8%8EAnki%E5%88%B6%E5%8D%A1.meta.js
// ==/UserScript==
(async function() {
    'use strict';

    // 工具函数
    const logger = {
        debug: (...args) => console.log('[日语助手-DEBUG]', new Date().toISOString(), ...args),
        info: (...args) => console.info('[日语助手-INFO]', new Date().toISOString(), ...args),
        error: (...args) => console.error('[日语助手-ERROR]', new Date().toISOString(), ...args),
        state: (state, data) => console.log('[日语助手-STATE]', new Date().toISOString(), state, data),
        data: (label, data) => console.log('[日语助手-DATA]', new Date().toISOString(), label, JSON.stringify(data, null, 2))
    };

    // 防抖函数
    const debounce = (fn, delay) => {
        let timer = null;
        return (...args) => {
            if (timer) clearTimeout(timer);
            timer = setTimeout(() => fn(...args), delay);
        };
    };

    // 缓存相关
    const CACHE_KEY = 'jp_helper_cache';
    const MAX_CACHE_SIZE = 50;

    async function getCachedResult(text) {
        try {
            const cache = await GM_getValue(CACHE_KEY, {});
            const cached = cache[text];
            if (cached && Date.now() - cached.timestamp < 24 * 60 * 60 * 1000) { // 24小时有效期
                return cached.result;
            }
            return null;
        } catch (error) {
            logger.error('获取缓存失败:', error);
            return null;
        }
    }

    async function cacheResult(text, result) {
        try {
            const cache = await GM_getValue(CACHE_KEY, {});
            const entries = Object.entries(cache);
            
            if (entries.length >= MAX_CACHE_SIZE) {
                // 删除最旧的缓存
                const oldestKey = entries.sort((a, b) => a[1].timestamp - b[1].timestamp)[0][0];
                delete cache[oldestKey];
            }
            
            cache[text] = {
                result,
                timestamp: Date.now()
            };
            
            await GM_setValue(CACHE_KEY, cache);
        } catch (error) {
            logger.error('保存缓存失败:', error);
        }
    }

    // 在线状态检查
    async function checkOnlineStatus() {
        if (!navigator.onLine) {
            throw new Error('当前处于离线状态，无法访问API');
        }
    }

    // API密钥加密存储
    async function encryptApiKey(apiKey) {
        return btoa(apiKey);
    }

    async function decryptApiKey(encryptedKey) {
        return atob(encryptedKey);
    }

    // 配置和常量
    const DEFAULT_CONFIG = {
        apiKey: '',
        models: [
            'gpt-4',
            'gpt-4o',
            'gpt-4o-mini',
            'gpt-3.5-turbo-0125',
            'gpt-3.5-turbo-1106'
        ],
        model: 'gpt-4o',
        maxTextLength: 2000,
        requestTimeout: 60000,
        systemPrompt: `你是一名知识渊博的日语老师，帮我分析日语段落，要求整洁清晰的排版，以句子为单位分析生词（用平假名标读音）以及语法结构，也可适当拓展知识，结尾总结并给出译文：`,
        ankiConnect: {
            endpoint: 'http://localhost:8765',
            deckName: '日语牌组',
            modelName: '日语模版',
            timeout: 5000,
            duplicateScope: 'deck'
        }
    };

    // 从存储加载配置
    const CONFIG = await loadConfig();
    console.log(CONFIG);

    // 配置管理函数
    async function loadConfig() {
        try {
            const savedConfig = await GM_getValue('config', {});
            logger.debug('加载配置');
            logger.data('默认配置', DEFAULT_CONFIG);
            logger.data('保存的配置', savedConfig);

            // 解密API密钥
            if (savedConfig.apiKey) {
                try {
                    savedConfig.apiKey = await decryptApiKey(savedConfig.apiKey);
                } catch (error) {
                    logger.error('API密钥解密失败:', error);
                    // 如果解密失败，使用默认配置的API密钥
                    savedConfig.apiKey = DEFAULT_CONFIG.apiKey;
                }
            }

            // 深度合并配置
            const mergedConfig = {
                ...DEFAULT_CONFIG,
                ...savedConfig,
                models: DEFAULT_CONFIG.models,  // 始终使用默认的models
                ankiConnect: {
                    ...DEFAULT_CONFIG.ankiConnect,
                    ...savedConfig.ankiConnect,
                    duplicateScope: DEFAULT_CONFIG.ankiConnect.duplicateScope  // 确保新增字段存在
                }
            };

            logger.data('合并后的配置', mergedConfig);
            return mergedConfig;
        } catch (error) {
            logger.error('加载配置失败:', error);
            return DEFAULT_CONFIG;
        }
    }

    async function saveConfig(newConfig) {
        try {
            logger.debug('保存配置');
            logger.data('当前配置', CONFIG);
            logger.data('新配置', newConfig);

            // 加密API密钥
            if (newConfig.apiKey) {
                try {
                    const encryptedKey = await encryptApiKey(newConfig.apiKey);
                    newConfig = {
                        ...newConfig,
                        apiKey: encryptedKey
                    };
                } catch (error) {
                    logger.error('API密钥加密失败:', error);
                    throw new Error('API密钥加密失败');
                }
            }

            await GM_setValue('config', newConfig);
            // 更新当前配置时使用解密后的API密钥
            Object.assign(CONFIG, {
                ...newConfig,
                apiKey: await decryptApiKey(newConfig.apiKey)
            });
            
            logger.data('更新后的配置', CONFIG);
            logger.debug('配置已保存');
        } catch (error) {
            logger.error('保存配置失败:', error);
            logger.data('错误配置', newConfig);
            throw error;
        }
    }

    // 加载必要的依赖
    async function loadDependencies() {
        logger.info('开始加载依赖项');
        try {
            await loadScript('https://cdn.jsdelivr.net/npm/markdown-it@14.1.0/dist/markdown-it.min.js');
            logger.debug('markdown-it.js 加载完成');
            logger.info('所有依赖项加载成功');
        } catch (error) {
            logger.error('依赖项加载失败', error);
            throw error;
        }
    }
    function loadScript(url) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = url;
            script.onload = resolve;
            script.onerror = () => reject(new Error(`Failed to load ${url}`));
            document.head.appendChild(script);
        });
    }
    // 添加样式
    function addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .loading-spinner {
                display: inline-block;
                width: 40px;
                height: 40px;
                border: 4px solid #f3f3f3;
                border-top: 4px solid #4CAF50;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            .jp-helper-menu {
                position: absolute;
                background: transparent;
                padding: 2px;
                border-radius: 6px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                z-index: 10000;
                font-family: system-ui, -apple-system, sans-serif;
            }
            .jp-helper-button {
                padding: 6px 10px;
                background: white;
                color: #4CAF50;
                border: 1px solid #4CAF50;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
                transition: all 0.2s;
                display: flex;
                align-items: center;
                gap: 6px;
                min-width: 100px;
                white-space: nowrap;
            }
            .jp-helper-button:hover {
                background: #4CAF50;
                color: white;
                transform: translateY(-1px);
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .jp-helper-button img {
                width: 18px;
                height: 18px;
                object-fit: contain;
            }
            .jp-helper-panel {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #ffffff;
                border-radius: 12px;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                max-width: 800px;
                width: 90%;
                max-height: 80vh;
                z-index: 10001;
                display: flex;
                flex-direction: column;
                overflow: hidden;
                border: 1px solid rgba(229, 231, 235, 1);
            }
            .jp-helper-panel .drag-handle {
                padding: 12px 16px;
                background: #f0f7ff;
                border-bottom: 1px solid rgba(209, 213, 219, 0.5);
                cursor: move;
                user-select: none;
                border-radius: 12px 12px 0 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
                position: sticky;
                top: 0;
                z-index: 2;
                height: 56px;
                box-sizing: border-box;
            }
            .jp-helper-panel .drag-handle span {
                font-size: 15px;
                font-weight: 600;
                color: #111827;
                letter-spacing: -0.01em;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .jp-helper-panel .content-container {
                padding: 0 30px;
                overflow-y: auto;
                flex: 1;
                min-height: 0;
                max-height: calc(80vh - 56px);
                color: #111827;
                line-height: 1.6;
            }
            .jp-helper-panel .content-container .analysis-result {
                padding-bottom: 30px;
            }
            .jp-helper-toggle,
            .jp-helper-copy,
            .jp-helper-refresh,
            .jp-helper-close,
            .jp-helper-anki {
                padding: 6px 12px;
                font-size: 13px;
                font-weight: 500;
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.2s ease;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                min-width: 64px;
                height: 32px;
                border: none;
                color: white;
            }
            .jp-helper-toggle {
                background: #6b7280;
            }
            .jp-helper-copy {
                background: #3b82f6;
            }
            .jp-helper-refresh {
                background: #10b981;
            }
            .jp-helper-close {
                background: #ef4444;
            }
            .jp-helper-anki {
                background: #6366f1;
            }
            .jp-helper-toggle:hover,
            .jp-helper-copy:hover,
            .jp-helper-refresh:hover,
            .jp-helper-close:hover,
            .jp-helper-anki:hover {
                filter: brightness(0.95);
            }
            .jp-helper-toggle:active,
            .jp-helper-copy:active,
            .jp-helper-refresh:active,
            .jp-helper-close:active,
            .jp-helper-anki:active {
                filter: brightness(0.9);
            }
            .update-btn,
            .cancel-btn {
                padding: 8px 16px;
                font-size: 14px;
                font-weight: 500;
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.2s ease;
                border: none;
                color: white;
            }
            .update-btn {
                background: #10b981;
            }
            .cancel-btn {
                background: #ef4444;
            }
            .update-btn:hover,
            .cancel-btn:hover {
                filter: brightness(0.95);
            }
            .update-btn:active,
            .cancel-btn:active {
                filter: brightness(0.9);
            }
            .jp-helper-anki:disabled {
                background: #9ca3af;
                cursor: not-allowed;
            }
            .jp-helper-anki:disabled:hover {
                filter: none;
            }
            .jp-helper-panel .content-container::-webkit-scrollbar,
            .compare-dialog-content::-webkit-scrollbar {
                width: 8px;
                height: 8px;
            }
            .jp-helper-panel .content-container::-webkit-scrollbar-track,
            .compare-dialog-content::-webkit-scrollbar-track {
                background: #f1f1f1;
                border-radius: 4px;
            }
            .jp-helper-panel .content-container::-webkit-scrollbar-thumb,
            .compare-dialog-content::-webkit-scrollbar-thumb {
                background: #c1c1c1;
                border-radius: 4px;
            }
            .jp-helper-panel .content-container::-webkit-scrollbar-thumb:hover,
            .compare-dialog-content::-webkit-scrollbar-thumb:hover {
                background: #a8a8a8;
            }
            .jp-helper-settings-panel {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #ffffff;
                border-radius: 16px;
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                max-width: 600px;
                width: 90%;
                max-height: 85vh;
                z-index: 10003;
                display: none;
                flex-direction: column;
                border: 1px solid #e5e7eb;
            }
            .jp-helper-settings-panel .settings-header {
                padding: 20px 24px;
                border-bottom: 1px solid #e5e7eb;
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: #f8fafc;
                border-radius: 16px 16px 0 0;
            }
            .jp-helper-settings-panel .settings-content {
                padding: 24px;
                overflow-y: auto;
                max-height: calc(85vh - 140px);
            }
            .jp-helper-settings-panel .settings-footer {
                padding: 16px 24px;
                border-top: 1px solid #e5e7eb;
                display: flex;
                justify-content: flex-end;
                gap: 12px;
                background: #f8fafc;
                border-radius: 0 0 16px 16px;
            }
            .jp-helper-settings-panel .settings-group {
                margin-bottom: 32px;
            }
            .jp-helper-settings-panel .settings-group:last-child {
                margin-bottom: 0;
            }
            .jp-helper-settings-panel .settings-group-title {
                font-weight: 600;
                color: #111827;
                font-size: 16px;
                margin-bottom: 20px;
                padding-bottom: 12px;
                border-bottom: 1px solid #e5e7eb;
            }
            .jp-helper-settings-panel .setting-item {
                margin-bottom: 20px;
            }
            .jp-helper-settings-panel .setting-item:last-child {
                margin-bottom: 0;
            }
            .jp-helper-settings-panel .help-text {
                margin-top: 6px;
                font-size: 12px;
                color: #6b7280;
                line-height: 1.5;
            }
            .jp-helper-settings-panel input,
            .jp-helper-settings-panel select,
            .jp-helper-settings-panel textarea {
                width: 100%;
                padding: 10px 14px;
                border: 1px solid #e5e7eb;
                border-radius: 8px;
                font-size: 14px;
                background: #f9fafb;
                transition: all 0.2s ease;
                box-sizing: border-box;
                max-width: 100%;
                color: #1f2937;
            }
            .jp-helper-settings-panel input[type="password"] {
                font-family: monospace;
                letter-spacing: 1px;
            }
            .jp-helper-settings-panel input:focus,
            .jp-helper-settings-panel select:focus,
            .jp-helper-settings-panel textarea:focus {
                outline: none;
                border-color: #3b82f6;
                box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
                background: #ffffff;
            }
            .jp-helper-settings-panel label {
                font-weight: 600;
                color: #374151;
                display: block;
                margin-bottom: 8px;
                font-size: 14px;
            }
            .jp-helper-settings-panel .section-title {
                font-weight: 600;
                color: #111827;
                margin: 32px 0 24px;
                padding-top: 24px;
                border-top: 1px solid #e5e7eb;
                font-size: 16px;
            }
            .jp-helper-settings-panel textarea {
                min-height: 120px;
                resize: vertical;
                font-family: inherit;
                line-height: 1.6;
                will-change: height;
                transition: none;
            }
            .jp-helper-settings-panel .help-text {
                margin-top: 6px;
                font-size: 12px;
                color: #6b7280;
                line-height: 1.5;
            }
            .jp-helper-settings-panel .settings-close,
            .jp-helper-settings-panel .settings-cancel,
            .jp-helper-settings-panel .settings-save {
                padding: 8px 16px;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 500;
                transition: all 0.2s ease;
                border: none;
                cursor: pointer;
                display: inline-flex;
                align-items: center;
                gap: 6px;
                min-width: 80px;
                justify-content: center;
            }
            .jp-helper-settings-panel .settings-close {
                background: #ef4444;
                color: white;
            }
            .jp-helper-settings-panel .settings-cancel {
                background: #6b7280;
                color: white;
            }
            .jp-helper-settings-panel .settings-save {
                background: #3b82f6;
                color: white;
            }
            .jp-helper-settings-panel .settings-close:hover,
            .jp-helper-settings-panel .settings-cancel:hover,
            .jp-helper-settings-panel .settings-save:hover {
                filter: brightness(1.1);
                transform: translateY(-1px);
            }
            .jp-helper-settings-panel .settings-close:active,
            .jp-helper-settings-panel .settings-cancel:active,
            .jp-helper-settings-panel .settings-save:active {
                transform: translateY(0);
            }
            .jp-helper-settings-panel .api-key-container {
                position: relative;
            }
            .jp-helper-settings-panel .toggle-password {
                position: absolute;
                right: 8px;
                top: 50%;
                transform: translateY(-50%);
                background: none;
                border: none;
                padding: 4px;
                cursor: pointer;
                color: #6b7280;
            }
            .jp-helper-settings-panel .toggle-password:hover {
                color: #374151;
            }
            .jp-helper-settings-panel .settings-content::-webkit-scrollbar {
                width: 8px;
                height: 8px;
            }
            .jp-helper-settings-panel .settings-content::-webkit-scrollbar-track {
                background: #f1f1f1;
                border-radius: 4px;
            }
            .jp-helper-settings-panel .settings-content::-webkit-scrollbar-thumb {
                background: #c1c1c1;
                border-radius: 4px;
            }
            .jp-helper-settings-panel .settings-content::-webkit-scrollbar-thumb:hover {
                background: #a8a8a8;
            }
            .jp-helper-settings-panel input[type="password"],
            .jp-helper-settings-panel input[type="text"] {
                padding-right: 36px;
            }
            .jp-helper-settings-panel .api-key-container {
                position: relative;
                display: flex;
                align-items: center;
            }
            .jp-helper-settings-panel .toggle-password {
                position: absolute;
                right: 8px;
                top: 50%;
                transform: translateY(-50%);
                background: none;
                border: none;
                padding: 4px;
                cursor: pointer;
                color: #6b7280;
                z-index: 1;
            }
        `;
        document.head.appendChild(style);
    }
    // 添加重试工具函数
    async function retry(fn, retries = 3, delay = 1000) {
        let lastError;
        for (let i = 0; i < retries; i++) {
            try {
                return await fn();
            } catch (error) {
                lastError = error;
                logger.error(`重试第 ${i + 1} 次失败:`, error);
                if (i < retries - 1) {
                    await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
                }
            }
        }
        throw lastError;
    }

    // API 请求函数
    async function analyzeText(text, skipCache = false) {
        try {
            // 基本验证
            if (!text || typeof text !== 'string') {
                throw new Error('无效的输入文本');
            }
            
            logger.debug('开始分析文本', { length: text.length, skipCache });
            logger.data('输入文本', text);
            
            // 检查在线状态
            await checkOnlineStatus();
            
            // 检查配置
            if (!CONFIG.apiKey) {
                throw new Error('请先设置 OpenAI API Key');
            }
            if (!CONFIG.apiEndpoint) {
                throw new Error('API端点未设置');
            }
            if (text.length > CONFIG.maxTextLength) {
                throw new Error(`文本过长，请限制在${CONFIG.maxTextLength} 字符以内`);
            }

            // 检查缓存（如果不跳过缓存）
            if (!skipCache) {
                const cachedResult = await getCachedResult(text);
                if (cachedResult) {
                    logger.debug('使用缓存结果');
                    return cachedResult;
                }
            }

            // API请求
            const result = await retry(async () => {
                return new Promise((resolve, reject) => {
                    const timeoutId = setTimeout(() => {
                        logger.error('API请求超时');
                        reject(new Error('请求超时'));
                    }, CONFIG.requestTimeout);

                    const requestData = {
                        model: CONFIG.model,
                        messages: [
                            { role: "system", content: CONFIG.systemPrompt },
                            { role: "user", content: text }
                        ],
                        temperature: 0.7
                    };
                    
                    logger.debug('发送API请求');
                    logger.data('请求数据', requestData);

                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: CONFIG.apiEndpoint,
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${CONFIG.apiKey}`
                        },
                        data: JSON.stringify(requestData),
                        onload: function(response) {
                            clearTimeout(timeoutId);
                            logger.debug('收到API响应:', { 
                                status: response.status,
                                statusText: response.statusText,
                                headers: response.headers
                            });
                            logger.data('响应原始数据', response.responseText);

                            try {
                                if (response.status !== 200) {
                                    const errorData = JSON.parse(response.responseText);
                                    logger.error('API错误响应:', errorData);
                                    throw new Error(`API错误: ${errorData.error?.message || response.statusText}`);
                                }

                                const data = JSON.parse(response.responseText);
                                logger.debug('API响应解析成功');
                                logger.data('解析后的响应数据', data);
                                
                                const result = data.choices[0].message.content;
                                // 缓存结果
                                cacheResult(text, result);
                                resolve(result);
                            } catch (error) {
                                logger.error('API响应处理失败:', error);
                                reject(error);
                            }
                        },
                        onerror: function(error) {
                            clearTimeout(timeoutId);
                            reject(new Error('网络请求失败'));
                        }
                    });
                });
            });

            return result;
        } catch (error) {
            logger.error('文本分析失败:', {
                error: error.message,
                text_length: text?.length,
                api_endpoint: CONFIG.apiEndpoint,
                skipCache
            });
            throw error;
        }
    }
    // UI 组件
    function createUI() {
        const menu = document.createElement('div');
        menu.className = 'jp-helper-menu';
        menu.style.display = 'none';
        
        const button = document.createElement('button');
        button.className = 'jp-helper-button';
        button.innerHTML = `
            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAqElEQVR4nO2V3QmAMBCD6yZ1Op+EbtOZ3MPeGhHBvgin3vWw9SeQF6nkSwrq3K+L8lPEaqtzYvnPA/RTxGoA3ZHzOfMroJQgsVkwtmZSgPxeMQAJg82WgLK52RJUGKxeAkzzNM8iq5cgpkEYB5HVSxDTXArALcF+Yv3m0uZnS+zz3OMASPn8PQCh9hUEa4DmvwN0N0D1f0EzAFnVgpsByKoW3AzAr9dqAc7mUbe0kIcIAAAAAElFTkSuQmCC">
            <span>日语分析</span>
        `;
        button.style.display = 'flex';
        button.style.alignItems = 'center';
        button.style.padding = '8px 12px';

        menu.appendChild(button);
        const panel = document.createElement('div');
        panel.className = 'jp-helper-panel';
        panel.style.display = 'none';
        
        requestAnimationFrame(() => {
            panel.style.transform = 'translate(-50%, -50%)';
        });
        document.body.appendChild(menu);
        document.body.appendChild(panel);
        return { menu, button, panel };
    }
    // UI 状态更新
    function updateUI(panel, state, content = '', selectedText = '') {
        logger.debug('更新UI状态', { state });
        logger.data('UI更新内容---content', content);
        // 保存当前transform
        const currentTransform = panel.style.transform;
        
        // 清除面板内容
        panel.innerHTML = '';
        
        const header = `
            <div class="drag-handle">
                <span style="font-weight: bold; display: flex; align-items: center; gap: 8px;">
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAqElEQVR4nO2V3QmAMBCD6yZ1Op+EbtOZ3MPeGhHBvgin3vWw9SeQF6nkSwrq3K+L8lPEaqtzYvnPA/RTxGoA3ZHzOfMroJQgsVkwtmZSgPxeMQAJg82WgLK52RJUGKxeAkzzNM8iq5cgpkEYB5HVSxDTXArALcF+Yv3m0uZnS+zz3OMASPn8PQCh9hUEa4DmvwN0N0D1f0EzAFnVgpsByKoW3AzAr9dqAc7mUbe0kIcIAAAAAElFTkSuQmCC" 
                        style="width: 20px; height: 20px;">
                    ${state === 'loading' ? '分析中...' : '分析结果'}
                </span>
                <div class="button-group" style="display: flex; gap: 8px;">
                    <button class="jp-helper-settings" style="
                        padding: 6px 12px;
                        background: #6b7280;
                        color: white;
                        border: none;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 14px;
                        font-weight: 500;
                        transition: all 0.2s ease;
                        min-width: 64px;
                    ">设置</button>
                    <button class="jp-helper-toggle" style="
                        padding: 6px 12px;
                        background: #6b7280;
                        color: white;
                        border: none;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 14px;
                        font-weight: 500;
                        transition: all 0.2s ease;
                        min-width: 64px;
                    ">显示</button>
                    <button class="jp-helper-copy" style="
                        padding: 6px 12px;
                        background: #3b82f6;
                        color: white;
                        border: none;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 14px;
                        font-weight: 500;
                        transition: all 0.2s ease;
                        min-width: 64px;
                    ">复制</button>
                    <button class="jp-helper-anki" style="
                        padding: 6px 12px;
                        background: #6366f1;
                        color: white;
                        border: none;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 14px;
                        font-weight: 500;
                        transition: all 0.2s ease;
                        min-width: 64px;
                    ">保存到Anki</button>
                    <button class="jp-helper-refresh" style="
                        padding: 6px 12px;
                        background: #10b981;
                        color: white;
                        border: none;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 14px;
                        font-weight: 500;
                        transition: all 0.2s ease;
                        min-width: 64px;
                    ">刷新</button>
                    <button class="jp-helper-close" style="
                        padding: 6px 12px;
                        background: #ef4444;
                        color: white;
                        border: none;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 14px;
                        font-weight: 500;
                        transition: all 0.2s ease;
                        min-width: 64px;
                    ">关闭</button>
                </div>
            </div>
        `;
        let body = '';
        switch (state) {
            case 'loading':
                body = `
                    <div class="content-container">
                        <div style="text-align: center; padding: 20px;">
                            <div class="loading-spinner"></div>
                            <p class="loading-text" style="margin-top: 16px; color: #666;">分析中...</p>
                        </div>
                    </div>
                `;
                // 在分析中禁用Anki和复制按钮
                setTimeout(() => {
                    const ankiBtn = panel.querySelector('.jp-helper-anki');
                    const copyBtn = panel.querySelector('.jp-helper-copy');
                    [ankiBtn, copyBtn].forEach(btn => {
                        if (btn) {
                            btn.disabled = true;
                            btn.style.background = '#9ca3af';
                            btn.style.cursor = 'not-allowed';
                        }
                    });
                }, 0);
                break;
            case 'error':
                body = `
                    <div class="content-container">
                        <div style="padding: 20px;">
                            <h3 style="color: #dc3545; margin: 0 0 16px;">发生错误</h3>
                            <p style="color: #666;">${content}</p>
                        </div>
                    </div>
                `;
                break;
            case 'success':
                const result = markdownit().render(content);
                content = result.replace(/\n/g, "");
                logger.data('解析后的内容', content);
                const sT = `<p><strong>原文</strong>：${selectedText}</p>`;
                body = `
                    <div class="content-container">
                        <div class="analysis-result">
                            <div style="position: sticky; top: 0; background: white; z-index: 1; padding-top: 20px;">
                                ${sT}
                                <hr style="border: 0; height: 1px; background: #e5e7eb; margin: 16px 0;">
                            </div>
                            ${content}
                        </div>
                    </div>
                `;

                // 确保在成功状态下启用按钮
                setTimeout(() => {
                    const ankiBtn = panel.querySelector('.jp-helper-anki');
                    const copyBtn = panel.querySelector('.jp-helper-copy');
                    if (ankiBtn) {
                        ankiBtn.disabled = false;
                        ankiBtn.style.background = '#6366f1';
                        ankiBtn.style.cursor = 'pointer';
                    }
                    if (copyBtn) {
                        copyBtn.disabled = false;
                        copyBtn.style.background = '#3b82f6';
                        copyBtn.style.cursor = 'pointer';
                    }
                }, 0);
                break;
        }
        panel.innerHTML = header + body;
        // 恢复transform
        panel.style.transform = currentTransform;
        // 保存当前文本用于刷新
        panel.dataset.selectedText = selectedText;
        // 恢复内容显示状态
        const contentContainer = panel.querySelector('.content-container');
        if (contentContainer) {
            contentContainer.style.display = panel.dataset.contentHidden === 'true' ? 'none' : 'block';
        }
        // 更新切换按钮文本
        const toggleBtn = panel.querySelector('.jp-helper-toggle');
        if (toggleBtn) {
            toggleBtn.textContent = panel.dataset.contentHidden === 'true' ? '显示' : '隐藏';
        }
        // 绑定按钮事件
        panel.querySelector('.jp-helper-close').onclick = () => panel.style.display = 'none';
        panel.querySelector('.jp-helper-refresh').onclick = async () => {
            const savedText = panel.dataset.selectedText;
            if (savedText) {
                const currentTransform = panel.style.transform;
                updateUI(panel, 'loading', '', savedText);
                panel.style.transform = currentTransform;
                try {
                    // 传入 skipCache = true 跳过缓存
                    const result = await analyzeText(savedText, true);
                    updateUI(panel, 'success', result, savedText);
                    panel.style.transform = currentTransform;
                } catch (error) {
                    updateUI(panel, 'error', error.message, savedText);
                    panel.style.transform = currentTransform;
                }
            }
        };
        panel.querySelector('.jp-helper-toggle').onclick = () => {
            const contentContainer = panel.querySelector('.content-container');
            const isHidden = contentContainer.style.display === 'none';
            
            // 保存当前transform值
            const transform = window.getComputedStyle(panel).transform;
            const matrix = new DOMMatrix(transform);
            const currentX = matrix.m41;
            const currentY = matrix.m42;
            
            contentContainer.style.display = isHidden ? 'block' : 'none';
            panel.dataset.contentHidden = !isHidden;
            panel.querySelector('.jp-helper-toggle').textContent = isHidden ? '隐藏' : '显示';
            
            // 保持当前位置
            if (transform !== 'none') {
                panel.style.transform = `translate(${currentX}px, ${currentY}px)`;
            }
        };
        panel.querySelector('.jp-helper-copy').onclick = () => {
            const contentContainer = panel.querySelector('.content-container');
            if (contentContainer) {
                const textToCopy = contentContainer.innerText;
                handleCopyOperation(panel.querySelector('.jp-helper-copy'), textToCopy);
            }
        };
        // 添加Anki按钮事件
        const ankiBtn = panel.querySelector('.jp-helper-anki');
        if (ankiBtn) {
            ankiBtn.onclick = async () => {
                    const originalText = selectedText;
                    const analysisResult = content;
                await handleAnkiOperation(ankiBtn, originalText, analysisResult);
            };
        }
        // 添加设置按钮事件
        const settingsBtn = panel.querySelector('.jp-helper-settings');
        if (settingsBtn) {
            const settingsPanel = document.querySelector('.jp-helper-settings-panel');
            settingsBtn.onclick = () => {
                if (settingsPanel) {
                    settingsPanel.style.display = 'flex';
                }
            };
        }
    }
    // 拖拽功能
    function enableDrag(element) {
        let isDragging = false;
        let currentX = -window.innerWidth / 2;  // 初始位置为中心
        let currentY = -window.innerHeight / 2;
        let initialX = 0, initialY = 0;
        function dragStart(e) {
            if (!e.target.classList.contains('drag-handle')) return;
            
            isDragging = true;
            
            // 获取当前transform的值
            const transform = window.getComputedStyle(element).transform;
            const matrix = new DOMMatrix(transform);
            currentX = matrix.m41;
            currentY = matrix.m42;
            
            initialX = e.clientX - currentX;
            initialY = e.clientY - currentY;
            
            // 添加拖拽时的鼠标样式
            document.body.style.cursor = 'move';
            e.target.style.cursor = 'move';
        }
        function dragEnd() {
            if (!isDragging) return;
            
            isDragging = false;
            
            // 恢复鼠标样式
            document.body.style.cursor = '';
            const dragHandle = element.querySelector('.drag-handle');
            if (dragHandle) {
                dragHandle.style.cursor = 'move';
            }
        }
        function drag(e) {
            if (!isDragging) return;
            
            e.preventDefault();
            
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            element.style.transform = `translate(${currentX}px, ${currentY}px)`;
        }
        element.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);
        document.addEventListener('mouseleave', dragEnd);
        return {
            reset: () => {
                currentX = -window.innerWidth / 2;  // 重置到中心位置
                currentY = -window.innerHeight / 2;
                element.style.transform = 'translate(-50%, -50%)';
            }
        };
    }
    // 添加资源预加载
    function preloadResources() {
        // 预加载 markdown-it
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'script';
        link.href = 'https://cdn.jsdelivr.net/npm/markdown-it@14.1.0/dist/markdown-it.min.js';
        document.head.appendChild(link);
    }

    // 添加内存管理
    function cleanupCache() {
        try {
            const cache = GM_getValue(CACHE_KEY, {});
            const now = Date.now();
            const entries = Object.entries(cache);
            
            // 清理过期缓存（超过24小时）
            const cleanedCache = entries.reduce((acc, [key, value]) => {
                if (now - value.timestamp < 24 * 60 * 60 * 1000) {
                    acc[key] = value;
                }
                return acc;
            }, {});
            
            // 如果清理后的缓存大小发生变化，则保存
            if (Object.keys(cleanedCache).length !== entries.length) {
                GM_setValue(CACHE_KEY, cleanedCache);
                logger.debug('清理过期缓存完成');
            }
        } catch (error) {
            logger.error('清理缓存失败:', error);
        }
    }

    // 修改初始化函数
    async function initialize() {
        try {
            // 预加载资源
            preloadResources();
            
            // 清理过期缓存
            cleanupCache();
            
            // 1. 加载依赖
            await loadDependencies();
            addStyles();
            
            // 2. 创建 UI
            const { menu, button, panel } = createUI();
            const dragHandler = enableDrag(panel);
            // 创建设置面板
            const settingsPanel = createSettingsPanel();

            // 防抖处理的文本分析
            const debouncedAnalyze = debounce(async (text, panel, dragHandler) => {
                try {
                    updateUI(panel, 'loading', '', text);
                    const result = await analyzeText(text);
                    updateUI(panel, 'success', result, text);
                    logger.state('analysis_complete', { success: true });
                } catch (error) {
                    logger.error('分析失败:', error);
                    updateUI(panel, 'error', error.message, text);
                    logger.state('analysis_complete', { success: false, error: error.message });
                }
            }, 500);

            // 分析选中文本的函数
            const analyzeSelectedText = async () => {
                const selectedText = window.getSelection().toString().trim();
                if (!selectedText) {
                    logger.debug('没有选中文本，退出处理');
                    return;
                }

                logger.debug('选中文本:', { length: selectedText.length });
                logger.data('选中的具体内容', selectedText);

                menu.style.display = 'none';
                panel.style.display = 'block';
                dragHandler.reset();

                logger.state('panel_opened', { 
                    text_length: selectedText.length,
                    window_width: window.innerWidth,
                    window_height: window.innerHeight,
                    panel_position: {
                        left: panel.offsetLeft,
                        top: panel.offsetTop
                    }
                });

                await debouncedAnalyze(selectedText, panel, dragHandler);
            };

            // 3. 事件处理
            button.onclick = analyzeSelectedText;

            // 添加快捷键支持
            document.addEventListener('keydown', async (e) => {
                // Ctrl/Cmd + Shift + A 快速分析
                if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
                    e.preventDefault();
                    await analyzeSelectedText();
                }
                // Ctrl/Cmd + Shift + X 关闭面板
                else if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'x') {
                    e.preventDefault();
                    panel.style.display = 'none';
                }
                // Ctrl/Cmd + Shift + S 打开设置
                else if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 's') {
                    e.preventDefault();
                    if (settingsPanel) {
                        settingsPanel.style.display = 'flex';
                    }
                }
            });

            // 4. 选中文本处理
            document.addEventListener('mouseup', function(e) {
                setTimeout(() => {
                    const selection = window.getSelection();
                    const selectedText = selection.toString().trim();
                    if (!selectedText || menu.contains(e.target) || panel.contains(e.target)) {
                        return;
                    }
                    const range = selection.getRangeAt(0);
                    const rect = range.getBoundingClientRect();
                    
                    // 先获取菜单的尺寸
                    menu.style.visibility = 'hidden';
                    menu.style.display = 'block';
                    const menuRect = menu.getBoundingClientRect();
                    menu.style.display = 'none';
                    menu.style.visibility = 'visible';
                    
                    // 计算菜单位置：默认显示在选中文本的正上方
                    const menuX = rect.left + window.pageXOffset;
                    const menuY = rect.top + window.pageYOffset - menuRect.height - 10;
                    
                    const viewportWidth = window.innerWidth;
                    const viewportHeight = window.innerHeight;
                    
                    // 如果菜单会超出右边界，则向左调整
                    let finalX = menuX;
                    if (menuX + menuRect.width > viewportWidth) {
                        finalX = viewportWidth - menuRect.width - 5;
                    }
                    
                    // 如果菜单会超出顶部边界，则显示在选中文本的下方
                    let finalY = menuY;
                    if (menuY < window.pageYOffset) {
                        finalY = rect.bottom + window.pageYOffset + 10;
                    }
                    
                    Object.assign(menu.style, {
                        left: `${finalX}px`,
                        top: `${finalY}px`,
                        display: 'block'
                    });
                    
                    logger.debug('显示菜单', {
                        selectedTextRect: {
                            left: rect.left,
                            right: rect.right,
                            top: rect.top,
                            bottom: rect.bottom
                        },
                        menuPosition: {
                            x: finalX,
                            y: finalY
                        },
                        viewport: {
                            width: viewportWidth,
                            height: viewportHeight
                        }
                    });
                }, 10);
            });

            // 5. 其他事件
            document.addEventListener('mousedown', function(e) {
                if (!menu.contains(e.target) && !panel.contains(e.target)) {
                    menu.style.display = 'none';
                }
            });

            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    panel.style.display = 'none';
                    settingsPanel.style.display = 'none';
                }
            });

            logger.info('日语学习助手初始化完成');
        } catch (error) {
            logger.error('初始化失败', error);
        }
    }
    // Anki Connect 功能
    async function invokeAnkiConnect(action, params = {}) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: CONFIG.ankiConnect.endpoint,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({
                    action,
                    version: 6,
                    params: params
                }),
                onload: function(response) {
                    try {
                        const result = JSON.parse(response.responseText);
                        if (result.error) {
                            reject(new Error(result.error));
                        } else {
                            resolve(result);
                        }
                    } catch (error) {
                        reject(error);
                    }
                },
                onerror: function(error) {
                    reject(new Error('Anki Connect请求失败'));
                },
                ontimeout: function() {
                    reject(new Error('Anki Connect请求超时'));
                },
                timeout: CONFIG.ankiConnect.timeout
            });
        });
    }
    async function addNoteToAnki(japaneseText, analysisResult) {
        try {
            logger.debug('开始添加/更新Anki笔记');
            logger.data('输入参数', { japaneseText, analysisResult });
            logger.data('当前Anki配置', CONFIG.ankiConnect);
            // 检查deck是否存在，不存在则创建
            logger.debug('检查并创建牌组:', CONFIG.ankiConnect.deckName);
            const createDeckResult = await invokeAnkiConnect('createDeck', {
                deck: CONFIG.ankiConnect.deckName
            });
            logger.data('创建牌组结果', createDeckResult);
            // 构建笔记字段
            const fields = {
                '单词': japaneseText,
                '释义': analysisResult,
                '笔记': document.title || '',
                '来源': window.location.href
            };
            logger.data('构建的笔记字段', fields);
            // 查找现有笔记
            const query = `deck:"${CONFIG.ankiConnect.deckName}" "单词:${japaneseText}"`;
            logger.debug('查找现有笔记，查询语句:', query);
            const existingNotes = await invokeAnkiConnect('findNotes', { query });
            logger.data('查找结果', existingNotes);
            if (existingNotes?.result?.length > 0) {
                const noteId = existingNotes.result[0];
                logger.debug('找到现有笔记，ID:', noteId);
                const noteInfo = await invokeAnkiConnect('notesInfo', { notes: [noteId] });
                logger.data('现有笔记信息', noteInfo);
                if (!noteInfo?.result?.[0]?.fields) {
                    throw new Error('获取现有笔记信息失败');
                }
                const existingNote = noteInfo.result[0];
                const existingContent = existingNote.fields.释义.value;
                const existingTags = existingNote.tags || [];
                logger.data('现有笔记内容', { existingContent, existingTags });
                const newTags = [...new Set([...existingTags, '日语助手', '自动更新'])];
                logger.data('合并后的标签', newTags);
                return {
                    type: 'duplicate',
                    noteId,
                    existingContent,
                    newContent: analysisResult,
                    tags: newTags
                };
            }
            // 创建新笔记
            logger.debug('创建新笔记');
            const note = {
                deckName: CONFIG.ankiConnect.deckName,
                modelName: CONFIG.ankiConnect.modelName,
                fields: fields,
                tags: ['日语助手', '自动添加'],
                options: {
                    duplicateScope: CONFIG.ankiConnect.duplicateScope
                }
            };
            logger.data('新笔记数据', note);
            const result = await invokeAnkiConnect('addNote', { note });
            logger.data('创建笔记结果', result);
            logger.debug('创建新笔记成功');
            return { type: 'create', noteId: result };
        } catch (error) {
            logger.error('添加Anki笔记失败:', error);
            logger.data('错误详情', {
                message: error.message,
                stack: error.stack,
                japaneseText,
                analysisResult,
                ankiConfig: CONFIG.ankiConnect
            });
            throw error;
        }
    }
    // UI 状态更新中的Anki按钮处理
    const handleAnkiOperation = async (ankiBtn, originalText, analysisResult) => {
        try {
            logger.debug('开始Anki操作');
            logger.data('操作参数', { 
                originalText, 
                analysisResult,
                buttonState: {
                    text: ankiBtn.textContent,
                    disabled: ankiBtn.disabled,
                    style: ankiBtn.style.cssText
                }
            });
            ankiBtn.textContent = '处理中...';
            ankiBtn.disabled = true;
            ankiBtn.style.background = '#9ca3af';
            ankiBtn.style.cursor = 'not-allowed';
            logger.debug('按钮状态已更新为处理中');
            const result = await addNoteToAnki(originalText, analysisResult);
            logger.data('Anki操作结果', result);
            if (result.type === 'duplicate') {
                logger.debug('检测到重复笔记，显示比较对话框');
                // 创建比较对话框
                const compareDialog = document.createElement('div');
                compareDialog.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: #ffffff;
                    padding: 32px;
                    border-radius: 16px;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                    z-index: 10002;
                    max-width: 1200px;
                    width: 95%;
                    max-height: 85vh;
                    display: flex;
                    flex-direction: column;
                    border: 1px solid #e5e7eb;
                    gap: 24px;
                `;
                compareDialog.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <h3 style="
                            color: #111827;
                            font-size: 20px;
                            font-weight: 600;
                            margin: 0;
                            letter-spacing: -0.025em;
                        ">已存在的笔记</h3>
                        <div style="display: flex; gap: 12px;">
                            <button class="update-btn" style="
                                padding: 10px 20px;
                                background: #ffffff;
                                color: #059669;
                                border: 2px solid #059669;
                                border-radius: 8px;
                                cursor: pointer;
                                font-size: 14px;
                                font-weight: 600;
                                box-shadow: 2px 2px 0 #059669;
                                transition: all 0.2s ease;
                                display: inline-flex;
                                align-items: center;
                                gap: 6px;
                            ">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                                    <polyline points="17 21 17 13 7 13 7 21"></polyline>
                                    <polyline points="7 3 7 8 15 8"></polyline>
                                </svg>
                                更新笔记
                            </button>
                            <button class="cancel-btn" style="
                                padding: 10px 20px;
                                background: #ffffff;
                                color: #dc2626;
                                border: 2px solid #dc2626;
                                border-radius: 8px;
                                cursor: pointer;
                                font-size: 14px;
                                font-weight: 600;
                                box-shadow: 2px 2px 0 #dc2626;
                                transition: all 0.2s ease;
                                display: inline-flex;
                                align-items: center;
                                gap: 6px;
                            ">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                                取消
                            </button>
                        </div>
                    </div>
                    <div class="compare-dialog-content" style="
                        overflow-y: auto;
                        max-height: calc(85vh - 120px);
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 32px;
                        padding-right: 12px;
                    ">
                        <div>
                            <h4 style="
                                color: #4b5563;
                                margin: 0 0 16px;
                                font-size: 15px;
                                font-weight: 600;
                                position: sticky;
                                top: 0;
                                background: white;
                                padding: 8px 0;
                                z-index: 1;
                                display: flex;
                                align-items: center;
                                gap: 8px;
                            ">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                    <polyline points="14 2 14 8 20 8"></polyline>
                                    <line x1="16" y1="13" x2="8" y2="13"></line>
                                    <line x1="16" y1="17" x2="8" y2="17"></line>
                                    <polyline points="10 9 9 9 8 9"></polyline>
                                </svg>
                                现有释义
                            </h4>
                            <div style="
                                background: #f8fafc;
                                padding: 20px;
                                border-radius: 12px;
                                border: 1px solid #e2e8f0;
                                font-size: 14px;
                                line-height: 1.6;
                                color: #334155;
                            ">
                                ${result.existingContent}
                            </div>
                        </div>
                        <div>
                            <h4 style="
                                color: #4b5563;
                                margin: 0 0 16px;
                                font-size: 15px;
                                font-weight: 600;
                                position: sticky;
                                top: 0;
                                background: white;
                                padding: 8px 0;
                                z-index: 1;
                                display: flex;
                                align-items: center;
                                gap: 8px;
                            ">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                    <polyline points="14 2 14 8 20 8"></polyline>
                                    <line x1="12" y1="18" x2="12" y2="12"></line>
                                    <line x1="9" y1="15" x2="15" y2="15"></line>
                                </svg>
                                新释义
                            </h4>
                            <div style="
                                background: #f0fdf4;
                                padding: 20px;
                                border-radius: 12px;
                                border: 1px solid #dcfce7;
                                font-size: 14px;
                                line-height: 1.6;
                                color: #334155;
                            ">
                                ${result.newContent}
                            </div>
                        </div>
                    </div>
                `;
                document.body.appendChild(compareDialog);
                logger.debug('比较对话框已创建并显示');
                // 添加点击事件
                const updateBtn = compareDialog.querySelector('.update-btn');
                const cancelBtn = compareDialog.querySelector('.cancel-btn');
                updateBtn.onclick = async () => {
                    try {
                        logger.debug('开始更新笔记');
                        logger.data('更新内容', {
                            noteId: result.noteId,
                            newContent: result.newContent,
                            title: document.title,
                            url: window.location.href
                        });
                        await invokeAnkiConnect('updateNote', {
                            note: {
                                id: result.noteId,
                                fields: {
                                    '释义': result.newContent,
                                    '笔记': document.title || '',
                                    '来源': window.location.href
                                },
                                tags: result.tags
                            }
                        });
                        logger.debug('笔记更新成功');
                        compareDialog.remove();
                        ankiBtn.textContent = '已更新';
                        ankiBtn.style.background = '#059669';
                        ankiBtn.style.color = 'white';
                        ankiBtn.disabled = true;
                        logger.debug('更新成功，UI已更新');
                    } catch (error) {
                        logger.error('更新笔记失败:', error);
                        logger.data('错误详情', {
                            message: error.message,
                            stack: error.stack,
                            noteId: result.noteId
                        });
                        ankiBtn.textContent = '更新失败';
                        ankiBtn.style.background = '#dc2626';
                        ankiBtn.style.color = 'white';
                        ankiBtn.disabled = true;
                    }
                    setTimeout(() => {
                        ankiBtn.textContent = '保存到Anki';
                        ankiBtn.style.background = '#6366f1';
                        ankiBtn.style.color = 'white';
                        ankiBtn.style.cursor = 'pointer';
                        ankiBtn.disabled = false;
                        logger.debug('按钮状态已重置');
                    }, 1500);
                };
                cancelBtn.onclick = () => {
                    logger.debug('用户取消更新操作');
                    compareDialog.remove();
                    ankiBtn.textContent = '保存到Anki';
                    ankiBtn.style.background = '#6366f1';
                    ankiBtn.style.color = 'white';
                    ankiBtn.style.cursor = 'pointer';
                    ankiBtn.disabled = false;
                    logger.debug('对话框已关闭，按钮状态已重置');
                };
                return;
            }
            if (result.type === 'update') {
                logger.debug('笔记更新完成');
                ankiBtn.textContent = '已更新';
            } else {
                logger.debug('新笔记创建完成');
                ankiBtn.textContent = '已保存';
            }
            ankiBtn.style.background = '#059669';
            ankiBtn.style.color = 'white';
            ankiBtn.disabled = true;
        } catch (error) {
            logger.error('Anki操作失败:', error);
            logger.data('错误详情', {
                message: error.message,
                stack: error.stack,
                originalText,
                analysisResult
            });
            ankiBtn.textContent = '保存失败';
            ankiBtn.style.background = '#dc2626';
            ankiBtn.style.color = 'white';
            ankiBtn.disabled = true;
        }
        setTimeout(() => {
            ankiBtn.textContent = '保存到Anki';
            ankiBtn.style.background = '#6366f1';
            ankiBtn.style.color = 'white';
            ankiBtn.style.cursor = 'pointer';
            ankiBtn.disabled = false;
            logger.debug('操作完成，按钮状态已重置');
        }, 1500);
    };
    // 复制按钮事件处理
    const handleCopyOperation = async (copyBtn, textToCopy) => {
        try {
            logger.debug('开始复制操作');
            logger.data('复制内容长度', textToCopy.length);
            await navigator.clipboard.writeText(textToCopy);
            logger.debug('内容已复制到剪贴板');
            copyBtn.textContent = '已复制';
            copyBtn.style.background = '#4ade80';
            copyBtn.style.color = '#064e3b';
            logger.debug('复制成功，按钮状态已更新');
        } catch (err) {
            logger.error('复制失败:', err);
            logger.data('错误详情', {
                message: err.message,
                stack: err.stack
            });
            copyBtn.textContent = '复制失败';
            copyBtn.style.background = '#fca5a5';
            copyBtn.style.color = '#7f1d1d';
        }
        setTimeout(() => {
            copyBtn.textContent = '复制';
            copyBtn.style.background = '#3b82f6';
            copyBtn.style.color = 'white';
            logger.debug('按钮状态已重置');
        }, 1500);
    };
    // 创建设置面板
    function createSettingsPanel() {
        const settingsPanel = document.createElement('div');
        settingsPanel.className = 'jp-helper-settings-panel';
        settingsPanel.innerHTML = `
            <div class="settings-header">
                <span style="font-weight: 600; font-size: 20px; color: #111827;">设置</span>
                <button class="settings-close">
                    关闭
                </button>
            </div>
            <div class="settings-content">
                <div class="settings-group">
                    <div class="settings-group-title">OpenAI 设置</div>
                    <div class="setting-item">
                        <label>API Key</label>
                        <div class="api-key-container">
                            <input type="password" id="apiKey" value="${CONFIG.apiKey}">
                            <button class="toggle-password" type="button" aria-label="显示密码">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div class="setting-item">
                        <label>API 端点</label>
                        <input type="text" id="apiEndpoint" value="${CONFIG.apiEndpoint}">
                    </div>
                    <div class="setting-item">
                        <label>模型</label>
                        <select id="model">
                            ${CONFIG.models.map(model => `
                                <option value="${model}" ${CONFIG.model === model ? 'selected' : ''}>
                                    ${model}
                                </option>
                            `).join('')}
                        </select>
                    </div>
                </div>
                <div class="settings-group">
                    <div class="settings-group-title">分析设置</div>
                    <div class="setting-item">
                        <label>最大文本长度</label>
                        <input type="number" id="maxTextLength" value="${CONFIG.maxTextLength}">
                        <div class="help-text">单次分析的最大字符数限制</div>
                    </div>
                    <div class="setting-item">
                        <label>请求超时时间</label>
                        <input type="number" id="requestTimeout" value="${CONFIG.requestTimeout}">
                        <div class="help-text">API请求超时时间（毫秒）</div>
                    </div>
                    <div class="setting-item">
                        <label>系统提示词</label>
                        <textarea id="systemPrompt">${CONFIG.systemPrompt}</textarea>
                        <div class="help-text">用于指导AI分析的系统提示词</div>
                    </div>
                </div>
                <div class="settings-group">
                    <div class="settings-group-title">Anki 设置</div>
                    <div class="setting-item">
                        <label>AnkiConnect 端点</label>
                        <input type="text" id="ankiEndpoint" value="${CONFIG.ankiConnect.endpoint}">
                        <div class="help-text">需要安装 AnkiConnect 插件（2055492159）</div>
                    </div>
                    <div class="setting-item">
                        <label>牌组名称</label>
                        <input type="text" id="deckName" value="${CONFIG.ankiConnect.deckName}">
                        <div class="help-text">如果牌组不存在会自动创建</div>
                    </div>
                    <div class="setting-item">
                        <label>模板名称</label>
                        <input type="text" id="modelName" value="${CONFIG.ankiConnect.modelName}">
                        <div class="help-text">
                            必需字段（其他字段可选）：<br>
                            - 单词：存储选中的日语原文<br>
                            - 释义：存储分析结果<br>
                            - 笔记：存储页面标题<br>
                            - 来源：存储页面URL
                        </div>
                    </div>
                </div>
            </div>
            <div class="settings-footer">
                <button class="settings-cancel">取消</button>
                <button class="settings-save">保存</button>
            </div>
        `;
        document.body.appendChild(settingsPanel);
        // 绑定事件
        const closeBtn = settingsPanel.querySelector('.settings-close');
        const cancelBtn = settingsPanel.querySelector('.settings-cancel');
        const saveBtn = settingsPanel.querySelector('.settings-save');
        const togglePasswordBtn = settingsPanel.querySelector('.toggle-password');
        const apiKeyInput = settingsPanel.querySelector('#apiKey');
        closeBtn.onclick = cancelBtn.onclick = () => {
            settingsPanel.style.display = 'none';
        };
        togglePasswordBtn.onclick = () => {
            const type = apiKeyInput.type === 'password' ? 'text' : 'password';
            apiKeyInput.type = type;
            togglePasswordBtn.innerHTML = type === 'password' ? 
                '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>' :
                '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>';
        };
        saveBtn.onclick = async () => {
            try {
                const newConfig = {
                    apiKey: settingsPanel.querySelector('#apiKey').value,
                    apiEndpoint: settingsPanel.querySelector('#apiEndpoint').value,
                    models: CONFIG.models,
                    model: settingsPanel.querySelector('#model').value,
                    maxTextLength: parseInt(settingsPanel.querySelector('#maxTextLength').value),
                    requestTimeout: parseInt(settingsPanel.querySelector('#requestTimeout').value),
                    systemPrompt: settingsPanel.querySelector('#systemPrompt').value,
                    ankiConnect: {
                        endpoint: settingsPanel.querySelector('#ankiEndpoint').value,
                        deckName: settingsPanel.querySelector('#deckName').value,
                        modelName: settingsPanel.querySelector('#modelName').value,
                        timeout: CONFIG.ankiConnect.timeout,
                        duplicateScope: CONFIG.ankiConnect.duplicateScope
                    }
                };

                // 基本验证
                if (!newConfig.apiKey) throw new Error('API Key 不能为空');
                if (!newConfig.apiEndpoint) throw new Error('API 端点不能为空');
                if (!newConfig.ankiConnect.endpoint) throw new Error('AnkiConnect 端点不能为空');
                if (!newConfig.ankiConnect.deckName) throw new Error('牌组名称不能为空');
                if (!newConfig.ankiConnect.modelName) throw new Error('模板名称不能为空');

                saveBtn.textContent = '保存中...';
                saveBtn.disabled = true;
                await saveConfig(newConfig);
                settingsPanel.style.display = 'none';
            } catch (error) {
                logger.error('保存配置失败:', error);
                const errorText = error.message || '保存配置失败';
                saveBtn.textContent = errorText;
                saveBtn.style.background = '#ef4444';
                setTimeout(() => {
                    saveBtn.textContent = '保存';
                    saveBtn.style.background = '#3b82f6';
                    saveBtn.disabled = false;
                }, 2000);
            }
        };
        return settingsPanel;
    }
    // 添加定期清理任务
    setInterval(cleanupCache, 60 * 60 * 1000);
    
    // 启动
    try {
        initialize();
    } catch (error) {
        logger.error('初始化失败:', error);
        const errorMessage = error.message.includes('API') ? 
            '请先在设置中配置正确的API信息' : 
            '初始化失败，请刷新页面重试';

        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            background: #fee2e2;
            border: 1px solid #ef4444;
            border-radius: 8px;
            color: #dc2626;
            font-size: 14px;
            z-index: 10000;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            max-width: 400px;
            word-break: break-word;
            animation: slideIn 0.3s ease;
        `;
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px;">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 9v5m0 0h2m-2 0H9m2-9h.01" 
                        stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <span>${errorMessage}</span>
            </div>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    // 添加所有样式
    const style = document.createElement('style');
    style.textContent = `
        .loading-spinner {
            display: inline-block;
            width: 40px;
            height: 40px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid #4CAF50;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
})();
