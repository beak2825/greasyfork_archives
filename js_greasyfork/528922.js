// ==UserScript==
// @name         Psy's Faction & War Member Filter
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Filters for RW and faction member lists
// @author       psychogenik
// @match        https://www.torn.com/factions.php?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528922/Psy%27s%20Faction%20%20War%20Member%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/528922/Psy%27s%20Faction%20%20War%20Member%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**********************************************************************
     *  GLOBAL STYLES
     *  - Full-width button
     *  - Column-based checkboxes
     *  - Some mobile-friendly tweaks
     **********************************************************************/
    const styleEl = document.createElement('style');
    styleEl.textContent = `
      /* Container spacing */
      #psyFilterWrapper, #psyWarFilterWrapper {
        margin: 10px 0;
      }

      /* Make the buttons full width */
      #psyFilterWrapper button, #psyWarFilterWrapper button {
        display: block;
        width: 100%;
        text-align: center;
      }

      /* For smaller screens, ensure the dropdown is also more flexible */
      @media (max-width: 600px) {
        #psyFilterWrapper div, #psyWarFilterWrapper div {
          font-size: 14px !important;
        }
      }
    `;
    document.head.appendChild(styleEl);

    /**********************************************************************
     * 1) NORMAL FACTION FILTER
     *    Observes for .faction-info-wrap and inserts filter dynamically.
     **********************************************************************/
    let factionResultsCountEl = null;

    // MutationObserver to watch for normal faction container
    const factionObserver = new MutationObserver(() => {
        const factionContainer = document.querySelector('.faction-info-wrap.restyle.another-faction');
        if (factionContainer && !factionContainer.querySelector('#psyFilterWrapper')) {
            insertFactionFilterDropdown(factionContainer);
        }
    });
    factionObserver.observe(document.body, { childList: true, subtree: true });

    function insertFactionFilterDropdown(container) {
        const filterWrapper = document.createElement('div');
        filterWrapper.id = 'psyFilterWrapper';
        filterWrapper.style.position = 'relative';

        // The toggle button
        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = 'MEMBER FILTERS';
        Object.assign(toggleBtn.style, {
            cursor: 'pointer',
            fontWeight: 'bold',
            padding: '6px 10px',
            border: '1px solid #444',
            borderRadius: '4px',
            background: '#2f2f2f',
            color: '#fff',
            fontSize: '12px'
        });

        // The dropdown (initially hidden)
        const dropdown = document.createElement('div');
        Object.assign(dropdown.style, {
            display: 'none',
            position: 'relative',
            border: '1px solid #444',
            borderRadius: '4px',
            background: '#2f2f2f',
            color: '#ccc',
            padding: '10px',
            marginTop: '8px',
            width: '100%',
            boxSizing: 'border-box',
            fontSize: '12px'
        });

        toggleBtn.addEventListener('click', () => {
            dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
        });

        // Title
        const dropdownTitle = document.createElement('div');
        dropdownTitle.textContent = 'Filter Options';
        dropdownTitle.style.fontWeight = 'bold';
        dropdownTitle.style.marginBottom = '6px';
        dropdown.appendChild(dropdownTitle);

        // Activity checkboxes (stacked in a column, with extra spacing)
        const activityContainer = document.createElement('div');
        activityContainer.style.marginBottom = '10px';
        activityContainer.innerHTML = `
            <div style="font-weight:bold; margin-bottom:4px;">Activity:</div>
            <label style="display:block; margin: 6px 0 0 10px;"><input type="checkbox" class="faction-activity-filter" value="online" checked> Online</label>
            <label style="display:block; margin: 6px 0 0 10px;"><input type="checkbox" class="faction-activity-filter" value="idle" checked> Idle</label>
            <label style="display:block; margin: 6px 0 0 10px;"><input type="checkbox" class="faction-activity-filter" value="offline" checked> Offline</label>
        `;
        dropdown.appendChild(activityContainer);

        // Status checkboxes (stacked in a column, with extra spacing)
        const statusContainer = document.createElement('div');
        statusContainer.style.marginBottom = '10px';
        statusContainer.innerHTML = `
            <div style="font-weight:bold; margin-bottom:4px;">Status:</div>
            <label style="display:block; margin: 6px 0 0 10px;"><input type="checkbox" class="faction-status-filter" value="okay" checked> Okay</label>
            <label style="display:block; margin: 6px 0 0 10px;"><input type="checkbox" class="faction-status-filter" value="hospital" checked> Hospital</label>
            <label style="display:block; margin: 6px 0 0 10px;"><input type="checkbox" class="faction-status-filter" value="abroad" checked> Abroad</label>
            <label style="display:block; margin: 6px 0 0 10px;"><input type="checkbox" class="faction-status-filter" value="traveling" checked> Traveling</label>
            <label style="display:block; margin: 6px 0 0 10px;"><input type="checkbox" class="faction-status-filter" value="jail" checked> Jail</label>
        `;
        dropdown.appendChild(statusContainer);

        // "Showing X of X" line
        factionResultsCountEl = document.createElement('div');
        factionResultsCountEl.style.marginTop = '8px';
        factionResultsCountEl.style.fontWeight = 'bold';
        factionResultsCountEl.textContent = 'Showing 0 of 0 members';
        dropdown.appendChild(factionResultsCountEl);

        // Insert into DOM
        filterWrapper.appendChild(toggleBtn);
        filterWrapper.appendChild(dropdown);
        container.insertAdjacentElement('afterbegin', filterWrapper);

        // Event listeners -> filter
        dropdown.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', filterFactionMembers);
        });

        // Initial filter
        filterFactionMembers();
        console.log('Inserted "MEMBER FILTERS" dropdown (Faction page).');
    }

    function filterFactionMembers() {
        const activityChecked = Array.from(document.querySelectorAll('.faction-activity-filter:checked'))
            .map(cb => cb.value.toLowerCase());
        const statusChecked = Array.from(document.querySelectorAll('.faction-status-filter:checked'))
            .map(cb => cb.value.toLowerCase());

        const memberRows = document.querySelectorAll('.members-list .table-body > li.table-row');
        let total = 0, shown = 0;

        memberRows.forEach(row => {
            total++;
            const rowActivity = getFactionRowActivity(row);
            const rowStatus = getFactionRowStatus(row);

            const matchActivity = activityChecked.includes(rowActivity);
            const matchStatus = statusChecked.includes(rowStatus);

            if (matchActivity && matchStatus) {
                row.style.display = '';
                shown++;
            } else {
                row.style.display = 'none';
            }
        });

        if (factionResultsCountEl) {
            factionResultsCountEl.textContent = `Showing ${shown} of ${total} members`;
        }
    }

    function getFactionRowActivity(row) {
        const svg = row.querySelector('svg.default___XXAGt');
        if (!svg) return 'offline';
        const fillVal = svg.getAttribute('fill') || '';
        if (fillVal.includes('svg_status_online'))  return 'online';
        if (fillVal.includes('svg_status_idle'))    return 'idle';
        if (fillVal.includes('svg_status_offline')) return 'offline';
        return 'offline';
    }

    function getFactionRowStatus(row) {
        const statusEl = row.querySelector('.status .ellipsis');
        if (!statusEl) return 'okay';
        const txt = statusEl.textContent.trim().toLowerCase();
        if (txt.includes('hospital'))  return 'hospital';
        if (txt.includes('abroad'))    return 'abroad';
        if (txt.includes('traveling')) return 'traveling';
        if (txt.includes('jail'))      return 'jail';
        return 'okay';
    }

    /**********************************************************************
     * 2) WAR PAGE FILTER
     *    Observes for .faction-war.membersWrap___NbYLx + fallback interval
     **********************************************************************/
    let warResultsCountEl = null;
    let warInserted = false; // track if we've inserted the war filter

    // 2a) MutationObserver approach
    const warObserver = new MutationObserver(() => {
        if (isWarPage()) {
            const warContainer = document.querySelector('.faction-war.membersWrap___NbYLx');
            if (warContainer && !warInserted) {
                insertWarFilterDropdown(warContainer);
            }
        }
    });
    warObserver.observe(document.body, { childList: true, subtree: true });

    // 2b) Fallback setInterval approach (helps on mobile if observer doesn’t fire)
    let warTries = 0;
    const warMaxTries = 30; // 15 seconds if interval=500ms
    const warInterval = setInterval(() => {
        warTries++;
        if (!isWarPage()) return; // only try if on war page
        const warContainer = document.querySelector('.faction-war.membersWrap___NbYLx');
        if (warContainer && !warInserted) {
            insertWarFilterDropdown(warContainer);
        }
        if (warTries >= warMaxTries || warInserted) {
            clearInterval(warInterval);
        }
    }, 500);

    function isWarPage() {
        return window.location.hash.includes('/war/rank');
    }

    function insertWarFilterDropdown(warContainer) {
        warInserted = true; // mark that we inserted so we don't double-insert

        const filterWrapper = document.createElement('div');
        filterWrapper.id = 'psyWarFilterWrapper';
        filterWrapper.style.position = 'relative';

        // The toggle button
        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = 'RANKED WAR FILTERS';
        Object.assign(toggleBtn.style, {
            cursor: 'pointer',
            fontWeight: 'bold',
            padding: '6px 10px',
            border: '1px solid #444',
            borderRadius: '4px',
            background: '#2f2f2f',
            color: '#fff',
            fontSize: '12px'
        });

        // The dropdown
        const dropdown = document.createElement('div');
        Object.assign(dropdown.style, {
            display: 'none',
            position: 'relative',
            border: '1px solid #444',
            borderRadius: '4px',
            background: '#2f2f2f',
            color: '#ccc',
            padding: '10px',
            marginTop: '8px',
            width: '100%',
            boxSizing: 'border-box',
            fontSize: '12px'
        });

        toggleBtn.addEventListener('click', () => {
            dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
        });

        // Title
        const dropdownTitle = document.createElement('div');
        dropdownTitle.textContent = 'Filter Options';
        dropdownTitle.style.fontWeight = 'bold';
        dropdownTitle.style.marginBottom = '6px';
        dropdown.appendChild(dropdownTitle);

        // Activity checkboxes (stacked in a column, with extra spacing)
        const activityContainer = document.createElement('div');
        activityContainer.style.marginBottom = '10px';
        activityContainer.innerHTML = `
            <div style="font-weight:bold; margin-bottom:4px;">Activity:</div>
            <label style="display:block; margin: 6px 0 0 10px;"><input type="checkbox" class="war-activity-filter" value="online" checked> Online</label>
            <label style="display:block; margin: 6px 0 0 10px;"><input type="checkbox" class="war-activity-filter" value="idle" checked> Idle</label>
            <label style="display:block; margin: 6px 0 0 10px;"><input type="checkbox" class="war-activity-filter" value="offline" checked> Offline</label>
        `;
        dropdown.appendChild(activityContainer);

        // Status checkboxes (stacked in a column, with extra spacing)
        const statusContainer = document.createElement('div');
        statusContainer.style.marginBottom = '10px';
        statusContainer.innerHTML = `
            <div style="font-weight:bold; margin-bottom:4px;">Status:</div>
            <label style="display:block; margin: 6px 0 0 10px;"><input type="checkbox" class="war-status-filter" value="okay" checked> Okay</label>
            <label style="display:block; margin: 6px 0 0 10px;"><input type="checkbox" class="war-status-filter" value="hospital" checked> Hospital</label>
            <label style="display:block; margin: 6px 0 0 10px;"><input type="checkbox" class="war-status-filter" value="abroad" checked> Abroad</label>
            <label style="display:block; margin: 6px 0 0 10px;"><input type="checkbox" class="war-status-filter" value="traveling" checked> Traveling</label>
            <label style="display:block; margin: 6px 0 0 10px;"><input type="checkbox" class="war-status-filter" value="jail" checked> Jail</label>
        `;
        dropdown.appendChild(statusContainer);

        // "Showing X of X" line
        warResultsCountEl = document.createElement('div');
        warResultsCountEl.style.marginTop = '8px';
        warResultsCountEl.style.fontWeight = 'bold';
        warResultsCountEl.textContent = 'Showing 0 of 0 members for ??? and 0 of 0 for ???';
        dropdown.appendChild(warResultsCountEl);

        // Insert above the war container
        filterWrapper.appendChild(toggleBtn);
        filterWrapper.appendChild(dropdown);
        warContainer.insertAdjacentElement('beforebegin', filterWrapper);

        // Listen for changes -> filter
        dropdown.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', filterWarMembers);
        });

        // Initial filter
        filterWarMembers();
        console.log('Inserted "RANKED WAR FILTERS" dropdown (War page).');
    }

    function filterWarMembers() {
        const activityChecked = Array.from(document.querySelectorAll('.war-activity-filter:checked'))
            .map(cb => cb.value.toLowerCase());
        const statusChecked = Array.from(document.querySelectorAll('.war-status-filter:checked'))
            .map(cb => cb.value.toLowerCase());

        // Identify the two factions
        const enemyFactionEl = document.querySelector('.name.enemy');
        const friendlyFactionEl = document.querySelector('.name.your');
        if (!enemyFactionEl || !friendlyFactionEl) {
            console.log("Could not find .name.enemy or .name.your. Possibly not on war page or not loaded yet.");
            return;
        }

        const enemyName = enemyFactionEl.querySelector('.text___chra_')?.textContent || 'Enemy Faction';
        const friendlyName = friendlyFactionEl.querySelector('.text___chra_')?.textContent || 'Your Faction';

        // The <ul> lists
        const enemyList = document.querySelector('.enemy-faction.left ul.members-list');
        const friendlyList = document.querySelector('.your-faction.right ul.members-list');
        if (!enemyList || !friendlyList) {
            console.log("Could not find enemy-faction or your-faction .members-list. Possibly not loaded yet.");
            return;
        }

        // Filter each side
        const enemyLis = enemyList.querySelectorAll('li');
        const friendlyLis = friendlyList.querySelectorAll('li');

        let totalEnemy = 0, shownEnemy = 0;
        enemyLis.forEach(li => {
            totalEnemy++;
            const rowActivity = getWarRowActivity(li);
            const rowStatus   = getWarRowStatus(li);

            const matchActivity = activityChecked.includes(rowActivity);
            const matchStatus   = statusChecked.includes(rowStatus);

            if (matchActivity && matchStatus) {
                li.style.display = '';
                shownEnemy++;
            } else {
                li.style.display = 'none';
            }
        });

        let totalFriendly = 0, shownFriendly = 0;
        friendlyLis.forEach(li => {
            totalFriendly++;
            const rowActivity = getWarRowActivity(li);
            const rowStatus   = getWarRowStatus(li);

            const matchActivity = activityChecked.includes(rowActivity);
            const matchStatus   = statusChecked.includes(rowStatus);

            if (matchActivity && matchStatus) {
                li.style.display = '';
                shownFriendly++;
            } else {
                li.style.display = 'none';
            }
        });

        if (warResultsCountEl) {
            warResultsCountEl.textContent =
                `Showing ${shownEnemy} of ${totalEnemy} members for ${enemyName} ` +
                `and ${shownFriendly} of ${totalFriendly} members for ${friendlyName}`;
        }
    }

    function getWarRowActivity(row) {
        const svg = row.querySelector('svg.default___XXAGt');
        if (!svg) return 'offline';
        const fillVal = svg.getAttribute('fill') || '';
        if (fillVal.includes('svg_status_online'))  return 'online';
        if (fillVal.includes('svg_status_idle'))    return 'idle';
        if (fillVal.includes('svg_status_offline')) return 'offline';
        return 'offline';
    }

    function getWarRowStatus(row) {
        const statusEl = row.querySelector('.status, .status___i8NBb');
        if (!statusEl) return 'okay';
        const txt = statusEl.textContent.trim().toLowerCase();
        if (txt.includes('hospital'))  return 'hospital';
        if (txt.includes('abroad'))    return 'abroad';
        if (txt.includes('traveling')) return 'traveling';
        if (txt.includes('jail'))      return 'jail';
        return 'okay';
    }

})();
