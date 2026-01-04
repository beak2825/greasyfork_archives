// ==UserScript==
// @name         ComfyUI插图脚本
// @namespace    http://tampermonkey.net/
// @version      41// UI优化：全新配色方案，深色渐变主题，蓝色科技风，增强交互动效
// @license      GPL
// @description  移除轮询，使用WebSocket实时接收生成结果。IndexedDB无限容量缓存、自动暗黑模式、双指缩放、GPU硬件加速、requestIdleCallback非阻塞压缩、防抖节流性能优化、LRU智能淘汰、生成历史管理等完整功能。全新UI设计。
// @author       feng zheng (升级 by Gemini, 终极优化 by Claude)
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @require      https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.7.5/socket.io.min.js
// @require      https://code.jquery.com/ui/1.13.2/jquery-ui.min.js
// @downloadURL https://update.greasyfork.org/scripts/538457/ComfyUI%E6%8F%92%E5%9B%BE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/538457/ComfyUI%E6%8F%92%E5%9B%BE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- Configuration Constants ---
    const BUTTON_ID = 'comfyui-launcher-button';
    const PANEL_ID = 'comfyui-panel';
    const STORAGE_KEY_IMAGES = 'comfyui_generated_images';
    const STORAGE_KEY_MODELS = 'comfyui_available_models';
    const STORAGE_KEY_MODELS_UPDATED_AT = 'comfyui_available_models_updated_at';
    const STORAGE_KEY_PROMPT_PREFIX = 'comfyui_prompt_prefix';
    const STORAGE_KEY_MAX_WIDTH = 'comfyui_image_max_width';
    const STORAGE_KEY_CACHE_LIMIT = 'comfyui_cache_limit';
    const STORAGE_KEY_USER_INFO = 'comfyui_user_info';
    const STORAGE_KEY_USER_INFO_UPDATED_AT = 'comfyui_user_info_updated_at';
    const COOLDOWN_DURATION_MS = 60000;
    const CONFIG_VERSION = '2.0';
    const ENCRYPTION_KEY = 42; // 简单的XOR密钥

    // --- Notification Manager ---
    function showNotification(message, type = 'info', level = 'standard') {
        if (typeof toastr === 'undefined') return;

        const userLevel = cachedSettings.notificationLevel;

        // silent: 只显示错误
        // standard: 显示成功和错误
        // verbose: 显示所有

        if (userLevel === 'silent' && type !== 'error') return;
        if (userLevel === 'standard' && type === 'info') return;

        toastr[type](message);
    }

    // --- Security and Utility Functions ---
    function encryptApiKey(key) {
        if (!key) return '';
        try {
            return btoa(key.split('').map(c => String.fromCharCode(c.charCodeAt(0) ^ ENCRYPTION_KEY)).join(''));
        } catch (e) {
            console.error('API密钥加密失败:', e);
            return key;
        }
    }

    function decryptApiKey(encryptedKey) {
        if (!encryptedKey) return '';
        try {
            return atob(encryptedKey).split('').map(c => String.fromCharCode(c.charCodeAt(0) ^ ENCRYPTION_KEY)).join('');
        } catch (e) {
            console.error('API密钥解密失败:', e);
            return encryptedKey;
        }
    }

    function sanitizePrompt(prompt) {
        if (!prompt || typeof prompt !== 'string') return '';

        // 创建临时div元素进行HTML转义
        const div = document.createElement('div');
        div.textContent = prompt;

        return div.innerHTML
            .replace(/[<>]/g, '') // 移除尖括号
            .replace(/javascript:/gi, '') // 移除javascript:协议
            .replace(/on\w+\s*=/gi, '') // 移除事件处理器
            .trim();
    }

    function validateUrl(url) {
        if (!url || typeof url !== 'string') return false;
        try {
            const urlObj = new URL(url);
            // 强制要求HTTPS（除了localhost）
            if (urlObj.hostname !== 'localhost' && urlObj.hostname !== '127.0.0.1' && urlObj.protocol !== 'https:') {
                return false;
            }
            return ['http:', 'https:'].includes(urlObj.protocol);
        } catch (e) {
            return false;
        }
    }

    function validateConfig(config) {
        const errors = [];

        if (!config.comfyuiUrl || typeof config.comfyuiUrl !== 'string') {
            errors.push('调度器URL无效');
        } else if (!validateUrl(config.comfyuiUrl)) {
            errors.push('调度器URL格式错误或不安全');
        }

        if (config.maxWidth && (typeof config.maxWidth !== 'number' || config.maxWidth < 100 || config.maxWidth > 2000)) {
            errors.push('图片最大宽度必须在100-2000像素之间');
        }

        if (config.cacheLimit && (typeof config.cacheLimit !== 'number' || config.cacheLimit < 1 || config.cacheLimit > 100)) {
            errors.push('缓存限制必须在1-100之间');
        }

        return errors;
    }

    // --- Error Handling Classes ---
    class ComfyUIError extends Error {
        constructor(message, type = 'UNKNOWN', details = {}) {
            super(message);
            this.name = 'ComfyUIError';
            this.type = type;
            this.details = details;
            this.timestamp = Date.now();
        }
    }

    class ErrorHandler {
        static handle(error, context = '') {
            const errorLog = {
                message: error.message || '未知错误',
                type: error.type || 'UNKNOWN',
                context,
                timestamp: error.timestamp || Date.now(),
                stack: error.stack
            };

            console.error('[ComfyUI Error]', errorLog);

            const userMessage = this.getUserFriendlyMessage(error.type, error.message);
            if (typeof toastr !== 'undefined') {
                toastr.error(userMessage);
            }

            return errorLog;
        }

        static getUserFriendlyMessage(type, originalMessage) {
            const messages = {
                'NETWORK': '网络连接失败，请检查网络连接和服务器状态',
                'AUTH': '身份验证失败，请检查API密钥是否正确',
                'GENERATION': '图片生成失败，请稍后重试',
                'CONFIG': '配置错误，请检查设置',
                'VALIDATION': '输入验证失败，请检查输入内容',
                'CACHE': '缓存操作失败',
                'WEBSOCKET': 'WebSocket连接失败，将尝试重新连接'
            };

            return messages[type] || originalMessage || '操作失败，请重试';
        }
    }

    // --- Smart Reconnection System ---
    class SmartReconnector {
        constructor(getWsUrl, onConnect, onDisconnect) {
            this.getWsUrl = getWsUrl;
            this.onConnect = onConnect;
            this.onDisconnect = onDisconnect;
            this.reconnectAttempts = 0;
            this.maxAttempts = 10;
            this.baseDelay = 1000;
            this.maxDelay = 30000;
            this.isOnline = navigator.onLine;
            this.setupNetworkMonitoring();
        }

        setupNetworkMonitoring() {
            window.addEventListener('online', () => {
                this.isOnline = true;
                if (typeof toastr !== 'undefined') {
                    toastr.success('网络连接已恢复，正在重新连接...');
                }
                this.reconnect();
            });

            window.addEventListener('offline', () => {
                this.isOnline = false;
                if (typeof toastr !== 'undefined') {
                    toastr.warning('网络连接已断开，将在恢复后自动重连');
                }
                this.onDisconnect();
            });
        }

        async reconnect() {
            if (!this.isOnline) {
                console.log('网络离线，暂停重连尝试');
                return false;
            }

            if (this.reconnectAttempts >= this.maxAttempts) {
                this.showPermanentDisconnectionNotice();
                return false;
            }

            const delay = Math.min(
                this.baseDelay * Math.pow(2, this.reconnectAttempts),
                this.maxDelay
            );

            console.log(`尝试重连 (${this.reconnectAttempts + 1}/${this.maxAttempts})，延迟 ${delay}ms`);

            await this.wait(delay);

            try {
                await this.attemptConnection();
                this.reconnectAttempts = 0;
                if (typeof toastr !== 'undefined') {
                    toastr.success('WebSocket连接已恢复！');
                }
                return true;
            } catch (error) {
                this.reconnectAttempts++;
                console.warn(`重连失败 (${this.reconnectAttempts}/${this.maxAttempts}):`, error.message);
                return this.reconnect();
            }
        }

        async attemptConnection() {
            return new Promise((resolve, reject) => {
                try {
                    const wsUrl = this.getWsUrl();
                    if (!wsUrl) {
                        throw new ComfyUIError('WebSocket URL未配置', 'CONFIG');
                    }

                    const testSocket = io(wsUrl, {
                        timeout: 5000,
                        reconnection: false
                    });

                    const connectTimeout = setTimeout(() => {
                        testSocket.disconnect();
                        reject(new ComfyUIError('连接超时', 'WEBSOCKET'));
                    }, 5000);

                    testSocket.on('connect', () => {
                        clearTimeout(connectTimeout);
                        testSocket.disconnect();
                        this.onConnect();
                        resolve();
                    });

                    testSocket.on('connect_error', (error) => {
                        clearTimeout(connectTimeout);
                        reject(new ComfyUIError('连接失败: ' + error.message, 'WEBSOCKET'));
                    });

                } catch (error) {
                    reject(new ComfyUIError('连接尝试失败: ' + error.message, 'WEBSOCKET'));
                }
            });
        }

        wait(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        showPermanentDisconnectionNotice() {
            if (typeof toastr !== 'undefined') {
                toastr.error('无法连接到服务器，请检查网络和服务器状态');
            }

            // 在UI中显示离线提示
            this.showOfflineNotice();
        }

        showOfflineNotice() {
            // 移除现有的离线提示
            const existingNotice = document.querySelector('.comfy-offline-notice');
            if (existingNotice) {
                existingNotice.remove();
            }

            const notice = document.createElement('div');
            notice.className = 'comfy-offline-notice';
            notice.innerHTML = `
                <i class="fa fa-wifi-slash"></i>
                <span>连接断开，仅显示缓存内容</span>
                <button class="retry-connection">重试连接</button>
            `;

            notice.querySelector('.retry-connection').addEventListener('click', () => {
                notice.remove();
                this.reconnectAttempts = 0;
                this.reconnect();
            });

            document.body.appendChild(notice);
        }

        reset() {
            this.reconnectAttempts = 0;
        }
    }

    // --- Performance Monitor ---
    class PerformanceMonitor {
        constructor() {
            this.metrics = {};
            this.memoryCheckInterval = null;
        }

        startTimer(operation) {
            this.metrics[operation] = performance.now();
        }

        endTimer(operation) {
            if (this.metrics[operation]) {
                const duration = performance.now() - this.metrics[operation];
                console.log(`[Performance] ${operation}: ${duration.toFixed(2)}ms`);
                delete this.metrics[operation];
                return duration;
            }
            return 0;
        }

        trackMemoryUsage() {
            if (performance.memory) {
                const usage = {
                    used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
                    total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
                    limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
                };

                console.log(`[Memory] Used: ${usage.used}MB, Total: ${usage.total}MB, Limit: ${usage.limit}MB`);

                // 内存使用超过80%时发出警告
                if (usage.used / usage.limit > 0.8) {
                    console.warn('[Memory Warning] 内存使用过高，建议清理缓存');
                    if (typeof toastr !== 'undefined') {
                        toastr.warning('内存使用过高，建议清理图片缓存');
                    }
                }

                return usage;
            }
            return null;
        }

        startMemoryMonitoring(interval = 30000) {
            this.stopMemoryMonitoring();
            this.memoryCheckInterval = setInterval(() => {
                this.trackMemoryUsage();
            }, interval);
        }

        stopMemoryMonitoring() {
            if (this.memoryCheckInterval) {
                clearInterval(this.memoryCheckInterval);
                this.memoryCheckInterval = null;
            }
        }
    }

    // --- Global State Variables ---
    let globalCooldownEndTime = 0;
    let socket = null;
    let activePrompts = {}; // 存储 prompt_id -> { button, generationId } 的映射
    let pendingSubscriptions = new Set();
    let reconnector = null;
    let performanceMonitor = new PerformanceMonitor();
    let cachedDOMElements = {}; // DOM元素缓存
    let debugMode = false; // 调试模式开关

    // --- Cached User Settings ---
    let cachedSettings = {
        comfyuiUrl: 'https://www.fengzheng.dpdns.org',
        startTag: 'image###',
        endTag: '###',
        promptPrefix: '',
        maxWidth: 600,
        cacheLimit: 20,
        apiKey: '', // 将存储加密后的密钥
        defaultModel: 'Zimage',
        notificationLevel: 'silent', // 'silent' | 'standard' | 'verbose'
        enableRetry: true, // 启用自动重试
        retryCount: 3 // 重试次数
    };

    // --- Inject Custom CSS Styles ---
    GM_addStyle(`
        /* 新增：离线提示样式 */
        .comfy-offline-notice {
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(220, 53, 69, 0.9);
            color: white;
            padding: 10px 15px;
            border-radius: 5px;
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 10000;
            font-size: 14px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        }

        .comfy-offline-notice .retry-connection {
            background: rgba(255,255,255,0.2);
            border: 1px solid rgba(255,255,255,0.3);
            color: white;
            padding: 5px 10px;
            border-radius: 3px;
            cursor: pointer;
            font-size: 12px;
        }

        .comfy-offline-notice .retry-connection:hover {
            background: rgba(255,255,255,0.3);
        }

        /* 新增：缓存状态显示样式 */
        #comfyui-cache-status {
            margin-top: 15px;
            margin-bottom: 10px;
            padding: 12px; /* 【优化】增加内边距 */
            background: linear-gradient(90deg, rgba(30, 144, 255, 0.1) 0%, rgba(135, 206, 235, 0.1) 100%); /* 【优化】蓝色渐变背景 */
            border: 1px solid rgba(135, 206, 235, 0.3); /* 【优化】蓝色边框 */
            border-radius: 6px;
            text-align: center;
            font-size: 0.9em;
            color: #87CEEB; /* 【优化】蓝色文字 */
            font-weight: 500;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* 【优化】添加阴影 */
        }

        /* 新增：配置验证错误提示 */
        .comfy-config-error {
            background-color: rgba(220, 53, 69, 0.1);
            border: 1px solid #dc3545;
            color: #dc3545;
            padding: 8px;
            border-radius: 4px;
            margin: 10px 0;
            font-size: 0.9em;
        }

        /* 控制面板主容器样式 */
        #${PANEL_ID} {
            display: none;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 90vw;
            max-width: 500px;
            z-index: 9999;
            color: #e0e0e0; /* 【优化】使用固定的浅色文字 */
            background: linear-gradient(145deg, rgba(30, 30, 35, 0.98) 0%, rgba(20, 20, 25, 0.98) 100%); /* 【优化】渐变背景 */
            border: 1px solid rgba(135, 206, 235, 0.3); /* 【优化】蓝色边框 */
            border-radius: 12px; /* 【优化】更圆润 */
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(135, 206, 235, 0.1); /* 【优化】双层阴影 */
            padding: 15px;
            box-sizing: border-box;
            backdrop-filter: blur(20px); /* 【优化】增强毛玻璃效果 */
            flex-direction: column;
        }

        /* 面板标题栏 */
        #${PANEL_ID} .panel-control-bar {
            padding: 14px 18px; /* 【优化】增加内边距 */
            margin: -15px -15px 18px -15px;
            background: linear-gradient(135deg, rgba(135, 206, 235, 0.2) 0%, rgba(0, 191, 255, 0.25) 100%); /* 【优化】更明显的渐变 */
            border-bottom: 2px solid rgba(135, 206, 235, 0.4); /* 【优化】更粗的分隔线 */
            border-radius: 12px 12px 0 0; /* 【优化】匹配容器圆角 */
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-shrink: 0;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* 【优化】添加阴影 */
        }

        #${PANEL_ID} .panel-control-bar b {
            font-size: 1.15em; /* 【优化】稍大的字体 */
            margin-left: 10px;
            color: #87CEEB;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); /* 【优化】文字阴影 */
            font-weight: 600; /* 【优化】更粗的字体 */
        }

        #${PANEL_ID} .panel-control-bar .drag-grabber {
            color: #87CEEB;
            cursor: move;
            transition: color 0.3s; /* 【优化】过渡动画 */
        }

        #${PANEL_ID} .panel-control-bar .drag-grabber:hover {
            color: #00BFFF; /* 【优化】悬停变色 */
        }

        #${PANEL_ID} .floating_panel_close {
            cursor: pointer;
            font-size: 1.8em;
            color: #87CEEB;
            transition: transform 0.2s, color 0.2s;
            padding: 5px; /* 【优化】增加点击区域 */
        }

        #${PANEL_ID} .floating_panel_close:hover {
            transform: scale(1.15) rotate(90deg); /* 【优化】旋转动画 */
            color: #ff6b6b;
        }

        #${PANEL_ID} .comfyui-panel-content {
            overflow-y: auto;
            flex-grow: 1;
            padding-right: 5px;
            max-height: 70vh;
        }

        /* 设置分组样式 */
        .comfy-settings-group {
            margin-bottom: 20px;
            padding: 16px; /* 【优化】增加内边距 */
            background: linear-gradient(135deg, rgba(40, 40, 50, 0.4) 0%, rgba(30, 30, 40, 0.4) 100%); /* 【优化】渐变背景 */
            border: 1px solid rgba(135, 206, 235, 0.25); /* 【优化】更明显的边框 */
            border-radius: 8px; /* 【优化】更圆润 */
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2); /* 【优化】添加阴影 */
            transition: all 0.3s ease; /* 【优化】过渡动画 */
        }

        .comfy-settings-group:hover {
            border-color: rgba(135, 206, 235, 0.4); /* 【优化】悬停高亮 */
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .comfy-settings-group-title {
            font-size: 1.05em; /* 【优化】稍大的字体 */
            font-weight: 600;
            color: #87CEEB; /* 天蓝色 */
            margin-bottom: 14px;
            padding-bottom: 10px;
            border-bottom: 2px solid rgba(135, 206, 235, 0.3); /* 【优化】更粗的分隔线 */
            display: flex;
            align-items: center;
            gap: 10px;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); /* 【优化】文字阴影 */
        }

        .comfy-settings-group-title i {
            font-size: 1.1em; /* 【优化】图标稍大 */
            color: #00BFFF; /* 深天蓝色 */
        }

        .comfy-field {
            margin-bottom: 12px;
        }

        .comfy-field:last-child {
            margin-bottom: 0;
        }

        .comfy-field label {
            display: block;
            margin-bottom: 6px;
            font-size: 0.9em;
            color: #b0b0b0; /* 【优化】更浅的灰色 */
            font-weight: 500; /* 【优化】稍粗的字体 */
        }

        /* 输入框和文本域样式 */
        #${PANEL_ID} input[type="text"], #${PANEL_ID} textarea, #${PANEL_ID} input[type="number"], #${PANEL_ID} select, #${PANEL_ID} input[type="password"] {
            width: 100%;
            box-sizing: border-box;
            padding: 10px 12px; /* 【优化】增加内边距 */
            border-radius: 6px; /* 【优化】更圆润 */
            border: 1px solid rgba(100, 100, 120, 0.4); /* 【优化】更明显的边框 */
            background-color: rgba(15, 15, 20, 0.6); /* 【优化】更深的背景 */
            color: #e0e0e0; /* 【优化】浅色文字 */
            margin-bottom: 10px;
            font-size: 14px;
            transition: all 0.3s ease; /* 【优化】过渡动画 */
        }

        /* 【优化】输入框聚焦效果 */
        #${PANEL_ID} input[type="text"]:focus,
        #${PANEL_ID} textarea:focus,
        #${PANEL_ID} input[type="number"]:focus,
        #${PANEL_ID} select:focus,
        #${PANEL_ID} input[type="password"]:focus {
            outline: none;
            border-color: #87CEEB;
            background-color: rgba(20, 20, 30, 0.7);
            box-shadow: 0 0 0 3px rgba(135, 206, 235, 0.15);
        }

        /* 【优化】输入框占位符样式 */
        #${PANEL_ID} input::placeholder, #${PANEL_ID} textarea::placeholder {
            color: rgba(176, 176, 176, 0.5);
            font-style: italic;
        }

        #${PANEL_ID} textarea {
            min-height: 150px;
            resize: vertical;
        }

        #${PANEL_ID} .workflow-info {
            font-size: 0.9em;
            color: #aaa;
            margin-top: -5px;
            margin-bottom: 10px;
        }

        /* 通用按钮样式 */
        .comfy-button {
            padding: 11px 16px; /* 【优化】增加内边距 */
            border: none; /* 【优化】移除边框 */
            border-radius: 8px; /* 【优化】更圆润 */
            cursor: pointer;
            background: linear-gradient(135deg, #4A9EFF 0%, #1E90FF 100%); /* 【优化】更鲜艳的蓝色渐变 */
            color: white;
            font-weight: 600;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); /* 【优化】缓动函数 */
            flex-shrink: 0;
            font-size: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            box-shadow: 0 2px 8px rgba(30, 144, 255, 0.3), 0 1px 3px rgba(0, 0, 0, 0.2); /* 【优化】双层阴影 */
            position: relative;
            overflow: hidden;
        }

        /* 【优化】按钮闪光效果 */
        .comfy-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
            transition: left 0.5s;
        }

        .comfy-button:hover::before {
            left: 100%;
        }

        .comfy-button i {
            font-size: 1em;
            filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.2)); /* 【优化】图标阴影 */
        }

        .comfy-button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            background: linear-gradient(135deg, #6c757d 0%, #5a6268 100%); /* 【优化】禁用状态灰色 */
        }

        .comfy-button:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(30, 144, 255, 0.4), 0 2px 4px rgba(0, 0, 0, 0.2); /* 【优化】悬停阴影更明显 */
            background: linear-gradient(135deg, #5AADFF 0%, #2E9FFF 100%); /* 【优化】悬停颜色变化 */
        }

        .comfy-button:active:not(:disabled) {
            transform: translateY(0);
            box-shadow: 0 2px 4px rgba(30, 144, 255, 0.2);
        }

        /* 按钮状态样式 */
        .comfy-button.testing {
            background: linear-gradient(135deg, #6c757d 0%, #5a6268 100%); /* 【优化】灰色渐变 */
            box-shadow: 0 2px 8px rgba(108, 117, 125, 0.3);
        }

        .comfy-button.success {
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%); /* 【优化】更鲜艳的绿色 */
            box-shadow: 0 2px 8px rgba(40, 167, 69, 0.4);
        }

        .comfy-button.error {
            background: linear-gradient(135deg, #dc3545 0%, #e74c3c 100%); /* 【优化】更鲜艳的红色 */
            box-shadow: 0 2px 8px rgba(220, 53, 69, 0.4);
        }

        .comfy-button.success:hover:not(:disabled) {
            background: linear-gradient(135deg, #34ce57 0%, #2dd4a7 100%);
            box-shadow: 0 6px 16px rgba(40, 167, 69, 0.5);
        }

        .comfy-button.error:hover:not(:disabled) {
            background: linear-gradient(135deg, #e74c3c 0%, #f85149 100%);
            box-shadow: 0 6px 16px rgba(220, 53, 69, 0.5);
        }

        /* 特殊布局样式 */
        #comfyui-test-conn {
            position: relative;
            top: -5px;
        }

        .comfy-url-container {
            display: flex;
            gap: 10px;
            align-items: center;
        }

        .comfy-url-container input {
            flex-grow: 1;
            margin-bottom: 0;
        }

        #${PANEL_ID} label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }

        #options > .options-content > a#${BUTTON_ID} {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        /* 标记输入框容器样式 */
        #${PANEL_ID} .comfy-tags-container {
            display: flex;
            gap: 10px;
            align-items: flex-end;
            margin-top: 10px;
            margin-bottom: 10px;
        }

        #${PANEL_ID} .comfy-tags-container div {
            flex-grow: 1;
        }

        /* 聊天内按钮组容器 */
        .comfy-button-group {
            display: flex;
            align-items: center;
            gap: 5px;
            margin: 5px 4px;
        }

        /* 生成的图片容器样式 */
        .comfy-image-container {
            margin-top: 10px;
            max-width: 100%;
        }

        .comfy-image-container img {
            max-width: var(--comfy-image-max-width, 100%);
            height: auto;
            border-radius: 8px;
            border: 1px solid var(--SmartThemeBorderColor, #555);
        }

        /* 图片加载动画 */
        .comfy-loading-indicator {
            text-align: center;
            color: #888;
            padding: 10px;
            font-style: italic;
        }

        .comfy-loading-indicator::after {
            content: '...';
            animation: comfy-dots 1.5s steps(4, end) infinite;
        }

        @keyframes comfy-dots {
            0%, 20% { content: '.'; }
            40% { content: '..'; }
            60%, 100% { content: '...'; }
        }

        /* 图片错误占位符 */
        .comfy-image-error {
            padding: 20px;
            text-align: center;
            color: #dc3545;
            border: 2px dashed #dc3545;
            border-radius: 8px;
            background: rgba(220, 53, 69, 0.1);
        }

        .comfy-image-error i {
            font-size: 2em;
            margin-bottom: 10px;
            display: block;
        }

        /* 图片容器悬停效果 */
        .comfy-image-container {
            position: relative;
            display: inline-block;
            contain: layout; /* 【优化】CSS Containment，减少重排 */
        }

        .comfy-image-container img {
            cursor: pointer;
            transition: opacity 0.3s ease, transform 0.3s ease;
            will-change: transform; /* 【优化】GPU加速 */
            transform: translateZ(0); /* 【优化】启用硬件加速 */
        }

        .comfy-image-container img:hover {
            opacity: 0.9;
            transform: scale(1.02) translateZ(0);
        }

        /* 图片工具栏 */
        .comfy-image-toolbar {
            position: absolute;
            top: 5px;
            right: 5px;
            display: none;
            gap: 5px;
            z-index: 10;
        }

        .comfy-image-container:hover .comfy-image-toolbar {
            display: flex;
        }

        .comfy-image-tool-btn {
            background: rgba(0, 0, 0, 0.7);
            border: none;
            border-radius: 4px;
            color: white;
            padding: 6px 10px;
            cursor: pointer;
            font-size: 14px;
            transition: background 0.2s;
        }

        .comfy-image-tool-btn:hover {
            background: rgba(0, 0, 0, 0.9);
        }

        /* Lightbox 图片放大查看器 */
        .comfy-lightbox {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw; /* 【修复】使用视口单位确保全屏 */
            height: 100vh;
            background: rgba(0, 0, 0, 0.95);
            z-index: 100000;
            justify-content: center;
            align-items: center;
            animation: comfy-fadeIn 0.3s ease;
            overflow: hidden; /* 【修复】防止滚动条 */
        }

        .comfy-lightbox.active {
            display: flex !important; /* 【修复】使用!important确保显示 */
        }

        .comfy-lightbox img {
            max-width: 90vw; /* 【修复】使用视口单位 */
            max-height: 90vh;
            width: auto;
            height: auto;
            object-fit: contain;
            border-radius: 8px;
            box-shadow: 0 0 50px rgba(0, 0, 0, 0.5);
            animation: comfy-zoomIn 0.3s ease;
            display: block; /* 【修复】确保图片是块级元素 */
            margin: auto; /* 【修复】额外的居中保障 */
        }

        .comfy-lightbox-close {
            position: absolute;
            top: 20px;
            right: 30px;
            font-size: 40px;
            color: white;
            cursor: pointer;
            z-index: 100001; /* 【修复】确保关闭按钮在Lightbox之上 */
            transition: transform 0.2s;
        }

        .comfy-lightbox-close:hover {
            transform: scale(1.2);
        }

        .comfy-lightbox-download {
            position: absolute;
            bottom: 30px;
            right: 30px;
            background: linear-gradient(135deg, #87CEEB 0%, #00BFFF 100%);
            border: none;
            border-radius: 8px;
            color: white;
            padding: 12px 24px;
            cursor: pointer;
            font-size: 16px;
            font-weight: 600;
            transition: opacity 0.3s;
        }

        .comfy-lightbox-download:hover {
            opacity: 0.85;
        }

        @keyframes comfy-fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        @keyframes comfy-zoomIn {
            from { transform: scale(0.8); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }

        /* 图片淡入动画 */
        .comfy-image-container img.fade-in {
            animation: comfy-imageFadeIn 0.5s ease;
        }

        @keyframes comfy-imageFadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        /* 骨架屏加载效果 */
        .comfy-skeleton {
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: comfy-skeleton-loading 1.5s infinite;
            border-radius: 8px;
        }

        @keyframes comfy-skeleton-loading {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
        }

        /* 移动端适配 */
        @media (max-width: 1000px) {
            #${PANEL_ID} {
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                max-height: calc(100vh - 40px);
                width: 95vw;
            }

            /* 【修复】移动端Lightbox优化 */
            .comfy-lightbox img {
                max-width: 95vw !important;
                max-height: 95vh !important;
            }

            .comfy-lightbox-close {
                top: 10px !important;
                right: 10px !important;
                font-size: 36px !important;
                background: rgba(0, 0, 0, 0.5);
                border-radius: 50%;
                width: 50px;
                height: 50px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .comfy-lightbox-download {
                bottom: 10px !important;
                right: 10px !important;
                font-size: 14px !important;
                padding: 10px 20px !important;
            }
        }

        /* 历史记录面板 */
        #comfy-history-panel {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 9999;
            justify-content: center;
            align-items: center;
            background: rgba(0, 0, 0, 0.5);
            padding: 20px;
            box-sizing: border-box;
        }

        #comfy-history-panel.active {
            display: flex;
        }

        .comfy-history-container {
            width: 90vw;
            max-width: 800px;
            max-height: 80vh;
            color: #e0e0e0; /* 【优化】浅色文字 */
            background: linear-gradient(145deg, rgba(30, 30, 35, 0.98) 0%, rgba(20, 20, 25, 0.98) 100%); /* 【优化】渐变背景 */
            border: 1px solid rgba(135, 206, 235, 0.3); /* 【优化】蓝色边框 */
            border-radius: 12px; /* 【优化】更圆润 */
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(135, 206, 235, 0.1); /* 【优化】双层阴影 */
            backdrop-filter: blur(20px); /* 【优化】增强毛玻璃 */
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        .comfy-history-header {
            padding: 18px 20px; /* 【优化】增加内边距 */
            background: linear-gradient(135deg, rgba(135, 206, 235, 0.15) 0%, rgba(0, 191, 255, 0.2) 100%); /* 【优化】蓝色渐变背景 */
            border-bottom: 2px solid rgba(135, 206, 235, 0.3); /* 【优化】更粗的分隔线 */
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* 【优化】添加阴影 */
        }

        .comfy-history-header h3 {
            margin: 0;
            font-size: 1.25em; /* 【优化】稍大的字体 */
            color: #87CEEB; /* 【优化】蓝色标题 */
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); /* 【优化】文字阴影 */
            font-weight: 600;
        }

        .comfy-history-header h3 i {
            color: #00BFFF; /* 【优化】图标颜色 */
            margin-right: 8px;
        }

        .comfy-history-stats {
            font-size: 0.9em;
            color: #a0a0a0; /* 【优化】更浅的灰色 */
            margin-top: 6px;
        }

        /* 【优化】历史面板关闭按钮样式 */
        #comfy-history-close {
            color: #87CEEB !important;
            transition: all 0.3s ease;
            padding: 5px;
            cursor: pointer;
        }

        #comfy-history-close:hover {
            color: #ff6b6b !important;
            transform: scale(1.15) rotate(90deg);
        }

        .comfy-history-content {
            flex: 1;
            overflow-y: auto;
            padding: 15px;
            -webkit-overflow-scrolling: touch; /* 【优化】iOS平滑滚动 */
            will-change: scroll-position; /* 【优化】提示浏览器优化滚动 */
        }

        .comfy-history-item {
            display: flex;
            gap: 15px;
            padding: 12px; /* 【优化】增加内边距 */
            border: 1px solid rgba(100, 100, 120, 0.3); /* 【优化】更明显的边框 */
            border-radius: 10px; /* 【优化】更圆润 */
            margin-bottom: 12px;
            background: linear-gradient(135deg, rgba(35, 35, 45, 0.4) 0%, rgba(25, 25, 35, 0.4) 100%); /* 【优化】渐变背景 */
            transition: all 0.3s ease; /* 【优化】平滑过渡 */
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .comfy-history-item:hover {
            background: linear-gradient(135deg, rgba(45, 45, 60, 0.5) 0%, rgba(35, 35, 50, 0.5) 100%); /* 【优化】悬停渐变 */
            border-color: rgba(135, 206, 235, 0.4); /* 【优化】悬停边框变色 */
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); /* 【优化】悬停阴影 */
            transform: translateY(-2px); /* 【优化】轻微上浮 */
        }

        .comfy-history-thumbnail {
            width: 120px;
            height: 120px;
            flex-shrink: 0;
            border-radius: 4px;
            overflow: hidden;
            cursor: pointer;
            position: relative;
        }

        .comfy-history-thumbnail img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s;
            will-change: transform; /* 【优化】GPU加速 */
            transform: translateZ(0); /* 【优化】启用硬件加速 */
        }

        .comfy-history-thumbnail:hover img {
            transform: scale(1.1);
        }

        .comfy-history-thumbnail::after {
            content: '🔍';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 24px;
            opacity: 0;
            transition: opacity 0.3s;
        }

        .comfy-history-thumbnail:hover::after {
            opacity: 0.9;
        }

        .comfy-history-info {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }

        .comfy-history-meta {
            font-size: 0.85em;
            color: #888;
        }

        .comfy-history-meta span {
            margin-right: 15px;
        }

        .comfy-history-actions {
            display: flex;
            gap: 8px;
            margin-top: 8px;
        }

        .comfy-history-btn {
            padding: 8px 14px; /* 【优化】增加内边距 */
            border: 1px solid rgba(135, 206, 235, 0.3); /* 【优化】蓝色边框 */
            border-radius: 6px; /* 【优化】更圆润 */
            background: linear-gradient(135deg, rgba(30, 30, 40, 0.6) 0%, rgba(20, 20, 30, 0.6) 100%); /* 【优化】渐变背景 */
            color: #e0e0e0; /* 【优化】浅色文字 */
            cursor: pointer;
            font-size: 0.9em;
            transition: all 0.3s ease; /* 【优化】过渡动画 */
            font-weight: 500;
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }

        .comfy-history-btn i {
            font-size: 0.95em;
        }

        .comfy-history-btn:hover {
            background: linear-gradient(135deg, rgba(135, 206, 235, 0.2) 0%, rgba(0, 191, 255, 0.25) 100%); /* 【优化】悬停渐变 */
            border-color: rgba(135, 206, 235, 0.5);
            transform: translateY(-1px);
            box-shadow: 0 2px 8px rgba(135, 206, 235, 0.3);
        }

        .comfy-history-btn.danger {
            border-color: rgba(220, 53, 69, 0.4); /* 【优化】红色边框 */
        }

        .comfy-history-btn.danger:hover {
            background: linear-gradient(135deg, rgba(220, 53, 69, 0.3) 0%, rgba(231, 76, 60, 0.35) 100%); /* 【优化】红色悬停 */
            border-color: #dc3545;
            box-shadow: 0 2px 8px rgba(220, 53, 69, 0.4);
        }

        .comfy-history-empty {
            text-align: center;
            padding: 40px;
            color: #888;
        }

        .comfy-history-empty i {
            font-size: 48px;
            display: block;
            margin-bottom: 15px;
            opacity: 0.5;
        }

        /* 移动端适配 - 历史面板 */
        @media (max-width: 768px) {
            #comfy-history-panel {
                padding: 5px;
            }

            #comfy-history-panel.active {
                display: flex !important;
                justify-content: center !important;
                align-items: center !important;
            }

            .comfy-history-container {
                width: 95vw;
                max-width: 95vw;
                max-height: 90vh;
                border-radius: 12px;
                margin: auto;
            }

            .comfy-history-header {
                padding: 12px;
                flex-shrink: 0;
            }

            .comfy-history-header h3 {
                font-size: 1em;
            }

            .comfy-history-header #comfy-history-close {
                font-size: 28px !important;
            }

            .comfy-history-stats {
                font-size: 0.8em;
            }

            .comfy-history-content {
                overflow-y: auto;
                -webkit-overflow-scrolling: touch;
            }

            .comfy-history-item {
                flex-direction: column;
                padding: 8px;
            }

            .comfy-history-thumbnail {
                width: 100%;
                height: auto;
                max-height: 300px;
                object-fit: contain;
            }

            .comfy-history-actions {
                flex-wrap: wrap;
                gap: 5px;
            }

            .comfy-history-btn {
                flex: 1;
                min-width: 80px;
                font-size: 0.85em;
                padding: 8px;
            }

            /* 设置面板移动端适配 */
            #${PANEL_ID} {
                width: 95vw;
                max-height: 85vh;
                padding: 10px;
            }

            #${PANEL_ID} .panel-control-bar {
                padding: 10px;
                margin: -10px -10px 12px -10px;
            }

            #${PANEL_ID} .panel-control-bar b {
                font-size: 1em;
            }

            .comfy-settings-group {
                padding: 10px;
                margin-bottom: 15px;
            }

            .comfy-settings-group-title {
                font-size: 0.95em;
            }

            .comfy-url-container {
                flex-direction: column;
            }

            .comfy-url-container button {
                margin-top: 8px;
                margin-left: 0 !important;
            }
        }

        /* CSS变量，用于动态控制图片最大宽度 */
        :root {
            --comfy-image-max-width: 600px;
        }

        /* 【优化】暗黑模式支持 - 自动适配系统主题 */
        @media (prefers-color-scheme: dark) {
            .comfy-lightbox {
                background: rgba(0, 0, 0, 0.98);
            }

            .comfy-history-container {
                background-color: rgba(18, 18, 18, 0.98);
            }

            #${PANEL_ID} {
                background-color: rgba(18, 18, 18, 0.95);
            }
        }

        @media (prefers-color-scheme: light) {
            .comfy-lightbox {
                background: rgba(255, 255, 255, 0.98);
            }

            .comfy-lightbox-close {
                color: #333;
            }

            .comfy-history-container {
                background-color: rgba(255, 255, 255, 0.98);
                color: #333;
            }

            #${PANEL_ID} {
                background-color: rgba(255, 255, 255, 0.95);
                color: #333;
            }
        }

        /* 【优化】移动端触摸优化 - 增大可点击区域 */
        @media (max-width: 768px) and (hover: none) {
            .comfy-button {
                min-height: 44px; /* Apple人机界面指南推荐的最小触摸目标 */
                padding: 12px 16px;
                font-size: 16px; /* 防止iOS自动缩放 */
            }

            .comfy-history-btn {
                min-height: 44px;
                padding: 10px 16px;
            }

            .comfy-image-tool-btn {
                min-width: 44px;
                min-height: 44px;
                padding: 10px;
            }

            /* 优化长按效果 */
            .comfy-button:active {
                transform: scale(0.95);
                opacity: 0.8;
            }
        }
    `);

    // --- Configuration Migration ---
    async function migrateConfig() {
        try {
            const currentVersion = await GM_getValue('config_version', '1.0');

            if (currentVersion !== CONFIG_VERSION) {
                console.log(`配置迁移: ${currentVersion} -> ${CONFIG_VERSION}`);

                // 迁移旧版本的API密钥
                const oldApiKey = await GM_getValue('comfyui_api_key', '');
                if (oldApiKey && !oldApiKey.includes('=')) { // 检查是否已加密
                    const encryptedKey = encryptApiKey(oldApiKey);
                    await GM_setValue('comfyui_api_key', encryptedKey);
                    console.log('API密钥已加密存储');
                }

                await GM_setValue('config_version', CONFIG_VERSION);
                console.log('配置迁移完成');
            }
        } catch (error) {
            console.error('配置迁移失败:', error);
        }
    }

    // --- Cache Integrity and Management ---
    async function validateCacheIntegrity() {
        try {
            performanceMonitor.startTimer('validateCache');

            const records = await GM_getValue(STORAGE_KEY_IMAGES, {});
            const validRecords = {};
            let removedCount = 0;

            for (const [id, data] of Object.entries(records)) {
                try {
                    // 验证Base64数据完整性
                    if (typeof data === 'string' &&
                        data.startsWith('data:image/') &&
                        data.includes('base64,') &&
                        data.length > 100) { // 基本长度检查
                        validRecords[id] = data;
                    } else {
                        console.warn(`缓存记录 ${id} 数据格式无效，已清理`);
                        removedCount++;
                    }
                } catch (error) {
                    console.error(`缓存记录 ${id} 验证失败:`, error);
                    removedCount++;
                }
            }

            if (removedCount > 0) {
                await GM_setValue(STORAGE_KEY_IMAGES, validRecords);
                if (typeof toastr !== 'undefined') {
                    toastr.info(`已清理 ${removedCount} 条无效缓存记录`);
                }
            }

            performanceMonitor.endTimer('validateCache');
            return Object.keys(validRecords).length;
        } catch (error) {
            ErrorHandler.handle(new ComfyUIError('缓存验证失败: ' + error.message, 'CACHE'), 'validateCacheIntegrity');
            return 0;
        }
    }

    // --- Image Compression and Optimization ---

    // 【优化】创建内联WebWorker用于图片压缩（避免阻塞主线程）
    let compressionWorker = null;

    function createCompressionWorker() {
        // 由于油猴环境限制，使用OffscreenCanvas在主线程压缩
        // 但使用requestIdleCallback优化，避免阻塞UI
        return {
            compress: async (canvas, quality, maxWidth) => {
                return new Promise((resolve) => {
                    // 使用requestIdleCallback在浏览器空闲时压缩
                    const idleCallback = window.requestIdleCallback || ((cb) => setTimeout(cb, 1));

                    idleCallback(async () => {
                        try {
                            // 如果图片太大，先缩放
                            if (canvas.width > maxWidth) {
                                const scale = maxWidth / canvas.width;
                                const scaledCanvas = document.createElement('canvas');
                                const ctx = scaledCanvas.getContext('2d');

                                scaledCanvas.width = maxWidth;
                                scaledCanvas.height = canvas.height * scale;

                                ctx.drawImage(canvas, 0, 0, scaledCanvas.width, scaledCanvas.height);
                                canvas = scaledCanvas;
                            }

                            // 压缩为JPEG格式
                            canvas.toBlob((blob) => {
                                if (blob) {
                                    const reader = new FileReader();
                                    reader.onload = () => resolve(reader.result);
                                    reader.readAsDataURL(blob);
                                } else {
                                    resolve(null);
                                }
                            }, 'image/jpeg', quality);
                        } catch (error) {
                            console.error('图片压缩失败:', error);
                            resolve(null);
                        }
                    }, { timeout: 2000 });
                });
            }
        };
    }

    function compressImage(canvas, quality = 0.8, maxWidth = 1024) {
        // 【优化】使用compressionWorker处理（如果可用）
        if (!compressionWorker) {
            compressionWorker = createCompressionWorker();
        }

        return compressionWorker.compress(canvas, quality, maxWidth);
    }

    async function blobToBase64(blob) {
        return new Promise((resolve, reject) => {
            try {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = (err) => reject(new ComfyUIError('FileReader error: ' + err, 'CACHE'));
                reader.readAsDataURL(blob);
            } catch (error) {
                reject(error);
            }
        });
    }

    async function fetchImageAsBlob(imageUrl) {
        return new Promise((resolve, reject) => {
            performanceMonitor.startTimer('fetchImage');

            GM_xmlhttpRequest({
                method: 'GET',
                url: imageUrl,
                responseType: 'blob',
                timeout: 30000,
                onload: (response) => {
                    try {
                        if (response.status !== 200) {
                            reject(new ComfyUIError(`获取图片失败，状态: ${response.status}`, 'NETWORK'));
                            return;
                        }

                        const blob = response.response;
                        if (!blob) {
                            reject(new ComfyUIError('图片数据为空', 'VALIDATION'));
                            return;
                        }

                        if (blob.size > 10 * 1024 * 1024) {
                            reject(new ComfyUIError('图片文件过大', 'VALIDATION'));
                            return;
                        }

                        if (blob.size === 0) {
                            reject(new ComfyUIError('图片文件为空', 'VALIDATION'));
                            return;
                        }

                        resolve(blob);
                    } catch (error) {
                        reject(error);
                    } finally {
                        performanceMonitor.endTimer('fetchImage');
                    }
                },
                onerror: (err) => {
                    performanceMonitor.endTimer('fetchImage');
                    reject(new ComfyUIError('网络错误: ' + err, 'NETWORK'));
                },
                ontimeout: () => {
                    performanceMonitor.endTimer('fetchImage');
                    reject(new ComfyUIError('下载图片超时', 'NETWORK'));
                }
            });
        });
    }

    async function fetchImageAsBase64(imageUrl) {
        return new Promise((resolve, reject) => {
            if (debugMode) {
                console.log(`[ComfyUI Debug] 开始获取图片: ${imageUrl}`);
            }

            performanceMonitor.startTimer('fetchImage');

            GM_xmlhttpRequest({
                method: 'GET',
                url: imageUrl,
                responseType: 'blob',
                timeout: 30000,
                onload: async (response) => {
                    try {
                        if (debugMode) {
                            console.log(`[ComfyUI Debug] 图片请求响应: 状态=${response.status}, 大小=${response.response?.size || 0}字节`);
                        }

                        if (response.status === 200) {
                            const blob = response.response;

                            // 检查文件大小
                            if (blob.size > 10 * 1024 * 1024) { // 10MB限制
                                throw new ComfyUIError('图片文件过大', 'VALIDATION');
                            }

                            if (blob.size === 0) {
                                throw new ComfyUIError('图片文件为空', 'VALIDATION');
                            }

                            // 【优化】降低压缩阈值，移动端更激进
                            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                            const compressionThreshold = isMobile ? 1 * 1024 * 1024 : 2 * 1024 * 1024; // 移动端1MB，PC端2MB

                            // 尝试压缩大图片
                            if (blob.size > compressionThreshold) {
                                if (debugMode) {
                                    console.log(`[ComfyUI Debug] 图片较大(${(blob.size / 1024).toFixed(1)}KB)，开始压缩...`);
                                    console.log(`[ComfyUI Debug] 设备: ${isMobile ? '移动端' : 'PC端'}, 压缩阈值: ${(compressionThreshold / 1024).toFixed(0)}KB`);
                                }

                                const img = new Image();
                                const canvas = document.createElement('canvas');
                                const ctx = canvas.getContext('2d');

                                img.onload = async () => {
                                    canvas.width = img.width;
                                    canvas.height = img.height;
                                    ctx.drawImage(img, 0, 0);

                                    // 【优化】移动端使用更激进的压缩
                                    const quality = isMobile ? 0.6 : 0.75;
                                    const maxWidth = isMobile ? 800 : 1024;

                                    const compressedData = await compressImage(canvas, quality, maxWidth);
                                    if (compressedData) {
                                        const compressedSize = (compressedData.length * 0.75 / 1024).toFixed(1);
                                        console.log(`图片已压缩: ${(blob.size / 1024).toFixed(1)}KB -> ${compressedSize}KB (质量:${quality}, 最大宽度:${maxWidth}px)`);
                                        if (debugMode) {
                                            console.log(`[ComfyUI Debug] 压缩比: ${(100 - (compressedSize / (blob.size / 1024) * 100)).toFixed(1)}%`);
                                        }
                                        performanceMonitor.endTimer('fetchImage');
                                        resolve(compressedData);
                                    } else {
                                        // 压缩失败，使用原图
                                        console.warn('图片压缩失败，使用原始图片');
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                            performanceMonitor.endTimer('fetchImage');
                                            resolve(reader.result);
                                        };
                                        reader.readAsDataURL(blob);
                                    }
                                };

                                img.onerror = () => {
                                    // 图片解析失败，使用原始数据
                                    console.warn('图片解析失败，使用原始数据');
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                        performanceMonitor.endTimer('fetchImage');
                                        resolve(reader.result);
                                    };
                                    reader.readAsDataURL(blob);
                                };

                                const reader = new FileReader();
                                reader.onload = () => img.src = reader.result;
                                reader.readAsDataURL(blob);
                            } else {
                                // 小文件直接转换
                                if (debugMode) {
                                    console.log(`[ComfyUI Debug] 图片较小(${(blob.size / 1024).toFixed(1)}KB)，直接转换base64`);
                                }

                                const reader = new FileReader();
                                reader.onloadend = () => {
                                    performanceMonitor.endTimer('fetchImage');
                                    if (debugMode) {
                                        console.log(`[ComfyUI Debug] Base64转换完成`);
                                    }
                                    resolve(reader.result);
                                };
                                reader.onerror = (err) => {
                                    performanceMonitor.endTimer('fetchImage');
                                    reject(new ComfyUIError('FileReader error: ' + err, 'CACHE'));
                                };
                                reader.readAsDataURL(blob);
                            }
                        } else {
                            reject(new ComfyUIError(`获取图片失败，状态: ${response.status}`, 'NETWORK'));
                        }
                    } catch (error) {
                        reject(error);
                    } finally {
                        performanceMonitor.endTimer('fetchImage');
                    }
                },
                onerror: (err) => {
                    performanceMonitor.endTimer('fetchImage');
                    reject(new ComfyUIError('网络错误: ' + err, 'NETWORK'));
                },
                ontimeout: () => {
                    performanceMonitor.endTimer('fetchImage');
                    reject(new ComfyUIError('下载图片超时', 'NETWORK'));
                }
            });
        });
    }

    // --- WebSocket & State Management ---
    let socketListenersBound = false;
    let socketInitInProgress = false;
    let hasShownRealtimeConnectedToast = false;
    let hasShownExpiryToast = false;
    let lastRealtimeToastAt = 0;
    function connectWebSocket() {
        try {
            if (socket && (socket.connected || socketInitInProgress)) return;

            const schedulerUrl = new URL(cachedSettings.comfyuiUrl);
            const wsUrl = `${schedulerUrl.protocol}//${schedulerUrl.host}`;

            if (typeof io === 'undefined') {
                throw new ComfyUIError('Socket.IO 客户端库未加载！', 'CONFIG');
            }

            if (!socket) {
                socketInitInProgress = true;
                socket = io(wsUrl, {
                    reconnectionAttempts: 5,
                    timeout: 20000,
                    transports: ['websocket', 'polling']
                });
            } else {
                try {
                    socket.connect();
                } catch (e) {
                }
            }

            if (!socketListenersBound && socket) {
                socketListenersBound = true;

                socket.on('connect', async () => {
                    socketInitInProgress = false;
                    console.log('成功连接到调度器 WebSocket！');

                    const now = Date.now();
                    if (!hasShownRealtimeConnectedToast || (now - lastRealtimeToastAt) > 30000) {
                        lastRealtimeToastAt = now;
                        hasShownRealtimeConnectedToast = true;
                        if (typeof toastr !== 'undefined') toastr.success('已建立实时连接！');
                    }

                    if (!hasShownExpiryToast) {
                        try {
                            await showExpiryInfoToastIfPossible();
                        } catch (e) {
                        }
                    }

                    if (reconnector) {
                        reconnector.reset();
                    }

                    const offlineNotice = document.querySelector('.comfy-offline-notice');
                    if (offlineNotice) {
                        offlineNotice.remove();
                    }

                    if (pendingSubscriptions.size > 0) {
                        for (const promptId of pendingSubscriptions) {
                            try {
                                socket.emit('subscribe_to_prompt', { prompt_id: promptId });
                            } catch (e) {
                            }
                        }
                        pendingSubscriptions.clear();
                    }
                });

                socket.on('disconnect', (reason) => {
                    socketInitInProgress = false;
                    console.log('与调度器 WebSocket 断开连接:', reason);

                    if (reason !== 'io client disconnect' && reason !== 'io server disconnect') {
                        if (reconnector) {
                            reconnector.reconnect();
                        }
                    }
                });

                socket.on('connect_error', (error) => {
                    socketInitInProgress = false;
                    console.error('WebSocket连接错误:', error);
                    ErrorHandler.handle(new ComfyUIError('WebSocket连接失败: ' + error.message, 'WEBSOCKET'), 'connectWebSocket');
                });

                socket.on('generation_complete', async (data) => {
                    try {
                        const { prompt_id, status, imageUrl, error, model } = data;
                        const promptInfo = activePrompts[prompt_id];

                        if (!promptInfo) return;

                        const { button, generationId } = promptInfo;
                        const group = button.closest('.comfy-button-group');

                        if (status === 'success' && imageUrl) {
                            showNotification('图片已生成！', 'info', 'verbose');

                            try {
                                if (imageUrl.startsWith('data:image/')) {
                                    await displayImageWithValidation(group, imageUrl, generationId);
                                    await saveImageRecord(generationId, imageUrl);
                                } else {
                                    showNotification('正在下载图片...', 'info', 'verbose');

                                    if (debugMode) {
                                        console.log(`[ComfyUI Debug] 开始获取图片: ${imageUrl}`);
                                    }

                                    let blob;
                                    if (cachedSettings.enableRetry) {
                                        blob = await retryWithBackoff(
                                            () => fetchImageAsBlob(imageUrl),
                                            cachedSettings.retryCount,
                                            1000
                                        );
                                    } else {
                                        blob = await fetchImageAsBlob(imageUrl);
                                    }

                                    const objectUrl = URL.createObjectURL(blob);
                                    await displayImageWithValidation(group, objectUrl, generationId);

                                    (async () => {
                                        try {
                                            const base64 = await blobToBase64(blob);
                                            await saveImageRecord(generationId, base64);

                                            const container = findImageContainerForGroup(group, generationId);
                                            const imgElement = container ? container.querySelector('img') : null;

                                            if (imgElement) {
                                                const prevSrc = imgElement.src;
                                                imgElement.src = base64;
                                                if (prevSrc && prevSrc.startsWith('blob:')) {
                                                    URL.revokeObjectURL(prevSrc);
                                                }
                                            }
                                        } catch (e) {
                                            console.error('后台缓存图片失败:', e);
                                        }
                                    })();
                                }

                                showNotification('图片加载完成！', 'success', 'standard');

                                button.textContent = '生成成功';
                                button.classList.remove('testing');
                                button.classList.add('success');
                                setTimeout(() => {
                                    setupGeneratedState(button, generationId);
                                }, 2000);
                            } catch (imgError) {
                                console.error('图片下载或加载失败:', imgError);
                                showNotification(`图片加载失败: ${imgError.message}`, 'error');

                                button.textContent = '图片加载失败';
                                button.classList.remove('testing');
                                button.classList.add('error');
                                setTimeout(() => {
                                    button.disabled = false;
                                    button.classList.remove('error');
                                    button.textContent = group.querySelector('.comfy-delete-button') ? '重新生成' : '开始生成';
                                }, 3000);
                            }

                        } else {
                            if (typeof toastr !== 'undefined') toastr.error(`生成失败: ${error || '未知错误'}`);
                            button.textContent = '生成失败';
                            button.classList.remove('testing');
                            button.classList.add('error');
                            setTimeout(() => {
                                button.disabled = false;
                                button.classList.remove('error');
                                button.textContent = group.querySelector('.comfy-delete-button') ? '重新生成' : '开始生成';
                            }, 3000);
                        }
                        delete activePrompts[prompt_id];
                    } catch (error) {
                        ErrorHandler.handle(new ComfyUIError('处理生成完成事件失败: ' + error.message, 'WEBSOCKET'), 'generation_complete');
                    }
                });
            }
        } catch (error) {
            ErrorHandler.handle(error, 'connectWebSocket');
        }
    }

    // --- History Panel ---
    function createHistoryPanel() {
        if (document.getElementById('comfy-history-panel')) return;

        const panel = document.createElement('div');
        panel.id = 'comfy-history-panel';
        panel.innerHTML = `
            <div class="comfy-history-container">
                <div class="comfy-history-header">
                    <div>
                        <h3><i class="fa fa-history"></i> 生成历史记录</h3>
                        <div class="comfy-history-stats" id="comfy-history-stats"></div>
                    </div>
                    <i class="fa fa-times" style="cursor: pointer; font-size: 24px;" id="comfy-history-close"></i>
                </div>
                <div class="comfy-history-content" id="comfy-history-content">
                    <!-- 动态内容 -->
                </div>
            </div>
        `;

        document.body.appendChild(panel);

        // 关闭按钮
        const closeBtn = document.getElementById('comfy-history-close');
        closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            panel.classList.remove('active');
            // 【修复】清除内联样式，避免display属性冲突
            panel.style.display = '';
            console.log('[ComfyUI] 历史面板已关闭');
        });

        // 点击背景遮罩关闭（点击container内部不关闭）
        panel.addEventListener('click', (e) => {
            if (e.target === panel) {
                panel.classList.remove('active');
                // 【修复】清除内联样式
                panel.style.display = '';
                console.log('[ComfyUI] 点击背景关闭历史面板');
            }
        });

        // 阻止点击container内部时关闭
        const container = panel.querySelector('.comfy-history-container');
        container.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // ESC键关闭
        const handleEsc = (e) => {
            if (e.key === 'Escape' && panel.classList.contains('active')) {
                panel.classList.remove('active');
                // 【修复】清除内联样式
                panel.style.display = '';
                console.log('[ComfyUI] ESC键关闭历史面板');
            }
        };
        document.addEventListener('keydown', handleEsc);
    }

    async function openHistoryPanel() {
        const panel = document.getElementById('comfy-history-panel');
        if (!panel) {
            createHistoryPanel();
            setTimeout(() => openHistoryPanel(), 100);
            return;
        }

        // 显示面板
        panel.classList.add('active');

        // 加载历史记录
        await refreshHistoryPanel();
    }

    async function refreshHistoryPanel() {
        const content = document.getElementById('comfy-history-content');
        const statsDiv = document.getElementById('comfy-history-stats');

        if (!content || !lruCache) return;

        const items = lruCache.getAll();
        const stats = lruCache.getStats();

        // 更新统计信息
        statsDiv.innerHTML = `
            总计: ${stats.count} 张 |
            大小: ${stats.totalSizeMB}MB |
            平均访问: ${stats.avgAccessCount} 次
        `;

        // 按时间倒序排列
        items.sort((a, b) => b.timestamp - a.timestamp);

        if (items.length === 0) {
            content.innerHTML = `
                <div class="comfy-history-empty">
                    <i class="fa fa-image"></i>
                    <p>还没有生成任何图片</p>
                </div>
            `;
            return;
        }

        content.innerHTML = items.map(item => `
            <div class="comfy-history-item" data-id="${item.id}">
                <div class="comfy-history-thumbnail" data-src="${item.data}">
                    <img src="${item.data}" alt="生成的图片">
                </div>
                <div class="comfy-history-info">
                    <div>
                        <strong>ID:</strong> ${item.id}
                    </div>
                    <div class="comfy-history-meta">
                        <span><i class="fa fa-clock"></i> ${item.ageInHours}小时前</span>
                        <span><i class="fa fa-eye"></i> 访问 ${item.accessCount} 次</span>
                        <span><i class="fa fa-file"></i> ${item.sizeMB}MB</span>
                    </div>
                    <div class="comfy-history-actions">
                        <button class="comfy-history-btn" data-action="view" data-id="${item.id}">
                            <i class="fa fa-search-plus"></i> 查看
                        </button>
                        <button class="comfy-history-btn" data-action="download" data-id="${item.id}">
                            <i class="fa fa-download"></i> 下载
                        </button>
                        <button class="comfy-history-btn danger" data-action="delete" data-id="${item.id}">
                            <i class="fa fa-trash"></i> 删除
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        // 绑定事件
        content.querySelectorAll('.comfy-history-thumbnail').forEach(thumb => {
            thumb.addEventListener('click', () => {
                openLightbox(thumb.dataset.src);
            });
        });

        content.querySelectorAll('.comfy-history-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const action = btn.dataset.action;
                const id = btn.dataset.id;
                const item = items.find(i => i.id === id);

                if (!item) return;

                if (action === 'view') {
                    openLightbox(item.data);
                } else if (action === 'download') {
                    const filename = `comfyui-${id}-${Date.now()}.png`;
                    downloadImage(item.data, filename);
                } else if (action === 'delete') {
                    if (confirm('确定要删除这张图片吗？')) {
                        await deleteImageRecord(id);
                        await refreshHistoryPanel();
                        showNotification('图片已删除', 'success', 'standard');
                    }
                }
            });
        });
    }

    // --- Lightbox (Image Viewer) ---
    function createLightbox() {
        if (document.getElementById('comfy-lightbox')) return;

        const lightbox = document.createElement('div');
        lightbox.id = 'comfy-lightbox';
        lightbox.className = 'comfy-lightbox';
        lightbox.innerHTML = `
            <span class="comfy-lightbox-close">×</span>
            <img src="" alt="查看大图" data-current-index="-1">
            <button class="comfy-lightbox-download">
                <i class="fa fa-download"></i> 下载图片
            </button>
        `;

        document.body.appendChild(lightbox);

        const closeBtn = lightbox.querySelector('.comfy-lightbox-close');
        const downloadBtn = lightbox.querySelector('.comfy-lightbox-download');
        const img = lightbox.querySelector('img');

        // 【优化】添加移动端触摸手势支持（双指缩放、左右滑动）
        let touchStartX = 0;
        let touchStartY = 0;
        let touchStartDistance = 0;
        let currentScale = 1;

        lightbox.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                // 单指触摸 - 准备滑动
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
            } else if (e.touches.length === 2) {
                // 双指触摸 - 准备缩放
                const dx = e.touches[0].clientX - e.touches[1].clientX;
                const dy = e.touches[0].clientY - e.touches[1].clientY;
                touchStartDistance = Math.sqrt(dx * dx + dy * dy);
            }
        }, { passive: true });

        lightbox.addEventListener('touchmove', (e) => {
            if (e.touches.length === 2) {
                // 双指缩放
                e.preventDefault();
                const dx = e.touches[0].clientX - e.touches[1].clientX;
                const dy = e.touches[0].clientY - e.touches[1].clientY;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (touchStartDistance > 0) {
                    const scale = (distance / touchStartDistance) * currentScale;
                    const clampedScale = Math.min(Math.max(scale, 0.5), 3); // 限制缩放范围
                    img.style.transform = `scale(${clampedScale})`;
                }
            }
        }, { passive: false });

        lightbox.addEventListener('touchend', (e) => {
            if (e.changedTouches.length === 1 && e.touches.length === 0) {
                // 单指离开 - 检查是否滑动
                const touchEndX = e.changedTouches[0].clientX;
                const touchEndY = e.changedTouches[0].clientY;
                const deltaX = touchEndX - touchStartX;
                const deltaY = touchEndY - touchStartY;

                // 水平滑动超过50px且垂直滑动小于30px
                if (Math.abs(deltaX) > 50 && Math.abs(deltaY) < 30) {
                    if (debugMode) {
                        console.log('[ComfyUI] 检测到滑动手势:', deltaX > 0 ? '右滑' : '左滑');
                    }
                    // 这里可以添加切换上一张/下一张图片的逻辑
                    // 暂时只做提示
                }
            } else if (e.touches.length === 0) {
                // 双指离开 - 保存当前缩放比例
                const transform = window.getComputedStyle(img).transform;
                if (transform !== 'none') {
                    const matrix = new DOMMatrix(transform);
                    currentScale = matrix.a; // a 是 scaleX
                }
            }
        }, { passive: true });

        // 【修复】关闭Lightbox的统一处理函数
        const closeLightbox = () => {
            lightbox.classList.remove('active');

            // 【优化】重置图片缩放和变换
            img.style.transform = '';
            currentScale = 1;

            // 【修复】恢复历史面板显示 - 清除内联样式即可，让CSS类控制
            const historyPanel = document.getElementById('comfy-history-panel');
            if (historyPanel && historyPanel.classList.contains('active')) {
                // 不再直接设置display:flex，而是清除内联样式，让.active类的CSS生效
                historyPanel.style.display = '';
            }

            console.log('[ComfyUI] Lightbox已关闭，历史面板已恢复');
        };

        // 关闭按钮
        closeBtn.addEventListener('click', closeLightbox);

        // 点击背景关闭
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        // ESC键关闭
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });

        // 下载按钮
        downloadBtn.addEventListener('click', () => {
            const imageSrc = img.src;
            if (imageSrc) {
                const filename = `comfyui-${Date.now()}.png`;
                downloadImage(imageSrc, filename);
            }
        });
    }

    function openLightbox(imageSrc) {
        console.log('[ComfyUI] 尝试打开Lightbox');

        const lightbox = document.getElementById('comfy-lightbox');
        if (!lightbox) {
            console.log('[ComfyUI] Lightbox不存在，创建中...');
            createLightbox();
            // 递归调用以打开lightbox
            setTimeout(() => openLightbox(imageSrc), 100);
            return;
        }

        console.log('[ComfyUI] Lightbox元素已找到');

        // 【修复】在打开Lightbox时，暂时隐藏历史面板（避免层级冲突）
        const historyPanel = document.getElementById('comfy-history-panel');
        if (historyPanel && historyPanel.classList.contains('active')) {
            historyPanel.style.display = 'none';
            console.log('[ComfyUI] 历史面板已暂时隐藏');
        }

        const img = lightbox.querySelector('img');
        if (!img) {
            console.error('[ComfyUI Error] Lightbox中未找到img元素！');
            return;
        }

        console.log('[ComfyUI] 设置图片src，数据大小:', (imageSrc.length / 1024).toFixed(2), 'KB');
        console.log('[ComfyUI] 图片src前缀:', imageSrc.substring(0, 50));

        img.src = imageSrc;
        lightbox.classList.add('active');

        // 【修复】强制重绘，确保样式生效
        void lightbox.offsetHeight;

        console.log('[ComfyUI] Lightbox已添加active类');
        console.log('[ComfyUI] Lightbox display样式:', window.getComputedStyle(lightbox).display);
        console.log('[ComfyUI] 图片naturalWidth:', img.naturalWidth, 'naturalHeight:', img.naturalHeight);

        // 【修复】等待图片加载完成后再检查
        img.onload = () => {
            console.log('[ComfyUI] Lightbox图片加载成功！尺寸:', img.naturalWidth, 'x', img.naturalHeight);
        };

        img.onerror = () => {
            console.error('[ComfyUI Error] Lightbox图片加载失败！');
        };
    }

    // --- Core Application Logic (UI, Settings, Image Handling) ---

    // A flag to prevent duplicate execution
    let lastTapTimestamp = 0;
    const TAP_THRESHOLD = 300;

    function createComfyUIPanel() {
        if (document.getElementById(PANEL_ID)) return;

        const panelHTML = `
            <div id="${PANEL_ID}">
                <div class="panel-control-bar">
                    <div style="display: flex; align-items: center;">
                        <i class="fa-fw fa-solid fa-grip drag-grabber"></i>
                        <b>ComfyUI 插件设置</b>
                    </div>
                    <i class="fa-fw fa-solid fa-circle-xmark floating_panel_close"></i>
                </div>
                <div class="comfyui-panel-content">
                    <div id="comfyui-config-errors" class="comfy-config-error" style="display: none;"></div>

                    <!-- 基础设置 -->
                    <div class="comfy-settings-group">
                        <div class="comfy-settings-group-title">
                            <i class="fa fa-server"></i>
                            <span>连接设置</span>
                        </div>
                        <div class="comfy-field">
                            <label for="comfyui-url">调度器 URL (推荐使用HTTPS)</label>
                            <div class="comfy-url-container">
                                <input id="comfyui-url" type="text" placeholder="例如: https://127.0.0.1:5001">
                                <button id="comfyui-test-conn" class="comfy-button">测试连接</button>
                            </div>
                        </div>
                        <div class="comfy-field">
                            <label for="comfyui-api-key">API 密钥 (已加密存储)</label>
                            <input id="comfyui-api-key" type="password" placeholder="在此输入您的密钥">
                        </div>
                    </div>

                    <!-- 标记设置 -->
                    <div class="comfy-settings-group">
                        <div class="comfy-settings-group-title">
                            <i class="fa fa-tags"></i>
                            <span>标记与提示词</span>
                        </div>
                        <div class="comfy-tags-container">
                            <div class="comfy-field">
                                <label for="comfyui-start-tag">开始标记</label>
                                <input id="comfyui-start-tag" type="text">
                            </div>
                            <div class="comfy-field">
                                <label for="comfyui-end-tag">结束标记</label>
                                <input id="comfyui-end-tag" type="text">
                            </div>
                        </div>
                        <div class="comfy-field">
                            <label for="comfyui-prompt-prefix">提示词固定前缀 (LoRA等)</label>
                            <input id="comfyui-prompt-prefix" type="text" placeholder="例如: <lora:cool_style:0.8>">
                        </div>
                    </div>

                    <!-- 生成设置 -->
                    <div class="comfy-settings-group">
                        <div class="comfy-settings-group-title">
                            <i class="fa fa-image"></i>
                            <span>图片生成</span>
                        </div>
                        <div class="comfy-field">
                            <label for="comfyui-default-model">默认模型 (不指定时生效)</label>
                            <select id="comfyui-default-model">
                                <option value="">请先测试连接获取模型</option>
                            </select>
                            <div id="comfyui-models-cache-status" style="margin-top: 6px; color: #aaa; font-size: 12px;"></div>
                        </div>
                        <div class="comfy-field">
                            <label for="comfyui-max-width">最大图片宽度 (px, 100-2000)</label>
                            <input id="comfyui-max-width" type="number" placeholder="600" min="100" max="2000">
                        </div>
                    </div>

                    <!-- 缓存与性能 -->
                    <div class="comfy-settings-group">
                        <div class="comfy-settings-group-title">
                            <i class="fa fa-database"></i>
                            <span>缓存管理</span>
                        </div>
                        <div class="comfy-field">
                            <label for="comfyui-cache-limit">最大缓存数量 (1-100)</label>
                            <input id="comfyui-cache-limit" type="number" placeholder="20" min="1" max="100">
                        </div>
                        <div id="comfyui-cache-status" style="margin-top: 8px;">当前缓存: ...</div>
                    </div>

                    <!-- 通知与行为 -->
                    <div class="comfy-settings-group">
                        <div class="comfy-settings-group-title">
                            <i class="fa fa-bell"></i>
                            <span>通知与行为</span>
                        </div>
                        <div class="comfy-field">
                            <label for="comfyui-notification-level">通知级别</label>
                            <select id="comfyui-notification-level">
                                <option value="silent">静默（仅错误）</option>
                                <option value="standard">标准（成功+错误）</option>
                                <option value="verbose">详细（所有通知）</option>
                            </select>
                        </div>
                        <div class="comfy-field">
                            <label>
                                <input type="checkbox" id="comfyui-enable-retry" style="width: auto; margin-right: 8px;">
                                启用自动重试（图片下载失败时）
                            </label>
                        </div>
                        <div style="margin-left: 24px; display: none;" id="comfyui-retry-options" class="comfy-field">
                            <label for="comfyui-retry-count">重试次数 (1-5)</label>
                            <input id="comfyui-retry-count" type="number" placeholder="3" min="1" max="5" style="width: 80px;">
                        </div>
                        <div class="comfy-field">
                            <label>
                                <input type="checkbox" id="comfyui-debug-mode" style="width: auto; margin-right: 8px;">
                                启用调试模式（在控制台查看详细日志）
                            </label>
                        </div>
                    </div>

                    <!-- 操作按钮 -->
                    <div class="comfy-settings-group">
                        <div class="comfy-settings-group-title">
                            <i class="fa fa-cogs"></i>
                            <span>操作</span>
                        </div>
                        <button id="comfyui-view-history" class="comfy-button" style="width: 100%; margin-bottom: 8px;">
                            <i class="fa fa-history"></i> 查看生成历史
                        </button>
                        <button id="comfyui-force-rescan" class="comfy-button" style="width: 100%; margin-bottom: 8px;">
                            <i class="fa fa-refresh"></i> 强制重新扫描所有消息
                        </button>
                        <button id="comfyui-validate-cache" class="comfy-button" style="width: 100%; margin-bottom: 8px;">
                            <i class="fa fa-check-circle"></i> 验证缓存完整性
                        </button>
                        <button id="comfyui-clear-cache" class="comfy-button error" style="width: 100%;">
                            <i class="fa fa-trash"></i> 删除所有图片缓存
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', panelHTML);
        initPanelLogic();
    }

    async function updateCacheStatusDisplay() {
        try {
            const display = getCachedDOMElement('comfyui-cache-status') || document.getElementById('comfyui-cache-status');
            if (!display) return;

            let count, sizeMB;

            if (lruCache) {
                // 使用LRU缓存统计
                const stats = lruCache.getStats();
                count = stats.count;
                sizeMB = stats.totalSizeMB;
            } else {
                // 使用旧方法统计
                const records = await GM_getValue(STORAGE_KEY_IMAGES, {});
                count = Object.keys(records).length;
                const totalSize = Object.values(records).reduce((total, data) => {
                    return total + (typeof data === 'string' ? data.length : 0);
                }, 0);
                sizeMB = (totalSize * 0.75 / 1024 / 1024).toFixed(1);
            }

            display.textContent = `当前缓存: ${count} / ${cachedSettings.cacheLimit} 张 (约 ${sizeMB}MB)`;

            setCachedDOMElement('comfyui-cache-status', display);
        } catch (error) {
            ErrorHandler.handle(new ComfyUIError('更新缓存状态失败: ' + error.message, 'CACHE'), 'updateCacheStatusDisplay');
        }
    }

    async function updateModelsCacheStatusDisplay() {
        try {
            const display = getCachedDOMElement('comfyui-models-cache-status') || document.getElementById('comfyui-models-cache-status');
            if (!display) return;

            const models = await GM_getValue(STORAGE_KEY_MODELS, []);
            const count = Array.isArray(models) ? models.length : 0;
            const updatedAt = await GM_getValue(STORAGE_KEY_MODELS_UPDATED_AT, 0);
            if (updatedAt) {
                const d = new Date(updatedAt);
                display.textContent = `模型缓存: ${count} 个 (更新于 ${d.toLocaleString()})`;
            } else {
                display.textContent = `模型缓存: ${count} 个 (尚未获取)`;
            }

            setCachedDOMElement('comfyui-models-cache-status', display);
        } catch (error) {
            ErrorHandler.handle(new ComfyUIError('更新模型缓存状态失败: ' + error.message, 'CACHE'), 'updateModelsCacheStatusDisplay');
        }
    }

    // 【优化】创建防抖版本的缓存状态更新函数
    const debouncedUpdateCacheStatus = debounce(updateCacheStatusDisplay, 300);

    // DOM缓存管理
    function getCachedDOMElement(id) {
        return cachedDOMElements[id];
    }

    function setCachedDOMElement(id, element) {
        cachedDOMElements[id] = element;
    }

    function clearDOMCache() {
        cachedDOMElements = {};
    }

    function showConfigErrors(errors) {
        const errorContainer = document.getElementById('comfyui-config-errors');
        if (errorContainer) {
            if (errors.length > 0) {
                errorContainer.innerHTML = errors.map(error => `• ${error}`).join('<br>');
                errorContainer.style.display = 'block';
            } else {
                errorContainer.style.display = 'none';
            }
        }
    }

    function updateModelSelectOptions(selectEl, models, selectedValue) {
        if (!selectEl) return;
        const list = Array.isArray(models) ? models : [];
        selectEl.innerHTML = '';
        if (list.length === 0) {
            const opt = document.createElement('option');
            opt.value = '';
            opt.textContent = '请先测试连接获取模型';
            selectEl.appendChild(opt);
            selectEl.value = '';
            return;
        }

        for (const m of list) {
            const opt = document.createElement('option');
            opt.value = m;
            opt.textContent = m;
            selectEl.appendChild(opt);
        }
        if (selectedValue && list.includes(selectedValue)) {
            selectEl.value = selectedValue;
        } else {
            selectEl.value = list[0];
        }
    }

    function fetchModelsFromScheduler(baseUrl, apiKey) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `${baseUrl}/models?api_key=${encodeURIComponent(apiKey)}`,
                timeout: 10000,
                onload: (res) => {
                    try {
                        if (res.status === 200) {
                            const data = JSON.parse(res.responseText || '{}');
                            resolve(Array.isArray(data.models) ? data.models : []);
                        } else if (res.status === 401 || res.status === 403) {
                            let data = {};
                            try {
                                data = JSON.parse(res.responseText || '{}');
                            } catch (e) {
                            }

                            const code = data.error_code;
                            let msg = data.error || 'API密钥无效或权限不足';
                            if (code === 'invalid_key') msg = 'API Key 无效，请检查是否输入正确';
                            else if (code === 'expired') msg = '卡密已过期，请联系管理员续期';
                            else if (code === 'disabled') msg = '账户已被禁用，请联系管理员';
                            else if (code === 'missing_key') msg = '请求缺少 API Key';

                            reject(new ComfyUIError(msg, 'AUTH', { error_code: code }));
                        } else {
                            reject(new ComfyUIError(`获取模型失败！状态: ${res.status}`, 'NETWORK'));
                        }
                    } catch (e) {
                        reject(new ComfyUIError('解析模型列表失败', 'NETWORK'));
                    }
                },
                onerror: () => reject(new ComfyUIError('连接失败', 'NETWORK')),
                ontimeout: () => reject(new ComfyUIError('连接超时', 'NETWORK'))
            });
        });
    }

    function initPanelLogic() {
        const panel = document.getElementById(PANEL_ID);
        const closeButton = panel.querySelector('.floating_panel_close');
        const testButton = document.getElementById('comfyui-test-conn');
        const clearCacheButton = document.getElementById('comfyui-clear-cache');
        const validateCacheButton = document.getElementById('comfyui-validate-cache');
        const forceRescanButton = document.getElementById('comfyui-force-rescan');
        const viewHistoryButton = document.getElementById('comfyui-view-history');
        const debugModeCheckbox = document.getElementById('comfyui-debug-mode');
        const urlInput = document.getElementById('comfyui-url');
        const startTagInput = document.getElementById('comfyui-start-tag');
        const endTagInput = document.getElementById('comfyui-end-tag');
        const promptPrefixInput = document.getElementById('comfyui-prompt-prefix');
        const maxWidthInput = document.getElementById('comfyui-max-width');
        const cacheLimitInput = document.getElementById('comfyui-cache-limit');
        const apiKeyInput = document.getElementById('comfyui-api-key');
        const defaultModelSelect = document.getElementById('comfyui-default-model');
        const notificationLevelSelect = document.getElementById('comfyui-notification-level');
        const enableRetryCheckbox = document.getElementById('comfyui-enable-retry');
        const retryCountInput = document.getElementById('comfyui-retry-count');
        const retryOptions = document.getElementById('comfyui-retry-options');

        // 缓存常用DOM元素
        setCachedDOMElement('panel', panel);
        setCachedDOMElement('testButton', testButton);

        // 重试选项显示/隐藏控制
        enableRetryCheckbox.addEventListener('change', () => {
            retryOptions.style.display = enableRetryCheckbox.checked ? 'block' : 'none';
        });

        // 查看历史记录按钮
        viewHistoryButton.addEventListener('click', () => {
            panel.style.display = 'none';
            openHistoryPanel();
        });

        closeButton.addEventListener('click', () => {
            panel.style.display = 'none';
        });

        testButton.addEventListener('click', () => {
            try {
                let url = urlInput.value.trim();
                if (!url) {
                    throw new ComfyUIError('请输入调度器的URL', 'VALIDATION');
                }

                const apiKey = apiKeyInput.value.trim();
                if (!apiKey) {
                    throw new ComfyUIError('请输入 API 密钥', 'AUTH');
                }

                if (!url.startsWith('http')) {
                    url = 'https://' + url; // 默认使用HTTPS
                }
                if (url.endsWith('/')) {
                    url = url.slice(0, -1);
                }

                // 验证URL
                if (!validateUrl(url)) {
                    throw new ComfyUIError('URL格式无效或不安全，请使用HTTPS', 'VALIDATION');
                }

                urlInput.value = url;
                if (typeof toastr !== 'undefined') toastr.info('正在连接并获取模型...');
                testButton.className = 'comfy-button testing';
                testButton.disabled = true;

                performanceMonitor.startTimer('testConnection');

                (async () => {
                    try {
                        const models = await fetchModelsFromScheduler(url, apiKey);
                        await GM_setValue(STORAGE_KEY_MODELS, models);
                        await GM_setValue(STORAGE_KEY_MODELS_UPDATED_AT, Date.now());

                        cachedSettings.comfyuiUrl = url;
                        cachedSettings.apiKey = apiKey;
                        cachedSettings.availableModels = models;

                        const encryptedApiKey = encryptApiKey(apiKey);
                        await GM_setValue('comfyui_url', url);
                        await GM_setValue('comfyui_api_key', encryptedApiKey);

                        updateModelSelectOptions(defaultModelSelect, models, cachedSettings.defaultModel);
                        cachedSettings.defaultModel = defaultModelSelect.value;
                        await GM_setValue('comfyui_default_model', cachedSettings.defaultModel);

                        updateModelsCacheStatusDisplay();

                        performanceMonitor.endTimer('testConnection');
                        testButton.disabled = false;
                        testButton.className = 'comfy-button success';
                        if (typeof toastr !== 'undefined') toastr.success('连接成功并获取到模型！');
                    } catch (error) {
                        performanceMonitor.endTimer('testConnection');
                        testButton.disabled = false;
                        testButton.className = 'comfy-button error';
                        const msg = error && error.message ? error.message : '连接失败';
                        if (typeof toastr !== 'undefined') toastr.error(msg);
                    }
                })();
            } catch (error) {
                ErrorHandler.handle(error, 'testConnection');
                testButton.disabled = false;
                testButton.className = 'comfy-button error';
            }
        });

        clearCacheButton.addEventListener('click', async () => {
            if (confirm('您确定要删除所有已生成的图片缓存吗？')) {
                try {
                    performanceMonitor.startTimer('clearCache');

                    if (lruCache) {
                        await lruCache.clear();
                    } else {
                        await GM_setValue(STORAGE_KEY_IMAGES, {});
                    }

                    await updateCacheStatusDisplay();  // 【注意】这里立即更新，不使用防抖
                    performanceMonitor.endTimer('clearCache');
                    showNotification('图片缓存已清空！', 'success', 'standard');
                } catch (error) {
                    ErrorHandler.handle(new ComfyUIError('清空缓存失败: ' + error.message, 'CACHE'), 'clearCache');
                }
            }
        });

        validateCacheButton.addEventListener('click', async () => {
            try {
                validateCacheButton.disabled = true;
                validateCacheButton.textContent = '验证中...';

                const validCount = await validateCacheIntegrity();
                await updateCacheStatusDisplay();  // 【注意】这里立即更新，不使用防抖

                validateCacheButton.disabled = false;
                validateCacheButton.textContent = '验证缓存完整性';

                if (typeof toastr !== 'undefined') {
                    toastr.success(`缓存验证完成，有效记录: ${validCount} 条`);
                }
            } catch (error) {
                validateCacheButton.disabled = false;
                validateCacheButton.textContent = '验证缓存完整性';
                ErrorHandler.handle(error, 'validateCache');
            }
        });

        // 调试模式开关
        debugModeCheckbox.addEventListener('change', async () => {
            debugMode = debugModeCheckbox.checked;
            await GM_setValue('comfyui_debug_mode', debugMode);

            if (debugMode) {
                console.log('[ComfyUI Debug] 调试模式已启用');
                if (typeof toastr !== 'undefined') {
                    toastr.info('调试模式已启用，请查看浏览器控制台');
                }
            } else {
                console.log('[ComfyUI Debug] 调试模式已禁用');
            }
        });

        // 强制重新扫描所有消息
        forceRescanButton.addEventListener('click', async () => {
            try {
                forceRescanButton.disabled = true;
                forceRescanButton.textContent = '扫描中...';

                const chatElement = document.getElementById('chat');
                if (chatElement) {
                    const allMessages = chatElement.querySelectorAll('.mes');
                    const savedImages = await GM_getValue(STORAGE_KEY_IMAGES, {});

                    console.log(`[ComfyUI] 开始强制重新扫描 ${allMessages.length} 条消息`);

                    // 清除已有的监听器标记
                    allMessages.forEach(node => {
                        const mesTextElement = node.querySelector('.mes_text');
                        if (mesTextElement) {
                            mesTextElement.dataset.listenersAttached = '';
                            // 移除现有的按钮组以避免重复
                            const existingButtons = mesTextElement.querySelectorAll('.comfy-button-group');
                            existingButtons.forEach(btn => btn.remove());
                        }
                    });

                    // 重新处理所有消息
                    for (const node of allMessages) {
                        try {
                            const mesTextElement = node.querySelector('.mes_text');
                            if (mesTextElement && !mesTextElement.dataset.listenersAttached) {
                                mesTextElement.addEventListener('touchstart', (event) => handleComfyButtonClick(event, true), { passive: false });
                                mesTextElement.addEventListener('click', (event) => handleComfyButtonClick(event, false));
                                mesTextElement.dataset.listenersAttached = 'true';
                            }
                            await processMessageForComfyButton(node, savedImages);
                        } catch (error) {
                            console.error('处理消息节点失败:', error);
                        }
                    }

                    console.log('[ComfyUI] 强制重新扫描完成');
                    if (typeof toastr !== 'undefined') {
                        toastr.success(`已重新扫描 ${allMessages.length} 条消息`);
                    }
                } else {
                    if (typeof toastr !== 'undefined') {
                        toastr.error('未找到聊天区域，无法执行扫描');
                    }
                }

                forceRescanButton.disabled = false;
                forceRescanButton.textContent = '强制重新扫描所有消息';

            } catch (error) {
                forceRescanButton.disabled = false;
                forceRescanButton.textContent = '强制重新扫描所有消息';
                ErrorHandler.handle(new ComfyUIError('强制重新扫描失败: ' + error.message, 'UI'), 'forceRescan');
            }
        });

        loadSettings(urlInput, startTagInput, endTagInput, promptPrefixInput, maxWidthInput, cacheLimitInput, apiKeyInput, defaultModelSelect, notificationLevelSelect, enableRetryCheckbox, retryCountInput, debugModeCheckbox).then(() => {
            applyCurrentMaxWidthToAllImages();
        });

        [urlInput, startTagInput, endTagInput, promptPrefixInput, maxWidthInput, cacheLimitInput, apiKeyInput, defaultModelSelect, notificationLevelSelect, enableRetryCheckbox, retryCountInput, debugModeCheckbox].forEach(input => {
            const eventType = input.type === 'checkbox' ? 'change' : (input.tagName.toLowerCase() === 'select' ? 'change' : 'input');
            input.addEventListener(eventType, async () => {
                try {
                    if (input === urlInput) testButton.className = 'comfy-button';

                    // 【优化】使用防抖版本的saveSettings，减少频繁保存
                    debouncedSaveSettings(urlInput, startTagInput, endTagInput, promptPrefixInput, maxWidthInput, cacheLimitInput, apiKeyInput, defaultModelSelect, notificationLevelSelect, enableRetryCheckbox, retryCountInput);

                    if (input === maxWidthInput) applyCurrentMaxWidthToAllImages();
                    if (input === urlInput) {
                        if (socket) {
                            try {
                                socket.disconnect();
                            } catch (e) {
                            }
                            socket = null;
                        }
                        socketListenersBound = false;
                        socketInitInProgress = false;
                        hasShownRealtimeConnectedToast = false;
                        hasShownExpiryToast = false;
                        setTimeout(connectWebSocket, 500); // 延迟重连
                    }

                    if (input === apiKeyInput) {
                        hasShownExpiryToast = false;
                    }
                } catch (error) {
                    ErrorHandler.handle(error, 'saveSettings');
                }
            });
        });
    }

    async function loadSettings(urlInput, startTagInput, endTagInput, promptPrefixInput, maxWidthInput, cacheLimitInput, apiKeyInput, defaultModelSelect, notificationLevelSelect, enableRetryCheckbox, retryCountInput, debugModeCheckbox) {
        try {
            performanceMonitor.startTimer('loadSettings');

            cachedSettings.comfyuiUrl = await GM_getValue('comfyui_url', 'https://www.fengzheng.dpdns.org');
            cachedSettings.startTag = await GM_getValue('comfyui_start_tag', 'image###');
            cachedSettings.endTag = await GM_getValue('comfyui_end_tag', '###');
            cachedSettings.promptPrefix = await GM_getValue(STORAGE_KEY_PROMPT_PREFIX, '');
            cachedSettings.maxWidth = await GM_getValue(STORAGE_KEY_MAX_WIDTH, 600);
            cachedSettings.cacheLimit = await GM_getValue(STORAGE_KEY_CACHE_LIMIT, 20);

            // 解密API密钥
            const encryptedApiKey = await GM_getValue('comfyui_api_key', '');
            cachedSettings.apiKey = decryptApiKey(encryptedApiKey);

            cachedSettings.defaultModel = await GM_getValue('comfyui_default_model', '');
            cachedSettings.notificationLevel = await GM_getValue('comfyui_notification_level', 'silent');
            cachedSettings.enableRetry = await GM_getValue('comfyui_enable_retry', true);
            cachedSettings.retryCount = await GM_getValue('comfyui_retry_count', 3);

            cachedSettings.availableModels = await GM_getValue(STORAGE_KEY_MODELS, []);
            updateModelSelectOptions(defaultModelSelect, cachedSettings.availableModels, cachedSettings.defaultModel);

            urlInput.value = cachedSettings.comfyuiUrl;
            startTagInput.value = cachedSettings.startTag;
            endTagInput.value = cachedSettings.endTag;
            promptPrefixInput.value = cachedSettings.promptPrefix;
            maxWidthInput.value = cachedSettings.maxWidth;
            cacheLimitInput.value = cachedSettings.cacheLimit;
            apiKeyInput.value = cachedSettings.apiKey;
            cachedSettings.defaultModel = defaultModelSelect.value;
            notificationLevelSelect.value = cachedSettings.notificationLevel;
            enableRetryCheckbox.checked = cachedSettings.enableRetry;
            retryCountInput.value = cachedSettings.retryCount;

            // 显示/隐藏重试选项
            document.getElementById('comfyui-retry-options').style.display = cachedSettings.enableRetry ? 'block' : 'none';

            // 加载调试模式设置
            debugMode = await GM_getValue('comfyui_debug_mode', false);
            debugModeCheckbox.checked = debugMode;

            document.documentElement.style.setProperty('--comfy-image-max-width', (cachedSettings.maxWidth || 600) + 'px');
            await updateCacheStatusDisplay();
            await updateModelsCacheStatusDisplay();

            // 验证配置
            const configErrors = validateConfig(cachedSettings);
            showConfigErrors(configErrors);

            performanceMonitor.endTimer('loadSettings');
        } catch (error) {
            ErrorHandler.handle(new ComfyUIError('加载设置失败: ' + error.message, 'CONFIG'), 'loadSettings');
        }
    }

    async function saveSettings(urlInput, startTagInput, endTagInput, promptPrefixInput, maxWidthInput, cacheLimitInput, apiKeyInput, defaultModelSelect, notificationLevelSelect, enableRetryCheckbox, retryCountInput) {
        try {
            performanceMonitor.startTimer('saveSettings');

            const newSettings = {
                comfyuiUrl: urlInput.value.trim(),
                startTag: startTagInput.value,
                endTag: endTagInput.value,
                promptPrefix: promptPrefixInput.value.trim(),
                maxWidth: parseInt(maxWidthInput.value) || 600,
                cacheLimit: parseInt(cacheLimitInput.value) || 20,
                apiKey: apiKeyInput.value.trim(),
                defaultModel: defaultModelSelect.value,
                notificationLevel: notificationLevelSelect.value,
                enableRetry: enableRetryCheckbox.checked,
                retryCount: parseInt(retryCountInput.value) || 3
            };

            // 验证新配置
            const configErrors = validateConfig(newSettings);
            showConfigErrors(configErrors);

            // 如果有严重错误，不保存配置
            if (configErrors.length > 0 && configErrors.some(error => error.includes('URL'))) {
                return;
            }

            // 更新缓存设置
            Object.assign(cachedSettings, newSettings);

            // 加密并保存API密钥
            const encryptedApiKey = encryptApiKey(cachedSettings.apiKey);

            await GM_setValue('comfyui_url', cachedSettings.comfyuiUrl);
            await GM_setValue('comfyui_start_tag', cachedSettings.startTag);
            await GM_setValue('comfyui_end_tag', cachedSettings.endTag);
            await GM_setValue(STORAGE_KEY_PROMPT_PREFIX, cachedSettings.promptPrefix);
            await GM_setValue(STORAGE_KEY_MAX_WIDTH, cachedSettings.maxWidth);
            await GM_setValue(STORAGE_KEY_CACHE_LIMIT, cachedSettings.cacheLimit);
            await GM_setValue('comfyui_api_key', encryptedApiKey);
            await GM_setValue('comfyui_default_model', cachedSettings.defaultModel);
            await GM_setValue('comfyui_notification_level', cachedSettings.notificationLevel);
            await GM_setValue('comfyui_enable_retry', cachedSettings.enableRetry);
            await GM_setValue('comfyui_retry_count', cachedSettings.retryCount);

            // 如果缓存限制改变，更新LRU缓存大小
            if (lruCache && lruCache.maxSize !== cachedSettings.cacheLimit) {
                lruCache.maxSize = cachedSettings.cacheLimit;
                if (lruCache.cache.size > lruCache.maxSize) {
                    await lruCache.evict();
                }
            }

            document.documentElement.style.setProperty('--comfy-image-max-width', cachedSettings.maxWidth + 'px');
            debouncedUpdateCacheStatus();  // 【优化】使用防抖版本

            performanceMonitor.endTimer('saveSettings');
        } catch (error) {
            ErrorHandler.handle(new ComfyUIError('保存设置失败: ' + error.message, 'CONFIG'), 'saveSettings');
        }
    }

    // 【优化】创建防抖版本的设置保存函数
    const debouncedSaveSettings = debounce(saveSettings, 500);

    async function applyCurrentMaxWidthToAllImages() {
        try {
            const images = document.querySelectorAll('.comfy-image-container img');
            const maxWidthPx = (cachedSettings.maxWidth || 600) + 'px';
            images.forEach(img => {
                img.style.maxWidth = maxWidthPx;
            });
        } catch (error) {
            console.error('应用图片宽度设置失败:', error);
        }
    }

    function addMainButton() {
        if (document.getElementById(BUTTON_ID)) return;

        const optionsMenuContent = document.querySelector('#options .options-content');
        if (optionsMenuContent) {
            const continueButton = optionsMenuContent.querySelector('#option_continue');
            if (continueButton) {
                const comfyButton = document.createElement('a');
                comfyButton.id = BUTTON_ID;
                comfyButton.className = 'interactable';
                comfyButton.innerHTML = `<i class="fa-lg fa-solid fa-image"></i><span>ComfyUI生图 (优化版)</span>`;
                comfyButton.style.cursor = 'pointer';
                comfyButton.addEventListener('click', (event) => {
                    event.preventDefault();
                    document.getElementById(PANEL_ID).style.display = 'flex';
                    document.getElementById('options').style.display = 'none';
                });
                continueButton.parentNode.insertBefore(comfyButton, continueButton.nextSibling);
            }
        }
    }

    // --- Helper and Cache Management ---
    function escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function generateClientId() {
        return 'client-' + Math.random().toString(36).substring(2, 15) + '-' + Date.now();
    }

    function simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash |= 0;
        }
        return 'comfy-id-' + Math.abs(hash).toString(36);
    }

    // --- 防抖节流工具函数 ---
    /**
     * 防抖函数 - 延迟执行，多次触发只执行最后一次
     * @param {Function} func - 要执行的函数
     * @param {number} wait - 延迟时间（毫秒）
     * @returns {Function} 防抖后的函数
     */
    function debounce(func, wait = 300) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func.apply(this, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * 节流函数 - 限制执行频率，固定时间内只执行一次
     * @param {Function} func - 要执行的函数
     * @param {number} limit - 时间间隔（毫秒）
     * @returns {Function} 节流后的函数
     */
    function throttle(func, limit = 200) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // --- Image Download Helper ---
    function downloadImage(imageData, filename = 'comfyui-image.png') {
        try {
            const link = document.createElement('a');
            link.href = imageData;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            showNotification('图片已保存！', 'success', 'standard');
        } catch (error) {
            console.error('下载图片失败:', error);
            showNotification('下载失败，请重试', 'error');
        }
    }

    // --- IndexedDB Cache Manager ---
    class IndexedDBCache {
        constructor(dbName = 'ComfyUICache', version = 1) {
            this.dbName = dbName;
            this.version = version;
            this.db = null;
            this.storeName = 'images';
        }

        async init() {
            return new Promise((resolve, reject) => {
                const request = indexedDB.open(this.dbName, this.version);

                request.onerror = () => {
                    console.error('[IndexedDB] 打开数据库失败:', request.error);
                    reject(new ComfyUIError('IndexedDB初始化失败', 'CACHE'));
                };

                request.onsuccess = () => {
                    this.db = request.result;
                    console.log('[IndexedDB] 数据库已打开');
                    resolve();
                };

                request.onupgradeneeded = (event) => {
                    const db = event.target.result;

                    // 创建对象存储
                    if (!db.objectStoreNames.contains(this.storeName)) {
                        const objectStore = db.createObjectStore(this.storeName, { keyPath: 'id' });
                        objectStore.createIndex('timestamp', 'timestamp', { unique: false });
                        objectStore.createIndex('size', 'size', { unique: false });
                        console.log('[IndexedDB] 对象存储已创建');
                    }
                };
            });
        }

        async set(id, data, metadata = {}) {
            return new Promise((resolve, reject) => {
                if (!this.db) {
                    reject(new ComfyUIError('IndexedDB未初始化', 'CACHE'));
                    return;
                }

                const transaction = this.db.transaction([this.storeName], 'readwrite');
                const objectStore = transaction.objectStore(this.storeName);

                const record = {
                    id,
                    data,
                    timestamp: Date.now(),
                    size: data.length,
                    accessCount: metadata.accessCount || 0,
                    ...metadata
                };

                const request = objectStore.put(record);

                request.onsuccess = () => {
                    if (debugMode) {
                        console.log(`[IndexedDB] 已保存: ${id}, 大小: ${(data.length / 1024).toFixed(2)}KB`);
                    }
                    resolve();
                };

                request.onerror = () => {
                    console.error('[IndexedDB] 保存失败:', request.error);
                    reject(new ComfyUIError('IndexedDB保存失败', 'CACHE'));
                };
            });
        }

        async get(id) {
            return new Promise((resolve, reject) => {
                if (!this.db) {
                    reject(new ComfyUIError('IndexedDB未初始化', 'CACHE'));
                    return;
                }

                const transaction = this.db.transaction([this.storeName], 'readonly');
                const objectStore = transaction.objectStore(this.storeName);
                const request = objectStore.get(id);

                request.onsuccess = () => {
                    const record = request.result;
                    if (record) {
                        if (debugMode) {
                            console.log(`[IndexedDB] 读取成功: ${id}`);
                        }
                        resolve(record);
                    } else {
                        resolve(null);
                    }
                };

                request.onerror = () => {
                    console.error('[IndexedDB] 读取失败:', request.error);
                    reject(new ComfyUIError('IndexedDB读取失败', 'CACHE'));
                };
            });
        }

        async delete(id) {
            return new Promise((resolve, reject) => {
                if (!this.db) {
                    reject(new ComfyUIError('IndexedDB未初始化', 'CACHE'));
                    return;
                }

                const transaction = this.db.transaction([this.storeName], 'readwrite');
                const objectStore = transaction.objectStore(this.storeName);
                const request = objectStore.delete(id);

                request.onsuccess = () => {
                    if (debugMode) {
                        console.log(`[IndexedDB] 已删除: ${id}`);
                    }
                    resolve();
                };

                request.onerror = () => {
                    console.error('[IndexedDB] 删除失败:', request.error);
                    reject(new ComfyUIError('IndexedDB删除失败', 'CACHE'));
                };
            });
        }

        async getAll() {
            return new Promise((resolve, reject) => {
                if (!this.db) {
                    reject(new ComfyUIError('IndexedDB未初始化', 'CACHE'));
                    return;
                }

                const transaction = this.db.transaction([this.storeName], 'readonly');
                const objectStore = transaction.objectStore(this.storeName);
                const request = objectStore.getAll();

                request.onsuccess = () => {
                    resolve(request.result || []);
                };

                request.onerror = () => {
                    console.error('[IndexedDB] 获取全部数据失败:', request.error);
                    reject(new ComfyUIError('IndexedDB查询失败', 'CACHE'));
                };
            });
        }

        async clear() {
            return new Promise((resolve, reject) => {
                if (!this.db) {
                    reject(new ComfyUIError('IndexedDB未初始化', 'CACHE'));
                    return;
                }

                const transaction = this.db.transaction([this.storeName], 'readwrite');
                const objectStore = transaction.objectStore(this.storeName);
                const request = objectStore.clear();

                request.onsuccess = () => {
                    console.log('[IndexedDB] 已清空所有数据');
                    resolve();
                };

                request.onerror = () => {
                    console.error('[IndexedDB] 清空失败:', request.error);
                    reject(new ComfyUIError('IndexedDB清空失败', 'CACHE'));
                };
            });
        }

        async count() {
            return new Promise((resolve, reject) => {
                if (!this.db) {
                    reject(new ComfyUIError('IndexedDB未初始化', 'CACHE'));
                    return;
                }

                const transaction = this.db.transaction([this.storeName], 'readonly');
                const objectStore = transaction.objectStore(this.storeName);
                const request = objectStore.count();

                request.onsuccess = () => {
                    resolve(request.result);
                };

                request.onerror = () => {
                    reject(new ComfyUIError('IndexedDB计数失败', 'CACHE'));
                };
            });
        }

        async getTotalSize() {
            const records = await this.getAll();
            return records.reduce((total, record) => total + (record.size || 0), 0);
        }
    }

    // --- LRU Cache Manager (增强版 - 配合IndexedDB使用) ---
    class LRUCache {
        constructor(maxSize = 20, useIndexedDB = true) {
            this.maxSize = maxSize;
            this.cache = new Map(); // key -> {data, timestamp, size, accessCount}
            this.useIndexedDB = useIndexedDB;
            this.indexedDB = null;
        }

        async load() {
            try {
                // 【优化】优先从IndexedDB加载
                if (this.useIndexedDB && this.indexedDB) {
                    const records = await this.indexedDB.getAll();
                    this.cache.clear();

                    for (const record of records) {
                        this.cache.set(record.id, {
                            data: record.data,
                            timestamp: record.timestamp || Date.now(),
                            size: record.size || record.data.length,
                            accessCount: record.accessCount || 0
                        });
                    }

                    console.log(`[LRU Cache] 从IndexedDB加载 ${this.cache.size} 条记录`);
                } else {
                    // 回退到GM_getValue
                    const records = await GM_getValue(STORAGE_KEY_IMAGES, {});
                    this.cache.clear();

                    for (const [id, data] of Object.entries(records)) {
                        this.cache.set(id, {
                            data,
                            timestamp: Date.now(),
                            size: data.length,
                            accessCount: 0
                        });
                    }

                    console.log(`[LRU Cache] 从GM_getValue加载 ${this.cache.size} 条记录`);
                }
            } catch (error) {
                console.error('LRU缓存加载失败:', error);
            }
        }

        async get(key) {
            const item = this.cache.get(key);
            if (item) {
                // 更新访问时间和计数
                item.timestamp = Date.now();
                item.accessCount++;
                this.cache.delete(key);
                this.cache.set(key, item); // 移到末尾（最近使用）

                if (debugMode) {
                    console.log(`[LRU Cache] 缓存命中: ${key}, 访问次数: ${item.accessCount}`);
                }

                return item.data;
            }
            return null;
        }

        async set(key, data) {
            // 如果已存在，先删除
            if (this.cache.has(key)) {
                this.cache.delete(key);
            }

            // 添加新项
            const item = {
                data,
                timestamp: Date.now(),
                size: data.length,
                accessCount: 1
            };

            this.cache.set(key, item);

            // 【优化】如果使用IndexedDB，直接保存到IndexedDB
            if (this.useIndexedDB && this.indexedDB) {
                try {
                    await this.indexedDB.set(key, data, {
                        timestamp: item.timestamp,
                        accessCount: item.accessCount
                    });
                } catch (error) {
                    console.error('[LRU Cache] IndexedDB保存失败，回退到GM_setValue:', error);
                    await this.save(); // 回退方案
                }
            } else {
                // 回退到GM_setValue
                await this.save();
            }

            // 如果超过最大容量，移除最少使用的项
            if (this.cache.size > this.maxSize) {
                await this.evict();
            }
        }

        async evict() {
            // 获取所有缓存项并按优先级排序
            const items = Array.from(this.cache.entries()).map(([key, value]) => ({
                key,
                ...value,
                score: this.calculateScore(value)
            }));

            // 按分数排序（分数越低越应该被删除）
            items.sort((a, b) => a.score - b.score);

            // 删除最低优先级的项
            const toRemove = items.slice(0, this.cache.size - this.maxSize + 1);

            for (const item of toRemove) {
                this.cache.delete(item.key);

                // 【优化】同时从IndexedDB删除
                if (this.useIndexedDB && this.indexedDB) {
                    try {
                        await this.indexedDB.delete(item.key);
                    } catch (error) {
                        console.error('[LRU Cache] IndexedDB删除失败:', error);
                    }
                }

                if (debugMode) {
                    console.log(`[LRU Cache] 移除缓存: ${item.key}, 分数: ${item.score.toFixed(2)}`);
                }
            }
        }

        calculateScore(item) {
            // 计算缓存项的重要性分数
            const ageInDays = (Date.now() - item.timestamp) / (1000 * 60 * 60 * 24);
            const sizeInMB = item.size / (1024 * 1024);

            // 分数 = 访问次数 / (年龄 + 1) - 大小惩罚
            // 访问次数越多、越新的项分数越高
            // 文件越大会降低分数
            return (item.accessCount / (ageInDays + 1)) - (sizeInMB * 0.5);
        }

        async delete(key) {
            if (this.cache.has(key)) {
                this.cache.delete(key);

                // 【优化】从IndexedDB删除
                if (this.useIndexedDB && this.indexedDB) {
                    try {
                        await this.indexedDB.delete(key);
                    } catch (error) {
                        console.error('[LRU Cache] IndexedDB删除失败:', error);
                        await this.save(); // 回退方案
                    }
                } else {
                    await this.save();
                }

                return true;
            }
            return false;
        }

        async save() {
            try {
                // 【优化】如果使用IndexedDB，不需要批量保存
                if (this.useIndexedDB && this.indexedDB) {
                    // IndexedDB已经实时保存，这里不需要做任何事
                    return;
                }

                // 回退到GM_setValue
                const records = {};
                for (const [key, value] of this.cache.entries()) {
                    records[key] = value.data;
                }
                await GM_setValue(STORAGE_KEY_IMAGES, records);
            } catch (error) {
                console.error('LRU缓存保存失败:', error);
            }
        }

        async clear() {
            this.cache.clear();

            // 【优化】同时清空IndexedDB
            if (this.useIndexedDB && this.indexedDB) {
                try {
                    await this.indexedDB.clear();
                } catch (error) {
                    console.error('[LRU Cache] IndexedDB清空失败:', error);
                    await GM_setValue(STORAGE_KEY_IMAGES, {}); // 回退方案
                }
            } else {
                await GM_setValue(STORAGE_KEY_IMAGES, {});
            }
        }

        getStats() {
            const items = Array.from(this.cache.values());
            const totalSize = items.reduce((sum, item) => sum + item.size, 0);
            const totalAccess = items.reduce((sum, item) => sum + item.accessCount, 0);

            return {
                count: this.cache.size,
                maxSize: this.maxSize,
                totalSize,
                totalSizeMB: (totalSize * 0.75 / 1024 / 1024).toFixed(1),
                totalAccess,
                avgAccessCount: items.length > 0 ? (totalAccess / items.length).toFixed(1) : 0
            };
        }

        getAll() {
            return Array.from(this.cache.entries()).map(([key, value]) => ({
                id: key,
                ...value,
                sizeMB: (value.size * 0.75 / 1024 / 1024).toFixed(2),
                ageInHours: ((Date.now() - value.timestamp) / (1000 * 60 * 60)).toFixed(1)
            }));
        }
    }

    // 全局LRU缓存实例
    let lruCache = null;

    // --- Retry with Exponential Backoff ---
    async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 1000) {
        for (let i = 0; i < maxRetries; i++) {
            try {
                return await fn();
            } catch (error) {
                if (i === maxRetries - 1) {
                    throw error;
                }

                const delay = baseDelay * Math.pow(2, i);
                console.log(`重试 ${i + 1}/${maxRetries}，等待 ${delay}ms...`);

                if (debugMode) {
                    console.log(`[ComfyUI Debug] 重试原因: ${error.message}`);
                }

                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }

    async function saveImageRecord(generationId, imageBase64Data) {
        try {
            performanceMonitor.startTimer('saveImageRecord');

            if (lruCache) {
                await lruCache.set(generationId, imageBase64Data);

                const stats = lruCache.getStats();
                if (debugMode) {
                    console.log(`[LRU Cache] 保存成功: ${generationId}, 当前: ${stats.count}/${stats.maxSize}`);
                }
            } else {
                // 回退到旧方法
                let records = await GM_getValue(STORAGE_KEY_IMAGES, {});
                if (records.hasOwnProperty(generationId)) delete records[generationId];
                records[generationId] = imageBase64Data;

                const keys = Object.keys(records);
                if (keys.length > cachedSettings.cacheLimit) {
                    const keysToDelete = keys.slice(0, keys.length - cachedSettings.cacheLimit);
                    keysToDelete.forEach(key => delete records[key]);
                    console.log(`缓存已满，删除了 ${keysToDelete.length} 条旧记录。`);
                }

                await GM_setValue(STORAGE_KEY_IMAGES, records);
            }

            debouncedUpdateCacheStatus();  // 【优化】使用防抖版本
            performanceMonitor.endTimer('saveImageRecord');
        } catch (error) {
            ErrorHandler.handle(new ComfyUIError('保存图片记录失败: ' + error.message, 'CACHE'), 'saveImageRecord');
        }
    }

    async function deleteImageRecord(generationId) {
        try {
            if (lruCache) {
                await lruCache.delete(generationId);
            } else {
                const records = await GM_getValue(STORAGE_KEY_IMAGES, {});
                delete records[generationId];
                await GM_setValue(STORAGE_KEY_IMAGES, records);
            }
            debouncedUpdateCacheStatus();  // 【优化】使用防抖版本
        } catch (error) {
            ErrorHandler.handle(new ComfyUIError('删除图片记录失败: ' + error.message, 'CACHE'), 'deleteImageRecord');
        }
    }


    // --- Chat Message Processing and Image Generation ---
    function handleComfyButtonClick(event, isTouch = false) {
        try {
            const button = event.target.closest('.comfy-chat-generate-button');
            if (!button) return;

            if (isTouch) {
                event.preventDefault();
                const now = Date.now();
                if (now - lastTapTimestamp < TAP_THRESHOLD) return;
                lastTapTimestamp = now;
                onGenerateButtonClickLogic(button);
            } else {
                if (Date.now() - lastTapTimestamp < TAP_THRESHOLD) return;
                onGenerateButtonClickLogic(button);
            }
        } catch (error) {
            ErrorHandler.handle(new ComfyUIError('处理按钮点击失败: ' + error.message, 'UI'), 'handleComfyButtonClick');
        }
    }

    async function processMessageForComfyButton(messageNode, savedImagesCache) {
        try {
            const mesText = messageNode.querySelector('.mes_text');
            if (!mesText) {
                if (debugMode) console.log('[ComfyUI Debug] 未找到 .mes_text 元素');
                return;
            }

            const { startTag, endTag } = cachedSettings;
            if (!startTag || !endTag) {
                if (debugMode) console.log('[ComfyUI Debug] 开始或结束标签未配置:', { startTag, endTag });
                return;
            }

            if (debugMode) {
                console.log('[ComfyUI Debug] 开始处理消息, 标签:', { startTag, endTag });
                console.log('[ComfyUI Debug] 消息内容:', mesText.innerHTML);
            }

            const regex = new RegExp(
                escapeRegex(startTag) +
                '(?:\\[model=([\\w.-]+)\\])?' +
                '([\\s\\S]*?)' +
                escapeRegex(endTag),
                'g'
            );

            if (debugMode) console.log('[ComfyUI Debug] 使用的正则表达式:', regex);

            const currentHtml = mesText.innerHTML;
            const matches = currentHtml.match(regex);
            if (debugMode) console.log('[ComfyUI Debug] 正则匹配结果:', matches);

            // 检查是否存在文本内容中的标签（未被HTML转义的）
            const textContent = mesText.textContent || mesText.innerText || '';
            if (debugMode) console.log('[ComfyUI Debug] 纯文本内容:', textContent);

            const textMatches = textContent.match(regex);
            if (debugMode) console.log('[ComfyUI Debug] 纯文本匹配结果:', textMatches);

            // 尝试处理HTML内容
            let processedHtml = false;
            if (regex.test(currentHtml) && !mesText.querySelector('.comfy-button-group')) {
                if (debugMode) console.log('[ComfyUI Debug] 在HTML中发现匹配，开始替换');
                mesText.innerHTML = currentHtml.replace(regex, (match, model, prompt) => {
                    if (debugMode) console.log('[ComfyUI Debug] 替换匹配项:', { match, model, prompt });
                    const cleanPrompt = sanitizePrompt(prompt.trim());
                    const encodedPrompt = cleanPrompt.replace(/"/g, '&quot;');
                    const modelName = model ? model.trim() : '';
                    const generationId = simpleHash(modelName + cleanPrompt);
                    return `<span class="comfy-button-group" data-generation-id="${generationId}"><button class="comfy-button comfy-chat-generate-button" data-prompt="${encodedPrompt}" data-model="${modelName}">开始生成</button></span>`;
                });
                processedHtml = true;
            }

            // 如果HTML中没有找到，尝试处理纯文本内容
            if (!processedHtml && textMatches && textMatches.length > 0 && !mesText.querySelector('.comfy-button-group')) {
                if (debugMode) console.log('[ComfyUI Debug] HTML中未找到匹配，尝试处理纯文本内容');

                // 重置正则表达式状态
                regex.lastIndex = 0;

                let newHtml = currentHtml;
                let match;
                while ((match = regex.exec(textContent)) !== null) {
                    if (debugMode) console.log('[ComfyUI Debug] 处理纯文本匹配:', match);
                    const fullMatch = match[0];
                    const model = match[1] || '';
                    const prompt = match[2] || '';

                    const cleanPrompt = sanitizePrompt(prompt.trim());
                    const encodedPrompt = cleanPrompt.replace(/"/g, '&quot;');
                    const modelName = model.trim();
                    const generationId = simpleHash(modelName + cleanPrompt);

                    const buttonHtml = `<span class="comfy-button-group" data-generation-id="${generationId}"><button class="comfy-button comfy-chat-generate-button" data-prompt="${encodedPrompt}" data-model="${modelName}">开始生成</button></span>`;

                    // 在HTML中查找并替换对应的文本
                    newHtml = newHtml.replace(escapeRegex(fullMatch), buttonHtml);
                }

                if (newHtml !== currentHtml) {
                    mesText.innerHTML = newHtml;
                    processedHtml = true;
                }
            }

            // 特殊处理：检查是否有被HTML编码的标签
            const htmlEncodedStartTag = startTag.replace(/</g, '&lt;').replace(/>/g, '&gt;');
            const htmlEncodedEndTag = endTag.replace(/</g, '&lt;').replace(/>/g, '&gt;');

            if (htmlEncodedStartTag !== startTag || htmlEncodedEndTag !== endTag) {
                if (debugMode) console.log('[ComfyUI Debug] 检查HTML编码的标签:', { htmlEncodedStartTag, htmlEncodedEndTag });

                const htmlEncodedRegex = new RegExp(
                    escapeRegex(htmlEncodedStartTag) +
                    '(?:\\[model=([\\w.-]+)\\])?' +
                    '([\\s\\S]*?)' +
                    escapeRegex(htmlEncodedEndTag),
                    'g'
                );

                if (htmlEncodedRegex.test(currentHtml) && !mesText.querySelector('.comfy-button-group')) {
                    if (debugMode) console.log('[ComfyUI Debug] 发现HTML编码的标签，进行替换');
                    mesText.innerHTML = currentHtml.replace(htmlEncodedRegex, (match, model, prompt) => {
                        if (debugMode) console.log('[ComfyUI Debug] 替换HTML编码匹配项:', { match, model, prompt });
                        const cleanPrompt = sanitizePrompt(prompt.trim());
                        const encodedPrompt = cleanPrompt.replace(/"/g, '&quot;');
                        const modelName = model ? model.trim() : '';
                        const generationId = simpleHash(modelName + cleanPrompt);
                        return `<span class="comfy-button-group" data-generation-id="${generationId}"><button class="comfy-button comfy-chat-generate-button" data-prompt="${encodedPrompt}" data-model="${modelName}">开始生成</button></span>`;
                    });
                    processedHtml = true;
                }
            }

            if (debugMode && !processedHtml) {
                console.log('[ComfyUI Debug] 未找到任何匹配的标签');
            }

            const buttonGroups = mesText.querySelectorAll('.comfy-button-group');
            if (debugMode) console.log('[ComfyUI Debug] 找到的按钮组数量:', buttonGroups.length);

            buttonGroups.forEach(group => {
                if (group.dataset.listenerAttached) return;
                const generationId = group.dataset.generationId;
                if (savedImagesCache[generationId]) {
                    displayImage(group, savedImagesCache[generationId]);
                    const generateButton = group.querySelector('.comfy-chat-generate-button');
                    if (generateButton) setupGeneratedState(generateButton, generationId);
                }
                group.dataset.listenerAttached = 'true';
            });
        } catch (error) {
            ErrorHandler.handle(new ComfyUIError('处理消息失败: ' + error.message, 'UI'), 'processMessageForComfyButton');
        }
    }

    function setupGeneratedState(generateButton, generationId) {
        try {
            generateButton.textContent = '重新生成';
            generateButton.disabled = false;
            generateButton.classList.remove('testing', 'success', 'error');
            const group = generateButton.closest('.comfy-button-group');
            let deleteButton = group.querySelector('.comfy-delete-button');
            if (!deleteButton) {
                deleteButton = document.createElement('button');
                deleteButton.textContent = '删除';
                deleteButton.className = 'comfy-button error comfy-delete-button';
                deleteButton.addEventListener('click', async () => {
                    try {
                        await deleteImageRecord(generationId);
                        const imageContainer = findImageContainerForGroup(group, generationId);
                        if (imageContainer) {
                            cleanupImageContainerResources(imageContainer);
                            imageContainer.remove();
                        }
                        deleteButton.remove();
                        generateButton.textContent = '开始生成';
                    } catch (error) {
                        ErrorHandler.handle(new ComfyUIError('删除图片失败: ' + error.message, 'CACHE'), 'deleteImage');
                    }
                });
                generateButton.insertAdjacentElement('afterend', deleteButton);
            }
            deleteButton.style.display = 'inline-flex';
        } catch (error) {
            ErrorHandler.handle(new ComfyUIError('设置生成状态失败: ' + error.message, 'UI'), 'setupGeneratedState');
        }
    }

    async function onGenerateButtonClickLogic(button) {
        let group, deleteButton, oldImageContainer; // 移到外部
        try {
            group = button.closest('.comfy-button-group');
            let prompt = button.dataset.prompt;
            const generationId = group.dataset.generationId;

            let model = button.dataset.model || '';
            if (!model) {
                model = await GM_getValue('comfyui_default_model', '');
            }

            const availableModels = await GM_getValue(STORAGE_KEY_MODELS, []);
            if (!Array.isArray(availableModels) || availableModels.length === 0) {
                throw new ComfyUIError('请先在设置面板中点击“测试连接”获取模型列表！', 'CONFIG');
            }

            if (model && !availableModels.includes(model)) {
                const fallbackModel = (await GM_getValue('comfyui_default_model', '')) || availableModels[0] || '';
                if (fallbackModel && availableModels.includes(fallbackModel)) {
                    model = fallbackModel;
                } else {
                    model = availableModels[0] || '';
                }

                if (!model) {
                    throw new ComfyUIError('模型列表为空，请先测试连接获取模型！', 'CONFIG');
                }
            }

            if (button.disabled) return;

            // 获取并解密API密钥
            const encryptedApiKey = await GM_getValue('comfyui_api_key', '');
            const apiKey = decryptApiKey(encryptedApiKey);

            if (!apiKey) {
                throw new ComfyUIError('请先在设置面板中配置 API 密钥！', 'AUTH');
            }

            if (Date.now() < globalCooldownEndTime) {
                const remainingTime = Math.ceil((globalCooldownEndTime - Date.now()) / 1000);
                if (typeof toastr !== 'undefined') toastr.warning(`请稍候，冷却中 (${remainingTime}s)。`);
                return;
            }

            // 清理提示词
            prompt = sanitizePrompt(prompt);
            if (!prompt) {
                throw new ComfyUIError('提示词内容无效', 'VALIDATION');
            }

            button.textContent = '请求中...';
            button.disabled = true;
            button.classList.add('testing');
            deleteButton = group.querySelector('.comfy-delete-button');
            if (deleteButton) deleteButton.style.display = 'none';
            oldImageContainer = findImageContainerForGroup(group, generationId);
            if (oldImageContainer) {
                oldImageContainer.style.opacity = '0.5';
            }

            performanceMonitor.startTimer('generateImage');

            connectWebSocket();
            const { comfyuiUrl, promptPrefix } = cachedSettings;

            if (!comfyuiUrl) {
                throw new ComfyUIError('调度器 URL 未配置', 'CONFIG');
            }

            if (!validateUrl(comfyuiUrl)) {
                throw new ComfyUIError('调度器 URL 格式无效', 'CONFIG');
            }

            if (promptPrefix) prompt = promptPrefix + ' ' + prompt;

            if (typeof toastr !== 'undefined') toastr.info('正在向调度器发送请求...');

            const promptResponse = await sendPromptRequestToScheduler(comfyuiUrl, {
                client_id: generateClientId(),
                positive_prompt: prompt,
                api_key: apiKey,
                model: model
            });

            const promptId = promptResponse.prompt_id;
            if (!promptId) {
                throw new ComfyUIError('调度器未返回有效的任务 ID', 'GENERATION');
            }

            // Zimage已经在响应中完成生成，不需要订阅轮询
            const isZimageComplete = promptResponse.assigned_instance_name === 'Zimage-API';

            if (!isZimageComplete) {
                // ComfyUI需要订阅轮询
                if (socket && socket.connected) {
                    socket.emit('subscribe_to_prompt', { prompt_id: promptId });
                } else {
                    pendingSubscriptions.add(promptId);
                    connectWebSocket();
                }
            }

            activePrompts[promptId] = { button, generationId };
            button.textContent = '生成中...';

            if (promptResponse.assigned_instance_name) {
                if (typeof toastr !== 'undefined') {
                    if (isZimageComplete) {
                        // Zimage简短提示 - 与ComfyUI一致使用success样式
                        toastr.success('Zimage正在生成...');
                    } else {
                        // ComfyUI的原有提示
                        toastr.success(`任务已分配到: ${promptResponse.assigned_instance_name} (队列: ${promptResponse.assigned_instance_queue_size})`);
                    }
                }
            }

            // 【关键修复】如果是Zimage且返回了imageUrl，直接处理图片显示
            if (isZimageComplete && promptResponse.imageUrl) {
                try {
                    const existingContainer = findImageContainerForGroup(group, generationId);
                    if (existingContainer) {
                        cleanupImageContainerResources(existingContainer);
                        existingContainer.remove();
                    }

                    if (promptResponse.imageUrl.startsWith('data:image/')) {
                        await displayImageWithValidation(group, promptResponse.imageUrl, generationId);
                        await saveImageRecord(generationId, promptResponse.imageUrl);
                    } else {
                        let blob;
                        if (cachedSettings.enableRetry) {
                            blob = await retryWithBackoff(
                                () => fetchImageAsBlob(promptResponse.imageUrl),
                                cachedSettings.retryCount,
                                1000
                            );
                        } else {
                            blob = await fetchImageAsBlob(promptResponse.imageUrl);
                        }

                        const objectUrl = URL.createObjectURL(blob);
                        await displayImageWithValidation(group, objectUrl, generationId);

                        (async () => {
                            try {
                                const base64 = await blobToBase64(blob);
                                await saveImageRecord(generationId, base64);

                                const container = findImageContainerForGroup(group, generationId);
                                const imgElement = container ? container.querySelector('img') : null;

                                if (imgElement) {
                                    const prevSrc = imgElement.src;
                                    imgElement.src = base64;
                                    if (prevSrc && prevSrc.startsWith('blob:')) {
                                        URL.revokeObjectURL(prevSrc);
                                    }
                                }
                            } catch (e) {
                                console.error('后台缓存图片失败:', e);
                            }
                        })();
                    }

                    showNotification('Zimage图片生成成功！', 'success', 'standard');

                    button.textContent = '生成成功';
                    button.classList.remove('testing');
                    button.classList.add('success');
                    setTimeout(() => {
                        setupGeneratedState(button, generationId);
                    }, 2000);

                    delete activePrompts[promptId];
                } catch (imgError) {
                    console.error('Zimage图片加载失败:', imgError);
                    showNotification(`图片加载失败: ${imgError.message}`, 'error');
                    button.textContent = '图片加载失败';
                    button.classList.remove('testing');
                    button.classList.add('error');
                    setTimeout(() => {
                        button.disabled = false;
                        button.classList.remove('error');
                        button.textContent = group.querySelector('.comfy-delete-button') ? '重新生成' : '开始生成';
                    }, 3000);
                }
            }

            performanceMonitor.endTimer('generateImage');

        } catch (error) {
            performanceMonitor.endTimer('generateImage');
            ErrorHandler.handle(error, 'generateImage');

            button.textContent = error.type === 'AUTH' ? '认证失败' : '请求失败';
            button.classList.add('error');

            setTimeout(() => {
                button.classList.remove('testing', 'error');
                button.textContent = group.querySelector('.comfy-delete-button') ? '重新生成' : '开始生成';
                button.disabled = false;
                if (oldImageContainer) oldImageContainer.style.opacity = '1';
                if (deleteButton) deleteButton.style.display = 'inline-flex';
            }, 3000);

            if (error.type === 'AUTH') {
                // 认证失败时打开设置面板
                document.getElementById(PANEL_ID).style.display = 'flex';
            }
        }
    }

    // --- API Request Functions ---
    function sendPromptRequestToScheduler(url, payload) {
        return new Promise((resolve, reject) => {
            // 验证payload
            if (!payload.api_key) {
                reject(new ComfyUIError('API密钥缺失', 'AUTH'));
                return;
            }

            if (!payload.positive_prompt || payload.positive_prompt.trim().length === 0) {
                reject(new ComfyUIError('提示词不能为空', 'VALIDATION'));
                return;
            }

            GM_xmlhttpRequest({
                method: 'POST',
                url: `${url}/generate`,
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'ComfyUI-TamperMonkey-Script/2.0'
                },
                data: JSON.stringify(payload),
                timeout: 90000,
                onload: (res) => {

                    try {
                        if (res.status === 202 || res.status === 200) {
                            const responseData = JSON.parse(res.responseText);
                            resolve(responseData);
                        } else if (res.status === 401 || res.status === 403) {
                            reject(new ComfyUIError('API密钥无效或权限不足', 'AUTH'));
                        } else {
                            let errorMsg = `调度器 API 错误: ${res.status}`;
                            try {
                                const errorJson = JSON.parse(res.responseText);
                                if (errorJson.error) errorMsg = errorJson.error;
                            } catch (e) {
                                // JSON解析失败，使用默认错误消息
                            }
                            reject(new ComfyUIError(errorMsg, 'GENERATION'));
                        }
                    } catch (error) {
                        reject(new ComfyUIError('解析服务器响应失败: ' + error.message, 'NETWORK'));
                    }
                },
                onerror: (e) => reject(new ComfyUIError('无法连接到调度器 API', 'NETWORK')),
                ontimeout: () => reject(new ComfyUIError('连接调度器 API 超时', 'NETWORK')),
            });
        });
    }

    // 验证图片URL是否可访问
    function validateImageUrl(imageUrl) {
        return new Promise((resolve, reject) => {
            // 如果是base64数据，直接通过验证
            if (imageUrl.startsWith('data:image/')) {
                resolve(true);
                return;
            }

            // 验证URL格式
            try {
                new URL(imageUrl);
            } catch (e) {
                reject(new ComfyUIError('图片URL格式无效', 'VALIDATION'));
                return;
            }

            // 尝试HEAD请求验证图片是否可访问
            GM_xmlhttpRequest({
                method: 'HEAD',
                url: imageUrl,
                timeout: 5000,
                onload: (response) => {
                    if (response.status === 200 || response.status === 304) {
                        resolve(true);
                    } else {
                        reject(new ComfyUIError(`图片URL不可访问 (状态: ${response.status})`, 'NETWORK'));
                    }
                },
                onerror: () => reject(new ComfyUIError('无法访问图片URL', 'NETWORK')),
                ontimeout: () => reject(new ComfyUIError('验证图片URL超时', 'NETWORK'))
            });
        });
    }

    function revokeBlobUrlIfNeeded(url) {
        try {
            if (typeof url === 'string' && url.startsWith('blob:')) {
                URL.revokeObjectURL(url);
            }
        } catch (e) {
        }
    }

    function cleanupImageContainerResources(container) {
        try {
            if (!container) return;
            const img = container.querySelector('img');
            if (img && img.src) {
                revokeBlobUrlIfNeeded(img.src);
            }
        } catch (e) {
        }
    }

    function fetchUserInfoFromScheduler(baseUrl, apiKey) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `${baseUrl}/me?api_key=${encodeURIComponent(apiKey)}`,
                timeout: 10000,
                onload: (res) => {
                    try {
                        if (res.status === 200) {
                            const data = JSON.parse(res.responseText || '{}');
                            resolve(data);
                        } else if (res.status === 401 || res.status === 403) {
                            let data = {};
                            try {
                                data = JSON.parse(res.responseText || '{}');
                            } catch (e) {
                            }

                            const code = data.error_code;
                            let msg = data.error || 'API密钥无效或已过期';
                            if (code === 'invalid_key') msg = 'API Key 无效，请检查是否输入正确';
                            else if (code === 'expired') msg = '卡密已过期，请联系管理员续期';
                            else if (code === 'disabled') msg = '账户已被禁用，请联系管理员';
                            else if (code === 'missing_key') msg = '请求缺少 API Key';

                            reject(new ComfyUIError(msg, 'AUTH', { error_code: code }));
                        } else {
                            reject(new ComfyUIError(`获取用户信息失败！状态: ${res.status}`, 'NETWORK'));
                        }
                    } catch (e) {
                        reject(new ComfyUIError('解析用户信息失败', 'NETWORK'));
                    }
                },
                onerror: () => reject(new ComfyUIError('连接失败', 'NETWORK')),
                ontimeout: () => reject(new ComfyUIError('连接超时', 'NETWORK'))
            });
        });
    }

    function getUserInfoCacheKeys(baseUrl, apiKey) {
        const suffix = simpleHash(`${baseUrl || ''}|${apiKey || ''}`);
        return {
            infoKey: `${STORAGE_KEY_USER_INFO}_${suffix}`,
            updatedAtKey: `${STORAGE_KEY_USER_INFO_UPDATED_AT}_${suffix}`
        };
    }

    async function showExpiryInfoToastIfPossible() {
        try {
            if (hasShownExpiryToast) return;
            if (!cachedSettings || !cachedSettings.comfyuiUrl || !validateUrl(cachedSettings.comfyuiUrl)) return;

            const encryptedApiKey = await GM_getValue('comfyui_api_key', '');
            const apiKey = decryptApiKey(encryptedApiKey);
            if (!apiKey) return;

            const baseUrl = (cachedSettings.comfyuiUrl || '').replace(/\/$/, '');

            const { infoKey, updatedAtKey } = getUserInfoCacheKeys(baseUrl, apiKey);

            const cachedAt = await GM_getValue(updatedAtKey, 0);
            const cachedUserInfo = await GM_getValue(infoKey, null);
            const now = Date.now();
            const isFresh = cachedAt && (now - cachedAt) < 6 * 60 * 60 * 1000;

            let userInfo = null;
            if (isFresh && cachedUserInfo) {
                userInfo = cachedUserInfo;
            } else {
                userInfo = await fetchUserInfoFromScheduler(baseUrl, apiKey);
                await GM_setValue(infoKey, userInfo);
                await GM_setValue(updatedAtKey, now);
            }

            if (!userInfo) return;

            const remainingText = userInfo.remaining_text || '永久有效';
            const cardType = userInfo.card_type || 'permanent';

            if (typeof toastr !== 'undefined') {
                if (cardType === 'permanent') {
                    toastr.info('卡密：永久有效');
                } else {
                    toastr.info(`卡密到期：${remainingText}`);
                }
            }

            hasShownExpiryToast = true;
        } catch (e) {
            try {
                const msg = e && e.message ? e.message : '';
                if (msg && typeof toastr !== 'undefined') {
                    toastr.error(msg);
                }
            } catch (ignore) {
            }

            // 防止每次重连都重复弹同一个错误
            hasShownExpiryToast = true;
        }
    }

    function findImageContainerForGroup(group, generationId) {
        if (!group) return null;

        const scope = group.closest('.mes_text') || group.parentElement;
        if (scope && generationId) {
            const scoped = scope.querySelector(`.comfy-image-container[data-generation-id="${generationId}"]`);
            if (scoped) return scoped;
        }

        let cursor = group.nextSibling;
        while (cursor) {
            const next = cursor.nextSibling;
            if (cursor.nodeType === Node.ELEMENT_NODE) {
                const el = cursor;
                if (el.classList.contains('comfy-button-group')) break;
                if (el.classList.contains('comfy-image-container')) return el;
            }
            cursor = next;
        }

        return null;
    }

    // 带验证的图片显示函数（用于新生成的图片）- 简化版（参考34.0）+ 移动端优化
    async function displayImageWithValidation(anchorElement, imageBase64Data, generationId) {
        return new Promise((resolve, reject) => {
            try {
                // 验证数据格式：支持base64或普通URL
                if (!imageBase64Data ||
                    (!imageBase64Data.startsWith('data:image/') && !imageBase64Data.startsWith('http://') && !imageBase64Data.startsWith('https://') && !imageBase64Data.startsWith('blob:'))) {
                    throw new ComfyUIError('无效的图片数据格式', 'VALIDATION');
                }

                const group = anchorElement.closest('.comfy-button-group') || anchorElement;

                const scope = group.closest('.mes_text') || group.parentElement;
                if (scope && generationId) {
                    const existingScoped = scope.querySelectorAll(`.comfy-image-container[data-generation-id="${generationId}"]`);
                    existingScoped.forEach(el => {
                        cleanupImageContainerResources(el);
                        el.remove();
                    });
                }

                let cursor = group.nextSibling;
                while (cursor) {
                    const next = cursor.nextSibling;
                    if (cursor.nodeType === Node.ELEMENT_NODE) {
                        const el = cursor;
                        if (el.classList.contains('comfy-button-group')) break;
                        if (el.classList.contains('comfy-image-container')) {
                            cleanupImageContainerResources(el);
                            el.remove();
                        }
                    }
                    cursor = next;
                }

                // 创建新容器
                let container = document.createElement('div');
                container.className = 'comfy-image-container';
                if (generationId) container.dataset.generationId = generationId;
                const img = document.createElement('img');
                img.alt = 'ComfyUI 生成的图片';
                img.loading = 'eager';
                container.appendChild(img);
                group.insertAdjacentElement('afterend', container);
                container.insertAdjacentElement('afterend', group);

                container.style.opacity = '1';
                const imgElement = container.querySelector('img');

                // 清除之前的错误提示（如果有）
                const oldError = container.querySelector('.comfy-image-error');
                if (oldError) {
                    oldError.remove();
                }
                imgElement.style.display = '';

                // 添加加载状态提示（简化版）
                const loadingIndicator = document.createElement('div');
                loadingIndicator.className = 'comfy-loading-indicator';
                loadingIndicator.textContent = '图片渲染中';
                container.insertBefore(loadingIndicator, imgElement);

                // 设置图片加载成功处理
                imgElement.onload = () => {
                    if (loadingIndicator.parentNode) {
                        loadingIndicator.remove();
                    }
                    container.style.opacity = '1';

                    if (debugMode) {
                        console.log(`[ComfyUI Debug] 图片显示成功: ${generationId}`);
                        console.log(`[ComfyUI Debug] 图片尺寸: ${imgElement.naturalWidth}x${imgElement.naturalHeight}`);
                    }

                    resolve();
                };

                // 设置图片加载失败处理
                imgElement.onerror = () => {
                    if (loadingIndicator.parentNode) {
                        loadingIndicator.remove();
                    }

                    console.error(`[ComfyUI Error] Base64图片渲染失败: ${generationId}`);

                    // 显示错误占位图
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'comfy-image-error';
                    errorDiv.style.maxWidth = `${cachedSettings.maxWidth || 600}px`;
                    errorDiv.innerHTML = `
                        <i class="fa fa-exclamation-triangle"></i>
                        <strong>图片渲染失败</strong><br>
                        <small>图片数据可能已损坏，请重新生成</small>
                    `;

                    imgElement.style.display = 'none';
                    container.appendChild(errorDiv);

                    reject(new ComfyUIError('图片渲染失败', 'UI'));
                };

                // 设置图片源（base64数据）
                imgElement.style.maxWidth = (cachedSettings.maxWidth || 600) + 'px';

                if (debugMode) {
                    console.log(`[ComfyUI Debug] 开始渲染图片: ${generationId}`);
                    console.log(`[ComfyUI Debug] Base64数据大小: ${(imageBase64Data.length / 1024).toFixed(2)}KB`);
                }

                imgElement.src = imageBase64Data;

                // 【修复】超时检查 - 使用 imgElement.complete（旧版本方式）
                const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                const timeoutDuration = isMobile ? 90000 : 30000; // 移动端90秒，PC端30秒（更宽松）

                setTimeout(() => {
                    if (!imgElement.complete) {
                        if (loadingIndicator.parentNode) {
                            loadingIndicator.remove();
                        }

                        console.error(`[ComfyUI Error] 图片渲染超时(${timeoutDuration / 1000}秒): ${generationId}`);
                        console.error('[ComfyUI] 图片数据大小:', (imageBase64Data.length / 1024).toFixed(2), 'KB');
                        console.error('[ComfyUI] 设备类型:', isMobile ? '移动端' : 'PC端');
                        console.error('[ComfyUI] imgElement.complete:', imgElement.complete);
                        console.error('[ComfyUI] imgElement.naturalWidth:', imgElement.naturalWidth);

                        // 显示超时错误 - 但图片可能实际已加载，只是complete标志未设置
                        const errorDiv = document.createElement('div');
                        errorDiv.className = 'comfy-image-error';
                        errorDiv.style.maxWidth = `${cachedSettings.maxWidth || 600}px`;
                        errorDiv.innerHTML = `
                            <i class="fa fa-clock"></i>
                            <strong>图片渲染超时</strong><br>
                            <small>图片已压缩至 ${(imageBase64Data.length / 1024).toFixed(0)}KB，但渲染仍然超时<br>建议在ComfyUI后端降低输出分辨率</small>
                        `;

                        imgElement.style.display = 'none';
                        container.appendChild(errorDiv);

                        reject(new ComfyUIError('图片渲染超时', 'UI'));
                    }
                }, timeoutDuration);

            } catch (error) {
                reject(error);
            }
        });
    }

    // 显示图片，现在可以接受URL或Base64数据（用于缓存恢复）
    async function displayImage(anchorElement, imageData) {
        try {
            const group = anchorElement.closest('.comfy-button-group') || anchorElement;

            const generationId = group.dataset.generationId;
            let container = findImageContainerForGroup(group, generationId);

            if (!container) {
                container = document.createElement('div');
                container.className = 'comfy-image-container';
                if (generationId) container.dataset.generationId = generationId;
                const img = document.createElement('img');
                img.alt = 'ComfyUI 生成的图片';
                img.loading = 'lazy';
                container.appendChild(img);
                group.insertAdjacentElement('afterend', container);
            } else if (generationId) {
                container.dataset.generationId = generationId;
            }
            container.insertAdjacentElement('afterend', group);
            container.style.opacity = '1';
            const imgElement = container.querySelector('img');
            imgElement.src = imageData;
            imgElement.style.maxWidth = (cachedSettings.maxWidth || 600) + 'px';
        } catch (error) {
            ErrorHandler.handle(new ComfyUIError('显示图片失败: ' + error.message, 'UI'), 'displayImage');
        }
    }

    // --- Main Execution Logic ---
    console.log('[ComfyUI] 插件开始加载...');
    createComfyUIPanel();

    const chatObserver = new MutationObserver(async (mutations) => {
        try {
            const nodesToProcess = new Set();
            for (const mutation of mutations) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.matches('.mes')) nodesToProcess.add(node);
                        node.querySelectorAll('.mes').forEach(mes => nodesToProcess.add(mes));
                    }
                });
                if (mutation.target.nodeType === Node.ELEMENT_NODE && mutation.target.closest('.mes')) {
                    nodesToProcess.add(mutation.target.closest('.mes'));
                }
            }

            if (nodesToProcess.size > 0) {
                // 从LRU缓存或旧存储获取缓存图片
                let savedImages = {};
                if (lruCache) {
                    // 从LRU缓存获取所有数据
                    const items = lruCache.getAll();
                    items.forEach(item => {
                        savedImages[item.id] = item.data;
                    });
                } else {
                    savedImages = await GM_getValue(STORAGE_KEY_IMAGES, {});
                }

                nodesToProcess.forEach(node => {
                    try {
                        const mesTextElement = node.querySelector('.mes_text');
                        if (mesTextElement && !mesTextElement.dataset.listenersAttached) {
                            mesTextElement.addEventListener('touchstart', (event) => handleComfyButtonClick(event, true), { passive: false });
                            mesTextElement.addEventListener('click', (event) => handleComfyButtonClick(event, false));
                            mesTextElement.dataset.listenersAttached = 'true';
                        }
                        processMessageForComfyButton(node, savedImages);
                    } catch (error) {
                        console.error('处理消息节点失败:', error);
                    }
                });
            }
        } catch (error) {
            ErrorHandler.handle(new ComfyUIError('聊天观察器处理失败: ' + error.message, 'UI'), 'chatObserver');
        }
    });

    async function loadSettingsFromStorageAndApplyToCache() {
        try {
            await migrateConfig(); // 执行配置迁移

            cachedSettings.comfyuiUrl = await GM_getValue('comfyui_url', 'https://127.0.0.1:5001');
            cachedSettings.startTag = await GM_getValue('comfyui_start_tag', 'image###');
            cachedSettings.endTag = await GM_getValue('comfyui_end_tag', '###');
            cachedSettings.promptPrefix = await GM_getValue(STORAGE_KEY_PROMPT_PREFIX, '');
            cachedSettings.maxWidth = await GM_getValue(STORAGE_KEY_MAX_WIDTH, 600);
            cachedSettings.cacheLimit = await GM_getValue(STORAGE_KEY_CACHE_LIMIT, 20);

            document.documentElement.style.setProperty('--comfy-image-max-width', (cachedSettings.maxWidth || 600) + 'px');
        } catch (error) {
            ErrorHandler.handle(new ComfyUIError('加载初始设置失败: ' + error.message, 'CONFIG'), 'loadSettingsFromStorageAndApplyToCache');
        }
    }

    function observeChat() {
        const chatElement = document.getElementById('chat');
        if (chatElement) {
            loadSettingsFromStorageAndApplyToCache().then(async () => {
                try {
                    // 从LRU缓存或旧存储获取缓存图片
                    let initialSavedImages = {};
                    if (lruCache) {
                        const items = lruCache.getAll();
                        items.forEach(item => {
                            initialSavedImages[item.id] = item.data;
                        });
                    } else {
                        initialSavedImages = await GM_getValue(STORAGE_KEY_IMAGES, {});
                    }

                    chatElement.querySelectorAll('.mes').forEach(node => {
                        try {
                            const mesTextElement = node.querySelector('.mes_text');
                            if (mesTextElement && !mesTextElement.dataset.listenersAttached) {
                                mesTextElement.addEventListener('touchstart', (event) => handleComfyButtonClick(event, true), { passive: false });
                                mesTextElement.addEventListener('click', (event) => handleComfyButtonClick(event, false));
                                mesTextElement.dataset.listenersAttached = 'true';
                            }
                            processMessageForComfyButton(node, initialSavedImages);
                        } catch (error) {
                            console.error('初始化消息节点失败:', error);
                        }
                    });
                    chatObserver.observe(chatElement, { childList: true, subtree: true });
                } catch (error) {
                    ErrorHandler.handle(new ComfyUIError('初始化聊天观察失败: ' + error.message, 'UI'), 'observeChat');
                }
            });
        } else {
            setTimeout(observeChat, 500);
        }
    }

    const optionsObserver = new MutationObserver(() => {
        try {
            const optionsMenu = document.getElementById('options');
            if (optionsMenu && optionsMenu.style.display !== 'none') {
                addMainButton();
            }
        } catch (error) {
            console.error('选项观察器错误:', error);
        }
    });

    // 初始化重连器
    function initializeReconnector() {
        reconnector = new SmartReconnector(
            () => {
                if (cachedSettings.comfyuiUrl) {
                    const schedulerUrl = new URL(cachedSettings.comfyuiUrl);
                    return `${schedulerUrl.protocol}//${schedulerUrl.host}`;
                }
                return null;
            },
            connectWebSocket,
            () => {
                if (socket) {
                    socket.disconnect();
                    socket = null;
                }
                socketListenersBound = false;
                socketInitInProgress = false;
                hasShownRealtimeConnectedToast = false;
                hasShownExpiryToast = false;
            }
        );
    }

    // 页面卸载时清理资源
    window.addEventListener('beforeunload', () => {
        try {
            performanceMonitor.stopMemoryMonitoring();
            if (socket) {
                socket.disconnect();
            }
            clearDOMCache();
        } catch (error) {
            console.error('清理资源失败:', error);
        }
    });

    window.addEventListener('load', () => {
        try {
            loadSettingsFromStorageAndApplyToCache().then(async () => {
                initializeReconnector();

                if (cachedSettings.comfyuiUrl && validateUrl(cachedSettings.comfyuiUrl)) {
                    connectWebSocket(); // 页面加载后立即尝试连接
                }

                // 启动性能监控
                performanceMonitor.startMemoryMonitoring();

                // 定期验证缓存完整性
                setInterval(async () => {
                    try {
                        await validateCacheIntegrity();
                    } catch (error) {
                        console.error('定期缓存验证失败:', error);
                    }
                }, 300000); // 每5分钟验证一次

                // 【优化】初始化IndexedDB + LRU缓存
                console.log('[ComfyUI] 正在初始化缓存系统...');

                try {
                    // 创建IndexedDB实例
                    const indexedDBCache = new IndexedDBCache();
                    await indexedDBCache.init();

                    // 创建LRU缓存并关联IndexedDB
                    lruCache = new LRUCache(cachedSettings.cacheLimit || 20, true);
                    lruCache.indexedDB = indexedDBCache;

                    // 从IndexedDB加载缓存
                    await lruCache.load();

                    const stats = lruCache.getStats();
                    const totalSize = await indexedDBCache.getTotalSize();
                    const totalSizeMB = (totalSize * 0.75 / 1024 / 1024).toFixed(1);

                    console.log('[ComfyUI] IndexedDB + LRU缓存已初始化');
                    console.log(`[ComfyUI] 缓存统计: ${stats.count}张图片, 总大小约${totalSizeMB}MB`);

                    // 数据迁移：从GM_getValue迁移到IndexedDB
                    const oldRecords = await GM_getValue(STORAGE_KEY_IMAGES, {});
                    const oldKeys = Object.keys(oldRecords);

                    if (oldKeys.length > 0 && stats.count === 0) {
                        console.log(`[ComfyUI] 检测到${oldKeys.length}条旧缓存，开始迁移到IndexedDB...`);
                        let migratedCount = 0;

                        for (const [id, data] of Object.entries(oldRecords)) {
                            try {
                                await indexedDBCache.set(id, data, {
                                    timestamp: Date.now(),
                                    accessCount: 0
                                });
                                migratedCount++;
                            } catch (error) {
                                console.error(`[ComfyUI] 迁移失败: ${id}`, error);
                            }
                        }

                        console.log(`[ComfyUI] 数据迁移完成: ${migratedCount}/${oldKeys.length}条`);

                        // 重新加载缓存
                        await lruCache.load();

                        // 清空旧的GM_setValue缓存（可选）
                        // await GM_setValue(STORAGE_KEY_IMAGES, {});
                    }

                } catch (error) {
                    console.error('[ComfyUI] IndexedDB初始化失败，回退到GM_getValue:', error);
                    // 回退方案：使用GM_getValue
                    lruCache = new LRUCache(cachedSettings.cacheLimit || 20, false);
                    await lruCache.load();

                    const stats = lruCache.getStats();
                    console.log('[ComfyUI] LRU缓存已初始化(GM_getValue模式):', stats);
                }

                // 初始化Lightbox（图片放大查看器）
                console.log('[ComfyUI] 正在初始化Lightbox...');
                createLightbox();

                // 初始化历史记录面板
                console.log('[ComfyUI] 正在初始化历史记录面板...');
                createHistoryPanel();

                console.log('[ComfyUI] 所有组件初始化完成！');

            }).catch(error => {
                ErrorHandler.handle(new ComfyUIError('初始化失败: ' + error.message, 'CONFIG'), 'window.load');
            });

            observeChat();

            const body = document.querySelector('body');
            if (body) {
                optionsObserver.observe(body, {
                    childList: true,
                    subtree: true,
                    attributes: true,
                    attributeFilter: ['style']
                });
            }
        } catch (error) {
            ErrorHandler.handle(new ComfyUIError('页面加载初始化失败: ' + error.message, 'CONFIG'), 'window.load');
        }
    });

})();
