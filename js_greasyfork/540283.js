// ==UserScript==
// @name         LMArena Code Downloader (Universal Fix)
// @name:zh-CN   大模型竞技场代码下载器 (通用修复版)
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Adds a download button to code blocks on lmarena.ai. Universal fix for all script managers.
// @description:zh-CN 在 LMArena.ai 页面为代码块添加下载按钮。通用修复版，兼容所有脚本管理器。
// @author       AI & Human
// @match        https://lmarena.ai/*
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWRvd25sb2FkIj48cGF0aCBkPSJNMjEgMTV2NGEyIDIgMCAwIDEtMiAySDVhMiAyIDAgMCAxLTItMlYxNSIvPjxwYXRoIGQ9Im03IDEwIDEgNSA1LTUtNSIvPjxwYXRoIGQ9Ik0xMiAxNVY0Ii8+PC9zdmc+
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540283/LMArena%20Code%20Downloader%20%28Universal%20Fix%29.user.js
// @updateURL https://update.greasyfork.org/scripts/540283/LMArena%20Code%20Downloader%20%28Universal%20Fix%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 辅助函数 ---

    /**
     * 向页面添加全局CSS样式，替代GM_addStyle，兼容所有环境。
     * @param {string} css - 要添加的CSS规则字符串。
     */
    function addGlobalStyle(css) {
        const head = document.head || document.getElementsByTagName('head')[0];
        if (!head) { return; }
        const style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    function getFileExtension(preElement) {
        const codeElement = preElement.querySelector('code');
        if (!codeElement) return 'txt';

        const className = codeElement.className || '';
        const match = className.match(/language-(\w+)/);
        if (match && match[1]) {
            const langMap = {
                python: 'py', javascript: 'js', typescript: 'ts', html: 'html',
                css: 'css', java: 'java', csharp: 'cs', cpp: 'cpp', c: 'c',
                bash: 'sh', shell: 'sh', json: 'json', markdown: 'md',
                go: 'go', rust: 'rs', sql: 'sql', yaml: 'yml', xml: 'xml',
            };
            return langMap[match[1].toLowerCase()] || match[1];
        }
        return 'txt';
    }

    function getModelName(preElement) {
        const messageContainer = preElement.closest('div.flex.gap-6');
        if (messageContainer) {
            const modelNameElement = messageContainer.querySelector('p.font-mono');
            if (modelNameElement) {
                return modelNameElement.textContent.trim().replace(/[^a-zA-Z0-9-.]/g, '_');
            }
        }
        return 'unknown-model';
    }

    function downloadCode(codeContent, filename) {
        const blob = new Blob([codeContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // --- 核心逻辑 ---

    function addDownloadButtons() {
        // 使用更精确的选择器，专门针对聊天内容区的代码块
        const codeBlocks = document.querySelectorAll('main ol div.prose pre:not([data-download-button-added])');

        if (codeBlocks.length > 0) {
            console.log(`[LMArena Downloader] Found ${codeBlocks.length} new code blocks to process.`);
        }

        codeBlocks.forEach(pre => {
            pre.setAttribute('data-download-button-added', 'true');

            // 按钮将被添加到<pre>标签内的相对定位的div中
            const relativeContainer = pre.querySelector('div.relative');
            if (!relativeContainer) {
                console.error('[LMArena Downloader] Could not find relative container for a code block.');
                return;
            }

            // 找到原生的复制按钮，我们的按钮会放在它旁边
            const nativeCopyButton = relativeContainer.querySelector('button[data-sentry-component="CopyButton"]');
            if (!nativeCopyButton) {
                console.warn('[LMArena Downloader] Could not find the native copy button. The download button will be appended at the end.');
            }

            const downloadButton = document.createElement('button');
            downloadButton.className = 'code-downloader-button';
            downloadButton.title = 'Download code';
            downloadButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V15"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
            `;

            downloadButton.addEventListener('click', (e) => {
                e.stopPropagation();
                const codeElement = pre.querySelector('code');
                const codeContent = codeElement ? (codeElement.textContent || '') : '';
                const extension = getFileExtension(pre);
                const modelName = getModelName(pre);
                const filename = `${modelName}-${Date.now()}.${extension}`;
                downloadCode(codeContent, filename);
            });

            // 如果找到了复制按钮，就把下载按钮插在它前面，否则就添加到容器末尾
            if (nativeCopyButton) {
                nativeCopyButton.parentElement.insertBefore(downloadButton, nativeCopyButton);
            } else {
                relativeContainer.appendChild(downloadButton);
            }
        });
    }

    // --- 启动与监听 ---

    // 1. 先注入样式
    addGlobalStyle(`
        .code-downloader-button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 6px;
            border-radius: 6px;
            cursor: pointer;
            color: var(--interactive-active);
            transition: background-color 0.2s, color 0.2s;
            border: none;
            background-color: transparent;
        }
        .code-downloader-button:hover {
            background-color: var(--surface-hover, #f0f0f0);
            color: var(--text-primary, #000);
        }
        .code-downloader-button svg {
            width: 18px;
            height: 18px;
        }
    `);


    // 2. 使用 MutationObserver 监听 DOM 变化
    const observer = new MutationObserver((mutations) => {
        if (mutations.some(m => m.addedNodes.length > 0)) {
            setTimeout(addDownloadButtons, 300);
        }
    });

    // 3. 等待核心聊天区域出现后，再开始执行和监听
    const startupInterval = setInterval(() => {
        const chatArea = document.querySelector('main ol');
        if (chatArea) {
            console.log('[LMArena Downloader] Chat area found. Initializing script.');
            clearInterval(startupInterval);

            addDownloadButtons(); // 立即执行一次

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }, 500);

})();