// ==UserScript==
// @name         BullX - Check DEXScreener Status
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Checks the DEX status every 3 seconds and updates the webpage. Stops when the DEX has been pre-paid or when navigating away from the target page on an SPA. Optimized for low resource usage and memory management, reacts to URL changes within the SPA correctly, and prevents duplicate elements.
// @author       darkrai on twitter!
// @match        https://bullx.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498484/BullX%20-%20Check%20DEXScreener%20Status.user.js
// @updateURL https://update.greasyfork.org/scripts/498484/BullX%20-%20Check%20DEXScreener%20Status.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let checkInterval;
    const updateIntervalSeconds = 3; // Interval in seconds
    const targetPagePattern = /\/terminal\?chainId=.*&address=.*/;
    let lastUpdatedTime = Date.now();
    let observer;
    let dexPaid = false; // Flag to indicate if DEX has been pre-paid

    function getToken() {
        const params = new URLSearchParams(window.location.search);
        return params.get('address');
    }

    function fetchDexStatus(url) {
        return fetch(url).then(response => {
            if (response.status === 404) {
                console.error('[DEX SCRIPT CHECK] ❗ 404 Error: Resource not found.');
                stopDexStatusCheck();
                return null;
            }
            return response.json();
        });
    }

    function generateRandomQuery() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        const length = Math.floor(Math.random() * 10) + 5;
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    function checkDexStatus() {
        if (dexPaid) {
            console.log('[DEX SCRIPT CHECK] ⛔ DEX already pre-paid, stopping checks.');
            stopDexStatusCheck();
            return;
        }

        console.log('[DEX SCRIPT CHECK] 🚀 Checking DEX status...');
        const token = getToken();
        if (!token) {
            console.error('[DEX SCRIPT CHECK] ❗ Token not found in URL.');
            stopDexStatusCheck();
            return;
        }
        const randomQuery = generateRandomQuery();
        const directUrl = `https://checkdex.xyz/api/checkToken?tokenAddress=${token}&${randomQuery}`;
        const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(directUrl)}`;

        fetchDexStatus(proxyUrl)
            .then(data => {
                if (!data || data.error) {
                    // If proxy request fails, log the error
                    console.log('[DEX SCRIPT CHECK] ❗ Proxy request failed.');
                    return;
                }
                console.log('[DEX SCRIPT CHECK] 📊 Data parsed:', data);
                const dexStatusSpan = document.getElementById('dex-status');
                if (data.exists) {
                    console.log('[DEX SCRIPT CHECK] ✅ DEX has been pre-paid on', data.symbol);
                    dexStatusSpan.innerHTML = 'Dex paid: <span style="color: green;">Yes</span>';
                    console.log('[DEX SCRIPT CHECK] ✅ Element modified: Dex paid: Yes');
                    dexPaid = true; // Set the flag to true
                    stopDexStatusCheck(); // Stop further checks if DEX has been pre-paid
                } else {
                    console.log('[DEX SCRIPT CHECK] ❌ DEX has NOT been pre-paid on', data.symbol);
                    dexStatusSpan.innerHTML = 'Dex paid: <span style="color: red;">No</span>';
                    console.log('[DEX SCRIPT CHECK] ❌ Element modified: Dex paid: No');
                }
                lastUpdatedTime = Date.now();
            })
            .catch(error => {
                console.error('[DEX SCRIPT CHECK] ❗ Error:', error);
            });
    }

    function updateLastUpdatedText() {
        const lastUpdatedSpan = document.getElementById('last-updated');
        if (lastUpdatedSpan) {
            const secondsAgo = Math.floor((Date.now() - lastUpdatedTime) / 1000);
            lastUpdatedSpan.textContent = `Last updated ${secondsAgo} seconds ago`;
        }
    }

    // Function to create the DEX status div
    function createDexStatusDiv() {
        if (document.getElementById('dex-status-container')) {
            console.log('[DEX SCRIPT CHECK] 🔄 DEX status div already exists.');
            return;
        }

        const targetDiv = document.querySelector('.p-4.max-h-full.h-full.relative.bg-grey-900.wallet-bg.overflow-y-auto.no-scrollbar');
        if (targetDiv) {
            console.log('[DEX SCRIPT CHECK] 📦 Creating DEX status div...');
            const newDiv = document.createElement('div');
            newDiv.id = 'dex-status-container';
            newDiv.className = 'p-4 mt-4 flex flex-col items-center justify-center border border-green-700 rounded bg-grey-850 z-10 relative';
            newDiv.innerHTML = `
                <div class="flex flex-col items-center">
                    <span class="font-bold text-white mb-2">DEX Status</span>
                    <span id="dex-status" class="font-medium text-white">Checking...</span>
                    <span id="last-updated" class="text-xs text-grey-400 mt-2">Last updated 0 seconds ago</span>
                    <a href="https://twitter.com/darkrai" target="_blank" class="text-blue-500 text-xs mt-2">Made by @darkrai on Twitter</a>
                </div>`;
            targetDiv.appendChild(newDiv);
            console.log('[DEX SCRIPT CHECK] ✅ DEX status div added.');
        } else {
            console.log('[DEX SCRIPT CHECK] ❗ Target div not found.');
        }
    }

    function startDexStatusCheck() {
        dexPaid = false; // Reset the dexPaid flag on start
        createDexStatusDiv();
        checkDexStatus(); // Initial check
        checkInterval = setInterval(() => {
            checkDexStatus();
        }, updateIntervalSeconds * 1000);
        console.log(`[DEX SCRIPT CHECK] ⏲️ Interval set for checking DEX status every ${updateIntervalSeconds} seconds.`);

        // Start interval to update last updated text
        setInterval(updateLastUpdatedText, 1000);
    }

    function stopDexStatusCheck() {
        if (checkInterval) {
            clearInterval(checkInterval);
            checkInterval = null;
            console.log('[DEX SCRIPT CHECK] 🛑 Stopped checking DEX status.');
        }
    }

    // Debounce function to limit calls to the observer callback
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // Monitor URL changes for SPA navigation
    observer = new MutationObserver(debounce(() => {
        if (window.location.href.match(targetPagePattern)) {
            console.log('[DEX SCRIPT CHECK] 🌐 Navigated to target page.');
            stopDexStatusCheck(); // Stop any previous interval
            startDexStatusCheck(); // Start a new check
        } else {
            stopDexStatusCheck();
            // Remove the DEX status div if navigating away
            const existingDiv = document.getElementById('dex-status-container');
            if (existingDiv) {
                existingDiv.remove();
                console.log('[DEX SCRIPT CHECK] 🗑️ Removed DEX status div.');
            }
        }
    }, 500));

    observer.observe(document.body, { childList: true, subtree: true });

    // Initial check
    window.addEventListener('load', () => {
        if (window.location.href.match(targetPagePattern)) {
            console.log('[DEX SCRIPT CHECK] 🌐 Initial page load matches target.');
            setTimeout(() => {
                console.log('[DEX SCRIPT CHECK] ⏳ 3 seconds wait over, starting...');
                startDexStatusCheck();
            }, 3000);
        }
    });
})();
