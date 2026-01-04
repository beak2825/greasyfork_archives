// ==UserScript==
// @name         Toggle Get All Items
// @version      0.1
// @description  Ditlep toggle get all item
// @namespace    vietkhanhbean.com
// @author       Vietkhanh bean (fb.com/vietkhanhbean)
// @match        http://www.ditlep.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370638/Toggle%20Get%20All%20Items.user.js
// @updateURL https://update.greasyfork.org/scripts/370638/Toggle%20Get%20All%20Items.meta.js
// ==/UserScript==

(function() {
    $('.btn.btn-success.ng-hide').toggleClass('ng-hide');
    $('.btn.btn-warning.ng-binding').toggleClass('ng-hide');
})();