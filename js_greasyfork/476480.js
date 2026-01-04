// ==UserScript==
// @name         Clean Copy URL
// @namespace    https://stojanow.com/
// @version      0.2.0
// @description  Clean and copy the URL by pressing "alt+c"
// @author       Piotr Stojanow (https://github.com/psto/)
// @license      MIT
// @homepageURL  https://github.com/psto/userscript-clean-copy-url
// @supportURL   https://github.com/psto/userscript-clean-copy-url
// @icon         data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🔗</text></svg>
// @match        *://*/*
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/476480/Clean%20Copy%20URL.user.js
// @updateURL https://update.greasyfork.org/scripts/476480/Clean%20Copy%20URL.meta.js
// ==/UserScript==

(function () {
  'use strict'

  document.addEventListener('keydown', async (event) => {
    // Check if the alt and c keys are pressed
    if (event.altKey && event.code === 'KeyC') {
      // Get the current URL
      let url = window.location.href
      // Find the index of the question mark
      const index = url.indexOf('?')
      // If there is a question mark, delete everything after it
      if (index !== -1) {
        url = url.slice(0, index)
        // Replace the current URL with the new one
        window.history.replaceState(null, null, url)
        try {
          // Copy the new URL to the clipboard
          await navigator.clipboard.writeText(url)
          GM_notification(`Copied ${url}`, 'Clean Copy URL', '', null)
          // Go to the new URL
          window.location.href = url
        }
        catch (error) {
          GM_notification('Failed to copy URL', 'Clean Copy URL', '', null)
          console.error(error)
        }
        // Otherwise just copy the URL
      }
      else {
        try {
          await navigator.clipboard.writeText(url)
          GM_notification(`Copied ${url}`, 'Clean Copy URL', '', null)
        }
        catch (error) {
          GM_notification('Failed to copy URL', 'Clean Copy URL', '', null)
          console.error(error)
        }
      }
    }
  })
})()
