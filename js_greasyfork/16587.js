// ==UserScript==
// @name         머핀베이킹, 가위바위보게임 | 우리은행
// @namespace    http://your.homepage/
// @version      0.2
// @description  enter something useful
// @author       You
// @match        https://spot.wooribank.com/pot/Dream?withyou=MFMUF0010
// @match        https://spot.wooribank.com/pot/Dream?withyou=MFMUF0009
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/16587/%EB%A8%B8%ED%95%80%EB%B2%A0%EC%9D%B4%ED%82%B9%2C%20%EA%B0%80%EC%9C%84%EB%B0%94%EC%9C%84%EB%B3%B4%EA%B2%8C%EC%9E%84%20%7C%20%EC%9A%B0%EB%A6%AC%EC%9D%80%ED%96%89.user.js
// @updateURL https://update.greasyfork.org/scripts/16587/%EB%A8%B8%ED%95%80%EB%B2%A0%EC%9D%B4%ED%82%B9%2C%20%EA%B0%80%EC%9C%84%EB%B0%94%EC%9C%84%EB%B3%B4%EA%B2%8C%EC%9E%84%20%7C%20%EC%9A%B0%EB%A6%AC%EC%9D%80%ED%96%89.meta.js
// ==/UserScript==

document.addEventListener('DOMContentLoaded', function(){
	
	// 가위바위보게임
	setInterval(function(){
		$('#m1').val(10);
	}, 250);
	
	// 머핀베이킹게임
	$('#contentTitle').append($('<button type="button">Start auto play</button>').on('click', function(){

		getRandomizer = function(bottom, top) {
			return function() {
				return Math.floor( Math.random() * ( 1 + top - bottom ) ) + bottom;
			}
		};
		if($(this).html() == 'Start auto play'){
			$(this).html('Stop auto play');
			
			timer = setInterval(function(){
				if(parseInt($('#MFF').html()) < getRandomizer(52, 69)() || parseInt($('#MFF').html()) > getRandomizer(52, 69)()){
					// $('[name=ovenGood]').each(function(){
					// 	if($(this).hasClass('dis-n') === false){
					// 		$(this).parent('[onclick]').trigger('click');
					// 	}
					// });
					$('.mf-mix').each(function(){
						$(this).parent('[onclick]').trigger('click');
					});
					$('.mf-fresh').each(function(){
						$(this).parent('[onclick]').trigger('click');
					});
					$('.mf-punk').each(function(){
						$(this).parent('[onclick]').trigger('click');
					});
					$('.baking-step3.on').each(function(){
						$(this).parent('[onclick]').trigger('click');
					});
				}
				
				if($('a:contains(게임하기):visible').length && typeof $('a:contains(게임하기):visible').data('data') === 'undefined'){
					$('a:contains(게임하기)').trigger('click');
					$('a:contains(게임하기)').data('data', 'excuted');
				}
				
				if($('a:contains(다시하기):visible').length && typeof $('a:contains(다시하기):visible').data('data') === 'undefined'){
					$('a:contains(다시하기)').trigger('click');
					$('a:contains(다시하기)').data('data', 'excuted');
				}
				
				if($('button[class^=btn-grade][onclick]:last:visible').length && typeof $('button[class^=btn-grade][onclick]:last:visible').data('data') === 'undefined'){
					$('button[class^=btn-grade][onclick]:last').trigger('click');
					$('button[class^=btn-grade][onclick]:last').data('data', 'excuted');
				}
				
				console.log('timer');
			}, 250);

		} else if($(this).html() == 'Stop auto play' && timer) {
			clearInterval(timer);
			$(this).html('Start auto play');
		}

	}));
});