// ==UserScript==
// @name        Unlike all Tweets on Profile
// @namespace   Violentmonkey Scripts
// @match       *://twitter.com/*/likes
// @grant       none
// @version     1.0
// @author      -
// @description 4/18/2020, 9:15:48 PM
// @downloadURL https://update.greasyfork.org/scripts/402535/Unlike%20all%20Tweets%20on%20Profile.user.js
// @updateURL https://update.greasyfork.org/scripts/402535/Unlike%20all%20Tweets%20on%20Profile.meta.js
// ==/UserScript==

setInterval(() => {
  for (const d of document.querySelectorAll('div[data-testid="like"]')) {
    d.click()
  }
  for (const df of document.querySelectorAll('div[data-testid="unlike"]')) {
    df.click()
  }
window.location.reload()
}, 10000)
h