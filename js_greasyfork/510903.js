// ==UserScript==
// @name        Hospital Auto
// @namespace   Marascripts
// @description Cures all pets at the hospital.
// @author      marascript
// @version     2.0.2
// @grant       none
// @match       https://www.marapets.com/hospital.php*
// @match       https://www.marapets.com/elekafountain.php*
// @match       https://www.marapets.com/rollercoaster.php*
// @homepageURL https://github.com/marascript/userscripts
// @supportURL	https://github.com/marascript/userscripts/issues
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/510903/Hospital%20Auto.user.js
// @updateURL https://update.greasyfork.org/scripts/510903/Hospital%20Auto.meta.js
// ==/UserScript==

;(async () => {
  'use strict'

  // If pet gets sick during dailies, go to hospital
  if (
    location.pathname !== '/hospital.php' &&
    document.querySelector('div.specialpet.fadepet')
  ) {
    location.href = 'https://www.marapets.com/hospital.php'
  } else {
    document.querySelector("input[value='Select All Pets']")?.click()
    document.querySelector("input[value='Cure Pets']")?.click()
  }
})()
