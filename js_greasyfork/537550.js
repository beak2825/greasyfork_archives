// ==UserScript==
// @name         AsterAI Token Copier
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Extracts and copies Bearer token from localStorage on astpoint.asterai.xyz
// @author       itsmesatyavir (FORESTARMY)
// @match        https://astpoint.asterai.xyz/*
// @grant        GM_setClipboard
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537550/AsterAI%20Token%20Copier.user.js
// @updateURL https://update.greasyfork.org/scripts/537550/AsterAI%20Token%20Copier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const TOKEN_KEY = 'aster_ai_access_token';

    function createCopyButton(token) {
        const btn = document.createElement('button');
        btn.innerText = '📋 Copy Bearer Token';
        btn.style.position = 'fixed';
        btn.style.bottom = '20px';
        btn.style.right = '20px';
        btn.style.padding = '12px 16px';
        btn.style.background = '#00bcd4';
        btn.style.color = '#fff';
        btn.style.border = 'none';
        btn.style.borderRadius = '8px';
        btn.style.zIndex = '9999';
        btn.style.cursor = 'pointer';
        btn.style.fontSize = '16px';
        btn.style.boxShadow = '0 4px 6px rgba(0,0,0,0.2)';

        btn.addEventListener('click', () => {
            GM_setClipboard(token, 'text');
            btn.innerText = '✅ Copied!';
            setTimeout(() => {
                btn.innerText = '📋 Copy Bearer Token';
            }, 2000);
        });

        document.body.appendChild(btn);
    }

    function waitForToken() {
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) {
            createCopyButton(token);
        } else {
            console.warn('Bearer token not found. Retrying...');
            setTimeout(waitForToken, 1000); // Retry after 1s
        }
    }

    waitForToken();
})();
