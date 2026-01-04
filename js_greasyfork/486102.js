// ==UserScript==
// @name         Google Glossary Export Link Extractor
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Extract and display Google Sheet link and send to webhook
// @author       Floyd
// @match        https://localization.google.com/glossary*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/486102/Google%20Glossary%20Export%20Link%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/486102/Google%20Glossary%20Export%20Link%20Extractor.meta.js
// ==/UserScript==

(function () {
    "use strict";

    function addOrUpdateLink(url) {
        let linkElement = document.getElementById('exportedGoogleSheetLink');
        if (!linkElement) {
            linkElement = document.createElement('a');
            linkElement.id = 'exportedGoogleSheetLink';
            linkElement.textContent = 'Exported Google Sheet';
            linkElement.style.position = 'fixed';
            linkElement.style.top = '1.5vh';
            linkElement.style.right = '15vw';
            linkElement.style.zIndex = '1000';
            linkElement.style.backgroundColor = '#4CAF50';
            linkElement.style.color = 'white';
            linkElement.style.padding = '10px';
            linkElement.style.textDecoration = 'none';
            linkElement.style.borderRadius = '5px';
            linkElement.style.fontSize = '1em';
            linkElement.target = '_blank';
            document.body.appendChild(linkElement);
        }
        linkElement.href = url;

        const storedUrl = localStorage.getItem('latestGoogleSheetLink');
        if (url !== storedUrl) {
            localStorage.setItem('latestGoogleSheetLink', url);
            sendToWebhook(url);  // 仅当URL更新时发送到webhook
            console.log(`URL 成功更新并发送到 webhook: ${url}`);
        }
    }

    function sendToWebhook(url) {
        // 使用正则表达式提取Sheet ID
        const regex = /\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/;
        const match = regex.exec(url);
        const sheetId = match ? match[1] : '';

        if (sheetId === '') {
            return;
        }

        const offsetInHours = 8;
        let currentDateTime = new Date();
        currentDateTime.setHours(currentDateTime.getHours() + offsetInHours);

        const data = {
            sheetId: sheetId,
            timestamp: currentDateTime.toISOString()
        };

        fetch('https://hook.us1.make.com/eiwbqpebprnsu93pn6ya7cmp2cy7u1rm', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(data => console.log('Success:', data))
            .catch((error) => console.error('Error:', error));
    }

    function interceptXHR() {
        const originalOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function (method, url, ...rest) {
            const fullUrl = new URL(url, window.location.href).href;

            this.addEventListener('load', function () {
                if (fullUrl.includes('https://localization.google.com/glossary/_/GlossaryUi/data/batchexecute')) {
                    const regex = /\\\"(https:\/\/docs\.google\.com\/spreadsheets\/d\/[^\"]+)\\\"/;
                    const match = regex.exec(this.responseText);
                    if (match && match[1]) {
                        addOrUpdateLink(match[1]);
                    }
                }
            });

            return originalOpen.apply(this, [method, url, ...rest]);
        };
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', interceptXHR);
    } else {
        interceptXHR();
    }

    window.addEventListener('load', () => {
        const storedUrl = localStorage.getItem('latestGoogleSheetLink');
        if (storedUrl) {
            addOrUpdateLink(storedUrl);
        }
    });

})();



