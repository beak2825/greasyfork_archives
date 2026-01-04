// ==UserScript==
// @name         Automated tech for Cyber Nations
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically gets you to 100 tech when you go to the "Technology" page.
// @author       RandomNoobster
// @match        https://www.cybernations.net/technology_purchase.asp*
// @icon         https://www.cybernations.net/favicon.ico
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466199/Automated%20tech%20for%20Cyber%20Nations.user.js
// @updateURL https://update.greasyfork.org/scripts/466199/Automated%20tech%20for%20Cyber%20Nations.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let button = document.getElementsByName("Submit")[0];
    let newpurchase = document.getElementsByName("newpurchase")[0];
    let fields = document.querySelectorAll('[width="70%"][bgcolor="#FFFFFF"]');
    let tech = Number(fields[0].textContent.replace(/\$|,/g, ""));
    let onHand = Number(fields[1].innerHTML.replace(/\$|,/g, ""));
    let required = Number(fields[2].innerHTML.replace(/\$|,/g, "")) * 10;
    if (tech < 100) {
        if (onHand < required) {
            alert("You do not have enough money! I am unable to buy tech!");
            return;
        }
        else {
            newpurchase.value = 10;
            button.click();
        }
    }
})();