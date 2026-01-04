// ==UserScript==
// @name         Neopets: Tyrannian Concert Hall redirect
// @author       Tombaugh Regio
// @version      1.0
// @description  Replaces rebuy button with a link to the concert hall
// @namespace    https://greasyfork.org/users/780470
// @match        http://www.neopets.com/prehistoric/ticketbooth.phtml?type=thanks
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/431663/Neopets%3A%20Tyrannian%20Concert%20Hall%20redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/431663/Neopets%3A%20Tyrannian%20Concert%20Hall%20redirect.meta.js
// ==/UserScript==

const ticketButton = document.querySelector('input[value="Buy a Ticket!  Only 1250 NP"]')

ticketButton.value = "Go to the concert"
ticketButton.onclick = function() {
  GM_openInTab("http://www.neopets.com/prehistoric/concerthall.phtml")
  return false
}