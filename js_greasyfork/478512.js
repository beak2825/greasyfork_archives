// ==UserScript==
// @name         Suruga-ya Original Price Revealer
// @namespace    https://www.ly2314.cc/
// @match        https://www.suruga-ya.com/*
// @version      0.4
// @description  Shows the original price of the product on search pages
// @author       ly2314
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.suruga-ya.com
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478512/Suruga-ya%20Original%20Price%20Revealer.user.js
// @updateURL https://update.greasyfork.org/scripts/478512/Suruga-ya%20Original%20Price%20Revealer.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

$(document).ready(function()
{
    printItemsOriginalPrice();
});

function getItemOriginalPrice(item) {
    'use strict';
    var itemId = item.firstElementChild.firstElementChild.firstElementChild.getAttribute("data-product-id");
    if (!itemId) {
        itemId = item.firstElementChild.firstElementChild.getAttribute("data-product-id");
    }
    var productUrl = "https://www.suruga-ya.com/zh-hant/product/" + itemId;
    $.get(productUrl, function(response) {
        var originalPriceStr = "";
        var originalPrice = "";
        var newPrice = "";
        var secHndPrice = "";
        var txtColor = "black";
        let origPriceDiv = document.createElement("div");
        try {
            originalPriceStr = $(response).find('div.price-suggest')[0].innerHTML;
            originalPrice = originalPriceStr.replace("JPY", "");
            originalPrice = originalPrice.replace(",", "");
        } catch (err) {
            originalPriceStr = "N/A";
        }
        if (originalPriceStr != "N/A") {
            try {
                newPrice = $(response).find('input[data-name|="全新品"]')[0].getAttribute("data-price");
            } catch (err) {
                newPrice = "N/A";
            }
            if (newPrice == "N/A") {
                try {
                    newPrice = $(response).find('input[data-name|="預約"]')[0].getAttribute("data-price");
                } catch (err) {
                    newPrice = "N/A";
                }
            }
            try {
                secHndPrice = $(response).find('input[data-name|="二手品"]')[0].getAttribute("data-price");
            } catch (err) {
                secHndPrice = "N/A";
            }
            if (newPrice != "N/A" && secHndPrice != "N/A") {
                if (Number(newPrice) > Number(originalPrice) &&
                    Number(secHndPrice) > Number(originalPrice)) {
                    txtColor = "red";
                } else if (Number(newPrice) > Number(originalPrice)) {
                    txtColor = "orange";
                } else {
                    txtColor = "green";
                }
            } else if (newPrice != "N/A") {
                if (Number(newPrice) > Number(originalPrice)) {
                    txtColor = "red";
                } else {
                    txtColor = "green";
                }
            } else if (secHndPrice != "N/A") {
                if (Number(secHndPrice) > Number(originalPrice)) {
                    txtColor = "red";
                } else {
                    txtColor = "green";
                }
            }
        }
        origPriceDiv.innerText = "MSRP: " + originalPriceStr;
        origPriceDiv.style = "text-align:center;color:" + txtColor + ";";
        item.append(origPriceDiv);
    });
};

function printItemsOriginalPrice() {
    'use strict';
    var items = document.getElementsByClassName("product_wrap");
    for (var i = 0; i < items.length; ++i) {
        // console.log(item.getAttribute("data-product-id"));
        getItemOriginalPrice(items[i]);
    }
};