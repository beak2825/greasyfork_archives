// ==UserScript==
// @name         ISRC Hunt: Highlight ISRC matches and differences
// @namespace    https://musicbrainz.org/user/chaban
// @version      1.2.2
// @description  Highlights matching ISRCs in green and non-matches red.
// @tag          ai-created
// @author       chaban
// @license      MIT
// @match        *://isrchunt.com/spotify/importisrc*
// @match        *://isrchunt.com/deezer/importisrc*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536863/ISRC%20Hunt%3A%20Highlight%20ISRC%20matches%20and%20differences.user.js
// @updateURL https://update.greasyfork.org/scripts/536863/ISRC%20Hunt%3A%20Highlight%20ISRC%20matches%20and%20differences.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * Injects a CSS string into the document head if it hasn't been injected already.
     * @param {string} id - A unique ID for the style element.
     * @param {string} css - The CSS string to inject.
     */
    function addGlobalStyle(id, css) {
        if (!document.getElementById(id)) {
            const style = document.createElement('style');
            style.id = id;
            style.textContent = css;
            document.head.appendChild(style);
        }
    }

    const isrcStyleId = 'isrc-highlight-userscript-style';
    const isrcCss = `
        .isrc-segment-container .isrc-part:not(.designation)::after {
            content: '\\2011';
        }

        .isrc-base-style {
            font-family: monospace !important;
            font-size: 1.05em !important;
            white-space: nowrap !important;
        }

        .isrc-match-highlight {
            background-color: lightgreen !important;
        }

        .isrc-diff-highlight {
            background-color: salmon !important;
        }
    `;
    addGlobalStyle(isrcStyleId, isrcCss);

    /**
     * Parses a comma-separated string of ISRCs from a cell's text content,
     * normalizing them to uppercase for consistent display and comparison.
     * @param {string} textContent - The raw text content from the table cell.
     * @returns {string[]} An array of normalized (uppercase) ISRC strings.
     */
    function parseIsrcs(textContent) {
        const trimmedText = textContent.trim();
        if (!trimmedText) {
            return [];
        }
        return trimmedText.split(',').map(isrc => isrc.trim().toUpperCase());
    }

    /**
     * Creates a <code> element containing <span> elements for each ISRC part.
     * Hyphens are rendered via CSS pseudo-elements for non-selection.
     * The text color is applied directly to this <code> element to ensure it takes precedence.
     * @param {string} isrc - The 12-character ISRC string (expected to be uppercase).
     * @param {string} textColor - The desired text color for this ISRC (always 'black' in this version).
     * @returns {HTMLElement} A <code> element with nested spans for ISRC segments.
     */
    function formatIsrcForDisplay(isrc, textColor) {
        const codeContainer = document.createElement('code');
        codeContainer.style.setProperty('color', textColor, 'important');

        if (typeof isrc !== 'string' || isrc.length !== 12) {
            codeContainer.textContent = isrc;
            return codeContainer;
        }

        codeContainer.classList.add('isrc-segment-container');

        const partLengths = [2, 3, 2, 5];
        const partClasses = ['country', 'registrant', 'year', 'designation'];
        let currentIndex = 0;

        for (let i = 0; i < partLengths.length; i++) {
            const length = partLengths[i];
            const part = isrc.substring(currentIndex, currentIndex + length);
            const span = document.createElement('span');
            span.classList.add('isrc-part', partClasses[i]);
            span.textContent = part;
            codeContainer.appendChild(span);
            currentIndex += length;
        }

        return codeContainer;
    }

    /**
     * Highlights ISRCs within a given cell based on comparison with a set of other ISRCs,
     * using direct DOM manipulation for safer rendering and precise control.
     * @param {HTMLElement} cell - The table cell element to modify.
     * @param {string[]} isrcsToHighlightNormalized - Array of normalized (uppercase) ISRCs in this cell.
     * @param {Set<string>} comparisonSetNormalized - A Set of normalized (uppercase) ISRCs from the other cell for comparison.
     */
    function highlightIsrcsInCell(cell, isrcsToHighlightNormalized, comparisonSetNormalized) {
        cell.innerHTML = '';

        isrcsToHighlightNormalized.forEach((isrc, index) => {
            const isrcDisplayWrapper = document.createElement('span');

            const bgColor = comparisonSetNormalized.has(isrc) ? 'lightgreen' : 'salmon';
            const textColor = 'black';

            isrcDisplayWrapper.classList.add('isrc-base-style');
            isrcDisplayWrapper.style.setProperty('background-color', bgColor, 'important');

            isrcDisplayWrapper.appendChild(formatIsrcForDisplay(isrc, textColor));

            cell.appendChild(isrcDisplayWrapper);

            if (index < isrcsToHighlightNormalized.length - 1) {
                cell.appendChild(document.createTextNode(', '));
            }
        });
    }

    /**
     * Highlights ISRCs in two cells by comparing them against each other.
     * This function encapsulates the symmetrical calls to highlightIsrcsInCell.
     * @param {HTMLElement} cell1 - The first table cell.
     * @param {string[]} isrcs1Normalized - Normalized ISRCs for the first cell.
     * @param {HTMLElement} cell2 - The second table cell.
     * @param {string[]} isrcs2Normalized - Normalized ISRCs for the second cell.
     */
    function crossHighlightCells(cell1, isrcs1Normalized, cell2, isrcs2Normalized) {
        const set1 = new Set(isrcs1Normalized);
        const set2 = new Set(isrcs2Normalized);

        highlightIsrcsInCell(cell1, isrcs1Normalized, set2);
        highlightIsrcsInCell(cell2, isrcs2Normalized, set1);
    }

    /**
     * Processes a single table row to highlight ISRCs in the Spotify and MusicBrainz cells.
     * @param {HTMLElement} row - The table row element to process.
     */
    function processRowIsrcs(row) {
        const spotifyIsrcCell = row.querySelector('td:nth-child(4)');
        const mbIsrcCell = row.querySelector('td:nth-child(7)');

        if (spotifyIsrcCell && mbIsrcCell) {
            const spotifyIsrcsNormalized = parseIsrcs(spotifyIsrcCell.textContent);
            const mbIsrcsNormalized = parseIsrcs(mbIsrcCell.textContent);

            crossHighlightCells(
                spotifyIsrcCell, spotifyIsrcsNormalized,
                mbIsrcCell, mbIsrcsNormalized
            );
        }
    }

    const table = document.querySelector('.table');
    if (!table) {
        return;
    }

    const rows = table.querySelectorAll('tr');

    for (let i = 1; i < rows.length; i++) {
        processRowIsrcs(rows[i]);
    }
})();
