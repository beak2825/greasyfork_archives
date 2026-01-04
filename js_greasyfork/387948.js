// ==UserScript==
// @name         JellyNeo Item DB List Maker
// @description  Scrape paginated search results from JellyNeo's item database and generate a list of item names from these.
// @author       Badger
// @namespace    Badger@Clraik
// @version      1.0
// @match        https://items.jellyneo.net/search/*
// @grant        GM_log
// @downloadURL https://update.greasyfork.org/scripts/387948/JellyNeo%20Item%20DB%20List%20Maker.user.js
// @updateURL https://update.greasyfork.org/scripts/387948/JellyNeo%20Item%20DB%20List%20Maker.meta.js
// ==/UserScript==

(function() {
	'use strict';

	// Run only if on first or only page
	const contentWrapper = document.querySelector('.content-wrapper');
	if (!contentWrapper.querySelector('.pagination') || contentWrapper.querySelector('.pagination > li.current').textContent.trim() !== '1') {
		return
	}

	if (!confirm('Convert items to list?')) return

	let itemsSet = new Set();
	contentWrapper.insertAdjacentHTML('afterbegin', `<div style="position: absolute; top: 0; left: 0; right: 0; margin: 0 auto; letter-spacing: 1px; font-size: 15px; border: 2px solid #2980b9; text-align: center; padding: 1rem 0.5rem; pointer-events: none; background-color: rgba(152, 222, 144, 0.8); transition: opacity .2s;" id="list-message"></div>`)
	const listMessage = document.getElementById('list-message')

	function log(message) {
		GM_log(message)
		listMessage.textContent = message
	}

	// Load the next page of items asynchronously
	async function getNextPage(pageLink, pageLabel) {
		log(`Fetching page ${pageLabel} (${pageLink})...`)
		let response = await fetch(pageLink)
			.then(function(response) {
				if (!response.ok) {
					log(response.statusText)
					throw Error(response.statusText)
				}
				return response
			}).catch(function(error) {
				log(error)
				throw Error(error)
			})
		let data = await response.text()
		const page = document.implementation.createHTMLDocument()
		page.write(data)
		return page
	}

	// Update a query parameter in the current URL
	function updateQueryParam(key, value) {
		const url = window.location.href
		const regex = new RegExp('([?&])' + key + '=.*?(&|$)', 'i')
		const separator = url.indexOf('?') !== -1 ? '&' : '?'
		const updatedUrl = url.match(regex) ?
			url.replace(regex, '$1' + key + '=' + value + '$2') :
			url + separator + key + '=' + value

		history.pushState({ path: updatedUrl }, '', updatedUrl)
	}

	// Update the items set from the new page we just loaded
	function updateItemsSetFromPage(page) {
		const itemElements = page.querySelectorAll('.content-wrapper ul[class*=large-block-grid-] > li');

		[...itemElements].forEach((el) => {
			let fullItemInfo = el.textContent.trim();
			const nameWithPriceRegex = /(.*)\n((?:\d+,)*\d+(?:\.\d+)? NP$)/;
			const hasPrice = nameWithPriceRegex.test(fullItemInfo);
			let item = { link: el.querySelector('a').href, hasPrice };

			// Account for if there is a note (e.g. 'Inflation Notice') instead of a NP value while grabbing the info
			if (hasPrice) {
				fullItemInfo = fullItemInfo.match(nameWithPriceRegex);
				fullItemInfo.shift();
			} else {
				fullItemInfo = fullItemInfo.split(/\n/);
			}
			item.name = fullItemInfo[0];
			item.value = fullItemInfo[1];
			itemsSet.add(item)
		})

		return page
	}

	async function init() {
		const resultsPerPage = Number(document.getElementById('search-limit').value)
		const resultsTotal = Number(contentWrapper.querySelector('b').textContent.replace(/,/g, ''))
		const totalPageCount = Math.ceil(resultsTotal / resultsPerPage)

		// Get items on current page
		updateItemsSetFromPage(document)

		// Ensure params are set is in URL
		if (location.href.search('limit=') === -1) {
			updateQueryParam('limit', resultsPerPage)
		}
		if (location.href.search('start=') === -1) {
			updateQueryParam('start', 0)
		}

		log(`Have already fetched page 1 (${location.href}) of ${totalPageCount}.`)

		// Build full list of pagination links
		const baseLink = location.href.substr(0, location.href.search('start=')) + 'start='

		let pageLinks = [];
		for (let i = 1; i < totalPageCount; i++) {
			pageLinks.push(baseLink + i * resultsPerPage)
		}

		// Get items from the other pages
		const requests = [...pageLinks].map((pageLink, i) => getNextPage(pageLink, `${i + 2} of ${totalPageCount}`).then(page => updateItemsSetFromPage(page)));
		await Promise.all(requests);

		log('Writing to page...');

		// Delete original item grid
		[...contentWrapper.querySelectorAll('.pagination, ul[class*=large-block-grid-]')].forEach(el => el.remove());

		// Make list and write to page
		let listMarkup = '<ul style="list-style: none;">';
		for (let item of itemsSet) {
			listMarkup += `<li style="margin-bottom: 0;"><a href="${item.link}" title="${item.value}" style="background-image: none; color: ${item.hasPrice ? '#2980b9' : '#c0392b'};">${item.name}</a></li>`
		}
		listMarkup += '</ul>';
		contentWrapper.insertAdjacentHTML('beforeend', listMarkup)

		log('Your list is complete.')

		setTimeout(() => {
			listMessage.style.opacity = '0';
		}, 5000)
	}

	log('Generating your list...')
	init()

})();