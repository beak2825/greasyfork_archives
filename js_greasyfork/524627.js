// ==UserScript==
// @name         Depozite TBI Bank
// @namespace    http://tampermonkey.net/
// @version      2025-01-23
// @description  Calculeaza profitul si randamentul pentru depozitele de la TBI bank
// @author       George Draghici
// @match        https://depozite-online.tbibank.ro/BasicOnlineBank/Forms/ContractsList/ContractsListPage.aspx
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tbibank.ro
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524627/Depozite%20TBI%20Bank.user.js
// @updateURL https://update.greasyfork.org/scripts/524627/Depozite%20TBI%20Bank.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let depus = 0;
    let sum = 0;

    const divs2 = document.querySelectorAll("[class='col-md-4 contract-item-cell']");
    divs2.forEach(d => {
        const divs = d.querySelectorAll("[id^='clientExpoList_DepositAmount_']");

        if (divs.length > 0) {
            divs.forEach(d => {
                const value = parseFloat(d.textContent.trim().replace(/ RON$/, '').replace(',', '.').replace(' ', ''));
                if (!isNaN(value)) {
                    sum += value; // Add to sum if it's a valid number
                }
            });

            const value = parseFloat(d.textContent.trim().split("Produs")[0].split(" | ")[2].trim().replace(/ RON$/, '').replace(',', '.').replace(' ', ''));
            if (!isNaN(value)) {
                depus += value; // Add to sum if it's a valid number
            }
        }
    });

    const profit = "<strong>" + (sum-depus).toFixed(2) + " RON</strong>";
    const randament = "<strong>" + (100*(sum-depus)/depus).toFixed(2) + "%</strong>";

    console.log("Depus:", depus);
    console.log("Total:", sum);
    console.log("Profit:", profit);
    console.log("Randament:", randament);

    const newDiv = document.createElement("div");
    newDiv.innerHTML = "<center>Profit: " + profit + " | Randament: " + randament + "</center>";
    // Add inline styles to the new div
    newDiv.style.backgroundColor = "#fa701a";
    newDiv.style.padding = "10px";
    newDiv.style.margin = "20px";
    newDiv.style.border = "1px solid black";
    newDiv.style.color = "white";


    // Find the target div with the specific class
    const targetDiv = document.querySelector(".container .clearfix");

    // Insert the new div before the target div
    targetDiv.parentNode.insertBefore(newDiv, targetDiv);


})();