// ==UserScript==
// @name		      Google Images Direct Link
// @version		    1.0.1
// @description   Add direct links to the picture to the Google Image Search results.
// @include		    /^https?:\/\/(www\.)?google\.[a-z\.]{2,5}\/search.*tbm=isch.*/
// @include		    /^https?:\/\/(www\.)?google\.[a-z\.]{2,5}\/search.*udm=2.*/
// @run-at		    document-end

// @grant		      GM_openInTab

// @copyright     2024, MSerj
// @license       MIT
// @namespace     https://greasyfork.org/en/users/1321619-mserj
// @icon data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAuCAMAAACLUGAGAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACNUExURXl5eYKCggAAABMTEwAQHgBXnAAKEQAVKAB00AANFwF00Ie75rrX7TSP2At50b7Z7vf390eZ2wd30a3Q6zeR2UaZ2zCN2Ovx9TOP2Ojv9b/Z7qfM6sLb7wx60QR20KvP6zKO2MDa7hqC1CyL1+bt9Mfd7w970h2D1Mbd75/J6QJ10Hq05AALEwA6aQAHDC3GXGkAAAAJcEhZcwAADsIAAA7CARUoSoAAAAC8SURBVEhL7c9HE4IwEIbhYI3YYsMOKvb2/3+eYYkHyS5sDg4X3lsyz3yTCJc8UXOo7qwbTV4t0G3Jq1Npq5K03+2l9c1F/vZgqKCRORe8ZDxx0XIKemZOBTqYg+ZtL5ZKrdbM7UDjzTaMWNspljKMGHqn8V5jzQ9wkUTp7/JvhMYxoQmMawqjOqYwpuMjhRGd4BOObQ34bA7Zsvqi8ZXClvZv9DLykvuDxsgv86q03f/188XrDZqfq3ZIeB9W/0N6iNgAzAAAAABJRU5ErkJggg==
// @downloadURL https://update.greasyfork.org/scripts/502327/Google%20Images%20Direct%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/502327/Google%20Images%20Direct%20Link.meta.js
// ==/UserScript==

/* globals trustedTypes */
/* jshint esversion: 11 */

function setClasses() {
	document.body.classList.remove('nocrop')
	document.body.classList.add('nocropHover', 'noRadius')
}

// Custom TrustedTypes handling: Google's policies are giving us trouble in some configs.
let needsTrustedHTML = false
const passThroughFunc = string => string
const TTPName = 'toast'
let TP = { createHTML: passThroughFunc, createScript: passThroughFunc, createScriptURL: passThroughFunc }
try {
	if (window.isSecureContext && window.trustedTypes?.createPolicy) {
		TP = trustedTypes.defaultPolicy || window.trustedTypes.createPolicy(TTPName, TP)
		needsTrustedHTML = true
	}
} catch (e) {
	console.error(e)
}

