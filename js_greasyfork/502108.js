// ==UserScript==
// @name         API-Aries - Domain Safety Check (Production)
// @namespace    https://api-aries.com/
// @version      1.6
// @description  Checks the domain safety status. powered by api aries
// @match        *://*/*
// @run-at       document-start
// @license MIT
// @noframes
// @grant        GM_xmlhttpRequest
// @connect      api.api-aries.com
// @downloadURL https://update.greasyfork.org/scripts/502108/API-Aries%20-%20Domain%20Safety%20Check%20%28Production%29.user.js
// @updateURL https://update.greasyfork.org/scripts/502108/API-Aries%20-%20Domain%20Safety%20Check%20%28Production%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // =====================
    //  1. CONFIG AREA - more coming
    // =====================
    const apiToken = '';
    // ↑↑↑  PLACE YOUR API TOKEN HERE (from https://api-aries.com)  ↑↑↑

    // =====================
    //  2. POPUP CREATION
    // =====================
    const popupId = 'apiAriesSafetyPopup';
    const popup = document.createElement('div');
    popup.id = popupId;
    popup.style.position = 'fixed';
    popup.style.top = '20px';
    popup.style.right = '20px';
    popup.style.padding = '16px';
    popup.style.fontFamily = 'Arial, sans-serif';
    popup.style.zIndex = '999999';
    popup.style.borderRadius = '6px';
    popup.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
    popup.style.display = 'none';
    popup.style.color = '#000';
    popup.style.backgroundColor = '#fff';

    const msgPara = document.createElement('p');
    msgPara.style.margin = '0';
    msgPara.style.padding = '0';
    popup.appendChild(msgPara);

    document.documentElement.appendChild(popup);

    function showPopup(text, bgColor = '#fff', autoHide = true) {
        msgPara.textContent = text;
        popup.style.backgroundColor = bgColor;
        popup.style.display = 'block';

        if (autoHide) {
            setTimeout(() => {
                popup.style.display = 'none';
            }, 5000);
        }
    }

    // =====================
    //  3. ALERT IF NO TOKEN
    // =====================
    if (!apiToken) {
        showPopup(
            'You must set your API token in this script.\n' +
            'Open the script code, find `apiToken = ""`, and add your token.\n' +
            'Then refresh the page to check domain safety.',
            '#ffdddd',
            false
        );
        return;
    }

    // =====================
    //  4. DOMAIN TRACKING
    // =====================
    const checkedDomains = new Set();

    function getDomain(url) {
        try {
            return new URL(url).hostname;
        } catch (e) {
            return url;
        }
    }

    // =====================
    //  5. SAFETY CHECK
    // =====================
    function checkDomainSafety(domain) {
        if (checkedDomains.has(domain)) return;
        checkedDomains.add(domain);

        showPopup(`Checking domain safety: ${domain}`, '#ddeeff');

        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://api.api-aries.com/v1/checkers/safe-url/?url=${encodeURIComponent(domain)}`,
            headers: { 'APITOKEN': apiToken },
            onload: function(response) {
                let data;
                try {
                    data = JSON.parse(response.responseText);
                } catch (e) {
                    showPopup(`Error parsing response for ${domain}`, '#ffdddd');
                    return;
                }

                if (data.error_code) {
                    showPopup(
                        `API error: ${data.error || 'Unknown'} - ${data.message || ''}`,
                        '#ffdddd'
                    );
                    return;
                }

                if (data.safe) {
                    showPopup(`Domain is SAFE: ${domain}`, '#d0f0d0');
                } else {
                    const msg = (data.message || '').toLowerCase();
                    let resultText = `Domain is UNSAFE: ${domain}`;
                    if (msg.includes('iplogger')) {
                        resultText += ' (iplogger)';
                    } else if (msg.includes('phishing')) {
                        resultText += ' (phishing)';
                    }
                    showPopup(resultText, '#ffd0d0');
                }
            },
            onerror: function() {
                showPopup(`Network/API error checking ${domain}`, '#ffdddd');
            }
        });
    }

    // =====================
    //  6. AUTO-CHECK
    // =====================
    window.addEventListener('load', () => {
        const domain = getDomain(window.location.href);
        checkDomainSafety(domain);
    });
})();
