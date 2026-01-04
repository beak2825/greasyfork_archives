// ==UserScript==
// @name            Mouse click effects
// @auther          miraku
// @version         0.3
// @description     Mouse click effects.
// @namespace       https://greasyfork.org/zh-CN/users/144063-miraku
// @include         *
// @downloadURL https://update.greasyfork.org/scripts/31787/Mouse%20click%20effects.user.js
// @updateURL https://update.greasyfork.org/scripts/31787/Mouse%20click%20effects.meta.js
// ==/UserScript==
/**
 * @name		    onclick
 * @auther          miraku
 * @description     effects of click
 */

(function() {
	var random_num = 0;
	var colors = ["#DC9FB4", "#E16BBC", "#F4A7B9", "#F596AA", "#FEDFE1"];
	jQuery(document).ready(function($) {
		$("html").click(function(nowp) {
			var x = nowp.pageX,
				y = nowp.pageY;
			var fsize = 18;
			var $click_dot;
			random_num = Math.round(Math.random() * 50);
			switch (random_num) {
				case 0:
					$click_dot = $("<b></b>").text("(￣▽￣)");
					// statements_1
					break;
				case 1:
					$click_dot = $("<b></b>").text("(oﾟvﾟ)ノ");
					// statements_1
					break;
				case 2:
					$click_dot = $("<b></b>").text("ε=ε=ε=(~￣▽￣)~");
					// statements_1
					break;
				case 3:
					$click_dot = $("<b></b>").text("o((>ω< ))o");
					// statements_1
					break;
				case 4:
					$click_dot = $("<b></b>").text("=￣ω￣=");
					// statements_1
					break;
				case 5:
					$click_dot = $("<b></b>").text("(。>︿<)_θ");
					// statements_1
					break;
				case 6:
					$click_dot = $("<b></b>").text("o(*￣︶￣*)o");
					// statements_1
					break;
				case 7:
					$click_dot = $("<b></b>").text("（づ￣3￣）づ╭❤～");
					// statements_1
					break;
				case 8:
					$click_dot = $("<b></b>").text("(☆▽☆)");
					// statements_1
					break;
				case 9:
					$click_dot = $("<b></b>").text("?");
					fsize = Math.round(Math.random() * 14 + 6);
					break;
				default:
					$click_dot = $("<b></b>").text("❤");
					fsize = Math.round(Math.random() * 14 + 6);
					// statements_def
					break;
			}
			$click_dot.css({
				"-moz-user-select": "none",
				"-webkit-user-select": "none",
				"-ms-user-select": "none",
				"z-index": 1008,
				"top": y - 20,
				"left": x,
				"position": "absolute",
				"color": colors[Math.round(Math.random() * 5)],
				"font-size": fsize
			});
			$("body").append($click_dot);
			$click_dot.animate({
				"top": y - 200,
				"opacity": 0
			}, 1500, function() {
				$click_dot.remove();
			});
		});
	});
})();