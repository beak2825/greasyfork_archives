// ==UserScript==
// @name         시럽월렛 | 이벤트 유틸리티
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  try to take over the world!
// @author       You
// @include      https://t-smartwallet.nate.com:7769/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/20161/%EC%8B%9C%EB%9F%BD%EC%9B%94%EB%A0%9B%20%7C%20%EC%9D%B4%EB%B2%A4%ED%8A%B8%20%EC%9C%A0%ED%8B%B8%EB%A6%AC%ED%8B%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/20161/%EC%8B%9C%EB%9F%BD%EC%9B%94%EB%A0%9B%20%7C%20%EC%9D%B4%EB%B2%A4%ED%8A%B8%20%EC%9C%A0%ED%8B%B8%EB%A6%AC%ED%8B%B0.meta.js
// ==/UserScript==

(function() {
	/**
	var isExcutedStatement1 = false;
	
	document.addEventListener('DOMNodeInserted', function(){
		if(isExcutedStatement1 === false && **.length){
			isExcutedStatement1 = true;
		}
	});
	/**/

	document.addEventListener('DOMContentLoaded', function(){
		setTimeout(function(){
			if($('button[class]:contains("참여"):visible').length){
				$('button[class]:contains("참여"):visible').trigger('click');
			}
			if($('button[class]:contains("GO"):visible').length){
				$('button[class]:contains("GO"):visible').trigger('click');
			}
		}, 500);
	});
})();