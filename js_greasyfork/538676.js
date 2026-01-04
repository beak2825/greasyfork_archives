// ==UserScript==
// @name        草榴社区显示列表预览图
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  草榴社区显示列表预览图，仅针对 t66y.com 域名有效
// @author       GPT
// @match        https://t66y.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=t66y.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538676/%E8%8D%89%E6%A6%B4%E7%A4%BE%E5%8C%BA%E6%98%BE%E7%A4%BA%E5%88%97%E8%A1%A8%E9%A2%84%E8%A7%88%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/538676/%E8%8D%89%E6%A6%B4%E7%A4%BE%E5%8C%BA%E6%98%BE%E7%A4%BA%E5%88%97%E8%A1%A8%E9%A2%84%E8%A7%88%E5%9B%BE.meta.js
// ==/UserScript==
;(() => {
	const domList = document.querySelectorAll("#tbody > tr > td.tal")
	if (!domList || domList.length === 0) return
	for (const item of domList) {
		//获取元素里面的预览图片的地址
		const aDom = item.querySelector("h3 > a")
		if (!aDom) continue
		const pageUrl = aDom.href
		if (!pageUrl) continue
		fetch(pageUrl).then(async (res) => {
			const responseText = await res.text()
			//通过响应的网页代码构造出一颗dom树以选取里面的元素，以元素里面的图片地址
			const dom = document.createElement("div")
			dom.innerHTML = responseText
			//找出网页里面的预览图
			const imgDomList = dom.querySelectorAll("img[ess-data]")
			if (!imgDomList || imgDomList.length === 0) return

			// 创建一个水平排列的容器，强制一行显示
			const containerDiv = document.createElement("div")
			containerDiv.style.cssText = "display: flex; flex-wrap: nowrap; gap: 10px; margin: 10px 0; overflow-x: auto; overflow-y: hidden;"

			// 只显示前5张图片
			const maxImages = 5
			const imagesCount = Math.min(imgDomList.length, maxImages)

			for (let i = 0; i < imagesCount; i++) {
				const imgDom = imgDomList[i]
				const imageSrc = imgDom.getAttribute("ess-data")
				const imageWrapper = document.createElement("div")
				imageWrapper.style.cssText = "flex: 0 0 auto; width: calc(20% - 8px);"
				imageWrapper.innerHTML = `<a href="${pageUrl}" target="_blank"><img src="${imageSrc}" style="height: auto; max-height: 200px; width: 100%; object-fit: cover; cursor: pointer" alt=""/></a>`
				containerDiv.appendChild(imageWrapper)
			}

			//在下面插入一个元素
			const insertItem = item.querySelector("h3")
			insertItem.insertAdjacentElement("afterend", containerDiv)
		})
	}
})()
