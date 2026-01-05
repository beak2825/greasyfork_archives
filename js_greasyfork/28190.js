// ==UserScript==
// @name         MooMoo right click auto feed
// @namespace    http://tampermonkey.net/
// @version      1.091
// @description  Uses food when right clicked
// @author       meatman2tasty
// @match        http://moomoo.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28190/MooMoo%20right%20click%20auto%20feed.user.js
// @updateURL https://update.greasyfork.org/scripts/28190/MooMoo%20right%20click%20auto%20feed.meta.js
// ==/UserScript==

document.addEventListener("keydown", function(a) {
    if (a.keyCode == 16) {
 document.getElementById("actionBarItem9").click();
    }
}, false);

document.addEventListener("keydown", function(a) {
    if (a.keyCode == 16) {
 document.getElementById("actionBarItem10").click();
    }
}, false);

window.oncontextmenu = function () {
   return false;
};