// ==UserScript==
// @name          크래커 팝업 야매수정
// @namespace
// @version       1.8
// @description   크래커 잔여 수치 및 채팅별 사용 가능 횟수와 사용량을 표시합니다.
// @match         https://crack.wrtn.ai/*
// @grant         GM_addStyle
// @license       MIT
// @namespace 
// @downloadURL https://update.greasyfork.org/scripts/539117/%ED%81%AC%EB%9E%98%EC%BB%A4%20%ED%8C%9D%EC%97%85%20%EC%95%BC%EB%A7%A4%EC%88%98%EC%A0%95.user.js
// @updateURL https://update.greasyfork.org/scripts/539117/%ED%81%AC%EB%9E%98%EC%BB%A4%20%ED%8C%9D%EC%97%85%20%EC%95%BC%EB%A7%A4%EC%88%98%EC%A0%95.meta.js
// ==/UserScript==

(function () {
    'use strict';
    console.log("[Wrtn Cracker Popup] 스크립트 시작됨!");

    const STORAGE_KEY = 'wrtnSuperchatBaseValue';
    // 팝업 위치 저장을 위한 새로운 키
    const POS_LEFT_KEY = 'wrtnSuperchatPopup_left';
    const POS_TOP_KEY = 'wrtnSuperchatPopup_top';

    const PRICES = {
        하이퍼챗: 175,
        슈퍼챗: 35,
        파워챗: 15
    };

    // ✅ 팝업 생성
    const popup = document.createElement('div');
    popup.id = 'wrtnSuperchatPopup';
    popup.innerHTML = `
        <div id="superchatTop">
            <div id="superchatIcon">💬</div>
            <div id="superchatValue">-</div>
            <button id="superchatReset">리셋</button>
            <div id="superchatUsage" style="color: red; margin-left: auto;">[사용량: -]</div>
        </div>
        <div id="superchatBreakdown"></div>
    `;
    document.body.appendChild(popup);

    // ✅ 스타일 정의
    GM_addStyle(`
        #wrtnSuperchatPopup {
            position: fixed;
            /* 기존 bottom, right 제거하고 left, top을 auto로 설정. 위치는 JS에서 제어 */
            left: auto;
            top: auto;
            background: #fff8e1;
            color: #333;
            border: 1px solid #f5c35c;
            border-radius: 12px;
            padding: 10px 16px;
            font-size: 15px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 8px;
            box-shadow: 0 6px 10px rgba(0,0,0,0.2);
            font-weight: bold;
            max-width: 300px;
            cursor: grab; /* 드래그 가능함을 나타내는 커서 */
        }
        #superchatTop {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        #wrtnSuperchatPopup svg {
            width: 20px;
            height: 20px;
        }
        #superchatReset {
            margin-left: auto;
            background: #f44336;
            color: white;
            border: none;
            border-radius: 6px;
            padding: 4px 8px;
            cursor: pointer;
            font-size: 13px;
        }
        #superchatBreakdown {
            font-size: 13px;
            line-height: 1.4;
        }
    `);

    // =======================================================
    // ✅ 팝업 드래그 기능 추가
    let isDragging = false;
    let offsetX, offsetY; // 마우스 클릭 위치와 팝업 좌상단 간의 오프셋

    // 팝업 초기 위치 설정 함수
    function setInitialPopupPosition() {
        const savedLeft = localStorage.getItem(POS_LEFT_KEY);
        const savedTop = localStorage.getItem(POS_TOP_KEY);

        // 팝업의 실제 크기를 가져옵니다 (렌더링 후)
        const popupWidth = popup.offsetWidth;
        const popupHeight = popup.offsetHeight;

        if (savedLeft !== null && savedTop !== null) {
            // 저장된 위치가 있다면 그 위치로 설정
            popup.style.left = savedLeft + 'px';
            popup.style.top = savedTop + 'px';
            console.log(`[Wrtn Cracker Popup] 팝업 위치 불러옴: left=${savedLeft}, top=${savedTop}`);
        } else {
            // 저장된 위치가 없으면 기본 위치 (오른쪽 하단) 계산하여 설정
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;

            const initialRight = 20; // 기존 CSS의 right 값
            const initialBottom = 180; // 기존 CSS의 bottom 값

            const calculatedLeft = windowWidth - popupWidth - initialRight;
            const calculatedTop = windowHeight - popupHeight - initialBottom;

            popup.style.left = calculatedLeft + 'px';
            popup.style.top = calculatedTop + 'px';
            console.log("[Wrtn Cracker Popup] 초기 팝업 위치 설정됨 (저장된 위치 없음).");
        }
    }

    // 마우스 누를 때 (드래그 시작)
    popup.addEventListener('mousedown', (e) => {
        // 왼쪽 마우스 버튼만 반응
        if (e.button !== 0) return;

        // 드래그 중 텍스트 선택 방지
        e.preventDefault();

        isDragging = true;
        // 마우스 클릭 위치와 팝업의 좌상단 모서리 간의 오프셋 계산
        const rect = popup.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;

        // 마우스가 팝업 밖으로 나가더라도 드래그가 유지되도록 document에 이벤트 리스너 추가
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);

        popup.style.cursor = 'grabbing'; // 드래그 중임을 나타내는 커서
    });

    // 마우스 이동 중 (드래그)
    function onMouseMove(e) {
        if (!isDragging) return;

        // 새로운 팝업 위치 계산
        let newLeft = e.clientX - offsetX;
        let newTop = e.clientY - offsetY;

        // 팝업이 화면 밖으로 나가지 않도록 경계 설정 (선택 사항이지만 좋은 UX)
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const popupWidth = popup.offsetWidth;
        const popupHeight = popup.offsetHeight;

        if (newLeft < 0) newLeft = 0;
        if (newTop < 0) newTop = 0;
        if (newLeft + popupWidth > windowWidth) newLeft = windowWidth - popupWidth;
        if (newTop + popupHeight > windowHeight) newTop = windowHeight - popupHeight;

        popup.style.left = newLeft + 'px';
        popup.style.top = newTop + 'px';
    }

    // 마우스 떼기 (드래그 종료)
    function onMouseUp() {
        if (!isDragging) return;

        isDragging = false;
        // document에 추가했던 이벤트 리스너 제거 (메모리 누수 방지)
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);

        // 최종 팝업 위치를 localStorage에 저장
        localStorage.setItem(POS_LEFT_KEY, popup.offsetLeft);
        localStorage.setItem(POS_TOP_KEY, popup.offsetTop);
        console.log(`[Wrtn Cracker Popup] 팝업 위치 저장됨: left=${popup.offsetLeft}, top=${popup.offsetTop}`);

        popup.style.cursor = 'grab'; // 커서 원상 복구
    }
    // =======================================================


    // ✅ 크래커 정보 추출 함수 (동적 클래스 대응)
    function getSuperchatInfo() {
        let crackerContainer = null;
        let iconSvg = null;
        let numberElement = null;

        const allPElements = document.querySelectorAll('p');
        let myCrackerHeader = null;
        for (const p of allPElements) {
            if (p.textContent.trim() === '나의 크래커' && p.getAttribute('color') === 'text_tertiary') {
                myCrackerHeader = p;
                break;
            }
        }

        if (!myCrackerHeader) {
            // console.log("[Wrtn Cracker Popup] '나의 크래커' 텍스트를 가진 p 요소를 찾을 수 없습니다. (혹은 color 속성 불일치)"); // 너무 자주 뜨므로 주석 처리
            return null;
        }

        const parentOfHeader = myCrackerHeader.closest('div[display="flex"]');

        if (!parentOfHeader) {
            // console.log("[Wrtn Cracker Popup] '나의 크래커' 헤더의 부모 컨테이너(div[display=\"flex\"])를 찾을 수 없습니다."); // 너무 자주 뜨므로 주석 처리
            return null;
        }

        const potentialCrackerValueContainers = parentOfHeader.querySelectorAll('div[display="flex"]');

        for (const container of potentialCrackerValueContainers) {
            const svg = container.querySelector('svg');
            const numberP = container.querySelector('p[color="text_primary"]');

            if (svg && numberP) {
                crackerContainer = container;
                iconSvg = svg;
                numberElement = numberP;
                break;
            }
        }

        if (!crackerContainer || !iconSvg || !numberElement) {
            // console.log("[Wrtn Cracker Popup] 크래커 숫자/아이콘 컨테이너 또는 최종 요소들을 찾을 수 없습니다."); // 너무 자주 뜨므로 주석 처리
            return null;
        }

        const numberText = numberElement.textContent?.trim();
        const number = parseInt(numberText?.replace(/[^0-9]/g, '') || '0', 10);

        // console.log("[Wrtn Cracker Popup] 최종 찾은 크래커 숫자:", number); // 너무 자주 뜨므로 주석 처리

        return { iconSvg, number };
    }

    // ✅ 팝업 업데이트 함수
    function updatePopup() {
        const info = getSuperchatInfo();
        if (!info) {
            document.getElementById('superchatIcon').innerHTML = '❓';
            document.getElementById('superchatValue').textContent = '찾을 수 없음';
            document.getElementById('superchatUsage').textContent = '[사용량: -]';
            document.getElementById('superchatBreakdown').innerHTML = '크래커 정보를 찾을 수 없습니다.<br>버튼 클릭 후 잠시 기다려주세요.';
            return;
        }

        const iconContainer = document.getElementById('superchatIcon');
        const valueContainer = document.getElementById('superchatValue');
        const usageContainer = document.getElementById('superchatUsage');
        const breakdownContainer = document.getElementById('superchatBreakdown');

        if (info.iconSvg) {
            const clonedIcon = info.iconSvg.cloneNode(true);
            iconContainer.innerHTML = '';
            iconContainer.appendChild(clonedIcon);
        } else {
            iconContainer.innerHTML = '💬';
        }

        valueContainer.textContent = info.number;

        let baseValue = parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);

        if (baseValue === 0 && info.number > 0) {
            localStorage.setItem(STORAGE_KEY, info.number.toString());
            baseValue = info.number;
            console.log("[Wrtn Cracker Popup] 로컬 스토리지에 초기 크래커 값 설정됨:", info.number);
        }

        if (info.number === 0 && baseValue === 0) {
            // console.log("[Wrtn Cracker Popup] 유효한 크래커 값을 기다리는 중..."); // 너무 자주 뜨므로 주석 처리
            usageContainer.textContent = '[사용량: -]';
            breakdownContainer.innerHTML = '로딩 중...';
            return;
        }

        const diff = baseValue - info.number;
        usageContainer.textContent = `[사용량: ${diff}]`;

        const lines = [];
        for (const [label, cost] of Object.entries(PRICES)) {
            const available = Math.floor(info.number / cost);
            const used = Math.floor(diff / cost);
            lines.push(`${label}: ${available}회 가능 | 사용 ${used}회`);
        }
        breakdownContainer.innerHTML = lines.join('<br>');
    }

    // ✅ 리셋 버튼
    document.getElementById('superchatReset').addEventListener('click', () => {
        const current = parseInt(document.getElementById('superchatValue').textContent || '0', 10);
        if (current > 0) {
            localStorage.setItem(STORAGE_KEY, current.toString());
            updatePopup();
            console.log("[Wrtn Cracker Popup] 크래커 값 리셋됨.");
        } else {
            console.log("[Wrtn Cracker Popup] 유효한 크래커 값이 없어서 리셋할 수 없습니다.");
        }
    });

    // ✅ 정기 검사 (1초 간격)
    setInterval(updatePopup, 1000);
    console.log("[Wrtn Cracker Popup] 1초 간격 업데이트 시작.");

    // 페이지 로드 시 초기 업데이트 시도 및 팝업 위치 설정
    updatePopup();
    // 팝업이 DOM에 추가되고 CSS가 적용된 후 위치를 설정하기 위해 약간의 지연을 줍니다.
    setTimeout(() => {
        setInitialPopupPosition();
    }, 100);

})();