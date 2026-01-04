// ==UserScript==
// @name         🎁₿itcoin ₣ast ₣aucet🎁
// @namespace    ₵laim Free Bitcoin
// @version      1.0
// @description  ₵laim ₣ree ₿itcoin
// @author       lotocamion
// @match        https://fast-faucet.space/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fast-faucet.space
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441870/%F0%9F%8E%81%E2%82%BFitcoin%20%E2%82%A3ast%20%E2%82%A3aucet%F0%9F%8E%81.user.js
// @updateURL https://update.greasyfork.org/scripts/441870/%F0%9F%8E%81%E2%82%BFitcoin%20%E2%82%A3ast%20%E2%82%A3aucet%F0%9F%8E%81.meta.js
// ==/UserScript==

(function() {
    'use strict';




    var BTC = " 122ES9zQJm8FTqczfYM2P4ZRK5pQEcfCj4";////EDIT YOUR ADDRESS HERE////
    var address = false;
    var clicked = false;
    if (document.getElementsByClassName("form-control")[0]) {
    document.getElementsByClassName("form-control")[0].value = BTC;
    address = true;
    }
    if ((document.getElementsByClassName("btn btn-primary")[0]) && (address == true)) {
    document.getElementsByClassName("btn btn-primary")[0].click();
    }
    setTimeout(function() {
    if ((document.getElementsByClassName("btn btn-success btn-lg")[0]) && (window.location.href.includes("https://fast-faucet.space/index.php"))) {
    document.getElementsByClassName("btn btn-success")[0].click();
    }
    }, 5000);
    setInterval(function() {
    if (document.querySelector(".h-captcha")) {
    if (document.querySelector(".h-captcha > iframe").getAttribute("data-hcaptcha-response").length > 0){
    document.getElementsByClassName("btn btn-success")[0].click();
    clicked = true;
    }
    }}, 5000);
    setInterval(function() {
    if (document.getElementsByClassName("alert alert-success")[0]) {
    window.location.replace(window.location.pathname + window.location.search + window.location.hash);
    }
    }, 125100);




})();