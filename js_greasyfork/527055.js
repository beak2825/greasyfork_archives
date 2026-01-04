// ==UserScript==
// @name         Remove Brainscape Blur
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Automatically removes the blur overlay on Brainscape flashcards.
// @author       EaterComputer
// @match        https://www.brainscape.com/flashcards/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=brainscape.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527055/Remove%20Brainscape%20Blur.user.js
// @updateURL https://update.greasyfork.org/scripts/527055/Remove%20Brainscape%20Blur.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeBlur() {
        document.querySelectorAll('.primary-ctas.flashcard-blurred-overlay').forEach(el => el.remove());
        document.querySelectorAll('.blurred-answer-study-cta.tertiary.primary-cta.rect-button.subscribe-link.register-link.nav-link')
            .forEach(el => el.remove());

    }

    // Run on page load
    removeBlur();

    // Observe for dynamically added elements
    const observer = new MutationObserver(removeBlur);
    observer.observe(document.body, { childList: true, subtree: true });
})();