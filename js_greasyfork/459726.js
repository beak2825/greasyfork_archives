// ==UserScript==
// @name         Free Bitcoin via simpleads.io autologin
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Claim free Bitcoin
// @author       vikiweb
// @match        https://simpleads.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=simpleads.io
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/459726/Free%20Bitcoin%20via%20simpleadsio%20autologin.user.js
// @updateURL https://update.greasyfork.org/scripts/459726/Free%20Bitcoin%20via%20simpleadsio%20autologin.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let username = "username/email";////EXAMPLE////
    let password = "password";////EXAMPLE////
    let check_address = window.location.origin;

    function isCaptchaChecked() {
        return grecaptcha && grecaptcha.getResponse().length !== 0;
    }

    function isFaucetFullyClaimed() {
        return document.querySelector(".notyf-announcer") && document.querySelector(".notyf-announcer").innerText.includes('You reached the maximum')
    }

    if(document.querySelector("body main .display-5") && (window.location.href.includes(check_address))) {
        window.location.replace(check_address+"/login");
    }

    if(window.location.href.includes(check_address+"/login")){

        setInterval(function() {
            if (document.querySelector("#username")) {
                document.querySelector("#username").value = username;
            }
            if (document.querySelector("#password")) {
                document.querySelector("#password").value = password;
            }

            if (isCaptchaChecked()) {
                if (document.querySelector(".btn-lg")) {
                    document.querySelector(".btn-lg").click();
                }
            }
        }, 5000);

    }

    if(window.location.href.includes(check_address+"/account")) {
        window.location.replace(check_address+"/faucet");
    }

    if(window.location.href.includes(check_address+"/faucet")){

        let fauceClick = false;
        
        if (document.querySelector(".btn-primary.btn-lg") && fauceClick === false) {
            document.querySelector(".btn-primary.btn-lg").click();
            fauceClick = true;
        }

        setInterval(function() {
            if (isCaptchaChecked()) {
                document.querySelector("button[type='submit']").click();
            }
            if(isFaucetFullyClaimed()){
                alert("You have reached the maximum limit come back tomorrow to claim");
            }
        }, 3000);


        setInterval(function() {
            window.location.replace(window.location.pathname + window.location.search + window.location.hash);
        }, 2*60000);
    }

})();