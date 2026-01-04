// ==UserScript==
// @name         IdleRPG - XP Per Hour
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Show XP/H on actions
// @author       jaan
// @match        https://idle.vidski.dev/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vidski.dev
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/525682/IdleRPG%20-%20XP%20Per%20Hour.user.js
// @updateURL https://update.greasyfork.org/scripts/525682/IdleRPG%20-%20XP%20Per%20Hour.meta.js
// ==/UserScript==

const ONE_HOUR_SECONDS = 60 * 60;
const TABLE_ELEMENTS_SELECTOR = ".data-\\[state\\=selected\\]\\:bg-muted";

(() => {
    function generateXPH() {
        let actions = document.querySelectorAll(TABLE_ELEMENTS_SELECTOR);
        actions.forEach((action) => {
            let tdElements = action.querySelectorAll("td");
            // Since query selector includes object that we don't want to monitor, skip elements with length under 3
            // These are the elements under rewards and leaderboard
            if (tdElements.length <= 3) {
                return;
            }

            const xp = tdElements[1].innerText.split(' ')[0];
            const time = tdElements[2].innerText.slice(0, -1);
            const xph = (ONE_HOUR_SECONDS / time * xp);

            if (Number.isNaN(xph)) {
                return;
            }

            const xphSpan = document.createElement("span");
            xphSpan.className = "flex";
            xphSpan.innerText = `${xph.toFixed(2)} xp/h`;
            xphSpan.style.color = "green";

            tdElements[2].appendChild(xphSpan);
        });
    }
    // Wait for actions to load in
    function setupRootObserver() {
        const root = document.getElementById("root");

        // Wait until actions are loaded in
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.className === "animate-fade-in") {
                        generateXPH();
                        setupTableChangeObserver();
                    }
                });
            });
        }).observe(root, { childList: true });
    }
    // In skills with multiple selections (like Smithing), we need to recalculate values
    // every time the selection changes
    function setupTableChangeObserver() {
        let previousElements = document.querySelectorAll(TABLE_ELEMENTS_SELECTOR);

        const observer = new MutationObserver((mutations) => {
            let currentElements = document.querySelectorAll(TABLE_ELEMENTS_SELECTOR);
            // Number of elements has changed
            if (currentElements.length !== previousElements.length) {
                previousElements = currentElements;
            } else {
                let elementsChanged = false;
                currentElements.forEach((elem, index) => {
                    let currTdElements = elem.querySelectorAll("td");
                    // Since query selector includes object that we don't want to monitor, skip elements with length 3
                    // These are the elements under rewards
                    if (elem !== previousElements[index] && currTdElements.length !== 3) {
                        elementsChanged = true;
                    }
                });
                // Elements themselves have changed
                if (elementsChanged) {
                    previousElements = currentElements;
                    generateXPH();
                }
            }
        }).observe(document.body, { childList: true, subtree: true });
        previousElements = document.querySelectorAll(TABLE_ELEMENTS_SELECTOR);
    }

    // Handle checking URL change
    let lastUrl = location.href;

    new MutationObserver(() => {
        const currentUrl = location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            generateXPH();
        }
    }).observe(document, { subtree: true, childList: true });

    // Initial run
    setupRootObserver();
})();