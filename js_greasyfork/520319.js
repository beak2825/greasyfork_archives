// ==UserScript==
// @name         Remove YouTube End Cards
// @namespace    https://tampermonkey.net/
// @version      1.1
// @description  Removes YouTube end cards from videos automatically.
// @author       wasivis
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520319/Remove%20YouTube%20End%20Cards.user.js
// @updateURL https://update.greasyfork.org/scripts/520319/Remove%20YouTube%20End%20Cards.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const END_CARD_SELECTOR = '.ytp-ce-element';

    function removeEndCards() {
        const endCards = document.querySelectorAll(END_CARD_SELECTOR);
        endCards.forEach(card => card.remove());
    }

    const observer = new MutationObserver(() => {
        removeEndCards();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    removeEndCards();
})();