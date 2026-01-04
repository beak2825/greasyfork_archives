// ==UserScript==
// @name         coinmedia
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Autoclaim, login manual
// @author       iewilmaestro
// @license      Copyright iewilmaestro
// @match        *://coinmedia.in/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=coinmedia.in
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519515/coinmedia.user.js
// @updateURL https://update.greasyfork.org/scripts/519515/coinmedia.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let faucetLinks = [
        "https://coinmedia.in/auto/currency/ltc",
        "https://coinmedia.in/auto/currency/bnb",
        "https://coinmedia.in/auto/currency/bch",
        "https://coinmedia.in/auto/currency/dash",
        "https://coinmedia.in/auto/currency/doge",
        "https://coinmedia.in/auto/currency/dgb",
        "https://coinmedia.in/auto/currency/eth",
        "https://coinmedia.in/auto/currency/fey",
        "https://coinmedia.in/auto/currency/trx",
        "https://coinmedia.in/auto/currency/usdt",
        "https://coinmedia.in/auto/currency/sol",
        "https://coinmedia.in/auto/currency/xrp",
        "https://coinmedia.in/auto/currency/xlm",
        "https://coinmedia.in/auto/currency/ada",
        "https://coinmedia.in/auto/currency/usdc",
        "https://coinmedia.in/auto/currency/zec",
        "https://coinmedia.in/auto/currency/xmr"
    ];

    if (faucetLinks.length > 0) {
        let currentIndex = localStorage.getItem('currentIndex') ? parseInt(localStorage.getItem('currentIndex')) : 0;
        console.log(currentIndex)

        function navigateToNextLink() {
            checkForFirewall();

            let Bankrut = false;
            let invalid_amount = false;
            const swalContents = document.querySelectorAll('.swal2-html-container');
            if (swalContents.length > 0) {
                const swalText = swalContents[0].innerText.toLowerCase();
                Bankrut = swalText.includes("the faucet does not have");
                invalid_amount = swalText.includes("you are sending an invalid amount");
            }else {
                console.log("Swal content not found.");
            }
            if (Bankrut || invalid_amount) {
                const urlsToRemove = faucetLinks[currentIndex];
                faucetLinks = faucetLinks.filter(url => !urlsToRemove.includes(url));

                currentIndex = (currentIndex + 1) % faucetLinks.length;
                localStorage.setItem('currentIndex', currentIndex);
                window.location.href = faucetLinks[currentIndex];
            }
            if(document.location.pathname.includes('dashboard')){
                window.location.href = faucetLinks[currentIndex];
            }else if (window.location.href.startsWith("https://coinmedia.in/auto/currency/")) {
                console.log("On faucet claim page, reloading in 30 seconds...");
                setTimeout(() => {
                    location.reload();
                }, 30000);
            }
        }
        function checkForFirewall(){
            if (document.location.pathname.includes('firewall')) {
                const turnstile = document.querySelector('input[name="cf-turnstile-response"]')?.value;
                if (!turnstile || turnstile.trim() === "") {
                    console.log('Captcha firewall belum diselesaikan. Tunggu...');
                    return; // Tunggu tanpa reload halaman jika keduanya belum diisi
                }
                clickUnlockButton();
            }
        }
        function clickUnlockButton() {
            const unlockButton = document.querySelector("button[type='submit']");
            if (unlockButton && unlockButton.innerText.includes("Unlock")) {
                unlockButton.click();
                console.log("Unlock button clicked.");
            }
        }
        setInterval(navigateToNextLink, 3000);
    }
})();
