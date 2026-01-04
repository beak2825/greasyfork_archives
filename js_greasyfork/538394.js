// ==UserScript==
// @name         Inventory prices
// @namespace https://greasyfork.org/en/users/145271-aybecee
// @version      2025-05-07
// @description  Shows prices from Virtupets in inventory
// @match        https://www.grundos.cafe/inventory/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @require https://update.greasyfork.org/scripts/512407/1463866/GC%20-%20Virtupets%20API%20library.js
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/538394/Inventory%20prices.user.js
// @updateURL https://update.greasyfork.org/scripts/538394/Inventory%20prices.meta.js
// ==/UserScript==

(function () {
    'use strict';
    function getRandomInt(min, max) {
        const minCeiled = Math.ceil(min);
        const maxFloored = Math.floor(max);
        return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
    }



    (async () => {
        var itemStockArray = [];

        $(`span.inv-item-name`).each(function () {
            var itemName = $(this).text();
            itemStockArray.push(itemName)
        })


        try {
            console.log(itemStockArray)
            const response = await bulkShopWizardPrices(itemStockArray);
            const data = await response.json();
            // console.log(data);

            for (var j = 0; j < data.length; j++) {

                var virtu_item_info1 = data[j];

                $(`span.inv-item-name`).each(function () {
                    var itemName = $(this).text();
                    console.log(itemName)
                    if (itemName == virtu_item_info1['name']) {

                        $(this).parent().append(`<span class="x">${virtu_item_info1['price']}</span>`);

                    }
                })
            }


        } catch (error) {
            console.error('Failed to fetch prices:', error);
        }
    })();
    /*
$(`.x`).each(function(){
    var z = Number($(this).text());
  //  console.log(z)
    if (z < 3000) {
        console.log(z)
        $(this).parent().next().next().next().next().next().find(`input.form-control.rm`).val(0)
    }
})
*/


})();