// ==UserScript==
// @name         Torn Travel OC Warning
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  A reliable OC flight timer with a right-side toggle panel and manual entry for the warning buffer.
// @author       BazookaJoe 
// @match        https://www.torn.com/page.php?sid=travel*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM.xmlHttpRequest
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @connect      api.torn.com
// @downloadURL https://update.greasyfork.org/scripts/540632/Torn%20Travel%20OC%20Warning.user.js
// @updateURL https://update.greasyfork.org/scripts/540632/Torn%20Travel%20OC%20Warning.meta.js
// ==/UserScript==

/* globals jQuery, $, GM_addStyle, GM_setValue, GM_getValue */

(function() {
    'use strict';

    const DEFAULT_OC_BUFFER_HOURS = 8;
    const SHOW_ADJUST_KEY = 'showAdjustmentBoxes_v2';
    const USE_BUFFER_KEY = 'useWarningBuffer_v2';
    const MANUAL_BUFFER_KEY = 'manualBufferHours_v2';

    let autoDetectedOcTime = 0;
    let travelObserver = null;

    function addStyles() {
        GM_addStyle(`
            /* Main Panel Styles */
            #travel-oc-panel-container-std {
                position: fixed; top: 190px; right: -300px; width: 300px;
                height: calc(100vh - 210px); background-color: #f0f0f0;
                border: 2px solid #F57C00; border-right: none;
                box-shadow: 0 4px 12px rgba(0,0,0,0.4); z-index: 99998;
                border-top-left-radius: 8px; border-bottom-left-radius: 8px;
                transition: right 0.3s ease-in-out; display: flex;
                flex-direction: column; color: #333;
            }
            #travel-oc-panel-container-std.expanded { right: 0; }
            #travel-oc-panel-container-std h4 {
                margin: 0; padding: 10px; font-size: 16px; color: #111;
                display: flex; justify-content: flex-start; align-items: center;
                background-color: #e0e0e0; border-bottom: 1px solid #ccc;
                border-top-left-radius: 6px;
            }
            #travel-oc-panel-std { padding: 10px; flex-grow: 1; overflow-y: auto; font-size: 12px; }

            /* Toggle Button Styles */
            #travel-oc-panel-toggle-std {
                position: fixed; top: 190px; right: 0; width: 35px; height: 50px;
                background-color: #F57C00; color: white; border: 2px solid #F57C00;
                border-right: none; border-top-left-radius: 8px;
                border-bottom-left-radius: 8px; cursor: pointer;
                display: flex; align-items: center; justify-content: center;
                font-weight: bold; font-size: 12px;
                box-shadow: -2px 2px 8px rgba(0,0,0,0.3); z-index: 99999;
                transition: background-color 0.2s;
            }
            #travel-oc-panel-toggle-std:hover { background-color: #E65100; }

            /* Other Styles */
            .travel-oc-warning { background: linear-gradient(to bottom, #ffb75e, #ed8f03) !important; color: #000 !important; border: 1px solid #c77600 !important; }
            .travel-oc-critical-warning { background: linear-gradient(to bottom, #ff6b6b, #ee1f1f) !important; color: #fff !important; border: 1px solid #c50f0f !important; }
            #oc-travel-warning-message { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 10; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; font-size: 28px; font-weight: bold; color: white; text-shadow: 2px 2px 5px rgba(0,0,0,0.8); pointer-events: none; }
            #oc-travel-warning-message.warning-overlay { background: rgba(255, 152, 0, 0.5); }
            #oc-travel-warning-message.critical-overlay { background: rgba(238, 31, 31, 0.5); }
            #oc-countdown-timer { font-family: monospace; font-weight: bold; color: #D35400; text-align: center; font-size: 14px; background: #fff; padding: 5px; border-radius: 4px; margin-bottom: 10px; border: 1px solid #ddd; }
            .debug-row { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; font-size: 11px; }
            .debug-input { background-color: #fff; border: 1px solid #ccc; color: #333; padding: 2px 4px; width: 100%; box-sizing: border-box; }
            #set-api-key-final, #hide-adjust-btn, #debug-unlock-btn { background-color: #e0e0e0; color: #333; border: 1px solid #999; padding: 4px 8px; border-radius: 3px; cursor: pointer; display: block; width: 100%; text-align: center; margin-top: 5px; }
            .oc-adjustment-row, #hide-adjust-btn, .manual-buffer-row { display: none; }
            .oc-adjustment-row.visible, #hide-adjust-btn.visible, .manual-buffer-row.visible { display: flex; }
        `);
    }

    function getFormattedTimeString(totalSeconds) {
        if (isNaN(totalSeconds) || totalSeconds <= 0) return "00:00:00 (0.00h)";
        const d = Math.floor(totalSeconds / (3600 * 24));
        const h = Math.floor(totalSeconds % (3600 * 24) / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = Math.floor(totalSeconds % 60);
        let timeStr = '';
        if (d > 0) timeStr += `${d}d `;
        timeStr += [h, m, s].map(v => String(v).padStart(2, '0')).join(':');
        const hoursOnly = (totalSeconds / 3600).toFixed(2);
        return `${timeStr} (${hoursOnly}h)`;
    }

    function runCountdown(ocTimeInSeconds, finalStatus = null) {
        clearInterval(window.ocCountdownInterval);
        const timerEl = document.getElementById('oc-countdown-timer');
        if (!timerEl) return;
        if (finalStatus) {
            timerEl.textContent = finalStatus;
            return;
        }
        if (ocTimeInSeconds <= 0) {
            timerEl.textContent = "No OC Planned";
            return;
        }
        let remaining = ocTimeInSeconds;
        timerEl.textContent = getFormattedTimeString(remaining);
        window.ocCountdownInterval = setInterval(() => {
            remaining--;
            if (remaining < 0) {
                timerEl.textContent = "OC Ready";
                clearInterval(window.ocCountdownInterval);
            } else {
                timerEl.textContent = getFormattedTimeString(remaining);
            }
        }, 1000);
    }

    function fetchAndCalculateOCTimer(callback) {
        const apiKey = GM_getValue("tornApiKey", "");
        autoDetectedOcTime = 0;
        runCountdown(0, "Fetching...");

        if (!apiKey) {
            runCountdown(0, "Set API Key");
            if (callback) callback();
            return;
        }

        GM.xmlHttpRequest({
            method: "GET",
            url: `https://api.torn.com/v2/user/?selections=organizedcrime&key=${apiKey}`,
            onload: response => {
                let finalTime = 0;
                try {
                    const result = JSON.parse(response.responseText);
                    if (result.error) throw new Error(`API Error ${result.error.code}: ${result.error.error}`);
                    const infoOc = result.organizedCrime;
                    if (!infoOc || infoOc.status !== "Planning") throw new Error("No OC Planned");
                    const totalSeconds = infoOc.ready_at - Math.floor(Date.now() / 1000);
                    if (totalSeconds > 0) {
                        finalTime = totalSeconds;
                        runCountdown(finalTime);
                    } else {
                        throw new Error("OC Ready (Delayed)");
                    }
                } catch (e) {
                    runCountdown(0, e.message);
                } finally {
                    autoDetectedOcTime = finalTime;
                    $('#debug-oc-time').text(getFormattedTimeString(autoDetectedOcTime));
                    if (callback) callback();
                }
            },
            onerror: () => {
                runCountdown(0, "Network Error");
                if (callback) callback();
            }
        });
    }

    function checkTravelAndHighlight() {
        const travelButton = $('button.torn-btn:contains("Travel")');
        const mapContainer = $('fieldset[class*="worldMap"]');
        travelButton.removeClass('travel-oc-warning travel-oc-critical-warning');
        $('#oc-travel-warning-message').remove();

        if (travelButton.length === 0) {
            $('#debug-flight-time').text('N/A');
            return;
        }

        let autoFlightTimeSeconds = 0;
        try {
            const modelData = JSON.parse($('#travel-root').attr('data-model'));
            if (modelData) {
                const type = $('input[name="travel-type"]:checked').val() || modelData.travelTypes.default;
                const destId = $('input[name="destination"]:checked').val();
                if (destId) {
                    const dest = modelData.destinations.find(d => d.id == destId);
                    if (dest && dest[type]) autoFlightTimeSeconds = dest[type].time.diff * 2;
                }
            }
        } catch (e) {
            // This is the corrected block
            $('#debug-flight-time').text('Error');
            console.error("Torn OC Warner: Could not parse travel data.", e);
            return;
        }

        $('#debug-flight-time').text(`${(autoFlightTimeSeconds / 3600).toFixed(2)}h`);
        const ocAdjustmentVal = $('#override-oc-time').val();
        const ocAdjustmentSeconds = (ocAdjustmentVal && !isNaN(parseFloat(ocAdjustmentVal))) ? parseFloat(ocAdjustmentVal) * 3600 : 0;
        const flightAdjustmentVal = $('#override-flight-time').val();
        const flightAdjustmentSeconds = (flightAdjustmentVal && !isNaN(parseFloat(flightAdjustmentVal))) ? parseFloat(flightAdjustmentVal) * 3600 : 0;
        const ocTimeInSeconds = autoDetectedOcTime + ocAdjustmentSeconds;
        const finalFlightTimeInSeconds = autoFlightTimeSeconds + flightAdjustmentSeconds;

        const useBuffer = GM_getValue(USE_BUFFER_KEY, true);
        const manualBufferHours = parseFloat(GM_getValue(MANUAL_BUFFER_KEY, DEFAULT_OC_BUFFER_HOURS));
        const bufferSeconds = manualBufferHours * 3600;

        if (ocTimeInSeconds > 0) {
            let message = '', messageClass = '', buttonClass = '';
            if (finalFlightTimeInSeconds > ocTimeInSeconds) {
                buttonClass = 'travel-oc-critical-warning';
                messageClass = 'critical-overlay';
                message = 'CRITICAL:<br>Trip exceeds OC time!';
            } else if (useBuffer && (finalFlightTimeInSeconds + bufferSeconds > ocTimeInSeconds)) {
                buttonClass = 'travel-oc-warning';
                messageClass = 'warning-overlay';
                message = 'WARNING:<br>Trip may conflict with OC!';
            }
            if (buttonClass) {
                travelButton.addClass(buttonClass);
                if (mapContainer.length > 0) mapContainer.append(`<div id="oc-travel-warning-message" class="${messageClass}">${message}</div>`);
            }
        }
    }

    function setupTravelPageObserver() {
        if (travelObserver) travelObserver.disconnect();
        const destinationPanel = document.querySelector('div[class*="destinationPanel___"]');
        if (destinationPanel) {
            travelObserver = new MutationObserver(() => checkTravelAndHighlight());
            travelObserver.observe(destinationPanel, { childList: true, subtree: true });
            checkTravelAndHighlight();
        }
    }

    function createPanel() {
        if (document.getElementById('travel-oc-panel-container-std')) return;
        const panelHTML = `
            <div id="travel-oc-panel-container-std">
                <h4>Travel OC Tools</h4>
                <div id="travel-oc-panel-std">
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
                    <hr style="border-color: #ccc; margin: 10px 0;">
                    <div class="debug-row"> <label>Auto OC Time:</label> <span id="debug-oc-time" class="debug-value">N/A</span> </div>
                    <div class="debug-row oc-adjustment-row"> <label>Adj. OC (h):</label> <input type="number" id="override-oc-time" class="debug-input" step="0.1" placeholder="+/- e.g. -2.5"> </div>
                    <div class="debug-row"> <label>Auto Flight Time:</label> <span id="debug-flight-time" class="debug-value">N/A</span> </div>
                    <div class="debug-row oc-adjustment-row"> <label>Adj. Flight (h):</label> <input type="number" id="override-flight-time" class="debug-input" step="0.1" placeholder="+/- e.g. 0.5"> </div>
                    <button id="hide-adjust-btn">Hide Adjustments</button>
                    <hr style="border-color: #ccc; margin: 10px 0;">
                    <div class="debug-row"> <input type="password" id="debug-unlock-input" class="debug-input" placeholder="Dev Test Mode..."> <button id="debug-unlock-btn">Unlock</button> </div>
                    <button id="set-api-key-final">Set API Key</button>
                </div>
            </div>`;
        const toggleButtonHTML = `<div id="travel-oc-panel-toggle-std">OCTW</div>`;
        $('body').append(panelHTML).append(toggleButtonHTML);
        $('#travel-oc-panel-toggle-std').on('click', () => {
            const $container = $('#travel-oc-panel-container-std');
            $container.toggleClass('expanded');
            $('#travel-oc-panel-toggle-std').text($container.hasClass('expanded') ? '»' : 'OCTW');
        });
        $('#set-api-key-final').on('click', () => { const newKey = prompt("Please enter your Torn API Key:", GM_getValue("tornApiKey", "")); if (newKey !== null) { GM_setValue("tornApiKey", newKey.trim()); fetchAndCalculateOCTimer(setupTravelPageObserver); } });
        $('#debug-unlock-btn').on('click', function() { if ($('#debug-unlock-input').val().toLowerCase() === 'test') { $('.oc-adjustment-row, #hide-adjust-btn').addClass('visible'); GM_setValue(SHOW_ADJUST_KEY, true); $('#debug-unlock-input').val(''); } });
        $('#hide-adjust-btn').on('click', function() { $('#override-oc-time, #override-flight-time').val(''); $('.oc-adjustment-row, #hide-adjust-btn').removeClass('visible'); GM_setValue(SHOW_ADJUST_KEY, false); checkTravelAndHighlight(); });
        $('#buffer-toggle').on('change', function() { const isChecked = $(this).is(':checked'); GM_setValue(USE_BUFFER_KEY, isChecked); $('.manual-buffer-row').toggleClass('visible', isChecked); checkTravelAndHighlight(); });
        $('#manual-buffer-hours').on('input', function() { GM_setValue(MANUAL_BUFFER_KEY, $(this).val()); checkTravelAndHighlight(); });
    }

    function main() {
        addStyles();
        createPanel();
        if (GM_getValue(SHOW_ADJUST_KEY, false)) { $('.oc-adjustment-row, #hide-adjust-btn').addClass('visible'); }
        const useBuffer = GM_getValue(USE_BUFFER_KEY, true);
        $('#buffer-toggle').prop('checked', useBuffer);
        if (useBuffer) { $('.manual-buffer-row').addClass('visible'); }
        $('#manual-buffer-hours').val(GM_getValue(MANUAL_BUFFER_KEY, DEFAULT_OC_BUFFER_HOURS));
        fetchAndCalculateOCTimer(setupTravelPageObserver);
    }

    $(document).ready(main);
})();