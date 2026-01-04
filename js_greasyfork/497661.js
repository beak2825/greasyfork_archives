// ==UserScript==
// @name         Wikimedia Commons upload page: near Categories input - set previous clickable categories
// @namespace    http://greasyfork.org/
// @version      1.3
// @author       Vitaly Zdanevich
// @match        https://commons.wikimedia.org/wiki/Special:UploadWizard
// @match        https://commons.wikimedia.org/w/index.php?title=Special:UploadWizard*
// @supportURL   https://gitlab.com/vitaly-zdanevich-userscripts/commonsUploadSetPrevCategories
// @description  Useful to see previous categories that you used
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/497661/Wikimedia%20Commons%20upload%20page%3A%20near%20Categories%20input%20-%20set%20previous%20clickable%20categories.user.js
// @updateURL https://update.greasyfork.org/scripts/497661/Wikimedia%20Commons%20upload%20page%3A%20near%20Categories%20input%20-%20set%20previous%20clickable%20categories.meta.js
// ==/UserScript==

// TODO publish to Commons userscript (userscript of another type)

(function() {
	const parent = document.getElementById('upload-wizard')
	const config = { attributes: true, childList: false, subtree: true }
	const observer = new MutationObserver(_ => {

	if (!setPreviousCategories.isStarted && document.querySelector('.oo-ui-draggableGroupElement') && !document.querySelector('#prevCats'))
			setPreviousCategories()
	})

	function setPreviousCategories() {
		setPreviousCategories.isStarted = true

		// https://www.mediawiki.org/wiki/API:Usercontribs
		fetch(`https://commons.wikimedia.org/w/api.php?action=query&list=usercontribs&uclimit=1&ucuser=${mw.user.getName()}&format=json`)
			.then(resp => resp.json())
			.then(j => {
				const filename = j['query']['usercontribs'][0]['title']
				// https://www.mediawiki.org/w/api.php?action=help&modules=query:categories
				fetch(`https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=categories&meta=&titles=${filename}&formatversion=2&clshow=!hidden`)
					.then(resp => resp.json())
					.then(j => {
						const cats = j['query']['pages'][0]['categories']
							.reduce(reducer, [])

						const a = document.createElement('a')
						a.id = 'prevCats'
						a.innerText = 'Previous:\n'
						a.href = '//commons.wikimedia.org/wiki/' + filename
						document.querySelector('.oo-ui-draggableGroupElement').append(a, ...cats)

						setPreviousCategories.isStarted = false
					})
			})
	}

	observer.observe(parent, config)

})()

function reducer(acc, cur) {
	const div = document.createElement('div')
	const a = document.createElement('a')
	a.innerText = cur['title'].replace('Category:', '')
	a.href = '//commons.wikimedia.org/wiki/' + cur['title']

	const copy = document.createElement('span')
	copy.innerText = '📋'
	copy.style = 'cursor: pointer; margin-left: 10px'

	copy.onclick = function() {
		this.remove()
		navigator.clipboard.writeText(a.innerText)
	}

	div.appendChild(a)
	div.appendChild(copy)

	acc.push(div)
	return acc
}
