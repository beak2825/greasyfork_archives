// ==UserScript==
// @name         巴哈姆特公會批量簽到
// @namespace    https://blog.maple3142.net/
// @version      0.3.0
// @description  巴哈姆特公會批量簽到工具
// @author       maple3142
// @include      /https:\/\/home\.gamer\.com\.tw\/joinGuild\.php\?owner=[A-Za-z0-9]+/
// @require      https://unpkg.com/xfetch-js@0.2.1/xfetch.min.js
// @require      https://unpkg.com/gmxhr-fetch@0.1.0/gmxhr-fetch.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @connect      api.gamer.com.tw
// @connect      guild.gamer.com.tw
// @downloadURL https://update.greasyfork.org/scripts/37293/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E5%85%AC%E6%9C%83%E6%89%B9%E9%87%8F%E7%B0%BD%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/37293/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E5%85%AC%E6%9C%83%E6%89%B9%E9%87%8F%E7%B0%BD%E5%88%B0.meta.js
// ==/UserScript==

/*
 * 使用教學
 * 安裝此腳本，然後到你的小屋點擊"公會社團"，然後會詢問是否要批量簽到時按確定就好了
*/
;(function() {
	'use strict'
	const gxf = xf.extend({ fetch: gmfetch })
	const signin = sn =>
		gxf
			.post('https://guild.gamer.com.tw/ajax/guildSign.php', {
				form: { sn }
			})
			.json()
			.catch(() => ({}))
	const id = new URLSearchParams(location.search).get('owner')
	if (id !== BAHAID) return
	if (!confirm('要批量簽到嗎?')) return
	gxf.get('https://api.gamer.com.tw/mobile_app/bahabook/v1/guild_list.php')
		.json(ar => Promise.all(ar.map(x => signin(x.sn))))
		.then(results => {
			const okcnt = results.filter(r => r.ok).length
			console.log(results)
			alert(`簽到了${okcnt}個公會`)
		})
})()
