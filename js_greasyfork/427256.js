// ==UserScript==
// @name         Nitro Type - Start Friends Race
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Auto-start a friends race by hitting Enter!
// @author       Sapphire7x
// @match        https://www.nitrotype.com/race/*
// @icon         https://www.google.com/s2/favicons?domain=nitrotype.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427256/Nitro%20Type%20-%20Start%20Friends%20Race.user.js
// @updateURL https://update.greasyfork.org/scripts/427256/Nitro%20Type%20-%20Start%20Friends%20Race.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //get all the elements that have these classes; choose the first one, which is the bucket message, and update it to tell the user to hit the Enter key!
    document.getElementsByClassName("mbf tss")[0].innerHTML += " Hit the Enter key to start the race!"
    //get all the elements that have these classes; choose the first one, which is the start race button
    var startRaceButton = document.getElementsByClassName("racev3Pre-action btn--primary")[0]
    var clickedYet = false; //set a marker to check if it has been clicked already
    document.addEventListener("keyup", function (e) { //when you press a key
        if(!clickedYet) { //if you haven't clicked it yet
            if (e.key === "Enter") { //checks whether the pressed key is enter
                startRaceButton.click() //click the start race button
                clickedYet = true //set the marker to true, you have clicked it.
            }
        }
    });
})();