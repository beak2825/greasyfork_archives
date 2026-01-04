// ==UserScript==
// @name         claimcoin
// @namespace    https://violentmonkey.github.io
// @version      1.2
// @description  claimcoin autoclaim faucet & madfaucet
// @author       info1944
// @license      MIT
// @match        *://claimcoin.in/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=claimcoin.in
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530879/claimcoin.user.js
// @updateURL https://update.greasyfork.org/scripts/530879/claimcoin.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(function(){
        const recaptchav3 = document.querySelector('input[name="recaptchav3"]')?.value;
        if (!recaptchav3 || recaptchav3.trim() === "") {
            console.log('Captcha belum diselesaikan. Tunggu...');
            return; // Tunggu tanpa reload halaman jika keduanya belum diisi
        }
        setTimeout(() => {

            const claimButton = document.querySelector("#layout-wrapper > div.main-content > div > div > div:nth-child(4) > div.col-12.col-md-8.col-lg-6.order-md-2.mb-4.text-center > form > button");
            if(claimButton && claimButton.innerText.includes('Collect your reward')){
                claimButton.click();
            }
        },6000);
    }, 3000);
})();
