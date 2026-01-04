// ==UserScript==
// @name            PoE Trade Default Currency
// @description     Automatically select a buyout currency on the trade website
// @version         1.0.1
// @author          ArnoldsK
// @namespace       https://arnoldsk.lv
// @match           https://*.pathofexile.com/trade/search/*
// @icon            https://www.google.com/s2/favicons?domain=pathofexile.com
// @license         MIT
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/466201/PoE%20Trade%20Default%20Currency.user.js
// @updateURL https://update.greasyfork.org/scripts/466201/PoE%20Trade%20Default%20Currency.meta.js
// ==/UserScript==

// #############################################################################
// Constants
// #############################################################################
const BUYOUT_PRICE_LABEL = 'Buyout Price'
const CURRENCY_LABEL = 'Chaos Orb'

// #############################################################################
// App
// #############################################################################
const setDefaultBuyout = () => {
  const buyoutEl = [...document.querySelectorAll('.filter-title')].find(
    (el) => el.innerText.trim() === BUYOUT_PRICE_LABEL,
  )
  const filterBodyEl = buyoutEl.closest('.filter-body')
  const chaosEl = [
    ...filterBodyEl.querySelectorAll('.filter-select span'),
  ].find((el) => el.innerText.trim() === CURRENCY_LABEL)

  chaosEl.click()
}

window.addEventListener('load', () => {
  // Scuffed solution for content load check
  const loadedInterval = setInterval(() => {
    const searchBtnEl = document.querySelector('#trade .btn.search-btn')

    if (!searchBtnEl) return

    clearInterval(loadedInterval)
    setDefaultBuyout()
  }, 100)
})
