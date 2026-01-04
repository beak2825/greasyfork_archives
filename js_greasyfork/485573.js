// ==UserScript==
// @name         知乎右上角私信红色提示自动点击消除
// @namespace    http://tampermonkey.net/
// @version      0.251125
// @description  每天几乎都有知乎官方的号给我私信，看着红色提示很烦
// @author       You
// @include      *://*.zhihu.com/*
// @grant        GM_addElement
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/485573/%E7%9F%A5%E4%B9%8E%E5%8F%B3%E4%B8%8A%E8%A7%92%E7%A7%81%E4%BF%A1%E7%BA%A2%E8%89%B2%E6%8F%90%E7%A4%BA%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E6%B6%88%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/485573/%E7%9F%A5%E4%B9%8E%E5%8F%B3%E4%B8%8A%E8%A7%92%E7%A7%81%E4%BF%A1%E7%BA%A2%E8%89%B2%E6%8F%90%E7%A4%BA%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E6%B6%88%E9%99%A4.meta.js
// ==/UserScript==
const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

// setTimeout(async () => {
// 	// debugger
// 	// console.log(window)
// 	// window.gggggg = 1
// 	document.querySelector("div.css-nvf2q2").click()
// 	await sleep(1000)
// 	document.querySelector("div.Messages-list > a.Messages-item.Messages-followItem.Messages-newItem").click()
// 	await sleep(2200)
// 	document.querySelector("div.ChatBoxModal > button").click()
// }, 4000);

let counter = 0; // 计数器变量

// 创建定时器，每隔一段时间执行一次回调函数
const intervalId = setInterval(async () => {
	// 在回调函数中检查计数器是否达到指定次数
	if (counter < 5) {
		// 增加计数器
		counter++; // 得放前边

		document.querySelector("div.css-dkw0ir").click()
		await sleep(1000)
		document.querySelector("div.Messages-list > a.Messages-item.Messages-followItem.Messages-newItem").click()
		await sleep(1500)
		document.querySelector("div.ChatBoxModal > button").click()
	} else {
		// 如果计数器达到指定次数，则停止定时器
		clearInterval(intervalId);
	}
}, 5000);