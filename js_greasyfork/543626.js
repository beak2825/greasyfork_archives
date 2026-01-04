// ==UserScript==
// @name         6bt06bt0
// @namespace    http://tampermonkey.net/
// @version      2025-08-31
// @description  For the real data in page
// @author       You
// @match        *://*.6bt0.com/*
// @match        *://*.mukaku.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543626/6bt06bt0.user.js
// @updateURL https://update.greasyfork.org/scripts/543626/6bt06bt0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function hideAndClear() {
        const vipGate = document.querySelector('.vip-gate-overlay');
        if (vipGate) {
            vipGate.style.display = 'none';
        }

        const blurredContent = document.querySelector('[style*="filter: blur(5px)"]');
        if (blurredContent) {
            blurredContent.style.filter = 'none';
            blurredContent.style.pointerEvents = 'auto';
            blurredContent.style.userSelect = 'auto';
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(hideAndClear, 1000));
    } else {
        setTimeout(hideAndClear, 1000);
    }

    const observer = new MutationObserver(hideAndClear);
    observer.observe(document.body, { childList: true, subtree: true });
})();