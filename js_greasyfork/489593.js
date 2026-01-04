// ==UserScript==
// @name         Daily KPI Egypt
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  daily kpi button
// @author       Ahmed
// @match        https://indriver.lightning.force.com/lightning/r/Folder/00lTt0000002JY1IAM/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489593/Daily%20KPI%20Egypt.user.js
// @updateURL https://update.greasyfork.org/scripts/489593/Daily%20KPI%20Egypt.meta.js
// ==/UserScript==

(function() {
    'use strict';

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

    const mainButton = document.createElement('button');
    mainButton.textContent = 'Download All Reports';
    mainButton.style.cssText = buttonStyle + `position: fixed; bottom: 150px; right: 20px; z-index: 1000;`;
    document.body.appendChild(mainButton);

    function downloadReports() {
        reportUrls.forEach((url) => {
            window.open(url, '_blank');
        });
    }

    mainButton.addEventListener('click', downloadReports);
})();

