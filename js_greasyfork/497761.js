// ==UserScript==
// @name         Wikimedia Commons category page: highlight my files (of the current user)
// @namespace    http://greasyfork.org/
// @homepageURL  https://gitlab.com/vitaly-zdanevich-userscripts/commonsHighlightMyFiles
// @supportURL   https://gitlab.com/vitaly-zdanevich-userscripts/commonsHighlightMyFiles/-/issues
// @version      1.3.6
// @author       Vitaly Zdanevich
// @match        https://commons.wikimedia.org/wiki/Category:*
// @match        https://commons.wikimedia.org/w/index.php?title=Category:*
// @description  Useful to see what files are uploaded by you
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/497761/Wikimedia%20Commons%20category%20page%3A%20highlight%20my%20files%20%28of%20the%20current%20user%29.user.js
// @updateURL https://update.greasyfork.org/scripts/497761/Wikimedia%20Commons%20category%20page%3A%20highlight%20my%20files%20%28of%20the%20current%20user%29.meta.js
// ==/UserScript==

// TODO publish to Commons userscript (userscript of another type)


const files = document.querySelectorAll('.galleryfilename')

let fileNames = ''

const pack = []

const m = {};

files.forEach((f, i) => {
	fileNames += 'File:' + f.innerText.replaceAll('&', '%26')
	if (i > 0 && (i+1) % 14 === 0 || i+1 === files.length) { // Not a big number against HTTP 414
		pack.push(fileNames)
		fileNames = ''
	} else {
		fileNames += '|'
	}

	m['File:' + f.innerText] = f
})

pack.forEach(p => {
	fetch(`https://commons.wikimedia.org/w/api.php?action=query&titles=${p}&prop=imageinfo&format=json`)
		.then(resp => resp.json())
		.then(j => {
				Object.entries(j['query']['pages']).forEach(([_, p]) => {
					if (p['imageinfo'][0]['user'] == document.querySelector('#pt-userpage span').innerText) {
						const li = m[p['title']].parentNode.parentNode
						li.style.outline = '4px solid darkgreen'
					}
				})
		})
})
