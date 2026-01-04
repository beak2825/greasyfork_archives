// ==UserScript==
// @name         Improved Layout for BusMiles Summary Section
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Make summary section cleaner and more readable
// @match        *://busmiles.uk/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533780/Improved%20Layout%20for%20BusMiles%20Summary%20Section.user.js
// @updateURL https://update.greasyfork.org/scripts/533780/Improved%20Layout%20for%20BusMiles%20Summary%20Section.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const enhanceLayout = () => {
        const container = document.querySelector('div.container.pr-0.pl-0[style*="width:40vmax"]');
        if (!container || container.dataset.modified) return;
        container.dataset.modified = true;

        // Expand and style container
        container.style.width = '90vw';
        container.style.maxWidth = 'none';
        container.style.margin = '2rem auto';
        container.style.padding = '1rem';
        container.style.backgroundColor = '#f9f9f9';
        container.style.borderRadius = '12px';
        container.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';

        // Style tables
        const tables = container.querySelectorAll('table#tablelast11, table#tablelast10');
        tables.forEach(table => {
            table.style.fontSize = '1.8vmin';
            table.style.width = '100%';
            table.style.borderCollapse = 'collapse';
            table.style.marginBottom = '1.5rem';
        });

        // Style table headers and cells
        const headers = container.querySelectorAll('th');
        headers.forEach(th => {
            th.style.padding = '0.5rem';
            th.style.textAlign = 'left';
            th.style.backgroundColor = '#e0e0e0';
        });

        const cells = container.querySelectorAll('td');
        cells.forEach(td => {
            td.style.padding = '0.5rem';
            td.style.borderBottom = '1px solid #ccc';
        });

        // Style buttons
        const buttons = container.querySelectorAll('button');
        buttons.forEach(button => {
            button.style.fontSize = '1.6vmin';
            button.style.padding = '0.4rem 0.8rem';
            button.style.borderRadius = '6px';
            button.classList.remove('btn-lg');
        });

        // Style labels
        const labels = container.querySelectorAll('label');
        labels.forEach(label => {
            label.style.display = 'block';
            label.style.marginTop = '1rem';
            label.style.marginBottom = '0.5rem';
            label.style.fontWeight = '600';
            label.style.fontSize = '1.8vmin';
        });

    };

    // Run once and also watch for page changes
    enhanceLayout();
    const observer = new MutationObserver(enhanceLayout);
    observer.observe(document.body, { childList: true, subtree: true });
})();
