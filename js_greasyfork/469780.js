// ==UserScript==
// @name         Money Wasted on Steam
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Computes the total amount of money spent on Steam
// @author       nonexistent227
// @match        https://store.steampowered.com/account/history/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steampowered.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469780/Money%20Wasted%20on%20Steam.user.js
// @updateURL https://update.greasyfork.org/scripts/469780/Money%20Wasted%20on%20Steam.meta.js
// ==/UserScript==

function getPrice(elem) {
    return Number(elem.innerHTML.replace(/[^0-9.-]+/g, ""));
}

function isMarketTransaction(rowElement) {
    return rowElement.querySelector("td.wht_type").innerText.includes("Market");
}

function wasRefunded(rowElement) {
    return !!rowElement.querySelector(".wht_refunded");
}

(function() {
    'use strict';

    let button = document.createElement("button");
    button.innerHTML = "Calculate Total";
    button.addEventListener("click", (event) => {
        let sum = 0;
        document.querySelectorAll("tr.wallet_table_row").forEach(rowElement => {
            // ignore marketplace transactions
            if(isMarketTransaction(rowElement)) return;
            // ignore refunded items
            if(wasRefunded(rowElement)) return;

            let total = getPrice(rowElement.querySelector("td.wht_total"));
            sum += total;

            let walletChange = getPrice(rowElement.querySelector("td.wht_wallet_change"));
            // We ignore amounts that were paid by wallet.
            // Subtract here because wallet funds were included in `total`
            if(walletChange < 0) {
                sum += walletChange;
            }
        });
        alert(sum);
    });

    document.querySelector(".page_content").append(button);
})();
