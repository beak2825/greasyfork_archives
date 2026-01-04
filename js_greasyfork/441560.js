// ==UserScript==
// @name         🎁₣ree ₿TC [₿ITCOIN] FAUCET 4 WITH AUTOLOGIN🎁
// @namespace    Claim Free ₿itcoin
// @version      2.0
// @description  Claim Free ₿itcoin
// @author       lotocamion
// @match        https://satoshiwin.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=satoshiwin.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441560/%F0%9F%8E%81%E2%82%A3ree%20%E2%82%BFTC%20%5B%E2%82%BFITCOIN%5D%20FAUCET%204%20WITH%20AUTOLOGIN%F0%9F%8E%81.user.js
// @updateURL https://update.greasyfork.org/scripts/441560/%F0%9F%8E%81%E2%82%A3ree%20%E2%82%BFTC%20%5B%E2%82%BFITCOIN%5D%20FAUCET%204%20WITH%20AUTOLOGIN%F0%9F%8E%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

      
    ////EDIT YOUR USER NAME AND PASSWORD BELOW////
    var username = "YOURUSERNAME";////EXAMPLE////
    var password = "YOURPASSWORD";////EXAMPLE////
    var clicked = false;
    var address = false;
    if((document.querySelector("body > div.jumbotron.jumbotron-home > div > h1")) && (window.location.href.includes("https://satoshiwin.io/"))) {
    window.location.replace("https://satoshiwin.io/login");
    }
    if((document.querySelector("body > nav > div > div.navbar-header > a > img")) && (window.location.href.includes("https://satoshiwin.io/account"))) {
    window.location.replace("https://satoshiwin.io/faucet");
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
    }}, 6000);
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

