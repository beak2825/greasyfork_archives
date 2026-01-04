// ==UserScript==
// @name         Daily KPI MA
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  test
// @author       Ahmed
// @match        https://indriver.lightning.force.com/lightning/r/Folder/00lTt0000002cqnIAA/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489190/Daily%20KPI%20MA.user.js
// @updateURL https://update.greasyfork.org/scripts/489190/Daily%20KPI%20MA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const reportUrls = [
        'https://indriver.my.salesforce.com/servlet/PrintableViewDownloadServlet?isdtp=p1&reportId=00OTt000000QbK5MAK',
        'https://indriver.my.salesforce.com/servlet/PrintableViewDownloadServlet?isdtp=p1&reportId=00OTt000000QbLhMAK',
        'https://indriver.my.salesforce.com/servlet/PrintableViewDownloadServlet?isdtp=p1&reportId=00OTt000000QbNJMA0',
        'https://indriver.my.salesforce.com/servlet/PrintableViewDownloadServlet?isdtp=p1&reportId=00OTt000000QbOvMAK',
        'https://indriver.my.salesforce.com/servlet/PrintableViewDownloadServlet?isdtp=p1&reportId=00OTt000000QbQXMA0',
        'https://indriver.my.salesforce.com/servlet/PrintableViewDownloadServlet?isdtp=p1&reportId=00OTt000000QbVNMA0',
        'https://indriver.my.salesforce.com/servlet/PrintableViewDownloadServlet?isdtp=p1&reportId=00OTt000000Qc4rMAC',
        'https://indriver.my.salesforce.com/servlet/PrintableViewDownloadServlet?isdtp=p1&reportId=00OTt000000QafmMAC',
        'https://indriver.my.salesforce.com/servlet/PrintableViewDownloadServlet?isdtp=p1&reportId=00OTt000000Qc6TMAS',
        'https://indriver.my.salesforce.com/servlet/PrintableViewDownloadServlet?isdtp=p1&reportId=00OTt000000Pws1MAC',
        'https://indriver.my.salesforce.com/servlet/PrintableViewDownloadServlet?isdtp=p1&reportId=00OTt000000QcknMAC',
        'https://indriver.my.salesforce.com/servlet/PrintableViewDownloadServlet?isdtp=p1&reportId=00OTt000000QcpdMAC',
        'https://indriver.my.salesforce.com/servlet/PrintableViewDownloadServlet?isdtp=p1&reportId=00OTt000000QcrFMAS',
        'https://indriver.my.salesforce.com/servlet/PrintableViewDownloadServlet?isdtp=p1&reportId=00OTt000000QcsrMAC',
        'https://indriver.my.salesforce.com/servlet/PrintableViewDownloadServlet?isdtp=p1&reportId=00OTt000000QcuTMAS'
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

    const buttonHoverStyle = `
        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
        transform: translateY(-2px);
    `;

    const mainButton = document.createElement('button');
    mainButton.textContent = 'KPI';
    mainButton.style.cssText = buttonStyle + `position: fixed; bottom: 150px; right: 20px; z-index: 1000;`;
    document.body.appendChild(mainButton);

    let popup; 

    function togglePopup() {
        if (popup && popup.parentNode) {
            document.body.removeChild(popup);
            popup = null;
        } else {
            createPopup();
        }
    }

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

    mainButton.addEventListener('click', togglePopup);
})();
