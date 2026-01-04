// ==UserScript==
// @name        Ultimate Guitar - Dark Mode
// @namespace   Violentmonkey Scripts
// @match       https://tabs.ultimate-guitar.com/tab/*
// @grant       none
// @version     1.0
// @author      dutzi
// @license     MIT
// @description 12/10/2021, 7:52:36 PM
// @downloadURL https://update.greasyfork.org/scripts/436863/Ultimate%20Guitar%20-%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/436863/Ultimate%20Guitar%20-%20Dark%20Mode.meta.js
// ==/UserScript==

const interval = setInterval(() => {
  const element = Array.from(document.querySelectorAll('main article')).find(el => el.getBoundingClientRect().height > 400)
  if (!element) {
    return
  }
  
  clearInterval(interval)
  element.style.filter = 'invert(1) brightness(1) contrast(0.7)'
}, 100)
  