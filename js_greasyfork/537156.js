// ==UserScript==
// @name         Faction Filter and Battlestats
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description Adds simple filters to your faction & war member lists, shows live Battle Scores updated every minute, highlights any changes, and remembers your sort preferences for each faction.
// @author       psychogenik & HuzGPT
// @match        https://www.torn.com/factions.php?*
// @match        https://www.torn.com/factions.php*
// @match        https://www.torn.com/war.php?step=rankreport&rankID=*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @homepageURL  https://greasyfork.org/scripts/537156-faction-war-member-filter
// @downloadURL https://update.greasyfork.org/scripts/537156/Faction%20Filter%20and%20Battlestats.user.js
// @updateURL https://update.greasyfork.org/scripts/537156/Faction%20Filter%20and%20Battlestats.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('[TS] Script loaded');
    // your Torn.com User API key for fetching your own battlestats:
    const TORN_API_KEY = 'API_KEY';
    const TS_API_KEY = 'TORNSTATS_API_KEY';
    let chainScaleMultiplier = 1;
    const OUTDATED_SECONDS = 90 * 24 * 60 * 60;
    GM_addStyle(`
  .bs.outdated {
  outline-offset: -1px;
  background-color: rgba(200, 30, 30, 0.4) !important;

}
`);
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
     *  CONFIGURATION & CACHING SETUP
     **********************************************************************/

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

    /**********************************************************************
     *  API FETCH & DIFF LOGIC
     **********************************************************************/
    function fetchFaction(id) {
        const url = `https://www.tornstats.com/api/v2/${TS_API_KEY}/spy/faction/${id}`;
        console.log('[TS] Fetching faction spy for', id);
        GM_xmlhttpRequest({
            method: 'GET', url,
            onload(res) {
                tsFactionLock = false;
                let json;
                try { json = JSON.parse(res.responseText); }
                catch (e) { console.error('[TS] JSON parse error', e); processFactionQueue(); return; }
                if (!json.status || !json.faction) { processFactionQueue(); return; }

                // diff old vs new
                const oldMembers = tsFactionData[id]?.members || {};
                const changedUIDs = [];
                Object.entries(json.faction.members || {}).forEach(([uid, m]) => {
                    const oldTotal = oldMembers[uid]?.spy?.total || 0;
                    const newTotal = m.spy?.total || 0;
                    if (newTotal !== oldTotal) changedUIDs.push(uid);
                });

                // update cache & timestamp
                tsFactionData[id]       = json.faction;
                tsFactionTimestamps[id] = Math.floor(Date.now()/1000);
                localStorage.setItem('tsFactionData',       JSON.stringify(tsFactionData));
                localStorage.setItem('tsFactionTimestamps', JSON.stringify(tsFactionTimestamps));

                // repaint only changed rows
                if (changedUIDs.length) updateBSCellsFor(id, changedUIDs);
                processFactionQueue();
            },
            onerror(err) {
                tsFactionLock = false;
                console.error('[TS] Fetch error', err);
                processFactionQueue();
            }
        });
    }

    function processFactionQueue() {
        if (tsFactionLock || !tsFactionQueue.length) return;
        tsFactionLock = true;
        const id = tsFactionQueue.shift();
        if (!tsFactionData[id]) {
            fetchFaction(id);
        } else {
            tsFactionLock = false;
            processFactionQueue();
        }
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

            const stats = tsFactionData[factionID].members[uid]?.spy;
            const total = stats?.total ?? null;

            // 1) paint
            const cell = row.querySelector('.bs');
            if (!cell) return;
            cell.textContent    = formatNumber(total);
            row.dataset.bsValue = total;

            // 2) toggle outdated
            if (stats?.timestamp) {
                const ageSec = Math.floor(Date.now()/1000) - stats.timestamp;
                cell.classList.toggle('outdated', ageSec > OUTDATED_SECONDS);
            } else {
                cell.classList.remove('outdated');
            }
        });
        filterFactionMembers();
        if (isWarPage()) filterWarMembers();
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


    /**********************************************************************
     *  FACTION FILTER UI
     **********************************************************************/
    let factionResultsCountEl = null;
    new MutationObserver(records => {
        records.forEach(r=>Array.from(r.addedNodes).forEach(node=>{
            if (!(node instanceof Element)) return;
            const c = node.matches('.faction-info-wrap.restyle.another-faction')
            ? node
            : node.querySelector('.faction-info-wrap.restyle.another-faction');
            if (c && !c.querySelector('#psyFilterWrapper')) insertFactionFilterDropdown(c);
        }));
    }).observe(document.body,{childList:true,subtree:true});

    function insertFactionFilterDropdown(container) {
        const wrapper = document.createElement('div');
        wrapper.id = 'psyFilterWrapper';
        wrapper.style.backgroundColor = window.getComputedStyle(container).backgroundColor;

        const toggle = document.createElement('button');
        toggle.textContent = 'MEMBER FILTERS';
        Object.assign(toggle.style, {
            cursor: 'pointer',
            fontWeight: 'bold',
            padding: '6px 10px',
            background: '#2f2f2f',
            color: '#fff',
            fontSize: '12px'
        });

        const dropdown = document.createElement('div');
        Object.assign(dropdown.style, {
            display: 'none',
            position: 'relative',
            background: '#2f2f2f',
            color: '#ccc',
            padding: '10px',
            width: '100%',
            fontSize: '12px'
        });
        const open = loadPrefs(STORAGE.factionDropdown, false);
        dropdown.style.display = open ? 'block' : 'none';
        toggle.addEventListener('click', () => {
            const isOpen = dropdown.style.display === 'block';
            dropdown.style.display = isOpen ? 'none' : 'block';
            savePrefs(STORAGE.factionDropdown, !isOpen);
        });

        // Title
        const title = document.createElement('div');
        title.textContent = 'Filter Options';
        Object.assign(title.style, { fontWeight: 'bold', marginBottom: '6px' });
        dropdown.appendChild(title);

        // Activity filters
        const actDiv = document.createElement('div');
        actDiv.style.marginBottom = '10px';
        actDiv.innerHTML = `
        <div style="font-weight:bold; margin-bottom:4px;">Activity:</div>
        <label><input type="checkbox" class="faction-activity-filter" value="online"> Online</label><br>
        <label><input type="checkbox" class="faction-activity-filter" value="idle"> Idle</label><br>
        <label><input type="checkbox" class="faction-activity-filter" value="offline"> Offline</label>
    `;
        dropdown.appendChild(actDiv);

        // Status filters
        const stDiv = document.createElement('div');
        stDiv.style.marginBottom = '10px';
        stDiv.innerHTML = `
        <div style="font-weight:bold; margin-bottom:4px;">Status:</div>
        <label><input type="checkbox" class="faction-status-filter" value="okay"> Okay</label><br>
        <label><input type="checkbox" class="faction-status-filter" value="hospital"> Hospital</label><br>
        <label><input type="checkbox" class="faction-status-filter" value="abroad"> Abroad</label><br>
        <label><input type="checkbox" class="faction-status-filter" value="traveling"> Traveling</label><br>
        <label><input type="checkbox" class="faction-status-filter" value="jail"> Jail</label>
    `;
        dropdown.appendChild(stDiv);

        // BS range inputs
        const rangeDiv = document.createElement('div');
        rangeDiv.style.marginBottom = '10px';
        rangeDiv.innerHTML = `
        <div style="font-weight:bold; margin-bottom:4px;">BS Range:</div>
        <input type="text" id="faction-min-bs-input" placeholder="Min BS" style="width:45%;margin-right:5%;" />
        <input type="text" id="faction-max-bs-input" placeholder="Max BS" style="width:45%;" />
    `;

        dropdown.appendChild(rangeDiv);

        // Results count
        const countEl = document.createElement('div');
        Object.assign(countEl.style, { marginTop: '8px', fontWeight: 'bold' });
        dropdown.appendChild(countEl);

        wrapper.append(toggle, dropdown);
        container.insertAdjacentElement('afterbegin', wrapper);

        // Load & wire activity/status filters
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

        // BS inputs live-format, persistence, and filter
        const minInput = dropdown.querySelector('#faction-min-bs-input');
        const maxInput = dropdown.querySelector('#faction-max-bs-input');
        const savedMin = loadPrefs(STORAGE.factionBSMin, '');
        const savedMax = loadPrefs(STORAGE.factionBSMax, '');
        if (savedMin) minInput.value = savedMin;
        if (savedMax) maxInput.value = savedMax;
        [minInput, maxInput].forEach(inp => {
            inp.addEventListener('input', () => {
                let raw = inp.value.toLowerCase();

                // 1) strip anything except digits, dot, or k/m/b/t/q
                const clean = raw.replace(/[^0-9.kmbtq]/g, '');
                if (clean !== raw) {
                    raw = clean;
                    inp.value = raw;
                }

                // 2) if it's exactly an integer (e.g. "1234"), integer+suffix (e.g. "12k"),
                //    or decimal+suffix (e.g. "12.8k"), format it immediately:
                if (
                    /^[0-9]+$/.test(raw) ||
                    /^[0-9]+[kmbtq]$/.test(raw) ||
                    /^[0-9]+\.[0-9]+[kmbtq]$/.test(raw)
                ) {
                    const v = parseBSInput(raw);
                    if (!isNaN(v)) inp.value = v.toLocaleString();
                }

                // 3) persist & re-filter
                savePrefs(STORAGE.factionBSMin, minInput.value);
                savePrefs(STORAGE.factionBSMax, maxInput.value);
                filterFactionMembers();
            });

            inp.addEventListener('blur', () => {
                // final normalization on blur (including plain decimals)
                const v = parseBSInput(inp.value);
                if (!isNaN(v)) {
                    inp.value = v.toLocaleString();
                    savePrefs(STORAGE.factionBSMin, minInput.value);
                    savePrefs(STORAGE.factionBSMax, maxInput.value);
                }
                filterFactionMembers();
            });
        });
        // Initial filter
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
        const rows = document.querySelectorAll('ul.members-list[data-faction-id] > li.table-row, ul.members-list[data-faction-id] > li.your, ul.members-list[data-faction-id] > li.enemy');
        rows.forEach(row => {
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

        // Update “Showing X of Y” text
        const countEl = wrapper.querySelector('div[style*="font-weight:bold"] + div');
        if (countEl) countEl.textContent = `Showing ${shown} of ${total} members`;

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
        if (txt.includes('hospital')) return 'hospital';
        if (txt.includes('abroad')) return 'abroad';
        if (txt.includes('traveling')) return 'traveling';
        if (txt.includes('jail')) return 'jail';
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
        const el=row.querySelector('.status, .status___i8NBb');
        if(!el) return 'okay';
        const txt=el.textContent.trim().toLowerCase();
        if(txt.includes('hospital')) return 'hospital';
        if(txt.includes('abroad')) return 'abroad';
        if(txt.includes('traveling')) return 'traveling';
        if(txt.includes('jail')) return 'jail';
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
        const id=idForList(list);
        if(!id) return;
        list.dataset.factionId=id;
        injectHeader(list);
        injectRows(list);
        // add our little "(9.00)" after each name
        if (list.closest('.enemy-faction')) {
            addRespectEstimates(list);
        }
        // paint cache
        if(tsFactionData[id]) {
            updateBSCells(id);
            // re-apply sort
            const s=bsSortStates[id]||0;
            if(s>0) applySortSingle(list,s);
            // TTL
            const now=Math.floor(Date.now()/1000);
            if(now - (tsFactionTimestamps[id]||0) > FACTION_CACHE_SECONDS) {
                queueFactionFetch(id);
            }
        } else {
            queueFactionFetch(id);
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
    function idForList(listEl) {
        // 1) If the URL has ?ID=, use that
        const urlID = new URL(window.location.href).searchParams.get('ID');
        if (urlID) return urlID;

        // 2) If we're in a war rank view, detect which side this list belongs to
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
            if (href) {
                const m = href.match(/ID=(\d+)/);
                if (m) return m[1];
            }
        }

        // 3) Otherwise, in a generic rankBox (e.g. war report), pick based on left/right
        const box = listEl.closest('.rankBox___OzP3D');
        if (box) {
            const anchors = Array.from(box.querySelectorAll("a[href*='step=profile&ID=']"));
            const idx = listEl.closest('.left') ? 0 : 1;
            const m = anchors[idx]?.href.match(/ID=(\d+)/);
            if (m) return m[1];
        }

        // 4) Fallback
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
