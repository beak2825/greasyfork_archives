// ==UserScript==
// @name         둘크립트 - 인팍3
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  뿌잉
// @author       Your Name
// @match        *://tickets.interpark.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/529259/%EB%91%98%ED%81%AC%EB%A6%BD%ED%8A%B8%20-%20%EC%9D%B8%ED%8C%8D3.user.js
// @updateURL https://update.greasyfork.org/scripts/529259/%EB%91%98%ED%81%AC%EB%A6%BD%ED%8A%B8%20-%20%EC%9D%B8%ED%8C%8D3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //색상 우선순위
    const COLOR_PRIORITY = [
        'rgb(124, 104, 238)', // 흰색
        'rgb(28, 168, 20)', // 반투명 흰색
        'rgb(23, 179, 255)', // 투명 흰색
        'rgb(251, 126, 78)', // 투명 흰색
    ]

    // 색상 비교 함수 추가
    function compareColors(color1, color2, tolerance = 10) {
        // RGB 값 추출
        const rgb1 = extractRGB(color1);
        const rgb2 = extractRGB(color2);

        if (!rgb1 || !rgb2) return false;

        // 각 RGB 채널의 차이가 허용 오차 이내인지 확인
        return Math.abs(rgb1.r - rgb2.r) <= tolerance &&
               Math.abs(rgb1.g - rgb2.g) <= tolerance &&
               Math.abs(rgb1.b - rgb2.b) <= tolerance;
    }

    // RGB 문자열에서 R, G, B 값 추출
    function extractRGB(colorStr) {
        const rgbRegex = /rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i;
        const match = colorStr.match(rgbRegex);

        if (match) {
            return {
                r: parseInt(match[1], 10),
                g: parseInt(match[2], 10),
                b: parseInt(match[3], 10)
            };
        }

        return null;
    }

    // 좌석의 우선순위 점수 계산 (낮을수록 우선순위 높음)
    function getSeatPriorityScore(seat) {
        const fillColor = seat.getAttribute('fill') ||
                         window.getComputedStyle(seat).fill ||
                         seat.style.fill ||
                         '';

        // 색상이 없으면 가장 낮은 우선순위
        if (!fillColor) return Infinity;

        // COLOR_PRIORITY 배열에서 일치하는 색상의 인덱스 찾기
        for (let i = 0; i < COLOR_PRIORITY.length; i++) {
            if (compareColors(fillColor, COLOR_PRIORITY[i])) {
                return i; // 인덱스가 낮을수록 우선순위 높음
            }
        }

        // 일치하는 색상이 없으면 중간 우선순위
        return COLOR_PRIORITY.length;
    }

    const SEAT_AREA_SELECTOR = '[class*="SeatMap_seatGroup"]';
    const SEAT_SELECTOR = '[class*="SeatMap_seatSvg"]';
    const SEAT_DISABLED_SELECTOR = '[class*="SeatMap_disabled"]';
    const BTN_WRAP_SELECTOR = '[class*="InfoSelected_footer"]';
    const CONFIRM_BTN_SELECTOR = '[class*="InfoSelected_footer"] button';
    const HANDLE_F6_INTERVAL = 1500;
    const DELAY_TIME = 100;

    function findElementByClassContaining(container, classSubstring) {
        return container.querySelector(`[class*="${classSubstring}"]`);
    }

    function findElementsByClassContaining(container, classSubstring) {
        return Array.from(container.querySelectorAll(`[class*="${classSubstring}"]`));
    }

    let handleF6IntervalId = null;

    function applyGpuAcceleration(element) {
        if (element) {
            element.style.willChange = 'contents';
            element.style.transform = 'translate3d(0, 0, 0)';
            console.log(`${element.id || element.className}에 GPU 가속이 적용되었습니다.`);
        }
    }

    // SVG 요소에 클릭 이벤트를 발생시키는 함수 추가
    function triggerClickEvent(element) {
        if (!element) return;

        try {
            // 1. MouseEvent 방식 시도
            const clickEvent = new MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: true
            });
            element.dispatchEvent(clickEvent);
            console.log('MouseEvent 방식으로 클릭 이벤트 발생');
        } catch (e) {
            try {
                // 2. createEvent 방식 시도 (이전 브라우저 호환)
                const clickEvent = document.createEvent('MouseEvents');
                clickEvent.initEvent('click', true, true);
                element.dispatchEvent(clickEvent);
                console.log('createEvent 방식으로 클릭 이벤트 발생');
            } catch (e2) {
                console.error('클릭 이벤트 발생 실패:', e2);
            }
        }
    }

    function selectSeats(count) {
        console.log(`${count}개의 좌석을 선택합니다...`);

        const seatArea = document.querySelector(SEAT_AREA_SELECTOR);
        if (!seatArea) {
            console.log(`"${SEAT_AREA_SELECTOR}"에 해당하는 요소를 찾을 수 없습니다.`);
            return;
        }

        // SEAT_SELECTOR를 사용하여 좌석을 찾고, SEAT_DISABLED_SELECTOR가 아닌 것만 필터링
        let seats = Array.from(document.querySelectorAll(SEAT_SELECTOR))
            .filter(seat => !seat.closest(SEAT_DISABLED_SELECTOR));

        // 색상 우선순위에 따라 좌석 정렬
        seats.sort((a, b) => {
            const scoreA = getSeatPriorityScore(a);
            const scoreB = getSeatPriorityScore(b);
            return scoreA - scoreB; // 오름차순 정렬 (낮은 점수 = 높은 우선순위)
        });

        console.log(`총 ${seats.length}개의 좌석을 찾았습니다. 우선순위에 따라 정렬했습니다.`);

        if (seats.length > 0) {
            // 요청한 수만큼 좌석이 있는지 확인
            const availableCount = Math.min(count, seats.length);
            if (availableCount < count) {
                console.log(`요청한 ${count}개 좌석 중 ${availableCount}개만 선택 가능합니다.`);
            }

            // 우선순위가 높은 좌석부터 선택
            const selectedSeats = seats.slice(0, availableCount);
            selectedSeats.forEach((seat, index) => {
                const fillColor = seat.getAttribute('fill') || window.getComputedStyle(seat).fill || '';
                console.log(`${index+1}번째 좌석 선택 (색상: ${fillColor})`);
                triggerClickEvent(seat);
            });

            // 확인 버튼 클릭
            setTimeout(() => {
                const confirmBtn = document.querySelector(CONFIRM_BTN_SELECTOR);
                if (confirmBtn) {
                    confirmBtn.click();
                    console.log('좌석 선택 확인 버튼 클릭 완료!');
                } else {
                    console.log('좌석 선택 확인 버튼을 찾을 수 없습니다.');
                }
            }, DELAY_TIME); // 좌석 선택 후 버튼이 활성화될 시간을 주기 위해 약간의 지연 추가

            console.log(`${availableCount}개 좌석 선택 완료!`);
        } else {
            console.log('선택 가능한 좌석을 찾을 수 없습니다.');
        }
    }

    function handleF6() {
        if (handleF6IntervalId !== null) {
            console.log('이미 실행 중인 반복이 있습니다. 먼저 중지(F7)하세요.');
            return;
        }

        console.log(`F6 키가 눌렸습니다: 반복 주기 ${HANDLE_F6_INTERVAL}ms`);
        console.log('좌석 자동 선택 모드를 시작합니다. 좌석이 나타날 때까지 대기합니다...');

        handleF6IntervalId = setInterval(() => {
            // SEAT_SELECTOR를 사용하여 좌석을 찾고, SEAT_DISABLED_SELECTOR가 아닌 것만 필터링
            let seats = Array.from(document.querySelectorAll(SEAT_SELECTOR))
                .filter(seat => !seat.closest(SEAT_DISABLED_SELECTOR));

            // 좌석 수 로깅
            console.log(`현재 선택 가능한 좌석 수: ${seats.length}`);

            if (seats.length > 0) {
                // 색상 우선순위에 따라 좌석 정렬
                seats.sort((a, b) => {
                    const scoreA = getSeatPriorityScore(a);
                    const scoreB = getSeatPriorityScore(b);
                    return scoreA - scoreB; // 오름차순 정렬 (낮은 점수 = 높은 우선순위)
                });

                // 우선순위가 가장 높은 좌석 선택
                const bestSeat = seats[0];
                const fillColor = bestSeat.getAttribute('fill') || window.getComputedStyle(bestSeat).fill || '';
                console.log(`최우선 좌석 선택 (색상: ${fillColor})`);
                triggerClickEvent(bestSeat);

                // 확인 버튼 클릭
                setTimeout(() => {
                    const confirmBtn = document.querySelector(CONFIRM_BTN_SELECTOR);
                    if (confirmBtn) {
                        confirmBtn.click();
                        console.log('좌석 선택 확인 버튼 클릭 완료!');
                    } else {
                        console.log('좌석 선택 확인 버튼을 찾을 수 없습니다.');
                    }
                }, DELAY_TIME); // 좌석 선택 후 버튼이 활성화될 시간을 주기 위해 약간의 지연 추가

                console.log('좌석 선택 완료! 자동 선택 모드를 종료합니다.');

                clearInterval(handleF6IntervalId);
                handleF6IntervalId = null;
            } else {
                console.log('선택 가능한 좌석이 없습니다. 계속 대기 중...');
            }
        }, HANDLE_F6_INTERVAL);
    }

    function handleF7() {
        if (handleF6IntervalId !== null) {
            clearInterval(handleF6IntervalId);
            handleF6IntervalId = null;
            console.log('F6 반복이 중지되었습니다.');
        } else {
            console.log('현재 실행 중인 F6 반복이 없습니다.');
        }
    }

    window.addEventListener('DOMContentLoaded', () => {
        console.log('페이지가 완전히 로드되었습니다.');

        const seatBoxElement = document.getElementById('divSeatBox');
        const btnWrapElement = document.querySelector(BTN_WRAP_SELECTOR);

        applyGpuAcceleration(seatBoxElement);
        applyGpuAcceleration(btnWrapElement);

        console.log(`
            유저스크립트 사용법:
            - F1: 빈자리 두개 선택! (연속된 좌석)
            - F2: 빈자리 하나 선택!
            - F6: ${HANDLE_F6_INTERVAL}ms 간격으로 좌석 자동 선택!
            - F7: 자동 선택 중지
        `);

        window.addEventListener('keydown', event => {
            if (event.key === 'F1') {
                // F1 키를 누를 때 두 개의 좌석 선택
                selectSeats(2);
            } else if (event.key === 'F2') {
                // F2 키를 누를 때 한 개의 좌석 선택
                selectSeats(1);
            } else if (event.key === 'F6') {
                handleF6();
            } else if (event.key === 'F7') {
                handleF7();
            }
        });
    });
})();
