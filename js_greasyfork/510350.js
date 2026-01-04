// ==UserScript==
// @name        Day Trader
// @namespace   Marascripts
// @description Buys cheapest(ish) stock.
// @author      marascript
// @version     3.0.0
// @grant       none
// @match       https://www.marapets.com/shares.php*
// @homepageURL https://github.com/marascript/userscripts
// @supportURL	https://github.com/marascript/userscripts/issues
// @license     MIT
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/510350/Day%20Trader.user.js
// @updateURL https://update.greasyfork.org/scripts/510350/Day%20Trader.meta.js
// ==/UserScript==

// TODO: Price on shares page doesn't always actually match price, so can be less than 100

;(async () => {
  'use strict'

  /* *
   * HIDE_LOW_STOCKS - set to true to hide red stocks and low value stocks
   * MINIMUM - set to the minimum percentage you wish to show on your shares
   * */
  const HIDE_LOW_STOCKS = false
  const MINIMUM = 100

  if (!document.querySelector('.middleit.comebackbox')) {
    const ON_BUY_PAGE = document.URL.includes('?do=company')

    if (!ON_BUY_PAGE) {
      let lowestPrice = 99999
      let buyLink = ''

      document
        .querySelectorAll('.fairyreward_box .itempadding span.currencytext b')
        .forEach((company) => {
          const price = parseInt(
            company.innerText.split('MP')[0].replace(/,/g, '')
          )
          if (price < lowestPrice && price > 125) {
            lowestPrice = price
            buyLink =
              company.parentElement.parentElement.parentElement.parentElement
          }
        })

      buyLink.click()
    }

    else if (ON_BUY_PAGE) {
      document.querySelector("input[name='amount']").value = 100
      document.querySelector("input[name='Submit']").click()
    }
  }

  function hideRedStocks() {
    const redStocks = document.querySelectorAll(".currencytext.returnto.offline")
    redStocks.forEach((stock) => {
      stock.parentElement.parentElement.parentElement.style.display = 'none'
    })
  }

  function hideLowStocks() {
    const greenStocks = document.querySelectorAll(".currencytext.returnto.online")
    greenStocks.forEach((stock) => {
      const percentage = parseFloat(stock.innerText.split("%")[0])
      if (percentage < MINIMUM) {
        stock.parentElement.parentElement.parentElement.style.display = 'none'
      }
    })
  }

  if (document.URL.includes("?do=myshares") && HIDE_LOW_STOCKS)
      hideRedStocks()
      hideLowStocks()
})()
