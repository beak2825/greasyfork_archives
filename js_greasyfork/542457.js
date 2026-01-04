// ==UserScript==
// @name         Kaisar Mining Token Extractor with Copy Button
// @namespace    https://zero.kaisar.io
// @version      1.1
// @description  Extract the mining token 
// @author       forestarmy
// @license      MIT
// @match        https://zero.kaisar.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542457/Kaisar%20Mining%20Token%20Extractor%20with%20Copy%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/542457/Kaisar%20Mining%20Token%20Extractor%20with%20Copy%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const COOKIE_NAME = "kaisar_minning_token";
    const cookie = document.cookie.split('; ').find(row => row.startsWith(COOKIE_NAME + '='));
    if (!cookie) return console.warn("❌ Token not found in cookies.");

    const token = decodeURIComponent(cookie.split('=')[1]);

    // Create container
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.bottom = '20px';
    container.style.right = '20px';
    container.style.padding = '12px';
    container.style.backgroundColor = '#111';
    container.style.color = '#0f0';
    container.style.border = '2px solid #0f0';
    container.style.borderRadius = '8px';
    container.style.zIndex = '9999';
    container.style.fontFamily = 'monospace';
    container.style.fontSize = '13px';
    container.style.maxWidth = '350px';

    // Token display
    const tokenText = document.createElement('div');
    tokenText.innerText = '🔐 Kaisar Mining Token:\n' + token;
    tokenText.style.wordBreak = 'break-word';
    container.appendChild(tokenText);

    // Copy button
    const copyBtn = document.createElement('button');
    copyBtn.innerText = '📋 Copy Token';
    copyBtn.style.marginTop = '10px';
    copyBtn.style.padding = '6px 12px';
    copyBtn.style.backgroundColor = '#0f0';
    copyBtn.style.color = '#000';
    copyBtn.style.border = 'none';
    copyBtn.style.cursor = 'pointer';
    copyBtn.style.borderRadius = '4px';

    copyBtn.onclick = () => {
        navigator.clipboard.writeText(token).then(() => {
            copyBtn.innerText = '✅ Copied!';
            setTimeout(() => (copyBtn.innerText = '📋 Copy Token'), 2000);
        });
    };

    container.appendChild(copyBtn);
    document.body.appendChild(container);
})();