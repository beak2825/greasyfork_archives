// ==UserScript==
// @name         南理工教务增强助手 v1.5
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  在合适的地方显示课程大纲、选修课类别及选修课学分情况，并自动刷新登录状态。
// @match        202.119.81.112/*
// @match        bkjw.njust.edu.cn/*
// @match        202.119.81.112:9080/*
// @match        202.119.81.113:9080/*
// @grant        GM_xmlhttpRequest
// @connect      jsdelivr.net
// @connect      njust.wiki
// @author       Light
// @license      MIT
// @supportURL   https://github.com/NJUST-OpenLib/NJUST-JWC-Enhance
// @downloadURL https://update.greasyfork.org/scripts/541627/%E5%8D%97%E7%90%86%E5%B7%A5%E6%95%99%E5%8A%A1%E5%A2%9E%E5%BC%BA%E5%8A%A9%E6%89%8B%20v15.user.js
// @updateURL https://update.greasyfork.org/scripts/541627/%E5%8D%97%E7%90%86%E5%B7%A5%E6%95%99%E5%8A%A1%E5%A2%9E%E5%BC%BA%E5%8A%A9%E6%89%8B%20v15.meta.js
// ==/UserScript==

// ==================== 远程数据源配置 ====================
// 选修课分类数据源（按优先级排序）
const CATEGORY_URLS = [
    'https://fastly.jsdelivr.net/gh/NJUST-OpenLib/NJUST-JWC-Enhance@latest/data/xxk.json',
    'https://gcore.jsdelivr.net/gh/NJUST-OpenLib/NJUST-JWC-Enhance@latest/data/xxk.json',
    'https://testingcf.jsdelivr.net/gh/NJUST-OpenLib/NJUST-JWC-Enhance@latest/data/xxk.json',
    'https://raw.gitcode.com/Misaka10032/NJUST-JWC-Enhance/raw/main/data/xxk.json',
    'https://enhance.njust.wiki/data/xxk.json'
];

// 课程大纲数据源（按优先级排序）
const OUTLINE_URLS = [
    'https://fastly.jsdelivr.net/gh/NJUST-OpenLib/NJUST-JWC-Enhance@latest/data/kcdg.json',
    'https://gcore.jsdelivr.net/gh/NJUST-OpenLib/NJUST-JWC-Enhance@latest/data/kcdg.json',
    'https://testingcf.jsdelivr.net/gh/NJUST-OpenLib/NJUST-JWC-Enhance@latest/data/kcdg.json',
    'https://raw.gitcode.com/Misaka10032/NJUST-JWC-Enhance/raw/main/data/kcdg.json',
    'https://enhance.njust.wiki/data/kcdg.json',
];

