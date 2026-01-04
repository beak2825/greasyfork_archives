// ==UserScript==
// @name Hide non-PF
// @namespace    yyyzzz999
// @author       yyyzzz999
// @description  1/23/24 Adds a button to hide all non PF torrents from Snatched views (like Not Seeding - Satisfied)
// @match        https://www.myanonamouse.net/snatch_summary.php*
// @version      0.4
// @icon         https://www.myanonamouse.net/pic/smilies/karma.gif
// @homepage     https://greasyfork.org/en/users/705546-yyyzzz999
// @supportURL   https://greasyfork.org/en/scripts/484027-hide-non-pf/feedback
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/484027/Hide%20non-PF.user.js
// @updateURL https://update.greasyfork.org/scripts/484027/Hide%20non-PF.meta.js
// ==/UserScript==
/*jshint esversion: 11 */
/*eslint no-multi-spaces:0 */
(function() {
  'use strict';

  var DEBUG =1; // Debugging mode on (1) or off (0)
  if (DEBUG > 0) console.log('Starting Hide non-PF');
  // debugger
  // Create the button
  const button = document.createElement("button");
  button.textContent = "Hide Rows Except PF";
  let el = document.querySelectorAll("div.blockHeadCon")[3].firstChild;
  var span = document.createElement('span');
  span.textContent = " - " ;
  el.appendChild(span);
  el.appendChild(button);

  // Add a click event listener to the button
   button.addEventListener("click", function() {
       var count =0;
    // Get all table rows
    const rows = document.getElementsByTagName("tr");
    // Loop through all rows
    for (let i = rows.length - 1; i > 0; i--) { //We have to start at the last row, otherwise removing a row skips checking the next row.
      const row = rows[i];
      const cells = row.getElementsByTagName("td");
      let hideRow = true;
      // Loop through all cells in the row
      for (let j = 0; j < cells.length; j++) { //shorten this later...
        const cell = cells[j];

        // Check if the cell contains PF
        if (cell.innerHTML.includes('<span title="personal freeleech">PF</span>')) {
          hideRow = false;
            count+=1;
          break;
        }
      }

      // Hide the row if it doesn't contain the target element
      if (hideRow) {
        // row.style.display = "none"; // Hidden rows still seen by DownThemAll, zippers, etc.
        row.remove();
      }
    }
     if (count > 0) span.textContent = ` - ${count} PF torrents found. - ` ;
  }); // End hide function

//    var headDiv = document.querySelector('div.blockHeadCon');
//      headDiv.appendChild(button); //Doesn't work, moves the first button instead of duplicates it.

    if (DEBUG > 0) console.log('Hide non-PF done.');

})();