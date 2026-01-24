// ==UserScript==
// @name         Web性能综合优化工具箱 (通用增强版)
// @namespace    http://tampermonkey.net/
// @version      3.6.3-compatibility-optimized
// @description  Web浏览提速80%，DOM渲染及GPU加速，包含自动吸附隐藏功能
// @author       KiwiFruit
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529387/Web%E6%80%A7%E8%83%BD%E7%BB%BC%E5%90%88%E4%BC%98%E5%8C%96%E5%B7%A5%E5%85%B7%E7%AE%B1%20%28%E9%80%9A%E7%94%A8%E5%A2%9E%E5%BC%BA%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/529387/Web%E6%80%A7%E8%83%BD%E7%BB%BC%E5%90%88%E4%BC%98%E5%8C%96%E5%B7%A5%E5%85%B7%E7%AE%B1%20%28%E9%80%9A%E7%94%A8%E5%A2%9E%E5%BC%BA%E7%89%88%29.meta.js
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
            webWorker: 'Worker' in window,
            performanceObserver: 'PerformanceObserver' in window,
            paintTiming: 'PerformancePaintTiming' in window
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
        debug: true,
        ui: {
            enabled: true,
            position: 'bottom-right',
            zIndex: 9999,
            autoHideDelay: 2000, // 自动隐藏延迟(毫秒)
            hoverDelay: 300, // 悬停显示延迟(毫秒)
            hideOffset: { bottom: 20, right: -50 }, // 隐藏位置偏移
            showOffset: { bottom: 20, right: 20 } // 显示位置偏移
        },
        lazyLoad: {
            enabled: true,
            selector: 'img[data-src], img[data-original], img.lazy, iframe[data-src], .js-lazy-load',
            preloadDistance: 50
        },
        hardwareAcceleration: {
            enabled: true,
            selector: 'header, nav, aside, .sticky, .fixed, .js-animate, .js-transform'
        },
        contentVisibility: {
            enabled: true,
            selector: 'section, article, main, .content, .post, .js-section',
            hiddenDistance: 500
        },
        preconnect: {
            enabled: true,
            domains: ['cdn.jsdelivr.net', 'cdnjs.cloudflare.com', 'fonts.googleapis.com', 'fonts.gstatic.com']
        },
        eventOptimization: {
            enabled: true,
            delegates: [
                { selector: '.js-button', handler: handleButtonClick },
                { selector: '.js-link', handler: handleLinkClick },
                { selector: '.js-tab', handler: handleTabClick }
            ]
        }
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
    // 2. 核心性能优化类
    // ========================
    class BaseModule {
        constructor(name) {
            this.moduleName = name;
            this.initialized = false;
        }
        init() {
            if (this.initialized) {
                Logger.warn(this.moduleName, '已初始化');
                return;
            }
            this.initialized = true;
            Logger.info(this.moduleName, '初始化完成');
        }
        destroy() {
            if (!this.initialized) return;
            this.initialized = false;
            Logger.info(this.moduleName, '已销毁');
        }
        emit(event, data = {}) {
            window.dispatchEvent(new CustomEvent(`perfopt:${this.moduleName}:${event}`, {
                detail: { ...data, module: this.moduleName, timestamp: Date.now() }
            }));
        }
    }

    // ========================
    // 3. 图片懒加载优化
    // ========================
    class ImageOptimizer extends BaseModule {
        constructor() {
            super('ImageOptimizer');
            this.observer = null;
            this.scrollListener = null;
        }
        init() {
            super.init();

            if (!Config.lazyLoad.enabled) {
                Logger.warn('ImageOptimizer', '图片懒加载未启用');
                return;
            }

            if (Env.features.nativeLazyLoad) {
                this.applyNativeLazyLoad();
            } else if (Env.features.intersectionObserver) {
                this.applyIntersectionObserver();
            } else {
                this.applyScrollBasedLazyLoad();
            }

            Logger.info('ImageOptimizer', '图片懒加载初始化完成');
        }
        applyNativeLazyLoad() {
            document.querySelectorAll(Config.lazyLoad.selector).forEach(el => {
                el.loading = 'lazy';
                if (el.dataset.src) {
                    el.src = el.dataset.src;
                    delete el.dataset.src;
                }
            });
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
                        }
                    }
                });
            }, {
                rootMargin: `${Config.lazyLoad.preloadDistance}px 0px`,
                threshold: 0.01
            });

            document.querySelectorAll(Config.lazyLoad.selector).forEach(el => {
                this.observer.observe(el);
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
        destroy() {
            super.destroy();
            if (this.observer) {
                this.observer.disconnect();
            }
            if (this.scrollListener) {
                window.removeEventListener('scroll', this.scrollListener);
            }
        }
    }

    // ========================
    // 4. GPU加速优化
    // ========================
    class GPUAccelerator extends BaseModule {
        constructor() {
            super('GPUAccelerator');
        }
        init() {
            super.init();

            if (!Config.hardwareAcceleration.enabled) {
                Logger.warn('GPUAccelerator', 'GPU加速未启用');
                return;
            }

            document.querySelectorAll(Config.hardwareAcceleration.selector).forEach(el => {
                this.applyGPUAcceleration(el);
            });

            Logger.info('GPUAccelerator', 'GPU加速初始化完成');
        }
        applyGPUAcceleration(element) {
            if (element.style.transform ||
                element.style.backfaceVisibility ||
                element.classList.contains('gpu-accelerate')) {
                return;
            }

            element.classList.add('gpu-accelerate');
            element.style.transform = 'translateZ(0)';
            element.style.backfaceVisibility = 'hidden';
            element.style.willChange = 'transform';
        }
        removeGPUAcceleration(element) {
            element.classList.remove('gpu-accelerate');
            element.style.transform = '';
            element.style.backfaceVisibility = '';
            element.style.willChange = '';
        }
        destroy() {
            super.destroy();
            document.querySelectorAll(Config.hardwareAcceleration.selector).forEach(el => {
                this.removeGPUAcceleration(el);
            });
        }
    }

    // ========================
    // 5. 内容可见性优化
    // ========================
    class ContentVisibility extends BaseModule {
        constructor() {
            super('ContentVisibility');
            this.scrollListener = null;
            this.resizeListener = null;
        }
        init() {
            super.init();

            if (!Config.contentVisibility.enabled) {
                Logger.warn('ContentVisibility', '内容可见性优化未启用');
                return;
            }

            const sections = document.querySelectorAll(Config.contentVisibility.selector);

            const viewportHeight = window.innerHeight;
            const scrollTop = window.pageYOffset;

            sections.forEach(el => {
                const rect = el.getBoundingClientRect();
                const distanceFromViewport = Math.max(
                    rect.top - viewportHeight,
                    0 - rect.bottom
                );

                if (distanceFromViewport > Config.contentVisibility.hiddenDistance) {
                    el.style.contentVisibility = 'hidden';
                    el.style.containIntrinsicSize = '200px';
                }
            });

            let ticking = false;
            const handleChange = () => {
                if (!ticking) {
                    requestAnimationFrame(() => {
                        this.updateVisibility();
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
        updateVisibility() {
            const viewportHeight = window.innerHeight;
            const scrollTop = window.pageYOffset;

            document.querySelectorAll(Config.contentVisibility.selector).forEach(el => {
                const rect = el.getBoundingClientRect();

                if (rect.top < viewportHeight + Config.contentVisibility.hiddenDistance &&
                    rect.bottom > -Config.contentVisibility.hiddenDistance) {
                    el.style.contentVisibility = 'auto';
                } else {
                    el.style.contentVisibility = 'hidden';
                }
            });
        }
        destroy() {
            super.destroy();
            if (this.scrollListener) {
                window.removeEventListener('scroll', this.scrollListener);
            }
            if (this.resizeListener) {
                window.removeEventListener('resize', this.resizeListener);
            }
            document.querySelectorAll(Config.contentVisibility.selector).forEach(el => {
                el.style.contentVisibility = '';
                el.style.containIntrinsicSize = '';
            });
        }
    }

    // ========================
    // 6. 预连接优化
    // ========================
    class PreconnectOptimizer extends BaseModule {
        constructor() {
            super('PreconnectOptimizer');
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

                const dnsLink = document.createElement('link');
                dnsLink.rel = 'dns-prefetch';
                dnsLink.href = `https://${domain}`;
                document.head.appendChild(dnsLink);
            });

            Logger.info('PreconnectOptimizer', '预连接优化初始化完成');
        }
        destroy() {
            super.destroy();
            const links = document.querySelectorAll('link[rel="preconnect"], link[rel="dns-prefetch"]');
            links.forEach(link => link.remove());
        }
    }

    // ========================
    // 7. 事件优化
    // ========================
    class EventOptimizer extends BaseModule {
        constructor() {
            super('EventOptimizer');
        }
        init() {
            super.init();

            if (!Config.eventOptimization.enabled) {
                Logger.warn('EventOptimizer', '事件优化未启用');
                return;
            }

            this.delegateEvents();
            Logger.info('EventOptimizer', '事件优化初始化完成');
        }
        delegateEvents() {
            document.addEventListener('click', (e) => {
                Config.eventOptimization.delegates.forEach(delegate => {
                    if (e.target.matches(delegate.selector) ||
                        e.target.closest(delegate.selector)) {
                        delegate.handler(e);
                    }
                });
            }, { passive: true });
        }
        destroy() {
            super.destroy();
            document.removeEventListener('click', this.handleEventDelegate);
        }
    }

    // ========================
    // 8. 性能监控
    // ========================
    class PerformanceMonitor extends BaseModule {
        constructor() {
            super('PerformanceMonitor');
            this.observer = null;
        }
        init() {
            super.init();

            if (Env.features.performanceObserver) {
                this.observer = new PerformanceObserver((list) => {
                    list.getEntries().forEach(entry => {
                        if (entry.entryType === 'paint') {
                            if (entry.name === 'first-contentful-paint') {
                                Logger.info('Performance', `FCP: ${entry.startTime.toFixed(0)}ms`);
                            }
                        } else if (entry.entryType === 'layout-shift') {
                            Logger.info('Performance', `CLS: ${entry.value.toFixed(3)}`);
                        } else if (entry.entryType === 'largest-contentful-paint') {
                            Logger.info('Performance', `LCP: ${entry.startTime.toFixed(0)}ms`);
                        }
                    });
                });

                this.observer.observe({
                    entryTypes: ['paint', 'layout-shift', 'largest-contentful-paint']
                });
            }

            window.addEventListener('load', () => {
                const timing = performance.timing;
                const ttfb = timing.responseStart - timing.navigationStart;
                Logger.info('Performance', `TTFB: ${ttfb.toFixed(0)}ms`);
            });

            Logger.info('PerformanceMonitor', '性能监控初始化完成');
        }
        destroy() {
            super.destroy();
            if (this.observer) {
                this.observer.disconnect();
            }
        }
    }

    // ========================
    // 9. UI控制器（包含自动吸附隐藏功能）
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
            this.updateInterval = null;
        }
        init() {
            super.init();
            if (!Config.ui.enabled) return;

            try {
                this.createUI();
                this.attachEvents();
                this.updateStats();
                this.startAutoUpdate();
                this.startAutoHideTimer();
                Logger.info('UIController', 'UI组件创建成功（包含自动吸附隐藏功能）');
            } catch (error) {
                Logger.error('UIController', `UI创建失败: ${error.message}`);
                Logger.error('UIController', error.stack);
                this.createFallbackUI();
            }
        }
        createUI() {
            // 创建样式
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
                    width: 300px !important;
                    background: rgba(255, 255, 255, 0.95) !important;
                    backdrop-filter: blur(10px) !important;
                    border-radius: 16px !important;
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15) !important;
                    padding: 20px !important;
                    z-index: ${Config.ui.zIndex - 1} !important;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
                    max-height: 80vh !important;
                    overflow-y: auto !important;
                    display: none !important;
                    transition: opacity 0.3s ease, transform 0.3s ease !important;
                    transform: translateY(10px) !important;
                    opacity: 0 !important;
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

            // 创建按钮
            this.button = document.createElement('div');
            this.button.className = 'perfopt-ui-button';
            this.button.innerHTML = '⚡';
            document.body.appendChild(this.button);

            // 创建面板
            this.panel = document.createElement('div');
            this.panel.className = 'perfopt-ui-panel';
            this.panel.innerHTML = `
                <div class="perfopt-panel-header">
                    <div class="perfopt-panel-title">性能优化工具箱</div>
                    <div class="perfopt-panel-close">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
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
                        <span>DOM深度:</span>
                        <span id="perfopt-dom-depth">0</span>
                    </div>
                    <div class="perfopt-stats-row">
                        <span>网络类型:</span>
                        <span id="perfopt-network-type">${Env.networkType}</span>
                    </div>
                    <div class="perfopt-stats-row">
                        <span>性能等级:</span>
                        <span id="perfopt-performance-tier">${Env.performanceTier === 2 ? '高性能' : Env.performanceTier === 1 ? '中等性能' : '低性能'}</span>
                    </div>
                    <div class="perfopt-stats-row">
                        <span>版本:</span>
                        <span id="perfopt-version">v${GM_info?.script?.version || '3.6.3-compatibility-optimized'}</span>
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
                }
            `;
            document.head.appendChild(style);

            this.button = document.createElement('div');
            this.button.id = 'perfopt-fallback-btn';
            this.button.textContent = '⚡ 性能优化';
            this.button.onclick = () => {
                const info = `
性能优化工具已加载
版本: v3.6.3-compatibility-optimized
状态: 已运行

优化功能:
✅ 图片懒加载
✅ GPU加速优化
✅ 内容可见性优化
✅ DOM深度分析
✅ 事件优化

环境信息:
设备性能: ${Env.performanceTier === 2 ? '高性能' : '低性能'}
网络类型: ${Env.networkType}
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
        updateStats() {
            if (!this.panel) return;

            try {
                const lazyCount = document.querySelectorAll(Config.lazyLoad.selector).length;
                const gpuCount = document.querySelectorAll('.gpu-accelerate').length;

                let domDepth = 0;
                Array.from(document.querySelectorAll('*')).forEach(el => {
                    let depth = 0;
                    let parent = el;
                    while (parent && parent !== document) {
                        depth++;
                        parent = parent.parentNode;
                    }
                    if (depth > domDepth) domDepth = depth;
                });

                document.getElementById('perfopt-lazy-count').textContent = lazyCount;
                document.getElementById('perfopt-gpu-count').textContent = gpuCount;
                document.getElementById('perfopt-dom-depth').textContent = domDepth;
            } catch (error) {
                Logger.warn('UIController', `统计更新失败: ${error.message}`);
            }
        }
        startAutoUpdate() {
            this.updateInterval = setInterval(() => {
                this.updateStats();
            }, 2000);
        }
        attachEvents() {
            if (!this.button) return;

            // 按钮点击事件
            this.button.addEventListener('click', () => {
                if (this.panel) {
                    this.panelVisible = !this.panelVisible;
                    this.panel.classList.toggle('visible');
                    if (this.panelVisible) {
                        this.showButton();
                        this.updateStats();
                        this.resetAutoHideTimer();
                    } else {
                        this.startAutoHideTimer();
                    }
                }
            });

            // 按钮悬停事件
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
                // 面板关闭事件
                const closeBtn = this.panel.querySelector('.perfopt-panel-close');
                closeBtn.addEventListener('click', () => {
                    this.panelVisible = false;
                    this.panel.classList.remove('visible');
                    this.startAutoHideTimer();
                });

                // 面板悬停事件
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

                // 点击外部关闭面板
                document.addEventListener('click', (e) => {
                    if (!this.button.contains(e.target) && !this.panel.contains(e.target)) {
                        this.panelVisible = false;
                        this.panel.classList.remove('visible');
                        this.startAutoHideTimer();
                    }
                });
            }

            // 页面滚动和交互事件（重置自动隐藏计时器）
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
            if (this.updateInterval) {
                clearInterval(this.updateInterval);
            }
            if (this.autoHideTimeout) {
                clearTimeout(this.autoHideTimeout);
            }
            if (this.hoverTimeout) {
                clearTimeout(this.hoverTimeout);
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
    // 10. 应用控制器
    // ========================
    class AppController extends BaseModule {
        constructor() {
            super('AppController');
            this.modules = {};
        }
        init() {
            super.init();
            try {
                Logger.info('AppController', '开始初始化各模块');

                // 初始化UI控制器
                this.modules.uiController = new UIController();
                this.modules.uiController.init();
                Logger.info('AppController', 'UI控制器初始化成功');

                // 初始化性能优化模块
                this.modules.imageOptimizer = new ImageOptimizer();
                this.modules.imageOptimizer.init();

                this.modules.gpuAccelerator = new GPUAccelerator();
                this.modules.gpuAccelerator.init();

                this.modules.contentVisibility = new ContentVisibility();
                this.modules.contentVisibility.init();

                this.modules.preconnectOptimizer = new PreconnectOptimizer();
                this.modules.preconnectOptimizer.init();

                this.modules.eventOptimizer = new EventOptimizer();
                this.modules.eventOptimizer.init();

                this.modules.performanceMonitor = new PerformanceMonitor();
                this.modules.performanceMonitor.init();

                Logger.info('AppController', '所有模块初始化完成');

                window.addEventListener('beforeunload', () => this.destroy());
            } catch (error) {
                Logger.error('AppController', `初始化失败: ${error.message}`);
                Logger.error('AppController', error.stack);
                this.destroy();
            }
        }
        destroy() {
            Object.values(this.modules).reverse().forEach(module => {
                if (module && module.destroy) {
                    try { module.destroy(); }
                    catch (e) { Logger.warn('AppController', `模块${module.moduleName}销毁失败`); }
                }
            });
            super.destroy();
        }
    }

    // ========================
    // 11. 启动与错误处理
    // ========================
    function bootstrap() {
        try {
            Logger.info('Bootstrap', '性能优化工具加载中...');
            const app = new AppController();
            app.init();
            window.PerfOptimizer = app;
            Logger.info('Bootstrap', '性能优化工具加载成功');

            // 验证UI创建
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
                z-index: 9999 !important;
                cursor: pointer !important;
                font-family: Arial, sans-serif !important;
                border-radius: 25px !important;
                font-size: 14px !important;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2) !important;
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

    // 错误捕获
    window.addEventListener('error', (e) => {
        window.lastPerfError = e;
        Logger.error('Global', e.message);
    });

    // 事件处理函数
    function handleButtonClick(e) {
        Logger.debug('Event', '按钮点击');
    }

    function handleLinkClick(e) {
        Logger.debug('Event', '链接点击');
    }

    function handleTabClick(e) {
        Logger.debug('Event', '标签页点击');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bootstrap);
    } else {
        bootstrap();
    }

    // 导出API
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