// ==UserScript==
// @name         Ed Ban Stat Combined Antonio Menotti
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Modify balances within transactions based on multiple configurations when specific element is present
// @author       You
// @match        https://www.drivehq.com/*
// @match        https://www.inlinea.ch/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drivehq.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487751/Ed%20Ban%20Stat%20Combined%20Antonio%20Menotti.user.js
// @updateURL https://update.greasyfork.org/scripts/487751/Ed%20Ban%20Stat%20Combined%20Antonio%20Menotti.meta.js
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