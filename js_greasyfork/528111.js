// ==UserScript==
// @name            Adblock 反广告检测 bypass
// @version         1.3.0
// @description     结合通用广告检测绕过和针对性检测绕过，提供增强的绕过。
// @match           *://*/*
// @run-at          document-start
// @grant           none
// @license         MIT
// @author          ufoww1
// @namespace       https://greasyfork.org/users/1440075
// @downloadURL https://update.greasyfork.org/scripts/528111/Adblock%20%E5%8F%8D%E5%B9%BF%E5%91%8A%E6%A3%80%E6%B5%8B%20bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/528111/Adblock%20%E5%8F%8D%E5%B9%BF%E5%91%8A%E6%A3%80%E6%B5%8B%20bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';
    try {
        // 备份原始函数
        const originalGetComputedStyle = window.getComputedStyle;

        // 缓存系统
        const elementCache = new WeakMap();
        const processedElements = new WeakSet();

        // 配置项
        const config = {
            // 通用排除关键词
            excludedKeywords: [
                'qr', 'verify', 'captcha', 'validate', 'recaptcha', 'g-recaptcha',
                'security', 'auth', '扫码', '验证', '验证码', 'popup', 'modal', 'overlay'
            ],
            // 广告相关标签
            adTags: ['IMG', 'IFRAME', 'SCRIPT', 'DIV', 'SPAN', 'BANNER'],
            // 特定目标类名
            targetClasses: ['side-ad', 'left', 'right', 'ad', 'ads', 'banner'],
            // 检测属性
            monitorProps: ['display', 'visibility', 'opacity'],
            // 调试模式
            debug: false
        };

        // 日志系统
        const logger = {
            debug: (...args) => config.debug && console.debug('[AdBypass]', ...args),
            error: (...args) => console.error('[AdBypass]', ...args)
        };

        // 工具函数
        const utils = {
            // 检查元素是否应该被排除
            shouldExclude: (element) => {
                if (!element || typeof element.getAttribute !== 'function') return true;

                const idStr = element.id?.toLowerCase() || '';
                const classStr = (typeof element.className === 'string' ? element.className.toLowerCase() : '');

                return config.excludedKeywords.some(kw =>
                    idStr.includes(kw) || classStr.includes(kw)
                );
            },

            // 检查元素是否是目标广告元素
            isAdElement: (element) => {
                if (!element) return false;

                // 检查特定目标类
                if (element.classList) {
                    const hasTargetClass = config.targetClasses.some(className =>
                        element.classList.contains(className)
                    );
                    if (hasTargetClass) return true;
                }

                // 检查广告相关属性
                if (config.adTags.includes(element.tagName)) {
                    return (
                        (element.src && /ad|ads|banner/i.test(element.src)) ||
                        (element.id && /ad|ads/i.test(element.id)) ||
                        (element.className && /ad|ads/i.test(element.className))
                    );
                }

                return false;
            },

            // 创建样式代理
            createStyleProxy: (originalStyle) => {
                return new Proxy(originalStyle, {
                    get(target, prop) {
                        if (config.monitorProps.includes(prop)) {
                            switch(prop) {
                                case 'display':
                                    return 'block';
                                case 'visibility':
                                    return 'visible';
                                case 'opacity':
                                    return '1';
                                default:
                                    return target[prop];
                            }
                        }
                        return target[prop];
                    }
                });
            },

            // 移除广告检测相关元素
            removeBlockerElements: () => {
                // 移除模态框
                document.querySelectorAll('.adblock-modal, [class*="adblock"], [id*="adblock"]')
                    .forEach(el => el.remove());

                // 移除模糊效果
                document.querySelectorAll('.blur-content, [class*="blur"]')
                    .forEach(el => el.classList.remove('blur-content', 'blur'));
            },

            // 创建虚拟广告元素
            createVirtualAds: () => {
                const adContainer = document.createElement('div');
                adContainer.style.cssText = 'position:fixed;pointer-events:none;opacity:0;';

                ['left', 'right'].forEach(position => {
                    const ad = document.createElement('div');
                    ad.className = `side-ad ${position}`;
                    ad.style.cssText = 'display:block;visibility:visible;opacity:1;';
                    adContainer.appendChild(ad);
                });

                document.body.appendChild(adContainer);
            }
        };

        // 重写 getComputedStyle
        Object.defineProperty(window, 'getComputedStyle', {
            value: function(element, pseudoElement) {
                try {
                    // 处理伪元素
                    if (pseudoElement) {
                        return originalGetComputedStyle(element, pseudoElement);
                    }

                    // 检查缓存
                    if (elementCache.has(element)) {
                        return elementCache.get(element);
                    }

                    // 获取原始样式
                    const style = originalGetComputedStyle(element, pseudoElement);

                    // 排除验证相关元素
                    if (utils.shouldExclude(element)) {
                        elementCache.set(element, style);
                        return style;
                    }

                    // 处理广告元素
                    if (utils.isAdElement(element)) {
                        const proxyStyle = utils.createStyleProxy(style);
                        elementCache.set(element, proxyStyle);
                        return proxyStyle;
                    }

                    elementCache.set(element, style);
                    return style;
                } catch (e) {
                    logger.error('getComputedStyle 处理异常:', e);
                    return originalGetComputedStyle(element, pseudoElement);
                }
            },
            configurable: true,
            writable: true
        });

        // 设置观察器
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) { // 元素节点
                            if (!processedElements.has(node)) {
                                processedElements.add(node);
                                requestAnimationFrame(() => {
                                    utils.removeBlockerElements();
                                });
                            }
                        }
                    });
                }
            });
        });

        // 初始化
        const init = () => {
            // 启动观察器
            observer.observe(document.documentElement, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['class', 'style']
            });

            // 重写检测函数
            window.checkAdBlock = () => false;
            window.showAdBlockMessage = () => false;

            // 创建虚拟广告元素
            document.readyState === 'loading' ?
                document.addEventListener('DOMContentLoaded', utils.createVirtualAds) :
                utils.createVirtualAds();

            // 定期清理
            setInterval(utils.removeBlockerElements, 1000);
        };

        // 启动脚本
        init();

        // 导出工具函数供调试使用
        if (config.debug) {
            window._adBypassTools = {
                utils,
                config,
                elementCache,
                processedElements,
                observer
            };
        }

    } catch (e) {
        console.error('广告检测绕过脚本初始化失败:', e);
    }
})();