// ==UserScript==
// @name         Jira URL Linkifier
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Make plain-text URLs in Jira comments and descriptions clickable, including http(s), ftp, mailto, and www
// @author       OpenAI
// @match        https://configura.atlassian.net/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/534972/Jira%20URL%20Linkifier.user.js
// @updateURL https://update.greasyfork.org/scripts/534972/Jira%20URL%20Linkifier.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const urlRegex = /(?<!["'>])((?:https?|ftp|file|mailto):\/\/[^\s<>"']+|www\.[^\s<>"']+)/gi;
    const urlRegex2 = /^(https?|ftp|file):\/\/[^\s<>"']+$/i;
    const desc = "#issue-view-layout-templates-tabs-0-tab > div > div:nth-child(1) > div > div > div._1b0m53f4 > div > div > div > div > form > div > div > div > div > div > div > div.css-hf5m2h > div";

    function linkifyTextNodes(root) {
        const treeWalker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
            acceptNode: function(node) {
                return urlRegex.test(node.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
            }
        });

        const textNodes = [];
        while (treeWalker.nextNode()) {
            textNodes.push(treeWalker.currentNode);
        }

        textNodes.forEach(node => {
            const parent = node.parentElement;
            if (!parent || parent.closest('a')) return; // skip if inside a link

            const span = document.createElement('span');
            span.innerHTML = node.nodeValue.replace(urlRegex, match => {
                const href = match.startsWith('www.') ? `http://${match}` : match;
                const displayText = decodeURIComponent(match);
                return `<a href="${href}" target="_blank" rel="noopener noreferrer">${displayText}</a>`;
            });

            parent.replaceChild(span, node);
        });
    }


    function getFilenameFromUrl(url) {
        try {
            const cleanUrl = new URL(url);
            const segments = cleanUrl.pathname.split('/');
            const filename = segments.pop() || segments.pop(); // handle trailing slash
            return decodeURIComponent(filename);
        } catch (e) {
        }
    }

    function simplifyAnchorText(root) {
        const anchors = root.querySelectorAll('a[href]');
        anchors.forEach(anchor => {
            const href = anchor.getAttribute('href');
            const currentText = anchor.textContent.trim();

            // Normalize both href and text for accurate comparison
            const decodedHref = decodeURIComponent(href);

            if (href && (currentText === href || currentText === decodedHref) && urlRegex2.test(href)) {
                anchor.textContent = getFilenameFromUrl(href);
            }
        });
    }

    function scanPage() {
        const contentRoot = document.querySelector('#ak-main-content') || document.body;
        if (contentRoot) {
            linkifyTextNodes(contentRoot);
            simplifyAnchorText(contentRoot);
        }
    }

    // For that pesky modal
    function scanPageCombined() {
        const root1 = document.querySelector('#ak-main-content') || document.body;
        const root2 = document.querySelector("#jira > div.atlaskit-portal-container > div:nth-child(3) > div > div:nth-child(2) > div");

        const uniqueRoots = new Set([root1, root2]);

        uniqueRoots.forEach(contentRoot => {
            if (contentRoot) {
                linkifyTextNodes(contentRoot);
                simplifyAnchorText(contentRoot);
            }
    });
}

    // Initial run
    scanPage();

    // Watch for content changes
    const observer = new MutationObserver(scanPageCombined);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();