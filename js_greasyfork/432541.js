// ==UserScript==
// @name         NPC - Data Gatherer
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Gather item data from itemview page, and shop wiz results
// @author       Mandi (mandanarchi)
// @match        https://neopetsclassic.com/viewshop/?shop_id=*
// @match        https://neopetsclassic.com/itemview/*
// @match        https://neopetsclassic.com/market/wizard/*
// @match        https://neopetsclassic.com/safetydeposit/*
// @icon         https://www.google.com/s2/favicons?domain=neopetsclassic.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432541/NPC%20-%20Data%20Gatherer.user.js
// @updateURL https://update.greasyfork.org/scripts/432541/NPC%20-%20Data%20Gatherer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let currentPath = window.location.pathname;

    // if it's the item view, grab and chuck the data
    if (currentPath.indexOf('itemview') !== -1) {
        let item = $('td:contains("Item")').text().trim(),
            data = {
                tag: 'update',
                item_name: item.substr(7, item.indexOf("\n")).trim(),
                img: $('td img').attr('src'),
                type: $('td:contains("Type")').next().text().trim(),
                weight: $('td:contains("Weight")').next().text().replace(/[ ,lbs]*/g, '').trim(),
                rarity: $('td:contains("Rarity Index")').next().text().trim(),
                value: $('td:contains("Est. Value")').next().text().replace(/[ ,NP]*/g, '').trim(),
                description: $('center i font').text().trim()
            };
        doTheAdd(data);
    }

    // if it's the shop wiz, grab and chuck min/max prices and total
    else if (currentPath.indexOf('market/wizard') !== -1) {
        let total = 0, min_price = 0, max_price = 0;
        if ($('b:contains("I did not find anything")').length === 0) {
            $('.qstable td:nth-of-type(3)').each(function()  {
                total += parseInt($(this).text());
            });

            min_price = $('.qstable tr:nth-of-type(2) td:nth-of-type(4)').text().replace(/[ ,NP]*/g, '').trim();
            max_price = $('.qstable tr:last-of-type() td:nth-of-type(4)').text().replace(/[ ,NP]*/g, '').trim();

        }
        let data = {
            tag: 'shopwiz',
            item_name: $('b:contains("Searching for ...")').text().replace('Searching for ... ', '').trim(),
            min_price: min_price,
            max_price: max_price,
            num_available: total
        };
        if (data.item_name.length > 0) doTheAdd(data);
    }

    // if it's a NPC shop, grab and throw items
    else if (currentPath.indexOf('viewshop') !== -1) {
        let searchParams = new URLSearchParams(window.location.search),
            items = [];
        $('a[href^="/buyitem/"').parent().find('b').each( function() {
            items.push( $(this).text().trim() );
        });
        doTheAdd({
                'shop_id' : searchParams.get('shop_id'),
                'items' : JSON.stringify(items)
            });
    }

    // if it's a NPC shop, grab and throw items
    else if (currentPath.indexOf('safetydeposit') !== -1) {
        $('.sdbtablebody tr').each( function() {
            let elem = $(this);
            let  data = {
                tag: 'update',
                item_name: $(this).find('#sdbname > b:first-of-type').text().trim(),
                img: $(this).find('#sdbpicd img').attr('src'),
                type: $(this).find('#sdbcategory > b:first-of-type').text().trim(),
                //weight: $('td:contains("Weight")').next().text().replace(/[ ,lbs]*/g, '').trim(),
                //rarity: $('td:contains("Rarity Index")').next().text().trim(),
                //value: $('td:contains("Est. Value")').next().text().replace(/[ ,NP]*/g, '').trim(),
                description: $(this).find('#sdbdesc > i').text().trim()
            };
            doTheAdd(data);
        });
    }


})();

function doTheAdd(data) {

    $.ajax({
        url: "https://neo.mandilee.co.uk/avatars/add-items.php",
        type: "POST",
        crossDomain: true,
        data: data
    })
    /* // this just for testing purposes
        .done( function(data) { console.log(data); })
    //*/
    ;
}