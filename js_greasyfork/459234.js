// ==UserScript==
// @name         Askpaccosi free Btc faucet
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Claim free LTC
// @author       vikiweb
// @match        https://askpaccosi.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=askpaccosi.com
// @grant        none
// @antifeature  referral-link
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/459234/Askpaccosi%20free%20Btc%20faucet.user.js
// @updateURL https://update.greasyfork.org/scripts/459234/Askpaccosi%20free%20Btc%20faucet.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var btcAddress = '16Lfq4QC9Lgbse4oggWUVAe1e6Rv7o6ELn';

    function isCaptchaChecked() {
        return grecaptcha && grecaptcha.getResponse().length !== 0;
    }

    setInterval(function() {
        if (document.querySelector("input[type='text']")) {
            document.querySelector("input[type='text']").value = btcAddress;
        }

        if (document.querySelector(".claim-button[type='submit']")) {
            if (isCaptchaChecked()) {
                document.querySelector(".claim-button[type='submit']").click()
            }
        }
    }, 10000);


    setInterval(function() {
        if((document.querySelector("body center div.alert-success"))){
            if( (document.querySelector("body center div.alert-success").innerText.includes("satoshi was sent"))) {
                window.location.replace('https://askpaccosi.com/claimbtc/');
            }
        }
        if(document.querySelectorAll("body center p.alert-info")){
            if(document.querySelectorAll("body center p.alert-info")[1].innerText.includes('You have to wait')){
                window.location.replace('https://askpaccosi.com/claimbtc/');
            }
        }
    }, 60000);

})();