// ==UserScript==
// @name         Fluxus bypass
// @namespace    http://tampermonkey.net/
// @description  Bypass Fluxus by angel
// @version      1.1
// @author       Ángel<\\
// @match        https://flux.li/android/external/start.php?HWID=*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/506168/Fluxus%20bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/506168/Fluxus%20bypass.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    const url = window.location.href;
    const apiUrl = `https://solar-api-omg.vercel.app/api/bypass?url=${encodeURIComponent(url)}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Response error');
        }
        
        const data = await response.json();
        const result = data.result || 'Failed to bypass: Unknown error';

        createUI(result);
    } catch (error) {
        createUI(`Request failed: ${error.message}`);
    }

    function createUI(key) {
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.background = 'rgba(0, 0, 0, 0.8)';
        overlay.style.color = '#ffffff';
        overlay.style.display = 'flex';
        overlay.style.flexDirection = 'column';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.style.zIndex = '10000';
        overlay.style.fontFamily = 'Arial, sans-serif';
        overlay.style.textAlign = 'center';
        document.body.appendChild(overlay);

        const messageText = document.createElement('p');
        messageText.textContent = 'Success!';
        messageText.style.fontSize = '16px';
        messageText.style.marginBottom = '15px';
        messageText.style.color = '#28a745'; 
        overlay.appendChild(messageText);

        const keyText = document.createElement('p');
        keyText.textContent = `Key: ${key}`;
        keyText.style.fontSize = '16px';
        keyText.style.marginBottom = '15px';
        overlay.appendChild(keyText);

        const copyButton = document.createElement('button');
        copyButton.textContent = 'Copy Key';
        copyButton.style.padding = '10px 20px';
        copyButton.style.background = '#e94560';
        copyButton.style.color = '#ffffff';
        copyButton.style.border = 'none';
        copyButton.style.borderRadius = '5px';
        copyButton.style.cursor = 'pointer';
        copyButton.style.fontSize = '14px';

        copyButton.addEventListener('click', () => {
            navigator.clipboard.writeText(key).then(() => {
                alert('Key copied to clipboard');
                document.body.removeChild(overlay); 
            }).catch(err => {
                console.error('Error copying the key:', err);
            });
        });

        overlay.appendChild(copyButton);
    }
})();