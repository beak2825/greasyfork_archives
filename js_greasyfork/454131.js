// ==UserScript==
// @name        Fix source dropdown menu
// @namespace   kawa.tf
// @match       *://*.japaneseasmr.com/*
// @grant       none
// @version     1.1.0
// @author      Tilwa Qendov
// @description When loading a previously visited page, the website won't display the selected media source. You need to select another source and then reselect the source you wanted, in order for it to show the media. This user script fixes that bug
// @license     Artistic-2.0
// @downloadURL https://update.greasyfork.org/scripts/454131/Fix%20source%20dropdown%20menu.user.js
// @updateURL https://update.greasyfork.org/scripts/454131/Fix%20source%20dropdown%20menu.meta.js
// ==/UserScript==

const MAX_ATTEMPTS = 10
const RETRY_INTERVAL = 1000
const DROPDOWN_ID = 'selectSource'
const SOURCE_IDS = ['audioplayer', 'cleanp_audio', 'dl_links']

function checkDropdown() {
  let dropdown = document.getElementById(DROPDOWN_ID)
  if (dropdown !== null) {
    dropdown.dispatchEvent(new Event('change'))
    console.log("fix-dropdown-menu: Sent an update to the dropdown menu.")
  }
}

function aSourceIsVisible() {
  return !SOURCE_IDS.every(x => document.getElementById(x).style.display === "none")
}

console.log("fix-dropdown-menu: Started")

// Execute 10 times, once every second
let count = 0
let doIt = () => {
  count++
  checkDropdown()
  if (aSourceIsVisible()) {
    console.log("fix-dropdown-menu: The selected source should now be visible.")
    return
  }
  if (count === MAX_ATTEMPTS) {
    console.log(`fix-dropdown-menu: ${MAX_ATTEMPTS} attempts were made to update the dropdown without success.`)
    return
  }
  setTimeout(doIt, RETRY_INTERVAL)
}

doIt()