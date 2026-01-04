// ==UserScript==
// @name         Ukryj wyróżnione ogłoszenia OLX
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Ukrywa wyróżnione ogłoszenia na stronie OLX
// @author       OpenAI
// @match        https://www.olx.pl/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/471451/Ukryj%20wyr%C3%B3%C5%BCnione%20og%C5%82oszenia%20OLX.user.js
// @updateURL https://update.greasyfork.org/scripts/471451/Ukryj%20wyr%C3%B3%C5%BCnione%20og%C5%82oszenia%20OLX.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let observer = new MutationObserver(hideFeaturedAds);
    observer.observe(document.body, {childList: true, subtree: true});

    function hideFeaturedAds() {
        let ads = document.querySelectorAll('div[data-cy="l-card"]');
        for (let ad of ads) {
            let featuredLabel = Array.from(ad.querySelectorAll('div'))
                .find(div => div.textContent.trim() === "Wyróżnione");

            if (featuredLabel) {
                ad.style.display = 'none';
            }
        }
    }

    hideFeaturedAds();

})();
