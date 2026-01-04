// ==UserScript==
// @name         Squarifier
// @namespace    http://tampermonkey.net/
// @version      0.0
// @description  Restores the old look of many websites by making things square
// @author       Vacuum_Tube_Gaming
// @match        *://*/*
// @icon         https://pixfeeds.com/images/science/physics/1280-146879596-vacuum-tube.jpg
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/486710/Squarifier.user.js
// @updateURL https://update.greasyfork.org/scripts/486710/Squarifier.meta.js
// ==/UserScript==
//most efficient code ever:
var i = 1;
function myLoop() {
    setTimeout(function() {


        var all = document.getElementsByTagName("*");

        for (var st=0, max=all.length; st < max; st++) {
            all[st].style.borderRadius = '0px';
        }
        console.log("changed")

        i++;
        if (0 < 1) {
        myLoop();
        }
    }, 1000)
}

myLoop();