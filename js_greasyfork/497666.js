// ==UserScript==
// @name        moneymuseum.by: PDP: add button to copy a title without spaces
// @namespace   Violentmonkey Scripts
// @match       https://moneymuseum.by/*
// @version     1.2
// @author      Vitaly Zdanevich
// @description This is bad to have spaces in file names
// @supportURL  https://gitlab.com/vitaly-zdanevich-userscripts/copy-title-without-spaces
// @license     MIT 
// @downloadURL https://update.greasyfork.org/scripts/497666/moneymuseumby%3A%20PDP%3A%20add%20button%20to%20copy%20a%20title%20without%20spaces.user.js
// @updateURL https://update.greasyfork.org/scripts/497666/moneymuseumby%3A%20PDP%3A%20add%20button%20to%20copy%20a%20title%20without%20spaces.meta.js
// ==/UserScript==


(function() {
	if (document.querySelector('.product-item-detail-slider-image').length === 0) {
		return // This is not a PDP
	}

	const h1 = document.querySelector('h1')

	const span = document.createElement('span')
	span.style='margin:10px; font-style:italic; color:green; cursor:pointer'
	span.onclick=function() {
		this.remove()
		const text = h1.innerText
			.replaceAll('1/2 %', 'half_percent')
			.replace(/%/g, 'percent')
			.replace(/\s/g, '_')
			.replaceAll(',', '')
		navigator.clipboard.writeText(text)
	}
	span.innerText = 'copy'

	h1.append(span)
})()
