// ==UserScript==
// @name         Better Property
// @namespace    https://github.com/ChenglongMa/tampermonkey-scripts
// @version      1.0.0
// @description  Sort property sections on property pages
// @author       Chenglong Ma
// @match        *://*.property.com.au/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=property.com.au
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/530592/Better%20Property.user.js
// @updateURL https://update.greasyfork.org/scripts/530592/Better%20Property.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function sortSections() {
        const container = document.querySelector('div[class*="PropertyPageMainContent"]');
        if (!container) return;

        const sections = [
            'Property timeline',
            'Property features',
            'Property value',
            'Government planning overlays & zones'
        ];

        const sectionElements = sections.map(label => {
            return container.querySelector(`section[aria-label="${label}"]`);
        }).filter(el => el);

        sectionElements.forEach(section => {
            container.prepend(section);
        });

        // Hide the div with data-testid="government-data-partner-banner"
        const governmentBanner = document.querySelector('div[data-testid="government-data-partner-banner"]');
        if (governmentBanner) {
            governmentBanner.style.display = 'none';
        }

        // Hide divs with class matching AdvertisementBrick*
        const advertisementBricks = document.querySelectorAll('div[class*="AdvertisementBrick"]');
        advertisementBricks.forEach(ad => {
            ad.style.display = 'none';
        });
    }

    // Run the function after the page loads
    sortSections();
})();