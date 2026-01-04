// ==UserScript==
// @name         🎁 Free BTC [BITCOIN] FAUCET 3 WITH AUTOLOGIN 🎁
// @namespace    Claim Free Bitcoin
// @version      1.0
// @description  Claim Free Bitcoin
// @author       lotocamion
// @match        https://cryptoclaim.cash/
// @match        https://cryptoclaim.cash/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cryptoclaim.cash
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440721/%F0%9F%8E%81%20Free%20BTC%20%5BBITCOIN%5D%20FAUCET%203%20WITH%20AUTOLOGIN%20%F0%9F%8E%81.user.js
// @updateURL https://update.greasyfork.org/scripts/440721/%F0%9F%8E%81%20Free%20BTC%20%5BBITCOIN%5D%20FAUCET%203%20WITH%20AUTOLOGIN%20%F0%9F%8E%81.meta.js
// ==/UserScript==

(function() {
    'use strict';
   
    ////EDIT YOUR USER NAME AND PASSWORD BELOW////
    var username = "YOURUSERNAME";////EXAMPLE////
    var password = "YOURPASSWORD";////EXAMPLE////
    var clicked = false;
    var address = false;
    if((document.querySelector("body > div.jumbotron.jumbotron-home > div > h1")) && (window.location.href.includes("https://cryptoclaim.cash/"))) {
    window.location.replace("https://cryptoclaim.cash/login");
    }
    if((document.querySelector("body > nav > div > div.navbar-header > a > img")) && (window.location.href.includes("https://cryptoclaim.cash/account"))) {
    window.location.replace("https://cryptoclaim.cash/faucet");
    }
    if (document.querySelector("#username")) {
    document.querySelector("#username").value = username;
    address = true;
    }
    if (document.querySelector("#password")) {
    document.querySelector("#password").value = password;
    address = true;
    }
    if(document.querySelector("body > div:nth-child(2) > div > div > div > div.panel-body > form > div.checkbox > label > input[type=checkbox]")){
    document.querySelector("body > div:nth-child(2) > div > div > div > div.panel-body > form > div.checkbox > label > input[type=checkbox]").click();
    }
    setInterval(function() {
    if (!clicked && document.querySelector(".h-captcha") && document.querySelector(".h-captcha > iframe").getAttribute("data-hcaptcha-response").length > 0) {
    document.querySelector("#button").click();
    clicked = true;
    }}, 5000);
    setTimeout(function() {
    if (document.getElementsByClassName("btn btn-block btn-primary btn-lg")[0]) {
    document.getElementsByClassName("btn btn-block btn-primary btn-lg")[0].click();
    }
    }, 3000);
    setInterval(function() {
    if (!clicked && document.querySelector(".h-captcha > iframe") && document.querySelector(".h-captcha > iframe").getAttribute("data-hcaptcha-response").length > 0) {
    document.getElementsByClassName("btn btn-block btn-success btn-lg")[0].click();
    clicked = true;
    }
    }, 3000);
    setTimeout(function() {
    window.location.replace(window.location.pathname + window.location.search + window.location.hash);
    }, 5*60000);
    })();

