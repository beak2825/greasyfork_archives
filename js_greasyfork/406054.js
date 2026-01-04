// ==UserScript==
// @name         网易云音乐显示完整歌单
// @namespace    https://github.com/nondanee
// @version      1.4.13
// @description  解除歌单歌曲展示数量限制 & 播放列表 1000 首上限
// @author       nondanee
// @match        *://music.163.com/*
// @icon         https://s1.music.126.net/style/favicon.ico
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/406054/%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90%E6%98%BE%E7%A4%BA%E5%AE%8C%E6%95%B4%E6%AD%8C%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/406054/%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90%E6%98%BE%E7%A4%BA%E5%AE%8C%E6%95%B4%E6%AD%8C%E5%8D%95.meta.js
// ==/UserScript==

(() => {
	if (window.top === window.self) {
		const observe = () => {
			try {
				const callback = () => document.contentFrame.dispatchEvent(new Event('songchange'))
				const observer = new MutationObserver(callback)
				observer.observe(document.querySelector('.m-playbar .words'), { childList: true })
			} catch (_) {}
		}
		window.addEventListener('load', observe, false)
		return
	}

	const locate = (object, pattern) => {
		for (const key in object) {
			const value = object[key]
			if (!Object.prototype.hasOwnProperty.call(object, key) || !value) continue
			switch (typeof value) {
				case 'function': {
					if (String(value).match(pattern)) return [key]
					break
				}
				case 'object': {
					const path = locate(value, pattern)
					if (path) return [key].concat(path)
					break
				}
			}
		}
	}

	const findMethod = (object, pattern) => {
		const path = locate(object, pattern)
		if (!path) throw new Error('MethodNotFound')
		let poiner = object
		const last = path.pop()
		path.forEach(key => poiner = poiner[key])
		const origin = poiner[last]
		return {
			origin,
			override: (value) => {
				value.toString = () => origin.toString()
				poiner[last] = value
			}
		}
	}

	const cloneEvent = (event) => {
		const copy = new event.constructor(event.type, event)
		// copy.target = event.target // 有问题
		Object.defineProperty(copy, 'target', { value: event.target })
		return copy
	}

	const normalize = song => {
		song = { ...song, ...song.privilege }
		return {
			...song,
			album: song.al,
			alias: song.alia || song.ala || [],
			artists: song.ar || [],
			commentThreadId: `R_SO_4_${song.id}`,
			copyrightId: song.cp,
			duration: song.dt,
			mvid: song.mv,
			position: song.no,
			ringtone: song.rt,
			status: song.st,
			pstatus: song.pst,
			version: song.v,
			songType: song.t,
			score: song.pop,
			transNames: song.tns || [],
			privilege: song.privilege,
			lyrics: song.lyrics
		}
	}

	const zFill = (string = '', length = 2) => {
		string = String(string)
		while (string.length < length) string = '0' + string
		return string
	}

	const formatDuration = duration => {
		const oneSecond = 1e3
		const oneMinute = 60 * oneSecond
		const result = []

		Array(oneMinute, oneSecond)
			.reduce((remain, unit) => {
				const value = Math.floor(remain / unit)
				result.push(value)
				return remain - value * unit
			}, duration || 0)

		return result
			.map(value => zFill(value, 2))
			.join(':')
	}

	const TYPE = {
		SONG: '18',
		PLAYLIST: '13',
	}

	const CACHE = window.COMPLETE_PLAYLIST_CACHE = {
		[TYPE.SONG]: {},
		[TYPE.PLAYLIST]: {}
	}

	const interceptRequest = () => {
		if (window.getPlaylistDetail) return

		const request = findMethod(window.nej, '\\.replace\\("api","weapi')

		const Fetch = (url, options) => (
			new Promise((resolve, reject) =>
				request.origin(url, {
					...options,
					cookie: true,
					method: 'GET',
					onerror: reject,
					onload: resolve,
					type: 'json'
				})
			)
		)

		window.getPlaylistDetail = async (url, options) => {
			// const search = new URLSearchParams(options.data)
			// search.set('n', 0)
			// options.data = search.toString()

			const data = await Fetch(url, options)
			const slice = 1000

			const trackIds = (data.playlist || {}).trackIds || []
			const tracks = (data.playlist || {}).tracks || []

			if (!trackIds.length || trackIds.length === tracks.length) return data

			const missingTrackIds = trackIds.slice(tracks.length)
			const round = Math.ceil(missingTrackIds.length / slice)

			const result = await Promise.all(
				Array(round).fill().map((_, index) => {
					const part = missingTrackIds.slice(index * slice).slice(0, slice).map(({ id }) => ({ id }))
					return Fetch('/api/v3/song/detail', { data: `c=${JSON.stringify(part)}` })
				})
			)

			const songMap = {}
			const privilegeMap = {}

			result.forEach(({ songs, privileges }) => {
				songs.forEach(_ => songMap[_.id] = _)
				privileges.forEach(_ => privilegeMap[_.id] = _)
			})

			const missingTracks = missingTrackIds
				.map(({ id }) => ({ ...songMap[id], privilege: privilegeMap[id] }))

			const missPrivileges = missingTracks
				.map(({ id }) => privilegeMap[id])

			data.playlist.tracks = tracks.concat(missingTracks)
			data.privileges = (data.privileges || []).concat(missPrivileges)

			CACHE[TYPE.PLAYLIST][data.playlist.id] = data.playlist.tracks
				.map(song => CACHE[TYPE.SONG][song.id] = normalize(song))

			return data
		}

		const overrideRequest = async (url, options) => {
			if (/\/playlist\/detail/.test(url)) {
				const { onload, onerror } = options
				return window.getPlaylistDetail(url, options).then(onload).catch(onerror)
			}
			return request.origin(url, options)
		}

		request.override(overrideRequest)
	}

	const handleSongChange = () => {
		try {
			const { track } = window.top.player.getPlaying()
			const { id, source, program } = track
			if (program) return

			const base = 'span.ply'
			const attrs = `[data-res-id="${id}"][data-res-type="${TYPE.SONG}"]`

			// player.addTo() 相同 id 不同 source 会被过滤
			// const { fid, fdata } = source
			// if (String(fid) !== TYPE.PLAYLIST) return
			// const attrs = `[data-res-id="${id}"][data-res-from="${fid}"][data-res-data="${fdata}"]`

			document.querySelectorAll(base).forEach(node => {
				node.classList.remove('ply-z-slt')
			})

			document.querySelectorAll(base + attrs).forEach(node => {
				node.classList.add('ply-z-slt')
			})
		} catch (_) {}
	}

	const escapeHTML = string => (
		string.replace(
			/[&<>'"]/g,
			word =>
			({
				'&': '&amp;',
				'<': '&lt;',
				'>': '&gt;',
				"'": '&#39;',
				'"': '&quot;',
			})[word] || word
		)
	)

	const bindEvent = () => {
		const ACTIONS = new Set(['play', 'addto'])

		const onClick = (event) => {
			const {
				resAction,
				resId,
				resType,
				resData,
			} = event.target.dataset

			const data = (CACHE[resType] || {})[resId]
			if (!data) return

			event.stopPropagation()

			if (!ACTIONS.has(resAction)) {
				// 没有 privilege 冒泡后会报错
				document.body.dispatchEvent(cloneEvent(event))
				return
			}

			const playlistId = Number(resType === TYPE.PLAYLIST ? resId : resData)

			const list = (Array.isArray(data) ? data : [data])
				.map(song => ({
					...song,
					source: {
						fdata: playlistId,
						fid: TYPE.PLAYLIST,
						link: `/playlist?id=${playlistId}&_hash=songlist-${song.id}`,
						title: '歌单',
					},
				}))

			window.top.player.addTo(
				list,
				resAction === 'play' && resType === TYPE.PLAYLIST,
				resAction === 'play'
			)
		}

		const body = document.querySelector('table tbody')
		const play = document.querySelector('#content-operation .u-btni-addply')
		const add = document.querySelector('#content-operation .u-btni-add')

		if (play) play.addEventListener('click', onClick)
		if (add) add.addEventListener('click', onClick)
		if (body) body.addEventListener('click', onClick)
	}

	const completePlaylist = async (id) => {
		const render = (song, index, playlist) => {
			const { album, artists, status, duration } = song
			const deletable = playlist.creator.userId === window.GUser.userId
			const durationText = formatDuration(duration)
			const artistText = artists.map(({ name }) => escapeHTML(name)).join('/')
			const annotation = escapeHTML(song.transNames[0] || song.alias[0] || '')
			const albumName = escapeHTML(album.name)
			const songName = escapeHTML(song.name)

			return `
				<tr id="${song.id}${Date.now()}" class="${index % 2 ? '' : 'even'} ${status ? 'js-dis' : ''}">
					<td class="left">
						<div class="hd "><span data-res-id="${song.id}" data-res-type="18" data-res-action="play" data-res-from="13" data-res-data="${playlist.id}" class="ply ">&nbsp;</span><span class="num">${index + 1}</span></div>
					</td>
					<td>
						<div class="f-cb">
							<div class="tt">
								<div class="ttc">
									<span class="txt">
										<a href="#/song?id=${song.id}"><b title="${songName}${annotation ? ` - (${annotation})` : ''}">${songName}</b></a>
										${annotation ? `<span title="${annotation}" class="s-fc8">${annotation ? ` - (${annotation})` : ''}</span>` : ''}
										${song.mvid ? `<a href="#/mv?id=${song.mvid}" title="播放mv" class="mv">MV</a>` : ''}
									</span>
								</div>
							</div>
						</div>
					</td>
					<td class=" s-fc3">
						<span class="u-dur candel">${durationText}</span>
						<div class="opt hshow">
							<a class="u-icn u-icn-81 icn-add" href="javascript:;" title="添加到播放列表" hidefocus="true" data-res-type="18" data-res-id="${song.id}" data-res-action="addto" data-res-from="13" data-res-data="${playlist.id}"></a>
							<span data-res-id="${song.id}" data-res-type="18" data-res-action="fav" class="icn icn-fav" title="收藏"></span>
							<span data-res-id="${song.id}" data-res-type="18" data-res-action="share" data-res-name="${albumName}" data-res-author="${artistText}" data-res-pic="${album.picUrl}" class="icn icn-share" title="分享">分享</span>
							<span data-res-id="${song.id}" data-res-type="18" data-res-action="download" class="icn icn-dl" title="下载"></span>
							${deletable ? `<span data-res-id="${song.id}" data-res-type="18" data-res-from="13" data-res-data="${playlist.id}" data-res-action="delete" class="icn icn-del" title="删除">删除</span>` : ''}
						</div>
					</td>
					<td>
						<div class="text" title="${artistText}">
							<span title="${artistText}">
								${artists.map(({ id, name }) => `<a href="#/artist?id=${id}" hidefocus="true">${escapeHTML(name)}</a>`).join('/')}
							</span>
						</div>
					</td>
					<td>
						<div class="text">
							<a href="#/album?id=${album.id}" title="${albumName}">${albumName}</a>
						</div>
					</td>
				</tr>
			`
		}

		const seeMore = document.querySelector('.m-playlist-see-more')
		if (seeMore) seeMore.innerHTML = '<div class="text">更多内容加载中...</div>'

		const data = await window.getPlaylistDetail(
			'/api/v6/playlist/detail/',
			{ data: `id=${id}&offset=0&total=true&limit=1000&n=1000` }
		)
		const { playlist } = data
		const content = playlist.tracks
			.map((song, index) => render(normalize(song), index, playlist))
			.join('')

		const body = document.querySelector('table tbody')
		if (body) body.innerHTML = content
		bindEvent()
		handleSongChange()

		if (seeMore) seeMore.parentNode.removeChild(seeMore)
	}

	const handleRoute = () => {
		interceptRequest()
		const { href, search } = location
		if (/\/my\//.test(href)) return

		const id = new URLSearchParams(search).get('id')
		if (/playlist[/?]/.test(href) && id) completePlaylist(id)
	}

	window.addEventListener('songchange', handleSongChange)
	window.addEventListener('load', handleRoute, false)
	window.addEventListener('hashchange', handleRoute, false)
})()