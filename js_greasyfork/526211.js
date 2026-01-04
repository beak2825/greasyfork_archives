// ==UserScript==
// @name         asobiticketHelper
// @namespace    http://kanseki.org/
// @version      0.412
// @description  over the staff
// @author       kanseki
// @match        https://tst.shinycolors.moe/erichi.html
// @match        https://asobiticket2.asobistore.jp/mypage/tickets/*
// @icon         none
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526211/asobiticketHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/526211/asobiticketHelper.meta.js
// ==/UserScript==

const section = document.querySelector('.ticket-info-section:not(.seat)');
if (section) {
  const ticketInfos = section.querySelectorAll('.ticket-info');
  if (ticketInfos.length >= 2) {
    const firstTicketInfo = ticketInfos[0].querySelector('.value-main');
    const secondTicketInfo = ticketInfos[1].querySelector('.value-main');
    firstTicketInfo.innerHTML = 'test name';
    secondTicketInfo.innerHTML = '1993年08月27日';
    //alert('資訊已更新！');
  } else {
    //alert('找不到足夠的 .ticket-info 元素');
  }
} else {
  //alert('找不到 .ticket-info-section 元素');
}