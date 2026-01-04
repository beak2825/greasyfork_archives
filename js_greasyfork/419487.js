// ==UserScript==
// @name         Cyberboard灯效编辑插件
// @namespace    
// @version      0.1
// @description  为Cyberboard灯效编辑增加左移右移功能
// @author       mlch911
// @match        https://diy.angrymiao.com/light/
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419487/Cyberboard%E7%81%AF%E6%95%88%E7%BC%96%E8%BE%91%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/419487/Cyberboard%E7%81%AF%E6%95%88%E7%BC%96%E8%BE%91%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function () {
	'use strict';

	var mlc_move_left = '<div data-v-01be2bdc class="button" id="mlc_move_left">左移</div>'
	var mlc_move_right = '<div data-v-01be2bdc class="button" id="mlc_move_right">右移</div>'

	var blackLED = '<div data-v-1a31f302 class="content" style="filter: brightness(100%);"><div data-v-1a31f302 class="background" style="background: rgb(0, 0, 0);"></div><div data-v-1a31f302 class="center" style="background: radial-gradient(circle, rgb(0, 0, 0) 25%, transparent);"></div></div>'

	function moveLedsLeft() {
		var leds = $('.leds').children('.led')
		leds.each(function (index, led) {
			$(led).empty()
			if (index >= 195) {
				$(led).append(blackLED)
			} else {
				$(led).append(leds.eq(index + 5).children())
			}
		})
	}

	function moveLedsRight() {
		var leds = $($('.leds').children('.led').get().reverse())
		leds.each(function (index, led) {
			$(led).empty()
			if (index >= 195) {
				$(led).append(blackLED)
			} else {
				$(led).append(leds.eq(index + 5).children())
			}
		})
	}

	function addButtons() {
		if ($('.buttons').length > 0) {
			$('.buttons').append(mlc_move_left);
			$('.buttons').append(mlc_move_right);
			$('#mlc_move_left').click(function () {
				moveLedsLeft()
			})
			$('#mlc_move_right').click(function () {
				moveLedsRight()
			})
		} else {
			setTimeout(function () {
				addButtons()
			}, 500)
		}
	}

	$('.buttons').ready(function () {
		addButtons()
	})
})();