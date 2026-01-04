// ==UserScript==
// @name         Neopets: Food Club bet page enhancer
// @author       Tombaugh Regio
// @version      1.1
// @description  Automatically selects the arena if a pirate is selected, and autofills the bet amount with the maximum NP.
// @namespace    https://greasyfork.org/users/780470
// @include      *://www.neopets.com/pirates/foodclub.phtml?type=bet
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427806/Neopets%3A%20Food%20Club%20bet%20page%20enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/427806/Neopets%3A%20Food%20Club%20bet%20page%20enhancer.meta.js
// ==/UserScript==

//========================================

//Set the max payoff in NP. The maximum allowed is 1,000,000 NP
const maxPayoff = 1000000

//========================================

const betAmountInput = document.querySelector('input[name="bet_amount"]')
const maxBetAmount = parseInt(document.querySelector('.content  p + center + p  > b').textContent)

function setBetAmount() {
  betAmountInput.value = maxBetAmount
  
  new Promise((resolve, reject) => {
    function getBetAmount() {
      setTimeout(() => {
        const payoff = parseInt(document.querySelector('input[name="winnings"]').value)
        const hasSelectedCheckboxes = [...document.querySelectorAll('input[type="checkbox"]')].filter(c => c.checked === true).length > 0
        
        if (payoff === 0 && hasSelectedCheckboxes) getBetAmount()
        if (payoff > 0) resolve(payoff)
      }, 100)
    }
    
    getBetAmount()
  })
  .then (payoff => {
    betAmountInput.focus()
    
    betAmountInput.value = payoff >= maxPayoff ? 
          Math.floor(
            document.querySelector('input[name="total_odds"]').value
            .split(":")
            .map(a => parseInt(a))
            .reduce((a, b, i) => i === 0 ? a / b : a * b, maxPayoff)
          ) : 
          maxBetAmount
    
    betAmountInput.blur()
  })
}

//Select corresponding arena if a pirate is selected
const setOdds = [...document.querySelectorAll('.content select')].forEach(select => select.onchange = () => {
  const checkbox = select.parentNode.parentNode.querySelector('input[type="checkbox"]')
  
  //Uncheck if arena is already selected
  if (select.value.length > 0 && checkbox.checked) checkbox.click()
  
  setBetAmount()
  checkbox.click()
})

setBetAmount()