// ==UserScript==
// @name         BPP EV Helper
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Sets Expanded Book View as default, adds a 'Best' column, a 'Book' column, and an 'EV' column on https://ballparkpal.com/PlayerProps.php
// @author       Your Name
// @match        https://ballparkpal.com/PlayerProps.php
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/463183/BPP%20EV%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/463183/BPP%20EV%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function clickExpandedBookView() {
        const expandedBookViewButton = $("button.bigButton:has(span:contains('Expanded Book View'))");
        if (expandedBookViewButton.length) {
            expandedBookViewButton.click();
            setTimeout(addBestAndBookColumns, 1000);
        } else {
            setTimeout(clickExpandedBookView, 500);
        }
    }

function oddsToImpliedProbability(odds) {
  if (odds >= 0) {
    return 100 / (odds + 100);
  } else {
    return -odds / (-odds + 100);
  }
}

function addBestAndBookColumns() {
  const table = document.querySelector('.dataTable.no-footer');
  if (table) {
    // Add the 'Best', 'Book', 'EV (BP)', and 'Value (M)' headers
    const headerRow = table.querySelector('thead tr');
    const bestHeader = document.createElement('th');
    bestHeader.textContent = 'Best';
    bestHeader.className = 'sorting';
    headerRow.appendChild(bestHeader);

    const bookHeader = document.createElement('th');
    bookHeader.textContent = 'Book';
    bookHeader.className = 'sorting';
    headerRow.appendChild(bookHeader);

    const evBPHeader = document.createElement('th');
    evBPHeader.textContent = 'EV (BP)';
    evBPHeader.className = 'sorting';
    headerRow.appendChild(evBPHeader);

    const evMHeader = document.createElement('th');
    evMHeader.textContent = 'Value (M)';
    evMHeader.className = 'sorting';
    headerRow.appendChild(evMHeader);

    // Attach sorting event listeners to the new headers
    bestHeader.addEventListener('click', () => sortColumn(bestHeader, 'numeric'));
    bookHeader.addEventListener('click', () => sortColumn(bookHeader, 'string'));
    evBPHeader.addEventListener('click', () => sortColumn(evBPHeader, 'numeric'));
    evMHeader.addEventListener('click', () => sortColumn(evMHeader, 'numeric'));

    // Calculate and add the 'Best', 'Book', 'EV (BP)', and 'Value (M)' values to the table rows
    const rows = table.querySelectorAll('tbody tr');
    rows.forEach((row) => {
      const cells = row.querySelectorAll('td');
      const headers = ['FD', 'DK', 'MG', 'CZ', 'BS'];
      let bestValue = -Infinity;
      let bestHeader = '';

      headers.forEach((header) => {
        const columnHeader = $(`table.dataTable.no-footer thead tr th:contains('${header}')`)[0];
        if (columnHeader) {
          const columnIndex = Array.from(columnHeader.parentElement.children).indexOf(columnHeader);
          const cellValue = parseFloat(cells[columnIndex].textContent);
          if (cellValue > bestValue) {
            bestValue = cellValue;
            bestHeader = header;
          }
        }
      });

      const bestCell = document.createElement('td');
      bestCell.textContent = bestValue;
      row.appendChild(bestCell);

      const bookCell = document.createElement('td');
      bookCell.textContent = bestHeader;
      bookCell.style.backgroundColor = getHeaderColor(bestHeader);
      bookCell.style.color = getHeaderFontColor(bestHeader);
      bookCell.style.fontWeight = 'bold';
      row.appendChild(bookCell);

      // Calculate and add the 'EV (BP)' value
      const bpColumnHeader = $(`table.dataTable.no-footer thead tr th:contains('BP')`)[0];
      const bpColumnIndex = Array.from(bpColumnHeader.parentElement.children).indexOf(bpColumnHeader);
      const fairOdds = parseFloat(cells[bpColumnIndex].textContent);
      const fairImpliedProbability = oddsToImpliedProbability(fairOdds);

      const bestImpliedProbability = oddsToImpliedProbability(bestValue);

      const evBPValue = (fairImpliedProbability - bestImpliedProbability) / bestImpliedProbability * 100;

      const evBPCell = document.createElement('td');
      evBPCell.textContent = evBPValue.toFixed(2) + '%';
      row.appendChild(evBPCell);

  // Calculate and add the 'Value (M)' value
  const oddsValues = headers.map((header) => {
    const columnHeader = $(`table.dataTable.no-footer thead tr th:contains('${header}')`)[0];
    if (columnHeader) {
      const columnIndex = Array.from(columnHeader.parentElement.children).indexOf(columnHeader);
      const cellValue = parseFloat(cells[columnIndex].textContent);
      return cellValue;
    } else {
      return null;
    }
  }).filter(value => value !== null).sort((a, b) => a - b);

  oddsValues.pop(); // Remove the highest value
  const averageOdds = oddsValues.length > 1 ? oddsValues.reduce((sum, value) => sum + value, 0) / oddsValues.length : 0;
  const averageImpliedProbability = oddsToImpliedProbability(averageOdds);

  const evMValue = (averageImpliedProbability - bestImpliedProbability) / bestImpliedProbability * 100;

  const evMCell = document.createElement('td');
  evMCell.textContent = evMValue.toFixed(2) + '%';
  row.appendChild(evMCell);
});


  } else {
    setTimeout(addBestAndBookColumns, 500);
  }
}



    function sortColumn(header, type) {
        const table = document.querySelector('.dataTable.no-footer');
        const columnIndex = Array.from(header.parentElement.children).indexOf(header);
        const sortOrder = header.className === 'sorting_asc' ? 'desc' : 'asc';
        const rows = Array.from(table.querySelectorAll('tbody tr'));
        const sortedRows = rows.sort((a, b) => {
            const aCell = a.cells[columnIndex];
            const bCell = b.cells[columnIndex];
            const aValue = type === 'numeric' ? parseFloat(aCell.textContent) : aCell.textContent;
            const bValue = type === 'numeric' ? parseFloat(bCell.textContent) : bCell.textContent;

            if (sortOrder === 'asc') {
                return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
            } else {
                return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
            }
        });

        const tbody = table.querySelector('tbody');
        sortedRows.forEach(row => tbody.appendChild(row));

        // Update header classes
        const allHeaders = table.querySelectorAll('thead th');
        allHeaders.forEach(th => {
            if (th === header) {
                th.className = sortOrder === 'asc' ? 'sorting_asc' : 'sorting_desc';
            } else {
                th.className = 'sorting';
            }
        });
    }

    function getHeaderColor(headerText) {
        switch(headerText) {
            case 'BP':
                return 'rgb(240, 180, 108)';
            case 'FD':
                return 'rgb(20, 147, 255)';
            case 'DK':
                return 'rgb(154, 196, 52)';
            case 'MG':
                return 'rgb(177, 128, 30)';
            case 'CZ':
                return 'rgb(209, 194, 111)';
            case 'BS':
                return 'rgb(237, 62, 62)';
            default:
                return '';
        }
    }

    function getHeaderFontColor(headerText) {
        switch(headerText) {
            case 'BP':
                return 'rgb(22, 130, 65)';
            case 'FD':
                return 'rgb(29, 54, 94)';
            case 'DK':
                return 'rgb(244, 108, 34)';
            case 'MG':
                return 'rgb(0, 0, 0)';
            case 'CZ':
                return 'rgb(5, 54, 45)';
            case 'BS':
                return 'rgb(255, 255, 255)';
            default:
                return '';
        }
    }

    clickExpandedBookView();

})();