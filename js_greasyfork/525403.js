// ==UserScript==
// @name         Phind.com Chat Box Text Formatter
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Format text in chat box while preserving code spacing
// @author       11
// @license      MIT
// @match        https://www.phind.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525403/Phindcom%20Chat%20Box%20Text%20Formatter.user.js
// @updateURL https://update.greasyfork.org/scripts/525403/Phindcom%20Chat%20Box%20Text%20Formatter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        editorSelectors: [
            '.masthead-chatbox .public-DraftEditor-content',
            '.followup-textarea-container .public-DraftEditor-content'
        ],
        buttonContainerSelectors: [
            '.masthead-accessory',
            '.followup-textarea-container .flex.items-center'
        ]
    };

    function initializeFormatter(editorContent, buttonContainer) {
        // Create and inject our custom styles
        const styleSheet = document.createElement('style');
        styleSheet.textContent = `
            .public-DraftEditor-content {
                font-family: 'Courier New', monospace !important;
                line-height: 1.5 !important;
                padding: 10px !important;
            }
            .public-DraftEditor-content pre {
                background-color: #f5f5f5 !important;
                padding: 8px !important;
                border-radius: 4px !important;
                margin: 8px 0 !important;
                white-space: pre-wrap !important;
            }
            .public-DraftStyleDefault-block {
                white-space: pre-wrap !important;
            }
            .format-button {
                padding: 4px 8px !important;
                margin-left: 8px !important;
                border-radius: 4px !important;
                background-color: #f0f0f0 !important;
                border: 1px solid #ccc !important;
                cursor: pointer !important;
                font-size: 12px !important;
                color: #333 !important;
            }
            .format-button:hover {
                background-color: #e0e0e0 !important;
            }
        `;
        document.head.appendChild(styleSheet);

        // Handle paste events
        editorContent.addEventListener('paste', function(e) {
            e.preventDefault();

            let text = e.clipboardData.getData('text/plain');

            if (isCodeBlock(text)) {
                text = formatCodeBlock(text);
            }

            const selection = window.getSelection();
            const range = selection.getRangeAt(0);
            range.deleteContents();

            const textNode = document.createTextNode(text);
            range.insertNode(textNode);

            range.setStartAfter(textNode);
            range.setEndAfter(textNode);
            selection.removeAllRanges();
            selection.addRange(range);
        });

        // Add input event listener
        editorContent.addEventListener('input', function(e) {
            formatCurrentContent(editorContent);
        });
        }
    function isCodeBlock(text) {
        const codeIndicators = [
            '```',
            'function',
            'class',
            'const',
            'let',
            'var',
            'if(',
            'for(',
            'while(',
            '{',
            '};',
            'return',
            'import',
            'export',
            '<div',
            '<span',
            '</div>',
            'public-',
            'class='
        ];
        return codeIndicators.some(indicator => text.includes(indicator));
    }

    function formatCodeBlock(text) {
        return text.split('\n').map(line => {
            const leadingSpaces = line.match(/^\s*/)[0];
            return leadingSpaces + line.trim();
        }).join('\n');
    }

    function formatCurrentContent(editorContent) {
        const blocks = editorContent.querySelectorAll('.public-DraftStyleDefault-block');
        blocks.forEach(block => {
            const text = block.textContent;
            if (isCodeBlock(text)) {
                block.style.whiteSpace = 'pre';
                block.style.fontFamily = 'monospace';
                block.style.backgroundColor = '#f5f5f5';
                block.style.padding = '8px';
                block.style.borderRadius = '4px';
                block.style.margin = '8px 0';
            } else {
                block.style.whiteSpace = 'pre-wrap';
                block.style.fontFamily = 'inherit';
                block.style.backgroundColor = 'transparent';
                block.style.padding = '0';
            }
        });
    }

    // Initialize observers for both editors
    function initializeObservers() {
        const observer = new MutationObserver((mutations, obs) => {
            CONFIG.editorSelectors.forEach((selector, index) => {
                const editor = document.querySelector(selector);
                const buttonContainer = document.querySelector(CONFIG.buttonContainerSelectors[index]);

                if (editor && !editor.hasAttribute('data-formatter-initialized')) {
                    initializeFormatter(editor, buttonContainer);
                    editor.setAttribute('data-formatter-initialized', 'true');
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Initial check
        CONFIG.editorSelectors.forEach((selector, index) => {
            const editor = document.querySelector(selector);
            const buttonContainer = document.querySelector(CONFIG.buttonContainerSelectors[index]);
            if (editor && !editor.hasAttribute('data-formatter-initialized')) {
                initializeFormatter(editor, buttonContainer);
                editor.setAttribute('data-formatter-initialized', 'true');
            }
        });
    }

    // Start the initialization process
    initializeObservers();
})();