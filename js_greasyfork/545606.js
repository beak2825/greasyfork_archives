// ==UserScript==
// @name         Spy Stat logger
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  test1
// @license MIT
// @author       aquagloop
// @match        https://www.torn.com/companies.php*
// @connect      script.google.com
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/545606/Spy%20Stat%20logger.user.js
// @updateURL https://update.greasyfork.org/scripts/545606/Spy%20Stat%20logger.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxKPJ9lqZWQ5O70H_7T30lPD_bD8UUZVYv2YxZopZwjVEYLX5xiGxVYPjN9Uo0ogpbw/exec';

    if (!WEB_APP_URL || WEB_APP_URL === 'PASTE_YOUR_WEB_APP_URL_HERE') {
        console.error('TORN STAT LOGGER: You must set your WEB_APP_URL in the script!');
        alert('Torn Company Stat Logger is not configured. Please edit the script and add your Google Web App URL.');
        return;
    }


    function extractAndSendData(targetNode) {
        console.log('Torn Stat Logger: Result container found, attempting to extract data.');


        const userLink = targetNode.querySelector('a.t-blue.h[href*="XID="]');
        const statList = targetNode.querySelector('ul.job-info.list');

        if (!userLink || !statList) {
            console.error('Torn Stat Logger: Could not find user link or stat list.');
            return;
        }


        const userRegex = /(.+)\s\[(\d+)\]/;
        const userMatch = userLink.textContent.match(userRegex);
        const name = userMatch ? userMatch[1].trim() : 'N/A';
        const id = userMatch ? userMatch[2] : 'N/A';
        const stats = {
            strength: 'N/A',
            speed: 'N/A',
            dexterity: 'N/A',
            defense: 'N/A',
            total: 'N/A'
        };

        statList.querySelectorAll('li').forEach(li => {
            const parts = li.textContent.split(':');
            if (parts.length === 2) {
                const statName = parts[0].trim().toLowerCase();
                const statValue = parts[1].trim().replace(/,/g, ''); 
                if (stats.hasOwnProperty(statName)) {
                    stats[statName] = statValue;
                }
            }
        });

    
        const payload = {
            name: name,
            id: id,
            strength: stats.strength,
            speed: stats.speed,
            dexterity: stats.dexterity,
            defense: stats.defense,
            total: stats.total
        };

        console.log('Torn Stat Logger: Extracted Data ->', payload);

        GM_xmlhttpRequest({
            method: 'POST',
            url: WEB_APP_URL,
            data: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json'
            },
            onload: function(response) {
                console.log('Torn Stat Logger: Successfully sent data to Google Sheets.', response.responseText);
                let confirmation = document.createElement('div');
                confirmation.innerHTML = '✅ Stats sent to Google Sheet!';
                confirmation.style.color = 'green';
                confirmation.style.fontWeight = 'bold';
                confirmation.style.textAlign = 'center';
                confirmation.style.padding = '5px';
                targetNode.appendChild(confirmation);
            },
            onerror: function(response) {
                console.error('Torn Stat Logger: Error sending data.', response.responseText);
            }
        });
    }

    
    const targetSelector = 'div.specials-confirm-cont';

    const observer = new MutationObserver((mutationsList, obs) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                const targetNode = document.querySelector(targetSelector);
                if (targetNode && !targetNode.hasAttribute('data-processed')) {
                    targetNode.setAttribute('data-processed', 'true'); 
                    extractAndSendData(targetNode);
                    obs.disconnect();
                }
            }
        }
    });


    observer.observe(document.body, { childList: true, subtree: true });

})();