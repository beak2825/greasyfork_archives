// ==UserScript==
// @name         Earn Tron Faucet [every 55 sec]
// @namespace    Claim free Tron
// @version      2.0
// @description  Claim free Tron
// @author       lotocamion
// @match        https://faucetearn.xyz/index.php?ref=TYyY9hqasmiWHsGcU8fAWH1Yj5kwLsJL3d
// @match        https://faucetearn.xyz/main.php
// @icon         https://www.google.com/s2/favicons?domain=faucetearn.xyz
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439414/Earn%20Tron%20Faucet%20%5Bevery%2055%20sec%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/439414/Earn%20Tron%20Faucet%20%5Bevery%2055%20sec%5D.meta.js
// ==/UserScript==

        (function() {
         'use strict';

    /////EDIT WITH YOUR FAUCETPAY ADDRESS BELOW/////
    var tron = "0x494f4984614Ea885Eeda04D79e7a610df66D0E16";/////EXAMPLE/////




    var clicked = false;
    var address = false;
    if(document.querySelector("#user_login > form > input[type=text]")) {
    document.querySelector("#user_login > form > input[type=text]").value = tron;
    address = true;
    }
    if((document.querySelector("#user_login > form > input[type=text]")) && (address == true)){
    document.querySelector("#user_button").click();
    address = false;
    }
    setInterval(function() {
    if (window.grecaptcha.getResponse().length > 0) {
    document.querySelector("#send-faucet").click();
    clicked = true;
    }}, 55000);
    setTimeout(function() {
    window.location.replace(window.location.pathname + window.location.search + window.location.hash);
    }, 60000);
    })();

