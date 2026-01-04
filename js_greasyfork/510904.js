// ==UserScript==
// @name        Automated Banking
// @namespace   Marascripts
// @description Collects interest, fills in a pin
// @author      marascript
// @version     2.0.1
// @grant       none
// @match       https://www.marapets.com/rpbank.php*
// @match       https://www.marapets.com/bpbank.php*
// @match       https://www.marapets.com/bank.php*
// @match       https://www.marapets.com/atm.php*
// @homepageURL https://github.com/marascript/userscripts
// @supportURL	https://github.com/marascript/userscripts/issues
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/510904/Automated%20Banking.user.js
// @updateURL https://update.greasyfork.org/scripts/510904/Automated%20Banking.meta.js
// ==/UserScript==

;(async () => {
  'use strict'

  const path = location.pathname

  if (path === '/atm.php') {
    // Pin doesn't actually matter, just use 1111
    document
      .querySelectorAll("input[name='pin']")
      ?.forEach((input) => (input.value = 1111))
  } else {
    // If we can collect interest, collect it
    document
      .querySelector(".middleit.bigger form input[type='submit']")
      ?.click()

    // After collecting interest, return to bank
    if (document.querySelector('.example_email')) {
      location.href = path
    }
  }
})()
