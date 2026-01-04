// ==UserScript==
// @name         强制页面在新标签页打开
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  为了避免误触需要在油猴菜单里输入生效的dom元素的选择器，如果想要整个网页都生效，只需填入 body 即可
// @author       meteora
// @match        http://*/*
// @license MIT
// @match        https://*/*
// @grant GM_registerMenuCommand
// @grant GM_unregisterMenuCommand
// @grant unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/495934/%E5%BC%BA%E5%88%B6%E9%A1%B5%E9%9D%A2%E5%9C%A8%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/495934/%E5%BC%BA%E5%88%B6%E9%A1%B5%E9%9D%A2%E5%9C%A8%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

;(function () {
	"use strict"
	//排除iframe
	if (unsafeWindow.self !== unsafeWindow.top) {
		return
	}

	// 是否移除原本绑定在 a 标签上面的点击事件
	let removeClickEvent = false

	let domListText = localStorage.getItem("domListText")
		? localStorage.getItem("domListText")
		: ""
	let domList = []

	function hookATag() {
		console.log("hookATag")
		// 获取页面上的所有链接元素
		function setLinkAttributes(link) {
			link.setAttribute("target", "_blank")
			if (removeClickEvent) {
				link.removeAttribute("onclick")
			}
			// 给标签添加点击事件，点击后标红
			link.addEventListener("click", function () {
				this.style.color = "darkred"
			})
		}

		for (let domListElement of domList) {
			// 如果 dom 标签本身就是 a 标签则无需寻找里面的 a 标签
			if (domListElement.tagName === "A") {
				setLinkAttributes(domListElement)
				continue
			}
			let links = domListElement.getElementsByTagName("a")
			for (let i = 0; i < links.length; i++) {
				// 遍历每个链接元素并添加目标属性
				setLinkAttributes(links[i])
			}
		}
	}

	function hookWindowOpen() {
		// 保存原始的 unsafeWindow.open 方法的引用
		let originalOpen = unsafeWindow.open
		// 重写 unsafeWindow.open 方法
		unsafeWindow.open = function (url, target, features) {
			// 在新标签页中打开链接
			originalOpen.call(this, url, "_blank", features)
		}
	}

	//监听dom节点变化以应对异步刷新的场景，一旦dom节点发生变化则重新执行hookPage
	function hookPageWhenDomChange() {
		let MutationObserver =
			unsafeWindow.MutationObserver || unsafeWindow.WebKitMutationObserver
		let observer = new MutationObserver(function (mutations) {
			mutations.forEach(function (mutation) {
				hookATag()
			})
		})
		observer.observe(document.body, {
			childList: true, // 观察目标子节点的变化，是否有添加或者删除
			subtree: true, // 观察后代节点，默认为 false
			attributes: false, // 观察属性变动
		})
	}

	//显示文本输入框浮窗，用于接收用户输入的需要生效的dom选择器
	function showInputTextarea() {
		const dom = `
<div style="position: fixed; left: 50%; top: 50%; transform: translate(-50%, -50%); z-index: 9999; background-color: white; padding: 20px; border: 1px solid #ccc; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); " id="container-zuc08">
  <textarea id="inputTextarea-zuc08" style="width: 600px; height: 300px; border: 1px solid #ccc; border-radius: 5px; padding: 5px" placeholder="在此输入要生效的dom元素选择器，多个用空格间隔开"></textarea>
  
  <div style="display: flex; margin-top: 10px">
    <div style="padding: 5px 30px; width: max-content; background: #007bff; color: white; border-radius: 5px; cursor: pointer;" id="confirm-btn-zuc08">确定并刷新页面生效</div>
    <div style="margin-left: 10px; padding: 5px 30px; width: max-content; background: dimgray; color: white; border-radius: 5px; cursor: pointer" id="cancel-btn-zuc08">取消</div>
  </div>
</div>
`
		document.body.insertAdjacentHTML("beforeend", dom)
		const inputTextarea = document.getElementById("inputTextarea-zuc08")
		inputTextarea.value = domListText //回显文本内容
		inputTextarea.focus() //自动聚焦
		//绑定事件
		function close() {
			document.body.removeChild(document.getElementById("container-zuc08"))
		}

		//确定按钮
		const confirmBtnDom = document.getElementById("confirm-btn-zuc08")
		confirmBtnDom.addEventListener("click", function () {
			domListText = inputTextarea.value
			localStorage.setItem("domListText", domListText)
			close()
			//刷新页面
			location.reload()
		})
		//取消按钮
		const cancelBtnDom = document.getElementById("cancel-btn-zuc08")
		cancelBtnDom.addEventListener("click", function () {
			close()
		})
	}

	//注册油猴菜单，呼出文本输入框
	GM_registerMenuCommand("设置新标签页打开链接的dom选择器", showInputTextarea)

	function hookPage(domStringList) {
		//通过换行符切割 domListText 里的内容
		for (let string of domStringList) {
			const innerDomList = document.querySelectorAll(string)
			for (let innerDomListElement of innerDomList) {
				domList.push(innerDomListElement)
			}
		}
		hookATag()
	}

	let timer = null
	let loop = 2

	let isHooking = false
	function intervalHookPage() {
		return new Promise((resolve) => {
			if (domListText) {
				//防止多次触发
				if (isHooking) {
					resolve()
					return
				}
				isHooking = true
				const temp = domListText.split("\n")
				//每隔一秒执行一次
				// if (timer) {
				//   clearInterval(timer);
				//   loop = 2;
				// }
				// timer = setInterval(() => {
				//   if (loop <= 0) {
				//     clearInterval(timer);
				//     loop = 2;
				//     isHooking = false;
				//     resolve();
				//     return;
				//   }
				//   hookPage(temp);
				//   loop--;
				// }, 1500);
				// hookPage(temp);
				setTimeout(() => {
					hookPage(temp)
					isHooking = false
				}, 500)
			} else {
				isHooking = false
				resolve()
			}
		})
	}

	const oldOnloadFun = unsafeWindow.onload
	unsafeWindow.onload = function () {
		oldOnloadFun && oldOnloadFun()
		if (
			unsafeWindow.localStorage.getItem("aSpuT_removeClickEvent") === "true"
		) {
			removeClickEvent = true
		}
		// 注册油猴菜单，供用户配置是否开启移除点击事件
		if (removeClickEvent) {
			GM_registerMenuCommand("启用点击事件", function () {
				unsafeWindow.localStorage.setItem("aSpuT_removeClickEvent", "false")
				location.reload()
			})
		} else {
			GM_registerMenuCommand("禁用移除点击事件", function () {
				unsafeWindow.localStorage.setItem("aSpuT_removeClickEvent", "true")
				location.reload()
			})
		}
		if (!domListText) return
		intervalHookPage()
		//监听页面地址变化
		unsafeWindow.addEventListener("popstate", function () {
			intervalHookPage()
		})
		unsafeWindow.addEventListener("hashchange", function () {
			intervalHookPage()
		})
		//覆写 window.top.history.pushState 方法
		let originalPushState = unsafeWindow.top.history.pushState
		unsafeWindow.top.history.pushState = function () {
			originalPushState.apply(this, arguments)
			intervalHookPage()
		}
	}
})()
