// ==UserScript==
// @name         Geoguessr Hide Results
// @namespace    http://tampermonkey.net/
// @author       BrainyGPT
// @version      1.4
// @description  Hide challenges results
// @match        https://www.geoguessr.com/*
// @icon         https://i.imgur.com/IG8yPEV.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542805/Geoguessr%20Hide%20Results.user.js
// @updateURL https://update.greasyfork.org/scripts/542805/Geoguessr%20Hide%20Results.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const TOPBAR_OVERLAY_ID = 'tampermonkey-blackout-overlay-topbar';
    const FULLSCREEN_OVERLAY_ID = 'tampermonkey-blackout-overlay-fullscreen';

    // ---------- Top Bar Overlay ----------

    function createTopBarOverlay() {
        let overlay = document.getElementById(TOPBAR_OVERLAY_ID);
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = TOPBAR_OVERLAY_ID;
            Object.assign(overlay.style, {
                position: 'fixed',
                backgroundColor: 'black',
                zIndex: '4',       // higher than top bar's 3
                pointerEvents: 'none',
            });
            document.body.appendChild(overlay);
            console.log('[Tampermonkey] Top bar black overlay created.');
        }
        updateTopBarOverlayPosition();
    }

    function updateTopBarOverlayPosition() {
        const overlay = document.getElementById(TOPBAR_OVERLAY_ID);
        const topBar = document.querySelector('[data-qa="result-view-top"]');
        if (!overlay || !topBar) return;

        const rect = topBar.getBoundingClientRect();

        Object.assign(overlay.style, {
            top: rect.top + 'px',
            left: rect.left + 'px',
            width: rect.width + 'px',
            height: rect.height + 'px',
        });
    }

    function removeTopBarOverlay() {
        const overlay = document.getElementById(TOPBAR_OVERLAY_ID);
        if (overlay) {
            overlay.remove();
            console.log('[Tampermonkey] Top bar black overlay removed.');
        }
    }

    // ---------- Fullscreen Overlay ----------

    function createFullscreenOverlay() {
        let overlay = document.getElementById(FULLSCREEN_OVERLAY_ID);
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = FULLSCREEN_OVERLAY_ID;
            Object.assign(overlay.style, {
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100vw',
                height: '100vh',
                backgroundColor: 'black',
                zIndex: '99999',
                pointerEvents: 'none',
            });
            document.body.appendChild(overlay);
            console.log('[Tampermonkey] Fullscreen black overlay created.');
        }
    }

    function removeFullscreenOverlay() {
        const overlay = document.getElementById(FULLSCREEN_OVERLAY_ID);
        if (overlay) {
            overlay.remove();
            console.log('[Tampermonkey] Fullscreen black overlay removed.');
        }
    }

    // ---------- Elements to Remove ----------

    const selectorsToRemove = [
        '.round-result_pointsIndicatorWrapper__7JxD_',
        '.round-result_distanceIndicatorWrapper__qNO6y',
        '.status_section__RVR6u[data-qa="score"]',
        '.game-reactions_root__TSjX_',

    ];

    function removeMatchingElements() {
        selectorsToRemove.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                el.remove();
                console.log(`[Tampermonkey] Removed element matching: ${selector}`);
            });
        });
    }

    // ---------- Main Observer & Logic ----------

    let mutationObserver = null;

    function checkURLAndManageOverlay() {
        const currentURL = window.location.href;
        const resultsUrlPrefix = 'https://www.geoguessr.com/results/';

        const onResultsPage = currentURL.startsWith(resultsUrlPrefix);

        if (onResultsPage) {
            // Show fullscreen overlay, hide top bar overlay
            createFullscreenOverlay();
            removeTopBarOverlay();
        } else {
            // Hide fullscreen overlay, handle top bar overlay per results screen presence
            removeFullscreenOverlay();

            const resultScreen = document.querySelector('.result-layout_root__fRPgH');
            if (resultScreen) {
                createTopBarOverlay();
                updateTopBarOverlayPosition();
            } else {
                removeTopBarOverlay();
            }
        }

        // Always remove unwanted elements
        removeMatchingElements();
    }

    function startObserving() {
        if (mutationObserver) return;

        mutationObserver = new MutationObserver(() => {
            checkURLAndManageOverlay();
        });

        mutationObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Listen for history changes (single page app navigation)
    function listenToUrlChanges() {
        const pushState = history.pushState;
        history.pushState = function () {
            pushState.apply(this, arguments);
            setTimeout(checkURLAndManageOverlay, 50);
        };
        window.addEventListener('popstate', () => {
            setTimeout(checkURLAndManageOverlay, 50);
        });
    }

    // Resize handler for top bar overlay
    window.addEventListener('resize', () => {
        updateTopBarOverlayPosition();
    });

    // Initial
    removeMatchingElements();
    checkURLAndManageOverlay();
    startObserving();
    listenToUrlChanges();

})();
