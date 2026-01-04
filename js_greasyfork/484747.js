// ==UserScript==
// @name        random button
// @namespace   https://anitype.fun/
// @match       https://anitype.fun/*
// @grant       none
// @version     1.0.1
// @author      ssrankedghoul
// @description 1/13/2024, 12:50:54 PM
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/484747/random%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/484747/random%20button.meta.js
// ==/UserScript==
/* jshint esversion: 11 */
;(() => {
	let progressInterval

	function createPopup({ insertAt, titleText, descriptionText, imageUrl, titleUrl }) {
		document.querySelector('#mypopup-container')?.remove()
		clearInterval(progressInterval)

		const config = {
			fps: 60, // how smooth will be popup progress animation
			timeToClick: 5, // in seconds
			openInNewTab: true, // whether to open popup in new tab or in current tab
		}

		document.head.insertAdjacentHTML(
			'beforeend',
			`<style>#mypopup-container{position:absolute;width:100%;height:100%;top:0;left:0;z-index:999;background-color:rgba(0,0,0,.5);display:flex;justify-content:center;align-items:center}#mypopup{width:55%;height:85%;min-width:600px;min-height:400px;max-width:80vw;max-height:80vh;z-index:9999;background-color:#3e3e3e;margin:auto;left:0;right:0;top:0;border-radius:10px;display:flex;flex-direction:column}#mypopup .progress_bar{width:100%;height:1%;background-color:#fc5050;border-radius:10px;bottom:0;position:relative}#mypopup .preview{height:100%;width:50%;background-size:cover;background-position:center}#mypopup .content{display:flex;justify-content:space-between;width:100%;height:100%}#mypopup .content .text{height:100%;width:50%;padding:20px;box-sizing:border-box;color:#f5f5f5}#mypopup .content .text h1{color:#dfdfdf;text-align:center;margin-bottom:50px;min-width:0}#mypopup .content .text p{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:15;overflow:hidden}</style>`
		)

		const popupContainer = document.createElement('div'),
			popup = document.createElement('div'),
			progressBar = document.createElement('div'),
			content = document.createElement('div'),
			preview = document.createElement('div'),
			text = document.createElement('div'),
			title = document.createElement('h1'),
			description = document.createElement('p')

		popupContainer.id = 'mypopup-container'
		popupContainer.style.height = `calc(100% + ${window.scrollY}px)`
		popupContainer.style.paddingTop = `${window.scrollY}px`

		popup.id = 'mypopup'
		popup.onclick = () => {
			clearInterval(progressInterval)
			popupContainer.remove()
		}
		popupContainer.onclick = () => {
			clearInterval(progressInterval)
			popupContainer.remove()
		}

		progressBar.classList.add('progress_bar')
		content.classList.add('content')
		preview.classList.add('preview')
		text.classList.add('text')

		title.innerText = titleText
		preview.style.backgroundImage = imageUrl
		description.innerText = descriptionText

		let progress = 100
		const progressPerTick = 100 / (config.timeToClick * config.fps)

		progressInterval = setInterval(() => {
			progressBar.style.width = `${(progress -= progressPerTick)}%`
			if (progress < 0) {
				clearInterval(progressInterval)
				if (!document.querySelector('#' + popup.id)) return
				window.open(titleUrl, config.openInNewTab ? '_blank' : '_self')
				popupContainer.remove()
			}
		}, 1000 / config.fps)

		text.appendChild(title)
		text.appendChild(description)
		content.appendChild(preview)
		content.appendChild(text)
		popup.appendChild(progressBar)
		popup.appendChild(content)
		popupContainer.appendChild(popup)

		if (insertAt) insertAt.appendChild(popupContainer)
		else document.body.appendChild(popupContainer)
	}

	function injectInCollections() {
		const oldButton = document.querySelector('#random-button'),
			favoriteButton = document.querySelector('.watch_button'),
			randomButton = document.createElement('div')

		oldButton?.remove()

		randomButton.id = 'random-button'
		randomButton.textContent = '🎲'
		randomButton.style = favoriteButton
			.getAttribute('style')
			.replace(/font-size: \d+px/, 'font-size: 1.3em')
		randomButton.classList = favoriteButton.classList
		randomButton.onclick = () => {
			const titles = document.querySelectorAll('.anime_selections_item'),
				titleDiv = titles[Math.floor(Math.random() * titles.length)].querySelector(
					'.anime_selections_item_poster_and_description'
				)

			createPopup({
				insertAt: document.querySelector('.selection_frame'),
				titleText: titleDiv.querySelector('.anime_selections_item_description_title').innerText,
				descriptionText: titleDiv.querySelector('.anime_selections_item_description').innerText,
				imageUrl: titleDiv.querySelector('.anime_selections_item_poster').style.backgroundImage,
				titleUrl: titleDiv.parentNode.parentNode.getAttribute('href'),
			})
		}

		favoriteButton.parentNode.appendChild(randomButton)
	}

	function injectInLibrary() {
		if (!document.querySelector('#fixkorzik'))
			document.head.insertAdjacentHTML(
				'beforeend',
				`<style id="fixkorzik">.random-button{background:#6767672e;padding:0 10px;vertical-align:middle;display:flex;justify-content:center;flex-direction:column;border:1px solid gray;border-radius:25%;cursor:pointer;width:45px;height:35px}.random-button span{margin:0 auto}.list_catalog_header{margin-bottom:15px;height:30px;align-content:center;justify-content:flex-start;justify-items:center;align-items:center}.list_catalog_header_text{margin-left:10px;margin-bottom:0}</style>`
			)

		document.querySelectorAll('.random-button').forEach((el) => el.remove())

		document.querySelectorAll('.list_catalog_header_text').forEach((c) => {
			const randomButton = document.createElement('div'),
				titles = c.parentNode.parentNode.querySelectorAll('.catalog_item_no_link')

			if (!titles.length) return

			randomButton.classList = 'random-button'
			randomButton.textContent = '🎲'

			randomButton.onclick = () => {
				const titleDiv = titles[Math.floor(Math.random() * titles.length)]

				createPopup({
					titleText: titleDiv.querySelector('.catalog_item_name').innerText,
					descriptionText: titleDiv.querySelector('.catalog_item_description').innerText,
					imageUrl: 'url(' + titleDiv.querySelector('img').src + ')',
					titleUrl: titleDiv.previousSibling.getAttribute('href'),
				})
			}

			c.insertAdjacentElement('beforebegin', randomButton)
		})
	}

	function callInjectorMaster() {
		const selection = location.href.startsWith('https://anitype.fun/selection'),
			library =
				location.href.startsWith('https://anitype.fun/library') ||
				location.href.startsWith('https://anitype.fun/welcome')

		if (!selection && !library) return
		let i = 0,
			interval = setInterval(() => {
				if (i > 10) {
					clearInterval(interval)
					if (!document.querySelector('#random-button'))
						console.error('не удалось добавить кнопку случайного выбора тайтла')
				}
				if (
					selection &&
					document.querySelector('.watch_button') &&
					!document.querySelector('#random-button')
				) {
					injectInCollections()
					console.log('кнопка добавлена')
				} else if (
					library &&
					document.querySelector('.list_catalog_header_text') &&
					!document.querySelector('.random-button')
				) {
					injectInLibrary()
					console.log('кнопка добавлена')
				}

				i += 1
			}, 1000)
	}

	function observeUrlChange() {
		let oldHref = document.location.href
		const body = document.querySelector('body'),
			observer = new MutationObserver(() => {
				if (oldHref !== document.location.href) {
					oldHref = document.location.href
					callInjectorMaster()
				}
			})
		observer.observe(body, { childList: true, subtree: true })
	}

	window.addEventListener('load', () => {
		observeUrlChange()
		callInjectorMaster()
	})
})()
