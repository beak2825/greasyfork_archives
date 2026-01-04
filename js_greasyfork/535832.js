// ==UserScript==
// @name         All Google Websites Dark UI
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Full dark mode for all Google websites including Docs, Sheets, Slides, and Classroom. Icons in Classroom keep their original color. White gridlines in Sheets and dark rulers in editors included.
// @author       Blublubdude
// @match        *://*.google.com/*
// @match        *://*.google.*/*
// @icon         https://blublubdude.github.io/Blubs_Games/icon.png
// @grant        GM_addStyle
// @licence     GNU AGPLv3


// @downloadURL https://update.greasyfork.org/scripts/535832/All%20Google%20Websites%20Dark%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/535832/All%20Google%20Websites%20Dark%20UI.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        /* General dark theme */
        html, body {
            background-color: #000 !important;
            color: #fff !important;
        }

        * {
            background-color: transparent !important;
            color: #fff !important;
            border-color: #555 !important;
        }

        input, textarea, select, button {
            background-color: #111 !important;
            color: #fff !important;
            border: 1px solid #444 !important;
        }

        a {
            color: #4da6ff !important;
        }

        img, video {
            filter: brightness(0.8) contrast(1.2);
        }

        /* Preserve original colors for Google Classroom icons */
        .YVvGBb img,
        .YVvGBb svg,
        .LXRPh img,
        .LXRPh svg,
        .LcCc0c img,
        .LcCc0c svg,
        .cQTqKc img,
        .cQTqKc svg {
            filter: none !important;
            color: inherit !important;
        }

        /* Google Docs */
        .kix-page,
        .kix-page-content,
        .kix-canvas-tile-content,
        .kix-appview-editor {
            background-color: #000 !important;
            color: #fff !important;
        }

        .kix-lineview-text-block span {
            color: #fff !important;
        }

        .kix-ruler,
        .docs-ruler {
            background-color: #111 !important;
        }

        /* Google Slides */
        .punch-viewer-content,
        .punch-filmstrip-thumbnail,
        .punch-filmstrip-background,
        .punch-filmstrip {
            background-color: #000 !important;
            color: #fff !important;
        }

        .punch-viewer-page {
            background-color: #000 !important;
        }

        /* Google Sheets */
        .grid-container,
        .grid-canvas,
        .cell-input,
        .docs-sheet-tab,
        .grid-sheet-container {
            background-color: #000 !important;
            color: #fff !important;
        }

        .row-header, .column-header {
            background-color: #111 !important;
            color: #fff !important;
        }

        .docs-sheet-tab {
            border-top: 2px solid #fff !important;
        }

        /* White gridlines in Sheets */
        .gridlines,
        .waffle-grid .cell-border {
            stroke: #fff !important;
            border-color: #fff !important;
        }

        .cell-input {
            color: #fff !important;
        }
    `);
})();
