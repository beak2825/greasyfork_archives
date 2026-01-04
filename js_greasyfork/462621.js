// ==UserScript==  
// @name         faucetpayz.xyz : Auto Claim Faucet & Auto Login (NOT PAYING)
// @namespace    faucetpayz.auto.claim.faucet
// @version      1.1
// @description  https://ouo.io/9b2bCy
// @author       stealtosvra
// @match        https://faucetpayz.xyz/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=faucetpayz.xyz
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/462621/faucetpayzxyz%20%3A%20Auto%20Claim%20Faucet%20%20Auto%20Login%20%28NOT%20PAYING%29.user.js
// @updateURL https://update.greasyfork.org/scripts/462621/faucetpayzxyz%20%3A%20Auto%20Claim%20Faucet%20%20Auto%20Login%20%28NOT%20PAYING%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // INSERT YOUR EMAIL
    const email = "email@gmail.com";

    setTimeout(function(){
        if (document.querySelector("input[placeholder='Enter your faucetpay email address here']").value = email) {
            document.querySelector("input[value='Login']").click();
        }
    }, 5000);

    function hCaptcha() {
        return grecaptcha && grecaptcha.getResponse().length !== 0;
    }

    setInterval(function() {
        if (hCaptcha()) {
            document.querySelector('.claimbtn').click();}
    }, 1000);


    if (window.location.href === "https://faucetpayz.xyz/dashboard.php"){
        window.location.replace("https://faucetpayz.xyz/faucet.php");
    }

    setInterval(function() {
        if (document.querySelector(".success:contains('trx')")) {
            document.querySelector("button[name='ethf']").click();}
    }, 180000);

    setInterval(function() {
        if (document.querySelector(".success:contains('eth')")) {
            document.querySelector("button[name='trxf']").click();}
    }, 180000);

})();