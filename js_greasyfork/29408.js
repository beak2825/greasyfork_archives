// ==UserScript==
// @name         macroplay
// @description  [MACRO-FEED-PLAY]
// @match        http://petridish.pw/ru/
// @match        http://petridish.pw/en/
// @match        http://petridish.pw/fr/
// @version 0.0.1.20170505075122
// @namespace https://greasyfork.org/users/120655
// @downloadURL https://update.greasyfork.org/scripts/29408/macroplay.user.js
// @updateURL https://update.greasyfork.org/scripts/29408/macroplay.meta.js
// ==/UserScript==
/**Thx for install!**/

(function() {
var amount = 16;
var duration = 20; //ms

var overwriting = function(evt) {
if (evt.keyCode === 90) { // KEY_Z
for (var i = 0; i < amount; ++i) {
setTimeout(function() {
window.onkeydown({keyCode: 32}); // KEY_SPACE
window.onkeyup({keyCode: 32});
}, i * duration);
}
}
};

window.addEventListener('keydown', overwriting);
})();
