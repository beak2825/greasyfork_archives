// ==UserScript==
// @name         Skip poweruser.guru site
// @namespace    GrayFace
// @version      1.0
// @description  Skip poweruser.guru and go to the real poweruser.com thread
// @author       GrayFace
// @match        http://poweruser.guru/*
// @match        https://poweruser.guru/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/393253/Skip%20poweruserguru%20site.user.js
// @updateURL https://update.greasyfork.org/scripts/393253/Skip%20poweruserguru%20site.meta.js
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
}, '.question .suggest-edit-post');

})();