// ==UserScript==
// @name         Forestarmy - Extract Bearer Token
// @namespace    https://t.me/forestarmy
// @version      2.0
// @description  Extract Privy Bearer token from fetch/XHR and show with copy button
// @author       itsmesatyavir
// @match        https://campaign.cicada.finance/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540456/Forestarmy%20-%20Extract%20Bearer%20Token.user.js
// @updateURL https://update.greasyfork.org/scripts/540456/Forestarmy%20-%20Extract%20Bearer%20Token.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let tokenShown = false;

    // Hook into fetch
    const origFetch = window.fetch;
    window.fetch = async function(...args) {
        const [url, options] = args;
        try {
            if (url.includes('/api/v1/sessions')) {
                const headers = options?.headers;
                let token = '';
                if (headers?.Authorization) {
                    token = headers.Authorization;
                } else if (typeof headers?.get === 'function') {
                    token = headers.get('Authorization');
                }
                if (token && !tokenShown) {
                    showTokenBox(token.replace('Bearer ', ''));
                    tokenShown = true;
                }
            }
        } catch (e) {
            console.warn('[Forestarmy] Error in fetch hook:', e);
        }
        return origFetch.apply(this, args);
    };

    // Hook into XMLHttpRequest too
    const origOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        this._forestUrl = url;
        return origOpen.apply(this, arguments);
    };

    const origSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function(body) {
        const xhr = this;
        const origSetRequestHeader = xhr.setRequestHeader;
        let token = '';

        xhr.setRequestHeader = function(header, value) {
            if (header.toLowerCase() === 'authorization' && !tokenShown) {
                token = value.replace('Bearer ', '');
                showTokenBox(token);
                tokenShown = true;
            }
            return origSetRequestHeader.apply(this, arguments);
        };
        return origSend.apply(this, arguments);
    };

    function showTokenBox(token) {
        const div = document.createElement('div');
        div.style.position = 'fixed';
        div.style.top = '20px';
        div.style.right = '20px';
        div.style.zIndex = '9999';
        div.style.background = '#111';
        div.style.color = '#0ff';
        div.style.padding = '12px';
        div.style.borderRadius = '8px';
        div.style.border = '2px solid #0ff';
        div.style.maxWidth = '350px';
        div.style.fontSize = '12px';
        div.style.wordBreak = 'break-all';
        div.innerHTML = `
            <div><b>🔥 Bearer Token</b></div>
            <div id="token-text" style="margin-top: 5px; font-weight: bold;">${token}</div>
            <button id="copy-btn" style="margin-top: 10px; background:#0ff; color:#000; border:none; padding:4px 8px; cursor:pointer;">Copy</button>
        `;
        document.body.appendChild(div);

        document.getElementById('copy-btn').onclick = () => {
            navigator.clipboard.writeText(token).then(() => {
                document.getElementById('copy-btn').innerText = 'Copied!';
                setTimeout(() => {
                    document.getElementById('copy-btn').innerText = 'Copy';
                }, 1000);
            });
        };
    }
})();
