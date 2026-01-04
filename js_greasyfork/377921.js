// ==UserScript==
// @name         MIUI 主題下載器
// @namespace    https://blog.maple3142.net/
// @version      0.1
// @description  從官方 MIUI 主題商店下載主題檔案(mtz)
// @author       maple3142
// @match        http://zhuti.xiaomi.com/detail/*
// @grant        GM_xmlhttpRequest
// @connect      thm.market.xiaomi.com
// @compatible   firefox >=52
// @compatible   chrome >=55
// @downloadURL https://update.greasyfork.org/scripts/377921/MIUI%20%E4%B8%BB%E9%A1%8C%E4%B8%8B%E8%BC%89%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/377921/MIUI%20%E4%B8%BB%E9%A1%8C%E4%B8%8B%E8%BC%89%E5%99%A8.meta.js
// ==/UserScript==

;(function() {
	'use strict'
	const id = location.href.split('detail/').pop()
	if (!/[a-z0-9]+-[a-z0-9]+-[a-z0-9]+-[a-z0-9]+-[a-z0-9]+/.test(id)) return
	GM_xmlhttpRequest({
		method: 'GET',
		url: `http://thm.market.xiaomi.com/thm/download/v2/${id}`,
		onload: xhr => {
			const url = JSON.parse(xhr.response).apiData.downloadUrl
			const a = document.createElement('a')
			a.href = url
			a.text = '下載'
			document.querySelector('.detail>.hd>h2').appendChild(a)
		}
	})
})()
