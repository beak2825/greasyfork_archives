// ==UserScript==
// @name         NextChat Think Tag Folding
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  折叠NextChat对话中转译后的<think>标签内容，增强版
// @author       DeepSeek
// @match        *://shihaolei.bcc-szwg.baidu.com:8001/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/525974/NextChat%20Think%20Tag%20Folding.user.js
// @updateURL https://update.greasyfork.org/scripts/525974/NextChat%20Think%20Tag%20Folding.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加自定义样式
    GM_addStyle(`
        .think-container {
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            margin: 8px 0;
            overflow: hidden;
        }
        .think-header {
            padding: 6px 12px;
            background: #f3f4f6;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .think-header:not(.think-empty):hover {
            background: #e5e7eb;
        }
        .think-header.think-empty {
            background: #f9fafb;
            color: #9ca3af;
            cursor: default;
        }
        .think-arrow {
            transition: transform 0.2s;
            width: 16px;
            height: 16px;
        }
        .think-content {
            padding: 12px;
            background: white;
            max-height: 1000px;
            transition: max-height 0.3s ease;
            overflow: hidden;
            white-space: pre-wrap;
            font-family: monospace;
            background: #f9fafb;
            border-top: 1px solid #e5e7eb;
        }
        .think-collapsed .think-content {
            max-height: 0;
            padding-top: 0;
            padding-bottom: 0;
            border-top: none;
        }
        .think-collapsed:not(.think-empty) .think-arrow {
            transform: rotate(-90deg);
        }
        .think-empty .think-arrow {
            opacity: 0.5;
        }
    `);

    function isModelMessage(element) {
        let current = element;
        while (current && !current.classList.toString().includes('chat_chat-message')) {
            current = current.parentElement;
        }
        return current && !current.classList.toString().includes('chat_chat-message-user');
    }

    function extractThinkContent(text) {
        const startTag = '&lt;think&gt;';
        const endTag = '&lt;/think&gt;';

        const startIndex = text.indexOf(startTag);
        if (startIndex === -1 || text.trim().indexOf(startTag) !== 0) return null;

        const endIndex = text.indexOf(endTag);
        if (endIndex === -1) return null;

        return {
            content: text.slice(startIndex + startTag.length, endIndex).trim(),
            before: text.slice(0, startIndex).trim(),
            after: text.slice(endIndex + endTag.length).trim()
        };
    }

    function createElementFromHTML(htmlString) {
        const div = document.createElement('div');
        div.innerHTML = htmlString;
        return div.children.length === 1 ? div.children[0] : div;
    }

    function decodeHTMLEntities(text) {
        const textarea = document.createElement('textarea');
        textarea.innerHTML = text;
        return textarea.value;
    }

    function processThinkTags() {
        document.querySelectorAll('.markdown-body').forEach(container => {
            if (container.dataset.processed || !isModelMessage(container)) return;

            const originalHTML = container.innerHTML;
            const thinkData = extractThinkContent(originalHTML);

            if (!thinkData) return;

            // 创建折叠容器
            const wrapper = document.createElement('div');
            wrapper.className = 'think-container';

            // 解码think内容中的HTML实体
            const decodedContent = decodeHTMLEntities(thinkData.content);
            const isEmpty = !decodedContent;

            // 创建标题栏
            const header = document.createElement('div');
            header.className = `think-header${isEmpty ? ' think-empty' : ''}`;
            header.innerHTML = `
                <svg class="think-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M6 9l6 6 6-6"/>
                </svg>
                <span>${isEmpty ? '思维链为空' : '思维链（点击展开）'}</span>
            `;

            // 创建内容区域，使用innerHTML以保留HTML格式
            const content = document.createElement('div');
            content.className = 'think-content';

            // 创建一个临时div来解析和渲染HTML内容
            const contentWrapper = document.createElement('div');
            contentWrapper.className = 'markdown-body'; // 保持与原始内容相同的样式
            contentWrapper.innerHTML = decodedContent;
            content.appendChild(contentWrapper);

            // 组合元素
            wrapper.appendChild(header);
            if (!isEmpty) {
                wrapper.appendChild(content);
            }

            // 更新容器内容
            container.innerHTML = '';

            // 处理前置内容
            if (thinkData.before) {
                const beforeDiv = document.createElement('div');
                beforeDiv.innerHTML = decodeHTMLEntities(thinkData.before);
                while (beforeDiv.firstChild) {
                    container.appendChild(beforeDiv.firstChild);
                }
            }

            container.appendChild(wrapper);

            // 处理后置内容
            if (thinkData.after) {
                const afterDiv = document.createElement('div');
                afterDiv.innerHTML = decodeHTMLEntities(thinkData.after);
                while (afterDiv.firstChild) {
                    container.appendChild(afterDiv.firstChild);
                }
            }

            // 添加点击事件（仅对非空think标签生效）
            if (!isEmpty) {
                header.addEventListener('click', () => {
                    wrapper.classList.toggle('think-collapsed');
                });
            }

            // 标记已处理
            container.dataset.processed = 'true';
        });
    }

    // 初始化处理
    processThinkTags();

    // 监听DOM变化以处理新消息
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                processThinkTags();
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();