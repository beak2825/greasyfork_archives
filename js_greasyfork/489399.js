// ==UserScript==
// @name         Daily KPI AFRICA
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Try to take over the world!
// @author       Ahmed
// @match        https://indriver.lightning.force.com/lightning/r/Folder/00lTt000000APLJIA4/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489399/Daily%20KPI%20AFRICA.user.js
// @updateURL https://update.greasyfork.org/scripts/489399/Daily%20KPI%20AFRICA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // List of report URLs
    const reportUrls = [
        'https://indriver.my.salesforce.com/servlet/PrintableViewDownloadServlet?isdtp=p1&reportId=00OTt000001ApWvMAK',
        'https://indriver.my.salesforce.com/servlet/PrintableViewDownloadServlet?isdtp=p1&reportId=00OTt000001ApdNMAS',
        'https://indriver.my.salesforce.com/servlet/PrintableViewDownloadServlet?isdtp=p1&reportId=00OTt000001AplRMAS',
        'https://indriver.my.salesforce.com/servlet/PrintableViewDownloadServlet?isdtp=p1&reportId=00OTt000001ApqHMAS',
        'https://indriver.my.salesforce.com/servlet/PrintableViewDownloadServlet?isdtp=p1&reportId=00OTt000001AovqMAC',
        'https://indriver.my.salesforce.com/servlet/PrintableViewDownloadServlet?isdtp=p1&reportId=00OTt000001AprtMAC',
        'https://indriver.my.salesforce.com/servlet/PrintableViewDownloadServlet?isdtp=p1&reportId=00OTt000001Aq81MAC',
        'https://indriver.my.salesforce.com/servlet/PrintableViewDownloadServlet?isdtp=p1&reportId=00OTt000001AqG5MAK',
        'https://indriver.my.salesforce.com/servlet/PrintableViewDownloadServlet?isdtp=p1&reportId=00OTt000001AqHhMAK',
        'https://indriver.my.salesforce.com/servlet/PrintableViewDownloadServlet?isdtp=p1&reportId=00OTt000001AqJJMA0',
        'https://indriver.my.salesforce.com/servlet/PrintableViewDownloadServlet?isdtp=p1&reportId=00OTt000001AqKvMAK',
        'https://indriver.my.salesforce.com/servlet/PrintableViewDownloadServlet?isdtp=p1&reportId=00OTt000001AqMXMA0',
        'https://indriver.my.salesforce.com/servlet/PrintableViewDownloadServlet?isdtp=p1&reportId=00OTt000001AqO9MAK',
        'https://indriver.my.salesforce.com/servlet/PrintableViewDownloadServlet?isdtp=p1&reportId=00OTt000001AqRNMA0',
        'https://indriver.my.salesforce.com/servlet/PrintableViewDownloadServlet?isdtp=p1&reportId=00OTt000001AqSzMAK'
    ];

    // Styling for the download button
    const buttonStyle = `
        background-color: #A7E92F;
        color: #1B1B1C;
        border: none;
        border-radius: 5px;
        padding: 10px 15px;
        margin: 5px;
        cursor: pointer;
        font-weight: bold;
        text-transform: uppercase;
        box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
        transition: all 0.3s ease;
    `;

    // Create the main button and add it to the page
    const mainButton = document.createElement('button');
    mainButton.textContent = 'Download All Reports';
    mainButton.style.cssText = buttonStyle + `position: fixed; bottom: 150px; right: 20px; z-index: 1000;`;
    document.body.appendChild(mainButton);

    // Function to initiate downloads
    function downloadReports() {
        reportUrls.forEach((url) => {
            // This opens each URL in a new tab. Depending on the browser settings, this might not trigger a download
            // or might be blocked. It's a limitation of client-side scripting for security reasons.
            window.open(url, '_blank');
        });
    }

    // Add event listener to the button
    mainButton.addEventListener('click', downloadReports);
})();
