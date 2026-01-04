// ==UserScript==
// @name 		Amazon Replace
// @description 	Amazon Replaceeeeeeeee
// @version 		0.0.1
// @include 	http://*/*
// @include 	https://*/*
// @namespace https://greasyfork.org/users/119008
// @downloadURL https://update.greasyfork.org/scripts/387623/Amazon%20Replace.user.js
// @updateURL https://update.greasyfork.org/scripts/387623/Amazon%20Replace.meta.js
// ==/UserScript==

if (/www\.amazon.co.jp\/.*?B0[0-Z]{8,8}.*?/.test(location.href)) {
(function () {
	var AsinValue = ASIN.value;
	history.pushState('','','/exec/obidos/ASIN/' + AsinValue + '/nanaan-22/',);
})();
}