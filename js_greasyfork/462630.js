// ==UserScript==
// @name         Steam Revenue Calculator
// @namespace    https://www.anicator.com/
// @version      0.1.6
// @description  Uses the Boxleiter method to calculate the gross revenue of games.
// @author       AniCator
// @match        https://store.steampowered.com/app/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steampowered.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/462630/Steam%20Revenue%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/462630/Steam%20Revenue%20Calculator.meta.js
// ==/UserScript==

// Inspired by: https://greyaliengames.com/blog/how-to-estimate-how-many-sales-a-steam-game-has-made/

(function() {
    'use strict';

    var reviews = parseFloat(document.querySelector('[itemprop="aggregateRating"]').querySelector('[itemprop="reviewCount"]').content);
    var price = parseFloat(document.querySelector('[itemprop="price"]').content);

    try
    {
        // Get the base price from the bundle that houses the main application.
        var items = GStoreItemData.rgPersonalizedBundleData[Object.keys(GStoreItemData.rgPersonalizedBundleData)[0]].m_rgItems;
        var base_price = price;
        var item_index = 0;
        for (var index = 0; index < items.length; index++)
        {
            for(var app = 0; app < items[index].m_rgIncludedAppIDs.length; app++ )
            {
                if( items[index].m_rgIncludedAppIDs[app] == document.getElementById("review_appid").value )
                {
                    item_index = index;
                    break;
                }
            }
        }

        base_price = parseFloat(GStoreItemData.rgPersonalizedBundleData[Object.keys(GStoreItemData.rgPersonalizedBundleData)[0]].m_rgItems[item_index].m_nBasePriceInCents) / 100.0;
        price = ( base_price * 0.618 ) + ( price * ( 1.0 - 0.618 ) ); // Ratio that thing for good measure.
    }
    catch( error )
    {
        // nop
    }

    // Ignore free games.
    if( isNaN(price) )
    {
        return;
    }

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'EUR',
    });

    var magic_number_lower = 6; // They've had it rough.
    var magic_number_magic = 12; // Things are alright.
    var magic_number_upper = 42; // Nice.
    var gross_lower = reviews * magic_number_lower * price;
    var gross_magic = reviews * magic_number_magic * price;
    var gross_upper = reviews * magic_number_upper * price;

    var steam_cut = gross_magic * 0.3;
    var tax_cut = gross_magic * 0.1;
    var net_magic = gross_magic - steam_cut - tax_cut;
    net_magic = formatter.format(net_magic);

    net_magic = '<span style="color:rgb(67, 144, 244)">' + net_magic + '</span>';

    var gross_magic_60 = reviews * magic_number_magic * 59.99;
    gross_magic_60 = gross_magic_60 * 0.618 + gross_magic * 0.382; // Little golden ratio magic.

    steam_cut = gross_magic_60 * 0.3;
    tax_cut = gross_magic_60 * 0.1;
    var net_magic_60 = gross_magic_60 - steam_cut - tax_cut;
    net_magic_60 = formatter.format(net_magic_60);

    net_magic_60 = '<span style="color:rgb(144, 67, 244)">' + net_magic_60 + '</span>';

    gross_lower = formatter.format(gross_lower);
    gross_magic = formatter.format(gross_magic);
    gross_upper = formatter.format(gross_upper);

    gross_lower = '<span style="color:rgb(244, 67, 54)">' + gross_lower + '</span>';
    gross_magic = '<span style="color:rgb(54, 67, 244)">' + gross_magic + '</span>';
    gross_upper = '<span style="color:rgb(54, 244, 67)">' + gross_upper + '</span>';

    var row = document.createElement("div");
    row.className = "user_reviews_summary_row";

    var subtitle = document.createElement("div");
    subtitle.className = "subtitle column";
    subtitle.innerHTML = "Gross Revenue:";
    row.append(subtitle);

    var summary = document.createElement("div");
    summary.className = "summary column";
    summary.innerHTML = gross_magic + " (best guess)<br>" + gross_lower + " (pessimistic)<br>" + gross_upper + " (optimistic)";
    row.append(summary);

    document.getElementById("userReviews").prepend(row);

    row = document.createElement("div");
    row.className = "user_reviews_summary_row";

    subtitle = document.createElement("div");
    subtitle.className = "subtitle column";
    subtitle.innerHTML = "Revenue (" + formatter.format(60) + "):";
    row.append(subtitle);

    summary = document.createElement("div");
    summary.className = "summary column";
    summary.innerHTML = net_magic_60;
    row.append(summary);

    document.getElementById("userReviews").prepend(row);

    row = document.createElement("div");
    row.className = "user_reviews_summary_row";

    subtitle = document.createElement("div");
    subtitle.className = "subtitle column";
    subtitle.innerHTML = "Revenue:";
    row.append(subtitle);

    summary = document.createElement("div");
    summary.className = "summary column";
    summary.innerHTML = net_magic;
    row.append(summary);

    document.getElementById("userReviews").prepend(row);
})();