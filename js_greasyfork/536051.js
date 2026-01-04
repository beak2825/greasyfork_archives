// ==UserScript==
// @name         Remove delfi ads
// @namespace    http://tampermonkey.net/
// @version      1.1
// @author       TheBlaster1337
// @description  Cause nobody wants to see them
// @match        https://www.delfi.lt/*
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=delfi.lt
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/536051/Remove%20delfi%20ads.user.js
// @updateURL https://update.greasyfork.org/scripts/536051/Remove%20delfi%20ads.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const blockedPrefix = 'https://www.delfi.lt/misc/export/qwerty/';

    // Block fetch
    const originalFetch = window.fetch;
    window.fetch = function(input, init) {
        const url = typeof input === 'string' ? input : input.url;
        if (url && url.startsWith(blockedPrefix)) {
            console.log('[BLOCKED - fetch]', url);
            return new Promise(() => {});
        }
        return originalFetch.apply(this, arguments);
    };

    // Block XMLHttpRequest
    const originalXHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        if (url && url.startsWith(blockedPrefix)) {
            console.log('[BLOCKED - XHR]', url);
            return;
        }
        return originalXHROpen.apply(this, arguments);
    };

    // Remove elements with background-image that includes the blocked URL
    function removeElementsWithBlockedBackgrounds(root = document.body) {
        if (!root || !root.querySelectorAll) return;

        const elements = root.querySelectorAll('*');
        elements.forEach(el => {
            const style = window.getComputedStyle(el);
            const bg = style.getPropertyValue('background-image');
            if (bg && bg.includes(blockedPrefix)) {
                console.log('[REMOVED - background-image]', bg);
                el.remove();
            }
        });
    }

    // Observe DOM for dynamic injections
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (!(node instanceof HTMLElement)) return;

                const src = node.src || '';
                if (src.startsWith(blockedPrefix)) {
                    console.log('[REMOVED - dynamic src]', src);
                    node.remove();
                    return;
                }

                removeElementsWithBlockedBackgrounds(node);
            });
        });
    });

    observer.observe(document.documentElement || document.body, {
        childList: true,
        subtree: true
    });

    // Initial scan
    window.addEventListener('load', () => {
        removeElementsWithBlockedBackgrounds();
    });

    console.log('✅ Delfi Ad blocker active');
})();
