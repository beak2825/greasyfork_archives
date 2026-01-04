// ==UserScript==
// @name        nicovideo.jp chapter downloader
// @namespace   https://*manga.nicovideo.jp/*
// @match       https://*manga.nicovideo.jp/*
// @grant       GM_xmlhttpRequest
// @version     1.0
// @author      ssrankedghoul
// @description Download all images from a chapter on nicovideo.jp
// @license     MIT
// @require     https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.3/jszip.min.js
// @downloadURL https://update.greasyfork.org/scripts/504542/nicovideojp%20chapter%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/504542/nicovideojp%20chapter%20downloader.meta.js
// ==/UserScript==
/* jshint esversion: 11 */

/**
 * @typedef {object} Frame
 * @property {number} id
 * @property {object} meta
 * @property {string} meta.source_url link to encrypted image
 * @property {string} meta.drm_hash key for decryption
 */

;(() => {
	let files = []

	function xor(data, key) {
		const dataArray = new Uint8Array(data)
		const { length: dataLength } = dataArray
		const { length: keyLength } = key
		const resultArray = new Uint8Array(dataLength)
		for (let i = 0; i < dataLength; i += 1) {
			resultArray[i] = dataArray[i] ^ key[i % keyLength]
		}
		return resultArray
	}

	function generateKey(hash) {
		const chunks = hash.slice(0, 16).match(/[\da-f]{2}/gi)
		return new Uint8Array(chunks.map((e) => Number.parseInt(e, 16)))
	}

	async function decodeURLToBlob(url, hash) {
		const encryptedBlob = await new Promise((resolve) => {
			GM_xmlhttpRequest({
				method: 'GET',
				url,
				responseType: 'blob',
				onload: (params) => {
					console.log({ url, hash, params })
					resolve(params.response)
				},
			})
		})
		const decryptedBlobData = xor(
			new Uint8Array(await encryptedBlob.arrayBuffer()),
			generateKey(hash),
		)
		return new Blob([decryptedBlobData], {
			type: 'image/jpeg',
		})
	}

	async function downloadImage(url, hash, i) {
		files[i] = await decodeURLToBlob(url, hash)
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

	async function getChapterTitle(chapterId) {
		const title = await new Promise((resolve) => {
			GM_xmlhttpRequest({
				method: 'GET',
				url: `https://api.nicomanga.jp/api/v1/app/manga/episodes/${chapterId}`,
				onload: ({ response }) =>
					resolve(JSON.parse(response).data.result.meta.title),
			})
		})
		return title
	}

	/**
	 *
	 * @param {string} chapterHref
	 */
	async function downloadAll(chapterHref) {
		const chapterId = chapterHref.match(/\/mg(\d+)/)[1]
		if (!chapterId) {
			return alert(`No chapter ID found in link ${chapterHref}`)
		}

		alert('Download started...')

		/** @type {Frame[]} */
		const frames = await new Promise((resolve) => {
			GM_xmlhttpRequest({
				method: 'GET',
				url: `https://api.nicomanga.jp/api/v1/app/manga/episodes/${chapterId}/frames`,
				onload: ({ response }) => resolve(JSON.parse(response).data.result),
			})
		})

		await Promise.all(
			frames.map(({ meta: { source_url, drm_hash } }, i) =>
				downloadImage(source_url, drm_hash, i),
			),
		)

		const title = await getChapterTitle(chapterId).catch(() => '')
		saveFilesAsZip(`nicovideo-${title || chapterId}`)
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
            color: #171717;
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

	async function isSelectorPresent(selector) {
		return Promise.race([
			new Promise((_, reject) => setTimeout(reject, 5_000)),
			new Promise((resolve) => {
				const observer = new MutationObserver(() => {
					if (document.querySelector(selector)) {
						observer.disconnect()
						resolve(true)
					}
				})

				observer.observe(document.body, {
					childList: true,
					subtree: true,
				})
			}),
		]).catch(() => {
			alert('No chapters found')
			return
		})
	}

	window.addEventListener('load', async () => {
		if (/\.jp\/comic\/\d+/.test(window.location.href)) {
			// Main page of the title
			const selector = 'main > div > ul.divide-y > li > a'

			const selectorIsPresent = await isSelectorPresent(selector).catch(
				() => false,
			)
			if (!selectorIsPresent) {
				return alert('No chapters found')
			}

			const chapters = [...document.querySelectorAll(selector)]

			for (const chapter of chapters) {
				const chapterHref = chapter.href

				if (!chapterHref) {
					alert('Chapter link not found', chapter, chapters)
					return
				}

				const button = getDownloadButton(chapterHref)

				const caption = chapter.querySelector('h4')
				const container = caption.parentElement
				const div = document.createElement('div')

				for (const _class of container.classList) {
					container.classList.remove(_class)
				}

				container.classList.add('fix-freaks-container')

				div.appendChild(button)
				caption.insertAdjacentElement('afterend', div)
			}

			document.head.insertAdjacentHTML(
				'beforeend',
				`<style>
          .fix-freaks-container {
            display: grid;
            grid-template-columns: 3fr 1fr 1fr;
            width: 100%;
            align-items: center;
            padding: 0 2em;
          }
        </style>`,
			)

			return
		}
		if (/\.jp\/watch\/mg\d+/.test(window.location.href)) {
			// Chapter page
			const selector = 'header h1'
			const selectorIsPresent = await isSelectorPresent(selector).catch(
				() => false,
			)

			if (!selectorIsPresent) {
				return alert('No title found')
			}

			const button = getDownloadButton(window.location.href)
			const anchor = document.querySelector('header h1')
			const container = anchor.parentElement

			container.style.display = 'flex'
			container.style.alignItems = 'center'

			anchor.insertAdjacentElement('afterend', button)
			return
		}
	})
})()
