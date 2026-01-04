// ==UserScript==
// @name         cryptoclaimhub - Auto Faucet
// @namespace    cryptoclaimhub.auto.faucet
// @version      0.1
// @description  https://cryptoclaimhub.com?ref=G8Ev2GJblrjy4 : Made In Trinidad
// @author       stealtosvra
// @match        https://cryptoclaimhub.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=98faucet.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/497553/cryptoclaimhub%20-%20Auto%20Faucet.user.js
// @updateURL https://update.greasyfork.org/scripts/497553/cryptoclaimhub%20-%20Auto%20Faucet.meta.js
// ==/UserScript==

(function() {
    'use strict';
function hCaptcha() {
    return window.grecaptcha && window.grecaptcha.getResponse().length !== 0;
}

function checkAndClickButton() {
    if (hCaptcha()) {
        document.querySelector('.betBtn').click();
    }
}

// Check every 5 minutes (300,000 milliseconds)
setInterval(checkAndClickButton, 3000);

setInterval(() => {
    location.reload();
}, 360000);

})();