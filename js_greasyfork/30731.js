// ==UserScript==
// @name         鼠标点击特效
// @version      6.6.6.946
// @description  (๑•́ ∀ •̀๑) 好玩的鼠标点击特效
// @author       江小白
// @include      /[a-zA-z]+://[^\s]*/
// @grant        GM_addStyle
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @run-at       document_start
// @grant        unsafeWindow
// @namespace https://greasyfork.org/users/19349
// @downloadURL https://update.greasyfork.org/scripts/30731/%E9%BC%A0%E6%A0%87%E7%82%B9%E5%87%BB%E7%89%B9%E6%95%88.user.js
// @updateURL https://update.greasyfork.org/scripts/30731/%E9%BC%A0%E6%A0%87%E7%82%B9%E5%87%BB%E7%89%B9%E6%95%88.meta.js
// ==/UserScript==

(function() {
	var click_cnt = 0;
	jQuery(document).ready(function($) {
		$("html").click(function(e) {
			click_cnt++;
			var $i;
			var size = Math.round(Math.random() * 20 + 10)

			if((click_cnt%10) != 0){
				$i = $("<b></b>").text("❤");
			}else{
				var r = Math.round(Math.random()*8);
				switch(r){
				case 1:
					$i = $("<b></b>").text("( ง ᵒ̌皿ᵒ̌)ง⁼³₌₃");
				break;
				case 2:
					$i = $("<b></b>").text("(๑•́ ∀ •̀๑)");
				break;
				case 3:
					$i = $("<b></b>").text("(๑•́ ₃ •̀๑)");
				break;
				case 4:
					$i = $("<b></b>").text("(๑•̀_•́๑)");
				break;
				case 5:
					$i = $("<b></b>").text("（￣へ￣）");
				break;
				case 6:
					$i = $("<b></b>").text("(╯°口°)╯(┴—┴");
				break;
				case 7:
					$i = $("<b></b>").text("૮( ᵒ̌皿ᵒ̌ )ა");
				break;
				case 8:
					$i = $("<b></b>").text("╮(｡>口<｡)╭");
				break;
				default:
					$i = $("<b></b>").text("OωO");
				break;
				}
			}
			var x = e.pageX,
				y = e.pageY;
			$i.css({
				"z-index": 9999,
				"top": y - 20,
				"left": x,
				"position": "absolute",
				"color": "#E94F06",
				"font-size": size,
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