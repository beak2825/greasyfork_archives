// ==UserScript==
// @name         Auto Faucet TRX USDT DGB FEY DOGE
// @namespace    Auto Claim
// @version      1.1
// @description  Auto Claim
// @author       lotocamion
// @match        https://jmcrypto.eu.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jmcrypto.eu.org
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/446782/Auto%20Faucet%20TRX%20USDT%20DGB%20FEY%20DOGE.user.js
// @updateURL https://update.greasyfork.org/scripts/446782/Auto%20Faucet%20TRX%20USDT%20DGB%20FEY%20DOGE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var address = false;

    if($('#fp_email')) {
    $("#fp_email").val("lotocamion@gmail.com");////EDIT WITH YOUR FAUCETPAY EMAIL ADDRESS HERE/////
    address = true;
    }
    setTimeout(function() {
    if($('input[type=submit]') && (address == true)) {
    $('input[type=submit]').click();
    }}, 5000);
    setTimeout(function() {
    if (window.location.href.includes("https://jmcrypto.eu.org/?ref=lotocamion@gmail.com")) {
    document.querySelector("#js-header > nav > ul > li:nth-child(9) > a").click();
    }}, 1500);
    setTimeout(function() {
    if((document.querySelector("#js-header > a")) && (window.location.href.includes("https://jmcrypto.eu.org/configuracion/"))) {
    window.location.replace("https://jmcrypto.eu.org/autofaucet/");
    }}, 12000);
    })();