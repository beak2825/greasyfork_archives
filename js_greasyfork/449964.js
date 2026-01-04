// ==UserScript==
// @name         even more test (test dont ban)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  test credits go to "AyaanT0"
// @author       AyaanT0
// @match        ShootEm.io
// @icon         
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/449964/even%20more%20test%20%28test%20dont%20ban%29.user.js
// @updateURL https://update.greasyfork.org/scripts/449964/even%20more%20test%20%28test%20dont%20ban%29.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
document.addEventListener("keydown", function(e) {
	if (e.key != "q") { return; }
	speed += 10
});
document.addEventListener("keydown", function(e) {
	if (e.key != "e") { return; }
	speed -= 10
});
document.addEventListener("keydown", function(e) {
	if (e.key != "Shift") { return; }
	speed = 10
});
})();