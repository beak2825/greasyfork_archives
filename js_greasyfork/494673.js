// ==UserScript==
// @name        novelpia.com downloader
// @namespace   https://novelpia.com/comic_episode
// @match       https://novelpia.com/comic_episode/*
// @version     1.1.2
// @author      ssrankedghoul
// @description Downloads all images of a chapter or title on novelpia.com
// @require     https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.3/jszip.min.js
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/494673/novelpiacom%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/494673/novelpiacom%20downloader.meta.js
// ==/UserScript==
/* jshint esversion: 8 */
/** @typedef {object} Chapter
 * @property {number} episode_no
 * @property {number} comic_no
 * @property {string} epi_thumb
 */
;(() => {
	const thumbnails = {}
	/**
	 * Downloads all images of a chapter and archives them to a zip file (blob)
	 * @param {number} chapterId
	 * @param {boolean} silent - if true, doesn't show download progress
	 * @returns {Promise<Blob>}
	 */
	async function downloadImagesAsZip(chapterId, silent = false) {
		const a = document.createElement('a'),
			jsZip = new JSZip()
		const res = await fetch(
			`https://novelpia.com/proc/comic?cmd=get_view_episode&episode_no=${chapterId}`,
			{ method: 'GET', credentials: 'include', mode: 'cors' }
		).then((res) => res.json())
		let downloadCounter = 0
		const blobs = await Promise.all(
			[
				...res.episode.epi_content
					.replaceAll('\\"', "'")
					.replaceAll('"', "'")
					.matchAll(/'\/(.*?.wimg)'/g),
			]
				.map((e) => 'https:/' + e[1])
				.map((e) =>
					fetch(e, {
						method: 'GET',
						cache: 'no-cache',
					})
						.then((res) => res.blob())
						.then((blob) => {
							if (!silent) {
								console.log(`downloaded ${++downloadCounter}/${images.length}`)
							}
							return blob
						})
				)
		)

		for (let i = 0; i < blobs.length; i++) {
			jsZip.file(`${i + 1}.jpeg`, blobs[i])
		}
		return new Promise((resolve) => {
			jsZip.generateAsync({ type: 'blob' }).then((archive) => resolve(archive))
		})
	}
	async function downloadAllChapters(titleId) {
		const lastDownloadedChapterId =
			parseInt(localStorage.getItem(`lastDownloadedChapterId_${titleId}`)) || 0
		const chapters = await getChapters(titleId)
		const archives = {}
		const jsZip = new JSZip()
		let filteredChapters = chapters.filter((e) => e.episode_no > lastDownloadedChapterId)
		if (!filteredChapters.length) {
			const input = prompt(
				`no new chapters to download. lastId: ${lastDownloadedChapterId}\ntype i to ignore`
			)
			if (input !== 'i') return
			filteredChapters = chapters
		}
		let downloadCounter = 0
		let tryCounter = 0
		for (const chapterId of filteredChapters.map((e) => e.episode_no)) {
			const consoleId = `${downloadCounter + 1}/${filteredChapters.length} (id: ${chapterId})`
			try {
				archives[chapterId] = { archive: await downloadImagesAsZip(chapterId, true), i: tryCounter }
				console.log(`downloaded chapter ${consoleId}`)
			} catch (e) {
				let reason = e.message
				if (reason.includes('can\'t access property "epi_contenat"')) {
					reason = 'chapter is not available'
				} else {
				}
				console.error(`couldn't download chapter ${consoleId}: ${reason}`)
			} finally {
				downloadCounter++
				tryCounter++
			}
		}
		const titleName = getTitleName()
		Object.entries(archives).forEach(([chapterId, { archive, i }]) => {
			jsZip.file(`${i + 1}_${chapterId}_${titleName}.zip`, archive)
		})
		jsZip
			.generateAsync({ type: 'blob' })
			.then((archive) => {
				const a = document.createElement('a')
				a.href = URL.createObjectURL(archive)
				a.download = `novelpia_m_${titleId}_${titleName}.zip`
				a.click()
			})
			.catch((e) => console.error(e))
		localStorage.setItem(`lastDownloadedChapterId_${titleId}`, filteredChapters.at(-1).episode_no)
	}
	function getTitleName() {
		return document.querySelector('.info-top > h5').innerText
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
					align-self: center;
					margin-right: 50%;
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
				}
				.downloadButton:hover {
					background-color: #00ced1;
				}
			</style>`
		)
		const addDownloadButton = (anchor) => {
			const downloadButtonContainer = document.createElement('div'),
				downloadButton = document.createElement('div'),
				downloadButtonText = document.createElement('span')
			const thumbId = anchor.parentNode.querySelector('.epi-thumb > img').src.split('/').pop()
			const chapterId = thumbnails[thumbId]
			if (!chapterId) return
			downloadButtonContainer.className = 'download'
			downloadButton.id = `downloadButton-${thumbId}`
			downloadButtonText.className = 'downloadButton'
			downloadButtonText.textContent = 'Download ↓'
			downloadButton.onclick = async (e) => {
				e.preventDefault()
				e.stopPropagation()
				alert(
					`downloading chapter with id ${chapterId}...\nyou can watch the download progress in the console`
				)
				const archive = await downloadImagesAsZip(chapterId)
				const a = document.createElement('a')
				a.href = URL.createObjectURL(archive)
				a.download = `novelpia_s_${chapterId}_${getTitleName()}.zip`
				a.click()
				URL.revokeObjectURL(a.href)
			}
			downloadButton.appendChild(downloadButtonText)
			downloadButtonContainer.appendChild(downloadButton)
			anchor.insertAdjacentElement('afterend', downloadButtonContainer)
		}
		const addDownloadAllButton = () => {
			const downloadButtonContainer = document.createElement('div'),
				downloadButton = document.createElement('div'),
				downloadButtonText = document.createElement('span'),
				anchor = document.querySelector('.filter')
			downloadButtonContainer.className = 'download'
			downloadButton.id = `downloadAllButton`
			downloadButtonText.className = 'downloadButton'
			downloadButtonText.textContent = 'Download all chapters ↓'
			downloadButton.onclick = (e) => {
				const titleId = window.location.pathname.split('/').pop().split('?')[0]
				e.preventDefault()
				e.stopPropagation()
				downloadAllChapters(titleId)
			}
			downloadButton.appendChild(downloadButtonText)
			downloadButtonContainer.appendChild(downloadButton)
			anchor.insertAdjacentElement('beforebegin', downloadButtonContainer)
		}
		let i = 0
		const interval = setInterval(() => {
			i++
			if (i > 10) {
				clearInterval(interval)
				return alert('could not find chapter list')
			}
			const chapters = document.querySelectorAll('.epi-list')
			if (!chapters || !chapters.length) return console.log('could not find chapter list')
			for (const chapter of chapters) {
				addDownloadButton(chapter.querySelector('.epi-desc'))
			}
			addDownloadAllButton()
			i = 0
			return clearInterval(interval)
		}, 1000)
	}
	/**
	 * Get array of all chapters (first 10e5) of a title
	 * @param {number} titleId
	 * @returns {Promise<Chapter[]>}
	 */
	async function getChapters(titleId) {
		return (
			await fetch(
				`https://novelpia.com/proc/comic?cmd=episode_list&comic_no=${titleId}&page=1&rows=${10e5}&sort_col=sort_no&sort=asc`
			).then((res) => res.json())
		).list_data.episode.list
	}
	window.addEventListener('load', async () => {
		const titleId = window.location.pathname.split('/').pop().split('?')[0]
		const chapters = await getChapters(titleId)
		for (const chapter of chapters) {
			thumbnails[chapter.epi_thumb.split('/').pop()] = chapter.episode_no
		}
		let i = 0
		const interval = setInterval(() => {
			i++
			if (i > 10) {
				return clearInterval(interval)
			}
			const pages = document.querySelectorAll('._pagination > li')
			if (!pages || !pages.length) {
				return
			}
			pages.forEach((el) => {
				el.addEventListener('click', () => {
					setTimeout(renderAllDownloadButtons, 1000)
				})
			})
		}, 1000)
		renderAllDownloadButtons()
	})
})()
