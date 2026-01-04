// ==UserScript==
// @name         CivitAI Filter Menu Enhanced
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Keep filter menu open and remove like/dislike buttons on civitai.com/generate
// @author       m-borg
// @match        https://civitai.com/generate*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518501/CivitAI%20Filter%20Menu%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/518501/CivitAI%20Filter%20Menu%20Enhanced.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const css = `
        .mantine-Popover-dropdown {
            display: block !important;
            opacity: 1 !important;
            visibility: visible !important;
            position: fixed !important;
            transform: none !important;
            transition: none !important;
        }
    `;

    // Add custom CSS
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    function handleMenu() {
        // Click the filter button if needed
        const filterButton = Array.from(document.querySelectorAll('button')).find(btn =>
            btn.innerHTML.includes('tabler-icon-filter')
        );
        if (filterButton && filterButton.getAttribute('data-expanded') !== 'true') {
            filterButton.click();
        }

        // Remove like/dislike buttons
        const labels = document.querySelectorAll('.mantine-Chip-label');
        labels.forEach(label => {
            if (label.textContent.includes('liked') || label.textContent.includes('disliked')) {
                const chipRoot = label.closest('.mantine-Chip-root');
                if (chipRoot) {
                    chipRoot.style.display = 'none';
                }
            }
        });
    }

    // Initial setup with delay
    setTimeout(handleMenu, 2000);

    // Observer for dynamic changes
    const observer = new MutationObserver(() => {
        handleMenu();
    });

    // Start observing with a delay to ensure page is loaded
    setTimeout(() => {
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class']
        });
    }, 2000);
})();