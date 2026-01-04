// ==UserScript==
// @name         Stack Overflow Copy Code
// @namespace    https://t.me/OneFinalHug
// @version      0.3
// @license      MIT
// @description  Add copy button to copy code inside Stack Overflow answers
// @author       OFH
// @match        https://stackoverflow.com/questions/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475302/Stack%20Overflow%20Copy%20Code.user.js
// @updateURL https://update.greasyfork.org/scripts/475302/Stack%20Overflow%20Copy%20Code.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createCopyCodeButton() {
        const codeBlocks = document.querySelectorAll('pre code');

        codeBlocks.forEach(codeBlock => {
            const codeContainer = codeBlock.parentNode;
            
            const copyButton = document.createElement('button');
            copyButton.textContent = 'Copy Code';
            copyButton.classList.add('copy-code-button');

            copyButton.addEventListener('click', () => {
                const codeText = codeBlock.textContent;
                navigator.clipboard.writeText(codeText)
                    .then(() => {
                        copyButton.textContent = 'Copied!';
                        setTimeout(() => {
                            copyButton.textContent = 'Copy Code';
                        }, 2000);
                    })
                    .catch(err => {
                        console.error('Failed to copy code: ', err);
                    });
            });

            codeContainer.style.position = 'relative';
            copyButton.style.position = 'absolute';
            copyButton.style.top = '5px';
            copyButton.style.right = '5px';

            codeContainer.appendChild(copyButton);
        });
    }

    const customStyles = `
        .copy-code-button {
            background-color: #f2f2f2;
            border: none;
            border-radius: 3px;
            padding: 5px 10px;
            cursor: pointer;
            font-size: 12px;
        }
        .copy-code-button:hover {
            background-color: #ddd;
        }
    `;

    const styleElement = document.createElement('style');
    styleElement.type = 'text/css';
    styleElement.appendChild(document.createTextNode(customStyles));
    document.head.appendChild(styleElement);

    window.addEventListener('load', createCopyCodeButton);
})();