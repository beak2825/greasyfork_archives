// ==UserScript==
// @name       YouTube HTML5 AutoPause
// @namespace  https://github.com/sunaku
// @version    0.1.1
// @description  Automatically pause YouTube HTML5 videos when they appear.
// @match      https://*.youtube.com/watch*
// @match      http://*.youtube.com/watch*
// @copyright  2014 Suraj N. Kurapati
// @downloadURL https://update.greasyfork.org/scripts/4944/YouTube%20HTML5%20AutoPause.user.js
// @updateURL https://update.greasyfork.org/scripts/4944/YouTube%20HTML5%20AutoPause.meta.js
// ==/UserScript==

var buttons = document.getElementsByClassName("ytp-play-button");
for (var i in buttons) {
    buttons[i].click();
}