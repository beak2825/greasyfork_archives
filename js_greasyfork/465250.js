// ==UserScript==
// @name         BrainbashersPickRandom
// @license      MIT
// @namespace    https://www.brainbashers.com/
// @version      1.0
// @description  pick random on brainbashers
// @author       Zlatko Bratkovic
// @match        https://www.brainbashers.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465250/BrainbashersPickRandom.user.js
// @updateURL https://update.greasyfork.org/scripts/465250/BrainbashersPickRandom.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.clickRND = function() {
        let randElement = document.getElementById("date");
        if (randElement) {
             randElement.value = "RAND";
        }
        let sizeElement = document.getElementById("size");
        if (sizeElement) {
             sizeElement.value = "20";
        }
        let diffElement = document.getElementById("diff");
        if (diffElement) {
             diffElement.value = "Hard";
        }
        let leftPuzzleElement = document.querySelector("div.left_puzzle");
        if (leftPuzzleElement) {
            leftPuzzleElement.scrollIntoView(true);
            document.documentElement.scrollTop -= 5; // just to look nicer
        }
    }
    window.clickGo = function() {
        let goButton = document.querySelector("input[type='submit'][class='button'][name='go'][value='go']");
        goButton.click();
    }
    let button = document.querySelector("input[type='button'][class='button'][name='random'][value='random']");
    if (button) {
         button.setAttribute("onclick", "clickRND();clickGo(); return false;");
    }
    window.addEventListener('load', (event) => {
        window.clickRND();
    })
    console.log("BrainbashersPickRandom has been enabled");
})();

