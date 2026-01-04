// ==UserScript==
// @name         Personio Sort Dropdown Alphabetically
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Sorts a specific dropdown alphabetically
// @author       Jon Smith
// @match        https://*.app.personio.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/538406/Personio%20Sort%20Dropdown%20Alphabetically.user.js
// @updateURL https://update.greasyfork.org/scripts/538406/Personio%20Sort%20Dropdown%20Alphabetically.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Identify dropdown containers based on structure, not class
    const isDropdownContainer = (node) => {
        if (!(node instanceof HTMLElement)) return false;

        const role = node.getAttribute('role');
        const overflow = node.style?.overflow;

        return role === 'presentation' && overflow?.includes('auto') && node.querySelectorAll?.('div[role="option"]').length > 1;
    };

    const sortDropdownItems = (container) => {
        const items = Array.from(container.querySelectorAll('div[role="option"]'));

        if (items.length < 2) return;

        // Check if already sorted
        const original = items.map(el => el.textContent.trim().toLowerCase());
        const sorted = [...original].sort((a, b) => a.localeCompare(b));

        if (original.every((val, i) => val === sorted[i])) {
            return; // Already sorted
        }

        // Sort DOM elements
        const sortedElements = items.slice().sort((a, b) => {
            const aText = a.textContent.trim().toLowerCase();
            const bText = b.textContent.trim().toLowerCase();
            return aText.localeCompare(bText);
        });

        items.forEach(item => container.removeChild(item));
        sortedElements.forEach(item => container.appendChild(item));
    };

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (!(node instanceof HTMLElement)) continue;

                if (isDropdownContainer(node)) {
                    sortDropdownItems(node);
                }

                // Handle nested cases
                const nested = node.querySelectorAll?.('div[role="presentation"]');
                nested?.forEach(child => {
                    if (isDropdownContainer(child)) {
                        sortDropdownItems(child);
                    }
                });
            }
        }
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
})();