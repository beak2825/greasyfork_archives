// ==UserScript==
// @name         M-Team AV Cover Display
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Extract AV codes on M-Team and display cover images
// @author       winnie
// @match        https://*.m-team.cc/browse/adult*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/535411/M-Team%20AV%20Cover%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/535411/M-Team%20AV%20Cover%20Display.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /**
     * Extracts the first AV code from a string.
     * Matches formats like ABC-123, ABCD-123, etc.
     * @param {string} text
     * @returns {string|null}
     */
    function extractFirstAvCode(text) {
        const avRegex = /([A-Z]{2,5})-(\d{2,5})/;
        const match = text.match(avRegex);
        return match ? match[0] : null;
    }

    /**
     * Processes a <span> element to check and insert AV cover image.
     * @param {HTMLElement} span
     */
    function processSpan(span) {
        const avCode = extractFirstAvCode(span.textContent);
        if (!avCode) return;

        const lowerCode = avCode.toLowerCase();
        const img = document.createElement('img');
        img.src = `http://fourhoi.com/${lowerCode}/cover-n.jpg`;
        img.style.maxWidth = '280px';
        img.style.marginRight = '5px';
        img.style.verticalAlign = 'middle';
        img.style.transition = 'transform 0.3s ease';

        img.onerror = () => img.remove();

        span.parentNode.insertBefore(img, span);
    }

    /**
     * Initializes the script by processing current spans
     * and observing dynamic DOM changes.
     */
    function initAvCoverDisplay() {
        const spans = document.querySelectorAll('span[aria-describedby]');
        spans.forEach(processSpan);

        const observer = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const newSpans = node.querySelectorAll('span[aria-describedby]');
                        newSpans.forEach(processSpan);
                    }
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    window.addEventListener('load', initAvCoverDisplay);
})();