// ==UserScript==
// @name        Snowman Secret Santa
// @namespace   Marascripts
// @description Quest Snowman and Secret Santa
// @author      marascript
// @version     2.2.1
// @grant       GM.setValue
// @grant       GM.getValue
// @match       https://www.marapets.com/secret.php*
// @match       https://www.marapets.com/snowman.php*
// @match       https://www.marapets.com/market.php*
// @match       https://www.marapets.com/item.php*
// @match       https://www.marapets.com/shops.php*
// @match       https://www.marapets.com/shop.php*
// @match       https://www.marapets.com/viewstock.php*
// @match       https://www.marapets.com/attic.php*
// @homepageURL https://github.com/marascript/userscripts
// @supportURL	https://github.com/marascript/userscripts/issues
// @license     MIT
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/512616/Snowman%20Secret%20Santa.user.js
// @updateURL https://update.greasyfork.org/scripts/512616/Snowman%20Secret%20Santa.meta.js
// ==/UserScript==

const TIMEOUT = Math.random() * (500 - 300) + 300

;(async () => {
  'use strict'

  setTimeout(async () => {
    /**
     * Quests page
     */
    if (
      location.pathname === '/snowman.php' ||
      location.pathname === '/secret.php'
    ) {
      const priceCheck = document.querySelector('.dopricecheck')

      if (document.querySelector("[alt='collected']")) {
        const completeQuest = document.querySelector("input[type='submit']")
        const captcha = document.querySelector("input[name='code']")
        handleCaptcha(captcha, completeQuest)
      }

      // If the item has not been sent, and there is a price check
      else if (priceCheck) {
        window.name = 'Gifting Quest' // Name the window, to increase compatibility
        GM.setValue('quest', location.pathname) // Save the current quest URL

        // Save the items ID
        const itemId = priceCheck?.getAttribute('data-id')
        GM.setValue('item', itemId)

        // Check price, and get the item
        priceCheck.click()
        getItem()
      }

      // Quest Again
      else if (document.querySelector('.bigger.middleit.btmpad6')) {
        document.querySelector("input[type='submit']").click()
      }
    }

    // Check the window name
    if (window.name === 'Gifting Quest') {
      /**
       * Inventory
       */
      if (location.pathname === '/market.php') {
        const itemId = await GM.getValue('item')

        if (
          // Sometimes inventory bugs, if it says "Please go back", go back
          document
            .querySelector('.friendsbackground')
            ?.textContent.includes('Please go back')
        ) {
          backToInventory()
        } else if (document.URL.includes('senditem=1')) {
          // Sent the item, back to the quest
          document
            .querySelectorAll('.bigger.middleit b.alsotry')[1]
            .parentElement?.click()
        } else {
          // Click the item in inventory
          const item = document.querySelector(
            `#eachitemdiv${itemId} a img`
          )?.parentElement
          if (item) {
            item.click()
          } else {
            const quest = await GM.getValue('quest')
            location.href = `https://www.marapets.com${quest}`
          }
        }
      }

      /**
       * Item page
       */
      if (location.pathname === '/item.php') {
        const userSelection = document.querySelector('select') // Select box only shows if on a quest
        if (userSelection) {
          // Set to first option, and fill in the username field
          userSelection.selectedIndex = 1
          document.querySelector("[name='username']").value =
            userSelection.value
          // Send the item
          document.querySelector("[value='Send Item']").click()
        }
      }

      /**
       * User shops, or our shop
       */
      if (
        location.pathname === '/shops.php' ||
        location.pathname === '/viewstock.php'
      ) {
        const itemId = await GM.getValue('item')
        // If the item bought is the item for the quest go to inventory
        if (document.URL.includes(`item_id=${itemId}`)) {
          if (
            document
              .querySelector('.maralayout .bigger.middleit')
              ?.textContent.includes("You can't afford")
          ) {
            alert('Out of Marapoints!')
          } else {
            backToInventory()
          }
        }
      }

      /**
       * Shop
       */
      if (location.pathname === '/shop.php') {
        if (document.URL.includes('do=buy')) {
          const buyButton = document.querySelector('form button')
          const captcha = document.querySelector("input[name='code']")
          handleCaptcha(captcha, buyButton)
        }

        // After buying the item, go to inventory
        else if (!document.URL.includes('id=')) {
          backToInventory()
        }

        // Store stock
        else {
          // Find the item, if it is in stock, and click it
          const itemId = await GM.getValue('item')

          const itemToClick = document.querySelector(`#eachitemdiv${itemId} a`)
          if (itemToClick) {
            itemToClick.click()
          } else {
            // Item sold out before we got there
            const quest = await GM.getValue('quest')
            location.href = `https://www.marapets.com${quest}`
          }
        }
      }

      /**
       * Attic
       */
      if (location.pathname === '/attic.php') {
        const itemId = await GM.getValue('item')

        if (document.URL.includes('remove=1')) {
          // If we removed the item, go to inventory
          backToInventory()
        } else if (document.URL.includes(`item_id=${itemId}`)) {
          // Remove item from attic
          document.querySelector("[name='amountmove']").value = 1 // Set amount to move to 1
          document.querySelector("[value='Inventory']").click() // Click the Inventory button
        }
      }
    }
  }, TIMEOUT)

  function backToInventory() {
    location.href = 'https://www.marapets.com/market.php'
  }

  function getItem() {
    const timeout = Math.random() * (2500 - 1200) + 1200
    setTimeout(() => {
      const attic = document.querySelector('.offline.same')
      const atticCount = attic.textContent.split(' ')[0]
      if (atticCount !== '0') {
        location.href = attic.parentElement.href
      } else {
        const stockInfo = document.querySelector('.pricechecktable .sitedate')
        const stockMatch = stockInfo?.innerText?.match(/(\d+)\s+in\s+stock/)

        if (stockMatch) {
          const stockQuantity = parseInt(stockMatch[1])

          if (stockQuantity > 0) {
            console.log('Buy from shop - Item is in stock')
            location.href = stockInfo.parentElement.href
          } else {
            console.log('Buy from user - The item is out of stock!')
            getFromUserShop()
          }
        } else {
          console.log('Buy from user - Item not in shops')
          getFromUserShop()
        }
      }
    }, timeout)
  }

  function getFromUserShop() {
    const userShop = document.querySelector(
      '.pricechecktable .alsotry.same.strong'
    ).parentElement.href
    location.href = userShop
  }

  function handleCaptcha(captchaElement, buttonElement) {
    if (!captchaElement) {
      buttonElement.click()
    } else {
      // document.title = "Captcha required!"
      captchaElement.focus()
      captchaElement.oninput = () => {
        if (captchaElement.value.length === 6) {
          buttonElement.click()
        }
      }
    }
  }
})()
