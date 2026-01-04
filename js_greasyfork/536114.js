// ==UserScript==
// @name         Wendy’s Menu Quick Link Enhancer
// @namespace    https://wendysmenuin.com
// @version      1.0
// @description  Auto-detects Wendy’s menu mentions on web pages and adds a link to detailed prices and items at wendysmenuin.com
// @author       WendyMenuIn
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?domain=wendysmenuin.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536114/Wendy%E2%80%99s%20Menu%20Quick%20Link%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/536114/Wendy%E2%80%99s%20Menu%20Quick%20Link%20Enhancer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const keywords = [
        /wendy's menu/i,
        /wendy's prices/i,
        /wendy's food/i,
        /wendys menu/i,
        /wendys prices/i
    ];

    const siteURL = "https://wendysmenuin.com";

    function addTooltipLink(node) {
        if (node.dataset?.wendysTooltipInserted) return;

        const span = document.createElement('span');
        span.innerHTML = ` <a href="${siteURL}" target="_blank" style="color:#e60000; text-decoration:underline; font-weight:bold;">(View Full Wendy's Menu)</a>`;
        node.appendChild(span);
        node.dataset.wendysTooltipInserted = "true";
    }

    function scanAndEnhance() {
        const textNodes = Array.from(document.body.querySelectorAll("*")).filter(el => el.childNodes.length && el.offsetParent !== null);

        for (const node of textNodes) {
            for (const keyword of keywords) {
                if (keyword.test(node.textContent) && !node.dataset.wendysTooltipInserted) {
                    addTooltipLink(node);
                    break;
                }
            }
        }
    }

    // Initial scan
    scanAndEnhance();

    // Observe DOM changes (for AJAX-heavy sites)
    const observer = new MutationObserver(() => {
        scanAndEnhance();
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
