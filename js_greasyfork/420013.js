// ==UserScript==
// @name         Make Google Classroom less cringy
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  changes "woohoo, no work due in soon!" to "no work due in soon"
// @author       AdamantPenguin
// @match        https://classroom.google.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420013/Make%20Google%20Classroom%20less%20cringy.user.js
// @updateURL https://update.greasyfork.org/scripts/420013/Make%20Google%20Classroom%20less%20cringy.meta.js
// ==/UserScript==
'esversion: 8';


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

(async function(){
    'use strict';
    var found = false;
    var toTest, i;
    while (!found) {
        await sleep(100);

        toTest = document.querySelectorAll("span");
        for (i=0; i<toTest.length; i++) {
            if (toTest[i].innerHTML == "Woohoo, no work due in soon!") {
                toTest[i].innerHTML = "No work due in soon";
                found = true;
            }
        }
    }
})();
