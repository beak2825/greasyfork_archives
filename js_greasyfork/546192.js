// ==UserScript==
// @name         AdGuard DNS + Anti-Adblock Handler (Modal Popup)
// @namespace    https://adguardteam.github.io/
// @version      1.1
// @description  Blocks domains via AdGuard DNS filter + handles adblock testers with styled popup modal
// @author       You
// @match        *://*/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/546192/AdGuard%20DNS%20%2B%20Anti-Adblock%20Handler%20%28Modal%20Popup%29.user.js
// @updateURL https://update.greasyfork.org/scripts/546192/AdGuard%20DNS%20%2B%20Anti-Adblock%20Handler%20%28Modal%20Popup%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const FILTER_URL = "https://adguardteam.github.io/AdGuardSDNSFilter/Filters/filter.txt";
    const CACHE_KEY = "adguard_filter_cache";
    const CACHE_TIME_KEY = "adguard_filter_cache_time";
    const CACHE_TTL = 24 * 60 * 60 * 1000; // 24h
    let blockedDomains = [];

    // Load filter list with caching
    function loadFilterList() {
        let lastFetch = GM_getValue(CACHE_TIME_KEY, 0);
        let now = Date.now();

        if (now - lastFetch < CACHE_TTL) {
            blockedDomains = GM_getValue(CACHE_KEY, []);
            console.log("[AdGuard Script] Loaded cached domains:", blockedDomains.length);
            return;
        }

        GM_xmlhttpRequest({
            method: "GET",
            url: FILTER_URL,
            onload: function(response) {
                const lines = response.responseText.split("\n");
                blockedDomains = lines
                    .filter(line => line.startsWith("||"))
                    .map(line => line.replace("||", "").replace("^", "").trim());
                GM_setValue(CACHE_KEY, blockedDomains);
                GM_setValue(CACHE_TIME_KEY, now);
                console.log("[AdGuard Script] Updated filter list:", blockedDomains.length);
            },
            onerror: function() {
                console.warn("[AdGuard Script] Failed to fetch filter list");
                blockedDomains = GM_getValue(CACHE_KEY, []);
            }
        });
    }

    // Block network requests (XHR + fetch)
    const origOpen = window.XMLHttpRequest.prototype.open;
    window.XMLHttpRequest.prototype.open = function(method, url) {
        if (blockedDomains.some(domain => url.includes(domain))) {
            console.warn("[AdGuard Script] Blocked request:", url);
            return; // cancel
        }
        return origOpen.apply(this, arguments);
    };

    const origFetch = window.fetch;
    window.fetch = function(input, init) {
        const url = typeof input === "string" ? input : input.url;
        if (blockedDomains.some(domain => url.includes(domain))) {
            console.warn("[AdGuard Script] Blocked fetch:", url);
            return Promise.reject("Blocked by AdGuard Userscript");
        }
        return origFetch.apply(this, arguments);
    };

    // Watch DOM for ad elements and remove them
    const observer = new MutationObserver(() => {
        blockedDomains.forEach(domain => {
            document.querySelectorAll(`img[src*="${domain}"], iframe[src*="${domain}"], script[src*="${domain}"]`)
                .forEach(el => {
                    console.warn("[AdGuard Script] Removed element:", el.src);
                    el.remove();
                });
        });
    });
    observer.observe(document, { childList: true, subtree: true });

    // Show styled popup modal
    function showAntiAdblockModal() {
        let modal = document.createElement("div");
        modal.innerHTML = `
            <div id="adblock-modal" style="
                position: fixed;
                top: 0; left: 0; right: 0; bottom: 0;
                background: rgba(0,0,0,0.6);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 999999;">
                <div style="
                    background: #fff;
                    padding: 20px 30px;
                    border-radius: 8px;
                    max-width: 400px;
                    text-align: center;
                    font-family: Arial, sans-serif;">
                    <h2 style="margin: 0 0 10px; color: #e74c3c;">⚠ AdBlock Detected</h2>
                    <p style="margin: 0 0 15px; font-size: 15px; color: #333;">
                        This site has detected you are using an Ad Blocker.<br>
                        Please disable it to continue browsing smoothly.
                    </p>
                    <button id="disable-adblock-btn" style="
                        background: #e74c3c;
                        color: #fff;
                        padding: 10px 20px;
                        border: none;
                        border-radius: 5px;
                        font-size: 14px;
                        cursor: pointer;">
                        I Understand
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById("disable-adblock-btn").addEventListener("click", () => {
            document.getElementById("adblock-modal").remove();
        });
    }

    // Detect anti-adblock attempts
    function antiAdblockWatcher() {
        let bait = document.createElement("div");
        bait.className = "ad ad-banner ad-unit adblock-detect";
        bait.style.position = "absolute";
        bait.style.left = "-9999px";
        document.body.appendChild(bait);

        setTimeout(() => {
            if (bait.offsetParent === null || bait.offsetHeight === 0 || bait.offsetWidth === 0) {
                // Triggered anti-adblock detection
                showAntiAdblockModal();
            }
            bait.remove();
        }, 1500);
    }

    window.addEventListener("load", antiAdblockWatcher);

    // Run filter loading
    loadFilterList();
})();