// ==UserScript==
// @name         Daily KPI EG
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Toggle a stylish popup with buttons to open Salesforce reports
// @author       Ahmed
// @match        https://indriver.lightning.force.com/lightning/r/Folder/00lTt0000002JY1IAM/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486618/Daily%20KPI%20EG.user.js
// @updateURL https://update.greasyfork.org/scripts/486618/Daily%20KPI%20EG.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // URLs of the reports
    const reportUrls = [
        'https://indriver.my.salesforce.com/servlet/PrintableViewDownloadServlet?isdtp=p1&reportId=00OTt000000PK0LMAW',
        'https://indriver.my.salesforce.com/servlet/PrintableViewDownloadServlet?isdtp=p1&reportId=00OTt000000PKjVMAW',
        'https://indriver.my.salesforce.com/servlet/PrintableViewDownloadServlet?isdtp=p1&reportId=00OTt000000PJx7MAG',
        'https://indriver.my.salesforce.com/servlet/PrintableViewDownloadServlet?isdtp=p1&reportId=00OTt000000PJyjMAG',
        'https://indriver.my.salesforce.com/servlet/PrintableViewDownloadServlet?isdtp=p1&reportId=00OTt000000PKoLMAW',
        'https://indriver.my.salesforce.com/servlet/PrintableViewDownloadServlet?isdtp=p1&reportId=00OTt000000Ofy5MAC',
        'https://indriver.my.salesforce.com/servlet/PrintableViewDownloadServlet?isdtp=p1&reportId=00OTt000000PJkEMAW',
        'https://indriver.my.salesforce.com/servlet/PrintableViewDownloadServlet?isdtp=p1&reportId=00OTt000000PKmjMAG',
        'https://indriver.my.salesforce.com/servlet/PrintableViewDownloadServlet?isdtp=p1&reportId=00OTt000000PMRxMAO',
        'https://indriver.my.salesforce.com/servlet/PrintableViewDownloadServlet?isdtp=p1&reportId=00OTt000000Qc9hMAC',
        'https://indriver.my.salesforce.com/servlet/PrintableViewDownloadServlet?isdtp=p1&reportId=00OTt000000PxEbMAK',
        'https://indriver.my.salesforce.com/servlet/PrintableViewDownloadServlet?isdtp=p1&reportId=00OTt000000PxGDMA0',
        'https://indriver.my.salesforce.com/servlet/PrintableViewDownloadServlet?isdtp=p1&reportId=00OTt000000PxMfMAK',
        'https://indriver.my.salesforce.com/servlet/PrintableViewDownloadServlet?isdtp=p1&reportId=00OTt000000PxZZMA0',
        'https://indriver.my.salesforce.com/servlet/PrintableViewDownloadServlet?isdtp=p1&reportId=00OTt000000Pxg1MAC',
        'https://indriver.my.salesforce.com/servlet/PrintableViewDownloadServlet?isdtp=p1&reportId=00OTt000000PKefMAG',
        'https://indriver.my.salesforce.com/servlet/PrintableViewDownloadServlet?isdtp=p1&reportId=00OTt000000QriDMAS',
        'https://indriver.my.salesforce.com/servlet/PrintableViewDownloadServlet?isdtp=p1&reportId=00OTt000000PKgHMAW',
        'https://indriver.my.salesforce.com/servlet/PrintableViewDownloadServlet?isdtp=p1&reportId=00OTt000000QrjpMAC',
        'https://indriver.my.salesforce.com/servlet/PrintableViewDownloadServlet?isdtp=p1&reportId=00OTt000000g59lMAA',
        'https://indriver.my.salesforce.com/servlet/PrintableViewDownloadServlet?isdtp=p1&reportId=00OTt000000g5BNMAY',
        'https://indriver.my.salesforce.com/servlet/PrintableViewDownloadServlet?isdtp=p1&reportId=00OTt000000g4qQMAQ',
        'https://indriver.my.salesforce.com/servlet/PrintableViewDownloadServlet?isdtp=p1&reportId=00OTt000000g5CzMAI',
        'https://indriver.my.salesforce.com/servlet/PrintableViewDownloadServlet?isdtp=p1&reportId=00OTt000000g5L3MAI',
        'https://indriver.my.salesforce.com/servlet/PrintableViewDownloadServlet?isdtp=p1&reportId=00OTt000000g5cnMAA'
    ];

    // Styles for the popup and buttons
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

    const buttonHoverStyle = `
        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
        transform: translateY(-2px);
    `;

    // Create a floating button
    const mainButton = document.createElement('button');
    mainButton.textContent = 'KPI';
    mainButton.style.cssText = buttonStyle + `position: fixed; bottom: 150px; right: 20px; z-index: 1000;`;
    document.body.appendChild(mainButton);

    let popup; // Reference to the popup

    // Function to toggle the popup
    function togglePopup() {
        if (popup && popup.parentNode) {
            document.body.removeChild(popup);
            popup = null;
        } else {
            createPopup();
        }
    }

    // Function to create and show the popup
    function createPopup() {
        popup = document.createElement('div');
        popup.style.cssText = `position: fixed; bottom: 60px; right: 20px; z-index: 1001; background-color: white; border: 1px solid black; padding: 10px; border-radius: 5px; box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);`;

        reportUrls.forEach((url, index) => {
            const reportButton = document.createElement('button');
            reportButton.textContent = `Report Number ${index + 1}`;
            reportButton.style.cssText = buttonStyle;
            reportButton.onclick = function() { window.open(url, '_blank'); };
            reportButton.onmouseover = function() { this.style.cssText += buttonHoverStyle; };
            reportButton.onmouseout = function() { this.style.cssText = buttonStyle; };
            popup.appendChild(reportButton);
        });

        document.body.appendChild(popup);
    }

    // Add event listener to the main button
    mainButton.addEventListener('click', togglePopup);
})();
