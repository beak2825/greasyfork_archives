// ==UserScript==
// @name         Torn Trade Pricing
// @namespace    namespace
// @version      0.1.01
// @description  description
// @author       tos
// @match       *.torn.com/imarket.php*
// @match       *.torn.com/trade.php*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/377718/Torn%20Trade%20Pricing.user.js
// @updateURL https://update.greasyfork.org/scripts/377718/Torn%20Trade%20Pricing.meta.js
// ==/UserScript==

GM_addStyle(`
.x_trade_price {
  float: right;
}
.x_trade_price input {
  padding-left: 1em;
}

.x_trade_total {
  padding-right: 1em;
}
.x_trade_calc {
  position: absolute;
  right: 0;
}
`)

/*  CLEAR LOCAL STORAGE
    uncommenting the line below will clear prices
    from local storage every time script fires */
//localStorage.setItem('x_trade_prices', JSON.stringify({}))

const comma_sep = (s) => s.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")

const set_price = (item, price) => {
  let pricelist = JSON.parse(localStorage.getItem('x_trade_prices')) || {}
  pricelist[item] = price
  localStorage.setItem('x_trade_prices', JSON.stringify(pricelist))
}


const item_market_wrap = document.querySelector('#item-market-main-wrap')
const trade_wrap = document.querySelector('#trade-container')
let my_prices = JSON.parse(localStorage.getItem('x_trade_prices')) || {}
//console.log(my_prices)

if (item_market_wrap) {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if(node.classList && node.classList.contains('cont-name') && node.innerText ==='Available on private bazaars:') {
          const item_name = node.parentElement.querySelector('.item-t.right').innerText.split(' (')[0]
          node.insertAdjacentHTML('beforeend', `<div class="x_trade_price">Trade Price $<input type="text" data-item_name="${item_name}"></div>`)
          const price_input = node.querySelector('input')
          if (my_prices[item_name]) price_input.value = my_prices[item_name]
          price_input.addEventListener('change', (e) => {
            const price = e.target.value
            const item = e.target.getAttribute('data-item_name')
            set_price(item, price)
          })
        }
      }
    }
  })
  observer.observe(item_market_wrap, { subtree: true, childList: true })
}


if (trade_wrap) {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.classList && node.classList.contains('trade-cont')) {
          let total_pay = 0
          node.querySelectorAll('.user.right .name.left').forEach((entry) => {
            const entry_text = entry.innerText
              if (entry_text !== '') {
              const is_multiplier = entry_text.match(/ x(?!.* x)\w+/)
              let multiplier = 1
              let item = entry_text.trim()
              let item_pay = 0
              if (is_multiplier) {
                multiplier = parseInt(is_multiplier[0].replace(' x', ''))
                item = entry.innerText.replace(is_multiplier[0], '')
              }
              if (my_prices[item]) item_pay = multiplier * my_prices[item]
              else item_pay = 0
              total_pay += item_pay
              entry.insertAdjacentHTML('beforeend', `<br>$${my_prices[item] ? comma_sep(my_prices[item]) : 0}<div class="right">$${comma_sep(item_pay)}</div>`)
            }
          })
          node.querySelector('.user.right .title-black').insertAdjacentHTML('beforeend', `<div class="x_trade_total right">$${comma_sep(total_pay)}</div>`)
        }
      }
    }
  })
  const wrapper = document.body//.querySelector('#mainContainer')
  observer.observe(trade_wrap, { subtree: true, childList: true })
}