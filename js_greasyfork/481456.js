// ==UserScript==
// @name         [LZT] CryptoZelenka
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Ваш баланс в криптовалютах!
// @author       Unitoshka & unitoshka.fun
// @match        https://lzt.market/user/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lzt.market
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/481456/%5BLZT%5D%20CryptoZelenka.user.js
// @updateURL https://update.greasyfork.org/scripts/481456/%5BLZT%5D%20CryptoZelenka.meta.js
// ==/UserScript==

(async function() {
    const crypto_div = create_div()

    var crypto_list = ['BTC', 'ETH', 'TON', 'USDT']

    const balance = get_balance()

    for (let i = 0; i < crypto_list.length; i++) {
        const crypto = await fetchCrypto(crypto_list[i], balance)
        add_text(`${crypto} ${crypto_list[i]}`, crypto_div)
    }
})();

function get_balance() {
    return document.querySelector('.balanceValue').textContent
}

function add_text(text, div_) {
    let new_text = document.createElement('p')
    new_text.textContent = text
    new_text.style = 'font-weight: 550; font-size: 14px; color: rgb(0,186,120)'

    div_.append(new_text)
}

function create_div() {
    let market_text = document.querySelector('.marketIndex--titleContainer')
    market_text.style = 'padding: 0 0 5px'
    let market = document.querySelector('.market--userPaymentsFilter')

    let div = document.createElement('div')
    div.style = "padding: 0px 0px 10px; display: flex; gap: 14px"
    market.insertBefore(div, market_text.nextSibling)
    return div
}

async function fetchCrypto(currency, amount) {
    const response = await (await fetch(`https://api.coinconvert.net/convert/rub/${currency}?amount=${amount}`)).json()
    return response[currency]
}