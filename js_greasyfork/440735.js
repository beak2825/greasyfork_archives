// ==UserScript==
// @name         Bestbuy GPU Value Calculator
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Calculates and displays GPU value
// @author       Hykilpikonna
// @license      MIT
// @supportURL   https://github.com/hykilpikonna/GraphicsCardScripts
// @match        https://www.bestbuy.ca/en-ca/collection/graphics-cards-with-nvidia-chipset/349221?icmp=computing_evergreen_graphics_cards_category_listing_category_icon_shopby_nvidia
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bestbuy.ca
// @require      http://code.jquery.com/jquery-3.6.0.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440735/Bestbuy%20GPU%20Value%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/440735/Bestbuy%20GPU%20Value%20Calculator.meta.js
// ==/UserScript==

function value_calculator()
{
    // Name, Price, UserBench
    // Listed in string contains detection order. (Since "3060 ti" contains "3060", we must detect Ti first)
    const msrpUSD = [
        ['3060 ti', 400 , 132],
        ['3070 ti', 600 , 167],
        ['3080 ti', 1200, 233],
        ['3050'   , 250 , 73],
        ['3060'   , 330 , 98],
        ['3070'   , 500 , 154],
        ['3080'   , 700 , 204],
        ['3090'   , 1500, 236],
    ]
    const usdToCad = 1.27

    // Your code here...
    for (let item of $('.x-productListItem'))
    {
        try
        {
            const title = $(item).find('div[data-automation="productItemName"]').text()
            const priceEl = $(item).find('div[data-automation="product-pricing"]').children().eq(0)
            const price = parseFloat(priceEl.children().eq(0).text().replace('$', '').replace(/,/g, ''))
            const priceUSD = price / usdToCad

            // Find model
            const lower = title.toLowerCase()
            const model = msrpUSD.find(it => lower.includes(it[0]))
            if (!model)
            {
                console.log('Cannot find model for', title)
                continue
            }

            // Calculate price increase and current value
            const priceIncr = (priceUSD - model[1]) / model[1]
            const value = model[2] / priceUSD * 100

            // Insert new element
            priceEl.append(`<div style="color: #ff5875; font-weight: bold;">${(priceIncr * 100).toFixed(0)}% Incr | Value: ${value.toFixed(0)}</div>`)
            priceEl.append(`<div style="color: gray; font-size: 10px;">Identified Model: ${model[0]}</div>`)
        }
        catch (e) { console.log(e) }
    }
}

(function() {
    'use strict';

    $('document').ready(value_calculator)
})();