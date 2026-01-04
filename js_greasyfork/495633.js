// ==UserScript==
// @name         Chat GPT 粘贴格式问题解决
// @namespace    http://tampermonkey.org/
// @version      0.2
// @description  在复制时清理特定的HTML样式并支持多种粘贴目标
// @author       smartblack
// @match        https://chatgpt.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/495633/Chat%20GPT%20%E7%B2%98%E8%B4%B4%E6%A0%BC%E5%BC%8F%E9%97%AE%E9%A2%98%E8%A7%A3%E5%86%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/495633/Chat%20GPT%20%E7%B2%98%E8%B4%B4%E6%A0%BC%E5%BC%8F%E9%97%AE%E9%A2%98%E8%A7%A3%E5%86%B3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('copy', function(e) {
        let selection = window.getSelection();
        if (!selection.rangeCount) return;

        let container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.left = '-99999px';
        container.style.top = '0';
        container.style.opacity = '0';
        document.body.appendChild(container);

        container.appendChild(selection.getRangeAt(0).cloneContents());

        // 清理HTML元素的样式
        cleanStyles(container);

        try {
            // 为Word等富文本编辑器准备HTML格式
            e.clipboardData.setData('text/html', container.innerHTML);
            // 为文本编辑器和网页表单准备纯文本格式
            e.clipboardData.setData('text/plain', container.textContent);
            e.preventDefault();  // 防止默认的复制行为
        } catch (err) {
            console.error('Failed to set clipboard data:', err);
        }

        document.body.removeChild(container);
    });

    function cleanStyles(element) {
        element.querySelectorAll('*').forEach(el => {
            el.removeAttribute('style');  // 移除所有样式
        });
    }
})();
