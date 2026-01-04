// ==UserScript==
// @name         Money Tree Sniper
// @namespace https://greasyfork.org/en/users/145271-aybecee
// @version      2025-05-01
// @description  Money Tree Sniper lol
// @match        https://www.grundos.cafe/donations/
// @match        https://www.grundos.cafe/medieval/rubbishdump/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @require https://update.greasyfork.org/scripts/512407/1463866/GC%20-%20Virtupets%20API%20library.js
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/540100/Money%20Tree%20Sniper.user.js
// @updateURL https://update.greasyfork.org/scripts/540100/Money%20Tree%20Sniper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function normalize(str) {
        return str.normalize("NFKD").replace(/[\u200B-\u200D\uFEFF]/g, "");
    }
    var donatable = GM_getValue('donatablekey', []);
    var rubbish = GM_getValue('rubbishkey', []);

    function getRandomInt(min, max) {
        const minCeiled = Math.ceil(min);
        const maxFloored = Math.floor(max);
        return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
    }



    (async () => {
        var itemStockArray = [];

        $(`.item-info strong`).each(function(){
            var itemName = normalize($(this).text().trim());
            itemStockArray.push(itemName)
        })

        try {
            // console.log(itemStockArray)

            const response = await bulkShopWizardPrices(itemStockArray);
            const data = await response.json();
            // console.log(data);

            for (var i = 0; i < data.length; i++) {
                // console.log(data[i]);

                var virtu_item_info = data[i];

                $(`.item-info strong`).each(function(index){
                    var itemName = normalize($(this).text().trim());
                    //console.log(itemName)
                    rubbish.push(itemName)

                    if (itemName == virtu_item_info['name']) {
                        $(this).parent().append(virtu_item_info['price']);
                        if (virtu_item_info['price'] > 100) {
                            $(this).parent().parent().css("border","10px solid red")
                        } else {
                            donatable.push(itemName)
                        }
                    }

                    if (window.location.href.includes("/medieval/rubbishdump/") && ! rubbish.includes(itemName)){
                        $(this).parent().parent().css("background","yellow")
                    }

                })

                if (i == data.length - 1 ){
                    // console.log(donatable)
                    var uniqueItems = [];
                    if (window.location.href.includes("/donations/")) {
                        $.each(donatable, function(i, el){
                            if($.inArray(el, uniqueItems) === -1) uniqueItems.push(el);
                        });
                        GM_setValue('donatablekey', uniqueItems);
                    } else if(window.location.href.includes("/medieval/rubbishdump/")){
                        $.each(rubbish, function(i, el){
                            if($.inArray(el, uniqueItems) === -1) uniqueItems.push(el);
                        });
                        GM_setValue('rubbishkey', uniqueItems);
                    }
                }
            }


        } catch (error) {
            console.error('Failed to fetch prices:', error);
        }
    })();




})();