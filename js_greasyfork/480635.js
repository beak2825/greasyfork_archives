// ==UserScript==
// @name         Copy Button for Code Blocks on Azure DevOps
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Add a copy button for every code highlighting block in Markdown on Azure DevOps
// @author       You
// @match        https://dev.azure.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/480635/Copy%20Button%20for%20Code%20Blocks%20on%20Azure%20DevOps.user.js
// @updateURL https://update.greasyfork.org/scripts/480635/Copy%20Button%20for%20Code%20Blocks%20on%20Azure%20DevOps.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addCopyButtonToCodeBlock(codeBlock) {
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-btn';

        // Use the Fluent "Copy" icon
        copyButton.innerHTML = '<span aria-hidden="true" class="type-icon fontSizeML flex-noshrink fabric-icon ms-Icon--Copy"></span> <span style="vertical-align: middle;">Copy</span>';

        copyButton.onclick = function () {
            copyToClipboard(codeBlock.innerText);
        };

        // Modern styling
        copyButton.style.backgroundColor = '#007acc'; // Azure DevOps color
        copyButton.style.border = 'none';
        copyButton.style.color = '#fff';
        copyButton.style.padding = '8px';
        copyButton.style.borderRadius = '4px';
        copyButton.style.cursor = 'pointer';
        copyButton.style.display = 'flex'; // Use flexbox for centering

        // Align items vertically in the center
        copyButton.style.alignItems = 'center';

        // Position the button at the top right of the code block
        copyButton.style.position = 'absolute';
        copyButton.style.top = '8px';
        copyButton.style.right = '8px';

        codeBlock.parentNode.style.position = 'relative'; // Ensure the parent has a relative position

        codeBlock.parentNode.insertBefore(copyButton, codeBlock);

        // Add some padding to the code block to prevent overlap with the button
        codeBlock.style.paddingTop = '30px';
    }

    // Function to copy text to clipboard
    function copyToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Code copied to clipboard!');
    }

    function processCodeBlocks() {
        const codeBlocks = document.querySelectorAll('pre code:not(.copy-processed)');
        codeBlocks.forEach((codeBlock) => {
            addCopyButtonToCodeBlock(codeBlock);
            codeBlock.classList.add('copy-processed');
        });
    }

    // Observe changes to the DOM and add copy buttons when code blocks are added
    const observer = new MutationObserver(processCodeBlocks);
    const config = { childList: true, subtree: true };
    observer.observe(document.body, config);

    // Add copy buttons for code blocks on initial script execution
    processCodeBlocks();
})();
