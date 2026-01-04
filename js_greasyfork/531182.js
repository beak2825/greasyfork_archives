// ==UserScript==
// @name         PollEv Geolocation Spoofer
// @namespace    https://github.com/rastr1sr
// @version      1.0
// @description  Spoofs Location on PollEv to do quizzes anywhere.
// @author       Rastrisr
// @compatible   firefox
// @compatible   chrome
// @compatible   edge
// @match        *://*.pollev.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// @grant        GM_notification
// @run-at       document-start
// @icon         https://upload.wikimedia.org/wikipedia/commons/5/55/WMA_button2b.png
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531182/PollEv%20Geolocation%20Spoofer.user.js
// @updateURL https://update.greasyfork.org/scripts/531182/PollEv%20Geolocation%20Spoofer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SCRIPT_PREFIX = 'pollev_geo_spoofer_';
    const IP_WARNING_DISMISSED_KEY = SCRIPT_PREFIX + 'ip_warning_dismissed_v1';

    let spoofEnabled = true;
    let currentLat = GM_getValue(SCRIPT_PREFIX + 'latitude', 40.7580);
    let currentLon = GM_getValue(SCRIPT_PREFIX + 'longitude', -73.9855);
    let currentAccuracy = GM_getValue(SCRIPT_PREFIX + 'accuracy', 20);

    if (navigator.geolocation && spoofEnabled) {

        const originalGetCurrentPosition = navigator.geolocation.getCurrentPosition.bind(navigator.geolocation);
        const originalWatchPosition = navigator.geolocation.watchPosition.bind(navigator.geolocation);
        const originalClearWatch = navigator.geolocation.clearWatch.bind(navigator.geolocation);

        const createPositionObject = () => ({
            coords: {
                latitude: currentLat,
                longitude: currentLon,
                accuracy: currentAccuracy,
                altitude: null,
                altitudeAccuracy: null,
                heading: null,
                speed: null,
            },
            timestamp: Date.now(),
        });

        const spoofedGetCurrentPosition = (successCallback, errorCallback, options) => {
            console.log('[PollEv Spoofer] Spoofing getCurrentPosition');
            if (successCallback) {
                setTimeout(() => {
                    try {
                         successCallback(createPositionObject());
                    } catch (e) {
                        console.error("[PollEv Spoofer] Error in user's successCallback for getCurrentPosition:", e);
                        if(errorCallback) {
                             errorCallback({ code: 2, message: "Spoofed location callback failed." });
                        }
                    }
                }, 100 + Math.random() * 300);
            } else {
                 console.warn('[PollEv Spoofer] getCurrentPosition called without a successCallback.');
            }
        };

        const spoofedWatchPosition = (successCallback, errorCallback, options) => {
            console.log('[PollEv Spoofer] Spoofing watchPosition');
            const watchId = Math.floor(Math.random() * 1000000);
             if (successCallback) {
                 setTimeout(() => {
                    try {
                        successCallback(createPositionObject());
                    } catch (e) {
                        console.error("[PollEv Spoofer] Error in user's successCallback for watchPosition:", e);
                         if(errorCallback) {
                             errorCallback({ code: 2, message: "Spoofed watch callback failed." });
                         }
                    }
                 }, 150 + Math.random() * 300);
             } else {
                 console.warn('[PollEv Spoofer] watchPosition called without a successCallback.');
             }
            return watchId;
        };

        const spoofedClearWatch = (watchId) => {
            console.log('[PollEv Spoofer] Spoofing clearWatch for ID:', watchId);
        };

        try {
            Object.defineProperties(unsafeWindow.navigator.geolocation, {
                getCurrentPosition: {
                    value: spoofedGetCurrentPosition,
                    writable: false,
                    configurable: true
                },
                watchPosition: {
                    value: spoofedWatchPosition,
                    writable: false,
                    configurable: true
                },
                clearWatch: {
                    value: spoofedClearWatch,
                    writable: false,
                    configurable: true
                }
            });
            console.log('[PollEv Spoofer] Geolocation API successfully overridden.');
        } catch (e) {
            console.error('[PollEv Spoofer] Failed to override geolocation API:', e);
             console.warn('[PollEv Spoofer] Location spoofing may not work correctly.');
        }

    } else if (!navigator.geolocation) {
        console.warn('[PollEv Spoofer] navigator.geolocation API not found. Cannot spoof.');
    } else {
        console.log('[PollEv Spoofer] Spoofing is disabled.');
    }

    let uiVisible = false;
    let panel = null;

    function createUIPanel() {
        panel = document.createElement('div');
        panel.id = SCRIPT_PREFIX + 'panel';
        panel.innerHTML = `
            <div class="${SCRIPT_PREFIX}header">
                <span>PollEv Geo Spoofer</span>
                <button class="${SCRIPT_PREFIX}close-btn" title="Close">×</button>
            </div>
            <div class="${SCRIPT_PREFIX}content">
                <div class="${SCRIPT_PREFIX}input-group">
                    <label for="${SCRIPT_PREFIX}lat">Latitude:</label>
                    <input type="number" id="${SCRIPT_PREFIX}lat" step="any" min="-90" max="90" placeholder="e.g., 40.7580">
                </div>
                <div class="${SCRIPT_PREFIX}input-group">
                    <label for="${SCRIPT_PREFIX}lon">Longitude:</label>
                    <input type="number" id="${SCRIPT_PREFIX}lon" step="any" min="-180" max="180" placeholder="e.g., -73.9855">
                </div>
                 <div class="${SCRIPT_PREFIX}input-group">
                    <label for="${SCRIPT_PREFIX}acc">Accuracy (m):</label>
                    <input type="number" id="${SCRIPT_PREFIX}acc" step="1" min="1" placeholder="e.g., 20">
                </div>
                <div class="${SCRIPT_PREFIX}button-group">
                    <button id="${SCRIPT_PREFIX}save-btn">Save & Apply</button>
                     <span id="${SCRIPT_PREFIX}status" class="${SCRIPT_PREFIX}status-msg"></span>
                </div>
                 <div class="${SCRIPT_PREFIX}info">
                    <small>Changes apply immediately to new location requests. A page reload might ensure consistency.</small>
                 </div>
                 <div class="${SCRIPT_PREFIX}ip-warning-info">
                    <hr class="${SCRIPT_PREFIX}divider">
                    <p><strong>Important:</strong> This script only spoofs browser geolocation.</p>
                    <p>If Poll Everywhere uses <strong>IP address range filtering</strong> (e.g., specific Wi-Fi networks), this script <strong>cannot</strong> bypass that. You may still be blocked even with spoofing enabled.</p>
                    <p>In such cases, you might need to use a <strong>VPN or Proxy</strong> located within the allowed network/region.</p>
                 </div>
            </div>
        `;
        document.body.appendChild(panel);

        const latInput = panel.querySelector(`#${SCRIPT_PREFIX}lat`);
        const lonInput = panel.querySelector(`#${SCRIPT_PREFIX}lon`);
        const accInput = panel.querySelector(`#${SCRIPT_PREFIX}acc`);
        const saveBtn = panel.querySelector(`#${SCRIPT_PREFIX}save-btn`);
        const closeBtn = panel.querySelector(`.${SCRIPT_PREFIX}close-btn`);
        const statusMsg = panel.querySelector(`#${SCRIPT_PREFIX}status`);

        latInput.value = currentLat;
        lonInput.value = currentLon;
        accInput.value = currentAccuracy;

        saveBtn.addEventListener('click', () => {
            const newLat = parseFloat(latInput.value);
            const newLon = parseFloat(lonInput.value);
            const newAcc = parseInt(accInput.value, 10);

            let isValid = true;
            statusMsg.textContent = '';
            statusMsg.style.color = 'var(--pollev-spoofer-error)';

            if (isNaN(newLat) || newLat < -90 || newLat > 90) {
                statusMsg.textContent = 'Invalid Latitude (-90 to 90).';
                latInput.focus();
                isValid = false;
            } else if (isNaN(newLon) || newLon < -180 || newLon > 180) {
                statusMsg.textContent = 'Invalid Longitude (-180 to 180).';
                lonInput.focus();
                isValid = false;
            } else if (isNaN(newAcc) || newAcc < 1) {
                statusMsg.textContent = 'Invalid Accuracy (>= 1).';
                accInput.focus();
                isValid = false;
            }

            if (!isValid) return;


            currentLat = newLat;
            currentLon = newLon;
            currentAccuracy = newAcc;

            GM_setValue(SCRIPT_PREFIX + 'latitude', currentLat);
            GM_setValue(SCRIPT_PREFIX + 'longitude', currentLon);
            GM_setValue(SCRIPT_PREFIX + 'accuracy', currentAccuracy);

            statusMsg.textContent = 'Saved!';
            statusMsg.style.color = 'var(--pollev-spoofer-success)';

            setTimeout(() => {
                if (statusMsg.textContent === 'Saved!') {
                   statusMsg.textContent = '';
                }

            }, 1500);
        });

        closeBtn.addEventListener('click', () => toggleUIPanel(false));

        panel.style.display = uiVisible ? 'flex' : 'none';
    }

    function toggleUIPanel(forceState) {
        if (!panel && (forceState === true || (forceState === undefined && !uiVisible))) {
            if (document.body) {
                 createUIPanel();
            } else {
                document.addEventListener('DOMContentLoaded', createUIPanel, { once: true });
                return;
            }
        }

        uiVisible = typeof forceState === 'boolean' ? forceState : !uiVisible;

        if (panel) {
             panel.style.display = uiVisible ? 'flex' : 'none';
             if (uiVisible) {
                 panel.querySelector(`#${SCRIPT_PREFIX}lat`).value = currentLat;
                 panel.querySelector(`#${SCRIPT_PREFIX}lon`).value = currentLon;
                 panel.querySelector(`#${SCRIPT_PREFIX}acc`).value = currentAccuracy;
                 panel.querySelector(`#${SCRIPT_PREFIX}status`).textContent = '';
             }
        }
    }

    GM_registerMenuCommand('Configure PollEv Geo Spoofer', () => toggleUIPanel());


    function showIpWarningNotification() {
        if (GM_getValue(IP_WARNING_DISMISSED_KEY, false)) {
            return;
        }

        if (!document.body) {
            setTimeout(showIpWarningNotification, 500);
            return;
        }

        const notificationDiv = document.createElement('div');
        notificationDiv.id = SCRIPT_PREFIX + 'ip-warning-notification';
        notificationDiv.innerHTML = `
            <div class="${SCRIPT_PREFIX}notification-content">
                📌 <strong>PollEv Geo Spoofer Info:</strong> This script spoofs browser location, but PollEv might <i>also</i> check your IP address (e.g., Wi-Fi). If you're still blocked, you may need a VPN or Proxy on the allowed network.
            </div>
            <button class="${SCRIPT_PREFIX}notification-dismiss" title="Dismiss permanently">×</button>
        `;
        document.body.appendChild(notificationDiv);

        notificationDiv.querySelector(`.${SCRIPT_PREFIX}notification-dismiss`).addEventListener('click', () => {
            notificationDiv.style.display = 'none';
            GM_setValue(IP_WARNING_DISMISSED_KEY, true);
             try {
                 notificationDiv.remove();
             } catch (e) {}
        });

         setTimeout(() => {
             if (notificationDiv && notificationDiv.style.display !== 'none') {
                 notificationDiv.style.opacity = '0';
                 setTimeout(() => {
                     if (notificationDiv && notificationDiv.style.display !== 'none') {
                        notificationDiv.style.display = 'none';
                        GM_setValue(IP_WARNING_DISMISSED_KEY, true);
                         try { notificationDiv.remove(); } catch (e) {}
                     }
                 }, 500);
             }
         }, 20000);

    }

    GM_addStyle(`
        :root {
            --pollev-spoofer-bg: #ffffff;
            --pollev-spoofer-text: #333333;
            --pollev-spoofer-border: #cccccc;
            --pollev-spoofer-shadow: #00000033;
            --pollev-spoofer-header-bg: #f0f0f0;
            --pollev-spoofer-button-bg: #3498db;
            --pollev-spoofer-button-hover-bg: #2980b9;
            --pollev-spoofer-button-text: #ffffff;
            --pollev-spoofer-close-hover-bg: #e74c3c;
            --pollev-spoofer-success: #2ecc71;
            --pollev-spoofer-error: #e74c3c;
            --pollev-spoofer-info-text: #7f8c8d;
            --pollev-spoofer-warning-bg: #fffbea;
            --pollev-spoofer-warning-border: #fddc71;
            --pollev-spoofer-warning-text: #5f4c0a;
        }

        #${SCRIPT_PREFIX}panel {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 99999;
            background-color: var(--pollev-spoofer-bg);
            border: 1px solid var(--pollev-spoofer-border);
            border-radius: 8px;
            box-shadow: 0 4px 15px var(--pollev-spoofer-shadow);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
            font-size: 14px;
            color: var(--pollev-spoofer-text);
            width: 320px; /* Slightly wider for new text */
            display: none; /* Initially hidden */
            flex-direction: column;
            overflow: hidden; /* Ensures border-radius clips content */
        }

        .${SCRIPT_PREFIX}header {
            background-color: var(--pollev-spoofer-header-bg);
            padding: 8px 12px;
            border-bottom: 1px solid var(--pollev-spoofer-border);
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-weight: bold;
        }

        .${SCRIPT_PREFIX}close-btn {
            background: none;
            border: none;
            font-size: 20px;
            line-height: 1;
            cursor: pointer;
            color: #999;
            padding: 2px 5px;
            border-radius: 4px;
        }
        .${SCRIPT_PREFIX}close-btn:hover {
            background-color: var(--pollev-spoofer-close-hover-bg);
            color: var(--pollev-spoofer-button-text);
        }

        .${SCRIPT_PREFIX}content {
            padding: 15px;
            display: flex;
            flex-direction: column;
            gap: 12px; /* Spacing between elements */
        }

        .${SCRIPT_PREFIX}input-group {
            display: flex;
            flex-direction: column; /* Stack label and input */
            gap: 4px; /* Space between label and input */
        }

        .${SCRIPT_PREFIX}input-group label {
            font-weight: 500;
            font-size: 0.9em;
            color: #555;
        }

        .${SCRIPT_PREFIX}input-group input[type="number"] {
            padding: 8px 10px;
            border: 1px solid var(--pollev-spoofer-border);
            border-radius: 4px;
            font-size: 1em;
            width: 100%; /* Take full width */
            box-sizing: border-box; /* Include padding and border in width */
        }
         .${SCRIPT_PREFIX}input-group input[type="number"]:focus {
             border-color: var(--pollev-spoofer-button-bg);
             outline: none;
             box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
         }


        .${SCRIPT_PREFIX}button-group {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-top: 5px;
        }

        #${SCRIPT_PREFIX}save-btn {
            background-color: var(--pollev-spoofer-button-bg);
            color: var(--pollev-spoofer-button-text);
            border: none;
            border-radius: 5px;
            padding: 10px 15px;
            cursor: pointer;
            font-size: 0.95em;
            font-weight: 500;
            transition: background-color 0.2s ease;
            flex-grow: 1; /* Take available space if needed */
        }
        #${SCRIPT_PREFIX}save-btn:hover {
            background-color: var(--pollev-spoofer-button-hover-bg);
        }

        .${SCRIPT_PREFIX}status-msg {
             font-size: 0.9em;
             font-weight: 500;
        }
         .${SCRIPT_PREFIX}info {
             margin-top: 5px;
             font-size: 0.85em;
             color: var(--pollev-spoofer-info-text);
             text-align: center;
             line-height: 1.3;
         }

         .${SCRIPT_PREFIX}divider {
            border: none;
            border-top: 1px solid #eee;
            margin: 15px 0 10px 0;
         }

         .${SCRIPT_PREFIX}ip-warning-info {
             background-color: var(--pollev-spoofer-warning-bg);
             border: 1px solid var(--pollev-spoofer-warning-border);
             color: var(--pollev-spoofer-warning-text);
             padding: 10px;
             border-radius: 4px;
             font-size: 0.9em;
             line-height: 1.4;
             margin-top: 10px;
         }
          .${SCRIPT_PREFIX}ip-warning-info p {
              margin: 0 0 5px 0;
          }
         .${SCRIPT_PREFIX}ip-warning-info p:last-child {
              margin-bottom: 0;
          }
         .${SCRIPT_PREFIX}ip-warning-info strong {
            color: inherit; /* Ensure strong tag uses warning text color */
         }

         /* Notification Bar Styles */
         #${SCRIPT_PREFIX}ip-warning-notification {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            background-color: var(--pollev-spoofer-warning-bg);
            border-top: 2px solid var(--pollev-spoofer-warning-border);
            color: var(--pollev-spoofer-warning-text);
            z-index: 100000; /* High z-index */
            padding: 10px 40px 10px 20px; /* Space for close button */
            box-sizing: border-box;
            font-size: 14px;
            line-height: 1.4;
            display: flex;
            align-items: center;
            justify-content: space-between;
            box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
            transition: opacity 0.5s ease-out;
            opacity: 1;
         }
         .${SCRIPT_PREFIX}notification-content {
            flex-grow: 1;
         }
        .${SCRIPT_PREFIX}notification-content strong,
        .${SCRIPT_PREFIX}notification-content i {
             color: inherit;
         }

         .${SCRIPT_PREFIX}notification-dismiss {
            position: absolute;
            top: 50%;
            right: 10px;
            transform: translateY(-50%);
            background: none;
            border: none;
            font-size: 24px;
            line-height: 1;
            color: var(--pollev-spoofer-warning-text);
            cursor: pointer;
            padding: 5px;
            opacity: 0.7;
         }
         .${SCRIPT_PREFIX}notification-dismiss:hover {
             opacity: 1;
         }
    `);

    function initialize() {
        setTimeout(showIpWarningNotification, 1500);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

})();