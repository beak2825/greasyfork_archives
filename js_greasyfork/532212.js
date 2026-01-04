// ==UserScript==
// @name          Loader FIX
// @namespace     http://tampermonkey.net/
// @version       1.0
// @description   Bloquer le loader s'il dure trop longtemps
// @author        Laïn
// @match         https://www.dreadcast.eu/Main
// @match         https://www.dreadcast.net/Main
// @grant         none
// @run-at        document-idle
// @downloadURL https://update.greasyfork.org/scripts/532212/Loader%20FIX.user.js
// @updateURL https://update.greasyfork.org/scripts/532212/Loader%20FIX.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const LOADER_ID = 'loader';
    const MAX_VISIBLE_DURATION_MS = 250;

    let loaderElement = null;
    let hideTimeoutId = null;
    let styleObserver = null;
    let waitForLoaderObserver = null;

    function forceHideLoader() {
        if (loaderElement) {
            loaderElement.style.display = 'none';
        }
        hideTimeoutId = null;
    }

    function checkLoaderVisibility() {
        if (!loaderElement) return;

        const currentDisplay = window.getComputedStyle(loaderElement).display;
        const isVisible = currentDisplay === 'block';

        if (isVisible) {
            if (hideTimeoutId === null) {
                hideTimeoutId = setTimeout(forceHideLoader, MAX_VISIBLE_DURATION_MS);
            }
        } else {
            if (hideTimeoutId !== null) {
                clearTimeout(hideTimeoutId);
                hideTimeoutId = null;
            }
        }
    }

    function setupStyleObserver() {
        if (!loaderElement || styleObserver) return;

        styleObserver = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'attributes' && (mutation.attributeName === 'style' || mutation.attributeName === 'class')) {
                    checkLoaderVisibility();
                    return;
                }
            }
        });

        const config = {
            attributes: true,
            attributeFilter: ['style', 'class']
        };

        styleObserver.observe(loaderElement, config);
        checkLoaderVisibility();
    }

    function initializeOrWaitForLoader() {
        loaderElement = document.getElementById(LOADER_ID);

        if (loaderElement) {
            setupStyleObserver();
        } else {
            if (waitForLoaderObserver) return;

            waitForLoaderObserver = new MutationObserver((mutationsList, observer) => {
                for (const mutation of mutationsList) {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        for (const node of mutation.addedNodes) {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                if (node.id === LOADER_ID) {
                                    loaderElement = node;
                                } else {
                                    const found = node.querySelector('#' + LOADER_ID);
                                    if (found) {
                                        loaderElement = found;
                                    }
                                }

                                if (loaderElement) {
                                    observer.disconnect();
                                    waitForLoaderObserver = null;
                                    setupStyleObserver();
                                    return;
                                }
                            }
                        }
                    }
                }
            });

            const bodyObserverConfig = {
                childList: true,
                subtree: true
            };

            waitForLoaderObserver.observe(document.body, bodyObserverConfig);
        }
    }

    initializeOrWaitForLoader();

})();