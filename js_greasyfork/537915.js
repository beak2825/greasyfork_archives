// ==UserScript==
// @name        Grade Changer 1
// @namespace   GitHub
// @match       *://*.powerschool.*/guardian/home.html*
// @grant       GM_getValue
// @grant       GM_setValue
// @version     2.0
// @author      genZrizzCode
// @description Changes all grades lower than an A-, to an A (91%). Only works for the overview at home.html. Grade Changer 2 will work on the detailed view.
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/537915/Grade%20Changer%201.user.js
// @updateURL https://update.greasyfork.org/scripts/537915/Grade%20Changer%201.meta.js
// ==/UserScript==

// License: MIT License
// Copyright (c) 2025 genZrizzCode

(function() { // This makes the following code happen immediately
    console.log("%cGrade Changer 1 init.", "font-size: 2em; font-weight: bold; color: #39F;") // %c makes it styleable
    'use strict';
    window.addEventListener('load', async() => { // This makes the following code start when the page loads
        let tbody = document.querySelector('table tbody'); // makes tbody = the first <tbody> on the webpage
        if (tbody) { // If there is a <tbody>:
            tbody.id = 'grade-table'; // Changes the <tbody>'s id to 'grade-table
            console.log('ID added to tbody:', tbody);

            let badLetterGrades = ['B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F'].map(g => g.toUpperCase()); // Makes sure it is uppercase
            let replacementGrade = 'A<br>91';

            let cells = tbody.querySelectorAll('td'); // Selects all table cells in the <tbody>

            cells.forEach(cell => { // Checks each cell
                let aTag = cell.querySelector('a.bold'); // Finds the <a.bold> with grades
                if (aTag) { // if there even is an <a.bold> element
                    // The following code removes whitespace and checks for a match
                    let rawText = aTag.textContent.replace(/\s+/g, '').toUpperCase(); 
                    let match = rawText.match(/^(A\+|A-|A|B\+|B-|B|C\+|C-|D\+|D-|D|F)/);
                    let gradeText = match ? match[0] : '';

                    if (badLetterGrades.includes(gradeText)) { // If the grade is bad:
                        console.log(`Fixing grade inside <a>: ${gradeText} -> ${replacementGrade}`);
                        aTag.innerHTML = replacementGrade; // Replaces grade
                    }
                } else {
                    let rawText = cell.textContent.replace(/\s+/g, '').toUpperCase();
                    let match = rawText.match(/^(A\+|A-|A|B\+|B-|C\+|C-|D\+|D-|D|F)/);
                    let cellText = match ? match[0] : '';

                    if (badLetterGrades.includes(cellText)) {
                        console.log(`Fixing grade in <td>: ${cellText} -> ${replacementGrade}`);
                        cell.innerHTML = replacementGrade;
                    }
                }
            });
        } else {
            console.log('No tbody found.');
        }
        let runCount = await GM_getValue('runCount', 0);
        runCount += 1;
        await GM_setValue('runCount', runCount);
        console.log(`Grade Changer 1 has run ${runCount} time${runCount === 1 ? '' : 's since version 2.0'}.`);    
        console.log("%cGrade Changer 1 fin.", "font-size: 2em; font-weight: bold; color: #39F;")
    });
})();
