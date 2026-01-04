// ==UserScript==
// @name        Danger Dailies
// @namespace   Marascripts
// @description Automatically choose which pet to use on dailies.
// @author      marascript
// @version     1.2.4
// @grant       none
// @match       https://www.marapets.com/elekafountain.php*
// @match       https://www.marapets.com/pond.php?i_id=*
// @match       https://www.marapets.com/rollercoaster.php*
// @match       https://www.marapets.com/sewerpipes.php*
// @match       https://www.marapets.com/whirlpool.php*
// @match       https://www.marapets.com/portal.php*
// @match       https://www.marapets.com/icecaves.php*
// @match       https://www.marapets.com/guillotine.php*
// @match       https://www.marapets.com/statue.php*
// @match       https://www.marapets.com/reservoir.php*
// @match       https://www.marapets.com/pixie.php*
// @match       https://www.marapets.com/genie.php*
// @match       https://www.marapets.com/candytree.php*
// @match       https://www.marapets.com/elger.php*
// @match       https://www.marapets.com/krampus.php*
// @homepageURL https://github.com/marascript/userscripts
// @supportURL	https://github.com/marascript/userscripts/issues
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/510341/Danger%20Dailies.user.js
// @updateURL https://update.greasyfork.org/scripts/510341/Danger%20Dailies.meta.js
// ==/UserScript==

;(async () => {
  'use strict'

  // Set to true try to do dailies when available again
  // ! Must leave the tab open!
  const AUTO_REFRESH = false

  // Set to the pet you use most, all dailies will use them
  // Set any setting to null to turn off for that daily
  const DEFAULT_PET = 1111111

  // Dangerous - Species and costume transformations
  const OPERATIONS_PORTAL = DEFAULT_PET
  const WHIRLPOOL = DEFAULT_PET
  const FOXFIRE_POND = DEFAULT_PET

  // Less dangerous - Costume transformations
  const VORTEX_RESERVOIR = DEFAULT_PET
  const GUILLOTINE = DEFAULT_PET

  const SEWER_PIPES = DEFAULT_PET
  const ELEKA_FOUNTAIN = DEFAULT_PET
  const MURFIN_MADNESS = DEFAULT_PET
  const ICE_CAVES = DEFAULT_PET
  const SIMERIAN_STATUE = DEFAULT_PET
  const PIXIE_DICE = DEFAULT_PET
  const GENIE = DEFAULT_PET

  // Seasonal events
  // ! Untested
  const ELGER = DEFAULT_PET
  const CANDY_TREE = DEFAULT_PET
  const KRAMPUS = DEFAULT_PET

  // Reload the page a max of 20 minutes, minimum of 15 minutes
  const comebackBox = document.querySelector('.middleit.comebackbox b')
  if (AUTO_REFRESH && comebackBox) {
    const milleseconds = timeToMilliseconds(comebackBox.textContent)
    const timeout =
      Math.random() * (milleseconds + 75000 - milleseconds) + milleseconds
    setTimeout(() => {
      location.href = `https://www.marapets.com${location.pathname}`
    }, timeout)
  } else {
    const petTable = document.querySelectorAll('.pets_show_each')

    if (petTable.length) {
      const URL_PETS = {
        '/elekafountain.php': ELEKA_FOUNTAIN,
        '/pond.php': FOXFIRE_POND,
        '/rollercoaster.php': MURFIN_MADNESS,
        '/sewerpipes.php': SEWER_PIPES,
        '/whirlpool.php': WHIRLPOOL,
        '/portal.php': OPERATIONS_PORTAL,
        '/icecaves.php': ICE_CAVES,
        '/guillotine.php': GUILLOTINE,
        '/statue.php': SIMERIAN_STATUE,
        '/reservoir.php': VORTEX_RESERVOIR,
        '/pixie.php': PIXIE_DICE,
        '/genie.php': GENIE,
        '/elger.php': ELGER,
        '/candytree.php': CANDY_TREE,
        '/krampus.php': KRAMPUS,
      }

      const pet =
        URL_PETS[
          Object.keys(URL_PETS).filter((key) => key.includes(location.pathname))
        ]

      petTable.forEach((petImg) => {
        const href = petImg.querySelector('a').href
        if (href.includes(pet)) {
          location.href = href
        }
      })
    }
  }

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
