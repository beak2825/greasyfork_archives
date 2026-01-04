// ==UserScript==
// @name         B站打call表情集合
// @namespace    http://tampermonkey.net/
// @version      3.0.0
// @description  自动筛选B站直播间打call表情，alt+左键可手动添加
// @author       DeepSeek, Claude，Qwen
// @match        *://*.bilibili.com/live*
// @match        *://live.bilibili.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/541756/B%E7%AB%99%E6%89%93call%E8%A1%A8%E6%83%85%E9%9B%86%E5%90%88.user.js
// @updateURL https://update.greasyfork.org/scripts/541756/B%E7%AB%99%E6%89%93call%E8%A1%A8%E6%83%85%E9%9B%86%E5%90%88.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 注入CSS样式
    const css = `
    /* 基础面板样式 */
    .custom-panel {
        transition: all 0.3s ease;
        position: relative;
        background-color: var(--bg1, #fff) !important;
        border-radius: 8px;

        color: var(--text1, #333) !important;
        line-height: 1.15;
        display: block;
    }

    /* 隐藏面板时的样式 */
    .custom-panel.hidden {
        display: none !important;
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
    }

    /* 打call面板特定样式 */
    #bili-emote-panel {
        width: 300px !important;
        padding: 0 !important;
        overflow: auto !important;
        overflow-x: hidden !important;
        background-color: var(--bg1, #fff) !important;
        z-index: 9999;
    }

    /* 加载状态样式 */
    .custom-panel[data-loading] {
        opacity: 0.5;
        pointer-events: none;
    }

    /* 修改表情容器网格布局 */
    .emotion-container {
        display: grid !important;
        grid-template-columns: repeat(4, 1fr) !important;
        gap: 2px !important;
        padding: 8px 8px !important;
        box-sizing: border-box;
        justify-content: center;
        justify-items: center;
        background-color: var(--bg1, #fff) !important;
        width: 100% !important;
    }

    /* 修改表情项样式 */
    .emotion-item {
        width: 100% !important;
        height: 65px !important;
        aspect-ratio: 1;
        margin: 0 !important;
        border: 1px solid var(--line_regular, #e5e5e5);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        border-radius: 4px;
        overflow: hidden;
    }

    /* 表情项悬停效果 */
    .emotion-item:hover {
        transform: scale(1.05);
        box-shadow: 0 4px 12px var(--brand_pink_thin, rgba(251,114,153,0.2));
        border-color: var(--brand_pink, #fb7299);
    }

    /* 加载指示器 */
    .loading-indicator {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: var(--Ga5, #999);
        font-size: 14px;
        display: none;
    }

    .custom-panel[data-loading] .loading-indicator {
        display: block;
    }

    /* 优化滚动条 */
    .ps__scrollbar-y {
        background-color: var(--Ga5, #999) !important;
        border-radius: 3px;
    }

    .ps__scrollbar-y:hover {
        background-color: var(--Ga7, #666) !important;
    }

    /* 底栏图标样式 */
    #bili-emote-icon {
        display: inline-block;
        margin-right: 8px;
        cursor: pointer;
        vertical-align: middle;
        transition: transform 0.2s ease;
    }

    #bili-emote-icon:hover {
        transform: scale(1.1);
    }

    /* 无数据提示 */
    .no-data-tip {
        grid-column: 1 / -1;
        padding: 20px;
        text-align: center;
        color: #999;
        font-size: 14px;
    }

    /* 标签样式 */
    #bili-emote-tab {
        cursor: pointer;
        position: relative;
    }

    /* 强制覆盖B站原生样式 */
    #bili-emote-tab.active {
        border-bottom: 2px solid #23ade5 !important;
        color: #23ade5 !important;
        opacity: 1 !important;
        transform: translateZ(0);
    }

    /* 清除可能存在的B站动画干扰 */
    #bili-emote-tab {
        animation: none !important;
        transition: none !important;
    }

    /* 激活面板显示优先级 */
    .img-pane.custom-panel[style*="display: block"] {
        display: block !important;
        opacity: 1 !important;
        z-index: 9999 !important;
    }
    `;
    document.head.insertAdjacentHTML('beforeend', `<style>${css}</style>`);
    // 虚拟滚动实现
    class VirtualScroller {
        constructor(container, itemHeight, visibleCount) {
            this.container = container;
            this.itemHeight = itemHeight;
            this.visibleCount = visibleCount;
            this.scrollTop = 0;
        }

        render(data) {
            const startIndex = Math.floor(this.scrollTop / this.itemHeight);
            const endIndex = Math.min(startIndex + this.visibleCount, data.length);

            // 只渲染可见区域的元素
            const visibleItems = data.slice(startIndex, endIndex);
            this.renderItems(visibleItems, startIndex);
        }
    }
    // 实现对象池减少GC压力
    class ElementPool {
        constructor() {
            this.pool = [];
            this.maxSize = 50;
        }

        get() {
            return this.pool.pop() || this.createElement();
        }

        release(element) {
            if (this.pool.length < this.maxSize) {
                this.resetElement(element);
                this.pool.push(element);
            }
        }

        createElement() {
            return document.createElement('div');
        }

        resetElement(element) {
            element.innerHTML = '';
            element.className = '';
            element.style.cssText = '';
        }
    }
    // LRU缓存实现
    class LRUCache {
        constructor(maxSize = 100) {
            this.maxSize = maxSize;
            this.cache = new Map();
        }

        get(key) {
            if (!this.cache.has(key)) return null;
            const value = this.cache.get(key);
            this.cache.delete(key);
            this.cache.set(key, value);
            return value;
        }

        set(key, value) {
            this.cache.delete(key);
            if (this.cache.size >= this.maxSize) {
                this.cache.delete(this.cache.keys().next().value);
            }
            this.cache.set(key, value);
        }
    }

    // 控制并发请求数量
    class ConcurrencyController {
        constructor(maxConcurrency = 3) {
            this.maxConcurrency = maxConcurrency;
            this.running = 0;
            this.queue = [];
        }

        async add(promiseFactory) {
            return new Promise((resolve, reject) => {
                this.queue.push({
                    promiseFactory,
                    resolve,
                    reject
                });
                this.process();
            });
        }

        async process() {
            if (this.running >= this.maxConcurrency || this.queue.length === 0) {
                return;
            }

            this.running++;
            const { promiseFactory, resolve, reject } = this.queue.shift();

            try {
                const result = await promiseFactory();
                resolve(result);
            } catch (error) {
                reject(error);
            } finally {
                this.running--;
                this.process();
            }
        }
    }
    // 改进的图片加载策略
    class ImageLoader {
        constructor() {
            this.loadingImages = new Set();
            this.imageCache = new Map();
        }

        async loadImage(url, priority = 'normal') {
            if (this.imageCache.has(url)) {
                return this.imageCache.get(url);
            }

            if (this.loadingImages.has(url)) {
                return this.waitForImage(url);
            }

            this.loadingImages.add(url);

            try {
                const img = new Image();
                if (priority === 'high') {
                    img.loading = 'eager';
                } else {
                    img.loading = 'lazy';
                }

                const promise = new Promise((resolve, reject) => {
                    img.onload = () => resolve(img);
                    img.onerror = reject;
                });

                img.src = url;
                const result = await promise;

                this.imageCache.set(url, result);
                return result;
            } finally {
                this.loadingImages.delete(url);
            }
        }
    }

    class BiliEmotionEnhancer {
        constructor() {
            // 基础属性初始化
            this.observer = null;
            this.collectionPanel = null;
            this.collectionTab = null;
            this.emotionData = [];
            this.isInitialized = false;
            this.debug = true;
            this._isCollecting = false;
            this.urlCache = new Map();
            this.cloneCache = new Map();
            this.storageKey = 'bili-emotion-enhancer-data';
            this.currentRoomId = null;
            this.initializationAttempts = 0;
            this.maxInitAttempts = 10;
            this.initTimeout = null;
            this.isHoveringIcon = false;
            this.isHoveringPanel = false;
            this.closeEmotionPanelTimer = null;
            this.isClosingPanel = false;
            this.mouseEnterDebounceTimer = null;
            this.lastMouseY = 0;
            this.panelOpenLock = false;
            this._globalClickHandler = null;
            this.timers = new Set();
            this.saveTimeout = null;
            this.checkInterval = null;
            this.eventHandlers = new Map();


            // 配置信息
            this.config = {
                keywords: ["打call", "好听", "唱歌"],

                collectionIcon: this.getFirstEmotionIcon(),
                excludeImages: [
                    "https://i0.hdslb.com/bfs/live/fa1eb4dce3ad198bb8650499830560886ce1116c.png",
                    "https://i0.hdslb.com/bfs/live/1daaa5d284dafaa16c51409447da851ff1ec557f.png@195w.webp"
                ],
                manualCollections: [], // 新增：手动收藏的表情URL列表
                selectors: {
                    emoticonsPanel: ['.emoticons-panel', '.chat-input-tool-item[title="表情"]'],
                    tabContainer: ['.tab-pane-content[data-v-041466f0]', '.tab-pane-content'],
                    contentContainer: ['.emoticons-pane[data-v-041466f0]', '.emoticons-pane', '.emoticon-areas'],
                    emotionItem: ['.emoticon-item[data-v-041466f0]', '.emoticon-item', '.emoji-item'],
                    originalPanel: ['.img-pane[data-v-041466f0]', '.img-pane', '.content-panel'],
                    tabPaneItem: ['.tab-pane-item[data-v-041466f0]', '.tab-pane-item', '.tab-item'],
                    iconRightPart: ['.icon-right-part', '.control-buttons-row', '.chat-input-ctnr'],
                    chatInput: ['.chat-input textarea', '.chat-input input', 'textarea.input-box']
                },
                dimensions: {
                    icon: { width: 30, height: 30 },
                    panel: { width: 300, height: 192 },
                    item: { size: 65, margin: 0 }
                },
                iconId: 'bili-emote-icon',
                panelId: 'bili-emote-panel',
                tabId: '标签图标',
                checkInterval: 10000

            };

            // [!code ++] 新增：预处理关键词为Set，提高查找效率
            this.keywordSet = new Set(
                this.config.keywords.map(k => k.toLowerCase())
            );

            // [!code ++] 新增：添加分数缓存
            this.scoreCache = new Map();

            // 从localStorage读取已保存的数据
            this.loadSavedData();

            // 延迟初始化，避免阻塞页面加载
            this.deferredInit();

        }

        // 防抖方法
        debounce(func, wait) {
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

        // 统一的定时器管理
        clearTimer(timerName) {
            if (this[timerName]) {
                if (timerName.includes('Interval')) {
                    clearInterval(this[timerName]);
                } else {
                    clearTimeout(this[timerName]);
                }
                this.timers.delete(this[timerName]);
                this[timerName] = null;
            }
        }

        // 统一的定时器管理
        clearTimer(timerName) {
            if (this[timerName]) {
                if (timerName.includes('Interval')) {
                    clearInterval(this[timerName]);
                } else {
                    clearTimeout(this[timerName]);
                }
                this.timers.delete(this[timerName]);
                this[timerName] = null;
            }
        }

        // 批量清理定时器
        clearAllTimers() {
            const timerNames = ['saveTimeout', 'closeEmotionPanelTimer', 'checkInterval', 'initTimeout', 'mouseEnterDebounceTimer'];
            timerNames.forEach(name => this.clearTimer(name));
        }

        // 统一的状态重置方法
        resetPanelState() {
            this.isClosingPanel = false;
            this.panelOpenLock = false;
            this.isHoveringPanel = false;
            this.isHoveringIcon = false;
        }

        // 统一的事件监听器清理
        removeEventListeners(element, events) {
            if (!element) return;
            Object.entries(events).forEach(([eventName, handler]) => {
                if (handler) {
                    element.removeEventListener(eventName, handler);
                }
            });
        }

        // 创建定时器的统一方法
        createTimer(name, callback, delay, isInterval = false) {
            this.clearTimer(name);

            if (isInterval) {
                this[name] = setInterval(callback, delay);
            } else {
                this[name] = setTimeout(callback, delay);
            }

            this.timers.add(this[name]);
            return this[name];
        }

        // 统一的事件监听器管理方法
        setupEventListeners(element, eventConfig, namespace = 'default') {
            if (!element) {
                this.log(`无法为 ${namespace} 设置事件监听器：元素不存在`);
                return;
            }

            // 清理该命名空间下的旧事件
            this.removeEventListeners(namespace);

            const handlers = {};

            Object.entries(eventConfig).forEach(([eventName, handler]) => {
                const wrappedHandler = (event) => {
                    try {
                        handler.call(this, event);
                    } catch (error) {
                        this.log(`事件处理器 ${namespace}.${eventName} 执行出错:`, error);
                    }
                };

                element.addEventListener(eventName, wrappedHandler);
                handlers[eventName] = {
                    element,
                    handler: wrappedHandler,
                    originalHandler: handler
                };
            });

            // 保存到事件处理器映射中
            this.eventHandlers.set(namespace, handlers);
            this.log(`已为 ${namespace} 设置 ${Object.keys(eventConfig).length} 个事件监听器`);
        }

        // 移除指定命名空间的事件监听器
        removeEventListeners(namespace) {
            const handlers = this.eventHandlers.get(namespace);
            if (!handlers) return;

            Object.entries(handlers).forEach(([eventName, config]) => {
                config.element.removeEventListener(eventName, config.handler);
            });

            this.eventHandlers.delete(namespace);
            this.log(`已移除 ${namespace} 的事件监听器`);
        }

        // 移除所有事件监听器
        removeAllEventListeners() {
            for (const namespace of this.eventHandlers.keys()) {
                this.removeEventListeners(namespace);
            }
        }


        // 新增方法
        getFirstEmotionIcon() {
            return this.emotionData.length > 0 ?
                this.emotionData[0].url :
            "https://i0.hdslb.com/bfs/live/b51824125d09923a4ca064f0c0b49fc97d3fab79.png";
        }

        // 延迟初始化
        deferredInit() {
            // 使用 requestIdleCallback 在浏览器空闲时初始化
            if (window.requestIdleCallback) {
                window.requestIdleCallback(() => this.init(), { timeout: 2000 });
            } else {
                // 降级处理：使用 setTimeout
                setTimeout(() => this.init(), 100);
            }
        }

        // 打印调试信息
        log(message, ...args) {
            if (this.debug) {
                console.log(`[BiliEmote] ${message}`, ...args);
            }
        }

        // 加载已保存的数据
        loadSavedData() {
            try {
                this.detectRoomId();
                const savedData = localStorage.getItem(this.getRoomStorageKey());

                if (savedData) {
                    const parsedData = JSON.parse(savedData);

                    // 兼容旧格式（之前只存了数组）
                    if (Array.isArray(parsedData)) {
                        this.emotionData = parsedData.map(item => ({
                            ...item,
                            element: null,
                            timestamp: item.timestamp || Date.now()
                        }));
                        this.log(`从旧格式加载了 ${this.emotionData.length} 条数据`);
                    }
                    // 新格式（包含多个字段的对象）
                    else {
                        // 加载表情数据
                        this.emotionData = (parsedData.emotions || []).map(item => ({
                            ...item,
                            element: null,
                            timestamp: item.timestamp || Date.now()
                        }));

                        // 加载手动收藏列表
                        this.config.manualCollections = parsedData.manualCollections || [];

                        this.log(`从存储加载了 ${this.emotionData.length} 条表情和 ${this.config.manualCollections.length} 个收藏`);
                    }
                }
            } catch (error) {
                this.log('加载本地数据出错', error);
                this.emotionData = [];
                this.config.manualCollections = [];
            }
        }

        // 获取当前房间的存储键名
        getRoomStorageKey() {
            return `${this.storageKey}-${this.currentRoomId || 'global'}`;
        }

        // 检测当前直播间ID
        detectRoomId() {
            try {
                const url = window.location.href;
                const match = url.match(/live\.bilibili\.com\/(?:.*?\/)?(\d+)/);
                const newRoomId = match ? match[1] : 'unknown';

                if (this.currentRoomId !== newRoomId) {
                    this.log(`直播间ID变化: ${this.currentRoomId} -> ${newRoomId}`);
                    this.currentRoomId = newRoomId;
                    this.emotionData = [];
                }

                return this.currentRoomId;
            } catch (error) {
                this.log('检测房间ID出错', error);
                return 'unknown';
            }
        }

        // 保存数据到localStorage
        saveData() {
            try {
                this.detectRoomId();
                this.clearTimer('saveTimeout');

                this.saveTimeout = setTimeout(() => {
                    // 构建要保存的数据对象
                    const storageData = {
                        // 保存表情数据
                        emotions: this.emotionData.map(item => ({
                            title: item.title,
                            normalizedUrl: item.normalizedUrl,
                            url: item.url,
                            timestamp: item.timestamp,
                            userRank: item.userRank || 0
                        })),
                        // 保存手动收藏列表
                        manualCollections: this.config.manualCollections
                    };

                    localStorage.setItem(this.getRoomStorageKey(), JSON.stringify(storageData));
                    this.log(`已保存 ${storageData.emotions.length} 个表情和 ${storageData.manualCollections.length} 个收藏到本地存储`);
                }, 500);
            } catch (error) {
                this.log('保存数据出错', error);
            }
        }


        // 修改setupGlobalTabListener方法
        setupGlobalTabListener() {
            const globalEvents = {
                'click': (e) => {
                    if (!this.collectionPanel) return;

                    const clickedTab = e.target.closest([
                        ...this.config.selectors.tabPaneItem,
                        `#${this.config.tabId}`
                    ].join(','));

                    if (clickedTab?.id !== this.config.tabId) {
                        this.collectionPanel.style.display = 'none';
                    }
                }
            };

            // 使用防抖处理
            const debouncedEvents = {
                'click': this.debounce(globalEvents.click, 150)
            };

            this.setupEventListeners(document, debouncedEvents, 'globalTab');
        }



        // 初始化插件
        init() {
            this.log("插件初始化开始");

            // 检查是否已初始化
            if (this.isInitialized) {
                this.log("插件已初始化，跳过");
                return;
            }

            // 检查页面是否准备好
            if (document.readyState !== 'complete' && document.readyState !== 'interactive') {
                this.log("页面未加载完成，延迟初始化");
                if (this.initializationAttempts < this.maxInitAttempts) {
                    this.initializationAttempts++;
                    setTimeout(() => this.init(), 500);
                }
                return;
            }

            // 设置DOM观察器
            this.setupObserver();

            // 立即尝试初始设置
            this.setupPlugin();

            this.checkInterval = setInterval(() => {
                const previousRoomId = this.currentRoomId;
                this.detectRoomId();

                if (previousRoomId !== this.currentRoomId) {
                    this.loadSavedData();
                    this.updatePanelContent();
                }
                this.setupPlugin();
            }, this.config.checkInterval);

            // 预缓存表情数据 - 延迟执行避免影响页面加载
            setTimeout(() => {
                this.preloadEmotionData();
            }, 5000);

            this.setupGlobalTabListener();

            this.isInitialized = true;

            // 启用收藏功能
            this.addCollectionFeatureToOriginalPanel();
            this.log("插件初始化完成");

        }

        // 预加载表情数据
        preloadEmotionData() {
            this.log("尝试预加载表情数据");

            // 检查表情面板是否已打开
            const panelOpen = this.checkEmoticonPanelOpen();
            if (!panelOpen) {
                // 找到表情按钮
                const emoticonsButton = this.getFirstMatchingElement(this.config.selectors.emoticonsPanel);
                if (emoticonsButton) {
                    // 暂存现有激活元素，以便恢复焦点
                    const activeElement = document.activeElement;

                    // 临时打开面板
                    emoticonsButton.click();

                    // 收集数据
                    setTimeout(() => {
                        this.collectEmotionData();

                        // 关闭面板
                        emoticonsButton.click();

                        // 恢复焦点
                        if (activeElement && document.contains(activeElement)) {
                            activeElement.focus();
                        }

                        this.log("预加载表情数据完成");
                    }, 300);
                }
            } else {
                // 面板已打开，直接收集
                this.collectEmotionData();
                this.log("面板已打开，直接预加载数据");
            }
        }

        // 设置DOM观察器
        setupObserver() {
            this.log("设置DOM观察器");
            // 如果已存在观察器，先断开连接
            if (this.observer) {
                this.observer.disconnect();
                this.observer = null;
            }

            // 节流状态变量
            let pendingMutations = [];
            let isScheduled = false; // 替代 isThrottled
            const throttleDelay = 200; // 节流时间

            this.observer = new MutationObserver((mutations) => {
                // 累积所有 mutations
                pendingMutations.push(...mutations);

                // 如果尚未安排处理，则调度处理
                if (!isScheduled) {
                    isScheduled = true;

                    setTimeout(() => {
                        // 检查累积的 mutations 是否包含相关变化
                        const relevantChange = pendingMutations.some(mutation => {
                            if (mutation.addedNodes.length > 0) {
                                return Array.from(mutation.addedNodes).some(node => {
                                    if (node.nodeType !== Node.ELEMENT_NODE) return false;
                                    return (
                                        this.getFirstMatchingElement(this.config.selectors.emoticonsPanel, node) !== null ||
                                        this.getFirstMatchingElement(this.config.selectors.contentContainer, node) !== null
                                    );
                                });
                            }
                            return false;
                        });

                        if (relevantChange) {
                            this.log("检测到相关DOM变化，重新设置插件");
                            this.setupPlugin();
                        }

                        // 检查URL变化
                        this.detectRoomId();

                        // 重置状态
                        pendingMutations = [];
                        isScheduled = false;
                    }, throttleDelay);
                }
            });

            // 优化观察范围
            const targetNode = document.querySelector('.live-room-app') || document.body;
            this.observer.observe(targetNode, { childList: true, subtree: true });

            // 🔥 替换原来的URL监听器代码为统一的事件管理
            this.setupUrlChangeListener();
        }

        // 🔥 新增这个方法
        setupUrlChangeListener() {
            // 移除旧的URL变化监听器
            this.removeEventListeners('urlChange');

            const urlEvents = {
                'popstate': () => {
                    this.log("检测到URL变化");
                    this.detectRoomId();
                    this.loadSavedData();
                }
            };

            this.setupEventListeners(window, urlEvents, 'urlChange');
        }

        queryElements(selectorList, rootElement = document, single = false) {
            const results = single ? null : [];
            for (const selector of selectorList) {
                try {
                    if (!selector || typeof selector !== 'string') continue;
                    const elements = rootElement[single ? 'querySelector' : 'querySelectorAll'](selector);
                    if (single && elements) return elements;
                    if (!single && elements?.length) results.push(...elements);
                } catch (error) {
                    this.log(`选择器错误: ${selector}`, error);
                }
            }
            return single ? null : results;
        }

        // 使用方式
        getFirstMatchingElement(selectorList, root) { return this.queryElements(selectorList, root, true); }
        getAllMatchingElements(selectorList, root) { return this.queryElements(selectorList, root, false); }



        // 主要插件设置函数
        setupPlugin() {
            // 确保房间ID是最新的
            this.detectRoomId();

            // 插入底栏图标
            this.insertBottomBarIcon();

            // 检查表情面板是否打开
            const isEmoticonPanelOpen = this.checkEmoticonPanelOpen();

            // 即使面板未打开也尝试初始化，提前准备好
            this.setupEmotionPanel();

            // 确保为其他标签也绑定事件
            if (this.isInitialized) {
                this.bindOtherTabsEvents();
            }
        }


        // 在面板状态检测中添加更精确的判断
        checkEmoticonPanelOpen() {
            // 同时检查原始面板和内容容器
            const panel = this.getFirstMatchingElement(this.config.selectors.originalPanel);
            const contentContainer = this.getFirstMatchingElement(this.config.selectors.contentContainer);

            // 确保两个元素都存在
            if (!panel || !contentContainer) return false;

            // 获取样式计算结果
            const panelStyle = window.getComputedStyle(panel);
            const containerStyle = window.getComputedStyle(contentContainer);

            // 双重验证显示状态
            return panelStyle.display !== 'none' &&
                containerStyle.display !== 'none' &&
                containerStyle.visibility !== 'hidden';
        }

        // 修改 insertBottomBarIcon 方法
        insertBottomBarIcon() {
            // 检查图标是否已存在
            const existingIcon = document.getElementById(this.config.iconId);
            if (existingIcon) return;

            // 查找目标容器
            const targetContainer = this.getFirstMatchingElement(this.config.selectors.iconRightPart);
            if (!targetContainer) {
                this.log("未找到底栏容器");
                return;
            }

            this.log("创建底栏图标");

            // 创建图标元素
            const iconElement = document.createElement('div');
            iconElement.id = this.config.iconId;
            iconElement.style.cssText = `
    display: inline-block;
    margin-right: 8px;
    cursor: pointer;
    vertical-align: middle;
  `;

            // 创建图标图片
            const iconImage = document.createElement('img');
            iconImage.src = this.getFirstEmotionIcon();
            iconImage.alt = "打call";
            iconImage.title = "打call";
            iconImage.style.cssText = `
    width: 24px;
    height: 24px;
    vertical-align: middle;
  `;

            // 添加鼠标进入事件
            iconElement.addEventListener('mouseenter', (e) => {

                // 记录当前鼠标位置
                this.lastMouseY = e.clientY;

                // 清除之前的定时器
                if (this.mouseEnterDebounceTimer) {
                    clearTimeout(this.mouseEnterDebounceTimer);
                }

                // 清除离开时设置的定时器
                if (this.leaveTimer) {
                    clearTimeout(this.leaveTimer);
                    this.leaveTimer = null;
                }

                // 从底部进入时使用更长的延迟
                const isFromBottom = e.clientY > (iconElement.getBoundingClientRect().bottom - 5);
                const debounceTime = isFromBottom ? 300 : 100;

                // 设置防抖动定时器
                this.mouseEnterDebounceTimer = setTimeout(() => {
                    this.isHoveringIcon = true;
                    this.log("鼠标进入底栏图标");

                    // 如果面板未打开且不在关闭过程中，则打开面板
                    if (!this.checkEmoticonPanelOpen() && !this.isClosingPanel) {
                        this.openEmotionPanel();
                    } else {
                        // 如果面板已打开，则取消关闭计时器
                        if (this.closeEmotionPanelTimer) {
                            clearTimeout(this.closeEmotionPanelTimer);
                            this.closeEmotionPanelTimer = null;
                        }
                    }
                }, debounceTime);
            });

            // 添加鼠标离开事件
            iconElement.addEventListener('mouseleave', (e) => {
                this.isHoveringIcon = false;

                // 强制检查面板是否被悬停（通过位置判断）
                const panelRect = this.collectionPanel?.getBoundingClientRect();
                let isMouseOverPanel = false;

                if (panelRect) {
                    isMouseOverPanel = (
                        e.clientX >= panelRect.left &&
                        e.clientX <= panelRect.right &&
                        e.clientY >= panelRect.top &&
                        e.clientY <= panelRect.bottom
                    );
                    this.isHoveringPanel = isMouseOverPanel;
                }

                // 清除之前可能存在的离开定时器
                if (this.leaveTimer) {
                    clearTimeout(this.leaveTimer);
                }

                // 只有在离开底栏图标时面板依旧被悬停才设置计时器
                if (!isMouseOverPanel) {
                    // 设置200ms的计时器
                    this.leaveTimer = setTimeout(() => {
                        // 如果鼠标没有重新进入图标或进入面板，则点击表情按钮
                        if (!this.isHoveringIcon && !this.isHoveringPanel) {
                            this.log("离开200ms后点击底栏图标左侧10px处");

                            // 获取底栏图标的位置
                            const iconRect = iconElement.getBoundingClientRect();
                            // 计算左侧10px处的坐标
                            const clickX = iconRect.left - 10;
                            const clickY = iconRect.top + (iconRect.height / 2);

                            // 获取该坐标处的元素
                            const elementAtPoint = document.elementFromPoint(clickX, clickY);

                            if (elementAtPoint) {
                                // 创建并触发点击事件
                                const clickEvent = new MouseEvent('click', {
                                    view: window,
                                    bubbles: true,
                                    cancelable: true,
                                    clientX: clickX,
                                    clientY: clickY
                                });
                                elementAtPoint.dispatchEvent(clickEvent);
                            } else {
                                this.log("无法在指定位置找到元素");
                            }
                        }
                    }, 200);
                }

                this.scheduleCloseEmotionPanel();
            });

            // 修改底栏图标点击事件
            iconElement.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopImmediatePropagation();
                this.log("底栏图标被点击 - 尝试发送第一个表情包");

                // 确保面板已打开，这是关键修改
                if (!this.checkEmoticonPanelOpen()) {
                    await this.openEmotionPanel();
                }

                // 强制重新收集数据
                await this.collectEmotionData();

                // 查找第一个表情包
                if (this.emotionData && this.emotionData.length > 0) {
                    // 获取排名第一的表情，或者默认第一个
                    const sortedEmotions = [...this.emotionData].sort((a, b) => (b.userRank || 0) - (a.userRank || 0));
                    const firstEmotion = sortedEmotions[0];
                    this.log("发送第一个表情包", firstEmotion.title || "未命名表情");

                    // 尝试在原始面板中查找并点击对应表情
                    const success = this.findAndClickByUrl(firstEmotion.url, firstEmotion.title);
                    if (!success) {
                        this.log("无法找到匹配的表情元素进行点击", firstEmotion.url);
                    }

                    // 增加使用次数统计
                    firstEmotion.userRank = (firstEmotion.userRank || 0) + 1;
                    this.saveData();

                    // 关闭面板前重置状态
                    this.isClosingPanel = false;
                    this.panelOpenLock = false;

                    // 关闭面板
                    if (this.checkEmoticonPanelOpen()) {
                        this.closeEmotionPanel();
                    }
                } else {
                    this.log("没有可用的表情包");
                }
            });

            // 添加图片到图标
            iconElement.appendChild(iconImage);

            // 插入到页面
            targetContainer.insertBefore(iconElement, targetContainer.firstChild);
            this.log("底栏图标已插入");
        }

        // 修改安排关闭面板的方法
        scheduleCloseEmotionPanel() {
            this.clearTimer('closeEmotionPanelTimer');

            this.closeEmotionPanelTimer = setTimeout(() => {
                const panelVisible = this.checkEmoticonPanelOpen();

                if (!panelVisible) {
                    this.closeEmotionPanel();
                    return;
                }

                if (!this.isHoveringIcon && !this.isHoveringPanel) {
                    this.closeEmotionPanel();
                }
            }, 300);

            this.timers.add(this.closeEmotionPanelTimer);
        }


        // 修改打开方法增加状态锁检查
        async openEmotionPanel() {
            if (this.isClosingPanel || this.panelOpenLock) {
                this.log("阻止打开：正在关闭或已锁定");
                return;
            }
            // 设置锁定状态
            this.panelOpenLock = true;
            // 查找并点击表情按钮
            const emoticonsButton = this.getFirstMatchingElement(this.config.selectors.emoticonsPanel);
            if (emoticonsButton) {
                this.log("打开表情面板");
                emoticonsButton.click();

                // 等待表情面板打开和加载
                await this.waitForPanelLoad();

                // 设置和收集数据
                this.setupEmotionPanel();

                // 等待标签加载完成
                await this.waitForTabLoad();

                // 点击标签并等待内容加载
                const tabElement = document.getElementById(this.config.tabId);
                if (tabElement) {
                    this.log("点击打call标签");
                    tabElement.click();

                    // 等待内容加载完成
                    await this.waitForContentLoad();

                    // 面板已加载完成，绑定面板的鼠标事件
                    this.bindPanelHoverEvents();
                } else {
                    this.log("未找到打call标签");
                }
            } else {
                this.log("未找到表情按钮");
            }
        }

        // 修改关闭面板的方法
        closeEmotionPanel() {
            if (this.isClosingPanel) return;
            this.isClosingPanel = true;

            const emoticonsButton = this.getFirstMatchingElement(this.config.selectors.emoticonsPanel);
            if (emoticonsButton && this.checkEmoticonPanelOpen()) {
                this.log("关闭表情面板");
                emoticonsButton.click();
            }

            // 新增：重置悬停状态 // [!code ++]
            this.isHoveringPanel = false; // [!code ++]
            this.isHoveringIcon = false;  // [!code ++]

            setTimeout(() => {
                this.isClosingPanel = false;
                this.panelOpenLock = false;
            }, 200);
        }


        // 在bindPanelHoverEvents中确保正确移除旧事件监听器
        bindPanelHoverEvents() {
            const contentContainer = this.getFirstMatchingElement(this.config.selectors.contentContainer);
            if (!contentContainer) {
                this.log("未找到表情面板容器，无法绑定鼠标事件");
                return;
            }

            // 使用统一的事件管理器
            const panelEvents = {
                'mouseenter': () => {
                    this.isHoveringPanel = true;
                    this.log("鼠标进入面板");
                    // 清除所有关闭计时器
                    this.clearTimer('closeEmotionPanelTimer');
                },
                'mouseleave': () => {
                    this.isHoveringPanel = false;
                    this.log("鼠标离开面板");
                    // 立即触发关闭检查
                    this.scheduleCloseEmotionPanel();
                }
            };

            this.setupEventListeners(contentContainer, panelEvents, 'panelHover');
        }


        // 修改 waitForPanelLoad 方法，在面板加载完成后绑定鼠标事件
        async waitForPanelLoad() {
            return new Promise((resolve) => {
                const checkPanel = () => {
                    const contentContainer = this.getFirstMatchingElement(this.config.selectors.contentContainer);
                    if (contentContainer && window.getComputedStyle(contentContainer).display !== 'none') {
                        // 面板已加载，绑定鼠标事件
                        this.bindPanelHoverEvents();
                        resolve();
                    } else {
                        setTimeout(checkPanel, 100);
                    }
                };
                checkPanel();
            });
        }
        async waitForTabLoad() {
            return new Promise((resolve) => {
                const checkTab = () => {
                    const tabElement = document.getElementById(this.config.tabId);
                    if (tabElement) {
                        resolve();
                    } else {
                        setTimeout(checkTab, 100);
                    }
                };
                checkTab();
            });
        }

        async waitForContentLoad() {
            return new Promise((resolve) => {
                const checkContent = () => {
                    if (this.collectionPanel && this.emotionData.length > 0) {
                        resolve();
                    } else {
                        setTimeout(checkContent, 100);
                    }
                };
                checkContent();
            });
        }

        // 修改 setupEmotionPanel 方法
        setupEmotionPanel() {
            this.log("设置表情面板");

            // 设置加载状态
            if (this.collectionPanel) {
                this.collectionPanel.setAttribute('data-loading', 'true');
            }

            // 查找必要的容器
            const tabContainer = this.getFirstMatchingElement(this.config.selectors.tabContainer);
            const contentContainer = this.getFirstMatchingElement(this.config.selectors.contentContainer);

            if (!tabContainer || !contentContainer) {
                this.log("未找到表情面板容器", {
                    tabContainer: !!tabContainer,
                    contentContainer: !!contentContainer
                });
                return;
            }

            // 检查是否已创建
            const existingTab = document.getElementById(this.config.tabId);
            const existingPanel = document.getElementById(this.config.panelId);

            if (existingTab && existingPanel) {
                this.log("表情面板已存在");

                // 收集表情数据
                this.collectEmotionData().then(() => {
                    // 移除加载状态
                    if (this.collectionPanel) {
                        this.collectionPanel.removeAttribute('data-loading');
                    }
                });
                return;
            }

            // 创建标签和面板
            this.createEmotionTab(tabContainer);
            this.createEmotionPanel(contentContainer);

            // 收集表情数据
            this.collectEmotionData().then(() => {
                // 移除加载状态
                if (this.collectionPanel) {
                    this.collectionPanel.removeAttribute('data-loading');
                }
            });

            // 绑定事件
            this.bindEvents();

            this.log("表情面板设置完成");
        }

        // 绑定事件处理
        bindEvents() {
            this.log("绑定面板事件");

            // 确保tab存在
            if (!this.collectionTab) {
                this.log("无法绑定事件：未找到tab元素");
                return;
            }

            // 绑定tab点击事件 - 显示我们的面板，隐藏其他面板
            this.collectionTab.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                this.log("打call标签被点击");

                // 获取所有可能的面板
                const allPanels = this.getAllMatchingElements(this.config.selectors.originalPanel);

                // 隐藏所有原始面板
                allPanels.forEach(panel => {
                    if (panel.id !== this.config.panelId) {
                        panel.style.display = 'none';
                    }
                });

                // 显示我们的自定义面板
                if (this.collectionPanel) {
                    this.collectionPanel.style.display = 'block';
                }

                // 清除所有原生标签的active类（包括可能被B站添加的）
                const allTabs = this.getAllMatchingElements(this.config.selectors.tabPaneItem);
                allTabs.forEach(tab => {
                    tab.classList.remove('active', 'selected'); // 兼容不同类名
                });

                // 强制设置当前标签为active
                this.collectionTab.classList.add('active');

                // 收集并更新表情数据
                this.collectEmotionData();
            });

            // 为其他标签添加点击事件监听
            this.bindOtherTabsEvents();
        }

        // 为其他标签绑定点击事件
        bindOtherTabsEvents() {
            const allTabs = this.getAllMatchingElements(this.config.selectors.tabPaneItem);

            allTabs.forEach((tab, index) => {
                // 跳过我们自己的标签
                if (tab.id === this.config.tabId) return;

                const tabEvents = {
                    'click': (e) => {
                        // 不阻止事件传播，让原生事件处理器也能执行
                        this.log(`点击了其他标签: ${tab.textContent || tab.id}`);

                        // 隐藏我们的面板
                        if (this.collectionPanel) {
                            this.collectionPanel.style.display = 'none';
                        }

                        // 移除我们标签的active状态
                        if (this.collectionTab) {
                            this.collectionTab.classList.remove('active');
                        }
                    }
                };

                // 为每个标签使用唯一的命名空间
                this.setupEventListeners(tab, tabEvents, `tab-${index}`);

                // 标记为已绑定
                tab.setAttribute('data-enhancer-bound', 'true');
            });
        }


        // 创建表情标签
        createEmotionTab(container) {
            this.log("创建打call标签");

            // 检查是否已存在
            if (document.getElementById(this.config.tabId)) return;

            // 创建标签元素
            const tabElement = document.createElement('div');
            tabElement.classList.remove('active');
            tabElement.id = this.config.tabId;
            tabElement.className = 'tab-pane-item';

            // 尝试添加相同的属性
            const existingTab = this.getFirstMatchingElement(this.config.selectors.tabPaneItem);
            if (existingTab) {
                // 复制数据属性
                const attributes = existingTab.attributes;
                for (let i = 0; i < attributes.length; i++) {
                    const attr = attributes[i];
                    if (attr.name.startsWith('data-')) {
                        tabElement.setAttribute(attr.name, attr.value);
                    }
                }

                // 复制类名，确保样式一致
                tabElement.className = existingTab.className;
            }

            // 创建图标
            const imgElement = document.createElement('img');
            imgElement.className = '标签图片';
            imgElement.src = this.config.collectionIcon;
            imgElement.style.width = this.config.dimensions.icon.width + 'px';
            imgElement.style.height = this.config.dimensions.icon.height + 'px';
            imgElement.alt = "打call";
            imgElement.title = "打call";

            // 复制图片的数据属性
            if (existingTab) {
                const existingImg = existingTab.querySelector('img');
                if (existingImg) {
                    const attributes = existingImg.attributes;
                    for (let i = 0; i < attributes.length; i++) {
                        const attr = attributes[i];
                        if (attr.name.startsWith('data-')) {
                            imgElement.setAttribute(attr.name, attr.value);
                        }
                    }
                }
            }

            // 添加图标到标签
            tabElement.appendChild(imgElement);

            // 插入到容器的第一个位置
            if (container.firstChild) {
                container.insertBefore(tabElement, container.firstChild);
            } else {
                container.appendChild(tabElement);
            }

            this.collectionTab = tabElement;
            this.log("打call标签已创建");
        }

        // 创建我们的面板时，确保它能够正确叠加在B站原始面板上
        createEmotionPanel(container) {
            this.log("创建打call面板");

            // 检查面板是否已存在
            const existingPanel = document.getElementById(this.config.panelId);
            if (existingPanel) {
                this.log("打call面板已存在，无需重新创建");
                this.collectionPanel = existingPanel;
                return;
            }

            // 创建面板元素
            const panelElement = document.createElement('div');
            panelElement.id = this.config.panelId;
            panelElement.className = 'img-pane custom-panel';

            // 添加关键样式使其覆盖其他面板
            panelElement.style.width = this.config.dimensions.panel.width + 'px';
            panelElement.style.height = this.config.dimensions.panel.height + 'px';
            panelElement.style.display = 'none'; // 初始不显示
            panelElement.style.backgroundColor = '#fff';
            panelElement.style.position = 'relative';
            panelElement.style.zIndex = '9999';
            panelElement.style.overflow = 'auto';

            // 确保面板显示在容器的最上层
            panelElement.style.top = '0';
            panelElement.style.left = '0';

            // 添加加载指示器
            const loadingIndicator = document.createElement('div');
            loadingIndicator.className = 'loading-indicator';
            loadingIndicator.textContent = '加载中...';
            loadingIndicator.style.position = 'absolute';
            loadingIndicator.style.top = '50%';
            loadingIndicator.style.left = '50%';
            loadingIndicator.style.transform = 'translate(-50%, -50%)';
            loadingIndicator.style.color = '#999';
            loadingIndicator.style.fontSize = '14px';

            panelElement.appendChild(loadingIndicator);

            // 添加到容器
            container.appendChild(this.collectionPanel = panelElement);

            this.collectionPanel = panelElement;
            this.log("打call面板已创建");
        }

        // 修改后的表情项克隆方法
        optimizedCloneEmotionItem(emotionItem) {
            // 使用缓存避免重复克隆
            if (this.cloneCache.has(emotionItem)) {
                return this.cloneCache.get(emotionItem);
            }

            // 完整深度克隆表情元素及其所有子元素和属性
            const clone = emotionItem.cloneNode(true);

            // 查找并优化图片元素
            const img = clone.querySelector('img');
            if (img) {
                img.loading = 'eager';
                img.decoding = 'async';

                // 保持原始宽高比例
                img.style.cssText = `
      width: ${this.config.dimensions.item.size}px;
      height: ${this.config.dimensions.item.size}px;
      object-fit: contain;
    `;
            }

            // 保留所有CSS类，确保未解锁状态能够正确显示
            const lockIndicator = clone.querySelector('.lock-indicator, .disabled, .unavailable');
            if (lockIndicator) {
                // 确保锁图标样式正确显示
                lockIndicator.style.display = 'block';
            }

            // 缓存克隆结果
            this.cloneCache.set(emotionItem, clone);
            return clone;
        }

        // 新增方法：更新所有相关图标
        updateCollectionIcon() {
            // 更新底栏图标
            const icon = document.getElementById(this.config.iconId);
            if (icon) {
                const img = icon.querySelector('img');
                if (img) {
                    img.src = this.getFirstEmotionIcon();
                    img.onerror = () => {
                        img.src = "https://i0.hdslb.com/bfs/live/b51824125d09923a4ca064f0c0b49fc97d3fab79.png";
                    };
                }
            }

            // 更新标签页图标
            const tabImg = document.getElementById(this.config.tabId)?.querySelector('img');
            if (tabImg) {
                tabImg.src = this.getFirstEmotionIcon();
            }
        }

        // 修改 collectEmotionData 方法，添加防抖功能
        async collectEmotionData() {
            // 防止短时间内重复收集
            if (this._isCollecting) {
                this.log("表情收集正在进行中，跳过此次收集");
                return;
            }

            // 设置收集状态
            this._isCollecting = true;
            this.log("开始收集表情数据");

            try {
                // 确保房间ID是最新的
                this.detectRoomId();

                // 获取所有表情元素
                const allEmotions = this.getAllMatchingElements(this.config.selectors.emotionItem);
                this.log(`找到 ${allEmotions.length} 个表情元素`);

                if (allEmotions.length === 0) {
                    this.log("未找到表情元素，可能需要先打开其他表情标签");
                    // 如果已有缓存数据，不清空，直接更新面板
                    if (this.emotionData.length > 0) {
                        this.updatePanelContent();
                    }
                    return;
                }

                // 保留现有的userRank信息
                const existingRanks = new Map();
                this.emotionData.forEach(item => {
                    existingRanks.set(item.normalizedUrl, {
                        userRank: item.userRank || 0,
                        timestamp: item.timestamp
                    });
                });

                // 收集新数据前清空现有的数据
                this.emotionData = [];
                const seenUrls = new Set(); // 用于去重

                // 使用 Promise.all 并行处理表情数据
                await Promise.all(allEmotions.map(async item => {
                    const imgElement = item.querySelector('img');
                    if (!imgElement || !imgElement.src) return;

                    const title = item.getAttribute('title') || '';
                    const url = imgElement.src;
                    const normalizedUrl = this.getNormalizedUrl(url);

                    // 去重检查
                    if (seenUrls.has(normalizedUrl)) return;
                    seenUrls.add(normalizedUrl);

                    // 检查是否匹配关键词（原有逻辑）
                    const matchesKeyword = this.keywordSet.has(title.toLowerCase()) ||
                          Array.from(this.keywordSet).some(keyword =>
                                                           title.toLowerCase().includes(keyword)
                                                          );

                    // 新增：检查是否在手动收藏列表中
                    const isManuallyCollected = this.config.manualCollections.some(collectedUrl => {
                        const normalizedCollectedUrl = this.getNormalizedUrl(collectedUrl);
                        return normalizedUrl === normalizedCollectedUrl;
                    });

                    // 排除检查
                    const isExcluded = this.config.excludeImages.some(excludeUrl => {
                        const normalizedExcludeUrl = this.getNormalizedUrl(excludeUrl);
                        return normalizedUrl === normalizedExcludeUrl ||
                            normalizedUrl.includes(normalizedExcludeUrl);
                    });

                    // 修改条件：关键词匹配 OR 手动收藏，且不在排除列表中
                    if ((matchesKeyword || isManuallyCollected) && !isExcluded) {
                        // 保留现有排名和时间戳
                        const existing = existingRanks.get(normalizedUrl) || {
                            userRank: 0,
                            timestamp: Date.now()
                        };

                        // 预加载图片以提高性能
                        await this.preloadImage(url);

                        this.emotionData.push({
                            element: item,
                            title: title,
                            url: url,
                            normalizedUrl: normalizedUrl,
                            userRank: existing.userRank,
                            timestamp: existing.timestamp,
                            isManuallyAdded: isManuallyCollected && !matchesKeyword // 标记手动添加
                        });
                    }
                }));

                // 应用稳定排序
                this.sortEmotionData();

                // 新增：更新图标 // [!code ++]
                if (this.emotionData.length > 0) {
                    this.config.collectionIcon = this.emotionData[0].url;
                    this.updateCollectionIcon(); // [!code ++]
                }

                this.log(`收集完成，共有 ${this.emotionData.length} 个表情`);

                // 保存到本地存储
                this.saveData();

                // 更新面板内容
                this.updatePanelContent();
            } catch (error) {
                this.log("收集表情数据出错", error);
            } finally {
                // 收集完成后重置标志
                setTimeout(() => {
                    this._isCollecting = false;
                    this.log("表情收集状态重置");
                }, 500); // 500ms防抖
            }
        }

        // 预加载图片
        preloadImage(url) {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => resolve();
                img.onerror = () => resolve(); // 即使加载失败也继续
                img.src = url;
            });
        }
        // 添加表情到手动收藏
        addToManualCollection(url, title) {
            const normalizedUrl = this.getNormalizedUrl(url);

            // 检查是否已经存在
            const alreadyExists = this.config.manualCollections.some(collectedUrl =>
                                                                     this.getNormalizedUrl(collectedUrl) === normalizedUrl
                                                                    );

            if (!alreadyExists) {
                this.config.manualCollections.push(url);
                this.saveData();
                this.log(`手动添加表情: ${title || '未命名表情'}`);

                // 重新收集数据以更新面板
                this.collectEmotionData();
                return true;
            } else {
                this.log(`表情已存在于收藏中: ${title || '未命名表情'}`);
                return false;
            }
        }

        // 从手动收藏中移除表情
        removeFromManualCollection(url) {
            const normalizedUrl = this.getNormalizedUrl(url);
            const originalLength = this.config.manualCollections.length;

            this.config.manualCollections = this.config.manualCollections.filter(collectedUrl =>
                                                                                 this.getNormalizedUrl(collectedUrl) !== normalizedUrl
                                                                                );

            if (this.config.manualCollections.length < originalLength) {
                this.saveData();
                this.log(`移除手动收藏表情: ${url}`);

                // 重新收集数据以更新面板
                this.collectEmotionData();
                return true;
            }
            return false;
        }

        // 修正后的 sortEmotionData 方法
        sortEmotionData() {
            // 计算每个表情的匹配分数和关键词索引
            this.emotionData.forEach(item => {
                item.emotionScore = this.getKeywordMatchScore(item.title);
                item.keywordIndex = this.getKeywordIndex(item.title); // 新增：计算关键词索引
            });

            // 应用排序
            this.emotionData.sort((a, b) => {
                // 第一条件：按 userRank 降序
                if (a.userRank !== b.userRank) {
                    return b.userRank - a.userRank;
                }
                // 第二条件：按关键词匹配度(emotionScore)降序
                if (a.emotionScore !== b.emotionScore) {
                    return b.emotionScore - a.emotionScore;
                }
                // 第三条件：按关键词顺序升序（索引小的排前面）
                if (a.keywordIndex !== b.keywordIndex) {
                    return a.keywordIndex - b.keywordIndex;
                }
                // 第四条件：如果关键词索引也相同，则按URL字母序作为最终稳定排序
                return a.normalizedUrl.localeCompare(b.normalizedUrl);
            });
        }
        // 获取表情标题匹配的关键词索引
        getKeywordIndex(title) {
            const lowerTitle = title.toLowerCase();

            // 遍历关键词数组，返回第一个匹配的关键词索引
            for (let i = 0; i < this.config.keywords.length; i++) {
                const keyword = this.config.keywords[i].toLowerCase();

                // 完全匹配优先
                if (lowerTitle === keyword) {
                    return i;
                }
                // 包含匹配
                if (lowerTitle.includes(keyword)) {
                    return i;
                }
                // 开头匹配
                if (lowerTitle.startsWith(keyword)) {
                    return i;
                }

            }

            // 如果没有匹配到任何关键词，返回一个较大的数值，排到后面
            return this.config.keywords.length;
        }


        // 计算标题与关键词的匹配分数
        getKeywordMatchScore(title) {
            let score = 0;
            const lowerTitle = title.toLowerCase(); // 只计算一次

            // 使用缓存避免重复计算
            if (this.scoreCache.has(lowerTitle)) {
                return this.scoreCache.get(lowerTitle);
            }

            this.config.keywords.forEach(keyword => {
                const lowerKeyword = keyword.toLowerCase();
                if (lowerTitle.includes(lowerKeyword)) {
                    if (lowerTitle === lowerKeyword) {
                        score += 10;
                    } else if (lowerTitle.startsWith(lowerKeyword)) {
                        score += 5;
                    } else {
                        score += 2;
                    }
                }
            });

            // 缓存结果
            this.scoreCache.set(lowerTitle, score);
            return score;
        }

        // 更新面板内容
        updatePanelContent() {
            this.log("更新面板内容", this.emotionData.length);

            // 确保面板存在
            if (!this.collectionPanel) {
                this.log("无法更新面板：未找到面板元素");
                return;
            }

            // 清空现有内容
            this.collectionPanel.innerHTML = '';

            // 如果没有数据，显示提示信息
            if (this.emotionData.length === 0) {
                const noDataMsg = document.createElement('div');
                noDataMsg.textContent = '未找到匹配的表情，请点击其他表情标签收集';
                noDataMsg.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #999;
            font-size: 14px;
            text-align: center;
            width: 80%;
        `;
                this.collectionPanel.appendChild(noDataMsg);
                return;
            }

            // 创建容器
            const container = document.createElement('div');
            container.className = 'emotion-container';
            container.style.cssText = `
        display: grid;
        flex-wrap: wrap;
        padding: 8px;
        justify-content: flex-start;
    `;

            // 使用 DocumentFragment 提高性能
            const fragment = document.createDocumentFragment();

            // 添加表情项
            this.emotionData.forEach(item => {
                // 验证URL的有效性 - 如果URL不存在则跳过
                if (!item.url || !item.normalizedUrl) {
                    return;
                }

                // 使用条件判断选择元素创建方式
                if (item.element instanceof Element) {
                    // 如果有原始元素引用，使用专用方法克隆
                    const clonedItem = this.optimizedCloneEmotionItem(item.element);

                    // 修改表情点击事件处理
                    clonedItem.addEventListener('click', () => {
                        this.log("表情被点击", item.title);
                        item.userRank = (item.userRank || 0) + 1;
                        this.saveData();
                        const success = this.findAndClickByUrl(item.url, item.title);
                        if (!success) {
                            this.log("无法找到匹配的表情元素进行点击", item.url);
                        }
                    });

                    // 悬停效果
                    clonedItem.addEventListener('mouseover', () => {
                        clonedItem.style.backgroundColor = '#f5f5f5';
                    });

                    clonedItem.addEventListener('mouseout', () => {
                        clonedItem.style.backgroundColor = 'transparent';
                    });

                    // 添加右键菜单事件（修正位置）
                    clonedItem.addEventListener('click', (e) => {
                        // 检查是否按住了alt键
                        if (e.altKey && item.isManuallyAdded) {
                            e.preventDefault();
                            e.stopPropagation();
                            e.stopImmediatePropagation();

                            if (confirm(`是否要从收藏中移除 "${item.title || '未命名表情'}"？`)) {
                                this.removeFromManualCollection(item.url);
                                this.showRemoveSuccess(item.title);
                            }
                            return;
                        }

                        // 原有的点击逻辑
                        this.log("表情被点击", item.title);
                        item.userRank = (item.userRank || 0) + 1;
                        this.saveData();
                        const success = this.findAndClickByUrl(item.url, item.title);
                        if (!success) {
                            this.log("无法找到匹配的表情元素进行点击", item.url);
                        }
                    });

                    // 使用克隆后的元素
                    fragment.appendChild(clonedItem);
                } else {
                    // 如果没有原始元素引用，使用自定义创建方式
                    const itemElement = document.createElement('div');
                    itemElement.className = 'emotion-item';
                    itemElement.style.cssText = `
                width: ${this.config.dimensions.item.size}px;
                height: ${this.config.dimensions.item.size}px;
                margin: ${this.config.dimensions.item.margin}px;
                cursor: pointer;
                display: grid;
                align-items: center;
                justify-content: center;
                border-radius: 4px;
                transition: background-color 0.2s;
            `;

                    // 悬停效果
                    itemElement.addEventListener('mouseover', () => {
                        itemElement.style.backgroundColor = '#f5f5f5';
                    });

                    itemElement.addEventListener('mouseout', () => {
                        itemElement.style.backgroundColor = 'transparent';
                    });

                    // 创建图片
                    const imgElement = document.createElement('img');
                    imgElement.src = item.url;
                    imgElement.alt = item.title;
                    imgElement.title = item.title;
                    imgElement.style.cssText = `
                max-width: 80%;
                max-height: 80%;
                object-fit: contain;
            `;

                    // 添加图片加载错误处理
                    imgElement.onerror = () => {
                        this.emotionData = this.emotionData.filter(
                            emote => emote.normalizedUrl !== item.normalizedUrl
                        );

                        if (itemElement.parentNode) {
                            itemElement.parentNode.removeChild(itemElement);
                        }

                        if (this.emotionData.length === 0 && this.collectionPanel) {
                            this.updatePanelContent();
                        }

                        this.saveData();
                    };

                    // 添加图片到表情元素
                    itemElement.appendChild(imgElement);

                    // 添加点击事件处理
                    itemElement.addEventListener('click', () => {
                        this.log("表情被点击", item.title);
                        item.userRank = (item.userRank || 0) + 1;
                        this.saveData();
                        const success = this.findAndClickByUrl(item.url, item.title);
                        if (!success) {
                            this.log("无法找到匹配的表情元素进行点击", item.url);
                        }
                    });

                    // 为自定义创建的元素也添加右键菜单
                    itemElement.addEventListener('contextmenu', (e) => {
                        e.preventDefault();
                        if (item.isManuallyAdded) {
                            this.removeFromManualCollection(item.url);
                            this.showRemoveSuccess(item.title);
                        }
                    });


                    // 添加自定义创建的元素
                    fragment.appendChild(itemElement);
                }
            });

            // 将容器添加到面板
            container.appendChild(fragment);
            this.collectionPanel.appendChild(container);
        }

        // 为原始表情面板添加收藏功能 - 修改为alt+左键收藏/移除
        addCollectionFeatureToOriginalPanel() {
            // 使用mousedown事件在捕获阶段拦截
            document.addEventListener('mousedown', (e) => {
                // 只处理左键+alt的情况
                if (e.button !== 0 || !e.altKey) return;

                const emotionElement = e.target.closest('.emotion-item, .emoticon-item, [class*="emotion"], [class*="emoticon"]');
                if (emotionElement) {
                    const imgElement = emotionElement.querySelector('img');
                    if (imgElement && imgElement.src) {
                        // 立即阻止所有后续事件
                        e.preventDefault();
                        e.stopPropagation();
                        e.stopImmediatePropagation();

                        const title = emotionElement.getAttribute('title') ||
                              emotionElement.getAttribute('alt') ||
                              imgElement.getAttribute('alt') ||
                              imgElement.getAttribute('title') || '';
                        const url = imgElement.src;
                        const normalizedUrl = this.getNormalizedUrl(url);

                        // 检查是否已经收藏
                        const isAlreadyCollected = this.config.manualCollections.some(collectedUrl =>
                                                                                      this.getNormalizedUrl(collectedUrl) === normalizedUrl
                                                                                     );

                        if (isAlreadyCollected) {
                            // 如果已收藏，则移除
                            this.removeFromManualCollection(url);
                            this.showRemoveSuccess(title);
                        } else {
                            // 如果未收藏，则添加
                            this.addToManualCollection(url, title);
                            this.showCollectionSuccess(title);
                        }

                        // 阻止后续的click事件
                        this.blockNextClick = true;
                        setTimeout(() => {
                            this.blockNextClick = false;
                        }, 100);
                    }
                }
            }, true); // 使用捕获阶段

            // 额外添加click事件拦截器
            document.addEventListener('click', (e) => {
                if (this.blockNextClick || (e.altKey && this.isEmotionElement(e.target))) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                }
            }, true);

            // 同样处理mouseup事件
            document.addEventListener('mouseup', (e) => {
                if (this.blockNextClick || (e.altKey && this.isEmotionElement(e.target))) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                }
            }, true);
        }


        // 辅助方法：判断是否为表情元素
        isEmotionElement(target) {
            const emotionElement = target.closest('.emotion-item, .emoticon-item, [class*="emotion"], [class*="emoticon"]');
            return emotionElement && emotionElement.querySelector('img');
        }

        // 显示收藏成功提示（保持不变）
        showCollectionSuccess(title) {
            // 移除已存在的提示
            const existingToast = document.getElementById('emotion-collection-toast');
            if (existingToast) {
                existingToast.remove();
            }

            const toast = document.createElement('div');
            toast.id = 'emotion-collection-toast';
            toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 12px 20px;
        border-radius: 4px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        z-index: 10001;
        font-size: 14px;
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
    `;
            toast.textContent = `✓ 已收藏: ${title || '表情'}`;

            document.body.appendChild(toast);

            requestAnimationFrame(() => {
                toast.style.opacity = '1';
            });

            setTimeout(() => {
                toast.style.opacity = '0';
                setTimeout(() => {
                    if (toast.parentNode) {
                        toast.parentNode.removeChild(toast);
                    }
                }, 300);
            }, 3000);
        }
        // 新增移除成功提示
        showRemoveSuccess(title) {
            const toast = document.createElement('div');
            toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #f44336;
        color: white;
        padding: 12px 20px;
        border-radius: 4px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        z-index: 10001;
        font-size: 14px;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
            toast.textContent = `✗ 已移除: ${title || '表情'}`;

            document.body.appendChild(toast);

            requestAnimationFrame(() => {
                toast.style.opacity = '1';
            });

            setTimeout(() => {
                toast.style.opacity = '0';
                setTimeout(() => {
                    if (toast.parentNode) {
                        toast.parentNode.removeChild(toast);
                    }
                }, 300);
            }, 3000);
        }

        // 优化的查找元素方法
        findFreshElementByUrl(url) {
            const normalizedTargetUrl = this.getNormalizedUrl(url);
            this.log("查找URL匹配的最新元素", normalizedTargetUrl);

            // 获取所有可能的表情元素
            const allEmotions = this.getAllMatchingElements(this.config.selectors.emotionItem);

            // 使用Map存储结果以提高查找效率
            const urlToElementMap = new Map();

            // 遍历所有元素查找匹配的URL
            for (const item of allEmotions) {
                const imgElement = item.querySelector('img');
                if (!imgElement || !imgElement.src) continue;

                const itemUrl = imgElement.src;
                const normalizedItemUrl = this.getNormalizedUrl(itemUrl);

                // 存储到Map
                urlToElementMap.set(normalizedItemUrl, item);

                // 如果找到精确匹配，可以提前返回
                if (normalizedItemUrl === normalizedTargetUrl) {
                    this.log("找到URL精确匹配的最新元素");
                    return item;
                }
            }

            // 如果没有精确匹配，尝试部分匹配
            for (const [mappedUrl, element] of urlToElementMap.entries()) {
                if ((mappedUrl.includes(normalizedTargetUrl) && normalizedTargetUrl.length > 10) ||
                    (normalizedTargetUrl.includes(mappedUrl) && mappedUrl.length > 10)) {
                    this.log("找到URL部分匹配的元素");
                    return element;
                }
            }

            return null;
        }

        // 新增：尝试各种方法通过URL查找并点击表情
        findAndClickByUrl(url, title) {
            const normalizedTargetUrl = this.getNormalizedUrl(url);
            this.log("查找URL匹配的所有可能元素", normalizedTargetUrl);

            // 各种可能的选择器
            const selectors = [
                ...this.config.selectors.emotionItem,
                'img[src*="hdslb"]',
                '.emotion-item',
                '.emoticon-item',
                '.emoji-item',
                '.emoji'
            ];

            // 遍历选择器尝试查找元素
            for (const selector of selectors) {
                try {
                    const elements = document.querySelectorAll(selector);
                    this.log(`选择器 ${selector} 找到 ${elements.length} 个元素`);

                    // 找匹配的URL
                    for (const element of elements) {
                        // 获取元素URL
                        let elementUrl = '';

                        // 如果是图片元素
                        if (element.tagName === 'IMG') {
                            elementUrl = element.src;
                        }
                        // 如果是容器元素，查找子图片
                        else {
                            const img = element.querySelector('img');
                            if (img && img.src) {
                                elementUrl = img.src;
                            }
                        }

                        if (elementUrl) {
                            const normalizedElementUrl = this.getNormalizedUrl(elementUrl);

                            // 比较URL
                            if (normalizedElementUrl === normalizedTargetUrl ||
                                normalizedElementUrl.includes(normalizedTargetUrl) ||
                                normalizedTargetUrl.includes(normalizedElementUrl)) {
                                this.log("找到URL匹配的元素", element);

                                try {
                                    element.click();
                                    return true;
                                } catch (error) {
                                    this.log("点击URL匹配元素失败", error);
                                }
                            }
                        }
                    }
                } catch (error) {
                    this.log(`选择器 ${selector} 查询失败:`, error);
                    return false;
                }
            }

            // 如果URL查找失败，尝试通过标题查找
            if (title) {
                this.log("通过标题查找元素", title);

                for (const selector of selectors) {
                    try {
                        const elements = document.querySelectorAll(selector);

                        for (const element of elements) {
                            const elementTitle = element.getAttribute('title') ||
                                  element.getAttribute('alt') ||
                                  element.textContent.trim();
                            if (elementTitle && elementTitle === title) {
                                this.log("找到标题匹配的元素", element);

                                try {
                                    element.click();
                                    return true;
                                } catch (error) {
                                    this.log("点击标题匹配元素失败", error);
                                }
                            }
                        }
                    } catch (error) {
                        this.log(`选择器 ${selector} 查询失败:`, error);
                        return false;
                    }
                }
            }

            this.log("无法找到匹配的元素");
            return false;
        }

        // 优化的URL标准化函数
        getNormalizedUrl(url) {
            if (!url) return '';

            // 限制缓存大小
            const MAX_CACHE_SIZE = 1000;
            if (this.urlCache.size >= MAX_CACHE_SIZE) {
                // 清理最旧的一半缓存
                const entries = Array.from(this.urlCache.entries());
                const toDelete = entries.slice(0, Math.floor(MAX_CACHE_SIZE / 2));
                toDelete.forEach(([key]) => this.urlCache.delete(key));
            }

            if (this.urlCache.has(url)) {
                return this.urlCache.get(url);
            }

            // URL标准化逻辑
            const normalized = url.split(/[@?#]/)[0].replace(/^https?:\/\/(i[0-9]\.)?/, '');

            // 缓存结果
            this.urlCache.set(url, normalized);
            return normalized;
        }

        cleanup() {
            this.log("执行插件清理");

            try {
                // 1. 移除所有事件监听器（新增的统一管理）
                this.removeAllEventListeners();

                // 2. 清理所有定时器
                this.clearAllTimers();

                // 3. 重置所有状态
                this.resetPanelState();

                // 4. 清理DOM观察器
                if (this.observer) {
                    this.observer.disconnect();
                    this.observer = null;
                    this.log("DOM观察器已清理");
                }

                // 5. 清理遗留的事件监听器（兼容旧代码）
                this.cleanupLegacyEventListeners();

                // 6. 清理缓存
                this.cleanupCaches();

                // 7. 清理DOM元素引用
                this.cleanupDOMReferences();

                // 8. 重置数据状态
                this.resetDataState();

                this.log("插件清理完成");

            } catch (error) {
                this.log("清理过程中出现错误:", error);
            }
        }

    }


    // 初始化插件
    console.log("[BiliEmote] 初始化B站打call增强版插件");
    window.biliEmotionEnhancer = new BiliEmotionEnhancer();

    window.addEventListener('beforeunload', () => {
        if (window.biliEmotionEnhancer) window.biliEmotionEnhancer.cleanup();
    });

    window.__BILI_EMOTION_ENHANCER__ = {
        refresh: () => window.biliEmotionEnhancer?.collectEmotionData(),
        getConfig: () => window.biliEmotionEnhancer ? { ...window.biliEmotionEnhancer.config } : null,
        debug: (enable) => window.biliEmotionEnhancer && (window.biliEmotionEnhancer.debug = !!enable),
        clearRoomData: (roomId) => {
            if (window.biliEmotionEnhancer) {
                const key = roomId ? `bili-emotion-enhancer-data-${roomId}` : window.biliEmotionEnhancer.getRoomStorageKey();
                localStorage.removeItem(key);
                console.log(`[BiliEmote] 已清除房间 ${roomId || '当前房间'} 的数据`);
                if (!roomId || roomId === window.biliEmotionEnhancer.currentRoomId) {
                    window.biliEmotionEnhancer.emotionData = [];
                    window.biliEmotionEnhancer.updatePanelContent();
                }
            }
        }
    };
})();