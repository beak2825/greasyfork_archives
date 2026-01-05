// ==UserScript==
// @name         Karnage chat spam, press '\' to spam
// @namespace    meatman2tasty
// @version      1.15
// @description  press '\' to spam
// @author       meatman2tasty
// @match        http://karnage.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28122/Karnage%20chat%20spam%2C%20press%20%27%5C%27%20to%20spam.user.js
// @updateURL https://update.greasyfork.org/scripts/28122/Karnage%20chat%20spam%2C%20press%20%27%5C%27%20to%20spam.meta.js
// ==/UserScript==

var toSpam = "Want to join s8n? Min reqs to join are rank 25+"

var toSpam = "if interested just contact any s8n member or join"

var toSpam = "Want to join s8n? Min reqs to join are rank 25+"


document.addEventListener("keydown", function(a) { // Press '\' to spam message
    if (a.keyCode == 220) {
socket.emit('ch', toSpam);
    }
}, false);