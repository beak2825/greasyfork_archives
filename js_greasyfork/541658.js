// ==UserScript==
// @name         testeo de mensaje
// @namespace    https://greasyfork.org/users/lucas
// @version      1.0
// @description  Displays a floating message to confirm the script is working on drawaria.online.
// @author       Lucas
// @match        https://www.drawaria.online/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541658/testeo%20de%20mensaje.user.js
// @updateURL https://update.greasyfork.org/scripts/541658/testeo%20de%20mensaje.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const message = document.createElement('div');
    message.textContent = '✅ Drawaria script is working!';
    message.style.position = 'fixed';
    message.style.top = '20px';
    message.style.right = '20px';
    message.style.background = '#4caf50';
    message.style.color = '#fff';
    message.style.padding = '10px 15px';
    message.style.borderRadius = '8px';
    message.style.fontSize = '16px';
    message.style.zIndex = '99999';
    message.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
    document.body.appendChild(message);

    // Remove after 5 seconds
    setTimeout(() => {
        message.remove();
    }, 5000);
})();
