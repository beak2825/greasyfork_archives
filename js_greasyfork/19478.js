// ==UserScript==
// @name FaahriTAMVAN
// @namespace http://www.facebook.com/j13081991/
// @version 1.1
// @description splitter
// @author Faahri Tamvan
// @match http://bubble.am/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/19478/FaahriTAMVAN.user.js
// @updateURL https://update.greasyfork.org/scripts/19478/FaahriTAMVAN.meta.js
// ==/UserScript==

(function() {
var amount = 4;
var duration = 50;//ms

var overwriting = function(evt) {
if (evt.keyCode === 83) { // KEY_S
for (var i = 0; i < amount; ++i) {
setTimeout(function() {
window.onkeydown({keyCode: 32}); // KEY_space
window.onkeyup({keyCode: 32});
}, i * duration);
}
}
};
var amount = 4;
var duration = 50;//ms

window.addEventListener('keydown', overwriting);
})();

(function() {
var amount = 6;
var duration = 75; //ms
var overwriting = function(evt) {
if (evt.keyCode === 69) { // KEY_E
for (var i = 0; i < amount; ++i) {
setTimeout(function() {
window.onkeydown({keyCode: 87}); // KEY_W
window.onkeyup({keyCode: 87});
}, i * duration);
}
}
};
window.addEventListener('keydown', overwriting);
})();//