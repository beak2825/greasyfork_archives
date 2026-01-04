// ==UserScript==
// @name         Auto Pack Opener by Kyogre Groudon
// @namespace    http://tampermonkey.net/
// @version      4.1
// @description  Opens all packs starting from first pack on the left. Press '-' to start and '=' to stop.
// @match        https://www.ea.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537072/Auto%20Pack%20Opener%20by%20Kyogre%20Groudon.user.js
// @updateURL https://update.greasyfork.org/scripts/537072/Auto%20Pack%20Opener%20by%20Kyogre%20Groudon.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const INITIAL_DELAY = 2000;
    const ACTION_DELAY = 1500;
    const SPINNER_TIMEOUT = 10000;
    const MAX_ATTEMPTS = 50;

    let isRunning = false;

    function delay(ms) {
        return new Promise(res => setTimeout(res, ms));
    }

    function simulateFullClick(element) {
        ['mousedown', 'mouseup', 'click'].forEach(eventType => {
            element.dispatchEvent(new MouseEvent(eventType, {
                bubbles: true,
                cancelable: true,
                view: window
            }));
        });
    }

    function waitForElement(selector, interval = 50, timeout = 15000) { // changed interval from 500 to 50.
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

    function createSidebar() {
        let sidebar = document.getElementById('playerSidebar');
        if (!sidebar) {
            sidebar = document.createElement('div');
            sidebar.id = 'playerSidebar';
            sidebar.style.position = 'fixed';
            sidebar.style.top = '100px';
            sidebar.style.right = '20px';
            sidebar.style.width = '200px';
            sidebar.style.maxHeight = '600px';
            sidebar.style.overflowY = 'auto';
            sidebar.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            sidebar.style.color = 'white';
            sidebar.style.padding = '10px';
            sidebar.style.borderRadius = '8px';
            sidebar.style.zIndex = '9999';
            sidebar.innerHTML = '<h4>Top Players</h4><ul id="sidebarList" style="padding-left: 20px;"></ul>';
            document.body.appendChild(sidebar);
        }
    }

    function isInMyPacks() {
        const firstButton = document.querySelector('.ea-filter-bar-item-view');
        return firstButton && firstButton.textContent.startsWith("My Packs") && firstButton.classList.contains('selected');
    }

    function removeControlButtons() {
        console.log('attempting to remove start stop');
        const startBtn = document.getElementById('pack-start-btn');
        const stopBtn = document.getElementById('pack-stop-btn');
        if (startBtn) startBtn.remove();
        if (stopBtn) stopBtn.remove();
        console.log('removed successfully');
    }

    // Update buttons visibility depending on isRunning or being in My Packs tab
    function updateButtonVisibility() {
        const startBtn = document.getElementById('pack-start-btn');
        const stopBtn = document.getElementById('pack-stop-btn');
        if (!startBtn || !stopBtn) return;

        if (isRunning || isInMyPacks()) {
            startBtn.style.display = 'block';
            stopBtn.style.display = 'block';
        } else {
            // If not running and not in My Packs, remove buttons completely
            removeControlButtons();
        }
    }

    // Monitor page changes every 1s to inject/remove buttons accordingly
    const monitorInterval = setInterval(() => {
        console.log('checking for my packs');
        if (isRunning || isInMyPacks()) {
            // console.log('is running? :' + isRunning);
            console.log('is in my packs? : ' + isInMyPacks());
            injectControlButtons();
            updateButtonVisibility();
        } else {
            console.log('it should call this?');
            removeControlButtons();
        }
    }, 1000);


    function injectControlButtons() {
        if (document.getElementById('pack-start-btn')) return;

        const startBtn = document.createElement('button');
        startBtn.id = 'pack-start-btn';
        startBtn.textContent = '🎴 Open Packs';
        startBtn.style.cssText = `
            position: fixed;
            bottom: 60px;
            left: 20px;
            z-index: 9999;
            padding: 10px 14px;
            background: green;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
        `;

        const stopBtn = document.createElement('button');
        stopBtn.id = 'pack-stop-btn';
        stopBtn.textContent = '🛑 Stop';
        stopBtn.style.cssText = `
            position: fixed;
            bottom: 10px;
            left: 20px;
            z-index: 9999;
            padding: 10px 14px;
            background: red;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
        `;

        startBtn.onclick = () => {
            if (!isRunning) {
                console.log('Starting automation...');
                createSidebar();
                const sidebarList = document.getElementById('sidebarList');
                if (sidebarList) sidebarList.innerHTML = '';
                isRunning = true;
                console.log('is running is set to true here on click');
                mainLoop().catch(err => console.error('Error:', err));
            }
        };

        stopBtn.onclick = () => {
            console.log('Stopping automation...');
            isRunning = false;
        };

        document.body.appendChild(startBtn);
        document.body.appendChild(stopBtn);
    }

    setInterval(() => {
        const tab = document.querySelector('.ea-filter-bar-item-view');
        if (tab && tab.textContent.includes("My Packs")) {
            injectControlButtons();
        }
    }, 1000);

    async function waitForSpinner() {
        const start = Date.now();
        while (document.querySelector('.ut-click-shield.showing')) {
            if (Date.now() - start > SPINNER_TIMEOUT) {
                console.warn('Spinner timeout');
                return false;
            }
            await delay(200);
        }
        return true;
    }

    // this function needs to change all the query selectors.
    async function processItems() {
        console.log('Processing items...');

        const mainEllipsisSelector = '.ut-sectioned-item-list-view:not(.storage-duplicates) .ut-image-button-control.ellipsis-btn';
        const dupeEllipsisSelector = '.ut-sectioned-item-list-view.storage-duplicates .ut-image-button-control.ellipsis-btn';
        const max_retries_to_store_in_club = 30;

        let mainElement = null;
        let dupeElement = null;

        try {
            const element = await Promise.race([
                waitForElement(mainEllipsisSelector).then(el => { mainElement = el; return { type: 'main', el }; }),
                waitForElement(dupeEllipsisSelector).then(el => { dupeElement = el; return { type: 'dupe', el }; })
            ]);
            console.log(element.type + " element appeared:", element.el);
        } catch (err) {
            console.error('Neither element appeared in time:', err);
            return false;
        }

        if (document.querySelector(mainEllipsisSelector)) {
            // Process main storage
            const players = document.querySelectorAll('.listFUTItem');
            for (const player of players) {
                const ratingDiv = player.querySelector('.rating');
                if (ratingDiv) {
                    const rating = parseFloat(ratingDiv.textContent.trim());
                    if (rating >= 86) {
                        const name = player.querySelector('.name').textContent;
                        const sidebarList = document.getElementById('sidebarList');
                        if (sidebarList) {
                            const li = document.createElement('li');
                            li.textContent = `${name} (${rating})`;
                            sidebarList.appendChild(li);
                        }
                    }
                }
            }

            let storeAllBtn = null;
            let ctr = 0;

            while (storeAllBtn == null && ctr < max_retries_to_store_in_club) {
                simulateFullClick(mainElement);
                storeAllBtn = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent.includes("Store All in Club"));
                await delay(100);
                ctr++;
            }
            if (ctr == max_retries_to_store_in_club) {
                console.warn('Store All button not found after retries');
                return false;
            }

            let ctr2 = 0;
            while (document.querySelector(mainEllipsisSelector) && ctr2 < max_retries_to_store_in_club) {
                simulateFullClick(storeAllBtn);
                await delay(100);
                ctr2++;
            }
            console.log('Stored main items');
            await waitForSpinner();
        }

        dupeElement = document.querySelector(dupeEllipsisSelector);

        if (dupeElement) {
            simulateFullClick(dupeElement);
            await waitForElement('.view-modal-container .ut-bulk-action-popup-view');
            await delay(10);

            const sbcStorageBtn = Array.from(document.querySelectorAll('.view-modal-container button'))
                .find(btn => btn.textContent.includes("Send all items to SBC Storage"));
            if (!sbcStorageBtn) {
                alert("SBC Storage Full!");
                isRunning = false;
                return false;
            }

            let ctr3 = 0;
            while (document.querySelector('.view-modal-container .ut-bulk-action-popup-view') && ctr3 < max_retries_to_store_in_club) {
                simulateFullClick(sbcStorageBtn);
                await delay(100);
                ctr3++;
            }
            if (ctr3 == max_retries_to_store_in_club) {
                alert("SBC Storage button click timed out");
                return false;
            }
            console.log('Sent duplicates to SBC storage');
            await waitForSpinner();
        }

        const navButton = document.querySelector('.ut-navigation-bar-view.navbar-style-landscape.currency-purchase button.ut-navigation-button-control');
        if (navButton && document.querySelector('.menu-container') == null) {
            console.log('Returning to store...');
            simulateFullClick(navButton);
            await waitForSpinner();
        }

        return true;
    }


    async function openPack() {
        const packs = document.querySelectorAll('.ut-store-pack-details-view');
        let packToOpen = false;
        packs.forEach(pack => {
            let displayTag = window.getComputedStyle(pack).display;
            if (displayTag != 'none' && !packToOpen) packToOpen = pack;
        });

        if (!packToOpen) {
            console.log('No packs found');
            return false;
        }

        const openBtn = packToOpen.querySelector('button.currency.primary:not([disabled])');
        if (!openBtn) {
            console.warn('Open button not found or disabled');
            return false;
        }
        // maybe need to multi click this one or dom wait
        // -----------------------------------------------------------------------------------------
        simulateFullClick(openBtn);
        console.log('Pack opening initiated');

        // ----------------------------------------------------------------------------------------
        return true;
    }

    async function mainLoop() {
        isRunning = true;
        while (isRunning) {
            const firstButton = document.querySelector('.ea-filter-bar-item-view');
            if (!firstButton) {
                alert("Please click into My Packs in the store.");
                isRunning = false;
                return false;
            }
            if (firstButton.textContent.startsWith("My Packs") && firstButton.classList.contains('selected')) {
                console.log("Proceeding to open packs..");
            } else {
                alert("Please click into 'My Packs' Tab!");
                isRunning = false;
                return false;
            }

            const packOpened = await openPack();
            if (!packOpened) break;
            console.log("Opened pack");

            await processItems();

            let foundCallToAction = false;
            for (let attempt = 0; attempt < 30; attempt++) {
                if (document.querySelector('button.currency.call-to-action')) {
                    foundCallToAction = true;
                    break;
                }
                await delay(10);
            }
            if (!foundCallToAction) {
                console.log("No more pack or pack didn't load after 30 tries.");
                continue;
            }

            console.log(`Completed iteration`);
        }

        isRunning = false;
        console.log('Finished processing all packs');
    }

    console.log('FUT Pack Opener loaded! Press "🎴 Open Packs" to start');
})();