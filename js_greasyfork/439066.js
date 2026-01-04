// ==UserScript==
// @name         Free BTC 2 [BITCOIN] FAUCET WITH AUTOLOGIN
// @namespace    Claim free Bitcoin
// @version      3.0
// @description  Claim free Bitcoin
// @author       lotocamion
// @match        https://btcadspace.com/*
// @match        https://btcadspace.com/
// @icon         https://www.google.com/s2/favicons?domain=btcadspace.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439066/Free%20BTC%202%20%5BBITCOIN%5D%20FAUCET%20WITH%20AUTOLOGIN.user.js
// @updateURL https://update.greasyfork.org/scripts/439066/Free%20BTC%202%20%5BBITCOIN%5D%20FAUCET%20WITH%20AUTOLOGIN.meta.js
// ==/UserScript==

    (function() {
    'use strict';
    ////EDIT YOUR USER NAME AND PASSWORD BELOW////
     var username = "YOUR_USERNAME";////EXAMPLE////
    var password = "YOUR_PASSWORD";////EXAMPLE////
    var clicked = false;
    var address = false;

    setTimeout(function() {
    if (document.URL =="https://btcadspace.com/")
    {window.location.replace("https://btcadspace.com/login")
    }},1000)

    setInterval (() => {
    if (document.querySelector(".h-captcha") && document.URL =="https://btcadspace.com/login"){
    if (document.querySelector(".h-captcha > iframe").getAttribute("data-hcaptcha-response").length > 0){
    document.querySelector('#username').value = username;
    document.querySelector('#password').value = password;
    document.querySelector("button[type='submit']").click();
    }
    }},5000 )

    setTimeout(function() {
    if (document.URL =="https://btcadspace.com/account")
    {window.location.replace("https://btcadspace.com/faucet")
    }},3000)


    setTimeout(function() {
    if (document.URL =="https://btcadspace.com/faucet"){
    document.querySelector(".btn.btn-primary.btn-lg").click()
    }},3000)

    setInterval(function() {
    if (!clicked && document.querySelector(".h-captcha > iframe") && document.querySelector(".h-captcha > iframe").getAttribute("data-hcaptcha-response").length > 0) {
    document.querySelector("button[type='submit']").click();
    clicked = true;
    }
    }, 3000);

    setInterval(function() {
    window.location.replace(window.location.pathname + window.location.search + window.location.hash);
    }, 2*60000);
    })();