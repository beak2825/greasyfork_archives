// ==UserScript==
// @name         Mouse click effects (hits)
// @version      0.1
// @description  10086hits
// @author       miraku
// @namespace    https://greasyfork.org/zh-CN/users/144063-miraku
// @include      *
// @downloadURL https://update.greasyfork.org/scripts/31789/Mouse%20click%20effects%20%28hits%29.user.js
// @updateURL https://update.greasyfork.org/scripts/31789/Mouse%20click%20effects%20%28hits%29.meta.js
// ==/UserScript==

(function() {
	var click_cnt = 0;
	jQuery(document).ready(function($) {
		$("html").click(function(nowp) {
			var x = nowp.pageX,
				y = nowp.pageY;
			var $click_dot;
			click_cnt++;
			$click_dot = $("<b></b>").text("?" + click_cnt + "hits");
			$click_dot.css({
				"-moz-user-select": "none",
				"-webkit-user-select": "none",
				"-ms-user-select": "none",
				"z-index": 1008,
				"top": y - 20,
				"left": x,
				"position": "absolute",
				"color": "#F00",
				"font-size": 18
			});
			$("body").append($click_dot);
			$click_dot.animate({
				"top": y - 200,
				"opacity": 0,
				"font-size": 36
			}, 1500, function() {
				$click_dot.remove();
			});
		});
	});
})();