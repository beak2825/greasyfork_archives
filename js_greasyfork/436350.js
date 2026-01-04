// ==UserScript==
// @name			专注于ruanyifeng.com博客生成标题导航
// @version			1.0.0
// @description		针对阮大神的博客没有标题导航制作
// @author			@leo
// @match        *://www.ruanyifeng.com/blog/*
// @grant        GM_notification
// @grant        GM_addStyle
// @namespace https://greasyfork.org/users/810117
// @downloadURL https://update.greasyfork.org/scripts/436350/%E4%B8%93%E6%B3%A8%E4%BA%8Eruanyifengcom%E5%8D%9A%E5%AE%A2%E7%94%9F%E6%88%90%E6%A0%87%E9%A2%98%E5%AF%BC%E8%88%AA.user.js
// @updateURL https://update.greasyfork.org/scripts/436350/%E4%B8%93%E6%B3%A8%E4%BA%8Eruanyifengcom%E5%8D%9A%E5%AE%A2%E7%94%9F%E6%88%90%E6%A0%87%E9%A2%98%E5%AF%BC%E8%88%AA.meta.js
// ==/UserScript==

;(() => {
	// 样式注入
	GM_addStyle(`
	.myImportNav {
    position: fixed;
    top: 100px;
    right: 50px;
    width: 300px;
    height: auto;
    display: flex;
    flex-flow: column nowrap;
    align-items: flex-start;
}
.myImportNav .text {
    font-size: 1.5em;
    font-weight: bold;
    margin-bottom: 10px;
}
`)

	window.onload = () => {
		// 查找页面中的所有标题
		const titles = document.querySelectorAll('#alpha-inner article h2')
		console.log(titles)
		// 遍历 titles 为每个 DOM 节点附加一个唯一id，并且将 title 的文字和 唯一id 输出到新数组
		const arr = Array.from(titles).map((item, index) => {
			item.id = `title-${index}`
			return { title: item.innerText, id: item.id }
		})
		console.log(arr)
		// 遍历 arr 在页面中注入悬浮在右上角的导航
		const nav = document.createElement('div')
		nav.className = 'myImportNav'
		arr.forEach((item, index) => {
			const a = document.createElement('a')
			a.className = 'text'
			a.href = `#${item.id}`
			a.innerText = `${index + 1}. ${item.title}`
			nav.appendChild(a)
		})
		document.body.appendChild(nav)
	}
})()
