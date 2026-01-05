// ==UserScript==
// @name         Clien 키워드 모니터링
// @namespace    http://your.homepage/
// @version      0.1
// @description  enter something useful
// @author       You
// @match        http://www.clien.net/cs2/bbs/board.php?bo_table=*
// @match        http://clien.net/cs2/bbs/board.php?bo_table=*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/16565/Clien%20%ED%82%A4%EC%9B%8C%EB%93%9C%20%EB%AA%A8%EB%8B%88%ED%84%B0%EB%A7%81.user.js
// @updateURL https://update.greasyfork.org/scripts/16565/Clien%20%ED%82%A4%EC%9B%8C%EB%93%9C%20%EB%AA%A8%EB%8B%88%ED%84%B0%EB%A7%81.meta.js
// ==/UserScript==

document.addEventListener('DOMContentLoaded', function(){
    $('a:contains("스타")').css({'color': 'red', 'font-weight': 'bold'});
    $('a:contains("나눔")').css({'color': 'red', 'font-weight': 'bold'});
    $('a:contains("스벅")').css({'color': 'red', 'font-weight': 'bold'});
    $('a:contains("프리")').css({'color': 'red', 'font-weight': 'bold'});
    
    reloadReady = false;

    a = setInterval(function(){
        location.reload();
    }, 300);

    $(document).bind('mouseover', function(event){
        reloadReady = true;
        clearInterval(a);
    });
    
    $(document).bind('mouseout', function(event){
        if (event.toElement == null && event.relatedTarget == null && reloadReady === true) {
            location.reload();
        }
    });
    
    // 댓글 처리
	$('#wr_content').val('신청해봅니다^^ 감사합니다~ 9021-4000-2827-2854');
	$('#wr_content').focus();
    
	if(!$('a[title="[godblessyou]godblessyou"]').length){
		$('#fviewcomment input[type=image]').get(0).focus();
	}
});