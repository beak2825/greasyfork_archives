// ==UserScript==
// @name         Polskie-torrenty sortowanie
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Add sorting functionality to the torrents table
// @author       Kapitan Zbik
// @match        https://polskie-torrenty.eu/wyszukaj.php*
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/510728/Polskie-torrenty%20sortowanie.user.js
// @updateURL https://update.greasyfork.org/scripts/510728/Polskie-torrenty%20sortowanie.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let currentSortColumn = -1;
    let currentSortDirection = true; // true for ascending, false for descending

    function sortTable(table, colIndex) {
        const dirModifier = currentSortDirection ? 1 : -1;
        const rows = Array.from(table.querySelectorAll("tr:nth-child(n+2)"));

        rows.sort((a, b) => {
            const aText = a.children[colIndex].textContent.trim();
            const bText = b.children[colIndex].textContent.trim();

            if (colIndex === 1) {
                return (parseFloat(aText) - parseFloat(bText)) * dirModifier;
            }
            if (colIndex === 2) {
                return (new Date(aText) - new Date(bText)) * dirModifier;
            }
            if (colIndex === 3 || colIndex === 4) {
                return (parseInt(aText) - parseInt(bText)) * dirModifier;
            }
            return (aText.localeCompare(bText)) * dirModifier;
        });

        rows.forEach(row => table.appendChild(row));
    }

    function addSortingButtons() {
        const table = document.querySelector(".ttable_headinner");
        if (!table) return;

        const headers = table.querySelectorAll("tr:first-child th, tr:first-child td");
        headers.forEach((header, index) => {
            header.style.cursor = "pointer";

            header.addEventListener("click", () => {
                if (currentSortColumn === index) {
                    currentSortDirection = !currentSortDirection; // Zmiana kierunku sortowania
                } else {
                    currentSortDirection = true; // Resetowanie kierunku sortowania
                }
                currentSortColumn = index;
                sortTable(table, index);
            });
        });
    }

    window.onload = addSortingButtons;
})();
