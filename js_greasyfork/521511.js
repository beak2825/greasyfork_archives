// ==UserScript==
// @name         Leetcode Difficulty Hider
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Replace difficulty labels with "Hidden" and apply custom styles.
// @author       You
// @match        https://leetcode.com/*
// @exclude      https://leetcode.com/
// @exclude      https://leetcode.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/521511/Leetcode%20Difficulty%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/521511/Leetcode%20Difficulty%20Hider.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Helper function to replace text content and apply styles
    function replaceText(element, customText = "Hidden") {
        if (element.dataset.processed || element.closest("svg")) return; // Skip already processed elements

        // Store the original text
        const originalText = element.textContent.trim();

        // Replace text with "Hidden" and apply styles
        element.textContent = customText;
        element.style.color = "orchid";
        element.dataset.processed = "true";

        // Add hover functionality to show the original text
        element.addEventListener("mouseenter", () => {
            element.textContent = originalText;
            element.style.color = ""; // Reset to original colour
            element.style.fontStyle = "";
            element.style.fontWeight = "";
        });
        element.addEventListener("mouseleave", () => {
            element.textContent = customText;
            element.style.color = "orchid";
        });
    }

    // Apply the text replacement to specific elements
    function applyReplacements() {
        const selectors = [
            ".text-sd-hard",
            ".text-sd-medium",
            ".text-sd-easy",
            '[role="cell"] > .text-pink.dark\\:text-dark-pink',
            '[role="cell"] > .text-yellow.dark\\:text-dark-yellow',
            '[role="cell"] > .text-olive.dark\\:text-dark-olive',
            ".text-difficulty-hard",
            ".text-difficulty-medium",
            ".text-difficulty-easy",
            ".text-lc-yellow-60.dark\\:text-dark-lc-yellow-60",
            ".text-lc-red-60.dark\\:text-dark-lc-red-60",
            ".text-lc-green-60.dark\\:text-dark-lc-green-60",
            ".text-yellow",
            ".text-pink",
            ".text-green",
            ".text-olive"
        ];

        const elements = document.querySelectorAll(selectors.join(","));
        elements.forEach((element) => replaceText(element));
    }

    // Run the replacement initially
    applyReplacements();

    // Observe changes in the DOM to handle dynamic content
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    applyReplacements();
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
