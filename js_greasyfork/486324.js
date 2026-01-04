// ==UserScript==
// @name        Scroll to Top
// @namespace   Marascripts
// @description Adds scroll to top button + bonus hiding unavailable games.
// @author      marascript
// @version     1.2.1
// @grant       none
// @match       https://www.marapets.com/*
// @exclude     https://www.marapets.com/*/game.php*
// @exclude     https://www.marapets.com/maratalk*
// @homepageURL https://github.com/marascript/userscripts
// @supportURL	https://github.com/marascript/userscripts/issues
// @license     MIT
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/486324/Scroll%20to%20Top.user.js
// @updateURL https://update.greasyfork.org/scripts/486324/Scroll%20to%20Top.meta.js
// ==/UserScript==

;(async () => {
  'use strict'

  // Set to true to hide unavailable games on games page
  const HIDE_UNAVAILABLE = false

  if (HIDE_UNAVAILABLE) {
    document.getElementById('buttonhideun')?.click()
  }

  const toTopButton = document.createElement('a')
  toTopButton.innerText = '⬆️'
  toTopButton.style.cursor = 'pointer'
  toTopButton.style.fontSize = '3em'

  // Anchor to bottom of page
  toTopButton.style.position = 'fixed'
  toTopButton.style.bottom = '5%'
  toTopButton.style.right = '2%'

  // Make button slightly opaque until hover
  toTopButton.style.opacity = 0.25
  toTopButton.onmouseenter = () => (toTopButton.style.opacity = 1)
  toTopButton.onmouseleave = () => (toTopButton.style.opacity = 0.25)

  // Scroll to top, without modifying URL
  toTopButton.onclick = () => window.scrollTo(0, 0)

  document.querySelector('body').appendChild(toTopButton)
})()
