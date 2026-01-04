// ==UserScript==
// @name         Wikipedia页面PDF下载
// @namespace    
// @version      0.1
// @description  一键下载Wikipedia页面的pdf。
// @author       NaWind
// @match        http://*.wikipedia.org/*
// @grant        GM_xmlhttpRequest
// @connect      
// @compatible   firefox >=60
// @compatible   chrome >=65
// @downloadURL https://update.greasyfork.org/scripts/418536/Wikipedia%E9%A1%B5%E9%9D%A2PDF%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/418536/Wikipedia%E9%A1%B5%E9%9D%A2PDF%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

;(function() {
	'use strict'
	const id = location.href.split('wiki/').pop()
	if (!/[a-z0-9]+-[a-z0-9]+-[a-z0-9]+-[a-z0-9]+-[a-z0-9]+/.test(id)) return
	GM_xmlhttpRequest({
		method: 'GET',
		url: `https://zh.wikipedia.org/api/rest_v1/page/pdf/${id}`,
		onload: xhr => {
			const url = JSON.parse(xhr.response).apiData.downloadUrl
			const a = document.createElement('a')
			a.href = url
			a.text = '下载'
			document.querySelector('.detail>.hd>h2').appendChild(a)
		}
	})
})()
