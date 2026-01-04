// ==UserScript==
// @name        GotBricks? for bricklink.com
// @namespace   Violentmonkey Scripts
// @match       https://www.bricklink.com/catalogItemInv.asp*
// @grant       none
// @version     1.01
// @author      Samantha Finnigan https://finnigan.dev/
// @description 05/01/2024, 17:09:39
// @downloadURL https://update.greasyfork.org/scripts/483987/GotBricks%20for%20bricklinkcom.user.js
// @updateURL https://update.greasyfork.org/scripts/483987/GotBricks%20for%20bricklinkcom.meta.js
// ==/UserScript==

// Iterate table and add a cell with a checkbox to each row
function addCheckboxes() {
  ds = JSON.parse(localStorage.getItem(localName))
  rows = document.querySelector("table.ta").rows

  // Iterate table
  for( i in rows ) {
    if(Object.hasOwn(rows, i)) {

      // Handle all other rows
      row = rows[i]
      cells = row.cells

      // Handle header
      if(i == 0) {
        cell = document.createElement("td")
        f = document.createTextNode("Got")
        cell.appendChild(f)
        row.appendChild(cell)
        continue
      }

      // Extend rows that have a colspan to new length
      if( cells.length === 1 ) {
        cell = cells[0]
        if( cell.hasAttribute("colspan") ) {
          cell.setAttribute("colspan", 7)
        }
        continue
      }

      // Handle body rows
      if(cells.length >= 5) {
        checkbox = document.createElement("input")
        checkbox.setAttribute("type", "checkbox")
        checkbox.id = 'found' + i
        checkbox.index = i
        checkbox.value = ds[i]
        checkbox.checked = ds[i]
        checkbox.onclick = function() { storeBrickGot(this.checked, this.index); };

        cell = document.createElement("td")
        cell.appendChild(checkbox)
        cell.setAttribute("align", "CENTER")
        row.appendChild(cell)
      }
    }
  }
}

// Get the Set ID from the URL params
function getSetID() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get('S')
}

// Create the datastructure backing the UI
function createDS(localName) {
  ds = JSON.parse(localStorage.getItem(localName))
  if(ds === null) {
    rows = document.querySelector("table.ta").rows.length
    ds = new Array(rows).fill(false);
    localStorage.setItem(localName, JSON.stringify(ds))

  }
}

// Update the backing datastructure
function storeBrickGot(checked, index) {
  ds = JSON.parse(localStorage.getItem(localName))
  ds[index] = checked
  localStorage.setItem(localName, JSON.stringify(ds))
}

// Global Constants
const localName = `userscript.gotbricks.${getSetID()}`;

(function() {
  // Main
  console.log("Got bricks?")
  createDS(localName);
  addCheckboxes();
})();