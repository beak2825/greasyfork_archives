// ==UserScript==
// @name         steam fast copy
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  fas copy steam items price
// @author       damarus
// @match        https://steamcommunity.com/market/listings/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394475/steam%20fast%20copy.user.js
// @updateURL https://update.greasyfork.org/scripts/394475/steam%20fast%20copy.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addListener() {
        // sell and buy orders table
       let tables = document.querySelectorAll("table.market_commodity_orders_table");
        for (let i=0; i<tables.length; i++){
            let tbody = tables[i].getElementsByTagName("tbody")[0];
            let rows = tbody.getElementsByTagName("tr");
            for (let j=1; j<rows.length; j++){
                let td = rows[j].getElementsByTagName("td")[0];
                td.style.cursor = "pointer";
                td.style.transition="0.25s";
                td.onclick = ()=> {
                    let price = td.textContent.split(" ")[0];
                    price = price.trim();
                    navigator.clipboard.writeText(price)
                        .then( ()=> {
                        let oldColor = td.style.color;
                        td.style.color = "#ffff00";
                        setTimeout ( () => {td.style.color = oldColor}, 500);
                    }
                    );
                }
            }
        }
        // top price in buy and sale requests
        let summaryPrice = document.getElementsByClassName("market_commodity_order_summary");
        for (let i=0; i<summaryPrice.length; i++) {
            let priceSpan = summaryPrice[i].getElementsByClassName("market_commodity_orders_header_promote")[1];
            priceSpan.style.cursor = "pointer";
            priceSpan.style.transition="0.25s";
            priceSpan.onclick = ()=> {
                let price = priceSpan.textContent.split(" ")[0];
                price = price.trim();
                navigator.clipboard.writeText(price)
                    .then( ()=> {
                    let oldColor = priceSpan.style.color;
                    priceSpan.style.color = "#ffff00";
                    setTimeout ( () => {priceSpan.style.color = oldColor}, 500);
                });
            }
        }
        // buyRequest
        let buyRequest = document.getElementById("market_commodity_buyrequests");
        if (buyRequest){
            let buyRequestPrice = buyRequest.getElementsByClassName("market_commodity_orders_header_promote")[1];
            buyRequestPrice.style.cursor = "pointer";
            buyRequestPrice.style.transition="0.25s";
            buyRequestPrice.onclick = ()=> {
                let price = buyRequestPrice.textContent.split(" ")[0];
                price = price.trim();
                navigator.clipboard.writeText(price)
                    .then( ()=> {
                    let oldColor = buyRequestPrice.style.color;
                    buyRequestPrice.style.color = "#ffff00";
                    setTimeout ( () => {buyRequestPrice.style.color = oldColor}, 500);
                });
            }
        }
        // listing rows
        let listingRows = document.getElementsByClassName("market_listing_row market_recent_listing_row");
        if (listingRows.length){
            for (let i=0; i<listingRows.length; i++){
                let singleListing = listingRows[i].querySelector(".market_table_value");
                let priceSpan = listingRows[i].querySelector(".market_listing_price.market_listing_price_with_fee");
                let itemName = listingRows[i].querySelector(".market_listing_item_name.economy_item_hoverable");
                priceSpan.style.cursor = "pointer";
                priceSpan.style.transition="0.25s";
                singleListing.onclick = () => {
                    let price = priceSpan.textContent.split(" ")[0];
                    price = price.trim();
                    navigator.clipboard.writeText(price)
                        .then( ()=> {
                        let oldColor = priceSpan.style.color;
                        priceSpan.style.color = "#ffff00";
                        setTimeout ( () => {priceSpan.style.color = oldColor}, 500);
                    });
                }
                itemName.style.cursor = "pointer";
                itemName.style.transition="0.25s";
                itemName.onclick = () => {
                    navigator.clipboard.writeText(itemName.textContent)
                        .then( ()=> {
                        let oldColor = itemName.style.color;
                        itemName.style.color = "#ffff00";
                        setTimeout ( () => {itemName.style.color = oldColor}, 500);
                    });
                }
            }
        }
    }
    setInterval(addListener, 500);
    // item name
    let itemName = document.getElementById("largeiteminfo_item_name");
    itemName.style.transition = "0.45s";
    itemName.style.cursor = "pointer";
    itemName.addEventListener("click", ()=> {
            navigator.clipboard.writeText(itemName.textContent)
                .then(() => {
                let oldColor = itemName.style.color;
                itemName.style.color = "#ffff00";
                setTimeout ( () => {itemName.style.color = oldColor}, 500);
            });
    });
})();
