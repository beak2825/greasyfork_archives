// ==UserScript==
// @name         Twitter/X Auto Dark Theme Switch
// @version      0.1.7
// @description  Enhanced theme management for Twitter/X with native support detection and fallback
// @icon         https://raw.githubusercontent.com/TiancongLx/Tempermonkey/refs/heads/main/twitter_auto_dark_theme_switch/icon_X.png
// @license      WTFPL
// @author       Original: 13xforever, Enhanced: tianconglx
// @match        https://twitter.com/*
// @match        https://x.com/*
// @run-at       document-start
// @namespace    https://github.com/TiancongLx
// @downloadURL https://update.greasyfork.org/scripts/518867/TwitterX%20Auto%20Dark%20Theme%20Switch.user.js
// @updateURL https://update.greasyfork.org/scripts/518867/TwitterX%20Auto%20Dark%20Theme%20Switch.meta.js
// ==/UserScript==


(function() {
    "use strict";

    /**
     * Twitter/X 主题管理器
     * - 检测原生自动主题功能
     * - 在没有原生支持时提供自动主题切换
     * - 支持优雅降级和渐进增强
     */
    class XThemeManager {
        constructor() {
            // 配置常量
            this.CONFIG = {
                THEMES: {
                    LIGHT: "0",  // X 的亮色主题值
                    DIM:   "1",  // X 的暗色主题值
                    DARK:  "2",  // X 的深色主题值（备用）
                },
                COOKIE: {
                    NAME: "night_mode",
                    DOMAINS: ['.twitter.com', '.x.com'],
                    MAX_AGE: 365 * 24 * 60 * 60  // 一年的秒数
                },
                DETECTION: {
                    INTERVAL: 2000,  // 检测间隔（毫秒）
                    MAX_ATTEMPTS: 5  // 最大检测次数
                },
                DEBUG: false  // 是否启用调试日志
            };

            // 内部状态
            this.state = {
                enabled: false,
                nativeSupport: false,
                mediaQuery: null,
                eventListeners: new Set()
            };
        }

        /**
         * 初始化主题管理器
         * @returns {Promise<void>}
         */
        async initialize() {
            this.log('Initializing theme manager...');

            try {
                // 检查浏览器特性支持
                if (!this.checkBrowserSupport()) {
                    this.log('Browser features not supported', 'warn');
                    return;
                }

                // 检查是否存在原生自动主题功能
                const hasNativeSupport = await this.checkNativeAutoTheme();

                if (hasNativeSupport) {
                    this.log('Native auto theme detected, script disabled');
                    this.state.nativeSupport = true;
                    return;
                }

                // 如果没有原生支持，启用脚本功能
                this.enableScriptTheme();
                this.log('Script theme management enabled');
            } catch (error) {
                this.log(`Initialization failed: ${error.message}`, 'error');
                throw error;
            }
        }

        /**
         * 检查浏览器必要特性支持
         * @returns {boolean}
         */
        checkBrowserSupport() {
            return window.matchMedia &&
                   document.cookie !== undefined &&
                   window.localStorage;
        }

        /**
         * 检测原生自动主题功能
         * @returns {Promise<boolean>}
         */
        async checkNativeAutoTheme() {
            let checksRemaining = this.CONFIG.DETECTION.MAX_ATTEMPTS;

            const checkFeatures = () => {
                return new Promise(resolve => {
                    const check = () => {
                        // 1. 检查设置面板中的自动主题选项
                        const hasToggle = !!document.querySelector('[data-testid="auto-theme-switch"]');

                        // 2. 检查主题相关的 CSS 变量
                        const root = document.documentElement;
                        const hasCSS = window.getComputedStyle(root)
                            .getPropertyValue('--auto-theme-enabled') === 'true';

                        // 3. 检查可能存在的主题 API
                        const hasAPI = window.__X_THEME_API__?.autoThemeSupported;

                        if (hasToggle || hasCSS || hasAPI) {
                            resolve(true);
                            return;
                        }

                        checksRemaining--;
                        if (checksRemaining > 0) {
                            setTimeout(check, this.CONFIG.DETECTION.INTERVAL);
                        } else {
                            resolve(false);
                        }
                    };

                    check();
                });
            };

            return await checkFeatures();
        }

        /**
         * 启用脚本的主题管理功能
         */
        enableScriptTheme() {
            // 设置媒体查询
            this.state.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

            // 创建主题变化处理函数
            const handleThemeChange = (e) => {
                const theme = e.matches ? this.CONFIG.THEMES.DIM : this.CONFIG.THEMES.LIGHT;
                this.setThemeCookie(theme);
            };

            // 初始设置
            handleThemeChange(this.state.mediaQuery);

            // 添加事件监听
            this.state.mediaQuery.addEventListener('change', handleThemeChange);
            this.state.eventListeners.add({
                target: this.state.mediaQuery,
                type: 'change',
                handler: handleThemeChange
            });

            this.state.enabled = true;

            // 添加原生主题支持的 meta 标签
            this.addColorSchemeMeta();
        }

        /**
         * 设置主题 cookie
         * @param {string} theme - 主题值
         */
        setThemeCookie(theme) {
            try {
                const { NAME, DOMAINS, MAX_AGE } = this.CONFIG.COOKIE;
                const cookieString = `${NAME}=${theme}; path=/; secure; max-age=${MAX_AGE}`;

                DOMAINS.forEach(domain => {
                    document.cookie = `${cookieString}; domain=${domain}`;
                });

                this.log(`Theme cookie set to: ${theme}`);
            } catch (error) {
                this.log(`Failed to set theme cookie: ${error.message}`, 'error');
            }
        }

        /**
         * 添加 color-scheme meta 标签
         */
        addColorSchemeMeta() {
            if (!document.querySelector('meta[name="color-scheme"]')) {
                const meta = document.createElement('meta');
                meta.name = 'color-scheme';
                meta.content = 'light dark';
                document.head.appendChild(meta);
                this.log('Added color-scheme meta tag');
            }
        }

        /**
         * 禁用主题管理器
         */
        disable() {
            if (!this.state.enabled) return;

            // 清理所有事件监听
            this.state.eventListeners.forEach(({ target, type, handler }) => {
                target.removeEventListener(type, handler);
            });
            this.state.eventListeners.clear();

            this.state.enabled = false;
            this.log('Theme manager disabled');
        }

        /**
         * 日志工具方法
         * @param {string} message - 日志消息
         * @param {'log'|'warn'|'error'} level - 日志级别
         */
        log(message, level = 'log') {
            if (!this.CONFIG.DEBUG) return;

            const prefix = '[X Theme Manager]';
            switch (level) {
                case 'warn':
                    console.warn(`${prefix} ${message}`);
                    break;
                case 'error':
                    console.error(`${prefix} ${message}`);
                    break;
                default:
                    console.log(`${prefix} ${message}`);
            }
        }
    }

    // 脚本启动逻辑
    const startScript = () => {
        const themeManager = new XThemeManager();

        // 将实例绑定到 window 对象，方便调试
        if (themeManager.CONFIG.DEBUG) {
            window.__X_THEME_MANAGER__ = themeManager;
        }

        // 初始化主题管理器
        themeManager.initialize().catch(error => {
            console.error('[X Theme Manager] Failed to initialize:', error);
        });
    };

    // 根据文档加载状态决定启动时机
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startScript);
    } else {
        startScript();
    }
})();
