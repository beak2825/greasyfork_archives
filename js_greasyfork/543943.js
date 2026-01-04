// ==UserScript==
// @name         抖音登录弹框屏蔽器
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  屏蔽抖音精选页等页面的登录弹框
// @author       Jxw
// @match        *://www.douyin.com/*
// @match        *://douyin.com/*
// @icon         https://www.douyin.com/favicon.ico
// @grant        none
// @run-at       document-start
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/543943/%E6%8A%96%E9%9F%B3%E7%99%BB%E5%BD%95%E5%BC%B9%E6%A1%86%E5%B1%8F%E8%94%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/543943/%E6%8A%96%E9%9F%B3%E7%99%BB%E5%BD%95%E5%BC%B9%E6%A1%86%E5%B1%8F%E8%94%BD%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 抖音登录弹框选择器
    const LOGIN_SELECTORS = [
        // 抖音精确选择器
        '#login-panel-new',
        '.BGmBK6_i',
        '#douyin-login-new-id',
        '.douyin_login_new_class',
        '[data-bytereplay-mask="strict"]',
        '#login-full-panel-11j2a4q1hwls0',
        '.oMpq4HiN',
        '.GzPW6isY',
        
        // 抖音相关选择器
        '[id*="login"]',
        '[class*="dy-login"]',
        '[class*="login-modal"]',
        '[class*="passport"]'
    ];

    // 移除登录弹框
    function removeLoginModal() {
        LOGIN_SELECTORS.forEach(selector => {
            try {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => {
                    // 检查是否包含登录相关内容
                    const text = el.textContent || '';
                    if (text.includes('登录') || 
                        text.includes('注册') || 
                        text.includes('手机号') || 
                        text.includes('验证码') ||
                        text.includes('微信') ||
                        text.includes('扫码') ||
                        el.querySelector('input[type="password"]') ||
                        el.querySelector('input[placeholder*="手机"]') ||
                        el.querySelector('input[placeholder*="密码"]')) {
                        
                        console.log('移除登录弹框:', selector, el);
                        el.remove();
                    }
                });
            } catch (e) {
                console.warn('移除登录弹框时出错:', e);
            }
        });
    }

    // 阻止body滚动锁定
    function preventScrollLock() {
        const body = document.body;
        if (body) {
            body.style.overflow = '';
            body.style.position = '';
            body.style.height = '';
            body.classList.remove('modal-open', 'no-scroll');
        }
    }

    // CSS样式隐藏登录弹框
    function injectHidingCSS() {
        const style = document.createElement('style');
        style.textContent = `
            /* 隐藏抖音登录弹框 */
            #login-panel-new,
            .BGmBK6_i,
            #douyin-login-new-id,
            .douyin_login_new_class,
            [data-bytereplay-mask="strict"],
            #login-full-panel-11j2a4q1hwls0,
            .oMpq4HiN,
            .GzPW6isY,
            [id*="login"],
            [class*="dy-login"],
            [class*="login-modal"],
            [class*="passport"] {
                display: none !important;
                visibility: hidden !important;
                opacity: 0 !important;
                z-index: -1 !important;
            }
            
            /* 确保页面可以正常滚动 */
            body.modal-open,
            body.no-scroll {
                overflow: auto !important;
                position: static !important;
                height: auto !important;
            }
        `;
        document.head.appendChild(style);
    }

    // 监听DOM变化
    function startObserver() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) { // Element node
                            // 检查新添加的节点是否是登录弹框
                            setTimeout(() => {
                                removeLoginModal();
                                preventScrollLock();
                            }, 100);
                        }
                    });
                }
            });
        });

        observer.observe(document.body || document.documentElement, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class', 'style']
        });
    }

    // 初始化
    function init() {
        // 立即注入CSS
        injectHidingCSS();
        
        // DOM加载完成后开始监听
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                removeLoginModal();
                preventScrollLock();
                startObserver();
            });
        } else {
            removeLoginModal();
            preventScrollLock();
            startObserver();
        }

        // 定期清理
        setInterval(() => {
            removeLoginModal();
            preventScrollLock();
        }, 2000);
    }

    // 启动
    init();

    console.log('抖音登录弹框屏蔽器已启动');
})();