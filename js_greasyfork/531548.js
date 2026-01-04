// ==UserScript==
// @name         Starve.io Token Info Copier
// @description  Copies Token info from Starve.io cookies. Paste this information into brutal's token menu.
// @version      1.01
// @author       Kane & Mini
// @match        https://starve.io/*
// @namespace    https://starve.io
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531548/Starveio%20Token%20Info%20Copier.user.js
// @updateURL https://update.greasyfork.org/scripts/531548/Starveio%20Token%20Info%20Copier.meta.js
// ==/UserScript==

//https://greasyfork.org/en/scripts/531548-starve-io-token-info-copier

/*
This code is intentionally left unobfuscated for transparency.
Please avoid modifying it unless you fully understand its functionality,
as unintended changes may cause you to die in game.

By using this service, you agree that Kane & Mini are not responsible for any in-game consequences resulting from modification or use of this script.

How to properly use this script: 

1. Add brutal to your discord server: https://discord.com/oauth2/authorize?client_id=953021874806345838&permissions=1759218604441591&integration_type=0&scope=bot
2. Run /tokens in any channel
3. Input your token information
4. Your token will be taken, enjoy infinite AFK! 
*/

(function() {
    'use strict';

    function getCookie(name) {
        let match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? match[2] : null;
    }

    function copyAFKInfo() {
        const token = getCookie('starve_token') || localStorage.getItem('starve_token');
        const tokenId = getCookie('starve_token_id') || localStorage.getItem('starve_token_id');

        if (token && tokenId) {
            const text = `\`\`\`Token: ${token}\nTokenID: ${tokenId}\`\`\``;
            GM_setClipboard(text);
            showConfirmation("Token Info Copied");
        } else {
            showConfirmation("Token Info Not Found!", true);
        }
    }

    function showConfirmation(message, isError = false) {
        const msgBox = document.createElement('div');
        msgBox.innerText = message;
        msgBox.style.position = 'fixed';
        msgBox.style.top = '10px';
        msgBox.style.left = '50%';
        msgBox.style.transform = 'translateX(-50%)';
        msgBox.style.backgroundColor = isError ? 'rgba(255, 0, 0, 0.5)' : 'rgba(0, 255, 0, 0.5)';
        msgBox.style.color = 'white';
        msgBox.style.padding = '10px';
        msgBox.style.borderRadius = '10px';
        msgBox.style.zIndex = '10000';
        msgBox.style.fontFamily = 'Baloo Paaji, sans-serif';
        document.body.appendChild(msgBox);

        setTimeout(() => {
            msgBox.style.transition = 'opacity 0.5s';
            msgBox.style.opacity = '0';
            setTimeout(() => msgBox.remove(), 500);
        }, 3000);
    }

    function createButton() {
        const btn = document.createElement('button');
        btn.innerText = "Copy AFK Info";
        btn.style.position = 'fixed';
        btn.style.bottom = '10px';
        btn.style.left = '10px';
        btn.style.backgroundColor = 'rgba(0, 0, 255, 0.5)';
        btn.style.color = 'white';
        btn.style.border = 'none';
        btn.style.padding = '10px';
        btn.style.borderRadius = '10px';
        btn.style.cursor = 'pointer';
        btn.style.zIndex = '10000';
        btn.style.fontFamily = 'Baloo Paaji, sans-serif';
        document.body.appendChild(btn);
        btn.onclick = copyAFKInfo;
    }

    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Baloo+Paaji&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    createButton();
})();