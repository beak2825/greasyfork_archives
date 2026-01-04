// ==UserScript==
// @name         XHamster - auto-select highest quality stream - TEST
// @version      2.00
// @description  auto-select highest quality stream from https://greasyfork.org/fr/scripts/546708-xhamster-mobile-html5-player/code
// @icon         https://external-content.duckduckgo.com/ip3/fr.xhamster.com.ico
// @author       janvier57
// @namespace    https://greasyfork.org/fr/users/7434-janvier56?sort=updated
// @license MIT
// @match        *://xhamster.com/*
// @match        *://*.xhamster.com/*
// @grant        none
// @run-at       document-end

// @downloadURL https://update.greasyfork.org/scripts/547204/XHamster%20-%20auto-select%20highest%20quality%20stream%20-%20TEST.user.js
// @updateURL https://update.greasyfork.org/scripts/547204/XHamster%20-%20auto-select%20highest%20quality%20stream%20-%20TEST.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function checkAndSelectHighestQuality() {
        const qualitySelector = document.querySelector('.quality.chooser-control');
        if (!qualitySelector) {
            setTimeout(checkAndSelectHighestQuality, 1000);
            return;
        }

        console.log('checkAndSelectHighestQuality');
        const qualityOptions = Array.from(qualitySelector.children);
        console.log('qualityOptions:', qualityOptions);
        if (qualityOptions.length === 0) {
            setTimeout(checkAndSelectHighestQuality, 1000);
            return;
        }

        const hdOptions = qualityOptions.filter(option => option.classList.contains('HD'));
        console.log('hdOptions:', hdOptions);
        const chosenOption = qualitySelector.querySelector('.chosen');
        console.log('chosenOption:', chosenOption);
        if (hdOptions.length > 0 && (!chosenOption || !chosenOption.classList.contains('HD'))) {
            hdOptions.sort((a, b) => parseInt(b.textContent.trim().replace('p', '')) - parseInt(a.textContent.trim().replace('p', '')));
            console.log('Selecting highest quality option:', hdOptions[0]);
            hdOptions[0].click();
        }
    }

    checkAndSelectHighestQuality();
})();
