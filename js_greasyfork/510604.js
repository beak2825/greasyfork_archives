// ==UserScript==
// @name        Battle Helper
// @namespace   Marascripts
// @description Automates battling and battle quests.
// @author      marascript
// @version     2.1.4
// @grant       none
// @match       https://www.marapets.com/battle.php*
// @match       https://www.marapets.com/talon.php*
// @match       https://www.marapets.com/sumo.php*
// @match       https://www.marapets.com/knight.php*
// @homepageURL https://github.com/marascript/userscripts
// @supportURL	https://github.com/marascript/userscripts/issues
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/510604/Battle%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/510604/Battle%20Helper.meta.js
// ==/UserScript==

;(async () => {
  'use strict'

  /**
   * Increase to heal more often (default 25)
   */
  const HEALTH_VARIANCE = 25

  const TIMEOUT = Math.random() * (1500 - 1000) + 1000

  const battle = {
    attack() {
      document.getElementById('option2').checked = true // "Fierce Attack"
      document.querySelector(".battle_bottom form input[type='submit']").click()
    },
    heal() {
      document.getElementById('option11').checked = true // "100%"
      document.querySelector("input[value='Heal']").click()
    },
    shouldAttack() {
      const playerHealth = document
        .querySelector('.bigger.alsotry')
        ?.innerText.split(' ')
      if (playerHealth) {
        const playerCurrent = parseInt(playerHealth[0])
        const maxDamage = parseInt(
          playerHealth[2] - playerCurrent - HEALTH_VARIANCE
        )

        if (maxDamage >= playerCurrent) {
          return false
        }
      }
      return true
    },
    start() {
      // Battle form can have button or input
      const battleForm = document.querySelector('#battle-form')
      if (battleForm) {
        battleForm.querySelector('button')
          ? battleForm.querySelector('button').click()
          : battleForm.querySelector("input[type='submit']").click()
      }

      // Completing a quest
      document.querySelector(".comebackbox form input[type='submit']")?.click()
    },
  }

  // Battle page
  if (location.pathname === '/battle.php') {
    // Always check for a captcha, only on battle page
    const captchaInput = document.querySelector('input[type="number"]')
    if (captchaInput) {
      captchaInput.focus()
      let timeout
      captchaInput.oninput = () => {
        clearTimeout(timeout)

        timeout = setTimeout(() => {
          if (captchaInput.value.length === 6) {
            battle.start()
          }
        }, 300)
      }
    }

    // Battling
    else if (document.querySelector('.battle_bottom .flex-buttons')) {
      setTimeout(() => {
        if (battle.shouldAttack()) {
          battle.attack()
        } else {
          battle.heal()
        }
      }, TIMEOUT)
    }

    // Start a new battle
    else if (document.querySelector('.battleover')) {
      setTimeout(() => {
        battle.start()
      }, TIMEOUT)
    }
  }

  // Quests page
  else {
    // Completed quest, check first
    if (document.querySelector('.btmpad6')?.textContent.includes('Thank you')) {
      document.querySelector(".middleit form input[type='submit']").click()
    }

    // On a quest, have the trading card or questing Talon
    else if (
      document.querySelector("img[alt='collected']") ||
      location.pathname === '/talon.php'
    ) {
      setTimeout(() => {
        battle.start()
      }, TIMEOUT)
    }
  }
})()
