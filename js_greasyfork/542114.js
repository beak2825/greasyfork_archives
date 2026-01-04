// ==UserScript==
// @name         Auto Quester
// @version      2025-07-13
// @description  Auto Quester but needs with other scripts too
// @namespace https://greasyfork.org/en/users/145271-aybecee
// @match        https://www.grundos.cafe/safetydeposit/?page=1*&min_rarity=0&max_rarity=999
// @match        https://www.grundos.cafe/safetydeposit/?page=1&query=*&exact=1
// @match        https://www.grundos.cafe/market/wizard/?query=*&submit
// @match        https://www.grundos.cafe/market/browseshop/?owner=*&item_id=*
// @match        https://www.grundos.cafe/halloween/esophagor/*
// @match        https://www.grundos.cafe/halloween/witchtower/*
// @match        https://www.grundos.cafe/winter/snowfaerie/*
// @match        https://www.grundos.cafe/island/kitchen/*
// @match        https://www.grundos.cafe/halloween/braintree/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @require https://update.greasyfork.org/scripts/512407/1463866/GC%20-%20Virtupets%20API%20library.js
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/542114/Auto%20Quester.user.js
// @updateURL https://update.greasyfork.org/scripts/542114/Auto%20Quester.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var wait_delay = getRandomInt(1000, 2000);

    var quest_items = GM_getValue('quest_itemsKey', {});
    var turn_in_quest = GM_getValue('turn_in_questKey', "");

    $(`#page_content`).prepend(`<div id="quest_logger" style="padding: 2em; box-shadow: 0 0 100px rgba(0,0,0,.5); border-radius: 5px; margin: 0 2em"><b style="display:block;text-align:center;color:white;background:black">Auto quester running</b></div>`)

    if (window.location.href.includes(`https://www.grundos.cafe/halloween/braintree/accept/`)){
        insert_wait_bar(wait_delay)
        $(`#quest_logger`).append(`Go back to esophagor`)
        setTimeout(function () {
            window.location.href == "https://www.grundos.cafe/halloween/esophagor/"
        }, wait_delay);
    }
    if (
        window.location.href.includes("/halloween/esophagor/") ||
        window.location.href.includes("/halloween/witchtower/") ||
        window.location.href.includes("/winter/snowfaerie/") ||
        window.location.href.includes("/island/kitchen/")) {
        (async () => {

            var itemStockArray = [];
            var item_element;

            if ($(`.itemList`).length == 1) {
                item_element = `.centered-item`;
            } else {
                item_element = `.quest-item`;
            }

            $(item_element).each(function () {
                var itemName = $(this).find(`strong`).text();
                itemStockArray.push(itemName)
            })


            try {
                //  console.log(itemStockArray)
                const response = await bulkShopWizardPrices(itemStockArray);
                const data = await response.json();
                //     console.log(data);

                var total_price = 0;

                for (var i = 0; i < data.length; i++) {
                    total_price += data[i]["price"];

                    if (i + 1 == data.length) {

                        if (window.location.href.includes("/halloween/esophagor/") && total_price < 10250){
                            if ($(`#aio-quests-list [title="Brain Tree Quest"]`).length == 1 && $(`#aio-quests-list [href="/halloween/braintree/"]`).parent().find(`span.aio-subtext.aio-section`).length == 0){
                                $(`#quest_logger`).append(`Opening Brain Tree Quest`)
                                window.location.href = "https://www.grundos.cafe/halloween/braintree/"
                            } else {
                                auto_quester(`.centered-item`)
                            }
                        } else if ( (window.location.href.includes("/halloween/witchtower/") && total_price < 10250) ||
                                   (window.location.href.includes("/winter/snowfaerie/") && total_price < 18500) ||
                                   (window.location.href.includes("/island/kitchen/") && total_price < 15075)) {
                            if ($(`.itemList`).length == 1) {
                                auto_quester(`.centered-item`)
                            } else {
                                auto_quester(`.quest-item`)
                            }
                        } else {
                            $(`#quest_logger`).append(`Too expensive. Not doing quest.`)
                            GM_setValue('quest_itemsKey', {})
                        }
                    }
                }





            } catch (error) {
                console.error('Failed to fetch prices:', error);
            }
        })();
    }

    function getRandomInt(min, max) {
        const minCeiled = Math.ceil(min);
        const maxFloored = Math.floor(max);
        return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
    }
    function insert_wait_bar(wait_delay) {
        $(`#page_content`).prepend(`
            <div id="countdown_bar" style="color:white;background:url(https://grundoscafe.b-cdn.net/misc/themes/pink/top.png) top;width:100%;margin:auto;text-align:center">
            ${wait_delay}ms
            </div>`)
        $(`#countdown_bar`).animate({ width: "0" }, wait_delay)
    }
    function auto_quester(item_element) {
        turn_in_quest = window.location.href.replace("accept/", "");

        GM_setValue('turn_in_questKey', turn_in_quest)
        quest_items = {};
        $(item_element).each(function (index) {
            var itemName = $(this).find(`strong`).text();
            if ($(this).find(`img.no-fade.search-helper-in-inv`).length == 1) {
                quest_items[itemName] = {
                    "Status": "inventory"
                };
            } else if ($(this).find(`img.no-fade.search-helper-sdb-exists`).length == 1) {
                var sdb_url = $(this).find(`img.no-fade.search-helper-sdb-exists`).parent().attr("href");
                quest_items[itemName] = {
                    "Status": "SDB",
                    "url": sdb_url
                };
            } else {
                var shopwiz_url = $(this).find(`a[alt="Shop Wizard Search"]`).attr("href");
                quest_items[itemName] = {
                    "Status": "shopwiz",
                    "url": shopwiz_url
                };
            }

            if (index + 1 == $(item_element).length) {
                GM_setValue('quest_itemsKey', quest_items)
                console.log(quest_items)

                for (var key in quest_items) {
                    if (quest_items[key]["Status"] == "SDB" || quest_items[key]["Status"] == "shopwiz") {
                        insert_wait_bar(wait_delay)
                        $(`#quest_logger`).append(`Obtaining <b>${key}</b> from <b>${quest_items[key]["url"]}</b>`)
                        setTimeout(function () {
                            window.location.href = quest_items[key]["url"]
                        }, wait_delay);
                        break

                    } else if (key == Object.keys(quest_items)[Object.keys(quest_items).length - 1]) { // last item in object
                        insert_wait_bar(wait_delay)
                        $(`#quest_logger`).append(`Submitting quest.`)
                        setTimeout(function () {
                            if (window.location.href.includes("https://www.grundos.cafe/island/kitchen/") ){
                                if ( $(`#user-info-pet`).text() == "Arick"){
                                    $(`[value="I have the ingredients!"]`).click()
                                } else {
                                    window.location.href = "/setactivepet/?pet_name=Arick&redirect=/island/kitchen/";
                                }
                            } else {
                                $(`[value="I have your ingredients!"]`).click()
                                $(`[value="I have the ingredients!"]`).click()
                                $(`[value="I have your food!"]`).click()
                            }
                        }, wait_delay);
                    }
                }
            }
        })

        $(`#auto_buy`).click(function () {
        })

    }

    function obtain_next_item() {
        for (var key in quest_items) {
            if (quest_items[key]["Status"] == "SDB" || quest_items[key]["Status"] == "shopwiz") {
                insert_wait_bar(wait_delay)

                $(`#quest_logger`).append(`Obtaining <b>${key}</b>`)
                setTimeout(function (itemKey) {
                    window.location.href = quest_items[itemKey]["url"]
                }(key), wait_delay);
                break
            } else if (key == Object.keys(quest_items)[Object.keys(quest_items).length - 1]) { // last item in object
                $(`#banner_img`).after(`<div style="font-size:20px;">turn_in_quest</div>`)
                console.log('turn in the quest')
                insert_wait_bar(wait_delay)
                setTimeout(function () {
                    window.location.href = turn_in_quest;
                }, wait_delay);
            }
        }
    }

    if ( quest_items !== {}){
        if (window.location.href.includes("&min_rarity=0&max_rarity=999#sdb-item-")) {
            var withdrawn_item = $(`input.form-control.twothirds-width.button-matched-input-size`).val();
            $(`#quest_logger`).append(`Withdrew ${withdrawn_item} from SBD.`)
            quest_items[withdrawn_item]["Status"] = "inventory";
            GM_setValue('quest_itemsKey', quest_items)
            obtain_next_item()
        }
        if (window.location.href.includes("https://www.grundos.cafe/market/wizard/?query=")) {
            var buying_item = $(`strong:contains(Searching for ... )`).text();
            buying_item = buying_item.substring(buying_item.indexOf("... ") + 4);

            if (quest_items[buying_item]["Status"] == "shopwiz") {
                insert_wait_bar(wait_delay)
                $(`#quest_logger`).append(`Buying ${buying_item} from Shopwiz.`)
                setTimeout(function () {
                    window.location.href = $(`.market_grid.sw_results.margin-1 a:first`).attr("href");
                }, wait_delay);
            } else {
                $(`#quest_logger`).remove()
                GM_setValue('quest_itemsKey', {})
            }


        }
        if (window.location.href.includes("https://www.grundos.cafe/market/browseshop/?owner=")) {
            if (window.location.href.includes("&page=1")) {
                $(`#quest_logger`).append(`Getting next quest item/submitting quest.`)
                obtain_next_item()
            } else {
                var bought_item = $(`#searchedItem strong`).text();
                $(`#quest_logger`).append(`Buying ${bought_item}`)
                quest_items[bought_item]["Status"] = "inventory";
                GM_setValue('quest_itemsKey', quest_items);
            }
        }
    }

    if (window.location.href.includes("/complete/") && $(`strong.red:contains(NO)`).length == 0) {
        $(`#quest_logger`).append(`Clearing quest items.`)
        GM_setValue('quest_itemsKey', {})
    }

})();