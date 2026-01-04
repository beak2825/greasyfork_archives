// ==UserScript==
// @name         Faction & War Member Filter
// @namespace    http://tampermonkey.net/
// @version      1.2.4
// @description Adds simple filters to your faction & war member lists, shows battle stats, shows hospital timers and remembers your sort preferences for each faction.
// @author       psychogenik & HuzGPT & NichtGersti
// @match        https://www.torn.com/factions.php?*
// @match        https://www.torn.com/factions.php*
// @match        https://www.torn.com/war.php?step=rankreport&rankID=*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @homepageURL  https://greasyfork.org/en/scripts/527257-faction-war-member-filter
// @downloadURL https://update.greasyfork.org/scripts/527257/Faction%20%20War%20Member%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/527257/Faction%20%20War%20Member%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('[TS] Script loaded');

    // your Torn.com User API key for fetching your own battlestats:
    const TORN_API_KEY = 'API_KEY';
    const TS_API_KEY = 'TS_API_KEY';

    const OKAY = 'OKAY';
    const ABROAD = 'ABROAD';
    const HOSPITAL = 'HOSPITAL';
    const TRAVELING = 'TRAVELING';
    const travelCodes = {
        "Mexico":                   "MX",
        "Cayman Islands":           "CI",   // (ISO would be KY; keeping CI per your list)
        "Canada":                   "CA",
        "Hawaii":                   "HI",
        "United Kingdom":           "UK",
        "Argentina":                "AR",
        "Switzerland":              "SW",   // use SW instead of CH as you prefer
        "Japan":                    "JP",
        "China":                    "CN",
        "United Arab Emirates":     "UAE",
        "South Africa":             "SA"
    };

    const travelNodes = [];
    const hospNodes = [];
    const storeSort = localStorage.getItem('finally.torn.factionSort');

    let previousSort = parseInt(storeSort) || 1;

    let hospTime = {};

    const statusOrder = {
        [OKAY]: 1,
        [HOSPITAL]: 2,
        [TRAVELING]: 3,
        [ABROAD]: 4,
    };
    const FACTION_TTL         = 60;             // seconds before a faction cache is stale
    const RECHECK_INTERVAL_MS = 30 * 1000;      // check every 30 seconds

    const USER_ID = (() => {
        const m = document.querySelector("a[href*='profile&userID=']")?.href.match(/userID=(\d+)/);
        return m ? m[1] : null;
    })();
    const USER_CACHE_SECONDS    = 21600; // 6h cache
    const FACTION_CACHE_SECONDS = 60;    // 1m cache

    // queue dedupe & lock
    const queuedFactions = new Set();
    let tsFactionQueue   = [];
    let tsFactionLock    = false;

    // in-memory caches
    let tsFactionData       = {};
    let tsFactionTimestamps = {};
    let tsUserData          = null;
    let lastUserFetch       = parseInt(localStorage.getItem('tsLastUserFetch') || '0', 10);

    // persistent sort‐state per faction
    let bsSortStates = {};
    try {
        bsSortStates = JSON.parse(localStorage.getItem('psyBSSortStates')) || {};
    } catch (e) {
        bsSortStates = {};
    }

    // hydrate caches from localStorage
    try { tsFactionData       = JSON.parse(localStorage.getItem('tsFactionData'))       || {}; } catch {}
    try { tsFactionTimestamps = JSON.parse(localStorage.getItem('tsFactionTimestamps')) || {}; } catch {}
    function JSONparse(str) {
        try {
            return JSON.parse(str);
        } catch (e) {
            console.log(e);
        }
        return null;
    }

    function isPDA() {
        return window.flutter_inappwebview !== undefined;
    }

    function getStatus(node) {
        var c = node.className;
        if (c.includes('okay')) {
            return OKAY;
        } else if (c.includes('hospital')) {
            return HOSPITAL;
        } else if (c.includes('traveling')) {
            return TRAVELING;
        } else if (c.includes('abroad')) {
            return ABROAD;
        } else {
            return ABROAD;
        }
    }

    function sortStatus(node, sort) {
        if (!node) node = document.querySelector('.f-war-list .members-list');
        if (!node) return;

        let sortIcon = node.parentNode.querySelector(".status > [class*='sortIcon']");

        if (sort) node.finallySort = sort;
        else if (node.finallySort == undefined) node.finallySort = 2;
        else if (++node.finallySort > 2) node.finallySort = sortIcon ? 1 : 0;

        if (sortIcon) {
            if (node.finallySort > 0) {
                let active = node.parentNode.querySelector("[class*='activeIcon']:not([class*='finally-status-activeIcon'])");
                if (active) {
                    let activeClass = active?.className?.match(/(?:\s|^)(activeIcon(?:[^\s|$]+))(?:\s|$)/)?.[1];
                    if (activeClass) active.classList.remove(activeClass);
                }

                sortIcon.classList.add('finally-status-activeIcon');
                if (node.finallySort == 1) {
                    sortIcon.classList.remove('finally-status-desc');
                    sortIcon.classList.add('finally-status-asc');
                } else {
                    sortIcon.classList.remove('finally-status-asc');
                    sortIcon.classList.add('finally-status-desc');
                }
            } else {
                sortIcon.classList.remove('finally-status-activeIcon');
            }
        }

        // default sort order is
        // ok
        // travelling
        // hospital
        // abroad

        let nodes = Array.from(node.querySelectorAll('.your:not(.row-animation-new), .enemy:not(.row-animation-new)'));
        for (let i = 0; i < nodes.length; i++) if (nodes[i].finallyPos == undefined) nodes[i].finallyPos = i;

        nodes = nodes.sort((a, b) => {
            let idA = a.querySelector('a[href*="XID"]').href.replace(/.*?XID=(\d+)/i, '$1');
            let statusA = getStatus(a.querySelector('.status'));

            let posA = a.finallyPos;
            let idB = b.querySelector('a[href*="XID"]').href.replace(/.*?XID=(\d+)/i, '$1');
            let statusB = getStatus(b.querySelector('.status'));
            let posB = b.finallyPos;

            let type = node.finallySort;
            switch (node.finallySort) {
                case 1:
                    if (statusA !== HOSPITAL || statusB !== HOSPITAL) return statusOrder[statusA] - statusOrder[statusB];
                    return hospTime[idA] - new Date().getTime() / 1000 - (hospTime[idB] - new Date().getTime() / 1000);
                case 2:
                    if (statusA !== HOSPITAL || statusB !== HOSPITAL) return statusOrder[statusB] - statusOrder[statusA];
                    return hospTime[idB] - new Date().getTime() / 1000 - (hospTime[idA] - new Date().getTime() / 1000);
                default:
                    return posA > posB ? 1 : -1;
            }
        });

        for (let i = 0; i < nodes.length; i++) nodes[i].parentNode.appendChild(nodes[i]);

        if (!sort) {
            document.querySelectorAll('.members-list').forEach((e) => {
                if (node != e) sortStatus(e, node.finallySort);
            });
        }
    }

    //can be changed to an interval
    //TODO: initial shown value can still be "Hospital"
    //mabe look into replacing the for loop to only run over hospTime instead of hospNodes
    function updateHospTimers() {
        for (let i = 0, n = hospNodes.length; i < n; i++) {
            const hospNode = hospNodes[i];
            const id = hospNode[0];
            const node = hospNode[1];
            if (!node) continue;
            if (!hospTime[id]) continue;

            let totalSeconds = hospTime[id] - new Date().getTime() / 1000;
            if (!totalSeconds || totalSeconds <= 0) continue;
            if (totalSeconds >= 10 * 60 && totalSeconds % 10 >= 1) continue;
            else if (totalSeconds >= 5 * 60 && totalSeconds % 5 >= 1) continue;

            let hours = Math.floor(totalSeconds / 3600);
            totalSeconds %= 3600;
            let minutes = Math.floor(totalSeconds / 60);
            let seconds = Math.floor(totalSeconds % 60);

            node.textContent = `${hours.toString().padLeft(2, '0')}:${minutes
                .toString()
                .padLeft(2, '0')}:${seconds.toString().padLeft(2, '0')}`;
        }
        setTimeout(updateHospTimers, 1000);
    }

    function collectStatusNode(node) {
        if (!node) return;

        let statusNode = node.querySelector('.status');
        if (!statusNode) return;

        let id = node.querySelector('a[href*="XID"]').href.replace(/.*?XID=(\d+)/i, '$1');
        let inWarPage = node.classList.contains("your")  || node.classList.contains("enemy"); //when viewing the war page from other factions there are 2 status field for every member
        if (hospNodes.find((h) => h[0] == id && h[2] == inWarPage)) return;

        hospNodes.push([id, statusNode, inWarPage]);
    }

    function collectStatusNodeAll(node) {
        if (!node) node = Array.from(document.querySelectorAll('.f-war-list .members-list, .members-list'));
        if (!node) return;

        if (!(node instanceof Array)) {
            node = [node];
        }

        node.forEach((n) =>
                     n
                     .querySelectorAll('.your:not(.row-animation-new), .enemy:not(.row-animation-new), .table-body > .table-row')
                     .forEach((e) => collectStatusNode(e)),
                    );
    }

    function watchWall(observeNode) {
        if (!observeNode) return;

        let parentNode = observeNode.parentNode.parentNode.parentNode;
        let factionNames = parentNode.querySelector('.faction-names');

        //first run
        if (factionNames && !factionNames.querySelector('.faction-side-swap')) {
            //Faction swapping
            let swapNode = document.createElement('div');
            swapNode.className = 'faction-side-swap';
            swapNode.innerHTML = '&lt;&gt;';
            factionNames.appendChild(swapNode);
            swapNode.addEventListener('click', () => {
                parentNode.querySelectorAll('.name.left, .name.right, .tab-menu-cont.right, .tab-menu-cont.left').forEach((e) => {
                    if (e.classList.contains('left')) {
                        e.classList.remove('left');
                        e.classList.add('right');
                    } else {
                        e.classList.remove('right');
                        e.classList.add('left');
                    }
                });
            });
        }

        let titleNode = observeNode.parentNode.querySelector('.title, .c-pointer');
        let oldStatusNode = titleNode.querySelector('.status');
        if (oldStatusNode && !oldStatusNode.classList.contains("custom-hosp-timer")) {
            // sort by status replacement button, maybe look into removing the click handler another way without needing to replace the button
            // cloning node to remove existing click event handler, remove default order class, add new click-listener, then replace
            let statusNode = oldStatusNode.cloneNode(true);
            statusNode.classList.add('custom-hosp-timer');
            let orderClass = statusNode.childNodes[1].className.match(/(?:\s|^)((?:asc|desc)(?:[^\s|$]+))(?:\s|$)/)[1];
            statusNode.childNodes[1].classList.remove(orderClass);
            oldStatusNode.replaceWith(statusNode);
            statusNode.addEventListener('click', () => {
                sortStatus(observeNode);
            });

            //hide status sorting arrow when sorting by something else than status
            for (let i = 0; i < titleNode.children.length; i++) {
                titleNode.children[i].addEventListener('click', (e) => {
                    setTimeout(() => {
                        let sort = i + 1;
                        let sortIcon = e.target.querySelector("[class*='sortIcon']");
                        let desc = sortIcon ? sortIcon.className.indexOf('desc') === -1 : false;
                        sort = desc ? sort : -sort;
                        localStorage.setItem('finally.torn.factionSort', sort);

                        if (!e.target.classList.contains('status'))
                            document
                                .querySelectorAll("[class*='finally-status-activeIcon']")
                                .forEach((e) => e.classList.remove('finally-status-activeIcon'));

                    }, 100);
                });
            }

            //restore previous sorting on page load
            let title = titleNode.children[Math.abs(previousSort) - 1];
            let sortIcon = title.querySelector("[class*='sortIcon']");
            let desc = sortIcon ? sortIcon.className.indexOf('desc') !== -1 : false;
            let active = sortIcon ? sortIcon.className.indexOf('activeIcon') !== -1 : false;

            let x = 0;
            if (!active && previousSort < 0) x = 1;
            else if (!active) x = 2;
            else if (previousSort < 0 && !desc) x = 1;
            else if (previousSort > 0 && desc) x = 1;

            for (; x > 0; x--) title.click();
        }

        collectStatusNodeAll(observeNode);
        collectTravelNodeAll(observeNode);

        const mo = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                for (const node of mutation.addedNodes) {
                    if (node.classList && (node.classList.contains('your') || node.classList.contains('enemy'))) {
                        collectStatusNode(node);
                    }
                }
            });
        });

        mo.observe(observeNode, { childList: true, subtree: true });
    }

    //observe both members lists
    function watchWalls(observeNode) {
        if (!observeNode) return;

        observeNode.querySelectorAll('.members-list').forEach((e) => watchWall(e));

        new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                for (const node of mutation.addedNodes) {
                    node.querySelector && node.querySelectorAll('.members-list').forEach((w) => watchWall(w));
                }
            });
        }).observe(observeNode, { childList: true, subtree: true });
    }

    updateHospTimers();
    watchWalls(document.querySelector('.f-war-list'));

    new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            for (const node of mutation.addedNodes) {
                watchWalls(node.querySelector && node.querySelector('.f-war-list'));
            }
        });
    }).observe(document.body, { childList: true, subtree: true });



    const targetWindow = isPDA() ? window : unsafeWindow;
    const oldFetch = targetWindow.fetch;
    targetWindow.fetch = async (...args) => {
        const url = args[0]?.url || args[0];
        const notWarPage = !url.includes('step=getwarusers') && !url.includes('step=getProcessBarRefreshData');
        if (notWarPage) return oldFetch(...args);

        const response = await oldFetch(...args);
        const clone = response.clone();

        clone.json().then((json) => {
            let members = null;
            if (json.warDesc) members = json.warDesc.members;
            else if (json.userStatuses) members = json.userStatuses;
            else return;

            Object.keys(members).forEach((id) => {
                const status = members[id].status || members[id];
                id = members[id].userID || id;
                if (status.text === 'Hospital') hospTime[id] = status.updateAt;
                else delete hospTime[id];

                if (status.text === 'Traveling') {
                    delete hospTime[id];
                    fetchTravelStatus(id);
                }
            });

            collectStatusNodeAll();
            collectTravelNodeAll();
        });

        return response;
    };

    const targetWindowSoc = isPDA() ? window : unsafeWindow;
    const oldWebSocket = targetWindowSoc.WebSocket;
    targetWindowSoc.WebSocket = function (...args) {
        const socket = new oldWebSocket(...args);
        socket.addEventListener('message', (event) => {
            const json = JSONparse(event.data);
            //dunno if the first one is necessary. it's the original but didn't work for me
            const statusUpdate = json?.result?.data?.data?.message?.namespaces?.users?.actions?.updateStatus
            || json?.push?.pub?.data?.message?.namespaces?.users?.actions?.updateStatus;

            if (!statusUpdate?.status) return;
            const id = statusUpdate.userId;
            const status = statusUpdate.status;

            if (status.text === 'Hospital') hospTime[id] = status.updateAt;
            else delete hospTime[id];

            if (status.text === 'Traveling') {
                delete hospTime[id];
                fetchTravelStatus(id);
            }
            collectStatusNodeAll();
            collectTravelNodeAll();
        });
        return socket;
    };

    const addStyle = (style) => {
        if (isPDA()) {
            const elem = document.createElement('style');
            elem.innerText = style;
            document.head.appendChild(elem);
            return;
        }
        GM_addStyle(style);
    };

    addStyle(`

    .faction-names {
        position: relative;
    }

    .finally-status-activeIcon {
        display: block !important;
    }

    .finally-status-asc {
        border-bottom: 6px solid var(--sort-arrow-color);
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 0 solid transparent;
        height: 0;
        top: -8px;
        width: 0;
    }

    .finally-status-desc {
        border-bottom: 0 solid transparent;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 6px solid var(--sort-arrow-border-color);
        height: 0;
        top: -1px;
        width: 0;
    }

    .finally-status-col {
        text-overflow: clip !important;
    }

    .faction-side-swap {
        position: absolute;
        top: 0px;
        left: 0;
        right: 0;
        margin-left: auto;
        margin-right: auto;
        width: 100px;
        cursor: pointer;
    }

`);
    let chainScaleMultiplier = 1;
    const OUTDATED_SECONDS = 90 * 24 * 60 * 60;
    GM_addStyle(`
  .bs.outdated {
  outline-offset: -1px;
  background-color: rgba(200, 30, 30, 0.4) !important;

}
`);
    const FILTER_OPTIONS = {
        activity: `
    <div style="font-weight:bold; margin-bottom:4px;">Activity:</div>
    <label><input type="checkbox" class="__PREFIX__-activity-filter" value="online"> Online</label><br>
    <label><input type="checkbox" class="__PREFIX__-activity-filter" value="idle"> Idle</label><br>
    <label><input type="checkbox" class="__PREFIX__-activity-filter" value="offline"> Offline</label>
  `,
        status: `
    <div style="font-weight:bold; margin-bottom:4px;">Status:</div>
    <label><input type="checkbox" class="__PREFIX__-status-filter" value="okay"> Okay</label><br>
    <label><input type="checkbox" class="__PREFIX__-status-filter" value="hospital"> Hospital</label><br>
    <label><input type="checkbox" class="__PREFIX__-status-filter" value="abroad"> Abroad</label><br>
    <label><input type="checkbox" class="__PREFIX__-status-filter" value="traveling"> Traveling</label><br>
    <label><input type="checkbox" class="__PREFIX__-status-filter" value="jail"> Jail</label>
  `
    };
    function fetchTravelStatus(uid, attempt = 0) {
        collectTravelNodeAll(); // make sure we’ve cached their statusCell
        const entry = travelNodes.find(e => e[0] === String(uid));
        if (!entry) {
            if (attempt < 5) return setTimeout(() => fetchTravelStatus(uid, attempt + 1), 200);
            return console.warn(`[Travel] no statusNode for uid=${uid}`);
        }
        const statusNode = entry[1];

        const url = `https://api.torn.com/v2/user?id=${uid}&key=${TORN_API_KEY}`;
        GM_xmlhttpRequest({
            method: "GET",
            url,
            responseType: "json",
            onload(res) {
                let data;
                try {
                    data = typeof res.response === "object" ? res.response : JSON.parse(res.responseText);
                } catch (e) {
                    console.error(`[Travel] JSON parse error for uid=${uid}`, e);
                    return;
                }

                const profile = data?.profile || {};
                const descRaw = profile.status?.description || "";
                const desc = String(descRaw).trim();

                // Defaults
                let arrow = "→";
                let country = "";

                // Exact patterns we care about:
                //  - "Traveling to Switzerland"
                //  - "Returning to Torn from UAE"
                const travelingMatch = desc.match(/^\s*traveling\s+to\s+(.+?)\s*$/i);
                const returningMatch = desc.match(/^\s*returning\s+to\s+torn\s+from\s+(.+?)\s*$/i);

                if (returningMatch) {
                    country = returningMatch[1].trim();
                    arrow = "←";
                } else if (travelingMatch) {
                    country = travelingMatch[1].trim();
                    arrow = "→";
                } else {
                    // Fallback (future-proof): try generic "to|from <country>"
                    const generic = desc.match(/\b(?:to|from)\s+(.+?)\s*$/i);
                    if (generic) {
                        country = generic[1].trim();
                        arrow = /^returning/i.test(desc) ? "←" : "→";
                    } else {
                        // give up gracefully
                        statusNode.textContent = desc || "";
                        return;
                    }
                }

                // Normalize to our display code:
                // - prefer mapping
                // - if it's already a short all-caps code (e.g., UAE, UK), keep as-is
                // - else fallback to first 2 letters uppercased
                function toDisplayCode(name) {
                    if (!name) return "";
                    // already looks like a 2–4 letter code?
                    if (/^[A-Z]{2,4}$/.test(name)) return name;
                    const mapped =
                          travelCodes[name] ||
                          travelCodes[name.replace(/\s+/g, ' ')] || // collapse spaces
                          null;
                    if (mapped) return mapped;
                    return name.slice(0, 2).toUpperCase();
                }

                const code = toDisplayCode(country);

                // Final display: arrow + code only (per your spec)
                statusNode.textContent = `${arrow} ${code}`;
            },
            onerror(err) {
                console.error(`[Travel] request failed for uid=${uid}`, err);
            }
        });
    }


    function collectTravelNode(node) {
        // grab any element whose class contains “status”
        const statusNode = node.querySelector('[class*="status"]');
        if (!statusNode) return;

        // only care about Travelling
        if (!statusNode.textContent.trim().startsWith("Traveling") &&
            !statusNode.textContent.trim().startsWith("Returning")) {
            return;
        }

        // extract the userID
        const link = node.querySelector('a[href*="XID"], a[href*="user2ID"]');
        if (!link) return;
        const id = link.href.match(/(?:XID|user2ID)=(\d+)/)[1];

        // dedupe
        if (travelNodes.some(entry => entry[0] === id)) return;

        travelNodes.push([ id, statusNode ]);
    }

    function collectTravelNodeAll() {
        // run this on initial page load & on any new rows added
        document
            .querySelectorAll('.your, .enemy, .table-row')
            .forEach(collectTravelNode);
    }

    function getFilterHTML(prefix) {
        return {
            activity: FILTER_OPTIONS.activity.replace(/__PREFIX__/g, prefix),
            status:   FILTER_OPTIONS.status  .replace(/__PREFIX__/g, prefix)
        };
    }
    function parseBSInput(str) {
        if (!str) return NaN;
        str = str.trim().toLowerCase().replace(/,/g, '');
        const suffix = str.slice(-1);
        const numPart = suffix.match(/[kmbtq]/) ? str.slice(0, -1) : str;
        let n = parseFloat(numPart);
        if (isNaN(n)) return NaN;
        const map = { k:1e3, m:1e6, b:1e9, t:1e12, q:1e15 };
        if (map[suffix]) n *= map[suffix];
        return Math.floor(n);
    }

    /* Helper: format digits with commas */
    function formatWithCommas(str) {
        const digits = str.replace(/[\D]/g, '');
        return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }


    function updateChainScaleMultiplier() {
        const el = document.querySelector('.value___gK1ji');
        if (!el) return;
        // strip the leading “x” and parse
        const raw = el.textContent.trim();
        if (!raw.startsWith('x')) return;
        const val = parseFloat(raw.slice(1));
        if (!isNaN(val)) {
            chainScaleMultiplier = val;
            console.log('[TS] chainScaleMultiplier =', chainScaleMultiplier);
        }
    }
    // run once on load, then every 60 000ms
    updateChainScaleMultiplier();
    setInterval(updateChainScaleMultiplier, 60 * 1000);

    let myBSScore = null;    // will hold √str+√spd+√def+√dex sum
    let ownStatsFetched = false;

    function fetchMyBSScore() {
        if (ownStatsFetched) return;
        ownStatsFetched = true;

        const url = `https://api.torn.com/user/?key=${TORN_API_KEY}&selections=battlestats`;
        GM_xmlhttpRequest({
            method: 'GET', url,
            onload(res) {
                try {
                    const j = JSON.parse(res.responseText);
                    // compute your own BS Score
                    myBSScore = Math.sqrt(j.strength)
                        + Math.sqrt(j.speed)
                        + Math.sqrt(j.defense)
                        + Math.sqrt(j.dexterity);

                    // **NOW that we have myBSScore, inject respect for every list on the page**
                    document
                        .querySelectorAll('.enemy-faction ul.members-list')
                        .forEach(addRespectEstimates);

                } catch (e) {
                    console.error('Could not parse your battlestats', e);
                }
            },
            onerror(err) {
                console.error('Error fetching own battlestats', err);
            }
        });
    }


    // Exact SVG icons (unchanged)
    const ONLINE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" filter="" fill="url(&quot;#svg_status_online&quot;)" stroke="#fff" stroke-width="0" width="13" height="13" viewBox="-1.5 -1.2 14 14"><path d="M0,6a6,6,0,1,1,6,6A6,6,0,0,1,0,6Z"></path></svg>`;
    const IDLE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" filter="" fill="url(&quot;#svg_status_idle&quot;)" stroke="#fff" stroke-width="0" width="13" height="13" viewBox="-1.5 -1.2 14 14"><g xmlns="http://www.w3.org/2000/svg"><path d="M0,6a6,6,0,1,1,6,6A6,6,0,0,1,0,6Z"></path><path d="M5,3V7H9V6H6V3Z" fill="#f2f2f2"></path></g></svg>`;
    const OFFLINE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" filter="" fill="url(&quot;#svg_status_offline&quot;)" stroke="#fff" stroke-width="0" width="13" height="13" viewBox="-1.5 -1.2 14 14"><g xmlns="http://www.w3.org/2000/svg"><path d="M0,6a6,6,0,1,1,6,6A6,6,0,0,1,0,6Z"></path><path d="M3,5H9V7H3Z" fill="#f2f2f2"></path></g></svg>`;

    let updateInterval = null;

    // Detect if user is on a war page by checking the hash
    function isWarPage() {
        // The URL hash for war pages typically ends with #/war/rank
        return window.location.hash.includes("/war/rank");
    }

    // Extract the status from a .your or .enemy DOM element
    function getStatusFromPlayer(player) {
        const statusEl = player.querySelector('div[class*="userStatusWrap"]');
        if (!statusEl) return "offline";

        const svg = statusEl.querySelector('svg');
        if (!svg) return "offline";

        const fill = svg.getAttribute('fill') || "";
        if (fill.includes("#svg_status_idle")) {
            return "idle";
        } else if (fill.includes("#svg_status_online")) {
            return "online";
        } else if (fill.includes("#svg_status_offline")) {
            return "offline";
        } else {
            console.warn("Unknown fill detected:", fill);
            return "offline";
        }
    }

    // Insert or update a small block under the faction's .score element
    function createOrUpdateStatusUI(scoreEl, online, idle, offline) {
        // Check if we already inserted a container
        let container = scoreEl.parentElement.querySelector('.dom-status-indicators');
        if (!container) {
            container = document.createElement('div');
            container.className = 'dom-status-indicators';

            // Style to keep them on one line, centered
            container.style.marginTop = '4px';
            container.style.color = '#fff';
            container.style.fontSize = '12px';
            container.style.display = 'flex';
            container.style.alignItems = 'center';
            container.style.justifyContent = 'center';
            container.style.gap = '10px';

            // Insert right after the .score element
            scoreEl.insertAdjacentElement('afterend', container);
        }

        container.innerHTML = `
            <div style="display: inline-flex; align-items: center;">
                ${ONLINE_SVG}
                <span style="margin-left:4px;">${online}</span>
            </div>
            <div style="display: inline-flex; align-items: center;">
                ${IDLE_SVG}
                <span style="margin-left:4px;">${idle}</span>
            </div>
            <div style="display: inline-flex; align-items: center;">
                ${OFFLINE_SVG}
                <span style="margin-left:4px;">${offline}</span>
            </div>
        `;
    }

    // Main function to count statuses and update the DOM
    function updateStatusCounts() {
        if (!isWarPage()) return;

        // Grab .your and .enemy players
        const friendlyPlayers = Array.from(
            document.querySelectorAll('.your:not(.row-animation-new)')
        ).filter(player => player.querySelector('div[class*="userStatusWrap"]'));

        const enemyPlayers = Array.from(
            document.querySelectorAll('.enemy:not(.row-animation-new)')
        ).filter(player => player.querySelector('div[class*="userStatusWrap"]'));

        // Tally up
        let friendlyOnline = 0, friendlyIdle = 0, friendlyOffline = 0;
        friendlyPlayers.forEach(player => {
            const status = getStatusFromPlayer(player);
            if (status === "online") friendlyOnline++;
            else if (status === "idle") friendlyIdle++;
            else friendlyOffline++;
        });

        let enemyOnline = 0, enemyIdle = 0, enemyOffline = 0;
        enemyPlayers.forEach(player => {
            const status = getStatusFromPlayer(player);
            if (status === "online") enemyOnline++;
            else if (status === "idle") enemyIdle++;
            else enemyOffline++;
        });

        // Locate faction name/score containers
        const enemyFactionEl = document.querySelector('.name.enemy');
        const friendlyFactionEl = document.querySelector('.name.your');

        if (!enemyFactionEl || !friendlyFactionEl) {
            console.log("Could not find enemy or friendly faction elements!");
            return;
        }

        // Grab the .score elements
        const enemyScoreEl = enemyFactionEl.querySelector('.score.score___bFF0_');
        const friendlyScoreEl = friendlyFactionEl.querySelector('.score.score___bFF0_');

        if (!enemyScoreEl || !friendlyScoreEl) {
            console.log("Could not find enemy or friendly score elements!");
            return;
        }

        // Insert or update the status info
        createOrUpdateStatusUI(enemyScoreEl, enemyOnline, enemyIdle, enemyOffline);
        createOrUpdateStatusUI(friendlyScoreEl, friendlyOnline, friendlyIdle, friendlyOffline);
    }

    function startUpdates() {
        if (!updateInterval) {
            updateInterval = setInterval(updateStatusCounts, 1000);
            console.log("Status update interval started.");
        }
    }

    function stopUpdates() {
        if (updateInterval) {
            clearInterval(updateInterval);
            updateInterval = null;
            console.log("Status update interval stopped.");
        }
    }

    function init() {
        if (isWarPage()) {
            startUpdates();
        } else {
            stopUpdates();
        }
    }
    /**
 * Turn a UNIX‐seconds timestamp into "X days/months/years ago"
 */
    // cache so we only do each user once
    const respectCache = {};

    function addRespectEstimates(list) {
        // ensure we have our own BSScore
        fetchMyBSScore();
        if (!myBSScore) return;

        list.querySelectorAll('li[data-bs-pos][data-bs-value]').forEach(row => {
            // grab uid
            const link = row.querySelector('a[href*="XID="], a[href*="user2ID="]');
            const uid  = link?.href.match(/(?:XID|user2ID)=(\d+)/)?.[1];
            if (!uid) return;
            // skip if already added
            if (row.querySelector('.estRespect')) return;
            // get defender stats from TS cache
            const factionId = list.dataset.factionId;
            const stats     = tsFactionData[factionId]?.members[uid]?.spy;
            if (!stats) return;

            // level
            const lvl = parseInt(row.querySelector('.level')?.textContent, 10) || 1;
            // base respect = floor((lvl/200 + 1)*100)/100
            const baseR = Math.floor(((lvl/200) + 1) * 100) / 100;

            // defender BS score
            const dBS = Math.sqrt(stats.strength)
            + Math.sqrt(stats.speed)
            + Math.sqrt(stats.defense)
            + Math.sqrt(stats.dexterity);

            // fair fight FF
            let FF = 1 + (8/3) * (dBS / myBSScore);
            // cap at 3x
            if (FF > 3) FF = 3;
            // final respect = floor(baseR * FF * 2 *100)/100
            const finalR = Math.floor((baseR*chainScaleMultiplier ) * FF * 2 * 100) / 100;

            respectCache[uid] = finalR;

            // append
            const span = document.createElement('span');
            span.className = 'estRespect';
            span.style.marginLeft = '6px';
            span.style.color      = '#aaa';
            span.textContent      = `(${finalR.toFixed(2)})`;

            // insert right after name
            // find the element that *displays* the player's name
            const nameSpan = row.querySelector('.honorName___JWG9U');
            if (nameSpan) {
                nameSpan.insertAdjacentElement('afterend', span);
            }

        });
    }

    function getRelativeTime(ts) {
        const now   = Math.floor(Date.now()/1000);
        const diff  = now - ts;
        const day   = 86400;
        const days  = Math.floor(diff / day);
        if (days < 1)    return 'Today';
        if (days < 30)   return days + (days===1 ? ' day ago' : ' days ago');
        const months = Math.floor(days / 30);
        if (months < 12) return months + (months===1 ? ' month ago' : ' months ago');
        const years  = Math.floor(months / 12);
        return years  + (years===1 ? ' year ago'  : ' years ago');
    }

    let _bsTooltip;

    function showBSTooltip(evt) {
        const cell = evt.currentTarget;
        if (cell.textContent.trim() === 'N/A') return;

        // find UID & faction
        const row       = cell.closest('.table-row, .your, .enemy');
        const link      = row.querySelector('a[href*="XID="], a[href*="user2ID="]');
        const uid       = link?.href.match(/(?:XID|user2ID)=(\d+)/)?.[1];
        const list      = cell.closest('.members-list');
        const factionId = list?.dataset.factionId;
        const stats     = tsFactionData[factionId]?.members[uid]?.spy;
        if (!stats) return;

        // build HTML with Last Spy
        const fmt = formatNumber;
        const last = stats.timestamp
        ? getRelativeTime(stats.timestamp)
        : 'Unknown';
        const html = `
    <div style="margin-bottom:6px;
                font-weight:600;
                border-bottom:1px solid #555;
                padding-bottom:4px;">
      Battle Stats
    </div>
    <div>STR:   ${fmt(stats.strength)}</div>
    <div>DEF:   ${fmt(stats.defense)}</div>
    <div>SPD:   ${fmt(stats.speed)}</div>
    <div>DEX:   ${fmt(stats.dexterity)}</div>
    <div style="margin-top:4px;font-weight:600;">
      TOTAL: ${fmt(stats.total)}
    </div>
    <div style="margin-top:6px;
                border-top:1px solid #555;
                padding-top:4px;
                font-size:11px;
                color:#ccc;">
      Last Spy: ${last}
    </div>
  `;

        if (!_bsTooltip) {
            _bsTooltip = document.createElement('div');
            _bsTooltip.className = 'psy-bs-tooltip';
            document.body.appendChild(_bsTooltip);
        }
        _bsTooltip.innerHTML       = html;
        _bsTooltip.classList.add('visible');

        // position so arrow tip just touches cell top
        const cellRect = cell.getBoundingClientRect();
        const ttRect   = _bsTooltip.getBoundingClientRect();
        const top   = window.scrollY + cellRect.top - ttRect.height - 6; // arrow height
        const left  = window.scrollX + cellRect.left + (cellRect.width - ttRect.width)/2;
        _bsTooltip.style.top  = `${top}px`;
        _bsTooltip.style.left = `${left}px`;
    }

    function hideBSTooltip() {
        if (_bsTooltip) {
            _bsTooltip.classList.remove('visible');
        }
    }







    /**********************************************************************
     *  API FETCH & DIFF LOGIC
     **********************************************************************/
    function fetchFaction(id) {
        const url = `https://www.tornstats.com/api/v2/${TS_API_KEY}/spy/faction/${id}`;
        GM_xmlhttpRequest({
            method:  'GET',
            url,
            onload(res) {
                tsFactionLock = false;
                queuedFactions.delete(id);

                let json;
                try {
                    json = JSON.parse(res.responseText);
                } catch (e) {
                    console.error('[TS] JSON parse error for faction', id, e);
                    processFactionQueue();
                    return;
                }
                if (!json.status || !json.faction) {
                    processFactionQueue();
                    return;
                }

                // diff by timestamp
                const oldMembers  = tsFactionData[id]?.members || {};
                const changedUIDs = [];
                Object.entries(json.faction.members || {}).forEach(([uid, m]) => {
                    const oldTs = oldMembers[uid]?.spy?.timestamp || 0;
                    const newTs = m.spy?.timestamp            || 0;
                    if (newTs > oldTs) changedUIDs.push(uid);
                });

                // update cache + timestamp
                tsFactionData[id]       = json.faction;
                tsFactionTimestamps[id] = Math.floor(Date.now()/1000);
                localStorage.setItem('tsFactionData',       JSON.stringify(tsFactionData));
                localStorage.setItem('tsFactionTimestamps', JSON.stringify(tsFactionTimestamps));

                // repaint only changed rows
                if (changedUIDs.length) {
                    updateBSCellsFor(id, changedUIDs);
                }

                processFactionQueue();
            },
            onerror(err) {
                console.error('[TS] Fetch error for faction', id, err);
                tsFactionLock = false;
                queuedFactions.delete(id);
                processFactionQueue();
            }
        });
    }

    function schedulePeriodicFetches() {
        setInterval(() => {
            const now = Math.floor(Date.now() / 1000);
            Object.keys(tsFactionTimestamps).forEach(fid => {
                const last = tsFactionTimestamps[fid] || 0;
                if (now - last >= FACTION_TTL) {
                    queueFactionFetch(fid);
                }
            });
        }, RECHECK_INTERVAL_MS);
    }

    function processFactionQueue() {
        if (tsFactionLock || !tsFactionQueue.length) return;
        tsFactionLock = true;
        const id = tsFactionQueue.shift();
        fetchFaction(id);
    }


    function queueFactionFetch(id) {
        if (!id || queuedFactions.has(id)) return;
        queuedFactions.add(id);
        tsFactionQueue.push(id);
        processFactionQueue();
    }


    function fetchMyStatsIfNeeded() {
        const now = Math.floor(Date.now()/1000);
        if (!USER_ID || (tsUserData && now - lastUserFetch < USER_CACHE_SECONDS)) return;
        const url = `https://www.tornstats.com/api/v2/${TS_API_KEY}/spy/user/${USER_ID}`;
        console.log('[TS] Fetching user spy:', USER_ID);
        GM_xmlhttpRequest({
            method: 'GET', url,
            onload(res) {
                try {
                    const j = JSON.parse(res.responseText);
                    if (j.status && j.spy) {
                        tsUserData = j.spy;
                        lastUserFetch = now;
                        localStorage.setItem('tsLastUserFetch', now);
                    }
                } catch (e) {
                    console.error('[TS] User JSON error', e);
                }
            }
        });
    }

    function formatNumber(num) {
        if (num == null || isNaN(num)) return 'N/A';
        const abs = Math.abs(num);
        if (abs < 1e3) return String(num);
        const units = ['K','M','B','T','Q'];
        let idx = -1, n = num;
        while (Math.abs(n) >= 1000 && idx < units.length - 1) {
            n /= 1000; idx++;
        }
        return n.toFixed(1) + units[idx];
    }

    /**********************************************************************
     *  BS COLUMN UPDATE HELPERS
     **********************************************************************/
    function updateBSCells(factionID) {
        document
            .querySelectorAll(`.members-list[data-faction-id="${factionID}"]`)
            .forEach(list => {
            list.querySelectorAll('.table-row, .your, .enemy').forEach(row => {
                const link  = row.querySelector('a[href*="XID="],a[href*="user2ID="]');
                const uid   = link?.href.match(/(?:XID|user2ID)=(\d+)/i)?.[1];
                const stats = uid && tsFactionData[factionID].members[uid]?.spy;
                const total = stats?.total ?? null;

                // 1) paint the text
                const cell = row.querySelector('.bs');
                if (!cell) return;
                cell.textContent    = formatNumber(total);
                row.dataset.bsValue = total || 0;

                // 2) toggle outdated
                if (stats?.timestamp) {
                    const ageSec = Math.floor(Date.now()/1000) - stats.timestamp;
                    cell.classList.toggle('outdated', ageSec > OUTDATED_SECONDS);
                } else {
                    cell.classList.remove('outdated');
                }
            });
        });
        filterFactionMembers();
        if (isWarPage()) filterWarMembers();
    }


    function updateBSCellsFor(factionID, uids) {
        const list = document.querySelector(`.members-list[data-faction-id="${factionID}"]`);
        if (!list) return;

        uids.forEach(uid => {
            const link  = list.querySelector(`a[href*="XID=${uid}"],a[href*="user2ID=${uid}"]`);
            const row   = link?.closest('.table-row, .your, .enemy');
            if (!row) return;

            const stats = tsFactionData[factionID]?.members[uid]?.spy;
            const total = stats?.total ?? null;

            // 1) paint the BS cell
            const cell = row.querySelector('.bs');
            if (!cell) return;
            cell.textContent    = formatNumber(total);
            row.dataset.bsValue = total;

            // 2) toggle outdated styling
            if (stats?.timestamp) {
                const ageSec = Math.floor(Date.now()/1000) - stats.timestamp;
                cell.classList.toggle('outdated', ageSec > OUTDATED_SECONDS);
            } else {
                cell.classList.remove('outdated');
            }
        });

        // re-apply filters
        filterFactionMembers();
        if (isWarPage()) filterWarMembers();

        // — only on your *actual* war‐report overlay do we show respect estimates —
        const url   = new URL(window.location.href);
        const step  = url.searchParams.get('step');
        const type  = url.searchParams.get('type');
        const hash  = url.hash || '';
        const onYourWar = step === 'your'
        && type === '1'
        && hash.includes('/war/rank');

        if (onYourWar && list.closest('.enemy-faction')) {
            addRespectEstimates(list);
        }
    }

    /**********************************************************************
     *  SORT STATE HELPERS
     **********************************************************************/
    function applySortSingle(list, state) {
        // clear global arrows
        document.querySelectorAll('.finally-bs-activeIcon')
            .forEach(el => el.classList.remove('finally-bs-activeIcon'));
        // apply to this header
        const hdr = list.querySelector('.bs.finally-bs-col');
        const arrow = hdr?.querySelector('[class*="sortIcon"]');
        if (arrow) {
            arrow.classList.remove('finally-bs-asc','finally-bs-desc');
            if (state > 0) {
                arrow.classList.add('finally-bs-activeIcon');
                arrow.classList.add(state===1?'finally-bs-asc':'finally-bs-desc');
            }
        }
        // set dataset
        list.dataset.bsSort = state;
        // sort rows
        const rows = Array.from(list.querySelectorAll('.table-row, .your, .enemy'));
        rows.sort((a,b) => {
            const A = +a.dataset.bsValue || 0, B = +b.dataset.bsValue || 0;
            if (state===1) return A - B;
            if (state===2) return B - A;
            return (+a.dataset.bsPos||0) - (+b.dataset.bsPos||0);
        });
        rows.forEach(r => r.parentNode.appendChild(r));
    }

    function sortList(list, headerCell) {
        // cycle state: 0→1→2→0
        const cur  = parseInt(list.dataset.bsSort||'0', 10);
        const next = cur===2 ? 0 : cur+1;
        applySortSingle(list, next);
        // persist
        const fid = list.dataset.factionId;
        bsSortStates[fid] = next;
        localStorage.setItem('psyBSSortStates', JSON.stringify(bsSortStates));
    }

    function sortBoth(warWrap) {
        const lists = Array.from(warWrap.querySelectorAll('.members-list'));
        if (!lists.length) return;
        const cur  = parseInt(lists[0].dataset.bsSort||'0', 10);
        const next = cur===2 ? 0 : cur+1;
        lists.forEach(list => applySortSingle(list, next));
        // persist both
        lists.forEach(list => {
            const fid = list.dataset.factionId;
            bsSortStates[fid] = next;
        });
        localStorage.setItem('psyBSSortStates', JSON.stringify(bsSortStates));
    }

    /**********************************************************************
     *  STORAGE HELPERS & STYLES
     **********************************************************************/
    const STORAGE = {
        factionActivity:'psyFactionActivity',
        factionStatus:'psyFactionStatus',
        factionDropdown:'psyFactionDropdownOpen',
        warActivity:'psyWarActivity',
        warStatus:'psyWarStatus',
        warDropdown:'psyWarDropdownOpen',
        factionBSMin:      'psyFactionMinBS',
        factionBSMax:      'psyFactionMaxBS',
        warBSMin:          'psyWarMinBS',
        warBSMax:          'psyWarMaxBS'
    };
    function savePrefs(k, v) {
        localStorage.setItem(k, JSON.stringify(v));
    }
    function loadPrefs(k, defaultValue) {
        try {
            const raw = localStorage.getItem(k);
            if (raw === null) return defaultValue;
            const parsed = JSON.parse(raw);
            return parsed;
        } catch {
            return defaultValue;
        }
    }
    GM_addStyle(`
      /* Filter UI */
      #psyFilterWrapper,#psyWarFilterWrapper{margin:0;}
      #psyFilterWrapper button,#psyWarFilterWrapper button{display:block;width:100%;text-align:center;}
      @media(max-width:600px){#psyFilterWrapper div,#psyWarFilterWrapper div{font-size:14px!important;}}
      /* BS column */
      @media(max-width:1000px){.members-cont .bs{display:none;}}
      .members-cont .level{width:27px!important;}
      .members-cont .id{padding-left:5px!important;width:28px!important;}
      .members-cont .points{width:42px!important;}
      .finally-bs-col{text-overflow:clip!important;}
      .finally-bs-activeIcon{display:block!important;}
      .finally-bs-asc{border-bottom:6px solid var(--sort-arrow-color);border-left:6px solid transparent;border-right:6px solid transparent;height:0;top:-8px;width:0;}
      .finally-bs-desc{border-top:6px solid var(--sort-arrow-border-color);border-left:6px solid transparent;border-right:6px solid transparent;height:0;top:-1px;width:0;}


    `);
    GM_addStyle(`
  /* ------------ Force BS cells to center ------------- */
  /* Target the LI table-cell variant */
  ul.members-list > li.table-cell.bs.finally-bs-col {
    /* remove any float/inline-block behavior */
    float: none !important;
    display: table-cell !important;
    /* let it size itself and center its contents */
    width: auto !important;
    padding-left: 0 !important;
    padding-right: 0 !important;
    text-align: center !important;
    vertical-align: middle !important;
  }

  /* Target the DIV variant (non-LI layouts) */
  ul.members-list > div.bs.finally-bs-col {
    float: none !important;
    display: table-cell !important;
    width: auto !important;
    padding-left: 0 !important;
    padding-right: 0 !important;
    text-align: center !important;
    vertical-align: middle !important;
  }

  /* And the header cell in the .table-header */
  .table-header .bs.finally-bs-col {
    float: none !important;
    display: table-cell !important;
    text-align: center !important;
  }
`);
    GM_addStyle(`
  .psy-bs-tooltip {
    position: absolute;
    padding: 4px 6px;
    background: rgba(0,0,0,0.8);
    color: #fff;
    font-size: 11px;
    border-radius: 3px;
    pointer-events: none;
    z-index: 9999;
    white-space: nowrap;
  }
`);
    GM_addStyle(`
  .psy-bs-tooltip {
    position: absolute;
    padding: 8px 12px;
    background: rgba(32,32,32,0.95);
    color: #f1f1f1;
    font-size: 12px;
    line-height: 1.5;
    border-radius: 5px;
    pointer-events: none;
    z-index: 9999;
    white-space: nowrap;
    box-shadow: 0 4px 10px rgba(0,0,0,0.4);
    transition: opacity 0.15s ease-in-out;
    opacity: 0;
  }

  .psy-bs-tooltip.visible {
    opacity: 1;
  }

  /* little downward-pointing arrow */
  .psy-bs-tooltip::after {
    content: '';
    position: absolute;
    bottom: -6px;          /* arrow height */
    left: 50%;
    transform: translateX(-50%);
    border-width: 6px 6px 0 6px;
    border-style: solid;
    border-color: rgba(32,32,32,0.95) transparent transparent transparent;
  }

`);
    GM_addStyle(`
  .estRespect {
    display: inline-block;
    vertical-align: middle;
    margin-left: 4px; /* tweak spacing */
    color: #aaa;
    font-size: 12px;
  }
`);
    GM_addStyle(`
  /* Sleek, rounded inputs for your BS boxes */
  #psyWarFilterWrapper input[type="text"]#war-min-bs-input,
  #psyWarFilterWrapper input[type="text"]#war-max-bs-input {
    border: 1px solid #555;
    border-radius: 6px;
    padding: 6px 8px;
    background: #2f2f2f;
    color: #eee;
    box-shadow: inset 0 1px 3px rgba(0,0,0,0.5);
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }
  #psyWarFilterWrapper input[type="text"]#war-min-bs-input:focus,
  #psyWarFilterWrapper input[type="text"]#war-max-bs-input:focus {
    border-color: #888;
    box-shadow: 0 0 4px rgba(136,136,136,0.6);
    outline: none;
  }
`)
    GM_addStyle(`
  /* Faction BS inputs styling (match war filters) */
  #psyFilterWrapper input[type="text"]#faction-min-bs-input,
  #psyFilterWrapper input[type="text"]#faction-max-bs-input {
    border: 1px solid #555;
    border-radius: 6px;
    padding: 6px 8px;
    background: #2f2f2f;
    color: #eee;
    box-shadow: inset 0 1px 3px rgba(0,0,0,0.5);
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }
  #psyFilterWrapper input[type="text"]#faction-min-bs-input:focus,
  #psyFilterWrapper input[type="text"]#faction-max-bs-input:focus {
    border-color: #888;
    box-shadow: 0 0 4px rgba(136,136,136,0.6);
    outline: none;
  }
`);

    /**********************************************************************
     *  FACTION FILTER UI
     **********************************************************************/
    let factionResultsCountEl = null;
    const factionObserver = new MutationObserver(() => {
        const factionContainer = document.querySelector(
            '.faction-info-wrap.restyle.another-faction'
        );
        if (
            factionContainer &&
            !factionContainer.querySelector('#psyFilterWrapper')
        ) {
            insertFactionFilterDropdown(factionContainer);
        }
    });
    factionObserver.observe(document.body, {
        childList: true,
        subtree: true
    });


    function insertFactionFilterDropdown(container) {
        // Create wrapper and toggle button
        const wrapper = document.createElement('div');
        wrapper.id = 'psyFilterWrapper';
        wrapper.style.backgroundColor = window.getComputedStyle(container).backgroundColor;

        const toggle = document.createElement('button');
        toggle.textContent = 'MEMBER FILTERS';
        Object.assign(toggle.style, {
            cursor: 'pointer',
            fontWeight: 'bold',
            padding: '6px 10px',
            borderBottom: '1px solid #222',
            borderTop: '1px solid #222',
            background: '#2f2f2f',
            color: '#fff',
            fontSize: '12px',
        });

        // Create the dropdown panel as a flex column
        const dropdown = document.createElement('div');
        Object.assign(dropdown.style, {
            display: 'none',
            position: 'relative',
            borderBottom: '1px solid #222',
            background: '#2f2f2f',
            color: '#ccc',
            padding: '1rem',
            width: '100%',
            boxSizing: 'border-box',
            fontSize: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
        });

        // Restore open/closed state
        const open = loadPrefs(STORAGE.factionDropdown, false);
        dropdown.style.display = open ? 'flex' : 'none';
        toggle.addEventListener('click', () => {
            const isOpen = dropdown.style.display === 'flex';
            dropdown.style.display = isOpen ? 'none' : 'flex';
            savePrefs(STORAGE.factionDropdown, !isOpen);
        });

        // Title, centered
        const title = document.createElement('div');
        title.textContent = 'Filter Options';
        title.style.fontWeight = 'bold';
        title.style.alignSelf = 'center';

        // Activity block
        const actDiv = document.createElement('div');
        actDiv.innerHTML = `
      <div style="font-weight:bold; margin-bottom:4px;">Activity:</div>
      <label><input type="checkbox" class="faction-activity-filter" value="online"> Online</label><br>
      <label><input type="checkbox" class="faction-activity-filter" value="idle"> Idle</label><br>
      <label><input type="checkbox" class="faction-activity-filter" value="offline"> Offline</label>
    `;

        // Status block
        const stDiv = document.createElement('div');
        stDiv.innerHTML = `
      <div style="font-weight:bold; margin-bottom:4px;">Status:</div>
      <label><input type="checkbox" class="faction-status-filter" value="okay"> Okay</label><br>
      <label><input type="checkbox" class="faction-status-filter" value="hospital"> Hospital</label><br>
      <label><input type="checkbox" class="faction-status-filter" value="abroad"> Abroad</label><br>
      <label><input type="checkbox" class="faction-status-filter" value="traveling"> Traveling</label><br>
      <label><input type="checkbox" class="faction-status-filter" value="jail"> Jail</label>
    `;

        // Additional Options: BG, Text pickers, Reset
        const dummyDiv = document.createElement('div');
        dummyDiv.innerHTML = `
      <div style="font-weight:bold; margin-bottom:4px;">Additional Options:</div>
      <div style="display:flex; flex-direction:column; gap:8px;">
        <div style="display:flex; align-items:center; gap:4px;">
          <button id="psy-faction-bg-color-btn" style="
             height:28px;
             padding:0 8px;
             background:#444;
             border:none;
             border-radius:4px;
             cursor:pointer;
             white-space:nowrap;
             color:inherit;
             font:inherit;
          ">BG Colour</button>
          <input type="color" id="psy-faction-bg-color-picker" style="display:none;" value="#2f2f2f">
        </div>
        <div style="display:flex; align-items:center; gap:4px;">
          <button id="psy-faction-text-color-btn" style="
             height:28px;
             padding:0 8px;
             background:#444;
             border:none;
             border-radius:4px;
             cursor:pointer;
             white-space:nowrap;
             color:inherit;
             font:inherit;
          ">Text Colour</button>
          <input type="color" id="psy-faction-text-color-picker" style="display:none;" value="#ccc">
        </div>
        <div>
          <button id="psy-faction-bg-reset-btn" style="
            height:28px;
            padding:0 8px;
            background:#555;
            border:none;
            border-radius:4px;
            cursor:pointer;
            color:inherit;
            font:inherit;
            white-space:nowrap;
          ">Reset</button>
        </div>
      </div>
    `;

        // Build controls row
        const controlsRow = document.createElement('div');
        Object.assign(controlsRow.style, {
            display: 'flex',
            justifyContent: 'flex-start',
            gap: '2rem',
            position: 'relative'
        });

        // Left column: activity + status stacked
        const leftCol = document.createElement('div');
        Object.assign(leftCol.style, {
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            marginLeft: '2rem'
        });
        leftCol.appendChild(actDiv);
        leftCol.appendChild(stDiv);

        // Center column: BS-range via absolute centering
        const rangeDiv = document.createElement('div');
        Object.assign(rangeDiv.style, {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
        });
        const bsLabel = document.createElement('div');
        bsLabel.textContent = 'BS Range:';
        bsLabel.style.fontWeight = 'bold';
        const minInput = document.createElement('input');
        minInput.type = 'text';
        minInput.id = 'faction-min-bs-input';
        minInput.placeholder = 'Min BS';
        minInput.style.width = '90%';
        const maxInput = document.createElement('input');
        maxInput.type = 'text';
        maxInput.id = 'faction-max-bs-input';
        maxInput.placeholder = 'Max BS';
        maxInput.style.width = '90%';
        rangeDiv.appendChild(bsLabel);
        rangeDiv.appendChild(minInput);
        rangeDiv.appendChild(maxInput);
        const centerCol = document.createElement('div');
        Object.assign(centerCol.style, {
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        });
        centerCol.appendChild(rangeDiv);

        // Right column: dummy options
        const rightCol = document.createElement('div');
        Object.assign(rightCol.style, {
            position: 'absolute',
            right: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
        });
        rightCol.appendChild(dummyDiv);

        controlsRow.appendChild(leftCol);
        controlsRow.appendChild(centerCol);
        controlsRow.appendChild(rightCol);

        // Count element
        const countEl = document.createElement('div');
        countEl.style.fontWeight = 'bold';
        countEl.style.alignSelf = 'center';
        factionResultsCountEl = countEl;

        // Assemble dropdown
        dropdown.appendChild(title);
        dropdown.appendChild(controlsRow);
        dropdown.appendChild(countEl);

        wrapper.appendChild(toggle);
        wrapper.appendChild(dropdown);
        container.insertAdjacentElement('afterbegin', wrapper);

        // Placeholder style
        const placeholderStyle = document.createElement('style');
        placeholderStyle.id = 'psyFactionPlaceholderStyle';
        placeholderStyle.textContent = `
    #psyFilterWrapper input::placeholder {
      color: #444 !important;
    }
    `;
        document.head.appendChild(placeholderStyle);

        // Color picker logic
        const bgBtn = dropdown.querySelector('#psy-faction-bg-color-btn');
        const bgPicker = dropdown.querySelector('#psy-faction-bg-color-picker');
        const textBtn = dropdown.querySelector('#psy-faction-text-color-btn');
        const textPicker = dropdown.querySelector('#psy-faction-text-color-picker');
        const resetBtn = dropdown.querySelector('#psy-faction-bg-reset-btn');
        const BG_KEY = 'psyFactionThemeBG';
        const TXT_KEY = 'psyFactionThemeText';
        const DEFAULT_BG = '#2f2f2f';
        const BUTTON_LIGHTNESS_DELTA = 0.083;
        const DEFAULT_TXT = getComputedStyle(dropdown).color;

        function hexToRgb(hex) {
            hex = hex.replace(/^#/, '');
            if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
            const n = parseInt(hex, 16);
            return { r: (n >> 16) & 0xff, g: (n >> 8) & 0xff, b: n & 0xff };
        }
        function rgbToHsl({ r, g, b }) {
            r /= 255; g /= 255; b /= 255;
            const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
            let h = 0, s = mx ? d / mx : 0, l = (mx + mn) / 2;
            if (d) {
                if (mx === r) h = ((g - b) / d) % 6;
                else if (mx === g) h = (b - r) / d + 2;
                else h = (r - g) / d + 4;
                h = Math.round(h * 60);
                if (h < 0) h += 360;
            }
            return { h, s, l };
        }
        function hslToRgb(h, s, l) {
            const c = (1 - Math.abs(2 * l - 1)) * s;
            const x = c * (1 - Math.abs((h / 60) % 2 - 1));
            const m = l - c / 2;
            let [r1, g1, b1] = h < 60 ? [c, x, 0]
            : h < 120 ? [x, c, 0]
            : h < 180 ? [0, c, x]
            : h < 240 ? [0, x, c]
            : h < 300 ? [x, 0, c]
            : [c, 0, x];
            return {
                r: Math.round((r1 + m) * 255),
                g: Math.round((g1 + m) * 255),
                b: Math.round((b1 + m) * 255)
            };
        }
        function rgbToHex({ r, g, b }) {
            return '#' + [r, g, b].map(n => n.toString(16).padStart(2, '0')).join('');
        }

        // Compute default lightness deltas
        const defaultBgHsl = rgbToHsl(hexToRgb(DEFAULT_BG));
        const buttonDeltas = new Map([toggle, bgBtn, textBtn, resetBtn].map(btn => {
            const [r, g, b] = getComputedStyle(btn).backgroundColor.match(/\d+/g).map(Number);
            const hsl = rgbToHsl({ r, g, b });
            return [btn, hsl.l - defaultBgHsl.l];
        }));

        function describeLightnessDifference(colorHex, bgHex) {
            const hsl = rgbToHsl(hexToRgb(colorHex));
            const bgHsl = rgbToHsl(hexToRgb(bgHex));
            const diffPerc = Math.round((hsl.l - bgHsl.l) * 100);
            if (diffPerc === 0) return 'same lightness as background';
            if (diffPerc > 0) return `${diffPerc}% lighter than background`;
            return `${Math.abs(diffPerc)}% darker than background`;
        }

        function updateButtonDescriptions(bgCol) {
            [toggle, bgBtn, textBtn, resetBtn].forEach(btn => {
                const [r, g, b] = getComputedStyle(btn).backgroundColor.match(/\d+/g).map(Number);
                const hex = rgbToHex({ r, g, b });
                btn.title = `Button is ${describeLightnessDifference(hex, bgCol)}`;
            });
        }

        function applyBG(col) {
            dropdown.style.background = col;
            toggle.style.background = col;
            localStorage.setItem(BG_KEY, col);

            const { h, s, l: newBgL } = rgbToHsl(hexToRgb(col));
            const newBtnL = Math.min(1, Math.max(0, newBgL + BUTTON_LIGHTNESS_DELTA));
            const newBtnColor = rgbToHex(hslToRgb(h, s, newBtnL));

            [bgBtn, textBtn, resetBtn].forEach(btn => btn.style.background = newBtnColor);
            [minInput, maxInput].forEach(inp => inp.style.background = col);

            const styleTag = document.getElementById('psyFactionPlaceholderStyle');
            styleTag.textContent = `
    #psyFilterWrapper input::placeholder {
      color: ${newBtnColor} !important;
    }`;
            updateButtonDescriptions(col);
        }

        function applyText(col) {
            localStorage.setItem(TXT_KEY, col);
            toggle.style.color = col;
            dropdown.style.color = col;
            [bgBtn, textBtn, resetBtn].forEach(btn => btn.style.color = col);
        }

        // Restore saved theme
        const savedBG = localStorage.getItem(BG_KEY);
        if (savedBG) applyBG(savedBG);
        const savedTxt = localStorage.getItem(TXT_KEY);
        if (savedTxt) applyText(savedTxt);

        // Picker togglers
        function makeToggler(picker) {
            let open = false;
            return e => {
                if (!e.isTrusted) return;
                e.preventDefault();
                if (!open) picker.click(); else picker.blur();
                open = !open;
            };
        }
        const toggleBG = makeToggler(bgPicker);
        bgBtn.addEventListener('click', toggleBG);
        bgPicker.addEventListener('input', e => applyBG(e.target.value));

        const toggleText = makeToggler(textPicker);
        textBtn.addEventListener('click', toggleText);
        textPicker.addEventListener('input', e => applyText(e.target.value));

        resetBtn.addEventListener('click', () => {
            localStorage.removeItem(BG_KEY);
            localStorage.removeItem(TXT_KEY);
            applyBG(DEFAULT_BG);
            applyText(DEFAULT_TXT);
        });

        // Wire up filters
        const savedA = loadPrefs(STORAGE.factionActivity, ['online','idle','offline']);
        const savedS = loadPrefs(STORAGE.factionStatus, ['okay','hospital','abroad','traveling','jail']);
        dropdown.querySelectorAll('.faction-activity-filter').forEach(cb => {
            cb.checked = savedA.includes(cb.value);
            cb.addEventListener('change', filterFactionMembers);
        });
        dropdown.querySelectorAll('.faction-status-filter').forEach(cb => {
            cb.checked = savedS.includes(cb.value);
            cb.addEventListener('change', filterFactionMembers);
        });

        // Initialize BS inputs values
        const savedMin = loadPrefs(STORAGE.factionBSMin, '');
        const savedMax = loadPrefs(STORAGE.factionBSMax, '');
        if (savedMin) minInput.value = savedMin;
        if (savedMax) maxInput.value = savedMax;
        [minInput, maxInput].forEach(inp => {
            inp.addEventListener('input', () => {
                let raw = inp.value.toLowerCase();
                const clean = raw.replace(/[^0-9.kmbtq]/g, '');
                if (clean !== raw) inp.value = clean;
                if (/^[0-9]+([.][0-9]+)?[kmbtq]?$/.test(inp.value)) {
                    const v = parseBSInput(inp.value);
                    if (!isNaN(v)) inp.value = v.toLocaleString();
                }
                savePrefs(STORAGE.factionBSMin, minInput.value);
                savePrefs(STORAGE.factionBSMax, maxInput.value);
                filterFactionMembers();
            });
            inp.addEventListener('blur', () => {
                const v = parseBSInput(inp.value);
                if (!isNaN(v)) {
                    inp.value = v.toLocaleString();
                    savePrefs(STORAGE.factionBSMin, minInput.value);
                    savePrefs(STORAGE.factionBSMax, maxInput.value);
                }
                filterFactionMembers();
            });
        });

        // Initial filter pass
        filterFactionMembers();
    }



    function filterFactionMembers() {
        const wrapper = document.getElementById('psyFilterWrapper');
        if (!wrapper) return;

        // Activity & status
        const allA = Array.from(wrapper.querySelectorAll('.faction-activity-filter')).map(cb => cb.value);
        const allS = Array.from(wrapper.querySelectorAll('.faction-status-filter')).map(cb => cb.value);
        let selA = Array.from(wrapper.querySelectorAll('.faction-activity-filter:checked')).map(cb => cb.value);
        let selS = Array.from(wrapper.querySelectorAll('.faction-status-filter:checked')).map(cb => cb.value);
        if (!selA.length) selA = allA;
        if (!selS.length) selS = allS;

        // BS range
        const minInput = document.getElementById('faction-min-bs-input');
        const maxInput = document.getElementById('faction-max-bs-input');
        const minV = minInput ? parseBSInput(minInput.value) : NaN;
        const maxV = maxInput ? parseBSInput(maxInput.value) : NaN;

        // Filter rows in this faction
        let total = 0, shown = 0;
        const memberRows = document.querySelectorAll('.members-list .table-body > li.table-row');
        memberRows.forEach(row => {
            total++;
            const act = getFactionRowActivity(row);
            const st  = getFactionRowStatus(row);
            const bs  = +row.dataset.bsValue || 0;
            const passA = selA.includes(act);
            const passS = selS.includes(st);
            const passB = (isNaN(minV) || bs >= minV) && (isNaN(maxV) || bs <= maxV);
            const show = passA && passS && passB;
            row.style.display = show ? '' : 'none';
            if (show) shown++;
        });

        // Update “Showing X of Y” text using our saved element
        if (factionResultsCountEl) {
            factionResultsCountEl.textContent = `Showing ${shown} of ${total} members`;
        }

        // Persist checkboxes
        const persistA = Array.from(wrapper.querySelectorAll('.faction-activity-filter:checked')).map(cb => cb.value);
        const persistS = Array.from(wrapper.querySelectorAll('.faction-status-filter:checked')).map(cb => cb.value);
        savePrefs(STORAGE.factionActivity, persistA);
        savePrefs(STORAGE.factionStatus,   persistS);
    }

    function getFactionRowActivity(row){
        const svg = row.querySelector('svg.default___XXAGt');
        if (!svg) return 'offline';
        const fill = svg.getAttribute('fill')||'';
        if (fill.includes('svg_status_online')) return 'online';
        if (fill.includes('svg_status_idle')) return 'idle';
        return 'offline';
    }
    function getFactionRowStatus(row){
        const el = row.querySelector('.status .ellipsis');
        if (!el) return 'okay';
        const txt = el.textContent.trim().toLowerCase();
        if (txt.startsWith('→') || txt.startsWith('←')) return 'traveling';
        // if it's a timer (e.g. "01:23:45") treat as Hospital
        if (/\d+:\d{2}:\d{2}/.test(txt)) return 'hospital';

        if (txt.includes('hospital')) return 'hospital';
        if (txt.includes('abroad'))    return 'abroad';
        if (txt.includes('traveling')) return 'traveling';
        if (txt.includes('jail'))      return 'jail';
        return 'okay';
    }

    /**********************************************************************
     *  WAR FILTER UI
     **********************************************************************/
    let warResultsCountEl = null;
    new MutationObserver(records => {
        records.forEach(r=>Array.from(r.addedNodes).forEach(node=>{
            if (!(node instanceof Element)) return;
            const c = node.matches('.faction-war.membersWrap___NbYLx')
            ? node
            : node.querySelector('.faction-war.membersWrap___NbYLx');
            if (c && !c.querySelector('#psyWarFilterWrapper')) insertWarFilterDropdown(c);
        }));
    }).observe(document.body,{childList:true,subtree:true});

    let warTries=0;
    const warInterval=setInterval(()=>{
        warTries++;
        if (!window.location.hash.includes('/war/rank')) return;
        const c=document.querySelector('.faction-war.membersWrap___NbYLx');
        if (c && !c.querySelector('#psyWarFilterWrapper')) insertWarFilterDropdown(c);
        if (warTries>=30) clearInterval(warInterval);
    },500);

    function insertWarFilterDropdown(container) {
        // Create wrapper and toggle button
        const wrapper = document.createElement('div');
        wrapper.id = 'psyWarFilterWrapper';
        wrapper.style.backgroundColor = window.getComputedStyle(container).backgroundColor;

        const toggle = document.createElement('button');
        toggle.textContent = 'RANKED WAR FILTERS';
        Object.assign(toggle.style, {
            cursor: 'pointer',
            fontWeight: 'bold',
            padding: '6px 10px',
            borderBottom: '1px solid #222',
            borderTop: '1px solid #222',
            background: '#2f2f2f',
            color: '#fff',
            fontSize: '12px',
        });

        // Create the dropdown panel as a flex column
        const dropdown = document.createElement('div');
        Object.assign(dropdown.style, {
            display: 'none',
            position: 'relative',
            borderBottom: '1px solid #222',
            background: '#2f2f2f',
            color: '#ccc',
            padding: '1rem',
            width: '100%',
            boxSizing: 'border-box',
            fontSize: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
        });

        // Restore open/closed state
        const open = loadPrefs(STORAGE.warDropdown, false);
        dropdown.style.display = open ? 'flex' : 'none';
        toggle.addEventListener('click', () => {
            const isOpen = dropdown.style.display === 'flex';
            dropdown.style.display = isOpen ? 'none' : 'flex';
            savePrefs(STORAGE.warDropdown, !isOpen);
        });

        // Title, centered
        const title = document.createElement('div');
        title.textContent = 'Filter Options';
        title.style.fontWeight = 'bold';
        title.style.alignSelf = 'center';

        // Activity block
        const actDiv2 = document.createElement('div');
        actDiv2.innerHTML = `
      <div style="font-weight:bold; margin-bottom:4px;">Activity:</div>
      <label><input type="checkbox" class="war-activity-filter" value="online"> Online</label><br>
      <label><input type="checkbox" class="war-activity-filter" value="idle"> Idle</label><br>
      <label><input type="checkbox" class="war-activity-filter" value="offline"> Offline</label>
    `;

        // Status block
        const stDiv2 = document.createElement('div');
        stDiv2.innerHTML = `
      <div style="font-weight:bold; margin-bottom:4px;">Status:</div>
      <label><input type="checkbox" class="war-status-filter" value="okay"> Okay</label><br>
      <label><input type="checkbox" class="war-status-filter" value="hospital"> Hospital</label><br>
      <label><input type="checkbox" class="war-status-filter" value="abroad"> Abroad</label><br>
      <label><input type="checkbox" class="war-status-filter" value="traveling"> Traveling</label><br>
      <label><input type="checkbox" class="war-status-filter" value="jail"> Jail</label>
    `;

        // Additional Options: BG, Text pickers, Reset
        const dummyDiv = document.createElement('div');
        dummyDiv.innerHTML = `
      <div style="font-weight:bold; margin-bottom:4px;">Additional Options:</div>
      <div style="display:flex; flex-direction:column; gap:8px;">
        <!-- BG colour row -->
        <div style="display:flex; align-items:center; gap:4px;">
          <button id="psy-bg-color-btn" style="
             height:28px;
             padding:0 8px;
             background:#444;
             border:none;
             border-radius:4px;
             cursor:pointer;
             white-space:nowrap;
             color:inherit;
             font:inherit;
          ">BG Colour</button>
          <input type="color" id="psy-bg-color-picker" style="display:none;" value="#2f2f2f">
        </div>
        <!-- Text colour row -->
        <div style="display:flex; align-items:center; gap:4px;">
          <button id="psy-text-color-btn" style="
             height:28px;
             padding:0 8px;
             background:#444;
             border:none;
             border-radius:4px;
             cursor:pointer;
             white-space:nowrap;
             color:inherit;
             font:inherit;
          ">Text Colour</button>
          <input type="color" id="psy-text-color-picker" style="display:none;" value="#ccc">
        </div>
        <!-- Reset row -->
        <div>
          <button id="psy-bg-reset-btn" style="
            height:28px;
            padding:0 8px;
            background:#555;
            border:none;
            border-radius:4px;
            cursor:pointer;
            color:inherit;
            font:inherit;
            white-space:nowrap;
          ">Reset</button>
        </div>
      </div>
    `;

        // Build controls row
        const controlsRow = document.createElement('div');
        Object.assign(controlsRow.style, {
            display: 'flex',
            justifyContent: 'flex-start',
            gap: '2rem',
            position: 'relative'
        });

        // Left column: activity + status stacked, nudged right
        const leftCol = document.createElement('div');
        Object.assign(leftCol.style, {
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            marginLeft: '2rem'
        });
        leftCol.appendChild(actDiv2);
        leftCol.appendChild(stDiv2);

        // Center column: BS-range via absolute centering
        const rangeDiv2 = document.createElement('div');
        Object.assign(rangeDiv2.style, {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
        });
        const bsLabel = document.createElement('div');
        bsLabel.textContent = 'BS Range:';
        bsLabel.style.fontWeight = 'bold';
        const minInput2 = document.createElement('input');
        minInput2.type = 'text';
        minInput2.id = 'war-min-bs-input';
        minInput2.placeholder = 'Min BS';
        minInput2.style.width = '90%';
        const maxInput2 = document.createElement('input');
        maxInput2.type = 'text';
        maxInput2.id = 'war-max-bs-input';
        maxInput2.placeholder = 'Max BS';
        maxInput2.style.width = '90%';
        rangeDiv2.appendChild(bsLabel);
        rangeDiv2.appendChild(minInput2);
        rangeDiv2.appendChild(maxInput2);
        const centerCol = document.createElement('div');
        Object.assign(centerCol.style, {
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        });
        centerCol.appendChild(rangeDiv2);

        // Add BS inputs as variables for picker

        // Right column: dummy options
        const rightCol = document.createElement('div');
        Object.assign(rightCol.style, {
            position: 'absolute',
            right: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
        });
        rightCol.appendChild(dummyDiv);

        controlsRow.appendChild(leftCol);
        controlsRow.appendChild(centerCol);
        controlsRow.appendChild(rightCol);

        // Count element
        warResultsCountEl = document.createElement('div');
        warResultsCountEl.style.fontWeight = 'bold';
        warResultsCountEl.style.alignSelf = 'center';

        // Assemble dropdown
        dropdown.appendChild(title);
        dropdown.appendChild(controlsRow);
        dropdown.appendChild(warResultsCountEl);

        wrapper.appendChild(toggle);
        wrapper.appendChild(dropdown);
        container.insertAdjacentElement('afterbegin', wrapper);
        const placeholderStyle = document.createElement('style');
        placeholderStyle.id = 'psyWarPlaceholderStyle';
        // set its initial content to default button color (#444)
        placeholderStyle.textContent = `
  #psyWarFilterWrapper input::placeholder {
    color: #444 !important;
  }
`;
        document.head.appendChild(placeholderStyle);
        // Wiring color controls
        const bgBtn = dropdown.querySelector('#psy-bg-color-btn');
        const bgPicker = dropdown.querySelector('#psy-bg-color-picker');
        const textBtn = dropdown.querySelector('#psy-text-color-btn');
        const textPicker = dropdown.querySelector('#psy-text-color-picker');
        const resetBtn = dropdown.querySelector('#psy-bg-reset-btn');
        const BG_KEY = 'psyWarThemeBG';
        const TXT_KEY = 'psyWarThemeText';
        const DEFAULT_BG = '#2f2f2f';
        const BUTTON_LIGHTNESS_DELTA = 0.083;
        const DEFAULT_TXT = getComputedStyle(dropdown).color;
        // —— Color conversion helpers ——
        function hexToRgb(hex) {
            hex = hex.replace(/^#/, '');
            if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
            const n = parseInt(hex, 16);
            return { r: (n >> 16) & 0xff, g: (n >> 8) & 0xff, b: n & 0xff };
        }
        function rgbToHsl({r,g,b}) {
            r /= 255; g /= 255; b /= 255;
            const mx = Math.max(r,g,b), mn = Math.min(r,g,b), d = mx - mn;
            let h = 0, s = mx? d/mx : 0, l = (mx + mn)/2;
            if (d) {
                if (mx === r)      h = ((g - b)/d) % 6;
                else if (mx === g) h = (b - r)/d + 2;
                else               h = (r - g)/d + 4;
                h = Math.round(h*60); if (h<0) h+=360;
            }
            return { h, s, l };
        }
        function hslToRgb(h, s, l) {
            const c = (1 - Math.abs(2*l - 1)) * s;
            const x = c * (1 - Math.abs((h/60)%2 - 1));
            const m = l - c/2;
            let [r1,g1,b1] = h<60?       [c,x,0]
            : h<120?     [x,c,0]
            : h<180?     [0,c,x]
            : h<240?     [0,x,c]
            : h<300?     [x,0,c]
            :              [c,0,x];
            return {
                r: Math.round((r1 + m)*255),
                g: Math.round((g1 + m)*255),
                b: Math.round((b1 + m)*255),
            };
        }
        function rgbToHex({r,g,b}) {
            return '#' + [r,g,b].map(n=>n.toString(16).padStart(2,'0')).join('');
        }

        // —— Capture the default lightness offset for each button ——
        const defaultBgHsl = rgbToHsl(hexToRgb(DEFAULT_BG));  // '#2f2f2f'
        const buttonDeltas = new Map([ toggle, bgBtn, textBtn, resetBtn ]
                                     .map(btn => {
            const [r,g,b] = getComputedStyle(btn).backgroundColor
            .match(/\d+/g).map(Number);
            const hsl = rgbToHsl({r,g,b});
            return [ btn, hsl.l - defaultBgHsl.l ];
        }));

        // Generate a human-readable comparison of lightness
        function describeLightnessDifference(colorHex, bgHex) {
            const hsl      = rgbToHsl(hexToRgb(colorHex));
            const bgHsl    = rgbToHsl(hexToRgb(bgHex));
            const diffPerc = Math.round((hsl.l - bgHsl.l) * 100);
            if (diffPerc === 0) return 'same lightness as background';
            if (diffPerc > 0)   return `${diffPerc}% lighter than background`;
            return `${Math.abs(diffPerc)}% darker than background`;
        }

        // The routine that walks your buttons and writes a tooltip based on the new BG
        function updateButtonDescriptions(bgCol) {
            const buttons = [ toggle, bgBtn, textBtn, resetBtn ];
            buttons.forEach(btn => {
                const style = getComputedStyle(btn);
                // grab computed backgroundColor (rgb()), convert to hex…
                const [r,g,b] = style.backgroundColor.match(/\d+/g).map(Number);
                const hex = '#' + [r,g,b].map(n => n.toString(16).padStart(2,'0')).join('');
                btn.title = `Button is ${describeLightnessDifference(hex, bgCol)}`;
            });
        }

        function applyBG(col) {
            // 1) Dropdown & toggle
            dropdown.style.background = col;
            toggle.style.background   = col;
            localStorage.setItem(BG_KEY, col);

            // 2) Compute the tinted button color
            const { h, s, l: newBgL } = rgbToHsl(hexToRgb(col));
            const newBtnL = Math.min(1, Math.max(0, newBgL + BUTTON_LIGHTNESS_DELTA));
            const newBtnColor = rgbToHex(hslToRgb(h, s, newBtnL));

            // 3) Apply to picker buttons
            [ bgBtn, textBtn, resetBtn ].forEach(btn => {
                btn.style.background = newBtnColor;
            });

            // 4) Recolor BS inputs (and update placeholder‐tint if you’re using that CSS var)
            const minInputEl = document.getElementById('war-min-bs-input');
            const maxInputEl = document.getElementById('war-max-bs-input');
            [ minInputEl, maxInputEl ].forEach(inp => {
                inp.style.background = col;
            });
            const styleTag = document.getElementById('psyWarPlaceholderStyle');
            styleTag.textContent = `
    #psyWarFilterWrapper input::placeholder {
      color: ${newBtnColor} !important;
    }
  `;
        }



        function applyText(col) {
            localStorage.setItem(TXT_KEY, col);

            // update wrapper text
            toggle.style.color   = col;
            dropdown.style.color = col;

            // and all buttons’ text
            [bgBtn, textBtn, resetBtn].forEach(btn => {
                btn.style.color = col;
            });
        }

        // Restore saved values
        const savedBG = localStorage.getItem(BG_KEY);
        if (savedBG) applyBG(savedBG);
        const savedTxt = localStorage.getItem(TXT_KEY);
        if (savedTxt) applyText(savedTxt);

        // Toggle logic
        function makeToggler(picker) {
            let open = false;
            return e => {
                if (!e.isTrusted) return;
                e.preventDefault();
                if (!open) picker.click(); else picker.blur();
                open = !open;
            };
        }

        const toggleBG = makeToggler(bgPicker);
        bgBtn.addEventListener('click', toggleBG);
        bgPicker.addEventListener('input', e => applyBG(e.target.value));

        const toggleText = makeToggler(textPicker);
        textBtn.addEventListener('click', toggleText);
        textPicker.addEventListener('input', e => applyText(e.target.value));

        resetBtn.addEventListener('click', () => {
            localStorage.removeItem(BG_KEY);
            localStorage.removeItem(TXT_KEY);
            applyBG(DEFAULT_BG);
            applyText(DEFAULT_TXT);
        });

        // Wire up filters
        const savedA2 = loadPrefs(STORAGE.warActivity, ['online','idle','offline']);
        const savedS2 = loadPrefs(STORAGE.warStatus, ['okay','hospital','abroad','traveling','jail']);
        dropdown.querySelectorAll('.war-activity-filter').forEach(cb => {
            cb.checked = savedA2.includes(cb.value);
            cb.addEventListener('change', filterWarMembers);
        });
        dropdown.querySelectorAll('.war-status-filter').forEach(cb => {
            cb.checked = savedS2.includes(cb.value);
            cb.addEventListener('change', filterWarMembers);
        });

        // Initialize BS inputs values
        const savedMin2 = loadPrefs(STORAGE.warBSMin, '');
        const savedMax2 = loadPrefs(STORAGE.warBSMax, '');
        const minInputEl = document.getElementById('war-min-bs-input');
        const maxInputEl = document.getElementById('war-max-bs-input');
        if (savedMin2) minInputEl.value = savedMin2;
        if (savedMax2) maxInputEl.value = savedMax2;
        [minInputEl, maxInputEl].forEach(inp => {
            inp.addEventListener('input', () => {
                let raw = inp.value.toLowerCase();
                const clean = raw.replace(/[^0-9.kmbtq]/g, '');
                if (clean !== raw) inp.value = clean;
                if (/^[0-9]+([.][0-9]+)?[kmbtq]?$/.test(inp.value)) {
                    const v = parseBSInput(inp.value);
                    if (!isNaN(v)) inp.value = v.toLocaleString();
                }
                savePrefs(STORAGE.warBSMin, minInputEl.value);
                savePrefs(STORAGE.warBSMax, maxInputEl.value);
                filterWarMembers();
            });
            inp.addEventListener('blur', () => {
                const v = parseBSInput(inp.value);
                if (!isNaN(v)) {
                    inp.value = v.toLocaleString();
                    savePrefs(STORAGE.warBSMin, minInputEl.value);
                    savePrefs(STORAGE.warBSMax, maxInputEl.value);
                }
                filterWarMembers();
            });
        });

        // Initial filter pass
        filterWarMembers();
    }

    function filterWarMembers() {
        if (!isWarPage()) return;
        const wrapper = document.getElementById('psyWarFilterWrapper');
        if (!wrapper) return;

        // Activity & status
        const allA = Array.from(wrapper.querySelectorAll('.war-activity-filter')).map(cb => cb.value);
        const allS = Array.from(wrapper.querySelectorAll('.war-status-filter')).map(cb => cb.value);
        let selA = Array.from(wrapper.querySelectorAll('.war-activity-filter:checked')).map(cb => cb.value);
        let selS = Array.from(wrapper.querySelectorAll('.war-status-filter:checked')).map(cb => cb.value);
        if (!selA.length) selA = allA;
        if (!selS.length) selS = allS;

        // BS range
        const minInput2 = document.getElementById('war-min-bs-input');
        const maxInput2 = document.getElementById('war-max-bs-input');
        const minV = minInput2 ? parseBSInput(minInput2.value) : NaN;
        const maxV = maxInput2 ? parseBSInput(maxInput2.value) : NaN;

        // Enemy side
        let totalE = 0, shownE = 0;
        const enemyRows = document.querySelectorAll('.enemy-faction.left ul.members-list > li.table-row, .enemy-faction.left ul.members-list > li.your, .enemy-faction.left ul.members-list > li.enemy');
        enemyRows.forEach(row => {
            totalE++;
            const act = getWarRowActivity(row);
            const st  = getWarRowStatus(row);
            const bs  = +row.dataset.bsValue || 0;
            const pass = selA.includes(act) && selS.includes(st) &&
                  (isNaN(minV) || bs >= minV) &&
                  (isNaN(maxV) || bs <= maxV);
            row.style.display = pass ? '' : 'none';
            if (pass) shownE++;
        });

        // Your side
        let totalY = 0, shownY = 0;
        const yourRows = document.querySelectorAll('.your-faction.right ul.members-list > li.table-row, .your-faction.right ul.members-list > li.your, .your-faction.right ul.members-list > li.enemy');
        yourRows.forEach(row => {
            totalY++;
            const act = getWarRowActivity(row);
            const st  = getWarRowStatus(row);
            const bs  = +row.dataset.bsValue || 0;
            const pass = selA.includes(act) && selS.includes(st) &&
                  (isNaN(minV) || bs >= minV) &&
                  (isNaN(maxV) || bs <= maxV);
            row.style.display = pass ? '' : 'none';
            if (pass) shownY++;
        });

        // Update count display
        const enemyName = document.querySelector('.name.enemy .text___chra_')?.textContent || 'Enemy';
        const yourName  = document.querySelector('.name.your .text___chra_')?.textContent  || 'Your';
        if (warResultsCountEl) {
            warResultsCountEl.textContent = `Showing ${shownE} of ${totalE} for ${enemyName} and ${shownY} of ${totalY} for ${yourName}`;
        }

        // Persist checkboxes
        const persistA2 = Array.from(wrapper.querySelectorAll('.war-activity-filter:checked')).map(cb => cb.value);
        const persistS2 = Array.from(wrapper.querySelectorAll('.war-status-filter:checked')).map(cb => cb.value);
        savePrefs(STORAGE.warActivity, persistA2);
        savePrefs(STORAGE.warStatus,   persistS2);
    }

    function getWarRowActivity(row){
        const svg=row.querySelector('svg.default___XXAGt');
        if(!svg) return 'offline';
        const fill=svg.getAttribute('fill')||'';
        if(fill.includes('svg_status_online')) return 'online';
        if(fill.includes('svg_status_idle')) return 'idle';
        return 'offline';
    }
    function getWarRowStatus(row){
        const el = row.querySelector('.status, .status___i8NBb');
        if (!el) return 'okay';
        const txt = el.textContent.trim().toLowerCase();
        if (txt.startsWith('→') || txt.startsWith('←')) return 'traveling';
        // if it's a timer (e.g. "01:23:45") treat as Hospital
        if (/\d+:\d{2}:\d{2}/.test(txt)) return 'hospital';

        if (txt.includes('hospital')) return 'hospital';
        if (txt.includes('abroad'))    return 'abroad';
        if (txt.includes('traveling')) return 'traveling';
        if (txt.includes('jail'))      return 'jail';
        return 'okay';
    }

    /**********************************************************************
     *  BS INJECTION & SORT
     **********************************************************************/
    const LIST_SELECTOR = '.members-list';

    function injectHeader(list) {
        const hdr = list.querySelector('.table-header');
        if(hdr && !hdr.querySelector('.bs')) {
            const lvl = hdr.querySelector('.level');
            if(lvl) {
                const bsH = lvl.cloneNode(true);
                bsH.childNodes[0].nodeValue = 'BS';
                bsH.classList.add('bs','finally-bs-col');
                const arrow = bsH.querySelector('[class*="sortIcon"]');
                if(arrow) arrow.classList.remove('finally-bs-asc','finally-bs-desc','finally-bs-activeIcon');
                bsH.addEventListener('click',()=>{
                    const warWrap=list.closest('.faction-war.membersWrap___NbYLx');
                    if(warWrap) sortBoth(warWrap);
                    else sortList(list,bsH);
                });
                lvl.parentNode.insertBefore(bsH,lvl.nextSibling);
            }
        }
        const titleHdr=list.parentNode.querySelector('.title, .c-pointer');
        if(titleHdr && !titleHdr.querySelector('.bs')) {
            const lvl=titleHdr.querySelector('.level');
            if(lvl) {
                const bsH=lvl.cloneNode(true);
                bsH.childNodes[0].nodeValue='BS';
                bsH.classList.add('bs','finally-bs-col');
                const arrow=bsH.querySelector('[class*="sortIcon"]');
                if(arrow) arrow.classList.remove('finally-bs-asc','finally-bs-desc','finally-bs-activeIcon');
                bsH.addEventListener('click',()=>{
                    const warWrap=list.closest('.faction-war.membersWrap___NbYLx');
                    if(warWrap) sortBoth(warWrap);
                    else sortList(list,bsH);
                });
                lvl.parentNode.insertBefore(bsH,lvl.nextSibling);
            }
        }
    }
    function injectFactionHeader(list) {
        // look for the standard header row on faction pages
        const hdr = list.querySelector('ul.table-header.cont-gray');
        // bail if there's no header or we've already injected
        if (!hdr || hdr.querySelector('.bs.finally-bs-col')) return;

        // find the Lvl header cell
        const lvlHeader = hdr.querySelector('li.lvlCol___kf6Ag');
        if (!lvlHeader) return;

        // clone it, rename to “BS”, tweak classes
        const bsHeader = lvlHeader.cloneNode(true);
        // change inner text
        bsHeader.childNodes.forEach(n => n.remove());        // strip out existing text+icons
        bsHeader.appendChild(document.createTextNode('BS')); // add new label
        // adjust classes
        bsHeader.classList.remove('lvlCol___kf6Ag');
        bsHeader.classList.add('bs', 'finally-bs-col');
        // remove any active sort‐arrow
        const arrow = bsHeader.querySelector('.sortIcon___ALgdi');
        if (arrow) arrow.classList.remove('activeIcon___h2CBt', 'asc___xuQrQ', 'desc___xuQrQ');

        // wire up click to sort
        bsHeader.addEventListener('click', () => {
            sortList(list, bsHeader);
        });

        // insert right after the Lvl header
        lvlHeader.parentNode.insertBefore(bsHeader, lvlHeader.nextSibling);
    }
    function injectRows(list) {
        const factionId=list.dataset.factionId;
        list.querySelectorAll('.table-row, .your, .enemy').forEach((row,i)=>{
            if(row.dataset.bsPos==null) row.dataset.bsPos=i;
            let cell=row.querySelector('.bs');
            if(!cell) {
                cell=document.createElement(row.tagName==='LI'?'li':'div');
                cell.className=row.tagName==='LI'
                    ? 'table-cell bs level lvl left iconShow finally-bs-col'
                : 'bs finally-bs-col';
                const ref=row.querySelector('.member-icons, .user-icons, .points');
                row.insertBefore(cell,ref||row.firstChild);
            }
            row.dataset.bsValue=0;
            cell.textContent='...';
            cell.addEventListener('mouseenter', showBSTooltip);
            cell.addEventListener('mouseleave', hideBSTooltip);

        });
    }

    function processList(list) {
        const id = idForList(list);
        if (!id) return;
        list.dataset.factionId = id;

        injectHeader(list);
        injectRows(list);
        injectFactionHeader(list);

        if (!tsFactionData[id]) {
            // first ever: immediate fetch
            queueFactionFetch(id);
        } else {
            // cached: paint now & re-apply sort
            updateBSCells(id);
            const s = bsSortStates[id] || 0;
            if (s > 0) applySortSingle(list, s);
        }
    }


    // initial + observer
    document.querySelectorAll(LIST_SELECTOR).forEach(processList);
    let started=false;
    function maybeStartup() {
        if(started) return;
        started=true;
        fetchMyStatsIfNeeded();
    }
    maybeStartup();
    new MutationObserver(mr=>{
        mr.forEach(r=>r.addedNodes.forEach(node=>{
            if(!(node instanceof Element)) return;
            node.querySelectorAll(LIST_SELECTOR).forEach(l=>{
                processList(l);
                maybeStartup();
            });
        }));
    }).observe(document.body,{childList:true,subtree:true});

    // queue any visible factions
    function getFactionIds() {
        const ids=[]; const u=new URL(window.location.href).searchParams.get('ID');
        if(u){ ids.push(u); return ids; }
        const box=document.querySelector('.rankBox___OzP3D');
        if(!box) return ids;
        box.querySelectorAll("a[href*='step=profile&ID=']").forEach(a=>{
            const m=a.href.match(/ID=(\d+)/);
            if(m&&!ids.includes(m[1])) ids.push(m[1]);
        });
        return ids;
    }
    function startup() {
        fetchMyStatsIfNeeded();
        function tryQ() {
            const ids=getFactionIds();
            if(!ids.length) return false;
            ids.forEach(queueFactionFetch);
            return true;
        }
        if(!tryQ()) setInterval(()=>{ if(tryQ()) clearInterval(this); },300);
    }
    startup();
    schedulePeriodicFetches();
    function idForList(listEl) {
        const params = new URLSearchParams(window.location.search);
        const urlID  = params.get('ID');
        const step   = params.get('step');

        // 1) profile-page logic
        if (step === 'profile' && urlID) {
            // find which .faction-info-wrap we're in
            const wrap = listEl.closest('.faction-info-wrap.restyle');
            if (wrap) {
                if (wrap.classList.contains('another-faction')) {
                    // the “other” faction = the URL param
                    return urlID;
                } else {
                    // your faction’s box — grab its own ID from the internal link
                    const href = wrap.querySelector("a[href*='step=profile&ID=']")?.href;
                    const m = href && href.match(/ID=(\d+)/);
                    if (m) return m[1];
                }
            }
            // if something went wrong, fall through to try the other heuristics
        }

        // 2) war-page logic (unchanged)
        const warWrap = listEl.closest('.faction-war.membersWrap___NbYLx');
        if (warWrap) {
            const enemyContainer = warWrap.querySelector('.enemy-faction');
            const yourContainer  = warWrap.querySelector('.your-faction');
            let href;
            if (enemyContainer && enemyContainer.contains(listEl)) {
                href = enemyContainer.querySelector("a[href*='step=profile&ID=']")?.href;
            } else if (yourContainer && yourContainer.contains(listEl)) {
                href = yourContainer.querySelector("a[href*='step=profile&ID=']")?.href;
            }
            const m = href && href.match(/ID=(\d+)/);
            if (m) return m[1];
        }

        // 3) generic rankBox (e.g. war report)
        const box = listEl.closest('.rankBox___OzP3D');
        if (box) {
            const anchors = Array.from(box.querySelectorAll("a[href*='step=profile&ID=']"));
            const idx = listEl.closest('.left') ? 0 : 1;
            const m = anchors[idx]?.href.match(/ID=(\d+)/);
            if (m) return m[1];
        }

        // 4) nothing matched
        return null;
    }

    // Always re-inject BS on any list re-render
    new MutationObserver(mutations => {
        for (const m of mutations) {
            m.addedNodes.forEach(node => {
                if (!(node instanceof Element)) return;
                if (node.matches(LIST_SELECTOR)) {
                    processList(node);
                } else {
                    node.querySelectorAll(LIST_SELECTOR).forEach(processList);
                }
            });
        }
    }).observe(document.body, { childList: true, subtree: true });
    // Listen for hash changes in the URL (Torn often uses #/war/rank)
    window.addEventListener("hashchange", () => {
        console.log("Hash changed:", window.location.hash);
        init();
    });

    // Initial check
    init();

})();