// ==UserScript==
// @name           Ebay-Kleinanzeigen Ad Blocker
// @name:de        Ebay-Kleinanzeigen Ad Blocker
// @namespace      http://tampermonkey.net/
// @version        1.0
// @description    Removes (sponsodered) ads from the ebay-kleinanzeigen results.
// @description:de Entfernt (gesponsorte) Anzeigen aus den Ergebnissen von Ebay-Kleinanzeigen.
// @author         Michael Weigand (Original from Max Zuidberg)
// @match          *://*.kleinanzeigen.de/*
// @license        AGPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/490168/Ebay-Kleinanzeigen%20Ad%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/490168/Ebay-Kleinanzeigen%20Ad%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // j-liberty-wrapper are the two ads at the top,
    // ad-listitem without any other suffix are the ads mixed within the results
    var ads = document.querySelectorAll('[class="ad-listitem"],[class="j-liberty-wrapper "]')
    ads.forEach((ad) => {
        ad.style.display = "none"
    })
    // Your code here...
})();