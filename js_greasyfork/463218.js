// ==UserScript==
// @name         Pandabuy Search Price Conversion
// @namespace    scope
// @version      0.1
// @description  Converts Pandabuy CNY prices to provided currency using provided exchange rate
// @author       scope
// @include      https://www.pandabuy.com/goods*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/463218/Pandabuy%20Search%20Price%20Conversion.user.js
// @updateURL https://update.greasyfork.org/scripts/463218/Pandabuy%20Search%20Price%20Conversion.meta.js
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

function convert() {
    const prices = document.getElementsByTagName('em')
    Object.keys(prices).forEach(x => {
        let price = (parseInt(prices[x].outerText.toString().replace(`¥ `,``))/EXCHANGE_RATE).toFixed(2)
        if (prices[x].outerText == undefined || null || "" ) {} else {
            console.log(prices[x].outerText, prices[x])
            prices[x].outerText = `${EXCHANGE_DATA[2]} ${EXCHANGE_CURRENCY} ${price}`;
        }
    })
}


setInterval(function(){
    convert()
}, 1000)
