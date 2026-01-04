// ==UserScript==
// @name         bnbcity.org : Auto Claim Cloud Mining (SCAM)
// @namespace    bnbcity.auto.claim
// @version      1.5
// @description  https://ouo.io/IypPWK7
// @author       stealtosvra
// @match        https://bnbcity.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bnbcity.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/461921/bnbcityorg%20%3A%20Auto%20Claim%20Cloud%20Mining%20%28SCAM%29.user.js
// @updateURL https://update.greasyfork.org/scripts/461921/bnbcityorg%20%3A%20Auto%20Claim%20Cloud%20Mining%20%28SCAM%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const miningBalance = document.getElementById('mining_balance');
    const wBalance = "0.00000800";
    const balanceInterval = setInterval(checkBalance, 10000);
    const iframe = document.createElement('iframe');
    const urls = ['https://ouo.io/kYuHt6', 'https://link1s.com/h6UUOs'];
    const randomIndex = Math.floor(Math.random() * urls.length);
    const randomUrl = urls[randomIndex];

    iframe.src = '//ad.a-ads.com/2205358?size=728x90';
    iframe.width = 728;
    iframe.height = 90;
    iframe.style.border = '0px';
    iframe.style.padding = '0';
    iframe.style.overflow = 'hidden';
    iframe.style.backgroundColor = 'transparent';
    iframe.style.position = 'fixed';
    iframe.style.left = '40%';
    iframe.style.bottom = '0';

    document.body.appendChild(iframe);

    function reloadPage() {window.location.href = randomUrl;}setTimeout(reloadPage, 150000);
    function hCaptcha() {return grecaptcha && grecaptcha.getResponse().length !== 0;}
    function checkBalance() {console.log(`Checking balance. Current value: ${miningBalance.innerText}`);

    if (miningBalance.innerText === `${wBalance}`) {document.querySelector('button.theme-btn').click();console.log('Balance has reached 0.00000800. Clicked the button.');clearInterval(balanceInterval);checkLowBalance();}}

    function checkLowBalance() {console.log(`Checking balance for low value. Current value: ${miningBalance.innerText}`);

    if (parseFloat(miningBalance.innerText) < `${wBalance}`) {console.log('Balance is less than 0.00000800.');checkBalance();setInterval(checkLowBalance, 5000);}}
    if (parseFloat(miningBalance.innerText) < `${wBalance}`) {checkBalance();}

    setInterval(function() {try {if (hCaptcha()) {location.reload();}} catch (error) {console.log(' ');}}, 6000);
    setInterval(function() {location.reload();}, 5 * 60 * 1000);


})();

