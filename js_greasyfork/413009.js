// ==UserScript==
// @name        Scryfall Hover Price
// @namespace   Tripp Lyons
// @match       *://scryfall.com/search
// @version     1.0
// @author      Tripp Lyons
// @description Show prices of MTG cards by hovering over them while searching Scryfall
// @downloadURL https://update.greasyfork.org/scripts/413009/Scryfall%20Hover%20Price.user.js
// @updateURL https://update.greasyfork.org/scripts/413009/Scryfall%20Hover%20Price.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

function makePriceElement() {
  let el = document.createElement('div')
  el.innerText = 'Loading...'
  el.className = 'price'
  el.style.backgroundColor = 'rgba(0,0,0,0.5)'
  el.style.color = 'white'
  el.style.fontFamily = 'sans-serif'
  el.style.fontSize = '18px'
  el.style.display = 'flex'
  el.style.justifyContent = 'center'
  el.style.alignItems = 'center'
  el.style.position = 'absolute'
  el.style.left = '0px'
  el.style.right = '0px'
  el.style.top = '0px'
  el.style.bottom = '0px'
  el.style.zIndex = '999'
  el.style.borderRadius = '4.75% / 3.5%'
  return el
}

let cards = [...document.querySelectorAll('.card-grid-item-card')]

cards.forEach(card => {
  let id = card.href.split('card/').slice(1).join('').split('/').slice(0,-1).join('/')
  let priceUrl = 'https://api.scryfall.com/cards/' + id
  let lastEnter = 0
  card.addEventListener('mouseenter', () => {
    let el = makePriceElement()
    card.appendChild(el)
    fetch(priceUrl).then(result => result.json()).then(obj => {
      let price = obj.prices.usd
      if(price) {
        el.innerText = '$' + price
      } else {
        el.innerText = 'No price found.'
      }
    })
  })
  card.addEventListener('mouseleave', () => {
    document.querySelectorAll('.price').forEach(a => a.parentNode.removeChild(a))
  })
})
