// ==UserScript==
// @name         TC Bazaar+ v2
// @namespace    namespace
// @version      0.1
// @description  description
// @author       tos
// @match       *.torn.com/bazaar.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411548/TC%20Bazaar%2B%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/411548/TC%20Bazaar%2B%20v2.meta.js
// ==/UserScript==

const event = new Event('input', {bubbles: true, simulated: true})

document.addEventListener('dblclick', (e) => {
  const buy_input = e.target.className.includes('buyAmountInput') ? e.target : null
  if (buy_input) {
    //console.log('buy_input:', buy_input)
    max_buy(buy_input)
  }
})

function max_buy(input) {
  let old_value = input.value
  input.value = input.max
  input._valueTracker.setValue(old_value)
  input.dispatchEvent(event)
}