// ==UserScript==
// @name         RR Tracker - Debugging Toolkit
// @namespace    https://greasyfork.org/users/1493252
// @version      3.0
// @description  A standalone toolkit to Hard Reset, Restore, and Show localStorage data for the RR Tracker script.
// @match        https://www.torn.com/page.php?sid=russianRoulette*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/546303/RR%20Tracker%20-%20Debugging%20Toolkit.user.js
// @updateURL https://update.greasyfork.org/scripts/546303/RR%20Tracker%20-%20Debugging%20Toolkit.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- A single list of all keys, used by all functions ---
    const TRACKER_KEYS = [
      'torn_rr_tracker_results', 'torn_rr_total_profit', 'RRBets', 'rr_panelPos',
      'rr_panelCollapsed', 'rr_autoHide', 'rr_panelOpacity', 'rr_maxDisplayMatches',
      'rr_profitTarget', 'rr_lossLimit', 'rr_alertShownProfit', 'rr_alertShownLoss',
      'rr_miniBarCount', 'rr_miniButtonSize', 'RRManualBets_v3', 'rr_tracker_api_key',
      'rr_tracker_last_sync', 'rr_panelMinimized', 'rr_panelScale', 'rr_dynamicBetsEnabled',
      'rr_dynamicBetsSettings_v2', 'rr_stopLossEnabled', 'rr_sessionActive',
      'rr_sessionProfit', 'rr_sessionStartDate', 'rr_uiButtonCount'
    ];

    // --- The object containing default data for the Restore function ---
    const defaultData = {
      'torn_rr_tracker_results': JSON.stringify([]), 'torn_rr_total_profit': '0',
      'RRBets': JSON.stringify([10000, 20000, 40000, 80000, 160000, 320000, 640000, 1280000, 2560000, 5120000, 10240000]),
      'rr_panelPos': JSON.stringify({ top: '15px', left: '15px' }), 'rr_panelCollapsed': 'false', 'rr_autoHide': 'false', 'rr_panelOpacity': '0.7',
      'rr_maxDisplayMatches': '100', 'rr_profitTarget': '0', 'rr_lossLimit': '0', 'rr_alertShownProfit': 'false', 'rr_alertShownLoss': 'false',
      'rr_miniBarCount': '10', 'rr_miniButtonSize': '9',
      'RRManualBets_v3': JSON.stringify([100000, 200000, 400000, 800000, 1600000, 3200000, 6400000, 12800000, 25600000, 51200000, 102400000]),
      'rr_tracker_api_key': '', 'rr_tracker_last_sync': '0', 'rr_panelMinimized': 'false', 'rr_panelScale': '1.0',
      'rr_dynamicBetsEnabled': 'false',
      'rr_dynamicBetsSettings_v2': JSON.stringify({testBet: 10000, capital: 100000000, maxLStreak: 10, martingaleValue: 2, reinforce: false, boostedBets: false, lockedField: 'capital', startingBet: 0}),
      'rr_stopLossEnabled': 'true', 'rr_sessionActive': 'false', 'rr_sessionProfit': '0', 'rr_sessionStartDate': '0', 'rr_uiButtonCount': '16',
    };


    // ===================================================================
    // ## NEW FUNCTION: SHOW STORED DATA
    // ===================================================================
    function showStoredData() {
        if (document.getElementById('rr-data-popup-overlay')) return;

        // --- 1. Create Popup Elements ---
        const overlay = document.createElement('div');
        overlay.id = 'rr-data-popup-overlay';
        Object.assign(overlay.style, {
            position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.7)', zIndex: '999999', display: 'flex',
            alignItems: 'center', justifyContent: 'center'
        });

        const modal = document.createElement('div');
        Object.assign(modal.style, {
            background: '#222', color: '#eee', border: '1px solid #555', borderRadius: '10px',
            width: '90%', maxWidth: '600px', maxHeight: '80%', display: 'flex',
            flexDirection: 'column', boxShadow: '0 5px 20px black'
        });

        const header = document.createElement('div');
        Object.assign(header.style, {
            padding: '10px 15px', borderBottom: '1px solid #444', display: 'flex',
            justifyContent: 'space-between', alignItems: 'center'
        });

        const title = document.createElement('h2');
        title.textContent = 'Current RR Tracker Data';
        Object.assign(title.style, { margin: '0', fontSize: '18px' });

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        Object.assign(closeBtn.style, {
            background: 'transparent', border: 'none', color: '#aaa', fontSize: '28px',
            cursor: 'pointer', lineHeight: '1', padding: '0'
        });

        const contentArea = document.createElement('pre');
        Object.assign(contentArea.style, {
            padding: '15px', margin: '0', overflowY: 'auto',
            fontFamily: 'monospace', fontSize: '12px', whiteSpace: 'pre-wrap', wordBreak: 'break-all'
        });

        // --- 2. Gather & Format Data ---
        let output = `Report generated: ${new Date().toLocaleString()}\n\n`;
        let keysFound = 0;

        TRACKER_KEYS.forEach(key => {
            const value = localStorage.getItem(key);
            if (value !== null) {
                keysFound++;
                output += `------------------------------\n`;
                output += `🔑 KEY: ${key}\n`;
                output += `------------------------------\n`;
                try {
                    // Try to pretty-print if it's JSON
                    const parsed = JSON.parse(value);
                    output += JSON.stringify(parsed, null, 2);
                } catch (e) {
                    // Otherwise, just show the raw string
                    output += value;
                }
                output += `\n\n`;
            }
        });

        if (keysFound === 0) {
            output += '✅ No data found for the RR Tracker script.';
        }
        contentArea.textContent = output;

        // --- 3. Assemble and Show Popup ---
        header.append(title, closeBtn);
        modal.append(header, contentArea);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // --- 4. Add Close Logic ---
        const closePopup = () => document.body.removeChild(overlay);
        closeBtn.onclick = closePopup;
        overlay.onclick = (e) => {
            if (e.target === overlay) closePopup(); // Close only if clicking the background
        };
    }

    // ===================================================================
    // ## HELPER FUNCTIONS: RESET AND RESTORE
    // ===================================================================
    function performHardReset() {
        if (confirm('Are you sure you want to perform a Hard Reset?\n\nThis will delete ALL data for BOTH old and new versions of the RR Tracker.')) {
            let itemsRemoved = 0;
            TRACKER_KEYS.forEach(key => {
                if (localStorage.getItem(key) !== null) {
                    localStorage.removeItem(key);
                    itemsRemoved++;
                }
            });
            alert(`Hard Reset complete! ${itemsRemoved} item(s) were removed. The page will now reload.`);
            location.reload();
        }
    }

    function performDataRestore() {
        let itemsRestored = 0;
        for (const [key, value] of Object.entries(defaultData)) {
            localStorage.setItem(key, value);
            itemsRestored++;
        }
        alert(`Restore complete! ${itemsRestored} item(s) were created. The page will now reload.`);
        location.reload();
    }

    // ===================================================================
    // ## CREATE AND ADD BUTTONS
    // ===================================================================
    function createButton(id, text, color, bottomPosition) {
        if (document.getElementById(id)) return null;
        const button = document.createElement('button');
        button.id = id;
        button.textContent = text;
        Object.assign(button.style, {
            position: 'fixed', bottom: `${bottomPosition}px`, right: '10px', zIndex: '99999',
            background: `rgba(${color}, 0.8)`, color: 'white', border: `1px solid rgba(${color}, 1)`,
            borderRadius: '8px', padding: '10px 15px', cursor: 'pointer', fontSize: '14px',
            fontWeight: 'bold', boxShadow: '0 0 10px rgba(0,0,0,0.5)', width: '220px'
        });
        document.body.appendChild(button);
        return button;
    }

    const resetButton = createButton('rr-hard-reset-btn', '⚠️ Hard Reset Data', '200, 0, 0', 10);
    if (resetButton) resetButton.addEventListener('click', performHardReset);

    const restoreButton = createButton('rr-restore-data-btn', '♻️ Restore Default Data', '0, 150, 0', 65);
    if (restoreButton) restoreButton.addEventListener('click', performDataRestore);

    const showButton = createButton('rr-show-data-btn', '🔍 Show Current Data', '0, 100, 200', 120);
    if (showButton) showButton.addEventListener('click', showStoredData);

})();
