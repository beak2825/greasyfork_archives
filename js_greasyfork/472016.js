// ==UserScript==
// @name         JVC - 503
// @namespace    http://tampermonkey.net/
// @version		 0.2
// @description  Rechargement auto
// @author       Lúthien Sofea Elenassë
// @match		 https://www.jeuxvideo.com/*
// @license		 MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472016/JVC%20-%20503.user.js
// @updateURL https://update.greasyfork.org/scripts/472016/JVC%20-%20503.meta.js
// ==/UserScript==

(function() {
	'use strict';

	const h = document.querySelectorAll("body h1");
	if (h.length === 1 && h[0].innerHTML === "Service Unavailable") {
		setTimeout(() => location.reload(), 100);
	}
})();