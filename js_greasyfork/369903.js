// ==UserScript==
// @name         巴哈姆特跨小屋自訂佈景主題
// @namespace    https://blog.maple3142.net/
// @version      0.4
// @description  可以套用一個人的小屋主題到每個人的小屋
// @author       maple3142
// @match        https://home.gamer.com.tw/*
// @grant        GM_setValue
// @grant        GM_getValue
// @compatible   firefox >=52
// @compatible   chrome >=55
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/369903/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E8%B7%A8%E5%B0%8F%E5%B1%8B%E8%87%AA%E8%A8%82%E4%BD%88%E6%99%AF%E4%B8%BB%E9%A1%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/369903/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E8%B7%A8%E5%B0%8F%E5%B1%8B%E8%87%AA%E8%A8%82%E4%BD%88%E6%99%AF%E4%B8%BB%E9%A1%8C.meta.js
// ==/UserScript==

;(function() {
	'use strict'
	const store = new Proxy(
		{},
		{
			get: (t, k) => {
				const value = GM_getValue(k)
				try {
					return JSON.parse(value)
				} catch (e) {
					return value
				}
			},
			set: (t, k, v) => {
				console.log(k, v)
				GM_setValue(k, JSON.stringify(v))
				return v
			}
		}
	)
	if (!store.css) store.css = 'https://p2.bahamut.com.tw/HOMECSSNEW/95/kirby123.css'
	const $ = s => document.querySelector(s)
	const $$ = s => [...document.querySelectorAll(s)]
	const deepmerge = (a = {}, b = {}) => {
		Object.keys(b).forEach(k => {
			if (typeof b[k] === 'object') deepmerge(a[k], b[k])
			else a[k] = b[k]
		})
	}
	const $el = (s, o) => {
		const el = document.createElement(s)
		deepmerge(el, o)
		return el
	}

	const target = $('link[href*=HOMECSSNEW]') || $el('link', { rel: 'stylesheet', dataset: { notheme: true } })
	const currentcss = target.href
	if (currentcss !== store.css) {
		target.href = store.css
		document.head.appendChild(target)
	}

	const btn = $el('a', {
		className: 'BH-slave_btnA',
		textContent: '套用他的主題',
		style: { float: 'right' },
		onclick: e => {
			if (target.dataset.notheme) {
				alert('這個人沒有自訂主題')
				return
			}
			store.css = currentcss
			target.href = store.css
		}
	})
	const el = $('.BH-slave_btns')
	if (el) el.appendChild(btn)
})()
