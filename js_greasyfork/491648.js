// ==UserScript==
// @name         2048核基地列表显示预览图【NSFW】
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  显示帖子详情页的预览图在列表下方
// @author       meteora
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=klnkn.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/491648/2048%E6%A0%B8%E5%9F%BA%E5%9C%B0%E5%88%97%E8%A1%A8%E6%98%BE%E7%A4%BA%E9%A2%84%E8%A7%88%E5%9B%BE%E3%80%90NSFW%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/491648/2048%E6%A0%B8%E5%9F%BA%E5%9C%B0%E5%88%97%E8%A1%A8%E6%98%BE%E7%A4%BA%E9%A2%84%E8%A7%88%E5%9B%BE%E3%80%90NSFW%E3%80%91.meta.js
// ==/UserScript==

;(async () => {
	try {
		// 判断这个是否是 2048 核基地网站
		if (
			!(
				document.querySelector("#pw_box") &&
				document.querySelector("#nav-login") &&
				document.querySelector("#footer")
			)
		) {
			console.log("不是2048核基地网站")
			return
		}

		let mode
		let domList = document.querySelectorAll(
			"#ajaxtable > tbody:nth-child(2) > tr"
		)
		// 如果普通列表为空，则尝试搜索结果选择器
		if (!domList || domList.length === 0) {
			domList = document.querySelectorAll(".t table tbody .tr3")
			if (!domList || domList.length === 0) {
				console.log("无法识别的页面结构")
				return
			}
			mode = "search"
		} else {
			mode = "normal"
		}

		for (const item of domList) {
			let aDom
			if (mode === "normal") {
				aDom = item.querySelector("td:nth-child(2) > a")
			} else if (mode === "search") {
				aDom = item.querySelector("th:nth-child(1) > a")
			}
			if (!aDom) continue

			// 给 a 标签添加点击事件，点击后文字染成红色
			aDom.addEventListener("click", function () {
				this.style.color = "darkred"
			})

			const pageUrl = aDom.href
			if (!pageUrl) continue

			const res = await fetch(pageUrl, {
				credentials: "include",
			})
			const responseText = await res.text()
			const dom = document.createElement("div")
			dom.innerHTML = responseText

			const imageContainerList = dom.querySelectorAll("#read_tpc")
			if (!imageContainerList || imageContainerList.length === 0) continue

			for (let imageContainerListElement of imageContainerList) {
				const imgDomList = imageContainerListElement.querySelectorAll("img")
				if (!imgDomList || imgDomList.length === 0) continue

				let appendDom = ""
				const limit = Math.min(10, imgDomList.length)
				for (let i = 0; i < limit; i++) {
					let imageSrc = imgDomList[i].getAttribute("data-original")
					if (!imageSrc) {
						imageSrc = imgDomList[i].getAttribute("src")
					}
					appendDom += `<a href="${pageUrl}" target="_blank"><img src="${imageSrc}" style="height: auto; max-height: 250px; display: inline-block; margin-right: 5px; cursor: pointer" alt="" loading="lazy" decoding="async"/></a>`
				}

				const newElement = document.createElement("tr")
				const newElementInside = document.createElement("td")
				newElementInside.setAttribute("colspan", "5")
				newElementInside.innerHTML = appendDom
				newElement.appendChild(newElementInside)

				item.insertAdjacentElement("afterend", newElement)
				// 睡眠 500ms
				await new Promise((resolve) => setTimeout(resolve, 1000))
			}
		}
	} catch (e) {
		window.alert(`脚本运行时错误: ${e}`)
		console.error("脚本错误详情:", e)
	}
})()
