// ==UserScript==
// @name         Mobile Pull Down to Refresh
// @namespace    TW9iaWxlIFB1bGwgRG93biB0byBSZWZyZXNo
// @version      1.2
// @description  Enables pull-down-to-refresh on mobile browsers. Swipe down to reload the page, mimicking native app behavior.
// @author       smed79
// @license      GPLv3
// @icon         https://i25.servimg.com/u/f25/11/94/21/24/pd2r10.png
// @homepage     https://greasyfork.org/en/scripts/545016-mobile-pull-down-to-refresh
// @include      http://*
// @include      https://*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545016/Mobile%20Pull%20Down%20to%20Refresh.user.js
// @updateURL https://update.greasyfork.org/scripts/545016/Mobile%20Pull%20Down%20to%20Refresh.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Domains to exclude from pull-to-refresh
    // Examples:
    //   'example.com' excludes that domain
    //   'example.*' matches example.com, example.net, etc.
    const excludedDomains = [
        'greasyfork.org',
        'copilot.microsoft.com',
        'gemini.google.com',
        'grok.com',
        'translate.google.*',
    ];

    // Subdomains to exclude
    // Examples:
    //   '*.example.com' matches blog.example.com, shop.example.com, etc.
    const excludedSubdomains = [
        '*.translate.goog',
    ];

    // Check if current site matches any exclusion pattern
    function isExcludedSite(hostname) {
        for (const pattern of excludedSubdomains) {
            const regex = new RegExp(
                '^' + pattern.replace(/\./g, '\\.').replace('*', '[^.]+') + '$',
                'i'
            );
            if (regex.test(hostname)) return true;
        }

        for (const pattern of excludedDomains) {
            const regex = new RegExp(
                '^((www\\.)?)' + pattern.replace(/\./g, '\\.').replace('*', '[^.]+') + '$',
                'i'
            );
            if (regex.test(hostname)) return true;
        }

        return false;
    }

    // Exit early if current site is excluded
    if (isExcludedSite(location.hostname)) return;

    let startY = 0;
    let isPulling = false;
    const threshold = 80; // Minimum pull distance in pixels to trigger refresh
    let cooldown = false; // Prevents rapid reloads

    // Check if an element is scrollable (e.g. input or textarea)
    function isScrollableElement(el) {
        const tag = el.tagName.toLowerCase();
        if (tag === 'textarea' || tag === 'input') return true;

        const style = window.getComputedStyle(el);
        return (
            style.overflowY === 'scroll' ||
            style.overflowY === 'auto' ||
            el.scrollHeight > el.clientHeight
        );
    }

    // Detect start of touch gesture
    document.addEventListener('touchstart', (e) => {
        const target = e.target;

        // Skip if interacting with scrollable elements
        if (isScrollableElement(target)) {
            isPulling = false;
            return;
        }

        // Only activate if scrolled to top
        if (window.scrollY === 0 && !cooldown) {
            startY = e.touches[0].clientY;
            isPulling = true;
        }
    });

    // Detect pull gesture movement
    document.addEventListener('touchmove', (e) => {
        if (!isPulling) return;

        const currentY = e.touches[0].clientY;
        const distance = currentY - startY;

        if (distance > threshold) {
            isPulling = false;
            cooldown = true;
            location.reload();

            // Cooldown to prevent rapid reloads
            setTimeout(() => {
                cooldown = false;
            }, 3000); // 3 seconds
        }
    });

    // Reset gesture tracking on touch end
    document.addEventListener('touchend', () => {
        isPulling = false;
    });
})();
