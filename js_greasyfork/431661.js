// ==UserScript==
// @name         Neopets: Symol hole diver
// @author       Tombaugh Regio
// @version      1.0
// @description  Refreshes page after petpet has finished its adventure
// @namespace    https://greasyfork.org/users/780470
// @match        http://www.neopets.com/medieval/symolhole.phtml
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431661/Neopets%3A%20Symol%20hole%20diver.user.js
// @updateURL https://update.greasyfork.org/scripts/431661/Neopets%3A%20Symol%20hole%20diver.meta.js
// ==/UserScript==


function symolHoleDiver() {
  const symolHoleContainer = document.querySelector(".symolhole_content")

  if (symolHoleContainer.textContent.includes("do the same tomorrow")) {
    window.location.reload()

  } else if (document.querySelector("#enterhole")) {
    document.querySelector("#enterhole").click()
  }
   
  window.setTimeout(symolHoleDiver, 1000)
}

symolHoleDiver()