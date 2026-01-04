// ==UserScript==
// @name         NRKCinemaMode
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Forbedre videoavspillingsopplevelsen på NRK ved å få den til å fylle hele fanen
// @author       H3rl
// @match        https://tv.nrk.no/*/avspiller
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nrk.no
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489257/NRKCinemaMode.user.js
// @updateURL https://update.greasyfork.org/scripts/489257/NRKCinemaMode.meta.js
// ==/UserScript==

(function () {
    'use strict';

    window.onload = function () {
        applyCinemaMode();
    };

    function applyCinemaMode() {
        let episodelist = document.querySelector('#episode-list');

        if (!episodelist) {
            handleLoadFailure();
            return;
        }

        // Patch the episode list
        episodelist.classList.remove('tv-series-season-episode__list--sticky');
        episodelist.style.width = '300px';
        episodelist.style.marginLeft = 'auto';
        episodelist.style.marginRight = 'auto';

        // Apply custom styles
        applyStyles();
    }

    function applyStyles() {
        let style = document.createElement('style');
        style.innerHTML = `
            .tv-series-season-grid {
                display: block !important;
                margin: 5px !important;
            }
            ::-webkit-scrollbar {
                display: none;
            }
        `;

        document.head.appendChild(style);

        let grid = document.querySelector('.tv-series-season-grid');
        if (!grid) {
            handleLoadFailure();
            return;
        }
        grid.style.display = 'block';

        console.log("Success!");
    }

    function handleLoadFailure() {
        console.log("Could not apply patch, trying again!");
        setTimeout(applyCinemaMode, 100);
    }
})();
