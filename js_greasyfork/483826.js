// ==UserScript==
// @name         网页字数统计
// @namespace    http://tampermonkey.net/
// @version      0.15
// @license      MIT
// @description  在网页上选中文字时，通过浮层显示字数，针对ChatGPT官网(2025.4.12)优化
// @author       PPPotatooo
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/483826/%E7%BD%91%E9%A1%B5%E5%AD%97%E6%95%B0%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/483826/%E7%BD%91%E9%A1%B5%E5%AD%97%E6%95%B0%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==
(function() {
    'use strict';
    // 创建浮层元素
    const floatDiv = document.createElement('div');
    floatDiv.style.cssText = 'position: absolute; z-index: 1000; padding: 5px; background: white; border: 1px solid black; border-radius: 4px; font-size: 12px; display: none; opacity: 1; transition: opacity 1s ease;';
    document.body.appendChild(floatDiv);
    let fadeOutTimeout;
    // 新增函数：计算中英文字数
    function countWords(text) {
        // 移除标点符号和特殊字符
        text = text.replace(/[^\w\s\u4e00-\u9fa5]/g, '');
        // 分别匹配中文字符和英文单词
        const chineseChars = text.match(/[\u4e00-\u9fa5]/g) || [];
        const englishWords = text.match(/\b[a-zA-Z]+\b/g) || [];
        // 返回中文字符和英文单词的总数
        return chineseChars.length + englishWords.length;
    }
    document.addEventListener('mouseup', function() {
        clearTimeout(fadeOutTimeout);
        const selection = window.getSelection();
        const selectedText = selection.toString();
        if (selectedText.length > 0) {
            // 调用计算字数的函数
            const totalWords = countWords(selectedText);
            floatDiv.textContent = `字数: ${totalWords}`;
            // 获取选中文字的范围
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            // 设置浮层位置
            floatDiv.style.left = `${rect.left + window.scrollX}px`;
            floatDiv.style.top = `${rect.bottom + window.scrollY}px`;
            floatDiv.style.display = 'block';
            floatDiv.style.opacity = '1';
            // 设置2秒后开始消失
            fadeOutTimeout = setTimeout(() => {
                floatDiv.style.opacity = '0';
                setTimeout(() => floatDiv.style.display = 'none', 1000); // 1秒后完全隐藏
            }, 2000);
        } else {
            floatDiv.style.display = 'none';
        }
    });

    // ==================== 专门适用于ChatGPT官网 ====================
    // 检测是否在ChatGPT.com网站
    if (window.location.hostname.includes('chatgpt.com')) {
        function handleChatGPTSelection() {
            const selection = window.getSelection();
            const selectedText = selection.toString();
            
            if (selectedText.length > 0) {
                const totalWords = countWords(selectedText);
                floatDiv.textContent = `字数: ${totalWords}`;
                
                try {
                    // 获取选中文字的位置信息
                    const range = selection.getRangeAt(0);
                    const rect = range.getBoundingClientRect();
                    floatDiv.style.zIndex = '10000000';
                    floatDiv.style.position = 'fixed';
                    floatDiv.style.left = `${rect.left}px`;
                    floatDiv.style.top = `${rect.bottom + 5}px`;
                    
                    // 如果位置在视口外，调整位置
                    if (rect.top < 0 || rect.bottom > window.innerHeight) {
                        floatDiv.style.top = `${Math.min(window.innerHeight - 30, Math.max(30, rect.top))}px`;
                    }
                    
                    floatDiv.style.display = 'block';
                    floatDiv.style.opacity = '1';
                    
                    clearTimeout(fadeOutTimeout);
                    fadeOutTimeout = setTimeout(() => {
                        floatDiv.style.opacity = '0';
                        setTimeout(() => floatDiv.style.display = 'none', 1000);
                    }, 2000);
                } catch (e) {
                    console.log('ChatGPT字数统计出错:', e);
                }
            }
        }
        
        // 为ChatGPT特定元素添加事件监听器
        function addChatGPTEventListeners() {
            const messageElements = document.querySelectorAll('.text-token-text-primary, .markdown, .prose');
            
            messageElements.forEach(element => {
                if (!element.dataset.wordcountEnabled) {
                    element.dataset.wordcountEnabled = 'true';
                    element.addEventListener('mouseup', handleChatGPTSelection, true);
                }
            });
        }
        
        addChatGPTEventListeners();
        const observer = new MutationObserver(() => {
            addChatGPTEventListeners();
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        document.addEventListener('mouseup', function(e) {
            setTimeout(() => {
                const selection = window.getSelection();
                const selectedText = selection.toString();
                
                if (selectedText.length > 0) {
                    handleChatGPTSelection();
                }
            }, 10);
        }, true);
    }
    
})();