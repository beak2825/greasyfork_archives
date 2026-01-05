// ==UserScript==
// @name         스타벅스 Olleh WiFi 자동 연결
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  try to take over the world!
// @author       You
// @include      http://first.wifi.olleh.com/mobile/*
// @include      https://first.wifi.olleh.com/mobile/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/22995/%EC%8A%A4%ED%83%80%EB%B2%85%EC%8A%A4%20Olleh%20WiFi%20%EC%9E%90%EB%8F%99%20%EC%97%B0%EA%B2%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/22995/%EC%8A%A4%ED%83%80%EB%B2%85%EC%8A%A4%20Olleh%20WiFi%20%EC%9E%90%EB%8F%99%20%EC%97%B0%EA%B2%B0.meta.js
// ==/UserScript==

(function(){
	document.addEventListener('DOMContentLoaded', function(){
	});
	window.addEventListener('load', function(){
		//step1
		if(location.href.indexOf('http://first.wifi.olleh.com/mobile/index_en_starbucks.html') > -1){
			if($('select[onchange] option:contains("Korea")').length){
				$('select[onchange] option:contains("Korea")').attr('selected', true).parents('select').trigger('change');
			}
		}
		//step2
		if(location.href.indexOf('http://first.wifi.olleh.com/mobile/index_new.html') > -1){
			if($('area[href*="submit()"]').length){
				$('area[href*="submit()"]').trigger('click');
			}
		}
		//step3
		if(location.href.indexOf('https://first.wifi.olleh.com/mobile/starbucks.php') > -1){
			if($('img[src*="btn_clauseView.png"][onclick]:visible').length){
				setTimeout(function(){
					$('img[src*="btn_clauseView.png"][onclick]:visible').trigger('click');

					setTimeout(function(){
						if($('input[type="text"][name="userNm"]').length && $('input[type="text"][name="cust_email_addr"]').length){
							$('input[type="text"][name="userNm"]').val('godblessyou');
							$('input[type="text"][name="cust_email_addr"]').val('blessyouamen.kr@gmail.com');
						}
						if($('img[alt="완료"][onclick*="validate()"]').length){
							$('img[alt="완료"][onclick*="validate()"]').trigger('click');
						}
					}, 500);
				}, 500);
			}
		}
	});
})();