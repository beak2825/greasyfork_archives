// ==UserScript==
// @name         Twitch Channel Points Clicker
// @namespace    https://bengrant.dev
// @version      0.2
// @description  Auto-click the channel point bonus buttons
// @author       Ben Grant
// @match        https://www.twitch.tv/*
// @icon         http://www.google.com/s2/favicons?domain=twitch.tv
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463605/Twitch%20Channel%20Points%20Clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/463605/Twitch%20Channel%20Points%20Clicker.meta.js
// ==/UserScript==

window.setInterval(() => {
  if (document.querySelector('[aria-label="Claim Bonus"]')) {
    document.querySelector('[aria-label="Claim Bonus"]').click()

    const counterEl = document.querySelector('#twitch-point-counter')
    if (counterEl) {
      // Update counter
      const collected = parseInt(counterEl.dataset.collected)+1
      counterEl.innerHTML = `${collected} collected`
      counterEl.dataset.collected = collected
    } else {
      // Create counter element
      const counter = document.createElement('span')
      counter.id = 'twitch-point-counter'
      counter.style.fontSize = '.8em'
      counter.style.display = 'flex'
      counter.style.alignItems = 'center'
      counter.style.padding = '0 .5em'
      counter.style.opacity = '.6'
      counter.dataset.collected = 1
      counter.append(document.createTextNode(`1 collected`))

      // Append
      document.querySelector('[data-test-selector="chat-input-buttons-container"] div:first-child').append(counter)
    }
  }
}, 60 * 1000) // Every minute
