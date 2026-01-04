// ==UserScript==
// @name         Highlight differences in Launchpad bug history
// @namespace    http://anthonywong.net
// @version      1.1
// @description  Highlights differences between two columns in the Launchpad bug activity log
// @match        https://bugs.launchpad.net/*/+bug/*/+activity
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jsdiff/7.0.0/diff.min.js
// @author       Anthony Wong <anthony.wong@canonical.com>
// @license      GPLv2
// @downloadURL https://update.greasyfork.org/scripts/517180/Highlight%20differences%20in%20Launchpad%20bug%20history.user.js
// @updateURL https://update.greasyfork.org/scripts/517180/Highlight%20differences%20in%20Launchpad%20bug%20history.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getStyledDiff(oldText, newText) {
        // Get the diff using jsdiff
        const diff = Diff.diffWordsWithSpace(oldText, newText);

        // Prepare styled results for both old and new texts
        let oldStyled = '';
        let newStyled = '';

        diff.forEach((part) => {
            if (part.added) {
                // New text added in 5th column: make it bold and red
                newStyled += `<span style="color:red; font-weight:bold">${part.value}</span>`;
            } else if (part.removed) {
                // Text removed in 5th column: highlight in yellow in 4th column, and strike-through in 5th column
                oldStyled += `<span style="background-color:yellow">${part.value}</span>`;
                newStyled += `<span style="text-decoration:line-through; color:gray">${part.value}</span>`;
            } else {
                // Unchanged text remains as is
                oldStyled += part.value;
                newStyled += part.value;
            }
        });

        return { oldStyled, newStyled };
    }

    document.querySelectorAll('table.listing tbody tr').forEach(row => {
        const oldColumn = row.cells[3]; // 4th column (Old value)
        const newColumn = row.cells[4]; // 5th column (New value)

        if (oldColumn && newColumn) {
            const oldText = oldColumn.innerText.trim();
            const newText = newColumn.innerText.trim();

            if (oldText !== newText) {
                const { oldStyled, newStyled } = getStyledDiff(oldText, newText);
                oldColumn.innerHTML = oldStyled;
                newColumn.innerHTML = newStyled;
            }
        }
    });
})();