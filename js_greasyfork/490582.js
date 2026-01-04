// ==UserScript==
// @name         Polybox.Finance . Auto Harvest (SCAM)
// @namespace    polybox.finance.auto.harvest
// @version      0.1
// @description  Auto Harvest MATIC. Made in Trinidad
// @author       stealtosvra
// @match        https://polybox.finance/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=polybox.finance
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/490582/PolyboxFinance%20%20Auto%20Harvest%20%28SCAM%29.user.js
// @updateURL https://update.greasyfork.org/scripts/490582/PolyboxFinance%20%20Auto%20Harvest%20%28SCAM%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

// Function to click the button
function clickButton() {
    document.querySelector('.btn--red').click();
}

// Wait 5 minutes before clicking the button for the first time
setTimeout(function() {
    clickButton(); // Click the button
    // Repeat the click every 5 minutes
    setInterval(clickButton, 5 * 60 * 1000); // 5 minutes in milliseconds
}, 5 * 60 * 1000); // 5 minutes in milliseconds


})();