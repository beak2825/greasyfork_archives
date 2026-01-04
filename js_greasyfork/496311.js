// ==UserScript==
// @name         Slash focus edit box [QuickSearch]
// @name:zh-CN   斜杠聚焦编辑框【快速搜索】
// @namespace    https://github.com/CandyTek
// @version      1.0.1
// @description  Use '/' to quickly focus on the search input
// @description:zh-cn 按 `'/'` 键快速聚焦并滚动到搜索输入框处。
// @author       CandyTek
// @homepage     https://github.com/CandyTek
// @match        *://*/*
// @exclude      https://www.google.com/*
// @exclude      https://www.google.com.tw/*
// @exclude      https://www.google.com.hk/*
// @exclude      https://github.com/*
// @exclude      https://developer.mozilla.org/*
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSJAYW5kcm9pZDpjb2xvci93aGl0ZSIgZD0iTTE1LjUgMTRoLS44bC0uMy0uM2MxLTEuMSAxLjYtMi42IDEuNi00LjJhNi41IDYuNSAwIDEgMC0yLjMgNWwuMy4ydi44bDUgNSAxLjUtMS41LTUtNXptLTYgMGE0LjUgNC41IDAgMSAxIDAtOSA0LjUgNC41IDAgMCAxIDAgOXoiLz48L3N2Zz4=
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/496311/Slash%20focus%20edit%20box%20%5BQuickSearch%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/496311/Slash%20focus%20edit%20box%20%5BQuickSearch%5D.meta.js
// ==/UserScript==

(function() {
	// 来源脚本：https://greasyfork.org/zh-CN/scripts/436684
	// 改进，原脚本在一些编辑框上面的按键屏蔽不够好，增加语句 target.isContentEditable

	// 监听键盘输入 '/' 搜索
	document.addEventListener('keydown', (e) => {
		if (
			e.key === '/' &&
			!e.metaKey &&
			!e.ctrlKey &&
			!(e.target.isContentEditable ||["TEXTAREA", "INPUT"].includes(e.target.tagName))
		) {
			main()
		}
	})

	function main() {
		// 选择第一个 type 为 search 或存在 autofocus 且在页面显示的
		const autofocusOrSearch = document.querySelector('input[autofocus],input[type=search]')
		if (autofocusOrSearch && isVisible(autofocusOrSearch)) {
			focusAndScrollIntoView(autofocusOrSearch)
			return
		}

		// 选择第一个 id/class 中包含[search]关键词且在页面显示的
		const idOrClassContainSearch = document.querySelectorAll('input[id*=search],input[class*=search]')
		if (idOrClassContainSearch.length) {
			const element = findInNodeList(idOrClassContainSearch)
			if (element) {
				focusAndScrollIntoView(element)
				return
			}
		}

		// 选择第一个 placeholder 中包含[search/搜索]关键词且在页面显示的
		const placeholderContainSearch = document.querySelectorAll('input[placeholder*=search],input[placeholder*=搜索]')
		if (placeholderContainSearch.length) {
			const element = findInNodeList(placeholderContainSearch)
			if (element) {
				focusAndScrollIntoView(element)
				return
			}
		}

		// 选择第一个在页面显示的
		const textInputTypes = ['hidden', 'button', 'checkbox', 'color', 'file', 'image', 'radio', 'range', 'reset', 'submit']
		const selector = textInputTypes.map(t => `[type=${t}]`).join(',')
		const firstInput = document.querySelector(`input:not(${selector})`)
		if (firstInput && isVisible(firstInput)) {
			focusAndScrollIntoView(firstInput)
			return
		}
	}

	// 判断 NodeList 中是否有可用的
	function findInNodeList(list) {
		return [].find.call(list, (item) => isVisible(item))
	}

	// 判断元素是否可见
	function isVisible(element) {
		const style = getComputedStyle(element)
		return (
			!!element.getClientRects().length &&
			style.visibility !== 'hidden' &&
			style.width !== 0 &&
			style.height !== 0 &&
			style.opacity !== 0
		)
	}

	// 聚焦元素并滚动到视野
	function focusAndScrollIntoView(element) {
		event.preventDefault();
		const pos = element.value.length;
		element.setSelectionRange(pos, pos)
		element.focus()
		window.scrollTo({top: element.getBoundingClientRect().top + window.pageYOffset - 100, behavior: 'smooth'});
	}
})();
