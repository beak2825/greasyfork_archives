// ==UserScript==
// @name         ARX-M theme and bookwork check skipper for sparx maths
// @namespace    http://tampermonkey.net/
// @version      1.12.5
// @liscence     MIT
// @description  skip bookwork check and see answer ONCE INPUT entered on sparx
// @author       ARX-M
// @match        https://www.sparxmaths.uk/student/
// @icon         https://www.wgu.edu/content/dam/web-sites/blog-newsroom/blog/images/national/2019/august/grey-hat-hacking.jpg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/460717/ARX-M%20theme%20and%20bookwork%20check%20skipper%20for%20sparx%20maths.user.js
// @updateURL https://update.greasyfork.org/scripts/460717/ARX-M%20theme%20and%20bookwork%20check%20skipper%20for%20sparx%20maths.meta.js
// ==/UserScript==

let key = 1010.5 * 4 / 2
let person = prompt("THIS SITE REQUIRES A PASSCODE");
if (person == key) {
   alert("CORRECT CODE")
   console.log("a new user successfully logged in with a password!")  
const tbl = document.createElement("table");
  const tblBody = document.createElement("tbody");

  // creating all cells
  for (let i = 0; i < 2; i++) {
    // creates a table row
    const row = document.createElement("tr");

    for (let j = 0; j < 2; j++) {
      // Create a <td> element and a text node, make the text
      // node the contents of the <td>, and put the <td> at
      // the end of the table row
document.title = 'SPARX-HACKS 2023';
const header = document.querySelector('._TopBanner_g7mut_1');
header.style.background = 'black';
const backround = document.querySelector('._PageBackground_13pic_1');
backround.style.backgroundColor = 'grey';
const sidebar = document.querySelector('._Sidebar_ux884_142');
sidebar.style.backgroundColor = 'black';
const TITLE = document.querySelector('._SMLogo_g7mut_40') //XP header
    if (TITLE !== null) {
        TITLE.textContent = "<<==SPARX MATHS HACK==>> 2023 ED.";
    }
const welcome = document.querySelector('._Hello_1ehfm_21') //XP header
    if (welcome !== null) {
        welcome.textContent = "WELCOME TO SPARX MATHS HAK 2023 ED.";
    }
const welcomesub = document.querySelector('._PackageTypeDescription_1ehfm_32') //XP header
    if (welcomesub !== null) {
        welcomesub.textContent = "Finally, took you long enough to find a new hack for it. Many thanks to the glitch team for designing and building this awsome script! Keep posted for more awsome hacks like this one. STAY GLITCHED! 😁";
    }
const xph = document.querySelector('._XPCount_g7mut_68') //XP header
    if (xph !== null) {
        xph.textContent = "10,000,000,000 😁";
    }
const name = document.querySelector('._StudentName_g7mut_62') //XP header
    if (name !== null) {
        name.textContent = "ADMIN";
    }

window.addEventListener("keydown", checkKeyPressed, false);

function checkKeyPressed(evt) {
    if (evt.keyCode == "81") {
        let groupselect = prompt("wich group would you like to save? (1, 2, 3, 4)"); 
      if (groupselect == "1") { 
            alert("Creating save file for group 1");  
        let ansselect1 = prompt("wich group would you like to save? (a, b, c, d)"); 
      if (ansselect1 == "a") { 
        let quest1A = prompt("answer to 1A?"); const cell = document.createElement("td"); const cellText = document.createTextNode(`1A = ${quest1A}`); cell.appendChild(cellText); row.appendChild(cell); if (quest1A ==! null) { alert("Saved to database"); }
            alert("the Answer to " + groupselect + ansselect1 + " = " + quest1A);
            console.log("1A" + " = " + quest1A) }
              if (ansselect1 == "b") { 
        let quest1B = prompt("answer to 1B?"); const cell = document.createElement("td"); const cellText = document.createTextNode(`1B = ${quest1B}`); cell.appendChild(cellText); row.appendChild(cell); if (quest1B ==! null) { alert("Saved to database"); }
            alert("the Answer to " + groupselect + ansselect1 + " = " + quest1B);
            console.log("1B" + " = " + quest1B) }
              if (ansselect1 == "c") { 
        let quest1C = prompt("answer to 1C?"); const cell = document.createElement("td"); const cellText = document.createTextNode(`1C = ${quest1C}`); cell.appendChild(cellText); row.appendChild(cell); if (quest1C ==! null) { alert("Saved to database"); }
            alert("the Answer to " + groupselect + ansselect1 + " = " + quest1C);
            console.log("1C" + " = " + quest1C) }
              if (ansselect1 == "d") { 
        let quest1D = prompt("answer to 1D?"); const cell = document.createElement("td"); const cellText = document.createTextNode(`1D = ${quest1D}`); cell.appendChild(cellText); row.appendChild(cell); if (quest1D ==! null) { alert("Saved to database"); }
            alert("the Answer to " + groupselect + ansselect1 + " = " + quest1D);
            console.log("1D" + " = " + quest1D) }
              if (ansselect1 == "e") { 
        let quest1E = prompt("answer to 1E?"); const cell = document.createElement("td"); const cellText = document.createTextNode(`1E = ${quest1E}`); cell.appendChild(cellText); row.appendChild(cell); if (quest1E ==! null) { alert("Saved to database"); }
            alert("the Answer to " + groupselect + ansselect1 + " = " + quest1E);
            console.log("1E" + " = " + quest1E) }
              if (ansselect1 == "f") {  
        let quest1F = prompt("answer to 1F?"); const cell = document.createElement("td"); const cellText = document.createTextNode(`1F = ${quest1F}`); cell.appendChild(cellText); row.appendChild(cell); if (quest1F ==! null) { alert("Saved to database"); }
            alert("the Answer to " + groupselect + ansselect1 + " = " + quest1F);
            console.log("1F" + " = " + quest1F) }
    }
            if (groupselect == "2") { 
            alert("Creating save file for group 2");  
        let ansselect1 = prompt("wich group would you like to save? (a, b, c, d)"); 
      if (ansselect1 == "a") { 
        let quest2A = prompt("answer to 2A?"); const cell = document.createElement("td"); const cellText = document.createTextNode(`2A = ${quest2A}`); cell.appendChild(cellText); row.appendChild(cell); if (quest2A ==! null) { alert("Saved to database"); }
            alert("the Answer to " + groupselect + ansselect1 + " = " + quest2A);
            console.log("2A" + " = " + quest2A) }
              if (ansselect1 == "b") { 
        let quest2B = prompt("answer to 2B?"); const cell = document.createElement("td"); const cellText = document.createTextNode(`2B = ${quest2B}`); cell.appendChild(cellText); row.appendChild(cell); if (quest2B ==! null) { alert("Saved to database"); }
            alert("the Answer to " + groupselect + ansselect1 + " = " + quest2B);
            console.log("2B" + " = " + quest2B) }
              if (ansselect1 == "c") { 
        let quest2C = prompt("answer to 2C?"); const cell = document.createElement("td"); const cellText = document.createTextNode(`2C = ${quest2C}`); cell.appendChild(cellText); row.appendChild(cell); if (quest2C ==! null) { alert("Saved to database"); }
            alert("the Answer to " + groupselect + ansselect1 + " = " + quest2C);
            console.log("2C" + " = " + quest2C) }
              if (ansselect1 == "d") { 
        let quest2D = prompt("answer to 2D?"); const cell = document.createElement("td"); const cellText = document.createTextNode(`2D = ${quest2D}`); cell.appendChild(cellText); row.appendChild(cell); if (quest2D ==! null) { alert("Saved to database"); }
            alert("the Answer to " + groupselect + ansselect1 + " = " + quest2D);
            console.log("2D" + " = " + quest2D) }
              if (ansselect1 == "e") { 
        let quest2E = prompt("answer to 2E?"); const cell = document.createElement("td"); const cellText = document.createTextNode(`2E = ${quest2E}`); cell.appendChild(cellText); row.appendChild(cell); if (quest2E ==! null) { alert("Saved to database"); }
            alert("the Answer to " + groupselect + ansselect1 + " = " + quest2E);
            console.log("2E" + " = " + quest2E) }
              if (ansselect1 == "f") {  
        let quest2F = prompt("answer to 2F?"); const cell = document.createElement("td"); const cellText = document.createTextNode(`2F = ${quest2F}`); cell.appendChild(cellText); row.appendChild(cell); if (quest2F ==! null) { alert("Saved to database"); }
            alert("the Answer to " + groupselect + ansselect1 + " = " + quest2F);
            console.log("2F" + " = " + quest2F) }
    }
            if (groupselect == "3") { 
            alert("Creating save file for group 3");  
        let ansselect1 = prompt("wich group would you like to save? (a, b, c, d)"); 
      if (ansselect1 == "a") { 
        let quest3A = prompt("answer to 2A?"); const cell = document.createElement("td"); const cellText = document.createTextNode(`2A = ${quest3A}`); cell.appendChild(cellText); row.appendChild(cell); if (quest3A ==! null) { alert("Saved to database"); }
            alert("the Answer to " + groupselect + ansselect1 + " = " + quest3A);
            console.log("3A" + " = " + quest3A) }
              if (ansselect1 == "b") { 
        let quest3B = prompt("answer to 2A?"); const cell = document.createElement("td"); const cellText = document.createTextNode(`2A = ${quest3B}`); cell.appendChild(cellText); row.appendChild(cell); if (quest3B ==! null) { alert("Saved to database"); }
            alert("the Answer to " + groupselect + ansselect1 + " = " + quest3B);
            console.log("3B" + " = " + quest3B) }
              if (ansselect1 == "c") { 
        let quest3C = prompt("answer to 2A?"); const cell = document.createElement("td"); const cellText = document.createTextNode(`2A = ${quest3C}`); cell.appendChild(cellText); row.appendChild(cell); if (quest3C ==! null) { alert("Saved to database"); }
            alert("the Answer to " + groupselect + ansselect1 + " = " + quest3C);
            console.log("3C" + " = " + quest3C) }
              if (ansselect1 == "d") { 
        let quest3D = prompt("answer to 2A?"); const cell = document.createElement("td"); const cellText = document.createTextNode(`2A = ${quest3D}`); cell.appendChild(cellText); row.appendChild(cell); if (quest3D ==! null) { alert("Saved to database"); }
            alert("the Answer to " + groupselect + ansselect1 + " = " + quest3D);
            console.log("3D" + " = " + quest3D) }
              if (ansselect1 == "e") { 
        let quest3E = prompt("answer to 2A?"); const cell = document.createElement("td"); const cellText = document.createTextNode(`2A = ${quest3E}`); cell.appendChild(cellText); row.appendChild(cell); if (quest3E ==! null) { alert("Saved to database"); }
            alert("the Answer to " + groupselect + ansselect1 + " = " + quest3E);
            console.log("3E" + " = " + quest3E) }
              if (ansselect1 == "f") {  
        let quest3F = prompt("answer to 2A?"); const cell = document.createElement("td"); const cellText = document.createTextNode(`2A = ${quest3F}`); cell.appendChild(cellText); row.appendChild(cell); if (quest3F ==! null) { alert("Saved to database"); }
            alert("the Answer to " + groupselect + ansselect1 + " = " + quest3F);
            console.log("3F" + " = " + quest3F) }
    }
            if (groupselect == "4") { 
            alert("Creating save file for group 4");  
        let ansselect1 = prompt("wich group would you like to save? (a, b, c, d)"); 
      if (ansselect1 == "a") { 
        let quest4A = prompt("answer to 4A?"); if (quest4A ==! null) { alert("Saved to database"); }
            alert("the Answer to " + groupselect + ansselect1 + " = " + quest4A);
            console.log("4A" + " = " + quest4A) }
              if (ansselect1 == "b") { 
        let quest4B = prompt("answer to 4B?"); if (quest4B ==! null) { alert("Saved to database"); }
            alert("the Answer to " + groupselect + ansselect1 + " = " + quest4B);
            console.log("4B" + " = " + quest4B) }
              if (ansselect1 == "c") { 
        let quest4C = prompt("answer to 4C?"); if (quest4C ==! null) { alert("Saved to database"); }
            alert("the Answer to " + groupselect + ansselect1 + " = " + quest4C);
            console.log("4C" + " = " + quest4C) }
              if (ansselect1 == "d") { 
        let quest4D = prompt("answer to 4D?"); if (quest4D ==! null) { alert("Saved to database"); }
            alert("the Answer to " + groupselect + ansselect1 + " = " + quest4D);
            console.log("4D" + " = " + quest4D) }
              if (ansselect1 == "e") { 
        let quest4E = prompt("answer to 4E?"); if (quest4E ==! null) { alert("Saved to database"); }
            alert("the Answer to " + groupselect + ansselect1 + " = " + quest4E);
            console.log("4E" + " = " + quest4E) }
              if (ansselect1 == "f") {  
        let quest4F = prompt("answer to 4F?"); if (quest4F ==! null) { alert("Saved to database"); }
            alert("the Answer to " + groupselect + ansselect1 + " = " + quest4F);
            console.log("4F" + " = " + quest4F) }
    }
            if (groupselect == "5") { 
            alert("Creating save file for group 5");  
        let ansselect1 = prompt("wich group would you like to save? (a, b, c, d)"); 
      if (ansselect1 == "a") { 
        let quest5A = prompt("answer to 5A?"); if (quest5A ==! null) { alert("Saved to database"); }
            alert("the Answer to " + groupselect + ansselect1 + " = " + quest5A);
            console.log("5A" + " = " + quest5A) }
              if (ansselect1 == "b") { 
        let quest5B = prompt("answer to 5B?"); if (quest5B ==! null) { alert("Saved to database"); }
            alert("the Answer to " + groupselect + ansselect1 + " = " + quest5B);
            console.log("5B" + " = " + quest5B) }
              if (ansselect1 == "c") { 
        let quest5C = prompt("answer to 5C?"); if (quest5C ==! null) { alert("Saved to database"); }
            alert("the Answer to " + groupselect + ansselect1 + " = " + quest5C);
            console.log("5C" + " = " + quest5C) }
              if (ansselect1 == "d") { 
        let quest5D = prompt("answer to 5D?"); if (quest5D ==! null) { alert("Saved to database"); }
            alert("the Answer to " + groupselect + ansselect1 + " = " + quest5D);
            console.log("5D" + " = " + quest5D) }
              if (ansselect1 == "e") { 
        let quest5E = prompt("answer to 5E?"); if (quest5E ==! null) { alert("Saved to database"); }
            alert("the Answer to " + groupselect + ansselect1 + " = " + quest5E);
            console.log("5E" + " = " + quest5E) }
              if (ansselect1 == "f") {  
        let quest5F = prompt("answer to 5F?"); if (quest5F ==! null) { alert("Saved to database"); }
            alert("the Answer to " + groupselect + ansselect1 + " = " + quest5F);
            console.log("5F" + " = " + quest5F) }
    }
            if (groupselect == "6") { 
            alert("Creating save file for group 6");  
        let ansselect1 = prompt("wich group would you like to save? (a, b, c, d)"); 
      if (ansselect1 == "a") { 
        let quest6A = prompt("answer to 6A?"); if (quest6A ==! null) { alert("Saved to database"); }
            alert("the Answer to " + groupselect + ansselect1 + " = " + quest6A);
            console.log("6A" + " = " + quest6A) }
              if (ansselect1 == "b") { 
        let quest6B = prompt("answer to 6B?"); if (quest6B ==! null) { alert("Saved to database"); }
            alert("the Answer to " + groupselect + ansselect1 + " = " + quest6B);
            console.log("6B" + " = " + quest6B) }
              if (ansselect1 == "c") { 
        let quest6C = prompt("answer to 6C?"); if (quest6C ==! null) { alert("Saved to database"); }
            alert("the Answer to " + groupselect + ansselect1 + " = " + quest6C);
            console.log("6C" + " = " + quest6C) }
              if (ansselect1 == "d") { 
        let quest6D = prompt("answer to 6D?"); if (quest6D ==! null) { alert("Saved to database"); }
            alert("the Answer to " + groupselect + ansselect1 + " = " + quest6D);
            console.log("6D" + " = " + quest6D) }
              if (ansselect1 == "e") { 
        let quest6E = prompt("answer to 6E?"); if (quest6E ==! null) { alert("Saved to database"); }
            alert("the Answer to " + groupselect + ansselect1 + " = " + quest6E);
            console.log("6E" + " = " + quest6E) }
              if (ansselect1 == "f") {  
        let quest6F = prompt("answer to 6F?"); if (quest6F ==! null) { alert("Saved to database"); }
            alert("the Answer to " + groupselect + ansselect1 + " = " + quest6F);
            console.log("6F" + " = " + quest6F) }
    }
    } }
    console.clear();
    console.log.apply(console, ["%c DEV CONSOLE HAS BEEN ACTIVATED :","color: #fff; background: #2080ff; padding:10px 0;"]) 
    console.log.apply(console, ["%c [server responded with the status: 404 SOCKET_STATUS_DECEASED] :","color: #fff; background: #c71c1c; padding:10px 0;"])
    console.warn("SOCKET IS DECEASED")
function opensocket(width, height) {
  if (isNaN(width) || isNaN(height)) {
    throw new Error('BAD SOCKET');
  }
}

try {
  opensocket(3, 'A');
} catch (e) {
  console.error(e);
  // Expected output: Error: Parameter is not a number!
}
    console.warn("OPENEING NEW SOCKET")
    console.log.apply(console, ["%c [server responded with the status: 400 SOCKET_STATUS_ONLINE] :","color: #fff; background: #00ab1c; padding:10px 0;"])
    console.log.apply(console, ["%c Designed and Developed by ben and the arx group %c\ud83d\ude80 ","color: #fff; background: #2080ff; padding:5px 0;","color: #fff; background: #242424; padding:5px 0 5px 5px;"])
    }

    // add the row to the end of the table body
    tblBody.appendChild(row);
  }

  // put the <tbody> in the <table>
  tbl.appendChild(tblBody);
  // appends <table> into <body>
  document.body.appendChild(tbl);
  // sets the border attribute of tbl to '2'
  tbl.setAttribute("border", "2"); }
else window.alert("sorry that token could not be validated")