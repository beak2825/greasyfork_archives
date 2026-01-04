// ==UserScript==
// @name         Copy Page Source Button
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  adds a button that a=copies the source code
// @author       JouwNaam
// @match        *://*/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/532329/Copy%20Page%20Source%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/532329/Copy%20Page%20Source%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';


    const button = document.createElement('button');
    button.textContent = '🖨️';
    button.style.position = 'fixed';
    button.style.left = '24px';
    button.style.bottom = '60px';
    button.style.padding = '6px 10px';
    button.style.backgroundColor = '#000000';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '3px';
    button.style.fontSize = '14px';
    button.style.cursor = 'pointer';
    button.style.zIndex = '9999';

    document.body.appendChild(button);

    button.addEventListener('click', function() {
        const pageSource = document.documentElement.outerHTML;
        GM_setClipboard(pageSource);
        alert('Broncode is gekopieerd naar het klembord!');
    });
})();
