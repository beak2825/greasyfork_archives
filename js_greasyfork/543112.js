// ==UserScript==
// @name         아이템 감정 백분율 표시
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  아이템의 감정된 위력/무게가 감정 범위 내에서 하위 몇 %인지 표시합니다.
// @author       Your Name
// @match        https://lanis.me/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/543112/%EC%95%84%EC%9D%B4%ED%85%9C%20%EA%B0%90%EC%A0%95%20%EB%B0%B1%EB%B6%84%EC%9C%A8%20%ED%91%9C%EC%8B%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/543112/%EC%95%84%EC%9D%B4%ED%85%9C%20%EA%B0%90%EC%A0%95%20%EB%B0%B1%EB%B6%84%EC%9C%A8%20%ED%91%9C%EC%8B%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 텍스트를 파싱하여 현재 값, 최소, 최대 범위를 추출하는 함수
    function parseStatText(text) {
        const regex = /(-?\d+)\s*\((-?\d+)\s*~\s*(-?\d+)\)/;
        const match = text.match(regex);
        if (match && match.length === 4) {
            const currentValue = parseFloat(match[1]);
            const minRange = parseFloat(match[2]);
            const maxRange = parseFloat(match[3]);
            return { currentValue, minRange, maxRange };
        }
        return null;
    }

    // 백분율을 계산하는 함수 (mode: 'normal' 또는 'inverted')
    // 'normal': min=0%, max=100% (위력)
    // 'inverted': min=100%, max=0% (무게)
    function calculatePercentage(currentValue, minRange, maxRange, mode = 'normal') {
        if (minRange === maxRange) {
            return 100; // 범위가 동일하면 100% (이 경우 의미상 100%가 가장 좋다고 가정)
        }

        const range = maxRange - minRange;
        let percentage;

        if (mode === 'inverted') { // 무게의 경우 (낮은 값이 좋은, 즉 최소값이 100%, 최대값이 0%)
            percentage = ((maxRange - currentValue) / range) * 100;
        } else { // mode === 'normal' (위력의 경우: 높은 값이 좋은, 즉 최소값이 0%, 최대값이 100%)
            percentage = ((currentValue - minRange) / range) * 100;
        }

        // 0% 미만 또는 100% 초과하는 값은 clamp (범위를 벗어나는 경우 대비)
        if (percentage < 0) percentage = 0;
        if (percentage > 100) percentage = 100;
        return percentage;
    }

    // 페이지를 스캔하고 백분율을 추가하는 함수
    function addPercentageToElements() {
        // MuiBox-root css-gg4vpm 안에 있는 p 태그들을 찾습니다.
        const statBlocks = document.querySelectorAll('div.MuiBox-root.css-gg4vpm');

        statBlocks.forEach(block => {
            // 각 statBlock 내에서 첫 번째 p 태그(스탯 이름)와 두 번째 p 태그(값)를 찾습니다.
            const nameElement = block.querySelector('p.MuiTypography-root.MuiTypography-body2.css-1xgulgv:first-child');
            const valueElement = block.querySelector('p.MuiTypography-root.MuiTypography-body2.css-1xgulgv:nth-child(2)'); // 두 번째 p 태그가 값

            if (nameElement && valueElement) {
                const statName = nameElement.textContent.trim(); // "위력", "무게" 등
                const currentValueElement = valueElement.firstChild; // "501" 또는 "64"
                const rangeSpanElement = valueElement.querySelector('span.MuiTypography-root.MuiTypography-body1.css-1m5hewm');

                if (currentValueElement && rangeSpanElement) {
                    const fullText = `${currentValueElement.textContent.trim()} ${rangeSpanElement.textContent.trim()}`;
                    const parsed = parseStatText(fullText);

                    if (parsed) {
                        const { currentValue, minRange, maxRange } = parsed;

                        let isWeight = (statName === '무게'); // statName이 '무게'이면 true

                        let percentage;
                        let percentageTextSuffix = '%'; // 기본값은 '%'로 설정

                        if (isWeight) {
                            percentage = calculatePercentage(currentValue, minRange, maxRange, 'inverted'); // 무게는 반전
                            // percentageTextSuffix는 기본값인 '%'를 유지하므로 변경할 필요 없음
                        } else {
                            percentage = calculatePercentage(currentValue, minRange, maxRange, 'normal'); // 위력 등은 일반
                            // percentageTextSuffix는 기본값인 '%'를 유지하므로 변경할 필요 없음
                        }


                        // 이미 백분율이 추가되었는지 확인하여 중복 추가 방지
                        if (!valueElement.querySelector('.item-percentage')) { // valueElement에 추가
                            const percentageSpan = document.createElement('span');
                            percentageSpan.className = 'item-percentage';
                            percentageSpan.style.marginLeft = '5px';
                            percentageSpan.style.fontWeight = 'bold';

                            // 백분율에 따른 색상 로직 적용 (높은 백분율이 좋은 값)
                            if (percentage >= 90) {
                                percentageSpan.style.color = 'rgba(220, 38, 38, 0.8)'; // 빨강 (90% 이상)
                            } else if (percentage >= 70) {
                                percentageSpan.style.color = 'rgba(168, 85, 247, 0.8)'; // 보라 (70% 이상)
                            } else if (percentage >= 50) {
                                percentageSpan.style.color = 'rgba(234, 179, 8, 0.8)'; // 노랑 (50% 이상)
                            } else if (percentage >= 30) {
                                percentageSpan.style.color = 'rgba(59, 130, 246, 0.8)'; // 파랑 (30% 이상)
                            } else {
                                percentageSpan.style.color = 'rgba(255, 255, 255, 0.7)'; // 회색 (30% 미만)
                            }

                            percentageSpan.textContent = ` (${percentage.toFixed(1)}${percentageTextSuffix})`;
                            valueElement.appendChild(percentageSpan); // 값 p 태그에 추가
                        }
                    }
                }
            }
        });
    }

    // DOMContentLoaded 이벤트 발생 시 한 번 실행
    window.addEventListener('DOMContentLoaded', addPercentageToElements);

    // 페이지 내용이 동적으로 로드될 수 있으므로 MutationObserver를 사용하여 변경 감지
    const observer = new MutationObserver(addPercentageToElements);
    observer.observe(document.body, { childList: true, subtree: true });

})();