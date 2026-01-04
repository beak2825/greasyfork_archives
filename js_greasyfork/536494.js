// ==UserScript==
// @name        Automatically read full article
// @namespace   https://doubly.so/user-scripts
// @match       https://www.realclearscience.com/*
// @match       https://www.realclearpolitics.com/*
// @match       https://www.realclearpolicy.com/*
// @match       https://www.realcleardefence.com/*
// @match       https://www.realclearworld.com/*
// @grant       none
// @version     1.0
// @author      Devin Bayer <dev@doubly.so>
// @license     MIT
// @description 19/05/2025, 13.47.01
// @downloadURL https://update.greasyfork.org/scripts/536494/Automatically%20read%20full%20article.user.js
// @updateURL https://update.greasyfork.org/scripts/536494/Automatically%20read%20full%20article.meta.js
// ==/UserScript==

$ = (q) => document.querySelector(q)

if (! window.location.hash) {
  console.info('user script - auto read')
  window.location.hash = 'auto-read-full'
  $('.more-link a').click()
} else {
  console.log('user script - skipping auto read due to reload / back button')
}