(function () {
    'use strict';

    // ==================== 配置选项 ====================
    // 用户界面配置
    const UI_CONFIG = {
        showNotifications: true  // 是否显示前端提示框 (true=显示，false=隐藏)
                                // 设置为 false 可完全关闭所有状态提示框
                                // 设置为 true 则正常显示加载、成功、错误等提示
    };

    // 调试配置
    const DEBUG_CONFIG = {
        enabled: true,          // 是否启用调试
        level: 4,              // 调试级别: 0=关闭，1=错误，2=警告，3=信息，4=详细
        showCache: true        // 是否显示缓存相关日志
    };

    // 缓存配置
    const CACHE_CONFIG = {
        enabled: true,         // 是否启用缓存
        ttl: 600,            // 缓存生存时间 (秒) 
        prefix: 'njust_jwc_enhance_'  // 缓存键前缀
    };

    // ==================== 调试系统 ====================
    const Logger = {
        LEVELS: { ERROR: 1, WARN: 2, INFO: 3, DEBUG: 4 },

        log(level, message, ...args) {
            if (!DEBUG_CONFIG.enabled || level > DEBUG_CONFIG.level) return;

            const timestamp = new Date().toLocaleTimeString();
            const levelNames = ['', '❌', '⚠️', 'ℹ️', '🔍'];
            const prefix = `[${timestamp}] ${levelNames[level]} [南理工教务助手]`;

            console.log(prefix, message, ...args);

            // 对于 INFO 级别的消息，同时通过状态提示框显示（如果启用）
            if (level === this.LEVELS.INFO && UI_CONFIG.showNotifications && typeof StatusNotifier !== 'undefined' && StatusNotifier.show) {
                try {
                    // 提取纯文本消息，去除表情符号前缀
                    let cleanMessage = message.replace(/^[🎯🚀📊🎓🚪💾✅🗑️⏰❌🔍⚠️ℹ️]+\s*/, '');

                    // 如果有额外参数，将其格式化并添加到消息中
                    if (args.length > 0) {
                        const formattedArgs = args.map(arg => {
                            if (typeof arg === 'object' && arg !== null) {
                                try {
                                    // 安全的对象序列化，避免循环引用
                                    const seen = new WeakSet();
                                    const jsonStr = JSON.stringify(arg, (key, value) => {
                                        if (typeof value === 'object' && value !== null) {
                                            if (seen.has(value)) {
                                                return '[Circular Reference]';
                                            }
                                            seen.add(value);
                                        }
                                        return value;
                                    }, 0);

                                    // 如果 JSON 字符串太长，进行适当格式化
                                    if (jsonStr.length > 200) {
                                        // 对于长对象，使用更紧凑的格式，限制深度
                                        return Object.entries(arg)
                                            .slice(0, 10) // 限制显示前 10 个属性
                                            .map(([key, value]) => {
                                                let valueStr;
                                                if (typeof value === 'object' && value !== null) {
                                                    valueStr = '[Object]';
                                                } else {
                                                    valueStr = String(value).slice(0, 50); // 限制值长度
                                                }
                                                return `${key}: ${valueStr}`;
                                            })
                                            .join(', ') + (Object.keys(arg).length > 10 ? '...' : '');
                                    } else {
                                        // 移除 JSON 的花括号，使其更易读
                                        return jsonStr.replace(/^{|}$/g, '').replace(/"/g, '');
                                    }
                                } catch (e) {
                                    // 如果 JSON.stringify 失败，使用安全的回退方法
                                    try {
                                        return Object.entries(arg)
                                            .slice(0, 5) // 限制属性数量
                                            .map(([key, value]) => `${key}: ${String(value).slice(0, 30)}`)
                                            .join(', ') + (Object.keys(arg).length > 5 ? '...' : '');
                                    } catch (e2) {
                                        return '[Object - Cannot Display]';
                                    }
                                }
                            }
                            return String(arg).slice(0, 100); // 限制字符串长度
                        }).join(' ');

                        cleanMessage += ' ' + formattedArgs;
                    }

                    StatusNotifier.show(cleanMessage, 'info');
                } catch (e) {
                    // 静默处理状态提示框错误，避免影响日志功能
                }
            }
        },

        error(message, ...args) { this.log(this.LEVELS.ERROR, message, ...args); },
        warn(message, ...args) { this.log(this.LEVELS.WARN, message, ...args); },
        info(message, ...args) { this.log(this.LEVELS.INFO, message, ...args); },
        debug(message, ...args) { this.log(this.LEVELS.DEBUG, message, ...args); }
    };

    // ==================== 缓存系统 ====================
    const CacheManager = {
        // 获取缓存键
        getKey(url) {
            return CACHE_CONFIG.prefix + btoa(url).replace(/[^a-zA-Z0-9]/g, '');
        },

        // 设置缓存
        set(url, data) {
            if (!CACHE_CONFIG.enabled) return false;

            try {
                const cacheData = {
                    data: data,
                    timestamp: Date.now(),
                    ttl: CACHE_CONFIG.ttl * 1000,
                    url: url
                };

                const key = this.getKey(url);
                localStorage.setItem(key, JSON.stringify(cacheData));

                if (DEBUG_CONFIG.showCache) {
                    Logger.info(`💾 缓存已保存: ${url}`, {
                        key: key,
                        size: JSON.stringify(cacheData).length + ' bytes',
                        ttl: CACHE_CONFIG.ttl + 's'
                    });
                }

                return true;
            } catch (e) {
                Logger.error('缓存保存失败: ', e);
                return false;
            }
        },

        // 获取缓存
        get(url) {
            if (!CACHE_CONFIG.enabled) return null;

            try {
                const key = this.getKey(url);
                const cached = localStorage.getItem(key);

                if (!cached) {
                    if (DEBUG_CONFIG.showCache) {
                        Logger.debug(`❌ 缓存未命中: ${url}`);
                    }
                    return null;
                }

                const cacheData = JSON.parse(cached);
                const now = Date.now();
                const age = (now - cacheData.timestamp) / 1000;
                const remaining = (cacheData.ttl - (now - cacheData.timestamp)) / 1000;

                // 检查是否过期
                if (now - cacheData.timestamp > cacheData.ttl) {
                    localStorage.removeItem(key);
                    if (DEBUG_CONFIG.showCache) {
                        Logger.warn(`⏰ 缓存已过期: ${url}`, {
                            age: age.toFixed(1) + 's',
                            expired: (age - CACHE_CONFIG.ttl).toFixed(1) + 's ago'
                        });
                    }
                    return null;
                }

                if (DEBUG_CONFIG.showCache) {
                    Logger.info(`✅ 缓存命中: ${url}`, {
                        age: age.toFixed(1) + 's',
                        remaining: remaining.toFixed(1) + 's',
                        size: cached.length + ' bytes'
                    });
                }

                return cacheData.data;
            } catch (e) {
                Logger.error('缓存读取失败: ', e);
                return null;
            }
        },

        // 清除所有缓存
        clear() {
            try {
                const keys = Object.keys(localStorage).filter(key =>
                    key.startsWith(CACHE_CONFIG.prefix)
                );

                keys.forEach(key => localStorage.removeItem(key));

                Logger.info(`🗑️ 已清除 ${keys.length} 个缓存项`);
                return keys.length;
            } catch (e) {
                Logger.error('清除缓存失败: ', e);
                return 0;
            }
        },

        // 获取缓存统计信息
        getStats() {
            try {
                const keys = Object.keys(localStorage).filter(key =>
                    key.startsWith(CACHE_CONFIG.prefix)
                );

                let totalSize = 0;
                let validCount = 0;
                let expiredCount = 0;
                const now = Date.now();

                keys.forEach(key => {
                    try {
                        const cached = localStorage.getItem(key);
                        totalSize += cached.length;

                        const cacheData = JSON.parse(cached);
                        if (now - cacheData.timestamp > cacheData.ttl) {
                            expiredCount++;
                        } else {
                            validCount++;
                        }
                    } catch (e) {
                        expiredCount++;
                    }
                });

                return {
                    total: keys.length,
                    valid: validCount,
                    expired: expiredCount,
                    size: totalSize
                };
            } catch (e) {
                Logger.error('获取缓存统计失败: ', e);
                return { total: 0, valid: 0, expired: 0, size: 0 };
            }
        }
    };

    // ==================== 状态提示框系统 ====================
    const StatusNotifier = {
        container: null,
        messageQueue: [],
        messageId: 0,

        // 初始化状态提示框容器
        init() {
            if (!STATUS_CONFIG.enabled || this.container) return;

            // 确保 DOM 已准备好
            if (!document.body) {
                setTimeout(() => this.init(), 50);
                return;
            }

            try {
                this.container = document.createElement('div');
                this.container.id = 'njustStatusNotifier';

                // 根据配置设置位置
                const positions = {
                    'top-left': { top: '20px', left: '20px', flexDirection: 'column' },
                    'top-right': { top: '20px', right: '20px', flexDirection: 'column' },
                    'bottom-left': { bottom: '20px', left: '20px', flexDirection: 'column-reverse' },
                    'bottom-right': { bottom: '20px', right: '20px', flexDirection: 'column-reverse' }
                };

                const pos = positions[STATUS_CONFIG.position] || positions['top-right'];

                this.container.style.cssText = `
                    position: fixed;
                    ${Object.entries(pos).filter(([k]) => k !== 'flexDirection').map(([k, v]) => `${k}: ${v}`).join('; ')};
                    display: flex;
                    flex-direction: ${pos.flexDirection};
                    gap: 8px;
                    z-index: 9999;
                    pointer-events: none;
                    max-width: 350px;
                `;

                document.body.appendChild(this.container);
            } catch (e) {
                console.error('StatusNotifier 初始化失败: ', e);
                this.container = null;
            }
        },

        // 显示状态消息
        show(message, type = 'info', duration = null) {
            if (!STATUS_CONFIG.enabled || !UI_CONFIG.showNotifications) return;

            try {
                this.init();

                // 确保容器已创建
                if (!this.container) {
                    console.warn('StatusNotifier 容器未创建，跳过消息显示');
                    return;
                }

                // 如果是 loading 类型的消息，先隐藏之前的 loading 消息
                if (type === 'loading') {
                    const existingLoadingMessages = this.messageQueue.filter(m => m.type === 'loading');
                    existingLoadingMessages.forEach(m => this.hideMessage(m.id));
                }

                const messageElement = this.createMessageElement(message, type);
                const messageData = {
                    id: ++this.messageId,
                    element: messageElement,
                    type: type,
                    timestamp: Date.now()
                };

                this.messageQueue.push(messageData);
                this.container.appendChild(messageElement);

                // 限制同时显示的消息数量
                this.limitMessages();

                // 显示动画
                requestAnimationFrame(() => {
                    if (messageElement.parentNode) {
                        messageElement.style.opacity = '1';
                        messageElement.style.transform = 'translateX(0)';
                    }
                });

                // 自动隐藏逻辑
                if (STATUS_CONFIG.autoHide && type !== 'loading') {
                    const hideTime = duration || this.getHideDelay(type);
                    setTimeout(() => this.hideMessage(messageData.id), hideTime);
                }
            } catch (e) {
                console.error('StatusNotifier 显示消息失败: ', e);
            }
        },

        // 创建消息元素
        createMessageElement(message, type) {
            const icons = {
                info: 'ℹ️',
                success: '✅',
                warning: '⚠️',
                error: '❌',
                loading: '🔄'
            };

            const colors = {
                info: '#888',
                success: '#888',
                warning: '#888',
                error: '#888',
                loading: '#888'
            };

            const messageElement = document.createElement('div');
            messageElement.style.cssText = `
                background: ${colors[type] || colors.info};
                color: white;
                padding: 12px 16px;
                border-radius: 8px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                font-size: 13px;
                opacity: 0;
                transform: translateX(${STATUS_CONFIG.position.includes('right') ? '20px' : '-20px'});
                transition: all 0.3s ease;
                pointer-events: auto;
                line-height: 1.4;
                cursor: pointer;
                position: relative;
                margin-bottom: 0;
            `;

            messageElement.innerHTML = `${icons[type] || icons.info} ${message}`;

            // 点击关闭功能
            messageElement.addEventListener('click', () => {
                const messageData = this.messageQueue.find(m => m.element === messageElement);
                if (messageData) {
                    this.hideMessage(messageData.id);
                }
            });

            return messageElement;
        },

        // 获取不同类型消息的隐藏延迟
        getHideDelay(type) {
            const delays = {
                info: STATUS_CONFIG.infoDelay || 2000,     // info 消息显示更久
                success: STATUS_CONFIG.hideDelay || 2000,
                warning: STATUS_CONFIG.hideDelay || 2000,
                error: STATUS_CONFIG.hideDelay || 2000,
                loading: STATUS_CONFIG.hideDelay || 2000 // loading 消息不自动隐藏
            };
            return delays[type] || STATUS_CONFIG.hideDelay;
        },

        // 隐藏指定消息
        hideMessage(messageId) {
            const messageIndex = this.messageQueue.findIndex(m => m.id === messageId);
            if (messageIndex === -1) return;

            const messageData = this.messageQueue[messageIndex];
            const element = messageData.element;

            // 立即从队列中移除，避免 limitMessages 中的循环问题
            this.messageQueue.splice(messageIndex, 1);

            // 隐藏动画
            element.style.opacity = '0';
            element.style.transform = `translateX(${STATUS_CONFIG.position.includes('right') ? '20px' : '-20px'})`;

            // 延迟移除 DOM 元素
            setTimeout(() => {
                if (element.parentNode) {
                    element.parentNode.removeChild(element);
                }
            }, 300);
        },

        // 限制同时显示的消息数量
        limitMessages() {
            // 避免无限循环: 只移除超出数量的消息，不使用 while 循环
            if (this.messageQueue.length > STATUS_CONFIG.maxMessages) {
                const excessCount = this.messageQueue.length - STATUS_CONFIG.maxMessages;
                // 移除最旧的消息
                for (let i = 0; i < excessCount; i++) {
                    if (this.messageQueue.length > 0) {
                        const oldestMessage = this.messageQueue[0];
                        this.hideMessage(oldestMessage.id);
                    }
                }
            }
        },

        // 隐藏所有消息
        hide() {
            this.messageQueue.forEach(messageData => {
                this.hideMessage(messageData.id);
            });
        },

        // 移除状态提示框
        remove() {
            if (this.container) {
                this.container.remove();
                this.container = null;
                this.messageQueue = [];
            }
        }
    };

    // 状态提示框配置
    const STATUS_CONFIG = {
        enabled: true,         // 是否显示状态提示
        autoHide: true,       // 是否自动隐藏
        hideDelay: 2000,      // 默认自动隐藏延迟 (毫秒)
        infoDelay: 2000,      // info 类型消息显示时间 (毫秒)
        maxMessages: 5,       // 同时显示的最大消息数量
        position: 'top-right' // 位置: top-left, top-right, bottom-left, bottom-right
    };

    // 延迟初始化日志，避免在 DOM 未完全加载时出现问题
    function initializeLogging() {
        // 确保 DOM 已加载
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeLogging);
            return;
        }

        // 延迟执行，避免与页面初始化冲突
        setTimeout(() => {
            try {
                Logger.info('🚀 南理工教务增强助手已启动', {
                    debug: DEBUG_CONFIG.enabled ? `Level ${DEBUG_CONFIG.level}` : '关闭',
                    cache: CACHE_CONFIG.enabled ? `TTL ${CACHE_CONFIG.ttl}s` : '关闭'
                });

                // 显示缓存统计
                if (DEBUG_CONFIG.enabled && DEBUG_CONFIG.showCache) {
                    const stats = CacheManager.getStats();
                    Logger.info('📊 缓存统计: ', {
                        总数: stats.total,
                        有效: stats.valid,
                        过期: stats.expired,
                        大小: (stats.size / 1024).toFixed(1) + 'KB'
                    });
                }
            } catch (e) {
                console.error('初始化日志失败: ', e);
            }
        }, 100);
    }

    // 调用初始化
    initializeLogging();

    let courseCategoryMap = {};
    let courseOutlineMap = {};

    // 统一弹窗样式函数
    function createUnifiedModal(title, content, type = 'info') {
        // 移除可能存在的旧弹窗
        const existingModal = document.getElementById('njustAssistantModal');
        if (existingModal) {
            existingModal.remove();
        }

        const container = document.createElement('div');
        container.id = 'njustAssistantModal';

        // 根据类型设置不同的渐变色
        let gradientColor;
        switch (type) {
            case 'warning':
                gradientColor = 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)';
                break;
            case 'success':
                gradientColor = 'linear-gradient(135deg, #28a745 0%, #20c997 100%)';
                break;
            case 'info':
            default:
                gradientColor = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                break;
        }

        container.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: ${gradientColor};
            border: none;
            border-radius: 15px;
            padding: 0;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            z-index: 10000;
            min-width: 200px;
            max-width: 500px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            overflow: hidden;
            animation: fadeIn 0.3s ease-out;
        `;

        container.innerHTML = `
            <div id="dragHandle" style="
                background: rgba(255,255,255,0.1);
                padding: 15px 20px;
                cursor: move;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid rgba(255,255,255,0.2);
            ">
                <div style="color: white; font-weight: bold; font-size: 18px;">
                    🎓 ${title}
                </div>
                <span style="
                    cursor: pointer;
                    color: rgba(255,255,255,0.8);
                    font-size: 18px;
                    padding: 2px 6px;
                    border-radius: 4px;
                    transition: background-color 0.2s;
                "
                onclick="this.closest('div').parentElement.remove()"
                onmouseover="this.style.backgroundColor='rgba(255,255,255,0.2)'"
                onmouseout="this.style.backgroundColor='transparent'">✕</span>
            </div>
            <div style="
                background: white;
                padding: 25px;
            ">
                ${content}
                <div style="
                    margin-top: 20px;
                    padding-top: 15px;
                    border-top: 1px solid #eee;
                    font-size: 12px;
                    color: #666;
                    line-height: 1.4;
                    text-align: center;
                ">
                    <div style="margin-bottom: 8px;">
                        <strong>请查看
                        <a href="https://enhance.njust.wiki" target="_blank" style="color: #007bff; text-decoration: none;">官方网站</a>
                      以获取使用说明</strong>
                        </div>
                    <div style="color: #ff6b6b; font-weight: bold; margin-bottom: 5px;">⚠️ 免责声明</div>
                    <div>本工具仅为学习交流使用，数据仅供参考。</div>
                   <div>请以教务处官网信息为准，使用本工具产生的任何后果均由用户自行承担。</div>
                </div>
            </div>
        `;

        // 添加 CSS 动画
        if (!document.getElementById('njustAssistantStyles')) {
            const style = document.createElement('style');
            style.id = 'njustAssistantStyles';
            style.textContent = `
                @keyframes fadeIn {
                    from { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
                    to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                }
            `;
            document.head.appendChild(style);
        }

        // 添加拖动功能
        addDragFunctionality(container);

        document.body.appendChild(container);
        return container;
    }

    // 拖动功能
    function addDragFunctionality(container) {
        let isDragging = false;
        let currentX, currentY, initialX, initialY;
        let xOffset = 0, yOffset = 0;

        const dragHandle = container.querySelector('#dragHandle');

        function dragStart(e) {
            if (e.type === "touchstart") {
                initialX = e.touches[0].clientX - xOffset;
                initialY = e.touches[0].clientY - yOffset;
            } else {
                initialX = e.clientX - xOffset;
                initialY = e.clientY - yOffset;
            }
            if (e.target === dragHandle || dragHandle.contains(e.target)) {
                isDragging = true;
            }
        }

        function dragEnd(e) {
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                if (e.type === "touchmove") {
                    currentX = e.touches[0].clientX - initialX;
                    currentY = e.touches[0].clientY - initialY;
                } else {
                    currentX = e.clientX - initialX;
                    currentY = e.clientY - initialY;
                }
                xOffset = currentX;
                yOffset = currentY;
                container.style.transform = `translate(${currentX}px, ${currentY}px)`;
            }
        }

        dragHandle.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);
        dragHandle.addEventListener('touchstart', dragStart, { passive: false });
        document.addEventListener('touchmove', drag, { passive: false });
        document.addEventListener('touchend', dragEnd, { passive: false });
    }

    // 检测强智科技页面
    function checkQiangzhiPage() {
        try {
            const currentUrl = window.location.href;
            const pageTitle = document.title || '';

            Logger.debug('🔍 检测页面类型', {
                URL: currentUrl,
                标题: pageTitle
            });

            // 检测是否为强智科技页面且无法登录
            if (pageTitle.includes('强智科技教务系统概念版')) {

                Logger.warn('⚠️ 检测到强智科技概念版页面，显示登录引导');

                const content = `
                    <div style="text-align: center; font-size: 16px; color: #333; margin-bottom: 20px; line-height: 1.6;">
                        <div style="font-size: 20px; margin-bottom: 15px;">🚫 该页面无法登录</div>

                        <div style="margin-top: 10px;">请转向以下正确的登录页面:</div>
                    </div>
                    <div style="text-align: center; margin: 20px 0;">
                        <div style="margin: 10px 0;">
                            <a href="https://www.njust.edu.cn/" target="_blank" style="
                                display: inline-block;
                                background: #28a745;
                                color: white;
                                padding: 12px 20px;
                                text-decoration: none;
                                border-radius: 8px;
                                margin: 5px;
                                font-weight: bold;
                                transition: background-color 0.2s;
                            " onmouseover="this.style.backgroundColor='#218838'" onmouseout="this.style.backgroundColor='#28a745'">
                                🏫 智慧理工登录页面
                            </a>
                        </div>
                        <div style="margin: 10px 0;">
                            <a href="http://202.119.81.113:8080/" target="_blank" style="
                                display: inline-block;
                                background: #007bff;
                                color: white;
                                padding: 12px 20px;
                                text-decoration: none;
                                border-radius: 8px;
                                margin: 5px;
                                font-weight: bold;
                                transition: background-color 0.2s;
                            " onmouseover="this.style.backgroundColor='#0056b3'" onmouseout="this.style.backgroundColor='#007bff'">
                                🔗 教务处登录页面
                            </a>
                        </div>
                    </div>
                    <div style="
                        margin-top: 15px;
                        padding: 10px;
                        background: #f8f9fa;
                        border-radius: 6px;
                        font-size: 14px;
                        color: #666;
                        text-align: center;
                    ">
                        💡 提示:<br>
                        强智科技教务系统概念版是无法登陆的。<br>
                        请使用上述链接跳转到正确的登录页面，<br>
                        登录后可正常使用教务系统功能<br>
                        验证码区分大小写，大部分情况下均为小写
                    </div>
                `;

                try {
                    createUnifiedModal('南理工教务增强助手', content, 'warning');
                } catch (e) {
                    Logger.error('❌ 创建强智科技页面提示弹窗失败:', e);
                }
                return true;
            }
            return false;
        } catch (e) {
            Logger.error('❌ 检测强智科技页面失败:', e);
            return false;
        }
    }

    function loadJSONWithFallback(urls) {
        return new Promise((resolve, reject) => {
            // 确保urls是数组
            const urlArray = Array.isArray(urls) ? urls : [urls];
            
            // 获取数据类型名称用于日志显示
            const fileName = urlArray[0].includes('xxk') ? '选修课分类' : '课程大纲';
            
            Logger.info(`🔄 开始智能数据源切换: ${fileName}`, {
                数据源数量: urlArray.length,
                数据源列表: urlArray
            });

            let currentIndex = 0;
            
            function tryNextUrl() {
                if (currentIndex >= urlArray.length) {
                    Logger.error(`❌ 所有数据源都不可用: ${fileName}`);
                    StatusNotifier.show(`${fileName}数据加载失败，所有数据源都不可用`, 'error', 5000);
                    reject(new Error(`所有数据源都不可用: ${fileName}`));
                    return;
                }

                const currentUrl = urlArray[currentIndex];
                currentIndex++;
                
                Logger.info(`🌐 尝试数据源 ${currentIndex}/${urlArray.length}: ${currentUrl}`);
                
                // 尝试从缓存获取数据（只尝试第一个URL的缓存）
                if (currentIndex === 1) {
                    const cachedData = CacheManager.get(currentUrl);
                    if (cachedData) {
                        Logger.debug(`🎯 使用缓存数据: ${currentUrl}`);
                        StatusNotifier.show(`从缓存读取${fileName}数据成功`, 'success');
                        resolve(cachedData);
                        return;
                    }
                }

                // 发起网络请求
                const startTime = Date.now();
                
                GM_xmlhttpRequest({
                    method: "GET",
                    url: currentUrl,
                    timeout: 10000, // 10秒超时
                    onload: function (response) {
                        const loadTime = Date.now() - startTime;

                        try {
                            const json = JSON.parse(response.responseText);

                            // 保存到缓存（只缓存第一个成功请求的URL）
                            if (currentIndex === 1) {
                                const cached = CacheManager.set(currentUrl, json);
                                Logger.info(`✅ 请求成功: ${currentUrl}`, {
                                    耗时: loadTime + 'ms',
                                    大小: response.responseText.length + ' bytes',
                                    缓存: cached ? '已保存' : '保存失败'
                                });
                            } else {
                                Logger.info(`✅ 备用数据源请求成功: ${currentUrl}`, {
                                    耗时: loadTime + 'ms',
                                    大小: response.responseText.length + ' bytes',
                                    备用序号: currentIndex
                                });
                            }

                            // 显示成功状态
                            if (currentIndex > 1) {
                                StatusNotifier.show(`从备用数据源${currentIndex-1}加载${fileName}成功 (${loadTime}ms)`, 'success');
                            } else {
                                StatusNotifier.show(`从远程加载${fileName}成功 (${loadTime}ms)`, 'success');
                            }

                            resolve(json);
                        } catch (e) {
                            Logger.error(`❌ JSON 解析失败: ${currentUrl}`, e);
                            // 继续尝试下一个URL
                            tryNextUrl();
                        }
                    },
                    onerror: function (err) {
                        const loadTime = Date.now() - startTime;
                        Logger.warn(`⚠️ 数据源 ${currentIndex} 请求失败: ${currentUrl}`, {
                            耗时: loadTime + 'ms',
                            错误: err,
                            将尝试: currentIndex < urlArray.length ? '下一个数据源' : '无更多数据源'
                        });
                        
                        // 继续尝试下一个URL
                        tryNextUrl();
                    },
                    ontimeout: function() {
                        Logger.warn(`⏰ 数据源 ${currentIndex} 请求超时: ${currentUrl}`);
                        // 继续尝试下一个URL
                        tryNextUrl();
                    }
                });
            }

            // 开始尝试第一个URL
            tryNextUrl();
        });
    }

    function loadJSON(url) {
        // 兼容原有的单URL调用方式
        if (typeof url === 'string') {
            return loadJSONWithFallback([url]);
        }
        // 新的多数据源调用方式
        return loadJSONWithFallback(url);
    }

    function buildCourseMaps(categoryList, outlineList) {
        try {
            Logger.debug('🔨 开始构建课程映射表');

            let categoryCount = 0;
            let outlineCount = 0;

            // 安全处理分类数据
            if (Array.isArray(categoryList)) {
                categoryList.forEach(item => {
                    try {
                        if (item && item.course_code && item.category) {
                            courseCategoryMap[item.course_code.trim()] = item.category;
                            categoryCount++;
                        }
                    } catch (e) {
                        Logger.warn('⚠️ 处理分类数据项时出错:', e, item);
                    }
                });
            } else {
                Logger.warn('⚠️ 分类数据不是数组格式:', typeof categoryList);
            }

            // 安全处理大纲数据
            if (Array.isArray(outlineList)) {
                outlineList.forEach(item => {
                    try {
                        if (item && item.course_code && item.id) {
                            courseOutlineMap[item.course_code.trim()] = item.id;
                            outlineCount++;
                        }
                    } catch (e) {
                        Logger.warn('⚠️ 处理大纲数据项时出错:', e, item);
                    }
                });
            } else {
                Logger.warn('⚠️ 大纲数据不是数组格式:', typeof outlineList);
            }

            Logger.info('课程映射表构建完成', {
                选修课类别: categoryCount + '条',
                课程大纲: outlineCount + '条',
                总数据: (categoryCount + outlineCount) + '条'
            });
        } catch (e) {
            Logger.error('× 构建课程映射表失败:', e);
            // 确保映射表至少是空对象，避免后续访问出错
            if (typeof courseCategoryMap !== 'object') courseCategoryMap = {};
            if (typeof courseOutlineMap !== 'object') courseOutlineMap = {};
        }
    }

    function createCreditSummaryWindow() {
        try {
            // 使用统一的弹窗样式，但保持原有的固定位置和拖动功能
            const container = document.createElement('div');
            container.id = 'creditSummaryWindow';
            container.style.cssText = `
                position: fixed;
                top: 40px;
                right: 40px;
                background: #fff;
                border: 1px solid #e0e0e0;
                border-radius: 14px;
                padding: 0;
                box-shadow: 0 8px 32px rgba(0,0,0,0.13);
                z-index: 9999;
                min-width: 420px;
                max-width: 520px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                overflow: hidden;
            `;

            container.innerHTML = `
                <div id="creditDragHandle" style="
                    background: #f5f6fa;
                    padding: 14px 22px;
                    cursor: move;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid #e0e0e0;
                ">
                    <div style="color: #333; font-weight: 600; font-size: 17px; letter-spacing: 1px;">
                        🎓 南理工教务增强助手
                    </div>
                    <span style="
                        cursor: pointer;
                        color: #888;
                        font-size: 18px;
                        padding: 2px 8px;
                        border-radius: 4px;
                        transition: background-color 0.2s;
                    "
                    onclick="this.closest('div').parentElement.remove()"
                    onmouseover="this.style.backgroundColor='#e0e0e0'"
                    onmouseout="this.style.backgroundColor='transparent'">✕</span>
                </div>
                <div style="
                    background: #fff;
                    padding: 18px 22px 10px 22px;
                    max-height: 540px;
                    overflow-y: auto;
                ">
                    <div id="creditSummary"></div>
                    <div style="
                        margin-top: 18px;
                        padding-top: 12px;
                        border-top: 1px solid #e0e0e0;
                        font-size: 13px;
                        color: #888;
                        line-height: 1.6;
                        text-align: left;
                    ">

                        <div><li>对照个人培养方案核实具体修课要求</li></div><li>选修课类别统计仅包含已知分类的通识教育选修课</li>
                                <li>课程分类信息可能随时更新，请以教务处最新通知为准</li>
                                
                        <div style="margin-bottom: 8px;">
                            <span>请查看 <a href="https://enhance.njust.wiki" target="_blank" style="color: #007bff; text-decoration: none;">增强助手官网</a> 获取使用说明</span>
                        </div>
                    </div>
                </div>
            `;

            // 添加拖动功能
            let isDragging = false;
            let currentX, currentY, initialX, initialY;
            let xOffset = 0, yOffset = 0;

            const dragHandle = container.querySelector('#creditDragHandle');
            if (!dragHandle) {
                Logger.warn('⚠️ 未找到拖拽句柄元素');
                document.body.appendChild(container);
                return container;
            }

            function dragStart(e) {
                try {
                    if (e.type === "touchstart") {
                        initialX = e.touches[0].clientX - xOffset;
                        initialY = e.touches[0].clientY - yOffset;
                    } else {
                        initialX = e.clientX - xOffset;
                        initialY = e.clientY - yOffset;
                    }
                    if (e.target === dragHandle || dragHandle.contains(e.target)) {
                        isDragging = true;
                    }
                } catch (err) {
                    Logger.error('❌ 拖拽开始失败:', err);
                }
            }

            function dragEnd(e) {
                try {
                    initialX = currentX;
                    initialY = currentY;
                    isDragging = false;
                } catch (err) {
                    Logger.error('❌ 拖拽结束失败:', err);
                }
            }

            function drag(e) {
                try {
                    if (isDragging) {
                        e.preventDefault();
                        if (e.type === "touchmove") {
                            currentX = e.touches[0].clientX - initialX;
                            currentY = e.touches[0].clientY - initialY;
                        } else {
                            currentX = e.clientX - initialX;
                            currentY = e.clientY - initialY;
                        }
                        xOffset = currentX;
                        yOffset = currentY;
                        container.style.transform = `translate(${currentX}px, ${currentY}px)`;
                    }
                } catch (err) {
                    Logger.error('❌ 拖拽移动失败:', err);
                }
            }

            dragHandle.addEventListener('mousedown', dragStart);
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', dragEnd);
            dragHandle.addEventListener('touchstart', dragStart, { passive: false });
            document.addEventListener('touchmove', drag, { passive: false });
            document.addEventListener('touchend', dragEnd, { passive: false });

            document.body.appendChild(container);
            Logger.debug('✅ 学分统计弹窗创建完成');
            return container;
        } catch (e) {
            Logger.error('❌ 创建学分统计弹窗失败:', e);
            if (UI_CONFIG.showNotifications) {
                StatusNotifier.show('创建学分统计弹窗失败', 'error', 3000);
            }
            return null;
        }
    }

    function updateCreditSummary() {
        try {
            Logger.debug('📊 开始更新学分统计');
            const creditSummaryDiv = document.getElementById('creditSummary');
            if (!creditSummaryDiv) {
                Logger.warn('⚠️ 未找到学分统计容器');
                return;
            }

            const creditsByType = {}; // 按课程类型（通识教育课等）统计
            const creditsByCategory = {}; // 按选修课类别统计
            const tables = document.querySelectorAll('table');

        tables.forEach(table => {
            const rows = table.querySelectorAll('tr');
            rows.forEach(row => {
                const tds = row.querySelectorAll('td');
                if (tds.length >= 11) {
                    const courseCode = tds[2].textContent.trim();
                    const credit = parseFloat(tds[6].textContent) || 0;
                    const courseType = tds[10].textContent.trim(); // 课程类型（通识教育课等）

                    // 从页面上已显示的类别信息中提取选修课类别
                    const categoryDiv = tds[2].querySelector('[data-category-inserted]');
                    let category = null;
                    if (categoryDiv) {
                        // 直接获取文本内容，因为现在只显示类别名称
                        category = categoryDiv.textContent.trim();
                        // 如果文本为空或者不是有效的类别，则设为 null
                        if (!category || category.length === 0) {
                            category = null;
                        }
                    }

                    // 按课程类型统计
                    if (courseType) {
                        if (!creditsByType[courseType]) {
                            creditsByType[courseType] = {
                                credits: 0,
                                count: 0
                            };
                        }
                        creditsByType[courseType].credits += credit;
                        creditsByType[courseType].count += 1;
                    }

                    // 按选修课类别统计
                    if (category) {
                        if (!creditsByCategory[category]) {
                            creditsByCategory[category] = {
                                credits: 0,
                                count: 0
                            };
                        }
                        creditsByCategory[category].credits += credit;
                        creditsByCategory[category].count += 1;
                    }
                }
            });
        });

        // 计算总计
        const totalCreditsByType = Object.values(creditsByType).reduce((sum, data) => sum + data.credits, 0);
        const totalCountByType = Object.values(creditsByType).reduce((sum, data) => sum + data.count, 0);
        const totalCreditsByCategory = Object.values(creditsByCategory).reduce((sum, data) => sum + data.credits, 0);
        const totalCountByCategory = Object.values(creditsByCategory).reduce((sum, data) => sum + data.count, 0);

        Logger.debug('📈 学分统计结果', {
            课程类型数: Object.keys(creditsByType).length,
            选修课类别数: Object.keys(creditsByCategory).length,
            总学分: totalCreditsByType.toFixed(1),
            总课程数: totalCountByType
        });

        // 生成 HTML - 表格样式布局
        let summaryHTML = '<div style="border-bottom: 1px solid #e0e0e0; margin-bottom: 12px; padding-bottom: 10px;">';
        summaryHTML += '<div style="margin-bottom: 8px; font-size: 15px; color: #222; font-weight: 600; letter-spacing: 0.5px;">📊 按课程性质统计</div>';
        // 总计行
        summaryHTML += `<div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 6px; padding: 2px 0; align-items: center; background: #f7f7fa; border-radius: 4px; padding: 4px 6px; margin-bottom: 4px;">
            <span style="color: #007bff; font-weight: 600; font-size: 13px; text-align: left;">总计</span>
            <span style="font-weight: 600; color: #007bff; font-size: 13px; text-align: left;">${totalCreditsByType.toFixed(1)} 学分</span>
            <span style="color: #007bff; font-weight: 600; font-size: 13px; text-align: left;">${totalCountByType} 门</span>
        </div>`;
        // 课程类型表格
        summaryHTML += '<div style="display: grid; gap: 2px;">';
        for (const [type, data] of Object.entries(creditsByType)) {
            summaryHTML += `<div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 6px; padding: 2px 0; align-items: center;">
                <span style="color: #444; font-weight: 400; font-size: 13px; text-align: left;">${type}</span>
                <span style="font-weight: 400; color: #333; font-size: 13px; text-align: left;">${data.credits.toFixed(1)} 学分</span>
                <span style="color: #888; font-size: 13px; text-align: left;">${data.count} 门</span>
            </div>`;
        }
        summaryHTML += '</div>';
        summaryHTML += '</div>';

        if (Object.keys(creditsByCategory).length > 0) {
            summaryHTML += '</div><div style="margin-top: 16px;">';
            summaryHTML += '<div style="margin-bottom: 8px; font-size: 15px; color: #222; font-weight: 600; letter-spacing: 0.5px;">🏷️ 按选修课类别统计</div>';
            // 总计行
            summaryHTML += `<div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 6px; padding: 2px 0; align-items: center; background: #f7f7fa; border-radius: 4px; padding: 4px 6px; margin-bottom: 4px;">
                <span style="color: 007bff; font-weight: 600; font-size: 13px; text-align: left;">总计</span>
                <span style="font-weight: 600; color: #007bff; font-size: 13px; text-align: left;">${totalCreditsByCategory.toFixed(1)} 学分</span>
                <span style="color: #007bff; font-weight: 600; font-size: 13px; text-align: left;">${totalCountByCategory} 门</span>
            </div>`;
            // 选修课类别表格
            summaryHTML += '<div style="display: grid; gap: 2px;">';
            for (const [category, data] of Object.entries(creditsByCategory)) {
                summaryHTML += `<div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 6px; padding: 2px 0; align-items: center;">
                    <span style="color: #444; font-weight: 400; font-size: 13px; text-align: left;">${category}</span>
                    <span style="font-weight: 400; color: #333; font-size: 13px; text-align: left;">${data.credits.toFixed(1)} 学分</span>
                    <span style="color: #888; font-size: 13px; text-align: left;">${data.count} 门</span>
                </div>`;
            }
            summaryHTML += '</div>';
        }
        summaryHTML += '</div>';

            creditSummaryDiv.innerHTML = summaryHTML || '暂无数据';
            Logger.debug('✅ 学分统计更新完成');
        } catch (e) {
            Logger.error('❌ 更新学分统计失败:', e);
            const creditSummaryDiv = document.getElementById('creditSummary');
            if (creditSummaryDiv) {
                creditSummaryDiv.innerHTML = '<div style="color: #dc3545; padding: 10px; text-align: center;">❌ 学分统计更新失败</div>';
            }
        }
    }

    function processAllTables() {
        try {
            Logger.debug('🔍 开始处理页面表格');
            const tables = document.querySelectorAll('table');
            const isGradePage = window.location.pathname.includes('/njlgdx/kscj/cjcx_list');
            const isSchedulePage = window.location.pathname.includes('xskb_list.do') &&
                                  document.title.includes('学期理论课表');

            Logger.debug(`📋 找到 ${tables.length} 个表格`, {
                成绩页面: isGradePage,
                课表页面: isSchedulePage
            });

            let processedTables = 0;
            let processedRows = 0;
            let enhancedCourses = 0;

            tables.forEach(table => {
                try {
            // 如果是课表页面，只处理 id="dataList" 的表格
            if (isSchedulePage && table.id !== 'dataList') {
                Logger.debug('⏭️ 跳过非 dataList 表格');
                return;
            }

            const rows = table.querySelectorAll('tr');
            Logger.debug(`📋 处理表格 (${rows.length} 行)`, {
                表格ID: table.id || '无 ID',
                成绩页面: isGradePage,
                课表页面: isSchedulePage
            });

            processedTables++;

                rows.forEach(row => {
                    try {
                        const tds = row.querySelectorAll('td');
                        if (tds.length < 3) return;

                        processedRows++;

                        let courseCodeTd;
                        let courseCode;

                        if (isGradePage) {
                            courseCodeTd = tds[2]; // 成绩页面课程代码在第3列
                            courseCode = courseCodeTd ? courseCodeTd.textContent.trim() : '';
                        } else if (isSchedulePage) {
                            courseCodeTd = tds[1]; // 课表页面课程代码在第2列
                            courseCode = courseCodeTd ? courseCodeTd.textContent.trim() : '';
                        } else {
                            courseCodeTd = tds[1];
                            if (courseCodeTd && courseCodeTd.innerHTML) {
                                const parts = courseCodeTd.innerHTML.split('<br>');
                                if (parts.length === 2) {
                                    courseCode = parts[1].trim();
                                } else {
                                    return;
                                }
                            } else {
                                return;
                            }
                        }

                        if (!courseCode) return;

                        Logger.debug(`🔍 处理课程: ${courseCode}`);

                        let courseEnhanced = false;

                        // 插入类别
                        try {
                            if (courseCodeTd && !courseCodeTd.querySelector('[data-category-inserted]')) {
                                const category = courseCategoryMap[courseCode];
                                if (category) {
                                    const catDiv = document.createElement('div');
                                    catDiv.setAttribute('data-category-inserted', '1');
                                    catDiv.style.color = '#28a745';
                                    catDiv.style.fontWeight = 'bold';
                                    catDiv.style.marginTop = '4px';
                                    // 只显示类别名称，不显示前缀
                                    catDiv.textContent = category;
                                    courseCodeTd.appendChild(catDiv);
                                    Logger.debug(`✅ 添加课程类别: ${category}`);
                                    courseEnhanced = true;
                                }
                            }
                        } catch (e) {
                            Logger.warn('⚠️ 添加课程类别时出错:', e, courseCode);
                        }

                        // 插入老师说明（来自 title，仅在非成绩页面和非课表页面）
                        try {
                            if (!isGradePage && !isSchedulePage && courseCodeTd && courseCodeTd.title && !courseCodeTd.querySelector('[data-title-inserted]')) {
                                const titleDiv = document.createElement('div');
                                titleDiv.setAttribute('data-title-inserted', '1');
                                titleDiv.style.color = '#666';
                                titleDiv.style.fontSize = '13px';
                                titleDiv.style.marginTop = '4px';
                                titleDiv.style.fontStyle = 'italic';
                                titleDiv.textContent = `📌 老师说明: ${courseCodeTd.title}`;
                                courseCodeTd.appendChild(titleDiv);
                                Logger.debug(`📝 添加老师说明`);
                                courseEnhanced = true;
                            }
                        } catch (e) {
                            Logger.warn('⚠️ 添加老师说明时出错:', e, courseCode);
                        }

                        // 插入课程大纲链接
                        try {
                            if (courseCodeTd && !courseCodeTd.querySelector('[data-outline-inserted]')) {
                                const realId = courseOutlineMap[courseCode];
                                const outlineDiv = document.createElement('div');
                                outlineDiv.setAttribute('data-outline-inserted', '1');
                                outlineDiv.style.marginTop = '4px';

                                // 检查当前是否在智慧理工平台
                                const currentUrl = window.location.href;
                                const isSmartCampus = currentUrl.includes('bkjw.njust.edu.cn');
                                
                                if (isSmartCampus) {
                                    // 在智慧理工平台下，显示提示信息
                                    outlineDiv.textContent = '⚠️ 课程大纲功能受限';
                                    outlineDiv.style.color = '#ff9800';
                                    outlineDiv.style.fontWeight = 'bold';
                                    outlineDiv.style.cursor = 'pointer';
                                    outlineDiv.title = '当前使用智慧理工平台，课程大纲功能受限。请访问教务处官网 http://202.119.81.113:8080/ 获取完整功能';
                                    
                                    // 添加点击事件，显示详细提示
                                    outlineDiv.addEventListener('click', function() {
                                        if (UI_CONFIG.showNotifications) {
                                            StatusNotifier.show('智慧理工平台限制：课程大纲功能无法使用。请访问教务处官网 http://202.119.81.113:8080/ 获取完整功能', 'warning', 8000);
                                        }
                                    });
                                    
                                    Logger.warn('⚠️ 智慧理工平台检测到，课程大纲功能已禁用');
                                    courseEnhanced = true;
                                } else if (realId) {
                                    const link = document.createElement('a');
                                    link.href = `http://202.119.81.112:8080/kcxxAction.do?method=kcdgView&jx02id=${realId}&isentering=0`;
                                    link.textContent = '📘 查看课程大纲';
                                    link.target = '_blank';
                                    link.style.color = '#0077cc';
                                    outlineDiv.appendChild(link);
                                    Logger.debug(`📘 添加课程大纲链接`);
                                    courseEnhanced = true;
                                } else {
                                    outlineDiv.textContent = '❌ 无大纲信息';
                                    outlineDiv.style.color = 'gray';
                                    Logger.debug(`❌ 无大纲信息`);
                                }
                                courseCodeTd.appendChild(outlineDiv);
                            }
                        } catch (e) {
                            Logger.warn('⚠️ 添加课程大纲链接时出错:', e, courseCode);
                        }

                        if (courseEnhanced) {
                            enhancedCourses++;
                        }
                    } catch (e) {
                        Logger.warn('⚠️ 处理表格行时出错:', e);
                    }
                });
                } catch (e) {
                    Logger.warn('⚠️ 处理表格时出错:', e);
                }
            });

            // 输出处理统计
            Logger.info('📊 表格处理统计', {
                处理表格数: processedTables,
                处理行数: processedRows,
                增强课程数: enhancedCourses
            });

            // 更新学分统计（仅在成绩页面）
            if (isGradePage) {
                Logger.debug('📊 更新学分统计');
                updateCreditSummary();
            }

            Logger.debug('✅ 表格处理完成');
        } catch (e) {
            Logger.error('❌ 处理页面表格失败:', e);
            if (UI_CONFIG.showNotifications) {
                StatusNotifier.show('页面表格处理失败', 'error', 3000);
            }
        }
    }

    // 统计追踪请求
    /* function sendTrackingRequest() {
        try {
            // 发送追踪请求，用于统计使用情况
            GM_xmlhttpRequest({
                method: 'GET',
                url: 'https://manual.njust.wiki/test.html?from=enhancer',
                timeout: 5000,
                onload: function () {
                    // 请求成功，不做任何处理
                },
                onerror: function () {
                    // 请求失败，静默处理
                },
                ontimeout: function () {
                    // 请求超时，静默处理
                }
            });
        } catch (e) {
            // 静默处理任何错误
        }
    } */

    // 检测登录错误页面并自动处理
    function checkLoginErrorAndRefresh() {
        try {
            const pageTitle = document.title || '';
            const pageContent = document.body ? document.body.textContent : '';
            
            // 检测是否为登录错误页面
            const isLoginError = pageTitle.includes('出错页面') && 
                                (pageContent.includes('您登录后过长时间没有操作') || 
                                 pageContent.includes('您的用户名已经在别处登录') ||
                                 pageContent.includes('请重新输入帐号，密码后，继续操作'));
            
            if (isLoginError) {
                Logger.warn('⚠️ 检测到登录超时或重复登录错误页面');
                
                // 显示用户提示
                if (UI_CONFIG.showNotifications) {
                    StatusNotifier.show('检测到登录超时，正在自动刷新登录状态...', 'warning', 5000);
                }
                
                // 强制刷新登录状态（忽略时间间隔限制）
                performLoginRefresh(true);
                
                return true;
            }
            
            return false;
        } catch (e) {
            Logger.error('❌ 检测登录错误页面失败:', e);
            return false;
        }
    }
    
    // 执行登录状态刷新
    function performLoginRefresh(forceRefresh = false) {
        const currentUrl = window.location.href;
        
        try {
            // 构建刷新 URL - 从当前 URL 提取基础部分
            let baseUrl;
            if (currentUrl.includes('njlgdx/')) {
                baseUrl = currentUrl.substring(0, currentUrl.indexOf('njlgdx/'));
            } else {
                // 如果当前 URL 不包含 njlgdx，尝试从域名构建
                const urlObj = new URL(currentUrl);
                baseUrl = `${urlObj.protocol}//${urlObj.host}/`;
            }
            
            const refreshUrl = baseUrl + 'njlgdx/pyfa/kcdgxz';
            
            Logger.info('🌐 准备使用隐藏 iframe 刷新登录状态:', refreshUrl);
            
            // 创建隐藏的 iframe 来加载刷新页面
            const iframe = document.createElement('iframe');
            iframe.style.cssText = `
                position: absolute;
                left: -9999px;
                top: -9999px;
                width: 1px;
                height: 1px;
                opacity: 0;
                visibility: hidden;
                border: none;
            `;
            iframe.src = refreshUrl;
            
            // 添加加载完成监听器
            iframe.onload = function() {
                Logger.info('✅ 登录状态刷新请求已完成');
                
                if (forceRefresh && UI_CONFIG.showNotifications) {
                    StatusNotifier.show('登录状态已刷新，请重新尝试操作', 'success', 3000);
                }
                
                // 延迟移除 iframe，确保请求完全处理
                setTimeout(() => {
                    if (iframe.parentNode) {
                        iframe.parentNode.removeChild(iframe);
                        Logger.debug('🗑️ 隐藏 iframe 已清理');
                    }
                }, 1000);
            };
            
            // 添加错误处理
            iframe.onerror = function() {
                Logger.warn('⚠️ 登录状态刷新请求失败');
                if (iframe.parentNode) {
                    iframe.parentNode.removeChild(iframe);
                }
                
                if (forceRefresh && UI_CONFIG.showNotifications) {
                    StatusNotifier.show('登录状态刷新失败，请手动重新点击选课中心 - 课程总库', 'error', 5000);
                }
            };
            
            // 将 iframe 添加到页面
            document.body.appendChild(iframe);
            
            // 设置超时清理，防止 iframe 长时间存在
            setTimeout(() => {
                if (iframe.parentNode) {
                    iframe.parentNode.removeChild(iframe);
                    Logger.debug('⏰ 超时清理隐藏 iframe');
                }
            }, 10000); // 10 秒超时
            
        } catch (e) {
            Logger.error('❌ 自动刷新登录状态失败:', e);
            if (forceRefresh && UI_CONFIG.showNotifications) {
                StatusNotifier.show('登录状态刷新失败，请手动重新登录', 'error', 5000);
            }
        }
    }

    // 自动刷新登录状态功能
    function autoRefreshLoginStatus() {
        try {
            const currentUrl = window.location.href;
            
            // 检查当前页面 URL 是否包含 njlgdx/framework/main.jsp
            if (currentUrl.includes('njlgdx/framework/main.jsp')) {
                // 防止频繁触发 - 检查上次刷新时间
                const lastRefreshKey = 'njust_last_login_refresh';
                const lastRefreshTime = localStorage.getItem(lastRefreshKey);
                const now = Date.now();
                const refreshInterval = 5 * 60 * 1000; // 5 分钟间隔
                
                if (lastRefreshTime && (now - parseInt(lastRefreshTime)) < refreshInterval) {
                    Logger.debug('⏭️ 距离上次刷新不足5分钟，跳过本次刷新');
                    return;
                }
                
                Logger.info('🔄 检测到主框架页面，准备刷新登录状态');
                
                // 记录本次刷新时间
                localStorage.setItem(lastRefreshKey, now.toString());
                
                // 使用统一的刷新函数
                performLoginRefresh(false);
            }
        } catch (e) {
            Logger.error('❌ 自动刷新登录状态检查失败:', e);
        }
    }

    async function init() {
        try {
            Logger.info('🎯 开始执行主要逻辑');
        //    StatusNotifier.show('南理工教务助手正在启动...', 'info');

            // 发送统计追踪请求
           // sendTrackingRequest();

            // 首先检测强智科技页面
            if (checkQiangzhiPage()) {
                Logger.info('🚪 强智科技页面检测完成，脚本退出');
                return; // 如果是强智科技页面，显示提示后直接返回
            }

            // 检测智慧理工平台并显示相应提示
            const currentUrl = window.location.href;
            const isSmartCampus = currentUrl.includes('bkjw.njust.edu.cn');
            
            if (isSmartCampus) {
                Logger.warn('⚠️ 检测到智慧理工平台，课程大纲功能将受限');
                if (UI_CONFIG.showNotifications) {
                    StatusNotifier.show('当前使用智慧理工平台，课程大纲功能受限。建议访问教务处官网 http://202.119.81.113:8080/ 获取完整功能', 'warning', 8000);
                }
            }

            // 检查是否需要自动刷新登录状态
            autoRefreshLoginStatus();
            
            // 检测登录错误页面并处理
            checkLoginErrorAndRefresh();

            Logger.info('📥 开始加载数据');
         //   StatusNotifier.show('正在加载课程数据...', 'loading');

            const [categoryData, outlineData] = await Promise.all([
                loadJSON(CATEGORY_URLS),
                loadJSON(OUTLINE_URLS)
            ]);

            Logger.info('✅ 数据加载完成，开始初始化功能');
          //  StatusNotifier.show('正在解析数据...', 'loading');
            buildCourseMaps(categoryData, outlineData);

            // 如果是成绩页面，创建悬浮窗
            if (window.location.pathname.includes('/njlgdx/kscj/cjcx_list')) {
                Logger.debug('📊 检测到成绩页面，创建学分统计窗口');
                createCreditSummaryWindow();
            }

            Logger.debug('🔄 开始处理页面表格');
        //StatusNotifier.show('正在处理页面表格...', 'loading');
        processAllTables();
       // StatusNotifier.show('页面表格处理完成', 'success', 2000);

            Logger.debug('👀 启动页面变化监听器');
            let isProcessing = false; // 防止死循环的标志
            const observer = new MutationObserver((mutations) => {
                try {
                    // 防止死循环：如果正在处理中，跳过
                    if (isProcessing) {
                        return;
                    }

                    // 检查是否有实际的内容变化（排除我们自己添加的元素）
                    const hasRelevantChanges = mutations.some(mutation => {
                        try {
                            // 如果是我们添加的标记元素，忽略
                            if (mutation.type === 'childList') {
                                for (let node of mutation.addedNodes) {
                                    if (node.nodeType === Node.ELEMENT_NODE) {
                                        // 如果是我们添加的标记元素，忽略这个变化
                                        if (node.hasAttribute && (
                                            node.hasAttribute('data-category-inserted') ||
                                            node.hasAttribute('data-title-inserted') ||
                                            node.hasAttribute('data-outline-inserted')
                                        )) {
                                            return false;
                                        }
                                        // 如果是表格相关的重要变化，才处理
                                        if (node.tagName === 'TABLE' || node.tagName === 'TR' || node.tagName === 'TD') {
                                            return true;
                                        }
                                    }
                                }
                            }
                            return false;
                        } catch (e) {
                            Logger.warn('⚠️ 检查页面变化时出错:', e);
                            return false;
                        }
                    });

                    if (hasRelevantChanges && !checkQiangzhiPage()) {
                        Logger.debug('🔄 检测到相关页面变化，重新处理表格');
                        isProcessing = true;
                        try {
                      //      StatusNotifier.show('正在更新页面表格...', 'loading');
                            processAllTables();
                       //     StatusNotifier.show('页面表格更新完成', 'success', 1500);
                        } catch (e) {
                            Logger.error('❌ 重新处理表格失败:', e);
                        } finally {
                            // 延迟重置标志，确保 DOM 修改完成
                            setTimeout(() => {
                                isProcessing = false;
                            }, 100);
                        }
                    }
                } catch (e) {
                    Logger.error('❌ MutationObserver 回调函数执行失败:', e);
                    // 确保重置处理标志
                    isProcessing = false;
                }
            });
            
            try {
                observer.observe(document.body, { childList: true, subtree: true });
            } catch (e) {
                Logger.error('❌ 启动页面变化监听器失败:', e);
            }

            Logger.info(' 脚本初始化完成');
            StatusNotifier.show('南理工教务增强助手加载成功！', 'success', 5000);

        } catch (err) {
            Logger.error('❌ 初始化失败:', err);
            StatusNotifier.show('系统初始化失败', 'error', 5000);
        }
    }

    setTimeout(init, 1000);
})();