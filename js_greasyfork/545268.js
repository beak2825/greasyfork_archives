// ==UserScript==
// @name        save your 20second
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  remove ads popup after watching for half vidoes
// @author      atto
// @match       https://*.iyf.tv/*
// @match       https://*.ifsp.tv/*
// @match       https://*.ifsp1.tv/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/545268/save%20your%2020second.user.js
// @updateURL https://update.greasyfork.org/scripts/545268/save%20your%2020second.meta.js
// ==/UserScript==


(function() {
    'use strict';
    console.log("start")
    function processElements() {


        const elementToRemoveSelector = '.publicbox.ng-star-inserted';
        const elementToClickSelector = '.overlay-play-container';

        const elementToRemove = document.querySelector(elementToRemoveSelector);
        if (elementToRemove) {
            elementToRemove.remove();
            console.log('Element removed.');

            const elementToClick = document.querySelector(elementToClickSelector);
            if (elementToClick) {
                elementToClick.click();
                return true;
            } else {
                console.log('Element to click not found:', elementToClickSelector);
            }
        }
        return false;
    }

    const observer = new MutationObserver((mutationsList, observer) => {
        if (processElements()) {

            console.log('Target elements processed. Stopping observer.');
            observer.disconnect();
        }
    });


    observer.observe(document.body, { childList: true, subtree: true });
    processElements();
})();
