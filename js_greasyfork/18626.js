// ==UserScript==
// @name         해피포인트카드 | 해피룰렛 1,000 Auto Starter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @include     https://api.happypointcard.com/front_v3/roulette/index.asp*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/18626/%ED%95%B4%ED%94%BC%ED%8F%AC%EC%9D%B8%ED%8A%B8%EC%B9%B4%EB%93%9C%20%7C%20%ED%95%B4%ED%94%BC%EB%A3%B0%EB%A0%9B%201%2C000%20Auto%20Starter.user.js
// @updateURL https://update.greasyfork.org/scripts/18626/%ED%95%B4%ED%94%BC%ED%8F%AC%EC%9D%B8%ED%8A%B8%EC%B9%B4%EB%93%9C%20%7C%20%ED%95%B4%ED%94%BC%EB%A3%B0%EB%A0%9B%201%2C000%20Auto%20Starter.meta.js
// ==/UserScript==

(function() {
//룰렛시작
	window.rotation = function($part) {

		var part = $part;
		var entryAngle;

		if (part == 0) {                        // 1
			entryAngle = randomize(5, 40);
		} else if (part == 1) {                 // 3
			entryAngle = randomize(275, 310);
		} else if (part == 2) {                 // 5
			entryAngle = randomize(185, 220);
		} else if (part == 3) {                 // 10
			entryAngle = randomize(95, 130);
		} else if (part == 4) {                 // 100
			entryAngle = randomize(320, 355);
		} else if (part == 5) {                 // 300
			entryAngle = randomize(230, 265);
		} else if (part == 6) {                 // 1000
			entryAngle = randomize(140, 175);
		} else if (part == 7) {                 // 10000
			entryAngle = randomize(50, 85);
		}  

		$(".circle").rotate({
			angle: 0,
			animateTo: 360 * 5 + entryAngle,
			center: ["50%", "50%"],
			easing: $.easing.easeInOutElastic,
			callback: function () {
				if(part < 6){
					location.reload();
				} else {
					var n = $(this).getRotateAngle();
					endAnimate(n, part);
				}
			},
			duration: 700
		});

	};
	

	if($('.start_btn').length){
		$('.start_btn').get(0).click();
	}
})();