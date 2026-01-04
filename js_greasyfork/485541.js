// ==UserScript==
// @name         Faction Xan Tracker
// @namespace    http://tampermonkey.net/
// @version      2024-01-23
// @description  Corleone Use Only
// @author       Latinobull14
// @match        https://www.torn.com/factions.php?step=your*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485541/Faction%20Xan%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/485541/Faction%20Xan%20Tracker.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Create the table element
  const table = createTable();

  // Add a button to trigger data retrieval
  addButton();

  // Function to create the table
  function createTable() {
    const table = document.createElement('table');
    table.style.backgroundColor = 'grey';
    table.style.fontSize = '24px';
    return table;
  }

  // Function to add a button
  function addButton() {
    setTimeout(() => {
      const newsheader = document.querySelector('.newsHeader___rFk7I');
      const button = document.createElement('button');
      button.textContent = 'xan';
      button.classList.add('tab___reCD3');
      newsheader.prepend(button);

      button.addEventListener('click', getData);
    }, 2000);
  }

  // Function to retrieve and display data
  function getData() {
    const div = document.querySelector('#react-root').children[0].children[0];
    const xanData = countXanItems();

    // Clear the table content
    table.innerHTML = '';

    // Display the data in the table
    for (const name in xanData) {
      if (xanData.hasOwnProperty(name)) {
        const value = xanData[name];
        createTableRow(table, name, value);
      }
    }

    // Add a total row to the table
    const total = calculateTotal(xanData);
    createTableRow(table, 'Total', total);

    // Insert the table into the div
    const secondToLastChild = div.children[div.children.length - 2];
    div.insertBefore(table, secondToLastChild);
  }

  // Function to count Xanax items
  function countXanItems() {
    const allData = Array.from(document.getElementsByClassName('listItemWrapper___XHSAe'));
    const xanData = {};

    for (const item of allData) {
      if (item.textContent.includes('Xanax items')) {
        const name = item.textContent.split(' ')[0];
        xanData[name] = (xanData[name] || 0) + 1;
      }
    }

    return Object.entries(xanData)
      .sort((a, b) => b[1] - a[1])
      .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});
  }

  // Function to create a table row
  function createTableRow(table, name, value) {
    const row = table.insertRow();
    const nameCell = row.insertCell(0);
    const valueCell = row.insertCell(1);
    nameCell.textContent = name;
    valueCell.textContent = value;
  }

  // Function to calculate the total value
  function calculateTotal(data) {
    let total = 0;
    for (const name in data) {
      if (data.hasOwnProperty(name)) {
        total += data[name];
      }
    }
    return total;
  }
})();
