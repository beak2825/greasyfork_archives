// ==UserScript==
// @name        B站直播收益数据导出按钮
// @namespace   shynome/bilibili-live
// @match       https://link.bilibili.com/p/center/index#/live-data/gift-list
// @grant       none
// @version     1.0.2
// @author      shynome
// @run-at      document-idle
// @description 22/03/2024, 10:32:52
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/490515/B%E7%AB%99%E7%9B%B4%E6%92%AD%E6%94%B6%E7%9B%8A%E6%95%B0%E6%8D%AE%E5%AF%BC%E5%87%BA%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/490515/B%E7%AB%99%E7%9B%B4%E6%92%AD%E6%94%B6%E7%9B%8A%E6%95%B0%E6%8D%AE%E5%AF%BC%E5%87%BA%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

// @ts-check

const baseApi =
	'https://api.live.bilibili.com/xlive/revenue/v1/giftStream/getReceivedGiftStreamNextList?limit=20'

/**
 * @typedef {{code:number;message:string;data:T}} BilibiliResponse<T>
 * @template {any} T
 */

/**
 * @typedef {object} Data
 * @prop {Item[]} list
 * @prop {0|1} has_more
 * @typedef {object} Item
 * @prop {string} id
 */

/**
 * @param {string} day 如: 2023-09-03
 */
async function exportDay(day) {
	let last_id
	let has_more = 1
	let items = []
	while (has_more === 1) {
		let d = await fetchList(day, last_id)
		has_more = d.has_more
		items.push(...d.list)
		if (has_more) {
			last_id = d.list.slice(-1)[0].id
		}
		await new Promise((rl) => setTimeout(rl, 500)) // 避免爬取过快导致限速
	}
	return items
}

/**
 * @param {string} day
 * @param {string} [last_id]
 */
async function fetchList(day, last_id) {
	let link = new URL(baseApi)
	link.searchParams.set('begin_time', day)
	if (last_id) {
		link.searchParams.set('last_id', last_id)
	}
	let r = await fetch(link, { credentials: 'include' })
	/**@type {BilibiliResponse<Data>} */
	let resp = await r.json()
	if (resp.code != 0) {
		throw new Error(resp.message)
	}
	return resp.data
}

const dateFormatter = Intl.DateTimeFormat('zh', {
	year: 'numeric',
	month: '2-digit',
	day: '2-digit',
})
function formatDate(d = new Date()) {
	return dateFormatter.format(d).replace(/\//g, '-')
}

/**
 * @param {string} link
 * @param {string} filename
 */
function download(filename, link) {
	let a = document.createElement('a')
	a.style.display = 'none'
	a.href = link
	a.download = filename
	document.body.appendChild(a)
	a.click()
}

Promise.resolve()
	.then(async () => {
    alert("点击确定后等待2s, 按钮方能添加成功")
    await new Promise(rl=>setTimeout(rl,2e3))
		const bar = document.querySelector('.select-bar .item.time')
		if (!bar) {
			throw new Error("can't find .select-bar .item.time")
		}

		let btn = /**@type {HTMLButtonElement} */ (bar.querySelector('.exporter'))
		if (btn) {
			throw new Error('导出按钮已添加')
		}
		// @ts-ignore
		bar.style.position = 'relative'
		btn = document.createElement('button')
		btn.type = 'button'
		btn.className = 'exporter bl-button live-btn default bl-button--primary bl-button--size'
		const btnText = '导出已选择日期到现在的数据'
		btn.innerText = btnText
		btn.style.cssText = 'position:absolute;top:100%; left: 0;'
		let cancel = false
		async function handleExport() {
			const dateInput = /**@type {HTMLInputElement} */ (
				document.querySelector('.select-bar .item.time .date-selector input')
			)
			let start = new Date(dateInput.value)
			let cursor = new Date(dateInput.value)
			let end = new Date(formatDate())
			let allItems = []
			while (cursor.getTime() <= end.getTime()) {
				let s = formatDate(cursor)
				btn.innerText = `${s} 数据请求中, 点击提前停止`

				let items = await exportDay(s)
				allItems.push(...items)
				cursor.setDate(cursor.getDate() + 1)
				if (cancel) {
					btn.innerText = `已停止, 正在合并数据`
					break
				}
			}
			let content = allItems.map((v) => JSON.stringify(v)).join('\n')
			let b = new Blob([content], { type: 'text/plain' })
			let blink = URL.createObjectURL(b)
			let fname = `礼物数据 ${formatDate(start)} ~ ${formatDate(cursor)}.txt`
			download(fname, blink)
			URL.revokeObjectURL(blink)
		}
		let pending = false
		btn.onclick = () => {
			if (pending) {
				cancel = true
				return
			}
			pending = true
			cancel = false
			Promise.resolve()
				.then(handleExport)
				.then(async () => {
					btn.innerText = '请求完成'
					await new Promise((rl) => setTimeout(rl, 2e3))
				})
				.catch((err) => {
					let tip = err?.message ?? '未知错误, 请按F12打开控制台查看错误原因.'
					alert(`导出出错, 错误: ${tip}.`)
				})
				.finally(() => {
					btn.innerText = btnText
					pending = false
				})
		}
		bar.append(btn)
	})
	.then(() => {
		console.log('数据导出按钮已添加成功')
	})
	.catch((err) => {
		console.error(err)
		alert(`添加导出按钮失败, 错误: ${err?.message ?? '未知错误, 请按F12打开控制台查看错误原因.'}.`)
	})