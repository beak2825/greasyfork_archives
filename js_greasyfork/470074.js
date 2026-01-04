// ==UserScript==
// @name         Table Filler
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Takes the website and fills the last column for every row with random numbers
// @author       Doncha1009
// @license      MIT
// @match        https://www.firmtr.com/timecards2?id=*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470074/Table%20Filler.user.js
// @updateURL https://update.greasyfork.org/scripts/470074/Table%20Filler.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    console.log("Started");
    const delay = (milliSeconds) => new Promise(resolve => setTimeout(resolve, milliSeconds));

    // Get references to the elements
    const tableBody = document.getElementById('theTableBody');
    const moreRowsBtn = document.getElementById('moreRowsBtn');
 
    const minNumber = 0.02;
    const maxNumber = 0.1;
    let lastRowIndex = 0;
 
    // Loop through each row in the table body and fill it with a random number
    function fillTableRows() {
        for (let i = lastRowIndex; i < tableBody.children.length; i++) {
            const row = tableBody.children[i];
            const lastCell = row.lastElementChild;
            const randomNumber = getRandomNumber(minNumber, maxNumber);
            // Set the random number as the content of the last cell
            lastCell.children[0].value = randomNumber;
        }
        lastRowIndex = tableBody.children.length;
        console.log("filled");
    }
 
    fillTableRows();
 
    // Attach an event listener to the "+ more rows" button
    moreRowsBtn.addEventListener('click', function() {
        delay(1000);
        fillTableRows();
    });
 
    // Function to generate a random number between min and max (inclusive)
    function getRandomNumber(min, max) {
        const randomDecimal = Math.random();
        const scaledRandom = randomDecimal * (max - min);
        const randomNumber = scaledRandom + min;
 
        // Round the random number to two decimal places
        const roundedNumber = randomNumber.toFixed(2);
        // Return the rounded random number
        return parseFloat(roundedNumber);
    }
 
 
})();