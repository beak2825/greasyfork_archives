// ==UserScript==
// @name         Cardmarket compare items in shopping cart
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  Adds info comparing price of each item of a seller with the price of that same item from other sellers in the shopping cart
// @author       You
// @match        https://www.cardmarket.com/*/*/ShoppingCart
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cardmarket.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493868/Cardmarket%20compare%20items%20in%20shopping%20cart.user.js
// @updateURL https://update.greasyfork.org/scripts/493868/Cardmarket%20compare%20items%20in%20shopping%20cart.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // node marked for later removal
    const makeTemporaryNode = (type) => {
        const node = document.createElement(type)
        node.dataset.extraElement = "1"
        return node
    }

    // node with a colored price difference
    const makePriceDiffNode = (number, parenthesis) => {
        const node = makeTemporaryNode('span')
        node.style.color = number > 0 ? 'red' : (number === 0 ? 'gray' : 'green')
        node.innerText = `${number >= 0 ? '+' : ''}${number.toFixed(2)} €`
        if (parenthesis) {
            node.innerText = `(${node.innerText}) `
        }
        return node
    }

    const parsePrice = (string) => parseFloat(
        string
            .slice(0, -2)
            .replaceAll('.', '')
            .replaceAll(',', '.')
    )

    // ignore alt versions when comparing price -- there's a chance that someone wants to buy both versions and
    // compare them independently, but better to make it evident in case the duplicate was a mistake
    const parseName = (string) => string.replace(/ \(V\.\d+\)$/, '')

    const clearTemporaryNodes = () => [...document.querySelectorAll('[data-extra-element]')].forEach(node => node.parentNode.removeChild(node))

    function calculate() {
        clearTemporaryNodes()

        const sellers = [...document.querySelectorAll('.shipment-block')]

        // get all prices
        const pricesByName = {}
        ;[...document.querySelectorAll('[data-product-id]')].filter(item => item.offsetParent !== null).forEach(product => {
            const name = parseName(product.querySelector('td.name').innerText)
            const price = parsePrice(product.querySelector('td.price').innerText)
            const amount = +product.querySelector('td.amount').innerText.slice(0, -1)
            pricesByName[name] = pricesByName[name] ?? []
            pricesByName[name].push(price)
        })

        for (const name in pricesByName) {
            pricesByName[name].sort()
        }

        sellers.forEach(seller => {
            const uniques = []
            let sharedPriceDifference = 0
            let totalItems = 0

            // for each item, print difference from avg
            ;[...seller.querySelectorAll('[data-product-id]')].filter(item => item.offsetParent !== null).forEach(product => {
                const name = parseName(product.querySelector('td.name').innerText)
                const priceNode = product.querySelector('td.price')
                const price = parsePrice(priceNode.innerText)
                const amount = +product.querySelector('td.amount').innerText.slice(0, -1)
                totalItems += amount
                if (pricesByName[name].length === 1) {
                    Array(amount).fill(0).forEach(() => uniques.push(price))
                    priceNode.style.fontWeight = 'bold'
                }
                else {
                    const average = pricesByName[name].reduce((a, b) => a + b) / pricesByName[name].length
                    const difference = price - average
                    sharedPriceDifference += difference * amount
                    priceNode.insertAdjacentElement('afterbegin', makePriceDiffNode(difference, true))
                }
            })

            // append extra info to seller
            const summary = seller.querySelector('.summary')
            const addInfo = (text, value) => {
                const node = summary.children[1].cloneNode(true)
                node.dataset.extraElement = "1"
                node.children[0].innerText = text
                if (value instanceof Node) {
                    node.replaceChild(value, node.children[1])
                }
                else {
                    node.children[1].innerText = value
                }
                summary.appendChild(node)
            }
            summary.appendChild(makeTemporaryNode('hr'))
            addInfo(
                'Avg. price per item (inc. shipping)',
                (parsePrice(summary.querySelector('.total.strong').innerText) / totalItems).toFixed(2) + ' €'
            )
            addInfo('Uniques count', uniques.length)
            addInfo('Uniques price', uniques.reduce((a, b) => a + b, 0).toFixed(2) + ' €')
            addInfo('Price diff compared to other sellers', makePriceDiffNode(sharedPriceDifference, false))
        })
    }

    calculate()

    // re-calculate on shopping cart update
    function bind() {
        document.querySelectorAll('[data-ajax-action="ShoppingCart_RemoveSeller"],[data-ajax-action="ShoppingCart_RemoveArticle"]').forEach(node => {
            node.addEventListener('submit', () => {
                const itemCount = [...document.querySelectorAll('[data-product-id]')].length
                const interval = setInterval(
                    () => {
                        const itemCountNext = [...document.querySelectorAll('[data-product-id]')].length
                        if (itemCountNext < itemCount) {
                            clearInterval(interval)
                            calculate()
                            bind()
                        }
                    },
                    500
                )
            })
        })
    }

    bind()

})();