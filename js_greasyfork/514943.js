// ==UserScript==
// @name         MAL Related Entries Cleaner
// @namespace    https://myanimelist.net/
// @version      1.0
// @description  Consolidate all entries into a unified entries table in the "Related Entries" section on MAL, add small dynamically-coloured badges, and auto-expand the section.
// @grant        none
// @match        https://myanimelist.net/manga/*
// @match        https://myanimelist.net/anime/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/514943/MAL%20Related%20Entries%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/514943/MAL%20Related%20Entries%20Cleaner.meta.js
// ==/UserScript==


(function() {
    'use strict';

    /**
     * Generates a unique color for each relation type based on its text.
     * @param {string} text - The text to hash for color generation.
     * @returns {string} - A color in HSL format.
     */
    function getColorFromText(text) {
        let hash = 0;
        for (let i = 0; i < text.length; i++) hash = text.charCodeAt(i) + ((hash << 5) - hash);
        const hue = hash % 360;
        return `hsl(${hue}, 60%, 70%)`;
    }

    /**
     * Processes the "Related Entries" section by moving tile entries into the entries table,
     * adding badges for relation types, and ensuring a clean, unified layout.
     */
    function processRelatedEntries() {
        const relatedEntriesSection = document.querySelector("td.pb24 .related-entries");

        if (!relatedEntriesSection) return;

        const moreButton = relatedEntriesSection.querySelector('.js-toggle-related-entries');

        if (moreButton) {
            moreButton.click();
            moreButton.remove();
        }

        let entriesTable = relatedEntriesSection.querySelector('.entries-table');

        if (!entriesTable) {
            entriesTable = document.createElement('table');
            entriesTable.classList.add('entries-table');
            relatedEntriesSection.appendChild(entriesTable);
        }

        const entriesTile = relatedEntriesSection.querySelector('.entries-tile');

        if (entriesTile) {
            entriesTile.querySelectorAll('.entry').forEach(entry => {
                const relationType = entry.querySelector('.relation')?.textContent.trim();
                const titleLink = entry.querySelector('.title a');
                if (!relationType || !titleLink) return;

                const row = document.createElement('tr');

                const relationTypeCell = document.createElement('td');
                relationTypeCell.classList.add('ar', 'fw-n', 'borderClass', 'nowrap');
                relationTypeCell.style.verticalAlign = 'top';

                const badge = document.createElement('span');
                badge.textContent = relationType;
                badge.style.backgroundColor = getColorFromText(relationType);
                badge.style.color = '#ffffff';
                badge.style.padding = '2px 4px';
                badge.style.borderRadius = '5px';
                badge.style.fontSize = '10px';
                badge.style.verticalAlign = 'middle';

                relationTypeCell.appendChild(badge);

                const titleCell = document.createElement('td');
                titleCell.classList.add('borderClass');
                titleCell.style.width = '100%';
                titleCell.appendChild(titleLink.cloneNode(true));

                row.appendChild(relationTypeCell);
                row.appendChild(titleCell);
                entriesTable.querySelector('tbody')?.prepend(row) || entriesTable.prepend(row);
            });
            entriesTile.remove();
        }

        relatedEntriesSection.querySelectorAll('.entries-table tr').forEach(row => {
            const relationTypeCell = row.querySelector('td.ar');
            const titleLink = row.querySelector('ul.entries li a');

            if (!relationTypeCell || !titleLink) return;

            const relationTypeText = relationTypeCell.textContent.trim().replace(':', '');
            relationTypeCell.innerHTML = '';

            const badge = document.createElement('span');
            badge.textContent = relationTypeText;
            badge.style.backgroundColor = getColorFromText(relationTypeText);
            badge.style.color = '#ffffff';
            badge.style.padding = '2px 4px';
            badge.style.borderRadius = '5px';
            badge.style.fontSize = '10px';
            badge.style.marginLeft = '8px';
            badge.style.verticalAlign = 'middle';

            relationTypeCell.appendChild(badge);

            if (titleLink.parentNode.tagName === 'LI') {
                titleLink.parentNode.parentNode.parentNode.replaceChild(titleLink, titleLink.parentNode.parentNode);
            }
        });
    }

    const observer = new MutationObserver((_, obs) => {
        const relatedEntriesSection = document.querySelector("td.pb24 .related-entries");

        if (!relatedEntriesSection) return;

        obs.disconnect();
        processRelatedEntries();
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
