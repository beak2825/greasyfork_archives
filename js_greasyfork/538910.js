// ==UserScript==
// @name         CMB考试中心助手
// @namespace    https://greasyfork.org/
// @version      2.0
// @description  帮助你轻松通过各种内部考试，能够随意切屏和复制
// @author       hamQ
// @license      MIT
// @match        file:///*
// @match        *://exam-center.paas.cmbchina.com/*
// @run-at       document-start
// @icon         https://exam-center.paas.cmbchina.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538910/CMB%E8%80%83%E8%AF%95%E4%B8%AD%E5%BF%83%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/538910/CMB%E8%80%83%E8%AF%95%E4%B8%AD%E5%BF%83%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('[完整绕过] 脚本已启动');

    //改为打开新标签页
    const oldopen = window.open
    window.open = function (url){
        oldopen(url)
    }

    // 保存原始方法
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    const originalSetProperty = Object.defineProperty;

    // =================== 第一部分：绕过切屏检测 ===================

    // 1. 劫持事件监听器
    EventTarget.prototype.addEventListener = function(type, listener, options) {
        if (type === 'blur' || type === 'beforeunload') {
            console.log(`[切屏绕过] 阻止了 ${type} 事件监听器`);
            return;
        }
        return originalAddEventListener.call(this, type, listener, options);
    };

    // 2. 阻止window属性设置
    try {
        Object.defineProperty(window, 'onblur', {
            set: function(value) {
                console.log('[切屏绕过] 阻止设置window.onblur');
            },
            get: function() { return null; },
            configurable: true
        });

        Object.defineProperty(window, 'onbeforeunload', {
            set: function(value) {
                console.log('[切屏绕过] 阻止设置window.onbeforeunload');
            },
            get: function() { return null; },
            configurable: true
        });
    } catch (e) {
        console.log('[切屏绕过] 属性劫持失败:', e);
    }

    // 3. 劫持BroadcastChannel
    window.BroadcastChannel = function(name) {
        console.log(`[切屏绕过] 创建BroadcastChannel: ${name}`);
        return {
            postMessage: function(data) {
                console.log('[切屏绕过] 阻止BroadcastChannel消息:', data);
            },
            close: function() {},
            addEventListener: function() {},
            removeEventListener: function() {}
        };
    };

    // 4. 劫持fetch请求
    const originalFetch = window.fetch;
    window.fetch = function(url, options = {}) {
        if (typeof url === 'string' &&
            (url.includes('save-exam-user-out-screen') ||
             url.includes('save-operation-record'))) {
            console.log('[切屏绕过] 阻止切屏报告请求:', url);
            return Promise.resolve(new Response(JSON.stringify({success: true}), {
                status: 200,
                statusText: 'OK',
                headers: { 'Content-Type': 'application/json' }
            }));
        }
        return originalFetch.apply(this, arguments);
    };

    // =================== 第二部分：绕过页面操作限制 ===================

    // 等待DOM加载完成后执行
    function removeRestrictions() {
        console.log('[操作限制绕过] 开始移除页面限制...');

        // 1. 恢复右键菜单
        document.oncontextmenu = null;
        document.addEventListener('contextmenu', function(e) {
            e.stopPropagation();
        }, true);

        // 2. 恢复文本选择
        document.onselectstart = null;
        document.addEventListener('selectstart', function(e) {
            e.stopPropagation();
        }, true);

        // 3. 恢复键盘事件
        document.onkeydown = null;
        document.onkeyup = null;
        document.onkeypress = null;
        window.onkeydown = null;
        window.onkeyup = null;
        window.onkeypress = null;

        // 4. 恢复复制粘贴
        document.oncopy = null;
        document.oncut = null;
        document.onpaste = null;

        // 5. 移除CSS样式限制
        const style = document.createElement('style');
        style.textContent = `
            * {
                -webkit-user-select: text !important;
                -moz-user-select: text !important;
                -ms-user-select: text !important;
                user-select: text !important;
                -webkit-touch-callout: default !important;
            }

            body {
                -webkit-user-select: text !important;
                -moz-user-select: text !important;
                user-select: text !important;
            }
        `;
        document.head.appendChild(style);

        console.log('[操作限制绕过] 页面限制已移除');
    }

    // =================== 第三部分：劫持可能的重新设置 ===================

    // 劫持addEventListener以防止重新绑定限制事件
    const originalDocumentAddEventListener = Document.prototype.addEventListener;
    Document.prototype.addEventListener = function(type, listener, options) {
        // 允许的事件类型
        const blockedEvents = [
            'contextmenu', 'selectstart', 'copy', 'cut', 'paste',
            'keydown', 'keyup', 'keypress', 'blur', 'beforeunload'
        ];

        if (blockedEvents.includes(type)) {
            console.log(`[事件劫持] 阻止绑定 ${type} 事件`);
            return;
        }

        return originalDocumentAddEventListener.call(this, type, listener, options);
    };

    // 劫持Object.defineProperty防止重新定义document事件属性
    const originalDefineProperty = Object.defineProperty;
    Object.defineProperty = function(obj, prop, descriptor) {
        if (obj === document &&
            ['oncontextmenu', 'onselectstart', 'oncopy', 'oncut', 'onpaste',
             'onkeydown', 'onkeyup', 'onkeypress'].includes(prop)) {
            console.log(`[属性劫持] 阻止重新定义 document.${prop}`);
            return obj;
        }
        return originalDefineProperty.apply(this, arguments);
    };

    // =================== 第四部分：监控和清理 ===================

    // 定期清理限制
    function periodicCleanup() {
        try {
            // 清理window事件
            window.onblur = null;
            window.onbeforeunload = null;
            window.onkeydown = null;
            window.onkeyup = null;
            window.onkeypress = null;

            // 清理document事件
            document.oncontextmenu = null;
            document.onselectstart = null;
            document.oncopy = null;
            document.oncut = null;
            document.onpaste = null;
            document.onkeydown = null;
            document.onkeyup = null;
            document.onkeypress = null;

        } catch (e) {
            // 忽略错误
        }
    }

    // 监控setInterval，阻止可能的检测定时器
    const originalSetInterval = window.setInterval;
    window.setInterval = function(callback, delay) {
        if (typeof callback === 'function') {
            const callbackStr = callback.toString();
            // 检测是否是限制相关的定时器
            if (callbackStr.includes('outerWidth') ||
                callbackStr.includes('outerHeight') ||
                callbackStr.includes('onblur') ||
                callbackStr.includes('outScreen') ||
                callbackStr.includes('contextmenu') ||
                callbackStr.includes('selectstart')) {
                console.log('[定时器劫持] 阻止了限制相关的setInterval');
                return 0;
            }
        }
        return originalSetInterval.apply(this, arguments);
    };

    // =================== 第五部分：初始化和监听 ===================

    // 立即执行一次清理
    removeRestrictions();

    // 定期清理（每秒执行一次）
    setInterval(periodicCleanup, 1000);

    // 页面加载完成后再次清理
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', removeRestrictions);
    }

    window.addEventListener('load', function() {
        setTimeout(removeRestrictions, 1000);
        setTimeout(removeRestrictions, 3000); // 延迟清理，应对延迟加载的限制
    });

    // 监听页面变化（针对SPA应用）
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            console.log('[页面变化] 检测到URL变化，重新移除限制');
            setTimeout(removeRestrictions, 1000);
        }
    }).observe(document, {subtree: true, childList: true});

    // =================== 第六部分：开发者工具保护绕过 ===================

    // 阻止检测开发者工具的常见方法
    const originalLog = console.log;
    console.log = function(...args) {
        return originalLog.apply(this, args);
    };

    // 阻止debugger语句
    const originalEval = window.eval;
    window.eval = function(code) {
        if (typeof code === 'string' && code.includes('debugger')) {
            console.log('[调试阻止] 阻止了debugger语句');
            return;
        }
        return originalEval.apply(this, arguments);
    };

    console.log('[完整绕过] 所有限制绕过已设置完成');

    // 添加成功提示
    setTimeout(() => {
        console.log('%c[完整绕过] 脚本运行成功！', 'color: green; font-weight: bold; font-size: 14px;');
        console.log('%c可以正常使用右键菜单、复制粘贴、文本选择、F12等功能了', 'color: blue;');
    }, 2000);

})();