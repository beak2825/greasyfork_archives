// ==UserScript==
// @name        Toggle Auto Follow
// @namespace   Jummbox Scripts
// @match       https://ultraabox.github.io/
// @match       https://aurysystem.github.io/goldbox/
// @match       https://jummb.us/
// @grant       GM_notification
// @version     1.4.1
// @author      PlanetBluto
// @description Quickly toggle the 'Keep Current Pattern Selected' preference by pressing SHIFT + G
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/481182/Toggle%20Auto%20Follow.user.js
// @updateURL https://update.greasyfork.org/scripts/481182/Toggle%20Auto%20Follow.meta.js
// ==/UserScript==

const print = console.log

var inited = false

var toggleFunc = (elem, key) => {
    elem.value = key
    elem.dispatchEvent(new Event("change"))

    print(localStorage.getItem(key))
    GM_notification({"text": `switched to ${localStorage.getItem(key)}`, silent: true})
}

var int = setInterval(() => {
  var selectElem = document.querySelector(".selectContainer.menu.preferences > select")
  if (selectElem) {
    clearInterval(int)

    document.addEventListener("keydown", e => {
      if (e.which == 71 && e.shiftKey == true) {
        toggleFunc(selectElem, "autoFollow")
      }
    })
  }
}, 10)