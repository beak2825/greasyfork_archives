// ==UserScript==
// @name         Torn Stat Estimator - Working Version
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Estimate Torn user battle stats directly on profile pages using public API data (fixed wrong fields error)
// @author       You
// @match        https://www.torn.com/profiles.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537040/Torn%20Stat%20Estimator%20-%20Working%20Version.user.js
// @updateURL https://update.greasyfork.org/scripts/537040/Torn%20Stat%20Estimator%20-%20Working%20Version.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const API_KEY = 'REPLACETHISWITHYOURAPIKEY'; // 🔒 Replace with your own API key

    // Wait for the profile page to load
    function waitForProfile() {
        return new Promise(resolve => {
            const interval = setInterval(() => {
                const nameElem = document.querySelector('span.bold');
                if (nameElem && nameElem.textContent.trim().length > 0) {
                    clearInterval(interval);
                    resolve();
                }
            }, 500);
        });
    }

    // Get Torn ID from the URL
    function getPlayerID() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('XID');
    }

    // ✅ Corrected API call: only using valid selection fields
    async function fetchUser(tornID) {
        const url = `https://api.torn.com/user/${tornID}?selections=basic&key=${API_KEY}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.error) throw new Error(`Torn API error: ${data.error.error}`);
        return data;
    }

    // Estimate based on basic info
    function estimateStats(data) {
        const baseStat = 1_500_000;
        const level = data.level ?? 0;
        const age = data.age ?? 0;

        const levelFactor = 1 + (level / 1000);
        const ageFactor = 1 + (age / 3650); // age is in days

        const modifier = levelFactor * ageFactor;
        const estimateLow = baseStat * modifier * 0.85;
        const estimateHigh = baseStat * modifier * 1.15;

        return {
            low: Math.round(estimateLow).toLocaleString(),
            high: Math.round(estimateHigh).toLocaleString()
        };
    }

    function insertUI(estimates, name) {
        if (document.getElementById('tornStatEstimatorOverlay')) return;

        const container = document.createElement('div');
        container.id = 'tornStatEstimatorOverlay';
        container.style.position = 'fixed';
        container.style.top = '100px';
        container.style.right = '20px';
        container.style.zIndex = 9999;
        container.style.background = '#222';
        container.style.color = '#fff';
        container.style.padding = '12px 18px';
        container.style.border = '2px solid #444';
        container.style.borderRadius = '8px';
        container.style.fontSize = '14px';
        container.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
        container.style.fontFamily = 'Arial, sans-serif';
        container.style.minWidth = '180px';
        container.style.textAlign = 'center';

        container.innerHTML = `<b>🧠 Est. Stats for ${name}</b><br>
                               <span style="font-size:16px; font-weight:600;">${estimates.low}</span> &mdash;
                               <span style="font-size:16px; font-weight:600;">${estimates.high}</span>`;

        document.body.appendChild(container);
    }

    async function main() {
        await waitForProfile();
        const tornID = getPlayerID();
        if (!tornID) return;

        try {
            const userData = await fetchUser(tornID);
            const name = userData.name || "Unknown";
            const estimates = estimateStats(userData);
            insertUI(estimates, name);
        } catch (err) {
            console.error("Stat Estimator error:", err);
        }
    }

    main();
})();
