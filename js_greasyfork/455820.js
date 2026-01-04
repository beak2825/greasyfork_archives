// ==UserScript==
// @name         Free Bitcoin via adbitex.com
// @namespace    Claim free Bitcoin
// @version      1.0
// @description  Claim free Bitcoin
// @author       PepeMoreno
// @match        https://adbitex.com/*
// @match        https://adbitex.com/
// @icon         https://www.google.com/s2/favicons?domain=adfaucetpay.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/455820/Free%20Bitcoin%20via%20adbitexcom.user.js
// @updateURL https://update.greasyfork.org/scripts/455820/Free%20Bitcoin%20via%20adbitexcom.meta.js
// ==/UserScript==

(function() {
    'use strict';
    ////MUDE O USUARIO E SENHA ABAIXO////
    var username = "username/email";////AQUI////
    var password = "passowrd";////AQUI////
    var clicked = false;
    var address = false;
    if(document.querySelector("body > div.jumbotron-home") && (window.location.href.includes("https://adbitex.com/"))) {
        window.location.replace("https://adbitex.com/login");
    }
    if(window.location.href.includes("https://adbitex.com/account")) {
        window.location.replace("https://adbitex.com/faucet");
    }

    setInterval(function() {
        if (document.querySelector("#username")) {
            document.querySelector("#username").value = username;
            address = true;
        }
        if (document.querySelector("#password")) {
            document.querySelector("#password").value = password;
            address = true;
        }
    }, 1000);
    setInterval(function() {
        function isCaptchaChecked() {
            return grecaptcha && grecaptcha.getResponse().length !== 0;
        }

        if (isCaptchaChecked()) {
            document.querySelector("#button").click();
            clicked = true;
        }

        clicked = true;
    },6000);

    setTimeout(function() {
        if (document.getElementsByClassName("btn btn-block btn-primary btn-lg")[0]) {
            document.getElementsByClassName("btn btn-block btn-primary btn-lg")[0].click();
        }
    }, 3000);

    setInterval(function() {
        function isCaptchaChecked() {
            return grecaptcha && grecaptcha.getResponse().length !== 0;
        }

        if (isCaptchaChecked()) {
            document.getElementsByClassName("btn btn-block btn-success btn-lg")[0].click();
            clicked = true;
        }
    }, 3000);

    setTimeout(function() {
        window.location.replace(window.location.pathname + window.location.search + window.location.hash);
    }, 2*60000);
})();
