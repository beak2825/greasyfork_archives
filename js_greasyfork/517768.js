// ==UserScript==
// @name         YouTube播放器网页全屏
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  YouTube 视频播放器网页全屏，仅针对剧场模式有效，请先按 t 进入剧场模式，按 n 快捷键触发（再次按 n 可取消全屏）
// @author       meteora
// @match        https://www.youtube.com/*
// @match        https://www.youtube.com
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/517768/YouTube%E6%92%AD%E6%94%BE%E5%99%A8%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/517768/YouTube%E6%92%AD%E6%94%BE%E5%99%A8%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F.meta.js
// ==/UserScript==

;(() => {
	try {
		// 创建全屏按钮样式
		const style = document.createElement("style")
		style.textContent = `
        .webpage-fullscreen {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            max-width: none !important;
            max-height: none !important;
            z-index: 9999 !important;
            background: black;
        }
    `
		document.head.appendChild(style)

		let isWebpageFullscreen = false
		document.addEventListener("keydown", function (event) {
			// 忽略在输入框中的按键事件
			if (
				event.target.tagName === "INPUT" ||
				event.target.tagName === "TEXTAREA" ||
				event.target.id === "contenteditable-root"
			) {
				return
			}
			function enableFullscreen() {
				const videoContainer = document.getElementById("full-bleed-container")
				if (!videoContainer) return
				isWebpageFullscreen = true
				videoContainer.classList.add("webpage-fullscreen")
				// 模拟屏幕尺寸变化，让播放器大小自适应
				window.dispatchEvent(new Event("resize"))
			}
			function disableFullscreen() {
				const videoContainer = document.getElementById("full-bleed-container")
				if (!videoContainer) return
				if (isWebpageFullscreen) {
					videoContainer.classList.remove("webpage-fullscreen")
					isWebpageFullscreen = false
					// 显示网页滚动条
					// document.documentElement.style.overflow = "auto"
					// 模拟屏幕尺寸变化，让播放器大小自适应
					window.dispatchEvent(new Event("resize"))
				}
			}
			// 按键盘 n 触发
			if (event.key === "n") {
				if (isWebpageFullscreen) {
					disableFullscreen()
				} else {
					enableFullscreen()
				}
				// 阻止默认行为
				event.preventDefault()
				// 按键盘 esc 触发
			} else if (event.key === "Escape") {
				if (isWebpageFullscreen) {
					disableFullscreen()
					// 阻止默认行为
					event.preventDefault()
				}
			}
		})

		setTimeout(() => {
			// 找出视频播放器容器
			const videoDom = document.querySelector("video")
			const videoWrapperContainer = document.getElementById(
				"full-bleed-container"
			)
			videoWrapperContainer.style.position = "relative"
			// 将视频播放器的播放速度反映到屏幕右上角显示
			function removePlayRateInfo() {
				const oldDom = document.getElementById("play-rate-show-info")
				if (oldDom) {
					oldDom.remove()
				}
			}
			function setPlayRateInfo(playRate) {
				// 移除之前插入的元素
				removePlayRateInfo()
				const domText = `<div style="color: white; font-size: 20px; position: absolute; z-index: 999; right: 20px; top: 20px;" id="play-rate-show-info">${playRate}</div>`
				// 将元素作为子节点插入到 videoWrapperContainer 中
				videoWrapperContainer.insertAdjacentHTML("beforeend", domText)
			}
			// 查询视频播放器的播放速度
			let playRate = videoDom.playbackRate
			if (playRate !== 1) {
				setPlayRateInfo(playRate)
			}

			videoDom.addEventListener("ratechange", function () {
				playRate = videoDom.playbackRate
				if (playRate !== 1) {
					setPlayRateInfo(playRate)
				} else {
					removePlayRateInfo()
				}
			})
		}, 3000)
	} catch (e) {
		console.log(e, "error")
		window.alert(e)
	}
})()
