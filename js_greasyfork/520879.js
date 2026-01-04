// ==UserScript==
// @name         Altcrypt - Autoclaim Faucet
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Autoclaim faucet Login Manual
// @author       iewilmaestro
// @license      Copyright iewilmaestro
// @match        *://altcryp.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=altcryp.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520879/Altcrypt%20-%20Autoclaim%20Faucet.user.js
// @updateURL https://update.greasyfork.org/scripts/520879/Altcrypt%20-%20Autoclaim%20Faucet.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const faucetLinks = Array.from(document.querySelectorAll('#faucet a'))
    .map(link => link.href)
    .filter(url => url.includes('faucet'));
    console.log(faucetLinks);

    var sudahKlik = "";
    var direct = "";
    var firewallKlik = "";

    if (faucetLinks.length > 0) {
        let currentIndex = localStorage.getItem('currentIndex') ? parseInt(localStorage.getItem('currentIndex')) : 0;
        function navigateToNextLink() {
            if (document.location.pathname.includes('firewall')) {
                if(faucetLinks[currentIndex] == firewallKlik){
                    console.log("Klik firewall sudah di unlcok");
                    return;
                }
                const turnstile = document.querySelector('input[name="cf-turnstile-response"]')?.value;
                if (!turnstile || turnstile.trim() === "") {
                    return;
                }

                const unlockButton = document.querySelector('button.btn.btn-primary.w-md');
                if (unlockButton && unlockButton.innerText.includes('Unlock')) {
                    firewallKlik = faucetLinks[currentIndex];
                    sudahKlik = "";
                    direct = "";
                    unlockButton.click();
                }
            }
            firewallKlik = "";

            if (document.querySelector('#continueBtn')) {
                window.location.href = faucetLinks[currentIndex];
            }
            const Daily = document.body.outerText.includes('Daily claim limit');
            const Bankrut = document.body.outerText.includes("The faucet does not have");
            const Please = document.body.outerText.includes("Please wait");
            const Sukses = document.body.outerText.includes("Good job!");
            const Error = document.body.outerText.includes("Error!");
            const GoClaim = document.body.outerText.includes("Go Claim");

            if(window.location.href == direct){
                console.log("Page sama dengan direct");
                return;
            }
            if (Daily || Bankrut || Please || Sukses || Error || GoClaim) {
                console.log("status ok");
                if (faucetLinks.length > 0) {
                    direct = faucetLinks[currentIndex];
                    currentIndex = (currentIndex + 1) % faucetLinks.length;
                    localStorage.setItem('currentIndex', currentIndex);
                    sudahKlik = "";
                    window.location.href = faucetLinks[currentIndex];
                }
                return;
            }
            direct = "";
            if(window.location.href == sudahKlik){
                console.log("Page sudah di klik claim");
                return;
            }
            const turnstile = document.querySelector('input[name="cf-turnstile-response"]')?.value;
            if (!turnstile || turnstile.length === "") {
                return;
            }
            const claimButton = document.querySelector('#subbutt');
            if (claimButton && claimButton.innerText.includes('Claim Now')) {
                claimButton.click();
                sudahKlik = faucetLinks[currentIndex];
            }
        }
        setInterval(navigateToNextLink,5000);
    }
})();