// ==UserScript==
// @name Confirm redirect & Check Url
// @description	페이지 주소 확인 및 페이지 이동 확인 받기
// @version		0.1.1
// @include		http*
// @namespace	
// @grant			none
// @run-at		document-start
// @downloadURL https://update.greasyfork.org/scripts/13835/Confirm%20redirect%20%20Check%20Url.user.js
// @updateURL https://update.greasyfork.org/scripts/13835/Confirm%20redirect%20%20Check%20Url.meta.js
// ==/UserScript==

(function() {
	window.addEventListener("beforeunload", function(e) {
                alert(location.href);
		var confirmationMessage = "\o/";
		e.returnValue = confirmationMessage; // Gecko and Trident
		return confirmationMessage; // Gecko and WebKit
	});
})();