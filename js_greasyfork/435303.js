// ==UserScript==
// @name			回到顶部
// @version			1.0.4
// @description		支持在所有页面的右下角生成一个顺滑回到顶部的按钮
// @author			@leo
// @email           ygnh136@qq.com
// @match        *://*/*
// @grant        GM_notification
// @grant        GM_addStyle
// @license      MIT
// @namespace https://greasyfork.org/users/810117
// @downloadURL https://update.greasyfork.org/scripts/435303/%E5%9B%9E%E5%88%B0%E9%A1%B6%E9%83%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/435303/%E5%9B%9E%E5%88%B0%E9%A1%B6%E9%83%A8.meta.js
// ==/UserScript==

;(() => {
	// 样式注入
	GM_addStyle(`
.GO_TO_TOP_button {
  width: 42px;
  height: 42px;
  border-radius: 8px;
  box-shadow: 0 3px 6px rgb(0 0 0 / 16%), 0 1px 2px rgb(0 0 0 / 23%);
  position: fixed;
  right: 32px;
  bottom: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999999;                     
  background-color: white;
}

.GO_TO_TOP_button svg {
  width: 24px;
  height: 24px;
  margin: 0;
}
`)

	// 延时
	const sleep = delay => {
		return new Promise(resolve => {
			setTimeout(() => {
				resolve()
			}, delay)
		})
	}

	// 创建页面回到顶部方法
	const goToTop = async () => {
		// 弹力--位移超过5000px时，位移越长，弹力越大。
		let g = 1
		if (window.scrollY >= 5000) {
			g = window.scrollY / 5000
		}
		// 计算距离
		while (window.scrollY !== 0) {
			window.scrollTo(window.scrollX, window.scrollY - 170 * g)
			// 每17ms/帧，约60帧/s
			await sleep(17)
		}
	}

	// 创建DOM绑定方法
	const button = document.createElement('div')
	button.className = 'GO_TO_TOP_button'
	button.onclick = goToTop
	button.innerHTML =
		'<svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="200" height="200"><path d="M825.568 555.328l-287.392-289.28C531.808 259.648 523.488 256.576 515.2 256.64 514.08 256.544 513.12 256 512 256c-4.672 0-9.024 1.088-13.024 2.88-4.032 1.536-7.872 3.872-11.136 7.136l-259.328 258.88c-12.512 12.48-12.544 32.736-0.032 45.248 6.24 6.272 14.432 9.408 22.656 9.408 8.192 0 16.352-3.136 22.624-9.344L480 364.288 480 928c0 17.696 14.336 32 32 32s32-14.304 32-32L544 362.72l236.192 237.728c6.24 6.272 14.496 9.44 22.688 9.44s16.32-3.104 22.56-9.312C838.016 588.128 838.048 567.84 825.568 555.328z" ></path><path d="M864 192 160 192C142.336 192 128 177.664 128 160s14.336-32 32-32l704 0c17.696 0 32 14.336 32 32S881.696 192 864 192z"></path></svg>'
	// 默认隐藏按钮
	button.style.display = 'none'
	document.body.appendChild(button)

	// 判断是否隐藏按钮
	const mount = () => {
		if (window.scrollY === 0) {
			button.style.display = 'none'
		} else {
			button.style.display = 'flex'
		}
	}

	// 防抖
	let end
	const onScroll = () => {
		if (end) clearTimeout(end)
		end = setTimeout(mount, 200)
	}

	// 监听滚动并渲染节点
	document.addEventListener('scroll', onScroll)
})()
