// ==UserScript==
// @name         Auto SBC Submitter (Manual Trigger)
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  Auto-submit SBCs on EA FC Web App after manual start with "[" and stop with "]"
// @match        https://www.ea.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536989/Auto%20SBC%20Submitter%20%28Manual%20Trigger%29.user.js
// @updateURL https://update.greasyfork.org/scripts/536989/Auto%20SBC%20Submitter%20%28Manual%20Trigger%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (!localStorage.getItem('paletools_greeted')) {
        alert("👋 Welcome! Thanks for using my AutoSBC script that is built on paletools.");
        localStorage.setItem('paletools_greeted', 'true');
    }

    let SBC_TILE_SELECTOR = null;
    let running = false;

    function injectControlButtons() {
        if (document.querySelector('#sbc-start-btn')) return;

        const startBtn = document.createElement('button');
        startBtn.id = 'sbc-start-btn';
        startBtn.textContent = '▶ Start';
        startBtn.style.cssText = `
            position: fixed;
            bottom: 60px;
            right: 20px;
            z-index: 9999;
            padding: 10px 14px;
            background: green;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
        `;

        const stopBtn = document.createElement('button');
        stopBtn.id = 'sbc-stop-btn';
        stopBtn.textContent = '⏹ Stop';
        stopBtn.style.cssText = `
            position: fixed;
            bottom: 10px;
            right: 20px;
            z-index: 9999;
            padding: 10px 14px;
            background: red;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
        `;

        startBtn.onclick = startAutomation;
        stopBtn.onclick = stopAutomation;

        document.body.appendChild(startBtn);
        document.body.appendChild(stopBtn);
    }

    async function startAutomation() {
        // const submitButton = document.querySelector('button.ut-squad-tab-button-control.actionTab.right.call-to-action');
        const submitButton = document.querySelector('.ut-squad-tab-button-control.actionTab.right');
        if (!submitButton) {
            alert("SBC page not selected. Please click into an SBC before starting.");
            return;
        }

        const sbc_name = document.querySelector(".ut-navigation-bar-view .title")?.textContent.trim();
        const navBar = document.querySelector('div.ut-navigation-bar-view');
        const backButton = navBar?.querySelector('button.ut-navigation-button-control');
        if (!backButton) {
            console.log("Back button not found");
            return;
        }

        simulateFullClick(backButton);
        console.log("Clicked back button");

        await waitForElement('div.sbc-set--buttons');
        console.log("Found favourite button");
        await new Promise(resolve => setTimeout(resolve, 10));

        const h1s = document.querySelectorAll('h1.tileTitle');
        for (const h1 of h1s) {
            if (h1.textContent.trim() === sbc_name) {
                const sbcTileElement = h1.closest('div.ut-sbc-set-tile-view');
                if (sbcTileElement) {
                    const dataId = sbcTileElement.getAttribute('data-id');
                    SBC_TILE_SELECTOR = `div.ut-sbc-set-tile-view[data-id="${dataId}"]`;
                    break;
                }
            }
        }

        if (!SBC_TILE_SELECTOR) {
            alert("SBC Could not be found");
            return;
        }

        if (!running) {
            running = true;
            console.log('Automation started');
            performSequence();
        }
    }

    function stopAutomation() {
        if (running) {
            running = false;
            console.log('Automation stopped');
        }
    }

    // Remove buttons and stop automation if navigated away
//     const watchSBCPage = setInterval(() => {
//         const sbcButton = document.querySelector('button.ut-squad-tab-button-control.actionTab.right');
//         const startBtn = document.querySelector('#sbc-start-btn');
//         const stopBtn = document.querySelector('#sbc-stop-btn');

//         // Show buttons if they're missing and automation is running or SBC is visible
//         if ((running || sbcButton) && (!startBtn || !stopBtn)) {
//             injectControlButtons();
//         }

//         // Remove buttons only if automation is stopped and SBC is not visible
//         if (!running && !sbcButton) {
//             if (startBtn) startBtn.remove();
//             if (stopBtn) stopBtn.remove();
//             SBC_TILE_SELECTOR = null;
//             console.log('Removed control buttons: not running and not on SBC page');
//         }
//     }, 1000);

    function simulateFullClick(element) {
        ['mousedown', 'mouseup', 'click'].forEach(eventType => {
            const event = new MouseEvent(eventType, {
                view: window,
                bubbles: true,
                cancelable: true,
                buttons: 1
            });
            element.dispatchEvent(event);
        });
    }

    // function waitForElement(selector, interval = 500, timeout = 10000) {
    //     return new Promise((resolve, reject) => {
    //         const start = Date.now();
    //         const timer = setInterval(() => {
    //             if (!running) {
    //                 clearInterval(timer);
    //                 reject(new Error(`Aborted waiting for element: ${selector}`));
    //                 return;
    //             }
    //             const el = document.querySelector(selector);
    //             if (el) {
    //                 clearInterval(timer);
    //                 resolve(el);
    //             } else if (Date.now() - start > timeout) {
    //                 clearInterval(timer);
    //                 reject(new Error(`Timeout waiting for element: ${selector}`));
    //             }
    //         }, interval);
    //     });
    // }
    function waitForElement(selector, interval = 500, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const start = Date.now();
            const timer = setInterval(() => {
                const el = document.querySelector(selector);
                if (el) {
                    clearInterval(timer);
                    resolve(el);
                } else if (Date.now() - start > timeout) {
                    clearInterval(timer);
                    reject(new Error(`Timeout waiting for element: ${selector}`));
                }
            }, interval);
        });
    }

    function delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function performSequence() {
        if (!running) return;

        try {
            console.log('Starting sequence');

            if (!running) return;
            const sbcTile = await waitForElement(SBC_TILE_SELECTOR);
            if (!running) return;
            simulateFullClick(sbcTile);
            console.log('SBC tile clicked');

            if (!running) return;
            const buildBtn = await waitForElement('button#use-template.btn-standard');
            if (!running) return;
            simulateFullClick(buildBtn);
            console.log('Build Using Template clicked');

            await new Promise(res => setTimeout(res, 10));

            if (!running) return;
            const submitBtnSelector = 'button.ut-squad-tab-button-control.actionTab.right:not([disabled])';
            await waitForElement(submitBtnSelector);
            if (!running) return;
            simulateFullClick(document.querySelector(submitBtnSelector));
            console.log('Submit button clicked');

            await new Promise(res => setTimeout(res, 10));

            if (!running) return;
            const claimBtnSelector = '.game-rewards-view .btn-standard.primary';
            const claimBtn = await waitForElement(claimBtnSelector);
            if (!running) return;
            simulateFullClick(claimBtn);
            console.log('Claim Rewards clicked');
            await delay(1000);
            if (running) performSequence();

        } catch (err) {
            console.error('Error in sequence:', err.message);
            if (running) setTimeout(performSequence, 1000);
        }
    }

    window.addEventListener('keydown', async (e) => {
        if (e.key === '[') {
            startAutomation();
        } else if (e.key === ']') {
            stopAutomation();
        }
    });

})();
