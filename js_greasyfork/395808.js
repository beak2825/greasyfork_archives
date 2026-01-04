// ==UserScript==
// @name        Bilibili MediaSession Helper
// @namespace   http://tampermonkey.net/
// @version     0.7.1
// @description Dock metadata to MediaSession API for bilibili.com (Chrome 73+)
// @author      nondanee
// @match       https://*.bilibili.com/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/395808/Bilibili%20MediaSession%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/395808/Bilibili%20MediaSession%20Helper.meta.js
// ==/UserScript==

(() => {
	if (!('mediaSession' in navigator)) return
	if (self != top) return

	const { mediaSession } = navigator
	const proxy = navigator.mediaSession = new Proxy(
		mediaSession,
		{
			set: (target, key, value) => value, // official mediameta do not have artist field
			get: (target, key) => (target[key] || {}).bind ? target[key].bind(target) : target[key],
		}
	)
	Object.defineProperty(navigator, 'mediaSession', {
		get: () => proxy
	})

	const updateMetadata = () =>
		Promise.resolve()
		.then(() => {
			const url = window.location.href
			let id, title, artist, cover
			if (id = (url.match(/live\.bilibili\.com\/(\d+)/) || [])[1]) {
				return fetch(`//api.live.bilibili.com/xlive/web-room/v1/index/getInfoByRoom?room_id=${id}`)
				.then(response => response.json())
				.then(body => body.data)
				.then(data => ({
					...data.room_info,
					artist: data.anchor_info.base_info.uname
				}))
			}
			else if (id = (url.match(/bilibili\.com\/video\/(av|BV)(\d+)/) || [])[1]) {
				const { videoData } = window.__INITIAL_STATE__
				return {
					title: videoData.title,
					artist: videoData.owner.name,
					cover: videoData.pic.replace('https:', '').replace('http:', '')
				}
			}
			else if (id = (url.match(/bilibili\.com\/bangumi\/play\/(\w+)/) || [])[1]) {
				const { progress = {} } = window.__PGC_USERSTATE__
				const { epInfo, epList, mediaInfo, sections = [] } = window.__INITIAL_STATE__
				if (id.startsWith('ss'))
					id = epInfo.id === -1 ? progress.last_ep_id : epInfo.id
				else if (id.startsWith('ep'))
					id = id.slice(2)
				const epListFromSections = sections.reduce((output, section) => output.concat(section.epList), [])
				const targetEpInfo = Array.prototype.concat(epList, epListFromSections).find(item => item.id.toString() === id.toString())
				return {
					title: mediaInfo.title,
					artist: [targetEpInfo.titleFormat, targetEpInfo.longTitle].join(' ').trim(),
					cover: targetEpInfo.cover
				}
			}
		})
		.then(({ title, artist, cover }) => {
			const image = new Image()
			image.onload = () => {
				mediaSession.metadata = new window.MediaMetadata({
					title,
					artist,
					artwork: [{ src: cover, sizes: `${image.naturalWidth}x${image.naturalHeight}`, type: 'image/jpeg' }]
				})
			}
			image.src = cover
		})

	updateMetadata()

	const { pushState, replaceState } = history
	history.pushState = function (...props) {
		pushState.apply(this, props)
		updateMetadata()
	}
	history.replaceState = function (...props) {
		replaceState.apply(this, props)
		updateMetadata()
	}
})()