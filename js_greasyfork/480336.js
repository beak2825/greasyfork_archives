// ==UserScript==
// @name               Replace Title Conlon
// @namespace          h
// @version            1.2
// @description        Replace Title Conlon in the web page
// @author             amormaid
// @include            http*://*/*
// @grant              none
// @run-at             document-end
// @license            MIT License
// @downloadURL https://update.greasyfork.org/scripts/480336/Replace%20Title%20Conlon.user.js
// @updateURL https://update.greasyfork.org/scripts/480336/Replace%20Title%20Conlon.meta.js
// ==/UserScript==

(function() {
    'use strict';

	function sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms))
	}

	function is(target, type){
		return Object.prototype.toString.call(target).slice(8, -1).toLowerCase() === `${type}`.toLowerCase()
	}

	function get_the_most_used_fontsize() {
		let nodes = document.querySelectorAll('*');
		let nodes_filtered = Array.from(nodes).filter(e => {
			let is_non_text = ['SCRIPT', 'STYLE', 'TEXTAREA'].includes(e.nodeName);
			let is_text = e.childNodes.length && is(e.childNodes[0], 'text');
			return !is_non_text && is_text
		});

		let statistics = nodes_filtered.reduce((acc, cur) => {
			let fontSize = getComputedStyle(cur).fontSize
			acc[fontSize] = (acc[fontSize] || 0) + 1
			return acc
		},{})
		let the_most_used = Math.max(...Object.values(statistics))
		let the_most_used_fontsize = Object.keys(statistics).find(key => statistics[key] === the_most_used)
		return the_most_used_fontsize
	}

	async function run() {
		await sleep(3000)
		let content_fontsize = parseInt(get_the_most_used_fontsize())

		let content_to_replaced = Array.from(document.querySelectorAll('*')).filter(e => !['SCRIPT', 'STYLE', 'TEXTAREA'].includes(e.nodeName) && e.childNodes.length && is(e.childNodes[0], 'text') && e.innerHTML && e.innerHTML.includes(':'))

		content_to_replaced.forEach(e => {
			if(parseFloat(getComputedStyle(e).fontSize) > content_fontsize) {
				console.log('replcing ', e)
				e.innerHTML = e.innerHTML.replace(':', ' ')
				e.style.color = 'red'
			}
		})
	}

	run()

})();

