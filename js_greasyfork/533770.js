// ==UserScript==
// @name         8chan /pol/ URL Cleaner
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Fixes URLs with (.) before TLDs on 8chan.moe and 8chan.se /pol/ board
// @author       Leafanon
// @match        https://8chan.moe/pol/res/*
// @match        https://8chan.se/pol/res/*
// @grant        none
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/533770/8chan%20pol%20URL%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/533770/8chan%20pol%20URL%20Cleaner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to fix URLs in text content and href attributes
    function fixUrl(url) {
        return url.replace(/\(\.\)(org|com|net)/gi, '.$1');
    }

    // Process all links on the page
    function processLinks() {
        const links = document.querySelectorAll('a[href*="(.)"]');
        links.forEach(link => {
            // Fix href attribute
            if (link.href.includes('(.)')) {
                link.href = fixUrl(link.href);
            }
            // Fix text content if it contains the same pattern
            if (link.textContent.includes('(.)')) {
                link.textContent = fixUrl(link.textContent);
            }
        });

        // Also process text nodes that might contain these URLs but aren't links yet
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        let node;
        while (node = walker.nextNode()) {
            if (node.nodeValue.includes('(.)') && 
                (node.nodeValue.includes('.com') || node.nodeValue.includes('.org') || node.nodeValue.includes('.net'))) {
                const parent = node.parentNode;
                if (parent.nodeName !== 'A' && parent.nodeName !== 'SCRIPT' && parent.nodeName !== 'STYLE') {
                    const newValue = fixUrl(node.nodeValue);
                    if (newValue !== node.nodeValue) {
                        // Replace the text node with HTML that may contain links
                        const temp = document.createElement('div');
                        temp.innerHTML = newValue.replace(/(https?:\/\/[^\s]+)/g, '<a target="_blank" href="$1">$1</a>');
                        parent.replaceChild(temp, node);
                    }
                }
            }
        }
    }

    // Run initially and also observe DOM changes for dynamically loaded content
    processLinks();

    // Use MutationObserver to handle dynamically loaded content
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                processLinks();
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();