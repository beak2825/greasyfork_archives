// ==UserScript==
// @name         ReRozetked
// @namespace    https://github.com/anton0kurilov/rozetked-styling
// @version      2025.12.1
// @description  Make Rozetked Great Again
// @author       Anton Kurilov (kurilov.xyz)
// @match        https://rozetked.me/*
// @icon         https://www.google.com/s2/favicons?domain=rozetked.me
// @require      http://code.jquery.com/jquery-latest.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/457979/ReRozetked.user.js
// @updateURL https://update.greasyfork.org/scripts/457979/ReRozetked.meta.js
// ==/UserScript==

const CURRENT_URL = window.location.href
if (
	CURRENT_URL.includes('articles/') ||
	CURRENT_URL.includes('news/') ||
	CURRENT_URL.includes('reviews/') ||
	CURRENT_URL.includes('posts/')
) {
	// redirect to post editing when Ctrl+E logged
	let postID = CURRENT_URL.match(/\b\d{5}\b/g)
	document.addEventListener('keydown', function (event) {
		if (event.code == 'KeyE' && (event.ctrlKey || event.metaKey)) {
			window.location.href =
				'https://rozetked.me/acp/post2/edit/' + postID
		}
	})
}

// change site logo
const getLogoAttribute = document.querySelector('.logo__img')
getLogoAttribute.setAttribute('src', '/imgs/logo-icon.png')

// add Open button to adminpanel
if (CURRENT_URL.includes('/acp/post/list')) {
	let tableNodes = document.getElementsByTagName('tr'),
		tgLinks = document.getElementsByClassName('tg_link')

	for (let i = 0; i < tgLinks.length; i++) {
		tgLinks[i].textContent = 'TG'
	}
	for (let i = 0; i < tableNodes.length; i++) {
		let link = tableNodes[i].querySelector('a')
		if (link) {
			let linkID = link.href.match(/\b\d{5}\b/)
			if (linkID) {
				let newCell = document.createElement('td')
				let newLink = document.createElement('a')
				newCell.classList.add('publink')
				newLink.href = 'https://rozetked.me/news/' + linkID[0]
				newLink.textContent = '↗︎'
				newCell.appendChild(newLink)
				tableNodes[i].appendChild(newCell)
			}
		}
	}
}

// fuck watermark's selector bug
if (CURRENT_URL.includes('/acp/post2/edit/')) {
	document
		.querySelectorAll('.watermark_settings .wmt')
		.forEach(function (el) {
			el.classList.remove('active')
		})
	document
		.querySelector('.watermark_settings .wmt[data-type=no]')
		.classList.add('active')
	setCookie('wm_type', 'no', { expires: 3600 })

	// submit post when Ctrl+S logged
	document.addEventListener('keydown', function (event) {
		if (event.code == 'KeyS' && (event.ctrlKey || event.metaKey)) {
			event.preventDefault()
			document.querySelector('#post-form').submit()
		}
	})
}
