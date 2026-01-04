// ==UserScript==
// @name         Cookie Clicker 1M Buyer
// @author    Emree.el
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Buys 1M in batches of 100 with cooldown to avoid lag
// @match        https://orteil.dashnet.org/cookieclicker/*
// @grant        none
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/545339/Cookie%20Clicker%201M%20Buyer.user.js
// @updateURL https://update.greasyfork.org/scripts/545339/Cookie%20Clicker%201M%20Buyer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CUSTOM_ID = 'storeBulk1M';
    const TOTAL_TARGET = 1000000;
    const BATCH_AMOUNT = 100;
    const DELAY_MS = 1000; // cooldown between batches (1 sec)

    let active = false;

    function makeButton() {
        const bulk = document.getElementById('storeBulk');
        if (!bulk || document.getElementById(CUSTOM_ID)) return;

        const ref = document.getElementById('storeBulk100');
        let btn = ref ? ref.cloneNode(true) : document.createElement('div');

        btn.id = CUSTOM_ID;
        btn.innerText = '1M';
        btn.classList.remove('selected');
        btn.title = 'Buys 1M in batches of 100 with cooldown';

        btn.addEventListener('click', e => {
            e.stopPropagation();
            e.preventDefault();
            active = true;
            bulk.querySelectorAll('.storeBulkAmount').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
        });

        if (ref) ref.insertAdjacentElement('afterend', btn);
        else bulk.appendChild(btn);

        // If other bulk button clicked, deactivate
        bulk.addEventListener('click', ev => {
            const clicked = ev.target.closest('.storeBulkAmount');
            if (clicked && clicked.id !== CUSTOM_ID) {
                active = false;
                btn.classList.remove('selected');
            }
        }, true);
    }

    // Handle product clicks when 1M active
    document.addEventListener('click', e => {
        if (!active) return;
        const product = e.target.closest('.product');
        if (!product) return;

        e.stopImmediatePropagation();
        e.preventDefault();

        const match = product.id.match(/^product(\d+)$/);
        if (!match) return;

        const idx = parseInt(match[1], 10);
        if (!Game || !Game.ObjectsById[idx]) return;

        let bought = 0;

        function buyBatch() {
            if (bought >= TOTAL_TARGET) return;
            for (let i = 0; i < BATCH_AMOUNT; i++) {
                Game.ObjectsById[idx].buy();
            }
            bought += BATCH_AMOUNT;
            setTimeout(buyBatch, DELAY_MS);
        }

        buyBatch();
    }, true);

    setInterval(makeButton, 500);
})();
