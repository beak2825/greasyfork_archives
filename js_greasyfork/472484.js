// ==UserScript==
// @name         JavBus Copy Button
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add a copy button to the JavBus project to make it easy for mobile Safari to copy.
// @author       loveJav
// @match        https://www.javbus.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=javbus.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/472484/JavBus%20Copy%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/472484/JavBus%20Copy%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const tab = document.getElementById("magnet-table");

    if(!tab){
        return;
    }

    const interval = setInterval(() => {
        const rows = tab.querySelectorAll("tr");

        if(rows.length === 1) {
            return;
            console.log(1)
        }

        clearInterval(interval);

        for(let i = 1; i < rows.length; i++) {

            const row = rows[i];
            const a = row.children[0].children[0];
            const link = a.getAttribute('href');

            const cell = document.createElement('td');
            const button = document.createElement('button');

            button.textContent = 'Copy';

            button.style.textAlign = 'center';
            button.style.cursor = 'pointer';
            button.style.color = '#fff';
            button.style.background = 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)';
            button.style.border = 'none';
            button.style.borderRadius = '3px';
            button.style.transition = '0.3s';

            button.onclick = function() {
                navigator.clipboard.writeText(link)
                    .then(() => {
                    alert('Copy successful!');
                })
                    .catch(err => {
                    console.error('Could not copy text: ', err);
                });
            };

            cell.appendChild(button);
            row.appendChild(cell);
        }
    }, 100);
})();