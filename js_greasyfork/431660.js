// ==UserScript==
// @name         Neopets: Berry picker
// @author       Tombaugh Regio
// @version      1.0
// @description  Tosses trash that you picked up
// @namespace    https://greasyfork.org/users/780470
// @match        http://www.neopets.com/medieval/pickyourown.phtml
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431660/Neopets%3A%20Berry%20picker.user.js
// @updateURL https://update.greasyfork.org/scripts/431660/Neopets%3A%20Berry%20picker.meta.js
// ==/UserScript==


//======================================

//Insert items to toss
const EXCLUDED_ITEMS = ["Pile of Dung"]

//======================================

const berryContainer = document.querySelector(".content center center")
let itemName, pickedItems

if (berryContainer.querySelector("b")) {
  itemName = berryContainer.querySelector("b").textContent.trim()
  pickedItems = Array.from(berryContainer
                           .nextSibling
                           .querySelector("center center")
                           .querySelector("table")
                           .nextSibling
                           .querySelector("center")
                           .querySelectorAll("a")
                          ).reverse()
}

for (const trash of EXCLUDED_ITEMS) {
  if (itemName == trash) pickedItems[0].click()
}