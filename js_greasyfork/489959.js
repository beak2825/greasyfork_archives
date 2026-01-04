// ==UserScript==
// @name         CardMarket Sort shopping wizard results
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Sort shopping wizard results by number of cards, total price, shipment price, etc.
// @author       andres-ml
// @match        https://www.cardmarket.com/*/*/Wants/ShoppingWizard/Results/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cardmarket.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489959/CardMarket%20Sort%20shopping%20wizard%20results.user.js
// @updateURL https://update.greasyfork.org/scripts/489959/CardMarket%20Sort%20shopping%20wizard%20results.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const results = [...document.querySelectorAll('.detailed-result-card')].map(result => result.parentElement)
    const parents = results.map(result => result.parentElement)
    results.forEach(p => p.setAttribute('style', ''))

    function reorder(score) {
        const sorted = results.slice()
        sorted.sort((a, b) => {
            const scoreA = score(a)
            const scoreB = score(b)
            return scoreA > scoreB ? -1 : 1
        })
        sorted.forEach((result, index) => {
            result.parentElement.removeChild(result)
            parents[index].appendChild(result)
        })
    }

    const getTotalCost = node => parseFloat(
        node.querySelector('.fonticon-shipping-methods')
        .parentElement
        .nextSibling
        .nextSibling
        .nextSibling
        .innerText
        .slice(0, -2)
        .replaceAll(',', '.')
    )

    const getNumberOfItems = node => [...node.querySelectorAll('tbody tr')].length

    const sorts = {
        itemCount: {
            name: 'highest number of items',
            score: getNumberOfItems,
        },
        pricePerItem: {
            name: 'lowest price per item',
            score: node => - (getTotalCost(node) / getNumberOfItems(node)),
        },
        totalCost: {
            name: 'highest total cost',
            score: getTotalCost,
        },
        shippingCost: {
            name: 'highest shipping cost',
            score: node => parseFloat(
                node.querySelector('.fonticon-shipping-methods')
                    .parentElement
                    .nextSibling
                    .innerText
                    .slice(0, -2)
                    .replaceAll(',', '.')
            ),
        },
    }

    const buttons = []
    Object.values(sorts).forEach(sort => {
        const button = document.createElement('button')
        button.innerText = 'Sort by ' + sort.name
        button.classList.add('btn', 'btn-outline-primary')
        button.style.marginRight = '0.5rem'
        button.style.marginBottom = '0.5rem'
        button.addEventListener('click', () => {
            reorder(sort.score)
            buttons.forEach(button => button.classList.remove('active'))
            button.classList.add('active')
        })
        parents[0].insertAdjacentElement('beforebegin', button)
        buttons.push(button)
    })

    // give some ample margin because masonry breaks
    parents[0].style.marginBottom = '500px'

    buttons[0].click()

})();