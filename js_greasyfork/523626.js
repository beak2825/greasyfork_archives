// ==UserScript==
// @name         PDF.JS 劫持下载 Intercept PDF.js Viewer Requests
// @namespace    http://tampermonkey.net/
// @version      1.3.1
// @description  劫持"中国专利审查信息查询"等类似使用PDF.js库PDF下载地址 Intercept requests to URLs containing "pdfjs/web/viewer.html?file=" and display the file parameter on the page.
// @author       CVV
// @match        https://cpquery.cponline.cnipa.gov.cn/detail/index?*
// @match        https://cpquery.cponline.cnipa.gov.cn/detail/fujian?*

// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523626/PDFJS%20%E5%8A%AB%E6%8C%81%E4%B8%8B%E8%BD%BD%20Intercept%20PDFjs%20Viewer%20Requests.user.js
// @updateURL https://update.greasyfork.org/scripts/523626/PDFJS%20%E5%8A%AB%E6%8C%81%E4%B8%8B%E8%BD%BD%20Intercept%20PDFjs%20Viewer%20Requests.meta.js
// ==/UserScript==



(function () {
    'use strict';

    let alertCount = 0; // Keeps track of the number of active alerts

    // Function to create a download button and display the file parameter
    function createAlertDiv(message, fileUrl) {
        const alertDiv = document.createElement('div');
        alertDiv.textContent = `File parameter: ${message}`;
        alertDiv.style.position = 'fixed';
        alertDiv.style.top = `${10 + alertCount * 80}px`; // Calculate position dynamically
        alertDiv.style.left = '10px';
        alertDiv.style.zIndex = '9999';
        alertDiv.style.backgroundColor = 'rgba(0, 128, 0, 0.9)';
        alertDiv.style.color = 'white';
        alertDiv.style.padding = '10px';
        alertDiv.style.borderRadius = '5px';
        alertDiv.style.fontSize = '16px';
        alertDiv.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.5)';
        alertDiv.style.fontWeight = 'bold';
        alertDiv.style.display = 'flex';
        alertDiv.style.alignItems = 'center';
        alertDiv.style.gap = '10px';

        const closeButton = document.createElement('button');
        closeButton.textContent = '✖';
        closeButton.style.background = 'none';
        closeButton.style.color = 'white';
        closeButton.style.border = 'none';
        closeButton.style.cursor = 'pointer';
        closeButton.style.fontSize = '16px';
        closeButton.style.fontWeight = 'bold';

        const downloadButton = document.createElement('a');
        downloadButton.textContent = 'Download';
        downloadButton.href = fileUrl;
        downloadButton.download = '';
        downloadButton.style.background = 'white';
        downloadButton.style.color = 'green';
        downloadButton.style.padding = '5px 10px';
        downloadButton.style.borderRadius = '5px';
        downloadButton.style.textDecoration = 'none';
        downloadButton.style.fontWeight = 'bold';

        // Close button logic
        closeButton.onclick = () => {
            document.body.removeChild(alertDiv);
            alertCount--; // Reduce the alert count
            updateAlertPositions(); // Update the positions of remaining alerts
        };

        alertDiv.appendChild(downloadButton);
        alertDiv.appendChild(closeButton);
        document.body.appendChild(alertDiv);

        alertCount++; // Increment alert count
    }

    // Function to update the positions of all alerts
    function updateAlertPositions() {
        const alerts = document.querySelectorAll('div[data-alert]');
        alerts.forEach((alert, index) => {
            alert.style.top = `${10 + index * 80}px`; // Recalculate position
        });
    }

    // Intercept XMLHttpRequest
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url, ...rest) {
        console.log(`[Intercepted XMLHttpRequest] URL: ${url}`);
        if (url.includes('pdfjs/web/viewer.html?file=')) {
            const fileMatch = url.match(/file=([^&]+)/);
            if (fileMatch && fileMatch[1]) {
                const fileUrl = decodeURIComponent(fileMatch[1]);
                createAlertDiv(fileUrl, fileUrl);
            }
        }
        return originalOpen.call(this, method, url, ...rest);
    };

    // Intercept Fetch API
    const originalFetch = window.fetch;
    window.fetch = function (input, init) {
        const url = typeof input === 'string' ? input : input.url;
        console.log(`[Intercepted Fetch] URL: ${url}`);
        if (url.includes('pdfjs/web/viewer.html?file=')) {
            const fileMatch = url.match(/file=([^&]+)/);
            if (fileMatch && fileMatch[1]) {
                const fileUrl = decodeURIComponent(fileMatch[1]);
                createAlertDiv(fileUrl, fileUrl);
            }
        }
        return originalFetch.call(this, input, init);
    };

    // Monitor all network requests (including non-JS initiated)
    const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
            if (entry.name.includes('pdfjs/web/viewer.html?file=')) {
                console.log(`[PerformanceObserver] Network Request: ${entry.name}`);
                const fileMatch = entry.name.match(/file=([^&]+)/);
                if (fileMatch && fileMatch[1]) {
                    const fileUrl = decodeURIComponent(fileMatch[1]);
                    createAlertDiv(fileUrl, fileUrl);
                }
            }
        });
    });

    observer.observe({ type: 'resource', buffered: true });
})();

