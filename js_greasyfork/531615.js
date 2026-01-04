// ==UserScript==
// @name         X.com to XCancel.com Redirector
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Replaces xcancel.com links with xcancel.com
// @author       Cucco
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/531615/Xcom%20to%20XCancelcom%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/531615/Xcom%20to%20XCancelcom%20Redirector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to replace all xcancel.com links in DOM elements
    function replaceXLinks() {
        // Replace href attributes in anchor tags
        const links = document.querySelectorAll('a[href*="xcancel.com"]');
        links.forEach(link => {
            link.href = link.href.replace(/x\.com/g, 'xcancel.com');
        });

        // Replace xcancel.com in text content (optional)
        const textNodes = [];
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        let node;
        while (node = walker.nextNode()) {
            if (node.nodeValue.includes('xcancel.com')) {
                textNodes.push(node);
            }
        }

        textNodes.forEach(node => {
            node.nodeValue = node.nodeValue.replace(/x\.com/g, 'xcancel.com');
        });
    }

    // Run when DOM is loaded
    document.addEventListener('DOMContentLoaded', replaceXLinks);

    // Also run periodically to catch dynamically added content
    setInterval(replaceXLinks, 2000);

    // Intercept and modify URL before navigation
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function() {
        if (arguments[1] && typeof arguments[1] === 'string') {
            arguments[1] = arguments[1].replace(/x\.com/g, 'xcancel.com');
        }
        return originalOpen.apply(this, arguments);
    };

    // Intercept fetch requests
    const originalFetch = window.fetch;
    window.fetch = function() {
        if (arguments[0] && typeof arguments[0] === 'string') {
            arguments[0] = arguments[0].replace(/x\.com/g, 'xcancel.com');
        } else if (arguments[0] && arguments[0] instanceof Request) {
            arguments[0] = new Request(
                arguments[0].url.replace(/x\.com/g, 'xcancel.com'),
                arguments[0]
            );
        }
        return originalFetch.apply(this, arguments);
    };
})();