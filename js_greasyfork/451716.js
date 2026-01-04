// ==UserScript==
// @name         MH - Journal Screenshot Button
// @namespace    https://greasyfork.org/users/918578
// @description  Adds a button to the top of journal to generate and save a screenshot of the last N journal entries, optionally excluding non-hunts
// @author       squash
// @match        https://www.mousehuntgame.com/*
// @match        http://www.mousehuntgame.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mousehuntgame.com
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/html2canvas@1.4/dist/html2canvas.min.js
// @version      0.3
// @downloadURL https://update.greasyfork.org/scripts/451716/MH%20-%20Journal%20Screenshot%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/451716/MH%20-%20Journal%20Screenshot%20Button.meta.js
// ==/UserScript==

// TODO: Is type filtering accurate? Are active passive and linked the only hunt entry types?

;(function () {
	'use strict'

	let css = `
		#journalContainer.journal--privacy .journal__screenshot-preview .entry:not(.badge) a[href*="profile.php"],
		#journalContainer.journal--privacy .journal__screenshot-preview .entry.socialGift .journaltext a,
		#journalContainer.journal--privacy .journal__screenshot-preview .relicHunter_complete > .journalbody > .journaltext > b:nth-child(6),
		#journalContainer.journal--privacy .journal__screenshot-preview .wanted_poster-complete > .journalbody > .journaltext > b:nth-child(8),
		#journalContainer.journal--privacy .journal__screenshot-preview .journal__hunter-name
		{
			visibility: hidden !important;
		}

		#journalContainer .journal__screenshot-button {
			position: absolute;
			left: 10px;
			top: 60%;
			transform: translateY(-60%);
			font-size: 10px;
			line-height: 20px;
			padding: 0 5px 0 5px;
			border-radius: 5px;
			background: #ccc;
			border: 1px solid #333;
			text-decoration: none;
			display: none;
		}

		#journalContainer .journal__screenshot-button:hover {
			text-decoration: none;
			background-color: #eee;
		}

		#journalContainer .top:hover .journal__screenshot-button {
			display: block;
		}

		.journal__screenshot-preview {
			display: grid;
			grid-template-rows: repeat(12, auto);
			grid-gap: 0px;
			grid-auto-flow: column;
			overflow:visible;
		}

		.journal__screenshot-preview .entry {
			width: 349px;
		}
		`

	const styleNode = document.createElement('style')
	styleNode.appendChild(document.createTextNode(css))
	;(document.querySelector('head') || document.documentElement).appendChild(styleNode)

	// Create screenshot button
	const button = document.createElement('a')
	button.innerText = 'Screenshot'
	button.href = '#'
	button.className = 'journal__screenshot-button'
	button.onclick = function (e) {
		e.preventDefault()

		createOptionsDialog()
	}

	function createOptionsDialog() {
		let dialog = new jsDialog()
		dialog.setTemplate('ajax')
		dialog.setIsModal(true)
		dialog.addToken('{*prefix*}', '<h2 class="title">Journal Screenshot</h2>')
		let content = `<form>`
		content += `<p><label>Include <input type="number" min="1" max="72" name="entries" value="5" step="1" /> entries starting from the top of Page ${parseInt(
			document.querySelector('.pagerView-section-currentPage').innerText
		)}. </label></p>`
		content += `<p><label>Exclude non-hunt entries? <input type="checkbox" name="exclude_nonhunts" value="1" checked /></label></p>`
		content += `<p><label>Hide hunter names? <input type="checkbox" name="censor" value="1" checked /></label></p>`
		content += '</form>'
		dialog.addToken('{*content*}', content)
		dialog.addToken('{*suffix*}', `<input class="jsDialogClose" type="button" value="Cancel" /> <input class="jsDialogClose journal__screenshot-save" type="button" value="Save Screenshot" />`)
		dialog.show()

		// Bind save screenshot event
		document.querySelector('#overlayPopup .journal__screenshot-save').addEventListener('click', async function (event) {
			let preview = await createPreviewElement()

			// Temporarily append preview to journal so it's styled correctly
			document.querySelector('#journalContainer .content').append(preview)

			// Wrap unselectable names in case we're censoring them
			findUnselectableNames()

			// Generate screenshot and remove preview again
			html2canvas(preview, { logging: false, width: preview.scrollWidth, height: preview.scrollHeight, backgroundColor: '#f1f1f1' }).then((canvas) => {
				let entryTime = preview.querySelector('.journaldate').innerText.split(' - ')[0].replace(':', '_')
				saveAs(canvas.toDataURL('image/png'), `screenshot-${new Date().toISOString().split('T')[0]}_${entryTime}.png`)
				preview.remove()
				document.querySelector('#journalContainer').classList.remove('journal--privacy')
			})
		})
	}

	async function createPreviewElement() {
		let config = Object.fromEntries(new FormData(document.querySelector('.jsDialog form')).entries())
		config.entries = parseInt(config.entries)
		if (config.entries > 72) {
			config.entries == 72
		}

		let preview = document.createElement('div')
		preview.classList = 'journal__screenshot-preview'

		let elements = document.querySelectorAll(config.exclude_nonhunts ? '#journalContainer .entry.active, #journalContainer .entry.passive, #journalContainer .entry.linked' : '.entry')
		let nextPage = getNextPage()

		let container = document.querySelector('#journalContainer')

		if (config.censor) {
			container.classList.add('journal--privacy')
		} else {
			container.classList.remove('journal--privacy')
		}

		// Fetch next journal page until we have all relevant entries or run out of pages
		while (elements.length < config.entries && nextPage <= 6) {
			console.log('Fetching Journal Page: ' + nextPage)

			let response = await fetch(callbackurl + 'managers/ajax/pages/journal.php', {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: new URLSearchParams({ page: nextPage, size: container.dataset.size, owner: container.dataset.owner }),
			})
			let data = await response.json()
			let parser = new DOMParser()
			let journalPage = parser.parseFromString(data.journal_page.entries_string, 'text/html')

			elements = [...elements].concat([...journalPage.querySelectorAll(config.exclude_nonhunts ? '.entry.active, .entry.passive, .entry.linked' : '.entry')])

			nextPage++
		}

		// Append relevant number of journal entires to preview
		let i = 0
		for (let element of elements) {
			i++
			if (i > config.entries) {
				break
			}
			preview.appendChild(element.cloneNode(true))
		}

		return preview
	}

	function getNextPage() {
		let page = parseInt(document.querySelector('.pagerView-section-currentPage').innerText)
		return page + 1
	}

	function saveAs(uri, filename) {
		var link = document.createElement('a')

		if (typeof link.download === 'string') {
			link.href = uri
			link.download = filename

			// Firefox requires the link to be in the body
			document.body.appendChild(link)
			link.click()
			document.body.removeChild(link)
		} else {
			window.open(uri)
		}
	}

	function findUnselectableNames() {
		// Some map-related journal entries don't have selector-friendly names, so they need to be found and wrapped.
		const mapEntries = document.querySelectorAll('#journalContainer .entry.relicHunter_start .journaltext')
		if (mapEntries) {
			mapEntries.forEach(function (entry) {
				let index = entry.innerHTML.indexOf(' has joined the ')

				if (index === -1) {
					index = entry.innerHTML.indexOf(' has left the ')
				}
				if (index === -1) {
					index = entry.innerHTML.indexOf(' used Rare Map Dust')
				}
				if (index === -1) {
					index = entry.innerHTML.indexOf(', the map owner, has activated Consolation Mode')
				}
				if (index !== -1) {
					if (!entry.querySelector('.journal__hunter-name')) {
						entry.innerHTML = ['<span class="journal__hunter-name">', entry.innerHTML.slice(0, index), '</span>', entry.innerHTML.slice(index)].join('')
					}
				}
			})
		}
	}

	function renderButton() {
		if (!document.querySelector('.journal__screenshot-button')) {
			const journalTop = document.querySelector('#journalContainer .top')
			if (journalTop) {
				journalTop.prepend(button)
			}
		}
	}

	renderButton()

	if (typeof eventRegistry !== 'undefined') {
		eventRegistry.addEventListener(hg.utils.PageUtil.EventSetPage, function (currentPage) {
			if (currentPage.type == 'PageCamp') {
				renderButton()
			}
		})
	}
})()
