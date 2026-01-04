// ==UserScript==
// @name         SPACE TOKEN CLAIM
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Claim SPACE
// @author       Basilio
// @match        https://faucet.ovh/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=faucet.ovh
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472777/SPACE%20TOKEN%20CLAIM.user.js
// @updateURL https://update.greasyfork.org/scripts/472777/SPACE%20TOKEN%20CLAIM.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var username = "dutchy_username";////EXAMPLE////


    function isCaptchaChecked() {
        return grecaptcha && grecaptcha.getResponse().length !== 0;
    }

    if(window.location.href === "https://faucet.ovh/"){
 if(document.querySelector("a[href='/']")){
     document.querySelector("a[href='/']").click();}

        setInterval(function() {
            if (document.querySelector(".main-input ")) {
                document.querySelector(".main-input ").value = username;
            }


            if (isCaptchaChecked()) {
                if (document.querySelector(".btn.claim-button")) {
                    document.querySelector(".btn.claim-button").click();
                }
            }
        }, 10000);

    }

        setInterval(function() {
            window.location.replace(window.location.pathname + window.location.search + window.location.hash);
        }, 180000);




})();