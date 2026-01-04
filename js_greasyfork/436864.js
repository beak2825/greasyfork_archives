// ==UserScript==
// @name        Clear Console using Cmd+K
// @namespace   Violentmonkey Scripts
// @match       http*://*.*/*
// @grant       none
// @version     1.0
// @author      dutzi
// @license     MIT
// @description 12/10/2021, 8:13:24 PM
// @downloadURL https://update.greasyfork.org/scripts/436864/Clear%20Console%20using%20Cmd%2BK.user.js
// @updateURL https://update.greasyfork.org/scripts/436864/Clear%20Console%20using%20Cmd%2BK.meta.js
// ==/UserScript==

window.addEventListener('keydown', (e) => {
  if (e.key === 'k' && e.metaKey) {
    console.clear()
  }
})