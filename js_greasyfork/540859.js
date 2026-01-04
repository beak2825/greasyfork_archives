// ==UserScript==
// @name         BJ's Torn Travel OC Warning PDA & PC Compatible
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  A smart OC timer that works on both Tampermonkey and Torn PDA, auto-detecting the environment.
// @author       BazookaJoe
// @match        https://www.torn.com/page.php?sid=travel*
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM.xmlHttpRequest
// @connect      api.torn.com
// @downloadURL https://update.greasyfork.org/scripts/540859/BJ%27s%20Torn%20Travel%20OC%20Warning%20PDA%20%20PC%20Compatible.user.js
// @updateURL https://update.greasyfork.org/scripts/540859/BJ%27s%20Torn%20Travel%20OC%20Warning%20PDA%20%20PC%20Compatible.meta.js
// ==/UserScript==

/* globals jQuery, $, GM_addStyle, GM_setValue, GM_getValue */

(function() {
    'use strict';

    // --- 1. ENVIRONMENT DETECTION & CONFIGURATION ---
    const isStandardEnv = (typeof GM_getValue !== 'undefined' && typeof GM !== 'undefined');
    console.log(`Torn OC Warner (v5.3): Running in ${isStandardEnv ? 'Standard (Tampermonkey)' : 'PDA'} mode.`);

    const CONFIG = {
        DEFAULT_OC_BUFFER_HOURS: 8,
        STORAGE_KEYS: {
            API_KEY: isStandardEnv ? 'oc_warner_tm_apiKey' : 'oc_warner_pda_apiKey',
            SHOW_ADJUST: isStandardEnv ? 'oc_warner_tm_showAdjust' : 'oc_warner_pda_showAdjust',
            USE_BUFFER: isStandardEnv ? 'oc_warner_tm_useBuffer' : 'oc_warner_pda_useBuffer',
            MANUAL_BUFFER: isStandardEnv ? 'oc_warner_tm_manualBuffer' : 'oc_warner_pda_manualBuffer'
        }
    };

    let autoDetectedOcTime = 0;
    let travelObserver = null;

    // --- 2. DATA STORAGE & API WRAPPERS ---
    function saveData(key, value) { isStandardEnv ? GM_setValue(key, value) : localStorage.setItem(key, value); }
    function loadData(key, defaultValue) { const value = isStandardEnv ? GM_getValue(key) : localStorage.getItem(key); return value === null || typeof value === 'undefined' ? defaultValue : value; }

    function runApiCall(callback) {
        const apiKey = loadData(CONFIG.STORAGE_KEYS.API_KEY, "");
        autoDetectedOcTime = 0;
        runCountdown(0, "Fetching...");
        if (!apiKey) { runCountdown(0, "Set API Key"); if (callback) callback(); return; }
        const handleSuccess = (result) => {
            let finalTime = 0;
            try { if (result.error) throw new Error(`API Error ${result.error.code}: ${result.error.error}`); const infoOc = result.organizedCrime; if (!infoOc || infoOc.status !== "Planning") throw new Error("No OC Planned"); const totalSeconds = infoOc.ready_at - Math.floor(Date.now() / 1000); if (totalSeconds > 0) { finalTime = totalSeconds; runCountdown(finalTime); } else { throw new Error("OC Ready (Delayed)"); } } catch (e) { runCountdown(0, e.message); }
            finally { autoDetectedOcTime = finalTime; $('#debug-oc-time').text(getFormattedTimeString(autoDetectedOcTime)); if (callback) callback(); }
        };
        const handleError = () => { runCountdown(0, "Network Error"); if (callback) callback(); };
        if (isStandardEnv) {
            GM.xmlHttpRequest({ method: "GET", url: `https://api.torn.com/v2/user/?selections=organizedcrime&key=${apiKey}`, onload: response => handleSuccess(JSON.parse(response.responseText)), onerror: handleError });
        } else {
            fetch(`https://api.torn.com/v2/user/?selections=organizedcrime&key=${apiKey}`).then(response => response.json()).then(handleSuccess).catch(handleError);
        }
    }

    // --- 3. LOGIC & HELPER FUNCTIONS ---
    function getFormattedTimeString(totalSeconds) { if (isNaN(totalSeconds) || totalSeconds <= 0) return "00:00:00 (0.00h)"; const d = Math.floor(totalSeconds / (3600 * 24)); const h = Math.floor(totalSeconds % (3600 * 24) / 3600); const m = Math.floor((totalSeconds % 3600) / 60); const s = Math.floor(totalSeconds % 60); let timeStr = ''; if (d > 0) timeStr += `${d}d `; timeStr += [h, m, s].map(v => String(v).padStart(2, '0')).join(':'); return `${timeStr} (${(totalSeconds / 3600).toFixed(2)}h)`; }
    function runCountdown(ocTimeInSeconds, finalStatus = null) { clearInterval(window.ocCountdownInterval); const timerEl = document.getElementById('oc-countdown-timer'); if (!timerEl) return; if (finalStatus) { timerEl.textContent = finalStatus; return; } if (ocTimeInSeconds <= 0) { timerEl.textContent = "No OC Planned"; return; } let remaining = ocTimeInSeconds; timerEl.textContent = getFormattedTimeString(remaining); window.ocCountdownInterval = setInterval(() => { remaining--; if (remaining < 0) { timerEl.textContent = "OC Ready"; clearInterval(window.ocCountdownInterval); } else { timerEl.textContent = getFormattedTimeString(remaining); } }, 1000); }
    function checkTravelAndHighlight() { const travelButton = $('button.torn-btn:contains("Travel")'); const mapContainer = $('fieldset[class*="worldMap"]'); travelButton.removeClass('travel-oc-warning travel-oc-critical-warning'); $('#oc-travel-warning-message').remove(); if (travelButton.length === 0) { $('#debug-flight-time').text('N/A'); return; } const { ocTimeInSeconds, finalFlightTimeInSeconds, bufferSeconds, useBuffer } = getCalculationValues(); if (ocTimeInSeconds > 0) { let message = '', messageClass = '', buttonClass = ''; if (finalFlightTimeInSeconds > ocTimeInSeconds) { buttonClass = 'travel-oc-critical-warning'; messageClass = 'critical-overlay'; message = 'CRITICAL:<br>Trip exceeds OC time!'; } else if (useBuffer && (finalFlightTimeInSeconds + bufferSeconds > ocTimeInSeconds)) { buttonClass = 'travel-oc-warning'; messageClass = 'warning-overlay'; message = 'WARNING:<br>Trip may conflict with OC!'; } if (buttonClass) { travelButton.addClass(buttonClass); if (mapContainer.length > 0) mapContainer.append(`<div id="oc-travel-warning-message" class="${messageClass}">${message}</div>`); } } }
    function initializePdaClickListener() { $('.destinationList___fx7Gb').off('click.ocwarner').on('click.ocwarner', '.expandButton___Q7fCV', function(event) { const clickedButton = $(this); if (clickedButton.data('oc-override')) { clickedButton.removeData('oc-override'); return; } const { ocTimeInSeconds, finalFlightTimeInSeconds, bufferSeconds, useBuffer } = getCalculationValues(clickedButton); const useBufferCheck = loadData(CONFIG.STORAGE_KEYS.USE_BUFFER, 'true') === 'true'; if (autoDetectedOcTime <= 0 && !useBufferCheck) return; let showAlert = false, alertType = 'warning', alertMessage = ''; if (finalFlightTimeInSeconds > ocTimeInSeconds && ocTimeInSeconds > 0) { showAlert = true; alertType = 'critical'; alertMessage = 'This trip is longer than your OC time!'; } else if (useBuffer && ocTimeInSeconds > 0 && (finalFlightTimeInSeconds + bufferSeconds > ocTimeInSeconds)) { showAlert = true; alertType = 'warning'; alertMessage = 'This trip may conflict with your OC!'; } if (showAlert) { event.preventDefault(); event.stopPropagation(); const proceedAction = () => { clickedButton.data('oc-override', true); clickedButton.click(); }; showFullScreenWarning(alertType, alertMessage, proceedAction); } }); }
    function showFullScreenWarning(type, message, onProceed) { $('#pda-fullscreen-alert').remove(); const alertDiv = $(`<div id="pda-fullscreen-alert" class="${type}"><h1>${type.toUpperCase()}</h1><p>${message}</p><div><button id="pda-proceed-btn" class="pda-alert-button">Proceed Anyway</button><button id="pda-cancel-btn" class="pda-alert-button">Cancel</button></div></div>`); alertDiv.on('click', '#pda-cancel-btn', function() { $(this).closest('#pda-fullscreen-alert').remove(); }); alertDiv.on('click', '#pda-proceed-btn', function() { $(this).closest('#pda-fullscreen-alert').remove(); onProceed(); }); $('body').append(alertDiv); }
    function getCalculationValues(pdaClickedButton = null) { let autoFlightTimeSeconds = 0; try { const modelData = JSON.parse($('#travel-root').attr('data-model')); if (modelData) { const type = $('input[name="travel-type"]:checked').val() || modelData.travelTypes.default; let destId; if (isStandardEnv) { destId = $('input[name="destination"]:checked').val(); } else { destId = (pdaClickedButton.attr('aria-controls') || '').split('-').pop(); } if (destId) { const dest = modelData.destinations.find(d => d.id == destId); if (dest && dest[type]) autoFlightTimeSeconds = dest[type].time.diff * 2; } } } catch(e) { /* fail silently */ } $('#debug-flight-time').text(`${(autoFlightTimeSeconds / 3600).toFixed(2)}h`); const ocAdjustmentVal = $('#override-oc-time').val(); const ocAdjustmentSeconds = (ocAdjustmentVal && !isNaN(parseFloat(ocAdjustmentVal))) ? parseFloat(ocAdjustmentVal) * 3600 : 0; const flightAdjustmentVal = $('#override-flight-time').val(); const flightAdjustmentSeconds = (flightAdjustmentVal && !isNaN(parseFloat(flightAdjustmentVal))) ? parseFloat(flightAdjustmentVal) * 3600 : 0; const ocTimeInSeconds = autoDetectedOcTime + ocAdjustmentSeconds; const finalFlightTimeInSeconds = autoFlightTimeSeconds + flightAdjustmentSeconds; const useBuffer = loadData(CONFIG.STORAGE_KEYS.USE_BUFFER, 'true') === 'true'; const manualBufferHours = parseFloat(loadData(CONFIG.STORAGE_KEYS.MANUAL_BUFFER, CONFIG.DEFAULT_OC_BUFFER_HOURS)); const bufferSeconds = manualBufferHours * 3600; return { ocTimeInSeconds, finalFlightTimeInSeconds, bufferSeconds, useBuffer }; }

    // --- 4. UI & INITIALIZATION ---
    function addUniversalStyles() {
        const styles = `
            #oc-universal-panel { position: fixed; top: 130px; right: -300px; width: 300px; height: auto; max-height: calc(100vh - 150px); background-color: #f0f0f0; border: 2px solid #F57C00; border-right: none; box-shadow: 0 4px 12px rgba(0,0,0,0.4); z-index: 99998; border-top-left-radius: 8px; border-bottom-left-radius: 8px; transition: right 0.3s ease-in-out; display: flex; flex-direction: column; color: #333; }
            #oc-universal-panel.expanded { right: 0; }
            #oc-universal-panel h4 { margin: 0; padding: 10px; font-size: 16px; color: #111; background-color: #e0e0e0; border-bottom: 1px solid #ccc; border-top-left-radius: 6px; flex-shrink: 0; }
            #oc-universal-panel-content { padding: 10px; flex-grow: 1; overflow-y: auto; font-size: 12px; }
            #oc-universal-toggle { position: fixed; top: 130px; right: 0; width: 35px; height: 50px; background-color: #F57C00; color: white; border: 2px solid #F57C00; border-right: none; border-top-left-radius: 8px; border-bottom-left-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; box-shadow: -2px 2px 8px rgba(0,0,0,0.3); z-index: 99999; }
            #oc-countdown-timer { font-family: monospace; font-weight: bold; color: #D35400; text-align: center; font-size: 14px; background: #fff; padding: 5px; border-radius: 4px; margin-bottom: 10px; border: 1px solid #ddd; }
            .oc-debug-row { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 8px; font-size: 11px; }
            .oc-debug-input { background-color: #fff; border: 1px solid #ccc; color: #333; padding: 4px; width: 60px; box-sizing: border-box; text-align: right; }
            .oc-button { background-color: #e0e0e0; color: #333; border: 1px solid #999; padding: 4px 8px; border-radius: 3px; cursor: pointer; display: block; width: 100%; text-align: center; margin-top: 10px; }
            .oc-adjustment-row, .oc-manual-buffer-row, #hide-adjust-btn { display: none; }
            .oc-adjustment-row.visible, .oc-manual-buffer-row.visible { display: flex; }
            #hide-adjust-btn.visible { display: block; }
            .travel-oc-warning { background: linear-gradient(to bottom, #ffb75e, #ed8f03) !important; color: #000 !important; border: 1px solid #c77600 !important; }
            .travel-oc-critical-warning { background: linear-gradient(to bottom, #ff6b6b, #ee1f1f) !important; color: #fff !important; border: 1px solid #c50f0f !important; }
            #oc-travel-warning-message { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 10; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; font-size: 28px; font-weight: bold; color: white; text-shadow: 2px 2px 5px rgba(0,0,0,0.8); pointer-events: none; }
            #oc-travel-warning-message.warning-overlay { background: rgba(255, 152, 0, 0.5); }
            #oc-travel-warning-message.critical-overlay { background: rgba(238, 31, 31, 0.5); }
            #pda-fullscreen-alert { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 99999; display: flex; justify-content: center; align-items: center; flex-direction: column; color: white; text-align: center; }
            #pda-fullscreen-alert.warning { background-color: rgba(255, 152, 0, 0.9); }
            #pda-fullscreen-alert.critical { background-color: rgba(238, 31, 31, 0.9); }
            .pda-alert-button { padding: 10px 20px; font-size: 1.2em; border: 2px solid white; border-radius: 5px; background-color: rgba(0,0,0,0.3); }
        `;
        isStandardEnv ? GM_addStyle(styles) : document.head.insertAdjacentHTML('beforeend', `<style>${styles}</style>`);
    }

    function createUniversalPanel() {
        if (document.getElementById('oc-universal-panel')) return;
        const panelHTML = ` <div id="oc-universal-panel"> <h4>Travel OC Tools</h4> <div id="oc-universal-panel-content"> <div>OC Countdown:</div> <div id="oc-countdown-timer">Loading...</div> <hr style="border-color: #ccc; margin: 10px 0;"> <div class="oc-debug-row"> <label for="buffer-toggle">Enable Warning Buffer</label> <input type="checkbox" id="buffer-toggle"> </div> <div class="oc-debug-row oc-manual-buffer-row"> <label for="manual-buffer-hours">Buffer (hours)</label> <input type="number" id="manual-buffer-hours" class="oc-debug-input" step="0.1" min="0"> </div> <hr style="border-color: #ccc; margin: 10px 0;"> <div class="oc-debug-row"> <label>Auto OC Time:</label> <span id="debug-oc-time">N/A</span> </div> <div class="oc-debug-row oc-adjustment-row"> <label for="override-oc-time">Adj. OC (h)</label> <input type="number" id="override-oc-time" class="oc-debug-input" step="0.1" placeholder="+/-"> </div> <div class="oc-debug-row"> <label>Est. Flight Time:</label> <span id="debug-flight-time">N/A</span> </div> <div class="oc-debug-row oc-adjustment-row"> <label for="override-flight-time">Adj. Flight (h)</label> <input type="number" id="override-flight-time" class="oc-debug-input" step="0.1" placeholder="+/-"> </div> <button id="hide-adjust-btn" class="oc-button">Hide Adjustments</button> <hr style="border-color: #ccc; margin: 10px 0;"> <input type="password" id="debug-unlock-input" class="oc-debug-input" placeholder="Unlock Adjustments..." style="width:100%; text-align:center; margin-bottom: 5px;"> <button id="debug-unlock-btn" class="oc-button">Unlock</button> <button id="set-api-key-final" class="oc-button">Set API Key</button> </div> </div>`;
        const toggleButtonHTML = `<div id="oc-universal-toggle">OCTW</div>`;
        $('body').append(panelHTML).append(toggleButtonHTML);
        $('#oc-universal-toggle').on('click', () => { const $panel = $('#oc-universal-panel'); $panel.toggleClass('expanded'); $('#oc-universal-toggle').text($panel.hasClass('expanded') ? '»' : 'OCTW'); });
        $('#set-api-key-final').on('click', () => { const newKey = prompt("Please enter your Torn API Key:", loadData(CONFIG.STORAGE_KEYS.API_KEY, "")); if (newKey !== null) { saveData(CONFIG.STORAGE_KEYS.API_KEY, newKey.trim()); runApiCall(initializeListeners); } });
        $('#debug-unlock-btn').on('click', () => { if ($('#debug-unlock-input').val().toLowerCase() === 'test') { $('.oc-adjustment-row, #hide-adjust-btn').addClass('visible'); saveData(CONFIG.STORAGE_KEYS.SHOW_ADJUST, 'true'); $('#debug-unlock-input').val(''); } });
        $('#hide-adjust-btn').on('click', () => { $('#override-oc-time, #override-flight-time').val(''); $('.oc-adjustment-row, #hide-adjust-btn').removeClass('visible'); saveData(CONFIG.STORAGE_KEYS.SHOW_ADJUST, 'false'); if(isStandardEnv) checkTravelAndHighlight(); });
        $('#buffer-toggle').on('change', function() { const isChecked = $(this).is(':checked'); saveData(CONFIG.STORAGE_KEYS.USE_BUFFER, String(isChecked)); $('.oc-manual-buffer-row').toggleClass('visible', isChecked); if(isStandardEnv) checkTravelAndHighlight(); });
        $('#manual-buffer-hours').on('input', () => { saveData(CONFIG.STORAGE_KEYS.MANUAL_BUFFER, $('#manual-buffer-hours').val()); if(isStandardEnv) checkTravelAndHighlight(); });
        if(isStandardEnv) { $('#override-oc-time, #override-flight-time').on('input', () => checkTravelAndHighlight()); }
    }

    function initializeListeners() {
        if (isStandardEnv) {
            if (travelObserver) travelObserver.disconnect();
            const destinationPanel = document.querySelector('div[class*="destinationPanel___"]');
            if (destinationPanel) { travelObserver = new MutationObserver(() => checkTravelAndHighlight()); travelObserver.observe(destinationPanel, { childList: true, subtree: true }); checkTravelAndHighlight(); }
        } else {
            initializePdaClickListener();
        }
    }

    function main() {
        addUniversalStyles();
        createUniversalPanel();
        if (loadData(CONFIG.STORAGE_KEYS.SHOW_ADJUST, 'false') === 'true') { $('.oc-adjustment-row, #hide-adjust-btn').addClass('visible'); }
        const useBuffer = loadData(CONFIG.STORAGE_KEYS.USE_BUFFER, 'true') === 'true';
        $('#buffer-toggle').prop('checked', useBuffer).trigger('change');
        $('#manual-buffer-hours').val(loadData(CONFIG.STORAGE_KEYS.MANUAL_BUFFER, CONFIG.DEFAULT_OC_BUFFER_HOURS));
        runApiCall(initializeListeners);
    }

    $(document).ready(main);
})();