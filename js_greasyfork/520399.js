// ==UserScript==
// @name         starlavinia-Autoclaim
// @namespace    http://tampermonkey.net/
// @version      1.0.5
// @description  Autoclaim faucet, login manual
// @author       iewilmaestro
// @license      Copyright iewilmaestro
// @match        *://starlavinia.name.tr/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=name.tr
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520399/starlavinia-Autoclaim.user.js
// @updateURL https://update.greasyfork.org/scripts/520399/starlavinia-Autoclaim.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const links = document.querySelectorAll('.dropdown-item');

    // Filter URL yang mengandung path 'faucet'
    const faucetLinks = Array.from(links)
                              .map(link => link.href)
                              .filter(href => href.includes('/faucet/'));

    console.log(faucetLinks)
    function clickkButton() {
        const clickkButton = document.querySelector("[class='btn btn-primary']");
        if (clickkButton && clickkButton.innerText.includes("Claim Now")) {
            clickkButton.click();
        }else{
            console.log("button tidak di temukan")
        }
    }
    let currentIndex = localStorage.getItem('currentIndex') ? parseInt(localStorage.getItem('currentIndex')) : 0;

    const logoutButton = document.querySelector('button[data-toggle="modal"][data-target="#logoutModal"]');
    if (window.location.href === 'https://starlavinia.name.tr/' && logoutButton) {
        window.location.href = faucetLinks[currentIndex];
    }
    const Metod = document.body.outerText.includes("405 Method Not Allowed");
    const Gateway = document.body.outerText.includes("504 Gateway Timeout");
    const noFound = document.body.outerText.includes("404 Page Not Found");
    if(Metod || Gateway || noFound){
         window.location.href = "https://starlavinia.name.tr/";
    }

    function navigateToNextLink() {

        const goClaim = document.querySelector("body > main > div > div > div:nth-child(1) > div > div.media > div > h4 > a");
        const Daily = document.body.outerText.includes('Daily claim limit');
        const Bankrut = document.body.outerText.includes("The faucet does not have");
        const Empty = document.body.outerText.includes("Empty");
        const Invalid = document.body.outerText.includes("Invalid currency provided.");
        if (Daily || Bankrut || Empty || Invalid) {
            console.log('Batas klaim harian tercapai, menghapus URL faucet ini dari array dan melanjutkan ke URL berikutnya');

            // Pindah ke URL faucet berikutnya jika ada
            if (faucetLinks.length > 0) {
                currentIndex = (currentIndex + 1) % faucetLinks.length;  // Naikkan currentIndex
                localStorage.setItem('currentIndex', currentIndex);  // Simpan currentIndex ke localStorage

                window.location.href = faucetLinks[currentIndex];
            }
            return; // Jangan lanjutkan lebih jauh jika faucet ini sudah diblokir
        }
        if(goClaim){
            window.location.href = faucetLinks[currentIndex];
        }
        const turnstile = document.querySelector('input[name="cf-turnstile-response"]')?.value;
        if (!turnstile || turnstile.length === "") {
            console.log('Captcha belum diselesaikan. Tunggu...');
            return; // Tunggu tanpa reload halaman
        }
        console.log('Captcha diselesaikan');
        clickkButton();
    }
    setInterval(navigateToNextLink, 6000);
})();