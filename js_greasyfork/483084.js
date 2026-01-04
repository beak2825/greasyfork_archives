// ==UserScript==
// @name         华数TV自动全屏
// @namespace    http://itldg.com/
// @version      2023-12-25
// @description  首先使用快捷键 F11 将浏览器全屏，刷新网页播放器将自动全屏，如果不需要该功能，停用本插件即可
// @author       ITLDG
// @match        *://www.wasu.cn/Play/show/id/*
// @icon         https://s.wasu.cn/portal/favicon.ico
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/483084/%E5%8D%8E%E6%95%B0TV%E8%87%AA%E5%8A%A8%E5%85%A8%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/483084/%E5%8D%8E%E6%95%B0TV%E8%87%AA%E5%8A%A8%E5%85%A8%E5%B1%8F.meta.js
// ==/UserScript==

;(async function () {
	const btnSelector = '.wsplayer-fullscreen'
	function waitBtn() {
		return new Promise((resolve) => {
			let timer = setInterval(() => {
				const btn = document.querySelector(btnSelector)
				if (btn) {
					clearInterval(timer)
					timer = null
					resolve(btn)
				}
			}, 1000)
		})
	}
	await waitBtn()
	// btn.click()
	// document.querySelector('#WsPlayer').requestFullscreen()
	const videoStyle = document.querySelector('#flashContent').style
	videoStyle.position = 'fixed'
	videoStyle.left = '0'
	videoStyle.top = '0'
	videoStyle.height = '100%'
	videoStyle.width = '100%'
	videoStyle.zIndex = 999999
	document.querySelector('.navbar_static_top').style.display = 'none'
	document.querySelector('.player_r_btn a').click()
})()
