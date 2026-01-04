// ==UserScript==
// @name         skrbt 磁力链接直接复制
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  无需进入详情页即可直接复制磁力链接，仅 skrbtuo.top 域名有效
// @author       You
// @match        https://skrbtuo.top/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=skrbtuo.top
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/484659/skrbt%20%E7%A3%81%E5%8A%9B%E9%93%BE%E6%8E%A5%E7%9B%B4%E6%8E%A5%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/484659/skrbt%20%E7%A3%81%E5%8A%9B%E9%93%BE%E6%8E%A5%E7%9B%B4%E6%8E%A5%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

;(() => {
	//新增一个表格列
	const domList = document.querySelectorAll(
		"body > div.container-fluid > div:nth-child(6) > div.col-md-6 > ul"
	)
	for (let item of domList) {
		const childDom = item.querySelector("li:nth-child(1)")
		//获取请求url
		const childDom2 = childDom.querySelector("a")
		const url = "https://skrbtuo.top" + childDom2.getAttribute("href")
		const cookies = document.cookie
		//往元素的末尾插入元素
		const btn = document.createElement("div")
		btn.style.color = "blue"
		btn.style.cursor = "pointer"
		btn.style.textDecoration = "underline"
		btn.innerText = "磁力链接"
		btn.style.textAlign = "right"
		//发送url地址的请求，抓取其中的磁力链
		btn.onclick = () => {
			btn.innerText = "加载中..."
			const headers = new Headers()
			headers.append("Cookie", cookies)
			fetch(url, {
				headers: headers,
			})
				.then((res) => res.text())
				.then((res) => {
					//通过正则匹配，获取磁力链
					const reg = /magnet:\?xt=urn:btih:[0-9a-fA-F]{40}/
					const result = res.match(reg)
					if (result && result.length > 0 && result[0]) {
						btn.style.color = "darkred"
						btn.innerText = "已复制到剪切板"
						//复制到剪切板
						const input = document.createElement("input")
						input.value = result[0]
						input.style.position = "fixed"
						input.style.opacity = "0"
						document.body.appendChild(input)
						input.select()
						document.execCommand("copy")
						document.body.removeChild(input)
					} else {
						btn.innerText = "出错了，请刷新页面"
					}
				})
		}
		childDom.appendChild(btn)
	}
})()
