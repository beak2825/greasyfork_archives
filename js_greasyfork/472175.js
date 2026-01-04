// ==UserScript==
// @name         Insfaucet . Auto Claim . Manual Faucet (NOT WORKING)
// @namespace    insfaucet.autoclaim. manualfaucet
// @version      1.3
// @description  Autoclaims the Manual Faucet Tokens. Made in Trinidad - https://ouo.io/HXDsfw
// @author       stealtosvra
// @match        https://insfaucet.xyz/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=insfaucet.xyz
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/472175/Insfaucet%20%20Auto%20Claim%20%20Manual%20Faucet%20%28NOT%20WORKING%29.user.js
// @updateURL https://update.greasyfork.org/scripts/472175/Insfaucet%20%20Auto%20Claim%20%20Manual%20Faucet%20%28NOT%20WORKING%29.meta.js
// ==/UserScript==

(function() {

    'use strict';

    const email = "email@gmail.com";
    const password = "123";
    const emailField = document.querySelector("#email");
    const passwordField = document.querySelector("#password");
    const claimButton = document.querySelector('button.btn.btn-success.btn-lg.claim-button');
    const primaryButton = document.querySelector('button.btn.btn-primary.w-md');

    if(emailField) {emailField.value = email;}
    if(passwordField) {passwordField.value = password;}

    function hCaptcha() {return grecaptcha && grecaptcha.getResponse().length !== 0;}
    setInterval(function() {
        if (hCaptcha()) {

            if (claimButton) {claimButton.click();}
            if (primaryButton) {primaryButton.click();}}}, 10000);

    setTimeout(function() {
        window.location.href = 'https://ouo.io/9lthy7U';
    }, 300000)

})();