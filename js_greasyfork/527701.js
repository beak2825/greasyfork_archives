// ==UserScript==
// @name         百度贴吧增强套件Pro
// @namespace    http://tampermonkey.net/
// @version      7.76
// @description  临时版本：某些情况下帖子会陷入无限加载，加入强制刷新网页的临时措施。
// @author       YourName
// @match        *://tieba.baidu.com/p/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @require      https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js
// @require      https://cdn.jsdelivr.net/npm/lz-string@1.4.4/libs/lz-string.min.js
// @connect      tieba.baidu.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527701/%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E5%A2%9E%E5%BC%BA%E5%A5%97%E4%BB%B6Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/527701/%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E5%A2%9E%E5%BC%BA%E5%A5%97%E4%BB%B6Pro.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 一、关键修复点说明：
    // 1. 增强AJAX拦截，覆盖XMLHttpRequest
    // 2. 改进MutationObserver监听动态内容
    // 3. 持久化屏蔽词配置到localStorage
    // 4. 监听翻页按钮点击触发过滤
    // 5. 使用标记优化过滤性能
    // 6. 修复控制面板拖动不跟手问题

    // 二、性能优化常量
    const DEBOUNCE_LEVEL = { QUICK: 100, COMPLEX: 500 };
    const LOG_LEVEL = GM_getValue('logLevel', 'verbose');
    const MAX_LOG_ENTRIES = 100;
    const DATA_VERSION = 2;
    const CACHE_TTL = 60000;

    // 三、网络优化预加载资源列表
    const preloadList = [
        '/static/emoji.png',
        '/static/theme-dark.css'
    ];

    // 四、增强的日志管理
    const logBuffer = { script: [], pageState: [], pageBehavior: [], userActions: [] };
    const originalConsole = {
        log: console.log.bind(console),
        warn: console.warn.bind(console),
        error: console.error.bind(console)
    };

    function logWrapper(category, level, ...args) {
        const debugMode = GM_getValue('debugMode', true);
        const levelMap = { ERROR: 1, WARN: 2, LOG: 3 };
        const currentLevel = levelMap[level.toUpperCase()];
        const minLevel = levelMap[LOG_LEVEL.toUpperCase()] || 3;

        if (!debugMode || (currentLevel && minLevel < currentLevel)) return;

        const timestamp = new Date().toISOString();
        const formattedArgs = args.map(arg => {
            if (typeof arg === 'object') {
                try { return JSON.stringify(arg); }
                catch { return String(arg); }
            }
            return String(arg);
        }).join(' ');

        const message = `[${timestamp}] [${level}] ${formattedArgs}`;
        logBuffer[category].push(message);
        if (logBuffer[category].length > MAX_LOG_ENTRIES) logBuffer[category].shift();
        originalConsole[level.toLowerCase()](message);
    }

    const customConsole = {
        log: (...args) => logWrapper('script', 'LOG', ...args),
        warn: (...args) => logWrapper('script', 'WARN', ...args),
        error: (...args) => logWrapper('script', 'ERROR', ...args)
    };

    // 五、通用工具类
    class DomUtils {
        static safeQuery(selector, parent = document) {
            try {
                return parent.querySelector(selector) || null;
            } catch (e) {
                customConsole.error(`无效选择器: ${selector}`, e);
                return null;
            }
        }

        static safeQueryAll(selector, parent = document) {
            try {
                return parent.querySelectorAll(selector);
            } catch (e) {
                customConsole.error(`无效选择器: ${selector}`, e);
                return [];
            }
        }
    }

    // 六、配置管理类
    class ConfigManager {
        static get defaultFilterSettings() {
            return {
                hideInvalid: true,
                hideSpam: true,
                spamKeywords: ["顶", "沙发", "签到"],
                whitelist: [],
                blockedElements: [],
                tempBlockedElements: [],
                autoExpandImages: true,
                blockType: 'perm',
                blockAds: true,
                enhanceImages: true,
                linkifyVideos: true,
                darkMode: false,
                showHiddenFloors: false
            };
        }

        static get defaultPanelSettings() {
            return {
                width: 320,
                minHeight: 100,
                maxHeight: '90vh',
                position: { x: 20, y: 20 },
                scale: 1.0,
                minimized: true
            };
        }

        static getFilterSettings() {
            const raw = GM_getValue('settings');
            const settings = raw ? decompressSettings(raw) : this.defaultFilterSettings;
            const savedKeywords = loadConfig();
            if (savedKeywords.length > 0) settings.spamKeywords = savedKeywords;
            return settings;
        }

        static getPanelSettings() {
            return GM_getValue('panelSettings', this.defaultPanelSettings);
        }

        static updateFilterSettings(newSettings) {
            // 验证并清理无效选择器
            const validateSelector = (selector) => {
                if (!selector || typeof selector !== 'string' || selector.trim() === '') {
                    return false;
                }
                try {
                    document.querySelector(selector);
                    return true;
                } catch (error) {
                    return false;
                }
            };
            
            // 清理永久屏蔽元素列表
            if (newSettings.blockedElements) {
                newSettings.blockedElements = newSettings.blockedElements.filter(validateSelector);
            }
            
            // 清理临时屏蔽元素列表
            if (newSettings.tempBlockedElements) {
                newSettings.tempBlockedElements = newSettings.tempBlockedElements.filter(validateSelector);
            }
            
            GM_setValue('settings', compressSettings({ ...this.defaultFilterSettings, ...newSettings }));
            saveConfig(newSettings.spamKeywords);
        }

        static updatePanelSettings(newSettings) {
            GM_setValue('panelSettings', { ...this.defaultPanelSettings, ...newSettings });
        }
    }

    // 七、本地存储压缩与迁移
    function compressSettings(settings) {
        return LZString.compressToUTF16(JSON.stringify(settings));
    }

    function decompressSettings(data) {
        try {
            return JSON.parse(LZString.decompressFromUTF16(data));
        } catch {
            return ConfigManager.defaultFilterSettings;
        }
    }

    function saveConfig(keywords) {
        localStorage.setItem('filterConfig', JSON.stringify(keywords));
        customConsole.log('保存屏蔽词配置到 localStorage:', keywords);
    }

    function loadConfig() {
        return JSON.parse(localStorage.getItem('filterConfig')) || [];
    }

    function migrateSettings() {
        const storedVer = GM_getValue('dataVersion', 1);
        if (storedVer < DATA_VERSION) {
            const old = GM_getValue('settings');
            if (storedVer === 1 && old) {
                const decompressed = decompressSettings(old);
                const newSettings = { ...ConfigManager.defaultFilterSettings, ...decompressed };
                GM_setValue('settings', compressSettings(newSettings));
            }
            GM_setValue('dataVersion', DATA_VERSION);
        }
    }

    // 八、错误边界
    class ErrorBoundary {
        static wrap(fn, context) {
            return function (...args) {
                try {
                    return fn.apply(context, args);
                } catch (e) {
                    customConsole.error(`Error in ${fn.name}:`, e);
                    context.showErrorToast?.(`${fn.name}出错`, e);
                    return null;
                }
            };
        }
    }

    // 九、事件管理
    const listenerMap = new WeakMap();
    function addSafeListener(element, type, listener) {
        const wrapped = e => { try { listener(e); } catch (err) { customConsole.error('Listener error:', err); } };
        element.addEventListener(type, wrapped);
        listenerMap.set(listener, wrapped);
    }

    function removeSafeListener(element, type, listener) {
        const wrapped = listenerMap.get(listener);
        if (wrapped) {
            element.removeEventListener(type, wrapped);
            listenerMap.delete(listener);
        }
    }

    // 十、性能监控类
    class PerformanceMonitor {
        static instance;
        constructor() {
            this.metrics = { memoryUsage: [], processSpeed: [], networkRequests: [] };
            this.maxMetrics = 100;
        }

        static getInstance() {
            if (!PerformanceMonitor.instance) PerformanceMonitor.instance = new PerformanceMonitor();
            return PerformanceMonitor.instance;
        }

        recordMemory() {
            if ('memory' in performance) {
                const used = performance.memory.usedJSHeapSize;
                this.metrics.memoryUsage.push(used);
                if (this.metrics.memoryUsage.length > this.maxMetrics) this.metrics.memoryUsage.shift();
                logWrapper('pageState', 'LOG', `Memory usage: ${Math.round(used / 1024 / 1024)} MB`);
            }
        }

        recordProcessSpeed(time) {
            this.metrics.processSpeed.push(time);
            if (this.metrics.processSpeed.length > this.maxMetrics) this.metrics.processSpeed.shift();
            logWrapper('pageState', 'LOG', `Process speed: ${time.toFixed(2)} ms`);
        }
    }

    // 十一、智能空闲任务调度
    const idleQueue = [];
    let idleCallback = null;

    function scheduleIdleTask(task) {
        idleQueue.push(task);
        if (!idleCallback) {
            idleCallback = requestIdleCallback(processIdleTasks, { timeout: 1000 });
        }
    }

    function processIdleTasks(deadline) {
        while (deadline.timeRemaining() > 0 && idleQueue.length) {
            idleQueue.shift()();
        }
        if (idleQueue.length) {
            idleCallback = requestIdleCallback(processIdleTasks, { timeout: 1000 });
        } else {
            idleCallback = null;
        }
    }

    // 十二、网络优化策略
    function prefetchResources() {
        preloadList.forEach(url => {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = url;
            document.head.appendChild(link);
        });
        customConsole.log('预加载资源完成:', preloadList);
    }

    const cacheStore = new Map();

    function smartFetch(url) {
        const cached = cacheStore.get(url);
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
            customConsole.log('从缓存读取:', url);
            return Promise.resolve(cached.data);
        }
        return fetch(url)
            .then(res => res.json())
            .then(data => {
                cacheStore.set(url, { data, timestamp: Date.now() });
                customConsole.log('缓存新数据:', url);
                return data;
            })
            .catch(err => {
                customConsole.error('请求失败:', url, err);
                throw err;
            });
    }

    // 十三、帖子过滤类
    class PostFilter {
        constructor() {
            this.settings = ConfigManager.getFilterSettings();
            this.postContainer = DomUtils.safeQuery('.l_post_list') || DomUtils.safeQuery('.pb_list') || document.body;
            this.postsCache = new Map();
            this.spamPosts = new Set();
            this.originalOrder = new Map();
            this.isPageLoaded = false;
            this.isLoading = false;
            
            this.firstFloorPid = null;
            this.firstFloorIdentified = false;
            this.protectedPids = new Set();
            
            this.applyStyles();
            this.saveOriginalOrder();
            this.applyFilters = ErrorBoundary.wrap(this.applyFilters, this);
            
            this.updateFirstFloorCache();
            
            if (document.readyState === 'complete') {
                this.isPageLoaded = true;
                this.applyFilters();
            } else {
                const loadHandler = () => {
                    this.isPageLoaded = true;
                    this.applyFilters();
                    window.removeEventListener('load', loadHandler);
                };
                window.addEventListener('load', loadHandler);
            }
            
            this.autoExpandImages();
            this.observeDOMChanges();
            this.handlePagination();
            this.startSpamEnforcer();
            this.blockAds();
            this.interceptAjax();
            if (this.settings.linkifyVideos) this.linkifyVideos();
            this.cleanupMemory();
            
            setTimeout(() => {
                this.runFilterTests();
            }, 1000);
            
            customConsole.log('PostFilter 初始化完成');
        }

        applyStyles() {
            GM_addStyle(`
                .l_post {
                    transition: opacity 0.3s ease;
                    overflow: hidden;
                }
                .spam-hidden {
                    display: none !important;
                    opacity: 0;
                }
                .invalid-hidden { display: none !important; }
                .pb_list.filtering, .l_post_list.filtering {
                    position: relative;
                    opacity: 0.8;
                }
                .pb_list.filtering::after, .l_post_list.filtering::after {
                    content: "过滤中...";
                    position: absolute;
                    top: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    color: #666;
                }
            `);
        }

        saveOriginalOrder() {
            if (this.originalOrder.size > 0) {
                customConsole.log('跳过保存帖子原始顺序，已保存过');
                return;
            }
            const posts = DomUtils.safeQueryAll('.l_post', this.postContainer);
            customConsole.log('保存帖子原始顺序，检测到帖子数量:', posts.length);
            posts.forEach(post => {
                const data = this.safeGetPostData(post);
                if (!this.originalOrder.has(data.pid)) {
                    this.originalOrder.set(data.pid, { pid: data.pid, floor: data.floor });
                }
            });
            customConsole.log('保存帖子原始顺序完成，数量:', this.originalOrder.size);
            logWrapper('pageBehavior', 'LOG', `Saved original order, posts: ${this.originalOrder.size}`);
        }

        updateFirstFloorCache() {
            if (this.firstFloorIdentified) return;
            
            const allPosts = DomUtils.safeQueryAll('.l_post', this.postContainer);
            if (allPosts.length === 0) return;
            
            for (const post of allPosts) {
                const floor = parseInt(post?.dataset?.floor || post?.getAttribute?.('data-floor')) || 0;
                if (floor === 1) {
                    const pid = post?.dataset?.pid || post?.getAttribute?.('data-pid') || `temp_${Date.now()}`;
                    this.firstFloorPid = pid;
                    this.firstFloorIdentified = true;
                    this.protectedPids.add(pid);
                    customConsole.log('通过 data-floor 属性识别一楼帖子:', pid);
                    return;
                }
            }
            
            const firstPost = allPosts[0];
            const pid = firstPost?.dataset?.pid || firstPost?.getAttribute?.('data-pid') || `temp_${Date.now()}`;
            this.firstFloorPid = pid;
            this.firstFloorIdentified = true;
            this.protectedPids.add(pid);
            customConsole.log('通过DOM位置识别一楼帖子:', pid);
        }

        applyFilters(nodes = DomUtils.safeQueryAll('.l_post:not(.filtered)', this.postContainer)) {
            this.updateFirstFloorCache();
            
            logWrapper('script', 'LOG', 'Starting filter process', `Keywords: ${this.settings.spamKeywords}`);
            customConsole.log('开始应用过滤器，帖子数量:', nodes.length);

            const startTime = performance.now();
            this.postContainer.classList.add('filtering');
            let hiddenCount = 0;

            const keywords = this.settings.spamKeywords
                .map(k => k.trim())
                .filter(k => k.length > 0);
            const regex = keywords.length > 0
                ? new RegExp(`(${keywords.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'i')
                : null;

            nodes.forEach(post => {
                const data = this.safeGetPostData(post);
                const pid = data.pid;

                if (!post || post.classList.contains('filtered')) return;

                post.style.display = '';
                post.classList.remove('spam-hidden', 'invalid-hidden');

                if (data.isFirstFloor || pid === this.firstFloorPid) {
                    post.classList.add('filtered');
                    this.postsCache.set(pid, true);
                    this.spamPosts.delete(pid);
                    this.protectedPids.add(pid);
                    return;
                }

                if (this.settings.hideInvalid && !data.content) {
                    post.classList.add('invalid-hidden');
                    hiddenCount++;
                    logWrapper('pageBehavior', 'LOG', `Hid invalid post: ${pid}`);
                    if (this.settings.showHiddenFloors) {
                        post.classList.remove('invalid-hidden');
                        hiddenCount--;
                        logWrapper('pageBehavior', 'LOG', `Restored invalid post: ${pid}`);
                    }
                } else if (this.settings.hideSpam && data.content && regex && regex.test(data.content)) {
                    if (this.protectedPids.has(pid)) {
                        logWrapper('pageBehavior', 'WARN', `Skipped filtering protected post: ${pid}`);
                        return;
                    }
                    
                    post.classList.add('spam-hidden');
                    post.style.display = 'none';
                    this.spamPosts.add(pid);
                    hiddenCount++;
                    const matchedKeyword = keywords.find(k => data.content.toLowerCase().includes(k.toLowerCase())) || 'unknown';
                    logWrapper('pageBehavior', 'LOG', `Hid spam post: ${pid}, Keyword: ${matchedKeyword}, Content: ${data.content.slice(0, 50)}...`);
                }

                post.classList.add('filtered');
                this.postsCache.set(pid, true);
            });

            // 只有在页面完全加载后才应用屏蔽规则
            if (this.isPageLoaded) {
                // 安全检查：避免匹配帖子核心内容区域
                const corePostClasses = ['l_post', 'd_post_content', 'p_author', 'j_p_postlist', 'pb_content', 'l_post_list', 'pb_list', 'd_post_content_main', 'p_content', 'core_reply_tail', 'core_reply_content', 'j_lzl_container', 'lzl_content_main'];
                const blockedElements = [...(this.settings.blockedElements || []), ...(this.settings.tempBlockedElements || [])];
                blockedElements.forEach(selector => {
                    try {
                        // 跳过无效选择器
                        if (!selector || typeof selector !== 'string' || selector.trim() === '') {
                            return;
                        }
                        
                        // 跳过可能影响页面加载的选择器
                        const problematicSelectors = ['ul.tbui_aside_float_bar', '.tbui_aside_float_bar', 'aside', 'sidebar', '.aside', '.sidebar'];
                        if (problematicSelectors.includes(selector)) {
                            customConsole.log(`跳过可能影响页面加载的选择器: ${selector}`);
                            return;
                        }
                        
                        // 优化：限制选择器范围，只在非核心内容区域应用
                        const elements = DomUtils.safeQueryAll(selector + ':not(.filtered)', this.postContainer);
                        elements.forEach(el => {
                            // 关键安全检查：如果元素是帖子的子元素，跳过屏蔽
                            if (el.closest('.l_post')) {
                                // 元素在帖子内部，跳过屏蔽
                                return;
                            }
                            
                            // 检查元素是否为核心内容区域
                            let isCoreContent = false;
                            if (el.classList) {
                                for (const cls of corePostClasses) {
                                    if (el.classList.contains(cls)) {
                                        isCoreContent = true;
                                        break;
                                    }
                                }
                            }
                            
                            // 检查父元素是否是核心内容区域
                            let parent = el.parentNode;
                            for (let i = 0; i < 4; i++) {
                                if (parent && parent.nodeType === 1) {
                                    if (parent.classList && parent.classList.contains('l_post')) {
                                        isCoreContent = true;
                                        break;
                                    }
                                    parent = parent.parentNode;
                                } else {
                                    break;
                                }
                            }
                            
                            // 只屏蔽非核心内容区域，并且避免影响页面布局
                            if (!isCoreContent) {
                                // 检查元素是否在视口中，避免屏蔽不可见元素
                                const rect = el.getBoundingClientRect();
                                if (rect.width > 0 && rect.height > 0) {
                                    const pid = el.dataset.pid || `temp_${Date.now()}`;
                                    if (!this.postsCache.has(pid)) {
                                        el.classList.add('spam-hidden');
                                        el.style.display = 'none';
                                        hiddenCount++;
                                        logWrapper('pageBehavior', 'LOG', `Hid blocked element: ${selector}`);
                                        el.classList.add('filtered');
                                        this.postsCache.set(pid, true);
                                    }
                                }
                            }
                        });
                    } catch (error) {
                        customConsole.error(`Invalid selector: ${selector}`, error);
                        // 移除无效选择器
                        const blockList = this.settings.blockType === 'temp' ? this.settings.tempBlockedElements : this.settings.blockedElements;
                        const index = blockList.indexOf(selector);
                        if (index > -1) {
                            blockList.splice(index, 1);
                            ConfigManager.updateFilterSettings(this.settings);
                        }
                    }
                });
            }

            setTimeout(() => {
                this.postContainer.classList.remove('filtering');
                if (hiddenCount > 0) this.showToast(`已屏蔽 ${hiddenCount} 条水贴`, 'success');
                customConsole.log(`[LOG] 翻页后过滤完成，处理帖子数：${nodes.length}`);
                logWrapper('pageBehavior', 'LOG', `Filter completed, processed posts: ${nodes.length}, hidden: ${hiddenCount}`);
            }, 500);

            const endTime = performance.now();
            PerformanceMonitor.getInstance().recordProcessSpeed(endTime - startTime);
            return hiddenCount;
        }

        startSpamEnforcer() {
            const enforce = () => {
                if (this.spamPosts.size === 0) {
                    setTimeout(enforce, 1000);
                    return;
                }

                const allPosts = DomUtils.safeQueryAll('.l_post', this.postContainer);
                let enforcedCount = 0;

                allPosts.forEach(post => {
                    const data = this.safeGetPostData(post);
                    const pid = data.pid;
                    
                    if (data.isFirstFloor || pid === this.firstFloorPid || this.protectedPids.has(pid)) {
                        this.spamPosts.delete(pid);
                        post.style.display = '';
                        post.classList.remove('spam-hidden');
                        return;
                    }
                    
                    if (this.spamPosts.has(pid) && document.body.contains(post) && post.style.display !== 'none') {
                        post.style.display = 'none';
                        post.classList.add('spam-hidden');
                        enforcedCount++;
                        logWrapper('pageBehavior', 'LOG', `Re-enforced spam hiding for post: ${pid}`);
                    }
                });

                if (enforcedCount > 0) {
                    customConsole.log(`Spam enforcer 执行完毕，处理了 ${enforcedCount} 个帖子`);
                }

                setTimeout(enforce, 1000);
            };
            enforce();
            customConsole.log('Spam enforcer 已启动');
        }

        autoExpandImages(nodes = DomUtils.safeQueryAll('.replace_tip:not(.expanded)', this.postContainer)) {
            if (!this.settings.autoExpandImages) return;
            customConsole.log('开始自动展开图片，图片数量:', nodes.length);
            logWrapper('pageBehavior', 'LOG', 'Auto expanding images');
            nodes.forEach(tip => {
                if (tip.style.display !== 'none' && !tip.classList.contains('expanded')) {
                    const rect = tip.getBoundingClientRect();
                    tip.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, clientX: rect.left, clientY: rect.top }));
                    tip.classList.add('expanded');
                    const img = DomUtils.safeQuery('img', tip.closest('.replace_div'));
                    if (this.settings.enhanceImages && img) this.enhanceImage(img);
                    this.postsCache.set(tip.dataset.pid || `img_${Date.now()}`, true);
                    logWrapper('pageBehavior', 'LOG', `Expanded image for post: ${tip.dataset.pid || 'unknown'}`);
                }
            });
        }

        updateFilters() {
            this.settings = ConfigManager.getFilterSettings();
            customConsole.log('更新过滤器配置，屏蔽词:', this.settings.spamKeywords);
            logWrapper('script', 'LOG', 'Updating filters with new settings');
            this.postsCache.clear();
            this.spamPosts.clear();
            this.originalOrder.clear();
            this.saveOriginalOrder();
            this.applyFilters();
            this.autoExpandImages();
            this.blockAds();
            if (this.settings.linkifyVideos) this.linkifyVideos();
        }

        observeDOMChanges() {
            let isFiltering = false;
            let lastFilterTime = 0;
            const MIN_FILTER_INTERVAL = 1000;

            const debouncedFilter = _.debounce(() => {
                const now = Date.now();
                if (isFiltering || now - lastFilterTime < MIN_FILTER_INTERVAL) {
                    customConsole.log('跳过过滤：正在过滤或间隔时间不足');
                    return;
                }
                
                if (this.isPageLoaded) {
                    isFiltering = true;
                    lastFilterTime = now;
                    try {
                        this.applyFilters();
                        this.autoExpandImages();
                        logWrapper('pageBehavior', 'LOG', 'DOM change detected, filters reapplied');
                    } finally {
                        isFiltering = false;
                    }
                }
            }, 800);

            const observer = new MutationObserver(mutations => {
                let shouldApplyFilter = false;
                let hasNewContent = false;
                
                mutations.forEach(mut => {
                    if (mut.addedNodes.length) {
                        for (const node of mut.addedNodes) {
                            if (node.nodeType === 1) {
                                if (node.classList?.contains('l_post') || node.querySelector('.l_post')) {
                                    hasNewContent = true;
                                    shouldApplyFilter = true;
                                    break;
                                }
                                if (node.classList?.contains('ad_item') || node.classList?.contains('mediago')) {
                                    hasNewContent = true;
                                }
                            }
                        }
                    }
                });
                
                if (shouldApplyFilter && hasNewContent && this.isPageLoaded) {
                    debouncedFilter();
                }
            });

            const postContainers = ['.l_post_list', '.pb_list', '.j_p_postlist'];
            for (const selector of postContainers) {
                const container = DomUtils.safeQuery(selector);
                if (container) {
                    observer.observe(container, { childList: true, subtree: false });
                    customConsole.log('MutationObserver 已初始化，监听容器:', selector);
                    return;
                }
            }
            
            const bodyObserver = new MutationObserver(mutations => {
                let shouldApplyFilter = false;
                mutations.forEach(mut => {
                    if (mut.addedNodes.length) {
                        for (const node of mut.addedNodes) {
                            if (node.nodeType === 1 && (node.classList?.contains('l_post') || node.querySelector('.l_post'))) {
                                shouldApplyFilter = true;
                                break;
                            }
                        }
                    }
                });
                if (shouldApplyFilter && this.isPageLoaded) {
                    debouncedFilter();
                }
            });
            
            bodyObserver.observe(document.body, { childList: true, subtree: false });
            customConsole.log('MutationObserver 已初始化，监听document.body');
        }

        handlePagination() {
            addSafeListener(document, 'click', e => {
                if (e.target.closest('.pagination a, .pager a')) {
                    customConsole.log('检测到翻页按钮点击');
                    logWrapper('userActions', 'LOG', 'Pagination button clicked');
                    this.isPageLoaded = false;
                    this.postsCache.clear();
                    this.spamPosts.clear();
                    this.originalOrder.clear();
                    setTimeout(() => {
                        this.saveOriginalOrder();
                        this.applyFilters();
                        this.autoExpandImages();
                        this.isPageLoaded = true;
                    }, 500);
                }
            });
            customConsole.log('翻页按钮监听已初始化');
        }

        interceptAjax() {
            const originalFetch = window.fetch;
            window.fetch = async (url, options) => {
                const response = await originalFetch(url, options);
                if (typeof url === 'string' && /tieba\.baidu\.com\/p\/\d+(\?pn=\d+)?$/.test(url)) {
                    customConsole.log('检测到翻页 fetch 请求:', url);
                    logWrapper('pageBehavior', 'LOG', `Page change detected via fetch: ${url}`);
                    this.postsCache.clear();
                    this.spamPosts.clear();
                    this.originalOrder.clear();
                    this.isPageLoaded = false;
                    requestAnimationFrame(() => {
                        setTimeout(() => {
                            this.saveOriginalOrder();
                            this.applyFilters();
                            this.autoExpandImages();
                            this.blockAds();
                            this.isPageLoaded = true;
                        }, 300);
                    });
                }
                return response;
            };

            const originalOpen = XMLHttpRequest.prototype.open;
            const self = this;
            XMLHttpRequest.prototype.open = function(method, url, ...args) {
                this.addEventListener('load', () => {
                    try {
                        if (typeof url === 'string' && url.includes('tieba.baidu.com/p/')) {
                            customConsole.log('检测到翻页 XMLHttpRequest 请求:', this.responseURL);
                            logWrapper('pageBehavior', 'LOG', `Page change detected via XMLHttpRequest: ${this.responseURL}`);
                            self.postsCache.clear();
                            self.spamPosts.clear();
                            self.originalOrder.clear();
                            self.isPageLoaded = false;
                            requestAnimationFrame(() => {
                                setTimeout(() => {
                                    self.saveOriginalOrder();
                                    self.applyFilters();
                                    self.autoExpandImages();
                                    self.blockAds();
                                    self.isPageLoaded = true;
                                }, 200);
                            });
                        }
                    } catch (error) {
                        customConsole.error('XMLHttpRequest load 事件处理错误:', error);
                    }
                });
                return originalOpen.call(this, method, url, ...args);
            };

            customConsole.log('AJAX 拦截器已初始化（fetch 和 XMLHttpRequest）');
        }

        blockAds() {
            if (!this.settings.blockAds) return;
            customConsole.log('开始屏蔽广告');
            logWrapper('pageBehavior', 'LOG', 'Blocking advertisements');
            const adSelectors = ['.ad_item', '.mediago', '[class*="ad_"]:not([class*="content"])', '.app_download_box', '.right_section .region_bright:not(.content)'];
            adSelectors.forEach(selector => {
                DomUtils.safeQueryAll(selector + ':not(.filtered)', this.postContainer).forEach(el => {
                    if (!el.closest('.d_post_content') && !el.closest('.l_container')) {
                        el.classList.add('spam-hidden');
                        const pid = el.dataset.pid || `ad_${Date.now()}`;
                        this.postsCache.set(pid, true);
                        el.classList.add('filtered');
                        logWrapper('pageBehavior', 'LOG', `Hid ad element: ${selector}`);
                    }
                });
            });
        }

        restoreOriginalOrder(isPageChange = false) {
            if (!this.postContainer) return;

            customConsole.log('开始恢复帖子顺序，原始顺序数量:', this.originalOrder.size);
            logWrapper('pageBehavior', 'LOG', `Restoring original order, isPageChange: ${isPageChange}`);

            const currentPosts = new Map();
            DomUtils.safeQueryAll('.l_post', this.postContainer).forEach(post => {
                const data = this.safeGetPostData(post);
                currentPosts.set(data.pid, post);
            });

            if (currentPosts.size === 0 || currentPosts.size !== this.originalOrder.size) {
                customConsole.log('跳过恢复帖子顺序，当前帖子数量:', currentPosts.size, '原始顺序数量:', this.originalOrder.size);
                return;
            }

            const sortedOrder = Array.from(this.originalOrder.values())
                .sort((a, b) => Number(a.floor) - Number(b.floor));

            let hasChanged = false;
            const currentPostsArray = Array.from(DomUtils.safeQueryAll('.l_post', this.postContainer));
            for (let i = 0; i < currentPostsArray.length; i++) {
                const currentPost = currentPostsArray[i];
                const data = this.safeGetPostData(currentPost);
                const expectedPost = sortedOrder[i];
                if (expectedPost && data.pid !== expectedPost.pid) {
                    hasChanged = true;
                    break;
                }
            }

            if (!hasChanged) {
                customConsole.log('帖子顺序未改变，无需恢复');
                return;
            }

            sortedOrder.forEach((item, index) => {
                const existingPost = currentPosts.get(item.pid);
                if (existingPost) {
                    const data = this.safeGetPostData(existingPost);
                    if (data.isFirstFloor || data.pid === this.firstFloorPid) {
                        existingPost.style.display = '';
                        existingPost.classList.remove('spam-hidden', 'invalid-hidden');
                        this.spamPosts.delete(data.pid);
                        this.protectedPids.add(data.pid);
                    }
                    this.postContainer.appendChild(existingPost);
                }
            });

            customConsole.log('帖子顺序恢复完成，数量:', sortedOrder.length);
            logWrapper('pageBehavior', 'LOG', `Restored order, posts: ${sortedOrder.length}`);
            if (!isPageChange) this.applyFilters();
        }

        linkifyVideos() {
            customConsole.log('开始链接化视频');
            logWrapper('pageBehavior', 'LOG', 'Linking videos');
            const videoRegex = /(?:av\d+|BV\w+)|(?:https?:\/\/(?:www\.)?(youtube\.com|youtu\.be)\/[^\s]+)/gi;
            DomUtils.safeQueryAll('.d_post_content:not(.filtered)', this.postContainer).forEach(post => {
                const pid = this.safeGetPostData(post).pid;
                if (!this.postsCache.has(pid)) {
                    post.innerHTML = post.innerHTML.replace(videoRegex, match => {
                        return match.startsWith('http') ? `<a href="${match}" target="_blank">${match}</a>` : `<a href="https://bilibili.com/video/${match}" target="_blank">${match}</a>`;
                    });
                    post.classList.add('filtered');
                    this.postsCache.set(pid, true);
                    logWrapper('pageBehavior', 'LOG', `Linked videos in post: ${pid}`);
                }
            });
        }

        enhanceImage(img) {
            if (!img) return;
            img.style.cursor = 'pointer';
            removeSafeListener(img, 'click', this.handleImageClick);
            addSafeListener(img, 'click', this.handleImageClick.bind(this));
            logWrapper('pageBehavior', 'LOG', `Enhanced image: ${img.src}`);
        }

        handleImageClick(event) {
            const overlay = document.createElement('div');
            overlay.className = 'image-overlay';
            const largeImg = document.createElement('img');
            largeImg.src = event.target.src;
            largeImg.className = 'large-image';

            // 添加拖动相关变量
            let isDragging = false;
            let startX = 0;
            let startY = 0;
            let translateX = 0;
            let translateY = 0;
            let scale = 1;

            overlay.appendChild(largeImg);
            document.body.appendChild(overlay);

            // 添加关闭按钮
            const closeBtn = document.createElement('button');
            closeBtn.textContent = '✕';
            closeBtn.style.cssText = `
                position: absolute;
                top: 20px;
                right: 20px;
                background: rgba(0, 0, 0, 0.5);
                color: white;
                border: none;
                border-radius: 50%;
                width: 30px;
                height: 30px;
                font-size: 20px;
                cursor: pointer;
                z-index: 10002;
            `;
            overlay.appendChild(closeBtn);

            // 关闭图片放大视图
            const closeOverlay = () => {
                overlay.remove();
            };

            addSafeListener(overlay, 'click', closeOverlay);
            addSafeListener(closeBtn, 'click', e => {
                e.stopPropagation();
                closeOverlay();
            });

            // 图片缩放功能
            addSafeListener(overlay, 'wheel', e => {
                e.preventDefault();
                const delta = e.deltaY > 0 ? 0.9 : 1.1;
                const rect = largeImg.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                // 计算缩放中心相对于图片的位置
                const relX = x / rect.width;
                const relY = y / rect.height;

                // 计算缩放前后的偏移量变化
                const prevWidth = rect.width;
                const prevHeight = rect.height;
                const newScale = scale * delta;
                const newWidth = prevWidth * delta;
                const newHeight = prevHeight * delta;

                // 调整平移量，使缩放中心保持不变
                translateX -= (newWidth - prevWidth) * relX;
                translateY -= (newHeight - prevHeight) * relY;

                scale = newScale;

                // 应用变换
                largeImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
            });

            // 图片拖动功能
            addSafeListener(largeImg, 'mousedown', e => {
                e.stopPropagation();
                isDragging = true;
                startX = e.clientX - translateX;
                startY = e.clientY - translateY;
                largeImg.style.cursor = 'grabbing';
            });

            addSafeListener(document, 'mousemove', e => {
                if (!isDragging) return;
                translateX = e.clientX - startX;
                translateY = e.clientY - startY;
                largeImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
            });

            addSafeListener(document, 'mouseup', () => {
                isDragging = false;
                largeImg.style.cursor = 'grab';
            });

            // 双击重置缩放和平移
            addSafeListener(largeImg, 'dblclick', e => {
                e.stopPropagation();
                scale = 1;
                translateX = 0;
                translateY = 0;
                largeImg.style.transform = `translate(0, 0) scale(1)`;
            });

            // 设置初始样式
            largeImg.style.transform = `translate(0, 0) scale(1)`;
            largeImg.style.cursor = 'grab';
            largeImg.style.transition = 'transform 0.1s ease';

            logWrapper('userActions', 'LOG', `Clicked to enlarge image: ${event.target.src}`);
        }

        safeGetPostData(post) {
            if (!post || post.nodeType !== 1) {
                return { pid: `temp_${Date.now()}`, floor: 0, content: '', author: '匿名', isFirstFloor: false };
            }
            
            const pid = post?.dataset?.pid || post?.getAttribute?.('data-pid') || `temp_${Date.now()}`;
            let floor = parseInt(post?.dataset?.floor || post?.getAttribute?.('data-floor')) || 0;
            
            let isFirstFloor = false;
            if (floor === 1) {
                isFirstFloor = true;
            } else if (this.firstFloorPid === pid) {
                isFirstFloor = true;
            } else if (!this.firstFloorIdentified) {
                const allPosts = DomUtils.safeQueryAll('.l_post', this.postContainer);
                if (allPosts.length > 0 && allPosts[0] === post) {
                    isFirstFloor = true;
                    this.firstFloorPid = pid;
                    this.firstFloorIdentified = true;
                }
            }
            
            const contentEle = DomUtils.safeQuery('.d_post_content', post);
            const content = contentEle ? contentEle.textContent.trim() : '';
            const author = DomUtils.safeQuery('.p_author_name', post)?.textContent?.trim() || '匿名';
            
            return { pid, floor, content, author, isFirstFloor };
        }

        runFilterTests() {
            const testResults = [];
            
            const test1 = this.testFirstFloorProtection();
            testResults.push({ name: '一楼帖子保护', result: test1 });
            
            const test2 = this.testNormalContent();
            testResults.push({ name: '正常内容保护', result: test2 });
            
            const test3 = this.testSpamFiltering();
            testResults.push({ name: '水贴内容屏蔽', result: test3 });
            
            customConsole.log('过滤测试结果:', testResults);
            return testResults;
        }

        testFirstFloorProtection() {
            const mockPost = {
                dataset: { pid: 'test_pid_1', floor: '1' },
                classList: { contains: () => false }
            };
            
            const data = this.safeGetPostData(mockPost);
            const isProtected = data.isFirstFloor || this.protectedPids.has(data.pid);
            
            customConsole.log(`测试一楼保护: floor=${data.floor}, isFirstFloor=${data.isFirstFloor}, protected=${isProtected}`);
            return isProtected;
        }

        testNormalContent() {
            const mockPost = {
                dataset: { pid: 'test_pid_2', floor: '2' },
                classList: { contains: () => false },
                textContent: '这是正常的帖子内容'
            };
            
            const data = this.safeGetPostData(mockPost);
            const shouldHide = this.settings.hideSpam && 
                              data.content && 
                              this.settings.spamKeywords.some(k => data.content.includes(k));
            
            customConsole.log(`测试正常内容: shouldHide=${shouldHide}`);
            return !shouldHide;
        }

        testSpamFiltering() {
            const mockPost = {
                dataset: { pid: 'test_pid_3', floor: '3' },
                classList: { contains: () => false },
                textContent: '顶顶顶'
            };
            
            const data = this.safeGetPostData(mockPost);
            const shouldHide = this.settings.hideSpam && 
                              data.content && 
                              this.settings.spamKeywords.some(k => data.content.includes(k));
            
            customConsole.log(`测试水贴屏蔽: shouldHide=${shouldHide}`);
            return shouldHide;
        }

        cleanupMemory() {
            // 初始化缓存时为每个帖子添加时间戳
            this.postsCache = new Map([...this.postsCache.entries()].map(([pid, value]) => {
                if (typeof value === 'boolean') {
                    return [pid, { used: value, timestamp: Date.now() }];
                }
                return [pid, value];
            }));

            const cleanupInterval = setInterval(() => {
                const now = Date.now();
                const CACHE_EXPIRY = 300000; // 5分钟
                let removedCount = 0;

                // 遍历缓存，移除过期的缓存项
                for (const [pid, data] of this.postsCache.entries()) {
                    if (typeof data === 'object' && data.timestamp && now - data.timestamp > CACHE_EXPIRY) {
                        this.postsCache.delete(pid);
                        removedCount++;
                    }
                }

                // 只有当有缓存项被移除时才输出日志
                if (removedCount > 0) {
                    customConsole.log(`清理内存，移除了 ${removedCount} 个过期缓存项，剩余缓存条目:`, this.postsCache.size);
                }

                // 当缓存大小为0时，清除定时器
                if (this.postsCache.size === 0) {
                    clearInterval(cleanupInterval);
                    customConsole.log('缓存已清空，停止清理定时器');
                }
            }, 60000); // 每分钟清理一次
        }

        showToast(message, type = 'info') {
            const toast = document.createElement('div');
            toast.textContent = message;
            toast.style.cssText = `
                position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
                background: ${type === 'success' ? '#34c759' : '#ff4444'}; color: white;
                padding: 10px 20px; border-radius: 5px; z-index: 10001; transition: opacity 0.3s;
            `;
            document.body.appendChild(toast);
            setTimeout(() => {
                toast.style.opacity = '0';
                setTimeout(() => toast.remove(), 300);
            }, 2000);
            logWrapper('script', 'LOG', `Showed toast: ${message}`);
        }
    }

    // 十四、动态面板类
    class DynamicPanel {
        constructor() {
            this.panel = null;
            this.minimizedIcon = null;
            this.isDragging = false;
            this.dragOccurred = false;
            this.lastClickTime = 0;
            this.isResizing = false;
            this.settings = ConfigManager.getFilterSettings();
            this.panelSettings = ConfigManager.getPanelSettings();
            this.postFilter = new PostFilter();
            this.debugPanel = { show: () => {}, hide: () => {}, update: () => {}, remove: () => {} }; // 简化处理
            this.init();
            this.applyDarkMode(this.settings.darkMode);
            migrateSettings();
            if (!GM_getValue('debugMode', true)) this.debugPanel.hide();
            customConsole.log('DynamicPanel 初始化完成');
        }

        init() {
            this.createPanel();
            this.createMinimizedIcon();
            document.body.appendChild(this.panel);
            document.body.appendChild(this.minimizedIcon);
            this.loadContent();
            this.setupPanelInteractions();
            this.minimizePanel();
            if (!this.panelSettings.minimized) this.restorePanel();
            this.ensureVisibility();
            this.observer = new ResizeObserver(() => this.adjustPanelHeight());
            this.observer.observe(this.panel.querySelector('.panel-content'));
            this.setupUserActionListeners();
            this.setupCleanup();
            scheduleIdleTask(() => this.startPerformanceMonitoring());
            prefetchResources();
        }

        ensureVisibility() {
            this.panel.style.opacity = '1';
            this.panel.style.visibility = 'visible';
            this.minimizedIcon.style.opacity = '1';
            this.minimizedIcon.style.visibility = 'visible';
            customConsole.log('Panel visibility ensured at:', this.panelSettings.position);
        }

        createPanel() {
            this.panel = document.createElement('div');
            this.panel.id = 'enhanced-panel';
            GM_addStyle(`
                #enhanced-panel {
                    position: fixed; z-index: 9999; top: ${this.panelSettings.position.y}px; left: ${this.panelSettings.position.x}px;
                    width: ${this.panelSettings.width}px; min-height: ${this.panelSettings.minHeight}px; max-height: ${this.panelSettings.maxHeight};
                    background: rgba(255,255,255,0.98); border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.1);
                    transition: opacity 0.3s ease; will-change: left, top; contain: strict; display: none; opacity: 1; visibility: visible; height: auto;
                }
                #minimized-icon {
                    position: fixed; z-index: 9999; top: ${this.panelSettings.position.y}px; left: ${this.panelSettings.position.x}px;
                    width: 32px; height: 32px; background: #ffffff; border-radius: 50%; box-shadow: 0 4px 16px rgba(0,0,0,0.2);
                    display: block; cursor: pointer; text-align: center; line-height: 32px; font-size: 16px; color: #007bff; overflow: hidden;
                }
                .panel-header { padding: 16px; border-bottom: 1px solid #eee; user-select: none; display: flex; justify-content: space-between; align-items: center; cursor: move; }
                .panel-content { padding: 16px; overflow-y: auto; overscroll-behavior: contain; height: auto; max-height: calc(90vh - 80px); }
                .resize-handle { position: absolute; bottom: 0; right: 0; width: 20px; height: 20px; cursor: nwse-resize; background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTUgNUwxNSAxNSIgc3Ryb2tlPSIjOTk5OTk5IiBzdHJva2Utd2lkdGg9IjIiLz48cGF0aCBkPSJNNSAxNUwxNSAxNSIgc3Ryb2tlPSIjOTk5OTk5IiBzdHJva2Utd2lkdGg9IjIiLz48L3N2Zz4=') no-repeat center; }
                .minimize-btn, .scale-btn { cursor: pointer; padding: 0 8px; }
                .minimize-btn:hover, .scale-btn:hover { color: #007bff; }
                .setting-group { display: flex; align-items: center; padding: 10px 0; gap: 10px; }
                .toggle-switch { position: relative; width: 40px; height: 20px; flex-shrink: 0; }
                .toggle-switch input { opacity: 0; width: 0; height: 0; }
                .toggle-slider { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: #ccc; border-radius: 10px; cursor: pointer; transition: background 0.3s; }
                .toggle-slider:before { position: absolute; content: ""; height: 16px; width: 16px; left: 2px; top: 2px; background: white; border-radius: 50%; transition: transform 0.3s; box-shadow: 0 1px 2px rgba(0,0,0,0.2); }
                .toggle-switch input:checked + .toggle-slider { background: #34c759; }
                .toggle-switch input:checked + .toggle-slider:before { transform: translateX(20px); }
                .setting-label { flex: 1; font-size: 14px; color: #333; }
                body.dark-mode .setting-label { color: #ddd !important; }
                select { padding: 4px; border: 1px solid #ddd; border-radius: 4px; }
                .divider { height: 1px; background: #eee; margin: 16px 0; }
                .tool-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
                .tool-card { padding: 12px; background: #f8f9fa; border: 1px solid #eee; border-radius: 8px; cursor: pointer; transition: all 0.2s; }
                .tool-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
                .metric-grid { display: grid; gap: 12px; }
                .progress-bar { height: 4px; background: #e9ecef; border-radius: 2px; overflow: hidden; }
                .progress-fill { height: 100%; background: #28a745; width: 0%; transition: width 0.3s ease; }
                .block-modal, .keyword-modal, .log-modal, .search-modal {
                    position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5);
                    display: flex; justify-content: center; align-items: center; z-index: 10000; pointer-events: auto;
                }
                .modal-content { background: white; padding: 20px; border-radius: 8px; width: 400px; max-height: 80vh; overflow-y: auto; pointer-events: auto; }
                .modal-content p { color: #666; margin: 5px 0 10px; font-size: 12px; }
                textarea, input[type="text"] { width: 100%; margin: 10px 0; padding: 8px; border: 1px solid #ddd; resize: vertical; }
                .modal-actions { text-align: right; }
                .btn-cancel, .btn-save, .btn-block, .btn-undo, .btn-confirm, .btn-search {
                    padding: 6px 12px; margin: 0 5px; border: none; border-radius: 4px; cursor: pointer; pointer-events: auto;
                }
                .btn-cancel { background: #eee; }
                .btn-save, .btn-block, .btn-undo, .btn-confirm, .btn-search { background: #34c759; color: white; }
                .btn-block.active { background: #ff4444; }
                .btn-undo { background: #ff9800; }
                .hover-highlight { outline: 2px solid #ff4444; outline-offset: 2px; }
                .blocked-item { display: flex; justify-content: space-between; align-items: center; padding: 5px 0; border-bottom: 1px solid #eee; }
                .blocked-item button { padding: 4px 8px; font-size: 12px; }
                .cursor-circle {
                    position: fixed; width: 20px; height: 20px; background: rgba(128, 128, 128, 0.5); border-radius: 50%;
                    pointer-events: none; z-index: 10001; transition: transform 0.2s ease;
                }
                .cursor-circle.confirm { background: rgba(52, 199, 89, 0.8); transform: scale(1.5); transition: transform 0.3s ease, background 0.3s ease; }
                body.blocking-mode * { cursor: none !important; }
                .performance-info { display: none; }
                .highlight-match { background-color: yellow; }
                .image-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; justify-content: center; align-items: center; }
                .large-image { max-width: 90%; max-height: 90%; cursor: move; transform: translateZ(0); backface-visibility: hidden; }
                body.dark-mode, body.dark-mode .wrap1, body.dark-mode .l_container, body.dark-mode .pb_content, body.dark-mode .d_post_content, body.dark-mode .left_section, body.dark-mode .right_section {
                    background: #222 !important; color: #ddd !important; transition: background 0.3s, color 0.3s;
                }
                body.dark-mode #enhanced-panel { background: rgba(50,50,50,0.98) !important; color: #ddd !important; }
                body.dark-mode a { color: #66b3ff !important; }
                @media (max-width: 768px) {
                    #enhanced-panel { width: 90vw !important; left: 5vw !important; }
                    .tool-grid { grid-template-columns: 1fr; }
                }
                .quick-actions { margin-top: 10px; }
                .quick-actions button { margin: 5px; padding: 5px 10px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
            `);
            this.panel.innerHTML = `
                <div class="panel-header"><span>贴吧增强控制台</span><div class="panel-controls"><span class="minimize-btn">—</span><span class="scale-btn" data-scale="0.8">缩小</span><span class="scale-btn" data-scale="1.0">还原</span></div></div>
                <div class="panel-content"></div>
                <div class="resize-handle"></div>
            `;
        }

        createMinimizedIcon() {
            this.minimizedIcon = document.createElement('div');
            this.minimizedIcon.id = 'minimized-icon';
            this.minimizedIcon.textContent = '⚙️';
            addSafeListener(this.minimizedIcon, 'click', e => {
                const now = Date.now();
                if (now - this.lastClickTime > 300 && !this.dragOccurred) {
                    this.toggleMinimize();
                    this.lastClickTime = now;
                }
                this.dragOccurred = false;
                e.stopPropagation();
            });
        }

        loadContent() {
            const content = DomUtils.safeQuery('.panel-content', this.panel);
            content.innerHTML = `
                <div class="filter-controls">
                    <h3>📊 智能过滤设置</h3>
                    <div class="setting-group">
                        <label class="toggle-switch">
                            <input type="checkbox" data-setting="debugMode" ${GM_getValue('debugMode', true) ? 'checked' : ''}>
                            <span class="toggle-slider"></span>
                        </label>
                        <span class="setting-label">启用调试模式</span>
                    </div>
                    <div class="setting-group"><label class="toggle-switch"><input type="checkbox" data-setting="hideInvalid" ${this.settings.hideInvalid ? 'checked' : ''}><span class="toggle-slider"></span></label><span class="setting-label">隐藏无效楼层</span></div>
                    <div class="setting-group"><label class="toggle-switch"><input type="checkbox" data-setting="hideSpam" ${this.settings.hideSpam ? 'checked' : ''}><span class="toggle-slider"></span></label><span class="setting-label">屏蔽水贴内容</span><button class="btn-config" data-action="editKeywords">✏️ 编辑关键词</button></div>
                    <div class="setting-group"><label class="toggle-switch"><input type="checkbox" data-setting="autoExpandImages" ${this.settings.autoExpandImages ? 'checked' : ''}><span class="toggle-slider"></span></label><span class="setting-label">自动展开图片</span></div>
                    <div class="setting-group">
                        <button class="btn-block" data-action="toggleBlockMode">🛡️ ${this.isBlockingMode ? '停止选择屏蔽' : '开始选择屏蔽元素'}</button>
                        <select data-setting="blockType">
                            <option value="perm" ${this.settings.blockType === 'perm' ? 'selected' : ''}>永久屏蔽</option>
                            <option value="temp" ${this.settings.blockType === 'temp' ? 'selected' : ''}>临时屏蔽</option>
                        </select>
                    </div>
                    <div class="setting-group"><button class="btn-undo" data-action="showUndoList">🔄 查看并撤回屏蔽</button></div>
                    <div class="setting-group"><label class="toggle-switch"><input type="checkbox" data-setting="blockAds" ${this.settings.blockAds ? 'checked' : ''}><span class="toggle-slider"></span></label><span class="setting-label">自动屏蔽广告</span></div>
                    <div class="setting-group"><label class="toggle-switch"><input type="checkbox" data-setting="enhanceImages" ${this.settings.enhanceImages ? 'checked' : ''}><span class="toggle-slider"></span></label><span class="setting-label">图片交互优化</span></div>
                    <div class="setting-group"><label class="toggle-switch"><input type="checkbox" data-setting="linkifyVideos" ${this.settings.linkifyVideos ? 'checked' : ''}><span class="toggle-slider"></span></label><span class="setting-label">视频链接跳转</span></div>
                    <div class="setting-group"><label class="toggle-switch"><input type="checkbox" data-setting="darkMode" ${this.settings.darkMode ? 'checked' : ''}><span class="toggle-slider"></span></label><span class="setting-label">黑夜模式</span></div>
                    <div class="setting-group"><label class="toggle-switch"><input type="checkbox" data-setting="showHiddenFloors" ${this.settings.showHiddenFloors ? 'checked' : ''}><span class="toggle-slider"></span></label><span class="setting-label">显示隐藏楼层</span></div>
                </div>
                <div class="quick-actions">
                    <button data-action="toggleAllImages">一键展开/收起图片</button>
                </div>
                <div class="divider"></div>
                <div class="advanced-tools">
                    <h3>⚙️ 高级工具</h3>
                    <div class="tool-grid">
                        <button class="tool-card" data-action="exportSettings"><div class="icon">📤</div><span>导出配置</span></button>
                        <button class="tool-card" data-action="importSettings"><div class="icon">📥</div><span>导入配置</span></button>
                        <button class="tool-card" data-action="performanceChart"><div class="icon">📈</div><span>性能图表</span></button>
                        <button class="tool-card" data-action="quickSearch"><div class="icon">🔍</div><span>快速检索</span></button>
                        <button class="tool-card" data-action="saveLogs"><div class="icon">💾</div><span>保存日志</span></button>
                    </div>
                </div>
                <div class="divider"></div>
                <div class="performance-info">
                    <h3>💻 系统监控</h3>
                    <div class="metric-grid">
                        <div class="metric-item"><span class="metric-label">内存占用</span><span class="metric-value" id="mem-usage">0 MB</span><div class="progress-bar"><div class="progress-fill" id="mem-progress"></div></div></div>
                        <div class="metric-item"><span class="metric-label">处理速度</span><span class="metric-value" id="process-speed">0 ms</span><div class="sparkline" id="speed-chart"></div></div>
                    </div>
                </div>
            `;
            this.bindEvents();
            setTimeout(() => this.adjustPanelHeight(), 50);
        }

        adjustPanelHeight() {
            if (this.panelSettings.minimized) return;
            const content = DomUtils.safeQuery('.panel-content', this.panel);
            const headerHeight = DomUtils.safeQuery('.panel-header', this.panel)?.offsetHeight || 0;
            const maxHeight = Math.min(content.scrollHeight + headerHeight + 32, window.innerHeight * 0.9);
            this.panel.style.height = `${maxHeight}px`;
        }

        bindEvents() {
            DomUtils.safeQueryAll('input[type="checkbox"]', this.panel).forEach(checkbox => {
                addSafeListener(checkbox, 'change', () => {
                    if (checkbox.dataset.setting === 'debugMode') {
                        GM_setValue('debugMode', checkbox.checked);
                        if (checkbox.checked) {
                            this.debugPanel.show();
                        } else {
                            this.debugPanel.hide();
                        }
                    } else if (checkbox.dataset.setting === 'darkMode') {
                        this.settings.darkMode = checkbox.checked;
                        ConfigManager.updateFilterSettings(this.settings);
                        this.applyDarkMode(checkbox.checked);
                    } else {
                        this.settings[checkbox.dataset.setting] = checkbox.checked;
                        ConfigManager.updateFilterSettings(this.settings);
                        this.postFilter.updateFilters();
                    }
                    logWrapper('userActions', 'LOG', `Toggled ${checkbox.dataset.setting} to ${checkbox.checked}`);
                    this.adjustPanelHeight();
                });
            });

            const blockTypeSelect = DomUtils.safeQuery('[data-setting="blockType"]', this.panel);
            if (blockTypeSelect) {
                addSafeListener(blockTypeSelect, 'change', e => {
                    this.settings.blockType = e.target.value;
                    ConfigManager.updateFilterSettings(this.settings);
                    logWrapper('userActions', 'LOG', `Changed blockType to ${e.target.value}`);
                });
            }

            const actions = {
                editKeywords: () => this.showKeywordEditor(),
                toggleBlockMode: () => this.toggleBlockMode(),
                showUndoList: () => this.showUndoList(),
                exportSettings: () => this.exportConfig(),
                importSettings: () => this.importConfig(),
                performanceChart: () => {
                    const perfInfo = DomUtils.safeQuery('.performance-info', this.panel);
                    perfInfo.style.display = perfInfo.style.display === 'block' ? 'none' : 'block';
                    this.adjustPanelHeight();
                    logWrapper('userActions', 'LOG', `Toggled performance chart: ${perfInfo.style.display}`);
                },
                quickSearch: () => this.toggleSearch(),
                saveLogs: () => this.showLogSaveDialog(),
                toggleAllImages: () => {
                    const tips = DomUtils.safeQueryAll('.replace_tip', this.postFilter.postContainer);
                    const allExpanded = Array.from(tips).every(tip => tip.classList.contains('expanded'));
                    tips.forEach(tip => {
                        if (allExpanded && tip.classList.contains('expanded')) {
                            tip.click();
                            tip.classList.remove('expanded');
                        } else if (!tip.classList.contains('expanded')) {
                            tip.click();
                            tip.classList.add('expanded');
                        }
                    });
                    this.showToast(allExpanded ? '已收起所有图片' : '已展开所有图片', 'success');
                    logWrapper('userActions', 'LOG', `Toggled all images: ${allExpanded ? 'collapsed' : 'expanded'}`);
                }
            };

            DomUtils.safeQueryAll('[data-action]', this.panel).forEach(btn => {
                addSafeListener(btn, 'click', () => actions[btn.dataset.action]?.());
            });

            const minimizeBtn = DomUtils.safeQuery('.minimize-btn', this.panel);
            if (minimizeBtn) addSafeListener(minimizeBtn, 'click', e => { this.toggleMinimize(); e.stopPropagation(); });
        }

        setupPanelInteractions() {
            const header = DomUtils.safeQuery('.panel-header', this.panel);
            const resizeHandle = DomUtils.safeQuery('.resize-handle', this.panel);
            let startX, startY, startWidth, startHeight, rafId;

    const onDragStart = (e, isIcon = false) => {
        if (e.button !== 0) return; // 只响应左键
        this.isDragging = true;
        this.dragOccurred = false;
        const target = isIcon ? this.minimizedIcon : this.panel;
        startX = e.clientX - this.panelSettings.position.x;
        startY = e.clientY - this.panelSettings.position.y;
        e.preventDefault();
        customConsole.log(`Drag started at:`, { x: e.clientX, y: e.clientY, isIcon });
    };

    const updatePosition = (x, y) => {
        const target = this.panelSettings.minimized ? this.minimizedIcon : this.panel;
        const panelWidth = target.offsetWidth;
        const panelHeight = target.offsetHeight;
        this.panelSettings.position.x = Math.max(10, Math.min(x - startX, window.innerWidth - panelWidth - 10));
        this.panelSettings.position.y = Math.max(10, Math.min(y - startY, window.innerHeight - panelHeight - 10));
        target.style.left = `${this.panelSettings.position.x}px`;
        target.style.top = `${this.panelSettings.position.y}px`;
        customConsole.log('Dragging to:', { x: this.panelSettings.position.x, y: this.panelSettings.position.y, minimized: this.panelSettings.minimized });
    };

    const onDragMove = (e) => {
        if (!this.isDragging) return;
        this.dragOccurred = true;
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => updatePosition(e.clientX, e.clientY));
    };

    const onDragEnd = (e) => {
        if (!this.isDragging) return;
        this.isDragging = false;
        cancelAnimationFrame(rafId);
        ConfigManager.updatePanelSettings(this.panelSettings);
        this.adjustPanelHeight();
        customConsole.log('Drag ended, position:', this.panelSettings.position);
        setTimeout(() => { this.dragOccurred = false; }, 100);
    };

    if (header) {
        addSafeListener(header, 'mousedown', (e) => onDragStart(e, false));
    }
    addSafeListener(this.minimizedIcon, 'mousedown', (e) => onDragStart(e, true));
    addSafeListener(document, 'mousemove', onDragMove);
    addSafeListener(document, 'mouseup', onDragEnd);

    if (resizeHandle) {
        addSafeListener(resizeHandle, 'mousedown', (e) => {
            this.isResizing = true;
            startX = e.clientX;
            startY = e.clientY;
            startWidth = this.panelSettings.width;
            startHeight = parseInt(this.panel.style.height) || this.panel.offsetHeight;

            // 添加调整大小时的视觉反馈
            this.panel.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)';

            e.preventDefault();
        });
    }

    const onResizeMove = (e) => {
        if (this.isResizing) {
            // 使用 requestAnimationFrame 优化 resize 过程，使动画更加流畅
            cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
                // 定义面板的最小和最大尺寸
                const MIN_WIDTH = 200;
                const MIN_HEIGHT = 200;
                const MAX_WIDTH = window.innerWidth * 0.8;
                const MAX_HEIGHT = window.innerHeight * 0.9;

                // 计算新的宽度和高度
                let newWidth = startWidth + (e.clientX - startX);
                let newHeight = startHeight + (e.clientY - startY);

                // 应用边界限制
                newWidth = Math.max(MIN_WIDTH, Math.min(newWidth, MAX_WIDTH));
                newHeight = Math.max(MIN_HEIGHT, Math.min(newHeight, MAX_HEIGHT));

                // 更新面板设置
                this.panelSettings.width = newWidth;
                this.panelSettings.height = newHeight;

                // 应用样式
                this.panel.style.width = `${newWidth}px`;
                this.panel.style.height = `${newHeight}px`;
            });
        }
    };

    const onResizeEnd = () => {
        if (this.isResizing) {
            this.isResizing = false;
            cancelAnimationFrame(rafId);

            // 恢复原始样式
            this.panel.style.boxShadow = '';

            ConfigManager.updatePanelSettings(this.panelSettings);
            this.adjustPanelHeight();
            customConsole.log('Resize ended, size:', { width: this.panelSettings.width, height: this.panelSettings.height });
        }
    };

    addSafeListener(document, 'mousemove', onResizeMove);
    addSafeListener(document, 'mouseup', onResizeEnd);
    addSafeListener(document, 'mouseleave', onResizeEnd); // 当鼠标离开窗口时结束 resize

    // 支持键盘调整窗口大小
    addSafeListener(document, 'keydown', (e) => {
        if (!this.panel || this.panelSettings.minimized) return;

        const STEP = 10;
        let changed = false;

        // 只有当面板获得焦点或用户正在与面板交互时才响应键盘事件
        if (e.target.closest('#enhanced-panel') || e.ctrlKey) {
            switch (e.key) {
                case 'ArrowUp':
                    e.preventDefault();
                    this.panelSettings.height = Math.max(200, this.panelSettings.height - STEP);
                    this.panel.style.height = `${this.panelSettings.height}px`;
                    changed = true;
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    this.panelSettings.height = Math.min(window.innerHeight * 0.9, this.panelSettings.height + STEP);
                    this.panel.style.height = `${this.panelSettings.height}px`;
                    changed = true;
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.panelSettings.width = Math.max(200, this.panelSettings.width - STEP);
                    this.panel.style.width = `${this.panelSettings.width}px`;
                    changed = true;
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.panelSettings.width = Math.min(window.innerWidth * 0.8, this.panelSettings.width + STEP);
                    this.panel.style.width = `${this.panelSettings.width}px`;
                    changed = true;
                    break;
            }

            if (changed) {
                ConfigManager.updatePanelSettings(this.panelSettings);
                this.adjustPanelHeight();
            }
        }
    });

    DomUtils.safeQueryAll('.scale-btn', this.panel).forEach(btn => {
        addSafeListener(btn, 'click', e => {
            this.panelSettings.scale = parseFloat(btn.dataset.scale);
            this.panel.style.transform = `scale(${this.panelSettings.scale})`;
            ConfigManager.updatePanelSettings(this.panelSettings);
            this.ensureVisibility();
            this.adjustPanelHeight();
            e.stopPropagation();
        });
    });

    addSafeListener(window, 'resize', () => {
        const target = this.panelSettings.minimized ? this.minimizedIcon : this.panel;
        const panelWidth = target.offsetWidth * (this.panelSettings.scale || 1);
        const panelHeight = target.offsetHeight * (this.panelSettings.scale || 1);
        this.panelSettings.position.x = Math.min(this.panelSettings.position.x, window.innerWidth - panelWidth - 10);
        this.panelSettings.position.y = Math.min(this.panelSettings.position.y, window.innerHeight - panelHeight - 10);
        target.style.left = `${this.panelSettings.position.x}px`;
        target.style.top = `${this.panelSettings.position.y}px`;
        ConfigManager.updatePanelSettings(this.panelSettings);
        customConsole.log('Adjusted position on resize:', this.panelSettings.position);
    });
}
        setupUserActionListeners() {
            addSafeListener(document, 'click', e => {
                if (!this.panel.contains(e.target) && !this.minimizedIcon.contains(e.target)) {
                    logWrapper('userActions', 'LOG', `Clicked on page at (${e.clientX}, ${e.clientY}), Target: ${e.target.tagName}.${e.target.className || ''}`);
                }
            });
            addSafeListener(document, 'scroll', _.debounce(() => {
                logWrapper('userActions', 'LOG', `Scrolled to (${window.scrollX}, ${window.scrollY})`);
            }, DEBOUNCE_LEVEL.QUICK));
        }

        startPerformanceMonitoring() {
            const perfMonitor = PerformanceMonitor.getInstance();
            const update = () => {
                perfMonitor.recordMemory();
                const memUsage = perfMonitor.metrics.memoryUsage.length ? Math.round(_.mean(perfMonitor.metrics.memoryUsage) / 1024 / 1024) : 0;
                const memElement = DomUtils.safeQuery('#mem-usage', this.panel);
                const progElement = DomUtils.safeQuery('#mem-progress', this.panel);
                if (memElement && progElement) {
                    memElement.textContent = `${memUsage} MB`;
                    progElement.style.width = `${Math.min(memUsage / 100 * 100, 100)}%`;
                }
                this.debugPanel.update({
                    posts: DomUtils.safeQueryAll('.l_post', this.postFilter.postContainer).length,
                    hidden: DomUtils.safeQueryAll('.spam-hidden', this.postFilter.postContainer).length,
                    memory: memUsage,
                    cacheSize: this.postFilter.postsCache.size
                });
                requestAnimationFrame(update);
            };
            requestAnimationFrame(update);
        }

        toggleMinimize() {
            if (this.panelSettings.minimized) this.restorePanel();
            else this.minimizePanel();
            ConfigManager.updatePanelSettings(this.panelSettings);
            this.ensureVisibility();
            logWrapper('userActions', 'LOG', `Panel minimized: ${this.panelSettings.minimized}`);
        }

        minimizePanel() {
            this.panel.style.display = 'none';
            this.minimizedIcon.style.display = 'block';
            this.minimizedIcon.style.left = `${this.panelSettings.position.x}px`;
            this.minimizedIcon.style.top = `${this.panelSettings.position.y}px`;
            this.panelSettings.minimized = true;
            this.ensureVisibility();
            customConsole.log('Minimized panel, icon position:', this.panelSettings.position);
}

        restorePanel() {
            this.panel.style.display = 'block';
            this.minimizedIcon.style.display = 'none';
            this.panel.style.left = `${this.panelSettings.position.x}px`;
            this.panel.style.top = `${this.panelSettings.position.y}px`;
            this.panelSettings.minimized = false;
            this.adjustPanelHeight();
            this.ensureVisibility();
            customConsole.log('Restored panel, position:', this.panelSettings.position);
}

        toggleBlockMode(event) {
            this.isBlockingMode = !this.isBlockingMode;
            const blockBtn = DomUtils.safeQuery('.btn-block', this.panel);
            blockBtn.textContent = `🛡️ ${this.isBlockingMode ? '停止选择屏蔽' : '开始选择屏蔽元素'}`;
            blockBtn.classList.toggle('active', this.isBlockingMode);

            if (this.isBlockingMode) {
                document.body.classList.add('blocking-mode');
                this.createCursorCircle();
                this.listeners = {
                    move: this.moveCursorCircle.bind(this),
                    click: this.handleBlockClick.bind(this)
                };
                addSafeListener(document, 'mousemove', this.listeners.move);
                addSafeListener(document, 'click', this.listeners.click);
            } else {
                document.body.classList.remove('blocking-mode');
                this.removeCursorCircle();
                if (this.listeners) {
                    removeSafeListener(document, 'mousemove', this.listeners.move);
                    removeSafeListener(document, 'click', this.listeners.click);
                    this.listeners = null;
                }
                this.removeHighlight();
                this.selectedTarget = null;
            }
            if (event) event.stopPropagation();
            this.adjustPanelHeight();
            logWrapper('userActions', 'LOG', `Toggled block mode: ${this.isBlockingMode}`);
        }

        createCursorCircle() {
            this.cursorCircle = document.createElement('div');
            this.cursorCircle.className = 'cursor-circle';
            document.body.appendChild(this.cursorCircle);
        }

        moveCursorCircle(event) {
            if (!this.isBlockingMode || !this.cursorCircle) return;
            this.cursorCircle.style.left = `${event.clientX - 10}px`;
            this.cursorCircle.style.top = `${event.clientY - 10}px`;
            this.highlightElement(event);
        }

        removeCursorCircle() {
            if (this.cursorCircle && document.body.contains(this.cursorCircle)) document.body.removeChild(this.cursorCircle);
            this.cursorCircle = null;
        }

        highlightElement(event) {
            if (!this.isBlockingMode) return;
            this.removeHighlight();
            const target = event.target;
            if (!target || target.nodeType !== 1) return;
            if (target === this.panel || this.panel.contains(target) || target.classList.contains('block-modal') || target.closest('.block-modal')) return;
            target.classList.add('hover-highlight');
        }

        removeHighlight() {
            const highlighted = DomUtils.safeQuery('.hover-highlight');
            if (highlighted) highlighted.classList.remove('hover-highlight');
        }

        handleBlockClick(event) {
            if (!this.isBlockingMode) return;
            event.preventDefault();
            event.stopPropagation();
            const target = event.target;
            if (!target || target.nodeType !== 1) return;
            if (target === this.panel || this.panel.contains(target) || target.classList.contains('block-modal') || target.closest('.block-modal')) return;
            this.selectedTarget = target;
            this.showConfirmDialog(event.clientX, event.clientY);
        }

        showConfirmDialog(x, y) {
            const modal = document.createElement('div');
            modal.className = 'block-modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <h3>确认屏蔽</h3>
                    <p>确定要屏蔽此元素吗？当前模式：${this.settings.blockType === 'temp' ? '临时' : '永久'}</p>
                    <div class="modal-actions">
                        <button class="btn-cancel">取消</button>
                        <button class="btn-confirm">确定</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
            const confirmBtn = DomUtils.safeQuery('.btn-confirm', modal);
            const cancelBtn = DomUtils.safeQuery('.btn-cancel', modal);
            addSafeListener(confirmBtn, 'click', e => {
                e.stopPropagation();
                if (this.selectedTarget) this.blockElement(this.selectedTarget, x, y);
                document.body.removeChild(modal);
            }, { once: true });
            addSafeListener(cancelBtn, 'click', e => {
                e.stopPropagation();
                document.body.removeChild(modal);
                this.toggleBlockMode();
            }, { once: true });
        }

        blockElement(target, x, y) {
            if (!target || !document.body.contains(target)) {
                this.showToast('无效的元素', 'error');
                return;
            }
            if (target.nodeType !== 1) {
                this.showToast('只能屏蔽元素节点', 'error');
                return;
            }
            const selector = this.getUniqueSelector(target);
            if (!selector) {
                this.toggleBlockMode();
                return;
            }
            const blockList = this.settings.blockType === 'temp' ? this.settings.tempBlockedElements : this.settings.blockedElements;
            if (!blockList.includes(selector)) {
                blockList.push(selector);
                ConfigManager.updateFilterSettings(this.settings);
                logWrapper('userActions', 'LOG', `Blocked element: ${selector}`, `Type: ${this.settings.blockType}`);
            }
            target.classList.add('spam-hidden');
            
            if (this.cursorCircle) {
                this.cursorCircle.style.left = `${x - 10}px`;
                this.cursorCircle.style.top = `${y - 10}px`;
                this.cursorCircle.classList.add('confirm');
                setTimeout(() => {
                    this.cursorCircle.classList.remove('confirm');
                    this.toggleBlockMode();
                    this.showToast('已屏蔽该元素，页面将自动刷新', 'success');
                    setTimeout(() => {
                        location.reload();
                    }, 1000);
                }, 300);
            } else {
                this.toggleBlockMode();
                this.showToast('已屏蔽该元素，页面将自动刷新', 'success');
                setTimeout(() => {
                    location.reload();
                }, 1000);
            }
            this.adjustPanelHeight();
        }

        getUniqueSelector(element) {
            if (!element || element.nodeType !== 1) {
                return null;
            }

            if (element.id && element.id !== '') {
                return `#${element.id}`;
            }

            const corePostClasses = ['l_post', 'd_post_content', 'p_author', 'j_p_postlist', 'pb_content', 'l_post_list', 'pb_list', 'd_post_content_main', 'p_content', 'core_reply_tail', 'core_reply_content', 'j_lzl_container', 'lzl_content_main'];
            
            const floorInfo = element.dataset?.floor || element.getAttribute?.('data-floor');
            if (floorInfo === '1') {
                this.showToast('不能屏蔽一楼帖子', 'error');
                return null;
            }
            
            if (element.classList) {
                for (const cls of corePostClasses) {
                    if (element.classList.contains(cls)) {
                        this.showToast('不能屏蔽帖子核心内容区域', 'error');
                        return null;
                    }
                }
            }
            
            if (element.closest('.l_post')) {
                this.showToast('不能屏蔽帖子内部元素', 'error');
                return null;
            }
            
            let parent = element.parentNode;
            for (let i = 0; i < 5; i++) {
                if (parent && parent.nodeType === 1) {
                    if (parent.classList && parent.classList.contains('l_post')) {
                        this.showToast('不能屏蔽帖子内部元素', 'error');
                        return null;
                    }
                    parent = parent.parentNode;
                } else {
                    break;
                }
            }
            
            const criticalElements = ['aside', 'sidebar', '.aside', '.sidebar', '.tbui_aside_float_bar', 'ul.tbui_aside_float_bar'];
            for (const sel of criticalElements) {
                if (element.matches(sel)) {
                    this.showToast('不能屏蔽可能影响页面加载的元素', 'error');
                    return null;
                }
                let parent = element.parentNode;
                for (let i = 0; i < 2; i++) {
                    if (parent && parent.matches && parent.matches(sel)) {
                        this.showToast('不能屏蔽可能影响页面加载的元素', 'error');
                        return null;
                    }
                    parent = parent.parentNode;
                }
            }

            const path = [];
            let current = element;
            const MAX_PATH_LENGTH = 7;
            let pathLength = 0;

            while (current && current.nodeType === 1 && current !== document.body && pathLength < MAX_PATH_LENGTH) {
                let selector = current.tagName.toLowerCase();

                if (current.className) {
                    const classes = current.className.trim().split(/\s+/);
                    const meaningfulClasses = classes.filter(cls => {
                        return !corePostClasses.includes(cls) &&
                               !cls.match(/^(spam-hidden|filtered|expanded|hover-highlight)$/) &&
                               cls.length > 4;
                    });

                    if (meaningfulClasses.length > 0) {
                        selector += meaningfulClasses.map(cls => `.${cls}`).join('');
                    }
                }

                const siblings = Array.from(current.parentNode?.children || []).filter(child => child.tagName === current.tagName);
                if (siblings.length > 1) {
                    const index = siblings.indexOf(current) + 1;
                    selector += `:nth-child(${index})`;
                }

                path.unshift(selector);
                current = current.parentNode;
                pathLength++;
            }

            let finalSelector = path.join(' > ');

            if (pathLength < 2) {
                const parent = element.parentNode;
                if (parent && parent.nodeType === 1 && parent !== document.body) {
                    let parentSelector = parent.tagName.toLowerCase();
                    if (parent.className) {
                        const parentClasses = parent.className.trim().split(/\s+/);
                        if (parentClasses.length > 0) {
                            parentSelector += `.${parentClasses[0]}`;
                        }
                    }
                    finalSelector = `${parentSelector} > ${finalSelector}`;
                }
            }
            
            finalSelector = `.pb_content ${finalSelector}`;

            try {
                const matches = document.querySelectorAll(finalSelector);
                if (matches.length !== 1) {
                    if (element.dataset && Object.keys(element.dataset).length > 0) {
                        const dataAttr = Object.keys(element.dataset)[0];
                        finalSelector += `[data-${dataAttr}="${element.dataset[dataAttr]}"]`;
                    } else {
                        this.showToast('无法生成唯一的选择器，请尝试选择其他元素', 'error');
                        return null;
                    }
                }
            } catch (error) {
                customConsole.error(`选择器测试失败: ${finalSelector}`, error);
                this.showToast('无法生成有效的选择器，请尝试选择其他元素', 'error');
                return null;
            }

            return finalSelector;
        }

        showKeywordEditor() {
            const modal = document.createElement('div');
            modal.className = 'keyword-modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <h3>关键词管理</h3>
                    <textarea id="keywordInput">${this.settings.spamKeywords.join('\n')}</textarea>
                    <div class="modal-actions">
                        <button class="btn-cancel">取消</button>
                        <button class="btn-save">保存</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
            const textarea = DomUtils.safeQuery('#keywordInput', modal);
            const saveBtn = DomUtils.safeQuery('.btn-save', modal);
            const cancelBtn = DomUtils.safeQuery('.btn-cancel', modal);

            addSafeListener(saveBtn, 'click', () => {
                const keywords = textarea.value.split('\n').map(k => k.trim()).filter(k => k.length > 0);
                if (keywords.length > 0) {
                    this.settings.spamKeywords = keywords;
                    ConfigManager.updateFilterSettings(this.settings);
                    customConsole.log('保存自定义屏蔽词:', keywords);
                    logWrapper('userActions', 'LOG', `Updated spam keywords: ${keywords.join(', ')}`);
                    this.postFilter.updateFilters();
                    document.body.removeChild(modal);
                    this.showToast('关键词已更新', 'success');
                } else {
                    this.showToast('请至少输入一个关键词', 'error');
                }
            });
            addSafeListener(cancelBtn, 'click', () => document.body.removeChild(modal));
        }

        showUndoList() {
            const modal = document.createElement('div');
            modal.className = 'block-modal';
            const permItems = this.settings.blockedElements.length > 0 ?
                this.settings.blockedElements.map((sel, i) => `
                    <div class="blocked-item">
                        <span>[永久] ${sel}</span>
                        <button class="btn-undo" data-index="${i}" data-type="perm">撤销</button>
                    </div>
                `).join('') : '';
            const tempItems = this.settings.tempBlockedElements.length > 0 ?
                this.settings.tempBlockedElements.map((sel, i) => `
                    <div class="blocked-item">
                        <span>[临时] ${sel}</span>
                        <button class="btn-undo" data-index="${i}" data-type="temp">撤销</button>
                    </div>
                `).join('') : '';
            const listItems = permItems + tempItems || '<p>暂无屏蔽元素</p>';
            modal.innerHTML = `
                <div class="modal-content">
                    <h3>屏蔽元素列表</h3>
                    <p>点击“撤销”恢复显示对应元素</p>
                    ${listItems}
                    <div class="modal-actions">
                        <button class="btn-cancel">关闭</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
            DomUtils.safeQueryAll('.btn-undo', modal).forEach(btn => {
                addSafeListener(btn, 'click', () => {
                    const index = parseInt(btn.dataset.index);
                    const type = btn.dataset.type;
                    this.undoBlockElement(index, type);
                    document.body.removeChild(modal);
                    this.showUndoList();
                });
            });
            addSafeListener(DomUtils.safeQuery('.btn-cancel', modal), 'click', () => document.body.removeChild(modal));
        }

        undoBlockElement(index, type) {
            const blockList = type === 'temp' ? this.settings.tempBlockedElements : this.settings.blockedElements;
            if (index >= 0 && index < blockList.length) {
                const selector = blockList[index];
                blockList.splice(index, 1);
                ConfigManager.updateFilterSettings(this.settings);
                this.postFilter.updateFilters();
                DomUtils.safeQueryAll(selector).forEach(el => el.classList.remove('spam-hidden'));
                this.showToast(`已撤销屏蔽: ${selector}`, 'success');
                logWrapper('userActions', 'LOG', `Undid block (${type}): ${selector}`);
            }
            this.adjustPanelHeight();
        }

        exportConfig() {
            const config = { filter: this.settings, panel: this.panelSettings };
            const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `tieba_enhance_config_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            this.showToast('配置已导出', 'success');
            logWrapper('userActions', 'LOG', 'Exported configuration');
        }

        importConfig() {
            const modal = document.createElement('div');
            modal.className = 'keyword-modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <h3>导入配置</h3>
                    <p>请选择配置文件（JSON格式）</p>
                    <input type="file" accept=".json" id="configFileInput" />
                    <div class="modal-actions">
                        <button class="btn-cancel">取消</button>
                        <button class="btn-save">导入</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
            const fileInput = DomUtils.safeQuery('#configFileInput', modal);
            addSafeListener(DomUtils.safeQuery('.btn-save', modal), 'click', () => {
                const file = fileInput.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        try {
                            const importedConfig = JSON.parse(e.target.result);
                            this.settings = { ...ConfigManager.defaultFilterSettings, ...importedConfig.filter };
                            this.panelSettings = { ...ConfigManager.defaultPanelSettings, ...importedConfig.panel };
                            ConfigManager.updateFilterSettings(this.settings);
                            ConfigManager.updatePanelSettings(this.panelSettings);
                            this.postFilter.updateFilters();
                            this.loadContent();
                            if (this.panelSettings.minimized) this.minimizePanel(); else this.restorePanel();
                            this.applyDarkMode(this.settings.darkMode);
                            this.showToast('配置已导入', 'success');
                            logWrapper('userActions', 'LOG', 'Imported configuration');
                        } catch (err) {
                            this.showToast('配置文件无效', 'error');
                        }
                        document.body.removeChild(modal);
                    };
                    reader.readAsText(file);
                } else {
                    this.showToast('请选择一个配置文件', 'error');
                }
            });
            addSafeListener(DomUtils.safeQuery('.btn-cancel', modal), 'click', () => document.body.removeChild(modal));
        }

        toggleSearch() {
            const modal = document.createElement('div');
            modal.className = 'search-modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <h3>快速检索</h3>
                    <p>输入关键词搜索帖子内容（支持正则表达式）</p>
                    <input type="text" id="searchInput" placeholder="请输入关键词" />
                    <div class="modal-actions">
                        <button class="btn-cancel">关闭</button>
                        <button class="btn-search">搜索</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
            const searchInput = DomUtils.safeQuery('#searchInput', modal);
            addSafeListener(DomUtils.safeQuery('.btn-search', modal), 'click', () => {
                const keyword = searchInput.value.trim();
                if (keyword) this.performSearch(keyword);
            });
            addSafeListener(DomUtils.safeQuery('.btn-cancel', modal), 'click', () => document.body.removeChild(modal));
            searchInput.focus();
        }

        performSearch(keyword) {
            DomUtils.safeQueryAll('.highlight-match', this.postFilter.postContainer).forEach(el => el.replaceWith(el.textContent));
            const posts = DomUtils.safeQueryAll('.d_post_content', this.postFilter.postContainer);
            let regex;
            try {
                regex = new RegExp(keyword, 'gi');
            } catch {
                regex = new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
            }
            let found = false;
            posts.forEach(post => {
                if (regex.test(post.textContent)) {
                    post.innerHTML = post.innerHTML.replace(regex, match => `<span class="highlight-match">${match}</span>`);
                    post.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
                    found = true;
                }
            });
            this.showToast(found ? '搜索完成' : '未找到匹配内容', found ? 'success' : 'error');
            logWrapper('userActions', 'LOG', `Searched for keyword: ${keyword}, found: ${found}`);
        }

        showLogSaveDialog() {
            const modal = document.createElement('div');
            modal.className = 'log-modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <h3>保存日志</h3>
                    <p>点击“保存”将日志导出为文件（当前最多 ${MAX_LOG_ENTRIES} 条/分类）</p>
                    <div class="modal-actions">
                        <button class="btn-cancel">取消</button>
                        <button class="btn-save">保存</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
            addSafeListener(DomUtils.safeQuery('.btn-save', modal), 'click', () => {
                const fullLog = [
                    '=== 脚本运行日志 ===', ...logBuffer.script,
                    '\n=== 网页运行状态 ===', ...logBuffer.pageState,
                    '\n=== 网页行为 ===', ...logBuffer.pageBehavior,
                    '\n=== 用户操作 ===', ...logBuffer.userActions
                ].join('\n');
                const blob = new Blob([fullLog], { type: 'text/plain;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `tieba_enhance_log_${new Date().toISOString().replace(/[:.]/g, '-')}.txt`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                document.body.removeChild(modal);
                this.showToast('日志已保存', 'success');
                logWrapper('userActions', 'LOG', 'Saved logs to file');
            });
            addSafeListener(DomUtils.safeQuery('.btn-cancel', modal), 'click', () => document.body.removeChild(modal));
        }

        setupCleanup() {
            addSafeListener(window, 'beforeunload', () => {
                this.panel.remove();
                this.minimizedIcon.remove();
                this.debugPanel.remove();
                this.observer?.disconnect();
                if (this.listeners) {
                    removeSafeListener(document, 'mousemove', this.listeners.move);
                    removeSafeListener(document, 'click', this.listeners.click);
                }
            });
        }

        applyDarkMode(enable) {
            if (enable) document.body.classList.add('dark-mode');
            else document.body.classList.remove('dark-mode');
            logWrapper('pageBehavior', 'LOG', `Applied dark mode: ${enable}`);
        }

        showToast(message, type = 'info') {
            const toast = document.createElement('div');
            toast.textContent = message;
            toast.style.cssText = `
                position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
                background: ${type === 'success' ? '#34c759' : '#ff4444'};
                color: white;
                padding: 10px 20px;
                border-radius: 5px;
                z-index: 10001;
                transition: opacity 0.3s;
            `;
            document.body.appendChild(toast);
            setTimeout(() => {
                toast.style.opacity = '0';
                setTimeout(() => toast.remove(), 300);
            }, 2000);
            logWrapper('script', 'LOG', `Showed toast: ${message}`);
        }

        showErrorToast(methodName, error) {
            this.showToast(`${methodName}出错: ${error.message}`, 'error');
        }
    }

    // 十五、初始化
    const REFRESH_PREFIX = 'tieba_refresh_';
    let isRefreshScheduled = false;
    let hasRefreshedThisSession = false;

    function getPageRefreshKey() {
        return REFRESH_PREFIX + window.location.pathname;
    }

    function checkAndAutoRefresh() {
        if (isRefreshScheduled) {
            customConsole.log('当前页面已调度刷新，跳过重复调度');
            return;
        }
        
        const pageKey = getPageRefreshKey();
        const hasRefreshed = sessionStorage.getItem(pageKey);
        
        if (hasRefreshed) {
            customConsole.log('当前页面本次会话已刷新过，跳过自动刷新');
            return;
        }
        
        isRefreshScheduled = true;
        customConsole.log('首次打开此帖子页面，将执行强刷新');
    }

    function executeForceRefresh() {
        if (!isRefreshScheduled || hasRefreshedThisSession) return;
        
        hasRefreshedThisSession = true;
        const pageKey = getPageRefreshKey();
        sessionStorage.setItem(pageKey, 'true');
        
        customConsole.log('执行强刷新，绕过浏览器缓存');
        try {
            location.reload(true);
        } catch (error) {
            customConsole.error('强刷新失败:', error);
        }
    }

    addSafeListener(document, 'DOMContentLoaded', () => {
        checkAndAutoRefresh();
        new DynamicPanel();
        customConsole.log('DOM content loaded, script initialized');
        
        if (document.readyState === 'complete') {
            setTimeout(() => {
                executeForceRefresh();
            }, 500);
        } else {
            addSafeListener(window, 'load', () => {
                setTimeout(() => {
                    executeForceRefresh();
                }, 500);
            });
        }
    });

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(() => {
            if (!DomUtils.safeQuery('#enhanced-panel') && !DomUtils.safeQuery('#minimized-icon')) {
                checkAndAutoRefresh();
                new DynamicPanel();
                customConsole.log('Fallback initialization triggered');
                
                if (document.readyState === 'complete') {
                    setTimeout(() => {
                        executeForceRefresh();
                    }, 500);
                } else {
                    addSafeListener(window, 'load', () => {
                        setTimeout(() => {
                            executeForceRefresh();
                        }, 500);
                    });
                }
            }
        }, 50);
    }
})();