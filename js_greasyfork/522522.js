// ==UserScript==
// @name         Remove Mobalytics Anti-Adblock
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Remove anti-adblock pop-ups and banners on Mobalytics.
// @author       Anonymous
// @match        https://mobalytics.gg/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/522522/Remove%20Mobalytics%20Anti-Adblock.user.js
// @updateURL https://update.greasyfork.org/scripts/522522/Remove%20Mobalytics%20Anti-Adblock.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeAds() {
        const divs = document.querySelectorAll('div');
        if (divs.length > 0) {
            divs.forEach(div => {
                const adSpan = div.querySelector('span');
                const removeAdsText = div.querySelector('div');

                if (
                    adSpan && adSpan.textContent.trim() === 'Advertisement' &&
                    removeAdsText && removeAdsText.textContent.includes('Remove Ads')
                ) {
                    div.remove();
                }
            });
        }
    }

    window.addEventListener('load', () => {
        removeAds();
        const observer = new MutationObserver(removeAds);
        observer.observe(document.body, { childList: true, subtree: true });
    });
})();
