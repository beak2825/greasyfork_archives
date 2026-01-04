// ==UserScript==
// @name         Trademo.io wheel clickable
// @namespace    http://tampermonkey.net/
// @version      2025-07-10
// @description  Make links wheel clickable
// @author       vitalto
// @match        https://trademo.io/bank-profiles*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=trademo.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542120/Trademoio%20wheel%20clickable.user.js
// @updateURL https://update.greasyfork.org/scripts/542120/Trademoio%20wheel%20clickable.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const updateLinks = () => {
        document.querySelectorAll("a[class*='styles_clickable']").forEach(anchor => {
            const span = anchor.querySelector("div[class*='styles_left'] span[class*='styles_value__']");
            if (span && !anchor.dataset.hrefUpdated) {
                const text = span.textContent;
                const match = text.match(/#(\d+)/);
                if (match) {
                    const number = match[1];
                    anchor.href = `https://trademo.io/bank-profiles/bank-profile/${number}`;
                    anchor.dataset.hrefUpdated = "true";
                }
            }
        });
    };

    const observer = new MutationObserver(updateLinks);
    observer.observe(document.body, { childList: true, subtree: true });

    updateLinks();
})();