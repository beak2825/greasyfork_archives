// ==UserScript==
// @name         auto-crypto.ml : Auto Faucet
// @namespace    auto.crypto.auto.faucet
// @version      1.4
// @description  Auto claims BNB and DOGE Faucets
// @author       stealtosvra
// @match        https://auto-crypto.ml/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=auto-crypto.ml
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/461785/auto-cryptoml%20%3A%20Auto%20Faucet.user.js
// @updateURL https://update.greasyfork.org/scripts/461785/auto-cryptoml%20%3A%20Auto%20Faucet.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // INSERT CRYPTO ADDRESSES
    const bnb = "0xDD9cb7e222Bdd926E8d8aB1E8574e6A584c0F122";
    const doge = "DLtH8LwRsMsdy3GhqjA36BzBMQHzKYuNSN";

    const inputElement = document.querySelector('input[type="text"].form-control');
    const formGroups = document.querySelectorAll("div.form-group");

    for (let i = 0; i < formGroups.length; i++) {
        const formGroup = formGroups[i];
        if (formGroup.querySelector("span") && formGroup.querySelector("span").textContent.includes("BNB")) {
            inputElement.value = bnb;
        }
    }

    for (let i = 0; i < formGroups.length; i++) {
        const formGroup = formGroups[i];
        if (formGroup.querySelector("span") && formGroup.querySelector("span").textContent.includes("DOGE")) {
            inputElement.value = doge;
        }
    }

    function hCaptcha() {
        return grecaptcha && grecaptcha.getResponse().length !== 0;}

    setInterval(function() {
        if (hCaptcha()) {
            document.querySelector('input.btn.btn-warning.btn.claim-button').click();
        }
    }, 5000);

    const reloadDelay = 70 * 1000;
    setTimeout(function() {
        location.reload();
    }, reloadDelay);

})();