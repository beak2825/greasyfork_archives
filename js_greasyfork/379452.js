// ==UserScript==
// @name         Pinterest no ads
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  remove promoted pins
// @author       Darmikon
// @include     https://www.pinterest.ca/*
// @include     https://www.pinterest.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/379452/Pinterest%20no%20ads.user.js
// @updateURL https://update.greasyfork.org/scripts/379452/Pinterest%20no%20ads.meta.js
// ==/UserScript==



const trimAds = () => {
    const ads = document.querySelectorAll("[data-test-id*='oneTapPromotedPin']");
    ads.forEach(feed => {
       feed.parentNode.style.display = "none";
    });
}

(function() {
    setTimeout(trimAds, 500);

    window.addEventListener('scroll', () => {
        setTimeout(trimAds, 500);
    });
})();

