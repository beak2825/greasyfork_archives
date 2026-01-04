// ==UserScript==
// @name         Golden Dubloon clicker
// @author       Tombaugh Regio
// @version      1.0
// @description  What it says on the tin
// @namespace    https://greasyfork.org/users/780470
// @match        http://www.neopets.com/pirates/process_restaurant.phtml
// @match        http://www.neopets.com/pirates/restaurant.phtml?type=end*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431672/Golden%20Dubloon%20clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/431672/Golden%20Dubloon%20clicker.meta.js
// ==/UserScript==

const URL = document.URL

if (URL.includes("process_restaurant.phtml")) {
  window.location.reload()
}

if (URL.includes("type=end")) {
  window.location = "http://www.neopets.com/%7ESparklesRoyal"
}