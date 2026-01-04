// ==UserScript==
// @name            Remove Moshtix & Oztix Dark Patterns
// @description     Auto unchecks options that are auto selected to get you to pay extra money to these services for things you usually don't need. E.g. paid notifications for SMS, and accident insurance. You can re-select them later if you wish
// @author          drsh
// @include         https://*.moshtix.com.au/*
// @include         https://*.oztix.com.au/*
// @run-at          document-end
// @version         0.1
// @namespace       https://greasyfork.org/users/393803
// @license         GNU GPLv3
// Note: Claude 3.5 was utilised to write this script and was tested on Chrome (Linux)
// @downloadURL https://update.greasyfork.org/scripts/503489/Remove%20Moshtix%20%20Oztix%20Dark%20Patterns.user.js
// @updateURL https://update.greasyfork.org/scripts/503489/Remove%20Moshtix%20%20Oztix%20Dark%20Patterns.meta.js
// ==/UserScript==


(function() {
    'use strict';

    function selectOztixOptions() {
        let allSelected = true;

        // Select the "No, don't protect" radio button
        const labels = document.querySelectorAll('label');
        let oztixRadioButton;
        for (let label of labels) {
            if (label.textContent.toLowerCase().includes("no, don't protect")) {
                oztixRadioButton = label.querySelector('input[type="radio"][value="false"]');
                break;
            }
        }

        if (oztixRadioButton) {
            oztixRadioButton.checked = true;
            oztixRadioButton.dispatchEvent(new Event('change', { bubbles: true }));
            console.log('Oztix "No, don\'t protect" radio button has been selected.');
        } else {
            console.log('Oztix "No, don\'t protect" radio button not found. It might not be loaded yet.');
            allSelected = false;
        }

        // Select the $0.00 option from the dropdown
        const select = document.querySelector('select');
        if (select) {
            const zeroOption = Array.from(select.options).find(option => option.text.startsWith('$0.00'));
            if (zeroOption) {
                select.value = zeroOption.value;
                select.dispatchEvent(new Event('change', { bubbles: true }));
                console.log('Oztix $0.00 option has been selected.');
            } else {
                console.log('Oztix $0.00 option not found in the dropdown.');
                allSelected = false;
            }
        } else {
            console.log('Oztix dropdown not found. It might not be loaded yet.');
            allSelected = false;
        }

        return allSelected;
    }

    function selectMoshtixRadioButtons() {
        const radioButtonIds = ['refund-protection-no', 'sms-send-option-no'];
        let allSelected = true;

        radioButtonIds.forEach(id => {
            const radioButton = document.getElementById(id);
            if (radioButton) {
                radioButton.checked = true;
                radioButton.dispatchEvent(new Event('change', { bubbles: true }));
                console.log(`Moshtix radio button "${id}" has been selected.`);
            } else {
                console.log(`Moshtix radio button "${id}" not found. It might not be loaded yet.`);
                allSelected = false;
            }
        });

        return allSelected;
    }

    function trySelectingOptions() {
        let success = true;

        if (window.location.hostname.includes('oztix.com.au')) {
            success = selectOztixOptions();
        } else if (window.location.hostname.includes('moshtix.com.au')) {
            success = selectMoshtixRadioButtons();
        }

        if (!success) {
            setTimeout(trySelectingOptions, 500);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', trySelectingOptions);
    } else {
        trySelectingOptions();
    }
})();