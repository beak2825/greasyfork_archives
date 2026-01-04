// ==UserScript==
// @name         Now.gg Ads Remover
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Automatically removes specific elements and ads if the website has a specific logo image.
// @author       UniverseDev
// @license      GPL-3.0-or-later
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?domain=https://now.gg/&sz=256
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520344/Nowgg%20Ads%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/520344/Nowgg%20Ads%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const elementSelector = 'div.sc-19c21da7-0.dgAMyI';
    const adContainerSelector = 'div#div-ad-app-page-leaderboard-container';

    function removeElements() {
        document.querySelectorAll(elementSelector).forEach(el => el.remove());
        const adContainer = document.querySelector(adContainerSelector);
        if (adContainer) adContainer.remove();
    }

    function checkForLogoAndRun() {
        const logoImg = document.querySelector('img#ng-logo.ngg-logo');
        if (logoImg && logoImg.src.includes("nowgg-logo.2eda3eaf.svg")) {
            removeElements();
        }
    }

    window.addEventListener('load', checkForLogoAndRun);
})();
