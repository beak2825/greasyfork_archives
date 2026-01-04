// ==UserScript==
// @name         Poe Chat Exporter
// @name:zh-CN   Poe 聊天记录导出工具
// @namespace    
// @version      0.4.1
// @description  一键备份所有聊天记录为 Markdown 或纯文本格式，自动滚动加载所有消息。
// @author       KoriIku
// @match        https://poe.com/*
// @grant        none
// @require      https://unpkg.com/turndown/dist/turndown.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537853/Poe%20Chat%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/537853/Poe%20Chat%20Exporter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const turndownService = new TurndownService({
        headingStyle: 'atx',
        bulletListMarker: '-',
        codeBlockStyle: 'fenced'
    });

    turndownService.addRule('preserveCode', {
        filter: ['pre', 'code'],
        replacement: function (content, node) {
            if (node.nodeName === 'PRE') {
                let language = '';
                const codeBlock = node.querySelector('code');
                if (codeBlock && codeBlock.className) {
                    const match = codeBlock.className.match(/language-(\w+)/);
                    if (match) {
                        language = match[1];
                    }
                }
                return '\n```' + language + '\n' + (content || '') + '\n```\n';
            }
            return '`' + content + '`';
        }
    });

    const i18n = {
        zh: {
            extract: '提取内容',
            copy: '复制内容',
            download: '下载文本',
            copied: '已复制！',
            downloaded: '已下载！',
            assistant: 'Assistant:\n',
            user: 'User:\n',
            close: '关闭',
            toggleFormat: '切换格式',
            markdown: 'Markdown格式',
            plainText: '纯文本格式',
            autoBackup: '向上滚动'
        },
        en: {
            extract: 'Extract',
            copy: 'Copy',
            download: 'Download',
            copied: 'Copied!',
            downloaded: 'Downloaded!',
            assistant: 'Assistant:\n',
            user: 'User:\n',
            close: 'Close',
            toggleFormat: 'Toggle Format',
            markdown: 'Markdown Format',
            plainText: 'Plain Text Format',
            autoBackup: 'Scroll up'
        }
    };

    const userLang = (navigator.language || navigator.userLanguage).startsWith('zh') ? 'zh' : 'en';
    const text = i18n[userLang];
    let isMarkdownFormat = true;

    function getBotName() {
        const el = document.querySelector('[class*="BotHeader_textContainer"]');
        return el?.textContent.trim() || 'Assistant';
    }

    function createBtn(label, color) {
        const btn = document.createElement('button');
        btn.textContent = label;
        btn.style.cssText = `
            position: fixed;
            bottom: ${label === text.extract ? '20px' : '60px'};
            right: 20px;
            z-index: 10000;
            padding: 10px;
            background: ${color};
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        `;
        btn.addEventListener('mouseover', () => btn.style.filter = 'brightness(1.1)');
        btn.addEventListener('mouseout', () => btn.style.filter = 'brightness(1)');
        return btn;
    }

    const extractBtn = createBtn(text.extract, '#4CAF50');
    const autoBtn = createBtn(text.autoBackup, '#607D8B');

    const floatingWindow = document.createElement('div');
    floatingWindow.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        width: 300px;
        max-height: 80vh;
        background: #2d2d2d;
        color: #e0e0e0;
        padding: 15px;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0,0,0,0.3);
        z-index: 10000;
        display: none;
    `;

    const titleBar = document.createElement('div');
    titleBar.style.cssText = `display: flex; justify-content: space-between; margin-bottom: 10px; align-items: center;`;

    const formatIndicator = document.createElement('span');
    formatIndicator.style.cssText = `font-size: 12px; color: #888;`;
    formatIndicator.textContent = text.markdown;

    const closeBtn = document.createElement('button');
    closeBtn.textContent = text.close;
    closeBtn.style.cssText = `
        background: transparent;
        border: none;
        color: #e0e0e0;
        cursor: pointer;
        padding: 5px;
        font-size: 14px;
        border-radius: 4px;
    `;
    closeBtn.addEventListener('click', () => floatingWindow.style.display = 'none');

    const contentContainer = document.createElement('div');
    contentContainer.style.cssText = `display: flex; flex-direction: column; height: calc(80vh - 80px);`;

    const contentArea = document.createElement('div');
    contentArea.style.cssText = `
        white-space: pre-wrap;
        margin-bottom: 10px;
        padding: 10px;
        background: #363636;
        border-radius: 4px;
        font-family: monospace;
        line-height: 1.5;
        flex: 1;
        overflow-y: auto;
    `;

    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `display: flex; gap: 10px; padding-top: 10px; border-top: 1px solid #444;`;

    const copyBtn = document.createElement('button');
    copyBtn.textContent = text.copy;
    copyBtn.style.cssText = `padding: 8px 12px; background: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer; flex: 1;`;

    const downloadBtn = document.createElement('button');
    downloadBtn.textContent = text.download;
    downloadBtn.style.cssText = `padding: 8px 12px; background: #FF9800; color: white; border: none; border-radius: 4px; cursor: pointer; flex: 1;`;

    const toggleFormatBtn = document.createElement('button');
    toggleFormatBtn.textContent = text.toggleFormat;
    toggleFormatBtn.style.cssText = `padding: 8px 12px; background: #9C27B0; color: white; border: none; border-radius: 4px; cursor: pointer; flex: 1;`;

    titleBar.appendChild(formatIndicator);
    titleBar.appendChild(closeBtn);
    buttonContainer.appendChild(copyBtn);
    buttonContainer.appendChild(downloadBtn);
    buttonContainer.appendChild(toggleFormatBtn);
    contentContainer.appendChild(contentArea);
    contentContainer.appendChild(buttonContainer);
    floatingWindow.appendChild(titleBar);
    floatingWindow.appendChild(contentContainer);
    document.body.appendChild(extractBtn);
    document.body.appendChild(autoBtn);
    document.body.appendChild(floatingWindow);

    function extractContent(useMarkdown = true) {
        let result = '';
        const botName = getBotName();
        const botPrefix = botName + ':\n';
        const markdownContainers = document.querySelectorAll('[class^="Markdown_markdownContainer"]');

        markdownContainers.forEach(container => {
            let parent = container;
            while (parent && !parent.className.includes('MessageBubble')) {
                parent = parent.parentElement;
            }

            if (parent) {
                const isBot = parent.className.includes('leftSide');
                const isUser = parent.className.includes('rightSide');

                const containerClone = container.cloneNode(true);
                containerClone.querySelectorAll('[class*="MarkdownCodeBlock_codeHeader"]').forEach(el => el.remove());

                let messageContent = useMarkdown
                    ? turndownService.turndown(containerClone.innerHTML)
                    : containerClone.textContent;

                const attachmentContainer = parent.querySelector('[class*="Attachments_attachments"]');
                if (attachmentContainer) {
                    const images = attachmentContainer.querySelectorAll('img');
                    images.forEach(img => {
                        const alt = img.alt || 'image';
                        const url = img.getAttribute('src');
                        messageContent += useMarkdown
                            ? `\n\n![${alt}](${url})`
                            : `\n\n[图片: ${alt}] ${url}`;
                    });
                }

                const prefix = isBot ? botPrefix : isUser ? text.user : '';
                if (prefix) {
                    result += prefix + messageContent + '\n\n';
                }
            }
        });

        return result;
    }

    function copyContent() {
        navigator.clipboard.writeText(contentArea.textContent)
            .then(() => {
                const original = copyBtn.textContent;
                copyBtn.textContent = text.copied;
                setTimeout(() => copyBtn.textContent = original, 1000);
            })
            .catch(err => {
                alert('Clipboard copy failed: ' + err.message);
            });
    }

    function downloadContent() {
        const titleElement = document.querySelector('[class*="ChatHeader_textOverflow"]');
        let title = titleElement ? titleElement.textContent.trim() : 'conversation';
        title = title.replace(/[\\/:*?"<>|]/g, '_').replace(/\s+/g, '_');

        const blob = new Blob([contentArea.textContent], { type: 'text/plain' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `${title}.${isMarkdownFormat ? 'md' : 'txt'}`;
        a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 100);

        const original = downloadBtn.textContent;
        downloadBtn.textContent = text.downloaded;
        setTimeout(() => downloadBtn.textContent = original, 1000);
    }

    function toggleFormat() {
        isMarkdownFormat = !isMarkdownFormat;
        formatIndicator.textContent = isMarkdownFormat ? text.markdown : text.plainText;
        contentArea.textContent = extractContent(isMarkdownFormat);
    }

    function showExportWindow() {
        contentArea.textContent = extractContent(isMarkdownFormat);
        floatingWindow.style.display = 'block';
    }

    extractBtn.addEventListener('click', showExportWindow);
    copyBtn.addEventListener('click', copyContent);
    downloadBtn.addEventListener('click', downloadContent);
    toggleFormatBtn.addEventListener('click', toggleFormat);

    autoBtn.addEventListener('click', async () => {
        autoBtn.textContent = '加载中...';
        autoBtn.disabled = true;

        let lastCount = 0;
        let stableCount = 0;
        const maxStable = 5;
        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        while (stableCount < maxStable) {
            const bubbles = Array.from(document.querySelectorAll('[class*="MessageBubble"]'));
            if (bubbles.length === 0) break;

            const first = bubbles[0];
            first.scrollIntoView({ behavior: 'auto', block: 'start' });

            await delay(800);

            const newCount = document.querySelectorAll('[class*="MessageBubble"]').length;
            if (newCount === lastCount) {
                stableCount++;
            } else {
                stableCount = 0;
                lastCount = newCount;
            }
        }

        autoBtn.textContent = text.autoBackup;
        autoBtn.disabled = false;

        setTimeout(showExportWindow, 500);
    });
})();