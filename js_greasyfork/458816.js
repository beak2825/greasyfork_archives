// ==UserScript==
// @name         AutoCrypto free BNB
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Claim free BNB
// @author       You
// @match        https://auto-crypto.ml/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=auto-crypto.ml
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458816/AutoCrypto%20free%20BNB.user.js
// @updateURL https://update.greasyfork.org/scripts/458816/AutoCrypto%20free%20BNB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let bnbAddress = "0x0d0bdCC162E760670A86ac9B0313F2E4aabCE6b9";

    function isCaptchaChecked() {
        return grecaptcha && grecaptcha.getResponse().length !== 0;
    }

    setInterval(function() {
        if(document.querySelector(".form-horizontal .step2 input[type='text']")){
            document.querySelector(".form-horizontal .step2 input[type='text']").value = bnbAddress
        }
    },2000)


    setInterval(function() {
        if(document.querySelector(".form-horizontal .form-group  input[type='submit'].claim-button")){
            if (isCaptchaChecked()) {
                document.querySelector(".form-horizontal .form-group input[type='submit'].claim-button").click()
            }
        }
    },4000)

    setInterval(function() {
        if(!document.querySelector(".form-horizontal .step2 input[type='text']")){
            window.location.replace('https://auto-crypto.ml/');
        }
    },60000)

})();