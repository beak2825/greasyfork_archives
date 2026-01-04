// ==UserScript==
// @name         Pandabuy Shipping Conversion Prices
// @namespace    Scope
// @version      0.1
// @description  Converts Pandabuy CNY prices to provided currency using provided exchange rate
// @author       Scope
// @include      https://www.pandabuy.com/cartEstimatedFreight?*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/463219/Pandabuy%20Shipping%20Conversion%20Prices.user.js
// @updateURL https://update.greasyfork.org/scripts/463219/Pandabuy%20Shipping%20Conversion%20Prices.meta.js
// ==/UserScript==

'use strict';

const EXCHANGE_RATES = {
    "AUD": ["$", 4.66, "AUD"],
    "USD": ["", 6.89, "USD"],
    "CAD": ["", 5.11, "CAD"]
}

const EXCHANGE_DATA = EXCHANGE_RATES["AUD"]
const EXCHANGE_RATE = EXCHANGE_DATA[1]
const EXCHANGE_CURRENCY = EXCHANGE_DATA[0]
let ITEMS_COST = 0
let SHIPPING_COST = 0
var HAS_CONVERTED = false

function convert() {
    const prices = document.getElementsByClassName('feeActTotal')
    Object.keys(prices).forEach(x => {
        if (prices[x].outerText.includes("AUD")) {
        } else {
            let price = (parseInt(prices[x].outerText.toString().replace(`CNY `,``))/EXCHANGE_RATE).toFixed(2)
            prices[x].outerHTML = `<div data-v-027e261c=\"\" class=\"feeActTotal\">${EXCHANGE_DATA[2]} ${price}</div>`
        }
    })


    if (HAS_CONVERTED == false) {
        document.getElementsByClassName('delivery-fare-tips')[0].classList.add(['delivery-fare-deposit'],['holder'])
        document.getElementsByClassName('delivery-fare-tips')[0].classList.remove(['delivery-fare-tips'])
        HAS_CONVERTED = true
    }

    const convPrice = (parseInt(document.getElementsByClassName("delivery-fare-deposit")[1].innerText.replace("CNY","")/EXCHANGE_RATE)).toFixed(2)
    document.getElementsByClassName("delivery-fare-deposit holder")[0].innerText = `${EXCHANGE_DATA[2]} ${convPrice} -  `
}

setInterval(function(){
    convert()
}, 5000)


