// ==UserScript==
// @name         Copy short commit hash
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add "copy short commit hash" button to PRs "commits" page
// @author       eliduvid
// @match        https://github.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/507606/Copy%20short%20commit%20hash.user.js
// @updateURL https://update.greasyfork.org/scripts/507606/Copy%20short%20commit%20hash.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (!/commits\/?$/.test(document.location.pathname)) {
        return;
    }

    // Function to create a button element
    function createCopyButton(hash) {
        const button = document.createElement('button');
        button.className = 'Button Button--iconOnly Button--invisible Button--small';
        button.setAttribute('aria-label', `Copy short SHA for ${hash.substring(0, 8)}`);
        button.style.marginLeft = '4px';

        // Create SVG icon
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('aria-hidden', 'true');
        svg.setAttribute('height', '16');
        svg.setAttribute('viewBox', '0 0 16 16');
        svg.setAttribute('version', '1.1');
        svg.setAttribute('width', '16');
        svg.setAttribute('fill', 'currentColor');
        svg.innerHTML = '<path fill-rule="evenodd" d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 010 1.5h-1.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-1.5a.75.75 0 011.5 0v1.5A1.75 1.75 0 019.25 16h-7.5A1.75 1.75 0 010 14.25v-7.5z"></path><path fill-rule="evenodd" d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0114.25 11h-7.5A1.75 1.75 0 015 9.25v-7.5zm1.75-.25a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25h-7.5z"></path>';

        button.appendChild(svg);

        // Create tooltip
        const tooltip = document.createElement('span');
        tooltip.className = 'Tooltip__StyledTooltip-sc-17tf59c-0 izAlVj tooltipped-s';
        tooltip.setAttribute('aria-label', `Copy short SHA for ${hash.substring(0, 8)}`);

        button.onclick = function() {
            navigator.clipboard.writeText(hash.substring(0, 8))
                .then(() => {
                // Visual feedback
                const originalTooltip = tooltip.getAttribute('aria-label');
                tooltip.setAttribute('aria-label', 'Copied!');
                button.classList.add('Button--primary');
                setTimeout(() => {
                    tooltip.setAttribute('aria-label', originalTooltip);
                    button.classList.remove('Button--primary');
                }, 2000);
            })
                .catch(err => {
                console.error('Failed to copy: ', err);
            });
        };

        tooltip.appendChild(button);
        return tooltip;
    }

    // Function to process a single commit row
    function processCommitRow(row) {
        // Check if the button has already been added
        if (row.querySelector('.copy-sha-button')) return;

        // Find the commit hash link
        const hashLink = row.querySelector('a[href*="/commits/"]');
        if (hashLink) {
            // Extract full hash from the link's href attribute
            const fullHash = hashLink.href.split('/').pop();
            // Create and append the copy button
            const copyButton = createCopyButton(fullHash);
            copyButton.classList.add('copy-sha-button'); // Add a class for easy identification
            hashLink.parentNode.appendChild(copyButton);
        }
    }

    // Function to process all commit rows
    function processAllCommitRows() {
        const commitRows = document.querySelectorAll('li[data-testid="commit-row-item"]');
        commitRows.forEach(processCommitRow);
    }

    // Initial processing
    processAllCommitRows();

    // Set up a MutationObserver to watch for changes
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // Check if the added node is a commit row
                        if (node.matches('li[data-testid="commit-row-item"]')) {
                            processCommitRow(node);
                        } else {
                            // Check for commit rows within the added node
                            const commitRows = node.querySelectorAll('li[data-testid="commit-row-item"]');
                            commitRows.forEach(processCommitRow);
                        }
                    }
                });
            }
        });
    });

    // Start observing the document with the configured parameters
    observer.observe(document.body, { childList: true, subtree: true });
})();