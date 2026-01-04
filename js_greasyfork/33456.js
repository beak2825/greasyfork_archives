// ==UserScript==
// @name         Torn - Inventory on Market
// @namespace    somenamespace
// @version      0.1
// @description  desc
// @author       tos
// @match        *.torn.com/imarket.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/33456/Torn%20-%20Inventory%20on%20Market.user.js
// @updateURL https://update.greasyfork.org/scripts/33456/Torn%20-%20Inventory%20on%20Market.meta.js
// ==/UserScript==

const APIkey = 'APIkey' //enter api key here

//const create_html = (html) => document.createRange().createContextualFragment(html)
const css = document.createRange().createContextualFragment(`
  <style>
    .inv_amnt {
      position: absolute;
      left: 4px;
      top: 3px;
      font-weight: 700;
      font-size: 11px;
      line-height: 11px;
      text-shadow: 0 -2px 1px #FFF, 0 2px 1px #FFF, 2px 0 1px #FFF, -2px 0 1px #FFF;
    }
  </style>
`)
document.body.appendChild(css)

const get_inventory = async () => {
  const response = await fetch(`https://api.torn.com/user/?selections=inventory&key=${APIkey}`)
  const res =  await response.json()
  const inv = res.inventory
  const inventory = {}
  for (let i = 0; i < inv.length; i++) {
    const ID = inv[i].ID
    delete inv[i].ID
    inventory[`id${ID}`] = inv[i]
  }
  return inventory
}


const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      if(node.className && node.className === 'main-market-page') {
        const button = document.createElement('SPAN')
        button.className = 'btn-wrap silver'
        button.innerHTML = `<span class="btn"><input type="button" value="Load Inventory"></span>`
        document.querySelector('.market-search .right form').append(button)
        button.onclick = (e) => {
          const item_lists = document.querySelectorAll('.m-items-list')
          get_inventory().then((inventory) => {
            for (const list of item_lists) {
              if (list.children.length > 0) {
                for( const node of list.children) {
                  if (node.classList.contains('clear')) {continue}
                  const itemID = node.querySelector('.hover').getAttribute('itemid')
                  const inv_amnt = document.createElement('DIV')
                  inv_amnt.className = 'inv_amnt'
                  inv_amnt.textContent = inventory[`id${itemID}`] ? inventory[`id${itemID}`].quantity : '0'
                  node.querySelector('.qty-wrap').prepend(inv_amnt)
                }
              }
            }
          })
        }
      }
    }
  }
})
const wrapper = document.querySelector('#item-market-main-wrap')
observer.observe(wrapper, { subtree: true, childList: true })