// ==UserScript==
// @name         Fastinvest auto sell
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Sell ALL investments of Fastinvest automatically.
// @author       Al
// @match        https://www.fastinvest.com/es/investor/investments
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393553/Fastinvest%20auto%20sell.user.js
// @updateURL https://update.greasyfork.org/scripts/393553/Fastinvest%20auto%20sell.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function sell(){
        $('#investments-list-table .btn-danger:first').trigger('click');
        setTimeout(confirm, 500);
    }

    function confirm(){
        $('.modal-footer .success-modal-btn:first').trigger('click');
    }

    setTimeout(sell, 1000);
})();