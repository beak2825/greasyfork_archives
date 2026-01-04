// ==UserScript==
// @name        comic-walker.com chapter downloader
// @namespace   https://comic-walker.com/detail/*/episodes/*
// @match       https://comic-walker.com/detail/*/episodes/*
// @grant       none
// @version     1.1
// @author      ssrankedghoul
// @description Download all images from a chapter on comic-walker.com
// @license     MIT
// @require     https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.3/jszip.min.js
// @downloadURL https://update.greasyfork.org/scripts/489826/comic-walkercom%20chapter%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/489826/comic-walkercom%20chapter%20downloader.meta.js
// ==/UserScript==
/* jshint esversion: 11 */
;(() => {
	let currentHref

	function xor(xorKey) {
		return (uint8Array) => {
			const arrayLength = uint8Array.length
			const xorKeyLength = xorKey.length
			const xoredArray = new Uint8Array(arrayLength)

			for (let i = 0; i < arrayLength; i++) {
				xoredArray[i] = uint8Array[i] ^ xorKey[i % xorKeyLength]
			}

			return xoredArray
		}
	}

	function hashToXorKey(hash) {
		return hash.match(/.{2}/g).map((e) => Number.parseInt(e, 16))
	}

	async function createImage({ src }) {
		return new Promise((resolve, reject) => {
			const img = new Image()
			img.src = src
			img.onload = (e) => {
				resolve(e.currentTarget)
			}
			img.onerror = (e) => {
				reject(e)
			}
		})
	}

	const files = []
	async function downloadUrl({ url, xorHash, imageIndex }) {
		if (!url || !xorHash) {
			return console.error('Missing parameters')
		}

		const blob = await fetch(url)
			.then(async (e) => await e.arrayBuffer())
			.then((e) => new Uint8Array(e))
			.then(xor(hashToXorKey(xorHash)))
			.then((e) => new Blob([e]))

		files[imageIndex] = new File([blob], `${imageIndex}.jpg`)
	}

	async function downloadAll() {
		let episodeId
		try {
			episodeId = JSON.parse(document.querySelector('#__NEXT_DATA__').innerText)
				.props.pageProps.dehydratedState.queries[2].state.data.episode.id
			if (!episodeId) {
				throw new Error()
			}
		} catch {
			return alert('No episode ID found')
		}

		/**
		 * @typedef {Object[]} Scans
		 * @property {'xor'} drmMode
		 * @property {string} drmHash - The hash for decryption
		 * @property {string} drmImageUrl - The URL of the encrypted image
		 */

		/**
		 * @type {Scans}
		 */
		const list = (
			await fetch(
				`https://comic-walker.com/api/contents/viewer?episodeId=${episodeId}&imageSizeType=width:768`,
			).then((e) => e.json())
		).manuscripts

		if (!list) {
			return alert('No scans found')
		}

		await Promise.all(
			list.map((e, i) =>
				downloadUrl({ url: e.drmImageUrl, xorHash: e.drmHash, imageIndex: i }),
			),
		)

		const a = document.createElement('a')
		const jsZip = new JSZip()

		for (let i = 0; i < files.length; i++) {
			if (!files[i]) {
				continue
			}
			jsZip.file(`${i + 1}.jpg`, files[i])
		}

		jsZip.generateAsync({ type: 'blob' }).then((content) => {
			a.href = URL.createObjectURL(content)
			a.download =
				(document.title.toLowerCase().includes('comic walker')
					? document.title
					: '') || `walker-${episodeId}.zip`
			a.click()
			URL.revokeObjectURL(a.href)
			files.length = 0
		})
	}

	document.addEventListener('click', async () => {
		await new Promise((resolve) => setTimeout(resolve, 1000))
		if (!currentHref || currentHref === window.location.href) {
			return
		}

		currentHref = window.location.href
		addDownloadButton()
	})

	document.addEventListener('DOMContentLoaded', () => {
		addDownloadButton()
	})

	function addDownloadButton() {
		let i = 0
		const interval = setInterval(() => {
			if (i++ > 10) {
				clearInterval(interval)
				return alert('No search button found')
			}

			const anchorButton = document.querySelector(
				'div[class^=_root_] > div[class^=_lower_] > div[class^=_left_] button:last-of-type',
			)
			const downloadButton = document.createElement('div')
			const downloadButtonText = document.createElement('span')

			if (!anchorButton) {
				return
			}

			downloadButton.classList.add('downloadButton')
			downloadButtonText.innerText = 'Download'
			downloadButton.appendChild(downloadButtonText)

			downloadButton.addEventListener('click', () => {
				downloadAll()
			})

			document.head.insertAdjacentHTML(
				'beforeend',
				`<style>
            .downloadButton {
              border: 1px solid #7e0082;
              border-radius: 10px;
              cursor: pointer;
              padding: 5px 10px;
              transition: all 0.3s ease;
            }

            .downloadButton:hover {
              border: 1px solid #f403fc;
              background-color: #570059cf;
            }
        </style>`,
			)

			anchorButton.insertAdjacentElement('afterend', downloadButton)
			currentHref = window.location.href
			clearInterval(interval)
		}, 500)
	}
})()
