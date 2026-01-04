// ==UserScript==
// @name         Ahoj - Test Finsko
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Přidá nápis "Ahoj"
// @match        https://finnhandball.torneopal.fi/taso/live.php*
// @author       KvidoTeam
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531573/Ahoj%20-%20Test%20Finsko.user.js
// @updateURL https://update.greasyfork.org/scripts/531573/Ahoj%20-%20Test%20Finsko.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('Tampermonkey skript spuštěn');
    console.log('Čekám 3 vteřiny...');

    setTimeout(() => {
        console.log('Přidávám nápis "Ahoj"...');

        const ahojDiv = document.createElement('div');
        ahojDiv.textContent = 'Ahoj';
        ahojDiv.style.position = 'fixed';
        ahojDiv.style.top = '10px';
        ahojDiv.style.left = '10px';
        ahojDiv.style.backgroundColor = 'white';
        ahojDiv.style.padding = '10px';
        ahojDiv.style.border = '1px solid black';
        ahojDiv.style.zIndex = '9999';

        document.body.appendChild(ahojDiv);

        console.log('Nápis "Ahoj" byl přidán.');
    }, 3000);
})();