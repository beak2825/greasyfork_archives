// ==UserScript==
// @name         YouTube DENEME
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  YouTube reklamlarını otomatik olarak atlar.
// @author       Asosyal
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=omerbozdi.com.tr
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/477576/YouTube%20DENEME.user.js
// @updateURL https://update.greasyfork.org/scripts/477576/YouTube%20DENEME.meta.js
// ==/UserScript==

// YouTube Reklam Atlatma Sistemi

setInterval(function(){
    let adOverlay = document.querySelector(".ytp-ad-overlay-close-button");
    if (adOverlay) {
        adOverlay.click();
        console.log("Reklam Afişi Gizlendi!");
    }

    let skipButton = document.querySelector(".ytp-ad-skip-button-container");
    if (skipButton) {
        skipButton.click();
        console.log("Reklam Atlandı!");
    }
}, 1000);
