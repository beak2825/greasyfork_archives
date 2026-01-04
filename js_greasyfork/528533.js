// ==UserScript==
// @name         DeepSeek Auto-Regenerate (Minimal)
// @description  Automatically click the “重新生成” button when DeepSeek shows “The server is busy. Please try again later.”
// @match        *://*.deepseek.com/*
// @match        *://*.deepseek.ai/*
// @run-at       document-idle
// @version 0.0.1.20250514105945
// @namespace http://deepseek.auto.regenerate
// @downloadURL https://update.greasyfork.org/scripts/528533/DeepSeek%20Auto-Regenerate%20%28Minimal%29.user.js
// @updateURL https://update.greasyfork.org/scripts/528533/DeepSeek%20Auto-Regenerate%20%28Minimal%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function tryClickRegen(p) {
        // find the next sibling wrapper containing the icon buttons
        const wrapper = p.parentElement.nextElementSibling;
        if (!wrapper) return;

        // inside that wrapper, find the SVG <rect> whose id is "重新生成"
        const regenRect = wrapper.querySelector('rect[id="重新生成"]');
        if (!regenRect) return;

        // climb up to the clickable .ds-icon-button
        const button = regenRect.closest('.ds-icon-button');
        if (!button) return;

        // click with a small delay
        setTimeout(() => button.click(), 300);
        console.log('DeepSeek Auto: clicked 重新生成');
    }

    function scanForBusy() {
        document.querySelectorAll('p.ds-markdown-paragraph').forEach(p => {
            if (p.textContent.trim() === 'The server is busy. Please try again later.') {
                tryClickRegen(p);
            }
        });
    }

    // observe DOM changes for new busy messages
    const observer = new MutationObserver(scanForBusy);
    observer.observe(document.body, { childList: true, subtree: true });

    // initial scan in case message is already present
    setTimeout(scanForBusy, 1000);
})();
