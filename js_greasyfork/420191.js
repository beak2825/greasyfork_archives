// ==UserScript==
// @name         Tokyo Otaku Mode Stock Level
// @namespace    https://tharglet.me.uk/
// @version      1.0
// @description  Shows the stock level on the product pages of items on TOM
// @author       tharglet
// @include      /^https:\/\/otakumode.com\/shop\/[a-f0-9]{24}\//
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420191/Tokyo%20Otaku%20Mode%20Stock%20Level.user.js
// @updateURL https://update.greasyfork.org/scripts/420191/Tokyo%20Otaku%20Mode%20Stock%20Level.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let re = /^https:\/\/otakumode.com\/shop\/([a-f0-9]{24})\//;
    let matches = window.location.href.match(re);
    let productId = matches[1];
    console.log(productId);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let productJson = JSON.parse(this.response);
            //Filter to the valid options
            const validSkus = productJson.skus.filter((sku) => {
                return !sku.is_denied_country;
            });
            if(validSkus.length === 1) {
                let stockLevel = validSkus[0].stock_count;
                if(stockLevel === -1) {
                    stockLevel = 'Unlimited!';
                }
                let stockLevelP = document.createElement('p');
                const t = document.createTextNode(`Stock available: ${stockLevel}`);
                stockLevelP.appendChild(t);
                const heading = document.getElementsByTagName("h1")[0];
                heading.parentNode.insertBefore(stockLevelP, heading.nextSibling);
            } else {
                let stockBlock = document.createElement('div');
                stockBlock.className = "u-mbs";
                validSkus.forEach((sku) => {
                    let stockLevel = sku.stock_count;
                    if(stockLevel === -1) {
                        stockLevel = 'Unlimited!';
                    }
                    let stockLevelP = document.createElement('p');
                    const t = document.createTextNode(`${sku.short_titles.en_us} stock available: ${stockLevel}`);
                    stockLevelP.appendChild(t);
                    stockBlock.appendChild(stockLevelP);
                });
                const heading = document.getElementsByTagName("h1")[0];
                heading.parentNode.insertBefore(stockBlock, heading.nextSibling);
            }
        }
    };
    xhttp.open('GET', `/shop/getProduct?_id=${productId}`, true);
    xhttp.send();
})();