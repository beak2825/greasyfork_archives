// ==UserScript==
// @name         CardMarket Auto-link on wishlist
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  Transforms card names from plain text to a link to a search with cards matching that name.
// @author       You
// @match        https://www.cardmarket.com/*/*/Wants/ShoppingWizard/Results/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cardmarket.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/488248/CardMarket%20Auto-link%20on%20wishlist.user.js
// @updateURL https://update.greasyfork.org/scripts/488248/CardMarket%20Auto-link%20on%20wishlist.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const base = location.href.slice(0, location.href.indexOf('/Wants'))

    document.querySelectorAll('td.card-name').forEach(node => {
        const link = document.createElement('A')
        const cardName = node.innerText
        link.setAttribute('href', `${base}/Products/Search?searchString=${cardName}`)
        link.innerText = cardName
        link.setAttribute('class', node.getAttribute('class'))
        node.innerText = ''
        node.appendChild(link)
    })

})();