function updatePage() {
	if (!document.querySelector('#directLinkStyles')) {
		let styleElement = document.createElement('style')
		styleElement.id = 'directLinkStyles'
		styleElement.innerHTML = trustedHTML(`
		.linkToTarget {
		    position: absolute;
		    right: 0;
		    top: 0;
		    opacity: 0;
		    background-color: rgba(255, 255, 255, 0.5);
		    transition: background-color 0.5s, opacity 0.5s;
		    box-shadow: 3px 5px 10px rgba(0, 0, 0, 0.5);
		}
		.failed .linkToTargetlink {
		    color: rgba(230, 100, 100) !important;
		}
		a:hover .linkToTarget {
		    opacity: 0.6;
		}
		a:hover .linkToTarget:hover {
		    opacity: 1;
		}
		.linksdone:hover .linkToTarget {
		    cursor: pointer;
		}
		.linkToTargetLink {
		    color: rgba(155, 177, 233, 1) !important;
		    font-size: 22pt;
		    display: block;
		    font-weight: bold;
		    text-decoration: none !important;
		    transition: color 0.5s, font-size 0.5s, padding 0.5s;
		}
		.temp .linkToTargetLink {
		    color: rgba(200, 200, 200) !important;
		}
		.linkToTargetLink:hover {
		    color: rgba(155, 177, 233, 1) !important;
		    padding: 8px;
		    font-size: 30pt;
		}
		body.nocropHover div#islmp div#islrg div.islrc div.isv-r a.islib:hover,
		body.nocropHover a .F0uyec:hover,
		body.nocropHover a:hover img,
		body.nocropHover .mNsIhb .YQ4gaf:hover,
		body.nocropHover .H8Rx8c img:hover {
		    overflow: visible;
		    z-index: 100;
		    object-fit: contain;
		}
		body.noRadius a .F0uyec,
		body.noRadius div .eA0Zlc.mkpRId,
		body.noRadius div .cC9Rib {
		    border-radius: 0;
		}
		</style>`)

		document.head.appendChild(styleElement)
	}
	document
		.querySelectorAll(
			`.rg_di.rg_bx a.rg_l img:not(.linksdone),
#islrg div.isv-r a.wXeWr.islib img:not(.linksdone),
div#res div#rso h3 a g-img img:not(.linksdone),
div#islmp div.islrc a[role="button"] img:not(.linksdone)
`
		)
		.forEach(function (img) {
			if (img.classList.contains('linksdone'))
				// Why is the selector not working??
				return
			const linkDiv = document.createElement('div')
			linkDiv.className = 'linkToTarget'
			linkDiv.innerHTML = trustedHTML("<a class='linkToTargetLink'>↗️</a>")
			img.parentElement.appendChild(linkDiv)
			linkDiv.querySelector('a.linkToTargetLink').onclick = clickLink
			img.classList.add('linksdone')
		})
}

function clickLink(e) {
	e.stopPropagation()
	e.preventDefault()

	waitForLink(e.target, e)
	return false
}

function waitForLink(target, event) {
	const linkParent = target.parentElement.closest('a')
	const imgUrlStartIndex = linkParent.href.indexOf('imgurl=')

	const openInNew = event.ctrlKey

	if (imgUrlStartIndex < 0) {
		const $e = linkParent
		const resTries = linkParent.getAttribute('resTries') ? linkParent.getAttribute('resTries') * 1 + 1 : 1
		if (resTries === 1) {
			$e.click()
			linkParent.querySelector('img').click()
			setTimeout(function () {
				$e.click()
			}, 200)
		}

		linkParent.setAttribute('resTries', resTries)

		if (linkParent.getAttribute('resTries') * 1 >= 100) {
			linkParent.classList.add('linksdone')
			linkParent.classList.add('failed')
			linkParent.querySelector('.linkToTarget span').innerHTML = TP.createHTML('x')
			return true
		}

		if (!linkParent.classList.contains('linkswait')) {
			linkParent.classList.add('linkswait')
			linkParent.querySelector('.linkToTarget').classList.add('temp')
			linkParent.querySelector('.linkToTarget span').innerHTML = TP.createHTML('...')
		}
		setTimeout(function () {
			waitForLink(target, event)
		}, 200)

		return true
	} else {
		let picLink = decodeURIComponent(linkParent.href.slice(imgUrlStartIndex + 7).split('&')[0])
		linkParent.classList.remove('linkswait')
		const linkToTarget = linkParent.querySelector('.linkToTarget')
		if (linkToTarget) {
			linkToTarget.classList.remove('temp')
			linkToTarget.querySelector('a.linkToTargetLink').href = picLink
		}
		linkParent.classList.add('linksdone')

		if (event.which === 3) return false
		if (openInNew) {
			GM_openInTab(picLink, { active: true, insert: true, parent: true })
		} else {
			location.href = picLink
		}
	}
}

function trustedHTML(string) {
	if (!needsTrustedHTML) return string
	return TP.createHTML(string)
}

setClasses()
updatePage()
setInterval(updatePage, 1000)