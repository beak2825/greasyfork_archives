// ==UserScript==
// @name         Izrael fotbal
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Vytvoří tabulku
// @author       Michal
// @match        https://doublepass.sport5.co.il/live.php
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/490286/Izrael%20fotbal.user.js
// @updateURL https://update.greasyfork.org/scripts/490286/Izrael%20fotbal.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function najitSelektory() {
        const matches = document.querySelectorAll('div.live_item > div:first-child');

        if (matches.length > 0) {

            const table = document.createElement("table");
            table.classList.add("custom-table");

            table.style.width = "100%";
            table.style.borderCollapse = "collapse";
            table.style.fontSize = "18px";

            matches.forEach(function(match, rowIndex) {
                const row = table.insertRow();
                row.id = "row_" + (rowIndex + 1);

                const cells = match.querySelectorAll('div[class^="live_td_"]');
                cells.forEach(function(cell, cellIndex) {
                    const cellText = cell.textContent.trim();
                    const tableCell = row.insertCell();
                    tableCell.textContent = cellText;
                    tableCell.style.borderBottom = "1px solid black";
                    tableCell.style.padding = "12px";
                    tableCell.id = "row_" + (rowIndex + 1) + "_cell_" + (cellIndex + 1);
                });
            });

            const container = document.createElement("div");
            container.classList.add("custom-table-container");
            container.style.position = "fixed";
            container.style.top = "30px";
            container.style.left = "30px";
            container.style.maxWidth = "calc(100% - 60px)";
            container.style.maxHeight = "calc(100% - 60px)";
            container.style.overflow = "auto";
            container.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
            container.style.border = "3px solid black";
            container.style.borderRadius = "10px";
            container.style.boxShadow = "0 0 20px rgba(0, 0, 0, 0.5)";
            container.style.zIndex = "999";

            const existingTable = document.querySelector('.custom-table');
            if (existingTable) {
                existingTable.remove();
            }

            container.appendChild(table);
            document.body.appendChild(container);
        }
    }

    najitSelektory();

    setInterval(najitSelektory, 3000);
})();