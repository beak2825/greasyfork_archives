// ==UserScript==
// @name         Unich Airdrop Token Viewer
// @namespace    ForestArmy-Itsmesatyavir
// @version      1.2
// @description  Detect and display AIRDROP_token with copy button on unich.com
// @author       ForestArmy
// @match        https://unich.com/*
// @license      MIT
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538372/Unich%20Airdrop%20Token%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/538372/Unich%20Airdrop%20Token%20Viewer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Wait for page to fully load
    window.addEventListener('load', () => {
        const cookies = document.cookie.split('; ');
        const tokenCookie = cookies.find(c => c.startsWith('AIRDROP_token='));

        if (tokenCookie) {
            const token = tokenCookie.split('=')[1];

            // Create popup UI
            const container = document.createElement('div');
            container.style.position = 'fixed';
            container.style.bottom = '20px';
            container.style.right = '20px';
            container.style.background = '#111';
            container.style.color = '#0ff';
            container.style.padding = '15px';
            container.style.border = '2px solid #0ff';
            container.style.borderRadius = '10px';
            container.style.zIndex = '99999';
            container.style.maxWidth = '300px';
            container.style.fontFamily = 'monospace';

            const tokenText = document.createElement('textarea');
            tokenText.value = token;
            tokenText.rows = 4;
            tokenText.style.width = '100%';
            tokenText.style.marginBottom = '10px';
            tokenText.style.background = '#000';
            tokenText.style.color = '#0ff';
            tokenText.style.border = 'none';
            tokenText.style.resize = 'none';

            const copyBtn = document.createElement('button');
            copyBtn.textContent = '📋 Copy Token';
            copyBtn.style.background = '#0ff';
            copyBtn.style.color = '#000';
            copyBtn.style.border = 'none';
            copyBtn.style.padding = '5px 10px';
            copyBtn.style.cursor = 'pointer';
            copyBtn.style.fontWeight = 'bold';
            copyBtn.style.borderRadius = '5px';

            copyBtn.onclick = () => {
                tokenText.select();
                document.execCommand('copy');
                copyBtn.textContent = '✅ Copied!';
                setTimeout(() => {
                    copyBtn.textContent = '📋 Copy Token';
                }, 2000);
            };

            container.appendChild(tokenText);
            container.appendChild(copyBtn);
            document.body.appendChild(container);
        }
    });
})();
