// ==UserScript==
// @name        E-hentai & exhentai Japanese title
// @name:zh-TW  E-hentai & exhentai 日語標題
// @name:ja     E-hentai & exhentai 日本語作品名
// @namespace   wonderlife
// @description Make main listing to show japanese title if avaliable
// @description:zh-tw 在 e-hentai 及 ex-hentai 主要列表顯示日語標題 (如果上傳者有設定的話)。
// @description:ja e-hentai と exhentai のリストに日本語タイトルを表示する。
// @include     *://exhentai.org/*
// @include     *://e-hentai.org/*
// @exclude     *://exhentai.org/g/*
// @exclude     *://e-hentai.org/g/*
// @version     1.6.0
// @grant       unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/413118/E-hentai%20%20exhentai%20Japanese%20title.user.js
// @updateURL https://update.greasyfork.org/scripts/413118/E-hentai%20%20exhentai%20Japanese%20title.meta.js
// ==/UserScript==

;(function () {
	'use strict'

	const rewrite = async target => {
		const link_nodes = {}
		const gidlist = []
		const link_exp = /\/g\/(.*)\/(.*)\//

		const links = target.querySelectorAll('div.gl1t > a')
		links.forEach(link => {
			let parts = link_exp.exec(link.getAttribute('href'))
			if (parts === null) return

			parts.shift()
			parts[0] = Number(parts[0])

			gidlist.push(parts)
			link_nodes[parts[0]] = link
		})

		if (gidlist.length !== 0) {
			const payload = JSON.stringify({ method: 'gdata', gidlist: gidlist })

			const responce = await fetch('/api.php', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: payload
			})
			const data = await responce.json()

			data.gmetadata.forEach(value => {
				if (value.title_jpn === '') return
				link_nodes[value.gid].firstElementChild.innerText = value.title_jpn
			})
		}
	}

	const target = document.querySelector('#toppane + div')

	rewrite(target)

	const observer = new MutationObserver(records => {
		const added = records[0].addedNodes[2]
		rewrite(added)
	})

	observer.observe(target, { childList: true })
})()
