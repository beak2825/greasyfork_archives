// ==UserScript==
// @name         Grok Chat对话记录导出为.md（Markdown）
// @namespace    https://grok.com/
// @version      0.5
// @description  将 https://grok.com/chat/* 页面中的聊天记录导出为 .md 文件，使用对话标题命名，固定交替标识 User / Grok 3 发言者身份（奇偶标）
// @author       GPT
// @match        https://grok.com/chat/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539965/Grok%20Chat%E5%AF%B9%E8%AF%9D%E8%AE%B0%E5%BD%95%E5%AF%BC%E5%87%BA%E4%B8%BAmd%EF%BC%88Markdown%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/539965/Grok%20Chat%E5%AF%B9%E8%AF%9D%E8%AE%B0%E5%BD%95%E5%AF%BC%E5%87%BA%E4%B8%BAmd%EF%BC%88Markdown%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* === 配置区 === */
    const DEFAULT_MODEL_NAME = 'Grok 3';  // 如果你用的是 Grok 2、GPT-4、Claude，也可改这里

    const messageSelectors = [
        '[data-testid*="chat-message"]',
        '[class*="Message"]',
        '[class*="message" i]'
    ].join(',');

    const buttonStyle = `
        position: fixed;
        bottom: 12px;
        right: 12px;
        z-index: 9999;
        padding: 4px 10px;
        font-size: 12px;
        background: #4caf50;
        color: #fff;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        box-shadow: 0 2px 6px rgba(0,0,0,.15);
    `;

    const BUTTON_ID = 'grok-md-export-btn';

    function createButton() {
        if (document.getElementById(BUTTON_ID)) return;
        const btn = document.createElement('button');
        btn.id = BUTTON_ID;
        btn.textContent = '导出 Markdown';
        btn.setAttribute('style', buttonStyle);
        btn.addEventListener('click', exportChat);
        document.body.appendChild(btn);
    }

    const observer = new MutationObserver(createButton);
    observer.observe(document.body, { childList: true, subtree: true });
    createButton();

    function exportChat() {
        const nodes = Array.from(document.querySelectorAll(messageSelectors));
        if (!nodes.length) {
            alert('未找到任何聊天记录，可能需要调整脚本中的 messageSelectors。');
            return;
        }

        const messages = nodes.map((node, i) => processNode(node, i)).filter(Boolean);
        if (!messages.length) {
            alert('无法解析聊天内容，可能需要调整脚本。');
            return;
        }

        const mdContent = buildMarkdown(messages);
        downloadMarkdown(mdContent);
    }

    function processNode(node, index) {
        const text = node.innerText.trim();
        if (!text) return null;

        const author = index % 2 === 0 ? 'User' : DEFAULT_MODEL_NAME;
        return { author, text };
    }

    function buildMarkdown(messages) {
        const lines = [];
        messages.forEach(m => {
            lines.push(`**${m.author}:**`);
            lines.push('');
            lines.push(m.text.replace(/\r?\n/g, '  \n'));
            lines.push('');
        });
        return lines.join('\n');
    }

    function downloadMarkdown(content) {
        const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;

        let title = document.title || 'grok-chat';
        try {
            const titleNode = document.querySelector('h1, h2, [class*=title], [class*=header]');
            if (titleNode && titleNode.textContent.trim()) {
                title = titleNode.textContent.trim();
            }
        } catch (e) {
            console.warn('无法提取对话标题，使用默认命名');
        }

        title = title.replace(/[\\/:*?"<>|]/g, '-');
        const ts = new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-');
        a.download = `${title}-${ts}.md`;

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
})();
