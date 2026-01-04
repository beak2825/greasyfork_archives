// ==UserScript==
// @name         TC Stocks
// @namespace    namespace
// @version      0.2
// @description  description
// @author       tos
// @match       *.torn.com/stockexchange.php*
// @match       *.torn.com/laptop.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394423/TC%20Stocks.user.js
// @updateURL https://update.greasyfork.org/scripts/394423/TC%20Stocks.meta.js
// ==/UserScript==



const stock_LIs = document.querySelectorAll('UL.stock-cont>LI')
if (stock_LIs) stock_LIs.forEach(l => add_change_totals(l))

function add_change_totals (li) {
  const shares = extractInt(li.querySelector('.price-wrap>.first-row').innerText)
  const change = parseFloat(li.querySelector('.change').innerText.split(' ')[1].replace('$', ''))
  const up_or_down = li.querySelector('.change').classList[1]
  li.querySelector('.qualify-wrap').insertAdjacentHTML('beforeend', `<span class="change ${up_or_down} right">$${numberWithCommas(Math.round(shares * change))}</span>`)
}


function extractInt(str) {
  return parseInt(str.match(/[0-9]/g).join(''))
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      if (node.className && node.className == 'stock-main-wrap') {
        const LIs = node.querySelectorAll('UL.stock-cont>LI')
        if (LIs) LIs.forEach(l => add_change_totals(l))
      }
    }
  }
})

const wrapper = document.body//.querySelector('#mainContainer')
observer.observe(wrapper, { subtree: true, childList: true })

