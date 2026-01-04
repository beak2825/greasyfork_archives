// ==UserScript==
// @name         Odstranění simulace a series
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Odstraní simulované zápasy z multi
// @author       Michal
// @match        https://widgets.sir.sportradar.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482820/Odstran%C4%9Bn%C3%AD%20simulace%20a%20series.user.js
// @updateURL https://update.greasyfork.org/scripts/482820/Odstran%C4%9Bn%C3%AD%20simulace%20a%20series.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeTable() {
        let tables = document.querySelectorAll('table.mtable');
        tables.forEach(table => {
            let text = table.textContent;
            if (
                text.includes('Simulated Reality League') ||
                text.includes('. Series.')
            ) {
                table.remove();
            }
        });
    }

    function delayedRemoval() {
        setTimeout(removeTable, 2000);
    }

    delayedRemoval();

    new MutationObserver(delayedRemoval).observe(document.body, {
        childList: true,
        subtree: true
    });
})();