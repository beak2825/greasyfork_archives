// ==UserScript==
// @name         Spooky Food SDB tracker
// @namespace https://greasyfork.org/en/users/145271-aybecee
// @version      2025-06-20
// @description  Displays amount of Spooky Food in SBD in shop
// @match        https://www.grundos.cafe/safetydeposit/*
// @match        https://www.grundos.cafe/viewshop/?shop_id=30
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/540093/Spooky%20Food%20SDB%20tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/540093/Spooky%20Food%20SDB%20tracker.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var spooky_food_JSON = GM_getValue('spooky_food_JSONKey', {});


    function normalize(str) {
        return str.normalize("NFKD").replace(/[\u200B-\u200D\uFEFF]/g, "");
    }

    if (window.location.href.includes("https://www.grundos.cafe/safetydeposit")) {
        $(`strong:contains(Spooky Food)`).each(function (index) {
            var itemAmount = $(this).parent().prev().find('strong').text();
            var itemName = $(this).parent().prev().prev().prev().find('strong').text();
            // console.log(itemName);
            // console.log(itemAmount);

            spooky_food_JSON[itemName] = {
                itemAmount: itemAmount
            }

            if (index + 1 == $(`strong:contains(Spooky Food)`).length) {
                console.log(spooky_food_JSON);


                GM_setValue('spooky_food_JSONKey', spooky_food_JSON);
            }
        })
    }

    if (window.location.href.includes("/viewshop/?shop_id=30")) {

        $(`.item-info strong`).each(function(){
            var shop_itemName = normalize($(this).text().trim());
            if (spooky_food_JSON[shop_itemName] !== undefined){
                console.log(spooky_food_JSON[shop_itemName]["itemAmount"])
                $(this).parent().next().after(`SDB: ${spooky_food_JSON[shop_itemName]["itemAmount"]}`)
            }

        })

    }

})();