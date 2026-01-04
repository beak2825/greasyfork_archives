// ==UserScript==
// @name         Steam totally disable autoplay
// @namespace    https://blog.maple3142.net/
// @version      0.1
// @description  Totally disable steam autoplay
// @author       maple3142
// @match        https://store.steampowered.com/app/*
// @run-at       document-start
// @grant        none
// @compatible   firefox >=52
// @compatible   chrome >=55
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/369980/Steam%20totally%20disable%20autoplay.user.js
// @updateURL https://update.greasyfork.org/scripts/369980/Steam%20totally%20disable%20autoplay.meta.js
// ==/UserScript==

;(function() {
	'use strict'
	const parseCookie = cookie =>
		Object.assign(
			...cookie
				.split(/[;\s]/)
				.filter(x => x)
				.map(t => t.split('='))
				.map(([k, v]) => ({ [k]: decodeURIComponent(v) }))
		)
	const serializeCookie = c => Object.keys(c).map(x => `${x}=${encodeURIComponent(c[x])};path=/;`)
	const setCookie = cookieobj => serializeCookie(cookieobj).forEach(x => (document.cookie = x))
	const cookie = parseCookie(document.cookie)
	cookie.bGameHighlightAutoplayDisabled = true
	setCookie(cookie)
})()
