// ==UserScript==
// @name         Clien | 나의글 카테고리 추가, 포인트 노출, 행 링크, 단축키
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @include      http://www.clien.net/*
// @include      http://clien.net/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/16563/Clien%20%7C%20%EB%82%98%EC%9D%98%EA%B8%80%20%EC%B9%B4%ED%85%8C%EA%B3%A0%EB%A6%AC%20%EC%B6%94%EA%B0%80%2C%20%ED%8F%AC%EC%9D%B8%ED%8A%B8%20%EB%85%B8%EC%B6%9C%2C%20%ED%96%89%20%EB%A7%81%ED%81%AC%2C%20%EB%8B%A8%EC%B6%95%ED%82%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/16563/Clien%20%7C%20%EB%82%98%EC%9D%98%EA%B8%80%20%EC%B9%B4%ED%85%8C%EA%B3%A0%EB%A6%AC%20%EC%B6%94%EA%B0%80%2C%20%ED%8F%AC%EC%9D%B8%ED%8A%B8%20%EB%85%B8%EC%B6%9C%2C%20%ED%96%89%20%EB%A7%81%ED%81%AC%2C%20%EB%8B%A8%EC%B6%95%ED%82%A4.meta.js
// ==/UserScript==

/* jshint -W097 */
'use strict';

// Your code here...

// 나의글 카테고리 추가
var addCategory = function(){
	if(location.href.match(/modules\/my_comment.php/g)){
		console.log('나의글 카테고리 추가');
        if(!$('.col_category').length){
			$('table col:nth-child(1)').after($('<col class="col_category">'));
			$('table thead th:nth-child(1)').after($('<th>').text('카테고리'));
			$('table thead td:nth-child(1)').after($('<td>').text('카테고리'));
		}
		$('table tr:not([class="addedCategory"]) a').each(function(){
			try {
				var category_id = (/bo\_table=(.[^\&]+)/.exec($(this).attr('href'))[0]);
				$(this).parent('td').before($('<td>').text($('#snb').find('a[href*='+category_id+']').text()));
				$(this).parents('tr').addClass('addedCategory');
			} catch(e) {
				console.log(e);
			}
		});
	}
};
document.addEventListener('DOMContentLoaded', function(){
	addCategory();
});
if(typeof AutoPagerFilters === 'undefined'){
	AutoPagerFilters = [];
}
AutoPagerFilters.push(addCategory);

document.addEventListener('DOMContentLoaded', function(){
	
    // 게시글 행 링크 처리
    $('td.post_subject a').each(function(){
        $(this).parents('tr').css('cursor', 'pointer').bind('click', function(){
            location.href = $(this).find('td.post_subject a').attr('href');
        });
    });
	
    // 키보드 단축키(Mac, 한글입력상태에서도 적용)
    $(document).bind('keypress', function(event){
        console.log(event.keyCode);
        if(event.keyCode == 12601){
            location.href = g4_path +"/bbs/board.php?bo_table=park";//park	f
        }
    });
	
	// 포인트 노출
	$('head').prepend('\
<style>\
body #account {padding:15px 0 10px;height:auto;}\
body #account .member_info {padding-top:0;}\
.link_point {display:block;margin:8px auto 0;width:100px;text-align:center;}\
</style>');
	
	$.ajax({
		url: '/cs2/bbs/profile.php?mb_id=godblessyou',
		success: function(data){
			$('.member_info').after($('<a href="/cs2/bbs/board.php?bo_table=faq&wr_id=363" class="link_point" target="_blank" title="[새 창] 클리앙 포인트 정리 바로가기">'+data.match(/포인트.+점/g)+'</p>'));;
			/*var temp=$('<div>').html(data); console.log(temp);*/
		}
	});
});