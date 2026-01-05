// ==UserScript==
// @name         Prevents inactivity
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  always acts as in window
// @author       meatman2tasty
// @match        http://karnage.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28194/Prevents%20inactivity.user.js
// @updateURL https://update.greasyfork.org/scripts/28194/Prevents%20inactivity.meta.js
// ==/UserScript==


setInterval(function(){ 
    setTimeout(inWindow= true, 2);
}, 10);