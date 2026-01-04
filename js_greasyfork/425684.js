// ==UserScript==
// @name         BROKEN Etsy.com - Mute Deceptive Search Result Ads
// @author       snarp
// @version      0.4
// @description  BROKEN: This was written years ago and no longer works. Please uninstall if still using. OLD DESC: Hides the difficult-to-identify ads in Etsy search results.
// @run-at       document-idle
// @include      https://www.etsy.com/*/search?q=*
// @include      https://www.etsy.com/search?q=*
// @grant        none
// @icon         https://www.etsy.com/images/favicon.ico
// @namespace https://greasyfork.org/users/766248
// @downloadURL https://update.greasyfork.org/scripts/425684/BROKEN%20Etsycom%20-%20Mute%20Deceptive%20Search%20Result%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/425684/BROKEN%20Etsycom%20-%20Mute%20Deceptive%20Search%20Result%20Ads.meta.js
// ==/UserScript==

(function() {
    'use strict';


    return; // prevents execution because script no longer works as intended


    // By default, turns ads down to 10% opacity.
    // To entirely remove them, uncomment the `ad.remove();` line.
    function muteItem(item) {
        item.style.opacity = 0.1;
        // item.remove();
    }

    // As of 2021-04-28, all legitimate Etsy search result links contain the
    // CSS class 'organic-impression'.
    function muteAllAds() {
        var listings = document.querySelectorAll('div[data-search-results-region] ul li');
        for (const listing of listings) {
            let link = listing.querySelector('a[data-listing-id]');
            if (!link.classList.contains('organic-impression')) {
                muteItem(listing);
            }
        }
        document.removeEventListener('scroll', muteAllAds, true);
    }

    muteAllAds();

    // And in case it doesn't fire successfully on idle:
    document.addEventListener('scroll', muteAllAds, true);
})();