// ==UserScript==
// @name         나히다 라이브 자동 다운로드
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  nahida.live 사이트에서 dropdown, menuitem 클릭 후 여러 비밀번호 입력 및 다운로드 버튼 클릭 반복 처리
// @author       Your Name
// @match        *://*nahida.live/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519437/%EB%82%98%ED%9E%88%EB%8B%A4%20%EB%9D%BC%EC%9D%B4%EB%B8%8C%20%EC%9E%90%EB%8F%99%20%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/519437/%EB%82%98%ED%9E%88%EB%8B%A4%20%EB%9D%BC%EC%9D%B4%EB%B8%8C%20%EC%9E%90%EB%8F%99%20%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const passwordsToEnter = ["gayshin", "GAYSHIN", "ㅎ묘노ㅑㅜ", "Eidwh","EIDWH","gayshin"+today(), "GAYSHIN"+today(),"gayshin눈치"]; // 여러 비밀번호를 여기에 배열로 설정
    let currentPasswordIndex = 0; // 현재 처리 중인 비밀번호 인덱스

    function clickSecondMenuItem() {
        const menuItems = document.querySelectorAll('div[role="menuitem"]');

        if (menuItems.length >= 2) {
            const secondMenuItem = menuItems[0]; // 첫 번째 항목 = 일반 다운로드
            console.log("두 번째 menuitem을 찾았습니다. 클릭 중...");
            secondMenuItem.click();
        } else {
            console.log("두 번째 menuitem을 찾을 수 없습니다.");
        }
    }

    function today() {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
        const day = String(date.getDate()).padStart(2, '0');
        return `${month}${day}`;
    }

    function enterPasswordsAndDownload() {
        const passwordFields = document.querySelectorAll('input[placeholder="Password"]');

        if (passwordFields.length > 0 && currentPasswordIndex < passwordsToEnter.length) {
            const passwordField = passwordFields[0]; // 항상 첫 번째 Password 필드 처리
            const password = passwordsToEnter[currentPasswordIndex];

            console.log(`Password 필드에 비밀번호 '${password}'를 입력합니다.`);
            passwordField.value = password;

            // 추가 이벤트 트리거
            passwordField.dispatchEvent(new Event('input', { bubbles: true }));
            passwordField.dispatchEvent(new Event('change', { bubbles: true }));

            // 다운로드 버튼 클릭
            const downloadButton = document.querySelector('button.px-4.py-2.rounded-lg.shadow');
            if (downloadButton) {
                console.log(`다운로드 버튼을 클릭합니다.`);
                downloadButton.click();

                // 클릭 후 다음 비밀번호 처리
                setTimeout(() => {
                    passwordField.value = ""; // 비밀번호 필드 초기화
                    currentPasswordIndex++; // 다음 비밀번호로 이동
                    enterPasswordsAndDownload(); // 재귀 호출로 다음 비밀번호 처리
                }, 1000); // 버튼 클릭 후 대기 시간 (1초)
            } else {
                console.log("다운로드 버튼을 찾을 수 없습니다.");
            }
        } else if (currentPasswordIndex >= passwordsToEnter.length) {
            console.log("모든 비밀번호 처리가 완료되었습니다.");
        } else {
            console.log("Password 필드를 찾을 수 없습니다.");
        }
    }

    function observeDropdownButtons() {
        const observer = new MutationObserver(() => {
            const dropdownButtons = document.querySelectorAll('button[type="button"]');
            console.log(dropdownButtons);
            if (dropdownButtons.length >= 1) {
                observer.disconnect(); // 대상 요소를 찾으면 감시 중단
                console.log("드롭다운 버튼 감지 완료. 작업을 시작합니다.");

                const secondButton = dropdownButtons[2]; // 두 번째 버튼
                console.log("두 번째 dropdown 버튼을 찾았습니다. 클릭 중...");
                secondButton.click();

                setTimeout(() => {
                    clickSecondMenuItem();
                    setTimeout(() => {
                        enterPasswordsAndDownload();
                    }, 500);
                }, 500);
            }
        });

        // 감시 대상 설정
        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }

    // 페이지 로드 후 MutationObserver 시작

    observeDropdownButtons();

})();