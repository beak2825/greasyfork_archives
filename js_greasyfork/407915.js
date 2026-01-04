// ==UserScript==
// @name         Sticker Shock
// @namespace    https://github.com/kixelated
// @version      0.2
// @description  hide prices on Realtor.com for rebe
// @author       kixelated@gmail.com
// @match        https://www.realtor.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/407915/Sticker%20Shock.user.js
// @updateURL https://update.greasyfork.org/scripts/407915/Sticker%20Shock.meta.js
// ==/UserScript==

'use strict';

GM_addStyle(`
    .price, .card-price, [itemprop="price"], .estimate-payment-button, .estimate-payment-link {
        background: white !important;
        color: white !important;
        text-shadow: none !important;
        border-bottom: 1px solid white !important;
    }

    .for_sale {
        color: white !important;
    }

    .for_sale.selected, .for_sale.hover {
        color: #bc2029 !important;
    }
`)