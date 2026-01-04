// ==UserScript==
// @name        阻止claude输入发送
// @description 解决在输入法状态下按Enter键导致消息直接发送的问题;Solve the problem that pressing the Enter key in the input method state causes the message to be sent directly.
// @match       https://claude.ai/*
// @author       sinoftj
// @version      2.0
// @namespace https://greasyfork.org/users/1457414
// @downloadURL https://update.greasyfork.org/scripts/532718/%E9%98%BB%E6%AD%A2claude%E8%BE%93%E5%85%A5%E5%8F%91%E9%80%81.user.js
// @updateURL https://update.greasyfork.org/scripts/532718/%E9%98%BB%E6%AD%A2claude%E8%BE%93%E5%85%A5%E5%8F%91%E9%80%81.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 输入法状态追踪
    let imeActive = false;
    let lastImeEndTime = 0;
    const IME_BUFFER_TIME = 5; // 输入法结束后的缓冲时间(毫秒)
    
    // 检查是否处于输入法状态
    function isInImeContext(e) {
        return imeActive || 
               e.isComposing || 
               e.keyCode === 229 || 
               (Date.now() - lastImeEndTime < IME_BUFFER_TIME);
    }
    
    // 处理输入法事件
    document.addEventListener('compositionstart', function() {
        imeActive = true;
    }, true);
    
    document.addEventListener('compositionend', function() {
        lastImeEndTime = Date.now();
        setTimeout(() => { imeActive = false; }, IME_BUFFER_TIME);
    }, true);
    
    // 拦截Enter键事件 - 捕获阶段
    document.addEventListener('keydown', function(e) {
        if ((e.key === 'Enter' || e.keyCode === 13) && isInImeContext(e)) {
            e.stopImmediatePropagation();
            e.preventDefault();
            return false;
        }
    }, true);
    
    // 备份保护：keypress事件拦截
    document.addEventListener('keypress', function(e) {
        if ((e.key === 'Enter' || e.keyCode === 13) && isInImeContext(e)) {
            e.stopImmediatePropagation();
            e.preventDefault();
            return false;
        }
    }, true);
    
    // 处理标准输入框元素
    function protectInputElement(input) {
        const originalKeyDown = input.onkeydown;
        input.onkeydown = function(e) {
            if ((e.key === 'Enter' || e.keyCode === 13) && isInImeContext(e)) {
                e.stopPropagation();
                e.preventDefault();
                return false;
            }
            if (originalKeyDown) return originalKeyDown.call(this, e);
        };
    }
    
    // 处理contenteditable元素（特别是富文本编辑器）
    function protectContentEditableElement(element) {
        // 为contenteditable元素添加直接事件监听
        element.addEventListener('keydown', function(e) {
            if ((e.key === 'Enter' || e.keyCode === 13) && isInImeContext(e)) {
                e.stopPropagation();
                e.preventDefault();
                return false;
            }
        }, true); // 使用捕获模式，确保在事件被其他处理器捕获前拦截
        
        // 查找并处理可能嵌套的ProseMirror编辑器
        const proseMirrors = element.querySelectorAll('.ProseMirror');
        if (proseMirrors.length > 0) {
            proseMirrors.forEach(editor => {
                editor.addEventListener('keydown', function(e) {
                    if ((e.key === 'Enter' || e.keyCode === 13) && isInImeContext(e)) {
                        e.stopPropagation();
                        e.preventDefault();
                        return false;
                    }
                }, true);
            });
        }
    }
    
    // 处理所有可能的编辑元素
    function protectElement(element) {
        if (!element) return;
        
        if (element.tagName === 'TEXTAREA' || 
            (element.tagName === 'INPUT' && element.type === 'text')) {
            protectInputElement(element);
        } 
        else if (element.getAttribute('contenteditable') === 'true') {
            protectContentEditableElement(element);
        }
        // 特殊处理ProseMirror编辑器
        else if (element.classList && element.classList.contains('ProseMirror')) {
            protectContentEditableElement(element);
        }
    }
    
    // 直接监听iframe中的事件（如果有）
    function setupIframeProtection() {
        try {
            const iframes = document.querySelectorAll('iframe');
            iframes.forEach(iframe => {
                try {
                    if (iframe.contentDocument) {
                        iframe.contentDocument.addEventListener('keydown', function(e) {
                            if ((e.key === 'Enter' || e.keyCode === 13) && isInImeContext(e)) {
                                e.stopPropagation();
                                e.preventDefault();
                                return false;
                            }
                        }, true);
                        
                        iframe.contentDocument.addEventListener('compositionstart', function() {
                            imeActive = true;
                        }, true);
                        
                        iframe.contentDocument.addEventListener('compositionend', function() {
                            lastImeEndTime = Date.now();
                            setTimeout(() => { imeActive = false; }, IME_BUFFER_TIME);
                        }, true);
                    }
                } catch (err) {
                    // 跨域iframe访问可能会失败，忽略错误
                }
            });
        } catch (err) {
            console.error('处理iframe时出错:', err);
        }
    }
    
    // 页面加载后处理现有输入元素
    function initializeProtection() {
        // 保护标准输入元素
        document.querySelectorAll('textarea, input[type="text"]').forEach(protectInputElement);
        
        // 保护contenteditable元素
        document.querySelectorAll('[contenteditable="true"]').forEach(protectContentEditableElement);
        
        // 特别处理ProseMirror编辑器
        document.querySelectorAll('.ProseMirror').forEach(protectContentEditableElement);
        
        // 设置iframe保护
        setupIframeProtection();
        
        // 监控DOM变化，处理新添加的输入元素
        if (window.MutationObserver) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                        mutation.addedNodes.forEach((node) => {
                            if (node.nodeType === 1) { // 元素节点
                                protectElement(node);
                                
                                // 处理节点内的所有可能输入元素
                                if (node.querySelectorAll) {
                                    const inputs = node.querySelectorAll('textarea, input[type="text"], [contenteditable="true"], .ProseMirror');
                                    if (inputs.length > 0) {
                                        inputs.forEach(input => protectElement(input));
                                    }
                                }
                            }
                        });
                    }
                    
                    // 特别检查属性变化，以防contenteditable状态变化
                    if (mutation.type === 'attributes' && 
                        mutation.attributeName === 'contenteditable' &&
                        mutation.target.getAttribute('contenteditable') === 'true') {
                        protectContentEditableElement(mutation.target);
                    }
                });
                
                // 检查是否有新的iframe添加
                setupIframeProtection();
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['contenteditable']
            });
        }
    }
    
    // 确保在DOM完全加载后执行，并给予足够时间加载任何动态内容
    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', () => setTimeout(initializeProtection, 1000));
    } else {
        setTimeout(initializeProtection, 1000);
    }
    
    // 监听动态加载的页面部分，比如单页应用的视图变化
    window.addEventListener('load', () => setTimeout(initializeProtection, 1500));
    
    // 监听可能的路由变化（用于SPA应用）
    window.addEventListener('popstate', () => setTimeout(initializeProtection, 500));
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) setTimeout(initializeProtection, 500);
    });
    
    // 初次执行，尽快保护可能存在的元素
    setTimeout(initializeProtection, 300);
})();