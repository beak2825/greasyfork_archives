// ==UserScript==
// @name         Forest Army - DDAI Token Extractor (access + refresh)
// @namespace    https://t.me/forestarmy
// @version      3.1
// @description  Extract accessToken and refreshToken from localStorage at app.ddai.space and display with copy buttons
// @match        https://app.ddai.space/*
// @license      MIT 
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542089/Forest%20Army%20-%20DDAI%20Token%20Extractor%20%28access%20%2B%20refresh%29.user.js
// @updateURL https://update.greasyfork.org/scripts/542089/Forest%20Army%20-%20DDAI%20Token%20Extractor%20%28access%20%2B%20refresh%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 🌲 Create UI container
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '10px';
    container.style.right = '10px';
    container.style.zIndex = '99999';
    container.style.background = '#111';
    container.style.color = '#00ff88';
    container.style.padding = '15px';
    container.style.border = '2px solid #00ff88';
    container.style.borderRadius = '12px';
    container.style.fontFamily = 'monospace';
    container.style.maxWidth = '90vw';
    container.style.boxShadow = '0 0 15px #00ff88';
    container.style.wordBreak = 'break-word';

    // 🌿 Branding
    const title = document.createElement('div');
    title.innerHTML = `<b>🌲 FOREST ARMY</b><br><a href="https://t.me/forestarmy" target="_blank" style="color:#0cf">Join us on Telegram</a>`;
    title.style.marginBottom = '12px';
    container.appendChild(title);

    // 🔐 accessToken display
    const accessLabel = document.createElement('div');
    accessLabel.innerHTML = `<b>Access Token:</b>`;
    const accessTokenDiv = document.createElement('div');
    accessTokenDiv.textContent = 'Loading...';
    accessTokenDiv.style.margin = '4px 0';

    const accessCopyBtn = document.createElement('button');
    accessCopyBtn.textContent = 'Copy Access';
    accessCopyBtn.style.background = '#222';
    accessCopyBtn.style.color = '#00ff88';
    accessCopyBtn.style.border = '1px solid #00ff88';
    accessCopyBtn.style.cursor = 'pointer';
    accessCopyBtn.style.marginBottom = '10px';
    accessCopyBtn.style.padding = '5px 10px';
    accessCopyBtn.onclick = () => {
        navigator.clipboard.writeText(accessTokenDiv.textContent);
        accessCopyBtn.textContent = 'Copied!';
        setTimeout(() => (accessCopyBtn.textContent = 'Copy Access'), 1500);
    };

    container.appendChild(accessLabel);
    container.appendChild(accessTokenDiv);
    container.appendChild(accessCopyBtn);

    // 🔁 refreshToken display
    const refreshLabel = document.createElement('div');
    refreshLabel.innerHTML = `<b>Refresh Token:</b>`;
    const refreshTokenDiv = document.createElement('div');
    refreshTokenDiv.textContent = 'Loading...';
    refreshTokenDiv.style.margin = '4px 0';

    const refreshCopyBtn = document.createElement('button');
    refreshCopyBtn.textContent = 'Copy Refresh';
    refreshCopyBtn.style.background = '#222';
    refreshCopyBtn.style.color = '#00ff88';
    refreshCopyBtn.style.border = '1px solid #00ff88';
    refreshCopyBtn.style.cursor = 'pointer';
    refreshCopyBtn.style.padding = '5px 10px';
    refreshCopyBtn.onclick = () => {
        navigator.clipboard.writeText(refreshTokenDiv.textContent);
        refreshCopyBtn.textContent = 'Copied!';
        setTimeout(() => (refreshCopyBtn.textContent = 'Copy Refresh'), 1500);
    };

    container.appendChild(refreshLabel);
    container.appendChild(refreshTokenDiv);
    container.appendChild(refreshCopyBtn);

    // 🧩 Add UI to page
    document.body.appendChild(container);

    // 🔄 Function to update tokens from localStorage
    function updateTokens() {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');

        if (accessToken && accessToken.length > 50) {
            accessTokenDiv.textContent = accessToken;
        }

        if (refreshToken && refreshToken.length > 50) {
            refreshTokenDiv.textContent = refreshToken;
        }
    }

    updateTokens(); // Run once at start
    setInterval(updateTokens, 2000); // Poll every 2 seconds
})();