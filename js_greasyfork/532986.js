// ==UserScript==
// @name         自用脚本
// @description  自用脚本工具合集
// @author       Me
// @namespace    psp
// @version      0.0.1
// @match        *://*/*
// @require      https://update.greasyfork.org/scripts/446666/1493396/jQuery%20Core%20minified.js
// @grant GM_addStyle
// @grant GM_setClipboard
// @grant GM_notification
// @downloadURL https://update.greasyfork.org/scripts/532986/%E8%87%AA%E7%94%A8%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/532986/%E8%87%AA%E7%94%A8%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

;(function () {
	"use strict"

	// 注入成功提示
	function injectSuccess(key) {
		console.log(
			`%c${key}注入成功`,
			"color:white;font-size:16px;background:black;"
		)
	}

	// 改title
	function changeTitle(title) {
		document.title = title
		Object.defineProperty(document, "title", {
			get() {
				return title
			},
			set(value) {
				$("title").text(title)
			},
		})
	}

	// 改icon
	function changeIcon(url) {
		const link = $("link[rel*='icon']").length
			? $("link[rel*='icon']")
			: $("<link>", {
					type: "image/x-icon",
					rel: "shortcut icon",
			  })
		link.attr("href", url).appendTo("head")
	}

	// 抖音注入
	function dyInject() {
		changeTitle("百度一下")
		changeIcon("https://www.baidu.com/favicon.ico")

		// 隐藏主页面
		// 0松开隐藏按下打开 1常驻
		let mode = 0
		let hidden = true
		function toggleRootDisplay() {
			if (hidden) {
				$("#root").hide()
			} else {
				$("#root").show()
			}
		}
		toggleRootDisplay()
		$(unsafeWindow).keypress(function (e) {
			if (hidden && e.code === "KeyE" && mode === 0) {
				hidden = false
				toggleRootDisplay()
			}
		})
		$(unsafeWindow).keyup(function (e) {
			if (e.code === "KeyE" && mode === 0) {
				hidden = true
				toggleRootDisplay()
			} else if (e.code === "KeyP") {
				mode = mode === 0 ? 1 : 0
				hidden = !hidden
				toggleRootDisplay()
			}
		})
		$(unsafeWindow).on("visibilitychange", function (e) {
			if (document.hidden) {
				hidden = true
				mode = 0
				toggleRootDisplay()
			}
		})

		// 自定义样式
		GM_addStyle(`
			[id^="login-full-panel-"],.wwNZW6za,.ZkZNAxMo .QQMn4M25,.aEzDlumt{display:none !important}
			.i4p_LDeX .eRChRJCd{position:fixed;left:400px;top:12px}
		`)

		// 搜索
		unsafeWindow.__SEARCH__ = function (keywords) {
			if (keywords.trim().length === 0) return
			unsafeWindow.open(`https://www.douyin.com/search/${keywords}`, "_blank")
		}
		console.log("搜索页面", "https://www.douyin.com/search/")

		// 抖音号
		const dyId = $(".TVGQz3SI")
		dyId.click(async function () {
			const text = dyId.text().replace("抖音号：", "")
			await GM_setClipboard(text)
			GM_notification({
				text: "复制成功",
				timeout: 2000,
			})
		})
	}

	// 微信读书注入
	function wereadInject() {
		changeTitle("vue")

		$(unsafeWindow).keyup((e) => {
			if (e.code === "KeyE") {
				// 下一页
				$("button.renderTarget_pager_button_right").click()
			}
		})
	}

	// bilibili注入
	function bilibiliInject() {
		changeTitle("GitHub")

		// const video = $("#bilibili-player video")
		$(unsafeWindow).on("keyup", function (e) {
			// 网页全屏
			if (e.code === "BracketLeft") {
				$(".bpx-player-ctrl-wide").click()
			} else if (e.code === "BracketRight") {
				$(".bpx-player-ctrl-web").click()
			} else if (e.code === "Backslash") {
				$(document.documentElement).scrollTop(100)
			}
			// $(".bpx-player-ctrl-play").click()
		})

		// 自定义样式
		GM_addStyle(`
			.bili-mini-mask,.login-tip,.login-panel-popover {display:none !important}
		`)
	}

	// 知乎注入
	function zhihuInject() {
		changeTitle("百度一下")

		// title
		const title = $(".QuestionHeader-title")
		title.css("opacity", "0")
		title.hover(
			function () {
				title.css("opacity", "1")
			},
			function () {
				title.css("opacity", "0")
			}
		)
	}

	const hostCallback = {
		"www.douyin.com": dyInject,
		"weread.qq.com": wereadInject,
		"bilibili.com": bilibiliInject,
		"zhihu.com": zhihuInject,
	}

	const host = location.host
	Object.keys(hostCallback).forEach((key) => {
		if (host.includes(key)) {
			injectSuccess(key)
			hostCallback[key]()
		}
	})
})()
