// ==UserScript==
// @name         SDB helper
// @namespace https://greasyfork.org/en/users/145271-aybecee
// @version      20250716
// @description  Shows prices from Virtupets in SDB. Quick remove items to sell.
// @match        https://www.grundos.cafe/safetydeposit/*
// @match        https://www.grundos.cafe/market/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @require https://update.greasyfork.org/scripts/512407/1463866/GC%20-%20Virtupets%20API%20library.js
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/535448/SDB%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/535448/SDB%20helper.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var shopItems = GM_getValue('shopItemsKey', []);
    function normalize(str) {
        return str.normalize("NFKD").replace(/[\u200B-\u200D\uFEFF]/g, "");
    }

    function getRandomInt(min, max) {
        const minCeiled = Math.ceil(min);
        const maxFloored = Math.floor(max);
        return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
    }


    function calc_totalremoved() {
        var totalremoved = 0;
        $(`input.form-control.rm`).each(function (index) {
            var amount = Number($(this).val())
            totalremoved += amount;
            if (index + 1 == $(`input.form-control.rm`).length) {
                console.log(totalremoved)
                $(`#totalremoved`).text(totalremoved)
            }
        })
    }

    function removeitems() {
        var max_amount = Number($('#max_amount').val());
        var amount_removed_so_far = 0;
        var specific_instructions = "";

        $('a img.med-image.border-1').each(function () {

                    $(this).parent().parent().next().next().next().next().find('input.form-control.rm').val("");
            var item_name = $(this).parent().parent().prev().find('strong').text().trim();
            var worth1np = $(this).parent().parent().prev().find('strong').attr("worth1np");
            var withdraw_this = $(this).attr("withdraw_this");
            var item_type = $(this).parent().parent().next().next().find('strong').text().trim();

            if (!item_name.includes('Codestone') &&
                !item_name.includes('Dubloon Coin') &&
                !item_name.includes('Frosted Rainbow Cupcake') &&
                !item_name.includes('Spindly Mushrooms') &&
                !item_name.includes('Pile of Sludge') &&
                !item_name.includes('Bottled') && worth1np == "false" && withdraw_this == "true") {
                var item_amount = Number($(this).parent().parent().next().text().trim());

                if (item_type == "Spooky Food" && item_amount > 20){
                    item_amount = item_amount - 20;
                } else if (item_type == "Spooky Food" && item_amount < 20){
                    item_amount = 0;
                }

                if (amount_removed_so_far + item_amount <= max_amount) {
                    $(this).parent().parent().next().next().next().next().find('input.form-control.rm').val(item_amount);
                    amount_removed_so_far += item_amount;
                }
            }
        })
    }
    function add_shopstock(shopItems) {
        $(`.data.flex-column.small-gap.break strong`).each(function (index) {
            var itemName = $(this).text();
            shopItems.push(itemName);
            if (index + 1 == $(`.data.flex-column.small-gap.break strong`).length) {
                console.log(shopItems)
                GM_setValue('shopItemsKey', shopItems);
            }
        })
    }
    if ($(`body:contains(you sell an item, the Neopoints will go into your)`).length == 1) {
        $(`.threequarters-width.mobile-full.margin-auto`).after(`<br><div id="reset_shopstock" class="fakebutton">Reset shop stock cookie</div>`)

        add_shopstock(shopItems)
        $(`#reset_shopstock`).click(function () {
            shopItems = [];
            add_shopstock(shopItems)
        })
    } else if (window.location.href.includes("https://www.grundos.cafe/safetydeposit/")) {

        (async () => {
            var itemStockArray = [];

            $(`.data.flex-column.small-gap.break strong`).each(function () {
                var itemName = normalize($(this).text().trim());
                itemStockArray.push(itemName)
            })

            $(`body`).append(`<style>
.footer { position: fixed; bottom: 0; left: 736px; width: 150px;}
#sbd_float{position: fixed; bottom: 114px; left: 736px; }
#hide_cheap{width: 150px; background: black; color: white; padding: 10px; cursor: pointer;}
input.form-control.third-width.full-width-mobile {width: 100px; height: 100px;}
</style>
<div id="sbd_float">
<div id="hide_cheap">Hide <1k items</div>
<br>
<input type="number" id="max_amount"><br>
<br>
<div id="remove_items" class="fakebutton">remove items</div>
<br>
<div id="remove_shopitems" class="fakebutton">remove shop items</div>
<br>
<div id="totalremoved" style="background:pink;padding:10px;"></div>
</div>`)

            var inventory_amount = $('.aio-inv-item').length;
            $('.aio-quantity-circle').each(function (index) {
                var quantity = Number($(this).text()) - 1;
                inventory_amount += quantity

                if (index == $('.aio-quantity-circle').length - 1) {
                    $('#max_amount').val(75 - inventory_amount)
                }
            })

            $('#remove_items').click(function () {
                $('a img.med-image.border-1').attr(`withdraw_this`, true);
                removeitems()
            })
            $('#remove_shopitems').click(function () {
                $('a img.med-image.border-1').each(function (index) {
                    $(this).attr(`withdraw_this`, false);
                    var item_type = $(this).parent().parent().next().next().find('strong').text().trim();
                    var item_name = $(this).parent().parent().prev().find('strong').text().trim();
                    if (shopItems.indexOf(item_name) >= 0) {
                        $(this).attr(`withdraw_this`, true);
                    }
                    if (index + 1 == $(`.data.flex-column.small-gap.break strong`).length) {
                        removeitems()
                    }
                })
            })



            try {
                //  console.log(itemStockArray)
                const response = await bulkShopWizardPrices(itemStockArray);
                const data = await response.json();
                // console.log(data);

                for (var i = 0; i < data.length; i++) {
                    //  console.log(data[i]);

                    var virtu_item_info = data[i];

                    $(`.data.flex-column.small-gap.break strong`).each(function () {
                        var itemName = normalize($(this).text().trim());

                        if (itemName == virtu_item_info['name']) {
                            $(this).parent().append(`<span class="x">${virtu_item_info['price']}</span>`);

                            if (virtu_item_info['price'] < 1000) {
                                $(this).attr(`hidethis`, true);
                            }
                            if (virtu_item_info['price'] < 1000 || virtu_item_info['price'] == null) {
                                $(this).attr(`worth1np`, true);
                            } else {
                                $(this).attr(`worth1np`, false);
                            }
                        }
                    })

                    if (i + 1 == data.length) {
                        $(`#hide_cheap`).click(function () {
                            $(`[hidethis="true"]`).each(function () {

                                $(this).parent().prev().hide();
                                $(this).parent().hide();
                                $(this).parent().next().hide();
                                $(this).parent().next().next().hide();
                                $(this).parent().next().next().next().hide();
                                $(this).parent().next().next().next().next().hide();
                                $(this).parent().next().next().next().next().next().hide();
                            })

                        })

                        $(`input.form-control.rm`).change(function () {
                            calc_totalremoved()
                        })

                    }
                }


            } catch (error) {
                console.error('Failed to fetch prices:', error);
            }

        })();
    }
})();