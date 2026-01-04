// ==UserScript==
// @name         HackTheBox Academy - Add Clipboard Copy To Code Blocks
// @namespace    https://greasyfork.org/en/users/1488917-l0wk3y-iaan

// @version      1.1
// @description  Automatically submits any dynamic question input by pressing ENTER
// @author       L0WK3Y @infophreak

// @match        https://www.hackthebox.com/home*
// @match        https://academy.hackthebox.com/*
// @match        https://www.hackthebox.eu/home*
// @icon         https://www.hackthebox.com/images/favicon.png

// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/542718/HackTheBox%20Academy%20-%20Add%20Clipboard%20Copy%20To%20Code%20Blocks.user.js
// @updateURL https://update.greasyfork.org/scripts/542718/HackTheBox%20Academy%20-%20Add%20Clipboard%20Copy%20To%20Code%20Blocks.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // CSS for the clipboard button
    const style = document.createElement('style');
    style.textContent = `
        .clipboard-btn {
            position: absolute;
            top: 6px;
            right: 12px;
            background: #2c3e50;
            color: #ecf0f1;
            border: none;
            border-radius: 4px;
            padding: 2px 8px;
            font-size: 11px;
            cursor: pointer;
            z-index: 1000;
            transition: all 0.2s ease;
            font-family: monospace;
            max-width: 60px;
            text-align: center;
            box-sizing: border-box;
        }

        .clipboard-btn:hover {
            background: #34495e;
            transform: scale(1.05);
        }

        .clipboard-btn:active {
            transform: scale(0.95);
        }

        .clipboard-btn.copied {
            background: #a0f000;
            color: white;
        }

        .window_container {
            position: relative;
        }

        .window_content {
            position: relative;
            overflow: hidden;
        }

        .window_top {
            position: relative;
            padding-right: 80px;
        }
    `;
    document.head.appendChild(style);

    // Function to copy text to clipboard
    function copyToClipboard(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            return navigator.clipboard.writeText(text);
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            return new Promise((resolve, reject) => {
                if (document.execCommand('copy')) {
                    resolve();
                } else {
                    reject();
                }
                document.body.removeChild(textArea);
            });
        }
    }

    // Function to add clipboard button to a code block
    function addClipboardButton(windowContainer) {
        // Check if button already exists
        if (windowContainer.querySelector('.clipboard-btn')) {
            return;
        }

        const codeElement = windowContainer.querySelector('pre code');
        if (!codeElement) {
            return;
        }

        // Create clipboard button
        const button = document.createElement('button');
        button.className = 'clipboard-btn';
        button.textContent = 'Copy';
        button.title = 'Copy code to clipboard';

        // Add click event listener
        button.addEventListener('click', function() {
            const codeText = codeElement.textContent || codeElement.innerText;

            copyToClipboard(codeText).then(() => {
                button.textContent = 'Copied!';
                button.classList.add('copied');

                // Reset button after 2 seconds
                setTimeout(() => {
                    button.textContent = 'Copy';
                    button.classList.remove('copied');
                }, 2000);
            }).catch(() => {
                button.textContent = 'Error';
                setTimeout(() => {
                    button.textContent = 'Copy';
                }, 2000);
            });
        });

        // Add button to the window container
        windowContainer.appendChild(button);
    }

    // Function to process all code blocks
    function processCodeBlocks() {
        const codeBlocks = document.querySelectorAll('.window_container');
        codeBlocks.forEach(addClipboardButton);
    }

    // Initial processing
    processCodeBlocks();

    // Observer for dynamically added content
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    // Check if the added node is a code block container
                    if (node.classList && node.classList.contains('window_container')) {
                        addClipboardButton(node);
                    }
                    // Check if the added node contains code block containers
                    const codeBlocks = node.querySelectorAll && node.querySelectorAll('.window_container');
                    if (codeBlocks) {
                        codeBlocks.forEach(addClipboardButton);
                    }
                }
            });
        });
    });

    // Start observing
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
