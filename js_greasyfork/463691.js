// ==UserScript==
// @name         GR8 Faucets : Auto Claim
// @namespace    gr8.auto.faucet
// @version      1.3
// @description  Auto claims Faucets with GR8 Template
// @author       stealtosvra
// @include /^(https?:\/\/)(.+)?(coinhirek|coinsrev|emoticonfaucet|faucetswall|kedch|fautsy|mix-crypto|usdtgratis|technicaleks|treaw)(\.com)(\/.*)/
// @include /^(https?:\/\/)(.+)?(bestclaimtrx|ccryptofenz|dogetofaucet|earnsolana|freeltc|healthysamy|satoshi4u|vipminer)(\.xyz)(\/.*)/
// @include /^(https?:\/\/)(.+)?(claimbits|claimfreecoins|gobits|i-bits|starbits)(\.io)(\/.*)/
// @include /^(https?:\/\/)(.+)?(bestbitcoinfaucets|claimcoins|crypto-fi)(\.net)(\/.*)/
// @include /^(https?:\/\/)(.+)?(crazyblog|faucetnation)(\.in)(\/.*)/
// @include /^(https?:\/\/)(.+)?(adsbtc|cryptoearn)(\.fun)(\/.*)/
// @match        https://cashbux.work/*
// @match        https://btc.myclaimer.com/*
// @match        https://cheezo.gq/*
// @match        https://claimfreesatoshi.online/*
// @match        https://crypto.haxina.com/*
// @match        https://crypto.mundoby.xyz/*
// @match        https://cryptofuture.co.in/*
// @match        https://cryptofy.vip/*
// @match        http://freecoin.in.ua/*
// @match        https://hatecoin.me/*
// @match        https://lifefaucet.top/*
// @match        https://ltc.faucetswall.com/*
// @match        https://trx.faucetswall.com/*
// @match        https://viedoge.ml/*
// @match        https://xapcom.eu/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bestbitcoinfaucets.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/463691/GR8%20Faucets%20%3A%20Auto%20Claim.user.js
// @updateURL https://update.greasyfork.org/scripts/463691/GR8%20Faucets%20%3A%20Auto%20Claim.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // INSERT YOUR CREDENTIALS
    const email = "stealtosvra@gmail.com";
    const bch = "bitcoincash:qqrhzhd52w5us0lj2vm8kcskmj300nznjsvu4dqqpd";
    const bnb = "0xDD9cb7e222Bdd926E8d8aB1E8574e6A584c0F122";
    const btc = "1Eb61tXssstGmTjkCBzK8x4MKuuR4WTyrV";
    const dash = "XpdvnSYU4TRoz9zrRF1wsRx4V9dHAtLokc";
    const doge = "DLtH8LwRsMsdy3GhqjA36BzBMQHzKYuNSN";
    const dgb = "DFyLcx6yrL9pXXUmg5wKucKQc8eEoxXdbz";
    const eth = "0xb7E746727Cf85B5C3652b2EE9BA4a44b298a9870";
    const ltc = "ltc1qm2mmjhy0jjewt86auhlc0899zzzkw4ge4nygn0";
    const matic = "0xA41d28b0103EaF68010157A7591Fa0d1098D3DeF";
    const sol = "H5DYyoSh2R4FMhpNoKEHQdCzQzPBX8mcaNeDNqspbzVu";
    const trx = "TFFvZT4mgP44KFr9w5Yni7HeYbph6Eq97v";
    const xrp = "rhi77L73jGvGN3zQf3AEbYnjWYZu7CSTe8";
    const zec = "t1cWujhQiBriAd9WNMLQCmyyWQuVWYdZpDK";

    const loginButton = document.querySelector('.btn-primary');
    const successAlert = document.querySelector('div.alert.alert-success.fade.show');
    const infoAlert = document.querySelector('p.alert.alert-info');
    const dangerAlert = document.querySelector('div.alert.alert-danger.fade.show');
    const button = document.querySelector('.btn.btn-block.btn-primary.my-2');
    const divElement = document.getElementById('recaptcha-anchor');
    const inputElement = document.querySelector('input[type="text"]');
    const clmnowElement = document.querySelector('.clmnow');
    const downloadBtn = document.querySelector('button.btn.btn-block.btn-primary.my-2');
    const sponsorLink = document.querySelector('a.btn.btn-block.btn-primary.my-2');
    const searchText = 'satoshi was sent to your';

    const faucets = [

        ["https://bestbitcoinfaucets.net/bitcoin-faucet/", "https://ouo.io/5TaUBj"],
        ["https://claimfreesatoshi.online/", "https://ouo.io/NaY6fP"],
        ["https://claimbits.io/", "https://loptelink.com/qAajyZ"],
        ["https://cryptofenz.xyz", "https://ouo.io/xjWuBnV"],
        ["https://cashbux.work/faucetbinance/", "https://ouo.io/7UxF6g"],
        ["https://cashbux.work/faucetltc/", "https://ouo.io/37SuoR"],
        ["https://cashbux.work/faucetsol/", "https://ouo.io/q7rBQm"],
        ["https://bestclaimtrx.xyz/faucetdoge/", "https://ouo.io/nM8akKF"],
        ["https://www.healthysamy.xyz/sa", "https://ouo.io/xCjfcH"]];

    const currentUrlptc = window.location.href;
    const nextLink = faucets.find(link => link[0] === currentUrlptc);

    function hCaptcha() {return grecaptcha && grecaptcha.getResponse().length !== 0;}

    setTimeout (() => {
        if(document.querySelector("button[class='btn btn-block btn-primary my-2']")){
            document.querySelector("button[class='btn btn-block btn-primary my-2']").disabled = false;
        }},5000)

    setTimeout (() => {
        if(document.querySelector("button[class='btn btn-block btn-primary my-2']")){
            document.querySelector("button[class='btn btn-block btn-primary my-2']").click();
        }},25000)

    setTimeout(function() {
        if (sponsorLink.textContent === "Go to Sponsor's Link") {
            sponsorLink.click();
        }
    }, 10000);

    setInterval(function() {
        if (hCaptcha()) {

            if (document.querySelector('input[name="login"][id="login"]')) {
                document.querySelector('input[name="login"][id="login"]').click();}

            if (document.querySelector('button[type="button"]')) {
                document.querySelector('button[type="button"]').click();}

            if (document.querySelector('input[type="submit"]')) {
                document.querySelector('input[type="submit"]').click();}


        }}, 30000);

    setTimeout(function() {
        if (window.location.href === "https://btc.myclaimer.com/" ||
            window.location.href === "https://hatecoin.me/bitcoin/" ||
            window.location.href === "https://cryptofuture.co.in/ripple/" ||
            window.location.href.includes("https://adsbtc.fun/earn/")) {

            if (document.getElementById("address")){
                document.getElementById("address").value = email;

                if (loginButton) {
                    loginButton.click();}}

            if (inputElement) {
                inputElement.value = email;

                if (clmnowElement) {
                    clmnowElement.click();
                }}}

        if (window.location.href.includes("https://cryptofy.vip/reward/free-bitcoin-cash-faucet/") ||
            window.location.href.includes("https://cryptoearn.fun/btcfaucet/")) {
            if (document.getElementById("address")){
                document.getElementById("address").value = bch;}

            if (document.getElementById("address")){
                document.getElementById("address").value = bch;

                if (loginButton) {
                    loginButton.click();}}

            if (inputElement) {
                inputElement.value = bch;

                if (clmnowElement) {
                    clmnowElement.click();
                }}}

        if (window.location.href.includes("https://cryptofy.vip/reward/free-binance-faucet/") ||
            window.location.href.includes("https://cryptoearn.fun/btcfaucet/") ||
            window.location.href.includes(""))
        {
            if (document.getElementById("address")){
                document.getElementById("address").value = bnb;}

            if (document.getElementById("address")){
                document.getElementById("address").value = bnb;

                if (loginButton) {
                    loginButton.click();}}

            if (inputElement) {
                inputElement.value = bnb;

                if (clmnowElement) {
                    clmnowElement.click();
                }}}

        if (window.location.href === "https://bestbitcoinfaucets.net/bitcoin-faucet/" ||
            window.location.href === "https://crypto.mundoby.xyz/btc/" ||
            window.location.href === "https://claimfreesatoshi.online/" ||
            window.location.href === "https://claimfreecoins.io/free-bitcoin/" ||
            window.location.href === "https://faucetswall.com/" ||
            window.location.href === "https://coinhirek.com/free-bitcoin/" ||
            window.location.href === "https://lifefaucet.top/" ||
            window.location.href === "https://claimbits.io/" ||
            window.location.href === "https://cryptofy.vip/reward/free-bitcoin-faucet/" ||
            window.location.href === "https://fautsy.com/" ||
            window.location.href === "https://cryptoearn.fun/btcfaucet/" ||
            window.location.href === "https://cryptofenz.xyz/" ||
            window.location.href === "https://www.healthysamy.xyz/sa/") {

            if (document.getElementById("address")){
                document.getElementById("address").value = btc;

                if (loginButton) {
                    loginButton.click();}}

            if (inputElement) {
                inputElement.value = btc;

                if (clmnowElement) {
                    clmnowElement.click();
                }}}

        if (window.location.href.includes("https://cryptofy.vip/reward/free-dash-faucet/") ||
            window.location.href === "https://cryptoearn.fun/dashfaucet/") {
            if (document.getElementById("address")){
                document.getElementById("address").value = dash;}

            if (document.getElementById("address")){
                document.getElementById("address").value = dash;

                if (loginButton) {
                    loginButton.click();}}

            if (inputElement) {
                inputElement.value = dash;

                if (clmnowElement) {
                    clmnowElement.click();
                }}}

        if (window.location.href.includes("https://crypto.haxina.com/earn/") ||
            window.location.href.includes("https://cryptofy.vip/reward/free-digibyte-faucet/") ||
            window.location.href === "https://cryptoearn.fun/dgbfaucet/") {
            if (document.getElementById("address")){
                document.getElementById("address").value = dgb;}

            if (document.getElementById("address")){
                document.getElementById("address").value = dgb;

                if (loginButton) {
                    loginButton.click();}}

            if (inputElement) {
                inputElement.value = dgb;

                if (clmnowElement) {
                    clmnowElement.click();
                }}}

        if (window.location.href === "https://bestbitcoinfaucets.net/dogecoin-faucet/" ||
            window.location.href.includes("https://treaw.com") ||
            window.location.href.includes("https://cheezo.gq") ||
            window.location.href.includes("https://claimfreecoins.io/dogecoin-faucet/") ||
            window.location.href.includes("https://cryptofy.vip/reward/free-dogecoin-faucet/") ||
            window.location.href.includes("https://xapcom.eu/") ||
            window.location.href.includes("https://vipminer.xyz/") ||
            window.location.href.includes("https://dogetofaucet.xyz/") ||
            window.location.href.includes("http://freecoin.in.ua/") ||
            window.location.href.includes("https://viedoge.ml/") ||
            window.location.href.includes("https://satoshi4u.xyz/") ||
            window.location.href === "https://cryptoearn.fun/dogefaucet/" ||
            window.location.href === "https://bestclaimtrx.xyz/faucetdoge/") {

            if (document.getElementById("address")){
                document.getElementById("address").value = doge;

                if (loginButton) {
                    loginButton.click();}}

            if (inputElement) {
                inputElement.value = doge;

                if (clmnowElement) {
                    clmnowElement.click();
                }}}

        if (window.location.href.includes("https://cryptofy.vip/reward/free-ethereum-faucet/") ||
            window.location.href === "https://cryptoearn.fun/ethfaucet/" ||
            window.location.href === "https://cryptoearn.fun/feyfaucet/") {


            if (document.getElementById("address")){
                document.getElementById("address").value = eth;

                if (loginButton) {
                    loginButton.click();}}

            if (inputElement) {
                inputElement.value = eth;

                if (clmnowElement) {
                    clmnowElement.click();
                }}}

        if (window.location.href.includes("https://kedch.com") ||
            window.location.href.includes("https://ltc.faucetswall.com/") ||
            window.location.href.includes("https://cryptofy.vip/reward/free-litecoin-faucet/") ||
            window.location.href.includes("https://claimcoins.net/") ||
            window.location.href === "https://cryptoearn.fun/ltcfaucet/" ||
            window.location.href.includes("https://crazyblog.in") ||
            window.location.href.includes("https://cashbux.work/faucetltc/") ||
            window.location.href.includes("https://freeltc.xyz")) {

            if (document.getElementById("address")){
                document.getElementById("address").value = ltc;

                if (loginButton) {
                    loginButton.click();}}

            if (inputElement) {
                inputElement.value = ltc;

                if (clmnowElement) {
                    clmnowElement.click();
                }}}

        if (window.location.href.includes("https://cryptofy.vip/reward/free-polygon-faucet/")) {

            if (document.getElementById("address")){
                document.getElementById("address").value = matic;

                if (loginButton) {
                    loginButton.click();}}

            if (inputElement) {
                inputElement.value = matic;

                if (clmnowElement) {
                    clmnowElement.click();
                }}}

        if (window.location.href.includes("https://trx.faucetswall.com/") ||
            window.location.href.includes("https://cryptofy.vip/reward/free-tron-faucet/") ||
            window.location.href.includes("https://emoticonfaucet.com/") ||
            window.location.href.includes("https://faucetnation.in/") ||
            window.location.href.includes("https://lifefaucet.top/") ||
            window.location.href.includes("https://usdtgratis.com/") ||
            window.location.href === "https://cryptoearn.fun/trxfaucet/") {

            if (document.getElementById("address")){
                document.getElementById("address").value = trx;

                if (loginButton) {
                    loginButton.click();}}

            if (inputElement) {
                inputElement.value = trx;

                if (clmnowElement) {
                    clmnowElement.click();
                }}}

        if (window.location.href.includes("https://earnsolana.xyz/sol/") ||
            window.location.href.includes("https://cryptofy.vip/reward/free-solana-faucet/") ||
            window.location.href === "https://cryptoearn.fun/solfaucet/" ||
            window.location.href.includes("https://cashbux.work/solfaucet/")) {

            if (document.getElementById("address")){
                document.getElementById("address").value = sol;

                if (loginButton) {
                    loginButton.click();}}

            if (inputElement) {
                inputElement.value = sol;

                if (clmnowElement) {
                    clmnowElement.click();
                }}}

        if (window.location.href.includes("https://cryptofy.vip/reward/free-ripple-faucet/")) {

            if (document.getElementById("address")){
                document.getElementById("address").value = xrp;

                if (loginButton) {
                    loginButton.click();}}

            if (inputElement) {
                inputElement.value = xrp;

                if (clmnowElement) {
                    clmnowElement.click();
                }}}

        if (window.location.href.includes("https://cryptofy.vip/reward/free-zcash-faucet/") ||
            window.location.href === "https://cryptoearn.fun/zecfaucet/") {

            if (document.getElementById("address")){
                document.getElementById("address").value = zec;

                if (loginButton) {
                    loginButton.click();}}

            if (inputElement) {
                inputElement.value = zec;

                if (clmnowElement) {
                    clmnowElement.click();
                }}}

        setTimeout(function() {
            if (successAlert && successAlert.textContent.includes('satoshi was sent')) {
                location.reload();}}, 5000);

        setTimeout(function() {
            if (dangerAlert && dangerAlert.textContent.includes('You have to wait') ||
                dangerAlert && dangerAlert.textContent.includes('Faucet Safety Limit reached') ||
                dangerAlert && dangerAlert.textContent.includes('Session invalid') ||
                infoAlert.textContent.includes('You have to wait')) {
                window.location.href = nextLink[1];
            }}, 5000);

    }, 5000);

    setInterval(function() {
        if (divElement) {
            divElement.click();}}, 10000);

    if (document.querySelector('.alert-success') || document.querySelector('div.alert.alert-success') || document.querySelector('div.alert.alert-danger.fade.show')) {
        setTimeout(function() {
            const alertText = document.querySelector('.alert-success').textContent;
            const alertText2 = document.querySelector('alert.alert-success').textContent;
            if (alertText.includes(searchText) || alertText2.includes(searchText)) {
                if (loginButton) {
                    loginButton.click();}
            }}, 10000);}

    function checkAndClickClaimButton() {
        const claimButton = document.getElementById("claim");
        if (claimButton && claimButton.innerText === "Continue") {
            claimButton.click();}}

    checkAndClickClaimButton();
    setTimeout(checkAndClickClaimButton, 10000);

    setInterval(function() {location.reload();}, 120000);

})();