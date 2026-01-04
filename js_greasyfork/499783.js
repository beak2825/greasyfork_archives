// ==UserScript==
// @name         AniChart no sequels
// @namespace    http://tampermonkey.net/
// @version      2024-07-05
// @description  Hides sequels from AniChart, kinda messes with AniChart's sorting.
// @author       YouSomeone
// @match        https://anichart.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=anichart.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/499783/AniChart%20no%20sequels.user.js
// @updateURL https://update.greasyfork.org/scripts/499783/AniChart%20no%20sequels.meta.js
// ==/UserScript==


(function() {
    'use strict';

(new MutationObserver(check)).observe(document, {childList: true, subtree: true});

let i = 0;

function check(changes, observer) {
    let mediaCards = document.querySelectorAll('div.media-card');

    if(mediaCards) {
        mediaCards.forEach(card => {
            const source = card.querySelector('.source');
            if (source && source.textContent.toLowerCase().includes('sequel')) {
                card.remove();
            }
        });
    }
}
})();