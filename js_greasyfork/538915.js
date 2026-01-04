// ==UserScript==
// @name         Edenfi Token Unlock
// @namespace    https://edenfi.io/
// @version      1.0
// @author       Forest Army
// @description  Extract and copy from localStorage
// @match        https://waitlist.edenfi.io/*
// @license      MIT
// @grant        GM_setClipboard
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/538915/Edenfi%20Token%20Unlock.user.js
// @updateURL https://update.greasyfork.org/scripts/538915/Edenfi%20Token%20Unlock.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function createCopyButton(token) {
        const btn = document.createElement('button');
        btn.textContent = '📋 Copy edenfi token';
        btn.style.position = 'fixed';
        btn.style.top = '10px';
        btn.style.right = '10px';
        btn.style.zIndex = 9999;
        btn.style.padding = '10px';
        btn.style.background = '#4CAF50';
        btn.style.color = 'white';
        btn.style.border = 'none';
        btn.style.borderRadius = '5px';
        btn.style.cursor = 'pointer';

        btn.onclick = () => {
            GM_setClipboard(token);
            btn.textContent = '✅ Copied!';
            setTimeout(() => (btn.textContent = '📋 Copy edenfi_auth_token'), 2000);
        };

        document.body.appendChild(btn);
    }

    const token = localStorage.getItem('edenfi_auth_token');
    if (token) {
        console.log('edenfi_auth_token:', token);
        createCopyButton(token);
    } else {
        console.warn('edenfi_auth_token not found in localStorage');
    }
})();