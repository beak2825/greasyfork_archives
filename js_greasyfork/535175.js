// ==UserScript==
// @name         Restock Virtupets Prices + click null
// @namespace https://greasyfork.org/en/users/145271-aybecee
// @version      20250707
// @description  Adds retail value from virtupets on GC shops. Autoclicks 'null' prices
// @author       AyBeCee
// @match        https://www.grundos.cafe/viewshop/?shop_id=*
// @match        https://www.grundos.cafe/buyitem/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @require https://update.greasyfork.org/scripts/512407/1463866/GC%20-%20Virtupets%20API%20library.js
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/535175/Restock%20Virtupets%20Prices%20%2B%20click%20null.user.js
// @updateURL https://update.greasyfork.org/scripts/535175/Restock%20Virtupets%20Prices%20%2B%20click%20null.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function normalize(str) {
        return str.normalize("NFKD").replace(/[\u200B-\u200D\uFEFF]/g, "");
    }

    function getRandomInt(min, max) {
        const minCeiled = Math.ceil(min);
        const maxFloored = Math.floor(max);
        return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
    }

    function smartNumber(number) {
        var numberString = number.toString();
        var firstTwoDigits = numberString.substring(0, 2);
        var newNumber = firstTwoDigits + firstTwoDigits + firstTwoDigits + firstTwoDigits + firstTwoDigits;
        var correctDigits = Number(newNumber.substring(0, numberString.length));
        var finalNumber;
        if (correctDigits < number) {
            var twoDigitsMore = (Number(firstTwoDigits) + 1).toString();
            console.log(twoDigitsMore)
            newNumber = twoDigitsMore + twoDigitsMore + twoDigitsMore + twoDigitsMore + twoDigitsMore;
            correctDigits = Number(newNumber.substring(0, numberString.length));
            finalNumber = correctDigits;

        } else {
            finalNumber = correctDigits;
        }
        return finalNumber
    }

    var plushieToBuy = GM_getValue('plushieToBuyKey', "");
    var plushieToBuyPrice = GM_getValue('plushieToBuyPriceKey', "");
    var manual_price = GM_getValue('manual_priceKey', 0);
    var refresh_til_gone = GM_getValue('refresh_til_goneKey', "");
    var auto_buy_count = GM_getValue('auto_buy_countKey', 0);
    function click_highest_profit() {

        if (window.location.href.includes(`?shop_id=30`)
            || window.location.href.includes(`?shop_id=15`)
            || window.location.href.includes(`?shop_id=14`) ) {
            var profit_array = [];
            if (auto_buy_count < 100){

                $(`.profit`).each(function (index) {
                    var profit = Number($(this).text());
                    profit_array.push(profit)
                    if (index + 1 == $(`.profit`).length) {
                        var highest_prof = Math.max(...profit_array);
                        console.log(highest_prof)

                        if (highest_prof > 1000 ) {
                            $(`.profit:contains(${highest_prof}):first`).parent().parent().css({
                                "background-image": "linear-gradient(#12c2e9,#c471ed,#f64f59)"
                            })
                            var stock_price = Number($(`.profit:contains(${highest_prof}):first`).parent().parent().find(`.stock_price`).text());
                            $(`#manual`).html(`Manual price: <span style="color:white;background:black">${stock_price}</span>`)

                            var wait_delay;
                            if (stock_price == manual_price){ // shorter delay if same item
                                wait_delay = getRandomInt(3000, 4000);
                            } else { // longer delay if different item
                                wait_delay = getRandomInt(5000, 7000);
                            }
                            $(`#manual`).append(`
                        <div id="countdown_bar" style="color:white;background:linear-gradient(to right, #12c2e9,#c471ed,#f64f59);margin:auto;">
                        ${auto_buy_count}/100, ${wait_delay}ms
                        </div>`)
                            GM_setValue('manual_priceKey', stock_price);

                            var buyingURL = $(`.profit:contains(${highest_prof}):first`).parent().parent().find(`form`).attr("action");
                            $(`.profit:contains(${highest_prof}):first`).parent().parent().css("opacity",.5)
                            auto_buy_count++
                            GM_setValue('auto_buy_countKey', auto_buy_count);

                            $(`#countdown_bar`).animate({width: "0"},wait_delay)

                            setTimeout(() => {
                                $(`[action="${buyingURL}"] [type="image"]`).click();
                            }, wait_delay);
                        }
                    }
                })
            } else {
                $(`#manual`).append(`<div id="reset_counter" class="fakebutton">reset counter</div>`)
                $(`#reset_counter`).click(function(){
                            GM_setValue('auto_buy_countKey', 0);
                    window.location.href = window.location.href;
                })
            }
        }

    }


    if (window.location.href.indexOf(`viewshop/?shop_id`) > -1) {


        (async () => {

            $(`input.med-image.border-1`).attr("onclick", "")

            $(`.margin-1`).append(`<div id="manual">Manual price: ${manual_price}</div>`)
            var itemStockArray = [];

            $(`.item-info strong`).each(function () {
                var itemName = normalize($(this).text().trim());
                itemStockArray.push(itemName)

            })

            try {
                //  console.log(itemStockArray)
                const response = await bulkShopWizardPrices(itemStockArray);
                const data = await response.json();
                console.log(data);
                var continue1 = true;
                for (var i = 0; i < data.length; i++) {
                    //  console.log(data[i]);

                    if (continue1) {
                        var virtu_item_info = data[i];

                        $(`.item-info strong`).each(function () {
                            if (continue1) {
                                var itemName = normalize($(this).text().trim());

                                if (itemName == virtu_item_info['name']) {

                                    var buyingURL = $(this).parent().parent().find(`form`).attr("action");
                                    $(`[action="${buyingURL}"] [type="image"]`).attr("onclick", "");
                                    var stockedPrice = $(this).parent().find(`span:nth-child(3)`).text().trim();
                                    stockedPrice = stockedPrice.substring(
                                        stockedPrice.indexOf("Cost : ") + 7,
                                        stockedPrice.lastIndexOf(" NP")
                                    ).replace(",", "");

                                    if (virtu_item_info['price'] == null
                                        && virtu_item_info['name'] !== "Blue Chia Plushie"
                                        && virtu_item_info['name'] !== "Blue Grundo Plushie"
                                        && virtu_item_info['name'] !== "Silliam"
                                        && virtu_item_info['name'] !== "Shadow Gnorbu Plushie") {
                                        continue1 = false;
                                        $(this).parent().append(`<span style="color:pink">${Math.ceil(stockedPrice * 0.85 + 0.01)}</span>`);
                                        $(`[action="${buyingURL}"] [type="image"]`).click();
                                        $(this).parent().css("background", "orange")
                                        GM_setValue('plushieToBuyKey', itemName);
                                        GM_setValue('plushieToBuyPriceKey', stockedPrice);

                                        return false
                                    }

                                    $(this).parent().append(`<span style="color:pink" class="stock_price">${Math.ceil(stockedPrice * 0.85 + 0.01)}</span>`);

                                    if (virtu_item_info['price'] - stockedPrice * 0.85 > 0) {
                                        $(this).parent().append(`Profit: <span style="color:blue" class="profit">${virtu_item_info['price'] - Math.ceil(stockedPrice * 0.85)}</span>`);
                                    } else {
                                        $(this).parent().append(`Profit: <span style="color:red">${virtu_item_info['price'] - Math.ceil(stockedPrice * 0.85)}</span>`);
                                    }

                                    if (virtu_item_info['price'] - stockedPrice * 0.85 > 9000) {
                                        $(this).parent().parent().css(`border`, `10px solid red`)
                                    }
                                }
                            }
                        })
                    }


                    if (i + 1 == data.length) {
                        $(`[style="color:pink"]:contains(${manual_price})`).css({ "color": "white", "background": "pink" });
                        $(`[style="color:pink"]`).click(function () {
                            $(this).css({ "color": "white", "background": "black" });
                            var lowprice = Number($(this).text())
                            $(`#manual`).html(`Manual price: <span style="color:white;background:black">${lowprice}</span>`)
                            console.log(lowprice)
                            GM_setValue('manual_priceKey', lowprice);
                        })

                        click_highest_profit()
                    }
                }

            } catch (error) {
                console.error('Failed to fetch prices:', error);
            }
        })();
    }

    if (window.location.href.includes("/buyitem/")) {
        var buyingItem = $('strong:contains(Buying : )').text();
        buyingItem = buyingItem.substring(9)
        console.log(plushieToBuyPrice);
        var lowestPrice = Math.ceil(plushieToBuyPrice * .85 + 0.01);
        var wait_delay;
        if (buyingItem == plushieToBuy) {
            $('.flex-column.big-gap.half-width.margin-auto').append(`<div id="got_em" style="font-size:2em;color:skyblue">${lowestPrice} to ${plushieToBuyPrice}</div>
            <div id="twigsNumPad">${smartNumber(lowestPrice)}</div>`)
    } else {

        wait_delay = getRandomInt(2000, 4000);
        setTimeout(() => {
            $(`.twigsNumpadBtn:nth-child(2)`).click()
        }, wait_delay);
        $('.flex-column.big-gap.half-width.margin-auto').append(`<div id="twigsNumPad">${manual_price}</div>`)
        $('.flex-column.big-gap.half-width.margin-auto').parent().parent().append(`
            <div id="countdown_bar" style="color:white;background:teal;width:100%;margin:auto;text-align:center">
            ${wait_delay}ms
            </div>`)
            $(`#countdown_bar`).animate({width: "0"},wait_delay)
        }

    if ($(`body:contains(has been added)`).length == 1 ||
       $(`.bigfont:contains("SOLD OUT")`).length == 1) {
        wait_delay = getRandomInt(500, 1500);
        var $button = $('button.form-control');
        $button.eq(0).hide();
        setTimeout(() => {
            if ($button.length > 0) {
                $button.eq(0).click();
            }
        }, wait_delay);
        $(`p.bigfont`).after(`
            <div id="countdown_bar" style="color:white;background:teal;width:100%;margin:auto;text-align:center">
            ${wait_delay}ms
            </div>`)
            $(`#countdown_bar`).animate({width: "0"},wait_delay)
        }
}

})();