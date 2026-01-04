// ==UserScript==
// @name         SOOP - 매니저 채팅입력 방지용 스크립트
// @namespace    http://tampermonkey.net/
// @version      2024-10-15
// @description  SOOP에서 채팅창에 오입력을 방지하기 위해 잠금 해제를 요구합니다.
// @author       You
// @match        https://play.sooplive.co.kr/*/*
// @icon         https://res.sooplive.co.kr/afreeca.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531963/SOOP%20-%20%EB%A7%A4%EB%8B%88%EC%A0%80%20%EC%B1%84%ED%8C%85%EC%9E%85%EB%A0%A5%20%EB%B0%A9%EC%A7%80%EC%9A%A9%20%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/531963/SOOP%20-%20%EB%A7%A4%EB%8B%88%EC%A0%80%20%EC%B1%84%ED%8C%85%EC%9E%85%EB%A0%A5%20%EB%B0%A9%EC%A7%80%EC%9A%A9%20%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // "채팅입력" 문구가 동적으로 추가될 수 있으므로 MutationObserver로 DOM 변화를 감시
    const observeDOM = (callback) => {
        const observer = new MutationObserver(callback);
        observer.observe(document.body, { childList: true, subtree: true });
        return observer;
    };

    const initScript = () => {
        // 버튼 생성 및 스타일 설정
        const createUnlockButton = () => {
            const unlockButton = document.createElement('button');
            unlockButton.textContent = '잠금 해제'; // 기본 텍스트
            unlockButton.style.fontSize = '14px'; // 글씨 크기 설정
            unlockButton.style.padding = '5px 10px'; // 패딩 추가
            unlockButton.style.border = 'none'; // 기본 테두리 제거
            unlockButton.style.backgroundColor = '#007bff'; // 배경색 설정 (파란색)
            unlockButton.style.color = '#fff'; // 글씨 색상 설정
            unlockButton.style.borderRadius = '5px'; // 테두리 둥글게
            unlockButton.style.cursor = 'pointer'; // 마우스 커서 변경
            unlockButton.style.marginLeft = '10px'; // 좌측 여백 추가
            return unlockButton;
        };

        // 채팅 입력 박스 선택
        const chatInput = document.getElementById('write_area');

        // "채팅입력" 텍스트 선택
        let emptyChatText = document.getElementById('empty_chat');

        // 이모티콘 선택 버튼 선택
        const emojiButton = document.getElementById('btn_emo');

        // actionbox 클래스를 가진 div 선택
        const chatTitleDiv = document.querySelector('.chat_title h2');

        // 기본적으로 채팅 입력 비활성화 및 "채팅입력" 텍스트 숨기기
        let isLocked = true;

        // 입력 차단 함수
        function preventInput(event) {
            if (isLocked) {
                event.preventDefault();
                event.stopPropagation();
                return false;
            }
        }

        // 채팅 입력 박스에 이벤트 리스너 추가
        if (chatInput) {
            chatInput.addEventListener('keydown', preventInput);
            chatInput.addEventListener('keypress', preventInput);
            chatInput.addEventListener('paste', preventInput);
        } else {
            console.error('채팅 입력 박스를 찾을 수 없습니다.');
            return; // 채팅 입력 박스가 없으면 스크립트 종료
        }

        // 버튼 클릭 시 채팅 입력 활성화 및 비활성화, 그리고 "채팅입력" 글씨 보이기/숨기기
        const unlockButton = createUnlockButton();
        if (chatTitleDiv) {
            chatTitleDiv.appendChild(unlockButton); // 버튼을 chat_title 내부에 추가
        } else {
            console.error('채팅 제목 DIV를 찾을 수 없습니다.');
            return; // 채팅 제목 DIV가 없으면 스크립트 종료
        }

        unlockButton.addEventListener('click', () => {
            isLocked = !isLocked; // 잠금 상태 토글
            if (isLocked) {
                // 채팅 입력 비활성화
                chatInput.setAttribute('disabled', 'true');
                chatInput.style.pointerEvents = 'none';
                unlockButton.textContent = '잠금 해제';
                unlockButton.style.backgroundColor = '#007bff'; // 파란색으로 설정

                // 이모티콘 버튼 비활성화 (완전히 투명하게 처리)
                if (emojiButton) {
                    emojiButton.setAttribute('disabled', 'true'); // 이모티콘 버튼 비활성화
                    emojiButton.style.pointerEvents = 'none'; // 클릭 차단
                    emojiButton.style.opacity = '0'; // 버튼을 완전히 투명하게
                }

                // "채팅입력" 문구 숨기기
                if (emptyChatText) {
                    emptyChatText.style.display = 'none';
                }
            } else {
                // 채팅 입력 활성화
                chatInput.removeAttribute('disabled');
                chatInput.style.pointerEvents = 'auto';
                unlockButton.textContent = '잠금';
                unlockButton.style.backgroundColor = '#dc3545'; // 빨간색으로 설정

                // 이모티콘 버튼 활성화 (투명도 복원)
                if (emojiButton) {
                    emojiButton.removeAttribute('disabled'); // 이모티콘 버튼 활성화
                    emojiButton.style.pointerEvents = 'auto'; // 클릭 가능하게 변경
                    emojiButton.style.opacity = '1'; // 버튼 투명도 복구
                }

                // "채팅입력" 문구 보이기
                if (emptyChatText) {
                    emptyChatText.style.display = 'block';
                }
            }
        });

        // 초기 상태 설정 (페이지 로드 시)
        chatInput.setAttribute('disabled', 'true'); // 채팅 입력 비활성화
        chatInput.style.pointerEvents = 'none'; // 입력 이벤트 차단
        if (emptyChatText) {
            emptyChatText.style.display = 'none'; // 채팅입력 텍스트 숨기기
        }

        // 이모티콘 버튼 초기 비활성화 (완전히 투명)
        if (emojiButton) {
            emojiButton.setAttribute('disabled', 'true'); // 이모티콘 버튼 비활성화
            emojiButton.style.pointerEvents = 'none'; // 클릭 차단
            emojiButton.style.opacity = '0'; // 버튼을 완전히 투명하게
        }

        // DOM 변경을 감시하여 emptyChatText가 생성될 때 업데이트
        observeDOM(() => {
            const newEmptyChatText = document.getElementById('empty_chat');
            if (newEmptyChatText) {
                emptyChatText = newEmptyChatText;
                if (isLocked) {
                    emptyChatText.style.display = 'none'; // 잠금 상태일 때는 숨김
                }
            }
        });
    };

    // 페이지가 로드된 후 스크립트 실행
    window.addEventListener('load', initScript);
})();
