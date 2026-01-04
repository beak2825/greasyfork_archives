
// ==UserScript==
// @name         酷炫的鼠标点击特效
// @version      6.6.6.6.9999
// @description  (๑•́ ∀ •̀๑) 好玩的鼠标点击特效
// @author       江小白
// @include      /^https?\:\/\/[^\s]*/
// @grant        GM_addStyle
// @require      https://cdn.bootcss.com/jquery/2.2.0/jquery.min.js
// @run-at       document_end
// @grant        unsafeWindow
// @namespace https://greasyfork.org/users/149943
// @downloadURL https://update.greasyfork.org/scripts/370911/%E9%85%B7%E7%82%AB%E7%9A%84%E9%BC%A0%E6%A0%87%E7%82%B9%E5%87%BB%E7%89%B9%E6%95%88.user.js
// @updateURL https://update.greasyfork.org/scripts/370911/%E9%85%B7%E7%82%AB%E7%9A%84%E9%BC%A0%E6%A0%87%E7%82%B9%E5%87%BB%E7%89%B9%E6%95%88.meta.js
// ==/UserScript==

(function() {
	var click_cnt = 0;
	jQuery(document).ready(function($) {
		$("html").click(function(e) {
			var n = 18;
			var $i;
			click_cnt++;
			if (click_cnt == 10) {
				$i = $("<b></b>").text("OωO");
			} else if (click_cnt == 20) {
				$i = $("<b></b>").text("(๑•́ ∀ •̀๑)");
			} else if (click_cnt == 30) {
				$i = $("<b></b>").text("(๑•́ ₃ •̀๑)");
			} else if (click_cnt == 40) {
				$i = $("<b></b>").text("(๑•̀_•́๑)");
			} else if (click_cnt == 50) {
				$i = $("<b></b>").text("（￣へ￣）");
			} else if (click_cnt == 60) {
				$i = $("<b></b>").text("(╯°口°)╯(┴—┴");
			} else if (click_cnt == 70) {
				$i = $("<b></b>").text("૮( ᵒ̌皿ᵒ̌ )ა");
			} else if (click_cnt == 80) {
				$i = $("<b></b>").text("╮(｡>口<｡)╭");
			} else if (click_cnt == 90) {
				$i = $("<b></b>").text("( ง ᵒ̌皿ᵒ̌)ง⁼³₌₃");
			} else if (click_cnt >= 100 && click_cnt <= 105) {
				$i = $("<b></b>").text("(ꐦ°᷄д°᷅)");
			} else {
				$i = $("<b></b>").text("❤");
				n = Math.round(Math.random() * 14 + 6)
			}
			var x = e.pageX,
				y = e.pageY;
			$i.css({
				"z-index": 9999,
				"top": y - 20,
				"left": x,
				"position": "absolute",
				"color": "#E94F06",
				"font-size": n,
				"-moz-user-select": "none",
				"-webkit-user-select": "none",
				"-ms-user-select": "none"
			});
			$("body").append($i);
			$i.animate({
				"top": y - 180,
				"opacity": 0
			}, 1500, function() {
				$i.remove();
			});
		});
	});
})();