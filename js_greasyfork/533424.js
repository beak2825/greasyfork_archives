// ==UserScript==
// @name         学习通粘贴限制解除
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  解除学习通作业中的粘贴限制，允许在作业答题区域正常粘贴内容
// @author       Shi Yi
// @match        *://mooc1.chaoxing.com/mooc-ans/mooc2/work/dowork*
// @match        *://mooc1-1.chaoxing.com/mooc-ans/mooc2/work/dowork*
// @match        *://mooc1-2.chaoxing.com/mooc-ans/mooc2/work/dowork*
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/533424/%E5%AD%A6%E4%B9%A0%E9%80%9A%E7%B2%98%E8%B4%B4%E9%99%90%E5%88%B6%E8%A7%A3%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/533424/%E5%AD%A6%E4%B9%A0%E9%80%9A%E7%B2%98%E8%B4%B4%E9%99%90%E5%88%B6%E8%A7%A3%E9%99%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 在页面加载前就覆盖粘贴限制函数
    function injectScript() {
        const script = document.createElement('script');
        script.textContent = `
            window.editorPaste = function(o, html) {
                console.log("粘贴拦截已解除");
                return true;
            };
            
            // 覆盖jQuery的toast方法，防止显示"只能录入不能粘贴"提示
            if (window.$ && $.toast) {
                const originalToast = $.toast;
                $.toast = function(options) {
                    if (options && options.content && options.content.includes("只能录入不能粘贴")) {
                        console.log("已拦截粘贴限制提示");
                        return;
                    }
                    return originalToast.apply(this, arguments);
                };
            }
        `;
        document.documentElement.appendChild(script);
        script.remove();
    }
    
    // 在DOM加载前注入脚本
    injectScript();
    
    // 监听所有编辑区域的粘贴事件
    function enablePasteForAll() {
        const editors = document.querySelectorAll('textarea, [contenteditable="true"], iframe');
        
        editors.forEach(function(editor) {
            editor.onpaste = null;
            editor.addEventListener('paste', function(e) {
                e.stopPropagation();
            }, true);
        });
        
        document.querySelectorAll('iframe').forEach(function(iframe) {
            try {
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                const iframeEditors = iframeDoc.querySelectorAll('textarea, [contenteditable="true"]');
                
                iframeEditors.forEach(function(editor) {
                    editor.onpaste = null;
                    editor.addEventListener('paste', function(e) {
                        e.stopPropagation();
                    }, true);
                });
            } catch(e) {
                console.log('无法访问iframe内容:', e);
            }
        });
        
        if (window.UE) {
            for (let key in window.UE.instants) {
                const editor = window.UE.instants[key];
                if (editor) {
                    editor.removeListener('beforepaste');
                    editor.options.pasteFilter = false;
                }
            }
        }
    }
    
    function showNotification() {
        const notification = document.createElement('div');
        notification.style.position = 'fixed';
        notification.style.top = '10px';
        notification.style.right = '10px';
        notification.style.backgroundColor = '#4CAF50';
        notification.style.color = 'white';
        notification.style.padding = '10px';
        notification.style.borderRadius = '5px';
        notification.style.zIndex = '9999';
        notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        notification.textContent = '✅ 学习通粘贴功能已启用！';
        
        document.body.appendChild(notification);
        
        setTimeout(function() {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.5s';
            setTimeout(function() {
                document.body.removeChild(notification);
            }, 500);
        }, 3000);
    }
    
    function setupPasteEnabler() {
        enablePasteForAll();
        showNotification();
        
        setInterval(enablePasteForAll, 1000);
    }
    
    // 页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupPasteEnabler);
    } else {
        setupPasteEnabler();
    }
    
    // 监听页面变化，确保动态加载的内容也能正常粘贴
    const observer = new MutationObserver(function() {
        enablePasteForAll();
    });
    
    window.addEventListener('load', function() {
        observer.observe(document.body, { 
            childList: true, 
            subtree: true 
        });
    });
})();
