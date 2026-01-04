// ==UserScript==
// @namespace    https://my.sieiot.com/attcenter/kimver
// @name         赛意考勤自动填工时
// @version      0.1
// @description  自动填充工时按钮
// @author       kimver
// @match        https://my.chinasie.com/attcenter/*
// @icon         https://my.sieiot.com/bpm/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/471643/%E8%B5%9B%E6%84%8F%E8%80%83%E5%8B%A4%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%B7%A5%E6%97%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/471643/%E8%B5%9B%E6%84%8F%E8%80%83%E5%8B%A4%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%B7%A5%E6%97%B6.meta.js
// ==/UserScript==

(function() {
	'use strict';
	var btn = document.createElement("button");
	btn.innerHTML = '自动填充工时';
	btn.style = 'position: absolute; z-index: 10000;right: 50%;top: 20px;background:#000;color: #fff;padding: 5px 10px;border-radius: 10px;'
	btn.classList.add('__SIE_BTN__')
	setInterval(() => {
		var fillWorkL = document.querySelector('.fillWorkL')
		var btn1 = document.body.querySelector('.__SIE_BTN__')
		if (fillWorkL) {
			!btn1 && document.body.appendChild(btn);
		} else {
			btn1 && document.body.removeChild(btn1);
		}
	}, 500)

	btn.onclick = function() {
		try {
			var list = document.querySelectorAll('.fillWorkR .item-content .item-box')

			var input = list[1].querySelector('input')
			let lastValue = input.value
			input.value = 8
			let event = new Event("input", {
				bubbles: true
			});
			//  React15
			event.simulated = true;
			//  React16 内部定义了descriptor拦截value，此处重置状态
			let tracker = input._valueTracker;
			if (tracker) {
				tracker.setValue(lastValue);
			}
			input.dispatchEvent(event);

			var select = list[2].querySelector('svg').parentNode
			select.click()

			setTimeout(() => {
				setTimeout(() => {
					document.querySelector('.FreeScrollbar-container').firstChild.click()

					setTimeout(() => {
						select = list[3].querySelector('svg').parentNode
						select.click()
						setTimeout(() => {
							document.querySelector('.FreeScrollbar-container')
								.firstChild.click()
						}, 50)
					}, 50)
				}, 50)
			}, 50)
		} catch (e) {
			console.error(e)
		}
	}
})();
