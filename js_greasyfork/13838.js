// ==UserScript==
// @name			글 쓰기 페이지 이동 확인 받기 | 2015 웹 접근성 지킴이 및 멘토
// @description	글 데이터 손실 방지 위함
// @version		0.1
// @include		http://www.wah.or.kr/side_mento/board_write.asp*
// @namespace	
// @grant			none
// @run-at		document-start
// @downloadURL https://update.greasyfork.org/scripts/13838/%EA%B8%80%20%EC%93%B0%EA%B8%B0%20%ED%8E%98%EC%9D%B4%EC%A7%80%20%EC%9D%B4%EB%8F%99%20%ED%99%95%EC%9D%B8%20%EB%B0%9B%EA%B8%B0%20%7C%202015%20%EC%9B%B9%20%EC%A0%91%EA%B7%BC%EC%84%B1%20%EC%A7%80%ED%82%B4%EC%9D%B4%20%EB%B0%8F%20%EB%A9%98%ED%86%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/13838/%EA%B8%80%20%EC%93%B0%EA%B8%B0%20%ED%8E%98%EC%9D%B4%EC%A7%80%20%EC%9D%B4%EB%8F%99%20%ED%99%95%EC%9D%B8%20%EB%B0%9B%EA%B8%B0%20%7C%202015%20%EC%9B%B9%20%EC%A0%91%EA%B7%BC%EC%84%B1%20%EC%A7%80%ED%82%B4%EC%9D%B4%20%EB%B0%8F%20%EB%A9%98%ED%86%A0.meta.js
// ==/UserScript==

(function() {
	window.addEventListener("beforeunload", function(e) {
		var confirmationMessage = "\o/";
		e.returnValue = confirmationMessage; // Gecko and Trident
		return confirmationMessage; // Gecko and WebKit
	});
})();