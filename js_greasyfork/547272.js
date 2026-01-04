// ==UserScript==
// @name         Market Filter TornW3B
// @namespace    http://tampermonkey.net/
// @version      2025-09-03
// @description  Filter bazaar listings by max price and min quantity, with per-item saved settings
// @match        *://weav3r.dev/item/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=weav3r.dev
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547272/Market%20Filter%20TornW3B.user.js
// @updateURL https://update.greasyfork.org/scripts/547272/Market%20Filter%20TornW3B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("✅ Market Filter started");

    // --- Detect itemId from URL
    function getItemId() {
        let url = new URL(window.location.href);
        let path = url.pathname; // e.g. /item/902
        let parts = path.split("/");
        return parts.length >= 3 ? parts[2] : "default";
    }

    const itemId = getItemId();

    // --- Load/save thresholds
    function loadSettings() {
        let saved = localStorage.getItem("marketFilterSettings_" + itemId);
        if (saved) return JSON.parse(saved);
        return { maxPrice: 9999999, minQty: 1 };
    }

    function saveSettings(settings) {
        localStorage.setItem("marketFilterSettings_" + itemId, JSON.stringify(settings));
    }

    let settings = loadSettings();

    // --- UI box
    function injectControls() {
        let box = document.getElementById("market-filter-box");
        if (box) return;
        box = document.createElement("div");
        box.id = "market-filter-box";
        box.style.cssText = `
            padding:10px;margin:10px 0;
            border:2px solid #2196f3;background:#e3f2fd;
            font-size:14px;border-radius:8px;
        `;
        let container = document.querySelector("div.overflow-x-auto");
        if (container) container.prepend(box);
        else document.body.prepend(box);

        box.innerHTML = `
            <b>🔍 Filter Listings (saved for this item)</b><br>
            Max Price: <input id="filterMaxPrice" type="number" value="${settings.maxPrice}" style="width:80px">
            Min Qty: <input id="filterMinQty" type="number" value="${settings.minQty}" style="width:60px">
            <button id="filterSaveBtn">Save</button>
            <button id="filterApplyBtn">Apply</button>
        `;

        document.getElementById("filterSaveBtn").addEventListener("click", () => {
            settings.maxPrice = parseInt(document.getElementById("filterMaxPrice").value, 10) || 9999999;
            settings.minQty = parseInt(document.getElementById("filterMinQty").value, 10) || 1;
            saveSettings(settings);
            filterRows();
        });

        document.getElementById("filterApplyBtn").addEventListener("click", () => {
            settings.maxPrice = parseInt(document.getElementById("filterMaxPrice").value, 10) || 9999999;
            settings.minQty = parseInt(document.getElementById("filterMinQty").value, 10) || 1;
            filterRows();
        });
    }

    // --- Filtering
    function filterRows() {
        let rows = document.querySelectorAll("div.grid");
        rows.forEach((row, idx) => {
            let cols = row.querySelectorAll(":scope > div");
            if (cols.length === 5) {
                // skip header
                if (idx === 0) return;

                // qty
                let qty = parseInt(cols[1].innerText.replace(/[^0-9]/g, ""), 10);

                // price
                let priceSpan = cols[2].querySelector("span");
                let priceText = priceSpan ? priceSpan.textContent.trim() : "0";
                let price = parseInt(priceText.replace(/[^0-9]/g, ""), 10);

                // check filters
                if (qty >= settings.minQty && price <= settings.maxPrice) {
                    row.style.display = "";
                } else {
                    row.style.display = "none";
                }
            }
        });
        console.log(`📊 Filter applied: maxPrice=${settings.maxPrice}, minQty=${settings.minQty}`);
    }

    // --- Auto-scroll then filter
    function autoScrollTable(callback) {
        let container = document.querySelector("div.overflow-y-auto");
        if (!container) { callback(); return; }
        let lastCount = 0, tries = 0;
        const interval = setInterval(() => {
            container.scrollBy(0, 800);
            let rows = document.querySelectorAll("div.grid");
            if (rows.length > lastCount) { lastCount = rows.length; tries = 0; }
            else tries++;
            if (tries > 5) {
                clearInterval(interval);
                container.scrollTo(0, 0);
                console.log("✅ Auto-scroll finished with", rows.length, "rows");
                callback();
            }
        }, 500);
    }

    // --- Runner
    function run() {
        injectControls();
        autoScrollTable(() => filterRows());
    }

    setTimeout(run, 2000);

})();
