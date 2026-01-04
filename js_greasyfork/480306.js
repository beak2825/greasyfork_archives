// ==UserScript==
// @name         red/kx/request
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically selects the "format_1" element checkbox on the specified site.
// @author       You
// @match        https://redacted.ch/requests.php?action=new
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480306/redkxrequest.user.js
// @updateURL https://update.greasyfork.org/scripts/480306/redkxrequest.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to auto-select the "format_1" checkbox
    function autoSelectFormat1Checkbox() {
        // Replace 'format_1' with the actual value of the checkbox
        const format1Checkbox = document.querySelector('input[id="format_1"]');
        if (format1Checkbox) {
            format1Checkbox.checked = true;
        }
        const lossless = document.querySelector('input[id="bitrate_8"]');
        if (lossless) {
            lossless.checked = true;
        }
        const lossless_24 = document.querySelector('input[id="bitrate_9"]');
        if (lossless_24) {
            lossless_24.checked = true;
        }
        const media = document.querySelector('input[id="toggle_media"]');
        if (media) {
            media.checked = true;
        }
            // Function to set the release type option to option value "9"
        const releaseTypeSelect = document.getElementById('releasetype');
        if (releaseTypeSelect) {
            const optionValueToSelect = '9';
            releaseTypeSelect.value = optionValueToSelect;
        }
                const unit = document.getElementById('unit');
        if (unit) {
            const optionValueToSelect = 'gb';
            unit.value = optionValueToSelect;
        }
        const amount = document.getElementById('amount_box');
        if (amount) {
            amount.value = '1';
                    amount.dispatchEvent(new Event('input', { bubbles: true }));
        amount.dispatchEvent(new Event('change', { bubbles: true }));
        }

            // Function to get the input button by control-id
    function getInputButtonByControlID(controlID) {
        const inputButton = document.querySelector(`[control-id="${controlID}"]`);
        return inputButton;
    }

    // Wait for the page to load completely
    window.addEventListener('load', () => {
        // Call the functions to auto-select the "format_1" checkbox, set the release type option, and get the input button
        autoSelectFormat1Checkbox();
        setReleaseTypeOption();
        const controlID = "ControlID-52";
        const inputButton = getInputButtonByControlID(controlID);
        if (inputButton) {
            // Do something with the input button (e.g., click it)
            inputButton.click();
        }
    });
    }

    // Wait for the page to load completely
    window.addEventListener('load', () => {
        // Call the function to auto-select the "format_1" checkbox
        autoSelectFormat1Checkbox();
    });
})();
