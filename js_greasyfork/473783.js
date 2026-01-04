// ==UserScript==
// @name         RYM 5 star ratio
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Displays the ratio of 5 star ratings on an album.
// @author       You
// @match        https://rateyourmusic.com/release/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rateyourmusic.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473783/RYM%205%20star%20ratio.user.js
// @updateURL https://update.greasyfork.org/scripts/473783/RYM%205%20star%20ratio.meta.js
// ==/UserScript==

// ==UserScript==
// @name         RYM 5 star ratio
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Displays the ratio of 5 star ratings on an album.
// @author       You
// @match        https://rateyourmusic.com/release/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rateyourmusic.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473783/RYM%205%20star%20ratio.user.js
// @updateURL https://update.greasyfork.org/scripts/473783/RYM%205%20star%20ratio.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function injectRatio() {
        const numRatingsElement = document.querySelector('.num_ratings');
        const totalRatingsSpan = numRatingsElement?.querySelector('span');
        const chartDiv = document.getElementById('chart_div');
        const tdElements = chartDiv?.querySelectorAll('td');

        if (
            numRatingsElement &&
            totalRatingsSpan &&
            chartDiv &&
            tdElements &&
            tdElements.length > 0 &&
            !numRatingsElement.dataset.injected
        ) {
            const totalRatings = Number(totalRatingsSpan.innerText.replace(/,/g, ''));
            const fiveStarRatings = Number(tdElements[tdElements.length - 1].innerText.replace(/,/g, ''));
            const calculatedValue = fiveStarRatings / totalRatings * 100;

            numRatingsElement.innerHTML += ' (' + calculatedValue.toFixed(2) + '%)';
            numRatingsElement.dataset.injected = 'true'; // Mark as injected
        }
    }

    const observer = new MutationObserver(() => {
        injectRatio();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Initial attempt in case everything is already loaded
    injectRatio();
})();
