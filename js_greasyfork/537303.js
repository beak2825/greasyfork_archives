// ==UserScript==
// @name         Ultimate Web Optimizer
// @namespace    https://greasyfork.org/zh-CN/users/1474228-moyu001
// @version      2.1
// @description  全面的网页性能优化方案- 懒加载/预加载/预连接/布局优化
// @author       moyu001
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_log
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/537303/Ultimate%20Web%20Optimizer.user.js
// @updateURL https://update.greasyfork.org/scripts/537303/Ultimate%20Web%20Optimizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ========================
    // 工具函数 - 提前定义
    // ========================

    /**
     * 防抖函数
     * @param {Function} fn 要防抖的函数
     * @param {number} delay 延迟时间
     * @returns {Function} 防抖后的函数
     */
    function debounce(fn, delay) {
        let timer = null;
        return function(...args) {
            clearTimeout(timer);
            timer = setTimeout(() => fn.apply(this, args), delay);
        };
    }

    /**
     * 节流函数
     * @param {Function} func 要节流的函数
     * @param {number} limit 限制时间
     * @returns {Function} 节流后的函数
     */
    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * 安全的 URL 解析
     * @param {string} url URL 字符串
     * @param {string} base 基准 URL
     * @returns {URL|null} URL 对象或 null
     */
    function safeParseURL(url, base) {
        try {
            return new URL(url, base);
        } catch {
            return null;
        }
    }

    /**
     * 检查元素是否可见
     * @param {Element} element 要检查的元素
     * @returns {boolean} 是否可见
     */
    function isElementVisible(element) {
        if (!element) return false;
        const style = window.getComputedStyle(element);
        return style.display !== 'none' &&
               style.visibility !== 'hidden' &&
               style.opacity !== '0';
    }

    /**
     * 深度合并对象
     * @param {Object} target 目标对象
     * @param {Object} source 源对象
     * @returns {Object} 合并后的对象
     */
    function deepMerge(target, source) {
        const result = { ...target };

        for (const key in source) {
            if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                result[key] = deepMerge(result[key] || {}, source[key]);
            } else {
                result[key] = source[key];
            }
        }

        return result;
    }

    /**
     * 检查是否为 HTML 图片元素 - 增强类型检查
     * @param {Node} node DOM 节点
     * @returns {boolean} 是否为图片元素
     */
    function isImageElement(node) {
        return node instanceof HTMLImageElement;
    }

    /**
     * 延迟函数
     * @param {number} ms 延迟毫秒数
     * @returns {Promise} Promise 对象
     */
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * 简单的 LRU 缓存实现
     */
    class LRUCache {
        constructor(maxSize = 100) {
            this.maxSize = maxSize;
            this.cache = new Map();
        }

        get(key) {
            if (this.cache.has(key)) {
                const value = this.cache.get(key);
                this.cache.delete(key);
                this.cache.set(key, value);
                return value;
            }
            return null;
        }

        set(key, value) {
            if (this.cache.has(key)) {
                this.cache.delete(key);
            } else if (this.cache.size >= this.maxSize) {
                const firstKey = this.cache.keys().next().value;
                this.cache.delete(firstKey);
            }
            this.cache.set(key, value);
        }

        has(key) {
            return this.cache.has(key);
        }

        clear() {
            this.cache.clear();
        }

        get size() {
            return this.cache.size;
        }
    }

    /**
     * 重试操作工具类 - 新增错误重试机制
     */
    class RetryableOperation {
        /**
         * 执行带重试的操作
         * @param {Function} operation 要执行的操作
         * @param {number} maxRetries 最大重试次数
         * @param {number} baseDelay 基础延迟时间
         * @returns {Promise} 操作结果
         */
        static async executeWithRetry(operation, maxRetries = 3, baseDelay = 1000) {
            for (let i = 0; i < maxRetries; i++) {
                try {
                    return await operation();
                } catch (e) {
                    if (i === maxRetries - 1) throw e;
                    await delay(baseDelay * (i + 1));
                }
            }
        }
    }

    /**
     * 性能监控器
     */
    class PerformanceMonitor {
        constructor(debug = false) {
            this.debug = debug;
            this.metrics = new Map();
            this.counters = new Map();
        }

        start(name) {
            if (this.debug) {
                this.metrics.set(name, performance.now());
            }
        }

        end(name) {
            if (this.debug && this.metrics.has(name)) {
                const duration = performance.now() - this.metrics.get(name);
                console.log(`[性能] ${name}: ${duration.toFixed(2)}ms`);
                this.metrics.delete(name);
                return duration;
            }
            return 0;
        }

        count(name) {
            if (this.debug) {
                this.counters.set(name, (this.counters.get(name) || 0) + 1);
            }
        }

        getCounter(name) {
            return this.counters.get(name) || 0;
        }

        profile(name, fn) {
            if (!this.debug) return fn();

            const start = performance.now();
            const result = fn();
            const end = performance.now();
            console.log(`[性能] ${name}: ${(end - start).toFixed(2)}ms`);
            return result;
        }

        log(message, ...args) {
            if (this.debug) {
                console.log(`[优化器] ${message}`, ...args);
            }
        }

        warn(message, ...args) {
            if (this.debug) {
                console.warn(`[优化器] ${message}`, ...args);
            }
        }

        error(message, ...args) {
            if (this.debug) {
                console.error(`[优化器] ${message}`, ...args);
            }
        }
    }

    // ========================
    // 配置管理系统
    // ========================

    /**
     * 配置管理器 - 使用深度合并
     */
    class ConfigManager {
        constructor() {
            this.defaultConfig = {
                debug: false,

                // 全局黑名单
                globalBlacklist: [
                    // 可以添加需要完全跳过优化的域名
                ],

                // 懒加载配置
                lazyLoad: {
                    enabled: true,
                    minSize: 100,
                    rootMargin: '200px',
                    threshold: 0.01,
                    skipHidden: true,
                    batchSize: 32,
                    blacklist: []
                },

                // 预连接配置
                preconnect: {
                    enabled: true,
                    maxConnections: 5,
                    whitelist: [
                        // CDN 和字体服务
                        'fonts.gstatic.com',
                        'fonts.googleapis.com',
                        'fonts.googleapis.cn',
                        'fonts.loli.net',

                        // 常用 CDN
                        'cdnjs.cloudflare.com',
                        'cdn.jsdelivr.net',
                        'unpkg.com',
                        'cdn.bootcdn.net',
                        'cdn.bootcss.com',
                        'libs.baidu.com',
                        'cdn.staticfile.org',

                        // 其他常用服务
                        'ajax.googleapis.com',
                        'code.jquery.com',
                        'maxcdn.bootstrapcdn.com',
                        'kit.fontawesome.com',
                        'lf3-cdn-tos.bytecdntp.com',
                        'unpkg.zhimg.com',
                        'npm.elemecdn.com',
                        'g.alicdn.com'
                    ],
                    blacklist: []
                },

                // 预加载配置
                preload: {
                    enabled: true,
                    maxPreloads: 5,
                    types: ['css', 'js', 'woff2', 'woff'],
                    fetchTimeout: 5000,
                    retryAttempts: 3,
                    blacklist: []
                },

                // 布局稳定性配置
                layout: {
                    enabled: true,
                    stableImages: true,
                    stableIframes: true,
                    blacklist: []
                }
            };

            this.config = this.loadConfig();
            this.validateConfig();
        }

        loadConfig() {
            try {
                const saved = GM_getValue('optimizer_config_v2', null);
                if (saved) {
                    // 使用深度合并替代浅合并
                    return deepMerge(this.defaultConfig, JSON.parse(saved));
                }
            } catch (e) {
                console.warn('[配置] 加载用户配置失败，使用默认配置', e);
            }
            return deepMerge({}, this.defaultConfig);
        }

        saveConfig() {
            try {
                GM_setValue('optimizer_config_v2', JSON.stringify(this.config));
            } catch (e) {
                console.warn('[配置] 保存配置失败', e);
            }
        }

        validateConfig() {
            // 基本类型验证
            if (typeof this.config.debug !== 'boolean') {
                this.config.debug = this.defaultConfig.debug;
            }

            // 确保数组类型配置正确
            ['globalBlacklist'].forEach(key => {
                if (!Array.isArray(this.config[key])) {
                    this.config[key] = [...this.defaultConfig[key]];
                }
            });

            // 验证子配置
            ['lazyLoad', 'preconnect', 'preload', 'layout'].forEach(module => {
                if (!this.config[module] || typeof this.config[module] !== 'object') {
                    this.config[module] = deepMerge({}, this.defaultConfig[module]);
                }
            });
        }

        get(path) {
            const keys = path.split('.');
            let value = this.config;
            for (const key of keys) {
                value = value?.[key];
                if (value === undefined) break;
            }
            return value;
        }

        set(path, value) {
            const keys = path.split('.');
            const lastKey = keys.pop();
            let target = this.config;

            for (const key of keys) {
                if (!target[key] || typeof target[key] !== 'object') {
                    target[key] = {};
                }
                target = target[key];
            }

            target[lastKey] = value;
            this.saveConfig();
        }

        isBlacklisted(hostname, module = null) {
            // 检查全局黑名单
            if (this.config.globalBlacklist.some(domain => hostname.includes(domain))) {
                return true;
            }

            // 检查模块特定黑名单
            if (module && this.config[module]?.blacklist) {
                return this.config[module].blacklist.some(domain => hostname.includes(domain));
            }

            return false;
        }
    }

    // ========================
    // 核心优化模块
    // ========================

    /**
     * 懒加载管理器 - 增强类型检查
     */
    class LazyLoadManager {
        constructor(config, monitor) {
            this.config = config;
            this.monitor = monitor;
            this.observer = null;
            this.mutationObserver = null;
            this.processedImages = new Set();
            this.pendingImages = [];
            this.batchScheduled = false;
            this.processedElements = new WeakSet(); // 避免重复处理
        }

        init() {
            if (!this.config.get('lazyLoad.enabled')) {
                this.monitor.log('懒加载功能已禁用');
                return;
            }

            if (this.config.isBlacklisted(location.hostname, 'lazyLoad')) {
                this.monitor.log('当前站点在懒加载黑名单中');
                return;
            }

            this.monitor.start('lazyLoad-init');
            this.setupIntersectionObserver();
            this.processExistingImages();
            this.setupMutationObserver();
            this.monitor.end('lazyLoad-init');
        }

        setupIntersectionObserver() {
            if (!('IntersectionObserver' in window)) {
                this.monitor.warn('浏览器不支持 IntersectionObserver，使用兼容模式');
                this.setupFallbackMode();
                return;
            }

            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.restoreImage(entry.target);
                        this.observer.unobserve(entry.target);
                        this.monitor.count('lazy-loaded-images');
                    }
                });
            }, {
                rootMargin: this.config.get('lazyLoad.rootMargin'),
                threshold: this.config.get('lazyLoad.threshold')
            });
        }

        setupFallbackMode() {
            const checkVisible = throttle(() => {
                const images = document.querySelectorAll('img[data-lazy-src]');
                const margin = parseInt(this.config.get('lazyLoad.rootMargin')) || 200;

                images.forEach(img => {
                    const rect = img.getBoundingClientRect();
                    if (rect.top < window.innerHeight + margin) {
                        this.restoreImage(img);
                    }
                });
            }, 200);

            window.addEventListener('scroll', checkVisible, { passive: true });
            window.addEventListener('resize', checkVisible, { passive: true });
            checkVisible();
        }

        isLazyCandidate(img) {
            // 基本检查 - 使用更严格的类型检查
            if (!isImageElement(img)) return false;
            if (this.processedElements.has(img)) return false;
            if (img.hasAttribute('data-lazy-processed')) return false;
            if (img.loading === 'eager') return false;
            if (img.complete && img.src) return false;
            if (img.src && img.src.startsWith('data:')) return false;

            // 跳过已有懒加载的图片
            if (img.hasAttribute('data-src') || img.hasAttribute('data-srcset')) return false;

            // 尺寸检查
            const minSize = this.config.get('lazyLoad.minSize');
            const rect = img.getBoundingClientRect();
            if (rect.width < minSize || rect.height < minSize) return false;

            // 可见性检查
            if (this.config.get('lazyLoad.skipHidden') && !isElementVisible(img)) {
                return false;
            }

            return true;
        }

        processImage(img) {
            if (!this.isLazyCandidate(img)) return false;

            // 标记为已处理
            this.processedElements.add(img);
            img.setAttribute('data-lazy-processed', 'true');

            // 设置原生懒加载（如果支持）
            if ('loading' in HTMLImageElement.prototype) {
                img.loading = 'lazy';
            }

            // 保存原始 src
            if (img.src) {
                img.setAttribute('data-lazy-src', img.src);
                img.removeAttribute('src');
            }
            if (img.srcset) {
                img.setAttribute('data-lazy-srcset', img.srcset);
                img.removeAttribute('srcset');
            }

            // 添加到观察者
            if (this.observer) {
                this.observer.observe(img);
            }

            this.processedImages.add(img);
            this.monitor.count('processed-images');
            return true;
        }

        restoreImage(img) {
            const src = img.getAttribute('data-lazy-src');
            const srcset = img.getAttribute('data-lazy-srcset');

            if (src) {
                img.src = src;
                img.removeAttribute('data-lazy-src');
            }
            if (srcset) {
                img.srcset = srcset;
                img.removeAttribute('data-lazy-srcset');
            }

            this.processedImages.delete(img);
        }

        batchProcess(images) {
            const batchSize = this.config.get('lazyLoad.batchSize');
            let processed = 0;

            const processBatch = () => {
                const end = Math.min(processed + batchSize, images.length);

                for (let i = processed; i < end; i++) {
                    this.processImage(images[i]);
                }

                processed = end;

                if (processed < images.length) {
                    (window.requestIdleCallback || window.requestAnimationFrame)(processBatch);
                } else {
                    this.monitor.log(`懒加载处理完成，共处理 ${processed} 张图片`);
                }
            };

            processBatch();
        }

        processExistingImages() {
            const images = Array.from(document.querySelectorAll('img'));
            this.monitor.log(`发现 ${images.length} 张图片，开始批量处理`);
            this.batchProcess(images);
        }

        // 改进的批处理调度 - 更好的并发控制
        scheduleBatchProcess() {
            if (this.batchScheduled || this.pendingImages.length === 0) return;

            this.batchScheduled = true;
            (window.requestIdleCallback || window.requestAnimationFrame)(() => {
                const images = [...this.pendingImages];
                this.pendingImages = [];
                this.batchScheduled = false;

                let processedCount = 0;
                images.forEach(img => {
                    if (this.processImage(img)) {
                        processedCount++;
                    }
                });

                if (processedCount > 0) {
                    this.monitor.log(`动态处理 ${processedCount} 张新图片`);
                }
            });
        }

        setupMutationObserver() {
            let pendingMutations = [];
            let processingScheduled = false;

            const processMutations = () => {
                const mutations = [...pendingMutations];
                pendingMutations = [];
                processingScheduled = false;

                mutations.forEach(mutation => {
                    // 处理新增节点
                    mutation.addedNodes.forEach(node => {
                        if (isImageElement(node)) {
                            this.pendingImages.push(node);
                        } else if (node.querySelectorAll) {
                            const images = node.querySelectorAll('img');
                            this.pendingImages.push(...Array.from(images));
                        }
                    });

                    // 清理移除的节点
                    mutation.removedNodes.forEach(node => {
                        if (isImageElement(node) && this.observer) {
                            this.observer.unobserve(node);
                            this.processedImages.delete(node);
                            this.processedElements.delete && this.processedElements.delete(node);
                        }
                    });
                });

                this.scheduleBatchProcess();
            };

            this.mutationObserver = new MutationObserver((mutations) => {
                pendingMutations.push(...mutations);

                if (!processingScheduled) {
                    processingScheduled = true;
                    (window.requestIdleCallback || window.requestAnimationFrame)(processMutations);
                }
            });

            this.mutationObserver.observe(document.body, {
                childList: true,
                subtree: true
            });
        }

        destroy() {
            if (this.observer) {
                this.observer.disconnect();
                this.observer = null;
            }
            if (this.mutationObserver) {
                this.mutationObserver.disconnect();
                this.mutationObserver = null;
            }

            // 恢复所有处理过的图片
            this.processedImages.forEach(img => this.restoreImage(img));
            this.processedImages.clear();
        }
    }

    /**
     * 预加载管理器 - 改进异步处理
     */
    class PreloadManager {
        constructor(config, monitor) {
            this.config = config;
            this.monitor = monitor;
            this.preloaded = new LRUCache(this.config.get('preload.maxPreloads'));
            this.cssCache = new LRUCache(50);
            this.mutationObserver = null;
        }

        async init() {
            if (!this.config.get('preload.enabled')) {
                this.monitor.log('预加载功能已禁用');
                return;
            }

            if (this.config.isBlacklisted(location.hostname, 'preload')) {
                this.monitor.log('当前站点在预加载黑名单中');
                return;
            }

            this.monitor.start('preload-init');
            await this.scanExistingResources(); // 改为异步
            this.setupMutationObserver();
            this.monitor.end('preload-init');
        }

        getResourceType(url) {
            const ext = url.split('.').pop()?.toLowerCase();
            const types = this.config.get('preload.types');

            if (!types.includes(ext)) return null;

            switch (ext) {
                case 'css': return 'style';
                case 'js': return 'script';
                case 'woff':
                case 'woff2':
                case 'ttf':
                case 'otf': return 'font';
                default: return null;
            }
        }

        doPreload(url, asType) {
            if (this.preloaded.has(url) || this.preloaded.size >= this.config.get('preload.maxPreloads')) {
                return false;
            }

            try {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = asType;
                link.href = url;

                if (asType === 'font') {
                    link.crossOrigin = 'anonymous';
                    // 设置正确的 MIME 类型
                    if (url.includes('.woff2')) link.type = 'font/woff2';
                    else if (url.includes('.woff')) link.type = 'font/woff';
                    else if (url.includes('.ttf')) link.type = 'font/ttf';
                    else if (url.includes('.otf')) link.type = 'font/otf';
                }

                document.head.appendChild(link);
                this.preloaded.set(url, true);
                this.monitor.log(`预加载 ${asType}: ${url}`);
                this.monitor.count('preloaded-resources');
                return true;
            } catch (e) {
                this.monitor.warn(`预加载失败: ${url}`, e);
                return false;
            }
        }

        async extractFontsFromCSS(cssUrl) {
            if (this.cssCache.has(cssUrl)) {
                return this.cssCache.get(cssUrl);
            }

            const operation = async () => {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), this.config.get('preload.fetchTimeout'));

                try {
                    const response = await fetch(cssUrl, {
                        signal: controller.signal,
                        mode: 'cors',
                        credentials: 'omit'
                    });

                    clearTimeout(timeoutId);

                    if (!response.ok) throw new Error(`HTTP ${response.status}`);

                    const text = await response.text();
                    const fontUrls = [];
                    const fontRegex = /url\(["']?([^")']+\.(woff2?|ttf|otf))["']?\)/gi;
                    let match;

                    while ((match = fontRegex.exec(text)) !== null) {
                        const fontUrl = safeParseURL(match[1], cssUrl);
                        if (fontUrl) {
                            fontUrls.push(fontUrl.href);
                        }
                    }

                    this.cssCache.set(cssUrl, fontUrls);
                    return fontUrls;
                } finally {
                    clearTimeout(timeoutId);
                }
            };

            try {
                // 使用重试机制
                return await RetryableOperation.executeWithRetry(
                    operation,
                    this.config.get('preload.retryAttempts')
                );
            } catch (e) {
                this.monitor.warn(`提取字体失败: ${cssUrl}`, e.message);
                this.cssCache.set(cssUrl, []);
                return [];
            }
        }

        // 改进的异步资源扫描 - 更好的并发控制
        async scanExistingResources() {
            // 处理 CSS 文件
            const cssLinks = Array.from(document.querySelectorAll('link[rel="stylesheet"][href]'));
            const jsScripts = Array.from(document.querySelectorAll('script[src]'));

            // 处理 CSS 文件的 Promise 数组
            const cssPromises = cssLinks.map(async link => {
                const cssUrl = link.href;
                const asType = this.getResourceType(cssUrl);

                if (asType === 'style') {
                    this.doPreload(cssUrl, asType);

                    // 异步提取和预加载字体
                    try {
                        const fontUrls = await this.extractFontsFromCSS(cssUrl);
                        fontUrls.forEach(fontUrl => {
                            const fontType = this.getResourceType(fontUrl);
                            if (fontType === 'font') {
                                this.doPreload(fontUrl, fontType);
                            }
                        });
                    } catch (e) {
                        // 忽略字体提取错误，不影响主流程
                        this.monitor.warn(`CSS处理失败: ${cssUrl}`, e);
                    }
                }
            });

            // 处理 JS 文件
            jsScripts.forEach(script => {
                const asType = this.getResourceType(script.src);
                if (asType === 'script') {
                    this.doPreload(script.src, asType);
                }
            });

            // 等待所有 CSS 处理完成，但不阻塞初始化
            try {
                await Promise.allSettled(cssPromises);
                this.monitor.log(`资源扫描完成，处理了 ${cssLinks.length} 个CSS文件和 ${jsScripts.length} 个JS文件`);
            } catch (e) {
                this.monitor.warn('资源扫描过程中出现错误', e);
            }
        }

        setupMutationObserver() {
            this.mutationObserver = new MutationObserver(debounce(async (mutations) => {
                const newCSSLinks = [];
                const newJSScripts = [];

                mutations.forEach(mutation => {
                    mutation.addedNodes.forEach(node => {
                        if (node.tagName === 'LINK' && node.rel === 'stylesheet' && node.href) {
                            newCSSLinks.push(node);
                        } else if (node.tagName === 'SCRIPT' && node.src) {
                            newJSScripts.push(node);
                        }
                    });
                });

                // 异步处理新添加的资源
                if (newCSSLinks.length > 0 || newJSScripts.length > 0) {
                    const promises = newCSSLinks.map(async node => {
                        const asType = this.getResourceType(node.href);
                        if (asType === 'style') {
                            this.doPreload(node.href, asType);

                            // 异步处理字体
                            try {
                                const fontUrls = await this.extractFontsFromCSS(node.href);
                                fontUrls.forEach(fontUrl => {
                                    const fontType = this.getResourceType(fontUrl);
                                    if (fontType === 'font') {
                                        this.doPreload(fontUrl, fontType);
                                    }
                                });
                            } catch (e) {
                                // 忽略错误
                            }
                        }
                    });

                    newJSScripts.forEach(node => {
                        const asType = this.getResourceType(node.src);
                        if (asType === 'script') {
                            this.doPreload(node.src, asType);
                        }
                    });

                    // 不等待 Promise 完成，避免阻塞
                    Promise.allSettled(promises).then(() => {
                        this.monitor.log(`动态处理了 ${newCSSLinks.length} 个CSS和 ${newJSScripts.length} 个JS`);
                    });
                }
            }, 200));

            this.mutationObserver.observe(document.body, {
                childList: true,
                subtree: true
            });
        }

        destroy() {
            if (this.mutationObserver) {
                this.mutationObserver.disconnect();
                this.mutationObserver = null;
            }
            this.preloaded.clear();
            this.cssCache.clear();
        }
    }

    // 其他管理器类保持不变，仅引用已改进的配置和监控器
    class PreconnectManager {
        constructor(config, monitor) {
            this.config = config;
            this.monitor = monitor;
            this.connected = new LRUCache(this.config.get('preconnect.maxConnections'));
            this.mutationObserver = null;
        }

        init() {
            if (!this.config.get('preconnect.enabled')) {
                this.monitor.log('预连接功能已禁用');
                return;
            }

            if (this.config.isBlacklisted(location.hostname, 'preconnect')) {
                this.monitor.log('当前站点在预连接黑名单中');
                return;
            }

            this.monitor.start('preconnect-init');
            this.scanExistingResources();
            this.setupMutationObserver();
            this.monitor.end('preconnect-init');
        }

        shouldPreconnect(hostname) {
            if (!hostname || hostname === location.hostname) return false;
            if (this.connected.has(hostname)) return false;

            const whitelist = this.config.get('preconnect.whitelist');
            return whitelist.some(domain => hostname.endsWith(domain));
        }

        doPreconnect(hostname) {
            if (!this.shouldPreconnect(hostname)) return false;

            try {
                const link = document.createElement('link');
                link.rel = 'preconnect';
                link.href = `https://${hostname}`;
                link.crossOrigin = 'anonymous';
                document.head.appendChild(link);

                this.connected.set(hostname, true);
                this.monitor.log(`预连接: ${hostname}`);
                this.monitor.count('preconnected-domains');
                return true;
            } catch (e) {
                this.monitor.warn(`预连接失败: ${hostname}`, e);
                return false;
            }
        }

        extractHostnames(elements) {
            const hostnames = new Set();

            elements.forEach(el => {
                const url = safeParseURL(el.src || el.href);
                if (url && url.hostname !== location.hostname) {
                    hostnames.add(url.hostname);
                }
            });

            return Array.from(hostnames);
        }

        scanExistingResources() {
            const selectors = [
                'script[src]',
                'link[href]',
                'img[src]',
                'audio[src]',
                'video[src]',
                'source[src]'
            ];

            const elements = document.querySelectorAll(selectors.join(','));
            const hostnames = this.extractHostnames(elements);

            let connected = 0;
            hostnames.forEach(hostname => {
                if (this.doPreconnect(hostname)) {
                    connected++;
                }
            });

            this.monitor.log(`扫描完成，预连接 ${connected} 个域名`);
        }

        setupMutationObserver() {
            this.mutationObserver = new MutationObserver(debounce((mutations) => {
                const newElements = [];

                mutations.forEach(mutation => {
                    mutation.addedNodes.forEach(node => {
                        if (node.src || node.href) {
                            newElements.push(node);
                        } else if (node.querySelectorAll) {
                            const elements = node.querySelectorAll('script[src], link[href], img[src]');
                            newElements.push(...elements);
                        }
                    });
                });

                if (newElements.length > 0) {
                    const hostnames = this.extractHostnames(newElements);
                    hostnames.forEach(hostname => this.doPreconnect(hostname));
                }
            }, 200));

            this.mutationObserver.observe(document.body, {
                childList: true,
                subtree: true
            });
        }

        destroy() {
            if (this.mutationObserver) {
                this.mutationObserver.disconnect();
                this.mutationObserver = null;
            }
            this.connected.clear();
        }
    }

    class LayoutStabilizer {
        constructor(config, monitor) {
            this.config = config;
            this.monitor = monitor;
            this.injectedStyle = null;
        }

        init() {
            if (!this.config.get('layout.enabled')) {
                this.monitor.log('布局优化功能已禁用');
                return;
            }

            if (this.config.isBlacklisted(location.hostname, 'layout')) {
                this.monitor.log('当前站点在布局优化黑名单中');
                return;
            }

            this.monitor.start('layout-init');
            this.injectStabilizationStyles();
            this.monitor.end('layout-init');
        }

        generateCSS() {
            const styles = [];

            if (this.config.get('layout.stableImages')) {
                styles.push(`
                    /* 图片布局稳定性优化 */
                    img:not([width]):not([height]):not([style*="width"]):not([style*="height"]) {
                        min-height: 1px;
                        // max-width: 100%;
                        // height: auto;
                    }

                    /* 现代浏览器的 aspect-ratio 支持 */
                    @supports (aspect-ratio: 1/1) {
                        img[width][height]:not([style*="aspect-ratio"]) {
                            aspect-ratio: attr(width) / attr(height);
                        }
                    }
                `);
            }

            if (this.config.get('layout.stableIframes')) {
                styles.push(`
                    /* iframe 布局稳定性优化 */
                    iframe:not([width]):not([height]):not([style*="width"]):not([style*="height"]) {
                        // width: 100%;
                        // height: auto;
                        min-height: 1px;
                    }

                    @supports (aspect-ratio: 16/9) {
                        iframe:not([style*="aspect-ratio"]) {
                            aspect-ratio: 16/9;
                        }
                    }
                `);
            }

            return styles.join('\n');
        }

        injectStabilizationStyles() {
            const css = this.generateCSS().trim();
            if (!css) return;

            try {
                this.injectedStyle = document.createElement('style');
                this.injectedStyle.setAttribute('data-optimizer', 'layout-stabilizer');
                this.injectedStyle.textContent = css;

                // 优先插入到 head，如果不存在则插入到 document
                const target = document.head || document.documentElement;
                target.appendChild(this.injectedStyle);

                this.monitor.log('布局稳定性样式已注入');
            } catch (e) {
                this.monitor.warn('注入布局样式失败', e);
            }
        }

        destroy() {
            if (this.injectedStyle && this.injectedStyle.parentNode) {
                this.injectedStyle.parentNode.removeChild(this.injectedStyle);
                this.injectedStyle = null;
                this.monitor.log('布局样式已移除');
            }
        }
    }

    // ========================
    // 主优化器
    // ========================

    /**
     * 主优化器类 - v2.0
     */
    class WebOptimizer {
        constructor() {
            this.config = new ConfigManager();
            this.monitor = new PerformanceMonitor(this.config.get('debug'));

            // 优化模块
            this.modules = {
                lazyLoad: new LazyLoadManager(this.config, this.monitor),
                preconnect: new PreconnectManager(this.config, this.monitor),
                preload: new PreloadManager(this.config, this.monitor),
                layout: new LayoutStabilizer(this.config, this.monitor)
            };

            this.initialized = false;
            this.cleanupTasks = [];
        }

        async init() {
            if (this.initialized) return;

            this.monitor.start('total-init');
            this.monitor.log('Web Optimizer Enhanced v2.0 开始初始化');

            // 检查全局黑名单
            if (this.config.isBlacklisted(location.hostname)) {
                this.monitor.log('当前站点在全局黑名单中，跳过所有优化');
                return;
            }

            try {
                // 等待 DOM 基本可用
                if (document.readyState === 'loading') {
                    await new Promise(resolve => {
                        document.addEventListener('DOMContentLoaded', resolve, { once: true });
                    });
                }

                // 初始化各个模块 - 改进的错误隔离
                const initPromises = Object.entries(this.modules).map(async ([name, module]) => {
                    try {
                        this.monitor.start(`init-${name}`);
                        await module.init();
                        this.monitor.end(`init-${name}`);
                        return { name, success: true };
                    } catch (e) {
                        this.monitor.error(`模块 ${name} 初始化失败`, e);
                        return { name, success: false, error: e };
                    }
                });

                const results = await Promise.allSettled(initPromises);
                const successCount = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
                this.monitor.log(`模块初始化完成，成功: ${successCount}/${Object.keys(this.modules).length}`);

                // 设置清理任务
                this.setupCleanupTasks();

                this.initialized = true;
                this.monitor.end('total-init');
                this.monitor.log('Web Optimizer Enhanced v2.0 初始化完成');

                // 显示初始化报告
                this.showInitReport();

            } catch (e) {
                this.monitor.error('初始化失败', e);
            }
        }

        setupCleanupTasks() {
            // 定期清理缓存
            const cleanupInterval = setInterval(() => {
                Object.values(this.modules).forEach(module => {
                    if (module.cssCache) module.cssCache.clear();
                    if (module.connected) module.connected.clear();
                    if (module.preloaded) module.preloaded.clear();
                });
                this.monitor.log('定期清理完成');
            }, 10 * 60 * 1000); // 10分钟

            this.cleanupTasks.push(() => clearInterval(cleanupInterval));

            // 页面卸载时清理
            const cleanup = () => {
                this.destroy();
            };

            window.addEventListener('beforeunload', cleanup);
            this.cleanupTasks.push(() => {
                window.removeEventListener('beforeunload', cleanup);
            });
        }

        showInitReport() {
            if (!this.config.get('debug')) return;

            console.groupCollapsed('[Web Optimizer Enhanced v2.0] 初始化报告');
            console.log('版本: 2.0');
            console.log('当前域名:', location.hostname);
            console.log('启用的功能:', Object.entries(this.config.config)
                .filter(([key, value]) => typeof value === 'object' && value.enabled)
                .map(([key]) => key)
            );

            // 显示性能计数器
            console.log('性能计数:', {
                'processed-images': this.monitor.getCounter('processed-images'),
                'lazy-loaded-images': this.monitor.getCounter('lazy-loaded-images'),
                'preconnected-domains': this.monitor.getCounter('preconnected-domains'),
                'preloaded-resources': this.monitor.getCounter('preloaded-resources')
            });

            console.log('配置详情:', this.config.config);
            console.groupEnd();
        }

        destroy() {
            if (!this.initialized) return;

            this.monitor.log('开始清理资源');

            // 清理各个模块
            Object.values(this.modules).forEach(module => {
                if (module.destroy) {
                    try {
                        module.destroy();
                    } catch (e) {
                        this.monitor.warn('模块清理失败', e);
                    }
                }
            });

            // 执行清理任务
            this.cleanupTasks.forEach(task => {
                try {
                    task();
                } catch (e) {
                    this.monitor.warn('清理任务执行失败', e);
                }
            });
            this.cleanupTasks = [];

            this.initialized = false;
            this.monitor.log('资源清理完成');
        }

        // 公共 API - 增强版
        updateConfig(path, value) {
            this.config.set(path, value);
            this.monitor.log(`配置已更新: ${path} = ${value}`);

            // 如果是调试模式变更，更新监控器
            if (path === 'debug') {
                this.monitor.debug = value;
            }
        }

        getStats() {
            return {
                initialized: this.initialized,
                version: '2.0',
                hostname: location.hostname,
                config: this.config.config,
                modules: Object.keys(this.modules),
                counters: {
                    'processed-images': this.monitor.getCounter('processed-images'),
                    'lazy-loaded-images': this.monitor.getCounter('lazy-loaded-images'),
                    'preconnected-domains': this.monitor.getCounter('preconnected-domains'),
                    'preloaded-resources': this.monitor.getCounter('preloaded-resources')
                }
            };
        }

        // 新增：性能报告
        getPerformanceReport() {
            const stats = this.getStats();
            const imageStats = {
                total: document.querySelectorAll('img').length,
                processed: stats.counters['processed-images'],
                lazyLoaded: stats.counters['lazy-loaded-images']
            };

            return {
                ...stats,
                performance: {
                    images: imageStats,
                    domains: stats.counters['preconnected-domains'],
                    resources: stats.counters['preloaded-resources'],
                    efficiency: imageStats.total > 0 ? (imageStats.processed / imageStats.total * 100).toFixed(1) + '%' : '0%'
                }
            };
        }
    }

    // ========================
    // 全局初始化
    // ========================

    // 创建全局实例
    const optimizer = new WebOptimizer();

    // 暴露到全局作用域（调试用）
    if (typeof window !== 'undefined') {
        window.WebOptimizer = optimizer;

        // v2.0 新增：暴露工具函数供调试使用
        window.WebOptimizerUtils = {
            debounce,
            throttle,
            safeParseURL,
            isElementVisible,
            deepMerge,
            delay,
            RetryableOperation
        };
    }

    // 启动优化器
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => optimizer.init());
    } else {
        // 延迟一点时间，确保页面基本稳定
        setTimeout(() => optimizer.init(), 100);
    }

})();
