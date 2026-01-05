// ==UserScript==
// @name         Clien 키워드 모니터링
// @namespace    http://your.homepage/
// @version      0.3
// @description  enter something useful
// @author       You
// @include      http://www.clien.net*
// @include      http://clien.net*
// @include      http://m.clien.net*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/16788/Clien%20%ED%82%A4%EC%9B%8C%EB%93%9C%20%EB%AA%A8%EB%8B%88%ED%84%B0%EB%A7%81.user.js
// @updateURL https://update.greasyfork.org/scripts/16788/Clien%20%ED%82%A4%EC%9B%8C%EB%93%9C%20%EB%AA%A8%EB%8B%88%ED%84%B0%EB%A7%81.meta.js
// ==/UserScript==

var keywordHighlighter = function(){
    $('a:contains("스타")').css({'cssText': 'color:red !important;font-weight:bold !important;'});
    $('a:contains("나눔")').css({'cssText': 'color:red !important;font-weight:bold !important;'});
    $('a:contains("리딤")').css({'cssText': 'color:red !important;font-weight:bold !important;'});
    $('a:contains("프리")').css({'cssText': 'color:red !important;font-weight:bold !important;'});
    $('a:contains("star")').css({'cssText': 'color:red !important;font-weight:bold !important;'});
    $('a:contains("Star")').css({'cssText': 'color:red !important;font-weight:bold !important;'});

    $('span:contains("스타")').css({'cssText': 'color:red !important;font-weight:bold !important;'});
    $('span:contains("나눔")').css({'cssText': 'color:red !important;font-weight:bold !important;'});
    $('span:contains("리딤")').css({'cssText': 'color:red !important;font-weight:bold !important;'});
    $('span:contains("프리")').css({'cssText': 'color:red !important;font-weight:bold !important;'});
    $('span:contains("star")').css({'cssText': 'color:red !important;font-weight:bold !important;'});
    $('span:contains("Star")').css({'cssText': 'color:red !important;font-weight:bold !important;'});
};
if(typeof AutoPagerFilters === 'undefined'){
	AutoPagerFilters = [];
}
AutoPagerFilters.push(keywordHighlighter);

document.addEventListener('DOMContentLoaded', function(){	
	keywordHighlighter();
    /**
    reloadReady = false;

    a = setInterval(function(){
        location.reload();
    }, 1000);

    $('*').bind('mouseover', function(event){
        reloadReady = true;
        clearInterval(a);
    });
    
    $('*').bind('mouseout', function(event){
        if (event.toElement == null && event.relatedTarget == null && reloadReady === true) {
            location.reload();
        }
    });
	/**/
    /**
    // 댓글 처리
	$('#wr_content').val('신청해봅니다^^ 감사합니다~ 9021-4000-2827-2854');
	$('#wr_content').focus();
    
	if(!$('a[title="[godblessyou]godblessyou"]').length){
		$('#fviewcomment input[type=image]').get(0).focus();
	}
	/**/
});