// ==UserScript==
// @name         둘크립트 - 인팍1
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  안알랴줌!
// @author       Your Name
// @match        *://tickets.interpark.com/goods/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/504345/%EB%91%98%ED%81%AC%EB%A6%BD%ED%8A%B8%20-%20%EC%9D%B8%ED%8C%8D1.user.js
// @updateURL https://update.greasyfork.org/scripts/504345/%EB%91%98%ED%81%AC%EB%A6%BD%ED%8A%B8%20-%20%EC%9D%B8%ED%8C%8D1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const DATE_SELECTOR = 'ul[data-view="days"] li:not(.disabled):not(.muted)';
    const TIME_SELECTOR = 'a.timeTableLabel[data-tabtoggle="timeTableList"]';
    const BTN_SELECTOR = 'a.sideBtn.is-primary';

    let dateIdx = 0;
    let timeIdx = 0;
    let retryCount = 0;
    const baseRetryInterval = 30;  // 기본 재시도 주기

    // GPU 가속 기능 설정
    function enableGPU() {
        document.querySelectorAll('.stickyWrap *').forEach(element => {
            element.style.willChange = 'contents';
            element.style.transform = 'translate3d(0, 0, 0)';
        });
        console.log('GPU 가속이 적용되었습니다.');
    }

    // Enter 키 입력 트리거
    function triggerEnterKey(element) {
        const eventOptions = {
            key: 'Enter',
            keyCode: 13,
            code: 'Enter',
            which: 13,
            bubbles: true
        };

        element.focus();
        element.dispatchEvent(new KeyboardEvent('keydown', eventOptions));
        element.dispatchEvent(new KeyboardEvent('keyup', eventOptions));

        console.log('Enter 키 입력 트리거됨');
    }

    // 요소 선택 함수
    function selectElement(selector, index) {
        const elements = Array.from(document.querySelectorAll(selector));
        return elements[index] || null;
    }


    // 새로운 함수 추가
    function clickReserveButton() {
        const btnElement = document.querySelector(BTN_SELECTOR);
        if (btnElement) {
            btnElement.tabIndex = 0;
            triggerEnterKey(btnElement);
            console.log('예약 진행됨');
        } else {
            retryReserve('예약 버튼을 찾을 수 없음');
        }
    }

    // 시간 선택 및 예약 버튼 클릭 함수
    function selectTimeAndReserve() {
        const timeElement = selectElement(TIME_SELECTOR, timeIdx);
        if (timeElement) {
            timeElement.click();
            console.log('회차 선택됨');
            clickReserveButton();
        } else {
            setTimeout(selectTimeAndReserve, baseRetryInterval);
        }
    }

    // 예약 프로세스
    function reserveProcess() {
        const dateElement = selectElement(DATE_SELECTOR, dateIdx);

        if (dateElement) {
            dateElement.click();
            console.log('날짜 선택됨');
            selectTimeAndReserve();
        } else {
            retryReserve('유효한 날짜를 찾을 수 없음');
        }
    }


    // 재시도 함수
    function retryReserve(errorMessage) {
        console.error(`${errorMessage}.`);
        setTimeout(reserveProcess, baseRetryInterval);
    }

    // 특정 시간에 예약 프로세스 실행
    function scheduleReservation(hour, minute, second, millisecond) {
        const currentTime = new Date();
        const targetTime = hour !== undefined && minute !== undefined && second !== undefined && millisecond !== undefined
            ? new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), hour, minute, second, millisecond)
            : currentTime;

        const timeDiff = targetTime - currentTime;

        if (timeDiff > 0) {
            console.log(`예약된 시간에 클릭할 예정: ${targetTime}`);
            setTimeout(reserveProcess, timeDiff);
        } else {
            console.warn('목표 시간이 현재 시간보다 이전입니다. 즉시 실행합니다.');
            reserveProcess();
        }
    }

    // 예약 프로세스 시작 함수
    window.startReserve = function(dateIndex = 0, timeIndex = 0) {
        dateIdx = dateIndex;
        timeIdx = timeIndex;
        retryCount = 0; // 재시도 횟수 초기화
        reserveProcess();
        console.log(`예약 프로세스 시작됨 - 날짜 인덱스: ${dateIdx}, 회차 인덱스: ${timeIdx}`);
    };

    // 예약 버튼을 특정 시간에 클릭하거나 즉시 실행하는 함수
    window.scheduleReservation = function(hour = null, minute = null, second = null, millisecond = null) {
        scheduleReservation(hour, minute, second, millisecond);
    };

    // 단축키 할당
    window.addEventListener('keydown', function(event) {
        switch (event.key) {
            case 'F1':
                startReserve(0, 0);
                break;
            case 'F2':
                startReserve(1, 0);
                break;
            case 'F3':
                selectTimeAndReserve();
                break;
            case 'F4':
                console.log('프로세스 중지');
                break;
        }
    });

    // 콘솔 사용법 출력
    console.log('사용법: startReserve(날짜 인덱스, 회차 인덱스)로 예약 프로세스를 시작하세요.');
    console.log('사용법: scheduleReservation(시, 분, 초, 밀리초)로 특정 시간에 예약 버튼을 클릭합니다.');
    console.log('사용법: scheduleReservation()로 즉시 예약 버튼을 클릭합니다.');
    console.log('단축키: F1 - 0번째 날짜, 0번째 회차 즉시 예약 / F2 - 1번째 날짜, 0번째 회차 즉시 예약 / F4 - 프로세스 중지');

})();
