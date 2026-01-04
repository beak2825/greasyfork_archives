// ==UserScript==
// @name         XLR node id and ports 
// @match        http://ash01vmxlr03.us.corp.zayo.com*
// @description  this extracts node id and ports from XLR 
// @grant        none
// @license      me
// @version 0.0.1.20230405002550
// @namespace https://greasyfork.org/users/1050064
// @downloadURL https://update.greasyfork.org/scripts/463284/XLR%20node%20id%20and%20ports.user.js
// @updateURL https://update.greasyfork.org/scripts/463284/XLR%20node%20id%20and%20ports.meta.js
// ==/UserScript==

(function() {
  'use strict';

  window.addEventListener('load', () => {
    // Create a button element and add it to the page
    const button = document.createElement('button');
    button.textContent = 'Run Script';
    const node = document.querySelector('#nav-wrapper');
    node.insertBefore(button, node.firstChild);

    // Add a click event listener to the button
    button.addEventListener('click', () => {
      // Select the table element
      const table = document.querySelector('.results tbody');

      if (!table) {
        console.error('Table not found');
        return;
      }

      // Extract the data from the table
      const data = Array.from(table.querySelectorAll('tr')).map(row =>
        Array.from(row.querySelectorAll('td')).map(cell => cell.textContent.trim())
      );

      // Find the column indices for Block Ind, TID, and Card/Port/Slot
      const blockIndIndex = data[0].indexOf('Block Ind');
      const tidIndex = data[0].indexOf('TID');
      const cpsIndex = data[0].indexOf('Card/Port/Slot');

      // Filter the data array to only include rows with "EQ" in the Block Ind column
      const filteredData = data.filter(row => row[blockIndIndex] === 'EQ');

      // Remove the Block Ind column from the filtered data array
      const table4 = filteredData.map(row => [row[tidIndex], row[cpsIndex]]);

      // Remove the header row from the filtered data array
      table4.splice(0, 1);

      // Format the filtered data array into a string with each line grouped by TID
      const formattedTable4 = table4.reduce((acc, row) => {
        const tid = row[0];
        const cps = row[1];
        if (!acc[tid]) {
          acc[tid] = [];
        }
        acc[tid].push(cps);
        return acc;
      }, {});

      // Create a new HTML element to display the formatted string in a copiable window
      const resultWindow = document.createElement('textarea');
      resultWindow.value = Object.keys(formattedTable4).map(tid => `${tid}\n${formattedTable4[tid].join('\n')}\n\n`).join('');
      const mainContainer = document.querySelector('.results');
      mainContainer.insertAdjacentElement('afterend', resultWindow);

      console.log('Button clicked!');
    });
  });
})();
