// ==UserScript==
// @name         TORN: Improved Accessibility
// @namespace    dekleinekobini.improvedaccessibility
// @license      GPL-3
// @version      0.0.2
// @description  Better accessibility on Torn.
// @author       DeKleineKobini [2114440]
// @match        https://www.torn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479953/TORN%3A%20Improved%20Accessibility.user.js
// @updateURL https://update.greasyfork.org/scripts/479953/TORN%3A%20Improved%20Accessibility.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function applyBetterAccessibility() {
        document.querySelectorAll(".torn-birthday #tcLogo .letters div[data-letter]").forEach((letter, index) => {
            const bonus = letter.querySelector(".bonus");

            letter.role = "button";
            letter.tabIndex = 0;
            letter.ariaLabel = `${letter.dataset.letter}: ${bonus.textContent}`;

            letter.parentElement.parentElement.prepend(letter);
        });
    }

    setInterval(applyBetterAccessibility, 1000);
    applyBetterAccessibility();
})();