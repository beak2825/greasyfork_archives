// ==UserScript==
// @name        RUTracker Improvements
// @namespace   Violentmonkey Scripts
// @match       https://rutracker.org/forum/viewtopic.php*
// @grant       none
// @version     0.1
// @author      Gum Coblin
// @license     GPLv2
// @description 25/4/2024, 11:17:28
// @downloadURL https://update.greasyfork.org/scripts/493497/RUTracker%20Improvements.user.js
// @updateURL https://update.greasyfork.org/scripts/493497/RUTracker%20Improvements.meta.js
// ==/UserScript==

function getHash(){
  const maglink = document.getElementsByClassName("magnet-link")[0].href.substring(20,60)
  console.log(maglink)
  const ad = document.getElementsByClassName("dl-btn-text-ad")[0].children[0]
  ad.text = "BTDigg"
  ad.href = "https://btdig.com/" + maglink
}

setTimeout(getHash(), 2000)