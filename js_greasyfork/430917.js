// ==UserScript==
// @name         Flight Rising: Game Database Dom Discount
// @author       https://greasyfork.org/users/547396
// @namespace    https://greasyfork.org/users/547396
// @description  Applies dom discount to items that can be bought in the marketplace
// @match        *://*.flightrising.com/game-database/item/*
// @icon         https://www.google.com/s2/favicons?domain=flightrising.com
// @grant        none
// @version      0.1
// @downloadURL https://update.greasyfork.org/scripts/430917/Flight%20Rising%3A%20Game%20Database%20Dom%20Discount.user.js
// @updateURL https://update.greasyfork.org/scripts/430917/Flight%20Rising%3A%20Game%20Database%20Dom%20Discount.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const game_db = document.getElementById('game-database');
    const tabTables = document.getElementsByClassName('common-plain-table')[0];

    let domDiscount = document.createElement('div');

    if( tabTables.innerHTML.includes('Sold in Shops')) {
        let currency = tabTables.getElementsByTagName('td')[0].innerText;
        let price = tabTables.getElementsByTagName('td')[2].innerText;


        if( !currency.includes('Gems') ) {
           let convert = parseInt(price) * 0.85;

           domDiscount.innerHTML = '<span style="display: block; padding: 10px; border: 2px solid #731d08; margin-top: 10px;"><strong>Dom Discount:</strong> ' + convert + '</span>';
        }
    }

    game_db.appendChild(domDiscount);

})();