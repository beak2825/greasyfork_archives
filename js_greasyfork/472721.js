// ==UserScript==
// @name         Solpick
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Claim free Solana
// @author       Basilio.
// @match        https://solpick.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=solpick.io
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/472721/Solpick.user.js
// @updateURL https://update.greasyfork.org/scripts/472721/Solpick.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var email = "email";////EXAMPLE////
    var password = "senha";////EXAMPLE////

    function isCaptchaChecked() {
        return grecaptcha && grecaptcha.getResponse().length !== 0;
    }


    
    if(window.location.href.includes("https://solpick.io/login.php")){

        setInterval(function() {
            if (document.querySelector("#user_email")) {
                document.querySelector("#user_email").value = email;
            }
            if (document.querySelector("#password")) {
                document.querySelector("#password").value = password;
            }

            if (isCaptchaChecked()) {
                if (document.querySelector(".btn")) {
                    document.querySelector(".btn").click();
                }
            }
        }, 5000);

    }


    if(window.location.href.includes("https://solpick.io/faucet.php")){

        

        setInterval(function() {

            if (isCaptchaChecked()) {
                document.querySelector("button[type='submit']").click();
            }
        }, 3000);


        setInterval(function() {
            window.location.replace(window.location.pathname + window.location.search + window.location.hash);
        }, 2*60000);
    }




})();