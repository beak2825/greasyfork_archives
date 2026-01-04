// ==UserScript==
// @name         Unlimited Crypto Faucet
// @namespace    Claim Free Coin
// @version      0.3
// @description  Claim Free Coin
// @author       vikiweb
// @match        https://getcoin.cryptopedia.id/*
// @match        https://getcoin.garudaapps.com/*
// @match        https://getcoin.rajawaliapps.com/*
// @match        https://getcoin.tribuncrypto.net/*
// @match        https://getcoin.coi.my.id/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=getcoin.cryptopedia.id
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458891/Unlimited%20Crypto%20Faucet.user.js
// @updateURL https://update.greasyfork.org/scripts/458891/Unlimited%20Crypto%20Faucet.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let faucetpay_email = "email_address";

    let main_address = window.location.origin;
    let coins = ["BNB", "BTC", "DGB", "DODGE", "LTC", "SOL", "TRX"];
    let currentCoinIndex = 0;

    function isCaptchaChecked() {
        return grecaptcha && grecaptcha.getResponse().length !== 0;
    }

    function visibleCheck(elm) {
        if(!elm.offsetHeight && !elm.offsetWidth) { return false; }
        if(getComputedStyle(elm).visibility === 'hidden') { return false; }
        return true;
    }

    if(window.location.origin === main_address){

        setInterval(function() {
            if (document.querySelector("#email")) {
                document.querySelector("#email").value = faucetpay_email;
            }
        }, 1000);

        setInterval(function() {
            if (isCaptchaChecked()) {
                if (document.querySelector(".btn-block[type='submit']")) {
                    document.querySelector(".btn-block[type='submit']").click();
                }
            }
        }, 6000);
    }

    if (window.location.href.includes("/user/dashboard") || window.location.href.includes("/User/Dashboard")) {
        setTimeout(() => {
            window.location.replace(main_address + "/user/faucet/" + coins[currentCoinIndex]);
        }, 30000); //60000
    }

    setInterval(function() {
        if (document.querySelector("h1") && document.querySelector("h1").innerText === "404" || document.querySelector("h1") && document.querySelector("h1").innerText === "404") {
            let currentCoin = window.location.href.split("/")[5];
            let coins = ["BNB", "BTC", "DGB", "DODGE", "LTC", "SOL", "TRX"];
            let currentIndex = coins.indexOf(currentCoin);
            if(currentIndex === coins.length - 1) {
                currentIndex = 0;
            } else {
                currentIndex++;
            }
            window.location.replace(main_address + "/user/faucet/" + coins[currentIndex]);
        }
    }, 1000);

    setInterval(function() {
        if (window.location.href.includes("/user/faucet/")){
            if (isCaptchaChecked()) {
                if (document.querySelector(".btn-block[type='submit']") && !visibleCheck(document.querySelector("#timerDiv.alert-danger #box h1"))) {
                    document.querySelector(".btn-block[type='submit']").click();
                }
            }
        }
        if(document.querySelector("#timerDiv.alert-danger #box h1") || document.querySelector(".display-4 + h4 span").innerHTML == 'Empty'){

            if(visibleCheck(document.querySelector("#timerDiv.alert-danger #box h1")) || document.querySelector(".display-4 + h4 span").innerHTML == 'Empty'){
                let currentCoin = window.location.href.split("/")[5];
                let coins = ["BNB", "BTC", "DGB", "DODGE", "LTC", "SOL", "TRX"];
                let currentIndex = coins.indexOf(currentCoin);
                if(currentIndex === coins.length - 1) {
                    currentIndex = 0;
                } else {
                    currentIndex++;
                }
                window.location.replace(main_address + "/user/faucet/" + coins[currentIndex]);
            }
        }
    }, 5000);
})();