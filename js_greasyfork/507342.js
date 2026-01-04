// ==UserScript==
// @name        Sudokupad copy cells
// @namespace   Violentmonkey Scripts
// @match       https://sudokupad.app/*
// @grant       GM_setClipboard
// @version     1.1
// @author      Giuseppe Stelluto
// @license     GPL3
// @description Add a button to sudokupad.app allowing to copy the current cell selection to clipboard
// @require https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @downloadURL https://update.greasyfork.org/scripts/507342/Sudokupad%20copy%20cells.user.js
// @updateURL https://update.greasyfork.org/scripts/507342/Sudokupad%20copy%20cells.meta.js
// ==/UserScript==

function copyCells() {
  let grid = Framework.app.grid.cells;

  let allCells = grid.reduce((acc, row2) => acc.concat(row2));
  let highlightedCells = allCells.filter((cell) => cell.highlighted);
  let highlightedRows = highlightedCells.map((cell) => cell.row);
  let highlightedCols = highlightedCells.map((cell) => cell.col);
  // check if the selection lives in multiple rows/cols and is therefore not copyable
  if (highlightedRows.some((row) => row !== highlightedRows[0])
      && highlightedCols.some((col) => col !== highlightedCols[0])) {
    Framework.showAlert("The selection is invalid or empty: only select digits from one row or column.");
  }
  let digits = highlightedCells.map((cell) => cell.value);
  if (digits.length > 0) {
    GM_setClipboard(digits.join(''));
    Framework.showAlert(digits.join('') + " copied to clipboard!")
  }
}

function main() {
  const controlsSmall = document.querySelector('#controls .controls-app.controls-small');

  let button = document.createElement('button');

  const iconWrapper = document.createElement('div');
  iconWrapper.className = 'icon';
  const icon = document.createElement('span');
  icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>content-copy</title><path d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z" /></svg>'
  iconWrapper.appendChild(icon);
  button.appendChild(iconWrapper);

  // button.innerText = "C"
  button.addEventListener('click', (e) => copyCells());
  button.addEventListener('touchend', (e) => copyCells());
  controlsSmall.appendChild(button);
}

const disconnect = VM.observe(document.body, () => {
  // Find the target node
  const controls = document.querySelector('#controls');

  if (controls) {
    try {
      main()
    } catch {
      console.log("some error")
    } finally {
      return true;
    }
  }
});