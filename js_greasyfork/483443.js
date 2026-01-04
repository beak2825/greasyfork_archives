// ==UserScript==
// @name         Simulated Reality League
// @match        https://dc.livesport.eu/kvido/parser/multi-admin
// @grant        none
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Odstraní Simulované zápasy
// @author       Michal
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/483443/Simulated%20Reality%20League.user.js
// @updateURL https://update.greasyfork.org/scripts/483443/Simulated%20Reality%20League.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeTable() {
        let tables = document.querySelectorAll('table.mtable');
        tables.forEach(table => {
            if (table.textContent.includes('Simulated Reality League')) {
                table.remove();
            }
        });
    }

    function delayedRemoval() {
        setTimeout(removeTable, 3000);
    }

    delayedRemoval();

    new MutationObserver(delayedRemoval).observe(document.body, {
        childList: true,
        subtree: true
    });
})();