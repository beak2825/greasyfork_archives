// ==UserScript==
// @name         ComicReader: Webtoons
// @namespace    https://github.com/
// @version      5
// @description  Description
// @author       You
// @match        https://www.webtoons.com/en/canvas/*
// @match        https://m.webtoons.com/en/canvas/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=webtoons.com
// @grant        unsafeWindow
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/535797/ComicReader%3A%20Webtoons.user.js
// @updateURL https://update.greasyfork.org/scripts/535797/ComicReader%3A%20Webtoons.meta.js
// ==/UserScript==


let curUrl = document.location.href
let state = {}
state[curUrl] = document.documentElement
let isFetching = false

let comics = {
	'www.webtoons.com': {
		'container': '#_imageList',
		'images': '#_imageList img',
		'next': '.pg_next._nextEpisode',
		'bottom': '#_bottomEpisodeList',
	},
	'm.webtoons.com': {
		'container': '.viewer_img .flick-ct._imageWrap',
		//'images': '.viewer_img .flick-ct._imageWrap img', // DOES NOT yet exist in html
		'images': function(dom) {
			const jsImagePattern = /\s+url: "(.+)"\s+[,\}]/g
			let imgList = []
			for (const script of dom.querySelectorAll('body script')) {
				const scriptText = script.textContent
				if (scriptText.includes('var imageList = [')) {
					for (const m of scriptText.matchAll(jsImagePattern)) {
						console.log('m', m)
						const imageUrl = m[1]
						let img = new Image()
						img.src = imageUrl + '?type=q70'
						img.setAttribute('rel', 'nofollow')
						img.classList.add('_checkVisible')
						img.style.visibility = 'visible'
						img.setAttribute('width', '100%')
						img.setAttribute('height', 'auto')
						imgList.push(img)
					}
					break
				}
			}
			return imgList
		},
		'next': '.lk_next._nextEpisode',
		'bottom': '._readComplete',
		'css': `
			#header:not(:hover) { opacity: 0 !important; }
			.viewer_img hr { display: block !important; }
			.viewer_img { height: auto !important; }
			#toolbarEpisodeListArea { display: none; }
		`
	},
}
let comic = comics[document.location.hostname]
function getComicProp(key, dom) {
	let val = comic[key]
	if (typeof val === 'string') {
		return dom.querySelector(val)
	} else if (typeof val === 'function') {
		return val(dom)
	} else {
		throw Exception('Found Invalid Type')
	}
}
function getComicPropList(key, dom) {
	let val = comic[key]
	if (typeof val === 'string') {
		return dom.querySelectorAll(val)
	} else if (typeof val === 'function') {
		return val(dom)
	} else {
		throw Exception('Found Invalid Type')
	}
}


function isElementInViewport(el) {
	const rect = el.getBoundingClientRect()
	return (
		rect.top <= (window.innerHeight || document.documentElement.clientHeight)
		&& rect.left <= (window.innerWidth || document.documentElement.clientWidth)
		&& rect.bottom >= 0
		&& rect.right >= 0
	)
}

function parseState(pageUrl, dom) {
	return {
		url: pageUrl,
		dom: dom,
	}
}
function parseWindowState() {
	return parseState(document.location.href, document)
}

async function getNextHtml(nextUrl) {
	if (state[nextUrl]) {
		return state[nextUrl]
	}
	let nextHtmlDoc = await fetch(nextUrl).then((res) => res.text()).then((htmlStr) => {
		const parser = new DOMParser()
		const htmlDoc = parser.parseFromString(htmlStr, 'text/html')
		return htmlDoc
	})
	state[nextUrl] = nextHtmlDoc
	return nextHtmlDoc
}
function getCurHtml() {
	curHtmlDoc = state[curUrl]
	return curHtmlDoc
}
async function next() {
	console.log('next()', 'isFetching', isFetching)
	if (isFetching) {
		return
	}
	const curHtmlDoc = getCurHtml()
	console.log('next()', 'curHtmlDoc', curHtmlDoc)
	const nextUrl = getComicProp('next', curHtmlDoc).href
	console.log('next()', 'nextUrl', nextUrl)
	isFetching = true
	let nextHtmlDoc = await getNextHtml(nextUrl)
	console.log('next()', 'nextHtmlDoc', nextHtmlDoc)
	let hr = document.createElement('hr')
	hr.style.display = 'block'
	hr.style.marginTop = '3em'
	hr.style.marginBottom = '3em'
	let curImageContainer = getComicProp('container', document)
	console.log('next()', 'curImageContainer', curImageContainer)
	let nextImageContainer = getComicProp('container', nextHtmlDoc)
	// console.log('next()', 'nextImageContainer', nextImageContainer)
	// console.log('next()', 'nextImageContainer.outerHTML', nextImageContainer.outerHTML)
	curImageContainer.appendChild(hr)
	let newImages = getComicPropList('images', nextHtmlDoc)
	console.log('next()', 'newImages', newImages)
	for (let img of newImages) {
		curImageContainer.appendChild(img)
	}
	curUrl = nextUrl
	document.title = nextHtmlDoc.title
	window.history.replaceState({}, '', nextUrl)
	isFetching = false
}

const bottomEl = getComicProp('bottom', document)
async function onWindowScroll(e) {
	console.log('onWindowScroll', bottomEl.getBoundingClientRect(), bottomEl, isElementInViewport(bottomEl))
	if (isElementInViewport(bottomEl)) {
		await next()
	}
}

GM_addStyle(`
.age_text { display: none !important; }
#toolbarSensor { display: none !important; }
#pcViewerCanvasAdWapper { display: none !important; }
.dsc_encourage { display: none !important; }
#creatorNoteArea { display: none !important; }
.spi_area, .viewer_sns_area { display: none !important; }
.viewer_patron_area, .viewer_patron { display: none !important; }
#reportArea, .report_area { display: none !important; }
.ly_induce_download { display: none !important; }
.ly_download_app { display: none !important; }
#viewerBestComment { display: none !important; }
.downapp_area2 { display: none !important; }
.viewer_top { display: none !important; }

#toolbar {
	opacity: 1 !important
}
.tool_area {
	position: relative;
	display: block !important;
}

.viewer_lst .viewer_img {
	margin-bottom: 1em;
}
`)
if (comic['css']) {
	GM_addStyle(comic['css'])
}

window.addEventListener('scroll', onWindowScroll, true)
window.addEventListener('load', onWindowScroll, true)
onWindowScroll(null)
setTimeout(onWindowScroll, 1000)
setTimeout(onWindowScroll, 2000)
// setTimeout(onWindowScroll, 3000)
// setTimeout(onWindowScroll, 4000)
// setTimeout(onWindowScroll, 5000)

window.CRonWindowScroll = onWindowScroll
