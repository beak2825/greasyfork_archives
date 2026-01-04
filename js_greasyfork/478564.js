// ==UserScript==
// @name         [New] DogeNetwork
// @namespace    https://greasyfork.org/users/1162863
// @version      3.1
// @description  Automatic claim all Coins to Faucetpay
// @author       Andrewblood
// @match        *://*.dogenetwork.fun/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dogenetwork.fun
// @run-at       document-start
// @grant        GM_webRequest
// @antifeature  referal-link     Referal-Link is in this Script integrated
// @license      Copyright Andrewblood
// @downloadURL https://update.greasyfork.org/scripts/478564/%5BNew%5D%20DogeNetwork.user.js
// @updateURL https://update.greasyfork.org/scripts/478564/%5BNew%5D%20DogeNetwork.meta.js
// ==/UserScript==
/*

Profit: 0,50$/Day

For full automation you need theese scripts: https://greasyfork.org/de/scripts?set=588971
The AD-Block detection is bypassed!

Login over my Link https://dogenetwork.fun/ref/64423 open any Faucet, let it open and see how your coins in Faucetpay increases... ;)
1 Account per IP!

When you want to Support me for the work. Then take a look on my other scripts on https://greasyfork.org/users/1162863 or
Register your Faucetpay Account over https://faucetpay.io/?r=script


    if (window.location.href == ("https://dogenetwork.fun/")){
        if (document.referrer != ('https://greasyfork.org/')){
            alert("Please Login over my Link")
            window.location.replace("https://greasyfork.org/de/scripts/478564-final-dogenetwork")
        }
    }

*/
(function() {
    'use strict';


    var blockList = [
        "dogenetwork.fun##.slide-right",
        "dogenetwork.fun##.slide-left",
        "dogenetwork.fun##.flexShowCoins",
        "dogenetwork.fun##.flexAd",
        "dogenetwork.fun##.auto_banner",
        "dogenetwork.fun###getcoinsitesticky",
    ];
    var windowHostname = window.location.hostname;
    for(var i = 0; i < blockList.length; i++) {
        var entryParts = blockList[i].split('##');
        if(windowHostname === entryParts[0]) {
            var matchedElements = document.querySelectorAll(entryParts[1]);
            for(var j = 0; j < matchedElements.length; j++) {
                var matchedElem = matchedElements[j];
                matchedElem.parentNode.removeChild(matchedElem);
            }
        }
    }



    if (window.location.href == "https://dogenetwork.fun/dashboard"){
        if (document.querySelector("body > div.container-fluid.mt-5 > div > div.col-md-6.text-center > div:nth-child(1) > div > div:nth-child(2) > div.alert.alert-warning.alert-dismissible")){
            if (document.querySelector("body > div.container-fluid.mt-5 > div > div.col-md-6.text-center > div:nth-child(1) > div > div:nth-child(2) > div.alert.alert-warning.alert-dismissible").innerText.includes("rate-limited")){
                window.location.replace(document.referrer)
            }
        }
        if (document.referrer == "https://dogenetwork.fun/faucet-doge"){
            window.location.replace("https://dogenetwork.fun/faucet/ethereum");
        }
        if (document.referrer == "https://dogenetwork.fun/faucet/ethereum"){
            window.location.replace("https://dogenetwork.fun/faucet/litecoin");
        }
        if (document.referrer == "https://dogenetwork.fun/faucet/litecoin"){
            window.location.replace("https://dogenetwork.fun/faucet/bitcoin-cash");
        }
        if (document.referrer == "https://dogenetwork.fun/faucet/bitcoin-cash"){
            window.location.replace("https://dogenetwork.fun/faucet/dash");
        }
        if (document.referrer == "https://dogenetwork.fun/faucet/dash"){
            window.location.replace("https://dogenetwork.fun/faucet/digibyte");
        }
        if (document.referrer == "https://dogenetwork.fun/faucet/digibyte"){
            window.location.replace("https://dogenetwork.fun/faucet/tron");
        }
        if (document.referrer == "https://dogenetwork.fun/faucet/tron"){
            window.location.replace("https://dogenetwork.fun/faucet/tether");
        }
        if (document.referrer == "https://dogenetwork.fun/faucet/tether"){
            window.location.replace("https://dogenetwork.fun/faucet/feyorra");
        }
        if (document.referrer == "https://dogenetwork.fun/faucet/feyorra"){
            window.location.replace("https://dogenetwork.fun/faucet/zcash");
        }
        if (document.referrer == "https://dogenetwork.fun/faucet/zcash"){
            window.location.replace("https://dogenetwork.fun/faucet/binancecoin");
        }
        if (document.referrer == "https://dogenetwork.fun/faucet/binancecoin"){
            window.location.replace("https://dogenetwork.fun/faucet/solana");
        }
        if (document.referrer == "https://dogenetwork.fun/faucet/solana"){
            window.location.replace("https://dogenetwork.fun/faucet/ripple");
        }
        if (document.referrer == "https://dogenetwork.fun/faucet/ripple"){
            window.location.replace("https://dogenetwork.fun/faucet/matic-network");
        }
        if (document.referrer == "https://dogenetwork.fun/faucet/matic-network"){
            window.location.replace("https://dogenetwork.fun/faucet/cardano");
        }
        if (document.referrer == "https://dogenetwork.fun/faucet/cardano"){
            window.location.replace("https://dogenetwork.fun/faucet/the-open-network");
        }
        if (document.referrer == "https://dogenetwork.fun/faucet/the-open-network"){
            window.location.replace("https://dogenetwork.fun/faucet/stellar");
        }
        if (document.referrer == "https://dogenetwork.fun/faucet/stellar"){
            window.location.replace("https://dogenetwork.fun/faucet/usd-coin");
        }
        if (document.referrer == "https://dogenetwork.fun/faucet/usd-coin"){
            window.location.replace("https://dogenetwork.fun/faucet/monero");
        }
        if (document.referrer == "https://dogenetwork.fun/faucet/monero"){
            window.location.replace("https://dogenetwork.fun/faucet-doge");
        }

        setTimeout(function() {
            window.location.replace("https://dogenetwork.fun/faucet-doge")
        }, 10*1000);

    }

    if (window.location.href.includes("dogenetwork.fun/faucet/")){
        setTimeout(function() {
            location.reload();
        }, 180*1000);
        if (document.querySelector("#protect")){
            setInterval(function(){
                if (document.querySelector("#form > div.h-captcha > iframe").dataset.hcaptchaResponse.length > 0 && document.querySelector('input[name="cf-turnstile-response"]').value.length > 0)
                {
                    document.querySelector("#protect").click();
                }
                else
                {
                    console.log("Wait for Captcha");
                }
            }, 3000);
        } else {
            setTimeout(function() {
                document.querySelector("#countdown").click();
            }, 3000);
            setInterval(function(){
                if (document.querySelector("#turnstilecaptcha") && document.querySelector('input[name="cf-turnstile-response"]').value.length > 0)
                {
                    document.querySelector("#claimButton").click();
                }
            }, 3000);
        }
    }
    if (window.location.href == "https://dogenetwork.fun/faucet-doge"){
        setTimeout(function() {
            location.reload();
        }, 180*1000);
        if (document.querySelector("#protect")){
            setInterval(function(){
                if (document.querySelector("#form > div.h-captcha > iframe").dataset.hcaptchaResponse.length > 0 && document.querySelector('input[name="cf-turnstile-response"]').value.length > 0)
                {
                    document.querySelector("#protect").click();
                }
                else
                {
                    console.log("Wait for Captcha");
                }
            }, 3000);
        }
        else
        {
            setTimeout(function() {
                document.querySelector("body > div.container-fluid.mt-5 > div > div.col-md-6.text-center > div:nth-child(1) > div > div:nth-child(4) > div > table > tbody > tr:nth-child(3) > td > button").click();
            }, 3000);
            setInterval(function(){
                if (document.querySelector("#turnstilecaptcha") && document.querySelector('input[name="cf-turnstile-response"]').value.length > 0)
                {
                    document.querySelector("#claimButton").click();
                }
            }, 1000);
        }
    }
})();