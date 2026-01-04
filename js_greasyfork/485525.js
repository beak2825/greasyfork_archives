// ==UserScript==
// @name Remove Seeding
// @namespace    yyyzzz999
// @author       yyyzzz999
// @description  2/18/24 Adds a button to remove seeding torrents from Search views (Handy to zip the rest for download)
// @match        https://www.myanonamouse.net/tor/browse.php*
// @version      1.8
// @icon         https://www.myanonamouse.net/pic/smilies/yesmaster.gif
// @homepage     https://greasyfork.org/en/users/705546-yyyzzz999
// @supportURL   https://greasyfork.org/en/scripts/485525-remove-seeding/feedback
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485525/Remove%20Seeding.user.js
// @updateURL https://update.greasyfork.org/scripts/485525/Remove%20Seeding.meta.js
// ==/UserScript==
/*jshint esversion: 11 */
/*eslint no-multi-spaces:0 */

(function() {
'use strict';

const DEBUG =1; // Debugging mode on (1) or off (0)
if (DEBUG > 0) console.log('Starting Remove Seeding script');
var count =0; // count of seeding or leeching removed
var pass =0; // count of clicks on starting button until hidden
var trimShown =0; // is the 3rd button Trim Top shown?
var newtotal;
var startrows;
var defNumDown = 20; // Default number of torrents to download via Zip after Trim to from list bottom
var defNumUp = 15;  // Number of torrents to trim from the top of a list of torrents
// debugger

// Create an observer to watch for changes to the torrent list table
// start with the div containing the table
// Contributed by Humdinger
const observableDiv = document.querySelector('div#ssr');
const observer = new MutationObserver((mutationsList, observer) => {
  console.log('observer callback');
  for (let mutation of mutationsList) {
    console.log(mutation.type);
    if (mutation.type === 'childList') {
      console.log('A child node has been added or removed: ' + mutation.target.tagName);
      pass = 0;
      count = 0;
      trimShown = 0;
      removeElements();
    }
  }
});
observer.observe(observableDiv, { childList: true });
// observer.disconnect();

// Remove all elements with an ID that starts with "myTT"
// and reset the button text
// Contributed by Humdinger
function removeElements() {
  var elems = document.querySelector("body").querySelectorAll('[id^="myTT"]')
  if (DEBUG > 0) console.log(elems.length + " elements found to reset.");
  elems.forEach((elem) => elem.remove());
  button.textContent = "Remove Leeching & Seeding Rows";
  button.style.display = "";
  span.textContent = "";
}

// Create the button
var button = document.createElement("button");
button.textContent = "Remove Leeching & Seeding Rows";
button.style.fontSize = "19px";
button.style.borderRadius = "19px";
button.style.backgroundColor = "LightBlue";
let el = document.querySelector("div.blockFoot");
var span = document.createElement('span');
el.appendChild(button);
span.textContent = "" ;
span.style.fontSize = "18px";
el.appendChild(span);
// Add a click event listener to the button
button.addEventListener("click", function() {
// Get all table rows
//let rows = document.querySelector('table.newTorTable').querySelectorAll('tr');
    let rows = document.querySelector('table.newTorTable').querySelectorAll('[id^="tdr"]');
//const rows = document.getElementsByTagName("tr");
//  startrows=rows.length-1; // Not always, in an author search we get a bunch more title rows with "Torrents added " Dates
    startrows=rows.length; //Thank you Humdinger for the thoughtful FIX!
    // THIS TOTALLY BREAKS the trim counts and count of torrents.  For now only use on regular searches.
    if (DEBUG > 0) console.log(`rows.length: ${rows.length}`);
// Loop through all rows
for (let i = rows.length - 1; i >= 0; i--) { //We have to start at the last row, otherwise removing a row skips checking the next row.
  const row = rows[i];
  const cells = row.getElementsByTagName("td");
  let removeRow = false;
  if (DEBUG > 1) console.log(`i: ${i}`);
  // Loop through all cells in the row
  for (let j = 0; j < cells.length; j++) { //shorten this later...
    const cell = cells[j];

    // Check if the cell contains PF
    if (cell.innerHTML.includes('<div class="browseAct">Recently Seeding in&nbsp;your Client</div>') || cell.innerHTML.includes('<div class="browseAct">Recently Downloading in&nbsp;your Client</div>') || cell.innerHTML.includes('<div class="browseInact">Previously Partially Downloaded by&nbsp;you</div>')        ) {
      removeRow = true;
      break;
    }
  }

  // Hide the row if it doesn't contain the target element
  if (removeRow) {
    // row.style.display = "none";
      row.remove();
      if (DEBUG > 0) console.log(`i: ${i} Removed`);
      count+=1;
  }
}
if (!trimShown) newtotal=startrows-count; // title row doesn't count, and length first item is number zero
if (DEBUG > 0) console.log(`count: ${count}, pass: ${pass}, newtotal: ${newtotal}, trimShown: ${trimShown} `);
if ( pass==0 ) {
    button.textContent = "Rows Removed";
    span.textContent = ` ${count} Torrents removed, ${newtotal} left. ` ; //rows.length wasn't updating correctly after remove.
    pass+=1; // show no change if button pressed twice
    if (DEBUG > 0) console.log(`count: ${count}, pass: ${pass}, newtotal: ${newtotal}, trimShown: ${trimShown} `);
} else if (pass >0) {
    span.textContent = ` ${newtotal} Torrents listed. ` ;
    button.style.display = "none";
    if (trimShown > 0) {
      createButton(el, "Trim Top", getTrimTOP, "myTTB", "RoyalBlue");
      createSpan(el, `<input type="number" id="defNumUp" size="3" style="font-size: 18px;" value="${defNumUp}">`, "myTTS");
      createSpan(el, " torrents.", "myTTS2");
      trimShown = 1;
    }
  }
  if (!trimShown) {
    createButton(el, "Trim to", getTrimTo, "myTToB");
    createSpan(el, `<input type="number" id="defNumDown" size="3" style="font-size: 18px;" value="${defNumDown}">`, "myTToS");
    createSpan(el, " torrents. ", "myTToS2");
    trimShown = 1;
  }
  }); // End hide function and remove button creation

function getTrimTo() {
    let n = document.querySelector("#defNumDown").value
    console.log("defNumDown: " + n );
    //Making rows global broke something, so I'm just going to grab a local copy here
    let rows = document.querySelector('table.newTorTable').querySelectorAll('[id^="tdr"]');
    if (n < rows.length - 1) {
      for (let i = rows.length - 1; i >= n; i--) { rows[i].remove(); }
      span.textContent = ` ${n} Torrents listed. ` ;
      newtotal=n; // In case Remove button hit again.
    }
}
function getTrimTOP() {
    let n = document.querySelector("#defNumUp").value;
    console.log("defNumUp: " + n );
    //Making rows global broke something, so I'm just going to grab a local copy here
    let rows = document.querySelector('table.newTorTable').querySelectorAll('[id^="tdr"]');
    if (DEBUG > 0) console.log(`rows.length: ${rows.length}`);
    if (n <= rows.length) {
//    for (let i = n+1; i > 1; i--) {
      for (let i = 0; i <n ; i++) {
        rows[i].remove();

/*      rows[i].remove(); Removed nothing with i--  So confusing!
        When you remove an element from the DOM, the indices of the remaining elements shift,
        which can cause unexpected behavior in this kind of loop.
*/
        if (DEBUG > 0) console.log(`i: ${i}`);
    }
      span.textContent = ` ${rows.length - n} Torrents listed. ` ;
      newtotal=n; // In case Remove button hit again.
    }

}
function createSpan(elemnt,txt,id) {
    var x = document.createElement('span');
    x.style.fontSize = "18px";
    x.innerHTML = txt;
    if (id) x.id = id;
    elemnt.appendChild(x);
    return x;
}

// Similar to https://stackoverflow.com/questions/45056949/adding-button-to-specific-div
function createButton(elemnt, value, func, id, color) {
  var button = document.createElement("button");
    button.type = "button"; // Not a form submit button
  if (id) button.id = id; //won't work for falsy ids like 0 or NaN
  button.textContent = value; //button label or name
    color = color || "LightBlue";
  button.style.backgroundColor = color;
  button.style.fontSize = "19px";
  button.style.borderRadius = "19px";
  if (func) button.onclick = func;
  elemnt.appendChild(button);
}

if (DEBUG > 0) console.log('Remove Seeding script done.');

})();