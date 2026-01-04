// ==UserScript==
// @name         Needle Manager
// @namespace    https://swc-bsd.com/
// @version      1.0.7
// @description  Prioritizes and equips the next inactive needle from inventory in preferred order, based on active battlestats. Faction needles preferred over personal. Stats are fetched and cached to minimize API calls.
// @author       castiron [2323029]
// @match        https://www.torn.com/item.php*
// @grant        none
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/536339/Needle%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/536339/Needle%20Manager.meta.js
// ==/UserScript==

/* TORN API TERMS OF SERVICE INFORMATION
Will the data be stored for any purpose?
User's battle stats are kept within the script only so it can tell if a needle is active. Stats are cached for the user-configurable window (default 7 seconds) to avoid excessive API calls.

Who can access the data besides the end user?
Nobody - everything runs client-side in the browser. No data is sent elsewhere.

What is the stored data being used for?
Data is used to decide whether each needle is already active so the script knows whether to equip the next one in rotation.

Will the API key be stored securely and who can access it?
The API key lives only inside the script and is never saved or sent elsewhere other than Torn's API. Only the user can see or modify it.

What key access level or specific selections are required?
You only need a Limited Access Torn API key with the selections=battlestats permission. No other scopes or endpoints are used.
The specific URL/endpoint used is https://api.torn.com/v2/user?selections=battlestats.
*/

// === USER CONFIG ===
const API_KEY     = 'placeholder'; // limited access required
const bstatCache  = 7; // seconds
const needleOrder = {
    1: 'strength',
    2: 'speed',
    3: 'defense',
    4: 'dexterity',
}; // 1 = first needle

/*
API_KEY
- requires a Limited Access key to fetch battlestats.

bstatCache
- duration to cache/store battlestats after retrieval, avoiding excessive API calls
-  5 sec = 12 allowed calls per minute
-  7 sec = 8.6 allowed calls per minute (default)
- 10 sec = 6 allowed calls per minute
- Default assumes you won't use a needle, finish a fight, and need next needle within 7 sec. Decrease cache time if this proves to be too long.

needleOrder
- define your preferred order of needles (1 = first)
*/
// === END USER CONFIG ===



/**
 * showBanner(message,type)
 * Displays a temporary colored banner below the top link title bar:
 *  • type = 'success' → green
 *  • type = 'error'   → red
 *  • type = 'info'    → blue
 */
function showBanner(message, type = 'info') {
    // define banner color palette
    const palettes = {
        success: { bg: '#007302', border: '#0a0' },
        error:   { bg: '#ffb130', border: '#a00' },
        info:    { bg: '#42f3ff', border: '#00a' },
    };
    const { bg, border } = palettes[type] || palettes.info;
    const banner = document.createElement('div');
    banner.className = 'needle-manager-banner';
    banner.textContent = message;
    Object.assign(banner.style, {
        background:   bg,
        border:       `1px solid ${border}`,
        color:        'black',
        padding:      '8px',
        margin:       '8px 0',
        borderRadius: '4px',
        fontWeight:   'bold',
        textAlign:    'center',
        width:        '100%',
        boxSizing:    'border-box',
    });
    // insert right after the title bar
    const title = document.querySelector('.content-title.m-bottom10') || document.querySelector('.content-title');
    if (title) title.insertAdjacentElement('afterend', banner);
    else document.body.prepend(banner);
    // auto-dismiss after 5s
    setTimeout(() => banner.remove(), 5000);
}


// Validate that needleOrder and API_KEY are correctly set.
function validateConfig() {
    const keys = Object.keys(needleOrder).map(Number).sort((a, b) => a - b);
    if (keys.join() !== '1,2,3,4') {
        showBanner(`Needle Manager: needleOrder keys must be 1-4`, 'error');
        throw new Error('Needle Manager: needleOrder keys must be 1-4');
    }
    const vals = keys.map(i => needleOrder[i]);
    const valid = ['strength', 'speed', 'defense', 'dexterity'];
    if (new Set(vals).size !== 4 || vals.some(v => !valid.includes(v))) {
        showBanner(`Needle Manager: needleOrder values must = battle stats`, 'error');
        throw new Error('Needle Manager: needleOrder values must = battle stats');
    }
    if (!API_KEY || API_KEY === 'placeholder') {
        showBanner(`Needle Manager: API key missing`, 'error');
        throw new Error('Needle Manager: API key missing');
    }
}
validateConfig();


// --- internal state ---
// tracks which buffs are active
let BSTAT_MOD = {};
// Map stat → Torn temporary-item ID
const needleIDs = { strength: 463, speed: 464, defense: 465, dexterity: 814 };
// Friendly names for logging
const needleNames = { 463: 'Epinephrine', 464: 'Melatonin', 465: 'Serotonin', 814: 'Tyrosine' };
// Cache control
let _lastFetch = 0;
let _lastPromise = null;
// Pre-sort stats according to user priority for easy iteration.
const sortedStats = Object.entries(needleOrder)
.map(([k, s]) => [Number(k), s])
.sort((a, b) => a[0] - b[0])
.map(([, s]) => s);


