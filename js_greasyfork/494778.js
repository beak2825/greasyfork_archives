// ==UserScript==
// @name         GC - Trading Post offer links
// @namespace    https://greasyfork.org/en/users/1278031-crystalflame
// @version      0.1
// @description  Adds links to scroll the window to active offers on TP lots.
// @author       CrystalFlame
// @license      MIT
// @match        https://www.grundos.cafe/island/tradingpost/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494778/GC%20-%20Trading%20Post%20offer%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/494778/GC%20-%20Trading%20Post%20offer%20links.meta.js
// ==/UserScript==

(function() {
    'use strict';


    const lotElements = document.querySelectorAll('.trade-lot');
    lotElements.forEach((lotElement, index) => {
        var lotNumber = lotElement.querySelector('strong').textContent.trim().replace('Lot #', '');
        lotElement.id = `id-${lotNumber}`;

    });

    var links = document.querySelectorAll('.flex.space-between a');
    var lotsLink = document.querySelector('.flex-column.small-gap');

    if(links && links.length > 0) {
        var offerHeader = document.createElement('div');
        offerHeader.textContent = 'Offers on lots:';
        offerHeader.classList.add('center');
        offerHeader.classList.add('bigfont');
        lotsLink.appendChild(offerHeader);

        links.forEach(function (link) {
            var lotId = link.href.match(/(\d+)/)[0];

            var lotLink = document.createElement('a');
            lotLink.href = `#id-${lotId}`;
            lotLink.textContent = `Lot #${lotId} ${link.textContent}`;
            lotLink.classList.add('center');

            lotsLink.appendChild(lotLink);
        });
    }
})();