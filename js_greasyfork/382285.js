// ==UserScript==
// @name         NeteaseMusic UI Unlocker
// @namespace    https://github.com/nondanee
// @version      0.3.0
// @description  Simple UI Unblock for Netease cloud music Website
// @author       nondanee
// @match        https://music.163.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382285/NeteaseMusic%20UI%20Unlocker.user.js
// @updateURL https://update.greasyfork.org/scripts/382285/NeteaseMusic%20UI%20Unlocker.meta.js
// ==/UserScript==


/* Refer to JixunMoe/cuwcl4c
   https://github.com/JixunMoe/cuwcl4c/blob/master/src/site/music.163.ts */

(() => {
	const search = (object, pattern) => {
		let result = null
		Object.keys(object)
		.some(key => {
			if (!object[key]) return
			else if (typeof object[key] === 'function') {
				result = String(object[key]).match(pattern) ? [key] : null
			}
			else if (typeof object[key] === 'object') {
				const inner = search(object[key], pattern)
				result = inner ? [key].concat(inner) : null
			}
			return !!result
		})
		return result
	}

	const attach = (object, path, property) => {
		path = path.slice()
		let poiner = object
		const last = path.pop()
		path.forEach(key => {
			if (!(key in poiner)) throw new Error('KeyError')
			poiner = poiner[key]
		})
		return property ? poiner[last] = property : poiner[last]
	}

	if (window.top != window.self) { // in iframe
		const pathOne = search(window.nej, '\\.dataset;if')
		const pathTwo = search(window.nm, '\\.copyrightId==')
		const pathThree = search(window.nm, '\\.privilege;if')
		const functionOne = attach(window.nej, pathOne)

		attach(window.nej, pathOne, (z, name) => {
			if (name == 'copyright' || name == 'resCopyright') return 1
			return functionOne(z, name)
		})
		attach(window.nm, pathTwo, () => false)
		attach(window.nm, pathThree, song => {
			song.status = 0
			if (song.privilege) song.privilege.pl = 320000
			return 0
		})

		Array.from(document.getElementsByClassName('js-dis'))
		.forEach(element => element.classList.remove('js-dis'))

		const operation = document.getElementById('content-operation')
		if (operation) {
			const songId = operation.dataset.rid
			const disabledButton = operation.getElementsByClassName('u-btni-play-dis')[0]
			if (disabledButton) disabledButton.outerHTML = `
				<a data-res-action="play" data-res-id="${songId}" data-res-type="18" href="javascript:;" class="u-btn2 u-btn2-2 u-btni-addply f-fl" hidefocus="true" title="播放"><i><em class="ply"></em>播放</i></a>
				<a data-res-action="addto" data-res-id="${songId}" data-res-type="18" href="javascript:;" class="u-btni u-btni-add" hidefocus="true" title="添加到播放列表"></a>
			`
		}
	}
})()