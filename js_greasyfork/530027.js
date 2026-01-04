// ==UserScript==
// @name        ChatGPT Markdown Live Formatting
// @namespace   Violentmonkey Scripts
// @match       https://chatgpt.com/*
// @grant       GM_addStyle
// @version     1.0
// @license     MIT
// @author      kayleighember
// @description Adds real-time Markdown and code formatting in ChatGPT input.
// @icon        https://cdn.oaistatic.com/assets/favicon-miwirzcw.ico
// @downloadURL https://update.greasyfork.org/scripts/530027/ChatGPT%20Markdown%20Live%20Formatting.user.js
// @updateURL https://update.greasyfork.org/scripts/530027/ChatGPT%20Markdown%20Live%20Formatting.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Inject CSS styles for Markdown preview
    GM_addStyle(`
        .chatgpt-md-preview p {
            margin: 0;
        }
        .chatgpt-md-preview code {
            background: #282c34;
            color: #e06c75;
            padding: 2px 6px;
            border-radius: 4px;
            font-family: monospace;
        }
        .chatgpt-md-preview .code-block {
            white-space: normal;
            background: #282c34;
            padding: 8px;
            border-radius: 6px;
            font-size: 0.875rem;
            color: #abb2bf;
        }
        .chatgpt-md-preview .code-block pre {
            white-space: pre-wrap;
            margin: 0;
        }
    `);

    function updateMarkdownPreview() {
        const textarea = document.querySelector('textarea');
        if (!textarea) return;

        let text = textarea.value;
        let formattedText = '';

        // Convert inline code (`code`)
        formattedText = text.replace(/`([^`]+)`/g, '<code>$1</code>');

        // Convert triple backticks (```) to block code styling
        formattedText = formattedText.replace(/```([\s\S]+?)```/g, `
            <div class="react-renderer node-codeBlock">
                <div class="code-block">
                    <pre><code><div>$1</div></code></pre>
                </div>
            </div>
        `);

        // Create/update preview div
        let previewDiv = document.getElementById('chatgpt-markdown-preview');
        if (!previewDiv) {
            previewDiv = document.createElement('div');
            previewDiv.id = 'chatgpt-markdown-preview';
            previewDiv.className = 'chatgpt-md-preview';
            previewDiv.style.cssText = `
                position: absolute;
                bottom: 60px;
                left: 10px;
                right: 10px;
                padding: 10px;
                background: transparent;
                color: #ccc;
                font-size: 14px;
                white-space: pre-wrap;
                font-family: monospace;
                max-height: 200px;
                overflow-y: auto;
            `;
            textarea.parentElement.appendChild(previewDiv);
        }

        // Update preview content
        previewDiv.innerHTML = `<p>${formattedText}</p>`;
    }

    // Attach event listener to update on input
    document.addEventListener('input', updateMarkdownPreview);
})();
