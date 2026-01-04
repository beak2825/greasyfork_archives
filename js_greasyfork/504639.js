// ==UserScript==
// @name         둘크립트 - 멜크1
// @namespace    http://tampermonkey.net/
// @version      0.13
// @description  멜론티켓 자동 접속 스크립트
// @author       사용자 이름
// @match        *://ticket.melon.com/performance/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/504639/%EB%91%98%ED%81%AC%EB%A6%BD%ED%8A%B8%20-%20%EB%A9%9C%ED%81%AC1.user.js
// @updateURL https://update.greasyfork.org/scripts/504639/%EB%91%98%ED%81%AC%EB%A6%BD%ED%8A%B8%20-%20%EB%A9%9C%ED%81%AC1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let selectedDateIndex = 0;
    let selectedTimeIndex = 0;
    let dateSelectionTimer = null;
    let timeSelectionTimer = null;

    let dateElements = [];
    let timeElements = [];
    let reservationButton = null;
    let isDateSelected = false;

    const DATE_CHECK_INTERVAL = 20;  // 적절한 간격으로 조정
    const TIME_CHECK_INTERVAL = 20;  // 적절한 간격으로 조정

    const DATE_ITEM_SELECTOR = 'li.item_date';
    const TIME_ITEM_SELECTOR = 'li.item_time';
    const RESERVATION_BUTTON_SELECTOR = '.button.btColorGreen';

    require(["js/app/performance/service/reservationService"], function(reservationService) {

        function updateDateElements() {
            const newDateElements = document.querySelectorAll(DATE_ITEM_SELECTOR);
            if (newDateElements.length !== dateElements.length) {
                dateElements = newDateElements;
            }
        }

        function updateTimeElements() {
            const newTimeElements = document.querySelectorAll(TIME_ITEM_SELECTOR);
            if (newTimeElements.length !== timeElements.length) {
                timeElements = newTimeElements;
            }
        }

        function checkDateSelection() {
            console.log('날짜 선택 대기 중...');
            updateDateElements();
            if (dateElements.length > selectedDateIndex) {
                const dateElement = dateElements[selectedDateIndex];
                if (dateElement) {
                    selectDate(dateElement);
                    clearInterval(dateSelectionTimer);
                }
            }
        }

        function selectDate(element) {
            element.click();
            console.log('날짜가 선택되었습니다.');
            isDateSelected = true;
            startCheckingTimeSelection();
        }

        async function initializeReservationSetup() {
            if (!reservationButton) {  // 예약 버튼 캐싱
                reservationButton = document.querySelector(RESERVATION_BUTTON_SELECTOR);
            }
            if (reservationButton) {
                console.log('예약 버튼이 설정되었습니다.');
                await configureReservationButton();
            }
        }

        function checkTimeSelection() {
            console.log('회차 선택 대기 중...');
            if (isDateSelected) {
                updateTimeElements();
                if (timeElements.length > selectedTimeIndex) {
                    const timeElement = timeElements[selectedTimeIndex];
                    if (timeElement) {
                        selectTime(timeElement);
                        initializeReservationSetup().then(() => {
                            proceedToReservation();
                            clearInterval(timeSelectionTimer);
                        });
                    }
                }
            }
        }

        function startCheckingTimeSelection() {
            if (timeSelectionTimer) {
                clearInterval(timeSelectionTimer);
            }
            timeSelectionTimer = setInterval(checkTimeSelection, TIME_CHECK_INTERVAL);
        }

        function selectTime(element) {
            element.click();
            console.log('회차가 선택되었습니다.');
        }

        function proceedToReservation() {
            if (reservationButton) {
                reservationButton.click();
                console.log('예약이 진행되었습니다.');
            } else {
                console.error('예약 버튼을 찾을 수 없습니다.');
            }
        }

        async function configureReservationButton() {
            return new Promise((resolve) => {
                $(document).off("click", RESERVATION_BUTTON_SELECTOR).on("click", RESERVATION_BUTTON_SELECTOR, function() {
                    const $this = $(this);
                    const reservationParams = {
                        prodId: $this.attr("data-prodid"),
                        prodTypeCode: $this.attr("data-prodtypecode"),
                        pocCode: commonCode.POC_CODE_PC,
                        btnType: "B",
                        autheTypeCode: $this.attr("data-autheTypeCode") || $("#tciketProcessBox_preSaleAutheTypeCode").val(),
                        authYn: $this.attr("data-authyn"),
                        processType: commonCode.RESERVATION_CLASS_TYPE_DEFAULT
                    };
                    reservationService.service.reservationInit(reservationParams);
                });
                resolve();
            });
        }

        document.addEventListener('keydown', function(event) {
            if (event.key === 'F1' || event.key === 'F2') {
                event.preventDefault();
                selectedDateIndex = (event.key === 'F1') ? 0 : 1;
                console.log(`F${selectedDateIndex + 1} 키 누름: selectedDateIndex가 ${selectedDateIndex}으로 설정되었습니다.`);
                startDateSelection();
            }
        });

        function startDateSelection() {
            if (dateSelectionTimer) {
                clearInterval(dateSelectionTimer);
            }
            dateSelectionTimer = setInterval(checkDateSelection, DATE_CHECK_INTERVAL);
        }

        window.melonScript = {
            startDateSelection: startDateSelection
        };

        console.log('둘크립트 - 멜론티켓 자동 접속 스크립트 로드됨');
    });
})();
