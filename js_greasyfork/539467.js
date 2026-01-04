// ==UserScript==
// @name         TFMI Integration with Loader
// @namespace    http://tampermonkey.net/
// @version      4.1
// @description  Add TFMI results to ThaiFriendly usernames using loader.php.
// @author       You
// @match        *://*.thaifriendly.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @connect      tfmi.wtf
// @downloadURL https://update.greasyfork.org/scripts/539467/TFMI%20Integration%20with%20Loader.user.js
// @updateURL https://update.greasyfork.org/scripts/539467/TFMI%20Integration%20with%20Loader.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log("TFMI Integration script loaded.");

    /*****************************************************************
    *  Simple TFMI username cache
    *****************************************************************/
    const MISS_TTL_HOURS = 3; // re-try misses after this many hours
    // Hits will always be hits - no TTL needed!

    // Temporary cache for current worker
    const sessionCache = new Map();

    function now() { return Date.now(); }
    function hours(ms) { return ms / 36e5; }
    function cacheKey(u) { return 'tfmi:' + u.toLowerCase(); }

    function readCache(username) {
        const key = cacheKey(username);
        if (sessionCache.has(key)) return sessionCache.get(key);

        const stored = GM_getValue(key, null); // null if nothing saved
        if (!stored) return null; // no info

        const { hit, ts } = JSON.parse(stored);
        if (!hit && hours(now() - ts) > MISS_TTL_HOURS) {
            // old miss - let it expire
            GM_deleteValue(key);
            return null;
        }
        sessionCache.set(key, hit); // hydrate tab cache
        return hit; // true or false
    }

    function writeCache(username, hit) {
        const key = cacheKey(username);
        sessionCache.set(key, hit);
        // Always save hits. Save misses too if a TTL has been set.
        if (hit || MISS_TTL_HOURS > 0) {
            GM_setValue(key, JSON.stringify({ hit, ts: now() }));
        }
    }

    /*****************************************************************
    *  Check TFMI results using loader.php
    *****************************************************************/
    function checkTfmi(username, callback) {
        // check cache first
        const cached = readCache(username);
        if (cached !== null) {
            console.log("Cache hit! This username was already checked");
            callback(cached);
            return;
        }

        // Fall back to loader.php
        const loaderUrl = `https://tfmi.wtf/loader.php?search=${username}&tamper=monkey`;
        GM_xmlhttpRequest({
            method: 'GET',
            url: loaderUrl,
            onload(response) {
                if (response.status === 200) {
                    const doc = new DOMParser().parseFromString(response.responseText, "text/html");
                    const hit = !doc.querySelector("legend")?.textContent.includes("0 Listings");

                    // write response into both session + persistent cache
                    writeCache(username, hit);
                    callback(hit);
                } else {
                    console.error(`Error fetching TFMI for ${username}:`, response.status);
                    callback(null);
                }
            },
            onerror() {
                console.error(`TFMI request failed for ${username}`);
                callback(null);
            }
        });
    }

    /*****************************************************************
    *  Add TFMI indicator to a specific username element
    *****************************************************************/
    function addTfmiIndicator(anchorEl, username) {
        // already in flight or finished?  bail early
        if (anchorEl.hasAttribute('data-tfmi-processed')) return;

        // mark immediately so the next poll skips this element
        anchorEl.setAttribute('data-tfmi-processed', 'pending');

        checkTfmi(username, hasResults => {
            // remove any old duplicates just in case
            anchorEl.querySelectorAll('.tfmi-indicator').forEach(n => n.remove());

            const indicator = document.createElement('span');
            indicator.className = 'tfmi-indicator';

            if (hasResults === true) {
                const link = document.createElement('a');
                link.href = `https://tfmi.wtf/?search=${username}&tamper=monkey`;
                link.textContent = ' 🔍 TFMI';
                link.target = '_blank';
                link.style.color = 'green';

                link.addEventListener(
                    'click',
                    e => e.stopImmediatePropagation(), // block TF hijack
                    true
                );
                indicator.appendChild(link);

            } else if (hasResults === false) {
                indicator.innerHTML = ' <span style="color:gray;">•</span>';
            } else {
                indicator.innerHTML = ' <span style="color:orange;">TFMI Error</span>';
            }

            anchorEl.appendChild(indicator);
            anchorEl.setAttribute('data-tfmi-processed', 'done'); // tidy status
        });
    }

    /*****************************************************************
    *  Username processing
    *****************************************************************/
    // Process usernames in the inbox
    function processInboxUsernames() {
        document.querySelectorAll('#unreadmessages .newmessage').forEach((el) => {
            const username = el.getAttribute('msgusr');
            if (username) {
                const detailsElement = el.querySelector('.messagedetails');
                if (detailsElement) {
                    addTfmiIndicator(detailsElement, username);
                }
            }
        });
    }

    // Process usernames in the search results
    function processSearchUsernames() {
        document.querySelectorAll('#searchresults .pusername').forEach((el) => {
            const username = extractUsername(el);
            if (username) {
                addTfmiIndicator(el, username);
            }
        });
    }

    function processListUsernames() {
        document.querySelectorAll('.thumbcontain .pusername').forEach((el) => {
            const username = extractUsername(el);
            if (username) {
                addTfmiIndicator(el, username);
            }
        });
    }

    // Correctly process usernames in the search results
    function extractUsername(el) {
        // make sure we’re looking at an <a> element
        const link = el.tagName === 'A' ? el : el.closest('a');
        if (link) {
            // get the href and strip ? or # if present
            const raw = (link.getAttribute('href') || '').split(/[?#]/)[0];
            if (raw) {
                const username = raw.split('/').filter(Boolean).pop();
                if (username) return username;
            }
        }

        // fallback: use visible text and remove trailing ellipsis
        return (el.textContent || '').replace(/\u2026+$/, '').trim();
    }

    /*****************************************************************
    *  Polling mechanism
    *****************************************************************/
    function startPolling() {
        setInterval(() => {
            try {
                processInboxUsernames();
                processSearchUsernames();
                processListUsernames();
            } catch (err) {
                console.error("Error during polling:", err);
            }
        }, 500); // How often to poll
    }

    // Start the script
    console.log("TFMI script initializing...");
    startPolling();
})();
