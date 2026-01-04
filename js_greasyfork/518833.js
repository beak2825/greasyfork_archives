// ==UserScript==
// @name         Pi image
// @name:ui
// @name:90
// @namespace    https://blog.
// @version      0.6.3
// @description  Save pixiv image easily with custom name f
// @author       maple3142
// @match        https://www.pixiv.net/bookmark.php*
// @match        https://www.pixiv.net/new_illust.php*
// @match        https://www.pixiv.net/bookmark_new_illust.php*
// @match        https://www.pixiv.net/ranking.php*
// @match        https://www.pixiv.net/search.php*
// @match        https://www.pixiv.net/artworks*
// @match        https://www.pixiv.net/member.php*
// @connect      pximg.net
// @grant        GM_xmlhttpRequest
// @compatible   firefox >=52
// @compatible   chrome >=55
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/518833/Pi%20image.user.js
// @updateURL https://update.greasyfork.org/scripts/518833/Pi%20image.meta.js
// ==/UserScript==
 
;(function() {
	'use strict'
	const FORMAT = {
		single: d => `${d.title}-${d.userName}-${d.id}`,
		multiple: (d, i) => `${d.title}-${d.userName}-${d.id}-p${i}`
	}
	const KEYCODE_TO_SAVE = 83 // 83 is 's' key
	const SAVE_UGOIRA_AS_WEBM = false // faster than gif
	const USE_PIXIVCAT = true // much faster than pximg
 
	const gxf = xf.extend({ fetch: gmfetch })
	const $ = s => document.querySelector(s)
	const $$ = s => [...document.querySelectorAll(s)]
	const elementmerge = (a, b) => {
		Object.keys(b).forEach(k => {
			if (typeof b[k] === 'object') elementmerge(a[k], b[k])
			else if (k in a) a[k] = b[k]
			else a.setAttribute(k, b[k])
		})
	}
	const $el = (s, o = {}) => {
		const el = document.createElement(s)
		elementmerge(el, o)
		return el
	}
	const download = (url, fname) => {
		const a = $el('a', { href: url, download: fname || true })
		document.body.appendChild(a)
		a.click()
		document.body.removeChild(a)
	}
	const downloadBlob = (blob, fname) => {
		const url = URL.createObjectURL(blob)
		download(url, fname)
		URL.revokeObjectURL(url)
	}
	const blobToCanvas = blob =>
		new Promise((res, rej) => {
			const src = URL.createObjectURL(blob)
			const img = $el('img', { src })
			const cvs = $el('canvas')
			const ctx = cvs.getContext('2d')
			img.onload = () => {
				URL.revokeObjectURL(src)
				cvs.height = img.naturalHeight
				cvs.width = img.naturalWidth
				ctx.drawImage(img, 0, 0)
				res(cvs)
			}
			img.onerror = e => {
				URL.revokeObjectURL(src)
				rej(e)
			}
		})
	const getJSONBody = url => xf.get(url).json(r => r.body)
	const getIllustData = id => getJSONBody(`/ajax/illust/${id}`)
	const getUgoiraMeta = id => getJSONBody(`/ajax/illust/${id}/ugoira_meta`)
	const getCrossOriginBlob = (url, Referer = 'https://www.pixiv.net/') =>
		gxf.get(url, { headers: { Referer } }).blob()
	const getImageFromPximg = (url, pixivcat_multiple_systax) => {
		if (USE_PIXIVCAT) {
			const [_, id, idx] = /\/(\d+)_p(\d+)/.exec(url)
			const newUrl = pixivcat_multiple_systax
				? `https://pixiv.cat/${id}-${parseInt(idx) + 1}.png`
				: `https://pixiv.cat/${id}.png`
			return xf.get(newUrl).blob()
		}
		return getCrossOriginBlob(url)
	}
	const saveImage = async ({ single, multiple }, id) => {
		const illustData = await getIllustData(id)
		if (snackbar) {
			snackbar.createSnackbar(`Downloading ${illustData.title}...`, {
				timeout: 1000
			})
		}
		let results
		const { illustType } = illustData
		switch (illustType) {
			case 0:
			case 1:
				{
					// normal
					const url = illustData.urls.original
					const ext = url
						.split('/')
						.pop()
						.split('.')
						.pop()
					if (illustData.pageCount === 1) {
						results = [[single(illustData) + '.' + ext, await getImageFromPximg(url)]]
					} else {
						const len = illustData.pageCount
						const ar = []
						for (let i = 0; i < len; i++) {
							ar.push(
								Promise.all([
									multiple(illustData, i) + '.' + ext,
									getImageFromPximg(url.replace('p0', `p${i}`), true)
								])
							)
						}
						results = await Promise.all(ar)
					}
				}
				break
			case 2: {
				// ugoira
				const fname = single(illustData)
				const ugoiraMeta = await getUgoiraMeta(id)
				const ugoiraZip = await xf.get(ugoiraMeta.originalSrc).blob()
				const { files } = await JSZip.loadAsync(ugoiraZip)
				const frames = await Promise.all(Object.values(files).map(f => f.async('blob').then(blobToCanvas)))
				if (SAVE_UGOIRA_AS_WEBM) {
					const getWebm = (data, frames) =>
						new Promise((res, rej) => {
							const encoder = new Whammy.Video()
							for (let i = 0; i < frames.length; i++) {
								encoder.add(frames[i], data.frames[i].delay)
							}
							encoder.compile(false, res)
						})
					results = [[fname + '.webm', await getWebm(ugoiraMeta, frames)]]
				} else {
					const numCpu = navigator.hardwareConcurrency || 4
					const getGif = (data, frames) =>
						new Promise((res, rej) => {
							const gif = new GIF({ workers: numCpu * 4, quality: 10 })
							for (let i = 0; i < frames.length; i++) {
								gif.addFrame(frames[i], { delay: data.frames[i].delay })
							}
							gif.on('finished', x => {
								res(x)
							})
							gif.on('error', rej)
							gif.render()
						})
					results = [[fname + '.gif', await getGif(ugoiraMeta, frames)]]
				}
			}
		}
 
		// `filenamify` will normalize file names, since some character is not allowed
		if (results.length === 1) {
			const [f, blob] = results[0]
			downloadBlob(blob, filenamify(f))
		} else {
			const zip = new JSZip()
			for (const [f, blob] of results) {
				zip.file(filenamify(f), blob)
			}
			const blob = await zip.generateAsync({ type: 'blob' })
			const zipname = single(illustData)
			downloadBlob(blob, filenamify(zipname))
		}
	}
 
	// key shortcut
	function getSelector() {
		const SELECTOR_MAP = {
			'/': 'a.work:hover,a._work:hover,.illust-item-root>a:hover',
			'/bookmark\\.php': 'a.work:hover',
			'/new_illust\\.php': 'a.work:hover',
			'/bookmark_new_illust\\.php': 'figure>div>a:hover,.illust-item-root>a:hover',
			'/artworks/\\d+': 'div[role=presentation]>a:hover,canvas:hover',
			'/ranking\\.php': 'a.work:hover,.illust-item-root>a:hover',
			'/search\\.php': 'figure>div>a:hover',
			'/member\\.php': '[href^="/artworks"]:hover,.illust-item-root>a:hover'
		}
		for (const [key, val] of Object.entries(SELECTOR_MAP)) {
			const rgx = new RegExp(`^${key}$`)
			if (rgx.test(location.pathname)) {
				return val
			}
		}
	}
	{
		addEventListener('keydown', e => {
			if (e.which !== KEYCODE_TO_SAVE) return
			e.preventDefault()
			e.stopPropagation()
			const selector = getSelector()
			let id
			if ($('#Patchouli')) {
				const el = $('.image-item-image:hover>a')
				if (el) id = /\d+/.exec(el.href.split('/').pop())[0]
			}
			if (!id && typeof selector === 'string') {
				const el = $(selector)
				if (el && el.href) id = /\d+/.exec(el.href.split('/').pop())[0]
				else if (location.pathname.startsWith('/artwork')) id = location.pathname.split('/').pop()
			}
			if (id) saveImage(FORMAT, id).catch(console.error)
		})
	}
	{
		document.body.appendChild(
			$el('link', {
				rel: 'stylesheet',
				href: 'https://unpkg.com/@snackbar/core@1.7.0/dist/snackbar.min.css'
			})
		)
	}
})()