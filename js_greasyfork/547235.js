// ==UserScript==
// @name         Market Resale Helper TornW3B
// @namespace    http://tampermonkey.net/
// @version      2025-08-26 v2
// @description  Calculate suggested resale prices (quantile, median, cluster) on TornW3B
// @match        *://weav3r.dev/item/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=weav3r.dev
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547235/Market%20Resale%20Helper%20TornW3B.user.js
// @updateURL https://update.greasyfork.org/scripts/547235/Market%20Resale%20Helper%20TornW3B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("✅ Market Helper v6 started");

    // --- Config defaults ---
    let BULK_QTY_MIN = 20;
    let BULK_PCT_MIN = 0.10;

    // --- Utils ---
    const fmt = (v) => (v !== null && v !== undefined) ? v.toLocaleString() : "—";
    const diffPct = (p, marketMin) =>
        (p && marketMin) ? ((p - marketMin) / marketMin * 100).toFixed(1) + "%" : "—";

    // --- Pricing methods ---
    function calcQuantile(offers, fraction) {
        offers.sort((a,b) => a.price - b.price);
        const total = offers.reduce((s,o) => s + o.qty, 0);
        let cumulative = 0;
        const threshold = total * fraction;
        for (let o of offers) {
            cumulative += o.qty;
            if (cumulative >= threshold) return o.price - 1;
        }
        return offers[offers.length-1].price;
    }

    function calcMedian(offers) {
        offers.sort((a,b) => a.price - b.price);
        const total = offers.reduce((s,o) => s + o.qty, 0);
        const half = Math.floor(total / 2);
        let cumulative = 0;
        for (let o of offers) {
            cumulative += o.qty;
            if (cumulative >= half) return o.price;
        }
        return offers[Math.floor(offers.length/2)].price;
    }

    function calcCluster(offers) {
        offers.sort((a,b) => a.price - b.price);
        let bestPrice = offers[0].price;
        let bestCount = 0;
        for (let i = 0; i < offers.length; i++) {
            const p = offers[i].price;
            const upper = p * 1.05;
            let count = 0;
            for (let j = i; j < offers.length; j++) {
                if (offers[j].price <= upper) count += offers[j].qty;
                else break;
            }
            if (count > bestCount) {
                bestCount = count;
                bestPrice = p;
            }
        }
        return bestPrice - 1;
    }

    function calcClusterCapped(offers, marketMin) {
        let cluster = calcCluster(offers);
        let cap = Math.round(marketMin * 1.5);
        return Math.min(cluster, cap);
    }

    // --- Bulk detection ---
    function detectBulkAnchor(offers, marketMin) {
        const totalQty = offers.reduce((s,o) => s + o.qty, 0);
        offers.sort((a,b) => a.price - b.price);

        for (let i = 0; i < offers.length; i++) {
            let bandQty = 0;
            const p = offers[i].price;
            const upper = p * 1.05;
            for (let j = i; j < offers.length; j++) {
                if (offers[j].price <= upper) bandQty += offers[j].qty;
                else break;
            }
            if (bandQty >= BULK_QTY_MIN || bandQty >= totalQty * BULK_PCT_MIN) {
                if (p <= marketMin * 1.5) {
                    return {price: p, qty: bandQty};
                }
            }
        }
        return null;
    }

    // --- Parse offers ---
    function parseOffers() {
        let offers = [];
        let inferredMarkets = [];

        // grab all grid rows
        let rows = document.querySelectorAll("div.grid");

        rows.forEach((row, idx) => {
            let cols = row.querySelectorAll(":scope > div");
            if (cols.length === 5) {
                // skip header row (first one with "Player/Qty/Price")
                if (idx === 0) return;

                // qty
                let qty = parseInt(cols[1].innerText.replace(/[^0-9]/g, ""), 10);

                // price
                let priceSpan = cols[2].querySelector("span");
                let priceText = priceSpan ? priceSpan.textContent.trim() : "0";
                let price = parseInt(priceText.replace(/[^0-9]/g, ""), 10);

                // vsMarket
                let vsSpan = cols[3].querySelector("span");
                let vsText = vsSpan ? vsSpan.textContent.trim() : "0"; // "-12%" or "+25%"
                let vsMarket = parseFloat(vsText.replace("%","").replace("+","")) || 0;

                if (!isNaN(price) && !isNaN(qty)) {
                    let inferred = price / (1 + vsMarket/100);
                    inferredMarkets.push(inferred);
                    console.log("Row parsed:", {
                        qty, price, rawVs: vsText, vsMarket, inferredMarket: inferred.toFixed(2)
                    });
                    offers.push({price, qty, vsMarket});
                }
            }
        });

        // median inferred market
        inferredMarkets.sort((a,b) => a-b);
        let marketMin = inferredMarkets.length > 0
            ? Math.round(inferredMarkets[Math.floor(inferredMarkets.length/2)])
            : null;

        console.log("✅ Parsed offers:", offers.length, "| MarketMin:", marketMin);
        return {offers, marketMin};
    }

    // --- Trim dataset ---
    function trimOffers(offers) {
        offers.sort((a,b) => a.price - b.price);
        return offers.filter(o => o.vsMarket <= 200); // remove >+100% vs market
    }

    // --- Auto-scroll ---
    function autoScrollTable(callback) {
        let container = document.querySelector("div.overflow-y-auto");
        if (!container) { callback(); return; }
        let lastCount = 0, tries = 0;
        const interval = setInterval(() => {
            container.scrollBy(0, 800);
            let rows = document.querySelectorAll("div.grid");
            let dataRows = Array.from(rows).filter(r => r.querySelectorAll(":scope > div").length === 5);
            if (dataRows.length > lastCount) { lastCount = dataRows.length; tries = 0; }
            else tries++;
            if (tries > 5) {
                clearInterval(interval);
                container.scrollTo(0, 0);
                console.log("✅ Auto-scroll finished with", dataRows.length, "rows");
                callback();
            }
        }, 500);
    }

    // --- Show results ---
    function injectResult() {
        let parsed = parseOffers();
        let offers = parsed.offers;
        let marketMin = parsed.marketMin;
        if (offers.length === 0 || !marketMin) return;

        let relevant = trimOffers(offers);
        console.log("📊 Relevant offers:", relevant.length, "of", offers.length);

        let fast    = calcQuantile(relevant, 0.1);
        let medium  = calcQuantile(relevant, 0.3);
        let slow    = calcQuantile(relevant, 0.6);
        let median  = calcMedian(relevant);
        let cluster = calcCluster(relevant);
        let capped  = calcClusterCapped(relevant, marketMin);
        let bulk    = detectBulkAnchor(relevant, marketMin);

        let final   = bulk ? bulk.price : capped;

        let avgPrice = Math.round(
            relevant.reduce((s,o) => s + o.price * o.qty, 0) /
            relevant.reduce((s,o) => s + o.qty, 0)
        );

        let box = document.getElementById("market-helper-box");
        if (!box) {
            box = document.createElement("div");
            box.id = "market-helper-box";
            box.style.cssText = `
                padding:10px;margin:10px 0;
                border:2px solid #4caf50;background:#e8f5e9;
                font-size:14px;border-radius:8px;
            `;
            let container = document.querySelector("div.overflow-x-auto");
            if (container) container.prepend(box);
            else document.body.prepend(box);

            // controls
            let controls = document.createElement("div");
            controls.style.margin = "5px 0";
            controls.innerHTML = `
                Bulk min qty: <input id="bulkQtyInput" type="number" value="${BULK_QTY_MIN}" style="width:60px">
                Bulk min %: <input id="bulkPctInput" type="number" value="${BULK_PCT_MIN*100}" style="width:60px">%
            `;
            box.before(controls);

            document.getElementById("bulkQtyInput").addEventListener("change", e=>{
                BULK_QTY_MIN = parseInt(e.target.value,10) || 20;
                injectResult();
            });
            document.getElementById("bulkPctInput").addEventListener("change", e=>{
                BULK_PCT_MIN = (parseFloat(e.target.value)||10)/100;
                injectResult();
            });
        }

        box.innerHTML = `
            <b>💡 Smart Resale Analysis (${relevant.length}/${offers.length} offers):</b><br>
            ⭐ Final Recommended: <b style="color:darkgreen;font-size:16px">${fmt(final)}</b>
              (${diffPct(final, marketMin)} vs market)<br>
            Bulk Anchor: <b>${bulk ? fmt(bulk.price)+" ("+bulk.qty+" items)" : "—"}</b><br>
            <hr>
            Fast (10%): <b>${fmt(fast)}</b> (${diffPct(fast, marketMin)})<br>
            Medium (30%): <b>${fmt(medium)}</b> (${diffPct(medium, marketMin)})<br>
            Slow (60%): <b>${fmt(slow)}</b> (${diffPct(slow, marketMin)})<br>
            Median: <b>${fmt(median)}</b> (${diffPct(median, marketMin)})<br>
            Cluster: <b>${fmt(cluster)}</b> (${diffPct(cluster, marketMin)})<br>
            Cluster+Cap: <b>${fmt(capped)}</b> (${diffPct(capped, marketMin)})<br>
            <hr>
            Market min (from vsMarket): <b>${fmt(marketMin)}</b><br>
            Average (trimmed): <b>${fmt(avgPrice)}</b>
        `;
    }

    // --- Runner ---
    function runFullCycle() {
        autoScrollTable(() => injectResult());
    }

    setTimeout(runFullCycle, 20000);
    setInterval(runFullCycle, 300000);

})();





