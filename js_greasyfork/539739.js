// ==UserScript==
// @name         ticket-check-yes24
// @namespace    ticket-check-yes24_AndrewWang
// @version      0.0.1
// @description  yes24售票：自動勾同意兩個同意
// @author       AndrewWang
// @match        http://ticket.yes24.com/Pages/English/Sale/FnPerfSaleProcess.aspx*

// @run-at       document-idle
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/539739/ticket-check-yes24.user.js
// @updateURL https://update.greasyfork.org/scripts/539739/ticket-check-yes24.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const checkbox = document.querySelector('#cbxCancelFeeAgree');
    if (checkbox) {
      checkbox.checked = true;
    }

    const checkbox2 = document.querySelector('#cbxUserInfoAgree');
    if (checkbox2) {
      checkbox2.checked = true;
    }
})();
