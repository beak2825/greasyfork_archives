// ==UserScript==
// @name         DailyTools
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://merchant.vova.com/index.php?q=admin/main/cloneProduct/pendingCloneProductList*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381294/DailyTools.user.js
// @updateURL https://update.greasyfork.org/scripts/381294/DailyTools.meta.js
// ==/UserScript==

(function() {
    if(/merchant.vova.com\/index.php\?q=admin\/main\/cloneProduct\/pendingCloneProductList/.test(window.location.href)){
        let saleStatusInput = document.querySelectorAll(".sale-status-input");
        if (saleStatusInput) {
            for(let i = 0; i < saleStatusInput.length; i++) {
                saleStatusInput[i].click();
            }
        }

        console.log("vova");
    }
})();