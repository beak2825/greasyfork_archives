// discord.gg/JjszyaD63A

// ==UserScript==
// @name         [Brick-Kill] Clan Claimer
// @version      3002
// @author       Spacekiller
// @description  Searches and claims clans.
// @match        https://www.brick-hill.com/*
// @run-at       document-idle
// @grant        none
// @icon         https://www.brick-hill.com/favicon.ico
// @license      MIT
// @namespace    bhclanclaimer
// @downloadURL https://update.greasyfork.org/scripts/491691/%5BBrick-Kill%5D%20Clan%20Claimer.user.js
// @updateURL https://update.greasyfork.org/scripts/491691/%5BBrick-Kill%5D%20Clan%20Claimer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /*-    SETTINGS    -*/
    const mode = 'random'
    // 'down' for going down clan ids 1 by 1
    // 'random' for going to random clans

    const delay = '0'
    // Add delay if you're lagging (in seconds)


    function claimClan() {
        setTimeout(function () {
            const claimButton = document.querySelector('button.green');

            if (claimButton && claimButton.textContent === 'CLAIM OWNERSHIP') {
                claimButton.click();

                const alertError = document.querySelector('.alert.error');
                if (alertError) {
                    window.location.href = 'https://www.brick-hill.com/dashboard';
                }
            } else {
                if (currentVisitCount > 0) {
                    if (mode === "down") {
                        window.location.href = `https://www.brick-hill.com/clan/${currentVisitCount - 1}`;
                    } else if (mode === "random") {
                        const minClanId = 1;
                        const maxClanId = 8431;

                        const randomClanId = Math.floor(Math.random() * (maxClanId - minClanId + 1)) + minClanId;

                        window.location.href = `https://www.brick-hill.com/clan/${randomClanId}`;
                    }
                } else {
                    window.location.href = 'https://www.brick-hill.com/dashboard';
                }
            }

        }, delay * 1000);
    }

    const initialVisitCount = 8431;

    const currentVisitCount = parseInt(window.location.pathname.split('/')[2]) || initialVisitCount;

    function handleMutations(mutationsList, observer) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                claimClan();
            }
        }
    }

    const observer = new MutationObserver(handleMutations);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    claimClan();

})();