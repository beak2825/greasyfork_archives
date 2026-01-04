// ==UserScript==
// @name         이랜드 페이북 테스트
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over ㅇㅇ
// @author       You
// @include      *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436944/%EC%9D%B4%EB%9E%9C%EB%93%9C%20%ED%8E%98%EC%9D%B4%EB%B6%81%20%ED%85%8C%EC%8A%A4%ED%8A%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/436944/%EC%9D%B4%EB%9E%9C%EB%93%9C%20%ED%8E%98%EC%9D%B4%EB%B6%81%20%ED%85%8C%EC%8A%A4%ED%8A%B8.meta.js
// ==/UserScript==

var simulateClick = function (elem) {
	// Create our event (with options)
	var evt = new MouseEvent('click', {
		bubbles: true,
		cancelable: true,
		view: window
	});
    // If cancelled, don't dispatch our event
    var canceled = !elem.dispatchEvent(evt);
};


var macro0 = setInterval(function() {
    if(/m-secure\.elandmall\.com/.test (location.hostname) ){
        if(document.getElementsByName('regist_order_button')[0]){
            simulateClick(document.getElementsByName('regist_order_button')[0]);
            clearInterval(macro0);
        }
    }
}, 100);