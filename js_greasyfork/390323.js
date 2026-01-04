// ==UserScript==
// @name        인터파크 티케팅 예매 버튼 수정
// @author        언니(http://www.suyongso.com)
// @namespace     http://www.suyongso.com/
// @version       0.4T
// @description 시간이 되지 않았는데도 예매하기 버튼을 추가합니다.(2019-10-29용)
// @include     *://ticket.interpark.com/Ticket/Goods/GoodsInfo.asp*
// @grant       none
// @require       http://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/390323/%EC%9D%B8%ED%84%B0%ED%8C%8C%ED%81%AC%20%ED%8B%B0%EC%BC%80%ED%8C%85%20%EC%98%88%EB%A7%A4%20%EB%B2%84%ED%8A%BC%20%EC%88%98%EC%A0%95.user.js
// @updateURL https://update.greasyfork.org/scripts/390323/%EC%9D%B8%ED%84%B0%ED%8C%8C%ED%81%AC%20%ED%8B%B0%EC%BC%80%ED%8C%85%20%EC%98%88%EB%A7%A4%20%EB%B2%84%ED%8A%BC%20%EC%88%98%EC%A0%95.meta.js
// ==/UserScript==

var ticketNotice = $(".btn_Foreigner");
ticketNotice.text("★★↓↓↓↓예매하기↓↓↓↓ 버튼은 무조건!! 정각에 눌러주십쇼!★★");
ticketNotice.after('<div class="asdfdsaf"><a href="http://poticket.interpark.com/Book/BookSession.asp?GroupCode='+unsafeWindow.vGC+'&Tiki=N&Point=N&PlayDate=20191029&PlaySeq=001&BizCode=&BizMemberCode=" class="btn_rev"><span>예매하기(여러창가능)</span></a></div>');
ticketNotice.after('<div class="tk_dt_btn_TArea"><a href="#" onclick="javascript:fnNormalBooking();" class="btn_rev"><span>예매하기</span></a></div>');