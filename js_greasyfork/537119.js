// ==UserScript==
// @name         111666.best 图床链接批量复制
// @namespace    http://tampermonkey.net/
// @version      1.1
// @license      MIT
// @author       nodeseek.com @cloudseek with Claude Sonnet 4
// @description  [此脚本由AI生成] 在111666.best添加浮窗，批量复制图床链接
// @match        https://111666.best/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537119/111666best%20%E5%9B%BE%E5%BA%8A%E9%93%BE%E6%8E%A5%E6%89%B9%E9%87%8F%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/537119/111666best%20%E5%9B%BE%E5%BA%8A%E9%93%BE%E6%8E%A5%E6%89%B9%E9%87%8F%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==
(function() {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
        #image-links-float {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 380px;
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05);
            z-index: 10000;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            overflow: hidden;
        }
        #image-links-header {
            background: #ffffff;
            padding: 20px 24px 16px;
            border-bottom: 1px solid #f3f4f6;
            font-weight: 600;
            font-size: 18px;
            color: #111827;
            display: flex;
            justify-content: space-between;
            align-items: center;
            letter-spacing: -0.01em;
        }
        #image-links-minimize {
            cursor: pointer;
            font-size: 18px;
            color: #6b7280;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 6px;
            transition: all 0.15s ease;
        }
        #image-links-minimize:hover {
            background: #f3f4f6;
            color: #374151;
        }
        #image-links-content {
            padding: 16px 24px 24px;
            background: #ffffff;
        }
        #image-links-count {
            font-size: 13px;
            color: #6b7280;
            margin-bottom: 12px;
            font-weight: 500;
        }
        #image-links-textarea {
            width: 100%;
            height: 180px;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 12px;
            font-size: 12px;
            font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, monospace;
            resize: vertical;
            box-sizing: border-box;
            background: #f9fafb;
            color: #374151;
            line-height: 1.5;
            transition: all 0.15s ease;
        }
        #image-links-textarea:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
            background: #ffffff;
        }
        #image-links-buttons {
            margin-top: 16px;
            display: flex;
            gap: 8px;
        }
        .image-links-btn {
            padding: 10px 16px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 13px;
            font-weight: 500;
            transition: all 0.15s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
        }
        #copy-btn {
            background: #3b82f6;
            color: white;
            flex: 1;
        }
        #copy-btn:hover {
            background: #2563eb;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        }
        #refresh-btn {
            background: #10b981;
            color: white;
            flex: 1;
        }
        #refresh-btn:hover {
            background: #059669;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
        }
        #clear-btn {
            background: #f3f4f6;
            color: #6b7280;
            border: 1px solid #e5e7eb;
            padding: 10px 12px;
        }
        #clear-btn:hover {
            background: #ef4444;
            color: white;
            border-color: #ef4444;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
        }
        .image-links-minimized #image-links-content {
            display: none;
        }
        .image-links-minimized {
            width: 280px;
        }
        .btn-icon {
            width: 16px;
            height: 16px;
            fill: currentColor;
        }
    `;
    document.head.appendChild(style);

    const floatWindow = document.createElement('div');
    floatWindow.id = 'image-links-float';
    floatWindow.innerHTML = `
        <div id="image-links-header">
            <span>图床链接批量复制</span>
            <span id="image-links-minimize">−</span>
        </div>
        <div id="image-links-content">
            <div id="image-links-count">找到 0 个图片链接</div>
            <textarea id="image-links-textarea" placeholder="无图片..." readonly></textarea>
            <div id="image-links-buttons">
                <button id="copy-btn" class="image-links-btn">
                    <svg class="btn-icon" viewBox="0 0 16 16">
                        <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
                        <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
                    </svg>
                    复制全部
                </button>
                <button id="refresh-btn" class="image-links-btn">
                    <svg class="btn-icon" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                        <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
                    </svg>
                    刷新
                </button>
                <button id="clear-btn" class="image-links-btn">
                    <svg class="btn-icon" viewBox="0 0 16 16">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                        <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                    </svg>
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(floatWindow);

    const textarea = document.getElementById('image-links-textarea');
    const copyBtn = document.getElementById('copy-btn');
    const refreshBtn = document.getElementById('refresh-btn');
    const clearBtn = document.getElementById('clear-btn');
    const countDiv = document.getElementById('image-links-count');
    const minimizeBtn = document.getElementById('image-links-minimize');

    let isUpdating = false;
    let updateTimeout = null;

    function extractImageLinks() {
        if (isUpdating) return [];
        isUpdating = true;
        const links = new Set();
        try {
            const inputs = document.querySelectorAll('input[readonly], input[value*="![image]"]');
            for (const input of inputs) {
                const value = input.value;
                if (value && value.includes('![image](https://i.111666.best/')) {
                    links.add(value.trim());
                }
            }
            const containers = document.querySelectorAll('.result, .output, .content, [class*="result"], [id*="result"]');
            if (containers.length === 0) {
                searchTextInElement(document.body, links, 0, 3);
            } else {
                for (const container of containers) {
                    searchTextInElement(container, links, 0, 2);
                }
            }
        } catch (error) {
            console.warn('提取链接时出错:', error);
        } finally {
            isUpdating = false;
        }
        return Array.from(links);
    }

    function searchTextInElement(element, links, currentDepth, maxDepth) {
        if (currentDepth > maxDepth || !element) return;
        if (element.nodeType === Node.TEXT_NODE) {
            const text = element.textContent;
            if (text && text.includes('![image](https://i.111666.best/')) {
                extractLinksFromText(text, links);
            }
        } else if (element.nodeType === Node.ELEMENT_NODE) {
            if (element.tagName === 'SCRIPT' || element.tagName === 'STYLE') return;
            const children = element.children;
            const maxChildren = Math.min(children.length, 50);
            for (let i = 0; i < maxChildren; i++) {
                searchTextInElement(children[i], links, currentDepth + 1, maxDepth);
            }
        }
    }

    function extractLinksFromText(text, links) {
        const parts = text.split('![image](https://i.111666.best/');
        for (let i = 1; i < parts.length; i++) {
            const endIndex = parts[i].indexOf(')');
            if (endIndex !== -1) {
                const imageLink = '![image](https://i.111666.best/' + parts[i].substring(0, endIndex + 1);
                links.add(imageLink);
            }
        }
    }

    function debouncedUpdate() {
        if (updateTimeout) {
            clearTimeout(updateTimeout);
        }
        updateTimeout = setTimeout(updateLinks, 300);
    }

    function updateLinks() {
        if (isUpdating) return;
        const links = extractImageLinks();
        const reversedLinks = links.reverse();
        textarea.value = reversedLinks.join('\n');
        countDiv.textContent = `找到 ${links.length} 个图片链接`;
        if (links.length > 0) {
            textarea.scrollTop = 0;
        }
    }

    async function copyToClipboard() {
        if (!textarea.value.trim()) {
            alert('没有可复制的内容');
            return;
        }
        try {
            await navigator.clipboard.writeText(textarea.value);
            const originalText = copyBtn.textContent;
            copyBtn.textContent = '已复制!';
            copyBtn.style.background = '#28a745';
            setTimeout(() => {
                copyBtn.textContent = originalText;
                copyBtn.style.background = '#007bff';
            }, 1500);
        } catch (err) {
            textarea.select();
            document.execCommand('copy');
            alert('链接已复制到剪贴板');
        }
    }

    function clearContent() {
        textarea.value = '';
        countDiv.textContent = '找到 0 个图片链接';
    }

    function toggleMinimize() {
        const isMinimized = floatWindow.classList.contains('image-links-minimized');
        if (isMinimized) {
            floatWindow.classList.remove('image-links-minimized');
            minimizeBtn.textContent = '−';
        } else {
            floatWindow.classList.add('image-links-minimized');
            minimizeBtn.textContent = '+';
        }
    }

    copyBtn.addEventListener('click', copyToClipboard);
    refreshBtn.addEventListener('click', updateLinks);
    clearBtn.addEventListener('click', clearContent);
    minimizeBtn.addEventListener('click', toggleMinimize);

    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };
    const header = document.getElementById('image-links-header');
    header.style.cursor = 'move';
    header.addEventListener('mousedown', (e) => {
        isDragging = true;
        dragOffset.x = e.clientX - floatWindow.offsetLeft;
        dragOffset.y = e.clientY - floatWindow.offsetTop;
        e.preventDefault();
    });
    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            floatWindow.style.left = (e.clientX - dragOffset.x) + 'px';
            floatWindow.style.top = (e.clientY - dragOffset.y) + 'px';
            floatWindow.style.right = 'auto';
            floatWindow.style.bottom = 'auto';
        }
    });
    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    let observer = null;
    let isObserving = false;
    function startObserving() {
        if (isObserving || observer) return;
        observer = new MutationObserver((mutations) => {
            let shouldUpdate = false;
            for (const mutation of mutations) {
                if (mutation.type === 'attributes' &&
                    mutation.attributeName === 'value' &&
                    mutation.target.tagName === 'INPUT') {
                    shouldUpdate = true;
                    break;
                }
                if (mutation.type === 'childList' &&
                    mutation.addedNodes.length > 0) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE &&
                            (node.tagName === 'INPUT' || node.querySelector('input'))) {
                            shouldUpdate = true;
                            break;
                        }
                    }
                    if (shouldUpdate) break;
                }
            }
            if (shouldUpdate) {
                debouncedUpdate();
            }
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['value']
        });
        isObserving = true;
    }
    function stopObserving() {
        if (observer) {
            observer.disconnect();
            observer = null;
        }
        isObserving = false;
    }

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopObserving();
        } else {
            startObserving();
            debouncedUpdate();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'C') {
            e.preventDefault();
            copyToClipboard();
        }
    });

    setTimeout(() => {
        if (!document.hidden) {
            startObserving();
            updateLinks();
        }
    }, 2000);
})();