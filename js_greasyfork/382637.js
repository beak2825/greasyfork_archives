// ==UserScript==
// @name         Dark LMS
// @namespace    https://greasyfork.org/en/users/32795-nikramakrishnan
// @version      2019.05.08
// @description  Try to make the LMS less of an eyesore
// @author       anuditnagar, NikRamakrishnan
// @match        *://lms.bennett.edu.in/*
// @grant        none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/382637/Dark%20LMS.user.js
// @updateURL https://update.greasyfork.org/scripts/382637/Dark%20LMS.meta.js
// ==/UserScript==

window.addEventListener('DOMContentLoaded', function (e) {
	console.log('DOM loaded, processing stuff...');
	if (window.addCss !== undefined) {
		window.addCss();
	} else {
		var ss = document.createElement('link');
		ss.rel = "stylesheet";
		ss.type = "text/css";
		ss.href = "https://cdn.jsdelivr.net/gh/anuditnagar/darklms/darklms.min.css";
		document.head.appendChild(ss);
	}
});
