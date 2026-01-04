// ==UserScript==
// @name         Claude Chat Exporter
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Export Claude AI conversations to Markdown format
// @author       Vishal Agarwal
// @match        https://claude.ai/*
// @grant        none
// @license      MIT
// @homepage     https://github.com/user/claude-chat-exporter
// @supportURL   https://github.com/user/claude-chat-exporter/issues
// @downloadURL https://update.greasyfork.org/scripts/540933/Claude%20Chat%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/540933/Claude%20Chat%20Exporter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function extractConversation() {
        let markdown = "# Conversation with Claude\n\n";
        const messages = document.querySelectorAll('.font-claude-message, .font-user-message');
        
        messages.forEach((message) => {
            const isHuman = message.classList.contains('font-user-message');
            const role = isHuman ? 'Human' : 'Claude';
            markdown += `## ${role}:\n\n`;
            
            const content = isHuman ? message : message.querySelector('.grid-cols-1');
            if (content) {
                markdown += processContent(content);
            }
            
            markdown += "\n";
        });
        
        return markdown;
    }

    function processContent(element, depth = 0) {
        let markdown = '';
        const children = element.childNodes;
        
        for (let child of children) {
            if (child.nodeType === Node.TEXT_NODE) {
                markdown += child.textContent;
            } else if (child.nodeType === Node.ELEMENT_NODE) {
                switch (child.tagName) {
                    case 'P':
                        markdown += processInlineElements(child) + "\n\n";
                        break;
                    case 'OL':
                        markdown += processList(child, 'ol', depth) + "\n";
                        break;
                    case 'UL':
                        markdown += processList(child, 'ul', depth) + "\n";
                        break;
                    case 'PRE':
                        const codeBlock = child.querySelector('code');
                        if (codeBlock) {
                            const language = codeBlock.className.match(/language-(\w+)/)?.[1] || '';
                            markdown += "```" + language + "\n" + codeBlock.textContent.trim() + "\n```\n\n";
                        }
                        break;
                    default:
                        markdown += processInlineElements(child) + "\n\n";
                }
            }
        }
        
        return markdown;
    }

    function processList(listElement, listType, depth = 0) {
        let markdown = '';
        const items = listElement.children;
        const indent = '  '.repeat(depth);
        
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const prefix = listType === 'ol' ? `${i + 1}. ` : '- ';
            markdown += indent + prefix + processInlineElements(item).trim() + "\n";
            
            const nestedLists = item.querySelectorAll(':scope > ol, :scope > ul');
            for (let nestedList of nestedLists) {
                markdown += processList(nestedList, nestedList.tagName.toLowerCase(), depth + 1);
            }
        }
        
        return markdown;
    }

    function processInlineElements(element) {
        let markdown = '';
        const children = element.childNodes;
        
        for (let child of children) {
            if (child.nodeType === Node.TEXT_NODE) {
                markdown += child.textContent;
            } else if (child.nodeType === Node.ELEMENT_NODE) {
                if (child.tagName === 'CODE') {
                    markdown += '`' + child.textContent + '`';
                } else if (child.tagName === 'OL' || child.tagName === 'UL') {
                    continue;
                } else {
                    markdown += processInlineElements(child);
                }
            }
        }
        
        return markdown;
    }

    function downloadMarkdown(content, filename) {
        const blob = new Blob([content], { type: 'text/markdown' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);
    }

    function createExportButton() {
        const button = document.createElement('button');
        button.innerHTML = '📄 Export Chat';
        button.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            padding: 10px 15px;
            background: #2563eb;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            transition: background-color 0.2s;
        `;
        
        button.addEventListener('mouseenter', () => {
            button.style.backgroundColor = '#1d4ed8';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.backgroundColor = '#2563eb';
        });
        
        button.addEventListener('click', () => {
            try {
                const conversationMarkdown = extractConversation();
                if (conversationMarkdown.trim() === "# Conversation with Claude\n\n") {
                    alert('No conversation found. Make sure you are on a Claude conversation page.');
                    return;
                }
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
                downloadMarkdown(conversationMarkdown, `claude_conversation_${timestamp}.md`);
            } catch (error) {
                console.error('Error exporting conversation:', error);
                alert('Error exporting conversation. Check the console for details.');
            }
        });
        
        document.body.appendChild(button);
    }

    function waitForPageLoad() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', createExportButton);
        } else {
            setTimeout(createExportButton, 1000);
        }
    }

    waitForPageLoad();
})();