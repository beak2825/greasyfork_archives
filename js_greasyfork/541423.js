// ==UserScript==
// @name         Odoo Report HTML Viewer
// @version      1.0
// @description  Adds a button to open the current report in HTML format.
// @author       Liam Verschueren
// @match        *://*/odoo/*
// @match        *://*/web*
// @grant        none
// @namespace https://greasyfork.org/users/1490907
// @downloadURL https://update.greasyfork.org/scripts/541423/Odoo%20Report%20HTML%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/541423/Odoo%20Report%20HTML%20Viewer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for an element to appear on the DOM
    const waitForElement = (selector, callback, continuePolling = false, interval = 100) => {
        const element = document.querySelector(selector);
        if (element) {
            callback(element);
            // Only set another timeout if continuePolling is true
            if (continuePolling) {
                setTimeout(() => waitForElement(selector, callback, continuePolling, interval), interval);
            }
        } else {
            setTimeout(() => waitForElement(selector, callback, continuePolling, interval), interval);
        }
    };


    function addReportButton(buttonBox) {
        const reportName = document.querySelector('#report_name_0, #report_name')?.value;

        if (reportName) {
            const openHtmlButton = document.createElement('button');
            openHtmlButton.textContent = "Open HTML";
            openHtmlButton.id = 'open-html-report-btn';
            openHtmlButton.classList.add('btn', 'oe_stat_button', 'btn-outline-secondary', 'flex-grow-1', 'flex-lg-grow-0');
            openHtmlButton.addEventListener('click', function() {
                window.open(`${window.location.origin}/report/html/${reportName}/1`, '_blank');
            });

            const openPdfButton = document.createElement('button');
            openPdfButton.textContent = "Open PDF";
            openPdfButton.id = 'open-pdf-report-btn';
            openPdfButton.classList.add('btn', 'oe_stat_button', 'btn-outline-secondary', 'flex-grow-1', 'flex-lg-grow-0');
            openPdfButton.addEventListener('click', function() {
                window.open(`${window.location.origin}/report/pdf/${reportName}/1`, '_blank');
            });

            buttonBox.appendChild(openHtmlButton);
            buttonBox.appendChild(openPdfButton);
        }
    }


    waitForElement('.o-form-buttonbox', (buttonBox) => {
        if (!document.getElementById('open-html-report-btn')) {
            addReportButton(buttonBox);
        }
    },true);

})();
