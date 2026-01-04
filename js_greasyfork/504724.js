// ==UserScript==
// @name         둘크립트 - 티링2
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  티켓링크 페이지에서 디버거 무효화, 날짜 선택 및 예약 진행 자동화
// @author       Your Name
// @match        https://www.ticketlink.co.kr/reserve/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/504724/%EB%91%98%ED%81%AC%EB%A6%BD%ED%8A%B8%20-%20%ED%8B%B0%EB%A7%812.user.js
// @updateURL https://update.greasyfork.org/scripts/504724/%EB%91%98%ED%81%AC%EB%A6%BD%ED%8A%B8%20-%20%ED%8B%B0%EB%A7%812.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {

        // F1/F2 키에 따라 특정 날짜 클릭, selectScheduleItem(0) 호출, 그리고 reserveNext() 호출
        function clickCalendarDate(index) {
            const dates = document.querySelectorAll('td.calendar-date');
            let count = 0;
            for (let i = 0; i < dates.length; i++) {
                if (dates[i].querySelector('a')) {
                    if (count === index) {
                        dates[i].querySelector('a').click();
                        selectScheduleItem(0); // 클릭 성공 시 selectScheduleItem(0) 호출
                        reserveNext();  // reserveNext() 함수 호출
                        break;
                    }
                    count++;
                }
            }
        }

        window.addEventListener('keydown', function(e) {
            if (e.key === 'F1') {
                e.preventDefault();
                clickCalendarDate(0); // 첫 번째 날짜 클릭
            } else if (e.key === 'F2') {
                e.preventDefault();
                clickCalendarDate(1); // 두 번째 날짜 클릭
            }
        });

    });

})();
