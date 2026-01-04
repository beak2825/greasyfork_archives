// ==UserScript==
// @name         巴哈姆特收藏確認
// @namespace    https://blog.maple3142.net/
// @version      0.2
// @description  在收藏前彈出一個對話框詢問是否要收藏
// @author       maple3142
// @match        https://forum.gamer.com.tw/C.php?*
// @match        https://home.gamer.com.tw/*
// @grant        none
// @compatible   firefox >=52
// @compatible   chrome >=55
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/40422/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E6%94%B6%E8%97%8F%E7%A2%BA%E8%AA%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/40422/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E6%94%B6%E8%97%8F%E7%A2%BA%E8%AA%8D.meta.js
// ==/UserScript==

;(function() {
	'use strict'
	if (typeof FORUM_homeBookmark !== 'undefined')
		FORUM_homeBookmark = (fn => (...args) => {
			if (confirm('確認要收藏嗎?')) {
				fn(...args)
			}
		})(FORUM_homeBookmark)
	if (typeof homeBookmarkNew !== 'undefined')
		homeBookmarkNew = (fn => (...args) => {
			if (confirm('確認要收藏嗎?')) {
				fn(...args)
			}
		})(homeBookmarkNew)
})()
