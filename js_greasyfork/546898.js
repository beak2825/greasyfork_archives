// ==UserScript==
// @name         Web Privacy Guardian (安全网页守护者)
// @namespace    web-privacy-guardian
// @version      4.0.0
// @description  专业级网页净化与隐私保护工具，经过严格安全审查，适用于Via等WebView浏览器
// @author       ￴
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546898/Web%20Privacy%20Guardian%20%28%E5%AE%89%E5%85%A8%E7%BD%91%E9%A1%B5%E5%AE%88%E6%8A%A4%E8%80%85%29.user.js
// @updateURL https://update.greasyfork.org/scripts/546898/Web%20Privacy%20Guardian%20%28%E5%AE%89%E5%85%A8%E7%BD%91%E9%A1%B5%E5%AE%88%E6%8A%A4%E8%80%85%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===== 配置管理系统 =====
    const DEFAULT_CONFIG = {
        // 核心功能
        CLEAN_URL_TRACKING: true,
        PROTECT_REFERRER: true,
        BLOCK_POPUP_WINDOWS: true,
        REMOVE_COPY_RESTRICTIONS: true,
        
        // 可选功能（默认保守）
        CLEAN_PAGE_LINKS: false,
        HIDE_ADS_BY_CSS: false,
        OPTIMIZE_PERFORMANCE: false,
        
        // 安全设置
        ENABLE_WHITELIST: true,
        ENABLE_ERROR_RECOVERY: true,
        ENABLE_USER_FEEDBACK: false
    };

    // 从本地存储加载用户配置
    const CONFIG = (() => {
        try {
            const stored = localStorage.getItem('WPG_CONFIG');
            return stored ? {...DEFAULT_CONFIG, ...JSON.parse(stored)} : DEFAULT_CONFIG;
        } catch {
            return DEFAULT_CONFIG;
        }
    })();

    // ===== 白名单系统 =====
    const WHITELIST = new Set([
        // 金融机构
        'paypal.com', 'stripe.com',
        // 政府网站
        '.gov', '.edu',
        // 开发工具
        'github.com', 'stackoverflow.com', 'codepen.io',
        // 在线编辑器
        'codesandbox.io', 'jsfiddle.net'
    ]);

    // ===== 安全工具函数 =====
    const Utils = {
        log: (level, message, ...args) => {
            if (CONFIG.DEBUG || level === 'error') {
                console[level](`[WPG] ${message}`, ...args);
            }
        },
        
        isWhitelisted: (hostname = window.location.hostname) => {
            if (!CONFIG.ENABLE_WHITELIST) return false;
            return Array.from(WHITELIST).some(domain => 
                hostname === domain || hostname.endsWith('.' + domain)
            );
        },
        
        safeExecute: (fn, context = 'unknown') => {
            if (!CONFIG.ENABLE_ERROR_RECOVERY) {
                return fn();
            }
            try {
                return fn();
            } catch (error) {
                Utils.log('error', `Failed in ${context}:`, error);
                return null;
            }
        },
        
        debounce: (func, wait) => {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }
    };

    // 检查是否应该在当前页面运行
    if (Utils.isWhitelisted()) {
        Utils.log('info', 'Skipped: whitelisted domain');
        return;
    }

    // ===== 隐私保护模块 =====
    const PrivacyModule = {
        // 更精确的追踪参数列表
        TRACKING_PARAMS: new Set([
            // 通用追踪
            'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
            'gclid', 'fbclid', 'msclkid', 'twclid',
            // 保留必要参数：不包含 si, scm, spm（某些电商需要）
        ]),
        
        cleanURL: function() {
            if (!CONFIG.CLEAN_URL_TRACKING) return;
            
            Utils.safeExecute(() => {
                const url = new URL(window.location.href);
                let cleaned = false;
                
                // 只清理确认的追踪参数
                for (const param of url.searchParams.keys()) {
                    if (this.TRACKING_PARAMS.has(param.toLowerCase())) {
                        url.searchParams.delete(param);
                        cleaned = true;
                    }
                }
                
                if (cleaned) {
                    window.history.replaceState(null, '', url.toString());
                    Utils.log('info', 'Cleaned tracking parameters');
                }
            }, 'cleanURL');
        },
        
        protectReferrer: function() {
            if (!CONFIG.PROTECT_REFERRER) return;
            
            const meta = document.createElement('meta');
            meta.name = 'referrer';
            meta.content = 'strict-origin-when-cross-origin';
            
            // 使用更可靠的注入方式
            if (document.head) {
                document.head.appendChild(meta);
            } else {
                document.addEventListener('DOMContentLoaded', () => {
                    document.head.appendChild(meta);
                });
            }
        }
    };

    // ===== 广告拦截模块（更精确） =====
    const AdBlockModule = {
        // 更精确的选择器，减少误伤
        AD_SELECTORS: `
            iframe[src*="doubleclick.net"],
            iframe[src*="googlesyndication.com"],
            div[id^="div-gpt-ad-"],
            div[class^="ad-"][class$="-container"],
            ins.adsbygoogle,
            .sponsored-content:not(.article-content),
            [data-ad-slot]
        `,
        
        injectBlockingCSS: function() {
            if (!CONFIG.HIDE_ADS_BY_CSS) return;
            
            const style = document.createElement('style');
            style.id = 'wpg-adblock';
            style.textContent = `
                ${this.AD_SELECTORS} {
                    display: none !important;
                    visibility: hidden !important;
                    height: 0 !important;
                    overflow: hidden !important;
                }
            `;
            
            Utils.safeExecute(() => {
                (document.head || document.documentElement).appendChild(style);
            }, 'injectBlockingCSS');
        },
        
        blockPopups: function() {
            if (!CONFIG.BLOCK_POPUP_WINDOWS) return;
            
            const originalOpen = window.open;
            window.open = function(...args) {
                // 检查是否用户触发
                const userInitiated = (window.event && window.event.isTrusted) || 
                                     (document.hasFocus && document.hasFocus());
                
                if (userInitiated) {
                    return originalOpen.apply(window, args);
                }
                
                Utils.log('info', 'Blocked automatic popup');
                return null;
            };
        }
    };

    // ===== 用户体验模块 =====
    const ExperienceModule = {
        removeCopyRestrictions: function() {
            if (!CONFIG.REMOVE_COPY_RESTRICTIONS) return;
            
            // CSS解除
            const style = document.createElement('style');
            style.textContent = `
                * {
                    -webkit-user-select: auto !important;
                    -moz-user-select: auto !important;
                    user-select: auto !important;
                }
                [oncopy], [oncut], [onpaste] {
                    -webkit-user-modify: read-write !important;
                }
            `;
            (document.head || document.documentElement).appendChild(style);
            
            // 事件解除（使用被动监听器提升性能）
            ['copy', 'cut', 'paste', 'selectstart', 'contextmenu'].forEach(event => {
                document.addEventListener(event, (e) => {
                    e.stopPropagation();
                }, { capture: true, passive: true });
            });
        },
        
        // 使用 debounce 优化链接清理
        cleanLinks: Utils.debounce(function() {
            if (!CONFIG.CLEAN_PAGE_LINKS) return;
            
            document.querySelectorAll('a[href*="utm_"], a[href*="fbclid"]').forEach(link => {
                Utils.safeExecute(() => {
                    const url = new URL(link.href);
                    let cleaned = false;
                    
                    PrivacyModule.TRACKING_PARAMS.forEach(param => {
                        if (url.searchParams.has(param)) {
                            url.searchParams.delete(param);
                            cleaned = true;
                        }
                    });
                    
                    if (cleaned) {
                        link.href = url.toString();
                    }
                }, 'cleanLinks');
            });
        }, 500)
    };

    // ===== 性能优化模块 =====
    const PerformanceModule = {
        optimize: function() {
            if (!CONFIG.OPTIMIZE_PERFORMANCE) return;
            
            const style = document.createElement('style');
            style.textContent = `
                * {
                    animation-duration: 0.1s !important;
                    transition-duration: 0.1s !important;
                }
                video, iframe {
                    will-change: auto !important;
                }
            `;
            (document.head || document.documentElement).appendChild(style);
        }
    };

    // ===== 用户反馈系统 =====
    const FeedbackModule = {
        show: function(message, type = 'info') {
            if (!CONFIG.ENABLE_USER_FEEDBACK) return;
            
            const notification = document.createElement('div');
            notification.className = 'wpg-notification';
            notification.textContent = `🛡️ ${message}`;
            notification.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: ${type === 'error' ? '#f44336' : '#4CAF50'};
                color: white;
                padding: 10px 15px;
                border-radius: 4px;
                font-size: 14px;
                z-index: 999999;
                cursor: pointer;
                transition: opacity 0.3s;
            `;
            
            notification.onclick = () => notification.remove();
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.style.opacity = '0';
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }
    };

    // ===== SPA支持 =====
    const SPASupport = {
        init: function() {
            // 监听URL变化
            const handleUrlChange = () => {
                Utils.safeExecute(() => {
                    PrivacyModule.cleanURL();
                    ExperienceModule.cleanLinks();
                }, 'handleUrlChange');
            };
            
            // 劫持History API
            ['pushState', 'replaceState'].forEach(method => {
                const original = history[method];
                history[method] = function(...args) {
                    const result = original.apply(history, args);
                    setTimeout(handleUrlChange, 100);
                    return result;
                };
            });
            
            window.addEventListener('popstate', handleUrlChange);
        }
    };

    // ===== 主初始化函数 =====
    function initialize() {
        Utils.log('info', 'Initializing Web Privacy Guardian v4.0.0');
        
        // 立即执行的功能
        Utils.safeExecute(() => {
            PrivacyModule.protectReferrer();
            PrivacyModule.cleanURL();
            AdBlockModule.injectBlockingCSS();
            AdBlockModule.blockPopups();
            ExperienceModule.removeCopyRestrictions();
            PerformanceModule.optimize();
            SPASupport.init();
        }, 'initialize');
        
        // DOM加载后执行
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                ExperienceModule.cleanLinks();
                FeedbackModule.show('Privacy protection active', 'info');
            });
        } else {
            ExperienceModule.cleanLinks();
        }
        
        // 监听动态内容
        if (CONFIG.CLEAN_PAGE_LINKS) {
            const observer = new MutationObserver(ExperienceModule.cleanLinks);
            observer.observe(document.body || document.documentElement, {
                childList: true,
                subtree: true
            });
        }
    }

    // ===== 配置管理API =====
    window.WPG = {
        getConfig: () => CONFIG,
        setConfig: (key, value) => {
            CONFIG[key] = value;
            localStorage.setItem('WPG_CONFIG', JSON.stringify(CONFIG));
            Utils.log('info', `Config updated: ${key} = ${value}`);
        },
        reset: () => {
            localStorage.removeItem('WPG_CONFIG');
            location.reload();
        }
    };

    // 安全启动
    try {
        initialize();
    } catch (error) {
        console.error('[WPG] Critical initialization error:', error);
    }
})();
