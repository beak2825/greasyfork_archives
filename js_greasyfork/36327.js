// ==UserScript==
// @name         Namecheap - sort results by regular price
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Namecheap - sort results by regular prices
// @author       You
// @match        https://www.namecheap.com/domains/registration/results.aspx?domain=*
// @grant       GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/36327/Namecheap%20-%20sort%20results%20by%20regular%20price.user.js
// @updateURL https://update.greasyfork.org/scripts/36327/Namecheap%20-%20sort%20results%20by%20regular%20price.meta.js
// ==/UserScript==

function getLiItemPrice(element){
  var specialPrice = element.querySelector('.price .domain-dollar-value')
  var regPrice = element.querySelector('.reg-price>div')
  if(regPrice){
    return Number(regPrice.childNodes[7].textContent)
  }
  else if(specialPrice){
    return Number(specialPrice.childNodes[1].textContent)
  }
}

function sortPrices(){

var liItems = Array.from(document.querySelectorAll('.ga-event-ul li'))

liItems
  .sort((prevElem, nextElem) => getLiItemPrice(prevElem) - getLiItemPrice(nextElem))
  .forEach(elem => {
    document.querySelector('.ga-event-ul').appendChild(elem)
  })

}

GM_registerMenuCommand("Sort Regular Prices", sortPrices)