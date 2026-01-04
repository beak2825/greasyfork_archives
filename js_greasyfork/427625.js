// ==UserScript==
// @name         Neopets: Filter auctions
// @author       Tombaugh Regio
// @version      1.1
// @description  Filter out auctions by item names, owners, and price range
// @namespace    https://greasyfork.org/users/780470
// @include      *://www.neopets.com/auctions.phtml*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427625/Neopets%3A%20Filter%20auctions.user.js
// @updateURL https://update.greasyfork.org/scripts/427625/Neopets%3A%20Filter%20auctions.meta.js
// ==/UserScript==

//============================================================

//Item names to exclude, in quotes, separated by commas
const excludeItems = ["dung", "Shiny Obsidian"]

//Do item names need to be exact matches, true or false?
const areItemsExactMatches = false

//Item owners to exclude, in quotes, separated by commas
const excludeOwners = []

//Price range
const price = {
    low: 1,
    high: 1000
}

//============================================================

const trimToLowerCase = (word) => word.trim().toLowerCase()

const itemsList =  [...document.querySelectorAll('.content center tr > td:nth-of-type(3)')].slice(1)
const itemsToHide = areItemsExactMatches ?
      itemsList.filter(a => excludeItems.map(e => trimToLowerCase(e)).includes(trimToLowerCase(a.textContent))) :
      itemsList.filter(a => excludeItems.reduce((c, d) => trimToLowerCase(a.textContent).includes(trimToLowerCase(d)), false))

const ownersToHide = [...document.querySelectorAll('.content center tr > td:nth-of-type(4)')].slice(1).filter(a => excludeOwners.map(e => trimToLowerCase(e)).includes(trimToLowerCase(a.textContent)))

const pricesToHide = [...document.querySelectorAll('.content center tr > td:nth-of-type(7)')].slice(1).filter(a => {
  const itemPrice = parseInt(a.textContent)
  return itemPrice > price.low && itemPrice > price.high
})

const rowsToHide = []

if (itemsToHide.length > 0) rowsToHide.push(...itemsToHide)
if (ownersToHide.length > 0) rowsToHide.push(...ownersToHide)
if (pricesToHide.length > 0) rowsToHide.push(...pricesToHide)

rowsToHide.filter(f => f && f.parentNode).forEach(e => e.parentNode.style.display = 'none')