// ==UserScript==
// @name         Highlight selected text
// @namespace    https://greasyfork.org
// @version      1.0
// @description  Press 'H' to highlight selected text. Press 'H' again on highlighted text to remove it.
// @author       Bui Quoc Dung
// @match        *://*/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/544906/Highlight%20selected%20text.user.js
// @updateURL https://update.greasyfork.org/scripts/544906/Highlight%20selected%20text.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        mark.userscript-highlight {
            background-color: #fff59d !important;
            color: black !important;
        }
    `);

    document.addEventListener('keydown', function(e) {
        if (e.key.toLowerCase() !== 'h') return;
        if (e.target.isContentEditable || ['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

        const selection = window.getSelection();
        if (!selection.rangeCount || selection.isCollapsed) return;

        e.preventDefault();
        const range = selection.getRangeAt(0);
        const existingMark = range.commonAncestorContainer.parentElement.closest('mark.userscript-highlight');

        if (existingMark) {
            const parent = existingMark.parentNode;
            while (existingMark.firstChild) {
                parent.insertBefore(existingMark.firstChild, existingMark);
            }
            parent.removeChild(existingMark);
            parent.normalize();
        } else {
            const mark = document.createElement("mark");
            mark.className = 'userscript-highlight';

            try {
                range.surroundContents(mark);
            } catch (error) {
                console.error("Highlighting failed", error);
                alert("Unable to highlight this selection. Please try selecting a simpler text region.");
            }
        }

        selection.removeAllRanges();
    });
})();
