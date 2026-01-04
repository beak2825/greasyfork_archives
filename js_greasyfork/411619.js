// ==UserScript==
// @name         Sort by year or catalog number on label pages
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Unfortunately, only 50 results / page are permitted
// @author       You
// @match        https://rateyourmusic.com/label/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411619/Sort%20by%20year%20or%20catalog%20number%20on%20label%20pages.user.js
// @updateURL https://update.greasyfork.org/scripts/411619/Sort%20by%20year%20or%20catalog%20number%20on%20label%20pages.meta.js
// ==/UserScript==

(function() {
    'use strict';
//--------------------------------------
var sortYear=document.querySelectorAll("th")[0]
sortYear.onmouseover = function(){sortYear.style.textDecoration="underline";sortYear.style.cursor="pointer"}
sortYear.onmouseout = function(){sortYear.style.textDecoration=""}

var sortCat=document.querySelectorAll("th")[3]
sortCat.onmouseover = function(){sortCat.style.textDecoration="underline";sortCat.style.cursor="pointer"}
sortCat.onmouseout = function(){sortCat.style.textDecoration=""}
// var sortCat = document.createElement("a")
// sortCat.innerText = " ↓ ";
// sortCat.href="javascript:void(0);"
// document.querySelectorAll("th")[3].appendChild(sortCat);
//-----------------------------------------

    sortYear.onclick=function(){sortTable(0)}
    sortCat.onclick=function(){sortTable(3)}

//----------------------------------------------
function sortTable(n) {

  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;

  table = document.getElementsByClassName("mbgen")[1];
  switching = true;
  // Set the sorting direction to ascending:
  dir = "asc";
  /* Make a loop that will continue until
  no switching has been done: */
  while (switching) {
    // Start by saying: no switching is done:
    switching = false;
    rows = table.rows;
    /* Loop through all table rows (except the
    first, which contains table headers): */
    for (i = 2; i < (rows.length - 2); i++) {
      // Start by saying there should be no switching:
      shouldSwitch = false;
      /* Get the two elements you want to compare,
      one from current row and one from the next: */
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      /* Check if the two rows should switch place,
      based on the direction, asc or desc: */
      if (dir == "asc") {
        if (x.textContent.toLowerCase() > y.textContent.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      } else if (dir == "desc") {
        if (x.textContent.toLowerCase() < y.textContent.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      /* If a switch has been marked, make the switch
      and mark that a switch has been done: */
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      // Each time a switch is done, increase this count by 1:
      switchcount ++;
    } else {
      /* If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again. */
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}



    // Your code here...
})();