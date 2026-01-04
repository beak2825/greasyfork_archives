// ==UserScript==
// @name        Disable Javascript On Site
// @namespace   Violentmonkey Scripts
// @description Disables javascript on site
// @grant       none
// @version     1.1
// @include     *steamcommunity.com*
// @author      -
// @description 19/06/2022 14:30:47
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/461781/Disable%20Javascript%20On%20Site.user.js
// @updateURL https://update.greasyfork.org/scripts/461781/Disable%20Javascript%20On%20Site.meta.js
// ==/UserScript==


for (key in getEventListeners(document)) {
  getEventListeners(document)[key].forEach(function(c) {
    c.remove()
  })   
}