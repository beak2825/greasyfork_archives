// ==UserScript==
// @name        Better Scratchcards
// @namespace   Marascripts
// @description Improves scratchcards by adding a "Next Card" link.
// @author      marascript
// @version     2.2.0
// @grant       GM.setValue
// @grant       GM_setValue
// @grant       GM.getValue
// @grant       GM_getValue
// @grant       GM.deleteValue
// @grant       GM_deleteValue
// @match       https://www.marapets.com/scratchcards*
// @homepageURL https://github.com/marascript/userscripts
// @supportURL	https://github.com/marascript/userscripts/issues
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/510332/Better%20Scratchcards.user.js
// @updateURL https://update.greasyfork.org/scripts/510332/Better%20Scratchcards.meta.js
// ==/UserScript==

;(async () => {
  'use strict'

  /**
   * ? Set to true if you have the giftbox
   */
  const DUKKA_GIFTBOX = false
  const AUTO_REFRESH = false

  const gm = {
    /**
     * Gets a saved GM value - [GM.getValue](https://wiki.greasespot.net/GM.setValue)
     * @param {string} name Name of the saved key
     * @param {*} [defaultValue] Default value if not set
     * @returns {Promise} Use `await` to read value
     */
    async getValue(name, defaultValue) {
      return await (typeof GM_getValue === 'function'
        ? GM_getValue
        : GM.getValue)(name, defaultValue)
    },

    /**
     * GM_setValue/GM.setValue wrapper - [GM.setValue](https://wiki.greasespot.net/GM.setValue)
     * @param {string} name The name of the key to set
     * @param {*} value What to set the value too
     * @returns {Promise}
     */
    async setValue(name, value) {
      return await (typeof GM_setValue === 'function'
        ? GM_setValue
        : GM.setValue)(name, value)
    },

    /**
     * Deletes a saved GM value - [GM.deleteValue](https://wiki.greasespot.net/GM.deleteValue)
     * @param {string} name The key to delete
     * @returns {Promise}
     */
    async deleteValue(name) {
      return await (typeof GM_deleteValue === 'function'
        ? GM_deleteValue
        : GM.deleteValue)(name)
    },

    /**
     * Creates a new `a` tag element.
     * @todo Only uses innerHTML, href, and id
     * @param {Object} settings - Any `a` tag attributes
     * @returns {HTMLAnchorElement}
     */
    makeLinkElement(settings) {
      const link = document.createElement('a')
      link.innerHTML = settings.innerHTML
      link.href = settings.href

      return link
    },

    /**
     * Picks a random element from an array
     * @param {Array} array
     * @returns
     */
    pickRandom(array) {
      return array[Math.floor(Math.random() * array.length)]
    },

    scrollToCard() {
      document.querySelector('.scratchcard_outside').scrollIntoView()
    },

    /**
     * Injects a script tag into the DOM, allows using websites own functions
     * @param {Function} fn Function to run
     */
    exec(fn) {
      const script = document.createElement('script')
      script.setAttribute('type', 'application/javascript')
      script.textContent = `(${fn})()`

      const body = document.body
      body.appendChild(script)
      body.removeChild(script)
    },
  }

  const comebackBox = document.querySelector('.middleit.comebackbox b')
  if (AUTO_REFRESH && comebackBox) {
    const path = location.pathname
    const milleseconds = timeToMilliseconds(comebackBox.textContent)
    const timeout =
      Math.random() * (milleseconds + 75000 - milleseconds) + milleseconds
    setTimeout(() => {
      location.href = `https://www.marapets.com${path}`
    }, timeout)
  }

  if (document.querySelector('.scratchcard_outside')) {
    const currentCard = cardIdFromUrl()
    const allCards = await gm.getValue('scratchcards')
    const nextCards = allCards.filter((card) => card !== currentCard)

    gm.setValue('scratchcards', nextCards)

    cleanScratchcard()

    gm.exec(() => {
      scratched = 15
      callback()
    })

    gm.scrollToCard()

    nextCardButton()
  } else {
    buyScratchcard()
    gm.deleteValue('scratchcards')
    const scratchcardIds = getCardIds()
    gm.setValue('scratchcards', scratchcardIds)
  }

  function cardIdFromUrl() {
    const url = document.URL
    if (url.includes('scratch')) {
      return url.split('scratch=')[1]
    } else {
      return null
    }
  }

  function cleanScratchcard() {
    const scratchcardContainer = document.querySelector('.scratchcard_flex')
    scratchcardContainer.style.display = 'block'
    scratchcardContainer.style.minWidth = 'auto'

    document.querySelector('.scratchcard_gridbox').parentElement.style.display =
      'none'
  }

  async function nextCardButton() {
    const cardId = gm.pickRandom(await gm.getValue('scratchcards'))
    if (cardId) {
      const nextCardLink = gm.makeLinkElement({
        innerHTML: 'Next Card >',
        href: `https://www.marapets.com${location.pathname}?scratch=${cardId}`,
      })

      nextCardLink.style.color = 'white'
      nextCardLink.style.fontWeight = 'bold'
      nextCardLink.style.fontSize = '2em'

      document.querySelector('.scratchcard_outside').appendChild(nextCardLink)
    }
  }

  function buyScratchcard() {
    if (location.pathname === '/scratchcards.php' || DUKKA_GIFTBOX) {
      document.querySelector("form input[type='submit']")?.click()
    }
  }

  function getCardIds() {
    const scratchcardImgs = document.querySelectorAll(
      '.middleit.flex-table .fixborders img'
    )

    if (scratchcardImgs.length) {
      let scratchcards = []
      scratchcardImgs.forEach((card) => {
        card.parentElement.setAttribute('onclick', '')
        scratchcards.push(card.parentElement.href.split('scratch=')[1])
      })
      return scratchcards
    } else {
      return null
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
