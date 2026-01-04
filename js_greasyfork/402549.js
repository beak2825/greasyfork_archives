// ==UserScript==
// @name         cross-hair aimer
// @namespace    diep.io
// @version      0.1
// @description  gives you a cross-hair aimer in diep.io
// @author       You
// @match        diep.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402549/cross-hair%20aimer.user.js
// @updateURL https://update.greasyfork.org/scripts/402549/cross-hair%20aimer.meta.js
// ==/UserScript==
setInterval(function () {
	if (document.getElementById("canvas").style.cursor != "crosshair")
		document.getElementById("canvas").style.cursor = "crosshair"
}, 20000)