// ==UserScript==
// @name        Simple Dailies
// @namespace   Marascripts
// @description Automates most dailies.
// @author      marascript
// @version     4.6.0
// @grant       none
// @match       https://www.marapets.com/ants.php
// @match       https://www.marapets.com/archeology.php
// @match       https://www.marapets.com/burst.php*
// @match       https://www.marapets.com/cloudnine.php*
// @match       https://www.marapets.com/darkfairy.php
// @match       https://www.marapets.com/dash.php*
// @match       https://www.marapets.com/deal.php*
// @match       https://www.marapets.com/doubleornothing.php
// @match       https://www.marapets.com/fishing.php
// @match       https://www.marapets.com/fruitmachine.php
// @match       https://www.marapets.com/giganticfairy.php
// @match       https://www.marapets.com/giveaways.php*
// @match       https://www.marapets.com/graverobbing.php
// @match       https://www.marapets.com/graves.php*
// @match       https://www.marapets.com/guesstheweight.php*
// @match       https://www.marapets.com/gumball.php*
// @match       https://www.marapets.com/jackpot.php*
// @match       https://www.marapets.com/jobs.php*
// @match       https://www.marapets.com/magazines.php
// @match       https://www.marapets.com/multiplier.php*
// @match       https://www.marapets.com/newsagent.php
// @match       https://www.marapets.com/nuttytree.php
// @match       https://www.marapets.com/pancakes.php*
// @match       https://www.marapets.com/pie.php*
// @match       https://www.marapets.com/pipes.php*
// @match       https://www.marapets.com/plushies.php
// @match       https://www.marapets.com/plushies2.php
// @match       https://www.marapets.com/potofgold.php
// @match       https://www.marapets.com/racing.php*
// @match       https://www.marapets.com/rack.php
// @match       https://www.marapets.com/sevenheaven.php*
// @match       https://www.marapets.com/sewage.php
// @match       https://www.marapets.com/spooks.php*
// @match       https://www.marapets.com/sugarstack.php*
// @match       https://www.marapets.com/sultan.php
// @match       https://www.marapets.com/sword.php*
// @match       https://www.marapets.com/telescope.php
// @match       https://www.marapets.com/tombola*
// @match       https://www.marapets.com/trash.php
// @match       https://www.marapets.com/tree.php
// @match       https://www.marapets.com/trojan.php
// @match       https://www.marapets.com/undyingfairy.php
// @match       https://www.marapets.com/vending.php
// @match       https://www.marapets.com/wormdigging.php*
// @match       https://www.marapets.com/potions.php*
// @homepageURL https://github.com/marascript/userscripts
// @supportURL	https://github.com/marascript/userscripts/issues
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/510351/Simple%20Dailies.user.js
// @updateURL https://update.greasyfork.org/scripts/510351/Simple%20Dailies.meta.js
// ==/UserScript==

