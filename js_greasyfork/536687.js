// ==UserScript==
// @name         Plushie Tracker
// @namespace https://greasyfork.org/en/users/145271-aybecee
// @version      20250606
// @description  Track Habi's plushies. Highlights plushies in shop which hasn't been played with yet.
// @match        https://www.grundos.cafe/viewshop/?shop_id=98
// @match        https://www.grundos.cafe/plushies/?pet_name=Habi
// @match        https://www.grundos.cafe/useobject/*
// @match        https://www.grundos.cafe/inventory/*
// @match        https://www.grundos.cafe/safetydeposit/*
// @match        https://www.grundos.cafe/buyitem/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/536687/Plushie%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/536687/Plushie%20Tracker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var plushieArray = GM_getValue('plushieArrayKey', []);
    var plushieToBuy = GM_getValue('plushieToBuyKey', "");
    var plushieToBuyPrice = GM_getValue('plushieToBuyPriceKey', "");

    if (window.location.href.includes('/plushies/?pet_name=Habi')){
        plushieArray = [];
        $(`td.border-1.center:not(.padding-four)`).each(function(index){
            var itemName = $(this).text().trim();
            itemName = itemName.substring(0, itemName.lastIndexOf(" ("));

            plushieArray.push(itemName)

            if (index + 1 == $(`td.border-1.center:not(.padding-four)`).length){
                GM_setValue('plushieArrayKey', plushieArray)
            }
        })
    }

    function removeItemOnce(arr, value) {
        var index = arr.indexOf(value);
        if (index > -1) {
            arr.splice(index, 1);
        }
        return arr;
    }

    if ( window.location.href.includes("/viewshop/?shop_id=98")){

        $(`.searchhelp`).each(function () {

            var itemName = $(this).attr("id");
            itemName = itemName.substring(0, itemName.length - 6)
           // console.log(itemName)
            if (plushieArray.indexOf(itemName) > -1) {
             //  console.log(`you own ${itemName}`);
            } else {
                $(this).parent().css("background","lightblue")
              //  console.log(`you don't own ${itemName}`);
                GM_setValue('plushieToBuyKey', itemName);


                var stockedPrice =$(this).parent().find(`span:nth-child(3)`).text().trim();
                stockedPrice = stockedPrice.substring(
                    stockedPrice.indexOf("Cost : ") + 7,
                    stockedPrice.lastIndexOf(" NP")
                ).replace(",","");
                GM_setValue('plushieToBuyPriceKey', stockedPrice);
             //   $(this).parent().find(`input.med-image.border-1`).click();

                return false
            }

        })
    }

    if ( window.location.href.includes("/buyitem/")){
        var buyingItem = $('strong:contains(Buying : )').text();
        buyingItem = buyingItem.substring(9)

        console.log(plushieToBuyPrice)

        if (buyingItem == plushieToBuy) {
            $('.flex-column.big-gap.half-width.margin-auto').append(`<div style="font-size:2em;color:skyblue">${Math.ceil(plushieToBuyPrice * .85 + 0.01)} to ${plushieToBuyPrice}</div>`)
        }

    }


    if ( window.location.href.includes("/inventory/")){
        $(`span.inv-item-name`).each(function () {

            var itemName = $(this).text();
            if (itemName.includes("Plushie") ||
                itemName.includes("Doll") ||
                itemName.includes("Toy") ||
                itemName.includes("Fuzzle") ){

                if (plushieArray.indexOf(itemName) > -1) {
                    console.log(`has played with ${itemName}`);
                } else {
                    $(this).parent().parent().css("background","yellow")
                }
            }
        })

    }
    if ( window.location.href.includes("/safetydeposit/")){
        $(`.data.flex-column.small-gap.break strong`).each(function () {

            var itemName = $(this).text();
            if (itemName.includes("Plushie") ||
                itemName.includes("Doll") ||
                itemName.includes("Toy") ||
                itemName.includes("Fuzzle") ){
                if (plushieArray.indexOf(itemName) > -1) {
                    console.log(`has played with ${itemName}`);
                    $(this).parent().css("background","red")
                } else {
                    $(this).parent().css("background","yellow")
                }
            }
        })
    }


})();