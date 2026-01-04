// ==UserScript==
// @name        toomics.com chapter downloader
// @namespace   https://*.toomics.com/*
// @match       https://*.toomics.com/*
// @grant       GM_xmlhttpRequest
// @version     2.1
// @author      ssrankedghoul
// @description Download all images from a chapter on toomics.com
// @license     MIT
// @require     https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.3/jszip.min.js
// @downloadURL https://update.greasyfork.org/scripts/504022/toomicscom%20chapter%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/504022/toomicscom%20chapter%20downloader.meta.js
// ==/UserScript==
/* jshint esversion: 11 */
;(() => {
	let files = []
	const GLOBAL = window.location.hostname.startsWith('global')

	async function downloadImage(url, i) {
		return new Promise((resolve) => {
			GM_xmlhttpRequest({
				method: 'GET',
				url,
				headers: {
					Referer: `https://${window.location.hostname}/`,
				},
				responseType: 'blob',
				onload: ({ response }) => {
					files[i] = response
					resolve(response)
				},
			})
		})
	}

	async function saveFilesAsZip(zipTitle) {
		const a = document.createElement('a')
		const jsZip = new JSZip()

		for (let i = 0; i < files.length; i++) {
			jsZip.file(`${i + 1}.png`, files[i])
		}

		await jsZip.generateAsync({ type: 'blob' }).then((content) => {
			a.href = URL.createObjectURL(content)
			a.download = `${zipTitle}.zip`
			a.click()
			URL.revokeObjectURL(a.href)
			files = []
		})
	}

	async function downloadAll(chapterHref) {
		alert('Download started...')

		const res = await fetch(chapterHref).then((res) => res.text())
		const html = new DOMParser().parseFromString(res, 'text/html')
		const images = [
			...html.querySelectorAll(
				GLOBAL ? 'img[id^="set_image_"]' : '.viewer__img > img',
			),
		]

		if (/warning-.*?\.png$/.test(images[0].src)) {
			images.shift()
		}

		await Promise.all(
			images.map((image, i) =>
				downloadImage(image.getAttribute('data-src') || image.src, i),
			),
		)

		saveFilesAsZip(html.title)
	}

	function getDownloadButton(chapterHref) {
		const downloadButton = document.createElement('button')
		const downloadButtonText = document.createElement('span')

		downloadButtonText.textContent = 'Download'
		downloadButton.id = 'downloadButton'
		downloadButton.addEventListener('click', (e) => {
			e.preventDefault()
			e.stopPropagation()
			downloadAll(chapterHref)
		})

		document.head.insertAdjacentHTML(
			'beforeend',
			`<style>
          #downloadButton {
            border-radius: 10px;
            transition: 0.3s ease;
            border: 1px solid #00ced191;
            padding: 5px 10px;
            background-color: #fff;
          }
          #downloadButton:hover { 
            background-color: #00ced1;
            box-shadow: 0 10px 20px 0 rgba(59, 100, 200, 0.2), 0 6px 20px 0 rgba(59, 100, 200, 0.19);
          }
          #downloadButton span {
            line-height: 1;
          }
      </style>`,
		)

		downloadButton.appendChild(downloadButtonText)
		return downloadButton
	}

	window.addEventListener('load', async () => {
		if (/.*?\/episode\/.*?\/\d+/.test(window.location.href)) {
			// Main page of the title
			const chapters = [
				...document.querySelectorAll(
					GLOBAL ? '.normal_ep > a' : '.eps__li > a',
				),
			]
			for (const chapter of chapters) {
				const chapterHref = [
					...(chapter.onclick || chapter.href).toString().matchAll(/'(.*?)'/g),
					[0, chapter.href],
				]
					.map((m) => m[1])
					.filter((str) => str.includes('/code/'))[0]

				if (!chapterHref) {
					alert('Chapter link not found', chapter, chapters)
					return
				}

				const button = getDownloadButton(chapterHref)

				if (GLOBAL) {
					const stars = chapter.querySelector('.cell-stars')
					const div = document.createElement('div')
					div.classList.add('cell-stars')
					div.appendChild(button)

					stars.parentNode.insertBefore(div, stars)
					stars.remove()
					return
				}

				const caption = chapter.querySelector('.ep__caption')
				const div = document.createElement('div')

				div.appendChild(button)
				div.style.width = 'min-content'

				caption.insertAdjacentElement('afterend', div)
			}

			return
		}
		if (/.*?\/detail\/code\/\d+\/ep\/\d+/.test(window.location.href)) {
			// Chapter page
			const button = getDownloadButton(window.location.href)
			const anchor = document.querySelector(
				GLOBAL ? '.viewer-title' : '.viewer__top-menu > li',
			)

			if (!GLOBAL) {
				anchor.parentElement.style.display = 'flex'
				anchor.parentElement.style.alignItems = 'center'
			}

			anchor.parentNode.insertBefore(button, anchor)
			return
		}
	})

	window.saveFilesAsZip = saveFilesAsZip
})()
