// ==UserScript==
// @name         ExHentai insert Torrents on Gallery
// @name:ja      ExHentai Torrentを直接表示
// @namespace    wonderlife
// @version      0.1
// @description  Insert torrent links on gellery page
// @description:ja ギャラリーページにTorrentのリンクを直接表示する
// @author       Wonderlife
// @match        *://exhentai.org/g/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415175/ExHentai%20insert%20Torrents%20on%20Gallery.user.js
// @updateURL https://update.greasyfork.org/scripts/415175/ExHentai%20insert%20Torrents%20on%20Gallery.meta.js
// ==/UserScript==

;(async function() {
	'use strict'

	const torrentsAnchor = document.querySelector('#gd5 > :nth-child(3) > a')
	if (torrentsAnchor.innerHTML == 'Torrent Download (0)') return

	const url = location.href
	const parts = url.split('/')
	const [gid, token] = parts.slice(4, 6)

	const torrentsUrl = `https://exhentai.org/gallerytorrents.php?gid=${gid}&t=${token}`

	const responce = await fetch(torrentsUrl)
	const torrentsText = await responce.text()

	const domparser = new DOMParser()
	const torrentsHtml = domparser.parseFromString(torrentsText, 'text/html')

	const wrapper = document.createElement('div')
	wrapper.setAttribute(
		'style',
		'max-width:1170px; margin:0 auto 24px; display:flex; justify-content:space-between; flex-wrap:wrap; text-align:left;'
	)
	const tables = torrentsHtml.querySelectorAll(
		'#torrentinfo > div:first-child > form > div'
	)
	tables.forEach(table => {
		table.style.width = '566px'
		wrapper.appendChild(table)
	})

	const insertTarget = document.getElementById('asm')
	document.body.insertBefore(wrapper, insertTarget)
})();