// ==UserScript==
// @name         PoE2 Against the Darkness Search Helper
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a floating control window for POE2 trade site to load results, search mods, and navigate highlighted results.
// @author       Qinsoon
// @match        https://www.pathofexile.com/trade2/search/poe2*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523880/PoE2%20Against%20the%20Darkness%20Search%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/523880/PoE2%20Against%20the%20Darkness%20Search%20Helper.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let targetResultCount = 100; // Default target result count
    let highlightedResults = []; // Store highlighted results
    let currentHighlightIndex = -1; // Track current highlighted result

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function savePreferences(mod1, mod2) {
        localStorage.setItem('mod1', mod1);
        localStorage.setItem('mod2', mod2);
    }

    function loadPreferences() {
        return {
            mod1: localStorage.getItem('mod1') || 'mana',
            mod2: localStorage.getItem('mod2') || 'intelligence'
        };
    }

    function createFloatingWindow() {
        const { mod1, mod2 } = loadPreferences();

        const floatingWindow = document.createElement('div');
        floatingWindow.id = 'floating-window';
        floatingWindow.style.position = 'fixed';
        floatingWindow.style.top = '10px';
        floatingWindow.style.right = '10px';
        floatingWindow.style.width = '300px';
        floatingWindow.style.backgroundColor = 'white';
        floatingWindow.style.border = '1px solid black';
        floatingWindow.style.padding = '10px';
        floatingWindow.style.zIndex = '9999';
        floatingWindow.style.display = 'none'; // Initially hidden

        floatingWindow.innerHTML = `
            <h4>POE2 Against the Darkness Search Helper</h4>
            <p>You are searching for Against the Darkness. Fill in the mods below and click "Search" to find matching items.</p>
            <label>Mod 1: <input type="text" id="mod1" placeholder="Enter keyword" style="width: 90%;" value="${mod1}" /></label><br>
            <label>Mod 2: <input type="text" id="mod2" placeholder="Enter keyword" style="width: 90%;" value="${mod2}" /></label><br>
            <button id="search-button">Search</button>
            <button id="prev-button" disabled>Prev</button>
            <button id="next-button" disabled>Next</button>
            <button id="close-button">Close</button><br>
            <p>Total items: <span id="total-results">0</span></p>
            <p>Found: <span id="highlighted-results">0</span></p>
        `;

        document.body.appendChild(floatingWindow);

        document.getElementById('search-button').addEventListener('click', () => {
            const newMod1 = document.getElementById('mod1').value;
            const newMod2 = document.getElementById('mod2').value;
            savePreferences(newMod1, newMod2); // Save mods to localStorage
            clearHighlights(); // Clear previous highlights
            loadResults();
        });

        document.getElementById('prev-button').addEventListener('click', () => {
            navigateHighlights(-1);
        });

        document.getElementById('next-button').addEventListener('click', () => {
            navigateHighlights(1);
        });

        document.getElementById('close-button').addEventListener('click', () => {
            document.getElementById('floating-window').style.display = 'none';
            monitorPage(); // Re-enable the observer to reopen the window when the condition is met
        });
    }

    function clearHighlights() {
        highlightedResults.forEach(item => {
            item.style.border = ''; // Remove highlight border
        });
        highlightedResults = [];
        currentHighlightIndex = -1;
        document.getElementById('highlighted-results').textContent = highlightedResults.length;
        updateNavigationButtons();
    }

    function monitorPage() {
        const observer = new MutationObserver(() => {
            const items = document.querySelectorAll('.itemBoxContent');
            for (const item of items) {
                const headerText = item.querySelector('.itemHeader')?.innerText || '';
                if (headerText.includes('Against the Darkness') && headerText.includes('Time-Lost Diamond')) {
                    document.getElementById('floating-window').style.display = 'block';
                    return;
                }
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    async function loadResults() {
        let loadedResults = 0;
        let emptyLoadCounter = 0; // Track consecutive empty loads

        while (loadedResults < targetResultCount) {
            const loadMoreButton = document.querySelector('button.btn.load-more-btn');

            if (loadMoreButton) {
                console.log("Clicking Load More button...");
                loadMoreButton.click();
            } else {
                console.log("Load More button not found, stopping further loading.");
                break;
            }

            await sleep(1000); // Wait for results to load

            const newLoadedResults = document.querySelectorAll('.itemBoxContent').length;
            if (newLoadedResults === loadedResults) {
                emptyLoadCounter++;
                console.log(`No new results loaded (${emptyLoadCounter}/10).`);

                if (emptyLoadCounter >= 10) {
                    console.log("Max empty loads reached. Stopping loop.");
                    break;
                }
            } else {
                emptyLoadCounter = 0; // Reset counter if new results are loaded
            }

            loadedResults = newLoadedResults;
            document.getElementById('total-results').textContent = loadedResults;
            console.log(`Loaded results: ${loadedResults}`);

            // Search for adjacent mods during the loop
            searchAdjacentModsByItem();

            if (loadedResults >= targetResultCount) {
                break;
            }
        }

        updateNavigationButtons();
    }

    function searchAdjacentModsByItem() {
        const items = document.querySelectorAll('.itemBoxContent'); // Group mods by .itemBoxContent
        const mod1 = document.getElementById('mod1').value.toLowerCase();
        const mod2 = document.getElementById('mod2').value.toLowerCase();

        highlightedResults = []; // Clear previous results

        items.forEach(item => {
            const mods = item.querySelectorAll('.explicitMod');
            if (mods.length < 2) return; // Skip if fewer than 2 mods

            for (let i = 0; i < mods.length - 1; i++) {
                const currentMod = mods[i].innerText.toLowerCase();
                const nextMod = mods[i + 1].innerText.toLowerCase();

                if ((currentMod.includes(mod1) && nextMod.includes(mod2)) ||
                    (currentMod.includes(mod2) && nextMod.includes(mod1))) {
                    item.style.border = "2px solid red"; // Highlight the item
                    highlightedResults.push(item);
                    break; // Stop checking further mods in this item
                }
            }
        });

        document.getElementById('highlighted-results').textContent = highlightedResults.length;
        updateNavigationButtons();
    }

    function navigateHighlights(direction) {
        if (highlightedResults.length === 0) return;

        currentHighlightIndex += direction;
        if (currentHighlightIndex < 0) {
            currentHighlightIndex = highlightedResults.length - 1;
        } else if (currentHighlightIndex >= highlightedResults.length) {
            currentHighlightIndex = 0;
        }

        const currentElement = highlightedResults[currentHighlightIndex];
        currentElement.scrollIntoView({ behavior: "smooth", block: "center" });
        currentElement.style.backgroundColor = "yellow";

        console.log(`Navigated to result ${currentHighlightIndex + 1}/${highlightedResults.length}`);
    }

    function updateNavigationButtons() {
        const prevButton = document.getElementById('prev-button');
        const nextButton = document.getElementById('next-button');

        if (highlightedResults.length > 0) {
            prevButton.disabled = false;
            nextButton.disabled = false;
        } else {
            prevButton.disabled = true;
            nextButton.disabled = true;
        }
    }

    (function () {
        console.log("Starting script...");
        createFloatingWindow();
        monitorPage();
    })();
})();
