// ==UserScript==
// @name         Claude聊天对话导出md格式
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  在claude对话页面添加一个下载按钮，点击即可将对话记录下载到本地
// @author       angury
// @match        *://claude.ai/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/522677/Claude%E8%81%8A%E5%A4%A9%E5%AF%B9%E8%AF%9D%E5%AF%BC%E5%87%BAmd%E6%A0%BC%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/522677/Claude%E8%81%8A%E5%A4%A9%E5%AF%B9%E8%AF%9D%E5%AF%BC%E5%87%BAmd%E6%A0%BC%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        .export-btn {
            height: 36px;
            width: 36px;
            background: none;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 0.375rem;
            transition-property: color, background-color, transform;
            color: var(--text-200, #666);
        }
        .export-btn:hover {
            background-color: var(--bg-500, #f3f4f6);
            opacity: 0.4;
            color: var(--text-100, #333);
        }
        .export-btn:active {
            transform: scale(0.95);
            background-color: var(--bg-400, #e5e7eb);
        }
        .export-btn svg {
            width: 20px;
            height: 20px;
        }
    `);

    let currentObserver = null;
    let currentPath = window.location.pathname;

    // 从URL获取聊天ID
    function getChatId() {
        const match = window.location.pathname.match(/\/chat\/([^/]+)/);
        return match ? match[1] : 'unknown';
    }

    // 生成时间戳
    function generateTimestamp() {
        const now = new Date();
        return now.getFullYear() +
               String(now.getMonth() + 1).padStart(2, '0') +
               String(now.getDate()).padStart(2, '0') +
               String(now.getHours()).padStart(2, '0') +
               String(now.getMinutes()).padStart(2, '0') +
               String(now.getSeconds()).padStart(2, '0');
    }

    // 创建导出按钮
    function createExportButton() {
        // 检查是否已存在按钮
        const existingButton = document.querySelector('.export-btn');
        if (existingButton) {
            return null;
        }

        const button = document.createElement('button');
        button.className = 'export-btn inline-flex items-center justify-center relative shrink-0';
        button.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="-translate-y-[0.5px]">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
        `;
        button.addEventListener('click', exportChat);
        return button;
    }

    // 尝试插入按钮
    function tryInsertButton() {
        const starButton = document.querySelector('[data-testid="conversation-star-button"]');
        if (starButton && starButton.parentElement) {
            const button = createExportButton();
            if (button) {
                starButton.parentElement.insertBefore(button, starButton);
                return true;
            }
        }
        return false;
    }

    // 清理旧的观察器
    function cleanupObserver() {
        if (currentObserver) {
            currentObserver.disconnect();
            currentObserver = null;
        }
    }

    // 使用MutationObserver监听DOM变化
    function setupObserver() {
        cleanupObserver();

        const observer = new MutationObserver((mutations, obs) => {
            if (tryInsertButton()) {
                // 保持观察器运行，因为在SPA中DOM可能会再次变化
                return;
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        currentObserver = observer;

        // 同时也立即尝试一次
        tryInsertButton();
    }

    // 获取聊天内容
    function getChatContent() {
        const messages = [];
        const chatElements = document.querySelectorAll('[data-testid="user-message"], .font-claude-message');

        chatElements.forEach((element) => {
            const isUser = element.hasAttribute('data-testid') && element.getAttribute('data-testid') === 'user-message';
            const role = isUser ? 'User' : 'Assistant';
            const content = element.textContent.trim();

            if (content) {
                messages.push({
                    role: role,
                    content: content,
                    timestamp: new Date().toISOString()
                });
            }
        });

        return messages;
    }

    // 格式化聊天内容
    function formatChatContent(messages) {
        const now = new Date();
        const timeStr = now.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        }).replace(/\//g, '-');

        let formatted = `Time: ${timeStr}\n`;
        formatted += `URL: ${window.location.href}\n\n\n`;

        messages.forEach((msg) => {
            formatted += `# ${msg.role === 'User' ? 'Ur' : 'AI'} (${msg.timestamp})\n\n\n`;
            formatted += `${msg.content}\n\n\n`;
        });

        return formatted;
    }

    // 下载文件
    function downloadFile(content, filename) {
        const blob = new Blob([content], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // 导出聊天记录主函数
    function exportChat() {
        try {
            const messages = getChatContent();
            const formatted = formatChatContent(messages);
            const chatId = getChatId();
            const timestamp = generateTimestamp();
            const filename = `${timestamp}_${chatId}.md`;
            downloadFile(formatted, filename);
        } catch (error) {
            console.error('导出失败:', error);
            alert('导出失败，请检查控制台获取详细信息');
        }
    }

    // 监听 URL 变化
    function setupURLChangeListener() {
        // 使用 MutationObserver 监听 URL 变化
        const urlObserver = new MutationObserver(() => {
            const newPath = window.location.pathname;
            if (newPath !== currentPath) {
                currentPath = newPath;
                setupObserver();
            }
        });

        // 监听 body 的子元素变化
        urlObserver.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 监听 popstate 事件（处理浏览器前进/后退）
        window.addEventListener('popstate', () => {
            const newPath = window.location.pathname;
            if (newPath !== currentPath) {
                currentPath = newPath;
                setupObserver();
            }
        });
    }

    // 初始化
    function initialize() {
        setupObserver();
        setupURLChangeListener();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();