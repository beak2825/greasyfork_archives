// ==UserScript==
// @name         Honeycomb Table Cells
// @namespace    https://github.com/ecklf
// @version      0.1
// @description  Extracts Honeycomb Table Cell Values
// @author       ecklf
// @icon         https://ui.honeycomb.io/favicon.ico
// @match        https://ui.honeycomb.io/*
// @match        https://ui.honeycomb.io/
// @grant        GM_notification
// @grant        GM.setClipboard
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/509011/Honeycomb%20Table%20Cells.user.js
// @updateURL https://update.greasyfork.org/scripts/509011/Honeycomb%20Table%20Cells.meta.js
// ==/UserScript==

function getTableCellValues() {
  // Get the first table in the HTML document
  const table = document.querySelector('table');

  if (!table) {
    return null;
  }
  // Get all table rows
  const rows = table.querySelectorAll('tr');

  // Initialize an array to store cell values
  const cellValuesArray = [];

  // Iterate over each table row
  rows.forEach((row) => {
    // Get all table data cells in the current row
    const cells = row.querySelectorAll('td');

    // Get the text content of the span element in each cell and join them with " | "
    const cellValues = Array.from(cells).reduce((acc, curr) => {
      const span = curr.querySelector('span');

      if (span.textContent !== '') {
        acc.push(span.textContent.trim());
      }
      return acc;
    }, []);

    // Add cell values to the array
    cellValuesArray.push(cellValues);
  });

  return cellValuesArray.filter((cellValues) => cellValues.length !== 0);
}

(function () {
  "use strict";

  function clickElement(el) {
    const clickEvent = document.createEvent("MouseEvents");
    clickEvent.initEvent("click", true, true);
    el.dispatchEvent(clickEvent);
  }

  function addButton() {
    let button = document.createElement("button");
    button.setAttribute("id", "copyButton");
    button.innerHTML = "Copy Cell Values";
    GM_addStyle(`
        #copyButton {
            position: fixed;
            bottom: 3%;
            right: 3%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 0.5rem;
            --tw-bg-opacity: 1;
            background-color: rgb(15 23 42 / var(--tw-bg-opacity));
            padding-top: 0.75rem;
            padding-bottom: 0.75rem;
            padding-left: 1rem;
            padding-right: 1rem;
            font-size: 0.875rem;
            line-height: 1.25rem;
            font-weight: 600;
            --tw-text-opacity: 1;
            color: rgb(255 255 255 / var(--tw-text-opacity));
        }
        #copyButton:hover {
            --tw-bg-opacity: 1;
            background-color: rgb(51 65 85 / var(--tw-bg-opacity));
        }
    `);

    button.onclick = () => {
      const values = getTableCellValues();
      const joinedRows = values.map(row => row.join(" | "));
      const joinedLines = joinedRows.join("\n");
      window.navigator.clipboard.writeText(joinedLines).then(() => {
          GM.notification({
              text: `Copied ${values.length} rows to clipboard`,
              title: "Honeycomb Table Cells",
          });
      });
    };
    document.body.appendChild(button);
  }
  addButton();
})();