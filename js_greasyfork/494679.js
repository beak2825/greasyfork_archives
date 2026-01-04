// ==UserScript==
// @name        novelpia.com copy text to clipboard
// @namespace   https://novelpia.com/viewer
// @match       https://novelpia.com/viewer/*
// @grant       none
// @version     1.0.1
// @author      ssrankedghoul
// @description Copies content of the page to the clipboard after double clicking c
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/494679/novelpiacom%20copy%20text%20to%20clipboard.user.js
// @updateURL https://update.greasyfork.org/scripts/494679/novelpiacom%20copy%20text%20to%20clipboard.meta.js
// ==/UserScript==
/* jshint esversion: 11 */
;(() => {
	let lastPress = 0
	window.addEventListener('keyup', (e) => {
		if (e.keyCode !== 67) return // c
		if (Date.now() - lastPress > 500) return (lastPress = Date.now())

		const mainText = document.querySelector('#novel_drawing').innerText
		const comment = document.querySelector('#writer_comments_box')?.innerText || ''
		const delimeter = '\n\n' + '⸻'.repeat(10) + '\n\n'

		const normalize = (text) =>
			text
				.split('\n')
				.map((e) => e.trim())
				.join('\n')
				.replaceAll(/\n\n/g, '\n')
				.replaceAll(' ', ' ')

		navigator.clipboard.writeText(normalize(mainText) + delimeter + normalize(comment))

		alert('copied to clipboard')
		lastPress = 0
	})
})()
