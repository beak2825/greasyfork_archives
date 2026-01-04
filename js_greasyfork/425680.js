// ==UserScript==
// @name         Remover ofertas internacionais no Promobit
// @namespace    http://tampermonkey.net/
// @version      0.2.0
// @description  Esconde as ofertas internacionais da lista principal no Promobit
// @author       Sam Rodrigues
// @match        https://www.promobit.com.br/*
// @icon         https://www.promobit.com.br/images/general/icons/root/favicon-32x32.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425680/Remover%20ofertas%20internacionais%20no%20Promobit.user.js
// @updateURL https://update.greasyfork.org/scripts/425680/Remover%20ofertas%20internacionais%20no%20Promobit.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const OFFER_CARDS_SELECTOR = '#offers .pr-tl-card';
    const CARD_TITLE_SELECTOR = '.bottom_title h2 a';

    const wordToTriggerExclude = '[Internacional]';

    // Query all deal cards, iterate over the ones with
    // target title and set display property to none.
    document.querySelectorAll(OFFER_CARDS_SELECTOR)
        .forEach(offer => {
        if (offer.querySelector(CARD_TITLE_SELECTOR)
            && offer.querySelector(CARD_TITLE_SELECTOR)
            .outerText.includes(wordToTriggerExclude)
           ) {
            offer.style.display = 'none';
        }
    });

})();