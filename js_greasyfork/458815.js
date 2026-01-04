// ==UserScript==
// @name         Urltaka Free LTC
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Claim free LTC
// @author       vikiweb
// @match        https://urltaka.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=urltaka.com
// @grant        none
// @antifeature  referral-link
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/458815/Urltaka%20Free%20LTC.user.js
// @updateURL https://update.greasyfork.org/scripts/458815/Urltaka%20Free%20LTC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let ltcAddress = "MPKodg6ph2Yb8jgqsJdgs6Nx52FFa6h2jT";

    function isCaptchaChecked() {
        return grecaptcha && grecaptcha.getResponse().length !== 0;
    }

    setInterval(function() {
        if(document.querySelector(".form-horizontal .step2 input[type='text']")){
            document.querySelector(".form-horizontal .step2 input[type='text']").value = ltcAddress
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
            window.location.replace('https://urltaka.com/');
        }
    },60000)

})();