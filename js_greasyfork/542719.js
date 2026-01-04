// ==UserScript==
// @name         Torn Racing: Highlight Family Members
// @namespace    https://www.torn.com/
// @version      1.1
// @description  Highlights racers in yellow if they belong to TRF factions (requires public API key - caches info for 1 hour)
// @author       Hwa
// @match        https://www.torn.com/loader.php?sid=racing*
// @match        https://www.torn.com/page.php?sid=racing*
// @grant        GM_xmlhttpRequest
// @license      MIT I guess
// @connect      api.torn.com
// @downloadURL https://update.greasyfork.org/scripts/542719/Torn%20Racing%3A%20Highlight%20Family%20Members.user.js
// @updateURL https://update.greasyfork.org/scripts/542719/Torn%20Racing%3A%20Highlight%20Family%20Members.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const API_KEY = '2nbn2sxRftNI4hGa'; // 🔐 Insert your API key here
    const CACHE_KEY = 'trf_member_names';
    const CACHE_TTL = 60 * 60 * 1000; // 1 hour in milliseconds

    const targetFactions = [
        { id: 10566, name: 'The Rifle Company' },
        { id: 26154, name: 'The Rifle Medics' },
        { id: 47893, name: 'The Rifle Elites' },
        { id: 31397, name: 'The Rifle Hotel' }
    ];

    const memberNameCache = new Set();

    const delay = (ms) => new Promise(res => setTimeout(res, ms));

    function fetchFactionMembersByName(factionId) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://api.torn.com/v2/faction/${factionId}?selections=members&key=${API_KEY}`,
                onload: (response) => {
                    try {
                        const data = JSON.parse(response.responseText);
                        const members = data?.members || [];
                        const names = members.map(m => m.name);
                        resolve(names);
                    } catch (e) {
                        reject(e);
                    }
                },
                onerror: reject
            });
        });
    }

    async function loadAllFactionNames() {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
            const parsed = JSON.parse(cached);
            const age = Date.now() - parsed.timestamp;

            if (age < CACHE_TTL) {
                parsed.names.forEach(name => memberNameCache.add(name));
                console.log(`[Torn Racing Highlighter] Loaded ${parsed.names.length} names from cache`);
                return;
            } else {
                console.log('[Torn Racing Highlighter] Cache expired, fetching new data...');
            }
        }

        // Fetch fresh data
        const allNames = [];

        for (const faction of targetFactions) {
            try {
                const names = await fetchFactionMembersByName(faction.id);
                names.forEach(name => memberNameCache.add(name));
                allNames.push(...names);
                console.log(`[Torn Racing Highlighter] Loaded ${names.length} names from faction ${faction.name} (${faction.id})`);
            } catch (err) {
                console.error(`Failed to load faction ${faction.name} (${faction.id})`, err);
            }
            await delay(100);
        }

        // Save to localStorage
        localStorage.setItem(CACHE_KEY, JSON.stringify({
            timestamp: Date.now(),
            names: Array.from(memberNameCache)
        }));
    }

    function highlightRacers() {
        const leaderboardNameSpans = document.querySelectorAll('#leaderBoard li.name > span');
        leaderboardNameSpans.forEach(span => {
            const name = span.textContent.trim();
            if (memberNameCache.has(name)) {
                span.style.color = 'gold';
            }
        });
    }

    const observer = new MutationObserver(() => {
        highlightRacers();
    });

    async function init() {
        await loadAllFactionNames();
        console.log(memberNameCache);
        observer.observe(document, { childList: true, subtree: true });
        highlightRacers();
    }

    init();
})();