/** fetch & cache battlestats **/
async function fetchBattlestats() {
    const now = Date.now();
    // Return cached promise if within cache window
    if (now - _lastFetch < bstatCache * 1000 && _lastPromise) {
        return _lastPromise;
    }
    _lastFetch = now;
    _lastPromise = (async () => {
        // Build query string explicitly
        const params = new URLSearchParams({
            selections: 'battlestats',
            key:        API_KEY
        }).toString();
        // Fetch battlestats
        const resp = await fetch(`https://api.torn.com/v2/user?${params}`);
        if (!resp.ok) throw new Error(`API Error ${resp.status}`);
        const data = await resp.json();
        // Validate response shape
        ['strength','speed','defense','dexterity'].forEach(stat => {
            if (typeof data[stat + '_modifier'] !== 'number') {
                showBanner(`Needle Manager: invalid API response, verify API key/access`, 'error');
                throw new Error('Needle Manager: invalid API response, verify API key/access');
            }
        });
        // Populate BSTAT_MOD flags (>300% buff = active)
        BSTAT_MOD = {
            strength:  data.strength_modifier  > 300,
            speed:     data.speed_modifier     > 300,
            defense:   data.defense_modifier   > 300,
            dexterity: data.dexterity_modifier > 300,
        };
        console.log('Needle Manager: needle states:', BSTAT_MOD);
    })();
    return _lastPromise;
}


/** unequipAll()
 * Clicks every “option-unequip” button under #temporary-items to clear current needle.
 * Handles both <button> and <i> variants.
 */
function unequipAll() {
    document
        .querySelectorAll('#temporary-items button.option-unequip, #temporary-items i.option-unequip')
        .forEach(el => {
        // Determine clickable element
        const clickable = el.tagName === 'I'
        ? (el.closest('span.icon-h.unequip') || el)
        : el;
        const id = clickable.closest('li[data-item]')?.dataset.item;
        console.log('Needle Manager: Unequipping item', id);
        clickable.click();
    });
}


/** findEquipButton(stat)
 * Returns the `.option-equip` button for the given stat name.
 * Preference order:
 * 1) faction-loaned instance (has a “Return to Faction” button)
 * 2) any personal instance
 */
function findEquipButton(stat) {
    const id  = needleIDs[stat];
    const lis = Array.from(document.querySelectorAll(`#temporary-items li[data-item="${id}"]`));
    // faction-loaned first
    let li = lis.find(li => li.querySelector('button[aria-label^="Return"]'));
    if (li) return li.querySelector('button.option-equip');
    // then personal
    li = lis.find(li => li.querySelector('button.option-equip'));
    return li?.querySelector('button.option-equip') || null;
}


// --- UI injection: add "Needle" link to top bar ---
(function insertRetry(attempts = 0) {
    const container = document.querySelector('#top-page-links-list');
    if (!container) {
        // Retry if Torn's UI isn't loaded yet
        if (attempts < 5) {
            return setTimeout(() => insertRetry(attempts + 1), 500);
        }
        return;
    }

    // Create the "Needle" link as an image
    const a = document.createElement('a');
    a.href          = '#';
    a.className     = 't-clear h c-pointer m-icon line-h24 right';
    a.style.padding = '2px';          // optional: tighten up spacing
    a.title         = 'Needle Manager';   // hover tooltip

    const img = document.createElement('img');
    img.src                  = 'https://swc-bsd.com/images/syringe.webp';
    img.alt                  = 'Needle';
    img.style.width          = '20px';
    img.style.height         = 'auto';
    img.style.verticalAlign  = 'middle';

    a.appendChild(img);

    // Click handler: fetch stats, unequip current, equip next, show banner
    a.addEventListener('click', async e => {
        e.preventDefault();
        a.style.pointerEvents = 'none';
        a.style.opacity       = '0.5';

        // ensure the Temporary Items tab is visible
        const tempTabLink = document.querySelector('a[href="#temporary-items"]');
        const tempPanel   = document.querySelector('#temporary-items');
        if (tempTabLink && tempPanel && !tempPanel.classList.contains('current-cont')) {
            tempTabLink.click();
            await new Promise(r => setTimeout(r, 300));
        }

        try {
            // fetch up-to-date buff states
            await fetchBattlestats();

            // gather stats that are currently inactive
            const inactiveStats = sortedStats.filter(stat => !BSTAT_MOD[stat]);

            if (inactiveStats.length === 0) {
                // no inactive buffs → all active
                showBanner('Needle Manager: All needles already active', 'info');
                console.log('Needle Manager: all needles already active');
            } else {
                let didEquip = false;

                // Iterate through stats in user-defined order
                for (const stat of sortedStats) {
                    console.log(`Needle Manager: check ${stat}? active=${BSTAT_MOD[stat]}`);
                    if (!BSTAT_MOD[stat]) {
                        // buff inactive → clear any currently equipped needle
                        unequipAll();
                        // wait for UI to re-render equip buttons
                        await new Promise(r => setTimeout(r, 500));

                        const btn = findEquipButton(stat);
                        if (btn) {
                            console.log(`Needle Manager: Equipping ${needleNames[needleIDs[stat]]}`);
                            btn.click();
                            showBanner(`Equipped ${needleNames[needleIDs[stat]]}!`, 'success');
                            didEquip = true;
                            break;
                        } else {
                            console.warn(`Needle Manager: no needle found for ${stat}`);
                            showBanner(`Needle Manager: No needle found for ${stat}`, 'error');
                            // continue on to next stat
                            continue;
                        }
                    } else {
                        console.log(`Needle Manager: ${stat} needle active; skipping`);
                    }
                }

                if (!didEquip) {
                    // There were inactive buffs, but no inventory needles for them
                    console.warn('Needle Manager: No inactive needles available; available needles already active');
                    showBanner('Needle Manager: No inactive needles available; available needles already active', 'error');
                }
            }
        } catch (err) {
            console.error('Needle Manager error:', err);
            showBanner(err.message, 'error');
        } finally {
            // restore link UI
            a.style.pointerEvents = '';
            a.style.opacity       = '';
        }
    });

    // Insert immediately before the thumbnails-mode link, or prepend if missing
    const thumbLink = container.querySelector('a.thumbnails-mode');
    if (thumbLink) {
        container.insertBefore(a, thumbLink);
    } else {
        container.prepend(a);
    }
    console.log('Needle Manager: link added');
})();
