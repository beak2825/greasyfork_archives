// ==UserScript==
// @name         Remove Jobs without Feedback
// @namespace    none
// @version      1
// @description  Removes (probably) fake jobs from User Feed on Upwork
// @match        https://www.upwork.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/462145/Remove%20Jobs%20without%20Feedback.user.js
// @updateURL https://update.greasyfork.org/scripts/462145/Remove%20Jobs%20without%20Feedback.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for the DOM to be fully loaded
    document.addEventListener('DOMContentLoaded', removeElements);

    // Watch for updates to the DOM
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(removeElements);
    });

    observer.observe(document, { childList: true, subtree: true });

    function removeElements() {
        // Define the XPath expression
        const xpathExpr = "//div[contains(@style,'width: 0px')]/parent::*/parent::*/parent::*/parent::*/parent::*";

        // Find elements matching the XPath expression
        const matchingElements = document.evaluate(xpathExpr, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

        // Remove each matching element from the page
        for (let i = 0; i < matchingElements.snapshotLength; i++) {
            const element = matchingElements.snapshotItem(i);
            element.parentNode.removeChild(element);
        }
    }
})();