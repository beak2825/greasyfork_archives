// ==UserScript==
// @name         Wikimedia Commons upload page: click to a few radio buttons
// @namespace    http://greasyfork.org/
// @version      1.0
// @author       Vitaly Zdanevich
// @match        https://commons.wikimedia.org/wiki/Special:UploadWizard
// @match        https://commons.wikimedia.org/w/index.php?title=Special:UploadWizard*
// @supportURL   https://gitlab.com/vitaly-zdanevich-userscripts/commonsUploadSetPrevCategories
// @description  "I confirm that this work does not include material restricted by copyright, such as logos, posters, album covers, etc.", "This work provides knowledge, instructions, or information to others.", license
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/535277/Wikimedia%20Commons%20upload%20page%3A%20click%20to%20a%20few%20radio%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/535277/Wikimedia%20Commons%20upload%20page%3A%20click%20to%20a%20few%20radio%20buttons.meta.js
// ==/UserScript==

(function() {
	const parent = document.getElementById('upload-wizard')
	const config = { attributes: true, childList: false, subtree: true }
	const observer = new MutationObserver(_ => {

		// "I confirm that this work does not include material restricted by copyright, such as logos, posters, album covers, etc."
		const node = document.querySelector('.mwe-upwiz-deed-compliance input')
		if (node && node.checked == false) {
			node.click()
			// I tried node.checked = true but it was not enough
		}

		// "This work provides knowledge, instructions, or information to others."
		const knowledge = document.querySelector('[value="knowledge"]')
		if (knowledge && knowledge.checked == false) {
			knowledge.parentNode.nextSibling.click()
		}

		// // "I do not know who the author is"
		// const anon = document.querySelector('[name="authorUnknown"]')
		// if (anon && anon.checked == false) {
		// 	anon.click()
		// }

		// I tried to hide this node by display:none - but in such case no click happen :(
		// opacity:0 works

		// observer.disconnect() is not needed here - because of many DOM updates -
		// on the first screen it will not find a checkbox and unsubscribe (I tried).
	})
	observer.observe(parent, config)

})()
