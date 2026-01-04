// ==UserScript==
// @name        Stalker
// @namespace   Marascripts
// @description Does Slater Stalker quests
// @author      marascript
// @version     1.1.1
// @grant       GM.setValue
// @grant       GM.getValue
// @match       https://www.marapets.com/stalker.php*
// @match       https://www.marapets.com/shops.php*
// @match       https://www.marapets.com/shop.php*
// @match       https://www.marapets.com/viewstock.php*
// @match       https://www.marapets.com/attic.php*
// @exclude     https://www.marapets.com/shop.php?id=91
// @homepageURL https://github.com/marascript/userscripts
// @supportURL	https://github.com/marascript/userscripts/issues
// @license     MIT
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/520342/Stalker.user.js
// @updateURL https://update.greasyfork.org/scripts/520342/Stalker.meta.js
// ==/UserScript==

/**
 * Set to true if you have the Attic Giftbox
 */
const ATTIC_GIFTBOX = false

;(async () => {
  'use strict'

  const TIMEOUT = Math.random() * (500 - 300) + 300
  const path = location.pathname

  setTimeout(async () => {
    if (path === '/stalker.php') {
      const checkmarks = document.querySelectorAll("[alt='collected']").length
      if (checkmarks === 2) {
        completeQuest()
      } else if (checkmarks === 1) {
        const hasAvatar = document.querySelector(
          ".width33.flex-middle [alt='collected']"
        )

        if (hasAvatar) {
          const priceCheck = document.querySelector('.dopricecheck')
          if (priceCheck) {
            window.name = 'Stalking' // Name the window, to increase compatibility

            const itemId = priceCheck?.getAttribute('data-id')
            GM.setValue('item', itemId)

            priceCheck.click()
            getItem()
          }
        }
      } else if (document.querySelector('.bigger.middleit.btmpad6')) {
        document.querySelector("input[type='submit']").click()
      } else {
        window.name = ''
      }
    }

    if (window.name === 'Stalking') {
      if (path === '/shops.php' || path === '/viewstock.php') {
        const itemId = await GM.getValue('item')
        if (document.URL.includes(`item_id=${itemId}`)) {
          if (
            document
              .querySelector('.maralayout .bigger.middleit')
              ?.textContent.includes("You can't afford")
          ) {
            alert('Out of Marapoints!')
          } else {
            backToStalker()
          }
        }
      }

      if (path === '/shop.php') {
        if (document.URL.includes('do=buy')) {
          const buyButton = document.querySelector('form button')
          const captcha = document.querySelector("input[name='code']")
          handleCaptcha(captcha, buyButton)
        } else if (!document.URL.includes('id=')) {
          backToStalker()
        } else {
          const itemId = await GM.getValue('item')

          const itemToClick = document.querySelector(`#eachitemdiv${itemId} a`)
          if (itemToClick) {
            itemToClick.click()
          } else {
            backToStalker()
          }
        }
      }

      if (path === '/attic.php') {
        getFromAttic()
      }
    }
  }, TIMEOUT)

  function backToStalker() {
    location.href = 'https://www.marapets.com/stalker.php'
  }

  function getItem() {
    const timeout = Math.random() * (2500 - 1200) + 1200
    setTimeout(() => {
      const attic = document.querySelector('.offline.same')
      const atticCount = attic.textContent.split(' ')[0]
      if (atticCount !== '0') {
        if (!ATTIC_GIFTBOX) {
          location.href = attic.parentElement.href
        } else {
          document.querySelector("[value='2']").checked = true
          completeQuest()
        }
      } else {
        const stockInfo = document.querySelector('.pricechecktable .sitedate')
        const stockMatch = stockInfo?.innerText?.match(/(\d+)\s+in\s+stock/)

        if (stockMatch) {
          const stockQuantity = parseInt(stockMatch[1])

          if (stockQuantity > 0) {
            location.href = stockInfo.parentElement.href
          } else {
            getFromUserShop()
          }
        } else {
          getFromUserShop()
        }
      }
    }, timeout)
  }

  async function getFromAttic() {
    const itemId = await GM.getValue('item')

    if (document.URL.includes('remove=1')) {
      backToStalker()
    } else if (document.URL.includes(`item_id=${itemId}`)) {
      document.querySelector("[name='amountmove']").value = 1 // Set amount to move to 1
      document.querySelector("[value='Inventory']").click() // Click the Inventory button
    }
  }

  function getFromUserShop() {
    const userShop = document.querySelector(
      '.pricechecktable .alsotry.same.strong'
    ).parentElement.href
    location.href = userShop
  }

  function completeQuest() {
    const completeQuest = document.querySelector("input[type='submit']")
    const captcha = document.querySelector("input[name='code']")
    handleCaptcha(captcha, completeQuest)
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
