// ==UserScript==
// @name         둘크립트 - 티링1
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  티켓링크 예약을 위한 유저 스크립트입니다.
// @author       Your Name
// @match        *://*.ticketlink.co.kr/product*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/504646/%EB%91%98%ED%81%AC%EB%A6%BD%ED%8A%B8%20-%20%ED%8B%B0%EB%A7%811.user.js
// @updateURL https://update.greasyfork.org/scripts/504646/%EB%91%98%ED%81%AC%EB%A6%BD%ED%8A%B8%20-%20%ED%8B%B0%EB%A7%811.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 티켓 예약 페이지를 새 창에서 엽니다.
    function openTicket(ticketCode) {
        const urlTemplate = 'https://www.ticketlink.co.kr/reserve/product/ticketCode';
        const url = urlTemplate.replace('ticketCode', ticketCode);


            // 새 창의 속성을 정의합니다.
            const windowFeatures = 'menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes';
            // 새 탭이 아닌 새 창에서 URL을 엽니다.
            window.open(url, '_blank',"width=1050,height=880");
        //https://www.ticketlink.co.kr/reserve/plan/schedule/{scheduleId}?menuIndex=reserve

    }


    // 특정 시간에 티켓 예약 페이지를 열도록 예약합니다.
    function scheduleTicket(hour = null, minute = null, second = null, millisecond = null) {
        const ticketCode = getTicketCode();
        if (!ticketCode) {
            console.error("공연 코드를 URL에서 추출할 수 없습니다. URL을 확인하세요.");
            return;
        }

        if (hour === null || minute === null || second === null || millisecond === null) {
            // 시간이 주어지지 않으면 즉시 실행
            openTicket(ticketCode);
            console.log(`즉시 실행: 새 창에서 티켓 예약 페이지를 열었습니다.`);
            return;
        }

        const now = new Date();
        const targetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, second, millisecond);
        if (targetTime < now) targetTime.setDate(targetTime.getDate() + 1);

        const delay = targetTime - now;
        setTimeout(() => openTicket(ticketCode), delay);

        console.log(`예약됨: ${hour}:${minute}:${second}.${millisecond}에 새 창을 열 예정입니다.`);
    }

    // 현재 URL에서 공연 코드를 추출합니다.
    function getTicketCode() {
        const match = window.location.href.match(/\/product\/(\d+)/);
        return match ? match[1] : null;
    }

    // 함수들을 전역 스코프에 노출합니다.
    window.st = scheduleTicket;
   // 단축키 할당
    window.addEventListener('keydown', function(event) {
        switch (event.key) {
            case 'F1':
                scheduleTicket();
                break;
        }
    });

    // 콘솔에 사용 방법을 출력합니다.
    console.log(`사용법: st(hour, minute, second, millisecond);
시간을 생략하면 즉시 실행됩니다.
ticketCode는 네트워크에서 scheduleId 검색.
예시: st(20, 0, 0, 500);
즉시 실행 예시: st();`);
})();