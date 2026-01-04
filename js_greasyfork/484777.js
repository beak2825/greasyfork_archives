// ==UserScript==
// @name         YT Ambient blocker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Disables ambience in YT
// @author       You
// @match        https://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @downloadURL https://update.greasyfork.org/scripts/484777/YT%20Ambient%20blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/484777/YT%20Ambient%20blocker.meta.js
// ==/UserScript==

(()=>{
	setInterval(()=>{
		try {
			let cinemactics=document.getElementById('cinematics')
			cinemactics.parentNode.removeChild(cinemactics)
		} catch{}
	}, 500)
})()