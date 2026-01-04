// ==UserScript==
// @name         Daily KPI TURKISH
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Try to take over the world!
// @author       Ahmed
// @match        https://indriver.lightning.force.com/lightning/r/Folder/00lTt000000ANRZIA4/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489400/Daily%20KPI%20TURKISH.user.js
// @updateURL https://update.greasyfork.org/scripts/489400/Daily%20KPI%20TURKISH.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // List of report URLs
    const reportUrls = [
        'https://indriver.my.salesforce.com/servlet/PrintableViewDownloadServlet?isdtp=p1&reportId=00OTt000001A3nFMAS',
        'https://indriver.my.salesforce.com/servlet/PrintableViewDownloadServlet?isdtp=p1&reportId=00OTt000001A6mjMAC',
        'https://indriver.my.salesforce.com/servlet/PrintableViewDownloadServlet?isdtp=p1&reportId=00OTt000001A6oLMAS',
        'https://indriver.my.salesforce.com/servlet/PrintableViewDownloadServlet?isdtp=p1&reportId=00OTt000001A6pxMAC',
        'https://indriver.my.salesforce.com/servlet/PrintableViewDownloadServlet?isdtp=p1&reportId=00OTt000001A6tBMAS',
        'https://indriver.my.salesforce.com/servlet/PrintableViewDownloadServlet?isdtp=p1&reportId=00OTt000001AEltMAG',
        'https://indriver.my.salesforce.com/servlet/PrintableViewDownloadServlet?isdtp=p1&reportId=00OTt000001AEnVMAW',
        'https://indriver.my.salesforce.com/servlet/PrintableViewDownloadServlet?isdtp=p1&reportId=00OTt000001AEyoMAG',
        'https://indriver.my.salesforce.com/servlet/PrintableViewDownloadServlet?isdtp=p1&reportId=00OTt000001AFGXMA4',
        'https://indriver.my.salesforce.com/servlet/PrintableViewDownloadServlet?isdtp=p1&reportId=00OTt000001AFMzMAO',
        'https://indriver.my.salesforce.com/servlet/PrintableViewDownloadServlet?isdtp=p1&reportId=00OTt000001AFRpMAO',
        'https://indriver.my.salesforce.com/servlet/PrintableViewDownloadServlet?isdtp=p1&reportId=00OTt000001AFTRMA4',
        'https://indriver.my.salesforce.com/servlet/PrintableViewDownloadServlet?isdtp=p1&reportId=00OTt000001AFYHMA4',
        'https://indriver.my.salesforce.com/servlet/PrintableViewDownloadServlet?isdtp=p1&reportId=00OTt000001AFV3MAO',
        'https://indriver.my.salesforce.com/servlet/PrintableViewDownloadServlet?isdtp=p1&reportId=00OTt000001AFWfMAO'
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
