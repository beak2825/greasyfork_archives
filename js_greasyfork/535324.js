// ==UserScript==
// @name         Employment
// @namespace    https://greasyfork.org/en/users/145271-aybecee
// @version      20250710
// @description  Adds estimated profit to Employment
// @author       AyBeCee
// @match        https://www.grundos.cafe/faerieland/employ/jobs/*
// @match        https://www.grundos.cafe/market/wizard/?query=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @require https://update.greasyfork.org/scripts/512407/1463866/GC%20-%20Virtupets%20API%20library.js
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/535324/Employment.user.js
// @updateURL https://update.greasyfork.org/scripts/535324/Employment.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var requestedItems = GM_getValue('requestedItemsKey', []);
    // console.log(requestedItems)
    var requestedItemsWithPrice = GM_getValue('requestedItemsWithPriceKey', {});


    if (window.location.href.indexOf(`faerieland/employ/jobs/`) > -1) {

        (async () => {
            requestedItems = [];

            $(`[align="center"][cellpadding="2"] tr`).hide();
            $(`.center:eq(1)`).after(`<div class="relu_loader" style="margin:auto"></div>`);

            $(`.fea_thejob`).each(function(index){
                var itemName = $(this).text().replace(/[\n\r\t]/gm, "");;
                itemName = itemName.substring(
                    itemName.indexOf(" of: ") + 5,
                    itemName.lastIndexOf("Time: ")
                );
                itemName = $.trim(itemName);
                requestedItems.push(itemName);

                var howMany = $(this).text();
                howMany = Number(howMany.substring(
                    howMany.indexOf("Find ") + 5,
                    howMany.lastIndexOf(" of: ")
                ));

                var baseReward = $(this).text();
                baseReward = baseReward.substring(
                    baseReward.indexOf("Base Reward: ") + 13,
                    baseReward.lastIndexOf(" NP")
                );
                baseReward = Number(baseReward.replace(",",""))

                $(this).append(`<br><b>Single price:</b> <span id="single_price" howMany="${howMany}">${baseReward / howMany}</span>`)

                requestedItemsWithPrice[itemName] = {"Price":baseReward / howMany}

                if ($(`.fea_thejob`).length == index + 1){
                    GM_setValue('requestedItemsKey', requestedItems);
                    GM_setValue('requestedItemsWithPriceKey', requestedItemsWithPrice);
                }
            });

            try {
                const response = await bulkShopWizardPrices(requestedItems);
                const data = await response.json();
                // console.log(data);
                var profit_array = [];
                $(`.relu_loader`).hide();
                for (var i = 0; i < data.length; i++) {
                    // console.log(data[i]);

                    var virtu_item_info = data[i];


                    $(`.fea_thejob`).each(function(index){
                        var itemName = $.trim($(this).text().replace(/[\n\r\t]/gm, ""));
                        itemName = $.trim(itemName.substring(
                            itemName.indexOf(" of: ") + 5,
                            itemName.lastIndexOf("Time: ")
                        ));

                        if ( itemName == virtu_item_info['name'] ) {

                            var single_price = Number($(this).find(`#single_price`).text());
                            var howMany = Number($(this).find(`#single_price`).attr("howMany"));
                            // console.log(single_price)

                            $(this).append(`<br><b>ShopWiz price:</b> ${virtu_item_info['price']}`)

                            if (window.location.href.includes('&type=super')){
                                var jobColour = $(this).find(`b:contains(* This job requires a) span`).attr("class");
                                var realprofit;
                                if (jobColour == "job_tier_6") {
                                    realprofit = single_price * howMany - virtu_item_info['price'] * howMany - 100000;
                                    $(this).append(`<br><b>Profit:</b> ${realprofit}`);
                                    if (realprofit > 0) {
                                        $(this).css("border", "10px solid red")
                                    }
                                } else if (jobColour == "job_tier_4") {
                                    realprofit = single_price * howMany - virtu_item_info['price'] * howMany - 25434 ;
                                    $(this).append(`<br><b>Profit:</b> ${realprofit}`);
                                    if (realprofit > 0) {
                                        $(this).css("border", "10px solid red")
                                    }
                                } else if (jobColour == "job_tier_5") {
                                    realprofit = single_price * howMany - virtu_item_info['price'] * howMany - 74499;
                                    $(this).append(`<br><b>Profit:</b> ${realprofit}`);
                                    if (realprofit > 0) {
                                        $(this).css("border", "10px solid red")
                                    }
                                } else if (jobColour == "job_tier_2") {
                                    realprofit = single_price * howMany - virtu_item_info['price'] * howMany - 4985;
                                    $(this).append(`<br><b>Profit:</b> ${realprofit}`);
                                    if (realprofit > 0) {
                                        $(this).css("border", "10px solid red")
                                    }
                                } else if (jobColour == "job_tier_10_text") {
                                    realprofit = single_price * howMany - virtu_item_info['price'] * howMany - 600000;
                                    $(this).append(`<br><b>Profit:</b> ${realprofit}`);
                                    if (realprofit > 0) {
                                        $(this).css("border", "10px solid red")
                                    }
                                } else if (jobColour == "job_tier_7") {
                                    realprofit = single_price * howMany - virtu_item_info['price'] * howMany - 200000;
                                    $(this).append(`<br><b>Profit:</b> ${realprofit}`);
                                    if (realprofit > 0) {
                                        $(this).css("border", "10px solid red")
                                    }
                                } else if (jobColour == "job_tier_9_text") {
                                    realprofit = single_price * howMany - virtu_item_info['price'] * howMany - 400000;
                                    $(this).append(`<br><b>Profit:</b> ${realprofit}`);
                                    if (realprofit > 0) {
                                        $(this).css("border", "10px solid red")
                                    }
                                } else if (jobColour == "job_tier_8_text") {
                                    realprofit = single_price * howMany - virtu_item_info['price'] * howMany - 275000;
                                    $(this).append(`<br><b>Profit:</b> ${realprofit}`);
                                    if (realprofit > 0) {
                                        $(this).css("border", "10px solid red")
                                    }
                                } else if (jobColour == "job_tier_11_text") {
                                    realprofit = single_price * howMany - virtu_item_info['price'] * howMany - 735000;
                                    $(this).append(`<br><b>Profit:</b> ${realprofit}`);
                                    if (realprofit > 0) {
                                        $(this).css("border", "10px solid red")
                                    }
                                } else if (jobColour == "job_tier_3") {
                                    realprofit = single_price * howMany - virtu_item_info['price'] * howMany - 7394;
                                    $(this).append(`<br><b>Profit:</b> ${realprofit}`);
                                    if (realprofit > 0) {
                                        $(this).css("border", "10px solid red")
                                    }
                                } else if (jobColour == "job_tier_1") {
                                    realprofit = single_price * howMany - virtu_item_info['price'] * howMany - 2225;
                                    $(this).append(`<br><b>Profit:</b> ${realprofit}`);
                                    if (realprofit > 0) {
                                        $(this).css("border", "10px solid red")
                                    }
                                }
                            } else {

                                $(this).append(`
                             <br><b>Profit:</b> ${single_price * howMany - virtu_item_info['price'] * howMany}`)
                                if ( single_price * howMany - virtu_item_info['price'] * howMany > 0 ) {
                                    console.log(single_price * howMany - virtu_item_info['price'] * howMany)
                                    profit_array.push(single_price * howMany - virtu_item_info['price'] * howMany);

                                    $(this).parent().show();
                                    $(this).attr("profit",single_price * howMany - virtu_item_info['price'] * howMany);
                                    $(this).parent().prev().show();
                                    $(this).parent().prev().prev().show();
                                }
                            }

                        }

                        if (index + 1 == $(`.fea_thejob`).length && i +1 == data.length){
                            console.log(profit_array)
                            $(`[profit="${Math.max(...profit_array)}"]`).css("border","10px solid red")

                        }

                    })
                }


            } catch (error) {
                console.error('Failed to fetch prices:', error);
            }
        })();




    }

})();