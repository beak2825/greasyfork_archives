// ==UserScript==
// @name         Total Skill at Player Page
// @namespace    http://tampermonkey.net/
// @version      2024-07-09
// @description  ..
// @author       Ngã Ba Ông Tạ Sài Gòn
// @match        https://sokker.org/player/PID/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sokker.org
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/545980/Total%20Skill%20at%20Player%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/545980/Total%20Skill%20at%20Player%20Page.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to calculate total skill
    function calculateTotalSkill() {
        // Select the table containing skills
        const table = document.querySelector('.table-skills');

        if (!table) {
            console.error('Table with class "table-skills" not found.');
            return;
        }

        let totalSkill = 0;

        // Select all rows in the table body
        const rows = table.querySelectorAll('tbody tr');

        // Iterate through each row
        rows.forEach(row => {
            // Select both td elements in the row
            const tds = row.querySelectorAll('td');

            // Iterate through each td to find the skill number
            tds.forEach(td => {
                // Find the skill number span within each td
                const skillNumberSpan = td.querySelector('.skillNameNumber');
                if (skillNumberSpan) {
                    // Extract the skill number from the span text
                    const skillNumberText = skillNumberSpan.textContent.trim();
                    // Extract the number within brackets
                    const skillNumber = parseInt(skillNumberText.match(/\[(\d+)\]/)[1]);
                    // Add the skill number to the total skill
                    if (!isNaN(skillNumber)) {
                        totalSkill += skillNumber;
                    }
                }
            });
        });

        // Create a new row to display the total skill
        const totalRow = document.createElement('tr');
        totalRow.innerHTML = `<td colspan="2"><strong>Total Skill:</strong> ${totalSkill}</td>`;

        // Append the total row to the table body
        const tbody = table.querySelector('tbody');
        tbody.appendChild(totalRow);
    }

    // Run the function when the page is fully loaded
    window.addEventListener('load', calculateTotalSkill);
})();