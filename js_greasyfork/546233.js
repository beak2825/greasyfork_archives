// ==UserScript==
// @name         八局E学堂 - 防切屏检测+解除复制限制 (增强版)
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  阻止切屏检测并自动解除复制限制，包含执行时机修复和弹窗拦截
// @match        https://cscec8b.21tb.com/ems/html/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546233/%E5%85%AB%E5%B1%80E%E5%AD%A6%E5%A0%82%20-%20%E9%98%B2%E5%88%87%E5%B1%8F%E6%A3%80%E6%B5%8B%2B%E8%A7%A3%E9%99%A4%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6%20%28%E5%A2%9E%E5%BC%BA%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/546233/%E5%85%AB%E5%B1%80E%E5%AD%A6%E5%A0%82%20-%20%E9%98%B2%E5%88%87%E5%B1%8F%E6%A3%80%E6%B5%8B%2B%E8%A7%A3%E9%99%A4%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6%20%28%E5%A2%9E%E5%BC%BA%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ====== 第一部分：阻止切屏检测 ======
    // 覆盖页面可见性API
    Object.defineProperty(document, 'visibilityState', {
        get: () => 'visible',
        configurable: true
    });

    Object.defineProperty(document, 'hidden', {
        get: () => false,
        configurable: true
    });

    // 劫持事件监听，阻止可见性改变的事件
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, listener, options) {
        if (type === 'visibilitychange') {
            console.log("[防切屏] 阻止了 visibilitychange 事件监听器");
            return;
        }
        originalAddEventListener.call(this, type, listener, options);
    };

    // 阻止窗口焦点事件
    window.addEventListener('blur', e => {
        console.log("[防切屏] 阻止了 blur 事件");
        e.stopImmediatePropagation();
        e.stopPropagation();
    }, true);

    window.addEventListener('focus', e => {
        console.log("[防切屏] 阻止了 focus 事件");
        e.stopImmediatePropagation();
        e.stopPropagation();
    }, true);

    // 持续监控并恢复覆盖
    setInterval(() => {
        if (document.visibilityState !== 'visible') {
            Object.defineProperty(document, 'visibilityState', {
                get: () => 'visible',
                configurable: true
            });
        }
        if (document.hidden !== false) {
            Object.defineProperty(document, 'hidden', {
                get: () => false,
                configurable: true
            });
        }
    }, 1000);

    // ====== 第二部分：解除复制限制与弹窗拦截 ======

    // 禁用所有警告弹窗
    function disableAlerts() {
        // 保存原始函数以便需要时恢复
        window._originalAlert = window.alert;
        window._originalConfirm = window.confirm;

        window.alert = function() {
            console.log('[警报拦截] 阻止了一个alert弹窗');
            return false;
        };

        window.confirm = function() {
            console.log('[确认拦截] 阻止了一个confirm弹窗');
            return true; // 默认返回true表示"确定"
        };

        console.log('[弹窗拦截] 已禁用alert和confirm函数');
    }

    // 确保复制解除功能在DOM加载完成后执行
    function setupCopyRemoval() {
        // 检查是否已在body上添加了复制限制
        if (!isCopyDisabled()) return;

        // 修复方案1: 修改事件执行顺序
        const originalBodyOnCopy = document.body.oncopy;
        const originalBodyOnPaste = document.body.onpaste;

        document.body.oncopy = null;
        document.body.onpaste = null;

        document.body.addEventListener('copy', function(e) {
            if (typeof originalBodyOnCopy === 'function') {
                originalBodyOnCopy.call(document.body, e);
            }
            e.stopImmediatePropagation();
            return true;
        });

        // 修复方案2: 深度覆盖属性
        Object.defineProperty(document.body, 'oncopy', {
            get: () => null,
            set: () => {},
            configurable: false
        });

        Object.defineProperty(document.body, 'onpaste', {
            get: () => null,
            set: () => {},
            configurable: false
        });

        // 移除所有事件监听器并解除CSS限制
        removeCopyRestrictions();

        console.log('[复制解除] 已成功初始化复制限制解除');
    }

    function removeCopyRestrictions() {
        // 1. 移除body属性
        document.body.removeAttribute('oncopy');
        document.body.removeAttribute('onpaste');

        // 2. 解除事件监听器
        const events = ['copy', 'cut', 'selectstart', 'contextmenu'];
        events.forEach(event => {
            document.body.removeEventListener(event, preventCopyDefault, true);
            document.documentElement.removeEventListener(event, preventCopyDefault, true);
            document.removeEventListener(event, preventCopyDefault, true);
            window.removeEventListener(event, preventCopyDefault, true);
        });

        // 3. 覆盖样式限制
        const style = document.createElement('style');
        style.textContent = `
            *, *::before, *::after {
                user-select: auto !important;
                -webkit-user-select: auto !important;
                -moz-user-select: auto !important;
                -ms-user-select: auto !important;
                cursor: auto !important;
                pointer-events: auto !important;
            }
        `;
        document.head.appendChild(style);

        // 4. 持续监控防止限制被重新添加
        setInterval(() => {
            if (isCopyDisabled()) {
                document.body.oncopy = null;
                document.body.onpaste = null;
            }
        }, 2000);
    }

    function isCopyDisabled() {
        return document.body.hasAttribute('oncopy') ||
               document.body.hasAttribute('onpaste') ||
               document.body.oncopy !== null;
    }

    function preventCopyDefault(e) {
        if (e.type === 'copy' || e.type === 'cut' || e.type === 'paste') {
            console.log(`[事件阻止] 阻止了${e.type}事件的默认行为`);
            e.stopImmediatePropagation();
            return true;
        }
        return true;
    }

    // 创建视觉指示器
    function createIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'copy-status-indicator';
        indicator.innerHTML = '✅ 复制功能已完全解锁';
        indicator.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            padding: 12px 20px;
            background: linear-gradient(135deg, #4CAF50, #2E7D32);
            color: white;
            font-weight: bold;
            border-radius: 5px;
            z-index: 99999;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            font-family: Arial, sans-serif;
            font-size: 14px;
            animation: pulse 2s infinite;
            cursor: help;
        `;

        document.body.appendChild(indicator);

        // 添加动画样式
        const animationStyle = document.createElement('style');
        animationStyle.textContent = `
            @keyframes pulse {
                0% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.5); }
                70% { box-shadow: 0 0 0 12px rgba(76, 175, 80, 0); }
                100% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0); }
            }
        `;
        document.head.appendChild(animationStyle);

        // 设置工具提示
        indicator.title = "本页面的所有复制限制已被解除\n可随意复制内容，不会触发任何警报";

        // 5秒后缩小指示器
        setTimeout(() => {
            indicator.style.transform = 'scale(0.95)';
            indicator.style.opacity = '0.9';
        }, 5000);
    }

    // 监控DOM变化，防止网站添加新限制
    function setupMutationObserver() {
        const observer = new MutationObserver(mutations => {
            for (let mutation of mutations) {
                if (mutation.type === 'attributes' &&
                    (mutation.attributeName === 'oncopy' || mutation.attributeName === 'onpaste')) {
                    removeCopyRestrictions();
                    console.log('[变化监测] 检测到新限制，已重新移除');
                }
            }
        });

        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ['oncopy', 'onpaste'],
            childList: false,
            subtree: false
        });

        console.log('[监控] 已启动DOM变化监控');
    }

    // ====== 初始化函数 ======
    function init() {
        try {
            // 移除复制限制
            setupCopyRemoval();

            // 创建视觉指示器
            createIndicator();

            // 设置DOM变化监控
            setupMutationObserver();
        } catch (e) {
            console.error('[初始化错误]', e);
        }
    }

    // ====== 脚本启动 ======
    // 第一步：在最早阶段禁用弹窗
    disableAlerts();

    // 第二步：在DOM加载后执行主要功能
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 500);
    }
})();