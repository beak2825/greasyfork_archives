// ==UserScript==
// @name        Desert Spy and Cosmonaut Helper
// @namespace   Marascripts
// @description Automates Desert Spy and Cosmonaut quests.
// @author      marascript
// @version     2.1.1
// @grant       GM.setValue
// @grant       GM.getValue
// @match       https://www.marapets.com/spy.php*
// @match       https://www.marapets.com/shop.php*
// @match       https://www.marapets.com/cosmonaut.php*
// @homepageURL https://github.com/marascript/userscripts
// @supportURL	https://github.com/marascript/userscripts/issues
// @license     MIT
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/512025/Desert%20Spy%20and%20Cosmonaut%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/512025/Desert%20Spy%20and%20Cosmonaut%20Helper.meta.js
// ==/UserScript==

;(async () => {
  'use strict'

  const path = location.pathname

  if (path === '/shop.php' && window.name === 'Restock Quest') {
    // Buying the item
    if (document.URL.includes('do=buy')) {
      console.log('Buying item')
      const buyButton = document.querySelector('form button')
      if (buyButton) {
        const captcha = document.querySelector("input[name='code']")
        handleCaptcha(captcha, buyButton)
      } else {
        console.log('Sold the last item!')
        window.name = ''
        GM.setValue('item', '')
      }
    }

    // Bought the item
    else if (!document.URL.includes('id=')) {
      console.log('Bought the item')
      GM.setValue('item', '')
      const completeQuest = document.querySelector(
        ".comebackbox.middleit input[type='submit']"
      )
      const captcha = document.querySelector("input[name='code']")
      handleCaptcha(captcha, completeQuest)
    }

    // Shop stock
    else {
      const item = await GM.getValue('item')
      const itemToClick = document.querySelector(`#eachitemdiv${item} a`)
      if (itemToClick) {
        console.log('The item is in stock!')
        itemToClick.click()
      } else {
        GM.setValue('item', '')
        window.name = ''
        console.log('The item is out of stock!')
      }
    }
  }

  // On quest page
  if (path === '/spy.php' || path === '/cosmonaut.php') {
    const questAgain = document.querySelector('.bigger.middleit.btmpad6')
    if (questAgain) {
      document.querySelector("input[type='submit']").click()
    }
    const priceCheck = document.querySelector('.dopricecheck')
    if (priceCheck) {
      const timeout = Math.random() * (1000 - 300) + 300
      setTimeout(() => {
        GM.setValue('item', priceCheck.getAttribute('data-id'))
        priceCheck.click()
        checkInStock()
      }, timeout)
    }
  }

  function checkInStock() {
    const timeout = Math.random() * (2000 - 1200) + 1200
    setTimeout(() => {
      const stockInfo = document.querySelector('.pricechecktable .sitedate')
      const stockText = stockInfo.innerText
      const stockMatch = stockText.match(/(\d+)\s+in\s+stock/)

      if (stockMatch) {
        const stockQuantity = parseInt(stockMatch[1])

        // Check if the item is in stock
        if (stockQuantity > 0) {
          window.name = 'Restock Quest'
          const storeLink = stockInfo.parentElement.href
          // TODO: Click the link, instead of location.href
          //storeLink.parentElement.setAttribute.onclick = "";
          //storeLink.click();
          location.href = storeLink
        } else {
          console.log('The item is out of stock!')
          window.name = ''
          GM.setValue('item', '')
        }
      } else {
        console.log('Stock information not found.')
      }
    }, timeout)
  }

  function handleCaptcha(captchaElement, buttonElement) {
    if (!captchaElement) {
      buttonElement.click()
    } else {
      captchaElement.focus()
      captchaElement.oninput = () => {
        if (captchaElement.value.length === 6) {
          buttonElement.click()
        }
      }
    }
  }
})()
