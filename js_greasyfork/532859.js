// ==UserScript==
// @name         Ali Coin Sum mobile view
// @namespace    http://tampermonkey.net/
// @version      2025-04-14
// @description  Aliexpress. Sum up daily coin earnings
// @author       You
// @match        https://m.aliexpress.com/p/coin-search/coinflow.html*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aliexpress.com
// @grant        GM_addStyle
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/532859/Ali%20Coin%20Sum%20mobile%20view.user.js
// @updateURL https://update.greasyfork.org/scripts/532859/Ali%20Coin%20Sum%20mobile%20view.meta.js
// ==/UserScript==


(function() {
    'use strict';

    console.log("AliExpress Coin Flow Enhancer v2.7.1: Script starting...");

    // --- Configuration ---
    const COIN_FLOW_ITEM_SELECTOR = '.GoldCoinFlow--goldCoinFlow--1hozHkz';
    const DATE_SELECTOR = '.GoldCoinFlow--date--33MScdw';
    const TITLE_SELECTOR = '.GoldCoinFlow--title--3BSvwVX';
    const POINTS_SELECTOR = '.GoldCoinFlow--num--3MOA5EB';
    const TARGET_TITLE = 'Store daily check-in'; // Title to get specific sum for
    const CONTENT_WRAPPER_SELECTOR = '.CoinFlowTab--content--2oKHpBB';
    const DEBOUNCE_DELAY = 750;
    const DATA_ORIGINAL_POINTS = 'data-original-points-val';
    const MAX_INITIAL_CHECKS = 10;
    const INITIAL_CHECK_INTERVAL = 1000;

    // --- Styles ---
    const customCSS = `
        .header-group {display: none !important;  }
        .container { padding-top: 1vw !important;  }
        .GoldCoinFlow--goldCoinFlow--1hozHkz { height: 13.2vw !important;  }
        .GoldCoinFlow--content--2aAoyNf { padding: 0px !important;  }
        .GoldCoinFlow--num--3MOA5EB { font-size: 3.3vw !important; }
    `;

    try {
        GM_addStyle(customCSS);
        console.log("Custom CSS applied successfully.");
    } catch (e) {
        console.error("AliExpress Coin Flow Enhancer: ERROR applying styles: ", e);
    }

    // --- State Variables ---
    let debounceTimer;
    let calculationRunning = false;
    let initialCheckCounter = 0;
    let observer = null;

    /** Extracts the date part (e.g., "Apr 14, 2025") */
    function getDayKeyFromDateString(dateStr) {
        if (!dateStr) return null;
        const dateMatch = dateStr.match(/^(\w+\s+\d+,\s+\d{4})/);
        return dateMatch ? dateMatch[1].trim() : null;
    }

    // --- Core Calculation Function ---
    function calculateAndDisplayTotals() {
        if (calculationRunning) { return; }
        calculationRunning = true;
        // console.log("Calculating totals..."); // Optional debug

        const dailySums = {};
        const flowItems = document.querySelectorAll(COIN_FLOW_ITEM_SELECTOR);

        if (flowItems.length === 0) { calculationRunning = false; return; }

        // Step 0: Reset display
        flowItems.forEach(item => {
            const pointsEl = item.querySelector(POINTS_SELECTOR);
            if (pointsEl) {
                if (!pointsEl.hasAttribute(DATA_ORIGINAL_POINTS)) {
                    pointsEl.setAttribute(DATA_ORIGINAL_POINTS, pointsEl.textContent?.trim() || '');
                }
                const originalValue = pointsEl.getAttribute(DATA_ORIGINAL_POINTS);
                if (pointsEl.textContent !== originalValue) {
                    pointsEl.textContent = originalValue;
                    pointsEl.removeAttribute('title');
                }
            }
        });

        // Step 1: Calculate sums
        flowItems.forEach(item => {
            const dateEl = item.querySelector(DATE_SELECTOR);
            const titleEl = item.querySelector(TITLE_SELECTOR);
            const pointsEl = item.querySelector(POINTS_SELECTOR);
            const originalPointsText = pointsEl ? pointsEl.getAttribute(DATA_ORIGINAL_POINTS) : null;

            if (!dateEl || !titleEl || originalPointsText === null) return;

            const titleStr = titleEl.textContent?.trim();
            const dayKey = getDayKeyFromDateString(dateEl.textContent?.trim());

            if (!dayKey) return;

            const points = parseInt(originalPointsText.replace(/[^\d-]/g, ''), 10);

            if (!isNaN(points)) {
                if (!dailySums[dayKey]) {
                    dailySums[dayKey] = { total: 0, storeCheckin: 0 };
                }
                dailySums[dayKey].total += points;
                if (titleStr === TARGET_TITLE) {
                    dailySums[dayKey].storeCheckin += points;
                }
            }
        });
        // console.log("Sums calculated:", JSON.stringify(dailySums)); // Optional debug

        // --- Step 2: Update display (conditionally add Store total) ---
        let updatedCount = 0;
        flowItems.forEach(item => {
            const dateEl = item.querySelector(DATE_SELECTOR);
            const pointsEl = item.querySelector(POINTS_SELECTOR);
            const titleEl = item.querySelector(TITLE_SELECTOR); // Need title again for check
            const dayKey = getDayKeyFromDateString(dateEl?.textContent?.trim());

            if (!pointsEl || !dayKey || !titleEl) return; // Need all elements + dayKey

            const sumsForThisDay = dailySums[dayKey];
            const originalText = pointsEl.getAttribute(DATA_ORIGINAL_POINTS);
            const titleStr = titleEl.textContent?.trim(); // Get title text

            if (sumsForThisDay && originalText !== null) {
                let summaryText = ""; // Initialize empty summary

                // Check if the current item is the specific one we track
                if (titleStr === TARGET_TITLE) {
                    // Format for the specific item (Store + Total)
                    summaryText = ` | Store: +${sumsForThisDay.storeCheckin}. Total: +${sumsForThisDay.total}`;
                } else {
                    // Format for all other items (Total only)
                    summaryText = ` | Total: +${sumsForThisDay.total}`;
                }

                const newText = originalText + summaryText;

                if (pointsEl.textContent !== newText) {
                    pointsEl.textContent = newText;
                    pointsEl.title = newText;
                    updatedCount++;
                }
            }
        });

        if (updatedCount > 0) {
            console.log(`AliExpress Coin Flow Enhancer: Updated display for ${updatedCount} elements.`);
        }
        calculationRunning = false;
        // console.log("Calculation finished."); // Optional debug
    }

    // --- Observer Setup --- (No changes needed)
    function setupObserver() {
        const targetNode = document.querySelector(CONTENT_WRAPPER_SELECTOR);
        if (!targetNode) {
            console.error(`AliExpress Coin Flow Enhancer: Observer target node '${CONTENT_WRAPPER_SELECTOR}' not found.`);
            return null;
        }
        const observerCallback = function(mutationsList, obs) {
            let relevantChangeDetected = false;
            for(const mutation of mutationsList) {
                if (mutation.type === 'childList' && (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0)) {
                   relevantChangeDetected = true; break;
                }
            }
            if(relevantChangeDetected) {
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(calculateAndDisplayTotals, DEBOUNCE_DELAY);
            }
        };
        const obs = new MutationObserver(observerCallback);
        const config = { childList: true, subtree: true };
        obs.observe(targetNode, config);
        console.log("AliExpress Coin Flow Enhancer: MutationObserver started.");
        return obs;
    }

    // --- Initialisation Logic --- (No changes needed)
    function initialCheck() {
        initialCheckCounter++;
        const flowItems = document.querySelectorAll(COIN_FLOW_ITEM_SELECTOR);
        const container = document.querySelector(CONTENT_WRAPPER_SELECTOR);

        if (flowItems.length > 0 && container) {
            console.log("AliExpress Coin Flow Enhancer: Initial items found. Running calculation and starting observer.");
            calculateAndDisplayTotals();
            if (!observer) { observer = setupObserver(); }
        } else if (initialCheckCounter < MAX_INITIAL_CHECKS) {
            setTimeout(initialCheck, INITIAL_CHECK_INTERVAL);
        } else {
            console.warn(`AliExpress Coin Flow Enhancer: Max checks reached. Initial items/container not found. Attempting observer setup.`);
            if (!observer && container) { observer = setupObserver(); }
            setTimeout(calculateAndDisplayTotals, 5000);
        }
    }

    // --- Start ---
    setTimeout(initialCheck, 500);

})();