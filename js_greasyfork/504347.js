// ==UserScript==
// @name         둘크립트 - 인팍2
// @namespace    http://tampermonkey.net/
// @version      3.3
// @description  뿌잉
// @author       Your Name
// @match        *://poticket.interpark.com/Book/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/504347/%EB%91%98%ED%81%AC%EB%A6%BD%ED%8A%B8%20-%20%EC%9D%B8%ED%8C%8D2.user.js
// @updateURL https://update.greasyfork.org/scripts/504347/%EB%91%98%ED%81%AC%EB%A6%BD%ED%8A%B8%20-%20%EC%9D%B8%ED%8C%8D2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SEAT_IFRAME_ID = 'ifrmSeatDetail';
    const SEAT_SELECTOR = 'span[name="Seats"], img.stySeat';
    const BTN_WRAP_SELECTOR = '.btnWrap';
    const REFRESH_BTN_SELECTOR = '.fl_r a';
    const HANDLE_F6_INTERVAL = 1500;

    let handleF6IntervalId = null;

    function applyGpuAcceleration(element) {
        if (element) {
            // GPU 가속을 위한 스타일 한 번에 적용
            Object.assign(element.style, {
                willChange: 'contents',
                transform: 'translate3d(0, 0, 0)',
                backfaceVisibility: 'hidden'
            });
            console.log(`${element.id || element.className || 'Unknown element'}에 GPU 가속이 적용되었습니다.`);
        }
    }

    function selectSeats(count) {
        const iframe = document.getElementById(SEAT_IFRAME_ID);
        if (!iframe) {
            console.log(`id="${SEAT_IFRAME_ID}"를 가진 iframe을 찾을 수 없습니다.`);
            return;
        }

        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        const spans = Array.from(iframeDoc.querySelectorAll(SEAT_SELECTOR));

        if (spans.length > 0) {
            spans.slice(0, count).forEach(span => span.click());

            fnSelect();
            console.log(`${count}개 좌석 선택 완료: fnSelect 함수 호출됨!`);
        } else {
            console.log('iframe 내부에 name="Seats"를 가진 요소를 찾을 수 없습니다.');
        }
    }

    // 가운데/상단 우석 선택 함수 (F2용)
    function selectPrioritySeats(count) {
        const iframe = document.getElementById(SEAT_IFRAME_ID);
        if (!iframe) {
            console.log(`id="${SEAT_IFRAME_ID}"를 가진 iframe을 찾을 수 없습니다.`);
            return;
        }

        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        const spans = Array.from(iframeDoc.querySelectorAll(SEAT_SELECTOR));

        if (spans.length > 0) {
            console.time('좌석 선택 성능 측정');

            // 좌석 요소들의 위치 정보 수집 (한 번에 계산하여 재사용)
            const iframeRect = iframe.getBoundingClientRect();
            const centerX = iframeRect.width / 2;

            // 모든 DOM 측정을 한 번에 수행하여 레이아웃 리플로우 최소화
            const seatsWithPosition = spans.map(seat => {
                const rect = seat.getBoundingClientRect();
                return {
                    element: seat,
                    x: rect.left + rect.width / 2,
                    y: rect.top,
                    distanceFromCenter: Math.abs((rect.left + rect.width / 2) - centerX)
                };
            });

            // 좌석을 X 좌표에 따라 정렬 (왼쪽에서 오른쪽으로)
            const sortedByX = seatsWithPosition.sort((a, b) => a.x - b.x);

            // 중앙 좌표에 가장 가까운 좌석의 인덱스 찾기 (distanceFromCenter 속성 활용)
            let centerIndex = 0;
            let minDistance = Number.MAX_VALUE;

            for (let i = 0; i < sortedByX.length; i++) {
                if (sortedByX[i].distanceFromCenter < minDistance) {
                    minDistance = sortedByX[i].distanceFromCenter;
                    centerIndex = i;
                }
            }

            // 중앙 기준 좌측 10개, 우측 10개 범위 계산 (넓은 범위로 변경)
            const startIndex = Math.max(0, centerIndex - 10);
            const endIndex = Math.min(sortedByX.length - 1, centerIndex + 10);

            // 중앙 범위 내 좌석 추출 (한 번만 계산)
            const centerRangeSeats = sortedByX.slice(startIndex, endIndex + 1);

            // Y 좌표로 정렬된 전체 좌석 (한 번만 계산)
            const allSeatsSortedByY = [...seatsWithPosition].sort((a, b) => a.y - b.y);

            // 안전하게 인덱스 계산 (배열 범위를 벗어나지 않도록)
            const safeIndex = (idx) => Math.min(idx, allSeatsSortedByY.length - 1);

            // 각 Y 좌표 임계값을 미리 계산 (한 번만 계산)
            const yThresholds = {
                top10: allSeatsSortedByY.length > 0 ? allSeatsSortedByY[safeIndex(9)].y : 0,
                top20: allSeatsSortedByY.length > 0 ? allSeatsSortedByY[safeIndex(19)].y : 0,
                top30: allSeatsSortedByY.length > 0 ? allSeatsSortedByY[safeIndex(29)].y : 0,
                top40: allSeatsSortedByY.length > 0 ? allSeatsSortedByY[safeIndex(39)].y : 0,
                top50: allSeatsSortedByY.length > 0 ? allSeatsSortedByY[safeIndex(49)].y : 0
            };

            // 우선순위 배열을 필요할 때만 계산하는 함수 (지연 계산)
            const getPrioritySeats = (priorityLevel) => {
                switch(priorityLevel) {
                    case 1: // 중앙 범위 내에서 위에서부터 10칸 이내
                        return centerRangeSeats.filter(seat => seat.y <= yThresholds.top10)
                            .sort((a, b) => a.y - b.y);
                    case 2: // 중앙 범위 내에서 위에서부터 20칸 이내
                        return centerRangeSeats.filter(seat => seat.y <= yThresholds.top20)
                            .sort((a, b) => a.y - b.y);
                    case 3: // 중앙 범위 내에서 위에서부터 30칸 이내
                        return centerRangeSeats.filter(seat => seat.y <= yThresholds.top30)
                            .sort((a, b) => a.y - b.y);
                    case 4: // 중앙 범위 내에서 위에서부터 40칸 이내
                        return centerRangeSeats.filter(seat => seat.y <= yThresholds.top40)
                            .sort((a, b) => a.y - b.y);
                    case 5: // 중앙 범위 내에서 위에서부터 50칸 이내
                        return centerRangeSeats.filter(seat => seat.y <= yThresholds.top50)
                            .sort((a, b) => a.y - b.y);
                    default: // 전체 좌석에서 위에서부터 선택
                        return allSeatsSortedByY;
                }
            };

            // 우선순위에 따라 좌석 선택 (지연 계산 활용)
            let selectedSeats = [];
            let priorityLevel = 1;
            const priorityDescriptions = [
                '중앙 범위(좌우 10칸) 내에서 위에서부터 10칸 이내',
                '중앙 범위 내에서 위에서부터 20칸 이내',
                '중앙 범위 내에서 위에서부터 30칸 이내',
                '중앙 범위 내에서 위에서부터 40칸 이내',
                '중앙 범위 내에서 위에서부터 50칸 이내',
                '전체 좌석에서 위에서부터 선택'
            ];

            // 각 우선순위 레벨을 순차적으로 확인하며 좌석 선택
            while (priorityLevel <= 6) {
                const prioritySeats = getPrioritySeats(priorityLevel);

                if (prioritySeats.length > 0) {
                    selectedSeats = prioritySeats.slice(0, count);
                    console.log(`우선순위 ${priorityLevel}에서 좌석 선택: ${priorityDescriptions[priorityLevel - 1]}`);
                    break;
                }

                priorityLevel++;
            }

            // 선택된 좌석 클릭
            selectedSeats.forEach(seat => seat.element.click());

            fnSelect();
            console.log(`${count}개 좌석 선택 완료: fnSelect 함수 호출됨!`);
            console.timeEnd('좌석 선택 성능 측정');
        } else {
            console.log('iframe 내부에 name="Seats"를 가진 요소를 찾을 수 없습니다.');
        }
    }

    function handleF6() {
        if (handleF6IntervalId !== null) {
            console.log('이미 실행 중인 반복이 있습니다. 먼저 중지(F7)하세요.');
            return;
        }

        console.log(`F6 키가 눌렸습니다: 반복 주기 ${HANDLE_F6_INTERVAL}ms`);

        // 새로고침 버튼 미리 찾아두기
        const refreshBtn = document.querySelector(REFRESH_BTN_SELECTOR);
        if (!refreshBtn) {
            console.log('새로 고침 버튼을 찾을 수 없습니다!');
        }

        handleF6IntervalId = setInterval(() => {
            const iframe = document.getElementById(SEAT_IFRAME_ID);
            if (!iframe) {
                console.log(`id="${SEAT_IFRAME_ID}"를 가진 iframe을 찾을 수 없습니다.`);
                return;
            }

            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            const span = iframeDoc.querySelector(SEAT_SELECTOR);

            if (span) {
                span.click();
                fnSelect();
                console.log('좌석 선택 완료: fnSelect 함수 호출됨!');

                clearInterval(handleF6IntervalId);
                handleF6IntervalId = null;
            } else {
                console.log('자리가 없습니다! 새로 고침 시도 중...');
                if (refreshBtn) {
                    refreshBtn.click();
                    console.log('새로 고침!');
                } else {
                    console.log('새로 고침 버튼을 찾을 수 없습니다!');
                }
            }
        }, 200);
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
            - F1: 빈자리 하나 클릭!
            - F2: 중앙 범위 내 최상단 좌석 선택!
            - F6: 1500ms 간격으로 취켓!
            - F7: 취켓 중지
        `);

        window.addEventListener('keydown', event => {
            if (event.key === 'F1') {
                selectSeats(1);
            } else if (event.key === 'F2') {
                selectPrioritySeats(1);
            } else if (event.key === 'F6') {
                handleF6();
            } else if (event.key === 'F7') {
                handleF7();
            }
        });
    });
})();
