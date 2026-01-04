// ==UserScript==
// @name         Google Search cookie auto-reject
// @namespace    http://tampermonkey.net/
// @version      0.2.5
// @description  Automatically rejects Google Search's cookie banner
// @author       Glitchii (https://github.com/Glitchii/)
// @match        https://www.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452129/Google%20Search%20cookie%20auto-reject.user.js
// @updateURL https://update.greasyfork.org/scripts/452129/Google%20Search%20cookie%20auto-reject.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const selector = '[aria-label="Before you continue to Google Search"]';
    const style = document.createElement('style');

    style.textContent = `${selector} { display: none !important; }`

    addEventListener('load', reject);
    addEventListener('DOMContentLoaded', () => {
        document.head.appendChild(style);
        reject();
    });

    const observer = new MutationObserver(reject);
    observer.observe(document.body, { childList: true, subtree: true });

    function reject() {
        for (const el of document.querySelectorAll(selector)) {
            const rejectBtn = document.evaluate('//button[contains(., "Reject all")]', document.body).iterateNext();

            if (rejectBtn) {
                rejectBtn?.click();
                observer.disconnect();
            }
        };
    }
})();