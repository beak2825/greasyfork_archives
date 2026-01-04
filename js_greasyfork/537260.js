// ==UserScript==
// @name         网站综合增强工具
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  禁用开发者工具检测、阻止页面重定向和隐藏特定元素
// @author       justbuybitcoin
// @match        *://missavtv.com/*
// @match        *://tieba.baidu.com/*
// @grant        none
// @run-at       document-start
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/537260/%E7%BD%91%E7%AB%99%E7%BB%BC%E5%90%88%E5%A2%9E%E5%BC%BA%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/537260/%E7%BD%91%E7%AB%99%E7%BB%BC%E5%90%88%E5%A2%9E%E5%BC%BA%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===== 第一部分：禁用开发者工具检测 =====

    // 禁用控制台警告但保留开发者工具功能
    const originalConsoleError = console.error;
    console.error = function(message, ...args) {
        // 只过滤掉DEVTOOL警告
        if (message && typeof message === 'string' &&
            (message.includes('DEVTOOL') || message.includes('You don\'t have permission'))) {
            return;
        }
        return originalConsoleError.call(console, message, ...args);
    };

    // 覆盖可能的检测变量，更安全的方式
    function safelyOverrideProperty(obj, prop, value) {
        try {
            // 检查属性是否已存在
            if (obj[prop] !== undefined) {
                Object.defineProperty(obj, prop, {
                    get: function() { return value; },
                    configurable: true
                });
            }
        } catch (e) {
            // 静默失败，避免干扰
        }
    }

    // 更精确地处理定时器，只替换包含特定检测代码的函数
    const originalSetInterval = window.setInterval;
    window.setInterval = function(fn, delay) {
        if (typeof fn === 'function') {
            const fnStr = fn.toString();
            if (fnStr.includes('DEVTOOL') ||
                (fnStr.includes('devtool') && fnStr.includes('detect'))) {
                // 只替换明确的检测函数
                fn = function() { /* 无操作 */ };
            }
        }
        return originalSetInterval.call(window, fn, delay);
    };

    // 添加检测绕过
    function initDevToolBypass() {
        setTimeout(function() {
            // 尝试查找并禁用可能的检测器
            for (const key in window) {
                if (key.toLowerCase().includes('devtool') ||
                    key.toLowerCase().includes('debug')) {
                    safelyOverrideProperty(window, key, {
                        isOpen: false,
                        detect: function() { return false; }
                    });
                }
            }
        }, 1000);
    }

    // ===== 第二部分：添加样式和隐藏元素 =====

    // 添加隐藏特定元素的样式
    function addCustomStyle() {
        const style = document.createElement('style');
        style.textContent = `
            .root--ujvuu {
                display: none !important;
            }
            .ylh-custom-ad-container {
                display: none !important;
            }
            .ylh-ad-container {
                display: none !important;
            }
            /* 隐藏所有iframe */
            iframe {
                display: none !important;
            }
            .-mx-5.mb-6 {
                display: none !important;
            }
            /* 修复Tailwind多类选择器 */
            .container.mx-auto.my-6.h-auto,
            div[class*="container"][class*="mx-auto"][class*="my-6"][class*="h-auto"] {
                display: none !important;
            }
            /* 修复带md:前缀的响应式类 */
            .mb-2.hidden.w-full.justify-center,
            div[class*="mb-2"][class*="hidden"][class*="w-full"][class*="justify-center"],
            div[class*="md:flex"] {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
        console.log("[样式注入] 已隐藏指定元素");
    }

    // 在文档加载早期就执行样式注入
    if (document.head) {
        addCustomStyle();
    } else {
        // 如果head还不存在，等待DOM结构加载
        document.addEventListener('DOMContentLoaded', addCustomStyle);
    }

    // ===== 第三部分：防止页面重定向 =====

    // 检查URL是否与当前域名相同
    function isSameDomain(url) {
        try {
            // 获取当前域名
            const currentDomain = window.location.hostname;
            // 解析目标URL的域名
            const targetDomain = new URL(url, window.location.href).hostname;
            console.log(
                `[域名检查] 当前域名: ${currentDomain}, 目标域名: ${targetDomain}`
      );
            return currentDomain === targetDomain;
        } catch (e) {
            console.error("[域名检查] 解析URL失败:", e);
            // 如果无法解析URL，默认阻止导航以安全为主
            return false;
        }
    }

    // 处理新窗口弹出
    const originalWindowOpen = window.open;
    window.open = function(...args) {
        console.log("[拦截] 尝试打开新窗口:", args[0]);
        // 完全阻止弹窗
        return null;
    };

    // 拦截设置location.href的操作
    let navigationCount = 0;
    const originalSet = Object.getOwnPropertyDescriptor(window.Location.prototype, 'href').set;

    Object.defineProperty(window.Location.prototype, 'href', {
        set: function(url) {
            navigationCount++;
            console.log(`[导航拦截] 尝试导航到: ${url} (计数: ${navigationCount})`);

            // 检查是否为跨域跳转
            if (!isSameDomain(url)) {
                console.log("[导航拦截] 阻止跨域跳转");
                // 重置计数器，不执行导航
                setTimeout(() => {
                    navigationCount = 0;
                }, 100);
                return;
            }

            // 只允许第一次导航（正常点击导航）
            if (navigationCount === 1) {
                originalSet.call(this, url);
            } else {
                console.log("[导航拦截] 阻止了二次重定向");
            }

            // 5秒后重置计数器，以便下次点击能正常工作
            setTimeout(() => {
                navigationCount = 0;
            }, 5000);
        },
        get: Object.getOwnPropertyDescriptor(window.Location.prototype, 'href').get
    });

    // 监听所有可能的重定向方法
    ['assign', 'replace'].forEach(method => {
        const original = window.Location.prototype[method];
        window.Location.prototype[method] = function(url) {
            navigationCount++;
            console.log(`[导航拦截] 尝试${method}导航: ${url} (计数: ${navigationCount})`);

            if (navigationCount === 1) {
                return original.call(this, url);
            } else {
                console.log(`[导航拦截] 阻止了${method}重定向`);
                return null;
            }
        };
    });

    // 监听并修改a标签点击行为
    function setupClickHandler() {
        document.addEventListener('click', function(e) {
            // 查找点击的图片或其父级a标签
            const img = e.target.closest('img');
            if (!img) return;

            const link = img.closest('a') || img.parentElement.closest('a');
            if (!link) return;

            // 检查是否有onclick或其它可能触发多重导航的事件
            if (link.hasAttribute('onclick') || link.hasAttribute('onmousedown')) {
                console.log("[点击拦截] 拦截了可疑点击事件");
                e.preventDefault();
                e.stopPropagation();

                // 手动执行正常导航
                navigationCount = 1; // 标记这是合法的第一次导航
                window.location.href = link.href;
                return false;
            }
        }, true);
    }

    // ===== 初始化函数 =====

    // 在文档加载早期就执行样式注入
    if (document.head) {
        addCustomStyle();
    } else {
        // 如果head还不存在，等待DOM结构加载
        document.addEventListener('DOMContentLoaded', addCustomStyle);
    }

    // 页面加载完成后初始化
    window.addEventListener('load', function() {
        initDevToolBypass();
        console.log("[网站综合增强工具] 完全加载");
    });

    // 设置点击处理程序
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupClickHandler);
    } else {
        setupClickHandler();
    }

    console.log("[网站综合增强工具] 核心功能已加载");
})();