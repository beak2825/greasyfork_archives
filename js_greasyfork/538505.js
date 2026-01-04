// ==UserScript==
// @name         DAWN Token Extractor
// @namespace    forestarmy
// @version      4.0
// @description  Extract DAWN token.
// @match        https://dashboard.dawninternet.com/*
// @grant        none
// @author.      Itsmesatyavir
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538505/DAWN%20Token%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/538505/DAWN%20Token%20Extractor.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let token = null;

    // === Create UI box (Top-Right Corner) ===
    const box = document.createElement('div');
    box.style.position = 'fixed';
    box.style.top = '10px';
    box.style.right = '10px';
    box.style.zIndex = '999999';
    box.style.background = '#000';
    box.style.color = '#0ff';
    box.style.padding = '12px';
    box.style.border = '2px solid #0ff';
    box.style.borderRadius = '12px';
    box.style.fontSize = '12px';
    box.style.width = '300px';
    box.style.fontFamily = 'monospace';
    box.style.boxShadow = '0 0 12px #0ff';

    const title = document.createElement('div');
    title.textContent = 'DAWN Token Extractor FORESTARMY';
    title.style.fontWeight = 'bold';
    title.style.fontSize = '14px';
    title.style.marginBottom = '6px';

    const tokenDisplay = document.createElement('div');
    tokenDisplay.textContent = 'Detecting...';
    tokenDisplay.style.maxHeight = '32px';
    tokenDisplay.style.overflow = 'hidden';
    tokenDisplay.style.textOverflow = 'ellipsis';
    tokenDisplay.style.whiteSpace = 'nowrap';
    tokenDisplay.style.marginBottom = '8px';
    tokenDisplay.style.color = '#fff';

    const copyBtn = document.createElement('button');
    copyBtn.textContent = '📋 Copy Token';
    copyBtn.style.background = '#0ff';
    copyBtn.style.color = '#000';
    copyBtn.style.border = 'none';
    copyBtn.style.padding = '6px 10px';
    copyBtn.style.cursor = 'pointer';
    copyBtn.style.borderRadius = '6px';
    copyBtn.style.width = '100%';
    copyBtn.disabled = true;

    copyBtn.onclick = () => {
        if (token) {
            navigator.clipboard.writeText(token).then(() => {
                copyBtn.textContent = '✅ Copied';
                setTimeout(() => copyBtn.textContent = '📋 Copy Token', 2000);
            });
        }
    };

    box.appendChild(title);
    box.appendChild(tokenDisplay);
    box.appendChild(copyBtn);
    document.body.appendChild(box);

    // === Telegram Widget Embed ===
    const telegram = document.createElement('script');
    telegram.async = true;
    telegram.src = 'https://telegram.org/js/telegram-widget.js?22';
    telegram.setAttribute('data-telegram-post', 'forestarmy/3954');
    telegram.setAttribute('data-width', '100%');
    document.body.appendChild(telegram);

    // === Token Updater ===
    function updateToken(newToken) {
        if (!newToken || newToken === token) return;
        token = newToken;
        tokenDisplay.textContent = newToken;
        copyBtn.disabled = false;
        console.log('[FORESTARMY] Token:', token);
    }

    // === 1. Try localStorage.user ===
    try {
        const userData = localStorage.getItem('user');
        if (userData) {
            const parsed = JSON.parse(userData);
            if (parsed.token) updateToken(parsed.token);
        }
    } catch (e) {}

    // === 2. Hook fetch ===
    const origFetch = window.fetch;
    window.fetch = async function (...args) {
        const response = await origFetch.apply(this, args);

        // Check headers
        const config = args[1];
        if (config?.headers?.Authorization?.startsWith('Bearer ')) {
            updateToken(config.headers.Authorization.split(' ')[1]);
        }

        // Check JSON response
        try {
            const cloned = response.clone();
            const type = cloned.headers.get('content-type') || '';
            if (type.includes('application/json')) {
                const json = await cloned.json();
                if (json?.token) updateToken(json.token);
            }
        } catch (e) {}

        return response;
    };

    // === 3. Hook XHR ===
    const origOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function () {
        this.addEventListener('readystatechange', function () {
            if (this.readyState === 4) {
                try {
                    const type = this.getResponseHeader('content-type') || '';
                    if (type.includes('application/json')) {
                        const json = JSON.parse(this.responseText);
                        if (json?.token) updateToken(json.token);
                    }
                } catch (e) {}
            }
        });
        origOpen.apply(this, arguments);
    };
})();
