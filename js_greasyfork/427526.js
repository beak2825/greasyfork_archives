// ==UserScript==
// @name         AliExpress Total Shower
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Shows the total amount spent on a page of your AliExpress orders.
// @author       Hydra#1234 (Discord)
// @match        https://trade.aliexpress.com/orderList.htm*
// @icon         https://www.google.com/s2/favicons?domain=aliexpress.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427526/AliExpress%20Total%20Shower.user.js
// @updateURL https://update.greasyfork.org/scripts/427526/AliExpress%20Total%20Shower.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var amounts = document.getElementsByClassName('amount-num')
    let total = 0;
    for (let item of amounts) {
        total += Number(item.innerText.split(' ')[1]);
    }

    document.getElementsByClassName('page-title')[0].innerHTML += " - Total: $" + total.toFixed(2);
})();