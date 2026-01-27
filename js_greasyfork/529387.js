// ==UserScript==
// @name         Web性能综合优化工具箱 
// @namespace    http://tampermonkey.net/
// @version      3.7.3-compatibility-optimized
// @description  Web浏览提速80%；DOM渲染及GPU加速；集成Core Web Vitals实时监控面板
// @author       KiwiFruit
// @match        *://*/*
// @exclude      *://weibo.com/*
// @exclude      *://*.weibo.com/*
// @grant        none
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/529387/Web%E6%80%A7%E8%83%BD%E7%BB%BC%E5%90%88%E4%BC%98%E5%8C%96%E5%B7%A5%E5%85%B7%E7%AE%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/529387/Web%E6%80%A7%E8%83%BD%E7%BB%BC%E5%90%88%E4%BC%98%E5%8C%96%E5%B7%A5%E5%85%B7%E7%AE%B1.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ========================
    // 1. 环境检测与配置
    // ========================
    const Env = {
        features: {
            nativeLazyLoad: 'loading' in HTMLImageElement.prototype,
            intersectionObserver: 'IntersectionObserver' in window,
            mutationObserver: 'MutationObserver' in window,
            performanceObserver: 'PerformanceObserver' in window,
            requestIdleCallback: 'requestIdleCallback' in window,
            contentVisibility: CSS.supports('content-visibility', 'hidden'),
            webgpu: typeof GPU !== 'undefined' && !!navigator.gpu
        },
        performanceTier: (() => {
            if (navigator.hardwareConcurrency >= 4) return 2;
            if (window.devicePixelRatio <= 1.5) return 1;
            return 0;
        })(),
        networkType: navigator.connection?.effectiveType || 'unknown',
        isLowPerformance() { return this.performanceTier === 0 || this.networkType === '2g'; }
    };

    const Config = {
        debug: false,
        ui: {
            enabled: true,
            position: 'bottom-right',
            zIndex: 9999,
            autoHideDelay: 3000,
            hoverDelay: 300,
            hideOffset: { bottom: 20, right: -50 },
            showOffset: { bottom: 20, right: 20 },
            statsUpdateTimeout: 2000,
            sampleSize: 200
        },
        lazyLoad: {
            enabled: true,
            selector: 'img[data-src], img[data-original], img.lazy, iframe[data-src], .js-lazy-load',
            preloadDistance: 150
        },
        hardwareAcceleration: {
            enabled: true,
            selector: 'header, nav, aside, .sticky, .fixed, .js-animate, .js-transform',
            skipViewportElements: true,
            delayForVisibleElements: 5000
        },
        contentVisibility: {
            enabled: true,
            selector: 'section, article, .post, .js-section',
            hiddenDistance: 600,
            viewportBuffer: 200,
            streamModeThreshold: 500,
            respectCanvas: true,
            respectWebGPU: true,
            smartViewportCheck: true
        },
        preconnect: {
            enabled: true,
            domains: ['cdn.jsdelivr.net', 'cdnjs.cloudflare.com', 'fonts.googleapis.com', 'fonts.gstatic.com']
        },
        blacklistedDomains: ['weibo.com', 'weibo.cn']
    };

    const Logger = {
        log: (module, level, msg) => {
            if (Config.debug || level === 'error') {
                const prefix = `[PerfOpt][${module}]`;
                const methods = { debug: console.log, info: console.info, warn: console.warn, error: console.error };
                methods[level](prefix, msg);
            }
        },
        debug: (m, msg) => Logger.log(m, 'debug', msg),
        info: (m, msg) => Logger.log(m, 'info', msg),
        warn: (m, msg) => Logger.log(m, 'warn', msg),
        error: (m, msg) => Logger.log(m, 'error', msg)
    };

    // ========================
    // 2. 核心基类
    // ========================
    class BaseModule {
        constructor(name) {
            this.moduleName = name;
            this.initialized = false;
            this.mutationObserver = null;
        }

        init() {
            if (this.initialized) {
                Logger.warn(this.moduleName, '已初始化');
                return;
            }
            this.initialized = true;
            this.setupMutationObserver();
            Logger.info(this.moduleName, '初始化完成');
        }

        destroy() {
            if (!this.initialized) return;
            this.initialized = false;
            if (this.mutationObserver) {
                this.mutationObserver.disconnect();
                this.mutationObserver = null;
            }
            Logger.info(this.moduleName, '已销毁');
        }

        emit(event, data = {}) {
            window.dispatchEvent(new CustomEvent(`perfopt:${this.moduleName}:${event}`, {
                detail: { ...data, module: this.moduleName, timestamp: Date.now() }
            }));
        }

        setupMutationObserver() {
            if (!Env.features.mutationObserver) return;

            this.mutationObserver = new MutationObserver((mutations) => {
                for (const mutation of mutations) {
                    if (mutation.addedNodes.length) {
                        this.handleNewNodes(mutation.addedNodes);
                    }
                }
            });

            this.mutationObserver.observe(document.body, {
                childList: true,
                subtree: true
            });
        }

        handleNewNodes(nodeList) {}
    }

    // ========================
    // 3. 图片懒加载优化
    // ========================
    class ImageOptimizer extends BaseModule {
        constructor() {
            super('ImageOptimizer');
            this.observer = null;
        }

        init() {
            super.init();

            if (!Config.lazyLoad.enabled) {
                Logger.warn('ImageOptimizer', '图片懒加载未启用');
                return;
            }

            if (Env.features.intersectionObserver) {
                this.applyIntersectionObserver();
            } else if (Env.features.nativeLazyLoad) {
                this.applyNativeLazyLoad();
            } else {
                this.applyScrollBasedLazyLoad();
            }

            Logger.info('ImageOptimizer', '图片懒加载初始化完成');
        }

        applyIntersectionObserver() {
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const el = entry.target;
                        if (el.dataset.src) {
                            el.src = el.dataset.src;
                            delete el.dataset.src;
                            this.observer.unobserve(el);
                            Logger.debug('ImageOptimizer', '图片已加载');
                        }
                    }
                });
            }, {
                rootMargin: `${Config.lazyLoad.preloadDistance}px 0px`,
                threshold: 0.01
            });

            this.scanAndObserve(document.querySelectorAll(Config.lazyLoad.selector));
        }

        applyNativeLazyLoad() {
            document.querySelectorAll(Config.lazyLoad.selector).forEach(el => {
                el.loading = 'lazy';
            });
        }

        applyScrollBasedLazyLoad() {
            let ticking = false;
            this.scrollListener = () => {
                if (!ticking) {
                    requestAnimationFrame(() => {
                        this.loadVisibleImages();
                        ticking = false;
                    });
                    ticking = true;
                }
            };
            window.addEventListener('scroll', this.scrollListener, { passive: true });
            this.loadVisibleImages();
        }

        loadVisibleImages() {
            const viewportHeight = window.innerHeight;
            const scrollTop = window.pageYOffset;

            document.querySelectorAll(Config.lazyLoad.selector).forEach(el => {
                const rect = el.getBoundingClientRect();
                if (rect.top < viewportHeight + Config.lazyLoad.preloadDistance &&
                    rect.bottom > -Config.lazyLoad.preloadDistance) {
                    if (el.dataset.src) {
                        el.src = el.dataset.src;
                        delete el.dataset.src;
                    }
                }
            });
        }

        scanAndObserve(elements) {
            elements.forEach(el => {
                if (this.observer) {
                    this.observer.observe(el);
                }
            });
        }

        handleNewNodes(nodeList) {
            if (!this.observer) return;

            nodeList.forEach(node => {
                if (node.nodeType === 1) {
                    if (node.matches(Config.lazyLoad.selector)) {
                        this.observer.observe(node);
                    }
                    const children = node.querySelectorAll(Config.lazyLoad.selector);
                    children.forEach(el => this.observer.observe(el));
                }
            });
        }

        destroy() {
            super.destroy();
            if (this.observer) {
                this.observer.disconnect();
                this.observer = null;
            }
            if (this.scrollListener) {
                window.removeEventListener('scroll', this.scrollListener);
                this.scrollListener = null;
            }
        }
    }

    // ========================
    // 4. GPU加速优化 (WebGPU兼容版)
    // ========================
    class GPUAccelerator extends BaseModule {
        constructor() {
            super('GPUAccelerator');
            this.pendingOptimizations = new Map();
        }

        init() {
            super.init();

            if (!Config.hardwareAcceleration.enabled) {
                Logger.warn('GPUAccelerator', 'GPU加速未启用');
                return;
            }

            this.processElements(document.querySelectorAll(Config.hardwareAcceleration.selector));
            Logger.info('GPUAccelerator', 'GPU加速初始化完成');
        }

        processElements(elements) {
            elements.forEach(el => this.applyOptimization(el));
        }

        applyOptimization(element) {
            if (element.classList.contains('gpu-accelerate')) return;

            if (element.closest('.streaming, [data-streaming], .generating')) {
                Logger.debug('GPUAccelerator', '跳过流式内容元素');
                return;
            }

            if (Config.hardwareAcceleration.skipViewportElements) {
                const rect = element.getBoundingClientRect();
                const isFullyVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
                if (isFullyVisible && Config.hardwareAcceleration.delayForVisibleElements > 0) {
                    const timeoutId = setTimeout(() => {
                        this.doApplyOptimization(element);
                        this.pendingOptimizations.delete(element);
                    }, Config.hardwareAcceleration.delayForVisibleElements);
                    this.pendingOptimizations.set(element, timeoutId);
                    return;
                }
            }

            this.doApplyOptimization(element);
        }

        doApplyOptimization(element) {
            element.classList.add('gpu-accelerate');
            element.style.transform = 'translateZ(0)';
            element.style.backfaceVisibility = 'hidden';
        }

        removeOptimization(element) {
            element.classList.remove('gpu-accelerate');
            element.style.transform = '';
            element.style.backfaceVisibility = '';
            if (this.pendingOptimizations.has(element)) {
                clearTimeout(this.pendingOptimizations.get(element));
                this.pendingOptimizations.delete(element);
            }
        }

        handleNewNodes(nodeList) {
            nodeList.forEach(node => {
                if (node.nodeType === 1) {
                    const candidates = node.matches(Config.hardwareAcceleration.selector)
                        ? [node, ...node.querySelectorAll(Config.hardwareAcceleration.selector)]
                        : node.querySelectorAll(Config.hardwareAcceleration.selector);
                    candidates.forEach(el => this.applyOptimization(el));
                }
            });
        }

        destroy() {
            super.destroy();
            this.pendingOptimizations.forEach((timeoutId) => clearTimeout(timeoutId));
            this.pendingOptimizations.clear();
            document.querySelectorAll('.gpu-accelerate').forEach(el => {
                this.removeOptimization(el);
            });
        }
    }

    // ========================
    // 5. 内容可见性优化 (WebGPU/视口感知重构版)
    // ========================
    class ContentVisibility extends BaseModule {
        constructor() {
            super('ContentVisibility');
            this.scrollListener = null;
            this.resizeListener = null;
            this.processedElements = new WeakSet();
            this.recentAdditions = [];
            this.streamThrottleTimer = null;
        }

        init() {
            super.init();

            if (!Config.contentVisibility.enabled) {
                Logger.warn('ContentVisibility', '内容可见性优化未启用');
                return;
            }

            if (!Env.features.contentVisibility) {
                Logger.info('ContentVisibility', '浏览器不支持 content-visibility');
                return;
            }

            this.updateVisibility(document.querySelectorAll(Config.contentVisibility.selector));

            let ticking = false;
            const handleChange = () => {
                if (!ticking) {
                    requestAnimationFrame(() => {
                        this.updateVisibility(document.querySelectorAll(Config.contentVisibility.selector));
                        ticking = false;
                    });
                    ticking = true;
                }
            };

            this.scrollListener = handleChange;
            this.resizeListener = handleChange;

            window.addEventListener('scroll', this.scrollListener, { passive: true });
            window.addEventListener('resize', this.resizeListener, { passive: true });

            Logger.info('ContentVisibility', '内容可见性优化初始化完成');
        }

        isInViewport(el, buffer = Config.contentVisibility.viewportBuffer) {
            if (!el || !el.getBoundingClientRect) return false;

            const rect = el.getBoundingClientRect();
            const windowHeight = window.innerHeight || document.documentElement.clientHeight;
            const windowWidth = window.innerWidth || document.documentElement.clientWidth;

            const verticalInView = (
                rect.top <= windowHeight + buffer &&
                rect.bottom >= -buffer
            );
            const horizontalInView = (
                rect.left <= windowWidth + buffer &&
                rect.right >= -buffer
            );

            return verticalInView && horizontalInView;
        }

        containsWebGPU(el) {
            if (!el || el.nodeType !== 1) return false;

            if (el.tagName === 'CANVAS') {
                if (el.getContext && typeof el.getContext === 'function') {
                    try {
                        if (el.dataset.webgpu === 'true' || el.getAttribute('data-webgpu')) {
                            return true;
                        }
                    } catch (e) {}
                }
            }

            if (el.querySelector && el.querySelector('canvas[data-webgpu="true"], canvas[webgpu], [data-webgpu-context]')) {
                return true;
            }

            if (el.closest && el.closest('[data-webgpu-container], [data-webgpu="true"], .webgpu-container')) {
                return true;
            }

            if (el.classList && (el.classList.contains('webgpu-canvas') || el.classList.contains('webgpu-container'))) {
                return true;
            }

            return false;
        }

        containsCanvas(el) {
            if (!el || el.nodeType !== 1) return false;
            return el.tagName === 'CANVAS' ||
                   (el.querySelector && el.querySelector('canvas') !== null) ||
                   (el.closest && el.closest('[data-canvas-rendered]') !== null);
        }

        isStreaming() {
            const now = Date.now();
            this.recentAdditions = this.recentAdditions.filter(t => now - t < 1000);
            return this.recentAdditions.length > 3;
        }

        handleNewNodes(nodeList) {
            const now = Date.now();
            const isStreaming = this.isStreaming();

            nodeList.forEach(node => {
                if (node.nodeType !== 1) return;

                this.recentAdditions.push(now);

                let candidates = [];
                if (node.matches && node.matches(Config.contentVisibility.selector)) {
                    candidates = [node, ...node.querySelectorAll(Config.contentVisibility.selector)];
                } else if (node.querySelectorAll) {
                    candidates = node.querySelectorAll(Config.contentVisibility.selector);
                }

                candidates.forEach(el => {
                    if (this.processedElements.has(el)) return;

                    if (Config.contentVisibility.respectWebGPU && this.containsWebGPU(el)) {
                        Logger.debug('ContentVisibility', '跳过 WebGPU 容器元素');
                        this.setAuto(el);
                        this.processedElements.add(el);
                        return;
                    }

                    if (Config.contentVisibility.respectCanvas && this.containsCanvas(el)) {
                        Logger.debug('ContentVisibility', '跳过 Canvas 容器元素');
                        this.setAuto(el);
                        this.processedElements.add(el);
                        return;
                    }

                    if (isStreaming || this.isInViewport(el)) {
                        this.setAuto(el);
                        if (!isStreaming) {
                            this.processedElements.add(el);
                        }
                    } else {
                        this.setHidden(el);
                        this.processedElements.add(el);
                    }
                });
            });

            if (isStreaming && this.scrollListener) {
                clearTimeout(this.streamThrottleTimer);
                this.streamThrottleTimer = setTimeout(() => {
                    this.updateVisibility(document.querySelectorAll(Config.contentVisibility.selector));
                }, 2000);
            }
        }

        updateVisibility(elements) {
            const viewportCandidates = [];
            const hiddenCandidates = [];

            elements.forEach(el => {
                if (this.isInViewport(el, Config.contentVisibility.hiddenDistance)) {
                    viewportCandidates.push(el);
                } else {
                    hiddenCandidates.push(el);
                }
            });

            viewportCandidates.forEach(el => {
                this.setAuto(el);
            });

            requestAnimationFrame(() => {
                hiddenCandidates.forEach(el => {
                    if (!this.isInViewport(el)) {
                        this.setHidden(el);
                    }
                });
            });
        }

        setAuto(el) {
            el.style.contentVisibility = 'auto';
            el.style.containIntrinsicSize = '';
            el.classList.add('perfopt-in-viewport');
            el.classList.remove('perfopt-hidden');
        }

        setHidden(el) {
            el.style.contentVisibility = 'hidden';
            el.style.containIntrinsicSize = '300px';
            el.classList.add('perfopt-hidden');
            el.classList.remove('perfopt-in-viewport');
        }

        destroy() {
            super.destroy();
            if (this.scrollListener) {
                window.removeEventListener('scroll', this.scrollListener);
                this.scrollListener = null;
            }
            if (this.resizeListener) {
                window.removeEventListener('resize', this.resizeListener);
                this.resizeListener = null;
            }
            if (this.streamThrottleTimer) {
                clearTimeout(this.streamThrottleTimer);
                this.streamThrottleTimer = null;
            }
            document.querySelectorAll(Config.contentVisibility.selector).forEach(el => {
                el.style.contentVisibility = '';
                el.style.containIntrinsicSize = '';
                el.classList.remove('perfopt-in-viewport', 'perfopt-hidden');
            });
        }
    }

    // ========================
    // 6. 预连接优化
    // ========================
    class PreconnectOptimizer extends BaseModule {
        constructor() {
            super('PreconnectOptimizer');
            this.createdLinks = [];
        }

        init() {
            super.init();

            if (!Config.preconnect.enabled) {
                Logger.warn('PreconnectOptimizer', '预连接优化未启用');
                return;
            }

            Config.preconnect.domains.forEach(domain => {
                const link = document.createElement('link');
                link.rel = 'preconnect';
                link.href = `https://${domain}`;
                document.head.appendChild(link);
                this.createdLinks.push(link);

                const dnsLink = document.createElement('link');
                dnsLink.rel = 'dns-prefetch';
                dnsLink.href = `https://${domain}`;
                document.head.appendChild(dnsLink);
                this.createdLinks.push(dnsLink);
            });

            Logger.info('PreconnectOptimizer', '预连接优化初始化完成');
        }

        destroy() {
            super.destroy();
            this.createdLinks.forEach(link => link.remove());
            this.createdLinks = [];
        }
    }

    // ========================
    // 7. 性能监控 (Core Web Vitals数据存储版)
    // ========================
    class PerformanceMonitor extends BaseModule {
        constructor() {
            super('PerformanceMonitor');
            this.observer = null;
            // 核心指标数据存储
            this.metrics = {
                fcp: null,
                lcp: null,
                cls: 0,
                clsCount: 0,
                ttfb: null
            };
        }

        init() {
            super.init();

            if (!Env.features.performanceObserver) {
                Logger.warn('PerformanceMonitor', '浏览器不支持 PerformanceObserver');
                return;
            }

            try {
                this.observer = new PerformanceObserver((list) => {
                    list.getEntries().forEach(entry => {
                        if (entry.entryType === 'paint') {
                            if (entry.name === 'first-contentful-paint') {
                                this.metrics.fcp = Math.round(entry.startTime);
                                Logger.info('Performance', `FCP: ${this.metrics.fcp}ms`);
                                this.emit('metric', { type: 'fcp', value: this.metrics.fcp });
                            }
                        } else if (entry.entryType === 'layout-shift') {
                            if (!entry.hadRecentInput) {
                                this.metrics.cls += entry.value;
                                this.metrics.clsCount++;
                                Logger.info('Performance', `CLS: ${this.metrics.cls.toFixed(3)}`);
                                this.emit('metric', { type: 'cls', value: this.metrics.cls });
                            }
                        } else if (entry.entryType === 'largest-contentful-paint') {
                            this.metrics.lcp = Math.round(entry.startTime);
                            Logger.info('Performance', `LCP: ${this.metrics.lcp}ms`);
                            this.emit('metric', { type: 'lcp', value: this.metrics.lcp });
                        }
                    });
                });

                this.observer.observe({
                    entryTypes: ['paint', 'layout-shift', 'largest-contentful-paint']
                });

                window.addEventListener('load', () => {
                    setTimeout(() => {
                        const timing = performance.timing;
                        if (timing) {
                            this.metrics.ttfb = timing.responseStart - timing.navigationStart;
                            Logger.info('Performance', `TTFB: ${this.metrics.ttfb}ms`);
                            this.emit('metric', { type: 'ttfb', value: this.metrics.ttfb });
                        }
                    }, 0);
                });

                Logger.info('PerformanceMonitor', '性能监控初始化完成');
            } catch (error) {
                Logger.error('PerformanceMonitor', `初始化失败: ${error.message}`);
            }
        }

        // 获取当前指标数据供UI使用
        getMetrics() {
            return {
                fcp: this.metrics.fcp,
                lcp: this.metrics.lcp,
                cls: this.metrics.cls,
                clsCount: this.metrics.clsCount,
                ttfb: this.metrics.ttfb
            };
        }

        destroy() {
            super.destroy();
            if (this.observer) {
                this.observer.disconnect();
                this.observer = null;
            }
        }
    }

    // ========================
    // 8. UI控制器 (集成Core Web Vitals显示)
    // ========================
    class UIController extends BaseModule {
        constructor() {
            super('UIController');
            this.visible = false;
            this.panelVisible = false;
            this.autoHideTimeout = null;
            this.hoverTimeout = null;
            this.isHovered = false;
            this.button = null;
            this.panel = null;
            this.isUpdateScheduled = false;
            this.cachedDomDepth = 0;
            this.domDepthCalculated = false;
            // 性能指标引用
            this.performanceMonitor = null;
        }

        setPerformanceMonitor(monitor) {
            this.performanceMonitor = monitor;
        }

        init() {
            super.init();
            if (!Config.ui.enabled) return;

            try {
                this.createUI();
                this.attachEvents();
                this.startAutoHideTimer();
                this.scheduleInitialStats();

                Logger.info('UIController', 'UI组件创建成功');
            } catch (error) {
                Logger.error('UIController', `UI创建失败: ${error.message}`);
                Logger.error('UIController', error.stack);
                this.createFallbackUI();
            }
        }

        scheduleInitialStats() {
            if (Env.features.requestIdleCallback) {
                requestIdleCallback(() => {
                    this.updateStats();
                }, { timeout: 1000 });
            } else {
                setTimeout(() => this.updateStats(), 500);
            }
        }

        scheduleStatsUpdate() {
            if (!this.panelVisible) return;
            if (this.isUpdateScheduled) return;
            this.isUpdateScheduled = true;

            if (Env.features.requestIdleCallback) {
                requestIdleCallback(
                    () => {
                        if (this.panelVisible) {
                            this.updateStats();
                        }
                        this.isUpdateScheduled = false;
                        if (this.panelVisible) {
                            this.scheduleStatsUpdate();
                        }
                    },
                    { timeout: Config.ui.statsUpdateTimeout }
                );
            } else {
                setTimeout(() => {
                    if (this.panelVisible) {
                        this.updateStats();
                    }
                    this.isUpdateScheduled = false;
                    if (this.panelVisible) {
                        this.scheduleStatsUpdate();
                    }
                }, 1000);
            }
        }

        updateStats() {
            if (!this.panel) return;

            try {
                const lazyCount = document.querySelectorAll(Config.lazyLoad.selector).length;
                const gpuCount = document.querySelectorAll('.gpu-accelerate').length;
                const autoCount = document.querySelectorAll('.perfopt-in-viewport').length;
                const hiddenCount = document.querySelectorAll('.perfopt-hidden').length;
                const domDepth = this.domDepthCalculated ? this.cachedDomDepth : this.calculateDomDepth();

                // 更新基础统计
                this.updateElement('perfopt-lazy-count', lazyCount);
                this.updateElement('perfopt-gpu-count', gpuCount);
                this.updateElement('perfopt-dom-depth', domDepth);
                this.updateElement('perfopt-auto-count', autoCount);
                this.updateElement('perfopt-hidden-count', hiddenCount);

                // 更新性能指标 (Core Web Vitals)
                if (this.performanceMonitor) {
                    const metrics = this.performanceMonitor.getMetrics();

                    // FCP - 首次内容绘制
                    this.updateMetricDisplay('perfopt-fcp', metrics.fcp, 'ms', (v) => {
                        if (v < 1800) return 'good';
                        if (v < 3000) return 'needs-improvement';
                        return 'poor';
                    });

                    // LCP - 最大内容绘制
                    this.updateMetricDisplay('perfopt-lcp', metrics.lcp, 'ms', (v) => {
                        if (v < 2500) return 'good';
                        if (v < 4000) return 'needs-improvement';
                        return 'poor';
                    });

                    // CLS - 累积布局偏移
                    this.updateMetricDisplay('perfopt-cls', metrics.cls, '', (v) => {
                        if (v < 0.1) return 'good';
                        if (v < 0.25) return 'needs-improvement';
                        return 'poor';
                    });
                }

            } catch (error) {
                Logger.warn('UIController', `统计更新失败: ${error.message}`);
            }
        }

        updateElement(id, value) {
            const el = document.getElementById(id);
            if (el) el.textContent = value;
        }

        updateMetricDisplay(id, value, unit, gradeFn) {
            const valueEl = document.getElementById(id);
            const statusEl = document.getElementById(`${id}-status`);

            if (!valueEl) return;

            if (value === null || value === undefined) {
                valueEl.textContent = '--';
                if (statusEl) {
                    statusEl.textContent = '等待中';
                    statusEl.className = 'perfopt-metric-status';
                }
                return;
            }

            const formattedValue = typeof value === 'number' ?
                (unit === '' ? value.toFixed(3) : Math.round(value)) : value;
            valueEl.textContent = formattedValue + unit;

            if (statusEl && gradeFn) {
                const grade = gradeFn(value);
                statusEl.className = `perfopt-metric-status ${grade}`;

                const gradeText = {
                    'good': '良好',
                    'needs-improvement': '需改进',
                    'poor': '较差'
                };
                statusEl.textContent = gradeText[grade] || '';
            }
        }

        calculateDomDepth() {
            const allElements = document.querySelectorAll('*');
            const sampleSize = Math.min(allElements.length, Config.ui.sampleSize);
            let maxDepth = 0;

            for (let i = 0; i < sampleSize; i++) {
                let depth = 0;
                let parent = allElements[i];
                while (parent && parent !== document) {
                    depth++;
                    parent = parent.parentNode;
                }
                if (depth > maxDepth) {
                    maxDepth = depth;
                }
            }

            this.cachedDomDepth = maxDepth;
            this.domDepthCalculated = true;
            return maxDepth;
        }

        createUI() {
            const style = document.createElement('style');
            style.id = 'perfopt-ui-style';
            style.textContent = `
                .perfopt-ui-button {
                    position: fixed !important;
                    bottom: ${Config.ui.showOffset.bottom}px !important;
                    right: ${Config.ui.showOffset.right}px !important;
                    width: 56px !important;
                    height: 56px !important;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
                    border-radius: 50% !important;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    cursor: pointer !important;
                    z-index: ${Config.ui.zIndex} !important;
                    transition: transform 0.3s ease, box-shadow 0.3s ease, right 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
                    font-size: 24px !important;
                    opacity: 1 !important;
                    visibility: visible !important;
                    pointer-events: auto !important;
                    user-select: none !important;
                }
                .perfopt-ui-button:hover { transform: scale(1.1) !important; }
                .perfopt-ui-button:active { transform: scale(0.95) !important; }
                .perfopt-ui-button.hidden {
                    right: ${Config.ui.hideOffset.right}px !important;
                    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1) !important;
                }
                .perfopt-ui-button.hidden:hover { right: ${Config.ui.showOffset.right}px !important; }

                .perfopt-ui-panel {
                    position: fixed !important;
                    bottom: 90px !important;
                    right: 20px !important;
                    width: 320px !important;
                    background: rgba(255, 255, 255, 0.95) !important;
                    backdrop-filter: blur(10px) !important;
                    border-radius: 16px !important;
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15) !important;
                    padding: 20px !important;
                    z-index: ${Config.ui.zIndex - 1} !important;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
                    max-height: 85vh !important;
                    overflow-y: auto !important;
                    display: none !important;
                    transition: opacity 0.3s ease, transform 0.3s ease !important;
                    transform: translateY(10px) !important;
                    opacity: 0 !important;
                    user-select: none !important;
                }
                .perfopt-ui-panel.visible {
                    display: block !important;
                    transform: translateY(0) !important;
                    opacity: 1 !important;
                }

                .perfopt-panel-header {
                    display: flex !important;
                    justify-content: space-between !important;
                    align-items: center !important;
                    margin-bottom: 16px !important;
                    padding-bottom: 12px !important;
                    border-bottom: 1px solid rgba(0, 0, 0, 0.1) !important;
                }
                .perfopt-panel-title {
                    font-size: 18px !important;
                    font-weight: 600 !important;
                    color: #333 !important;
                }
                .perfopt-panel-close {
                    width: 24px !important;
                    height: 24px !important;
                    cursor: pointer !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    border-radius: 50% !important;
                    transition: background 0.2s ease !important;
                }
                .perfopt-panel-close:hover { background: rgba(0, 0, 0, 0.1) !important; }

                .perfopt-module-item {
                    display: flex !important;
                    justify-content: space-between !important;
                    align-items: center !important;
                    padding: 12px 0 !important;
                    border-bottom: 1px solid rgba(0, 0, 0, 0.05) !important;
                }
                .perfopt-module-info { display: flex !important; align-items: center !important; gap: 12px !important; }
                .perfopt-module-icon {
                    width: 32px !important;
                    height: 32px !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    background: rgba(102, 126, 234, 0.1) !important;
                    border-radius: 8px !important;
                }
                .perfopt-module-name {
                    font-size: 14px !important;
                    font-weight: 500 !important;
                    color: #333 !important;
                }
                .perfopt-module-status { display: flex !important; align-items: center !important; gap: 8px !important; }
                .perfopt-status-indicator {
                    width: 8px !important;
                    height: 8px !important;
                    border-radius: 50% !important;
                    background: #48bb78 !important;
                }
                .perfopt-status-text { font-size: 12px !important; color: #666 !important; }

                /* Core Web Vitals 样式 */
                .perfopt-vitals-section {
                    margin-top: 16px !important;
                    padding: 12px !important;
                    background: rgba(102, 126, 234, 0.05) !important;
                    border-radius: 12px !important;
                    border: 1px solid rgba(102, 126, 234, 0.1) !important;
                }
                .perfopt-vitals-title {
                    font-size: 13px !important;
                    font-weight: 600 !important;
                    color: #667eea !important;
                    margin-bottom: 10px !important;
                    display: flex !important;
                    align-items: center !important;
                    gap: 6px !important;
                }
                .perfopt-metric-row {
                    display: flex !important;
                    justify-content: space-between !important;
                    align-items: center !important;
                    padding: 6px 0 !important;
                    font-size: 13px !important;
                }
                .perfopt-metric-label {
                    color: #666 !important;
                    display: flex !important;
                    align-items: center !important;
                    gap: 4px !important;
                }
                .perfopt-metric-value-group {
                    display: flex !important;
                    align-items: center !important;
                    gap: 8px !important;
                }
                .perfopt-metric-value {
                    font-weight: 600 !important;
                    color: #333 !important;
                    font-variant-numeric: tabular-nums !important;
                }
                .perfopt-metric-status {
                    font-size: 11px !important;
                    padding: 2px 6px !important;
                    border-radius: 10px !important;
                    font-weight: 500 !important;
                    min-width: 40px !important;
                    text-align: center !important;
                }
                .perfopt-metric-status.good {
                    background: #c6f6d5 !important;
                    color: #22543d !important;
                }
                .perfopt-metric-status.needs-improvement {
                    background: #feebc8 !important;
                    color: #744210 !important;
                }
                .perfopt-metric-status.poor {
                    background: #fed7d7 !important;
                    color: #742a2a !important;
                }
                .perfopt-metric-unit {
                    font-size: 11px !important;
                    color: #999 !important;
                    margin-left: 2px !important;
                }

                .perfopt-stats {
                    margin-top: 16px !important;
                    padding: 12px !important;
                    background: rgba(102, 126, 234, 0.05) !important;
                    border-radius: 8px !important;
                    font-size: 12px !important;
                    color: #666 !important;
                }
                .perfopt-stats-row {
                    display: flex !important;
                    justify-content: space-between !important;
                    margin-bottom: 8px !important;
                }
                .perfopt-stats-row:last-child { margin-bottom: 0 !important; }

                @media (max-width: 480px) {
                    .perfopt-ui-panel { width: calc(100vw - 40px) !important; }
                }
            `;
            document.head.appendChild(style);

            this.button = document.createElement('div');
            this.button.className = 'perfopt-ui-button';
            this.button.innerHTML = '⚡';
            this.button.title = '性能优化工具箱';
            document.body.appendChild(this.button);

            this.panel = document.createElement('div');
            this.panel.className = 'perfopt-ui-panel';
            this.panel.innerHTML = `
                <div class="perfopt-panel-header">
                    <div class="perfopt-panel-title">性能优化工具箱</div>
                    <div class="perfopt-panel-close" title="关闭">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </div>
                </div>

                <!-- Core Web Vitals 核心指标区域 -->
                <div class="perfopt-vitals-section">
                    <div class="perfopt-vitals-title">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                        </svg>
                        Core Web Vitals
                    </div>
                    <div class="perfopt-metric-row">
                        <span class="perfopt-metric-label" title="首次内容绘制">FCP</span>
                        <div class="perfopt-metric-value-group">
                            <span id="perfopt-fcp" class="perfopt-metric-value">--</span>
                            <span id="perfopt-fcp-status" class="perfopt-metric-status">等待中</span>
                        </div>
                    </div>
                    <div class="perfopt-metric-row">
                        <span class="perfopt-metric-label" title="最大内容绘制">LCP</span>
                        <div class="perfopt-metric-value-group">
                            <span id="perfopt-lcp" class="perfopt-metric-value">--</span>
                            <span id="perfopt-lcp-status" class="perfopt-metric-status">等待中</span>
                        </div>
                    </div>
                    <div class="perfopt-metric-row">
                        <span class="perfopt-metric-label" title="累积布局偏移">CLS</span>
                        <div class="perfopt-metric-value-group">
                            <span id="perfopt-cls" class="perfopt-metric-value">--</span>
                            <span id="perfopt-cls-status" class="perfopt-metric-status">等待中</span>
                        </div>
                    </div>
                </div>

                <div class="perfopt-module-item">
                    <div class="perfopt-module-info">
                        <div class="perfopt-module-icon">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"/>
                                <line x1="12" y1="8" x2="12" y2="12"/>
                                <line x1="12" y1="16" x2="12.01" y2="16"/>
                            </svg>
                        </div>
                        <div class="perfopt-module-name">图片懒加载</div>
                    </div>
                    <div class="perfopt-module-status">
                        <div class="perfopt-status-indicator"></div>
                        <div class="perfopt-status-text">${Config.lazyLoad.enabled ? '已启用' : '已禁用'}</div>
                    </div>
                </div>
                <div class="perfopt-module-item">
                    <div class="perfopt-module-info">
                        <div class="perfopt-module-icon">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                            </svg>
                        </div>
                        <div class="perfopt-module-name">GPU加速</div>
                    </div>
                    <div class="perfopt-module-status">
                        <div class="perfopt-status-indicator"></div>
                        <div class="perfopt-status-text">${Config.hardwareAcceleration.enabled ? '已启用' : '已禁用'}</div>
                    </div>
                </div>
                <div class="perfopt-module-item">
                    <div class="perfopt-module-info">
                        <div class="perfopt-module-icon">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="3" width="18" height="18" rx="2"/>
                                <line x1="3" y1="9" x2="21" y2="9"/>
                                <line x1="9" y1="21" x2="9" y2="9"/>
                            </svg>
                        </div>
                        <div class="perfopt-module-name">内容可见性优化</div>
                    </div>
                    <div class="perfopt-module-status">
                        <div class="perfopt-status-indicator"></div>
                        <div class="perfopt-status-text">${Config.contentVisibility.enabled ? '已启用' : '已禁用'}</div>
                    </div>
                </div>

                <div class="perfopt-stats">
                    <div class="perfopt-stats-row">
                        <span>懒加载图片:</span>
                        <span id="perfopt-lazy-count">0</span>
                    </div>
                    <div class="perfopt-stats-row">
                        <span>GPU加速元素:</span>
                        <span id="perfopt-gpu-count">0</span>
                    </div>
                    <div class="perfopt-stats-row">
                        <span>视口内元素:</span>
                        <span id="perfopt-auto-count">0</span>
                    </div>
                    <div class="perfopt-stats-row">
                        <span>视口外隐藏:</span>
                        <span id="perfopt-hidden-count">0</span>
                    </div>
                    <div class="perfopt-stats-row">
                        <span>DOM深度:</span>
                        <span id="perfopt-dom-depth">计算中...</span>
                    </div>
                    <div class="perfopt-stats-row">
                        <span>网络类型:</span>
                        <span id="perfopt-network-type">${Env.networkType}</span>
                    </div>
                    <div class="perfopt-stats-row">
                        <span>WebGPU支持:</span>
                        <span id="perfopt-webgpu">${Env.features.webgpu ? '是' : '否'}</span>
                    </div>
                    <div class="perfopt-stats-row">
                        <span>性能等级:</span>
                        <span id="perfopt-performance-tier">${Env.performanceTier === 2 ? '高性能' : Env.performanceTier === 1 ? '中等性能' : '低性能'}</span>
                    </div>
                    <div class="perfopt-stats-row">
                        <span>版本:</span>
                        <span id="perfopt-version">v3.7.1-compatibility-optimized</span>
                    </div>
                </div>
            `;
            document.body.appendChild(this.panel);
        }

        createFallbackUI() {
            const style = document.createElement('style');
            style.textContent = `
                #perfopt-fallback-btn {
                    position: fixed !important;
                    bottom: 20px !important;
                    right: 20px !important;
                    padding: 10px 20px !important;
                    background: #007bff !important;
                    color: white !important;
                    z-index: ${Config.ui.zIndex} !important;
                    cursor: pointer !important;
                    font-family: Arial, sans-serif !important;
                    border-radius: 25px !important;
                    font-size: 14px !important;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2) !important;
                    user-select: none !important;
                }
            `;
            document.head.appendChild(style);

            this.button = document.createElement('div');
            this.button.id = 'perfopt-fallback-btn';
            this.button.textContent = '⚡ 性能优化';
            this.button.onclick = () => {
                const info = `
性能优化工具已加载
版本: v3.7.1-compatibility-optimized
状态: 已运行

优化功能:
✅ 图片懒加载
✅ GPU加速优化 (WebGPU兼容)
✅ 内容可见性优化 (视口感知)
✅ DOM深度分析
✅ Core Web Vitals监控

环境信息:
设备性能: ${Env.performanceTier === 2 ? '高性能' : Env.performanceTier === 1 ? '中等性能' : '低性能'}
网络类型: ${Env.networkType}
WebGPU支持: ${Env.features.webgpu ? '是' : '否'}
                `;
                alert(info);
            };
            document.body.appendChild(this.button);

            Logger.warn('UIController', '使用降级UI');
        }

        startAutoHideTimer() {
            this.autoHideTimeout = setTimeout(() => {
                if (!this.panelVisible && !this.isHovered) {
                    this.hideButton();
                }
            }, Config.ui.autoHideDelay);
        }

        resetAutoHideTimer() {
            if (this.autoHideTimeout) {
                clearTimeout(this.autoHideTimeout);
            }
            if (!this.panelVisible) {
                this.startAutoHideTimer();
            }
        }

        showButton() {
            if (this.button) {
                this.button.classList.remove('hidden');
            }
        }

        hideButton() {
            if (this.button) {
                this.button.classList.add('hidden');
            }
        }

        attachEvents() {
            if (!this.button) return;

            this.button.addEventListener('click', () => {
                if (this.panel) {
                    this.panelVisible = !this.panelVisible;
                    this.panel.classList.toggle('visible');
                    if (this.panelVisible) {
                        this.showButton();
                        this.updateStats();
                        this.scheduleStatsUpdate();
                        this.resetAutoHideTimer();
                    } else {
                        this.isUpdateScheduled = false;
                        this.startAutoHideTimer();
                    }
                }
            });

            this.button.addEventListener('mouseenter', () => {
                this.isHovered = true;
                if (this.hoverTimeout) {
                    clearTimeout(this.hoverTimeout);
                }
                this.showButton();
            });

            this.button.addEventListener('mouseleave', () => {
                this.isHovered = false;
                this.hoverTimeout = setTimeout(() => {
                    if (!this.panelVisible) {
                        this.hideButton();
                    }
                }, Config.ui.hoverDelay);
            });

            if (this.panel) {
                const closeBtn = this.panel.querySelector('.perfopt-panel-close');
                closeBtn.addEventListener('click', () => {
                    this.panelVisible = false;
                    this.panel.classList.remove('visible');
                    this.isUpdateScheduled = false;
                    this.startAutoHideTimer();
                });

                this.panel.addEventListener('mouseenter', () => {
                    this.isHovered = true;
                    this.showButton();
                });

                this.panel.addEventListener('mouseleave', () => {
                    this.isHovered = false;
                    if (!this.panelVisible) {
                        this.startAutoHideTimer();
                    }
                });

                document.addEventListener('click', (e) => {
                    if (!this.button.contains(e.target) && !this.panel.contains(e.target)) {
                        this.panelVisible = false;
                        this.panel.classList.remove('visible');
                        this.isUpdateScheduled = false;
                        this.startAutoHideTimer();
                    }
                });
            }

            window.addEventListener('scroll', () => {
                this.resetAutoHideTimer();
                this.showButton();
            }, { passive: true });

            window.addEventListener('mousemove', () => {
                this.resetAutoHideTimer();
                this.showButton();
            }, { passive: true });

            window.addEventListener('resize', () => {
                this.resetAutoHideTimer();
                this.showButton();
            }, { passive: true });
        }

        destroy() {
            super.destroy();
            this.isUpdateScheduled = false;

            if (this.autoHideTimeout) {
                clearTimeout(this.autoHideTimeout);
                this.autoHideTimeout = null;
            }
            if (this.hoverTimeout) {
                clearTimeout(this.hoverTimeout);
                this.hoverTimeout = null;
            }

            const style = document.getElementById('perfopt-ui-style');
            if (style) style.remove();

            if (this.button && document.body.contains(this.button)) {
                document.body.removeChild(this.button);
            }
            if (this.panel && document.body.contains(this.panel)) {
                document.body.removeChild(this.panel);
            }
        }
    }

    // ========================
    // 9. 应用控制器
    // ========================
    class AppController extends BaseModule {
        constructor() {
            super('AppController');
            this.modules = {};
        }

        init() {
            super.init();
            try {
                const hostname = window.location.hostname;
                if (Config.blacklistedDomains.some(domain => hostname.includes(domain))) {
                    Logger.info('AppController', '当前域名在黑名单中，脚本终止运行');
                    return;
                }

                Logger.info('AppController', '开始初始化各模块');

                // 初始化性能监控器（先于UI，确保数据可被获取）
                this.modules.performanceMonitor = new PerformanceMonitor();
                this.modules.performanceMonitor.init();

                // 初始化UI控制器并注入性能监控器引用
                this.modules.uiController = new UIController();
                this.modules.uiController.setPerformanceMonitor(this.modules.performanceMonitor);
                this.modules.uiController.init();
                Logger.info('AppController', 'UI控制器初始化成功');

                this.modules.imageOptimizer = new ImageOptimizer();
                this.modules.imageOptimizer.init();

                this.modules.gpuAccelerator = new GPUAccelerator();
                this.modules.gpuAccelerator.init();

                this.modules.contentVisibility = new ContentVisibility();
                this.modules.contentVisibility.init();

                this.modules.preconnectOptimizer = new PreconnectOptimizer();
                this.modules.preconnectOptimizer.init();

                Logger.info('AppController', '所有模块初始化完成');

                window.addEventListener('beforeunload', () => this.destroy());
            } catch (error) {
                Logger.error('AppController', `初始化失败: ${error.message}`);
                Logger.error('AppController', error.stack);
                this.destroy();
                createEmergencyUI();
            }
        }

        destroy() {
            Object.values(this.modules).reverse().forEach(module => {
                if (module && module.destroy) {
                    try {
                        module.destroy();
                    } catch (e) {
                        Logger.warn('AppController', `模块${module.moduleName}销毁失败: ${e.message}`);
                    }
                }
            });
            super.destroy();
        }
    }

    // ========================
    // 10. 启动与错误处理
    // ========================
    function bootstrap() {
        try {
            Logger.info('Bootstrap', '性能优化工具加载中...');
            const app = new AppController();
            app.init();
            window.PerfOptimizer = app;
            Logger.info('Bootstrap', '性能优化工具加载成功');

            setTimeout(() => {
                Logger.info('Bootstrap', {
                    uiController: !!window.PerfOptimizer?.modules?.uiController,
                    button: !!document.querySelector('.perfopt-ui-button, #perfopt-fallback-btn'),
                    panel: !!document.querySelector('.perfopt-ui-panel')
                });
            }, 100);
        } catch (error) {
            Logger.error('Bootstrap', `加载失败: ${error.message}`);
            Logger.error('Bootstrap', error.stack);
            createEmergencyUI();
        }
    }

    function createEmergencyUI() {
        const style = document.createElement('style');
        style.textContent = `
            #emergency-perf-btn {
                position: fixed !important;
                bottom: 20px !important;
                right: 20px !important;
                padding: 10px 20px !important;
                background: #dc3545 !important;
                color: white !important;
                z-index: 10000 !important;
                cursor: pointer !important;
                font-family: Arial, sans-serif !important;
                border-radius: 25px !important;
                font-size: 14px !important;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2) !important;
                user-select: none !important;
            }
        `;
        document.head.appendChild(style);

        const button = document.createElement('div');
        button.id = 'emergency-perf-btn';
        button.textContent = '⚡ 修复失败';
        button.onclick = () => {
            const info = `
性能优化工具加载失败

错误信息: ${window.lastPerfError?.message || '未知错误'}

请尝试:
1. 刷新页面
2. 重新安装脚本
3. 检查浏览器控制台

如果问题持续，请报告bug。
            `;
            alert(info);
        };
        document.body.appendChild(button);
    }

    window.addEventListener('error', (e) => {
        window.lastPerfError = e;
        Logger.error('Global', e.message);
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bootstrap);
    } else {
        bootstrap();
    }

    window.PerfUtils = {
        getConfig: () => JSON.parse(JSON.stringify(Config)),
        getEnv: () => Env,
        utils: {
            isSameOrigin: (url) => {
                try {
                    return new URL(url, window.location.href).origin === window.location.origin;
                } catch (e) {
                    return false;
                }
            }
        }
    };
})();