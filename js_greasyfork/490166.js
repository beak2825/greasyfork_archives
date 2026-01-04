// ==UserScript==
// @name           Mobile.de Sponsored Blocker
// @name:de        Mobile.de Sponsored Blocker
// @namespace      http://tampermonkey.net/
// @version        1.0
// @description    Removes (sponsodered) ads from the Mobile.de results.
// @description:de Entfernt (gesponsorte) Anzeigen aus den Ergebnissen von Mobile.de.
// @author         Michael Weigand
// @match          *://*.mobile.de/*
// @license        AGPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/490166/Mobilede%20Sponsored%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/490166/Mobilede%20Sponsored%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // j-liberty-wrapper are the two ads at the top,
    // ad-listitem without any other suffix are the ads mixed within the results
    var ads = document.querySelectorAll('[data-testid="page-1-listings"],[data-testid="sponsored-badge"]')
    ads.forEach((ad) => {
        ad.style.display = "none"
    })
    // Your code here...
})();