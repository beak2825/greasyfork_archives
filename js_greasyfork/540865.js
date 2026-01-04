// ==UserScript==
// @name         Lichess Grab Cursor
// @namespace    https://lichess.org/
// @version      1.0
// @description  Changes the cursor to a grab hand when hovering over pieces and to a grabbing hand when dragging pieces.
// @author       ObnubiladO
// @match        https://lichess.org/*
// @icon         https://webref.ru/assets/images/css/cursor/grab.png
// @grant        none
// @run-at       document-start
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/540865/Lichess%20Grab%20Cursor.user.js
// @updateURL https://update.greasyfork.org/scripts/540865/Lichess%20Grab%20Cursor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define the custom CSS
    const customCSS = `
    /* Change cursor to grab when hovering over manipulable pieces */
    .manipulable cg-board {
        cursor: grab !important;
    }

    /* Change cursor to grabbing when a piece is being dragged */
    .manipulable cg-board:has(piece.dragging) {
        cursor: grabbing !important;
    }
    `;

    // Function to inject CSS into the page
    function addGlobalStyle(css) {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
    }

    // Inject the custom CSS
    addGlobalStyle(customCSS);
})();
