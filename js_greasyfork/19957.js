// ==UserScript==
// @name         G마켓 | 앱 신규 구매 유틸
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  try to take over the world!
// @author       You
// @match        http://m.gmarket.co.kr/event/*
// @include      <$URL$>
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/19957/G%EB%A7%88%EC%BC%93%20%7C%20%EC%95%B1%20%EC%8B%A0%EA%B7%9C%20%EA%B5%AC%EB%A7%A4%20%EC%9C%A0%ED%8B%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/19957/G%EB%A7%88%EC%BC%93%20%7C%20%EC%95%B1%20%EC%8B%A0%EA%B7%9C%20%EA%B5%AC%EB%A7%A4%20%EC%9C%A0%ED%8B%B8.meta.js
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
        $('body').prepend($('<button type="button" style="width:100%;padding:1em;">구매하기</button>').bind('click', function(){
            $("#frmReal").submit();
        }));
	});
})();