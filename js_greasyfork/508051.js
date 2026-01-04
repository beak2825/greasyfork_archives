// ==UserScript==
// @name          Keycode Alert
// @namespace     http://tampermonkey.net/
// @version       0.1
// @description   Shows Keycode of Any key clicked
// @author        TTT
// @match         *://*/*
// @grant         none
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/508051/Keycode%20Alert.user.js
// @updateURL https://update.greasyfork.org/scripts/508051/Keycode%20Alert.meta.js
// ==/UserScript==

document.addEventListener("keydown", function(event) {
  alert("Keycode: " + event.keyCode);
});