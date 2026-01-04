// ==UserScript==
// @name         98色花堂自动跳转到支付购买位置lc
// @namespace    http://tampermonkey.net/
// @version      1.1.2
// @description  Toggle auto-redirect to the first occurrence of "作者支" on the post page, persistent across page reloads, and only when the page is active
// @author       You
// @match        *://*.sehuatang.org/forum.php?mod=viewthread*
// @match        *://*.sehuatang.net/forum.php?mod=viewthread*
// @grant        none
// @license MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/501221/98%E8%89%B2%E8%8A%B1%E5%A0%82%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E5%88%B0%E6%94%AF%E4%BB%98%E8%B4%AD%E4%B9%B0%E4%BD%8D%E7%BD%AElc.user.js
// @updateURL https://update.greasyfork.org/scripts/501221/98%E8%89%B2%E8%8A%B1%E5%A0%82%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E5%88%B0%E6%94%AF%E4%BB%98%E8%B4%AD%E4%B9%B0%E4%BD%8D%E7%BD%AElc.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 检查是否在帖子页面
    function isPostPage() {
        return window.location.href.includes('mod=viewthread');
    }

    // 从 localStorage 中读取功能状态
    let isRedirectEnabled = localStorage.getItem('isRedirectEnabled') === 'true';

    // 创建按钮
    const button = document.createElement('button');
    button.style.position = 'fixed';
    button.style.bottom = '10px';
    button.style.right = '10px';
    button.style.padding = '10px';
    button.style.backgroundColor = '#007bff';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.id = 'payment-toggle-button';

    // 设置按钮文本
    button.textContent = isRedirectEnabled ? '已经跳转支付' : '未跳转支付';

    // 按钮点击事件处理
    button.addEventListener('click', () => {
        isRedirectEnabled = !isRedirectEnabled;
        localStorage.setItem('isRedirectEnabled', isRedirectEnabled);
        button.textContent = isRedirectEnabled ? '已经跳转支付' : '未跳转支付';
        if (isRedirectEnabled) {
            checkAndHighlightKeyword('作者支'); // 直接执行
        }
    });

    // 将按钮添加到页面
    if (isPostPage()) {
        document.body.appendChild(button);
    }

    // 检查关键词是否在视野中
    function isKeywordInView(element) {
        const rect = element.getBoundingClientRect();
        return rect.top >= 0 && rect.left >= 0 &&
               rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
               rect.right <= (window.innerWidth || document.documentElement.clientWidth);
    }

    // 使关键词在视野的底部
    function scrollToKeywordBottom(element) {
        const rect = element.getBoundingClientRect();
        const offset = window.innerHeight - rect.height;
        window.scrollBy({
            top: rect.top - offset,
            behavior: 'smooth'
        });
    }

    // 检查并高亮关键词
    function checkAndHighlightKeyword(keyword) {
        // 移除以前的高亮
        const oldHighlights = document.querySelectorAll('.highlight');
        oldHighlights.forEach(el => {
            el.outerHTML = el.innerText; // 恢复为原始文本
        });

        // 创建一个正则表达式以匹配关键词
        const regex = new RegExp(`(${keyword})`, 'gi');

        // 遍历所有文本节点进行高亮
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        let node;
        const highlights = [];
        while ((node = walker.nextNode())) {
            if (node.parentNode && node.parentNode.tagName !== 'SCRIPT' && node.parentNode.tagName !== 'STYLE') {
                const text = node.nodeValue;
                if (regex.test(text)) {
                    const span = document.createElement('span');
                    span.className = 'highlight';
                    span.innerHTML = text.replace(regex, '<span class="highlight">$1</span>');
                    node.parentNode.replaceChild(span, node);
                    highlights.push(span);
                }
            }
        }

        // 高亮样式
        const css = `
            .highlight {
                background-color: yellow;
                font-weight: bold;
            }
        `;
        const style = document.createElement('style');
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);

        // 确保至少找到一个关键词
        if (highlights.length > 0) {
            const firstHighlight = highlights[0];
            if (!isKeywordInView(firstHighlight)) {
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                // 等待滚动到底部的动画完成
                setTimeout(() => {
                    scrollToKeywordBottom(firstHighlight);
                    button.textContent = '已经跳转支付';
                    // 延迟 1 秒后再次执行检索跳转
                    setTimeout(() => {
                        if (!isKeywordInView(firstHighlight)) {
                            scrollToKeywordBottom(firstHighlight);
                        }
                    }, 1000);
                }, 500); // 修改为更快的间隔
            } else {
                scrollToKeywordBottom(firstHighlight);
                button.textContent = '已经跳转支付';
                // 延迟 1 秒后再次执行检索跳转
                setTimeout(() => {
                    if (!isKeywordInView(firstHighlight)) {
                        scrollToKeywordBottom(firstHighlight);
                    }
                }, 1000);
            }
        } else {
            button.textContent = '未跳转支付';
        }
    }

    // 页面激活后执行
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && isPostPage() && isRedirectEnabled) {
            setTimeout(() => checkAndHighlightKeyword('作者支'), 4000); // 等待 4 秒后执行
        }
    });
})();
