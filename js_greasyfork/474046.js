// ==UserScript==
// @name         Faucet Website Rotator
// @version      0.0.4
// @description  Automatically views all Faucets and Rotate websites, custom timeout per faucet
// @author       hexemeister
// @include /^(https?:\/\/)(.+)?(888satoshis|accessonto|bazadecrypto|bifaucet|bitcoinpayu|bitcointrophy|bdfaucet|bitefaucet|btcad24|btcbunch|claimprocoin|claimro|claimtrx|claimvip|clixhog|coin-4u|coingax|coinmb|coinpayu24|coinpayufree|coinsnopy|criptoshark|cryptospaying|dinofaucet|earnviv|faucet-satoushi|faucet4u|faucetbazzar|faucetcryptos|faucetinstant|faucetltc|faucetspeedbtc|faucetoshi|freebitcoingroup|furyfaucet|ganarbitcoindesdecuba|ignite-blockchain|james-trussy|kiddyearner|landofbits|litecoinline|lolfaucet|ltc24|miner-sim|mixfaucet|nobitafc|pinoyfaucet|ptc4btc|ptcbits|satoshiadview|takeclicks|teethblock|tikiearn|titansbrand|tron-free|usdtsurf|vivofaucet|viefaucet|wincrypt2|yfaucet|ziifaucet|btcbunch)(\.com)(\/.*)/
// @include /^(https?:\/\/)(.+)?(bitsfree|claimtoro|coinoto|cryptoflare|cryptojunkie|faucetclub|faucetcrypto|multicoins|spaceshooter)(\.net)(\/.*)/
// @include /^(https?:\/\/)(.+)?(autolitecoin||claimercorner|claimsatoshi|coinpayz|cryptask|flashfaucet|paidbucks|satoshi-win)(\.xyz)(\/.*)/
// @include /^(https?:\/\/)(.+)?(coinfaucet|feyorra|forexfiter|freebinance|freebitcoin|freesolana|freetron|earnads)(\.top)(\/.*)/
// @include /^(https?:\/\/)(.+)?(coinpot|cryptomaker|gpflix)(\.in)(\/.*)/
// @include /^(https?:\/\/)(.+)?(crypto-farms|crypto143|etcoin)(\.site)(\/.*)/
// @include /^(https?:\/\/)(.+)?(buxcoin|starcrypto)(\.io)(\/.*)/
// @include /^(https?:\/\/)(.+)?(hatecoin|hatecoin)(\.me)(\/.*)/
// @include /^(https?:\/\/)(.+)?(bitfaucet|earnbtc)(\.pw)(\/.*)/
// @include /^(https?:\/\/)(.+)?(cryptobigpay|faucettr)(\.online)(\/.*)/
// @include /^(https?:\/\/)(.+)?(earncrypto|faucetcaptcha)(\.co.in(\/.*)/
// @match        https://bithub.win/*
// @match        https://bits.re/*
// @match        https://btcbunch.com/*
// @match        https://claimcash.cc/*
// @match        https://contentos.one/*
// @match        https://cryptoaffiliates.store/*
// @match        https://cryptoukr.in.ua/*
// @match        https://earnmoney.24payu.net/*
// @match        https://earnsolana.xyz/
// @match        https://earnsolana.xyz/login
// @match        https://earnsolana.xyz/dashboard
// @match        https://earnsolana.xyz/ptc
// @match        https://earnsolana.xyz/ptc/*
// @match        https://earnsolana.xyz/faucet
// @match        https://ezimg.co/*
// @match        https://faucet.pk/*
// @match        https://flycrypto.tn/*
// @match        https://freeshib.biz/*
// @match        https://goldsurferfaucet.de/*
// @match        https://myfaucet.pro/*
// @match        https://shiba.arbweb.info/*
// @match        https://xfaucet.org/*
// @match        https://xtrabits.click/*
// @match        https://earnbtc.pw*
// @icon         https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/800px-Bitcoin.svg.png
// @grant        GM_xmlhttpRequest
// @grant        GM.setValue
// @grant        GM.getValue
// @license      MIT
// @namespace    VengeanceXBT
// @downloadURL https://update.greasyfork.org/scripts/474046/Faucet%20Website%20Rotator.user.js
// @updateURL https://update.greasyfork.org/scripts/474046/Faucet%20Website%20Rotator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const website = window.location.hostname;
    const domainParts = website.split(".");
    const tld = domainParts.pop();
    const domain = domainParts.pop();
    const key = `${domain}.${tld}`.replace(/^www\./, "");
    const currentUrl = window.location.href;
    const targetUrl = `https://${key}`;
    const linkElement = document.querySelector('a[target="_blank"].btn.btn-primary.waves-effect.waves-light');
    const anchorElement = document.querySelector('a[target="_blank"].btn.btn-success.waves-effect.waves-light');
    const emailField = document.querySelector("#email");
    const passwordField = document.querySelector("#password");
    const submitButton = document.querySelector("button[type='submit'].claim-button") ?? document.querySelector("button[type='submit']");
    const selectElement = document.querySelector('.form-control');
    const countdown = document.getElementById("ptcCountdown");
    const iframe = document.createElement('iframe');

    const websites = [
        //  default timeout is 30secs
        {url: "https://accessonto.com/", user: "", pw: "", timeout: 60},
        {url: "https://earnbtc.pw/", user: "", pw: "", timeout: 60},
        {url: "https://nobitafc.com/", user: "", pw: "", timeout: 60},
        {url: "https://hatecoin.me/", user: "", pw: "", timeout: 60},
        // include next ones
        ];

    const convertSecToMili = (sec) => sec * 1000;
    const email = websites.find(site => site.url.includes(website)).user;
    const password = websites.find(site => site.url.includes(website)).pw;
    const defaultTimeoutInSec = 30000;
    const timeout = websites.find(site => site.url.includes(website)).hasOwnProperty("timeout") ? convertSecToMili(websites.find(site => site.url.includes(website)).timeout) : convertSecToMili(defaultTimeoutInSec);
    const nextLink = websites.findIndex(site => site.url.includes(website)) + 1 < websites.length ? websites[websites.findIndex(site => site.url.includes(website))+1].url : websites[0].url;

    function hCaptcha() {return grecaptcha && grecaptcha.getResponse().length !== 0;}

  //  if(window.location.href === `https://${key}/links`) {setTimeout(function() {if (linkElement) {linkElement.click();}if (anchorElement) {anchorElement.click();}}, 1000);}
    if(currentUrl === targetUrl + '/' || currentUrl === targetUrl + '/web' || currentUrl === targetUrl) {window.location.replace(targetUrl + '/login');} else if (currentUrl.includes(targetUrl + '/dashboard')) {window.location.replace(targetUrl + '/faucet');}
    if(emailField) {emailField.value = email;}
    if(passwordField) {passwordField.value = password;}
       
    if(nextLink) {let redirectTimer = setTimeout(() => {window.location.href = nextLink;}, timeout);window.addEventListener('beforeunload', () => {clearTimeout(redirectTimer);});}

    setInterval(() => {if (hCaptcha() && submitButton) {submitButton.click();}}, 6000);
    //observer.observe(document.body, { attributes: true, childList: true, subtree: true });

})();