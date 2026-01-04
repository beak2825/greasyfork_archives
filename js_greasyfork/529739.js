// ==UserScript==
// @name         Torn Market Helper
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @description  Transfers recommended prices from Torn Market Recommender to Torn's item market using shared GM storage. Also saves available items on Torn's market page and exposes bridge functions for UI access. Watches for category changes dynamically to keep item list up to date.
// @author       FritzFrizzle [3030192]
// @match        *://torn-market-recommender.netlify.app/*
// @match        *://www.torn.com/page.php?sid=ItemMarket*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529739/Torn%20Market%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/529739/Torn%20Market%20Helper.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    const STORAGE_KEY_PRICES = 'tornMarketPrices';
    const STORAGE_KEY_ITEMS = 'tornMarketItems';

    function logMessage(message) {
        console.log(`[TMH] ${message}`);
    }

    const keys = await GM_listValues();
    logMessage(`📜 Available GM storage keys on ${location.hostname}: ${JSON.stringify(keys)}`);

    if (location.hostname.includes("torn-market-recommender.netlify.app")) {
        initRecommender();
    } else if (location.hostname.includes("www.torn.com")) {
        initTornMarket();
    }

    // ============================
    // 🔵 Torn Market Recommender Side (torn-market-recommender.netlify.app)
    // ============================

    function initRecommender() {
        logMessage("Running on Torn Market Recommender. Watching for Copy Prices button...");
        observeForCopyButton();
        exposeBridgeFunctions();
    }

    function observeForCopyButton() {
        const observer = new MutationObserver(() => {
            const copyButton = document.getElementById("copyPricesButton");
            if (copyButton) {
                logMessage("✅ #copyPricesButton detected! Attaching event...");
                copyButton.removeEventListener("click", onCopyPricesClicked);
                copyButton.addEventListener("click", onCopyPricesClicked);
                observer.disconnect();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    async function onCopyPricesClicked() {
        logMessage("📢 [Copy Prices] button clicked. Gathering data...");
        const priceData = [];

        document.querySelectorAll('.item-table').forEach(table => {
            const itemHeader = table.querySelector('td b');
            const nameElement = table.querySelector('.item-name');
            if (!itemHeader) return;

            const idMatch = itemHeader.textContent.match(/\((\d+)\)$/);
            const itemId = idMatch ? idMatch[1].trim() : null;
            if (!itemId) return;

            const itemName = nameElement?.textContent.trim() || "Unknown Item";
            const priceCell = table.querySelector('.recommended-price');
            if (!priceCell) return;

            const recommendedPrice = priceCell.textContent.replace(/\D/g, '');
            priceData.push({ itemId, itemName, recommendedPrice });
        });

        if (!priceData.length) {
            logMessage("❌ No prices found to copy.");
            return;
        }

        logMessage(`✅ Storing ${priceData.length} price entries via GM_setValue.`);
        await GM_setValue(STORAGE_KEY_PRICES, JSON.stringify(priceData));
    }

    function exposeBridgeFunctions() {
        if (typeof unsafeWindow !== 'undefined') {
            unsafeWindow.getTornMarketItems = async function () {
                const raw = await GM_getValue(STORAGE_KEY_ITEMS, '[]');
                try {
                    return JSON.parse(raw);
                } catch (e) {
                    logMessage("❌ Failed to parse tornMarketItems in bridge function.");
                    return [];
                }
            };
        }
    }

    // ============================
    // 🔵 Torn.com Side (www.torn.com)
    // ============================

    async function initTornMarket() {
        logMessage("Running on Torn.com. Saving item list and setting up price application...");
        await waitForFirstLoad();
        observeVisiblePanelDynamically(); // <-- new dynamic watcher
        setInterval(checkForPriceChangeAndApply, 1000);
        await checkForPriceChangeAndApply();
    }

    // Wait for the first tabpanel with content
    async function waitForFirstLoad() {
        while (true) {
            const panel = document.querySelector('[role="tabpanel"]:not([style*="clip"])');
            const rows = panel?.querySelectorAll(':scope > div.itemRowWrapper___cFs4O');
            if (rows && rows.length > 0) {
                await saveAvailableItems(panel, rows);
                break;
            }
            logMessage("⏳ Waiting for form to load...");
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    /**
     * Detects which tabpanel is currently visible and watches for its internal changes
     * using a MutationObserver. This handles Torn's use of Headless UI Tabs,
     * which do not trigger standard DOM mutation events when switching categories.
     *
     * We poll every 300ms to detect a new visible tabpanel (i.e. offsetParent !== null)
     * and re-attach the observer each time.
     */
    function observeVisiblePanelDynamically() {
        let lastPanel = null;
        let panelObserver = null;

        setInterval(() => {
            const panels = Array.from(document.querySelectorAll('[role="tabpanel"]'));
            const visiblePanel = panels.find(p => p.offsetParent !== null);

            if (!visiblePanel || visiblePanel === lastPanel) return;

            logMessage(`👀 New active panel detected: ${visiblePanel.id || '[unnamed]'}`);
            lastPanel = visiblePanel;

            if (panelObserver) panelObserver.disconnect();

            panelObserver = new MutationObserver(() => {
                const rows = visiblePanel.querySelectorAll(':scope > div.itemRowWrapper___cFs4O');
                if (rows.length > 0) {
                    saveAvailableItems(visiblePanel, rows);
                }
            });

            panelObserver.observe(visiblePanel, { childList: true, subtree: true });
        }, 300);
    }

    async function saveAvailableItems(panel, rows) {
        logMessage("📢 Extracting available items from market form...");
        const itemList = [];

        rows.forEach((row) => {
            const imgSrc = row?.children[0]?.children[0]?.children[0]?.children[0]?.src;
            const itemId = imgSrc?.match(/\/images\/items\/(\d+)\//)?.[1];

            const fullText = row?.children[0]?.children[1]?.children[1]?.textContent || "";
            const nameMatch = fullText.match(/Make my listing of (.+?) anonymous/i);
            const itemName = nameMatch ? nameMatch[1].trim() : "Unknown Item";

            if (itemId) {
                itemList.push({ itemId, itemName });
            }
        });

        if (itemList.length > 0) {
            await GM_setValue(STORAGE_KEY_ITEMS, JSON.stringify(itemList));
            logMessage(`✅ Stored ${itemList.length} item(s) for TMH.`);
        } else {
            logMessage("❌ No items detected to store for TMH.");
        }
    }

    async function checkForPriceChangeAndApply() {
        const rawStoredPrices = await GM_getValue(STORAGE_KEY_PRICES, "[]");
        if (rawStoredPrices !== "[]") {
            logMessage("📢 Applying stored prices...");
            try {
                const storedPrices = JSON.parse(rawStoredPrices);
                await applyPricesToForm(storedPrices);
                await GM_setValue(STORAGE_KEY_PRICES, "[]");
            } catch (error) {
                logMessage("❌ Error parsing or applying prices: " + error);
            }
        }
    }

    async function applyPricesToForm(storedPrices) {
        logMessage("📢 Applying stored prices to market form...");
        const panel = document.querySelector('[role="tabpanel"]:not([style*="clip"])');
        if (!panel) return;
        const rows = panel.querySelectorAll(':scope > div.itemRowWrapper___cFs4O');

        rows.forEach((row) => {
            const imgSrc = row?.children[0]?.children[0]?.children[0]?.children[0]?.src;
            const itemId = imgSrc?.match(/\/images\/items\/(\d+)\//)?.[1];
            if (!itemId) return;

            const match = storedPrices.find(p => p.itemId === itemId);
            if (!match) return;

            const priceInput = row?.children[0]?.children[1]?.children[3]?.children[0]?.children[0];
            if (!priceInput) return;

            priceInput.value = match.recommendedPrice;
            priceInput.dispatchEvent(new Event('input', { bubbles: true }));
            logMessage(`✅ Set price for itemId=${itemId} → $${match.recommendedPrice}`);
        });
    }

})();
