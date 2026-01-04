// ==UserScript==
// @name           smmo-buy-everything
// @name:de        smmo-alles-kaufen
// @namespace      http://tampermonkey.net/
// @version        0.1
// @description    automatically buys all items from the current market page if you append "&buyall" to the end of the link.
// @description:de kauft automatisch alle Gegenstände der aktuellen Marktseite wenn du "&buyall" an die URL anhängst.
// @author         Florian Cullmann (fcullmann.com)
// @match          https://web.simple-mmo.com/market/listings*&buyall
// @icon           data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/444059/smmo-buy-everything.user.js
// @updateURL https://update.greasyfork.org/scripts/444059/smmo-buy-everything.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let table = document.querySelector("table");
    const sleep = (time) => {
        return new Promise(resolve => setTimeout(resolve, time))
    }

    const iterateTable = async () => {
        for (let i = 0, row; row = table.rows[i]; i++) {
            if (i === 0) {
                continue;
            }
            await sleep(rndInt(1000, 1300));

            const cells = row.cells;
            const buyButtonCell = cells[4];
            const button = buyButtonCell.children[0];
            processPurchase(button);
        }
    }

    iterateTable();

    function processPurchase(button) {
        button.click();
        setTimeout(function() {
            document.getElementById('confirmBuyButton').click();
        }, 300);
        console.log('purchased 1 item.');
    }

    function rndInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

})();