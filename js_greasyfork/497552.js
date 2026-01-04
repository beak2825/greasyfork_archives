// ==UserScript==
// @name         98faucet - Auto Faucet
// @namespace    98faucet.auto.faucet
// @version      0.1
// @description  https://98faucet.com/?r=4724 : Made In Trinidad
// @author       stealtosvra
// @match        https://98faucet.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=98faucet.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/497552/98faucet%20-%20Auto%20Faucet.user.js
// @updateURL https://update.greasyfork.org/scripts/497552/98faucet%20-%20Auto%20Faucet.meta.js
// ==/UserScript==

(function() {
    'use strict';
function hCaptcha() {
    return window.grecaptcha && window.grecaptcha.getResponse().length !== 0;
}

function checkAndClickButton() {
    if (hCaptcha()) {
        document.querySelector('.claim-button').click();
    }
}

// Check every 5 minutes (300,000 milliseconds)
setInterval(checkAndClickButton, 3000);

})();