// ==UserScript==
// @name         MAM Total SeedBonus
// @namespace    https://greasyfork.org/en/users/705546-yyyzzz999
// @version      0.4
// @license      MIT
// @description  9/26/22 Shows the bonus points per hour for each torrent if one can guess and code the formula
// @author       yyyzzz999
// @match        https://www.myanonamouse.net/snatch_summary.php*
// @icon         https://cdn.myanonamouse.net/imagebucket/164109/gsum.png
// @homepage     https://greasyfork.org/en/users/705546-yyyzzz999
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/451947/MAM%20Total%20SeedBonus.user.js
// @updateURL https://update.greasyfork.org/scripts/451947/MAM%20Total%20SeedBonus.meta.js
// ==/UserScript==
/*jshint esversion: 6 */
/*eslint no-multi-spaces:0 */


let DEBUG =1; // Debugging mode on (1) or off (0)
let TABMOD = 0 ;
//let TMC = 0 ; //Table modified (1st row, last column & row


function createSpan(elemnt,txt,id) {
   var x = document.createElement('span');
   x.innerHTML = txt;
   if (id) x.id = id;
   elemnt.appendChild(x);
    return x;
}

let el = document.querySelectorAll("div.blockHeadCon")[4].firstChild; //Active row where we'll add control button
//Bug if duplicates appear, this should be [5] instead of 4, add code later to move button
createSpan(el,"&nbsp;"); //insert a space span
createButton(el, "BonusCalc", bonusCalc, "MTS_Calc");  //Used after Active is loaded

function bonusCalc(){
let STab = document.querySelector("#sSat");
let rows = STab.getElementsByTagName('tr'); // get all rows of satisfied seeding torrents
if (!TABMOD) { //This cell not modified by sort
    rows[0].insertCell().innerHTML = "Bonus Points /hour";
    TABMOD = 1;
}
let total = 0; // total guestimated bpph income
let seeds = 0; // seeds on currently examined torrent
let stot  = 0; // total seeds on all torrents
let small = 0; // 1 - 4 Seeders
let med = 0; // 5 - 19 Seeders
let large = 0; // 20 - 49 Seeders
let xlrg = 0; // >49 Seeders
let sizeb = 0; // Originally size bpph, but then used for total bpph/torrent
 //v.4 fix table update after sort and recalc
if (rows.length > 1) {
let lastrow = rows.length;

    // examine every row of the Active table.  Need to add Uploaded table too!
   for (let i = 1; i < lastrow; i++) {
       // get the number of seeds, and the string for size and units  (Does not work on cross-seeded torrents...)
       seeds=parseInt(rows[i].cells[6].childNodes[0].innerHTML);
       stot += seeds;
//       if (DEBUG > 0)  console.log("stot= " + stot);
       if (seeds <5) {
           small +=1;
         } else if (seeds >4 && seeds <20){
           med +=1;
         } else if (seeds >19 && seeds <50){
           large +=1;
         } else {
           xlrg +=1;
         }
       const size = rows[i].cells[4].childNodes[1].innerHTML.split(" ");
       // Guess the floor, and max for size award similar to: https://www.myanonamouse.net/f/t/27964/p/1
       if (size[1] == "KiB") {
         sizeb = .95;
         } else if (size[1] == "MiB") {
             sizeb = .95 + parseFloat((size[0].trim()))/8000;
         } else if (size[1] == "GiB") {
             sizeb = parseFloat((size[0].trim()));
             if (sizeb >= 8) {sizeb =1}  else { sizeb = sizeb/8;}
         } else {
         console.log("size[1]= "+ size[1]);
         }
// Add bonus for fewer seeds. Trying numbers from this sheet https://03iml.mrd.ninja/fQ3Y
       if (seeds < 5) { sizeb = 1.5 * sizeb}
       if (seeds > 12 && seeds < 50) { sizeb = 0.8 * sizeb}
       if (seeds > 49 ) { sizeb = 0.55 * sizeb}

         rows[i].insertCell().innerHTML = sizeb.toFixed(4);

       total += sizeb;

	   if ((DEBUG > 0) && (i<40)) console.log("i= " + i + " seeds= "+ seeds + " sizeb= "+ sizeb.toFixed(4) );

   } // for loop to read table and insert individual torrent bpph amount
console.log("total= " + total);

// Fix recalc after table sort v.4
    let newrow = STab.insertRow();
    for (let i = 0; i < 2; i++) {
        newrow.insertCell().innerHTML = " ";
    }
    let tstr = small + ' ' + med + ' ' + large + ' ' + xlrg + ' T= ' + stot + ' G= ' + total.toFixed(2);
    let statid =document.querySelector("#MTS_StatSum");
    if (statid == null) {
        createSpan(el," "+tstr,"MTS_StatSum")
    } else {
        statid.innerHTML = tstr; // v.4 Not changing now, but will when tweak cuts offs is added
    }
    newrow.insertCell().innerHTML =
        "Torrents with <5, 5-19, 20-49, >49 seeds = " + tstr; //v.3
    newrow.insertCell().innerHTML = ' ';
    newrow.insertCell().innerHTML = "Seed Total = "; //v.2
    newrow.insertCell().innerHTML = stot;
    newrow.insertCell().innerHTML = "Total = ";
    newrow.insertCell().innerHTML = total.toFixed(2);

} // if (rows.length > 1) We have active torrents
} // function bonusCalc()
// Similar to https://stackoverflow.com/questions/45056949/adding-button-to-specific-div
function createButton(elemnt, value, func, id, color) {
  var button = document.createElement("input");
  button.type = "button";
  if (id) button.id = id; //won't work for falsy ids like 0 or NaN
  button.value = value; //button label or in some cases set name
    color = color || "White";
  button.style.backgroundColor = color;
  button.style.borderRadius = "15%"; // No work bro!
  button.onclick = func;
  elemnt.appendChild(button);
}