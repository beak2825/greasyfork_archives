// ==UserScript==
// @name         CHZZK.Naver.com 해상도 설정 버튼 추가
// @namespace    https://chzzk.naver.com/
// @version      2.2
// @description  채널 이동 시 자동 버튼 생성, 해상도 메뉴가 자동으로 닫히도록 개선
// @match        *://chzzk.naver.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/521859/CHZZKNavercom%20%ED%95%B4%EC%83%81%EB%8F%84%20%EC%84%A4%EC%A0%95%20%EB%B2%84%ED%8A%BC%20%EC%B6%94%EA%B0%80.user.js
// @updateURL https://update.greasyfork.org/scripts/521859/CHZZKNavercom%20%ED%95%B4%EC%83%81%EB%8F%84%20%EC%84%A4%EC%A0%95%20%EB%B2%84%ED%8A%BC%20%EC%B6%94%EA%B0%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ------------------------------
    // 1) 해상도 설정 로직 함수
    // ------------------------------
    function setResolution() {
        // 1) 톱니바퀴(설정) 버튼 찾기
        const gearButton = document.querySelector(
            'button.pzp-button.pzp-setting-button.pzp-pc-setting-button.pzp-pc__setting-button'
        );
        if (!gearButton) {
            alert('플레이어 로딩 안 됨: 톱니바퀴 버튼을 찾지 못했습니다.');
            return;
        }

        // 2) 톱니바퀴 클릭 → 설정창 열기
        gearButton.click();

        // 메뉴가 뜨는 시간 기다린 뒤 진행
        setTimeout(() => {
            // 3) 1080p(원본) 또는 1080p 항목 찾기
            const qualityItems = document.querySelectorAll('li.pzp-ui-setting-quality-item');
            if (!qualityItems || qualityItems.length === 0) {
                // 목록 없으면 톱니바퀴 닫기만
                gearButton.click();
                alert('해상도 목록이 안 보여요. (플레이어 상태 확인)');
                return;
            }

            // 1080p(원본)부터 우선 찾기
            let bestOption = Array.from(qualityItems).find(li =>
                li.textContent.includes('1080p(원본)')
            );
            // 없으면 일반 1080p 찾기
            if (!bestOption) {
                bestOption = Array.from(qualityItems).find(li =>
                    li.textContent.includes('1080p')
                );
            }

            if (bestOption) {
                // 해상도 항목 클릭
                bestOption.click();

                // ★ 조그만 지연 후, body (혹은 플레이어 밖) 클릭 → 메뉴 닫기
                setTimeout(() => {
                    // 실제로 메뉴 밖을 클릭해야 닫히는 UI도 있음
                    // 아래처럼 body를 클릭해 보거나, 혹은 다른 영역(예: ".viewer_chat_panel") 등을 클릭
                    document.body.click();
                }, 300);

            } else {
                alert('1080p(원본) 또는 1080p 항목을 찾지 못했습니다...');
                // 톱니바퀴 닫기만
                gearButton.click();
            }
        }, 500);
    }

    // ------------------------------
    // 2) 버튼 생성 함수 (중복 생성 방지)
    // ------------------------------
    function createResolutionButton() {
        // 이미 버튼이 있다면 재생성 방지
        if (document.getElementById('my1080pButton')) {
            return;
        }

        // (a) 삽입할 컨테이너 찾기
        const container = document.querySelector("[class^='video_information_control__']");
        if (!container) return;

        // (b) 새 버튼 만들기
        const newBtn = document.createElement('button');
        newBtn.id = 'my1080pButton';
        newBtn.classList.add(
            'button_container__x044H',
            'button_medium__r15mw',
            'button_capsule__tU-O-',
            'button_dark__cw8hT'
        );
        newBtn.style.marginRight = '7px'; // 다른 버튼과 비슷한 간격
        newBtn.innerText = '1080p 설정';

        // (c) 클릭 이벤트 → 해상도 변경
        newBtn.addEventListener('click', setResolution);

        // (d) 컨테이너 가장 왼쪽에 삽입
        container.insertBefore(newBtn, container.firstChild);
    }

    // ------------------------------
    // 3) MutationObserver 설정
    //    -> DOM 변화를 감시하다가,
    //       video_information_control__ 요소가 생기면 버튼 삽입
    // ------------------------------
    const observer = new MutationObserver((mutations) => {
        // 매 변경마다 한번씩 버튼 삽입 시도 (이미 있으면 함수 내부서 return)
        createResolutionButton();
    });

    // body 전체를 감시(자식 노드 추가/삭제/변경)
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 혹시 최초 로드 시점에 바로 적용할 수 있도록, 초기에 한번 실행
    setTimeout(createResolutionButton, 2000);

})();
