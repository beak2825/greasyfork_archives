// ==UserScript==
// @name         cryptowest.pro : Auto Faucet & Auto Login
// @namespace    cryptowest.pro.auto.faucet
// @version      1.0
// @description  https://ouo.io/NxLr5t
// @author       stealotsvra
// @match        https://cryptowest.pro/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cryptowest.pro
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/463343/cryptowestpro%20%3A%20Auto%20Faucet%20%20Auto%20Login.user.js
// @updateURL https://update.greasyfork.org/scripts/463343/cryptowestpro%20%3A%20Auto%20Faucet%20%20Auto%20Login.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const email = "";
    const password = "";

    const emailField = document.querySelector("input[name='email']");
    const passwordField = document.querySelector("input[name='password']");
    const submitButton = document.querySelector('button.buttonc2');
    const selectElement = document.querySelector('.form-control');

    if (emailField) {emailField.value = email;}
    if (passwordField) {passwordField.value = password;}

    setInterval(() => {if (hCaptcha() && submitButton) {submitButton.click();}}, 6000);

    if (window.location.href === "https://cryptowest.pro") {
        window.location.href = "https://cryptowest.pro/login";
    }

    if (window.location.href === "https://cryptowest.pro/myoffice") {
        window.location.href = "https://cryptowest.pro/faucet";
    }

    function hCaptcha() {return grecaptcha && grecaptcha.getResponse().length !== 0;}
    setInterval(function() {if (hCaptcha()) {document.querySelector("button[type='submit']").click();}}, 5000);

})();