// ==UserScript==
// @name         [Helperscript only] MOJ Vehicle Data Checker
// @namespace    https://greasyfork.org/users/976031
// @version      0.2
// @description  Automated vehicle data checking for MOJ website with URL parameter support
// @match        https://moj.gov.pl/nforms/engine/ng/index?*
// @match        https://moj.gov.pl/nforms/info/show?code=*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/533953/%5BHelperscript%20only%5D%20MOJ%20Vehicle%20Data%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/533953/%5BHelperscript%20only%5D%20MOJ%20Vehicle%20Data%20Checker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SEARCH_URL = 'https://moj.gov.pl/nforms/engine/ng/index?xFormsAppName=NormaEuro#/search';
    const DETAILS_URL = 'https://moj.gov.pl/nforms/engine/ng/index?xFormsAppName=NormaEuro#/details';
    const INFO_URL_PATTERN = 'https://moj.gov.pl/nforms/info/show?code=';
    let checkInterval = null;
    let storedPlateNumber = null;

    function log(message) {
        console.log(`[${new Date().toISOString()}] ${message}`);
    }

    function getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        const results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    (function captureInitialPlateNumber() {
        const plateFromUrl = getUrlParameter('plateNumber');
        if (plateFromUrl) {
            storedPlateNumber = plateFromUrl;
            localStorage.setItem('mojStoredPlate', plateFromUrl);
            log(`Plate captured from URL: ${plateFromUrl}`);
        } else {
            storedPlateNumber = localStorage.getItem('mojStoredPlate');
            log(`Plate retrieved from storage: ${storedPlateNumber}`);
        }
    })();

    function getLicensePlate() {
        return storedPlateNumber || '';
    }

    function clearLicensePlate() {
        storedPlateNumber = null;
        localStorage.removeItem('mojStoredPlate');
        log('Plate cleared');
    }

    function handleInfoPage() {
        const currentUrl = window.location.href;
        if (currentUrl.includes(INFO_URL_PATTERN)) {
            log('Info page detected');
            const button = document.querySelector('a[href*="nforms/engine/ng/index?nfWidReset=true"]');
            if (button) {
                log('Redirecting to search');
                button.click();
                return true;
            }
        }
        return false;
    }

    function performCheck() {
        const currentUrl = window.location.href;

        if (handleInfoPage()) {
            return;
        }

        const licensePlate = getLicensePlate();

        if (currentUrl.includes('#/details')) {
            log('Details page reached');
            if (checkInterval) {
                clearInterval(checkInterval);
                checkInterval = null;
            }
            clearLicensePlate();
            return;
        }

        if (!currentUrl.includes('#/search') || !licensePlate) {
            if (checkInterval) {
                clearInterval(checkInterval);
                checkInterval = null;
            }
            return;
        }

        log('Starting check cycle');

        const inputField = document.querySelector('input[formcontrolname="registrationNumber"]');
        if (!inputField) {
            log('Input field missing');
            return;
        }

        const submitButton = Array.from(document.querySelectorAll('button'))
            .find(button => button.textContent.includes('Sprawdź dane pojazdu'));

        if (!submitButton) {
            log('Submit button missing');
            return;
        }

        inputField.value = licensePlate;
        log(`Plate set: ${licensePlate}`);

        ['input', 'change'].forEach(eventType => {
            inputField.dispatchEvent(new Event(eventType, { bubbles: true }));
        });

        submitButton.click();
        log('Check initiated');
    }

    function startMonitoring() {
        const licensePlate = getLicensePlate();

        if (!licensePlate) {
            log('No plate available');
            return;
        }

        log('Monitoring started');
        performCheck();

        if (!checkInterval) {
            checkInterval = setInterval(performCheck, 2000);
            log('Check interval set');
        }
    }

    setTimeout(startMonitoring, 2000);

    let lastUrl = window.location.href;
    new MutationObserver(() => {
        const currentUrl = window.location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            log(`URL changed: ${currentUrl}`);
            startMonitoring();
        }
    }).observe(document, {subtree: true, childList: true});
})();