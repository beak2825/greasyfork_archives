// ==UserScript==
// @name         Token Terra [Auto Claim]
// @namespace    token.terra.auto.claim
// @version      0.1
// @description  https://tokenterra.pro/?r=11281 - Made in Trinidad
// @author       stealtosvra
// @match        https://tokenterra.pro/bonus
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tokenterra.pro
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/487963/Token%20Terra%20%5BAuto%20Claim%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/487963/Token%20Terra%20%5BAuto%20Claim%5D.meta.js
// ==/UserScript==

(function() {
    'use strict';

function clickButton() {
    let button = document.querySelector('.button2.text-center');
    if (button) {
        button.click();
    }
}

setInterval(clickButton, 21 * 60 * 1000);
})();