// ==UserScript==
// @name        阻止Gemini两次点击
// @description 确保在输入法状态完成后按Enter键强制发送消息；This js script is to remove the need to click the enter button twice to send text when using Gemini.
// @match       https://gemini.google.com/*
// @version     1.1
// @author      sinoftj
// @namespace https://greasyfork.org/users/1457414
// @downloadURL https://update.greasyfork.org/scripts/532717/%E9%98%BB%E6%AD%A2Gemini%E4%B8%A4%E6%AC%A1%E7%82%B9%E5%87%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/532717/%E9%98%BB%E6%AD%A2Gemini%E4%B8%A4%E6%AC%A1%E7%82%B9%E5%87%BB.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 输入法状态追踪
    let imeActive = false;
    let imeJustEnded = false;
    let lastImeEndTime = 0;
    const IME_BUFFER_TIME = 300; // 输入法结束后的响应时间(毫秒)
    
    // 检查是否刚刚完成输入法输入
    function justFinishedImeInput() {
        return imeJustEnded || 
               (Date.now() - lastImeEndTime < IME_BUFFER_TIME);
    }
    
    // 处理输入法事件
    document.addEventListener('compositionstart', function() {
        imeActive = true;
        imeJustEnded = false;
    }, true);
    
    document.addEventListener('compositionend', function() {
        imeActive = false;
        imeJustEnded = true;
        lastImeEndTime = Date.now();
        setTimeout(() => { imeJustEnded = false; }, IME_BUFFER_TIME);
    }, true);
    
    // 查找发送按钮并点击
    function findAndClickSendButton() {
        // 尝试不同的选择器查找发送按钮
        const selectors = [
            // 常见发送按钮选择器
            'button[type="submit"]',
            'button.send-button',
            'button.submit-button',
            '[aria-label="发送"]',
            '[aria-label="Send"]',
            'button:has(svg[data-icon="paper-plane"])',
            // 特定网站的自定义选择器
            '.absolute.p-1.rounded-md.md\\:bottom-3.md\\:p-2.md\\:right-3', // ChatGPT
            '#send-button', // 通用ID
            '.send-button-container button', // Claude
            // 添加更多选择器以适应不同网站
        ];
        
        // 尝试每个选择器
        for (const selector of selectors) {
            const buttons = document.querySelectorAll(selector);
            for (const button of buttons) {
                // 检查按钮是否可见且未禁用
                if (button && 
                    !button.disabled && 
                    button.offsetParent !== null && 
                    getComputedStyle(button).display !== 'none') {
                    button.click();
                    return true;
                }
            }
        }
        
        // 如果找不到按钮，尝试模拟表单提交
        const activeElement = document.activeElement;
        if (activeElement && (activeElement.tagName === 'TEXTAREA' || activeElement.tagName === 'INPUT')) {
            const form = activeElement.closest('form');
            if (form) {
                form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
                return true;
            }
        }
        
        return false;
    }
    
    // 监听Enter键事件
    document.addEventListener('keydown', function(e) {
        if ((e.key === 'Enter' || e.keyCode === 13) && !e.shiftKey && !e.ctrlKey && !e.altKey && !imeActive && justFinishedImeInput()) {
            // 输入法刚刚完成，且按下了Enter键，强制发送消息
            if (findAndClickSendButton()) {
                e.stopImmediatePropagation();
                e.preventDefault();
                return false;
            }
        }
    }, true);
    
    // 为所有相关输入元素添加事件监听
    function enhanceInputElement(input) {
        // 保存原始的keydown处理函数
        const originalKeyDown = input.onkeydown;
        
        // 添加新的keydown处理函数
        input.onkeydown = function(e) {
            if ((e.key === 'Enter' || e.keyCode === 13) && !e.shiftKey && !e.ctrlKey && !e.altKey && !imeActive && justFinishedImeInput()) {
                // 输入法刚刚完成，且按下了Enter键，强制发送消息
                if (findAndClickSendButton()) {
                    e.stopPropagation();
                    e.preventDefault();
                    return false;
                }
            }
            // 调用原始处理函数
            if (originalKeyDown) return originalKeyDown.call(this, e);
        };
    }
    
    // 页面加载后处理现有输入框
    window.addEventListener('load', function() {
        setTimeout(() => {
            document.querySelectorAll('textarea, input[type="text"]').forEach(enhanceInputElement);
            
            // 监控DOM变化，处理新添加的输入框
            if (window.MutationObserver) {
                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                            mutation.addedNodes.forEach((node) => {
                                if (node.nodeType === 1) {
                                    if (node.tagName === 'TEXTAREA' || 
                                        (node.tagName === 'INPUT' && node.type === 'text')) {
                                        enhanceInputElement(node);
                                    }
                                    
                                    const inputs = node.querySelectorAll ? 
                                        node.querySelectorAll('textarea, input[type="text"]') : [];
                                    if (inputs.length > 0) {
                                        inputs.forEach(enhanceInputElement);
                                    }
                                }
                            });
                        }
                    });
                });
                
                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            }
        }, 1000);
    });
})();