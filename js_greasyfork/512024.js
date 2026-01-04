// ==UserScript==
// @name        Olympics Helper
// @namespace   Marascripts
// @description Picks the best Olympic event for each pet.
// @author      marascripts
// @version     2.0.0
// @grant       none
// @match       https://www.marapets.com/competitions.php*
// @homepageURL https://github.com/marascript/userscripts
// @supportURL  https://github.com/marascript/userscripts/issues
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/512024/Olympics%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/512024/Olympics%20Helper.meta.js
// ==/UserScript==

;(async () => {
  'use strict'

  const events = document.querySelectorAll('.eachpet_box.marapets_border')

  const eventCategories = {
    olympicPoints: [0, 7, 14, 24, 28],
    au: [2, 9, 6, 25],
    bp: [4, 11, 18, 25],
    marapoints: [1, 8, 15, 22, 29],
    rp: [3, 10, 17, 24],
    dukka: [5, 12, 19, 26],
    fakeDukka: [6, 13, 20, 27],
  }

  /**
   * Set the order of the desired events
   */
  const desiredEvents = [
    ...eventCategories.au,
    ...eventCategories.olympicPoints,
    ...eventCategories.rp,
    ...eventCategories.bp,
    ...eventCategories.marapoints,
    ...eventCategories.dukka,
    ...eventCategories.fakeDukka,
  ]

  if (events.length > 0) {
    const highestLevelEvents = {
      Olympian: [],
      Ultimate: [],
      Expert: [],
      Intermediate: [],
      Beginner: [],
      Untrained: [],
    }

    // Delay to allow the page to load fully
    const timeout = Math.random() * (3500 - 2000) + 2000
    setTimeout(() => {
      events.forEach((event, index) => {
        const level = event.querySelector('.alsotry')?.innerText.split(' ')[0]
        const enterUrl = event.querySelector('a')

        // Add the event to the corresponding level category if it exists
        if (enterUrl && level in highestLevelEvents) {
          highestLevelEvents[level].push({ url: enterUrl, index })
        }
      })

      // Find the highest skill level with events
      const skillLevels = [
        'Olympian',
        'Ultimate',
        'Expert',
        'Intermediate',
        'Beginner',
        'Untrained',
      ]
      for (const level of skillLevels) {
        if (highestLevelEvents[level].length > 0) {
          // From the found events, pick the one that appears first in the desiredEvents array
          const bestEvent = highestLevelEvents[level].reduce(
            (best, current) => {
              return desiredEvents.indexOf(current.index) <
                desiredEvents.indexOf(best.index)
                ? current
                : best
            }
          )

          // Remove the default click event by setting it to null
          bestEvent.url.onclick = null

          // Simulate a click on the best event
          bestEvent.url.click()
          return // Exit after clicking the best event
        }
      }
    }, timeout)
  } else {
    const enteredPet = document.querySelector('.bigger.petpadding')
    if (enteredPet?.innerText.includes('entered')) {
      location.href = 'https://www.marapets.com/competitions.php'
    } else {
      setTimeout(() => {
        location.href = 'https://www.marapets.com/competitions.php'
      }, 100000)
    }
  }
})()
