// ==UserScript==
// @name         Furvilla - Commas pls
// @namespace    furvilla
// @version      2023.01.02
// @description  Comma seperates numbers across Furvilla
// @match        *://*.furvilla.com/*
// @license      MIT
// @author       kiri
// @downloadURL https://update.greasyfork.org/scripts/478523/Furvilla%20-%20Commas%20pls.user.js
// @updateURL https://update.greasyfork.org/scripts/478523/Furvilla%20-%20Commas%20pls.meta.js
// ==/UserScript==
//Use at your own risk. No guarantees or waranties. Does not convert all numbers, but hopefully I got most of the important areas.


(function() {
    'use strict';

    // Function to add commas to a number
    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function checkThenReplace(elem) {
        let number = parseInt(elem.textContent, 10);

            // Check if it's a valid number
            if (!isNaN(number)) {
                elem.textContent = numberWithCommas(number); // Setting formatted number
            }
    }

    // Sidebar on-hand FC, FD, inventory amounts
    let bElements1 = document.querySelectorAll('div.user-info strong:not(:has(a))');
    let bElements2 = document.querySelectorAll('div.user-info strong a');

    // Loop through all the selected elements
    for (let elem of bElements1) {
            checkThenReplace(elem);
    }
    for (let elem of bElements2) {
            checkThenReplace(elem);
    }

     // Bank page elements, Career page stats
    let divNums = document.querySelectorAll('div.registration-well div:not(.progress-text)');

    for (let elem of divNums) {
        const val = elem.innerHTML;
        const line = (val.trim()).split(" ");

        if (typeof line === "undefined" || typeof line[2] === "undefined") {
            checkThenReplace(elem);
        }
        else if (line[2].includes("furcash.gif") || line[2].includes("furdollars.gif")) {
             let number = parseInt(elem.textContent, 10);

            // Check if it's a valid number
            if (!isNaN(number)) {
                elem.innerHTML = numberWithCommas(number) + " " + line[1] + " " + line[2]; // Setting formatted number
            }
        }
    }


    //Stall net prices
    let stallNets = document.querySelectorAll('td.text-center span.net');

    // Loop through all the selected elements
    for (let elem of stallNets) {
            checkThenReplace(elem);
    }


     // Stall stuff
    let stallElements = document.querySelectorAll('td');

    for (let elem of stallElements) {
        const val = elem.innerHTML;
        const line = (val.trim()).split(" ");

        if (typeof line === "undefined" || typeof line[3] === "undefined") {
           checkThenReplace(elem);
        }
        else if(!isNaN(parseInt(line[0]))) {

            if(line[3].includes("furcoins.gif") || line[3].includes("furdollars.gif")) {
                elem.innerHTML = numberWithCommas(parseInt(line[0])) + " " + line[1] + " " + line[2] + " " + line[3]; // Setting formatted number
            } //why is stall till coded differently lol
            else if(line[2].includes("furcash.gif")) {
                elem.innerHTML = numberWithCommas(parseInt(line[0])) + " <img src='//furvilla.com/img/furcash.gif'>"; // Setting formatted number
            }
            else if(line[2].includes("furdollars.gif")) {
                elem.innerHTML = numberWithCommas(parseInt(line[0])) + " <img src='//furvilla.com/img/furdollars.gif'>"; // Setting formatted number
            }
        }

    }


})();