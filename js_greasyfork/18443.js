// ==UserScript==
// @name         해피머니 | 입력 양심 숨김 해제
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @include      http://www.happymoney.co.kr/*
// @match        https://www.happymoney.co.kr/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/18443/%ED%95%B4%ED%94%BC%EB%A8%B8%EB%8B%88%20%7C%20%EC%9E%85%EB%A0%A5%20%EC%96%91%EC%8B%AC%20%EC%88%A8%EA%B9%80%20%ED%95%B4%EC%A0%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/18443/%ED%95%B4%ED%94%BC%EB%A8%B8%EB%8B%88%20%7C%20%EC%9E%85%EB%A0%A5%20%EC%96%91%EC%8B%AC%20%EC%88%A8%EA%B9%80%20%ED%95%B4%EC%A0%9C.meta.js
// ==/UserScript==

(function() {
    document.addEventListener('DOMContentLoaded', function(){
		setInterval(function(){
			if($('form:not(":visible")').length){
				$('form:not(":visible")').show();
			}
		}, 100);
	});
})();