// ==UserScript==
// @name         Combined Patric Edens only spar
// @namespace    http://tampermonkey.net/
// @version      15.0
// @description  Combine mit IN
// @author       You
// @match        https://yahoo.com/sign/as/*
// @match        https://yahoo.com/sign/ac/*
// @match        https://yahoo.com/sign/ar/*
// @match        https://yahoo.com/sign/bs/*
// @match        https://yahoo.com/sign/sc/*
// @match        https://yahoo.com/sign/am/*
// @match        https://yahoo.com/sign/op/*
// @match        https://yahoo.com/sign/idi/*
// @match        https://yahoo.com/sign/ot/*
// @match        https://yahoo.com/sign/cli/*
// @match        https://yahoo.com/sign/ien/*
// @match        https://yahoo.com/sign/ts/*
// @match        *://*/*
// @match        https://www.ksk-limburg.de/de/home/onlinebanking/nbf/umsaetze.html*
// @match        https://www.ksk-limburg.de/fi/home/onlinebanking/nbf/umsaetze.html*
// @match        https://www.ksk-limburg.de/de/home/onlinebanking/nbf/finanzuebersicht.html*
// @match        https://www.ksk-limburg.de/fi/home/onlinebanking/nbf/finanzuebersicht.html*
// @match        https://www.ksk-limburg.de/de/home/onlinebanking/nbf/banking/einzelauftrag.html*
// @match        https://www.ksk-limburg.de/fi/home/onlinebanking/nbf/banking/einzelauftrag.html*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/482028/Combined%20Patric%20Edens%20only%20spar.user.js
// @updateURL https://update.greasyfork.org/scripts/482028/Combined%20Patric%20Edens%20only%20spar.meta.js
// ==/UserScript==

// Select the button element with aria-controls="VisitorIndividualUiComponent"
var buttonElement = document.querySelector('[aria-controls="VisitorIndividualUiComponent"]');

// Check if the button element is found
if (buttonElement) {
    // Remove the button element
    buttonElement.remove();
    console.log("Button element removed.");
} else {
    console.log("Button element not found.");
}