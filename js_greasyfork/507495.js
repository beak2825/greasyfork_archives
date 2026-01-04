// ==UserScript==
// @name         NYFE juhas Edition
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  stonks
// @author       You
// @match        https://nyfe.paydaythegame.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=paydaythegame.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/507495/NYFE%20juhas%20Edition.user.js
// @updateURL https://update.greasyfork.org/scripts/507495/NYFE%20juhas%20Edition.meta.js
// ==/UserScript==

const data = {
  set: function (key, value) {
    if (!key || !value) {
      return
    }

    if (typeof value === 'object') {
      value = JSON.stringify(value)
    }

    localStorage.setItem(key, value)
  },
  get: function (key) {
    var value = localStorage.getItem(key)

    if (!value) {
      return
    }

    // assume it is an object that has been stringified
    if (value[0] === '{' || value[0] === '[') {
      value = JSON.parse(value)
    }

    return value
  }
}

function throttle(mainFunction, delay) {
  let timerFlag = null // Variable to keep track of the timer

  // Returning a throttled version
  return (...args) => {
    if (timerFlag === null) {
      // If there is no timer currently running
      mainFunction(...args) // Execute the main function
      timerFlag = setTimeout(() => {
        // Set a timer to clear the timerFlag after the specified delay
        timerFlag = null // Clear the timerFlag to allow the main function to be executed again
      }, delay)
    }
  }
}

const waitForLoad = (selector, fn, once = true) => {
  setTimeout(() => {
    const el = document.querySelector(selector)

    if (el && !el.getAttribute('style')) {
      fn()
      if (!once) waitForLoad(selector, fn, once)
    } else waitForLoad(selector, fn, once)
  }, 100)
}

;(function () {
  'use strict'

  if (!data.get('selectedStocks')) data.set('selectedStocks', [])

  const initPortfolioScripts = () => {}

  const initStocksScripts = () => {
    document
      .querySelectorAll('.nyfeallstocksselectortable tbody tr')
      .forEach(stock => {
        const stockId = stock.getAttribute('data-thisstock')

        const setColor = () => {
          stock.style.backgroundColor = data
            .get('selectedStocks')
            .includes(stockId)
            ? 'purple'
            : ''
        }

        setColor()

        stock.oncontextmenu = throttle(e => {
          e.preventDefault()
          const isSelected = data
            .get('selectedStocks')
            .includes(stock.getAttribute('data-thisstock'))

          data.set(
            'selectedStocks',
            isSelected
              ? data.get('selectedStocks').filter(x => x !== stockId)
              : [...data.get('selectedStocks'), stockId]
          )
          setColor()
        }, 50)
      })
  }

  const initBuyFormScripts = () => {
    if (document.querySelector('.percentage-btn')) return

    const percentageFormatted = parseInt(100 / data.get('selectedStocks').length) || 0
    const newBtn = document.createElement('button')

    newBtn.className = 'nyfebutton percentage-btn'
    newBtn.textContent = `${percentageFormatted}%`
    newBtn.setAttribute('type', 'button')

    newBtn.onclick = () => {
      document.querySelector('#stockbuyformnum').value = Math.floor(document.querySelector('#stockbuyformnum').value * (percentageFormatted / 100))
      $('#stockbuyformnum').trigger('oninput')
    }

    const stockId = document
      .querySelector('.nyfebuyform')
      .getAttribute('data-stockid')

    document
      .querySelector('.nyfebuyform .nyfebuttonbuy')
      .addEventListener('click', () => data.set('selectedStocks', data.get('selectedStocks').filter(x => x !== stockId)))

    document.querySelector('#stockbuyformax').parentElement.appendChild(newBtn)
  }

  waitForLoad('.nyfebgdashboardcontainerbottomdashboard', initPortfolioScripts)
  waitForLoad('.nyfebgdashboardcontainerbottombrowse', initStocksScripts, false)
  waitForLoad('.nyfebuyform', initBuyFormScripts, false)

  const info = document.createElement('div')

  info.innerHTML = `
   <div style="color:purple;background:darkgray;padding:20px;">
    <h2>NYFE juhas Edition</h2>
    <p>Right-click on stocks to highlight them. In buy menu, click max button and then the percentage button to spread your money evenly. Refresh to fix scripts as they may be buggy.</p>
    <h3>1.0.1</h3>
    <p></p>
   </div>
  `

  document.querySelector('.nyfebgdashboardcontainercontent').appendChild(info)
})()
