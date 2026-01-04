// ==UserScript==
// @name        Upside down screen - bonk.io
// @namespace   UnmatchedBracket
// @match       https://bonk.io/gameframe-release.html
// @grant       none
// @version     1.0
// @author      UnmatchedBracket
// @description Turns the entire UI upside down.
// @license     The Unlicense
// @downloadURL https://update.greasyfork.org/scripts/451393/Upside%20down%20screen%20-%20bonkio.user.js
// @updateURL https://update.greasyfork.org/scripts/451393/Upside%20down%20screen%20-%20bonkio.meta.js
// ==/UserScript==

style = document.createElement("style")
style.innerHTML = "#newbonkgamecontainer, #mainmenuelements{transform-origin: center;transform: rotate(180deg);}"
document.head.appendChild(style)