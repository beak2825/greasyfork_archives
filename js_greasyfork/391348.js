// ==UserScript==
// @name         Skip Qaru.site
// @namespace    GrayFace
// @version      1.0
// @description  Skip Qaru and go to the real stackoverflow.com thread
// @author       GrayFace
// @match        http://qaru.site/*
// @match        https://qaru.site/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/391348/Skip%20Qarusite.user.js
// @updateURL https://update.greasyfork.org/scripts/391348/Skip%20Qarusite.meta.js
// ==/UserScript==

(function() {'use strict';

function WhenLoaded(f, id) {
	var timer;
	timer = setInterval(function() {
		var a = document && document.body && (!id || document.querySelector(id));
		if (a) {
			clearTimeout(timer);
			f(id && a);
		}
	}, 10);
}

WhenLoaded((a)=>{
	location.href = a.href;
}, '.question .aa-link');

})();