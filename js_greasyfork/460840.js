// ==UserScript==
// @name         winfaucet.xyz : Autofaucet & Auto PTC (DOWN)
// @namespace    https://winfaucet.xyz/?ref=stealtosvra
// @version      1.2
// @description  https://ouo.io/8f9Nhy
// @author       stealtosvra
// @match        https://winfaucet.xyz/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/460840/winfaucetxyz%20%3A%20Autofaucet%20%20Auto%20PTC%20%28DOWN%29.user.js
// @updateURL https://update.greasyfork.org/scripts/460840/winfaucetxyz%20%3A%20Autofaucet%20%20Auto%20PTC%20%28DOWN%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

       function isCaptchaChecked() {
       return grecaptcha && grecaptcha.getResponse().length !== 0;}
       if(window.location.href.includes("https://winfaucet.xyz/PTC")){
            const visitBtn = document.getElementById('PTC_VisitBTN');
                  visitBtn.click();}

       if(window.location.href.includes("https://winfaucet.xyz/?p=WATCHPTC")){
       setInterval(function() {

           if (isCaptchaChecked()) {
            const button = document.querySelector('.btn.btn-primary.btn-block');
                  button.click();}},3000);
           }

           if(window.location.href.includes("https://winfaucet.xyz/Claim")){

             setTimeout(function () {
             window.location.href = "https://ouo.io/Tccj6G";}, 310000);

             const ClaimBtn = document.querySelector('[data-target="#FauceModel"]');
                   ClaimBtn.click();
                  setInterval(function() {

             if (isCaptchaChecked()) {
             const button = document.querySelector('button[type="submit"]');
                 button.addEventListener('click', () => {
                     console.log('Claimed!');});
                 button.click();}},3000);
           }


})();