// ==UserScript==
// @name         DENEME
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  YouTube reklamlarını otomatik olarak atlar ve ana sayfadaki reklamları gizler.
// @author       Asosyal
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mediaagent.rf.gd
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/477577/DENEME.user.js
// @updateURL https://update.greasyfork.org/scripts/477577/DENEME.meta.js
// ==/UserScript==

// YouTube Reklam Atlatma ve Ana Sayfa Reklam Gizleme Sistemi

setInterval(function(){
    // YouTube reklamlarını atlatma
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

    // Ana sayfadaki reklamları gizleme
    let homePageAds = document.querySelectorAll(".style-scope ytd-video-masthead-ad-v3-renderer"); // "your-homepage-ad-class" kısmını gerçek reklam etiketleriyle değiştirin
    if (homePageAds) {
        homePageAds.forEach(function(ad) {
            ad.style.display = "none";
            console.log("Ana Sayfa Reklamı Kaldırıldı!");
        });
    }
}, 1000);
