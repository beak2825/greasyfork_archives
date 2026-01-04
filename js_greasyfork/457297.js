// ==UserScript==
// @name         BigBtc Faucetpay 5 min
// @namespace    http://tampermonkey.net/
// @version      1.3
// @author       vikiweb
// @match        https://bigbtc.win/*
// @icon         https://www.google.com/s2/favicons?domain=bigbtc.win
// @grant        none
// @license MIT
// @noframes
// @description Unlimited Bitcoin via bigfaucet.co.
// @downloadURL https://update.greasyfork.org/scripts/457297/BigBtc%20Faucetpay%205%20min.user.js
// @updateURL https://update.greasyfork.org/scripts/457297/BigBtc%20Faucetpay%205%20min.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let bitcoin = '16Lfq4QC9Lgbse4oggWUVAe1e6Rv7o6ELn';
    let check_address = window.location.origin;
    let withdrawalcheck = 50;

    function isCaptchaChecked() {
        return grecaptcha && grecaptcha.getResponse().length !== 0;
    }


    if(window.location.href.includes(check_address)) {
        setTimeout(function(){
            if ((document.querySelector("#login > input[type=text]"))) {
                document.querySelector("#login > input[type=text]").value = bitcoin;
                document.querySelector("#login > input.button").click();
            }
        },10000)
    }


    if(window.location.href.includes("/faucet")) {
        setInterval(function(){
            if(document.querySelector('a[href*=account] b').innerText >= withdrawalcheck){
                window.location.replace(check_address+'/account')
            }
            if(document.querySelector("form #claimbutn")){
                if(isCaptchaChecked()) {
                    document.querySelector("form #claimbutn").click();
                }
            }
        },5000)
    }

    if(window.location.href.includes("/account")) {
        setTimeout(function(){
            if(document.querySelector("#withdraw")){
                document.querySelector("#withdraw").click();
            }
        },10000)
    }

    if(window.location.href.includes("/withdraw")) {
        setInterval(function(){
            if(document.querySelector("input.button[value=Withdraw]")){
                if(isCaptchaChecked()) {
                    document.querySelector("input.button[value=Withdraw]").click();
                }
            }

            if(document.querySelector('a[href*=account] b').innerText <= 0){
                window.location.replace(check_address + '/faucet')
            }
        },10000)
    }

})();