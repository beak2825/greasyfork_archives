// ==UserScript==
// @name         Bazaar Auto Price
// @namespace    tos
// @version      0.7
// @description  description
// @author       tos
// @match        *.torn.com/bazaar.php*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/371854/Bazaar%20Auto%20Price.user.js
// @updateURL https://update.greasyfork.org/scripts/371854/Bazaar%20Auto%20Price.meta.js
// ==/UserScript==

const apikey = 'API_KEY_HERE'

const torn_api = async (args) => {
  const a = args.split('.')
  if (a.length!==3) throw(`Bad argument in torn_api(args, key): ${args}`)
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest ( {
      method: "POST",
      url: `https://api.torn.com/${a[0]}/${a[1]}?selections=${a[2]}&key=${apikey}`,
      headers: {
        "Content-Type": "application/json"
      },
      onload: (response) => {
          try {
            const resjson = JSON.parse(response.responseText)
            resolve(resjson)
          } catch(err) {
            reject(err)
          }
      },
      onerror: (err) => {
        reject(err)
      }
    })
  })
}

var event = new Event('keyup')
var APIERROR = false

async function lmp(itemID) {
  if(APIERROR === true) return 'API key error'
  const prices = await torn_api(`market.${itemID}.bazaar,itemmarket`)
  if (prices.error) {APIERROR = true; return 'API key error'}
  let lowest_market_price = null
  for (const market in prices) {
    for (const lid in prices[market]) {
      if (lowest_market_price === null) lowest_market_price = prices[market][lid].cost
      else if (prices[market][lid].cost < lowest_market_price) lowest_market_price = prices[market][lid].cost
    }
  }
  return lowest_market_price - 1
}

const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      if (node.classList && node.classList.contains('input-money-group')) {
        const li = node.closest('li.clearfix') || node.closest('li[id^=item]')
        const input = node.querySelector('.input-money[type=text]')
        if (li) {
          const itemID = li.querySelector('img').src.split('items/')[1].split('/medium')[0]
          input.addEventListener('focus', function(e) {
            if (this.id.includes('price-item')) this.value = ''
            if (this.value === '') {
              lmp(itemID).then((price) => {
                this.value = price
                this.dispatchEvent(event)
              })
            }
          })
        }
      }
    }
  }
})

const wrapper = document.querySelector('#bazaarroot')
observer.observe(wrapper, { subtree: true, childList: true })