;(async () => {
  'use strict'

  const path = location.pathname

  // Set to true to auto buy from the Potion Boutique
  const POTIONS_BOUTIQUE = true

  // Set to true try to do dailies when available again
  // ! Must leave the tab open!
  const AUTO_REFRESH = true

  const comebackBox = document.querySelector('.middleit.comebackbox b')
  if (AUTO_REFRESH && comebackBox) {
    const milleseconds = timeToMilliseconds(comebackBox.textContent)
    const timeout =
      Math.random() * (milleseconds + 75000 - milleseconds) + milleseconds
    setTimeout(() => {
      location.href = `https://www.marapets.com${path}`
    }, timeout)
  }

  const dailies = {
    pancakePile() {
      const startGame = document.querySelector("input[type='submit']")

      if (startGame) {
        startGame.click()
      } else {
        const panToClick = document.querySelector(
          "a[href='pancakes.php?play=1&id=1'], a[href='pancakes.php?play=1&id=2']"
        )

        if (panToClick) {
          panToClick.click()
        }
      }
    },
    pipeDream() {
      const playButton = document.querySelector(
        "input[value='Play Pipe Dream']"
      )
      playButton?.click()

      const rollDice = document.querySelector("input[value='Roll Dice']")
      rollDice?.click()

      const canBlock =
        document
          .querySelector('.maralayoutmiddle .middleit .bigger.middleit')
          .innerText.match(/\d/g)
          ?.map(Number) || [] // Convert to numbers, handle cases where no matches

      const priorities = [9, 8, 7, 1, 2, 3, 4, 5, 6] // Define priorities

      for (const number of priorities) {
        if (canBlock.includes(number)) {
          document.querySelector(`a[href='pipes.php?pipe=${number}']`)?.click()
          break // Click the first available pipe and exit loop
        }
      }
    },
    guessTheFlag() {
      const imgSrc = document
        .querySelector('form .middleit img')
        .getAttribute('src')
      let country = imgSrc.split('_')[1].split('.')[0]

      const countryMap = {
        Bosnia: 'Bosnia and Herzegovina',
        Trinidad: 'Trinidad and Tobago',
        UK: 'United Kingdom',
        UAE: 'United Arab Emirates',
      }

      country = countryMap[country] || country // Use mapped value or original

      document.querySelector("input[name='country']").value = country
      document.querySelector("form input[type='submit']").click()
    },
    duckOrDive() {
      const greyDuck = document.querySelector(
        ".middleit.flex-table #eachitemdiv img[src='https://images.marapets.com/park/Duck3.png']"
      )
      const paleDuck = document.querySelector(
        ".middleit.flex-table #eachitemdiv img[src='https://images.marapets.com/park/Duck4.png']"
      )
      const blackDuck = document.querySelector(
        ".middleit.flex-table #eachitemdiv img[src='https://images.marapets.com/park/Duck2.png']"
      )

      if (paleDuck) {
        paleDuck.parentElement.parentElement.click()
      } else if (greyDuck) {
        greyDuck.parentElement.parentElement.click()
      } else if (blackDuck) {
        blackDuck.parentElement.parentElement.click()
      }
      dailies.pickRandom('.middleit.flex-table #eachitemdiv a')
    },
    cloudNine() {
      const whiteClouds = "[src='https://images.marapets.com/clouds/cloud.png']"
      const stormClouds = "[src='https://images.marapets.com/clouds/storm.png']"

      if (document.querySelectorAll(stormClouds).length) {
        dailies.pickRandom(stormClouds)
      } else {
        dailies.pickRandom(whiteClouds)
      }
    },
    guessTheWeight() {
      const weightInput = document.querySelector("input[name='weight'")
      if (weightInput) {
        weightInput.value = Math.floor(Math.random() * 100)
        document.querySelector("input[value='Guess the Weight']").click()
      }
    },
    pieThrow() {
      const playButton = document.querySelector("input[value='Play for 500MP']")

      if (playButton) {
        playButton.click()
      }

      const throwPieButtons = Array.from(
        document.querySelectorAll(
          '.maralayoutmiddle .middleit.flex-table .flex-buttons form input'
        )
      ).slice(0, 6)

      if (throwPieButtons.length > 0) {
        const randomIndex = Math.floor(Math.random() * throwPieButtons.length)
        throwPieButtons[randomIndex].click() // Click a random button from the first 6
      }
    },
    newthRacing() {
      const newth = document.getElementById('option20')
      if (newth) {
        newth.checked = true
        document.getElementById('option6').checked = true
        document.querySelector("form input[type='submit']").click()
      }
    },
    tombola() {
      const takeTicket = document.getElementById('playTombola')

      if (takeTicket) {
        setTimeout(() => {
          takeTicket.click() // Click the ticket button after 500ms
        }, 500)
      }
    },
    doubleOrNothing() {
      const coins = document.querySelectorAll("input[name='submit']")
      if (coins.length) {
        setTimeout(() => {
          coins[Math.floor(Math.random() * coins.length)].click()
        }, 2000)
      }
    },
    clickButton() {
      document.querySelector("form input[type='submit']")?.click()
    },
    christmasTree() {
      document.querySelector("input[value='Shake Tree']")?.click()
    },
    dukkaDash() {
      const startGame = document.querySelector(
        "input[value='Play for 3,000MP']"
      )

      if (startGame) {
        startGame.click() // Click the start game button if it exists
      } else {
        dailies.pickRandom('#eachitemdiv a') // Pick a random item if the start button is not found
      }
    },
    fruitMachine() {
      const button = document.getElementById('startSpin')
      if (button) {
        setTimeout(() => {
          button.click()
        }, 1200)
      }
    },
    pickRandom(selector) {
      const elements = document.querySelectorAll(selector)
      elements[Math.floor(Math.random() * elements.length)]?.click()
    },
    potOfGold() {
      document.querySelector("[value='Grab Prize']")?.click()
    },
  }

  const oneClickPaths = [
    '/ants.php',
    '/vending.php',
    '/archeology.php',
    '/rack.php',
    '/undyingfairy.php',
    '/trash.php',
    '/telescope.php',
    '/magazines.php',
    '/fishing.php',
    '/newsagent.php',
    '/gumball.php',
    '/sevenheaven.php',
    '/giganticfairy.php',
    '/sewage.php',
    '/sugarstack.php',
    '/sultan.php',
    '/darkfairy.php',
    '/graverobbing.php',
    '/jobs.php',
    '/sword.php',
  ]

  if (oneClickPaths.includes(path)) dailies.clickButton()

  if (path === '/potions.php' && POTIONS_BOUTIQUE) dailies.clickButton()

  if (path === '/potofgold.php') dailies.potOfGold()
  if (path === '/pancakes.php') dailies.pancakePile()
  if (path === '/trojan.php') dailies.guessTheFlag()
  if (path === '/pipes.php') dailies.pipeDream()
  if (path === '/cloudnine.php') dailies.cloudNine()
  if (path === '/guesstheweight.php') dailies.guessTheWeight()
  if (path === '/pie.php') dailies.pieThrow()
  if (path === '/racing.php') dailies.newthRacing()
  if (path === '/doubleornothing.php') dailies.doubleOrNothing()
  if (path === '/dash.php') dailies.dukkaDash()
  if (path === '/fruitmachine.php') dailies.fruitMachine()
  if (path === '/deal.php') dailies.duckOrDive()
  if (path === '/tree.php') dailies.christmasTree()

  if (path.includes('plushies')) document.querySelector(".machine-arcade-button").click()

  if (path.includes('tombola')) dailies.tombola()

  if (path === '/jackpot.php') dailies.pickRandom('.pyramid a')
  if (path === '/wormdigging.php') dailies.pickRandom('.wormbox input')
  if (path === '/graves.php') dailies.pickRandom('.flex-table .middleit a')
  if (path === '/nuttytree.php') dailies.pickRandom("input[type='submit']")

  const randomImgs = [
    '/giveaways.php',
    '/burst.php',
    '/multiplier.php',
    '/spooks.php',
  ]

  if (randomImgs.includes(path)) dailies.pickRandom('#eachitemdiv a')

  function timeToMilliseconds(description) {
    // Define the time units in milliseconds
    const timeUnits = {
      hour: 3600000,
      hours: 3600000,
      minute: 60000,
      minutes: 60000,
      second: 1000,
      seconds: 1000,
    }

    // Use a regular expression to match time descriptions
    const regex = /(\d+)\s*(hour|hours|minute|minutes|second|seconds)/g
    let totalMilliseconds = 0
    let match

    // Iterate over all matches in the description
    while ((match = regex.exec(description)) !== null) {
      const value = parseInt(match[1], 10)
      const unit = match[2]

      // Add the corresponding milliseconds to the total
      totalMilliseconds += value * timeUnits[unit]
    }

    return totalMilliseconds
  }
})()
