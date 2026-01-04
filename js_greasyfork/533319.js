// ==UserScript==
// @name         Show Token (OpenLedger)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Display opw_base_user_token on OpenLedger dashboard with copy button (compact UI)
// @author       ForestArmy
// @match        https://testnet.openledger.xyz/dashboard
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533319/Show%20Token%20%28OpenLedger%29.user.js
// @updateURL https://update.greasyfork.org/scripts/533319/Show%20Token%20%28OpenLedger%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function getCookieValue(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    const token = getCookieValue('opw_base_user_token');

    if (token) {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.bottom = '10px';
        container.style.right = '10px';
        container.style.background = '#fff';
        container.style.border = '1px solid #ccc';
        container.style.borderRadius = '6px';
        container.style.padding = '8px';
        container.style.boxShadow = '0 0 8px rgba(0,0,0,0.2)';
        container.style.zIndex = '9999';
        container.style.fontSize = '12px';
        container.style.maxWidth = '300px';
        container.style.wordWrap = 'break-word';
        container.style.fontFamily = 'monospace';

        const tokenText = document.createElement('span');
        tokenText.textContent = token;
        tokenText.style.display = 'block';
        tokenText.style.marginBottom = '6px';
        container.appendChild(tokenText);

        const copyBtn = document.createElement('button');
        copyBtn.textContent = 'Copy';
        copyBtn.style.fontSize = '12px';
        copyBtn.style.padding = '4px 8px';
        copyBtn.style.cursor = 'pointer';
        copyBtn.style.background = '#4CAF50';
        copyBtn.style.color = 'white';
        copyBtn.style.border = 'none';
        copyBtn.style.borderRadius = '4px';

        copyBtn.onclick = () => {
            navigator.clipboard.writeText(token).then(() => {
                copyBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyBtn.textContent = 'Copy';
                }, 1500);
            });
        };

        container.appendChild(copyBtn);
        document.body.appendChild(container);
    }
})();