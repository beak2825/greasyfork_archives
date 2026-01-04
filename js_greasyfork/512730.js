// ==UserScript==
// @name        Shop Pricer Easymode
// @namespace   Marascripts
// @description Automatically prices shop, requires the Gift Box.
// @author      marascript
// @version     2.0.0
// @grant       none
// @match       https://www.marapets.com/viewstock.php*
// @homepageURL https://github.com/marascript/userscripts
// @supportURL	https://github.com/marascript/userscripts/issues
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/512730/Shop%20Pricer%20Easymode.user.js
// @updateURL https://update.greasyfork.org/scripts/512730/Shop%20Pricer%20Easymode.meta.js
// ==/UserScript==

// TODO: Add a toggle
// TODO: Conflicts with some questing scripts

;(async () => {
  'use strict'

  /**
   *
   * TIMEOUT - Set to amount of milliseconds to wait before restarting (20 minutes default)
   * IGNORE_LARGE_DROPS - Set to true to ignore large price drops (red box)
   * IGNORE_MEDIUM_DROPS - Set to true to ignore medium price drops (yellow box)
   */
  const TIMEOUT = 1200000 // Default 1200000
  const IGNORE_LARGE_DROPS = false
  const IGNORE_MEDIUM_DROPS = false

  function getStatus() {
    // We use the message above the shopkeeper to determine the next step
    const message = document.querySelector(
      '.maralayoutmiddle .bigger.middleit'
    ).textContent
    if (message.includes('changed')) {
      // "...have repriced"/"...not changed...", go to the next page
      if (message.includes('not') || message.includes('have')) {
        getNextPage()
      }

      // "... has repriced...", save new prices
      else if (message.includes('has')) {
        // Reset prices for items with large drops (if set)
        if (!IGNORE_LARGE_DROPS) {
          ignoreReprice('.marapets_border15')
        }
        if (!IGNORE_MEDIUM_DROPS) {
          ignoreReprice('.marapets_border14')
        }

        // Clicks "Update Prices"
        document.querySelector("input[value='Update Prices']").click()
      }
    }

    // Update prices
    else {
      document.querySelector("input[value='Auto Price']").click()
    }
  }

  // Go to the next page of items, or restart pricing
  function getNextPage() {
    const pageButtons = document.querySelectorAll('.pages_all .pages_each a')
    const secondToLastPageButton = pageButtons[pageButtons.length - 2]

    // Click the next page button, if it exists
    if (secondToLastPageButton.textContent === '›') {
      secondToLastPageButton.click()
    }

    // On the last page, wait for TIMEOUT and restart at page 1
    else {
      setTimeout(() => {
        document.querySelector('.mainfeature_art a').click()
      }, TIMEOUT)
    }
  }

  // Resets items with large price drops to their previous price
  function ignoreReprice(selector) {
    const items = document.querySelectorAll(selector)

    items.forEach((item) => {
      const oldPrice = item
        .querySelector('.mp')
        .textContent.split('MP')[0]
        .replace(/,/g, '')
      item.querySelector('input').value = oldPrice
    })
  }

  getStatus()
})()
