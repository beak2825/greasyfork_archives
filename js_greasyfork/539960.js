// ==UserScript==
// @name         ChatGPT 导出聊天为 Markdown (.md)
// @namespace    https://chat.openai.com/
// @version      1.0
// @description  在 ChatGPT 单个对话页面添加导出按钮，将聊天记录导出为 Markdown 文件
// @author       GPT
// @match        https://chatgpt.com/*
// @grant        none
// @license            MIT
// @downloadURL https://update.greasyfork.org/scripts/539960/ChatGPT%20%E5%AF%BC%E5%87%BA%E8%81%8A%E5%A4%A9%E4%B8%BA%20Markdown%20%28md%29.user.js
// @updateURL https://update.greasyfork.org/scripts/539960/ChatGPT%20%E5%AF%BC%E5%87%BA%E8%81%8A%E5%A4%A9%E4%B8%BA%20Markdown%20%28md%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 等待元素加载完毕
    function waitForElement(selector, callback) {
        const el = document.querySelector(selector);
        if (el) {
            callback(el);
        } else {
            setTimeout(() => waitForElement(selector, callback), 500);
        }
    }

    // 提取聊天记录
    function extractChatToMarkdown() {
        const messages = document.querySelectorAll('[data-message-author-role]');
        let md = '# ChatGPT 对话记录\n\n';

        messages.forEach((msg) => {
            const role = msg.getAttribute('data-message-author-role');
            let content = msg.textContent.trim();

            if (!content) return;

            if (role === 'user') {
                md += `\n\n## 🧑 用户提问\n\n${content}\n`;
            } else if (role === 'assistant') {
                // 检查是否含代码块
                const preTags = msg.querySelectorAll('pre');
                if (preTags.length > 0) {
                    preTags.forEach((pre) => {
                        const code = pre.textContent.trim();
                        content = content.replace(code, `\n\`\`\`\n${code}\n\`\`\`\n`);
                    });
                }
                md += `\n\n## 🤖 ChatGPT 回答\n\n${content}\n`;
            }
        });

        return md;
    }

    // 创建按钮
    function createExportButton() {
        const btn = document.createElement('button');
        btn.innerText = '📄 导出为 Markdown';
        btn.style.position = 'fixed';
        btn.style.bottom = '20px';
        btn.style.right = '20px';
        btn.style.zIndex = '9999';
        btn.style.padding = '10px 15px';
        btn.style.backgroundColor = '#10a37f';
        btn.style.color = '#fff';
        btn.style.border = 'none';
        btn.style.borderRadius = '8px';
        btn.style.cursor = 'pointer';
        btn.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
        btn.style.fontSize = '14px';

        btn.onclick = () => {
            const mdContent = extractChatToMarkdown();
            const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;

            const timestamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
            a.download = `ChatGPT-导出-${timestamp}.md`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        };

        document.body.appendChild(btn);
    }

    waitForElement('main', createExportButton);
})();
