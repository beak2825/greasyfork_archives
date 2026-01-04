// ==UserScript==
// @name         色华堂列表显示预览图
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  色华堂列表显示预览图，无需点进详情页查看
// @author       meteora
// @match        https://sehuatang.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sehuatang.net
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487367/%E8%89%B2%E5%8D%8E%E5%A0%82%E5%88%97%E8%A1%A8%E6%98%BE%E7%A4%BA%E9%A2%84%E8%A7%88%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/487367/%E8%89%B2%E5%8D%8E%E5%A0%82%E5%88%97%E8%A1%A8%E6%98%BE%E7%A4%BA%E9%A2%84%E8%A7%88%E5%9B%BE.meta.js
// ==/UserScript==

;(() => {
	const domList = document.querySelectorAll(
		"#threadlisttableid > [id^='normalthread']"
	)
	if (!domList) return
	for (const item of domList) {
		//获取元素里面的预览图片的地址
		const aDom = item.querySelector("tr th .xst")
		const pageUrl = aDom.href
		fetch(pageUrl).then(async (res) => {
			let appendDom = ""
			const responseText = await res.text()
			//检索里面的磁力链接
			const magnetLink = responseText.match(
				/magnet:\?xt=urn:btih:[0-9a-zA-Z]*/
			)[0]
			appendDom += `<div style="width:800px; padding:10px 0; cursor: pointer" id="${magnetLink}">${magnetLink}</div>`
			//通过响应的网页代码构造出一颗dom树以选取里面的元素
			const dom = document.createElement("div")
			dom.innerHTML = responseText
			//预览图片
			const imgDom = dom.querySelector(".zoom:nth-child(1)")
			if (!imgDom) return
			let imageSrc = imgDom.getAttribute("zoomfile")
			if (!imageSrc) {
				imageSrc = imgDom.getAttribute("file")
			}
			appendDom += `<div style=""><img src="${imageSrc}" style="max-height: 300px"/></div>`
			//在下面插入一个元素
			const newElement = document.createElement("tbody")
			newElement.innerHTML = appendDom
			item.insertAdjacentElement("afterend", newElement)
			//添加点击事件
			const magnetLinkDom = document.getElementById(magnetLink)
			magnetLinkDom.addEventListener("click", (event) => {
				const inputDom = document.createElement("input")
				inputDom.value = magnetLink
				document.body.appendChild(inputDom)
				inputDom.select()
				document.execCommand("copy")
				document.body.removeChild(inputDom)
				event.target.innerText = magnetLink + " 已复制"
				event.target.style.color = "darkred"
			})
		})
	}
})()
