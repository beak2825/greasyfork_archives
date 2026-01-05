// ==UserScript==
// @name         더페이스샵 | 룰렛 선착순
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  try to take over the world!
// @author       You
// @match        http://www.thefaceshop.com/m/mall/event/roulette.jsp
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/24408/%EB%8D%94%ED%8E%98%EC%9D%B4%EC%8A%A4%EC%83%B5%20%7C%20%EB%A3%B0%EB%A0%9B%20%EC%84%A0%EC%B0%A9%EC%88%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/24408/%EB%8D%94%ED%8E%98%EC%9D%B4%EC%8A%A4%EC%83%B5%20%7C%20%EB%A3%B0%EB%A0%9B%20%EC%84%A0%EC%B0%A9%EC%88%9C.meta.js
// ==/UserScript==

(function() {
	var lock1 = false;
	document.addEventListener('DOMNodeInserted', function(){
		if(lock1 === false){
			lock1 = true;
		}
	});
	document.addEventListener('DOMContentLoaded', function(){
        $('section').prepend($('<button type="button" style="width: 100%;padding: 0.5em;font-size: 3em;color: yellow;background-color: #000;border-radius: 1em;font-weight: bold;">auto apply</button>').bind('click', function(){
            autoApplyInterval = setInterval(function(){
                $.getJSON("/mall/event/roulette-proc.jsp", function(json) {
                    if(json.result) {
                        if(json.gift == 0) {
                            // 물량 소진된 경우
                            showPopupLayer("/m/mall/popup/roulette-no.jsp");
                            setTimeout("setAvail(true)", 1000 * 1);
                        } else {
                            var duration = 5000;
                            var pieAngle = 360 * 10;
                            var angle = 0;
                            angle = (pieAngle - ((json.gift * 60) - 0));

                            $("#roulette_base").rotate({
                                duration: duration,
                                animateTo: angle,
                                callback: function () {
                                    switch(json.gift) {
                                        case 2:
                                        case 5:
                                            // 포인트
                                            showPopupLayer("/m/mall/popup/roulette-point.jsp?gift=" + json.gift);
                                            break;
                                        default:
                                            // 상품할인쿠폰
                                            showPopupLayer("/m/mall/popup/roulette-coupon.jsp?gift=" + json.gift);
                                    }
                                    clearInterval(autoApplyInterval);
                                }
                            });
                        }
                    } else {
                        alert(json.msg);
                        setTimeout("setAvail(true)", 1000 * 1);
                    }
                });
            }, 100);
        }));
	});
})();