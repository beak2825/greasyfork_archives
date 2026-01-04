// ==UserScript==
// @name         nm-tools
// @namespace    http://tampermonkey.net/
// @version      3.2.2.3
// @description  provide tools for nmliao.cn
// @author		 Maswdle
// @match        http://v*/randomdeskry*
// @downloadURL https://update.greasyfork.org/scripts/469147/nm-tools.user.js
// @updateURL https://update.greasyfork.org/scripts/469147/nm-tools.meta.js
// ==/UserScript==

; (function () {
	/// loader
	// this project was created by Wokoo
	'use strict'
	const DEBUG = false;
	if (location.href === 'http://localhost:8080/') return
	var script = document.createElement('script')
	if (DEBUG)
		script.src = 'http://localhost:8080/app.bundle.js' // debug
	else
		script.src = 'https://cdn.jsdelivr.net/gh/Maswdle/AF-cheat@cdn/app.bundle.js' // publish

	document.body.appendChild(script)
})()
