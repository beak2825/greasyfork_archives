// ==UserScript==
// @name         KB국민카드 | 사용자 운용 제한 해제, 페이지 제목 추가, 카드 정보 일괄 펼치기, 자동 연장, 자동 스크롤 제어 해제
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  try to take over the world!
// @author       You
// @match        https://*.kbcard.com/*
// @exclude      https://card.kbcard.com/CXORMPIC0001.cms
// @exclude      https://card.kbcard.com/CXPRIMYS0041.cms
// @exclude      https://card.kbcard.com/CXPRIMYS0006.cms
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/16366/KB%EA%B5%AD%EB%AF%BC%EC%B9%B4%EB%93%9C%20%7C%20%EC%82%AC%EC%9A%A9%EC%9E%90%20%EC%9A%B4%EC%9A%A9%20%EC%A0%9C%ED%95%9C%20%ED%95%B4%EC%A0%9C%2C%20%ED%8E%98%EC%9D%B4%EC%A7%80%20%EC%A0%9C%EB%AA%A9%20%EC%B6%94%EA%B0%80%2C%20%EC%B9%B4%EB%93%9C%20%EC%A0%95%EB%B3%B4%20%EC%9D%BC%EA%B4%84%20%ED%8E%BC%EC%B9%98%EA%B8%B0%2C%20%EC%9E%90%EB%8F%99%20%EC%97%B0%EC%9E%A5%2C%20%EC%9E%90%EB%8F%99%20%EC%8A%A4%ED%81%AC%EB%A1%A4%20%EC%A0%9C%EC%96%B4%20%ED%95%B4%EC%A0%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/16366/KB%EA%B5%AD%EB%AF%BC%EC%B9%B4%EB%93%9C%20%7C%20%EC%82%AC%EC%9A%A9%EC%9E%90%20%EC%9A%B4%EC%9A%A9%20%EC%A0%9C%ED%95%9C%20%ED%95%B4%EC%A0%9C%2C%20%ED%8E%98%EC%9D%B4%EC%A7%80%20%EC%A0%9C%EB%AA%A9%20%EC%B6%94%EA%B0%80%2C%20%EC%B9%B4%EB%93%9C%20%EC%A0%95%EB%B3%B4%20%EC%9D%BC%EA%B4%84%20%ED%8E%BC%EC%B9%98%EA%B8%B0%2C%20%EC%9E%90%EB%8F%99%20%EC%97%B0%EC%9E%A5%2C%20%EC%9E%90%EB%8F%99%20%EC%8A%A4%ED%81%AC%EB%A1%A4%20%EC%A0%9C%EC%96%B4%20%ED%95%B4%EC%A0%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    document.addEventListener('DOMContentLoaded', function(){
		// 자동 연장
		setInterval(function(){
			if(typeof continueLoginLeft !== 'undefined'){
				continueLoginLeft();
			}
		}, 1000);
		
		// 카드 정보 일괄 펼치기/접기 버튼 추가
		/**
		$('.contentDetail').prepend($('<style>\
		.bundleDisplayOn {display:block !important;}\
		</style>'));
		
		$('.contentDetail').prepend($('<a href="#">카드 정보 일괄 펼치기/접기</button>').css({
			'cssText': 'display:block;width:100%;margin-bottom:10px;'
		}).attr('class', 'kbBtn btnXS').toggle(function(event){
			event.preventDefault();
			$('ul[class^=tab] li:not([class=tabON])').addClass('tabON bundleTabOn');
			$('.contentDetail').find('div:not(:visible):not([class*=pop])').addClass('bundleDisplayOn');
		}, function(event){
			event.preventDefault();
			$('.bundleTabOn').removeClass('tabON bundleDisplayOn');
			$('.bundleDisplayOn').removeClass('bundleDisplayOn');
		}));
		/**/
		
		$('.contentDetail').prepend($('<a href="#">카드 정보 일괄 펼치기/접기</button>').css({
			'cssText': 'display:block;width:100%;margin-bottom:10px;'
		}).attr('class', 'kbBtn btnXS').toggle(function(event){
			event.preventDefault();
			$('ul[class^=tab] li:not([class=tabON])').addClass('tabON bundleTabOn');
			$('.contentDetail').find('div:not(:visible):not([class*=pop])').each(function(){
				$(this).addClass('bundleDisplayOn');
				if($(this).attr('style')){
					$(this).data('backupStyle', $(this).attr('style'));
					console.log('backup style attr: ', $(this).attr('style'));
				}
				$(this).css({
					'display': 'block'
				})
			});
		}, function(event){
			event.preventDefault();
			$('.bundleTabOn').removeClass('tabON bundleDisplayOn');
			$('.bundleDisplayOn').each(function(){
				$(this).removeClass('bundleDisplayOn');
				$(this).css({
					'display': ''
				});
				if($(this).data('backupStyle')){
					$(this).attr('style', $(this).data('backupStyle'));
					console.log('restore style attr: ', $(this).data('backupStyle'));
				}
			});
		}));
		
		// 카드명 페이지 제목(<title>) 추가
		if($('.cardTit .tit').length){
            document.title = $('.cardTit .tit').text() + ' | ' + document.title;
        }
    });
        
    document.addEventListener('DOMNodeInserted', function(){
        console.log('국민은행 | 사용자 운용 제한 해제');
		
		// 자동 스크롤 제어 해제
		scrollFocus = function(){};
        
        // 마우스 운용 제한 해제
        document.body.oncontextmenu = '';
        document.body.ondragstart = '';
        document.body.onselectstart = '';

        // 기본 양식(<form>) 전송 방식 POST → GET
        /**/
        $('form').each(function(){
            $(this).attr('method', 'get');
        });
        /**/

        // 통합검색 양식(<form>) 전송 방식 POST → GET
        goSearchHeader = function(){
            var searchTopFrm = document.searchTopFrm;
            if (searchTopFrm.topquery.value == "" || searchTopFrm.topquery.value == "검색어를 입력하세요") {
                alert("검색어를 입력하세요.");
                $('#topquery').val("").focus();
                return false;
            }else{
                var check = checkKeyword(searchTopFrm.topquery.value);
                if (check.length > 0) {
                    alert(check);
                    $('#topquery').val("").focus();
                    return false;
                } else {
                    searchTopFrm.action="https://card.kbcard.com/CXPRIZZC0003.cms";
                    //searchTopFrm.method="POST";
                    searchTopFrm.submit();
                }
            }
        }
    }, false);
})();