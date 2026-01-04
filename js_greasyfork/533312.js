// ==UserScript==
// @name         NodeSeek一键复制代码块
// @namespace    https://www.nodeseek.com/space/3444
// @version      2025-04-19
// @description  用于在 NodeSeek 论坛一键复制代码块
// @license      MIT
// @author       Anya
// @match        https://www.nodeseek.com/*
// @icon         https://www.nodeseek.com/static/image/favicon/android-chrome-192x192.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533312/NodeSeek%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6%E4%BB%A3%E7%A0%81%E5%9D%97.user.js
// @updateURL https://update.greasyfork.org/scripts/533312/NodeSeek%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6%E4%BB%A3%E7%A0%81%E5%9D%97.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 样式注入：为复制按钮设置位置和外观
    const style = document.createElement('style');
    style.textContent = `
        .tm-copy-btn {
            position: absolute;
            top: 8px;
            right: 8px;
            padding: 2px 8px;
            font-size: 12px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            z-index: 1000;
            opacity: 0.8;
            transition: opacity 0.2s;
        }
        .tm-copy-btn:hover {
            opacity: 1;
        }
        pre.tm-copy-wrapper {
            position: relative !important;
        }
    `;
    document.head.appendChild(style);

    // 给单个 <pre><code> 添加复制按钮
    function addCopyBtn(pre) {
        if (pre.classList.contains('tm-copy-wrapper')) return; // 已处理过
        const code = pre.querySelector('code');
        if (!code) return;

        pre.classList.add('tm-copy-wrapper');
        const btn = document.createElement('button');
        btn.className = 'tm-copy-btn';
        btn.textContent = '复制';
        btn.addEventListener('click', () => {
            // 复制 code 内的纯文本
            const text = code.innerText;
            navigator.clipboard.writeText(text).then(() => {
                btn.textContent = '已复制';
                setTimeout(() => { btn.textContent = '复制'; }, 2000);
            }).catch(err => {
                console.error('复制失败:', err);
                btn.textContent = '失败';
                setTimeout(() => { btn.textContent = '复制'; }, 2000);
            });
        });
        pre.appendChild(btn);
    }

    // 扫描页面中所有符合条件的 pre
    function scanAndAttach() {
        document.querySelectorAll('pre').forEach(addCopyBtn);
    }

    // 页面初次加载时运行一次
    scanAndAttach();

    // 针对动态添加的 <pre>，使用 MutationObserver
    const observer = new MutationObserver(mutations => {
        for (const m of mutations) {
            for (const node of m.addedNodes) {
                if (!(node instanceof HTMLElement)) continue;
                // 如果直接是 <pre>，或包含若干 <pre>
                if (node.matches('pre')) {
                    addCopyBtn(node);
                } else {
                    node.querySelectorAll?.('pre').forEach(addCopyBtn);
                }
            }
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();
