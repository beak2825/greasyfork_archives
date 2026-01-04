// ==UserScript==
// @name         BaseTao - Show PayID
// @version      0.1.2
// @namespace    https://www.reddit.com/user/RobotOilInc
// @description  Adds the PayId next to the order ID
// @author       RobotOilInc
// @match        https://www.basetao.com/*my_account/order/*
// @match        https://basetao.com/*my_account/order/*
// @grant        none
// @license      MIT
// @icon         https://basetao.com/style/index/img/favicon.png
// @downloadURL https://update.greasyfork.org/scripts/469927/BaseTao%20-%20Show%20PayID.user.js
// @updateURL https://update.greasyfork.org/scripts/469927/BaseTao%20-%20Show%20PayID.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const $container = $('#table').first();

    // Add PayID to all elements (even on page changes)
    $container.on('load-success.bs.table', (e, data) => {
        data.rows.forEach((item) => {
            // If no payid exists, just skip this item
            if (!item.payid || item.payid === "") {
                return;
            }

            const $item = $(`[data-uniqueid="${item.oid}"]`);
            const $orderBadge = $item.find('td:nth-child(2) > span.badge.bg-secondary.me-2');
            const $payId = $(`<span class="badge bg-orange me-2"><span class="user-select-all">${item.payid}</span></span>`)

            $orderBadge.after($payId);
        })
    })
})();