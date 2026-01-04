// ==UserScript==
// @name         MAM Total Torrents
// @namespace    https://greasyfork.org/en/users/705546-yyyzzz999
// @version      0.5
// @license      MIT
// @description  10/30/25 Shows the total number of torrents on all clients, and the change in number of torrents for each client
// @author       yyyzzz999
// @match        https://www.myanonamouse.net/userClientDetails.php*
// @icon         https://cdn.myanonamouse.net/imagebucket/164109/gsum.png
// @homepage     https://greasyfork.org/en/users/705546-yyyzzz999
// @supportURL   https://greasyfork.org/en/scripts/451080-mam-total-torrents/feedback
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @downloadURL https://update.greasyfork.org/scripts/451080/MAM%20Total%20Torrents.user.js
// @updateURL https://update.greasyfork.org/scripts/451080/MAM%20Total%20Torrents.meta.js
// ==/UserScript==
/*jshint esversion: 6 */
/*eslint no-multi-spaces:0 */

(function() {
    'use strict';

let DEBUG =2; // Debugging mode on 2 verbose, 1 normal, or off 0
let client_table = document.querySelectorAll("div[class='blockBodyCon left']")[1];
let uns = document.querySelector("#tmUN");
let total = 0;
const numValues = GM_listValues().length; // if 0, this is the first run of script so don't report anything missing!
const rows = client_table.querySelectorAll('tr');
for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const ip = row.children[0].querySelector('a').textContent.trim();
    const name = row.children[1].textContent.trim();
    const key = ip + name;
    const value = row.children[2].querySelector('a').textContent.trim();
    if (!isNaN(value)) total += parseInt(value);
    if (DEBUG > 0) console.log("Total: " + total);
    const oldValue = GM_getValue(key);
    if (DEBUG > 1) console.log(`GM_listValues().length: ${GM_listValues().length}`);
    if (oldValue !== undefined) {
      const diff = parseInt(value) - parseInt(oldValue);
      if (diff > 0) {
        if (DEBUG > 0) console.log(row.children[2].innerHTML);
        row.children[2].innerHTML = row.children[2].innerHTML.replace(value, `${oldValue}+${diff}`);
        if (DEBUG > 0) console.log(row.children[2].innerHTML);
      } else if (diff < 0) {
        row.children[2].innerHTML = row.children[2].innerHTML.replace(value, `${oldValue}${diff}`);
      }
    } else if (numValues === 0) {
      console.log(`No keys found in storage. 1st Run`);
        /* If we don’t check for this condition, the script will log a missing key message on the first run even though there are no keys in storage. */
    } else if (GM_listValues().length > numValues && i > numValues - 2) {
      document.querySelector('.blockFoot').innerHTML=`<h4>Client ${key} is offline.</h4>`;
      }
    GM_setValue(key, value);
    if (DEBUG > 1) console.log(`Key: ${key}`);
  }

 //  let elb = document.querySelector("div[id='mainBody'] div[class='blockHeadCon']"); Old page layout
let elb =  document.querySelectorAll("h4")[2];
if (uns != null) { // Added check for Unsats shown in the top menu bar in MAM Main Menu Preferences
let unsat = parseInt(uns.textContent.split(" ")[0]);
const net = total - unsat;
if (DEBUG > 0) console.log("net: " + net);
elb.innerHTML = elb.innerHTML.replace('</h4>', '') + " | Total Torrents: " + total +
" - Unsats = " + net + '</h4>' ;
} else { // Unsats not shown
elb.innerHTML = elb.innerHTML.replace('</h4>', '') + " | Total Torrents: " + total + '</h4>' ;
}

})();