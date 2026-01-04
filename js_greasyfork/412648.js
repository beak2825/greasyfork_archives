// ==UserScript==
// @name         부루마불 강제응모
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://visitkorea-event.or.kr/event/event.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412648/%EB%B6%80%EB%A3%A8%EB%A7%88%EB%B6%88%20%EA%B0%95%EC%A0%9C%EC%9D%91%EB%AA%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/412648/%EB%B6%80%EB%A3%A8%EB%A7%88%EB%B6%88%20%EA%B0%95%EC%A0%9C%EC%9D%91%EB%AA%A8.meta.js
// ==/UserScript==



var html = '';
html = html + '<a href="javascript:;" onclick="popPersonal()">                                                               ';
html = html + '	<img src="./img/event_btntype01.png" class="event_mable_btn_pc"alt="참여하기">                             ';
html = html + '	<img src="./img/m_event_btntype01.png" class="event_mable_btn_mo event_mable_btn_pc_type01"alt="참여하기"> ';
html = html + '</a>    ';
html = html +'<a href="javascript:;" class="event_type03" onclick="callAction()">								  ';
html = html +'	<img src="./img/event_btntype03.png" class="event_mable_btn_pc"alt="응모하기"">				  ';
html = html +'	<img src="./img/m_event_btntype03.png" class="event_mable_btn_mo event_mable_btn_pc_type03"alt="응모하기">';
html = html +'</a>													  ';

    var macro = setInterval(function() {
        $("#divBtn").html(html);
    }, 1000);
