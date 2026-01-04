// ==UserScript==
// @name         ChatGPT Markdown Export
// @namespace    https://github.com/dankCodeNugs/greasyScripts
// @version      1.0.0
// @description  Export ChatGPT conversations to clean, readable Markdown with proper role labels and preserved code formatting.
// @author       Anonymous
// @match        https://chat.openai.com/*
// @match        https://chatgpt.com/*
// @license      Dual license anti-copyleft & BSD-2-Clause
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539263/ChatGPT%20Markdown%20Export.user.js
// @updateURL https://update.greasyfork.org/scripts/539263/ChatGPT%20Markdown%20Export.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const BUTTON_ID = 'export-md-button';

    const style = `
        #${BUTTON_ID} {
            position: fixed;
            top: 10px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 9999;
            padding: 6px 14px;
            font-size: 14px;
            font-weight: 500;
            background: rgba(255, 255, 255, 0.1);
            color: #fff;
            border: 1px solid rgba(255, 255, 255, 0.4);
            border-radius: 6px;
            backdrop-filter: blur(6px);
            cursor: pointer;
            transition: background 0.2s, color 0.2s;
        }
        #${BUTTON_ID}:hover {
            background: rgba(255, 255, 255, 0.2);
            color: #000;
        }
    `;

    function injectStyle() {
        const tag = document.createElement('style');
        tag.textContent = style;
        document.head.appendChild(tag);
    }

    function sanitizeClone(el) {
        const clone = el.cloneNode(true);
        clone.querySelectorAll('button, .copy-button, .absolute, .overflow-hidden, svg').forEach(e => e.remove());
        return clone;
    }

    function extractMarkdownFromElement(el) {
        const blocks = [];
        const walker = document.createTreeWalker(el, NodeFilter.SHOW_ELEMENT, null, false);

        while (walker.nextNode()) {
            const node = walker.currentNode;

            if (node.tagName === 'PRE' && node.querySelector('code')) {
                const code = node.querySelector('code').textContent.trim();
                blocks.push("```");
                blocks.push(code);
                blocks.push("```");
                walker.currentNode = node;
            } else if (node.tagName === 'P') {
                const text = node.textContent.trim();
                if (text.length > 0) {
                    blocks.push(text);
                }
            }
        }

        if (blocks.length === 0) {
            blocks.push(el.innerText.trim());
        }

        return blocks.join('\n\n');
    }

    function getSpeakerFromRole(role) {
        if (role === 'user') return 'User';
        if (role === 'assistant') return 'ChatGPT';
        return 'Unknown';
    }

    function collectMessages() {
        const transcript = [];

        const messages = document.querySelectorAll('main div[data-message-author-role]');

        messages.forEach(msg => {
            const role = msg.getAttribute('data-message-author-role');
            const speaker = getSpeakerFromRole(role);

            let content = '';
            const markdownEl = msg.querySelector('.markdown, .prose');
            const plainEl = msg.querySelector('.whitespace-pre-wrap');

            if (markdownEl) {
                const clean = sanitizeClone(markdownEl);
                content = extractMarkdownFromElement(clean);
            } else if (plainEl) {
                content = plainEl.textContent.trim();
            }

            if (content && content.length > 0) {
                transcript.push(`### ${speaker}:\n\n${content}`);
            }
        });

        return transcript.join('\n\n---\n\n');
    }

    function downloadMarkdown(content) {
        const blob = new Blob([content], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        a.href = url;
        a.download = `chatgpt-session-${timestamp}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function addExportButton() {
        const btn = document.createElement('button');
        btn.id = BUTTON_ID;
        btn.textContent = 'Export to MD';
        btn.addEventListener('click', () => {
            const md = collectMessages();
            if (md.length === 0) {
                alert('No messages found.');
                return;
            }
            downloadMarkdown(md);
        });
        document.body.appendChild(btn);
    }

    const waitForMain = setInterval(() => {
        const main = document.querySelector('main');
        if (main && !document.getElementById(BUTTON_ID)) {
            clearInterval(waitForMain);
            injectStyle();
            addExportButton();
        }
    }, 500);
})();
