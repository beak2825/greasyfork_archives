// ==UserScript==
// @name         RR: Show Real Price
// @namespace    -
// @version      1.0.3
// @description  -
// @author       LianSheng
// @match        https://rivalregions.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rivalregions.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/445118/RR%3A%20Show%20Real%20Price.user.js
// @updateURL https://update.greasyfork.org/scripts/445118/RR%3A%20Show%20Real%20Price.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    setInterval(() => {
        if(! location.hash.includes("storage")) {
            return;
        }

        const realPriceElement = document.querySelector("input[price]");
        const showPriceElement = document.querySelector("span.storage_see.tip span.dot");
        if(realPriceElement && showPriceElement && !realPriceElement.classList.contains("RRSRP_Changed")) {
            let realPrice = realPriceElement.getAttribute("price") - 0;
            realPrice = realPrice < 1000 ? realPrice.toFixed(1) : realPrice;

            showPriceElement.innerText = `${numberWithCommas(realPrice)} $`;
            showPriceElement.style.fontSize = "15px";
            realPriceElement.classList.add("RRSRP_Changed");

            return;
        }

        const listTds = document.querySelectorAll("td[rat]:not(.imp):not(.RRSRP_Changed)");
        if(listTds.length > 0) {
            listTds.forEach(td => {
                let realPrice = td.getAttribute("rat") - 0;
                realPrice = realPrice < 1000 ? realPrice.toFixed(1) : realPrice;
                td.querySelector("span").innerText = `${numberWithCommas(realPrice)} $`;
                td.classList.add("RRSRP_Changed");
            });
        }
    }, 50);
})();