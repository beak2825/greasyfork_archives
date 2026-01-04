// ==UserScript==
// @name         [GC][Backup] - Stock Enhancements
// @namespace    https://greasyfork.org/en/users/1225524-kaitlin
// @match        https://www.grundos.cafe/games/stockmarket/portfolio/*
// @match        https://www.grundos.cafe/games/stockmarket/stocks/*
// @version      1.1
// @license      MIT
// @description  Sort stocks listed on the portfolio page in descending order by percentage with highest profit percentages first. Original highlight script by Shalane., edited for compatibility after CSS changes.
// @author       Cupkait
// @icon         https://i.imgur.com/4Hm2e6z.png
// @downloadURL https://update.greasyfork.org/scripts/547294/%5BGC%5D%5BBackup%5D%20-%20Stock%20Enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/547294/%5BGC%5D%5BBackup%5D%20-%20Stock%20Enhancements.meta.js
// ==/UserScript==

  if (window.location.href.endsWith("/stockmarket/portfolio/")) {
      sortPortfolio();
  } else if (window.location.href.endsWith("=True")) {
      highlightRows();
  }



function sortPortfolio() {
var table = document.querySelector('.portfolio-table');

if (!table) {
    console.log("Table not found on this page.");
    return;
}

var rows = Array.from(table.querySelectorAll('tbody > tr'))
  .filter(row => row.querySelectorAll('td').length === 9);

rows.sort((rowA, rowB) => {
    var cellsA = rowA.querySelectorAll('td');
    var cellsB = rowB.querySelectorAll('td');

    if (cellsA.length < 9 || cellsB.length < 9) {
        return 0;
    }

    var valueA = parseFloat(cellsA[8].innerText.replace('%', '')) || 0;
    var valueB = parseFloat(cellsB[8].innerText.replace('%', '')) || 0;

    return valueB - valueA;
});

rows.forEach(row => table.appendChild(row));

}

function highlightRows() {
        var table = document.querySelector('.stock-table');

        if (!table) {
            console.log("Table not found on this page.");
            return;
        }

        var rows = Array.from(table.querySelectorAll('tr'));

        // Display buyable stocks
        var curr15Rows = [];

        rows.forEach(function(row) {
            var cells = row.querySelectorAll('td');
            if (cells.length >= 6) {
                var currCell = cells[5];
                if (currCell.textContent.trim() === "15") {
                    curr15Rows.push(row);
                }
            }
        });

        if (curr15Rows.length === 0) {
            var messageDiv = document.createElement('div');
            messageDiv.textContent = "😭 There are no buyable stocks at this time.";
            messageDiv.style.fontSize = '24px';
            messageDiv.style.textAlign = 'center';
            table.parentNode.insertBefore(messageDiv, table);
        } else {
            curr15Rows.forEach(function(row) {
                row.parentNode.removeChild(row);
                table.insertBefore(row, table.firstChild);

                var cells = row.querySelectorAll('td');
                cells.forEach(function(cell) {
                    cell.style.backgroundColor = 'yellow';
                });
            });
        }
    }