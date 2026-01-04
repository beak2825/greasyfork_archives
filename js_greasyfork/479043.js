// ==UserScript==
// @name        RemovePopUp For Un-Formal - deepl.com
// @namespace   Violentmonkey Scripts
// @match       https://www.deepl.com/translator
// @grant       none
// @version     1.0
// @author      -
// @description 04/11/2023 19:30:48
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/479043/RemovePopUp%20For%20Un-Formal%20-%20deeplcom.user.js
// @updateURL https://update.greasyfork.org/scripts/479043/RemovePopUp%20For%20Un-Formal%20-%20deeplcom.meta.js
// ==/UserScript==

window.onload = function () {
  document.getElementsByClassName('flex items-center gap-x-3')[0].innerHTML += '<button class="StartFreeTrialButton-module--startFreeTrialButton--vWcYR" onclick="document.getElementsByClassName(`absolute inset-0 z-20`)[0].style.visibility = `hidden`">Remove Pop-Up</button>';
}