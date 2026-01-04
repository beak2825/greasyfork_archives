// ==UserScript==
// @name         Psy's Dots
// @namespace    http://tampermonkey.net/
// @version      1.11
// @description  Shows online/idle/offline counts under each faction's score on the war page (#/war/rank) for any faction ID
// @author       psychogenik
// @match        https://www.torn.com/factions.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529336/Psy%27s%20Dots.user.js
// @updateURL https://update.greasyfork.org/scripts/529336/Psy%27s%20Dots.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("Torn War DOM Status Indicators (Any Faction ID) loaded.");

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

    // Listen for hash changes in the URL (Torn often uses #/war/rank)
    window.addEventListener("hashchange", () => {
        console.log("Hash changed:", window.location.hash);
        init();
    });

    // Initial check
    init();
})();
