// ==UserScript==
// @name         Aliexpress US  URL Cleaner
// @version      0.6
// @description  Removes unnecessary parameters from Aliexpress URLs
// @author       Hikaru4v
// @match        *://*.aliexpress.com/*
// @match        *://*.aliexpress.us/*
// @namespace    https://greasyfork.org/users/168
// @run-at       document-start
// @noframes
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/504177/Aliexpress%20US%20%20URL%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/504177/Aliexpress%20US%20%20URL%20Cleaner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function whenReady() {
        return new Promise((resolve) => {
            function completed() {
                document.removeEventListener('DOMContentLoaded', completed);
                window.removeEventListener('load', completed);
                resolve();
            }

            if (document.readyState === 'complete' || document.readyState === 'interactive') {
                resolve();
            } else {
                document.addEventListener('DOMContentLoaded', completed);
                window.addEventListener('load', completed);
            }
        });
    }

    // Updated regex to match only the core part of the URL
    function toCanonical(original) {
        let reg = /((?:https?:)?\/\/(?:\w+\.)?aliexpress\.(?:com|us)\/(?:store\/product\/[^\/]+\/\d+|item\/(?:[^\/]+\/)?\d+)\.html)(#.+)?/i;
        let match = original.match(reg);
        if (match) {
            return match[1] + (match[2] || ''); // Keep the hash fragment if present
        }
        return null;
    }

    whenReady().then(() => {
        // Clean current tab URL
        let canonical = toCanonical(window.location.href);
        if (!canonical) {
            let link = document.querySelector('head > link[rel=canonical]');
            if (link) {
                canonical = toCanonical(link.href + window.location.hash);
            }
        }
        if (canonical && window.location.href !== canonical) {
            window.history.replaceState(history.state, document.title, canonical);
        }

        // Clean static HTML links
        document.querySelectorAll('a').forEach(e => {
            if (e.href) {
                let cleaned = toCanonical(e.href);
                if (cleaned && e.href !== cleaned) {
                    e.href = cleaned;
                }
            }
        });

        // Observe dynamic changes to the DOM and clean URLs
        const observer = new MutationObserver(mutations => {
            for (let mutation of mutations) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        cleanAndTraverse(node);
                    });
                } else if (mutation.type === 'attributes' && mutation.target.tagName === 'A') {
                    cleanNodeHref(mutation.target);
                }
            }
        });

        function cleanAndTraverse(node) {
            if (node.nodeType === 1) { // Ensure it's an element node
                cleanNodeHref(node);
                node.querySelectorAll('a').forEach(child => cleanNodeHref(child));
            }
        }

        function cleanNodeHref(elem) {
            if (elem.tagName === 'A' && elem.href) {
                let cleaned = toCanonical(elem.href);
                if (cleaned && elem.href !== cleaned) {
                    elem.href = cleaned;
                }
            }
        }

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['href']
        });
    });
})();
