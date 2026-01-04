// ==UserScript==
// @name         freebnbco.in : Auto Faucet
// @namespace    free.bnb.co.in.auto.faucet
// @version      1.4
// @description  https://freebnbco.in/en/ref/1675300837
// @author       stealtosvra
// @match        https://freebnbco.in/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=freebnbco.in
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/461250/freebnbcoin%20%3A%20Auto%20Faucet.user.js
// @updateURL https://update.greasyfork.org/scripts/461250/freebnbcoin%20%3A%20Auto%20Faucet.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // INSERT YOUR BNB ADDRESS
    const bnbaddr = "0xDD9cb7e222Bdd926E8d8aB1E8574e6A584c0F122";

    const link = document.querySelector('a[href="https://freebnbco.in/en/panel/faucet"]');
    const submitButton = document.querySelector("button[type='submit']");
    const countText = document.querySelector('#countText');
    const addressInput = document.getElementById("bsc_addressInput");
    const urlsbig = ['https://ouo.io/EI5LES','https://link1s.com/E6xdggFV','https://ex-foary.com/teihQKRK','http://nx.chainfo.xyz/bawo','https://try2link.com/cTFPxLK','https://loptelink.com/UcY6HE7','https://wplink.online/6voK7','https://sox.link/LKGBv4ix','http://link1s.net/ZbamFa55','https://moneylink.tk/DFdFwvA'];
    const urlsmini = ['https://ouo.io/72ybUlA','https://link1s.com/DAv5g','https://ex-foary.com/DA1xS6','http://nx.chainfo.xyz/bawo','https://try2link.com/OsMecXZD','https://loptelink.com/ml0npN','https://wplink.online/0v9Gb','https://sox.link/Hmrr4MF','http://link1s.net/VIAKu','https://moneylink.tk/yEawnyPP'];

    function hCaptcha() {return grecaptcha && grecaptcha.getResponse().length !== 0;}

    if (window.location.href === "https://freebnbco.in/en") {addressInput.value = bnbaddr;setTimeout(function() {document.querySelector('button.btn.btn-primary').click();}, 3000);setInterval(function() {if (hCaptcha()) { document.querySelector('button[type="submit"]').click();}}, 3000);}
    if (window.location.href === "https://freebnbco.in/en/panel") {link.click();}
    if (window.location.href === "https://freebnbco.in/en/panel/faucet" || "https://freebnbco.in/en/panel/minifaucet") {setInterval(function() {if (hCaptcha()) {submitButton.dispatchEvent(new MouseEvent('click', {view: window,bubbles: true,cancelable: true}));}}, 3000);if (countText && countText.innerText === '0:01 second left') {location.reload();}}

    const randomIndexBig = Math.floor(Math.random() * urlsbig.length);
    const randomIndexMini = Math.floor(Math.random() * urlsmini.length);
    const randomUrlbig = urlsbig[randomIndex];
    const randomUrlmini = urlsmini[randomIndex];

    if (window.location.href === "https://freebnbco.in/en/panel/faucet") {function reloadPagebig() {window.location.href = randomUrlbig;}setTimeout(reloadPagebig, 300000);}
    if (window.location.href === "https://freebnbco.in/en/panel/minifaucet") {function reloadPagemini() {window.location.href = randomUrlmini;}setTimeout(reloadPagemini, 300000);}

})();