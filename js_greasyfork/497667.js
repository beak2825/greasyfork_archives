// ==UserScript==
// @name        moneymuseum.by: show links to uploaded files in Wikimedia Commons
// @namespace   Violentmonkey Scripts
// @match       https://moneymuseum.by/*
// @version     1.0
// @author      Vitaly Zdanevich
// @description Useful to see - what was already uploaded to https://commons.wikimedia.org
// @supportURL  https://gitlab.com/vitaly-zdanevich-extensions/moneymuseum-by-wikimedia-commons
// @license     Apache-2.0
// @downloadURL https://update.greasyfork.org/scripts/497667/moneymuseumby%3A%20show%20links%20to%20uploaded%20files%20in%20Wikimedia%20Commons.user.js
// @updateURL https://update.greasyfork.org/scripts/497667/moneymuseumby%3A%20show%20links%20to%20uploaded%20files%20in%20Wikimedia%20Commons.meta.js
// ==/UserScript==


(function() {
	// Iterate "PLP": many differect items
	document.querySelectorAll('.catalog-section a[data-entity="image-wrapper"]').forEach(async a => {
		const resp = await fetch(a.href)
		const text = await resp.text() // HTML text of "PDP"

		// Parse every "PDP"
		const parser = new DOMParser()
		const dom = parser.parseFromString(text, 'text/html')
		const div = document.createElement('div')
		div.style = 'display:flex; margin-top: -20px'
		const nodeList = dom.querySelectorAll('.product-item-detail-slider-image img')
		nodeList.forEach(async (imgNode, i) => {
			const h = await sha1ByURL(imgNode.src)
			const resp = await fetch('https://commons.wikimedia.org/w/api.php?action=query&list=allimages&format=json&origin=*&aisha1='+h)
			const j = await resp.json()
			const img = j['query']['allimages'][0]
			if (img) {
				div.insertAdjacentHTML('beforeend', `<a style='color:green; font-weight:bold; margin:9px; order:${i+1}' href="${img['descriptionurl']}">${i+1}</a>`)
			} else {
				div.insertAdjacentHTML('beforeend', `<span style='color:#ccc; margin:9px; order:${i+1}'>${i+1}</span>`)
			}
		})
		a.parentNode.append(div)
	})
})()

// TODO replace to lib? Must accept URL and return SHA1
// https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API/Non-cryptographic_uses_of_subtle_crypto
async function sha1ByURL(url) {
	let resp;
	try {
		resp = await fetch(url)
	} catch(e) {
		console.log('===', e)
	}
	const arrBuf = await resp.arrayBuffer()
	const hash = await crypto.subtle.digest('SHA-1', arrBuf) // Returns ArrayBuffer
	const uint8 = new Uint8Array(hash)
	return Array.from(uint8).map(b => b.toString(16).padStart(2, "0")).join('')
}
