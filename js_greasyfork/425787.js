// ==UserScript==
// @namespace    -
// @grant        none
// @version      1.0.0.1
// @author       Stew#4055
// @match        *://moomoo.io/*
// @name         Rainbow age bar
// @match        *://dev.moomoo.io/*
// @match        *://sandbox.moomoo.io/*
// @supportURL   https://discord.gg/G2gJFbx7GD
// @description  AgeBar is fading in various colors!
// @downloadURL https://update.greasyfork.org/scripts/425787/Rainbow%20age%20bar.user.js
// @updateURL https://update.greasyfork.org/scripts/425787/Rainbow%20age%20bar.meta.js
// ==/UserScript==

var fadingspeed = 100 // lower = faster, higher = slower
var d = 0;

function e(e, n = d) {
    document.getElementById(e).style["background-color"] = "hsl(" + n + ", 100%, 50%)";
}

setInterval(function() {
    (function(e, n) {
        e(n);
    })(e, "ageBarBody"), d++;
}, fadingspeed);