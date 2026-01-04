// ==UserScript==
// @name         Web性能综合优化工具箱
// @namespace    http://tampermonkey.net/
// @version      3.5.0-chromium-optimized
// @description  Web浏览提速80% + 全面性能优化
// @author       KiwiFruit
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529387/Web%E6%80%A7%E8%83%BD%E7%BB%BC%E5%90%88%E4%BC%98%E5%8C%96%E5%B7%A5%E5%85%B7%E7%AE%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/529387/Web%E6%80%A7%E8%83%BD%E7%BB%BC%E5%90%88%E4%BC%98%E5%8C%96%E5%B7%A5%E5%85%B7%E7%AE%B1.meta.js
// ==/UserScript==
(function () {
    'use strict';

    // ========================
    // 0. 启用开关
    // ========================
    if (!localStorage.getItem('PerfOptEnabled')) {
        console.log('[PerfOpt] 未启用。执行：localStorage.setItem("PerfOptEnabled", "1"); location.reload();');
        return;
    }

    // ========================
    // 1. 新增：空闲任务调度器（Chromium 专用）
    // ========================
    const IdleTaskScheduler = {
        schedule(taskFn, options = {}) {
            const { timeout = 2000 } = options;
            try {
                return requestIdleCallback((deadline) => {
                    try { taskFn(deadline); } catch (e) {
                        console.warn('[IdleTaskScheduler] Task error', e);
                    }
                }, { timeout });
            } catch (e) {
                setTimeout(() => {
                    try { taskFn({ didTimeout: true, timeRemaining: () => Infinity }); }
                    catch (e) { console.warn('[IdleTaskScheduler] Fallback task error', e); }
                }, 0);
            }
        },

        scheduleChunked(items, processor, options = {}) {
            const { chunkSize = 5, timeout = 3000 } = options;
            let index = 0;
            const total = items.length;

            const processChunk = (deadline) => {
                let count = 0;
                while (
                    index < total &&
                    count < chunkSize &&
                    (deadline.timeRemaining() > 1 || deadline.didTimeout)
                ) {
                    try { processor(items[index], index, items); }
                    catch (e) { console.warn('[IdleTaskScheduler] Chunk error', e); }
                    index++;
                    count++;
                }

                if (index < total) {
                    this.schedule(processChunk, { timeout });
                }
            };

            this.schedule(processChunk, { timeout });
        }
    };

    // ========================
    // 2. 基础工具与环境检测
    // ========================
    const Environment = {
        features: {
            nativeLazyLoad: 'loading' in HTMLImageElement.prototype,
            intersectionObserver: 'IntersectionObserver' in window,
            webWorker: 'Worker' in window,
            performanceObserver: 'PerformanceObserver' in window
        },
        performanceTier: (() => {
            if (navigator.hardwareConcurrency >= 4) return 2;
            if (window.devicePixelRatio <= 1.5) return 1;
            return 0;
        })(),
        networkType: navigator.connection?.effectiveType || 'unknown',
        isLowPerformance() {
            return this.performanceTier === 0 || this.networkType === '2g';
        }
    };

    const Config = (() => {
        const config = {
            debug: false,
            throttleDelay: 200,
            debounceDelay: 300,
            retryAttempts: 3,
            retryDelay: 1000,
            lazyLoad: { enabled: true, selector: '.js-lazy-load', rootMargin: '100px 0px', preferNative: true },
            criticalCSS: { enabled: true, selectors: ['.js-critical-css'], preloadTimeout: 5000 },
            hardwareAcceleration: { enabled: true, selector: '.js-animate, .js-transform, .js-fade' },
            webWorker: { enabled: true, customTask: null },
            performanceMonitor: { enabled: false, metrics: ['fcp', 'lcp', 'cls'] },
            domAnalyzer: { enabled: true, maxDepth: 12 },
            contentVisibility: { enabled: true, selector: '.js-section' }
        };
        return {
            get(key) {
                const keys = key.split('.');
                return keys.reduce((obj, k) => obj?.[k], config);
            },
            set(key, value) {
                const keys = key.split('.');
                const lastKey = keys.pop();
                const target = keys.reduce((obj, k) => obj?.[k], config);
                if (target && typeof target[lastKey] !== 'undefined') {
                    const oldValue = target[lastKey];
                    target[lastKey] = value;
                    Logger.info('Config', `更新配置: ${key}=${value}（旧值: ${oldValue}）`);
                    return true;
                }
                Logger.error('Config', `配置键不存在: ${key}`);
                return false;
            },
            getAll() { return { ...config }; }
        };
    })();

    const Logger = {
        debug: (module, msg) => {
            if (Config.get('debug')) console.log(`[PerfOpt][${module}] DEBUG: ${msg}`);
        },
        info: (module, msg) => {
            if (Config.get('debug')) console.info(`[PerfOpt][${module}] INFO: ${msg}`);
        },
        warn: (module, msg) => {
            if (Config.get('debug')) console.warn(`[PerfOpt][${module}] WARN: ${msg}`);
        },
        error: (module, msg, error) => {
            if (Config.get('debug')) console.error(`[PerfOpt][${module}] ERROR: ${msg}`, error || '');
        }
    };

    // === 开发模式：布局抖动检测 ===
    if (Config.get('debug')) {
        const layoutProps = ['offsetTop', 'offsetLeft', 'offsetWidth', 'offsetHeight', 'clientWidth', 'clientHeight', 'scrollHeight', 'scrollWidth'];
        layoutProps.forEach(prop => {
            const original = Object.getOwnPropertyDescriptor(Element.prototype, prop);
            if (original && original.get) {
                Object.defineProperty(Element.prototype, prop, {
                    get() {
                        console.warn(`[PerfOpt][LayoutThrashing] 检测到布局读取: ${prop}`, this);
                        return original.get.call(this);
                    }
                });
            }
        });
    }

    function isSameOrigin(url) {
        try {
            return new URL(url, window.location.href).origin === window.location.origin;
        } catch (e) {
            return false;
        }
    }

    function prefetchDomain(url) {
        try {
            const origin = new URL(url, window.location.href).origin;
            if (!document.querySelector(`link[href="${origin}"]`)) {
                const link = document.createElement('link');
                link.rel = 'dns-prefetch preconnect';
                link.href = origin;
                document.head.appendChild(link);
            }
        } catch (e) {
            Logger.warn('Utils', '预连接失败', e);
        }
    }

    const Utils = {
        throttle: (func, delay) => {
            let lastCall = 0;
            return function (...args) {
                const now = Date.now();
                if (now - lastCall >= delay) {
                    lastCall = now;
                    func.apply(this, args);
                }
            };
        },
        debounce: (func, delay) => {
            let timer;
            return function (...args) {
                clearTimeout(timer);
                timer = setTimeout(() => func.apply(this, args), delay);
            };
        },
        loadWithRetry: async (loaderFn, moduleName) => {
            for (let i = 0; i < Config.get('retryAttempts'); i++) {
                try {
                    return await loaderFn();
                } catch (error) {
                    const isLastAttempt = i === Config.get('retryAttempts') - 1;
                    if (isLastAttempt) {
                        Logger.error(moduleName, `加载失败（已达最大重试次数）`, error);
                        throw error;
                    }
                    Logger.warn(moduleName, `加载失败，${Config.get('retryDelay')}ms后重试（${i + 1}/${Config.get('retryAttempts')}）`);
                    await new Promise(resolve => setTimeout(resolve, Config.get('retryDelay')));
                }
            }
        },
        safeGetData: (el, name, defaultValue) => {
            try {
                const value = el.dataset[name];
                if (!value) return defaultValue;
                if (value.match(/^[{[]/)) return JSON.parse(value);
                if (value.toLowerCase() === 'true') return true;
                if (value.toLowerCase() === 'false') return false;
                const num = Number(value);
                return !isNaN(num) ? num : value;
            } catch (e) {
                Logger.warn('Utils', `解析data-${name}失败`, e);
                return defaultValue;
            }
        },
        is: {
            func: v => typeof v === 'function',
            elem: v => v instanceof Element,
            str: v => typeof v === 'string',
            num: v => typeof v === 'number' && !isNaN(v)
        }
    };

    // ========================
    // 3. 基础类
    // ========================
    class BaseModule {
        constructor(moduleName) {
            this.moduleName = moduleName;
            this.initialized = false;
        }
        init() {
            if (this.initialized) {
                Logger.warn(this.moduleName, '已初始化');
                return;
            }
            this.initialized = true;
            Logger.info(this.moduleName, '初始化开始');
        }
        destroy() {
            if (!this.initialized) return;
            this.initialized = false;
            Logger.info(this.moduleName, '销毁完成');
        }
        emitEvent(eventName, detail = {}) {
            window.dispatchEvent(new CustomEvent(`perfopt:${this.moduleName}:${eventName}`, {
                detail: { ...detail, module: this.moduleName, timestamp: Date.now() }
            }));
        }
    }

    class BaseObserver extends BaseModule {
        constructor(moduleName, configKey) {
            super(moduleName);
            this.observer = null;
            this.configKey = configKey;
            this.observers = [];
        }
        createObserver(handleIntersect, rootMargin = '0px') {
            if (!Environment.features.intersectionObserver) {
                Logger.warn(this.moduleName, '不支持IntersectionObserver');
                return null;
            }
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.handleIntersect(entry.target);
                    } else {
                        this.handleLeave(entry.target);
                    }
                });
            }, { rootMargin, threshold: 0.01 });
            this.observers.push(observer);
            return observer;
        }
        observeElements(selector) {
            if (!selector || !this.observers.length) return;
            document.querySelectorAll(selector).forEach(el => {
                if (!el.dataset[this.moduleName + 'Observed']) {
                    this.observers[0].observe(el);
                    el.dataset[this.moduleName + 'Observed'] = 'true';
                }
            });
        }
        handleIntersect(target) { throw new Error('子类需实现handleIntersect方法'); }
        handleLeave(target) {}
        destroy() {
            super.destroy();
            this.observers.forEach(observer => observer.disconnect());
            this.observers = [];
        }
    }

    // ========================
    // 4. 模块实现
    // ========================

    class DomDepthAnalyzer extends BaseModule {
        constructor() {
            super('DomDepthAnalyzer');
        }
        init() {
            super.init();
            if (!Config.get('domAnalyzer.enabled') || Environment.isLowPerformance()) {
                Logger.info(this.moduleName, '已禁用或低性能设备跳过');
                return;
            }
            const allElements = Array.from(document.querySelectorAll('*'));
            const maxDepth = Config.get('domAnalyzer.maxDepth');
            const deepNodes = [];

            IdleTaskScheduler.scheduleChunked(
                allElements,
                (el, index) => {
                    let depth = 0;
                    let parent = el;
                    while (parent && parent !== document) {
                        depth++;
                        parent = parent.parentNode;
                        if (depth > maxDepth) break;
                    }
                    if (depth > maxDepth) {
                        deepNodes.push({ el, depth });
                        if (Config.get('debug')) {
                            el.style.outline = '2px solid orange';
                            el.title = `DOM深度: ${depth}`;
                        }
                    }
                },
                { chunkSize: 8 }
            ).finally(() => {
                if (deepNodes.length > 0) {
                    Logger.warn(this.moduleName, `共发现 ${deepNodes.length} 个过深节点`);
                }
            });
        }
    }

    class StyleComplexityMonitor extends BaseModule {
        constructor() {
            super('StyleComplexityMonitor');
            this.observer = null;
        }
        init() {
            super.init();
            if (!Environment.features.performanceObserver || !Config.get('performanceMonitor.enabled')) {
                Logger.info(this.moduleName, '未启用或不支持');
                return;
            }
            try {
                this.observer = new PerformanceObserver((list) => {
                    list.getEntries().forEach(entry => {
                        if (entry.name === 'styleRecalculation' && entry.duration > 10) {
                            Logger.warn(this.moduleName, `高成本样式重计算: ${entry.duration.toFixed(2)}ms`);
                        }
                    });
                });
                this.observer.observe({ entryTypes: ['styleRecalculation'] });
            } catch (e) {
                Logger.warn(this.moduleName, '不支持 styleRecalculation', e);
            }
        }
        destroy() {
            super.destroy();
            if (this.observer) this.observer.disconnect();
        }
    }

    class ContentVisibilityOptimizer extends BaseModule {
        constructor() {
            super('ContentVisibilityOptimizer');
        }
        init() {
            super.init();
            if (!Config.get('contentVisibility.enabled')) return;
            const selector = Config.get('contentVisibility.selector');
            if (!selector) return;
            document.querySelectorAll(selector).forEach(el => {
                if (!el.style.contentVisibility) {
                    el.style.contentVisibility = 'auto';
                    el.style.containIntrinsicSize = '1px 1000px';
                }
            });
        }
        applyToElements(elements) {
            elements.forEach(el => {
                if (!el.style.contentVisibility) {
                    el.style.contentVisibility = 'auto';
                    el.style.containIntrinsicSize = '1px 1000px';
                }
            });
        }
    }

    class LazyLoader extends BaseObserver {
        constructor() {
            super('LazyLoader', 'lazyLoad');
            this.scrollHandler = null;
            this.loadStrategies = {
                IMG: { src: (el, src) => { el.src = src; } },
                SCRIPT: { src: (el, src) => { el.src = src; el.async = true; } },
                LINK: { href: (el, href) => { el.href = href; } }
            };
        }
        init() {
            super.init();
            if (!Config.get('lazyLoad.enabled')) return;
            if (Environment.features.nativeLazyLoad && Config.get('lazyLoad.preferNative')) {
                this.useNativeLazyLoad();
            } else if (Environment.features.intersectionObserver) {
                this.useObserverLazyLoad();
            } else {
                this.useFallbackLazyLoad();
            }
        }
        useNativeLazyLoad() {
            document.querySelectorAll(Config.get('lazyLoad.selector')).forEach(el => {
                if (['IMG', 'IFRAME'].includes(el.tagName)) {
                    el.loading = 'lazy';
                    const src = el.src || el.dataset.src;
                    if (src) prefetchDomain(src);
                }
                this.loadElement(el);
            });
        }
        useObserverLazyLoad() {
            this.createObserver(() => {}, Config.get('lazyLoad.rootMargin'));
            this.observeElements(Config.get('lazyLoad.selector'));
        }
        useFallbackLazyLoad() {
            this.scrollHandler = Utils.throttle(() => {
                document.querySelectorAll(Config.get('lazyLoad.selector')).forEach(el => {
                    if (!el.classList.contains('loaded') && this.isInViewport(el)) {
                        this.loadElement(el);
                    }
                });
            }, Config.get('throttleDelay'));
            window.addEventListener('scroll', this.scrollHandler, { passive: true });
            this.scrollHandler();
        }
        loadElement(el) {
            if (!Utils.is.elem(el) || el.classList.contains('loaded')) return;
            try {
                const src = Utils.safeGetData(el, 'src', '') || Utils.safeGetData(el, 'lazySrc', '');
                const href = Utils.safeGetData(el, 'href', '') || Utils.safeGetData(el, 'lazyHref', '');
                if (src) prefetchDomain(src);
                if (href) prefetchDomain(href);
                const strategy = this.loadStrategies[el.tagName]?.[src ? 'src' : 'href'];
                if (strategy && (src || href)) {
                    strategy(el, src || href);
                    this.bindLoadEvents(el, src || href);
                } else {
                    this.markFailed(el);
                }
            } catch (error) {
                this.markFailed(el);
                Logger.error(this.moduleName, '加载失败', error);
            }
        }
        bindLoadEvents(el, url) {
            el.addEventListener('load', () => {
                this.markLoaded(el);
                this.emitEvent('loaded', { url, tag: el.tagName });
            }, { once: true });
            el.addEventListener('error', (e) => {
                this.markFailed(el, e);
                this.emitEvent('error', { url, tag: el.tagName, error: e });
            }, { once: true });
        }
        markLoaded(el) {
            el.classList.add('loaded', 'lazy-loaded');
            el.classList.remove('load-failed');
        }
        markFailed(el, error) {
            el.classList.add('load-failed');
            el.classList.remove('loaded', 'lazy-loaded');
        }
        isInViewport(el) {
            const rect = el.getBoundingClientRect();
            return rect.top <= window.innerHeight + 100 && rect.left <= window.innerWidth;
        }
        handleIntersect(target) {
            this.loadElement(target);
            this.observers.forEach(observer => observer.unobserve(target));
        }
        destroy() {
            super.destroy();
            if (this.scrollHandler) {
                window.removeEventListener('scroll', this.scrollHandler);
                this.scrollHandler = null;
            }
        }
    }

    class EventOptimizer extends BaseModule {
        constructor() {
            super('EventOptimizer');
            this.handlers = {
                scroll: Utils.throttle(() => this.emitEvent('scroll'), Config.get('throttleDelay')),
                resize: Utils.debounce(() => this.emitEvent('resize'), Config.get('debounceDelay'))
            };
        }
        init() {
            super.init();
            window.addEventListener('scroll', this.handlers.scroll, { passive: true });
            window.addEventListener('resize', this.handlers.resize);
        }
        destroy() {
            super.destroy();
            window.removeEventListener('scroll', this.handlers.scroll);
            window.removeEventListener('resize', this.handlers.resize);
        }
    }

    class GpuAccelerator extends BaseObserver {
        constructor() {
            super('GpuAccelerator', 'hardwareAcceleration');
            this.styleEl = null;
        }
        init() {
            super.init();
            if (!Config.get('hardwareAcceleration.enabled')) return;
            if (Environment.isLowPerformance()) {
                Config.set('hardwareAcceleration.selector', '.js-animate');
            }
            this.injectStyles();
            this.createObserver(() => {}, '50px');
            this.observeElements(Config.get('hardwareAcceleration.selector'));
        }
        injectStyles() {
            this.styleEl = document.createElement('style');
            this.styleEl.textContent = `
                .gpu-accelerate {
                    transform: translateZ(0);
                    opacity: 1;
                    will-change: transform, opacity;
                }
                .gpu-accelerate.inactive {
                    will-change: auto;
                }
            `;
            document.head.appendChild(this.styleEl);
        }
        handleIntersect(target) {
            target.classList.add('gpu-accelerate');
            target.classList.remove('inactive');
            target.style.transform = 'translateZ(0)';
        }
        handleLeave(target) {
            target.classList.add('inactive');
            if (!target.matches('.js-persist-gpu')) {
                target.style.transform = '';
            }
        }
        destroy() {
            super.destroy();
            if (this.styleEl) this.styleEl.remove();
        }
    }

    class CriticalCSSLoader extends BaseModule {
        constructor() {
            super('CriticalCSSLoader');
            this.loadedUrls = new Set();
        }
        init() {
            super.init();
            if (!Config.get('criticalCSS.enabled')) return;
            const cssUrls = this.collectCriticalCSSUrls();
            if (cssUrls.length === 0) return;
            cssUrls.forEach(url => this.preloadCSS(url));
        }
        collectCriticalCSSUrls() {
            const urls = new Set();
            Config.get('criticalCSS.selectors').forEach(selector => {
                document.querySelectorAll(selector).forEach(el => {
                    const url = Utils.safeGetData(el, 'href', '');
                    if (url) {
                        urls.add(url);
                        el.remove();
                    }
                });
            });
            const meta = document.querySelector('meta[name="critical-css"]');
            if (meta) meta.content.split(',').forEach(url => url && urls.add(url.trim()));
            return Array.from(urls);
        }
        preloadCSS(url) {
            if (this.loadedUrls.has(url)) return;
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'style';
            link.href = url;
            link.crossOrigin = 'anonymous';
            const timeoutId = setTimeout(() => {
                if (!this.loadedUrls.has(url)) {
                    this.fallbackLoad(url);
                }
            }, Config.get('criticalCSS.preloadTimeout'));
            link.onload = () => {
                clearTimeout(timeoutId);
                link.rel = 'stylesheet';
                this.loadedUrls.add(url);
                document.body.classList.add('critical-css-loaded');
            };
            link.onerror = () => {
                clearTimeout(timeoutId);
                this.fallbackLoad(url);
            };
            document.head.appendChild(link);
        }
        fallbackLoad(url) {
            if (this.loadedUrls.has(url)) return;
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = url;
            link.onload = () => this.loadedUrls.add(url);
            link.onerror = (e) => this.emitEvent('error', { url, error: e });
            document.head.appendChild(link);
        }
    }

    class DomObserver extends BaseModule {
        constructor(lazyLoader, gpuAccelerator, contentVisOptimizer) {
            super('DomObserver');
            this.lazyLoader = lazyLoader;
            this.gpuAccelerator = gpuAccelerator;
            this.contentVisOptimizer = contentVisOptimizer;
            this.observer = null;
        }
        init() {
            super.init();
            this.observer = new MutationObserver(Utils.throttle((mutations) => {
                const newLazyEls = [];
                const newGpuEls = [];
                const newVisEls = [];

                mutations.forEach(m => {
                    m.addedNodes.forEach(node => {
                        if (node.nodeType !== 1) return;
                        const collect = (root, selector, list) => {
                            if (root.matches?.(selector)) list.push(root);
                            if (root.querySelectorAll) {
                                root.querySelectorAll(selector).forEach(el => list.push(el));
                            }
                        };
                        if (this.lazyLoader?.initialized && Config.get('lazyLoad.enabled')) {
                            collect(node, Config.get('lazyLoad.selector'), newLazyEls);
                        }
                        if (this.gpuAccelerator?.initialized && Config.get('hardwareAcceleration.enabled')) {
                            collect(node, Config.get('hardwareAcceleration.selector'), newGpuEls);
                        }
                        if (this.contentVisOptimizer?.initialized && Config.get('contentVisibility.enabled')) {
                            collect(node, Config.get('contentVisibility.selector'), newVisEls);
                        }
                    });
                });

                if (newLazyEls.length) {
                    IdleTaskScheduler.scheduleChunked(newLazyEls, el => {
                        if (!el.classList.contains('loaded')) this.lazyLoader.loadElement(el);
                    }, { chunkSize: 3 });
                }
                if (newGpuEls.length) {
                    IdleTaskScheduler.scheduleChunked(newGpuEls, el => {
                        if (!el.classList.contains('gpu-accelerate')) this.gpuAccelerator.handleIntersect(el);
                    }, { chunkSize: 3 });
                }
                if (newVisEls.length) {
                    IdleTaskScheduler.schedule(() => {
                        this.contentVisOptimizer.applyToElements(newVisEls);
                    });
                }
            }, 200));

            this.observer.observe(document.body, { childList: true, subtree: true });
        }
        destroy() {
            super.destroy();
            if (this.observer) this.observer.disconnect();
        }
    }

    // ========================
    // 5. 应用控制器
    // ========================
    class AppController extends BaseModule {
        constructor() {
            super('AppController');
            this.modules = {};
        }
        init() {
            super.init();
            try {
                this.modules.criticalCSSLoader = new CriticalCSSLoader();
                this.modules.criticalCSSLoader.init();

                this.modules.lazyLoader = new LazyLoader();
                this.modules.lazyLoader.init();

                this.modules.eventOptimizer = new EventOptimizer();
                this.modules.eventOptimizer.init();

                this.modules.gpuAccelerator = new GpuAccelerator();
                this.modules.gpuAccelerator.init();

                this.modules.contentVisibilityOptimizer = new ContentVisibilityOptimizer();
                this.modules.contentVisibilityOptimizer.init();

                this.modules.domDepthAnalyzer = new DomDepthAnalyzer();
                this.modules.domDepthAnalyzer.init();

                this.modules.styleComplexityMonitor = new StyleComplexityMonitor();
                this.modules.styleComplexityMonitor.init();

                this.modules.domObserver = new DomObserver(
                    this.modules.lazyLoader,
                    this.modules.gpuAccelerator,
                    this.modules.contentVisibilityOptimizer
                );
                this.modules.domObserver.init();

                window.addEventListener('beforeunload', () => this.destroy());
                window.addEventListener('spa:navigate', () => {
                    this.destroy();
                    this.init();
                });
            } catch (error) {
                Logger.error('AppController', '初始化错误', error);
                this.destroy();
            }
        }
        destroy() {
            Object.values(this.modules).reverse().forEach(module => {
                if (module && typeof module.destroy === 'function') {
                    try { module.destroy(); } catch (e) {
                        Logger.error('AppController', `模块${module.moduleName}销毁失败`, e);
                    }
                }
            });
            super.destroy();
        }
    }

    // ========================
    // 启动
    // ========================
    function bootstrap() {
        try {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    const app = new AppController();
                    app.init();
                    window.PerfOptimizer = app;
                });
            } else {
                const app = new AppController();
                app.init();
                window.PerfOptimizer = app;
            }
        } catch (error) {
            console.error('[PerfOpt] 启动失败', error);
        }
    }

    window.PerfUtils = {
        getConfig: Config.getAll,
        setConfig: Config.set,
        throttle: Utils.throttle,
        debounce: Utils.debounce,
        loadWithRetry: Utils.loadWithRetry,
        idleScheduler: IdleTaskScheduler
    };

    bootstrap();
})();