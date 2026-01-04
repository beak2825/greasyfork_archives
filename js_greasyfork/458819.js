// ==UserScript==
// @name         Btcdraw free BTCash
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Free Claim Btcash
// @author       vikiweb
// @match        https://btcdraw.elementfx.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=elementfx.com
// @grant        none
// @license      MIT
// @antifeature  referral-link
// @downloadURL https://update.greasyfork.org/scripts/458819/Btcdraw%20free%20BTCash.user.js
// @updateURL https://update.greasyfork.org/scripts/458819/Btcdraw%20free%20BTCash.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let btchAddress = "qqdunqmmnt27a2v8myyrsfnrl9eqgsfgfuhf06ppnx";


    function isCaptchaChecked() {
        return grecaptcha && grecaptcha.getResponse().length !== 0;
    }

    setInterval(function() {
        if(document.querySelector(".form-horizontal .step2 input[type='text']")){
            document.querySelector(".form-horizontal .step2 input[type='text']").value = btchAddress
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
            window.location.replace('https://btcdraw.elementfx.com');
        }
    },30000)

})();