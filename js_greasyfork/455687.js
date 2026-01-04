// ==UserScript==
// @name         Free Bitcoin via cryptowin.io autologin
// @namespace    Claim free Bitcoin
// @version      2.3
// @description  Claim free Bitcoin
// @author       vikiweb
// @match        https://cryptowin.io/
// @match        https://cryptowin.io/*
// @icon         https://www.google.com/s2/favicons?domain=cryptowin.io
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/455687/Free%20Bitcoin%20via%20cryptowinio%20autologin.user.js
// @updateURL https://update.greasyfork.org/scripts/455687/Free%20Bitcoin%20via%20cryptowinio%20autologin.meta.js
// ==/UserScript==

(function() {
    'use strict';

    ////EDIT YOUR USER NAME AND PASSWORD BELOW////
    var username = "email";
    var password = "password";

    function isCaptchaChecked() {
        return grecaptcha && grecaptcha.getResponse().length !== 0;
    }

    if(document.querySelector("body > div.main-page-wrapper > div.html-top-content > div.theme-top-section > header > div > div > div") && (window.location.href.includes("https://cryptowin.io/"))) {
        window.location.replace("https://cryptowin.io/login");
    }

    if(window.location.href.includes("https://cryptowin.io/login")){

        setInterval(function() {
            if (document.querySelector("#username")) {
                document.querySelector("#username").value = username;
            }
            if (document.querySelector("#password")) {
                document.querySelector("#password").value = password;
            }

            if (document.querySelector(".btn-login")) {
                document.querySelector(".btn-login").click();
            }
        }, 6000);
    }

    if(window.location.href.includes("https://cryptowin.io/account")) {
        window.location.replace("https://cryptowin.io/faucet");
    }

    if(window.location.href.includes("https://cryptowin.io/faucet")){
        let fauceClick = false;

        if (document.querySelector(".btn-block.btn-click.btn-lg") && fauceClick === false) {
            document.querySelector(".btn-block.btn-click.btn-lg").click();
            fauceClick = true;
        }

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