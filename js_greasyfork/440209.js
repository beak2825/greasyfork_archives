// ==UserScript==
// @name         Zero Timer Instant Litecoin Faucet
// @namespace    Claim free LTC
// @version      1.0
// @description  Claim free LTC
// @author       lotocamion
// @match        https://cryptopayfaucet.xyz/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cryptopayfaucet.xyz
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/440209/Zero%20Timer%20Instant%20Litecoin%20Faucet.user.js
// @updateURL https://update.greasyfork.org/scripts/440209/Zero%20Timer%20Instant%20Litecoin%20Faucet.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var address = false;
    if($("#wpbf_address")) {
    $("#wpbf_address").val("DGNRvwyYSMYKjxFDm8BHTcD23kWesLg5i1");////EDIT YOUR ADDRESS HERE/////
    address = true;
    }
    setInterval(function() {
    if (window.grecaptcha.getResponse().length > 0) {
    $("#wpbf-claim-form").submit();
    }
    }, 5000);
    setInterval(function() {
    if (document.querySelector("#faucetbody > div > div:nth-child(2) > div.col-xs-12.col-md-6.col-md-push-3 > div:nth-child(3)")) {
    window.location.replace("https://cryptopayfaucet.xyz/?r=MThidmDerYdNaDw1QAdF1c2Xe3fbuaJ5ZD");
    }
    }, 1000);
    setInterval(function() {
    if(document.querySelector("#content > div > div > div > div.nv-content-wrap.entry-content > p:nth-child(17) > button")) {
    document.querySelector("#content > div > div > div > div.nv-content-wrap.entry-content > p:nth-child(17) > button").click();
    }}, 1000);
    setTimeout(function() {
    window.location.replace(window.location.pathname + window.location.search + window.location.hash);
    }, 65000);
    })();

