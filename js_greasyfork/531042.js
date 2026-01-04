// ==UserScript==
// @name         飞书网页限制解除器增强版
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  解除网页复制、右键等限制，特别针对飞书文档，无边框显示
// @author       格瑞特
// @match        *://*.feishu.cn/*
// @match        *://r85yncw7cg.feishu.cn/*
// @match        *://example.com/*
// @match        *://*.example.com/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @supportURL   https://github.com/您的用户名/您的仓库/issues
// @homepageURL  https://github.com/您的用户名/您的仓库
// @downloadURL https://update.greasyfork.org/scripts/531042/%E9%A3%9E%E4%B9%A6%E7%BD%91%E9%A1%B5%E9%99%90%E5%88%B6%E8%A7%A3%E9%99%A4%E5%99%A8%E5%A2%9E%E5%BC%BA%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/531042/%E9%A3%9E%E4%B9%A6%E7%BD%91%E9%A1%B5%E9%99%90%E5%88%B6%E8%A7%A3%E9%99%A4%E5%99%A8%E5%A2%9E%E5%BC%BA%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('飞书网页限制解除器已加载');

    // =============== DOM观察器工具类 ===============
    class DOMObserver {
        constructor(config) {
            this.config = {
                targetSelectors: config.targetSelectors || [],
                onElementFound: config.onElementFound || (() => {}),
                onAttributeChanged: config.onAttributeChanged || (() => {}),
                pollInterval: config.pollInterval || 1000,
                maxPolls: config.maxPolls || 10
            };
            
            this.pollCount = 0;
            this.foundElements = new Set();
            this.observer = null;
        }

        // 初始化MutationObserver
        initObserver() {
            this.observer = new MutationObserver((mutations) => {
                mutations.forEach(mutation => {
                    // 处理新增节点
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                this.checkElement(node);
                                // 检查子元素
                                node.querySelectorAll('*').forEach(child => this.checkElement(child));
                            }
                        });
                    }
                    
                    // 处理属性变化
                    if (mutation.type === 'attributes') {
                        const target = mutation.target;
                        if (target.nodeType === Node.ELEMENT_NODE) {
                            this.config.targetSelectors.forEach(selector => {
                                if (target.matches(selector)) {
                                    this.config.onAttributeChanged(target, mutation.attributeName);
                                }
                            });
                        }
                    }
                });
            });

            // 配置观察选项
            this.observer.observe(document.documentElement, {
                childList: true,
                subtree: true,
                attributes: true
            });
            
            console.log('DOM观察器已初始化');
        }

        // 检查元素是否匹配目标选择器
        checkElement(element) {
            this.config.targetSelectors.forEach(selector => {
                if (element.matches(selector) && !this.foundElements.has(element)) {
                    this.foundElements.add(element);
                    this.config.onElementFound(element, selector);
                }
            });
        }

        // 开始长轮询检测
        startPolling() {
            this.pollInterval = setInterval(() => {
                this.pollCount++;
                
                // 检查是否达到最大轮询次数
                if (this.pollCount > this.config.maxPolls) {
                    this.stopPolling();
                    return;
                }
                
                // 检查当前DOM中的元素
                this.config.targetSelectors.forEach(selector => {
                    document.querySelectorAll(selector).forEach(element => {
                        if (!this.foundElements.has(element)) {
                            this.foundElements.add(element);
                            this.config.onElementFound(element, selector);
                        }
                    });
                });
                
            }, this.config.pollInterval);
            
            console.log('长轮询检测已启动');
        }

        // 停止长轮询
        stopPolling() {
            if (this.pollInterval) {
                clearInterval(this.pollInterval);
                this.pollInterval = null;
                console.log('长轮询检测已停止');
            }
        }

        // 停止观察
        disconnect() {
            if (this.observer) {
                this.observer.disconnect();
                this.observer = null;
                console.log('DOM观察器已断开连接');
            }
            this.stopPolling();
        }
    }

    // =============== 通用解除限制规则 ===============
    class UnblockRules {
        constructor() {
            this.rules = [
                {
                    name: '解除选择限制',
                    handler: this.unblockSelection.bind(this)
                },
                {
                    name: '解除右键菜单限制',
                    handler: this.unblockContextMenu.bind(this)
                },
                {
                    name: '移除遮罩层',
                    handler: this.removeOverlays.bind(this)
                },
                {
                    name: '启用输入框',
                    handler: this.enableInputs.bind(this)
                }
            ];
        }

        unblockSelection(node) {
            if (node.nodeType === Node.ELEMENT_NODE) {
                this.enableSelection(node);
                node.querySelectorAll('*').forEach(el => this.enableSelection(el));
            }
        }

        unblockContextMenu() {
            document.addEventListener('contextmenu', (e) => {
                e.stopImmediatePropagation();
                return true;
            }, true);
            
            document.addEventListener('selectstart', (e) => {
                e.stopImmediatePropagation();
                return true;
            }, true);
            
            document.addEventListener('copy', (e) => {
                e.stopImmediatePropagation();
                return true;
            }, true);
        }

        removeOverlays(node) {
            if (node.nodeType === Node.ELEMENT_NODE) {
                this.removeOverlay(node);
                node.querySelectorAll('*').forEach(el => this.removeOverlay(el));
            }
        }

        enableInputs(node) {
            if (node.nodeType === Node.ELEMENT_NODE) {
                this.enableInput(node);
                node.querySelectorAll('input, textarea').forEach(el => this.enableInput(el));
            }
        }

        // 工具方法
        enableSelection(element) {
            element.style.setProperty('user-select', 'auto', 'important');
            element.style.setProperty('-webkit-user-select', 'auto', 'important');
        }

        removeOverlay(element) {
            if (element.matches('.overlay, [class*="overlay"], [class*="mask"]')) {
                element.style.setProperty('display', 'none', 'important');
                element.style.setProperty('visibility', 'hidden', 'important');
                element.style.setProperty('opacity', '0', 'important');
            }
        }

        enableInput(element) {
            if (element.matches('input, textarea, [contenteditable]')) {
                element.removeAttribute('disabled');
                element.removeAttribute('readonly');
                element.style.setProperty('pointer-events', 'auto', 'important');
                element.style.setProperty('opacity', '1', 'important');
            }
        }

        applyRules(node) {
            this.rules.forEach(rule => rule.handler(node));
        }
    }

    // =============== 飞书特定解除限制规则 ===============
    class FeishuUnblockRules extends UnblockRules {
        constructor() {
            super();
            // 添加飞书特定规则
            this.rules.push({
                name: '解除飞书文档保护',
                handler: this.unblockFeishuDoc.bind(this)
            });
        }

        unblockFeishuDoc(node) {
            // 飞书特定解除逻辑
            if (node.nodeType === Node.ELEMENT_NODE && 
                (node.classList.contains('lark-doc-content') || 
                node.classList.contains('feishu-wiki-content'))) {
                // 启用选择
                this.enableSelection(node);
                // 移除可能的内联事件处理器
                node.oncontextmenu = null;
                node.oncopy = null;
                node.onselectstart = null;
            }
        }
    }

    // =============== 主程序 ===============
    // 检测当前网站类型
    const isFeishuSite = window.location.hostname.includes('feishu.cn');
    
    // 根据网站类型选择规则
    const unblockRules = isFeishuSite 
        ? new FeishuUnblockRules() 
        : new UnblockRules();
    
    // 目标元素选择器
    const targetSelectors = [
        '.protected-content',
        '.no-copy',
        '.overlay',
        'input[disabled]',
        '[style*="user-select: none"]',
        '[contenteditable="false"]'
    ];
    
    // 飞书特定选择器
    if (isFeishuSite) {
        targetSelectors.push(
            '.lark-doc-content',
            '.feishu-wiki-content',
            '.wiki-content',
            '.lark-editor-container',
            '.lark-security-layer',
            '.anti-copy-mask'
        );
    }
    
    // 处理找到的元素
    const handleFoundElement = (element, selector) => {
        console.log(`找到目标元素: ${selector}`, element);
        
        // 根据选择器类型应用不同的处理
        if (selector === '.protected-content' || selector === '.no-copy' || selector.includes('user-select')) {
            enableCopy(element);
        } else if (selector.includes('overlay') || selector.includes('mask')) {
            removeOverlay(element);
        } else if (selector.includes('disabled') || selector.includes('contenteditable')) {
            enableInput(element);
        }
        
        // 不再添加边框标记
        // element.classList.add('extension-processed');
    };
    
    // 处理属性变化
    const handleAttributeChange = (element, attributeName) => {
        console.log(`元素属性变化: ${attributeName}`, element);
        
        if (attributeName === 'style' && element.style.userSelect === 'none') {
            enableCopy(element);
        } else if (attributeName === 'disabled' || attributeName === 'readonly' || attributeName === 'contenteditable') {
            enableInput(element);
        }
    };
    
    // 启用复制功能
    const enableCopy = (element) => {
        element.style.setProperty('user-select', 'auto', 'important');
        element.style.setProperty('-webkit-user-select', 'auto', 'important');
        element.setAttribute('data-copy-enabled', 'true');
        
        // 移除可能的复制事件监听器
        element.oncontextmenu = null;
        element.oncopy = null;
        element.onselectstart = null;
    };
    
    // 移除遮罩层
    const removeOverlay = (element) => {
        element.style.setProperty('display', 'none', 'important');
        element.style.setProperty('visibility', 'hidden', 'important');
        element.style.setProperty('opacity', '0', 'important');
        element.setAttribute('data-overlay-removed', 'true');
    };
    
    // 启用输入框
    const enableInput = (element) => {
        element.removeAttribute('disabled');
        element.removeAttribute('readonly');
        if (element.getAttribute('contenteditable') === 'false') {
            element.setAttribute('contenteditable', 'true');
        }
        element.style.setProperty('pointer-events', 'auto', 'important');
        element.setAttribute('data-input-enabled', 'true');
    };
    
    // 注入自定义样式
    const injectCustomStyles = () => {
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            /* 全局样式覆盖 */
            * {
                user-select: auto !important;
                -webkit-user-select: auto !important;
            }
            
            /* 特定元素样式覆盖 */
            .no-copy, .protected-content, [style*="user-select: none"] {
                user-select: auto !important;
                -webkit-user-select: auto !important;
            }
            
            /* 移除遮罩层 */
            .overlay, .mask, [class*="overlay"], [class*="mask"] {
                display: none !important;
                visibility: hidden !important;
                opacity: 0 !important;
            }
            
            /* 启用输入框 */
            input[disabled], textarea[disabled], input[readonly], textarea[readonly] {
                opacity: 1 !important;
                pointer-events: auto !important;
                background-color: #fff !important;
            }
            
            /* 解除按钮禁用状态 */
            button[disabled] {
                opacity: 1 !important;
                pointer-events: auto !important;
                cursor: pointer !important;
            }
            
            /* 移除可能的防复制层 */
            div[style*="position: absolute"][style*="top: 0"][style*="left: 0"][style*="width: 100%"][style*="height: 100%"] {
                display: none !important;
            }
            
            /* 飞书特定样式 */
            .lark-doc-content, .feishu-wiki-content, .wiki-content {
                user-select: auto !important;
                -webkit-user-select: auto !important;
            }
        `;
        document.head.appendChild(styleElement);
        console.log('自定义样式已注入');
    };
    
    // 解除右键菜单限制
    const enableRightClick = () => {
        document.addEventListener('contextmenu', (e) => {
            e.stopImmediatePropagation();
            return true;
        }, true);
        
        document.addEventListener('selectstart', (e) => {
            e.stopImmediatePropagation();
            return true;
        }, true);
        
        document.addEventListener('copy', (e) => {
            e.stopImmediatePropagation();
            return true;
        }, true);
        
        console.log('右键菜单和复制功能已启用');
    };
    
    // 初始化DOM观察器
    const observer = new DOMObserver({
        targetSelectors,
        onElementFound: handleFoundElement,
        onAttributeChanged: handleAttributeChange,
        pollInterval: 1500,
        maxPolls: 20
    });
    
    // 初始化函数
    const initialize = () => {
        // 注入自定义样式
        injectCustomStyles();
        
        // 启用右键菜单
        enableRightClick();
        
        // 初始检查当前DOM
        targetSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                handleFoundElement(element, selector);
            });
        });
        
        // 启动DOM观察器
        observer.initObserver();
        
        // 启动长轮询作为备份检测机制
        observer.startPolling();
        
        console.log('网页限制解除器初始化完成');
    };
    
    // 当DOM准备好时初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();