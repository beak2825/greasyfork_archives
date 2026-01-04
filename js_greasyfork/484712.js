// ==UserScript==
// @name         u9a9列表显示预览图
// @namespace    http://tampermonkey.net/
// @version      0.03
// @description  u9a9在外部的列表直接查看预览图，无需进入详情页面查看，仅对 u9a9.com 域名生效
// @author       meteora
// @match        https://u9a9.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=u9a9.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/484712/u9a9%E5%88%97%E8%A1%A8%E6%98%BE%E7%A4%BA%E9%A2%84%E8%A7%88%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/484712/u9a9%E5%88%97%E8%A1%A8%E6%98%BE%E7%A4%BA%E9%A2%84%E8%A7%88%E5%9B%BE.meta.js
// ==/UserScript==
;(() => {
	const domList = document.querySelectorAll(
		"body > div.container > div.table-responsive > table > tbody > tr"
	)
	if (!domList) return
	for (const item of domList) {
		//获取元素里面的预览图片的地址
		const aDom = item.querySelector("td:nth-child(2) a")
		const pageUrl = aDom.href
		fetch(pageUrl).then(async (res) => {
			let appendDom = ""
			const responseText = await res.text()
			//通过响应的网页代码构造出一颗dom树以选取里面的元素，以元素里面的图片地址
			const dom = document.createElement("div")
			dom.innerHTML = responseText
			const imgDom = dom.querySelector(
				"div.container > div:nth-child(5) > div > img:nth-child(1)"
			)
			const imageSrc = imgDom.getAttribute("src")
			appendDom += `<th colspan="6"><div style="width: 800px"><img src="${imageSrc}" style="height: auto; max-height: 300px"/></div></th>`
			//在下面插入一个元素
			const newElement = document.createElement("tr")
			newElement.innerHTML = appendDom
			item.insertAdjacentElement("afterend", newElement)
		})
	}
})()
