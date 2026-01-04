// ==UserScript==
// @name         Pandabuy Cart Conversion Prices
// @namespace    Scope
// @version      0.1
// @description  Converts Pandabuy CNY prices to provided currency using provided exchange rate
// @author       Scope
// @include      https://www.pandabuy.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/463216/Pandabuy%20Cart%20Conversion%20Prices.user.js
// @updateURL https://update.greasyfork.org/scripts/463216/Pandabuy%20Cart%20Conversion%20Prices.meta.js
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



function convert() {
    const prices = document.getElementsByClassName('linethrow')
    Object.keys(prices).forEach(x => {
        let unconverted_price = prices[x].outerText.toString().replace(`¥ `,``)
        let converted_price = (parseInt(unconverted_price)/EXCHANGE_RATE).toFixed(2)
        ITEMS_COST+=parseInt(converted_price)
        document.getElementsByClassName('total center el-col el-col-3')[x].outerHTML = `<div data-v-f5a49c88="" class="total center el-col el-col-3">${EXCHANGE_CURRENCY}${converted_price} ${EXCHANGE_DATA[2]}</div>`
    })
}

function overall_convert() {
    const totalelement = document.getElementsByClassName('inline-block account-price account-price-totalPrice')[0]
    const convertMoneyElement = document.querySelector("#app > div.person-center > div.center > div > div.content-right > div > div > div.cart-container > div.all-select-bottom.clearfix > div.shops-total-price > span > div > p:nth-child(2) > i")
    const price = (parseInt(totalelement.outerText.replace("¥",""))/EXCHANGE_RATE).toFixed(2)
    convertMoneyElement.classList.add(['account-price'],['account-price-totalPrice'])
    convertMoneyElement.innerText = `${EXCHANGE_CURRENCY} ${price}`
}


setInterval(function(){
    overall_convert()
    convert()
}, 1000)
