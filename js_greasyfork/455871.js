// ==UserScript==
// @name         Free Bitcoin via adcrypto.co.in
// @namespace    Claim free Bitcoin
// @version      1.0
// @description  Claim free Bitcoin
// @author       PepeMoreno
// @match        https://adcrypto.co.in/*
// @match        https://adcrypto.co.in/
// @icon         https://www.i2symbol.com/pictures/emojis/e/9/e/a/e9ea22f162a5c9f866146d28f56db057_384.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/455871/Free%20Bitcoin%20via%20adcryptocoin.user.js
// @updateURL https://update.greasyfork.org/scripts/455871/Free%20Bitcoin%20via%20adcryptocoin.meta.js
// ==/UserScript==

(function() {
    'use strict';
   ////MUDE O USUARIO E SENHA ABAIXO////
    var username = "username/email";////AQUI////
    var password = "passowrd";////AQUI////
    var clicked = false;
    var address = false;
    if(document.querySelector("body > div.jumbotron-home") && (window.location.href.includes("https://adcrypto.co.in/"))) {
        window.location.replace("https://adcrypto.co.in/login");
    }
    if(window.location.href.includes("https://adcrypto.co.in/account")) {
        window.location.replace("https://adcrypto.co.in/faucet");
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
