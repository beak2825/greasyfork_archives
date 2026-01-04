// ==UserScript==
// @name         Gemini to Markdown
// @namespace    http://tampermonkey.net/
// @version      1.83
// @description  Copies conversation content, including AI-generated images as Markdown links, for pasting into Obsidian.
// @author       Gemini
// @match        https://gemini.google.com/*
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=obsidian.md
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/546652/Gemini%20to%20Markdown.user.js
// @updateURL https://update.greasyfork.org/scripts/546652/Gemini%20to%20Markdown.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const USER_PROMPT_PREFIX = '> ';

    function processCodeBlock(wrapperNode) {
        const languageElement = wrapperNode.querySelector('.code-language');
        const language = languageElement ? languageElement.textContent.trim().toLowerCase() : '';
        const codeElement = wrapperNode.querySelector('code');
        const codeContent = codeElement ? codeElement.textContent : '';
        return `\n\n\`\`\`${language}\n${codeContent.trim()}\n\`\`\`\n\n`;
    }

    function domToMarkdown(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            return node.textContent;
        }
        if (node.nodeType !== Node.ELEMENT_NODE) {
            return '';
        }
        if (node.matches('div.code-block')) {
            return processCodeBlock(node);
        }
        let content = '';
        node.childNodes.forEach(child => {
            content += domToMarkdown(child);
        });
        const tagName = node.tagName.toLowerCase();
        switch (tagName) {
            case 'p': return `\n${content}\n`;
            case 'strong': case 'b': return `**${content}**`;
            case 'em': case 'i': return `*${content}*`;
            case 'ul': return `\n${content}\n`;
            case 'ol':
                let orderedContent = '';
                const listItems = Array.from(node.children).filter(child => child.tagName.toLowerCase() === 'li');
                listItems.forEach((li, index) => {
                    orderedContent += `${index + 1}. ${domToMarkdown(li).trim()}\n`;
                });
                return `\n${orderedContent}\n`;
            case 'li':
                if (node.parentNode && node.parentNode.tagName.toLowerCase() === 'ol') {
                    return content;
                }
                return `* ${content.trim()}\n`;
            case 'hr': return '\n\n---\n\n';
            case 'a': return `[${content}](${node.getAttribute('href')})`;
            case 'code':
                if (!node.closest('div.code-block')) {
                    return `\`${content}\``;
                }
                return content;

            // --- NEW: Added logic to handle all image tags ---
            case 'img':
                const altText = node.getAttribute('alt') || 'image';
                const srcUrl = node.getAttribute('src');
                if (srcUrl) {
                    // Ensure the image is on its own line and separated by newlines
                    return `\n\n![${altText}](${srcUrl})\n\n`;
                }
                return '';
            // --- END NEW ---

            case 'h1': return `\n# ${content}\n`;
            case 'h2': return `\n## ${content}\n`;
            case 'h3': return `\n### ${content}\n`;
            case 'h4': return `\n#### ${content}\n`;
            case 'h5': return `\n##### ${content}\n`;
            case 'h6': return `\n###### ${content}\n`;
            default: return content;
        }
    }

    function copyConversationToClipboard() {
        // --- 修改开始：更新了标题提取的选择器 ---
        // 原代码: const titleElement = document.querySelector('div.conversation-title.gds-label-l');
        // 新代码如下，适配 span 标签和 gds-title-m 类名
        const titleElement = document.querySelector('span.conversation-title.gds-title-m');
        // --- 修改结束 ---
        
        let title = '';
        if (titleElement) {
            title = titleElement.textContent.trim();
        }
        let fullMarkdown = title ? `# ${title}\n\n` : ''; // 我顺便加了一个 # 让标题在 Markdown 里显示为一级标题

        const conversationTurns = document.querySelectorAll('message-content, user-query');
        if (!conversationTurns.length && !title) {
            alert('未检测到对话内容或标题！');
            return;
        }

        conversationTurns.forEach(turn => {
            const userQueryLines = turn.querySelectorAll('.query-text-line.ng-star-inserted');
            if (userQueryLines.length > 0) {
                let userText = '';
                userQueryLines.forEach(line => userText += line.textContent.trim() + '\n');
                fullMarkdown += `${USER_PROMPT_PREFIX}${userText.trim()}\n\n`;
            }
            // This specifically handles user-uploaded images which are structured differently
            const userImages = turn.querySelectorAll('img[data-test-id="uploaded-img"]');
            userImages.forEach(img => {
                const alt = img.getAttribute('alt') || 'uploaded image';
                const src = img.getAttribute('src');
                if (src) {
                    fullMarkdown += `![${alt}](${src})\n\n`;
                }
            });

            const geminiResponse = turn.querySelector('.markdown.markdown-main-panel');
            if (geminiResponse) {
                let responseMarkdown = domToMarkdown(geminiResponse);
                fullMarkdown += responseMarkdown.trim().replace(/\n{3,}/g, '\n\n') + '\n\n';
            }
        });

        GM_setClipboard(fullMarkdown.trim(), 'text');
        const button = document.getElementById('gemini-to-obsidian-button');
        const originalText = button.textContent;
        button.textContent = '已复制!';
        setTimeout(() => {
            button.textContent = originalText;
        }, 2000);
    }

    function createCopyButton() {
        const button = document.createElement('button');
        button.id = 'gemini-to-obsidian-button';
        button.textContent = '复制为Markdown';
        button.addEventListener('click', copyConversationToClipboard);
        document.body.appendChild(button);
        GM_addStyle(`
            #gemini-to-obsidian-button {
                position: fixed; bottom: 20px; right: 20px; z-index: 9999;
                padding: 10px 15px; background-color: #4a4a5e; color: white;
                border: none; border-radius: 8px; cursor: pointer; font-size: 14px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: all 0.2s;
            }
            #gemini-to-obsidian-button:hover { background-color: #5d5d76; transform: translateY(-2px); }
            #gemini-to-obsidian-button:active { background-color: #393949; transform: translateY(0); }
        `);
    }

    if (document.readyState === 'complete') {
        createCopyButton();
    } else {
        window.addEventListener('load', createCopyButton);
    }
})();