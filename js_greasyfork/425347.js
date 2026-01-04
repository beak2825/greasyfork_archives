// ==UserScript==
// @name         Add listing
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add a add listing button to your traderie page! 
// @author       MythicalHysteria
// @match        https://traderie.com/*/product/*
// @icon         https://www.google.com/s2/favicons?domain=traderie.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425347/Add%20listing.user.js
// @updateURL https://update.greasyfork.org/scripts/425347/Add%20listing.meta.js
// ==/UserScript==

(function() {
    function add() {
    document.querySelector("#root > div.sc-eXlDFz.fmdpDr > div:nth-child(1) > div.product > div.container > div.product-action-bar > div:nth-child(1) > button").click();
}

function tickBox() {
    document.querySelector("#root > div.sc-eXlDFz.fmdpDr > div:nth-child(1) > div.product > div.container > div.create-listing > div:nth-child(5) > div.create-listing-checks > label:nth-child(2) > input[type=checkbox]").click();
}

function send() {
    document.querySelector("#root > div.sc-eXlDFz.fmdpDr > div:nth-child(1) > div.product > div.container > div.create-listing > div.create-listing-btn-bar > button").click();
    console.log("Complete");
}

function ok() {
    document.querySelector("#root > div.sc-eXlDFz.fmdpDr > div:nth-child(1) > div.product > div.container > div.create-listing-confirm > button").click()
}

var btn = document.createElement("BUTTON");
btn.innerHTML = "Add to listing";
document.body.appendChild(btn);
document.querySelector("body > button").style.position = "fixed";
btn.addEventListener('click', () => {
    add();
    setTimeout(tickBox, 1000);
    setTimeout(send, 1500);
    setTimeout(ok, 2000);
});



})();