// ==UserScript==
// @name        Remove Bottom Text Content (Jummbox No Scroll)
// @namespace   Violentmonkey Scripts
// @match       https://ultraabox.github.io/
// @match       https://aurysystem.github.io/goldbox/
// @match       https://jummb.us/
// @grant       none
// @version     1.0.1
// @author      PlanetBluto
// @description Removes the text content under the editor, which removes the scrollbar on the page in most layouts
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/481184/Remove%20Bottom%20Text%20Content%20%28Jummbox%20No%20Scroll%29.user.js
// @updateURL https://update.greasyfork.org/scripts/481184/Remove%20Bottom%20Text%20Content%20%28Jummbox%20No%20Scroll%29.meta.js
// ==/UserScript==

var int = setInterval(() => {
  var Description = document.getElementById("text-content")
  if (Description) {
    Description.remove()
    clearInterval(int)
  }
}, 10)