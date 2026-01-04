// ==UserScript==
// @name         Webtoons: Mobile Fix
// @namespace    https://github.com/
// @version      5
// @description  Description
// @author       You
// @match        https://m.webtoons.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=webtoons.com
// @grant        GM_addStyle
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/540152/Webtoons%3A%20Mobile%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/540152/Webtoons%3A%20Mobile%20Fix.meta.js
// ==/UserScript==
function waitFor(selector, callback) {
	var tick = function(){
		var e = document.querySelector(selector)
		if (e) {
			callback(e)
		} else {
			setTimeout(tick, 100)
		}
	}
	tick()
}
function addMissingImages() {
	let gImageList = (unsafeWindow || window).imageList
	let viewer = document.querySelector('#_viewer')
	let viewerWidth = getComputedStyle(viewer).width
	viewerWidth = parseInt(viewerWidth, 10)

	for (let imgData of gImageList) {
		let imgUrl = imgData.url + '?type=q70'
		let imgHeight = Math.ceil(imgData.height * (viewerWidth / imgData.width))
		// let img = viewer.querySelector('._imageWrap img[src="' + imgUrl + '"]')
		// if (img) {
		// 	// We use the _checkVisible class to detect the app added images that we hide.
		// 	// So if the image has already loaded, unhide it.
		// 	img.classList.remove('_checkVisible')
		// } else { // Not yet loaded
			let imageWrap = document.createElement('div')
			imageWrap.classList.add('flick-ct', '_imageWrap')
			imageWrap.style.width = '100%'
			imageWrap.style.textAlign = 'center'
			img = document.createElement('img')
			// img.classList.add('_checkVisible')
			img.setAttribute('width', viewerWidth)
			img.setAttribute('height', imgHeight)
			img.setAttribute('rel', 'nofollow')
			img.src = imgUrl
			img.setAttribute('srcset', imgUrl + 's 500w, ' + imgUrl + ' 700w')
			imageWrap.appendChild(img)
			viewer.appendChild(imageWrap)
			console.log('MobileFix: Added', imgData?.sortOrder, imgData)
		// }
	}
	viewer.style.height = ''
	GM_addStyle('#_viewer { height: initial !important; }')
	// GM_addStyle('#_viewer ._imageWrap:has(img._checkVisible[src="https://webtoons-static.pstatic.net/image/bg_transparency.png"]) { display: none !important; }')
	GM_addStyle('#_viewer ._imageWrap:has(img._checkVisible) { display: none !important; }')
}

let css = `
#_webToAppCTA { display: none !important; }
#downapp_area2 { display: none !important; }
.ly_induce_download { display: none !important; }
.ly_download_app { display: none !important; }
`
// Hide the images added by the app since it only leaves placeholders without the src.
//css += '#_viewer ._imageWrap img._checkVisible { display: none !important; }'

// This removes the annoying bookmark button that fades a second after load
css += '.ly_bookmark { display: none !important; }'
GM_addStyle(css)

// We will duplicate the images if we add them before the app does, so check to
// see if at least one image has been added first.
waitFor('#_viewer ._imageWrap img._checkVisible:not([src="https://webtoons-static.pstatic.net/image/bg_transparency.png"])', addMissingImages)



