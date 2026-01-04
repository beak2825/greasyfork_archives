// ==UserScript==
// @name        ridibooks.com chapter downloader
// @namespace   https://view.ridibooks.com/books/*
// @match       https://view.ridibooks.com/books/*
// @grant       none
// @version     1.0
// @author      ssrankedghoul
// @description Download all images from a chapter on ridibooks.com
// @license     MIT
// @require     https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.3/jszip.min.js
// @downloadURL https://update.greasyfork.org/scripts/488636/ridibookscom%20chapter%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/488636/ridibookscom%20chapter%20downloader.meta.js
// ==/UserScript==
/* jshint esversion: 8 */
;(() => {
	let files = []

	function downloadImage(url, i) {
		return new Promise((resolve, reject) => {
			fetch(url)
				.then((response) => response.blob())
				.then((blob) => {
					files[i] = blob
					resolve(blob)
				})
				.catch(reject)
		})
	}

	function saveFilesAsZip() {
		const a = document.createElement('a')
		const jsZip = new JSZip()

		for (let i = 0; i < files.length; i++) {
			jsZip.file(`${i + 1}.png`, files[i])
		}

		jsZip.generateAsync({ type: 'blob' }).then((content) => {
			a.href = URL.createObjectURL(content)
			a.download = `ridibooks-${getBookID()}.zip`
			a.click()
			URL.revokeObjectURL(a.href)
			files = []
		})
	}

	function getBookID() {
		return window.location.pathname.match(/\d+/)[0]
	}

	async function downloadAll() {
		alert('Download started...')
		/**
		 * @typedef {Object} GenerateResponse
		 * @property {boolean} success
		 * @property {Object} data
		 * @property {string} data.type
		 * @property {Object[]} data.pages
		 * @property {string} data.pages[].src
		 */
		/**
		 * @type {GenerateResponse}
		 */
		const res = await fetch('https://ridibooks.com/api/web-viewer/generate', {
			credentials: 'include',
			headers: {
				'User-Agent':
					window.navigator.userAgent ||
					'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36',
				Accept: 'application/json, text/plain, */*',
				'Accept-Language': 'en-US,en;q=0.5',
				'Content-Type': 'application/json',
			},
			referrer: 'https://view.ridibooks.com/',
			body: `{"book_id":"${getBookID()}"}`,
			method: 'POST',
			mode: 'cors',
		}).then((res) => res.json())

		if (!res.success) return alert(res.data)

		await Promise.all(res.data.pages.map((page, i) => downloadImage(page.src, i)))
		saveFilesAsZip()
	}

	window.addEventListener('load', () => {
		let i = 0
		const interval = setInterval(() => {
			const likeButton = document.querySelector('.preference_toggle_button')
			if (!likeButton) {
				if (i > 10) {
					clearInterval(interval)
					return console.error('Could not find like button')
				}
				return i++
			}
			const downloadButton = document.createElement('button'),
				downloadButtonText = document.createElement('span')

			downloadButtonText.textContent = 'Download'
			downloadButton.classList.add('preference_toggle_button')
			downloadButton.id = 'downloadButton'
			downloadButton.addEventListener('click', downloadAll)

			document.head.insertAdjacentHTML(
				'beforeend',
				`<style>
                    #downloadButton {
                        border: 1px solid #663399;
                        margin-top: 5px !important;
                        line-height: 0 !important;
                        height: 50% !important;
                    }
                    #downloadButton:hover { 
                        background-color: #00ced1;
                    }
                    .header_wrapper > .header_right {
                        width: 180px !important;
                    }
                </style>`
			)

			downloadButton.appendChild(downloadButtonText)
			likeButton.before(downloadButton)
			clearInterval(interval)
		}, 1000)
	})

	window.saveFilesAsZip = saveFilesAsZip
})()
