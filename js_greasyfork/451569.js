// ==UserScript==
// @name         Bilibili剧集获取Markdown表格
// @namespace    https://github.com/wanglong126
// @version      0.1
// @description  访问Bilibili播放页,将剧集整理为Markdown表格,方便记录
// @author       ITLDG
// @match        https://www.bilibili.com/video/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @grant        GM_notification
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/451569/Bilibili%E5%89%A7%E9%9B%86%E8%8E%B7%E5%8F%96Markdown%E8%A1%A8%E6%A0%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/451569/Bilibili%E5%89%A7%E9%9B%86%E8%8E%B7%E5%8F%96Markdown%E8%A1%A8%E6%A0%BC.meta.js
// ==/UserScript==

;(function () {
	'use strict'
	GM_registerMenuCommand('复制剧集MarkDown', () => {
		let result = getResult()
		GM_setClipboard(result)
		GM_notification('已复制到剪切板')
	})
	function getResult() {
		const lis = document.querySelectorAll('.list-box li')
		let result =
			'序号|名字|时长\r\n---|---|---\r\n' +
			Array.from(lis, (li) => {
				const a = li.querySelector('a')
				const href = a.getAttribute('href')
				const pageNum = a.querySelector('.page-num').textContent
				const part = a.querySelector('.part').textContent
				const duration = a.querySelector('.duration').textContent
				return `${pageNum}|[${part}](${location.origin + href})|${duration}`
			}).join('\r\n')
		return result
	}
})()
