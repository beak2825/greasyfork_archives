// ==UserScript==
// @name         Replace spam on page load with Placeholder
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Hides spam with specific phrases and replaces them with a placeholder. Works for chats, threads, chans, etc. Dynamic and case-insensitive matching. Page load faster when spam is removed
// @author       CronosusCZ
// @match        *://*/*
// @grant        none
// @run-at       document-end
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/543614/Replace%20spam%20on%20page%20load%20with%20Placeholder.user.js
// @updateURL https://update.greasyfork.org/scripts/543614/Replace%20spam%20on%20page%20load%20with%20Placeholder.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 🔧 Edit these phrases
    const phrasesToRemove = [
        "some spam",
        "you want to",
        "remove from page"
    ];

    const regexList = phrasesToRemove.map(p =>
        new RegExp(p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') // case-insensitive
    );

    const PLACEHOLDER_TEXT = '[Spam - Removed]';

    // 🔍 Heuristic container finder
    function findMessageContainer(node) {
        while (node && node !== document.body) {
            if (
                node.tagName === 'TR' ||
                node.tagName === 'LI' ||
                node.tagName === 'ARTICLE' ||
                node.classList?.contains('post') ||
                node.classList?.contains('reply') ||
                node.classList?.contains('message') ||
                node.classList?.contains('chat-line__message') ||
                node.classList?.contains('c-message') ||
                node.classList?.contains('comment') ||
                node.classList?.contains('tweet') ||
                node.classList?.contains('feed-item') ||
                (node.nodeType === 1 && node.parentNode?.childElementCount > 1)
            ) {
                return node;
            }
            node = node.parentNode;
        }
        return null;
    }

    // 💣 Replace container with placeholder if phrase matches
    function scanAndReplace(node) {
        if (!node || !node.textContent) return;

        for (const regex of regexList) {
            if (regex.test(node.textContent)) {
                const container = findMessageContainer(node);
                if (container && !container.dataset._autoHidden) {
                    container.dataset._autoHidden = 'true';

                    const placeholder = document.createElement('div');
                    placeholder.textContent = PLACEHOLDER_TEXT;
                    placeholder.style.color = 'gray';
                    placeholder.style.fontStyle = 'italic';
                    placeholder.style.fontSize = '0.9em';
                    placeholder.style.padding = '4px';
                    placeholder.style.border = '1px dashed #aaa';
                    placeholder.style.margin = '4px 0';

                    container.replaceWith(placeholder);

                    console.log('[AutoHide] Replaced post with placeholder for:', regex);
                }
            }
        }
    }

    // 🌲 Walk through all text nodes
    function walkAndClean(root) {
        const walker = document.createTreeWalker(
            root,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        const nodesToCheck = [];
        let node;
        while ((node = walker.nextNode())) {
            nodesToCheck.push(node);
        }

        for (const n of nodesToCheck) {
            scanAndReplace(n);
        }
    }

    // 🔁 MutationObserver for dynamic content
    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            for (const added of mutation.addedNodes) {
                if (added.nodeType === Node.TEXT_NODE) {
                    scanAndReplace(added);
                } else if (added.nodeType === Node.ELEMENT_NODE) {
                    walkAndClean(added);
                }
            }
        }
    });

    // 🚀 Initial run
    walkAndClean(document.body);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
