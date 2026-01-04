// ==UserScript==
// @name         Free Bitcoin via adcrypto.co.in autologin
// @namespace    Claim free Bitcoin
// @version      1.0
// @description  Claim free Bitcoin
// @author       vikiweb
// @match        https://adcrypto.co.in/*
// @match        https://adcrypto.co.in/
// @icon         https://www.google.com/s2/favicons?domain=adcrypto.co.in
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/456099/Free%20Bitcoin%20via%20adcryptocoin%20autologin.user.js
// @updateURL https://update.greasyfork.org/scripts/456099/Free%20Bitcoin%20via%20adcryptocoin%20autologin.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    ////EDIT YOUR USER NAME AND PASSWORD BELOW////
    var username = "username/email";////EXAMPLE////
    var password = "password";////EXAMPLE////
    var clicked = false;
    var address = false;
 
    if(document.querySelector("body div.main-text-wrapper") && (window.location.href.includes("https://adcrypto.co.in/"))) {
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
    }, 10*60000);
})();