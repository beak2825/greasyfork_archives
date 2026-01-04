// ==UserScript==
// @name         Anking Table Styles
// @version      0.3
// @description  Apply Anking table styles to tables on AnkiHub
// @author       Shmuel Sashitzky
// @match        https://app.ankihub.net/decks/*/suggestions/*
// @license MIT
// @namespace https://greasyfork.org/users/1304242
// @downloadURL https://update.greasyfork.org/scripts/495516/Anking%20Table%20Styles.user.js
// @updateURL https://update.greasyfork.org/scripts/495516/Anking%20Table%20Styles.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // CSS Reset for tables
    var resetCss = `
        table, th, td, tr {
            all: unset !important;
            display: revert !important;
        }
    `;

    // New CSS
    var customCss = `
        table {
            overflow-x: auto !important;
            margin-left: auto !important;
            margin-right: auto !important;
            border-collapse: collapse !important;
            overflow: scroll !important;
            white-space: normal !important;
            font-size: clamp(0.1rem, 1.7vw, 0.9rem) !important;
            font-style: normal !important;
            text-align: center !important;
            max-width: 95vw !important;
        }

        /* Left and right border cleanup */
        table td:first-child {
            border-left: 1px solid white !important;
        }
        table td:last-child {
            border-right: 1px solid white !important;
        }

        /* Table dynamic padding */
        table tr, table td, table th {
            padding-top: clamp(0.05rem, 1vw, 1rem) !important;
            padding-bottom: clamp(0.05rem, 1vw, 1rem) !important;
            padding-left: clamp(0.05rem, 1vw, 1rem) !important;
            padding-right: clamp(0.05rem, 1vw, 1rem) !important;
        }

        /* Span Correct */
        table span {
            font-size: clamp(0.1rem, 1.7vw, 0.9rem) !important;
        }

        /* Horizontal Header Style, applies to any row that spans all columns */
        table th tr td:first-child[colspan]:last-child[colspan] {
            background-color: #ffffff !important;
            color: #367390 !important;
            border-top: 3px solid #367390 !important;
            border-bottom: 3px solid #367390 !important;
            text-align: center !important;
            padding-top: 1vw !important;
            padding-bottom: 1vw !important;
        }

        /* Alternate Header Style, set in T5 addon settings */
        table th:not(:first-child[colspan]:last-child[colspan]) {
            background-color: #ddecf2 !important;
            color: #266988 !important;
            border: 1px solid #ffffff !important;
            font-weight: normal !important;
            text-align: center !important;
        }

        /* Alternate grey rows */
        table tr:nth-of-type(odd) {
            background-color: #f8f8f8 !important;
        }

        table tr:nth-of-type(even) {
            background-color: #ffffff !important;
        }

        /* Default styles if not overridden by above */
        table {
            color: #000000 !important;
            border: 1px solid #a4cde0 !important;
            background-color: #ffffff !important;
        }

        /* Set background color of ins, del, .addition-diff-dark, and .deletion-diff-dark to transparent within tables */
        table ins, table del,
        table .addition-diff-dark, table .deletion-diff-dark,
        table .addition-diff-dark ins, table .deletion-diff-dark del,
        table .addition-diff-dark ins *, table .deletion-diff-dark del * {
            background-color: transparent !important;
        }
    `;

    // Apply CSS Reset
    var resetStyle = document.createElement("style");
    resetStyle.appendChild(document.createTextNode(resetCss));
    document.head.appendChild(resetStyle);

    // Apply Custom CSS
    var customStyle = document.createElement("style");
    customStyle.appendChild(document.createTextNode(customCss));
    document.head.appendChild(customStyle);
})();
