// ==UserScript==
// @name         S&Box key chance
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  shows you your chances of getting a key (not high, lol)
// @author       mmccall0813
// @match        https://asset.party/get/developer/preview
// @icon         https://www.google.com/s2/favicons?sz=64&domain=asset.party
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/458614/SBox%20key%20chance.user.js
// @updateURL https://update.greasyfork.org/scripts/458614/SBox%20key%20chance.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let percentDisplay = document.createElement("span");
    percentDisplay.classList.add("tag");
    percentDisplay.style.marginLeft = "4px";

    let yourIn = document.createElement("span");
    yourIn.classList.add("tag");
    yourIn.style.marginLeft = "4px";

    function calcodds(){
        let odds = 5/document.querySelector(".is-flex").children.length;
        odds = odds * 100 // percent form
        if(odds > 100) odds = 100;
        odds = odds.toFixed(2);
        percentDisplay.innerHTML=`<i>percent</i>\n~${parseFloat(odds).toString()}%`;

        let infoBoxes = document.querySelector(".block > h2")
        if(percentDisplay.parentElement !== infoBoxes) infoBoxes.appendChild(percentDisplay);

        // "you're in" message
        let imIn = false;
        let pool = document.querySelector(".is-flex");
        Array.from(pool.children).forEach( (person) => {
            if(person.style.outlineColor === "pink"){
                imIn = true;
            }
        })
        if(imIn){
            yourIn.innerHTML = "<i>check_circle</i>\nYou're in!";
            yourIn.style.backgroundColor = "#009A57";
        } else {
            yourIn.innerHTML = "<i>cancel</i>\nYou're not in.";
            yourIn.style.backgroundColor = "#FF495C";
        }
        if(yourIn.parentElement !== infoBoxes) infoBoxes.appendChild(yourIn);
    }

    calcodds();
    setInterval(calcodds, 250);
})();