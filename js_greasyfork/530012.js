// ==UserScript==
// @name         ExCoGi 4K Filter
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Toggle 4K filter and hide non‑4K video columns for a cleaner layout, with a yellow filter button.
// @match        https://exploitedcollegegirls.com/members/categories/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530012/ExCoGi%204K%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/530012/ExCoGi%204K%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'excoGi_4K_filter';

    // Hide (or show) the entire grid column if the video doesn't have a 4K badge.
    function filter4KVideos(enableFilter) {
        // Select each column container (adjust selectors if necessary)
        document.querySelectorAll('.col-md-4.col-sm-6.col-12').forEach(col => {
            // Look for a video element inside the column
            const videoItem = col.querySelector('.item-update.item-video');
            if (videoItem) {
                // Check for the presence of a 4K badge
                const has4KBadge = videoItem.querySelector('.fourk-badge') !== null;
                if (enableFilter && !has4KBadge) {
                    col.style.display = 'none';
                } else {
                    col.style.display = '';
                }
            }
        });
    }

    // Create and insert the fixed 4K filter button.
    function addFixed4KButton() {
        if (document.getElementById('fixed4KButton')) return; // Already added

        const btn = document.createElement('button');
        btn.id = 'fixed4KButton';
        // Remove Bootstrap color classes to prevent conflicts.
        btn.className = '';
        // Positioning adjustments: moved down to 50px from the top.
        btn.style.position = 'fixed';
        btn.style.top = '50px'; // Adjusted downwards
        btn.style.right = '10px';
        btn.style.zIndex = '10000';
        btn.style.padding = '6px 12px';
        // Set background to yellow, border to yellow, and text color to black for readability.
        btn.style.backgroundColor = 'yellow';
        btn.style.border = '1px solid yellow';
        btn.style.color = 'black';
        btn.style.cursor = 'pointer';

        let filterEnabled = localStorage.getItem(STORAGE_KEY) === 'true';
        btn.innerText = filterEnabled ? '4K Filter ON' : '4K Filter OFF';

        btn.addEventListener('click', function() {
            filterEnabled = !filterEnabled;
            localStorage.setItem(STORAGE_KEY, filterEnabled);
            btn.innerText = filterEnabled ? '4K Filter ON' : '4K Filter OFF';
            filter4KVideos(filterEnabled);
            // Dispatch a resize event to help force a layout reflow.
            window.dispatchEvent(new Event('resize'));
        });

        document.body.appendChild(btn);
    }

    // Observe changes in the grid to reapply the filter when new content loads.
    function observeGridChanges() {
        // Adjust the container selector to target the element wrapping the grid columns.
        const gridRow = document.querySelector('.row-col-padding-10 .row');
        if (!gridRow) return;
        const observer = new MutationObserver(() => {
            if (localStorage.getItem(STORAGE_KEY) === 'true') {
                filter4KVideos(true);
            }
        });
        observer.observe(gridRow, { childList: true, subtree: true });
    }

    function init() {
        addFixed4KButton();
        const filterEnabled = localStorage.getItem(STORAGE_KEY) === 'true';
        filter4KVideos(filterEnabled);
        observeGridChanges();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
