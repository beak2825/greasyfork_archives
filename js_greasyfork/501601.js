// ==UserScript==
// @name         reevs copy app
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically copy the UPID from input to OUTPUT field
// @author       maniveb
// @match        https://auditbook-na.corp.amazon.com/audit*
// @grant        none
// @icon         https://cdn-icons-png.flaticon.com/512/54/54702.png
// @downloadURL https://update.greasyfork.org/scripts/501601/reevs%20copy%20app.user.js
// @updateURL https://update.greasyfork.org/scripts/501601/reevs%20copy%20app.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Function to copy UPID to OUTPUT_SourceUPIDAuditor
    function copyUPID() {
        // Get the UPID value from span
        const upidElement = document.querySelector('span#UPID');
        if (upidElement) {
            const upidValue = upidElement.textContent.trim();

            // Get the OUTPUT_SourceUPIDAuditor input field
            const outputSourceUPIDAuditorElement = document.querySelector('input#OUTPUT_SourceUPIDAuditor');

            // Set the value of OUTPUT_SourceUPIDAuditor input field
            if (outputSourceUPIDAuditorElement) {
                outputSourceUPIDAuditorElement.value = upidValue;
            } else {
                console.error('OUTPUT_SourceUPIDAuditor input field not found');
            }
        } else {
            console.error('UPID span element not found');
        }
    }

 // Observe DOM changes
    const observer = new MutationObserver((mutations) => {
        for (let mutation of mutations) {
            if (mutation.type === 'childList' || mutation.type === 'attributes') {
                copyUPID();
            }
        }
    });

    // Start observing the document
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true
    });

    // Initial copy when the script runs
    window.addEventListener('load', copyUPID);
})();