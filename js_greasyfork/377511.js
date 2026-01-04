// ==UserScript==
// @name         TC Inventory Abroad
// @namespace    namespace
// @version      0.1
// @description  description
// @author       tos
// @match       *.torn.com/index.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377511/TC%20Inventory%20Abroad.user.js
// @updateURL https://update.greasyfork.org/scripts/377511/TC%20Inventory%20Abroad.meta.js
// ==/UserScript==

const api_key = 'APIKEY'

const travel_market_wrap = document.querySelector('.travel-agency-market')

if (travel_market_wrap) {
  document.querySelector('.items-list-title .circulation-b').innerText = 'Inventory'
  show_inventory()
}

async function show_inventory() {
  const inventory = await fetch(`https://api.torn.com/user/?selections=inventory&key=${api_key}`).then(r => r.json())
  document.querySelectorAll('.users-list li').forEach( (item) => {
    try {
      const item_id = item.querySelector('img').src.split('items/')[1].split('/')[0]
      const circ = item.querySelector('.circulation').childNodes[2]
      circ.textContent = '0'
      inventory.inventory.forEach((i) => {
        if (item_id == i.ID) circ.textContent = i.quantity
      })
    }
    catch(err) {
      console.warn('TC Inventory Abroad ERROR:', err)
    }
  })
}