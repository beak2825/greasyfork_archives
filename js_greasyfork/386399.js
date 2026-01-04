// ==UserScript==
// @name         NeteaseMusic Resolution Upgrader
// @namespace    https://github.com/nondanee
// @version      0.2.1
// @description  Force playing high quality music in Netease cloud music Website
// @author       nondanee
// @match        https://music.163.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/386399/NeteaseMusic%20Resolution%20Upgrader.user.js
// @updateURL https://update.greasyfork.org/scripts/386399/NeteaseMusic%20Resolution%20Upgrader.meta.js
// ==/UserScript==

(() => {
	let _asrsea
	const asrsea_ = (...payload) => {
		const data = JSON.parse(payload[0])
		if ('level' in data) data.level = 'exhigh'
		payload[0] = JSON.stringify(data)
		return _asrsea.apply(window, payload)
	}
	if (window.asrsea) {
		_asrsea = window.asrsea
		window.asrsea = asrsea_
	}
	else {
		Object.defineProperty(window, 'asrsea', {
			get: () => asrsea_,
			set: value => _asrsea = value
		})
	}
})()