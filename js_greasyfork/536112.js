// ==UserScript==
// @name         Fix Broken Zillow Links on Reddit
// @namespace    https://greasyfork.org/users/livejamie
// @version      1.0
// @description  Fixes broken Zillow links on Reddit caused by backslashes (e.g. \_zpid)
// @author       livejamie
// @license      MIT
// @match        https://*.reddit.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536112/Fix%20Broken%20Zillow%20Links%20on%20Reddit.user.js
// @updateURL https://update.greasyfork.org/scripts/536112/Fix%20Broken%20Zillow%20Links%20on%20Reddit.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function fixZillowLinks() {
        // Fix <a> tags with backslashes in href or text
        document.querySelectorAll('a[href*="zillow.com"]').forEach(a => {
            if (a.href.includes('\\_zpid')) {
                a.href = a.href.replace(/\\_zpid/, '_zpid');
            }
            if (a.textContent.includes('\\_zpid')) {
                a.textContent = a.textContent.replace(/\\_zpid/, '_zpid');
            }
        });

        // Convert broken plain text Zillow URLs to real links
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        let node;
        while ((node = walker.nextNode())) {
            if (node.nodeValue.includes('zillow.com') && node.nodeValue.includes('\\_zpid')) {
                const fixedText = node.nodeValue.replace(/\\_zpid/g, '_zpid');
                const parent = node.parentNode;
                const zillowRegex = /(https:\/\/www\.zillow\.com\/[^\s)]+)/g;
                const span = document.createElement('span');
                span.innerHTML = fixedText.replace(zillowRegex, (match) => {
                    const clean = match.replace(/\\_zpid/g, '_zpid');
                    return `<a href="${clean}" target="_blank">${clean}</a>`;
                });
                parent.replaceChild(span, node);
            }
        }
    }

    fixZillowLinks();
    const observer = new MutationObserver(fixZillowLinks);
    observer.observe(document.body, { childList: true, subtree: true });
})();
