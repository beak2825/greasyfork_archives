// ==UserScript==
// @name         OK NRK
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Bort med sport og «prænk»!
// @author       Prikkprikkprikk
// @license      MIT
// @match        https://www.nrk.no/
// @icon         https://www.google.com/s2/favicons?domain=nrk.no
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446334/OK%20NRK.user.js
// @updateURL https://update.greasyfork.org/scripts/446334/OK%20NRK.meta.js
// ==/UserScript==

(function() {

    'use strict';

    // Selectors to match contents of "kur-room" divs
    [
        '[href*="sport"]',
        '[heading*="prænk"]',
    ]
    .forEach(selector => {
        document.querySelectorAll(selector).forEach(annoyance => {
            annoyance.closest('[class*="kur-room"]')?.remove();
        });
    });

    // Title contents to match titles of "apartments"
    const apartmentFilters = [
        // 'ol i beijing',
    ];

    if( !apartmentFilters.length ) return;

    document.querySelectorAll('.kur-floor--apartment').forEach(apartment => {
        const apartmentTitle = apartment.querySelector('div h2')
        apartmentFilters.forEach( filter => {
            if( apartmentTitle.textContent.toLowerCase().includes(filter)) {
                apartment.remove();
            }
        });
    });


})();