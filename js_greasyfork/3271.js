// ==UserScript==
// @name        Fix chess.com analysis board for tabs
// @namespace   http://xyxyx.org/
// @description Move the movelist back to the left on the analysis board, so that it is useable when forced into a tab
// @include     http://www.chess.com/echess/analysis*
// @version     0.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/3271/Fix%20chesscom%20analysis%20board%20for%20tabs.user.js
// @updateURL https://update.greasyfork.org/scripts/3271/Fix%20chesscom%20analysis%20board%20for%20tabs.meta.js
// ==/UserScript==

document.getElementsByClassName("sidebar right right-12").item(0).style.cssFloat = 'left'