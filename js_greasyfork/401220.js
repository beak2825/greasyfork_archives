// ==UserScript==
// @name           独孤求软验证码
// @namespace   ACScript
// @version         0.1
// @description   自动填写 独孤求软的验证码
// @author          FL
// @include         *://www.dugubest.com/*
// @grant            none
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/401220/%E7%8B%AC%E5%AD%A4%E6%B1%82%E8%BD%AF%E9%AA%8C%E8%AF%81%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/401220/%E7%8B%AC%E5%AD%A4%E6%B1%82%E8%BD%AF%E9%AA%8C%E8%AF%81%E7%A0%81.meta.js
// ==/UserScript==

(function() {
	setTimeout(function(){
		document.querySelector("#verifycode").value = "899"
	}, 500);

})();
