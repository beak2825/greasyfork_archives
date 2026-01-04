// ==UserScript==
// @name         Pandabuy Product Price Conversion
// @namespace    scope
// @version      0.1
// @description  Converts Pandabuy CNY prices to provided currency using provided exchange rate
// @author       scope
// @include      https://www.pandabuy.com/product?*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/463217/Pandabuy%20Product%20Price%20Conversion.user.js
// @updateURL https://update.greasyfork.org/scripts/463217/Pandabuy%20Product%20Price%20Conversion.meta.js
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
var HAS_CONVERTED = false

function convert() {
    if (HAS_CONVERTED == false) {
        document.getElementsByClassName('price-bottom_tips')[0].classList.add(['price-title'],['holder'])
        document.getElementsByClassName('price-bottom_tips')[0].classList.remove(['price-bottom_tips'])
        HAS_CONVERTED = true
    }

    const price = (parseInt(document.getElementsByClassName('price-title')[0].innerText.replace("CNY ¥",""))/EXCHANGE_RATE).toFixed(2)
    document.getElementsByClassName('price-title holder')[0].innerText = `${EXCHANGE_DATA[2]} ${EXCHANGE_CURRENCY} ${price}`;
}

setInterval(function(){
    convert()
}, 1000)
