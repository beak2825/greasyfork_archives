// ==UserScript==
// @name         [Helperscript only] uniqa.cz autofill w/ PM lookup toolbox data
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  Automatically fills UNIQA vehicle insurance form based on URL parameters
// @match        https://www.uniqa.cz/online/pojisteni-vozidla/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534201/%5BHelperscript%20only%5D%20uniqacz%20autofill%20w%20PM%20lookup%20toolbox%20data.user.js
// @updateURL https://update.greasyfork.org/scripts/534201/%5BHelperscript%20only%5D%20uniqacz%20autofill%20w%20PM%20lookup%20toolbox%20data.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function expandVehicleDetails() {
        const dropdownWrapper = document.querySelector('.u-dropdown-wrapper');
        if (!dropdownWrapper) return;

        // Check if the dropdown is wrapped (collapsed)
        if (dropdownWrapper.classList.contains('is-wrapped')) {
            const arrowBtn = dropdownWrapper.querySelector('.u-dropdown-wrapper__arrow-btn');
            if (arrowBtn) {
                arrowBtn.click();
            }
        }
    }

    function fillForms() {
        const hash = window.location.hash;
        const ecvIdMatch = hash.match(/ecvId=([^&]*)/);

        if (!ecvIdMatch) return;

        const ecvInput = document.getElementById('ecvId');
        const phoneInput = document.getElementById('phone-1');
        const nextButton = document.querySelector('.u-form-wrapper .u-btn-green-contained') ||
                          document.querySelector('button.u-btn-green-contained') ||
                          document.querySelector('button[class*="u-btn-green"]');

        if (!ecvInput || !phoneInput || !nextButton) return;

        const ecvValue = decodeURIComponent(ecvIdMatch[1]).replace(/_/g, ' ');
        const phoneValue = '+420723272713';
        const formattedPhoneValue = '+420 723 272 713';

        if (ecvInput.value !== ecvValue) {
            ecvInput.value = ecvValue;
            ecvInput.dispatchEvent(new Event('input', { bubbles: true }));
            ecvInput.dispatchEvent(new Event('change', { bubbles: true }));
            ecvInput.dispatchEvent(new Event('blur', { bubbles: true }));
        }

        if (phoneInput.value === '' || phoneInput.value === '+420') {
            phoneInput.value = phoneValue;
            phoneInput.dispatchEvent(new Event('input', { bubbles: true }));
            phoneInput.dispatchEvent(new Event('change', { bubbles: true }));
            phoneInput.dispatchEvent(new Event('blur', { bubbles: true }));
        }

        if (ecvInput.value === ecvValue && phoneInput.value === formattedPhoneValue) {
            setTimeout(() => {
                if (nextButton.offsetParent !== null && !nextButton.disabled) {
                    nextButton.click();
                }
            }, 1000);
        }

        // Try to expand vehicle details
        setInterval(expandVehicleDetails, 500);
    }

    // Run fillForms every second
    setInterval(fillForms, 500);

})();