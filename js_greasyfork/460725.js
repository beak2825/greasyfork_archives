// ==UserScript==
// @license MIT
// @name        Pixiv AI Tag
// @description 对Pixiv中的AI生成图像添加一个标注
// @author      BAKAOLC
// @version     1.0.0
// @icon        http://www.pixiv.net/favicon.ico
// @match       *://www.pixiv.net/*
// @namespace   none
// @grant       GM.setValue
// @grant       GM.getValue
// @grant       GM.deleteValue
// @grant       GM.listValues
// @grant       GM.xmlHttpRequest
// @supportURL  https://github.com/BAKAOLC/Tampermonkey-Script
// @homepageURL https://github.com/BAKAOLC/Tampermonkey-Script
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/460725/Pixiv%20AI%20Tag.user.js
// @updateURL https://update.greasyfork.org/scripts/460725/Pixiv%20AI%20Tag.meta.js
// ==/UserScript==

(function () {
    'use strict';


    // ============= 配置常量 =============
    const CONFIG = {
        QUERY_INTERVAL: 500, // 查询间隔(毫秒)
        LOG_LEVEL: 'info', // 日志级别: 'debug', 'info', 'warn', 'error'

        // 缓存配置
        CACHE: {
            ILLUST_EXPIRE_TIME: 60 * 60 * 1000,      // 插画缓存1小时
            CLEANUP_INTERVAL: 10 * 60 * 1000,        // 清理间隔10分钟
            MAX_ENTRIES: 1000                        // 最大缓存条目数
        },

        // 跨标签页同步配置
        CROSS_TAB_SYNC: {
            LOCK_EXPIRE_TIME: 15 * 1000,           // 锁过期时间15秒
            REQUEST_INTERVAL: 1000,                 // 跨标签页请求间隔1秒
            HEARTBEAT_INTERVAL: 3 * 1000,           // 心跳间隔3秒
            HEARTBEAT_EXPIRE_TIME: 10 * 1000        // 心跳过期时间10秒
        },

        // 速率限制配置
        RATE_LIMIT: {
            INITIAL_DELAY: 5000,     // 初始重试延迟5秒
            MAX_DELAY: 60000,        // 最大重试延迟1分钟
            BACKOFF_MULTIPLIER: 2    // 退避倍数
        },

        // AI标签列表
        AI_TAGS: [
            'AI', 'AI-generated', 'AI绘画', 'AI絵', 'AI生成', 'AI生成作品', 'AI作成',
            'AIartwork', 'AIgenerated', 'AIアート', 'AIイラスト', 'AIのべりすと',
            'NovelAI', 'StableDiffusion', 'MidJourney', 'DALL-E', 'Diffusion',
            'stable_diffusion', 'novel_ai', 'midjourney', 'dall_e'
        ],

        // 用户配置（可通过脚本修改）
        USER_CONFIG: {
            query_delay: 0,        // 查询间隔，时间单位为毫秒，0代表无延时
            remove_image: 0,       // 是否移除AI作品的预览图 0:不移除 1:仅屏蔽图像显示 2:从网页中移除
            show_ai_possible: true, // 是否显示可能是AI的标签
            enable_tag_detection: true, // 是否启用标签检测
            enable_auto_cache: true     // 是否启用自动缓存
        }
    };

    // 页面选择器配置 - 使用更通用的匹配方式
    const SELECTORS = {
        // 通用选择器：所有包含图像且链接到artwork的a标签
        ARTWORK_LINKS: 'a[href*="/artworks/"]:not(.add_ai_tag)',

        // 图像容器选择器：用于查找包含图像的链接
        IMAGE_CONTAINERS: [
            'a[href*="/artworks/"] img',           // 直接包含图像的链接
            'a[href*="/artworks/"] canvas',        // 包含canvas的链接
            'a[href*="/artworks/"] svg',           // 包含svg的链接
            'a[href*="/artworks/"] [style*="background-image"]' // 背景图像
        ],

        // 用于移除图像的父级深度配置（保留原有逻辑）
        REMOVE_PARENT_DEPTH: 4
    };

    // ============= 工具函数 =============
    const Utils = {
        sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        },

        // 等待DOM元素出现
        waitForElement(selector, timeout = 10000, interval = 100) {
            return new Promise((resolve, reject) => {
                const startTime = Date.now();

                const check = () => {
                    const element = document.querySelector(selector);
                    if (element) {
                        resolve(element);
                        return;
                    }

                    if (Date.now() - startTime >= timeout) {
                        reject(new Error(`Timeout waiting for element: ${selector}`));
                        return;
                    }

                    setTimeout(check, interval);
                };

                check();
            });
        },

        // 等待页面数据加载完成
        waitForPageData(illustId, timeout = 15000) {
            return new Promise((resolve, reject) => {
                const startTime = Date.now();

                const check = () => {
                    // 检查多种数据源
                    const conditions = [
                        // 检查preload-data脚本
                        () => {
                            const scripts = document.querySelectorAll('script');
                            for (const script of scripts) {
                                if (script.textContent && script.textContent.includes('preload-data')) {
                                    const patterns = [
                                        /{"timestamp".*?}(?=<\/script>)/,
                                        /{"timestamp"[^}]*}[^{]*{[^}]*"illust"[^}]*}/,
                                        /{[^}]*"illust"[^}]*}/
                                    ];

                                    for (const pattern of patterns) {
                                        const match = script.textContent.match(pattern);
                                        if (match) {
                                            try {
                                                const data = JSON.parse(match[0]);
                                                if (data.illust?.[illustId]) {
                                                    return { type: 'preload-data', data: data };
                                                }
                                            } catch (e) {
                                                // 继续尝试
                                            }
                                        }
                                    }
                                }
                            }
                            return null;
                        },

                        // 检查全局变量
                        () => {
                            const globalVars = ['__INITIAL_STATE__', '__PRELOADED_STATE__', 'pixiv'];
                            for (const varName of globalVars) {
                                if (window[varName]) {
                                    const data = window[varName];
                                    const illust = data.illust?.[illustId] || data.preload?.illust?.[illustId];
                                    if (illust) {
                                        return { type: 'global', data: data, varName: varName };
                                    }
                                }
                            }
                            return null;
                        }
                    ];

                    for (const condition of conditions) {
                        try {
                            const result = condition();
                            if (result) {
                                resolve(result);
                                return;
                            }
                        } catch (e) {
                            // 忽略错误，继续检查
                        }
                    }

                    if (Date.now() - startTime >= timeout) {
                        reject(new Error(`Timeout waiting for page data for illust ${illustId}`));
                        return;
                    }

                    setTimeout(check, 200);
                };

                check();
            });
        },

        log(message, level = 'info') {
            const levels = { debug: 0, info: 1, warn: 2, error: 3 };
            const configLevel = levels[CONFIG.LOG_LEVEL] !== undefined ? levels[CONFIG.LOG_LEVEL] : 1;
            const messageLevel = levels[level] !== undefined ? levels[level] : 1;

            // 只输出等于或高于配置级别的日志
            if (messageLevel < configLevel) return;

            const prefix = '[Pixiv AI Tag]';
            const timestamp = new Date().toLocaleTimeString();
            switch (level) {
                case 'error':
                    console.error(`${prefix} [${timestamp}] ${message}`);
                    break;
                case 'warn':
                    console.warn(`${prefix} [${timestamp}] ${message}`);
                    break;
                case 'debug':
                    console.debug(`${prefix} [${timestamp}] ${message}`);
                    break;
                default:
                    console.log(`${prefix} [${timestamp}] ${message}`);
            }
        },

        safeQuerySelector(selector, context = document) {
            try {
                return context.querySelector(selector);
            } catch (error) {
                this.log(`Invalid selector: ${selector}`, 'error');
                return null;
            }
        },

        safeQuerySelectorAll(selector, context = document) {
            try {
                return context.querySelectorAll(selector);
            } catch (error) {
                this.log(`Invalid selector: ${selector}`, 'error');
                return [];
            }
        },

        // 检查标签中是否包含AI相关标签
        checkAITags(tags) {
            if (!tags || !Array.isArray(tags)) return false;

            const tagStrings = tags.map(tag => {
                if (typeof tag === 'string') {
                    return tag;
                } else if (tag && typeof tag === 'object' && tag.tag) {
                    return tag.tag;
                }
                return '';
            }).filter(tag => tag.length > 0);

            // 检查是否有任何标签匹配AI标签列表
            for (const aiTag of CONFIG.AI_TAGS) {
                for (const tagString of tagStrings) {
                    const lowerTag = tagString.toLowerCase();
                    const lowerAiTag = aiTag.toLowerCase();

                    // 精确匹配或者作为独立单词匹配
                    if (lowerTag === lowerAiTag ||
                        lowerTag.includes(`_${lowerAiTag}_`) ||
                        lowerTag.startsWith(`${lowerAiTag}_`) ||
                        lowerTag.endsWith(`_${lowerAiTag}`) ||
                        (lowerAiTag.length >= 3 && lowerTag.includes(lowerAiTag) &&
                            !lowerTag.match(new RegExp(`[a-z]${lowerAiTag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[a-z]`)))) {
                        Utils.log(`Found AI tag match: "${tagString}" matches "${aiTag}"`, 'debug');
                        return true;
                    }
                }
            }

            return false;
        },

        // 获取父节点
        getParentNodeWithDepth(node, depth) {
            while (depth > 0) {
                if (node.parentNode)
                    node = node.parentNode;
                else
                    return null;
                depth--;
            }
            return node;
        }
    };

    // ============= 跨标签页缓存管理器 =============
    class CrossTabCacheManager {
        constructor() {
            this.cachePrefix = 'pixiv_ai_cache_';
            this.lastCleanup = 0;
            this.initializeCleanup();
        }

        getCacheKey(type, id) {
            return `${this.cachePrefix}${type}_${id}`;
        }

        async getCache(type, id) {
            try {
                const key = this.getCacheKey(type, id);
                const data = await GM.getValue(key, null);

                if (!data) return null;

                const parsed = JSON.parse(data);
                const now = Date.now();

                if (now - parsed.timestamp > CONFIG.CACHE.ILLUST_EXPIRE_TIME) {
                    await GM.deleteValue(key);
                    return null;
                }

                Utils.log(`Cache hit for ${type}:${id}`, 'debug');
                return parsed.data;
            } catch (error) {
                Utils.log(`Cache get error for ${type}:${id}: ${error.message}`, 'error');
                return null;
            }
        }

        async setCache(type, id, data) {
            try {
                const key = this.getCacheKey(type, id);
                const cacheData = {
                    data: data,
                    timestamp: Date.now(),
                    type: type,
                    id: id
                };

                await GM.setValue(key, JSON.stringify(cacheData));
                Utils.log(`Cache set for ${type}:${id}`, 'debug');
                this.scheduleCleanup();
            } catch (error) {
                Utils.log(`Cache set error for ${type}:${id}: ${error.message}`, 'error');
            }
        }

        initializeCleanup() {
            this.scheduleCleanup();
        }

        scheduleCleanup() {
            const now = Date.now();
            if (now - this.lastCleanup > CONFIG.CACHE.CLEANUP_INTERVAL) {
                setTimeout(() => this.cleanupExpiredCache(), 1000);
            }
        }

        async cleanupExpiredCache() {
            try {
                const now = Date.now();
                this.lastCleanup = now;

                const keys = await GM.listValues();
                const cacheKeys = keys.filter(key => key.startsWith(this.cachePrefix));
                let cleanedCount = 0;

                for (const key of cacheKeys) {
                    try {
                        const data = await GM.getValue(key, null);
                        if (!data) continue;

                        const parsed = JSON.parse(data);
                        if (now - parsed.timestamp > CONFIG.CACHE.ILLUST_EXPIRE_TIME) {
                            await GM.deleteValue(key);
                            cleanedCount++;
                        }
                    } catch (error) {
                        await GM.deleteValue(key);
                        cleanedCount++;
                    }
                }

                if (cleanedCount > 0) {
                    Utils.log(`Cleaned up ${cleanedCount} expired cache entries`, 'debug');
                }
            } catch (error) {
                Utils.log(`Cache cleanup error: ${error.message}`, 'error');
            }
        }
    }

    // ============= 跨标签页同步管理器 =============
    class CrossTabSyncManager {
        constructor() {
            this.tabId = this.generateTabId();
            this.lockKey = 'pixiv_ai_request_lock';
            this.lastRequestKey = 'pixiv_ai_last_request';
            this.heartbeatKey = 'pixiv_ai_heartbeat';
            this.heartbeatInterval = null;

            this.cleanupExpiredLocks();
            this.startHeartbeat();
            this.setupCleanupOnUnload();
        }

        generateTabId() {
            return `tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        }

        startHeartbeat() {
            this.updateHeartbeat();
            this.heartbeatInterval = setInterval(async () => {
                await this.updateHeartbeat();
                await this.checkDeadTabs();
            }, CONFIG.CROSS_TAB_SYNC.HEARTBEAT_INTERVAL);
        }

        async updateHeartbeat() {
            try {
                const heartbeatData = await GM.getValue(this.heartbeatKey, '{}');
                const heartbeats = JSON.parse(heartbeatData);
                heartbeats[this.tabId] = { timestamp: Date.now(), isActive: true };
                await GM.setValue(this.heartbeatKey, JSON.stringify(heartbeats));
            } catch (error) {
                Utils.log(`Error updating heartbeat: ${error.message}`, 'error');
            }
        }

        async executeRequestSynchronized(requestFunction, requestData) {
            const maxRetries = 3;
            let retries = 0;

            while (retries < maxRetries) {
                try {
                    const lockAcquired = await this.acquireLock();

                    if (!lockAcquired) {
                        await Utils.sleep(200);
                        retries++;
                        continue;
                    }

                    try {
                        await this.shouldWaitForOtherTabs();
                        const result = await requestFunction(requestData);
                        await this.recordRequestTime();
                        return result;
                    } finally {
                        await this.releaseLock();
                    }
                } catch (error) {
                    await this.releaseLock();
                    retries++;
                    if (retries >= maxRetries) {
                        throw error;
                    }
                    await Utils.sleep(1000 * retries);
                }
            }

            throw new Error('Failed to execute synchronized request after retries');
        }

        async acquireLock() {
            try {
                const now = Date.now();
                const lockData = await GM.getValue(this.lockKey, null);

                if (lockData) {
                    const lock = JSON.parse(lockData);
                    if (lock.tabId === this.tabId) {
                        lock.timestamp = now;
                        await GM.setValue(this.lockKey, JSON.stringify(lock));
                        return true;
                    }

                    if (now - lock.timestamp < CONFIG.CROSS_TAB_SYNC.LOCK_EXPIRE_TIME) {
                        return false;
                    } else {
                        await GM.deleteValue(this.lockKey);
                    }
                }

                const newLock = { tabId: this.tabId, timestamp: now };
                await GM.setValue(this.lockKey, JSON.stringify(newLock));
                return true;
            } catch (error) {
                Utils.log(`Error acquiring lock: ${error.message}`, 'error');
                return false;
            }
        }

        async releaseLock() {
            try {
                const lockData = await GM.getValue(this.lockKey, null);
                if (lockData) {
                    const lock = JSON.parse(lockData);
                    if (lock.tabId === this.tabId) {
                        await GM.deleteValue(this.lockKey);
                    }
                }
            } catch (error) {
                Utils.log(`Error releasing lock: ${error.message}`, 'error');
            }
        }

        async shouldWaitForOtherTabs() {
            try {
                const lastRequestTime = await GM.getValue(this.lastRequestKey, 0);
                const now = Date.now();
                const timeSinceLastRequest = now - lastRequestTime;

                if (timeSinceLastRequest < CONFIG.CROSS_TAB_SYNC.REQUEST_INTERVAL) {
                    const waitTime = CONFIG.CROSS_TAB_SYNC.REQUEST_INTERVAL - timeSinceLastRequest;
                    await Utils.sleep(waitTime);
                }
            } catch (error) {
                Utils.log(`Error checking request interval: ${error.message}`, 'error');
            }
        }

        async recordRequestTime() {
            try {
                await GM.setValue(this.lastRequestKey, Date.now());
            } catch (error) {
                Utils.log(`Error recording request time: ${error.message}`, 'error');
            }
        }

        async cleanupExpiredLocks() {
            try {
                const now = Date.now();
                const lockData = await GM.getValue(this.lockKey, null);

                if (lockData) {
                    const lock = JSON.parse(lockData);
                    if (now - lock.timestamp > CONFIG.CROSS_TAB_SYNC.LOCK_EXPIRE_TIME) {
                        await GM.deleteValue(this.lockKey);
                    }
                }
            } catch (error) {
                Utils.log(`Error cleaning up locks: ${error.message}`, 'error');
            }
        }

        setupCleanupOnUnload() {
            const cleanup = async () => {
                try {
                    await this.releaseLock();
                    if (this.heartbeatInterval) {
                        clearInterval(this.heartbeatInterval);
                    }
                } catch (error) {
                    // 忽略错误
                }
            };

            window.addEventListener('beforeunload', cleanup);
            window.addEventListener('unload', cleanup);
        }

        async checkDeadTabs() {
            // 简化版本，只清理过期锁
            await this.cleanupExpiredLocks();
        }
    }

    // ============= API 客户端 =============
    class APIClient {
        constructor(syncManager) {
            this.syncManager = syncManager;
        }

        async fetchPixivIllust(id) {
            const requestFunction = async () => {
                return new Promise((resolve, reject) => {
                    GM.xmlHttpRequest({
                        method: 'GET',
                        url: `https://www.pixiv.net/ajax/illust/${id}`,
                        headers: {
                            'Accept': 'application/json',
                            'Referer': 'https://www.pixiv.net/'
                        },
                        onload: function (response) {
                            if (response.status >= 200 && response.status < 300) {
                                try {
                                    const data = JSON.parse(response.responseText);
                                    resolve({ json: () => Promise.resolve(data), ok: true });
                                } catch (error) {
                                    reject(new Error(`JSON parse error: ${error.message}`));
                                }
                            } else {
                                reject(new Error(`HTTP ${response.status}: ${response.statusText}`));
                            }
                        },
                        onerror: function (error) {
                            reject(new Error(`Network error: ${error.message || 'Unknown error'}`));
                        },
                        ontimeout: function () {
                            reject(new Error('Request timeout'));
                        },
                        timeout: 10000
                    });
                });
            };

            return await this.syncManager.executeRequestSynchronized(requestFunction, { id });
        }
    }

    // ============= Pixiv页面自动记录器 =============
    class PixivAutoRecorder {
        constructor(cacheManager) {
            this.cacheManager = cacheManager;
            this.isPixivPage = location.hostname === 'www.pixiv.net';
        }

        async initialize() {
            if (!this.isPixivPage || !CONFIG.USER_CONFIG.enable_auto_cache) {
                Utils.log('Pixiv auto recorder skipped (not pixiv page or disabled)', 'debug');
                return;
            }

            Utils.log('Initializing Pixiv auto recorder...', 'debug');
            try {
                await this.recordCurrentPage();
                Utils.log('Pixiv auto recorder initialized successfully', 'debug');
            } catch (error) {
                Utils.log(`Pixiv auto recorder error: ${error.message}`, 'error');
                // 不要抛出错误，让脚本继续运行
            }
        }

        async recordCurrentPage() {
            try {
                const url = location.href;

                if (url.includes('/artworks/')) {
                    await this.recordIllustPage();
                }
            } catch (error) {
                Utils.log(`Error recording current page: ${error.message}`, 'error');
            }
        }

        async recordIllustPage() {
            try {
                const match = location.href.match(/\/artworks\/(\d+)/);
                if (!match) return;

                const illustId = match[1];
                Utils.log(`Recording illust page: ${illustId}`, 'debug');

                let pageData = null;
                try {
                    pageData = await Utils.waitForPageData(illustId, 10000);
                } catch (error) {
                    Utils.log(`Timeout waiting for page data: ${error.message}`, 'warn');
                }

                if (pageData && pageData.type !== 'basic') {
                    let illust = null;

                    if (pageData.type === 'preload-data') {
                        illust = pageData.data.illust?.[illustId];
                    } else if (pageData.type === 'global') {
                        illust = pageData.data.illust?.[illustId] || pageData.data.preload?.illust?.[illustId];
                    }

                    if (illust) {
                        await this.processIllustData(illustId, illust);
                    }
                }
            } catch (error) {
                Utils.log(`Error recording illust page: ${error.message}`, 'error');
            }
        }

        async processIllustData(illustId, illust) {
            try {
                const tags = illust.tags?.tags || [];
                const isAIByType = illust.aiType === 2;
                const isAIPossibleByType = illust.aiType >= 2;
                const isAIByTags = CONFIG.USER_CONFIG.enable_tag_detection ? Utils.checkAITags(tags) : false;

                const cacheData = {
                    ai: isAIByType || isAIByTags,
                    ai_is_possible: isAIPossibleByType || isAIByTags,
                    user_id: illust.userId,
                    title: illust.title,
                    tags: tags,
                    aiType: illust.aiType,
                    isAIByTags: isAIByTags
                };

                await this.cacheManager.setCache('pixiv_illust', illustId, cacheData);
                Utils.log(`Auto-recorded illust ${illustId} (AI: ${cacheData.ai})`, 'debug');
            } catch (error) {
                Utils.log(`Error processing illust data: ${error.message}`, 'error');
            }
        }
    }

    // ============= DOM 操作工具 =============
    class DOMUtils {
        static addStyles() {
            if (document.getElementById('pixiv-ai-tag-styles')) return;

            const styles = `
.add_ai_tag_view {
    padding: 0px 6px;
    border-radius: 3px;
    color: rgb(255, 255, 255);
    background: rgb(96, 64, 255);
    font-weight: bold;
    font-size: 10px;
    line-height: 16px;
    user-select: none;
}

                .add_ai_possible_tag_view {
                    background: rgb(96, 64, 127);
                }

                .add_ai_tag_view.ai-by-tags {
                    background: rgb(255, 96, 64);
                }

                .add_ai_possible_tag_view.ai-by-tags {
                    background: rgb(127, 64, 96);
                }
            `;

            const styleElement = document.createElement('style');
            styleElement.id = 'pixiv-ai-tag-styles';
            styleElement.textContent = styles;
            document.head.appendChild(styleElement);
        }

        static addTag(node, text, className = 'add_ai_tag_view', isAIByTags = false) {
            // 只对包含图片的链接添加标签
            const img = node.querySelector('img');
            if (!img) {
                return false; // 不是图片链接，跳过
            }

            // 检查是否已经有AI标签，避免重复添加
            if (node.querySelector('.add_ai_tag_view, .add_ai_possible_tag_view')) {
                return true; // 已存在标签，视为成功
            }

            const finalClassName = className + (isAIByTags ? ' ai-by-tags' : '');

            // 查找合适的图片容器 - 尝试多个可能的父级
            let imgContainer = img.parentElement;

            // 如果直接父级没有合适的定位，向上查找
            while (imgContainer && imgContainer !== node) {
                const style = window.getComputedStyle(imgContainer);
                if (style.position === 'relative' || imgContainer.classList.contains('sc-324476b7-9')) {
                    break;
                }
                imgContainer = imgContainer.parentElement;
            }

            // 如果没找到合适的容器，使用图片的直接父级
            if (!imgContainer || imgContainer === node) {
                imgContainer = img.parentElement;
            }

            if (!imgContainer) {
                return false; // 失败
            }

            // 设置容器为相对定位
            imgContainer.style.position = 'relative';

            // 固定放在左下角，避免与其他元素重叠
            const position = 'bottom: 4px; left: 4px;';

            const tagHtml = `<div class="${finalClassName}" style="position: absolute; ${position} z-index: 10;">${text}</div>`;
            imgContainer.insertAdjacentHTML('afterbegin', tagHtml);

            // 标记节点为已处理
            node.dataset.tagAdded = 'true';

            return true; // 成功
        }
    }

    // ============= 查询数据管理器 =============
    class QueryDataManager {
        constructor(cacheManager, apiClient) {
            this.cacheManager = cacheManager;
            this.apiClient = apiClient;
            this.data = { pixiv_illust: {} };
        }

        getOrCreate(type, id) {
            if (!this.data[type][id]) {
                this.data[type][id] = {
                    nodes: [],
                    querying: false,
                    ai: null,
                    ai_is_possible: null
                };
            }
            return this.data[type][id];
        }

        async addNode(type, id, node) {
            const entry = this.getOrCreate(type, id);

            // 总是添加节点，因为同一个作品可能有多个链接（图片链接和标题链接）
            if (!entry.nodes.includes(node)) {
                entry.nodes.push(node);
            }

            // 预检查缓存
            const cachedData = await this.cacheManager.getCache(type, id);
            if (cachedData) {
                // 静默使用缓存数据
                // 只对当前节点应用缓存数据
                this.applyCachedData(type, id, [node], cachedData);
                // 移除已成功添加标签的节点
                entry.nodes = entry.nodes.filter(n => !n.dataset.tagAdded);
            } else if (!entry.querying) {
                // 静默排队API请求
            }
        }

        applyCachedData(type, id, nodes, cachedData) {
            if (type === 'pixiv_illust') {
                // 延迟处理，给DOM一些时间完全渲染
                setTimeout(() => {
                    nodes.forEach(node => {
                        if (cachedData.ai) {
                            const success = DOMUtils.addTag(node, 'AI', 'add_ai_tag_view', cachedData.isAIByTags);
                            if (success) {
                                this.handleImageRemoval(node);
                            } else {
                                // 如果失败，再次尝试
                                setTimeout(() => {
                                    DOMUtils.addTag(node, 'AI', 'add_ai_tag_view', cachedData.isAIByTags);
                                }, 1000);
                            }
                        } else if (cachedData.ai_is_possible && CONFIG.USER_CONFIG.show_ai_possible) {
                            const success = DOMUtils.addTag(node, 'AI?', 'add_ai_possible_tag_view', cachedData.isAIByTags);
                            if (!success) {
                                setTimeout(() => {
                                    DOMUtils.addTag(node, 'AI?', 'add_ai_possible_tag_view', cachedData.isAIByTags);
                                }, 1000);
                            }
                        }
                    });
                }, 100); // 100ms延迟
            }
        }

        handleImageRemoval(node) {
            try {
                switch (CONFIG.USER_CONFIG.remove_image) {
                    case 1:
                        // 替换所有图像内容为文本
                        const images = node.querySelectorAll('img, canvas, svg');
                        images.forEach(img => {
                            img.outerHTML = "<h5>AI Artwork</h5>";
                        });

                        // 处理背景图像
                        const bgElements = node.querySelectorAll('[style*="background-image"]');
                        bgElements.forEach(el => {
                            el.style.backgroundImage = 'none';
                            if (!el.textContent.trim()) {
                                el.innerHTML = "<h5>AI Artwork</h5>";
                            }
                        });
                        break;

                    case 2:
                        // 移除整个容器
                        const parent = Utils.getParentNodeWithDepth(node, SELECTORS.REMOVE_PARENT_DEPTH);
                        if (parent && parent.parentNode) {
                            parent.parentNode.removeChild(parent);
                        }
                        break;
                }
            } catch (error) {
                Utils.log(`Error handling image removal: ${error.message}`, 'error');
            }
        }

        getQueuedItems() {
            const queued = [];
            for (const [type, items] of Object.entries(this.data)) {
                for (const [id, data] of Object.entries(items)) {
                    if (data.nodes.length > 0 && !data.querying) {
                        queued.push({ type, id, data });
                    }
                }
            }
            return queued;
        }

        async processPixivIllust(id, nodes) {
            const entry = this.getOrCreate('pixiv_illust', id);

            try {
                const cachedData = await this.cacheManager.getCache('pixiv_illust', id);

                if (cachedData) {
                    Utils.log(`Using cached data for illust ${id}`, 'debug');
                    this.applyCachedData('pixiv_illust', id, nodes, cachedData);
                    return false;
                }

                if (entry.ai === null) {
                    entry.querying = true;
                    Utils.log(`Fetching data for illust ${id}`, 'debug');

                    const response = await this.apiClient.fetchPixivIllust(id);
                    const json = await response.json();

                    if (!json?.body) {
                        throw new Error('Invalid response');
                    }

                    const { aiType } = json.body;
                    const tags = json.body.tags?.tags || [];

                    const isAIByType = aiType === 2;
                    const isAIPossibleByType = aiType >= 2;
                    const isAIByTags = CONFIG.USER_CONFIG.enable_tag_detection ? Utils.checkAITags(tags) : false;

                    const cacheData = {
                        ai: isAIByType || isAIByTags,
                        ai_is_possible: isAIPossibleByType || isAIByTags,
                        user_id: json.body.userId,
                        title: json.body.title || '',
                        tags: tags,
                        aiType: aiType,
                        isAIByTags: isAIByTags
                    };

                    entry.ai = cacheData.ai;
                    entry.ai_is_possible = cacheData.ai_is_possible;

                    await this.cacheManager.setCache('pixiv_illust', id, cacheData);
                    this.applyCachedData('pixiv_illust', id, nodes, cacheData);

                    Utils.log(`Processed illust ${id}: AI=${cacheData.ai}`, 'debug');
                    entry.querying = false;
                    return true;
                } else {
                    this.applyCachedData('pixiv_illust', id, nodes, {
                        ai: entry.ai,
                        ai_is_possible: entry.ai_is_possible
                    });
                    return false;
                }
            } catch (error) {
                entry.querying = false;
                Utils.log(`Error processing illust ${id}: ${error.message}`, 'error');
                return false;
            }
        }
    }

    // ============= URL 处理器 =============
    class URLProcessor {
        constructor(queryDataManager) {
            this.queryDataManager = queryDataManager;
        }

        extractPixivIllustId(url) {
            const match = url.match(/\/artworks\/(\d+)/);
            return match ? match[1] : null;
        }

        async processNode(node) {
            if (!node?.href) return;

            if (node.classList.contains('add_ai_tag')) return;

            node.classList.add('add_ai_tag');
            const url = node.href;

            if (/pixiv\.net/.test(url) && /artworks/.test(url)) {
                const id = this.extractPixivIllustId(url);
                if (id) {
                    await this.queryDataManager.addNode('pixiv_illust', id, node);
                }
            }
        }
    }

    // ============= 主应用类 =============
    class PixivAITagEnhanced {
        constructor() {
            this.cacheManager = new CrossTabCacheManager();
            this.syncManager = new CrossTabSyncManager();
            this.apiClient = new APIClient(this.syncManager);
            this.queryDataManager = new QueryDataManager(this.cacheManager, this.apiClient);
            this.urlProcessor = new URLProcessor(this.queryDataManager);
            this.pixivAutoRecorder = new PixivAutoRecorder(this.cacheManager);

            this.isRunning = false;
            this.observer = null;
            this.queryInterval = null;
        }

        async initialize() {
            try {
                Utils.log('Initializing Pixiv AI Tag Enhanced...', 'debug');

                DOMUtils.addStyles();
                await this.pixivAutoRecorder.initialize();
                this.setupObserver();
                this.startQueryLoop();
                this.startMaintenanceLoop();
                // 移除定期扫描，MutationObserver已经足够

                Utils.log('Initialization completed', 'debug');

                // 等待页面完全加载后扫描
                this.waitForPageLoad();

            } catch (error) {
                Utils.log(`Initialization error: ${error.message}`, 'error');
                console.error('Full initialization error:', error);
            }
        }

        async waitForPageLoad() {
            // 如果页面已经完全加载
            if (document.readyState === 'complete') {
                Utils.log('Page already loaded, scanning immediately', 'debug');
                await this.scanDocument();
                return;
            }

            // 等待页面加载完成
            const loadPromise = new Promise((resolve) => {
                if (document.readyState === 'complete') {
                    resolve();
                } else {
                    window.addEventListener('load', resolve, { once: true });
                }
            });

            // 等待DOM内容加载完成（备用）
            const domPromise = new Promise((resolve) => {
                if (document.readyState !== 'loading') {
                    resolve();
                } else {
                    document.addEventListener('DOMContentLoaded', resolve, { once: true });
                }
            });

            try {
                // 等待页面加载完成，最多等待10秒
                await Promise.race([
                    loadPromise,
                    new Promise(resolve => setTimeout(resolve, 10000))
                ]);

                Utils.log('Page load completed, starting scan', 'debug');
                await this.scanDocument();

                // 如果还没有找到链接，再等待一下（可能是SPA应用）
                const artworkCount = document.querySelectorAll('a[href*="/artworks/"]:not(.add_ai_tag)').length;
                if (artworkCount === 0) {
                    Utils.log('No artwork links found, waiting for SPA content...', 'debug');
                    await Utils.sleep(2000);
                    await this.scanDocument();
                }

            } catch (error) {
                Utils.log(`Error waiting for page load: ${error.message}`, 'error');
                // 即使出错也尝试扫描
                await this.scanDocument();
            }
        }

        async scanDocument() {
            try {
                Utils.log('Starting document scan...', 'debug');

                const artworkLinks = document.querySelectorAll('a[href*="/artworks/"]:not(.add_ai_tag)');
                if (artworkLinks.length > 0) {
                    Utils.log(`Found ${artworkLinks.length} new artwork links`, 'debug');
                }

                if (artworkLinks.length > 0) {
                    // 优先处理包含图片的链接，避免重复处理同一作品
                    const processedIds = new Set();
                    let processed = 0;

                    for (const link of artworkLinks) {
                        const id = this.urlProcessor.extractPixivIllustId(link.href);
                        if (id && !processedIds.has(id)) {
                            // 优先选择包含图片的链接
                            if (this.hasImageContent(link)) {
                                await this.urlProcessor.processNode(link);
                                processedIds.add(id);
                                processed++;
                            }
                        }
                    }

                    // 处理没有图片但还未处理的链接
                    for (const link of artworkLinks) {
                        const id = this.urlProcessor.extractPixivIllustId(link.href);
                        if (id && !processedIds.has(id)) {
                            await this.urlProcessor.processNode(link);
                            processedIds.add(id);
                            processed++;
                        }
                    }

                    Utils.log(`Processed ${processed} unique artwork links`, 'debug');
                } else {
                    Utils.log('No new artwork links found', 'debug');
                }
            } catch (error) {
                Utils.log(`Document scan error: ${error.message}`, 'error');
                console.error('Scan error details:', error);
            }
        }

        // 高效的增量扫描 - 只处理新节点
        async scanNewNodes(nodes) {
            try {
                const processedIds = new Set();
                let processed = 0;

                // 收集所有artwork链接
                const allLinks = [];
                for (const node of nodes) {
                    if (node.nodeType === 1) { // Element node
                        // 检查节点本身是否是artwork链接
                        if (node.matches && node.matches('a[href*="/artworks/"]:not(.add_ai_tag)')) {
                            allLinks.push(node);
                        }

                        // 检查节点内部的artwork链接
                        const artworkLinks = node.querySelectorAll('a[href*="/artworks/"]:not(.add_ai_tag)');
                        allLinks.push(...artworkLinks);
                    }
                }

                // 优先处理包含图片的链接
                for (const link of allLinks) {
                    const id = this.urlProcessor.extractPixivIllustId(link.href);
                    if (id && !processedIds.has(id) && this.hasImageContent(link)) {
                        await this.urlProcessor.processNode(link);
                        processedIds.add(id);
                        processed++;
                    }
                }

                // 处理剩余的链接
                for (const link of allLinks) {
                    const id = this.urlProcessor.extractPixivIllustId(link.href);
                    if (id && !processedIds.has(id)) {
                        await this.urlProcessor.processNode(link);
                        processedIds.add(id);
                        processed++;
                    }
                }

                if (processed > 0) {
                    Utils.log(`Incrementally processed ${processed} unique artwork links`, 'debug');
                }

                return processed;
            } catch (error) {
                Utils.log(`Incremental scan error: ${error.message}`, 'error');
                return 0;
            }
        }

        // 检查链接是否包含图像内容
        hasImageContent(link) {
            if (!link) return false;

            // 检查是否包含img标签
            if (link.querySelector('img')) return true;

            // 检查是否包含canvas
            if (link.querySelector('canvas')) return true;

            // 检查是否包含svg
            if (link.querySelector('svg')) return true;

            // 检查是否有背景图像
            const elementsWithBg = link.querySelectorAll('[style*="background-image"]');
            if (elementsWithBg.length > 0) return true;

            // 检查CSS背景图像
            const computedStyle = window.getComputedStyle(link);
            if (computedStyle.backgroundImage && computedStyle.backgroundImage !== 'none') return true;

            // 检查子元素的背景图像
            const children = link.querySelectorAll('*');
            for (const child of children) {
                const childStyle = window.getComputedStyle(child);
                if (childStyle.backgroundImage && childStyle.backgroundImage !== 'none') {
                    return true;
                }
            }

            return false;
        }

        setupObserver() {
            if (this.observer) {
                this.observer.disconnect();
            }

            // 测试MutationObserver是否工作
            Utils.log('Setting up MutationObserver...', 'debug');

            this.observer = new MutationObserver(async (mutations) => {
                Utils.log(`🔍 MutationObserver triggered! ${mutations.length} mutations detected`, 'debug');

                const newNodes = [];
                let totalAddedNodes = 0;

                for (const mutation of mutations) {
                    Utils.log(`  Mutation type: ${mutation.type}, added: ${mutation.addedNodes.length}, removed: ${mutation.removedNodes.length}`, 'debug');

                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        totalAddedNodes += mutation.addedNodes.length;

                        for (const node of mutation.addedNodes) {
                            if (node.nodeType === 1) { // Element node
                                // 检查是否包含artwork链接
                                const hasArtworkLink = (node.matches && node.matches('a[href*="/artworks/"]')) ||
                                    (node.querySelector && node.querySelector('a[href*="/artworks/"]'));

                                if (hasArtworkLink) {
                                    newNodes.push(node);
                                    Utils.log(`  📎 Found node with artwork links: ${node.tagName}`, 'debug');
                                }
                            }
                        }
                    }
                }

                Utils.log(`  Total added nodes: ${totalAddedNodes}, artwork nodes: ${newNodes.length}`, 'debug');

                if (newNodes.length > 0) {
                    Utils.log(`🎯 Processing ${newNodes.length} new nodes with artwork links`, 'debug');
                    await this.scanNewNodes(newNodes);
                }
            });

            // 检查document.body是否存在
            if (!document.body) {
                Utils.log('⚠️ document.body not found, waiting...', 'warn');
                setTimeout(() => this.setupObserver(), 100);
                return;
            }

            try {
                this.observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });

                Utils.log('✅ MutationObserver setup completed, observing document.body', 'debug');

                // 测试observer是否真的在工作
                setTimeout(() => {
                    Utils.log('🧪 Testing MutationObserver by adding a test element...', 'debug');
                    const testDiv = document.createElement('div');
                    testDiv.id = 'pixiv-ai-test';
                    testDiv.style.display = 'none';
                    document.body.appendChild(testDiv);

                    setTimeout(() => {
                        if (document.getElementById('pixiv-ai-test')) {
                            document.body.removeChild(testDiv);
                        }
                    }, 1000);
                }, 2000);

            } catch (error) {
                Utils.log(`❌ Failed to setup MutationObserver: ${error.message}`, 'error');
            }
        }

        startQueryLoop() {
            if (this.isRunning) return;

            this.isRunning = true;

            const interval = CONFIG.USER_CONFIG.query_delay > 0 ?
                CONFIG.USER_CONFIG.query_delay : CONFIG.QUERY_INTERVAL;

            this.queryInterval = setInterval(async () => {
                if (this.isRunning) {
                    await this.processQueuedQueries();
                }
            }, interval);
        }

        async processQueuedQueries() {
            const queuedItems = this.queryDataManager.getQueuedItems();
            if (queuedItems.length === 0) return;

            for (const { type, id, data } of queuedItems) {
                const nodes = [...data.nodes];
                data.nodes = [];

                try {
                    if (type === 'pixiv_illust') {
                        await this.queryDataManager.processPixivIllust(id, nodes);
                    }
                } catch (error) {
                    if (error.message.includes('429')) {
                        data.nodes.unshift(...nodes);
                        Utils.log(`Rate limited for ${type}:${id}, re-queuing`, 'warn');
                    }
                    Utils.log(`Error processing ${type}:${id}: ${error.message}`, 'error');
                }

                await Utils.sleep(100);
            }
        }

        startMaintenanceLoop() {
            setInterval(async () => {
                try {
                    await this.cacheManager.cleanupExpiredCache();
                } catch (error) {
                    Utils.log(`Maintenance error: ${error.message}`, 'error');
                }
            }, CONFIG.CACHE.CLEANUP_INTERVAL);
        }

        startPeriodicScan() {
            // 备用的定期扫描，以防MutationObserver不工作
            setInterval(async () => {
                try {
                    const newLinks = document.querySelectorAll('a[href*="/artworks/"]:not(.add_ai_tag)').length;
                    if (newLinks > 0) {
                        Utils.log(`🔄 Periodic scan found ${newLinks} new artwork links`, 'info');
                        await this.scanDocument();
                    }
                    // 移除了"没有找到新链接"的日志，减少噪音
                } catch (error) {
                    Utils.log(`Periodic scan error: ${error.message}`, 'error');
                }
            }, 5000); // 每5秒检查一次
        }

        async stop() {
            this.isRunning = false;

            if (this.queryInterval) {
                clearInterval(this.queryInterval);
                this.queryInterval = null;
            }

            if (this.observer) {
                this.observer.disconnect();
                this.observer = null;
            }

            await this.syncManager.stop();
            Utils.log('Pixiv AI Tag Enhanced stopped', 'info');
        }
    }

    // ============= 初始化 =============
    let enhancer = null;


    async function initialize() {
        try {
            if (enhancer) {
                await enhancer.stop();
            }

            enhancer = new PixivAITagEnhanced();
            await enhancer.initialize();

        } catch (error) {
            Utils.log(`Initialization failed: ${error.message}`, 'error');
            console.error('Full error:', error);
        }
    }

    // 确保在DOM准备好后初始化
    if (document.readyState === 'loading') {
        Utils.log('Document still loading, waiting for DOMContentLoaded', 'debug');
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        Utils.log('Document ready, initializing immediately', 'debug');
        initialize();
    }

})();

