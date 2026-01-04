// ==UserScript==
// @name        Drew and Shusan Helper
// @namespace   Marascripts
// @description Does Drew and Shusan, and prompts when item is missing.
// @author      marascript
// @version     2.5.0
// @grant       none
// @match       https://www.marapets.com/drew.php*
// @match       https://www.marapets.com/socks.php*
// @homepageURL https://github.com/marascript/userscripts
// @supportURL	https://github.com/marascript/userscripts/issues
// @license     MIT
// @run-at    document-idle
// @downloadURL https://update.greasyfork.org/scripts/510348/Drew%20and%20Shusan%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/510348/Drew%20and%20Shusan%20Helper.meta.js
// ==/UserScript==

;(async () => {
  'use strict'

  if (document.querySelector('.flex-table2')) {
    const path = location.pathname
    const itemsRequested = document.querySelectorAll('.dopricecheck').length
    const checks = document.querySelectorAll(
      "img[src='https://images.marapets.com/tick.png']"
    ).length

    if (
      (path === '/drew.php' && checks !== 3) ||
      (path === '/socks.php' && checks !== itemsRequested)
    ) {
      console.log('Missing items.')
      //alert("Missing items.");
    } else {
      const complete = document.querySelector("input[type='submit']")

      const captchaInput = document.querySelector('input[type="number"]')
      if (captchaInput) {
        captchaInput.focus()
        let timeout
        captchaInput.oninput = () => {
          clearTimeout(timeout)

          timeout = setTimeout(() => {
            if (captchaInput.value.length === 6) {
              complete.click()
            }
          }, 300)
        }
      } else {
        setTimeout(() => {
          complete.click()
        }, 1500)
      }
    }
  }

  const questAgain = document.querySelector('.middleit input')
  if (questAgain && questAgain.value.includes('Again')) {
    setTimeout(() => {
      questAgain.click()
    }, 3500)
  }
})()
