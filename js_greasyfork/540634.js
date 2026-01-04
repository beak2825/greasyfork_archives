// ==UserScript==
// @name         Torn Travel OC Warning - PDA
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  A reliable OC timer for Torn PDA with a toggle and manual entry for the warning buffer.
// @author       BazookaJoe & Gemini
// @match        https://www.torn.com/page.php?sid=travel*
// @downloadURL https://update.greasyfork.org/scripts/540634/Torn%20Travel%20OC%20Warning%20-%20PDA.user.js
// @updateURL https://update.greasyfork.org/scripts/540634/Torn%20Travel%20OC%20Warning%20-%20PDA.meta.js
// ==/UserScript==

/* globals jQuery, $ */

(function() {
    'use strict';

    const SCRIPT_NAME = "Torn Travel OC Warning - PDA";
    const DEFAULT_OC_BUFFER_HOURS = 8;
    const PDA_API_KEY_NAME = "oc-warner-api-key-pda";
    const PDA_SHOW_ADJUST_KEY = "pda-oc-show-adjust";
    const PDA_USE_BUFFER_KEY = "pda-oc-use-buffer";
    const PDA_MANUAL_BUFFER_KEY = "pda-manual-buffer-hours";

    let autoDetectedOcTime = 0;

    function addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* --- MODIFIED: Right-side Panel Styles --- */
            #travel-oc-panel-container {
                position: fixed;
                top: 130px; /* Position below other potential scripts */
                right: -280px; /* Start off-screen to the right */
                z-index: 10001;
                transition: right 0.3s ease-in-out;
                width: 280px;
                font-family: Arial, sans-serif;
            }
            #travel-oc-panel-container.expanded {
                right: 0;
            }
            #travel-oc-panel {
                background: #333;
                border: 1px solid #F57C00; /* Orange border */
                border-right: none;
                padding: 10px;
                border-top-left-radius: 8px;
                border-bottom-left-radius: 8px;
                font-size: 11px;
                color: #ccc;
                box-shadow: -2px 2px 10px rgba(0,0,0,0.5);
                height: calc(100vh - 170px); /* Give it a max height */
                overflow-y: auto;
            }
            #oc-countdown-timer { font-family: monospace; font-weight: bold; color: #ff9800; text-align: center; font-size: 14px; background: #222; padding: 5px; border-radius: 4px; margin-bottom: 10px; }

            /* --- NEW: Right-side Toggle Button --- */
            #oc-right-toggle-btn {
                position: fixed;
                top: 130px; /* MUST match the panel's top value */
                right: 0;
                width: 35px;
                height: 50px;
                background-color: #F57C00; /* Orange */
                color: white;
                border: 2px solid #F57C00;
                border-right: none;
                border-top-left-radius: 8px;
                border-bottom-left-radius: 8px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 12px; /* Sized for OCTW */
                box-shadow: -2px 2px 8px rgba(0,0,0,0.3);
                z-index: 10002;
                transition: background-color 0.2s;
            }
            #oc-right-toggle-btn:hover {
                background-color: #E65100; /* Darker Orange */
            }

            /* --- Original Unchanged Styles --- */
            .debug-row { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
            .debug-row.unlock-row { gap: 4px; }
            .debug-input { background-color: #111; border: 1px solid #555; color: #fff; padding: 2px 4px; width: 100%; box-sizing: border-box; }
            #set-api-key-final, #hide-adjust-btn, #debug-unlock-btn { background-color: #555; color: #eee; border: 1px solid #666; padding: 4px 8px; border-radius: 3px; cursor: pointer; display: block; width: 100%; text-align: center; margin-top: 5px; }
            #debug-unlock-btn { flex-basis: 80px; flex-shrink: 0; }
            #pda-fullscreen-alert { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 99999; display: flex; justify-content: center; align-items: center; flex-direction: column; color: white; text-align: center; padding: 15px; box-sizing: border-box; }
            #pda-fullscreen-alert.warning { background-color: rgba(255, 152, 0, 0.9); }
            #pda-fullscreen-alert.critical { background-color: rgba(238, 31, 31, 0.9); }
            .pda-alert-button { padding: 10px 20px; font-size: 1.2em; border: 2px solid white; border-radius: 5px; background-color: rgba(0,0,0,0.3); color: white; min-width: 150px; margin: 5px; }
            .oc-adjustment-row, #hide-adjust-btn, .manual-buffer-row { display: none; }
            .oc-adjustment-row.visible, #hide-adjust-btn.visible, .manual-buffer-row.visible { display: flex; }
        `;
        document.head.appendChild(style);
    }

    // --- NO CHANGES TO THE FUNCTIONS BELOW ---
    function getFormattedTimeString(totalSeconds) { if (isNaN(totalSeconds) || totalSeconds <= 0) return "00:00:00 (0.00h)"; const d = Math.floor(totalSeconds / (3600 * 24)); const h = Math.floor(totalSeconds % (3600 * 24) / 3600); const m = Math.floor((totalSeconds % 3600) / 60); const s = Math.floor(totalSeconds % 60); let timeStr = ''; if (d > 0) timeStr += `${d}d `; timeStr += [h, m, s].map(v => String(v).padStart(2, '0')).join(':'); const hoursOnly = (totalSeconds / 3600).toFixed(2); return `${timeStr} (${hoursOnly}h)`; }
    function runCountdown(ocTimeInSeconds, finalStatus = null) { clearInterval(window.ocCountdownInterval); const timerEl = document.getElementById('oc-countdown-timer'); if (!timerEl) return; if (finalStatus) { timerEl.textContent = finalStatus; return; } if (ocTimeInSeconds <= 0) { timerEl.textContent = "No OC Planned"; return; } let remaining = ocTimeInSeconds; timerEl.textContent = getFormattedTimeString(remaining); window.ocCountdownInterval = setInterval(() => { remaining--; if (remaining < 0) { timerEl.textContent = "OC Ready"; clearInterval(window.ocCountdownInterval); } else { timerEl.textContent = getFormattedTimeString(remaining); } }, 1000); }
    function fetchAndCalculateOCTimer(callback) { const apiKey = localStorage.getItem(PDA_API_KEY_NAME) || ""; autoDetectedOcTime = 0; runCountdown(0, "Fetching..."); if (!apiKey) { runCountdown(0, "Set API Key"); if (callback) callback(); return; } fetch(`https://api.torn.com/v2/user/?selections=organizedcrime&key=${apiKey}`).then(response => response.json()).then(result => { let finalTime = 0; try { if (result.error) throw new Error(`API Error ${result.error.code}: ${result.error.error}`); const infoOc = result.organizedCrime; if (!infoOc || infoOc.status !== "Planning") throw new Error("No OC Planned"); const totalSeconds = infoOc.ready_at - Math.floor(Date.now() / 1000); if (totalSeconds > 0) { finalTime = totalSeconds; runCountdown(finalTime); } else { throw new Error("OC Ready (Delayed)"); } } catch (e) { runCountdown(0, e.message); } finally { autoDetectedOcTime = finalTime; $('#debug-oc-time').text(getFormattedTimeString(autoDetectedOcTime)); if (callback) callback(); } }).catch(error => { runCountdown(0, "Network Error"); if (callback) callback(); }); }
    function showFullScreenWarning(type, message, onProceed) { $('#pda-fullscreen-alert').remove(); const alertDiv = $(`<div id="pda-fullscreen-alert" class="${type}"><h1>${type.toUpperCase()}</h1><p>${message}</p><div><button id="pda-proceed-btn" class="pda-alert-button">Proceed Anyway</button><button id="pda-cancel-btn" class="pda-alert-button">Cancel</button></div></div>`); alertDiv.on('click', '#pda-cancel-btn', function() { $(this).closest('#pda-fullscreen-alert').remove(); }); alertDiv.on('click', '#pda-proceed-btn', function() { $(this).closest('#pda-fullscreen-alert').remove(); onProceed(); }); $('body').append(alertDiv); }
    function initializePdaTravelListeners() { $('.destinationList___fx7Gb').on('click', '.expandButton___Q7fCV', function(event) { const clickedButton = $(this); if (clickedButton.data('oc-override')) { clickedButton.removeData('oc-override'); return; } const useBuffer = localStorage.getItem(PDA_USE_BUFFER_KEY) === null || localStorage.getItem(PDA_USE_BUFFER_KEY) === 'true'; if (autoDetectedOcTime <= 0 && !useBuffer) return; const modelData = JSON.parse($('#travel-root').attr('data-model')); const type = $('input[name="travel-type"]:checked').val() || modelData.travelTypes.default; const destId = (clickedButton.attr('aria-controls') || '').split('-').pop(); if (!destId) return; const dest = modelData.destinations.find(d => d.id == destId); if (!dest || !dest[type]) return; const autoFlightTimeSeconds = dest[type].time.diff * 2; $('#debug-flight-time').text(`${(autoFlightTimeSeconds / 3600).toFixed(2)}h`); const ocAdjustmentVal = $('#override-oc-time').val(); const ocAdjustmentSeconds = (ocAdjustmentVal && !isNaN(parseFloat(ocAdjustmentVal))) ? parseFloat(ocAdjustmentVal) * 3600 : 0; const flightAdjustmentVal = $('#override-flight-time').val(); const flightAdjustmentSeconds = (flightAdjustmentVal && !isNaN(parseFloat(flightAdjustmentVal))) ? parseFloat(flightAdjustmentVal) * 3600 : 0; const ocTimeInSeconds = autoDetectedOcTime + ocAdjustmentSeconds; const finalFlightTimeInSeconds = autoFlightTimeSeconds + flightAdjustmentSeconds; const manualBufferHours = parseFloat(localStorage.getItem(PDA_MANUAL_BUFFER_KEY) || DEFAULT_OC_BUFFER_HOURS); const bufferSeconds = manualBufferHours * 3600; let showAlert = false; let alertType = 'warning'; let alertMessage = ''; if (finalFlightTimeInSeconds > ocTimeInSeconds && ocTimeInSeconds > 0) { showAlert = true; alertType = 'critical'; alertMessage = 'This trip is longer than your OC time!'; } else if (useBuffer && ocTimeInSeconds > 0 && (finalFlightTimeInSeconds + bufferSeconds > ocTimeInSeconds)) { showAlert = true; alertType = 'warning'; alertMessage = 'This trip may conflict with your OC!'; } if (showAlert) { event.preventDefault(); event.stopPropagation(); const proceedAction = () => { clickedButton.data('oc-override', true); clickedButton.click(); }; showFullScreenWarning(alertType, alertMessage, proceedAction); } }); }

    // --- MINIMAL CHANGES TO THIS FUNCTION ---
    function createPanel() {
        if (document.getElementById('travel-oc-panel-container')) return;

        // MODIFIED: The panel and button are now separate
        const panelHTML = `
            <div id="travel-oc-panel-container">
                <div id="travel-oc-panel">
                    <h4>Travel OC Tools</h4>
                    <div class="timer-label">OC Countdown:</div>
                    <div id="oc-countdown-timer">Loading...</div>
                    <div class="debug-row" style="margin-top: 10px;">
                        <label for="buffer-toggle">Enable Warning Buffer</label>
                        <input type="checkbox" id="buffer-toggle">
                    </div>
                    <div class="debug-row manual-buffer-row">
                        <label>Manual Buffer (h):</label>
                        <input type="number" id="manual-buffer-hours" class="debug-input" step="0.1" min="0">
                    </div>
                    <hr style="border-color: #444; margin: 10px 0;">
                    <div class="debug-row">
                        <label>Auto OC Time:</label>
                        <span id="debug-oc-time" class="debug-value">N/A</span>
                    </div>
                    <div class="debug-row oc-adjustment-row">
                        <label>Adj. OC (h):</label>
                        <input type="number" id="override-oc-time" class="debug-input" step="0.1" placeholder="+/- e.g. -2.5">
                    </div>
                    <div class="debug-row">
                        <label>Auto Flight Time:</label>
                        <span id="debug-flight-time" class="debug-value">N/A</span>
                    </div>
                    <div class="debug-row oc-adjustment-row">
                        <label>Adj. Flight (h):</label>
                        <input type="number" id="override-flight-time" class="debug-input" step="0.1" placeholder="+/- e.g. 0.5">
                    </div>
                    <button id="hide-adjust-btn">Hide Adjustments</button>
                    <hr style="border-color: #444; margin: 10px 0;">
                    <div class="debug-row unlock-row">
                        <input type="password" id="debug-unlock-input" class="debug-input" placeholder="Unlock Command...">
                        <button id="debug-unlock-btn">Unlock</button>
                    </div>
                    <button id="set-api-key-final">Set API Key</button>
                </div>
            </div>`;

        const toggleButtonHTML = `<div id="oc-right-toggle-btn">OCTW</div>`;

        // Add the new elements to the page
        $('body').append(panelHTML).append(toggleButtonHTML);

        // MODIFIED: New click handler for the new button
        $('#oc-right-toggle-btn').on('click', () => {
            const $container = $('#travel-oc-panel-container');
            $container.toggleClass('expanded');
            $('#oc-right-toggle-btn').text($container.hasClass('expanded') ? '»' : 'OCTW');
        });

        // --- Original internal button logic (UNCHANGED) ---
        $('#set-api-key-final').on('click', () => { const newKey = prompt("Please enter your Torn API Key:", localStorage.getItem(PDA_API_KEY_NAME) || ""); if (newKey !== null) { localStorage.setItem(PDA_API_KEY_NAME, newKey.trim()); fetchAndCalculateOCTimer(initializePdaTravelListeners); } });
        $('#debug-unlock-btn').on('click', function() { if ($('#debug-unlock-input').val().toLowerCase() === 'test') { $('.oc-adjustment-row, #hide-adjust-btn').addClass('visible'); localStorage.setItem(PDA_SHOW_ADJUST_KEY, 'true'); $('#debug-unlock-input').val(''); } });
        $('#hide-adjust-btn').on('click', function() { $('#override-oc-time, #override-flight-time').val(''); $('.oc-adjustment-row, #hide-adjust-btn').removeClass('visible'); localStorage.setItem(PDA_SHOW_ADJUST_KEY, 'false'); });
        $('#buffer-toggle').on('change', function() { const isChecked = $(this).is(':checked'); localStorage.setItem(PDA_USE_BUFFER_KEY, isChecked); $('.manual-buffer-row').toggleClass('visible', isChecked); });
        $('#manual-buffer-hours').on('input', function() { localStorage.setItem(PDA_MANUAL_BUFFER_KEY, $(this).val()); });
    }

    // --- NO CHANGES TO THE MAIN FUNCTION ---
    function main() {
        addStyles();
        createPanel();
        if (localStorage.getItem(PDA_SHOW_ADJUST_KEY) === 'true') {
            $('.oc-adjustment-row, #hide-adjust-btn').addClass('visible');
        }
        const useBuffer = localStorage.getItem(PDA_USE_BUFFER_KEY) === null || localStorage.getItem(PDA_USE_BUFFER_KEY) === 'true';
        $('#buffer-toggle').prop('checked', useBuffer);
        if (useBuffer) {
            $('.manual-buffer-row').addClass('visible');
        }
        $('#manual-buffer-hours').val(localStorage.getItem(PDA_MANUAL_BUFFER_KEY) || DEFAULT_OC_BUFFER_HOURS);

        fetchAndCalculateOCTimer(initializePdaTravelListeners);
    }

    setTimeout(main, 500);
})();