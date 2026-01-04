// ==UserScript==
// @name         视频添加填充方式
// @namespace    https://greasyfork.org/zh-CN/scripts/416510-%E8%A7%86%E9%A2%91%E6%B7%BB%E5%8A%A0%E5%A1%AB%E5%85%85%E6%96%B9%E5%BC%8F
// @version      0.5
// @description  为PC上的播放器增加视频填充方式选项 ctrl+enter切换
// @author       变异小僵尸
// @match        *://*/*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/2.2.4/jquery.min.js
// @grant      unsafeWindow
// @grant      GM_registerMenuCommand
// @grant      GM_unregisterMenuCommand
// @grant      GM_setValue
// @grant      GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/416510/%E8%A7%86%E9%A2%91%E6%B7%BB%E5%8A%A0%E5%A1%AB%E5%85%85%E6%96%B9%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/416510/%E8%A7%86%E9%A2%91%E6%B7%BB%E5%8A%A0%E5%A1%AB%E5%85%85%E6%96%B9%E5%BC%8F.meta.js
// ==/UserScript==

(function () {
	'use strict';

	//参考自https://blog.csdn.net/k358971707/article/details/60465689
	$(function () {
		let video = false,
			full = false,
			fill = {
				index: 0,
				// type: ['默认', '填充', '拉伸']
				type: ['默认', '填充']
			},
			timeOut = false;
		// 创建监听DOM对象
		const observe = new MutationObserver(function (mutations, observe) {
			//console.log(mutations, observe)
			// 变化了更新 old css
			if (fill.index == 0 && video) {
				video.attr('old-css', video.attr('style'))
			}
		});
		// 监听进入或退出全屏事件
		$(document).on('fullscreenchange webkitfullscreenchange mozfullscreenchange', function () {
			// 是否全屏
			full = isFullscreen()
			// 初始化
			init()
		})
		// 监听组合键
		$(document).on('keydown', function (e) {
			if (full && video) {
				e.stopPropagation()
				// console.log(e)
				if (e.ctrlKey && e.keyCode == 13) {
					if (fill.index >= fill.type.length - 1) {
						fill.index = 0
					} else {
						fill.index += 1
					}
					// 创建提示dom并设置视频填充方式
					setVideoFill()
				}
			}
		})
		// 初始化
		function init() {
			// console.log('isFull ', $(full))
			if (full) {
				//console.log(video)
				if (!video || !video[0].src || !video[0].source) {
					if ($(full)[0].tagName == "VIDEO") {
						// 初始化video
						initVideo($(full))
					} else {
						$(full).find('video').each(function (i, v) {
							// 查找有效的video标签
							if ($(v).attr('src') || $(v).find("source")) {
								// 初始化video
								initVideo($(v))
								// 跳出循环
								return false
							}
						})
					}
				} else {
					// 恢复填充方式
					restFill()
				}
				// 初始化
				function initVideo(v) {
					// 赋值video
					video = v
					// console.log("视频标签：", video)
					// 记录之前的style
					video.attr('old-css', video.attr('style'))
					// 取消video的监听
					observe.disconnect()
					// 监控video style变化
					observe.observe(video[0], { attributeFilter: ['style'], subtree: true });
					// 恢复填充方式
					restFill()
				}
				// 恢复填充方式
				function restFill() {
					if (fill.index != 0) {
						setVideoFill()
					}
				}
			} else {
				// 恢复css
				restCss()
			}
		}
		// 创建提示dom并设置视频填充方式
		function setVideoFill() {
			let css = {
				"top": 0,
				"left": 0,
				"right": 0,
				"bottom": 0,
				"height": "100vh",
				"width": "100vw"
			};
			switch (fill.index) {
				case 0:
					restCss()
					break;
				case 1:
					video.css(Object.assign({}, css, { "object-fit": "cover" }))
					break;
				case 2:
					video.css(Object.assign({}, css, { "object-fit": "fill" }))
					break;
				default:
					restCss()
					break;
			}
			// 先移除之前的提示
			if ($("#video-fill-type")) {
				$("#video-fill-type").remove()
			}
			$(full).append(`
			<div id="video-fill-type" style="position: fixed; z-index: 999999; top: 0; left: 0; right: 0; text-align: center; background: rgba(0, 0, 0, 0.0)">
				<p style="font-size: 40px; padding-top: 20px; padding-bottom: 20px; color: #fff; text-shadow: 0 0 10px black;">${fill.type[fill.index]}</p>
			</div>
			`)
			clearTimeout(timeOut)
			timeOut = setTimeout(() => {
				$("#video-fill-type").remove()
			}, 1500);
		}
		// 恢复css
		function restCss() {
			if (video.attr('old-css')) {
				video.attr('style', video.attr('old-css'))
			} else {
				video.removeAttr('style')
			}
		}
		// 检测是否全屏
		function isFullscreen() {
			return document.fullscreenElement ||
				document.msFullscreenElement ||
				document.mozFullScreenElement ||
				document.webkitFullscreenElement || false;
		}
	})
})();