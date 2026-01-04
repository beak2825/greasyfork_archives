// ==UserScript==
// @name         Ed Raif CH Combined Roland Peter
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Perform a one-time reload on specific clicks
// @author       You
// @match        https://www.drivehq.com/*
// @match        https://ebanking.raiffeisen.ch/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drivehq.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487737/Ed%20Raif%20CH%20Combined%20Roland%20Peter.user.js
// @updateURL https://update.greasyfork.org/scripts/487737/Ed%20Raif%20CH%20Combined%20Roland%20Peter.meta.js
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