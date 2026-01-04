// ==UserScript==
// @name         Cheapest Kadoatie Prices
// @namespace https://greasyfork.org/en/users/145271-aybecee
// @version      20250605
// @description  Highlights cheapest prices
// @author       AyBeCee
// @match        https://www.grundos.cafe/games/kadoatery/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @require https://update.greasyfork.org/scripts/512407/1463866/GC%20-%20Virtupets%20API%20library.js
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/535280/Cheapest%20Kadoatie%20Prices.user.js
// @updateURL https://update.greasyfork.org/scripts/535280/Cheapest%20Kadoatie%20Prices.meta.js
// ==/UserScript==

(function () {
    'use strict';


    (async () => {
        var itemStockArray = [];

        $(`.kad_box.flex-column`).each(function () {
            if (!$(this).hasClass(`kad_fed`)) {

                var itemName = $(this).find(`strong`).eq(1).text()
                // console.log(itemName)
                itemStockArray.push(itemName)
            }
        })

        try {
            //            console.log(itemStockArray)

            const response = await bulkShopWizardPrices(itemStockArray);
            const data = await response.json();
            // console.log(data);
            var itemPriceArray = [];
            for (var i = 0; i < data.length; i++) {
                // console.log(data[i]);

                var virtu_item_info = data[i];

                $(`.kad_box.flex-column`).each(function (index) {

                    if (!$(this).hasClass(`kad_fed`) && $(this).text().includes(' is very sad.')) {
                        var itemName = $(this).find(`strong`).eq(1).text()

                        if (itemName == virtu_item_info['name']) {

                            $(this).append(`<div id="kad_price" price="${virtu_item_info['price']}">${virtu_item_info['price']}</div>`);
                            itemPriceArray.push(virtu_item_info['price']);

                            if (virtu_item_info['price'] < 4000) {
                               // $(this).css(`border`, `10px solid red`)
                            }

                        }
                    }

                })


                if (i == data.length - 1) {
                    console.log(itemPriceArray)
                    var lowestPrice = Math.min(...itemPriceArray);
                    console.log(lowestPrice)
                    $(`#kad_price[price="${lowestPrice}"]`).parent().css(`background`, `yellow`)
                }
            }


        } catch (error) {
            console.error('Failed to fetch prices:', error);
        }
    })();


})();