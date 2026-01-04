// ==UserScript==
// @name        Choose the best resolution on rumble.com
// @namespace   deep.institute
// @version     Fixed
// @description Alwasy choose the best resolution on rumble.com
// @author      deep.institute
// @license MIT
// @match        *://rumble.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437675/Choose%20the%20best%20resolution%20on%20rumblecom.user.js
// @updateURL https://update.greasyfork.org/scripts/437675/Choose%20the%20best%20resolution%20on%20rumblecom.meta.js
// ==/UserScript==

const waitClick = selector => {
	let intervalId = setInterval(function () {
		const el = document.querySelector(selector)
		if (el) {
			// console.log(el)
			el.click()
			clearInterval(intervalId)
			return
		}
	}, 100)
}

setTimeout(() => {
	const selectors = [
		'video',
		'.videoPlayer-Rumble-cls > div > div:nth-child(6)>div',
		'li:nth-child(2)>div',
		'ul:last-child>li:last-child',
	]
	for (const selector of selectors) {
		waitClick(selector)
	}
}, 1500)