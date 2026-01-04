// ==UserScript==
// @name         Sum of skills at transfer search
// @namespace    http://tampermonkey.net/
// @version      2024-07-09
// @description  Sum of attribute
// @author       Ngã Ba Ông Tạ Sài Gòn
// @match        https://sokker.org/transferSearch/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sokker.org
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/545981/Sum%20of%20skills%20at%20transfer%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/545981/Sum%20of%20skills%20at%20transfer%20search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function sumSkillNumbersPerPlayer() {
        // Select all player containers
        let players = document.querySelectorAll('#playerCell');
        players.forEach(player => {
            console.log("Each player");
            let totalSum = 0;
            // Select all skill number spans within this player container
            let skillNumbers = player.querySelectorAll('.skillNameNumber');
            skillNumbers.forEach(span => {
                let number = parseInt(span.textContent.replace(/[^\d]/g, ''));
                totalSum += isNaN(number) ? 0 : number;
            });
            // Create a new row to display the total sum
            let newRow = document.createElement('tr');
            newRow.innerHTML = `<td colspan="2"><strong>Total Skills: ${totalSum}</strong></td>`;
            // Append the new row to the player's skills table
            let table = player.querySelector('table.table-skills tbody');
            if (table) {
                table.appendChild(newRow);
            }
        });
    }

    // Run the function when the page is fully loaded
    window.addEventListener('load', sumSkillNumbersPerPlayer);
})();