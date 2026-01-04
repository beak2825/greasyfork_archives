// ==UserScript==
// @name         Torn City Chain Watch Alert (enhanced)
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Alert when chain timer drops below user-defined threshold and fade the screen red. Toggle support added.
// @author       Fu11y
// @match        https://www.torn.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478422/Torn%20City%20Chain%20Watch%20Alert%20%28enhanced%29.user.js
// @updateURL https://update.greasyfork.org/scripts/478422/Torn%20City%20Chain%20Watch%20Alert%20%28enhanced%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let alertThresholdInSeconds = parseInt(localStorage.getItem('alertThreshold')) || 240;
    let alertedForCurrentThreshold = false;
    let flashIntervalId = null;
    let flashDiv = null;

    function createUI() {
        const wrapper = document.createElement('div');
        wrapper.style.position = 'fixed';
        wrapper.style.top = '10px';
        wrapper.style.right = '10px';
        wrapper.style.zIndex = '10000';
        wrapper.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
        wrapper.style.padding = '8px';
        wrapper.style.borderRadius = '8px';
        wrapper.style.display = 'flex';
        wrapper.style.alignItems = 'center';
        wrapper.style.gap = '10px';

        const label = document.createElement('label');
        label.textContent = 'Chain Alert Threshold:';
        label.style.color = 'white';
        label.style.fontWeight = 'bold';

        const dropdown = document.createElement('select');
        [60, 90, 120, 150, 180, 210, 240, 270].forEach(seconds => {
            const option = document.createElement('option');
            option.value = seconds;
            option.textContent = `${seconds / 60} minutes`;
            dropdown.appendChild(option);
        });
        dropdown.value = alertThresholdInSeconds;
        dropdown.title = "Set the chain timer alert threshold";
        dropdown.addEventListener('change', (e) => {
            alertThresholdInSeconds = parseInt(e.target.value);
            localStorage.setItem('alertThreshold', alertThresholdInSeconds);
            alertedForCurrentThreshold = false;
        });

        // --- Toggle switch ---
        const toggle = document.createElement('input');
        toggle.type = 'checkbox';
        toggle.checked = localStorage.getItem('chainAlertEnabled') !== 'false';
        toggle.title = "Toggle alerts on or off";
        toggle.style.transform = 'scale(1.2)';
        toggle.style.cursor = 'pointer';

        const toggleLabel = document.createElement('label');
        toggleLabel.textContent = ' Alerts On';
        toggleLabel.style.color = 'white';
        toggleLabel.style.fontWeight = 'bold';

        toggle.addEventListener('change', () => {
            localStorage.setItem('chainAlertEnabled', toggle.checked);
        });

        const toggleWrapper = document.createElement('div');
        toggleWrapper.style.display = 'flex';
        toggleWrapper.style.alignItems = 'center';
        toggleWrapper.style.gap = '5px';
        toggleWrapper.appendChild(toggle);
        toggleWrapper.appendChild(toggleLabel);

        // Append all to UI
        wrapper.appendChild(label);
        wrapper.appendChild(dropdown);
        wrapper.appendChild(toggleWrapper);
        document.body.appendChild(wrapper);

        // --- Popup alert toggle ---
        const popupToggle = document.createElement('input');
        popupToggle.type = 'checkbox';
        popupToggle.checked = localStorage.getItem('chainPopupEnabled') !== 'false';
        popupToggle.title = "Toggle popup alert on or off";
        popupToggle.style.transform = 'scale(1.2)';
        popupToggle.style.cursor = 'pointer';

        const popupLabel = document.createElement('label');
        popupLabel.textContent = ' Popup On';
        popupLabel.style.color = 'white';
        popupLabel.style.fontWeight = 'bold';

        popupToggle.addEventListener('change', () => {
            localStorage.setItem('chainPopupEnabled', popupToggle.checked);
        });

        const popupWrapper = document.createElement('div');
        popupWrapper.style.display = 'flex';
        popupWrapper.style.alignItems = 'center';
        popupWrapper.style.gap = '5px';
        popupWrapper.appendChild(popupToggle);
        popupWrapper.appendChild(popupLabel);

        wrapper.appendChild(popupWrapper);

    }

    function startFlashing() {
        if (flashIntervalId) return;

        flashDiv = document.createElement('div');
        flashDiv.style.position = 'fixed';
        flashDiv.style.top = '0';
        flashDiv.style.left = '0';
        flashDiv.style.width = '100vw';
        flashDiv.style.height = '100vh';
        flashDiv.style.backgroundColor = 'red';
        flashDiv.style.opacity = '0';
        flashDiv.style.zIndex = '9999';
        flashDiv.style.pointerEvents = 'none';
        flashDiv.style.transition = 'opacity 0.5s ease-in-out';

        document.body.appendChild(flashDiv);

        let visible = false;

        flashIntervalId = setInterval(() => {
            visible = !visible;
            flashDiv.style.opacity = visible ? '0.5' : '0';
        }, 1000);
    }

    function stopFlashing() {
        if (flashIntervalId) {
            clearInterval(flashIntervalId);
            flashIntervalId = null;
        }
        if (flashDiv) {
            flashDiv.remove();
            flashDiv = null;
        }
    }

    function triggerAlert() {
        const showPopup = localStorage.getItem('chainPopupEnabled') !== 'false';

        if (!alertedForCurrentThreshold) {
            if (showPopup) {
                alert(`Chain timer is below ${alertThresholdInSeconds / 60} minutes!`);
            }
            alertedForCurrentThreshold = true;
        }
        startFlashing();
    }

    function monitorChainTimer() {
        const timerElement = document.querySelector('[class*="bar-timeleft"]');
        if (!timerElement) return;

        const timerText = timerElement.textContent.trim();

        // ✅ Skip if alert is disabled or timer is 00:00
        if (localStorage.getItem('chainAlertEnabled') === 'false' || timerText === '00:00') {
            stopFlashing();
            alertedForCurrentThreshold = false;
            return;
        }

        const [min, sec] = timerText.split(':').map(part => parseInt(part, 10));
        if (isNaN(min) || isNaN(sec)) return;

        const totalTimeInSeconds = min * 60 + sec;

        if (totalTimeInSeconds < alertThresholdInSeconds) {
            triggerAlert();
        } else {
            alertedForCurrentThreshold = false;
            stopFlashing();
        }
    }

    createUI();
    setInterval(monitorChainTimer, 2000);
})();
