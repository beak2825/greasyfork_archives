
// ==UserScript==
// @name         Mope Adblock
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Adblock For Mope.io.
// @author       Jerry
// @description  Adblock For Mope.io.
// @match        https://mope.io/
// @icon         https://www.google.com/s2/favicons?domain=mope.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/437896/Mope%20Adblock.user.js
// @updateURL https://update.greasyfork.org/scripts/437896/Mope%20Adblock.meta.js
// ==/UserScript==

window.addEventListener('load', function() {
document.getElementsByClassName('Home__play')[0].addEventListener("click", function() {
$bus.emit($bus.EVENTS.END_VIDEO_AD)
});
setInterval(function () {$bus.emit($bus.EVENTS.HIDE_ALL_ADS)}, 100);

})();