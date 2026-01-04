// ==UserScript==
// @name        lezhin.com downloader
// @namespace   https://*lezhin.com/*/comic/
// @match       https://*lezhin.com/*/comic/*
// @version     1.0.2
// @author      ssrankedghoul
// @description Downloads all images of a chapter or title on lezhin.com
// @require     https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.3/jszip.min.js
// @license     MIT
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/495421/lezhincom%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/495421/lezhincom%20downloader.meta.js
// ==/UserScript==
/* jshint esversion: 11 */
;(() => {
	const debug = false
	/**
	 * Downloads all images of a chapter and archives them to a zip file (blob)
	 * @param {string} alias - name of the title
	 * @param {string} chapterName - name of the chapter
	 * @param {boolean} silent - if true, doesn't show download progress
	 * @returns {Promise<Blob>}
	 */
	async function downloadImagesAsZip(alias, chapterName, silent = false) {
		const jsZip = new JSZip(),
			purchased = true, // experimental
			magicQ = 10e3,
			headers = {
				'X-LZ-Adult': 2,
				'X-LZ-AllowAdult': true,
				'X-LZ-Country': 'de',
				'X-LZ-Locale': 'ko-KR',
			}

		// getting info about title and chapter
		const chapterData = (
			await fetch(
				'https://www.lezhin.com/lz-api/v2/inventory_groups/comic_viewer_k?' +
					Object.entries({
						platform: 'web',
						store: 'web',
						alias,
						name: chapterName,
						preload: false,
						type: 'comic_episode',
					})
						.map((e) => `${e[0]}=${e[1]}`)
						.join('&'),
				{
					method: 'GET',
					credentials: 'include',
					mode: 'cors',
					headers,
				}
			).then((res) => res.json())
		).data?.extra?.episode

		if (!chapterData) return alert('chapter data could not be loaded')
		const { idComic: titleId, id: chapterId, scroll: imagesAmount } = chapterData

		// getting authorization token
		const bearerRes = await fetch(`https://www.lezhin.com/ko/comic/${alias}/${chapterName}`, {
			method: 'GET',
			credentials: 'include',
			mode: 'cors',
			headers,
		}).then((res) => res.text())
		const token = bearerRes.match(/<script>[\S\s]*?token:\s*(')(.*?)\1[\S\s]*?<\/script>/)?.[2]

		if (!token) return alert('authorization token could not be loaded')
		headers.Authorization = `Bearer ${token}`

		// getting secure string
		const secureRes = await fetch(
			'https://www.lezhin.com/lz-api/v2/cloudfront/signed-url/generate?' +
				Object.entries({
					contentId: titleId,
					episodeId: chapterId,
					purchased,
					q: magicQ,
					firstCheckType: 'P',
				})
					.map((e) => `${e[0]}=${e[1]}`)
					.join('&'),
			{
				method: 'GET',
				credentials: 'include',
				mode: 'cors',
				headers,
			}
		).then((res) => res.json())
		if (secureRes.code !== 0) return alert(secureRes.description)
		let secureData = secureRes.data
		delete secureData.expiredAt
		delete secureData.now
		const secureString = Object.entries({ ...secureData, purchased, q: magicQ })
			.map((e) => `${e[0]}=${e[1]}`)
			.join('&')

		// downloading images
		let downloadCounter = 0
		const blobs = await Promise.all(
			Array.from({ length: +imagesAmount }, (_, i) =>
				fetch(
					`https://rcdn.lezhin.com/v2/comics/${titleId}/episodes/${chapterId}/contents/scrolls/${
						i + 1
					}.webp?${secureString}`,
					{
						method: 'GET',
						mode: 'cors',
						cache: 'no-cache',
					}
				)
					.then((res) => res.blob())
					.then((blob) => {
						if (!silent) {
							console.log(`downloaded ${++downloadCounter}/${imagesAmount}`)
						}
						return blob
					})
			)
		)

		// saving dowloaded images as zip
		for (let i = 0; i < blobs.length; i++) {
			jsZip.file(`${i + 1}.jpeg`, blobs[i])
		}

		if (debug) debugger
		return new Promise((resolve) => {
			jsZip.generateAsync({ type: 'blob' }).then((archive) => resolve(archive))
		})
	}

	function getTitleName() {
		return document.querySelector('.comicInfo__title').innerText
	}

	let lastCall = 0
	function renderAllDownloadButtons() {
		if (Date.now() - lastCall < 500) return
		lastCall = Date.now()
		document.querySelectorAll('.download').forEach((el) => el.remove())

		document.head.insertAdjacentHTML(
			'beforeend',
			`<style>
				.download {
					position: absolute;
					left: 50%;
					align-self: center;
				}
				.downloadButton {
					border: 1px solid #663399;
					line-height: 0 !important;
					height: 30px !important;
					width: 150% !important;
					display: flex;
					justify-content: center;
					align-items: center;
					cursor: pointer;
					box-shadow: 0 0 5px #663399;
					box-sizing: border-box;
					border-radius: 5px;
					z-index: 9999;
					transition: all 0.3s ease;
				}
				.downloadButton:hover {
					background-color: #008587;
				}
				.episode__item {
					border: 1px solid gray;
					margin-bottom: 10px;
					padding: 5px;
					border-radius: 5px;
					box-shadow: 0 0 4px gray;
				}
			</style>`
		)

		const titleInfo = __LZ_PRODUCT__
		const alias = titleInfo.product.alias
		/** Contains chapter id and name
		 * @type {Record<string, string>} */
		const chaptersNames = new Map()
		for (const { id, name } of titleInfo.all) {
			chaptersNames.set(id.toString(), name)
		}

		const addDownloadButton = (anchor) => {
			const downloadButtonContainer = document.createElement('div'),
				downloadButton = document.createElement('div'),
				downloadButtonText = document.createElement('span')

			const chapterId = anchor.parentNode.getAttribute('data-episode-id')
			const chapterName = chaptersNames.get(chapterId)
			if (!chapterId || !chapterName) return

			downloadButtonContainer.className = 'download'
			downloadButton.id = `downloadButton-${chapterId}`
			downloadButtonText.className = 'downloadButton'
			downloadButtonText.textContent = 'Download ↓'
			downloadButton.onclick = async (e) => {
				e.preventDefault()
				e.stopPropagation()

				alert(
					`downloading chapter with id ${chapterId} (${chapterName})...\n` +
						'you can watch the download progress in the console'
				)
				const archive = await downloadImagesAsZip(alias, chapterName)
				const a = document.createElement('a')

				a.href = URL.createObjectURL(archive)
				a.download = `lezhin_${chapterName}_${getTitleName()}.zip`
				a.click()
				URL.revokeObjectURL(a.href)
			}

			downloadButton.appendChild(downloadButtonText)
			downloadButtonContainer.appendChild(downloadButton)
			anchor.insertAdjacentElement('afterend', downloadButtonContainer)
		}

		let i = 0
		const interval = setInterval(() => {
			if (document.querySelector('.is-comic')) return clearInterval(interval)

			i++

			if (i > 10) {
				clearInterval(interval)
				return alert('could not find chapter list')
			}

			const chapterDivs = document.querySelectorAll('.episode__item')
			if (!chapterDivs || !chapterDivs.length)
				return console.log('could not find chapter list', chapterDivs)

			for (const chapterDiv of chapterDivs) {
				addDownloadButton(chapterDiv.querySelector('.episode__price'))
			}

			i = 0
			return clearInterval(interval)
		}, 1000)
	}

	window.addEventListener('load', () => {
		if (document.querySelector('.is-comic')) return
		renderAllDownloadButtons()
	})
})()
