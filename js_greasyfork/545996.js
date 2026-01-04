// ==UserScript==
// @name          CAELUM 인벤토리 CSV 내보내기 (v16.9)
// @namespace     http://tampermonkey.net/
// @version       16.91
// @description   인벤토리 아이템 정보를 추출하여 CSV로 내보냅니다 (HTML 변경 대응, 요청 형식 반영)
// @author        Grok (수정: Gemini)
// @match         https://caelum-online.netlify.app/*
// @grant         none
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/545996/CAELUM%20%EC%9D%B8%EB%B2%A4%ED%86%A0%EB%A6%AC%20CSV%20%EB%82%B4%EB%B3%B4%EB%82%B4%EA%B8%B0%20%28v169%29.user.js
// @updateURL https://update.greasyfork.org/scripts/545996/CAELUM%20%EC%9D%B8%EB%B2%A4%ED%86%A0%EB%A6%AC%20CSV%20%EB%82%B4%EB%B3%B4%EB%82%B4%EA%B8%B0%20%28v169%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 메시지 표시 함수 (alert 대체)
    // 사용자에게 스크립트의 진행 상황이나 오류를 시각적으로 알립니다.
    function showMessage(text, type = 'info') {
        let messageBox = document.getElementById('inventory-script-message-box');
        if (!messageBox) {
            messageBox = document.createElement('div');
            messageBox.id = 'inventory-script-message-box';
            // 메시지 박스의 스타일을 설정합니다.
            Object.assign(messageBox.style, {
                position: 'fixed',
                top: '10px',
                left: '50%',
                transform: 'translateX(-50%)',
                padding: '12px 20px',
                borderRadius: '8px',
                color: 'white',
                zIndex: '10000', // 다른 요소 위에 표시되도록 높은 z-index 설정
                fontSize: '14px',
                textAlign: 'center',
                boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                transition: 'opacity 0.3s ease-in-out', // 부드러운 애니메이션
                opacity: '0' // 초기에는 숨김
            });
            document.body.appendChild(messageBox);
        }

        // 메시지 타입에 따른 배경색 설정
        let backgroundColor = '#333'; // 기본 정보 메시지
        if (type === 'error') {
            backgroundColor = '#dc3545'; // 오류 메시지 (빨간색)
        } else if (type === 'success') {
            backgroundColor = '#28a745'; // 성공 메시지 (녹색)
        }

        messageBox.textContent = text;
        messageBox.style.backgroundColor = backgroundColor;
        messageBox.style.opacity = '1'; // 메시지 표시

        // 3초 후 메시지 숨김
        clearTimeout(messageBox.hideTimer); // 이전 타이머가 있다면 초기화
        messageBox.hideTimer = setTimeout(() => {
            messageBox.style.opacity = '0'; // 부드럽게 숨김
        }, 3000);
    }

    // 지연 함수 (비동기 처리용)
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    /**
     * 아이템 요소에 마우스 오버 이벤트를 트리거하고 툴팁에서 데이터를 추출합니다.
     * 웹페이지 HTML 구조가 변경될 경우, 이 함수의 CSS 셀렉터를 수정해야 할 수 있습니다.
     *
     * @param {Element} itemElement - 개별 아이템을 나타내는 DOM 요소.
     * @returns {Object} 추출된 아이템 상세 정보.
     */
    async function getItemDetails(itemElement) {
        // 기본값 설정
        let details = {
            아이템이름: '알 수 없음',
            부위: '알 수 없음', // 아이템 종류
            속성: '없음',
            공격력: '없음',
            무게: '없음',
            희귀도: '없음', // 아이템 등급
            내구도: '없음',
            세트: '없음'
        };

        try {
            // 마우스 오버 이벤트 트리거: 툴팁을 표시하기 위해 필요합니다.
            const mouseoverEvent = new MouseEvent('mouseover', { bubbles: true });
            const mouseoutEvent = new MouseEvent('mouseout', { bubbles: true });
            itemElement.dispatchEvent(mouseoverEvent);

            // 툴팁이 나타날 때까지 충분히 대기합니다.
            // 만약 툴팁이 제대로 감지되지 않는다면, 이 값을 150ms 이상으로 늘려보세요. (예: 200ms, 300ms)
            await delay(10);

            // 툴팁 요소 찾기 (이전과 동일한 셀렉터)
            const tooltip = document.querySelector('.w-64.bg-black.bg-opacity-90.text-white.rounded-lg.p-3.shadow-lg, .w-64.bg-black, [role="tooltip"], .item-tooltip-container, div[data-tooltip-id]');
            if (tooltip) {
                // ***** 주요 변경 사항: 툴팁에서 아이템 이름 및 부위 추출 *****
                // image_58a366.png 분석 결과 반영
                const nameSpan = tooltip.querySelector('span.text-base.sm\\:text-lg.font-extrabold.text-emerald-200.drop-shadow.truncate');
                if (nameSpan) {
                    let nameText = nameSpan.textContent.trim();
                    // 이름에서 "(봉인됨)" 제거 (필요없는 정보)
                    details.아이템이름 = nameText.replace('(봉인됨)', '').trim();
                }

                const typeSpan = tooltip.querySelector('span.text-\\[11px\\].font-medium.bg-white\\/10.backdrop-blur-sm.rounded.px-1\\.5.py-0\\.5.text-gray-200.ring-1.ring-white\\/15.whitespace-nowrap');
                if (typeSpan) {
                    details.부위 = typeSpan.textContent.trim();
                }

                // 툴팁 내부의 grid 요소에서 데이터 추출 (기존 로직 유지)
                const gridItems = tooltip.querySelectorAll('.grid.grid-cols-2 > div');
                const gridData = Array.from(gridItems).map(item => item.textContent.trim());

                for (let i = 0; i < gridData.length; i += 2) {
                    const key = gridData[i].replace(/🛡️|🌀|⚔️|⚖️|📦/g, '').trim(); // 이모티콘 제거
                    let value = gridData[i + 1].trim();

                    if (key.includes('속성')) {
                        value = value.replace(/💧/g, '').trim(); // 특정 이모티콘 제거
                        details.속성 = value;
                    } else if (key.includes('등급')) {
                        details.희귀도 = value; // 아이템 등급
                    } else if (key.includes('위력')) {
                        details.공격력 = value;
                    } else if (key.includes('무게')) {
                        details.무게 = value;
                    } else if (key.includes('내구도')) { // 내구도도 툴팁의 grid에서 추출
                        details.내구도 = value;
                    } else if (key.includes('세트')) {
                        details.세트 = value;
                    }
                }
            } else {
                console.warn(`툴팁을 찾을 수 없음: ${details.아이템이름}. 툴팁 셀렉터를 확인하세요.`);
                showMessage(`"${details.아이템이름}" 아이템의 툴팁을 찾을 수 없습니다. (콘솔 확인)`, 'error');
            }

            // 마우스 아웃 이벤트 트리거: 툴팁을 숨깁니다.
            itemElement.dispatchEvent(mouseoutEvent);
        } catch (error) {
            console.error(`아이템 "${details.아이템이름}"의 정보 추출 중 오류:`, error);
            showMessage(`"${details.아이템이름}" 정보 추출 중 오류 발생! (콘솔 확인)`, 'error');
        }

        return details; // 업데이트된 details 객체 반환
    }

    // CSV로 변환
    function convertToCSV(items) {
        // 요청된 헤더 순서에 맞춰서 재정렬 및 이름 변경
        const headers = ['번호', '아이템 이름', '아이템 종류', '아이템의 등급', '아이템의 속성', '아이템의 위력', '아이템의 무게', '아이템의 내구도', '아이템의 세트'];

        const rows = items.map(item => {
            return headers.map(header => {
                let value = '';
                // 헤더에 맞춰 item 객체의 속성 매핑
                switch (header) {
                    case '번호':
                        value = item.번호;
                        break;
                    case '아이템 이름':
                        value = item.아이템이름;
                        break;
                    case '아이템 종류':
                        value = item.부위;
                        break;
                    case '아이템의 등급':
                        value = item.희귀도;
                        break;
                    case '아이템의 속성':
                        value = item.속성;
                        break;
                    case '아이템의 위력':
                        value = item.공격력;
                        break;
                    case '아이템의 무게':
                        value = item.무게;
                        break;
                    case '아이템의 내구도':
                        value = item.내구도;
                        break;
                    case '아이템의 세트':
                        value = item.세트;
                        break;
                    default:
                        value = '';
                }
                // CSV 형식에 맞게 큰따옴표 이스케이프 처리 (내용에 큰따옴표가 있을 경우)
                return `"${(value || '').toString().replace(/"/g, '""')}"`;
            }).join(',');
        });
        return [headers.join(','), ...rows].join('\n');
    }

    // CSV 다운로드
    function downloadCSV(csvContent) {
        const bom = '\uFEFF'; // UTF-8 BOM (한글 깨짐 방지)
        const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'inventory.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        showMessage('인벤토리 CSV가 성공적으로 다운로드되었습니다!', 'success');
    }

    // 메인 실행 함수
    async function exportInventory() {
        showMessage('인벤토리 정보를 추출 중입니다. 잠시 기다려 주세요...', 'info');
        const allItems = [];

        // 아이템 카드를 선택하는 셀렉터는 이전과 동일하게 유지됩니다.
        const itemElements = document.querySelectorAll('div.relative.cursor-pointer.select-none.w-full.h-16.flex.flex-col.justify-between.rounded-2xl.p-2\\.5.bg-white\\/5.hover\\:bg-white\\/10.backdrop-blur-md.ring-1.ring-white\\/10.shadow-md.transition');

        if (itemElements.length === 0) {
            showMessage('페이지에서 아이템을 찾을 수 없습니다. 아이템 요소 셀렉터가 변경되었을 수 있습니다.', 'error');
            return;
        }

        let itemIndex = 1;
        for (const item of itemElements) {
            const itemDetails = await getItemDetails(item);
            if (itemDetails) {
                itemDetails.번호 = itemIndex++;
                allItems.push(itemDetails);
                await delay(10);
            }
        }

        if (allItems.length === 0) {
            showMessage('추출된 아이템이 없습니다. 스크립트 실행에 문제가 발생했을 수 있습니다.', 'error');
            return;
        }

        const csv = convertToCSV(allItems);
        downloadCSV(csv);
    }

    // CSV 내보내기 버튼 생성 및 페이지에 추가
    const exportButton = document.createElement('button');
    exportButton.textContent = '인벤토리 CSV 내보내기';
    Object.assign(exportButton.style, {
        position: 'fixed',
        top: '10px',
        right: '10px',
        zIndex: '9999',
        padding: '12px 20px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: 'bold',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        transition: 'background-color 0.2s ease, transform 0.2s ease'
    });
    exportButton.onmouseover = () => exportButton.style.backgroundColor = '#45a049';
    exportButton.onmouseout = () => exportButton.style.backgroundColor = '#4CAF50';
    exportButton.onclick = exportInventory;
    document.body.appendChild(exportButton);
})();
