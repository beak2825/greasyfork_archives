// ==UserScript==
// @name        CAELUM 자동사냥 3.0
// @namespace   http://tampermonkey.net/
// @version     3.1
// @description 500ms 간격으로 금지 텍스트 감지 시 중지, 특수 버튼 및 일반 버튼 클릭. 렌더링 중 새로고침. 특수 문자 포함 버튼 지원. UI 숨김/표시 및 입력창 크기 조절 가능.
// @author      Grok
// @match       https://caelum-online.netlify.app/*
// @grant       none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/545997/CAELUM%20%EC%9E%90%EB%8F%99%EC%82%AC%EB%83%A5%2030.user.js
// @updateURL https://update.greasyfork.org/scripts/545997/CAELUM%20%EC%9E%90%EB%8F%99%EC%82%AC%EB%83%A5%2030.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isUISetup = false;
    let toggleButton = null;
    let hideUIToggleButton = null;
    let prohibitedTextField = null;
    let specialConditionField = null;
    let specialButtonField = null;
    let normalButtonField = null;
    let uiContainer = null;
    let hideButtonContainer = null;
    let isAutoClicking = false; // 초기값 OFF
    let isUIVisible = true; // UI 표시 여부
    let clickInterval = null;
    let priorityTexts = ['확인', '안개 낀 평원', '대나무 숲', '수정 호수', '황금 신전', '은하수 강가', '은하수 동굴', '귀인의 폭포', '황금 미궁', '은하수의 심연', '망자의 미궁', '전투 시작', '입장', '다음'];

    // 버튼 찾기 함수 (특수 문자 무시)
    function findButtonByText(targetText) {
        const clickableElements = document.querySelectorAll('button, div.cursor-pointer');
        const textArray = targetText.split('\n').map(text => text.trim()).filter(text => text);

        console.log(`버튼 검색 중: ${textArray.join(', ')}`);
        for (const text of textArray) {
            const cleanText = text.replace(/[^\w\s가-힣]/g, ''); // 특수 문자 제거
            for (const element of clickableElements) {
                if (element === toggleButton || element === hideUIToggleButton) continue; // 토글 버튼 제외
                const elementText = element.textContent.trim();
                const cleanElementText = elementText.replace(/[^\w\s가-힣]/g, ''); // 버튼 텍스트에서도 특수 문자 제거
                if (cleanElementText && cleanElementText.includes(cleanText)) {
                    if (element.disabled) {
                        console.log(`버튼 비활성화됨: ${elementText}`);
                        continue;
                    }
                    console.log(`버튼 발견: ${elementText}`);
                    return element;
                }
            }
        }
        return null;
    }

    // 텍스트 감지 함수
    function hasText(targetText) {
        const textArray = targetText.split('\n').map(text => text.trim()).filter(text => text);
        if (textArray.length === 0) return false;

        const allText = document.body.textContent;
        for (const text of textArray) {
            if (allText.includes(text)) {
                console.log(`텍스트 감지됨: ${text}`);
                return true;
            }
        }
        return false;
    }

    // UI 설정 함수
    function setupAutoClick() {
        if (isUISetup) return;

        // 숨김 버튼 컨테이너 생성
        hideButtonContainer = document.createElement('div');
        hideButtonContainer.style.position = 'fixed';
        hideButtonContainer.style.left = '10px';
        hideButtonContainer.style.top = '10px';
        hideButtonContainer.style.zIndex = '10000';
        document.body.appendChild(hideButtonContainer);

        // UI 컨테이너 생성
        uiContainer = document.createElement('div');
        uiContainer.style.position = 'fixed';
        uiContainer.style.left = '10px';
        uiContainer.style.top = '50px'; // 숨김 버튼 아래로 이동
        uiContainer.style.zIndex = '9999';
        uiContainer.style.display = 'flex';
        uiContainer.style.flexDirection = 'column';
        uiContainer.style.gap = '10px';
        uiContainer.style.backgroundColor = 'rgba(45, 45, 45, 0.9)'; // 약간 투명
        uiContainer.style.padding = '10px';
        uiContainer.style.borderRadius = '8px';
        document.body.appendChild(uiContainer);

        // ON/OFF 토글 버튼
        toggleButton = document.createElement('button');
        toggleButton.textContent = '자동 클릭 OFF';
        toggleButton.className = 'bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded font-semibold shadow';
        uiContainer.appendChild(toggleButton);

        // UI 숨김/표시 토글 버튼
        hideUIToggleButton = document.createElement('button');
        hideUIToggleButton.textContent = 'UI 숨기기';
        hideUIToggleButton.className = 'bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded font-semibold shadow';
        hideButtonContainer.appendChild(hideUIToggleButton);

        // 금지 텍스트 입력
        const prohibitedTextLabel = document.createElement('label');
        prohibitedTextLabel.textContent = '금지 텍스트:';
        prohibitedTextLabel.style.color = '#fff';
        prohibitedTextLabel.style.fontSize = '12px';
        uiContainer.appendChild(prohibitedTextLabel);
        prohibitedTextField = document.createElement('textarea');
        prohibitedTextField.placeholder = '클릭을 멈출 텍스트 입력 (엔터로 구분)';
        prohibitedTextField.className = 'px-4 py-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 bg-gray-800 text-white placeholder-gray-400';
        prohibitedTextField.style.width = '200px';
        prohibitedTextField.style.height = '50px';
        prohibitedTextField.style.resize = 'both';
        prohibitedTextField.style.minWidth = '150px';
        prohibitedTextField.style.minHeight = '40px';
        uiContainer.appendChild(prohibitedTextField);

        // 특수 버튼 조건 입력
        const specialConditionLabel = document.createElement('label');
        specialConditionLabel.textContent = '특수 버튼 조건:';
        specialConditionLabel.style.color = '#fff';
        specialConditionLabel.style.fontSize = '12px';
        uiContainer.appendChild(specialConditionLabel);
        specialConditionField = document.createElement('textarea');
        specialConditionField.placeholder = '특수 버튼을 누를 조건 텍스트';
        specialConditionField.className = 'px-4 py-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 bg-gray-800 text-white placeholder-gray-400';
        specialConditionField.style.width = '200px';
        specialConditionField.style.height = '50px';
        specialConditionField.style.resize = 'both';
        specialConditionField.style.minWidth = '150px';
        specialConditionField.style.minHeight = '40px';
        specialConditionField.value = '던전 클리어';
        uiContainer.appendChild(specialConditionField);

        // 특수 버튼 입력
        const specialButtonLabel = document.createElement('label');
        specialButtonLabel.textContent = '특수 버튼:';
        specialButtonLabel.style.color = '#fff';
        specialButtonLabel.style.fontSize = '12px';
        uiContainer.appendChild(specialButtonLabel);
        specialButtonField = document.createElement('textarea');
        specialButtonField.placeholder = '특수 버튼 텍스트';
        specialButtonField.className = 'px-4 py-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 bg-gray-800 text-white placeholder-gray-400';
        specialButtonField.style.width = '200px';
        specialButtonField.style.height = '50px';
        specialButtonField.style.resize = 'both';
        specialButtonField.style.minWidth = '150px';
        specialButtonField.style.minHeight = '40px';
        specialButtonField.value = '나가기';
        uiContainer.appendChild(specialButtonField);

        // 일반 버튼 입력
        const normalButtonLabel = document.createElement('label');
        normalButtonLabel.textContent = '일반 버튼:';
        normalButtonLabel.style.color = '#fff';
        normalButtonLabel.style.fontSize = '12px';
        uiContainer.appendChild(normalButtonLabel);
        normalButtonField = document.createElement('textarea');
        normalButtonField.placeholder = '자동 클릭할 버튼 텍스트 (엔터로 구분)';
        normalButtonField.className = 'px-4 py-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 bg-gray-800 text-white placeholder-gray-400';
        normalButtonField.style.width = '200px';
        normalButtonField.style.height = '350px';
        normalButtonField.style.resize = 'both';
        normalButtonField.style.minWidth = '150px';
        normalButtonField.style.minHeight = '100px';
        normalButtonField.value = priorityTexts.join('\n');
        uiContainer.appendChild(normalButtonField);

        // UI 생성 완료
        isUISetup = true;

        // 일반 버튼 입력 업데이트
        normalButtonField.addEventListener('input', () => {
            const inputValue = normalButtonField.value.trim();
            priorityTexts = inputValue ? inputValue.split('\n').map(text => text.trim()).filter(text => text) : [];
            console.log(`일반 버튼 목록 업데이트: ${priorityTexts.join(', ')}`);
        });

        // UI 숨김/표시 토글 이벤트
        hideUIToggleButton.addEventListener('click', () => {
            isUIVisible = !isUIVisible;
            uiContainer.style.display = isUIVisible ? 'flex' : 'none';
            hideUIToggleButton.textContent = isUIVisible ? 'UI 숨기기' : 'UI 표시';
            console.log(`UI ${isUIVisible ? '표시' : '숨김'}`);
        });

        // 자동 클릭 로직
        const startAutoClick = () => {
            if (clickInterval !== null) {
                clearInterval(clickInterval);
                clickInterval = null;
            }

            clickInterval = setInterval(() => {
                if (!isAutoClicking) {
                    console.log('자동 클릭 OFF 상태, 동작 중지');
                    return;
                }

                // 디버깅: 버튼 수 확인
                const buttons = document.querySelectorAll('button, div.cursor-pointer');
                console.log(`검색된 버튼 수: ${buttons.length}`);

                // "렌더링 중" 체크
                if (document.body.textContent.includes('렌더링 중')) {
                    console.log('렌더링 중 감지, 페이지 새로고침');
                    location.reload();
                    return;
                }

                // 금지 텍스트 체크
                if (hasText(prohibitedTextField.value)) {
                    console.log('금지 텍스트 감지:', prohibitedTextField.value);
                    return;
                }

                // 특수 버튼 조건 체크
                if (hasText(specialConditionField.value)) {
                    console.log('특수 버튼 조건 감지:', specialConditionField.value);
                    const specialButton = findButtonByText(specialButtonField.value);
                    if (specialButton) {
                        console.log(`[특수 버튼] ${specialButton.textContent} 클릭`);
                        specialButton.click();
                    } else {
                        console.log('특수 버튼을 찾을 수 없음:', specialButtonField.value);
                    }
                } else {
                    // 일반 버튼 클릭
                    console.log('일반 버튼 검색 시도:', normalButtonField.value);
                    const normalButton = findButtonByText(normalButtonField.value);
                    if (normalButton) {
                        console.log(`[일반 버튼] ${normalButton.textContent} 클릭`);
                        normalButton.click();
                    } else {
                        console.log('일반 버튼을 찾을 수 없음:', normalButtonField.value);
                    }
                }
            }, 500); // 500ms 간격
        };

        // 토글 버튼 이벤트
        toggleButton.addEventListener('click', () => {
            if (isAutoClicking) {
                // OFF로 전환
                isAutoClicking = false;
                toggleButton.textContent = '자동 클릭 OFF';
                toggleButton.className = 'bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded font-semibold shadow';
                console.log('자동 클릭 중지');
                if (clickInterval !== null) {
                    clearInterval(clickInterval);
                    clickInterval = null;
                }
            } else {
                // ON으로 전환
                isAutoClicking = true;
                toggleButton.textContent = '자동 클릭 ON';
                toggleButton.className = 'bg-red-800 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold shadow';
                console.log('자동 클릭 시작');
                startAutoClick();
            }
        });
    }

    // 초기화
    const initialize = () => {
        if (!isUISetup) {
            setupAutoClick();
        }
    };

    // 페이지 로드 시 실행
    initialize();

    // 페이지 변화 감지
    const observer = new MutationObserver(() => {
        if (!isUISetup) {
            setupAutoClick();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();