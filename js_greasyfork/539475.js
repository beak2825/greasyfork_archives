// ==UserScript==
// @name         youtube 视频右上角显示播放速度
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  视频右上角显示当前的播放速度，仅对于播放速度不等于1时有效
// @author       meteora
// @match        https://www.youtube.com/*
// @match http://www.youtube.com/*
// @match http://youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/539475/youtube%20%E8%A7%86%E9%A2%91%E5%8F%B3%E4%B8%8A%E8%A7%92%E6%98%BE%E7%A4%BA%E6%92%AD%E6%94%BE%E9%80%9F%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/539475/youtube%20%E8%A7%86%E9%A2%91%E5%8F%B3%E4%B8%8A%E8%A7%92%E6%98%BE%E7%A4%BA%E6%92%AD%E6%94%BE%E9%80%9F%E5%BA%A6.meta.js
// ==/UserScript==

(()=>{
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
})()