// ==UserScript==
// @name         Twitter prevent login popup
// @namespace    gaeulbyul.userscript
// @version      0.0.1.20220606000
// @description  Prevent Twitter's login popup on timeline when you are logged out.
// @author       Gaeulbyul
// @license      WTFPL
// @match        https://twitter.com/*
// @match        https://mobile.twitter.com/*
// @exclude      https://*.twitter.com/login
// @exclude      https://*.twitter.com/i/flow/login
// @exclude      https://*.twitter.com/about
// @exclude      https://*.twitter.com/download
// @exclude      https://*.twitter.com/privacy
// @exclude      https://*.twitter.com/tos
// @exclude      https://*.twitter.com/*/privacy
// @exclude      https://*.twitter.com/*/tos
// @exclude      https://*.twitter.com/i/release_notes
// @exclude      https://*.twitter.com/i/tweetdeck_release_notes
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/446098/Twitter%20prevent%20login%20popup.user.js
// @updateURL https://update.greasyfork.org/scripts/446098/Twitter%20prevent%20login%20popup.meta.js
// ==/UserScript==

void (() => {
  'use strict'

  const JSONparse = JSON.parse
  JSON.parse = function (text, reviver) {
    const result = JSONparse(text, (key, value) => {
      if (key != 'immediateReactions') {
        return value
      }
      try {
        const endpoint = value[0].value[0].cover.impressionCallbacks[0].endpoint
        if (endpoint.startsWith('/1.1/onboarding/fatigue.json')) {
          return []
        }
      } catch (err) {
        console.error(err, value)
        return value
      }
    })
    return result
  }
})()
