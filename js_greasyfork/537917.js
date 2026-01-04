// ==UserScript==
// @name        Grade Changer 2
// @namespace   GitHub
// @match       *://*.powerschool.*/guardian/scores.html*
// @grant       GM_setValue
// @grant       GM_getValue
// @version     2.0
// @author      genZrizzCode
// @description Changes all grades lower than an A-, to an A (91%). Only works for the overview at scores.html. Grade Changer 1 will work on the overview.
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/537917/Grade%20Changer%202.user.js
// @updateURL https://update.greasyfork.org/scripts/537917/Grade%20Changer%202.meta.js
// ==/UserScript==

// License: MIT License
// Copyright (c) 2025 genZrizzCode

(function() { // This makes the following code happen immediately
    console.log("%cGrade Changer 2 init.", "font-size: 2em; font-weight: bold; color: #93F;") // %c makes it styleable
    'use strict';
    window.addEventListener('load', async () => { // This makes the following code start when the page loads
        let tbody = document.querySelector('table tbody'); // makes tbody = the first <tbody> on the webpage
        if (tbody) { // If there is a <tbody>:
            tbody.id = 'grade-table'; // Changes the <tbody>'s id to 'grade-table'
            console.log('ID added to tbody:', tbody);

            let badLetterGrades = ['B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F'].map(g => g.toUpperCase());
            let replacementGrade = 'A \u00A0 91%'; // Use \u00A0 for non-breaking space

            let cells = tbody.querySelectorAll('td'); // Selects all table cells in the <tbody>

            cells.forEach(cell => { // Check each cell
                // Following code removes whitespace and checks for a match
                let rawText = cell.textContent.replace(/\s+/g, '').toUpperCase();
                let match = rawText.match(/^(A\+|A-|A|B\+|B-|B|C\+|C-|D\+|D-|D|F)/);
                let gradeText = match ? match[0] : '';

                if (badLetterGrades.includes(gradeText)) {
                    console.log(`Fixing grade in <td>: ${gradeText} -> ${replacementGrade}`);
                    cell.innerHTML = replacementGrade; // Use innerHTML to allow the non-breaking space
                }
            });
        } else {
            console.log('No tbody found.');
        }
        let runCount = await GM_getValue('runCount', 0);
        runCount += 1;
        await GM_setValue('runCount', runCount);
        console.log(`Grade Changer 2 has run ${runCount} time${runCount === 1 ? '' : 's since version 2.0'}.`);    
        console.log("%cGrade Changer 2 fin.", "font-size: 2em; font-weight: bold; color: #93F;")
    });
})();
