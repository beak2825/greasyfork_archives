// ==UserScript==
// @name         Prognocis scrape info from account page v3
// @namespace    prognocis.com
// @version      2025.01.24.0907
// @description  save the patient name from billing activity page for later use
// @author       mrkrag
// @match        *.prognocis.com/prognocis/scrBillPatientAccount.jsp*
// @icon         https://prognocis.com/wp-content/uploads/2020/07/cropped-Fav-192x192.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/515242/Prognocis%20scrape%20info%20from%20account%20page%20v3.user.js
// @updateURL https://update.greasyfork.org/scripts/515242/Prognocis%20scrape%20info%20from%20account%20page%20v3.meta.js
// ==/UserScript==
// first we clear any values saved from prior uses
localStorage.removeItem('patientName');
localStorage.removeItem('patientAcct');
// now set a variable that is assigned to an identifiable element
// in this case we will select the first element with an id of 'top'
var row1 = document.querySelector("#top");
// this sets a variable for the patient name
// using queryselector we will select counting from the known id of 'top' to the first row and then the second cell
var ptname = document.querySelector("#top ~ tr td:nth-child(2)").textContent;
// now we save the textcontent of that cell to localstorage, assigning it a key of 'patientName' with a value of the variable 'ptname'
localStorage.setItem('patientName', ptname);
// do the same to get the next value, in this case the 2nd row and third cell after 'top'
var ptacct = document.querySelector("#top ~ tr:nth-child(2) td:nth-child(3)").textContent.substring(16, 24);
localStorage.setItem('patientAcct', ptacct);

