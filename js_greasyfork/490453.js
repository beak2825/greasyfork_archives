// ==UserScript==
// @name         探花bt显示列表预览图
// @namespace    http://tampermonkey.net/
// @version      0.06
// @description  探花bt在外面的列表显示预览图，不用点进去里面的详情查看
// @author       meteora
// @match        https://hduac.707199.xyz/*
// @match        http://hduac.707199.xyz/*
// @match *://puc.018208.xyz/*
// @match *://eff.785013.xyz/*
// @match *://jjb.409087.xyz/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=707199.xyz
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/490453/%E6%8E%A2%E8%8A%B1bt%E6%98%BE%E7%A4%BA%E5%88%97%E8%A1%A8%E9%A2%84%E8%A7%88%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/490453/%E6%8E%A2%E8%8A%B1bt%E6%98%BE%E7%A4%BA%E5%88%97%E8%A1%A8%E9%A2%84%E8%A7%88%E5%9B%BE.meta.js
// ==/UserScript==
;(() => {
	let domList = document.querySelectorAll("#main > div > div > div > ul > li")
	if (!domList) {
		domList = document.querySelectorAll(
			"#main > div > div.video-list-content > div > ul > li"
		)
	}
	if (!domList) return
	let eventList = []
	for (const item of domList) {
		//获取元素里面的预览图片的地址
		let aDom = item.querySelector("span > a")
		if (!aDom) {
			aDom = item.querySelector("a")
		}
		const pageUrl = aDom.href
		eventList.push(() => {
			return new Promise((resolve, reject) => {
				fetch(pageUrl)
					.then(async (res) => {
						let appendDom = ""
						const responseText = await res.text()
						//通过响应的网页代码构造出一颗dom树以选取里面的元素，以元素里面的图片地址
						const dom = document.createElement("div")
						dom.innerHTML = responseText
						const imgDomList = dom.querySelectorAll(
							"#torrent-description > div > img"
						)
						//只取前面3张
						for (let i = 0; i < 3; i++) {
							if (!imgDomList[i]) break // 防止数组越界
							const imgDomListElement = imgDomList[i]
							const imageSrc = imgDomListElement.getAttribute("src")
							appendDom += `<img src="${imageSrc}" style="height: auto; max-height: 300px; display: inline-block; margin-right: 5px" alt=""/>`
						}
						//在下面插入一个元素
						const newElement = document.createElement("li")
						newElement.innerHTML = appendDom
						item.insertAdjacentElement("afterend", newElement)
					})
					.catch((err) => {
						console.log(err, "请求出现异常")
					})
					.finally(() => {
						resolve()
					})
			})
		})
	}
	//串行执行
	const run = async () => {
		for (const event of eventList) {
			await event()
		}
	}
	run().then(() => {})
})()
