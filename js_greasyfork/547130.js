// ==UserScript==
// @name         Steam Workshop Links Extractor & Auto-Subscriptions
// @namespace    SteamWorkshopLinksExtractorandAutoSubscriptions
// @version      1.00
// @description  Extract Links, Subscribe to All, or Unsubscribe from All items on any Steam Workshop page.
// @author       Dragonking69
// @match        https://steamcommunity.com/workshop/browse/*
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/547130/Steam%20Workshop%20Links%20Extractor%20%20Auto-Subscriptions.user.js
// @updateURL https://update.greasyfork.org/scripts/547130/Steam%20Workshop%20Links%20Extractor%20%20Auto-Subscriptions.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CONFIGURATION ---
    const maxPagesToProcess = 100; // <--- SET YOUR MAXIMUM NUMBER OF PAGES TO PROCESS
    const outputFilename = 'steam_workshop_links.txt'; // Filename for extracted links
    // -------------------

    let pageTimeoutId = null; // To keep track of the safety timeout

    // --- ACTION-SPECIFIC LOGIC ---

    function runExtractionProcess() {
        console.log('ACTION: Extracting Links...');
        const storedLinks = JSON.parse(sessionStorage.getItem('workshopExtractedLinks') || '[]');
        const currentPageLinks = new Set(storedLinks);
        const linkElements = document.querySelectorAll('a.ugc[href*="sharedfiles/filedetails/"]');
        linkElements.forEach(el => currentPageLinks.add(el.href));
        sessionStorage.setItem('workshopExtractedLinks', JSON.stringify([...currentPageLinks]));
        console.log(`Found ${linkElements.length} links on this page. Total unique links: ${currentPageLinks.size}`);
        proceedOrStop();
    }

    function runSubscriptionProcess() {
        console.log('ACTION: Subscribing to all...');
        const buttonsToClick = document.querySelectorAll('span[id^="SubscribeItemBtn"]:not(.toggled)');
        if (buttonsToClick.length > 0) {
            console.log(`Found ${buttonsToClick.length} items to subscribe to. Clicking now...`);
            buttonsToClick.forEach(btn => btn.click());
            waitForCompletion('subscribe');
        } else {
            console.log("All items on this page are already subscribed.");
            proceedOrStop();
        }
    }

    function runUnsubscriptionProcess() {
        console.log('ACTION: Unsubscribing from all...');
        const buttonsToClick = document.querySelectorAll('span[id^="SubscribeItemBtn"].toggled');
        if (buttonsToClick.length > 0) {
            console.log(`Found ${buttonsToClick.length} items to unsubscribe from. Clicking now...`);
            buttonsToClick.forEach(btn => btn.click());
            waitForCompletion('unsubscribe');
        } else {
            console.log("No items on this page were subscribed.");
            proceedOrStop();
        }
    }

    // --- CORE & HELPER FUNCTIONS ---

    function waitForCompletion(expectedState) {
        const totalItems = document.querySelectorAll('.workshopItem').length;
        const isSubscribing = expectedState === 'subscribe';
        console.log(`Waiting for ${totalItems} items to reach '${expectedState}' state...`);

        const intervalCheck = setInterval(() => {
            const subscribedItemsCount = document.querySelectorAll('.user_action_history_icon.subscribed[style*="block"]').length;
            const unsubscribedItemsCount = totalItems - subscribedItemsCount;

            const goalReached = isSubscribing ? (subscribedItemsCount >= totalItems) : (unsubscribedItemsCount >= totalItems);

            console.log(`Progress: ${isSubscribing ? subscribedItemsCount : unsubscribedItemsCount} / ${totalItems} completed.`);

            if (goalReached) {
                clearInterval(intervalCheck);
                clearTimeout(pageTimeoutId);
                console.log('All actions confirmed.');
                proceedOrStop();
            }
        }, 2000);

        pageTimeoutId = setTimeout(() => {
            clearInterval(intervalCheck);
            console.warn(`Page timeout reached. Moving to next page anyway.`);
            proceedOrStop();
        }, 30000); // 30-second timeout
    }

    function goToNextPage() {
        const urlParams = new URLSearchParams(window.location.search);
        const currentPage = parseInt(urlParams.get('p'), 10) || 1;
        const nextPage = currentPage + 1;
        console.log(`Navigating from page ${currentPage} to ${nextPage}...`);
        urlParams.set('p', nextPage);
        window.location.search = urlParams.toString();
    }

    function proceedOrStop() {
        clearTimeout(pageTimeoutId);
        const urlParams = new URLSearchParams(window.location.search);
        const currentPage = parseInt(urlParams.get('p'), 10) || 1;

        if (currentPage >= maxPagesToProcess) {
            stopAction(true, `Reached the maximum page limit of ${maxPagesToProcess}.`);
            return;
        }

        const nextPageButton = document.querySelector('.pagebtn:not(.disabled):last-child');
        if (!nextPageButton || nextPageButton.textContent !== '>') {
             stopAction(true, 'Finished scanning all available pages.');
             return;
        }

        console.log('Page complete. Moving to the next page in 2 seconds...');
        setTimeout(goToNextPage, 2000);
    }

    function downloadLinksAsTxt() {
        const links = JSON.parse(sessionStorage.getItem('workshopExtractedLinks') || '[]');
        if (links.length === 0) return;
        console.log(`Preparing to download ${links.length} links.`);
        const fileContent = links.join('\n');
        const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = outputFilename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }

    // --- UI AND STATE MANAGEMENT ---

    function startAction(action) {
        const confirmation = confirm(`This will start the "${action}" process and continue automatically up to page ${maxPagesToProcess}.\n\nAre you sure?`);
        if (confirmation) {
            sessionStorage.setItem('workshopToolAction', action);
            if (action === 'extract') {
                sessionStorage.setItem('workshopExtractedLinks', '[]');
            }
            runAction(action);
        }
    }

    function stopAction(finished = false, message = 'Script stopped manually.') {
        const action = sessionStorage.getItem('workshopToolAction');
        if (action === 'extract') {
            if (finished) {
                alert(message + ' Downloading collected links now.');
            } else {
                 alert(message + ' Downloading any links collected so far.');
            }
            downloadLinksAsTxt();
        } else {
            alert(message);
        }

        clearTimeout(pageTimeoutId);
        sessionStorage.removeItem('workshopToolAction');
        sessionStorage.removeItem('workshopExtractedLinks');
        updateUIState(null);
    }

    function updateUIState(runningAction) {
        const panel = document.getElementById('workshopToolPanel');
        if (!panel) return;
        const buttons = panel.querySelectorAll('button');
        buttons.forEach(btn => {
            const action = btn.getAttribute('data-action');
            if (runningAction) {
                // A task is running
                if (action === 'stop') {
                    btn.style.display = 'block';
                    let stopText = 'Stop';
                    if (runningAction === 'extract') stopText += ' & Download';
                    btn.textContent = stopText;
                } else {
                    btn.style.display = 'none';
                }
            } else {
                // No task is running
                btn.style.display = action === 'stop' ? 'none' : 'block';
            }
        });
    }

    function createControllerPanel() {
        const panel = document.createElement('div');
        panel.id = 'workshopToolPanel';
        Object.assign(panel.style, {
            position: 'fixed', bottom: '20px', right: '20px', zIndex: '9999',
            backgroundColor: 'rgba(0, 0, 0, 0.7)', padding: '10px', borderRadius: '5px',
            display: 'flex', flexDirection: 'column', gap: '8px'
        });

        const actions = [
            { id: 'extract', text: 'Extract Links', color: '#4c6e81' },
            { id: 'subscribe', text: 'Subscribe All', color: '#5ba32b' },
            { id: 'unsubscribe', text: 'Unsubscribe All', color: '#a03c2a' },
            { id: 'stop', text: 'Stop', color: '#d94126' }
        ];

        actions.forEach(({ id, text, color }) => {
            const button = document.createElement('button');
            button.textContent = text;
            button.setAttribute('data-action', id);
            Object.assign(button.style, {
                padding: '8px 16px', fontSize: '14px', color: 'white', border: 'none',
                borderRadius: '5px', cursor: 'pointer', backgroundColor: color, width: '100%'
            });
            if (id === 'stop') {
                button.addEventListener('click', () => stopAction(false));
            } else {
                button.addEventListener('click', () => startAction(id));
            }
            panel.appendChild(button);
        });

        document.body.appendChild(panel);
    }

    function runAction(action) {
        updateUIState(action);
        switch (action) {
            case 'extract':     runExtractionProcess(); break;
            case 'subscribe':   runSubscriptionProcess(); break;
            case 'unsubscribe': runUnsubscriptionProcess(); break;
        }
    }

    // --- SCRIPT INITIALIZATION ---
    createControllerPanel();
    const activeAction = sessionStorage.getItem('workshopToolAction');
    updateUIState(activeAction);

    if (activeAction) {
        setTimeout(() => runAction(activeAction), 2000);
    }

})();