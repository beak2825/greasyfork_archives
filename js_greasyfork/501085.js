// ==UserScript==
// @name         Universal Website Optimizer (v3 Spec) / 通用網站優化工具 (v3)
// @name:zh-TW   通用網站優化工具 (v3 實驗版)
// @namespace    https://github.com/jmsch23280866
// @version      3.1.0
// @description  The ultimate performance booster for modern web browsing. Optimizes CPU, RAM, Network, and Storage usage while maintaining site functionality.
// @description:zh-TW 極致的網頁瀏覽效能優化工具。在不影響網站功能的前提下，降低CPU、RAM、網絡和存儲使用率。
// @author       特務E04
// @supportURL   https://github.com/jmsch23280866/Universal-Website-Optimizer/issues/
// @license      MIT
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/501085/Universal%20Website%20Optimizer%20%28v3%20Spec%29%20%20%E9%80%9A%E7%94%A8%E7%B6%B2%E7%AB%99%E5%84%AA%E5%8C%96%E5%B7%A5%E5%85%B7%20%28v3%29.user.js
// @updateURL https://update.greasyfork.org/scripts/501085/Universal%20Website%20Optimizer%20%28v3%20Spec%29%20%20%E9%80%9A%E7%94%A8%E7%B6%B2%E7%AB%99%E5%84%AA%E5%8C%96%E5%B7%A5%E5%85%B7%20%28v3%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /**
     * Localization
     * 多語言支援
     */
    const Translations = {
        'zh-TW': {
            'menu_throttle': '🚀 背景資源限制',
            'menu_lazyload': '🖼️ 圖片延遲加載',
            'menu_tracker': '🛡️ 阻擋追蹤廣告',
            'menu_font': '🅰️ 字型載入優化',
            'menu_autoplay': '🎬 禁止影片自動播放',
            'menu_simplified': '⚡ 極簡模式 (移除裝飾)',
            'on': '開啟',
            'off': '關閉'
        },
        'zh-CN': {
            'menu_throttle': '🚀 背景资源限制',
            'menu_lazyload': '🖼️ 图片延迟加载',
            'menu_tracker': '🛡️ 阻挡追踪广告',
            'menu_font': '🅰️ 字体加载优化',
            'menu_autoplay': '🎬 禁止影片自动播放',
            'menu_simplified': '⚡ 极简模式 (移除装饰)',
            'on': '开启',
            'off': '关闭'
        },
        'en': {
            'menu_throttle': '🚀 Background Tab Throttling',
            'menu_lazyload': '🖼️ Lazy Load Images',
            'menu_tracker': '🛡️ Block Trackers & Ads',
            'menu_font': '🅰️ Optimize Font Loading',
            'menu_autoplay': '🎬 Disable Video Autoplay',
            'menu_simplified': '⚡ Simplified Mode (No Decorations)',
            'on': 'ON',
            'off': 'OFF'
        }
    };

    class Locale {
        static get lang() {
            const navLang = navigator.language || 'en';
            if (navLang.toLowerCase().includes('zh')) {
                return navLang.includes('CN') ? 'zh-CN' : 'zh-TW';
            }
            return 'en';
        }

        static get(key) {
            const lang = Locale.lang;
            const strings = Translations[lang] || Translations['en'];
            return strings[key] || key;
        }
    }

    /**
     * Configuration Management
     * 處理使用者設定與選單
     */
    class Config {
        constructor() {
            this.settings = {
                throttleBackground: GM_getValue('throttleBackground', true),
                lazyLoadImages: GM_getValue('lazyLoadImages', true),
                blockAdsTrackers: GM_getValue('blockAdsTrackers', true),
                optimizeFontLoading: GM_getValue('optimizeFontLoading', true),
                disableVideoAutoplay: GM_getValue('disableVideoAutoplay', true),
                simplifiedMode: GM_getValue('simplifiedMode', false)
            };
            this.initMenu();
        }

        initMenu() {
            const getLabel = (key, value) => {
                const status = value ? Locale.get('on') : Locale.get('off');
                return `${Locale.get(key)}: ${status}`;
            };

            GM_registerMenuCommand(getLabel('menu_throttle', this.settings.throttleBackground), () => this.toggle('throttleBackground'));
            GM_registerMenuCommand(getLabel('menu_lazyload', this.settings.lazyLoadImages), () => this.toggle('lazyLoadImages'));
            GM_registerMenuCommand(getLabel('menu_tracker', this.settings.blockAdsTrackers), () => this.toggle('blockAdsTrackers'));
            GM_registerMenuCommand(getLabel('menu_font', this.settings.optimizeFontLoading), () => this.toggle('optimizeFontLoading'));
            GM_registerMenuCommand(getLabel('menu_autoplay', this.settings.disableVideoAutoplay), () => this.toggle('disableVideoAutoplay'));
            GM_registerMenuCommand(getLabel('menu_simplified', this.settings.simplifiedMode), () => this.toggle('simplifiedMode'));
        }

        toggle(key) {
            this.settings[key] = !this.settings[key];
            GM_setValue(key, this.settings[key]);
            location.reload();
        }

        get(key) {
            return this.settings[key];
        }
    }

    /**
     * Utilities
     * 通用工具函式
     */
    class Utils {
        static log(msg, type = 'info') {
            const prefix = '[Optimizer v3]';
            const style = 'background: #2b2b2b; color: #bada55; padding: 2px 4px; border-radius: 2px;';
            if (type === 'error') console.error(prefix, msg);
            else console.log(`%c${prefix}`, style, msg);
        }

        static debounce(func, wait) {
            let timeout;
            return function (...args) {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), wait);
            };
        }
    }

    /**
     * Network Controller
     * 負責攔截與優化網絡請求
     */
    class NetworkController {
        constructor(config) {
            this.config = config;
            this.blockList = [
                'google-analytics.com', 'googletagmanager.com', 'doubleclick.net',
                'facebook.net/en_US/fbevents.js', 'adsbygoogle.js', 'analytics.js',
                'clarity.ms', 'hotjar.com', 'yandex.ru'
            ];
        }

        init() {
            if (this.config.get('blockAdsTrackers')) {
                this.interceptFetch();
                this.interceptXHR();
            }
        }

        isBlocked(url) {
            return this.blockList.some(domain => url.includes(domain));
        }

        interceptFetch() {
            const originalFetch = window.fetch;
            window.fetch = async (input, init) => {
                const url = typeof input === 'string' ? input : input.url;
                if (this.isBlocked(url)) {
                    // Utils.log(`Blocked Fetch: ${url}`);
                    return new Response(null, { status: 204, statusText: 'No Content' });
                }
                return originalFetch.call(window, input, init);
            };
        }

        interceptXHR() {
            const originalOpen = XMLHttpRequest.prototype.open;
            const self = this;
            XMLHttpRequest.prototype.open = function (method, url) {
                if (self.isBlocked(url)) {
                    // Utils.log(`Blocked XHR: ${url}`);
                    // 將 URL 指向空，或標記此請求被取消
                    return;
                }
                return originalOpen.apply(this, arguments);
            };
        }
    }

    /**
     * Performance Engine
     * 負責 CPU/RAM 資源調度與背景頁面降速
     */
    class PerformanceEngine {
        constructor(config) {
            this.config = config;
            this.originalRAF = window.requestAnimationFrame;
            this.originalSetInterval = window.setInterval;
            this.originalSetTimeout = window.setTimeout;
            this.timers = new Set();
            this.isBackground = false;
        }

        init() {
            if (this.config.get('throttleBackground')) {
                document.addEventListener('visibilitychange', () => this.handleVisibilityChange());
                this.handleVisibilityChange(); // Initial check
            }
        }

        handleVisibilityChange() {
            this.isBackground = document.visibilityState === 'hidden';

            if (this.isBackground) {
                this.enableThrottling();
                document.title = `💤 ${document.title}`;
            } else {
                this.disableThrottling();
                document.title = document.title.replace(/^💤\s/, '');
            }
        }

        enableThrottling() {
            // 強制降頻 requestAnimationFrame
            window.requestAnimationFrame = (callback) => {
                // 背景時，每秒只執行 1 次 RAF (或更低)
                return this.originalSetTimeout(() => {
                    this.originalRAF(callback);
                }, 1000);
            };

            // 攔截並降頻 setInterval
            window.setInterval = (callback, delay, ...args) => {
                // 背景時，強制最小間隔為 1000ms
                const newDelay = Math.max(delay, 1000);
                return this.originalSetInterval(callback, newDelay, ...args);
            };

            // 暫停所有高消耗的 CSS 動畫 (如果可行)
            document.body.style.transition = 'none';
        }

        disableThrottling() {
            window.requestAnimationFrame = this.originalRAF;
            window.setInterval = this.originalSetInterval;
            document.body.style.transition = '';
        }
    }

    /**
     * DOM Handler
     * 負責頁面渲染優化、懶加載與元素清理
     */
    class DOMHandler {
        constructor(config) {
            this.config = config;
            this.observer = null;
        }

        init() {
            if (this.config.get('lazyLoadImages')) {
                this.setupLazyLoading();
            }
            if (this.config.get('optimizeFontLoading')) {
                this.optimizeFonts();
            }
            if (this.config.get('disableVideoAutoplay')) {
                this.disableAutoplay();
            }
            if (this.config.get('simplifiedMode')) {
                this.simplifyUI();
            }

            // 持續監控 DOM 變動
            this.observeMutations();
        }

        setupLazyLoading() {
            // 對現有圖片強制啟用 lazy loading
            const lazyImageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        observer.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img').forEach(img => {
                if (!img.getAttribute('loading')) {
                    img.setAttribute('loading', 'lazy');
                }
            });
        }

        optimizeFonts() {
            // 強制字體顯示策略 swap
            const style = document.createElement('style');
            style.textContent = `
                @font-face { font-display: swap; }
            `;
            document.head.appendChild(style);
        }

        disableAutoplay() {
            // 捕獲並暫停 video 元素
            const pauseVideo = (video) => {
                video.autoplay = false;
                video.pause();
                video.removeAttribute('autoplay');
            };

            document.querySelectorAll('video').forEach(pauseVideo);
        }

        simplifyUI() {
            // 移除裝飾性元素，僅保留主要內容 (實驗性)
            const style = document.createElement('style');
            style.textContent = `
                * { box-shadow: none !important; text-shadow: none !important; transition: none !important; animation: none !important; }
                .ads, .banner, .popup, [class*="ad-"], [id*="ad-"] { display: none !important; }
            `;
            document.head.appendChild(style);
        }

        observeMutations() {
            const observer = new MutationObserver(Utils.debounce((mutations) => {
                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType !== 1) return;

                        // 新增節點處理
                        if (node.tagName === 'VIDEO' && this.config.get('disableVideoAutoplay')) {
                            node.autoplay = false;
                            node.pause();
                        }
                        if (node.tagName === 'IMG' && this.config.get('lazyLoadImages')) {
                            node.setAttribute('loading', 'lazy');
                        }
                        // 移除常見廣告 iframe
                        if (node.tagName === 'IFRAME' && this.config.get('blockAdsTrackers')) {
                            if (node.src && (node.src.includes('ads') || node.src.includes('doubleclick'))) {
                                node.remove();
                            }
                        }
                    });
                });
            }, 500));

            observer.observe(document.body || document.documentElement, {
                childList: true,
                subtree: true
            });
        }
    }

    /**
     * Optimizer Core
     * 主程式入口
     */
    class OptimizerCore {
        constructor() {
            Utils.log('Initializing v3.0 Core...');
            this.config = new Config();
            this.perfEngine = new PerformanceEngine(this.config);
            this.netController = new NetworkController(this.config);
            this.domHandler = new DOMHandler(this.config);
        }

        start() {
            this.perfEngine.init();
            this.netController.init();

            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.domHandler.init());
            } else {
                this.domHandler.init();
            }

            // 全局 CSS 優化
            this.injectGlobalStyles();
        }

        injectGlobalStyles() {
            const style = document.createElement('style');
            style.textContent = `
                /* 提升渲染性能：告訴瀏覽器某些區域在螢幕外不需要渲染 */
                .heavy-content, .comments-section, .related-posts {
                    content-visibility: auto;
                    contain-intrinsic-size: 1px 1000px;
                }
            `;
            document.head.appendChild(style);
        }
    }

    // 啟動優化器
    const optimizer = new OptimizerCore();
    optimizer.start();

})();