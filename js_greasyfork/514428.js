// ==UserScript==
// @name         Poe Chat Exporter
// @name:zh-CN   Poe 聊天记录导出工具
// @namespace    https://github.com/KoriIku/poe-exporter
// @version      0.3
// @description  Export chat conversations from poe.com to text format, supports Markdown and plain text. Export or Save Chats from poe.com AI.
// @description:zh-CN  导出 poe.com 的聊天记录为文本格式，支持 Markdown 和纯文本
// @author       KoriIku
// @homepage     https://github.com/KoriIku/poe-exporter
// @supportURL   https://github.com/KoriIku/poe-exporter/issues
// @match        https://poe.com/*
// @grant        none
// @require      https://unpkg.com/turndown/dist/turndown.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/514428/Poe%20Chat%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/514428/Poe%20Chat%20Exporter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建 TurndownService 实例
    const turndownService = new TurndownService({
        headingStyle: 'atx',
        bulletListMarker: '-',
        codeBlockStyle: 'fenced'
    });

    // 配置 turndown 规则
    turndownService.addRule('preserveCode', {
        filter: ['pre', 'code'],
        replacement: function(content, node) {
            if (node.nodeName === 'PRE') {
                let language = '';
                const codeBlock = node.querySelector('code');
                if (codeBlock && codeBlock.className) {
                    const match = codeBlock.className.match(/language-(\w+)/);
                    if (match) {
                        language = match[1];
                    }
                }
                return '\n```' + language + '\n' + content + '\n```\n';
            }
            return '`' + content + '`';
        }
    });

    // 语言配置
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
            toggleFormat: '切换格式', // 新增
            markdown: 'Markdown格式', // 新增
            plainText: '纯文本格式'  // 新增
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
            toggleFormat: 'Toggle Format', // 新增
            markdown: 'Markdown Format', // 新增
            plainText: 'Plain Text Format' // 新增
        }
    };

    // 获取语言设置
    const userLang = (navigator.language || navigator.userLanguage).startsWith('zh') ? 'zh' : 'en';
    const text = i18n[userLang];

    // 存储当前格式状态
    let isMarkdownFormat = true;

    // 创建按钮
    const btn = document.createElement('button');
    btn.textContent = text.extract;
    btn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 10000;
        padding: 10px;
        background: #4CAF50;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    `;

    // 创建悬浮窗
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

    // 创建标题栏
    const titleBar = document.createElement('div');
    titleBar.style.cssText = `
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
        align-items: center;
    `;

    // 创建格式指示器
    const formatIndicator = document.createElement('span');
    formatIndicator.style.cssText = `
        font-size: 12px;
        color: #888;
    `;
    formatIndicator.textContent = text.markdown;

    // 创建关闭按钮
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
    closeBtn.addEventListener('mouseover', function() {
        this.style.background = 'rgba(255,255,255,0.1)';
    });
    closeBtn.addEventListener('mouseout', function() {
        this.style.background = 'transparent';
    });

    // 创建内容容器
    const contentContainer = document.createElement('div');
    contentContainer.style.cssText = `
        display: flex;
        flex-direction: column;
        height: calc(80vh - 80px);
    `;

    // 创建内容区域
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

    // 创建按钮容器
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
        display: flex;
        gap: 10px;
        padding-top: 10px;
        border-top: 1px solid #444;
    `;

    // 创建复制按钮
    const copyBtn = document.createElement('button');
    copyBtn.textContent = text.copy;
    copyBtn.style.cssText = `
        padding: 8px 12px;
        background: #2196F3;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        flex: 1;
        transition: background 0.2s;
    `;

    // 创建下载按钮
    const downloadBtn = document.createElement('button');
    downloadBtn.textContent = text.download;
    downloadBtn.style.cssText = copyBtn.style.cssText;
    downloadBtn.style.background = '#FF9800';

    // 创建格式切换按钮
    const toggleFormatBtn = document.createElement('button');
    toggleFormatBtn.textContent = text.toggleFormat;
    toggleFormatBtn.style.cssText = copyBtn.style.cssText;
    toggleFormatBtn.style.background = '#9C27B0';

    // 添加按钮悬停效果
    [btn, copyBtn, downloadBtn, toggleFormatBtn].forEach(button => {
        button.addEventListener('mouseover', function() {
            this.style.filter = 'brightness(1.1)';
        });
        button.addEventListener('mouseout', function() {
            this.style.filter = 'brightness(1)';
        });
    });

    // 组装UI
    titleBar.appendChild(formatIndicator);
    titleBar.appendChild(closeBtn);
    buttonContainer.appendChild(copyBtn);
    buttonContainer.appendChild(downloadBtn);
    buttonContainer.appendChild(toggleFormatBtn);
    contentContainer.appendChild(contentArea);
    contentContainer.appendChild(buttonContainer);
    floatingWindow.appendChild(titleBar);
    floatingWindow.appendChild(contentContainer);
    document.body.appendChild(btn);
    document.body.appendChild(floatingWindow);

    // 提取内容函数
    function extractContent(useMarkdown = true) {
        let result = '';
        const markdownContainers = document.querySelectorAll('[class^="Markdown_markdownContainer"]');
        
        markdownContainers.forEach(container => {
            let parent = container;
            while (parent && !parent.className.includes('MessageBubble')) {
                parent = parent.parentElement;
            }
            
            if (parent) {
                let messageContent;
                if (useMarkdown) {
                    messageContent = turndownService.turndown(container.innerHTML);
                } else {
                    messageContent = container.textContent;
                }
                
                if (parent.className.includes('leftSide')) {
                    result += text.assistant + messageContent + '\n\n';
                } else if (parent.className.includes('rightSide')) {
                    result += text.user + messageContent + '\n\n';
                }
            }
        });

        return result;
    }

    // HTML解码函数
    function decodeHTML(html) {
        const txt = document.createElement('textarea');
        txt.innerHTML = html;
        return txt.value;
    }

    // 复制内容
    function copyContent() {
        navigator.clipboard.writeText(contentArea.textContent).then(() => {
            const originalText = copyBtn.textContent;
            copyBtn.textContent = text.copied;
            copyBtn.style.background = '#45a049';
            setTimeout(() => {
                copyBtn.textContent = originalText;
                copyBtn.style.background = '#2196F3';
            }, 1000);
        });
    }

    // 下载内容
    function downloadContent() {
        const blob = new Blob([contentArea.textContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'conversation.txt';
        a.click();
        URL.revokeObjectURL(url);
        
        const originalText = downloadBtn.textContent;
        downloadBtn.textContent = text.downloaded;
        setTimeout(() => {
            downloadBtn.textContent = originalText;
        }, 1000);
    }

    // 切换格式并刷新内容
    function toggleFormat() {
        isMarkdownFormat = !isMarkdownFormat;
        formatIndicator.textContent = isMarkdownFormat ? text.markdown : text.plainText;
        const content = extractContent(isMarkdownFormat);
        contentArea.textContent = content;
    }

    // 事件监听
    btn.addEventListener('click', () => {
        const content = extractContent(isMarkdownFormat);
        contentArea.textContent = content;
        floatingWindow.style.display = 'block';
    });

    copyBtn.addEventListener('click', copyContent);
    downloadBtn.addEventListener('click', downloadContent);
    toggleFormatBtn.addEventListener('click', toggleFormat);
    closeBtn.addEventListener('click', () => {
        floatingWindow.style.display = 'none';
    });

    // 添加拖拽功能
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    titleBar.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);

    function dragStart(e) {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;

        if (e.target === titleBar) {
            isDragging = true;
        }
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;

            xOffset = currentX;
            yOffset = currentY;

            setTranslate(currentX, currentY, floatingWindow);
        }
    }

    function dragEnd() {
        isDragging = false;
    }

    function setTranslate(xPos, yPos, el) {
        el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
    }
})();