// ==UserScript==
// @name         wheelofgold - Autoclaim Faucet
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Autoclaim faucet, login manual
// @author       iewilmaestro
// @license      Copyright iewilmaestro
// @match        *://wheelofgold.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wheelofgold.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520881/wheelofgold%20-%20Autoclaim%20Faucet.user.js
// @updateURL https://update.greasyfork.org/scripts/520881/wheelofgold%20-%20Autoclaim%20Faucet.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const link = "https://wheelofgold.com/faucet/currency/usdt";

    if (document.location.pathname.includes('dashboard')) {
        window.location.href = link;
    }
    let cekAntibotlinks = 0;

    setInterval(function(){
        const secondElement = document.getElementById('second');
        if (secondElement) {
            return;
        }
        const turnstile = document.querySelector('input[name="cf-turnstile-response"]')?.value;
        const antibotlinks = document.querySelector('input[name="antibotlinks"]')?.value;

        if (!turnstile || !antibotlinks || turnstile.length === "" || antibotlinks.length < 12) {
            cekAntibotlinks += 1;
            if(cekAntibotlinks > 10){
                window.location.href = link;
            }

            console.log('Captcha belum diselesaikan. Tunggu...');
            return; // Tunggu tanpa reload halaman
        }
        cekAntibotlinks = 0;

        const claimButton = document.querySelector('#subbutt');

        if (claimButton && claimButton.innerText.includes('Claim Now')) {
            console.log('Captcha selesai, mengklik tombol Claim Now');
            claimButton.click(); // Klik tombol Claim Now
        } else {
            console.log('Tombol Claim Now tidak ditemukan');
        }
    },5000);
})();
