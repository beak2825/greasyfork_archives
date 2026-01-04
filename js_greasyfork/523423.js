// ==UserScript==
// @name        Copy Websites
// @namespace   Violentmonkey Scripts
// @match       https://*.fofa.info/result*
// @grant       GM_registerMenuCommand
// @grant       GM_setClipboard
// @version     1.0
// @author      -
// @description Copy every websites display on the page to your clipboard
// @downloadURL https://update.greasyfork.org/scripts/523423/Copy%20Websites.user.js
// @updateURL https://update.greasyfork.org/scripts/523423/Copy%20Websites.meta.js
// ==/UserScript==

function copy_websites() {
  var websites = ""

  document.querySelectorAll(".hsxa-host").forEach(website => {
      websites = websites + website.children[0].href + "\n"
  })

  GM_setClipboard(websites)
}

GM_registerMenuCommand("Copy Websites",copy_websites)