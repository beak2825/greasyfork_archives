// ==UserScript==
// @name        Google Sheets Dark Mode
// @namespace   Violentmonkey Scripts
// @match       https://docs.google.com/spreadsheets/*
// @grant       none
// @version     1.1
// @author      Lunula
// @description 12/7/2023, 10:09:32 AM
// @license      GPL-3.0 License

// @downloadURL https://update.greasyfork.org/scripts/481571/Google%20Sheets%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/481571/Google%20Sheets%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a <style> element
    const style = document.createElement('style');
    style.type = 'text/css';

    // CSS styles to change background color of various Google Sheets elements
    const css = `
        /* invert the table, formula bar, cell editor, and navbar and dim transparency to soften */
        #waffle-grid-container,
        #formula-bar-name-box-wrapper,
        #docs-chrome,
        #docs-additional-bars,
        div[role="navigation"],
        .cell-input.editable {
            filter: invert();
            opacity: 0.9;
        }

        /* re-invert colors inside inverted parents to restore them */
        .overlay-container-ltr,
        .formula-content > span:not(.default-formula-text-color),
        .docs-gm .docs-sheet-active-tab .docs-sheet-tab-name,
        .docs-gm .docs-sheet-active-tab .docs-icon {
            filter: invert();
        }

        /* invert selection color manually */
        ::selection {
            background-color: #e58c17 !important;
        }

        /* Misc artifacts */
        .autofill-handle {
            border-color: #333;
        }
        .input-box {
            background: #000 !important;
        }
        .cell-input {
            background: #DDD !important;
        }
        .docs-gm .docs-menubar .goog-control-disabled {
            background-color: transparent !important;
            opacity: 0.5;
        }
    `;

    // Append the CSS styles to the <style> element
    if (style.styleSheet) {
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }

    // Append the <style> element to the <head> of the document
    document.head.appendChild(style);
})();
