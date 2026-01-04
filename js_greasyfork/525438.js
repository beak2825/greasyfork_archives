// ==UserScript==
// @name         DeepSeek R1 网页划词提问
// @namespace    http://tampermonkey.net/
// @version      0.15
// @description  支持弹窗交互的专业解释工具（优化版）
// @author       Your Name
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @connect      api.deepseek.com
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/525438/DeepSeek%20R1%20%E7%BD%91%E9%A1%B5%E5%88%92%E8%AF%8D%E6%8F%90%E9%97%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/525438/DeepSeek%20R1%20%E7%BD%91%E9%A1%B5%E5%88%92%E8%AF%8D%E6%8F%90%E9%97%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const API_URL = 'https://api.deepseek.com/v1/chat/completions';
    let currentPopup = null;
    let currentButton = null;
    let currentToast = null;

    // 优化后的专业排版样式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translate(-50%, -45%); }
            to { opacity: 1; transform: translate(-50%, -50%); }
        }

        .ds-msg-content {
            line-height: 1.5;
            font-size: 14px;
            color: #333;
        }

        .ds-msg-content p {
            margin: 8px 0;
        }

        .ds-msg-content code {
            background: rgba(175,184,193,0.2);
            padding: 2px 4px;
            border-radius: 4px;
            font-family: 'SFMono-Regular', Consolas, monospace;
        }

        .ds-msg-content pre {
            background: #f8f9fa;
            padding: 14px;
            border-radius: 8px;
            overflow-x: auto;
            margin: 12px 0;
            border: 1px solid #eee;
        }

        .ds-msg-content pre code {
            background: transparent;
            padding: 0;
            font-size: 13px;
        }

        .ds-msg-content ul,
        .ds-msg-content ol {
            margin: 10px 0;
            padding-left: 20px;
        }

        .ds-msg-content li {
            margin: 6px 0;
            padding-left: 6px;
        }

        .ds-msg-content strong {
            font-weight: 600;
            color: #2d2d2d;
        }

        .ds-msg-content em {
            font-style: italic;
        }

        .ds-popup {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        }
    `;
    document.head.appendChild(style);

    GM_registerMenuCommand('设置DeepSeek API密钥', () => {
        const apiKey = prompt('请输入您的DeepSeek API密钥：', GM_getValue('api_key', ''));
        if (apiKey !== null) {
            GM_setValue('api_key', apiKey.trim());
        }
    });

    function showToast(message, duration=2000) {
        if (currentToast) currentToast.remove();

        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 8px 16px;
            border-radius: 4px;
            z-index: 99999;
            font-size: 14px;
            animation: fadeIn 0.3s;
        `;

        document.body.appendChild(toast);
        currentToast = toast;

        setTimeout(() => toast.remove(), duration);
    }

    function createActionButton(x, y) {
        if (currentButton) currentButton.remove();

        const btn = document.createElement('div');
        btn.innerHTML = '🔍Deepseek';
        btn.style.cssText = `
            position: absolute;
            left: ${x + 15}px;
            top: ${y}px;
            background: #4CAF50;
            color: white;
            padding: 5px 10px;
            border-radius: 4px;
            cursor: pointer;
            z-index: 10000;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            font-size: 12px;
            animation: fadeIn 0.2s;
        `;

        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            btn.remove();
            currentButton = null;
        });

        return btn;
    }

    function safeHTML(content) {
        const div = document.createElement('div');
        div.textContent = content;
        return div.innerHTML;
    }

    function formatContent(text) {
        let html = safeHTML(text)
            .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/^-\s+(.+)$/gm, '<li>$1</li>')
            .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
            .replace(/\n/g, '<br>');

        return `<div class="ds-msg-content">${html}</div>`;
    }

    function showInteractivePopup(messages) {
        if (currentPopup) currentPopup.remove();

        const popup = document.createElement('div');
        popup.className = 'ds-popup';
        popup.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 600px;
            height: 400px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 100000;
            animation: fadeIn 0.3s;
            display: flex;
            flex-direction: column;
            max-height: 80vh;
            resize: both;
            overflow: hidden;
        `;

        // 拖拽功能
        let isDragging = false;
        let startX, startY, initLeft, initTop;

        const handleMove = (e) => {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            popup.style.left = `${initLeft + dx}px`;
            popup.style.top = `${initTop + dy}px`;
            popup.style.transform = 'none';
            checkBoundary();
        };

        const handleMouseUp = () => {
            isDragging = false;
            document.removeEventListener('mousemove', handleMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        // 调整大小功能
        const resizeHandle = document.createElement('div');
        resizeHandle.style.cssText = `
            position: absolute;
            right: 0;
            bottom: 0;
            width: 15px;
            height: 15px;
            cursor: nwse-resize;
            background: transparent;
            z-index: 100;
        `;

        let isResizing = false;
        let startWidth, startHeight, startResizeX, startResizeY;

        resizeHandle.addEventListener('mousedown', (e) => {
            isResizing = true;
            startResizeX = e.clientX;
            startResizeY = e.clientY;
            const style = getComputedStyle(popup);
            startWidth = parseInt(style.width);
            startHeight = parseInt(style.height);
            document.addEventListener('mousemove', handleResize);
            document.addEventListener('mouseup', () => {
                isResizing = false;
                document.removeEventListener('mousemove', handleResize);
            });
        });

        function handleResize(e) {
            if (!isResizing) return;
            const dx = e.clientX - startResizeX;
            const dy = e.clientY - startResizeY;

            const newWidth = Math.max(300, startWidth + dx);
            const newHeight = Math.max(200, startHeight + dy);

            popup.style.width = `${newWidth}px`;
            popup.style.height = `${newHeight}px`;
            checkBoundary();
        }

        // 弹窗头部
        const header = document.createElement('div');
        header.style.cssText = `
            padding: 12px;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #f8f9fa;
            border-radius: 8px 8px 0 0;
            cursor: move;
            user-select: none;
        `;

        header.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            const rect = popup.getBoundingClientRect();
            initLeft = rect.left;
            initTop = rect.top;
            document.addEventListener('mousemove', handleMove);
            document.addEventListener('mouseup', handleMouseUp);
        });

        // 弹窗内容
        const title = document.createElement('span');
        title.textContent = 'DeepSeek:';
        title.style.cssText = 'font-weight: 600; color: #333;';

        const closeBtn = document.createElement('div');
        closeBtn.innerHTML = '×';
        closeBtn.style.cssText = `
            cursor: pointer;
            font-size: 24px;
            color: #666;
            padding: 0 8px;
            line-height: 1;
        `;
        closeBtn.onclick = () => popup.remove();

        const content = document.createElement('div');
        content.style.cssText = `
            flex: 1;
            padding: 16px;
            overflow-y: auto;
        `;

        messages.slice(1).forEach(msg => {
            const msgDiv = document.createElement('div');
            msgDiv.style.cssText = `
                margin: 10px 0;
                padding: 12px;
                border-radius: 6px;
                background: ${msg.role === 'user' ? '#f5f6f7' : '#f0f7ff'};
            `;
            msgDiv.innerHTML = formatContent(msg.content);
            content.appendChild(msgDiv);
        });

        // 输入区域
        const inputContainer = document.createElement('div');
        inputContainer.style.cssText = `
            padding: 12px;
            border-top: 1px solid #eee;
            background: #f8f9fa;
        `;

        const input = document.createElement('textarea');
        input.style.cssText = `
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            resize: vertical;
            min-height: 40px;
            font-family: inherit;
        `;
        input.placeholder = '输入后续问题...';

        const sendBtn = document.createElement('button');
        sendBtn.textContent = '发送';
        sendBtn.style.cssText = `
            margin-top: 8px;
            padding: 8px 20px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            float: right;
        `;

        sendBtn.onclick = () => {
            const userMessage = input.value.trim();
            if (!userMessage) return;

            messages.push({ role: 'user', content: userMessage });
            input.value = '';
        };

        // 组装元素
        header.append(title, closeBtn);
        inputContainer.append(input, sendBtn);
        popup.append(header, content, inputContainer, resizeHandle);
        document.body.appendChild(popup);
        currentPopup = popup;

        // 边界检查
        function checkBoundary() {
            const rect = popup.getBoundingClientRect();
            const buffer = 20;

            if (rect.left < -buffer) popup.style.left = `${-buffer}px`;
            if (rect.top < -buffer) popup.style.top = `${-buffer}px`;
            if (rect.right > window.innerWidth + buffer) {
                popup.style.left = `${window.innerWidth - rect.width + buffer}px`;
            }
            if (rect.bottom > window.innerHeight + buffer) {
                popup.style.top = `${window.innerHeight - rect.height + buffer}px`;
            }
        }

        content.scrollTop = content.scrollHeight;
    }

    function getExplanation(text) {
        const apiKey = GM_getValue('api_key');
        if (!apiKey) {
            alert('请先通过油猴菜单设置API密钥');
            return;
        }

        showToast('Deep...Seek...稍等...速度取决于API...', 6000);

        const initialMessages = [
            {
                "role": "system",
                "content": "你是一个智能百科助手，请用简洁易懂的中文回答，保持自然的口语化风格。使用Markdown基础格式进行排版。"
            },
            {
                "role": "user",
                "content": `解释分析推理总结：${text}`
            }
        ];

        GM_xmlhttpRequest({
            method: "POST",
            url: API_URL,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            data: JSON.stringify({
                model: "deepseek-reasoner",
                messages: initialMessages,
                temperature: 0.7,
                max_tokens: 512
            }),
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    const result = data.choices[0].message.content;
                    initialMessages.push({ role: 'assistant', content: result });
                    showInteractivePopup(initialMessages);
                } catch (e) {
                    showInteractivePopup([...initialMessages,
                        { role: 'assistant', content: '⚠️ 解析响应失败，请重试' }
                    ]);
                }
            },
            onerror: function(err) {
                showInteractivePopup([...initialMessages,
                    { role: 'assistant', content: '⚠️ 请求失败，请检查网络连接' }
                ]);
            }
        });
    }

    // 文本选择监听
    document.addEventListener('mouseup', function(e) {
        const selection = window.getSelection().toString().trim();
        if (selection && selection.length > 2) {
            const range = window.getSelection().getRangeAt(0);
            const rect = range.getBoundingClientRect();
            const btn = createActionButton(rect.right + window.scrollX, rect.top + window.scrollY);
            btn.onclick = () => getExplanation(selection);
            document.body.appendChild(btn);
            currentButton = btn;
        }
    });

    document.addEventListener('mousedown', (e) => {
        if (currentButton && !currentButton.contains(e.target)) {
            currentButton.remove();
            currentButton = null;
        }
    });
})();