// ==UserScript==
// @name         New direct alamat BL
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://seller.bukalapak.com/transactions/print-preview?detail_product=true&review_reminder=true&transaction_ids[]=*
// @match        https://seller.bukalapak.com/transactions/print-preview?detail_product=true&transaction_ids[]=*
// @match        https://seller.bukalapak.com/transactions/print-preview?detail_product=false&transaction_ids[]=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420816/New%20direct%20alamat%20BL.user.js
// @updateURL https://update.greasyfork.org/scripts/420816/New%20direct%20alamat%20BL.meta.js
// ==/UserScript==

(function() {
    'use strict';
var idtrans = window.location.href.slice(-10)
window.location.href = 'https://seller.bukalapak.com/transactions/print-preview?blcostomslip'+idtrans
})();