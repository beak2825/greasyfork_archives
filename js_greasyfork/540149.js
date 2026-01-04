// ==UserScript==
// @name         Shop Wiz Stock Age
// @namespace https://greasyfork.org/en/users/145271-aybecee
// @version      2025-06-22
// @description  Tracks stock which have not been bought yet
// @author       You
// @match        https://www.grundos.cafe/market/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/540149/Shop%20Wiz%20Stock%20Age.user.js
// @updateURL https://update.greasyfork.org/scripts/540149/Shop%20Wiz%20Stock%20Age.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var stock_list = GM_getValue('stock_listKey', {});

    if ($(`body:contains(you sell an item, the Neopoints will go into your)`).length == 1 ) {

        $(`.searchhelp`).each(function(index){

            var itemName = $(this).attr("id");
            var stock = Number($(this).parent().next().next().text().trim());

            itemName = itemName.substring(0,itemName.lastIndexOf("-links"));
            // console.log(itemName);

            var currentTime = new Date();

            if (stock_list[itemName] === undefined) {

                // console.log(`${itemName} information not recorded`);

                stock_list[itemName];
                stock_list[itemName] = {
                    "Last Updated": currentTime.toString(),
                    "Stock": stock
                };
                $(this).parent().css({
                    "background-color": "pink"
                });
            } else if (stock_list[itemName]["Stock"] > stock){
                stock_list[itemName] = {
                    "Last Updated": currentTime.toString(),
                    "Stock": stock
                };
                $(this).parent().css({
                    "background-color": "lightblue"
                });
            } else if (stock_list[itemName]["Stock"] <= stock){
                //  console.log(`${itemName} information recorded`);

                var xDate = new Date(stock_list[itemName]["Last Updated"]);
                var now = new Date();
                var diff = now - xDate;

                console.log(`${itemName} was stocked ${Math.ceil(diff / 86400000) - 1} days ago`);

                if (Math.ceil(diff / 86400000) - 1 == 0) {
                    $(this).parent().css({
                        "background-color": "white"
                    });
                } else if (Math.ceil(diff / 86400000) - 1 == 1) {
                    $(this).parent().css({
                        "background-color": "#f3f6f4"
                    });
                } else if (Math.ceil(diff / 86400000) - 1 == 2) {
                    $(this).parent().css({
                        "background-color": "#eee"
                    });
                } else if (Math.ceil(diff / 86400000) - 1 == 3) {
                    $(this).parent().css({
                        "background-color": "#bcbcbc"
                    });
                } else if (Math.ceil(diff / 86400000) - 1 == 4) {
                    $(this).parent().css({
                        "background-color": "#999"
                    });
                } else if (Math.ceil(diff / 86400000) - 1 == 5) {
                    $(this).parent().css({
                        "background-color": "#5b5b5b"
                    });
                } else if (Math.ceil(diff / 86400000) - 1 == 5) {
                    $(this).parent().css({
                        "background-color": "#555"
                    });
                } else if (Math.ceil(diff / 86400000) - 1 > 5) {
                    $(this).parent().css({
                        "background-color": "#000"
                    });
                }


            }
            if (index + 1 == $(`.searchhelp`).length) {
                console.log(stock_list)
                GM_setValue('stock_listKey', stock_list);
            }

        })
    }

})();