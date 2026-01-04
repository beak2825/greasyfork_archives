// ==UserScript==
// @name         Genspark 快捷导航+对话导出
// @namespace    http://tampermonkey.net/
// @version      3.1.4
// @description  为 genspark.ai 对话页面添加快捷导航、编辑按钮、代码折叠和箭头导航功能。已修改编辑按钮逻辑为点击第二个图标。
// @author       schweigen (Modified)
// @license      MIT
// @match        https://www.genspark.ai/agents*
// @match        https://genspark.ai/agents*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/538068/Genspark%20%E5%BF%AB%E6%8D%B7%E5%AF%BC%E8%88%AA%2B%E5%AF%B9%E8%AF%9D%E5%AF%BC%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/538068/Genspark%20%E5%BF%AB%E6%8D%B7%E5%AF%BC%E8%88%AA%2B%E5%AF%B9%E8%AF%9D%E5%AF%BC%E5%87%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置选项
    const CONFIG = {
        maxTitleLength: 50,
        refreshInterval: 2000,
        animationDuration: 300,
        codeCollapseLine: 5  // 超过此行数的代码块将被折叠
    };

    // 等待页面完全加载
    function waitForElement(selector, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();

            function check() {
                const element = document.querySelector(selector);
                if (element) {
                    resolve(element);
                    return;
                }

                if (Date.now() - startTime > timeout) {
                    reject(new Error(`Element ${selector} not found within ${timeout}ms`));
                    return;
                }

                setTimeout(check, 100);
            }

            check();
        });
    }

    // 创建导航面板
    function createNavigationPanel() {
        const nav = document.createElement('div');
        nav.id = 'genspark-quicknav';
        nav.innerHTML = `
            <div class="quicknav-header">
                <span class="quicknav-title">快捷导航</span>
                <div class="quicknav-controls">
                    <div class="export-dropdown">
                        <button class="quicknav-export" title="导出对话">导出</button>
                        <div class="export-menu">
                            <button class="export-option" data-format="markdown">📝 Markdown</button>
                            <button class="export-option" data-format="html">🌐 HTML</button>
                        </div>
                    </div>
                    <button class="quicknav-refresh" title="刷新导航">⟳</button>
                    <button class="quicknav-toggle" title="折叠/展开">−</button>
                </div>
            </div>
            <div class="quicknav-content">
                <div class="quicknav-list"></div>
            </div>
        `;

        // 创建收起状态的小方块
        const miniNav = document.createElement('div');
        miniNav.id = 'genspark-quicknav-mini';
        miniNav.innerHTML = `
            <div class="quicknav-mini-content">导航</div>
        `;
        miniNav.style.display = 'none';

        // 创建上下导航按钮
        const prevBtn = document.createElement('div');
        prevBtn.id = 'genspark-quicknav-prev';
        prevBtn.innerHTML = `
            <div class="quicknav-arrow-content">↑</div>
        `;

        const nextBtn = document.createElement('div');
        nextBtn.id = 'genspark-quicknav-next';
        nextBtn.innerHTML = `
            <div class="quicknav-arrow-content">↓</div>
        `;

        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            #genspark-quicknav {
                position: fixed;
                top: 45%;
                left: 80px;
                transform: translateY(-50%);
                width: 320px;
                max-height: 70vh;
                background: #ffffff;
                border: 1px solid #d1d5db;
                border-radius: 12px;
                box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                z-index: 10000;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
                font-size: 14px;
                overflow: hidden;
                transition: all ${CONFIG.animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1);
                backdrop-filter: blur(8px);
                border: 1px solid rgba(255, 255, 255, 0.2);
            }

            #genspark-quicknav.collapsed {
                display: none;
            }

            #genspark-quicknav.hidden {
                display: none;
            }

            #genspark-quicknav-mini {
                position: fixed;
                top: 45%;
                left: 80px;
                transform: translateY(-50%);
                width: 48px;
                height: 48px;
                background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
                border: none;
                border-radius: 50%;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1);
                z-index: 10000;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
                cursor: pointer;
                transition: all ${CONFIG.animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1);
                display: flex;
                align-items: center;
                justify-content: center;
            }

            #genspark-quicknav-mini:hover {
                transform: translateY(-50%) scale(1.1);
                box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2), 0 3px 6px rgba(0, 0, 0, 0.15);
            }

            #genspark-quicknav-mini.hidden {
                display: none;
            }

            #genspark-quicknav-prev,
            #genspark-quicknav-next {
                position: fixed;
                left: 80px;
                width: 32px;
                height: 32px;
                background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
                border: none;
                border-radius: 50%;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
                z-index: 10000;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
                cursor: pointer;
                transition: all ${CONFIG.animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1);
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0.8;
            }

            #genspark-quicknav-prev {
                top: calc(45% - 60px);
                transform: translateY(-50%);
            }

            #genspark-quicknav-next {
                top: calc(45% + 60px);
                transform: translateY(-50%);
            }

            #genspark-quicknav-prev:hover,
            #genspark-quicknav-next:hover {
                transform: translateY(-50%) scale(1.1);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1);
                opacity: 1;
            }

            #genspark-quicknav-prev.hidden,
            #genspark-quicknav-next.hidden {
                display: none;
            }

            .quicknav-arrow-content {
                color: #ffffff;
                font-size: 14px;
                font-weight: 600;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: 100%;
                user-select: none;
            }

            .quicknav-mini-content {
                color: #ffffff;
                font-size: 12px;
                font-weight: 600;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: 100%;
            }

            .quicknav-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 16px 20px;
                background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
                border-bottom: 1px solid #e5e7eb;
                border-radius: 12px 12px 0 0;
            }

            .quicknav-title {
                font-weight: 600;
                font-size: 16px;
                color: #1f2937;
                margin: 0;
            }

            .quicknav-controls {
                display: flex;
                gap: 8px;
                align-items: center;
            }

            .quicknav-controls button {
                background: rgba(255, 255, 255, 0.8);
                border: 1px solid rgba(0, 0, 0, 0.1);
                padding: 6px 8px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 12px;
                color: #4b5563;
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                display: flex;
                align-items: center;
                justify-content: center;
                min-width: 28px;
                height: 28px;
            }

            .quicknav-controls button:hover {
                background: #ffffff;
                color: #1f2937;
                transform: translateY(-1px);
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }

            .quicknav-export {
                background: linear-gradient(135deg, #10b981 0%, #34d399 100%) !important;
                color: white !important;
                border: none !important;
                padding: 6px 12px !important;
                min-width: auto !important;
                font-size: 12px !important;
                font-weight: 500 !important;
            }

            .quicknav-export:hover {
                background: linear-gradient(135deg, #059669 0%, #10b981 100%) !important;
                color: white !important;
                transform: translateY(-1px) scale(1.05);
            }

            .export-dropdown {
                position: relative;
                display: inline-block;
            }

            .export-menu {
                position: absolute;
                top: 100%;
                right: 0;
                background: white;
                border: 1px solid #d1d5db;
                border-radius: 6px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                padding: 4px 0;
                min-width: 120px;
                z-index: 1000;
                display: none;
            }

            .export-menu.show {
                display: block;
            }

            .export-option {
                width: 100%;
                border: none;
                background: transparent;
                padding: 8px 12px;
                text-align: left;
                cursor: pointer;
                font-size: 12px;
                color: #374151;
                transition: background-color 0.2s;
                display: flex;
                align-items: center;
                gap: 6px;
            }

            .export-option:hover {
                background: #f3f4f6;
            }

            .quicknav-content {
                max-height: calc(70vh - 80px);
                overflow-y: auto;
                background: #ffffff;
                border-radius: 0 0 12px 12px;
            }

            .quicknav-list {
                padding: 8px 0;
            }

            .quicknav-item {
                display: flex;
                align-items: center;
                padding: 12px 20px;
                cursor: pointer;
                border-left: 4px solid transparent;
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                line-height: 1.4;
                margin: 0 8px;
                border-radius: 8px;
                position: relative;
            }

            .quicknav-item:hover {
                background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
                transform: translateX(4px);
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }

            .quicknav-item.user {
                border-left-color: #10b981;
            }

            .quicknav-item.user:hover {
                background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
                border-left-color: #059669;
            }

            .quicknav-item.assistant {
                border-left-color: #3b82f6;
            }

            .quicknav-item.assistant:hover {
                background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
                border-left-color: #2563eb;
            }

            .quicknav-item-icon {
                width: 16px;
                height: 16px;
                margin-right: 12px;
                border-radius: 50%;
                flex-shrink: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 10px;
                font-weight: 600;
                color: #ffffff;
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            }

            .quicknav-item.user .quicknav-item-icon {
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            }

            .quicknav-item.assistant .quicknav-item-icon {
                background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            }

            .quicknav-item-text {
                flex: 1;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                color: #374151;
                font-size: 14px;
                font-weight: 500;
                line-height: 1.5;
            }

            .quicknav-item-index {
                font-size: 12px;
                color: #6b7280;
                margin-left: 8px;
                flex-shrink: 0;
                padding: 2px 6px;
                background: rgba(0, 0, 0, 0.05);
                border-radius: 4px;
                font-weight: 500;
            }

            .quicknav-empty {
                padding: 40px 20px;
                text-align: center;
                color: #9ca3af;
                font-size: 14px;
                font-style: italic;
            }

            /* 滚动条样式 */
            .quicknav-content::-webkit-scrollbar {
                width: 6px;
            }

            .quicknav-content::-webkit-scrollbar-track {
                background: #f8f9fa;
                border-radius: 3px;
            }

            .quicknav-content::-webkit-scrollbar-thumb {
                background: linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%);
                border-radius: 3px;
                transition: background 0.2s;
            }

            .quicknav-content::-webkit-scrollbar-thumb:hover {
                background: linear-gradient(135deg, #9ca3af 0%, #6b7280 100%);
            }

            /* 编辑按钮样式 */
            .genspark-edit-button {
                position: absolute;
                right: -80px;
                top: 50%;
                transform: translateY(-50%);
                background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                color: white;
                border: none;
                border-radius: 6px;
                padding: 8px 16px;
                font-size: 13px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                z-index: 100;
                display: flex;
                align-items: center;
                gap: 6px;
            }

            .genspark-edit-button:hover {
                transform: translateY(-50%) scale(1.05);
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
                background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
            }

            .genspark-edit-button:active {
                transform: translateY(-50%) scale(0.98);
            }

            .conversation-statement.user {
                position: relative;
            }

            .genspark-edit-button svg {
                width: 16px;
                height: 16px;
            }

            /* 代码折叠样式 */
            .code-collapse-wrapper {
                position: relative;
            }

            .code-collapse-toggle {
                position: absolute;
                right: 60px;
                top: 8px;
                background: rgba(255, 255, 255, 0.9);
                border: 1px solid #d1d5db;
                border-radius: 4px;
                padding: 4px 8px;
                cursor: pointer;
                font-size: 12px;
                color: #374151;
                z-index: 1000;
                transition: all 0.2s ease;
                user-select: none;
            }

            .code-collapse-toggle:hover {
                background: #f3f4f6;
                border-color: #9ca3af;
            }

            .code-collapsed {
                max-height: ${CONFIG.codeCollapseLine * 1.5}em;
                overflow: hidden;
                position: relative;
                cursor: pointer;
            }

            .code-collapsed::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                height: 3em;
                background: linear-gradient(transparent, rgba(255, 255, 255, 0.9));
                pointer-events: none;
            }

            .code-collapsed:hover::after {
                background: linear-gradient(transparent, rgba(240, 248, 255, 0.95));
            }

            .code-expanded {
                max-height: none;
                overflow: visible;
                cursor: pointer;
            }

            .code-expanded::after {
                display: none;
            }

            /* 新建对话按钮样式增强 */
            div[data-v-a21da7e8].icon {
                width: 48px !important;
                height: 48px !important;
                padding: 12px !important;
                transition: all 0.2s ease !important;
                cursor: pointer !important;
                border-radius: 8px !important;
            }

            div[data-v-a21da7e8].icon:hover {
                transform: scale(1.1) !important;
                background-color: rgba(0, 0, 0, 0.05) !important;
                border-radius: 8px !important;
            }

            div[data-v-a21da7e8].icon svg {
                width: 24px !important;
                height: 24px !important;
            }

            /* 屏蔽 Try Mixture-of-Agents 提示框 */
            .bubble.try_moa {
                display: none !important;
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(nav);
        document.body.appendChild(miniNav);
        document.body.appendChild(prevBtn);
        document.body.appendChild(nextBtn);

        return { nav, miniNav, prevBtn, nextBtn };
    }

    // 提取对话内容
    function extractConversationData() {
        const messages = document.querySelectorAll('.conversation-statement');
        const conversationData = [];

        messages.forEach((message, index) => {
            const isUser = message.classList.contains('user');
            const isAssistant = message.classList.contains('assistant');

            if (!isUser && !isAssistant) return;

            let text = '';
            if (isUser) {
                // 用户消息从 code 标签中提取
                const codeElement = message.querySelector('.content code');
                text = codeElement ? codeElement.textContent.trim() : '';
            } else if (isAssistant) {
                // AI消息从 markdown-viewer 中提取
                const markdownElement = message.querySelector('.markdown-viewer');
                if (markdownElement) {
                    // 获取原始HTML内容用于HTML导出
                    const htmlContent = markdownElement.innerHTML;
                    // 获取纯文本用于Markdown导出
                    const textContent = markdownElement.textContent.trim();
                    text = { htmlContent, textContent };
                } else {
                    text = '';
                }
            }

            if (text) {
                conversationData.push({
                    index: index,
                    type: isUser ? 'user' : 'assistant',
                    content: text,
                    timestamp: new Date().toISOString()
                });
            }
        });

        return conversationData;
    }

    // 格式化为Markdown
    function formatToMarkdown(conversationData) {
        const title = document.title || 'Genspark对话记录';
        const timestamp = new Date().toLocaleString('zh-CN');

        let markdown = `# ${title}\n\n`;
        markdown += `**导出时间**: ${timestamp}\n\n`;
        markdown += `---\n\n`;

        conversationData.forEach((message, index) => {
            if (message.type === 'user') {
                markdown += `## 👤 用户 (${index + 1})\n\n`;
                markdown += `${message.content}\n\n`;
            } else if (message.type === 'assistant') {
                markdown += `## 🤖 AI助手 (${index + 1})\n\n`;
                // 对于AI消息，使用文本内容
                const content = typeof message.content === 'object' ? message.content.textContent : message.content;
                markdown += `${content}\n\n`;
            }
            markdown += `---\n\n`;
        });

        return markdown;
    }

    // 格式化为HTML
    function formatToHTML(conversationData) {
        const title = document.title || 'Genspark对话记录';
        const timestamp = new Date().toLocaleString('zh-CN');

        let html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; border-bottom: 2px solid #e5e7eb; padding-bottom: 20px; margin-bottom: 30px; }
        .message { margin-bottom: 30px; border-radius: 8px; overflow: hidden; }
        .user { background: #f0f9ff; border-left: 4px solid #10b981; }
        .assistant { background: #f8fafc; border-left: 4px solid #3b82f6; }
        .message-header { padding: 12px 16px; font-weight: 600; background: rgba(0,0,0,0.05); }
        .message-content { padding: 16px; }
        .user .message-header { color: #059669; }
        .assistant .message-header { color: #2563eb; }
        pre { background: #1f2937; color: #f9fafb; padding: 16px; border-radius: 6px; overflow-x: auto; position: relative; }
        code { font-family: 'Monaco', 'Menlo', monospace; }
        .code-copy-btn { position: absolute; top: 8px; right: 8px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #f9fafb; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 12px; transition: all 0.2s; }
        .code-copy-btn:hover { background: rgba(255,255,255,0.2); }
        .code-copy-btn.copied { background: #10b981; border-color: #10b981; }
    </style>
</head>
<body>
    <div class="header">
        <h1>${title}</h1>
        <p>导出时间: ${timestamp}</p>
    </div>
    <div class="content">`;

        conversationData.forEach((message, index) => {
            if (message.type === 'user') {
                html += `
        <div class="message user">
            <div class="message-header">👤 用户 (${index + 1})</div>
            <div class="message-content">
                <pre><code>${escapeHtml(message.content)}</code></pre>
            </div>
        </div>`;
            } else if (message.type === 'assistant') {
                html += `
        <div class="message assistant">
            <div class="message-header">🤖 AI助手 (${index + 1})</div>
            <div class="message-content">`;

                // 对于AI消息，先清理原有的复制按钮，然后使用HTML内容
                let content = typeof message.content === 'object' ? message.content.htmlContent : escapeHtml(message.content);
                // 移除原页面的复制按钮
                content = content.replace(/<button[^>]*class="[^"]*hljs-copy-button[^"]*"[^>]*>.*?<\/button>/gi, '');
                html += content;

                html += `
            </div>
        </div>`;
            }
        });

        html += `
    </div>
    <script>
        function copyCode(button) {
            const pre = button.parentElement;
            const code = pre.querySelector('code');
            const text = code ? code.textContent : pre.textContent;

            navigator.clipboard.writeText(text).then(() => {
                button.textContent = '已复制';
                button.classList.add('copied');
                setTimeout(() => {
                    button.textContent = '复制';
                    button.classList.remove('copied');
                }, 2000);
            }).catch(() => {
                // 备用方案：创建临时textarea
                const textarea = document.createElement('textarea');
                textarea.value = text;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);

                button.textContent = '已复制';
                button.classList.add('copied');
                setTimeout(() => {
                    button.textContent = '复制';
                    button.classList.remove('copied');
                }, 2000);
            });
        }

        // 为所有代码块添加复制按钮
        document.addEventListener('DOMContentLoaded', function() {
            const preElements = document.querySelectorAll('pre');
            preElements.forEach(pre => {
                const copyBtn = document.createElement('button');
                copyBtn.className = 'code-copy-btn';
                copyBtn.textContent = '复制';
                copyBtn.onclick = () => copyCode(copyBtn);
                pre.appendChild(copyBtn);
            });
        });
    </script>
</body>
</html>`;

        return html;
    }

    // HTML转义函数
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // 下载文件
    function downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // 显示导出选择对话框
    function showExportDialog() {
        const conversationData = extractConversationData();

        if (conversationData.length === 0) {
            alert('没有找到对话内容可以导出');
            return;
        }

        // 切换下拉菜单显示状态
        const exportMenu = document.querySelector('.export-menu');
        exportMenu.classList.toggle('show');
    }

    // 执行导出
    function performExport(format) {
        const conversationData = extractConversationData();

        if (conversationData.length === 0) {
            alert('没有找到对话内容可以导出');
            return;
        }

        const title = document.title || 'genspark-conversation';
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');

        if (format === 'markdown') {
            const markdown = formatToMarkdown(conversationData);
            const filename = `${title}_${timestamp}.md`;
            downloadFile(markdown, filename, 'text/markdown');
        } else if (format === 'html') {
            const html = formatToHTML(conversationData);
            const filename = `${title}_${timestamp}.html`;
            downloadFile(html, filename, 'text/html');
        }

        // 隐藏菜单
        document.querySelector('.export-menu').classList.remove('show');
    }

    // 提取消息文本
    function extractMessageText(element) {
        const contentElement = element.querySelector('.content');
        if (!contentElement) return '';

        // 尝试从code标签中提取（用户消息）
        const codeElement = contentElement.querySelector('code');
        if (codeElement) {
            return codeElement.textContent.trim();
        }

        // 尝试从markdown-viewer中提取（AI消息）
        const markdownElement = contentElement.querySelector('.markdown-viewer');
        if (markdownElement) {
            return markdownElement.textContent.trim();
        }

        // 备用方案
        return contentElement.textContent.trim();
    }

    // 添加编辑按钮到用户消息
    function addEditButtons() {
        const userMessages = document.querySelectorAll('.conversation-statement.user:not(.has-edit-button)');

        userMessages.forEach(message => {
            // 标记已处理
            message.classList.add('has-edit-button');

            // 创建编辑按钮
            const editButton = document.createElement('button');
            editButton.className = 'genspark-edit-button';
            editButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                </svg>
                编辑
            `;

            // 直接添加到消息容器上
            message.style.position = 'relative';
            message.appendChild(editButton);

            // 点击编辑按钮的处理
            editButton.addEventListener('click', () => {
                // >>>>>>>>>> 修改开始 <<<<<<<<<<
                // 查找当前消息框内所有的操作图标
                const actionIcons = message.querySelectorAll('.message-action-icon');

                // 如果至少有2个图标，则点击第2个（索引为1）
                if (actionIcons.length >= 2) {
                    actionIcons[1].click();
                }
                // 兜底：如果只有一个图标，还是点击第1个，避免按钮完全失效
                else if (actionIcons.length === 1) {
                    console.warn('Genspark Script: 未找到第二个图标，回退点击第一个');
                    actionIcons[0].click();
                } else {
                    // 如果没有找到图标，尝试让内容可编辑（原有的备用方案）
                    const bubble = message.querySelector('.bubble');
                    if (bubble) {
                        bubble.setAttribute('contenteditable', 'true');
                        bubble.focus();
                    }
                }
                // >>>>>>>>>> 修改结束 <<<<<<<<<<
            });
        });
    }

    // 消息导航功能
    function getCurrentMessageIndex() {
        const messages = document.querySelectorAll('.conversation-statement');
        const viewportHeight = window.innerHeight;
        const viewportCenter = window.scrollY + viewportHeight / 2;

        let closestIndex = 0;
        let closestDistance = Infinity;

        messages.forEach((message, index) => {
            const messageRect = message.getBoundingClientRect();
            const messageCenter = window.scrollY + messageRect.top + messageRect.height / 2;
            const distance = Math.abs(messageCenter - viewportCenter);

            if (distance < closestDistance) {
                closestDistance = distance;
                closestIndex = index;
            }
        });

        return closestIndex;
    }

    function navigateToMessage(direction) {
        const messages = document.querySelectorAll('.conversation-statement');
        if (messages.length === 0) return;

        const currentIndex = getCurrentMessageIndex();
        let targetIndex;

        if (direction === 'prev') {
            targetIndex = Math.max(0, currentIndex - 1);
        } else {
            targetIndex = Math.min(messages.length - 1, currentIndex + 1);
        }

        const targetMessage = messages[targetIndex];
        if (targetMessage) {
            targetMessage.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });

            // 高亮显示目标消息
            targetMessage.style.transition = 'background-color 0.5s ease';
            targetMessage.style.backgroundColor = '#fff3cd';
            setTimeout(() => {
                targetMessage.style.backgroundColor = '';
            }, 2000);
        }
    }

    // 扫描并更新导航列表
    function updateNavigationList() {
        const navList = document.querySelector('.quicknav-list');
        if (!navList) return;

        const messages = document.querySelectorAll('.conversation-statement');

        if (messages.length === 0) {
            navList.innerHTML = '<div class="quicknav-empty">暂无对话消息</div>';
            return;
        }

        navList.innerHTML = '';
        let userIndex = 1;
        let assistantIndex = 1;

        messages.forEach((message, index) => {
            const isUser = message.classList.contains('user');
            const isAssistant = message.classList.contains('assistant');

            if (!isUser && !isAssistant) return;

            const text = extractMessageText(message);
            if (!text) return;

            const item = document.createElement('div');
            item.className = `quicknav-item ${isUser ? 'user' : 'assistant'}`;

            const truncatedText = text.length > CONFIG.maxTitleLength
                ? text.substring(0, CONFIG.maxTitleLength) + '...'
                : text;

            const displayIndex = isUser ? userIndex++ : assistantIndex++;
            const prefix = isUser ? '问' : '答';

            item.innerHTML = `
                <div class="quicknav-item-icon">${isUser ? 'U' : 'A'}</div>
                <div class="quicknav-item-text">${truncatedText}</div>
                <div class="quicknav-item-index">${prefix}${displayIndex}</div>
            `;

            // 添加点击事件
            item.addEventListener('click', () => {
                message.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });

                // 高亮显示目标消息
                message.style.transition = 'background-color 0.5s ease';
                message.style.backgroundColor = '#fff3cd';
                setTimeout(() => {
                    message.style.backgroundColor = '';
                }, 2000);
            });

            navList.appendChild(item);
        });

        // 同时更新编辑按钮
        addEditButtons();
    }

    // 代码折叠功能
    function initCodeCollapse() {
        // 处理代码块折叠
        function processCodeBlocks() {
            const codeBlocks = document.querySelectorAll('pre code.hljs');

            codeBlocks.forEach(codeBlock => {
                // 避免重复处理
                if (codeBlock.closest('.code-collapse-wrapper')) return;

                const lines = codeBlock.textContent.split('\n').filter(line => line.trim() !== '');

                // 只对超过指定行数的代码块添加折叠功能
                if (lines.length > CONFIG.codeCollapseLine) {
                    const preElement = codeBlock.parentElement;

                    // 创建包装器
                    const wrapper = document.createElement('div');
                    wrapper.className = 'code-collapse-wrapper';

                    // 创建切换按钮
                    const toggleBtn = document.createElement('div');
                    toggleBtn.className = 'code-collapse-toggle';
                    toggleBtn.textContent = '收起';

                    // 包装原始的 pre 元素
                    preElement.parentNode.insertBefore(wrapper, preElement);
                    wrapper.appendChild(preElement);
                    wrapper.appendChild(toggleBtn);

                    // 初始状态为折叠
                    codeBlock.classList.add('code-collapsed');

                    // 切换功能函数
                    function toggleCodeBlock() {
                        const isCollapsed = codeBlock.classList.contains('code-collapsed');

                        if (isCollapsed) {
                            codeBlock.classList.remove('code-collapsed');
                            codeBlock.classList.add('code-expanded');
                            toggleBtn.textContent = '收起';
                        } else {
                            codeBlock.classList.remove('code-expanded');
                            codeBlock.classList.add('code-collapsed');
                            toggleBtn.textContent = '展开';
                        }
                    }

                    // 按钮点击事件
                    toggleBtn.addEventListener('click', toggleCodeBlock);

                    // 双击代码块展开/收起
                    codeBlock.addEventListener('dblclick', (e) => {
                        // 防止双击时选中文本
                        e.preventDefault();
                        toggleCodeBlock();
                    });

                    // 初始设置按钮文本
                    toggleBtn.textContent = '展开';
                }
            });
        }

        // 初始处理
        processCodeBlocks();

        // 监听DOM变化，处理动态加载的代码块
        const observer = new MutationObserver(mutations => {
            let shouldProcess = false;
            mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1 &&
                           (node.querySelector && node.querySelector('code.hljs') ||
                            node.matches && node.matches('code.hljs'))) {
                            shouldProcess = true;
                        }
                    });
                }
            });

            if (shouldProcess) {
                setTimeout(processCodeBlocks, 100);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 初始化导航面板
    function initNavigationPanel() {
        const { nav, miniNav, prevBtn, nextBtn } = createNavigationPanel();
        let isCollapsed = true;  // 默认折叠状态
        let isHidden = false;

        // 设置初始状态
        nav.classList.add('collapsed');
        miniNav.style.display = 'block';

        // 绑定控制按钮事件
        const exportBtn = nav.querySelector('.quicknav-export');
        const refreshBtn = nav.querySelector('.quicknav-refresh');
        const toggleBtn = nav.querySelector('.quicknav-toggle');

        exportBtn.addEventListener('click', showExportDialog);
        refreshBtn.addEventListener('click', updateNavigationList);

        // 绑定导出选项事件
        nav.addEventListener('click', (e) => {
            if (e.target.classList.contains('export-option')) {
                const format = e.target.getAttribute('data-format');
                performExport(format);
            }
        });

        // 点击其他地方关闭下拉菜单
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.export-dropdown')) {
                document.querySelector('.export-menu').classList.remove('show');
            }
        });

        toggleBtn.addEventListener('click', () => {
            isCollapsed = !isCollapsed;
            nav.classList.toggle('collapsed', isCollapsed);
            miniNav.style.display = isCollapsed ? 'block' : 'none';
            toggleBtn.textContent = isCollapsed ? '+' : '−';
        });

        // 点击小方块展开导航
        miniNav.addEventListener('click', () => {
            isCollapsed = false;
            nav.classList.remove('collapsed');
            miniNav.style.display = 'none';
            toggleBtn.textContent = '−';
        });

        // 上下导航按钮事件
        prevBtn.addEventListener('click', () => {
            navigateToMessage('prev');
        });

        nextBtn.addEventListener('click', () => {
            navigateToMessage('next');
        });

        // 监听DOM变化，实时更新导航列表
        const observer = new MutationObserver(mutations => {
            let shouldUpdateNav = false;
            mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) {
                            // 检查新增的节点是否包含对话内容
                            if (node.classList && node.classList.contains('conversation-statement')) {
                                shouldUpdateNav = true;
                            } else if (node.querySelector && node.querySelector('.conversation-statement')) {
                                shouldUpdateNav = true;
                            }
                        }
                    });
                }
            });

            if (shouldUpdateNav) {
                // 延迟更新以确保DOM完全渲染
                setTimeout(updateNavigationList, 100);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 定期刷新导航列表（作为备用）
        setInterval(updateNavigationList, CONFIG.refreshInterval);

        // 初始更新
        updateNavigationList();
    }

    // 主函数
    async function main() {
        try {
            // 等待对话容器加载
            await waitForElement('.conversation-wrapper');

            // 稍微延迟以确保内容完全加载
            setTimeout(() => {
                initNavigationPanel();
                initCodeCollapse();  // 初始化代码折叠功能
            }, 1000);

        } catch (error) {
            console.error('Genspark QuickNav: 初始化失败', error);
        }
    }

    // 页面加载完成后启动
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }

})();