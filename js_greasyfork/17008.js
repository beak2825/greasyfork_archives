// ==UserScript==
// @name			티켓몬스터 제고 모니터링
// @namespace		http://your.homepage/
// @version			0.1
// @description		enter something useful
// @author			You
// @match			http://www.ticketmonster.co.kr/deal/*
// @grant			none
// @downloadURL https://update.greasyfork.org/scripts/17008/%ED%8B%B0%EC%BC%93%EB%AA%AC%EC%8A%A4%ED%84%B0%20%EC%A0%9C%EA%B3%A0%20%EB%AA%A8%EB%8B%88%ED%84%B0%EB%A7%81.user.js
// @updateURL https://update.greasyfork.org/scripts/17008/%ED%8B%B0%EC%BC%93%EB%AA%AC%EC%8A%A4%ED%84%B0%20%EC%A0%9C%EA%B3%A0%20%EB%AA%A8%EB%8B%88%ED%84%B0%EB%A7%81.meta.js
// ==/UserScript==

change_select(preset_depth, null);

// step1ItemDomOrderNum = 1;
// step2ItemDomOrderNum = 32;

$(document).ready(function(){
	$('head').append('<style>.uio_option_lst ul li {margin-left:1em;list-style-type:decimal;}</style>');
	$('.option_info1').before($('\
		<div>\
			<input type="text" id="step1ItemDomOrderNum" placeholder="depth1 항목 번호 입력" />\
			<input type="text" id="step2ItemDomOrderNum" placeholder="depth2 항목 번호 입력" />\
		</div>\
		').append($('<button type="button">Auto selector Start</button>').on('click', function(){
		if($(this).html() === 'Auto selector Start'){
			$(this).html('Auto selector Stop');

			step1 = setInterval(function(){
				if($('#select_options_0 a').length > 1){
					$($('#select_options_0 a').get($('#step1ItemDomOrderNum').val()-1)).trigger('click');
				}
			}, 2000);

			step2 = setInterval(function(){
				if($('#select_options_1 li').length > 0 && $('#select_options_1 li:nth-child('+$('#step2ItemDomOrderNum').val()+') a').length){
					clearInterval(step1);
					clearInterval(step2);
					$('#select_options_1 li:nth-child('+$('#step2ItemDomOrderNum').val()+') a').trigger('click');
					$('#buy_button').trigger('click');
					alert('티몬 모바일 구매 GOGOGOGO');
				}
			}, 10);
		} else {
			$(this).html('Auto selector Start');
			clearInterval(step1);
			clearInterval(step2);
		}
	})));
});