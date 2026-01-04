// ==UserScript==
// @name         CardMarket export shopping cart cards and sellers
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  Export shopping cart cards and sellers (copy to clipboard)
// @author       andres-ml
// @match        https://www.cardmarket.com/*/*/ShoppingCart
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cardmarket.com
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489956/CardMarket%20export%20shopping%20cart%20cards%20and%20sellers.user.js
// @updateURL https://update.greasyfork.org/scripts/489956/CardMarket%20export%20shopping%20cart%20cards%20and%20sellers.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const base = location.href.slice(0, location.href.indexOf('/ShoppingCart'))
    const path = base.slice('https://www.cardmarket.com'.length)

    function copyCards() {
        const cardList = [...document.querySelectorAll('[data-expansion] .name')].filter(item => item.offsetParent !== null).map(
            node => node.previousSibling.innerText.slice(0, -1) + ' ' + node.innerText
        ).join('\n')
        GM_setClipboard(cardList, "text", () => alert('Cards copied to clipboard'))
    }

    function copySellers() {
        const sellerList = [...document.querySelectorAll(`.seller-info [href^="${path}/Users/"]`)].map(
            node => 'https://www.cardmarket.com' + node.getAttribute('href')
        ).join('\n')
        GM_setClipboard(sellerList, "text", () => alert('Sellers copied to clipboard'))
    }

    const parent = document.createElement('div')

    const buttons = [
        document.createElement('button'),
        document.createElement('button'),
    ]

    buttons[0].innerText = 'Copy cards to clipboard'
    buttons[0].addEventListener('click', copyCards)
    buttons[1].innerText = 'Copy sellers to clipboard'
    buttons[1].addEventListener('click', copySellers)

    buttons.forEach(button => {
        button.classList.add('btn', 'btn-outline-primary')
        button.style.marginBottom = '0.5rem'
        button.style.width = '100%'
        parent.appendChild(button)
    })

    document
        .querySelector('.shopping-cart-content > .row > .col:first-child + * .card:last-child')
        .insertAdjacentElement('afterend', parent)

})();