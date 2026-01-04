// ==UserScript==
// @name         智慧树作业文字复制
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  允许在智慧树作业页面选择和复制文字
// @author       king
// @match        *://hiexam.zhihuishu.com/*
// @match        *://coursedata.zhihuishu.com/*
// @match        *://studyh5.zhihuishu.com/*
// @match        *://www.zhihuishu.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/519422/%E6%99%BA%E6%85%A7%E6%A0%91%E4%BD%9C%E4%B8%9A%E6%96%87%E5%AD%97%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/519422/%E6%99%BA%E6%85%A7%E6%A0%91%E4%BD%9C%E4%B8%9A%E6%96%87%E5%AD%97%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加全局样式
    const css = `
        * {
            user-select: text !important;
            -webkit-user-select: text !important;
            -moz-user-select: text !important;
            -ms-user-select: text !important;
            pointer-events: auto !important;
        }
        
        .question-content, 
        .question-title, 
        .question-desc,
        .content-wrapper,
        .text-content,
        div[class*="content"],
        div[class*="text"],
        span,
        p {
            user-select: text !important;
            -webkit-user-select: text !important;
            -moz-user-select: text !important;
            -ms-user-select: text !important;
            pointer-events: auto !important;
        }
    `;

    // 使用GM_addStyle注入样式
    if (typeof GM_addStyle !== 'undefined') {
        GM_addStyle(css);
    } else {
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }

    function enableTextSelection() {
        try {
            // 移除文档级别的限制
            document.oncopy = null;
            document.onselect = null;
            document.onselectstart = null;
            document.oncontextmenu = null;
            
            // 移除所有元素的限制
            const elements = document.getElementsByTagName('*');
            for (let elem of elements) {
                try {
                    // 移除事件监听器
                    elem.oncopy = null;
                    elem.onselect = null;
                    elem.onselectstart = null;
                    elem.oncontextmenu = null;
                    
                    // 设置样式
                    elem.style.setProperty('user-select', 'text', 'important');
                    elem.style.setProperty('-webkit-user-select', 'text', 'important');
                    elem.style.setProperty('-moz-user-select', 'text', 'important');
                    elem.style.setProperty('pointer-events', 'auto', 'important');
                    
                    // 移除可能的只读属性
                    if (elem.hasAttribute('unselectable')) {
                        elem.removeAttribute('unselectable');
                    }
                } catch (e) {
                    // 忽略单个元素的错误
                }
            }
        } catch (e) {
            console.log('启用文字选择时出错：', e);
        }
    }

    // 在文档加载的不同阶段尝试启用文字选择
    document.addEventListener('DOMContentLoaded', enableTextSelection, false);
    window.addEventListener('load', enableTextSelection, false);

    // 定期检查（使用RAF代替setInterval以提高性能）
    function checkLoop() {
        enableTextSelection();
        requestAnimationFrame(checkLoop);
    }
    requestAnimationFrame(checkLoop);

    // 覆盖可能的保护函数
    const overrideFunctions = function() {
        try {
            // 覆盖常见的限制函数
            ['copy', 'selectstart', 'contextmenu', 'mousedown', 'mouseup', 'keydown'].forEach(function(eventName) {
                document.addEventListener(eventName, function(e) {
                    e.stopImmediatePropagation();
                    return true;
                }, true);
            });

            // 覆盖剪贴板API
            const originalClipboard = navigator.clipboard;
            Object.defineProperty(navigator, 'clipboard', {
                get: function() {
                    return originalClipboard;
                },
                set: function() {
                    return originalClipboard;
                },
                configurable: false
            });
        } catch (e) {
            console.log('覆盖保护函数时出错：', e);
        }
    };

    overrideFunctions();
})(); 