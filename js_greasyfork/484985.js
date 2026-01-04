// ==UserScript==
// @name         google翻译快捷键聚焦输入框
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  按 / 键聚焦到输入框
// @author       meteora
// @match        https://translate.google.com/*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=translate.google.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/484985/google%E7%BF%BB%E8%AF%91%E5%BF%AB%E6%8D%B7%E9%94%AE%E8%81%9A%E7%84%A6%E8%BE%93%E5%85%A5%E6%A1%86.user.js
// @updateURL https://update.greasyfork.org/scripts/484985/google%E7%BF%BB%E8%AF%91%E5%BF%AB%E6%8D%B7%E9%94%AE%E8%81%9A%E7%84%A6%E8%BE%93%E5%85%A5%E6%A1%86.meta.js
// ==/UserScript==

;(() => {
	//排除iframe
	if (window.top !== window.self) {
		return
	}
	//监听事件，按下 / 时触发
	document.addEventListener("keyup", function (e) {
		if (e.key === "/") {
			const textareaDom = document.querySelector("#yDmH0d textarea")
			//未聚焦输入框先聚焦
			if (document.activeElement !== textareaDom) {
				textareaDom.focus()
			}
			textareaDom.select() // 全选textarea里面的文本
		}
	})
})()
