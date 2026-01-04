// ==UserScript==
// @name         hover.com - Sort domains by regular price.
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Lets you sort domains on hover.com by their regular price.
// @author       You
// @match        https://www.hover.com/*
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/38984/hovercom%20-%20Sort%20domains%20by%20regular%20price.user.js
// @updateURL https://update.greasyfork.org/scripts/38984/hovercom%20-%20Sort%20domains%20by%20regular%20price.meta.js
// ==/UserScript==

function sortByRegularPrice(){

    var getLiItemPrice = (element) => Number(element.textContent.split('$')[1].trim().replace(',', ''))
    var priceItems = document.querySelectorAll('.results:not(.lookup) .regular_price span')

    Array.from(priceItems)
    .sort((prevElem, nextElem) => getLiItemPrice(prevElem) - getLiItemPrice(nextElem))
    .forEach(elem => {
        var parentContainer = elem.parentElement.parentElement.parentElement.parentElement
        document.querySelector('div[data-id="top"] .rows').appendChild(parentContainer)
    })
  
    document.querySelector('div[data-id="top"] .heading h2').textContent = 'Sorted By Price'
  
  Array.from(document.querySelectorAll('div[data-id]:not([data-id="top"])[class="category"]'))
        .forEach(item => item.remove())


}

GM_registerMenuCommand('Sort Domains By Regular Price', sortByRegularPrice)