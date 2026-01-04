// ==UserScript==
// @name         Asurascans easy chapter change
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Simple script allowing the user to change page using right and left arrows on asurascans.com!
// @author       Yatsu
// @match        https://www.asurascans.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=asurascans.com
// @grant        none
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/470306/Asurascans%20easy%20chapter%20change.user.js
// @updateURL https://update.greasyfork.org/scripts/470306/Asurascans%20easy%20chapter%20change.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.addEventListener("keydown", function(event) {
    if (event.keyCode === 37) {
        if (document.querySelector("a.ch-prev-btn")) { document.querySelector("a.ch-prev-btn").click(); }
        else { document.querySelectorAll(".inepcx a").forEach(el => el.innerText.includes("First Chapter") ? el.click() : el) }
    }
    if (event.keyCode === 39) {
        if (document.querySelector("a.ch-next-btn")) { document.querySelector("a.ch-next-btn").click(); }
        else { document.querySelectorAll(".inepcx a").forEach(el => el.innerText.includes("New Chapter") ? el.click() : el) }
    }
})
})();