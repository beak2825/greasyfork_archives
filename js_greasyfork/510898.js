// ==UserScript==
// @name        Feeding Easier
// @namespace   Marascripts
// @description Only shows available hungry things
// @author      marascript
// @version     3.1.0
// @grant       GM.setValue
// @grant       GM.getValue
// @match       https://www.marapets.com/aquarium.php*
// @match       https://www.marapets.com/humpracing.php*
// @match       https://www.marapets.com/knutthouse.php*
// @match       https://www.marapets.com/robots.php*
// @match       https://www.marapets.com/elekaprison.php*
// @match       https://www.marapets.com/favourites.php
// @match       https://www.marapets.com/quest_games.php
// @homepageURL https://github.com/marascript/userscripts
// @supportURL	https://github.com/marascript/userscripts/issues
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/510898/Feeding%20Easier.user.js
// @updateURL https://update.greasyfork.org/scripts/510898/Feeding%20Easier.meta.js
// ==/UserScript==

/**
 * TODO: Account for seconds
 * TODO: Remove old values
 * TODO: Grey out if fed
 */

;(async () => {
  'use strict'

  if (
    location.pathname === '/quest_games.php' ||
    location.pathname === '/favourites.php'
  ) {
    addCountdown('/aquarium.php')
    addCountdown('/humpracing.php')
    addCountdown('/knutthouse.php')
    addCountdown('/robots.php')
    addCountdown('/elekaprison.php')
  }

  async function addCountdown(questPath) {
    const quest = document.querySelector(
      `.gamespage_flextable [href="https://www.marapets.com${questPath}"]`
    )
    const nextTimestamp = await GM.getValue(questPath)
    const timeUntilReset = getMinutesUntil(nextTimestamp)

    if (timeUntilReset > 0) {
      quest.insertAdjacentHTML(
        'beforeend',
        `
        <div class="gamespage_eachbox_comebackbar gamespage_eachbox_everybar">
          <div class="flex-auto text-center returnto strong ghost petpadding">
          <b class="ghost returnto gametimeout" data-gamestamp="${nextTimestamp}">${timeUntilReset} minutes left</b>
          </div>
  
          <div class="gamespage_eachbox_comebackmaxbar"></div>
        </div>
        `
      )
    }
  }

  function getMinutesUntil(timestamp) {
    const now = Math.floor(Date.now() / 1000)
    const differenceInSeconds = timestamp - now
    const minutesUntil = Math.max(Math.floor(differenceInSeconds / 60), 0) // Ensures non-negative minutes

    return minutesUntil
  }

  function getNextTimestamp() {
    const timeString = document.querySelector(
      '.middleit.comebackbox b'
    )?.textContent
    const minutes = parseInt(timeString.split(' ')[0])

    const now = new Date()
    GM.setValue(
      location.pathname,
      Math.round((now.getTime() + minutes * 60000) / 1000)
    )
  }

  const path = location.pathname
  const isAquariumOrRobots = [
    '/aquarium.php',
    '/robots.php',
    '/elekaprison.php',
  ].includes(path)

  const isHumpracingOrKnutthouse =
    path === '/humpracing.php' || path === '/knutthouse.php'

  if (isAquariumOrRobots) {
    getNextTimestamp()

    const allOptions = document.querySelectorAll('#eachitemdiv.fadeit2')
    allOptions.forEach((option) => option.remove())
  }

  if (isHumpracingOrKnutthouse) {
    getNextTimestamp()

    const fedPets = document.querySelectorAll('.fadeit2')
    fedPets.forEach((pet) => {
      const parent = pet.parentElement
      if (parent) {
        const grandparent = parent.parentElement
        grandparent?.remove() // Safe removal in case grandparent doesn't exist
      }
    })
  }
})()
