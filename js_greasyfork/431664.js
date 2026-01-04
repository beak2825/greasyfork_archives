// ==UserScript==
// @name         Neopets: Diceroo
// @author       Tombaugh Regio
// @version      1.0
// @description  Keeps rerolling dice
// @namespace    https://greasyfork.org/users/780470
// @match        http://www.neopets.com/games/dicearoo.phtml
// @match       http://www.neopets.com/games/play_dicearoo.phtml
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431664/Neopets%3A%20Diceroo.user.js
// @updateURL https://update.greasyfork.org/scripts/431664/Neopets%3A%20Diceroo.meta.js
// ==/UserScript==

if (document.querySelector(`.content input[type="submit"]`)) {
  window.setTimeout(() => document.querySelector(`.content input[type="submit"]`).click(), 2000 + Math.random() * 5000)
}