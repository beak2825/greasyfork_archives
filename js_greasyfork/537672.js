// ==UserScript==
// @name         SHEIN Ad, Popup and Captcha Remover
// @namespace    http://tampermonkey.net/
// @version      0.2 beta
// @description  remove/hide ads, popups, and captchas on SHEIN.
// @author       HYPERR
// @match        *://*.shein.com/*
// @grant        none
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/537672/SHEIN%20Ad%2C%20Popup%20and%20Captcha%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/537672/SHEIN%20Ad%2C%20Popup%20and%20Captcha%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const selectorsToRemove = [
        'div[class*="modal"]',
        'div[class*="popup"]',
        'div[class*="dialog"]',
        'div[class*="banner-ad"]',
        'div[id*="ad-container"]',
        'div[class*="captcha"]',
        'div[id*="captcha"]',
        'iframe[src*="captcha"]',
        'div[class*="recaptcha"]',
        'div[id*="recaptcha"]'
    ];

    function processAndConcealTargetedNuisances() {
        let successfullyNeutralizedCount = 0;

        for (const currentSelectorString of selectorsToRemove) {
            try {
                const matchingDOMNodes = document.querySelectorAll(currentSelectorString);

                for (let i = 0; i < matchingDOMNodes.length; i++) {
                    const individualElement = matchingDOMNodes[i];
                    const isCurrentlyVisible = !(individualElement.style.display === 'none');

                    if (isCurrentlyVisible) {
                        individualElement.style.setProperty('display', 'none', 'important');
                        successfullyNeutralizedCount = successfullyNeutralizedCount + 1;
                    }
                }
            } catch (errorInstance) {
                console.error(
                    `[SHEIN Vanisher] Encountered an issue with selector: "${currentSelectorString}". Details:`,
                    errorInstance
                );
            }
        }

        if (successfullyNeutralizedCount > 0) {
            console.log(
                `[SHEIN Vanisher] Successfully vanished ${successfullyNeutralizedCount} annoyance(s) from view.`
            );
        }
    }

    let dynamicContentObservationTimeout = null;

    function handleDynamicPageModifications(mutationsList, observerInstance) {
        if (dynamicContentObservationTimeout) clearTimeout(dynamicContentObservationTimeout);
        dynamicContentObservationTimeout = setTimeout(() => {
            processAndConcealTargetedNuisances();
            dynamicContentObservationTimeout = null;
        }, 300);
    }

    const pageMutationWatcher = new MutationObserver(handleDynamicPageModifications);
    const observationConfig = { childList: true, subtree: true };
    pageMutationWatcher.observe(document.documentElement, observationConfig);
    processAndConcealTargetedNuisances();
    console.log("[SHEIN Vanisher] Script initialized and initial scan complete. Watching for dynamic content.");
})();