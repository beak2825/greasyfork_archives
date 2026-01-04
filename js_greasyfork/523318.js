// ==UserScript==
// @name         player engoodener
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  bypasses video scroll lock
// @author       me
// @match        https://elearning.trubicars.ca/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523318/player%20engoodener.user.js
// @updateURL https://update.greasyfork.org/scripts/523318/player%20engoodener.meta.js
// ==/UserScript==

setInterval(replaceReadOnly, 250)

function replaceReadOnly() {
    "use strict";
    //console.log("run engoodener");
    /*var elem = document.getElementsByTagName("div");
 	for (var i = 0; i < elem.length; i++) {
		elem[i].innerHTML = elem[i].innerHTML.replace("progress-bar cs-seekcontrol", "progress-bar cs-seekcontrol read-only");
	}*/
    if (document.getElementById('seek') !== null) {
    document.getElementById("seek").setAttribute('class', 'progress-bar cs-seekcontrol');
    }
 	//for (var i = 0; i < elem.length; i++) {
	//}
}