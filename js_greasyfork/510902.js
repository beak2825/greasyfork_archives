// ==UserScript==
// @name        Forum Spammer
// @namespace   Marascripts
// @description Posts a random emoji every 2 minutes.
// @author      marascript
// @version     2.1.0
// @grant       GM_setValue
// @grant       GM.setValue
// @grant       GM_getValue
// @grant       GM.getValue
// @match       https://www.marapets.com/topics.php?id=*
// @homepageURL https://github.com/marascript/userscripts
// @supportURL	https://github.com/marascript/userscripts/issues
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/510902/Forum%20Spammer.user.js
// @updateURL https://update.greasyfork.org/scripts/510902/Forum%20Spammer.meta.js
// ==/UserScript==

;(async () => {
  'use strict'

  /**
   * Set to your thread ID
   */
  const MY_SPAM = 111111

  const URL = document.URL

  if (URL.includes(`id=${MY_SPAM}`) && URL.includes('fid=20')) {
    const MAX_TIME_TO_WAIT = 125000
    const MIN_TIME_TO_WAIT = 70000
    const TIMEOUT =
      Math.random() * (MAX_TIME_TO_WAIT - MIN_TIME_TO_WAIT) + MIN_TIME_TO_WAIT

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
    }

    const lastEmoticon = await gm.getValue('lastEmoji', '')

    setTimeout(() => {
      const emoticons = Array.from(
        document.querySelectorAll('.postmessage_emoticons a')
      )

      // Shuffle the emoticons array
      const shuffledEmoticons = emoticons.sort(() => Math.random() - 0.5)

      // Find the first emoticon that is different from the last used
      const selectedEmoticon = shuffledEmoticons.find((emoticon) => {
        const emojiType = emoticon.getAttribute('onclick')
        return emojiType !== lastEmoticon
      })

      // Click the selected emoticon and send the message if found
      if (selectedEmoticon) {
        const emojiType = selectedEmoticon.getAttribute('onclick')
        selectedEmoticon.click()
        gm.setValue('lastEmoji', emojiType)

        const sendButton = document.querySelector(
          '.postmessage_button.forums_sendbutton input'
        )
        sendButton?.click() // Safely click send button if it exists
      }
    }, TIMEOUT)
  }
})()
