// ==UserScript==
// @name         Kleinanzeigen VB-Filter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Blendet alle Anzeigen aus, die nur "VB" als Preis haben
// @author       Elin
// @match        https://www.kleinanzeigen.de/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/540441/Kleinanzeigen%20VB-Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/540441/Kleinanzeigen%20VB-Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function filterVBAds() {
        const ads = document.querySelectorAll('li.ad-listitem');

        ads.forEach(ad => {
            const priceEl = ad.querySelector('.aditem-main--middle--price-shipping--price');
            if (priceEl && priceEl.innerText.trim() === 'VB') {
                ad.style.display = 'none';
            }
        });
    }

    // Initialer Aufruf
    filterVBAds();

    // Beobachte DOM-Änderungen für dynamisches Nachladen (z. B. bei Scrollen)
    const observer = new MutationObserver(() => filterVBAds());
    observer.observe(document.body, { childList: true, subtree: true });
})();
