// ==UserScript==
// @name         DeepSeek No Auto-Scroll
// @description  Block auto-scroll in DeepSeek while keeping manual scroll control
// @match        *://*.deepseek.com/*
// @version 0.0.1.20250514122428
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/527091/DeepSeek%20No%20Auto-Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/527091/DeepSeek%20No%20Auto-Scroll.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function applyNoAutoScroll(scrollContainer) {
        Object.defineProperty(scrollContainer, 'scrollTop', {
            set: function() {}, 
            get: () => scrollContainer._realScrollTop || 0,
            configurable: true
        });
        scrollContainer.addEventListener('scroll', () => {
            scrollContainer._realScrollTop = scrollContainer.scrollTop;
        });
    }

    // Create and start one observer
    const observer = new MutationObserver(() => {
        const scrollContainers = document.querySelectorAll('div.scrollable');
        scrollContainers.forEach(container => {
            if (!container._noAutoScrollApplied) {
                container._noAutoScrollApplied = true;
                applyNoAutoScroll(container);
            }
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Also run once immediately in case containers already exist
    document.querySelectorAll('div.scrollable').forEach(container => {
        if (!container._noAutoScrollApplied) {
            container._noAutoScrollApplied = true;
            applyNoAutoScroll(container);
        }
    });
})();