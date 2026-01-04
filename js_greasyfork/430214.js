// ==UserScript==
// @name         Market Flip Helper
// @namespace    http://www.torn.com
// @version      0.21
// @description  Assist in market flipping.
// @author       lonerider543
// @match        https://www.torn.com/imarket.php
// @icon         https://www.torn.com/favicon.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/430214/Market%20Flip%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/430214/Market%20Flip%20Helper.meta.js
// ==/UserScript==

const mutTarget = $("div.content-wrapper").get(0);
const mutConfig = {subtree: true, childList: true, attributes: true}

let itemPrices = {items:{}};

try{
    itemPrices = GM_getValue("l_mfh_itemPrices");
} catch {
    itemPrices = {items:{}}
    GM_setValue("l_mfh_itemPrices", itemPrices);
}

if (itemPrices != undefined) console.log(itemPrices);

const callback = function(mutationsList, observer) {
    var containsItemList = false;
    var itemsList = null;

    var containsItemInfo = false;
    var itemInfoTarget = null;

    for (var mutation of mutationsList) {
        if ($(mutation.target)[0].className == "m-items-list" && mutation.addedNodes.length > 4) {
            containsItemList = true;
            itemsList = mutation.target;
            break;
        }

        else if ($(mutation.target)[0].className == "show-item-info" && mutation.addedNodes.length == 8) {
            containsItemInfo = true;
            itemInfoTarget = mutation.target;
            console.log(itemInfoTarget);
            break;
        }

        else if ($(mutation.target)[0].className == "show-item-info" && mutation.type == "attributes" && mutationsList.length == 26) {
            containsItemInfo = true;
            itemInfoTarget = mutation.target;
            console.log(itemInfoTarget);
            break;
        }
    }

    if (containsItemList && mutationsList.length > 1) main(itemsList);
    if (containsItemInfo) addTextBox(itemInfoTarget);
}

const main = function(itemsList) {
    $(itemsList).children().each(function() {
        let itemId = $(this).attr("data-item");

        if (itemId != undefined) {
            let priceString = $(this).find("span.minprice")[0].innerText;
            let price = parseInt(priceString.slice(1, priceString.search(" ")).replace(/\,/g, ''));

            if (itemId in itemPrices) {
                let targetPrice = parseInt(itemPrices[itemId]);
                let color = (price >= targetPrice) ? "lightcoral" : (price >= targetPrice*0.9) ? "lightgoldenrodyellow" : "lightgreen";
                $(this).find("div.title").css("background-color", color);
            }
        }
    });
}

const addTextBox = function(target) {
    $(target).find("input.targetPrice").remove();
    console.log($(target));
    $(target).find("div.info-content").prepend('<input class="targetPrice" type="text">');
    let itemId = $(target).parent().children('li[class*="act"]').attr("data-item");

    if (itemId in itemPrices) {
        let targetPrice = itemPrices[itemId];
        $("input.targetPrice").val(targetPrice);
    }

    $("input.targetPrice").change(function() {
        let newValue = $(this)[0].value;
        itemPrices[itemId] = newValue;
        saveItemPrices();
        main($(target).parent()[0]);
    }) 
}

const saveItemPrices = function() {
    GM_setValue("l_mfh_itemPrices", itemPrices);
}

const observer = new MutationObserver(callback);
observer.observe(mutTarget, mutConfig);