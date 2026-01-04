// ==UserScript==
// @name         DeepSeek免Markdown复制（DeepSeek Plain Text Copier） 
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Adds a button to copy plain text from DeepSeek chat responses without Markdown formatting.
// @author       ByronLeeeee
// @match        https://chat.deepseek.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528722/DeepSeek%E5%85%8DMarkdown%E5%A4%8D%E5%88%B6%EF%BC%88DeepSeek%20Plain%20Text%20Copier%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/528722/DeepSeek%E5%85%8DMarkdown%E5%A4%8D%E5%88%B6%EF%BC%88DeepSeek%20Plain%20Text%20Copier%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to add the copy button
    function addCopyButton(flexElement) {
        // Check if the button has already been added to avoid duplicates
        if (flexElement.querySelector('.custom-copy-button')) return;

        // Create a new button
        const button = document.createElement('div');
        button.className = 'ds-icon-button custom-copy-button';
        button.setAttribute('tabindex', '0');
        button.style.cssText = '--ds-icon-button-text-color: #909090; --ds-icon-button-size: 20px; cursor: pointer; position: relative;';

        const iconDiv = document.createElement('div');
        iconDiv.className = 'ds-icon';
        iconDiv.style.cssText = 'font-size: 20px; width: 20px; height: 20px;';

        // Copy icon
        iconDiv.innerHTML = `
            <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 14H4V5h9v1h1V5a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h1v-1z" fill="currentColor"/>
                <path d="M15 6H6v9h9V6zm-1 8H7V7h7v7z" fill="currentColor"/>
            </svg>
        `;

        button.appendChild(iconDiv);
        flexElement.insertBefore(button, flexElement.firstChild);

        // Click event handler
        button.addEventListener('click', function() {
            // Find the parent node
            const parent = flexElement.closest('._4f9bf79');
            if (!parent) return;

            // Get all text from ds-markdown ds-markdown--block (including headers)
            const markdownElement = parent.querySelector('.ds-markdown.ds-markdown--block');
            let mainText = '';
            if (markdownElement) {
                // Collect text content from all h1-h6 and p tags
                const textNodes = Array.from(markdownElement.querySelectorAll('h1, h2, h3, h4, h5, h6, p'));
                mainText = textNodes.map(node => node.textContent.trim()).join('\n');
            }

            // Get the text from the thinking section
            const thinkingElement = parent.querySelector('.e1675d8b');
            let finalText = '';

            if (thinkingElement && thinkingElement.textContent.trim()) {
                const thinkingText = thinkingElement.textContent.trim();
                finalText = `<思考开始>\n${thinkingText}\n<思考结束>\n${mainText}`;
            } else {
                finalText = mainText;
            }

            // Copy to clipboard
            navigator.clipboard.writeText(finalText)
                .then(() => {
                console.log('Text copied to clipboard:', finalText);

                // Create popup notification
                const popup = document.createElement('div');
                popup.textContent = '复制成功';
                popup.style.cssText = `
                        position: absolute;
                        bottom: 30px;
                        left: 50%;
                        transform: translateX(-50%);
                        background-color: #4CAF50;
                        color: white;
                        padding: 5px 10px;
                        border-radius: 4px;
                        font-size: 12px;
                        z-index: 1000;
                        opacity: 0;
                        transition: opacity 0.3s;
                        white-space: nowrap; /* Force horizontal display */
                        display: inline-block; /* Ensure inline-block layout */
                    `;
                button.appendChild(popup);

                // Show popup notification
                setTimeout(() => {
                    popup.style.opacity = '1';
                }, 10);

                // Hide popup after 3 seconds
                setTimeout(() => {
                    popup.style.opacity = '0';
                    setTimeout(() => {
                        popup.remove();
                    }, 300);
                }, 3000);
            })
                .catch(err => {
                console.error('Failed to copy text:', err);
            });
        });
    }

    // Initialize buttons on page load
    function initializeButtons() {
        const flexElements = document.querySelectorAll('.ds-flex._965abe9');
        flexElements.forEach(addCopyButton);
    }

    // Use MutationObserver to monitor DOM changes
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                const flexElements = document.querySelectorAll('.ds-flex._965abe9');
                flexElements.forEach(addCopyButton);
            }
        });
    });

    // Start observing the entire document
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Execute once immediately on page load
    initializeButtons();
})();