// ==UserScript==
// @name        TV Tropes Spoilers
// @namespace   org.tvtropes
// @include     http://tvtropes.org/*
// @version     1.0
// @grant       none
// @description Enable "Show Spoilers" control on every page
// @downloadURL https://update.greasyfork.org/scripts/12347/TV%20Tropes%20Spoilers.user.js
// @updateURL https://update.greasyfork.org/scripts/12347/TV%20Tropes%20Spoilers.meta.js
// ==/UserScript==
window.addEventListener('load', Greasemonkey_main, false);
function Greasemonkey_main() {
  document.getElementsByClassName('onoffswitch') [0].click();
}