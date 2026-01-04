// ==UserScript==
// @name         XCancel.com to X.com Redirector
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Redirects XCancel.com links to X.com
// @author       drowned1
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532162/XCancelcom%20to%20Xcom%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/532162/XCancelcom%20to%20Xcom%20Redirector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const sourceDomain = 'xcancel.com';
    const targetDomain = 'x.com';
    const sourceHrefSelector = `a[href*="${sourceDomain}"]`;

    // Function to replace links and text within a specific element or node list
    function replaceInElements(elements) {
        if (!elements) return;

        // Ensure elements is iterable (NodeList, Array, or single element)
        const elementList = (elements instanceof Node || typeof elements.forEach !== 'function') ? [elements] : elements;

        elementList.forEach(element => {
            // Only process element nodes
            if (element.nodeType !== Node.ELEMENT_NODE) return;

            // Replace href attributes in anchor tags within the element or if it is an anchor itself
            if (element.matches && element.matches(sourceHrefSelector)) {
                 if (element.href.includes(sourceDomain)) {
                    element.href = element.href.replace(sourceDomain, targetDomain);
                 }
            }
            const links = element.querySelectorAll(sourceHrefSelector);
            links.forEach(link => {
                if (link.href.includes(sourceDomain)) {
                    link.href = link.href.replace(sourceDomain, targetDomain);
                }
            });

            // --- Optional Text Replacement (More Performant but still potentially heavy) ---
            // Consider if text replacement is truly necessary, as it's more complex and performance-intensive.
            // This version uses TreeWalker scoped to the current element.
            /*
            const walker = document.createTreeWalker(
                element,
                NodeFilter.SHOW_TEXT,
                { acceptNode: function(node) {
                    // Skip nodes inside script/style tags and check for the source domain
                    const parentTag = node.parentElement?.tagName?.toLowerCase();
                    if (parentTag !== 'script' && parentTag !== 'style' && node.nodeValue.includes(sourceDomain)) {
                        return NodeFilter.FILTER_ACCEPT;
                    }
                    return NodeFilter.FILTER_REJECT;
                  }
                },
                false
            );

            let node;
            while (node = walker.nextNode()) {
                node.nodeValue = node.nodeValue.replace(new RegExp(sourceDomain.replace('.', '\\.'), 'g'), targetDomain);
            }
            */
            // --- End Optional Text Replacement ---
        });
    }

    // Initial run on existing content when DOM is ready
    function runInitialScan() {
        // Use querySelectorAll directly on the document for the initial scan
        const initialLinks = document.querySelectorAll(sourceHrefSelector);
        initialLinks.forEach(link => {
             if (link.href.includes(sourceDomain)) {
                link.href = link.href.replace(sourceDomain, targetDomain);
             }
        });

        // If enabling text replacement, uncomment the initial text scan:
        /*
        replaceInElements(document.body); // Run text replacement on the whole body once initially
        */
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runInitialScan);
    } else {
        runInitialScan();
    }

    // Optimized MutationObserver: Process only added nodes
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                 // Process only the nodes that were actually added
                 replaceInElements(mutation.addedNodes);
            }
            // Note: CharacterData mutations are ignored here for performance.
            // If text replacement within existing nodes is crucial, you'd need
            // to handle mutation.type === 'characterData' carefully,
            // potentially checking mutation.target and its parent elements.
        }
    });

    // Observe the body once it exists
    const observerConfig = { childList: true, subtree: true };
    if (document.body) {
        observer.observe(document.body, observerConfig);
    } else {
        // If body doesn't exist yet (e.g., @run-at document-start), wait for it.
        new MutationObserver((_, obs) => {
            if (document.body) {
                observer.observe(document.body, observerConfig);
                // Also run the initial scan now that the body exists, in case DOMContentLoaded fired early
                runInitialScan();
                obs.disconnect(); // Stop observing the document element
            }
        }).observe(document.documentElement, { childList: true });
    }


    // --- Intercept network requests (Optimized with checks) ---

    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        if (url && typeof url === 'string' && url.includes(sourceDomain)) {
            arguments[1] = url.replace(sourceDomain, targetDomain);
        }
        return originalOpen.apply(this, arguments);
    };

    const originalFetch = window.fetch;
    window.fetch = function(input, init) {
        let url = input instanceof Request ? input.url : input;
        let request = input instanceof Request ? input : null;

        if (typeof url === 'string' && url.includes(sourceDomain)) {
            const newUrl = url.replace(sourceDomain, targetDomain);
            if (request) {
                 // Clone Request object with modified URL
                 const newRequestInit = {};
                 // Manually list properties to clone for broader compatibility
                 ['method', 'headers', 'body', 'mode', 'credentials', 'cache', 'redirect', 'referrer', 'integrity', 'keepalive', 'signal'].forEach(prop => {
                     if (request[prop] !== undefined) {
                        newRequestInit[prop] = request[prop];
                     }
                 });
                 arguments[0] = new Request(newUrl, newRequestInit);
            } else {
                arguments[0] = newUrl;
            }
        }
        return originalFetch.apply(this, arguments);
    };

    // --- Cleanup ---
    window.addEventListener('unload', () => {
        if (observer) {
            observer.disconnect();
        }
    });

})();