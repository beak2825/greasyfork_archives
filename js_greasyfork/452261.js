// ==UserScript==
// @name         NFU选课
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  数字校园抢课脚本
// @author       Shadow
// @match        http://ecampus.nfu.edu.cn/csf/xk*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nfu.edu.cn
// @require      https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452261/NFU%E9%80%89%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/452261/NFU%E9%80%89%E8%AF%BE.meta.js
// ==/UserScript==

(function() {
	'use strict';

	$(document).ready(function() {

		let start = false

		let searchTimer = setInterval(function() {

			let inSumitPage = $(".mat-tab-labels").children("div").eq(1).attr("aria-selected")

			if (inSumitPage == "true") {

				let timer

				let target = $("span:contains('提交关注课程')").parent().parent()

				target.append(
					`<button _ngcontent-c2="" class="btnmargin mat-stroked-button mat-primary" id="stopChoose" color="primary" loading="" mat-stroked-button=""><span class="mat-button-wrapper">停止抢课</span><div class="mat-button-ripple mat-ripple" matripple=""></div><div class="mat-button-focus-overlay"></div></button>`
				)


				target.append(
					`<button _ngcontent-c2="" class="btnmargin mat-stroked-button mat-primary" id="startChoose" color="primary" loading="" mat-stroked-button=""><span class="mat-button-wrapper">开始抢课</span><div class="mat-button-ripple mat-ripple" matripple=""></div><div class="mat-button-focus-overlay"></div></button>`
				)

				clearInterval(searchTimer)

				$('#startChoose').click(function() {
					if (start) {
						return
					}
					start = true
					let chooseBtn = $("span:contains('提交关注课程')").parent()
					timer = setInterval(function() {
						chooseBtn.removeAttr('disable')
						chooseBtn.click()
					}, 100)
				})

				$('#stopChoose').click(function() {
					start = false
					clearInterval(timer)
				})

			}

		}, 1000)
	})

})();
