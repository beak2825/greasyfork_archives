// ==UserScript==
// @name         YouTube Studio 광고 적합성 자동 클릭 스크립트 - edit 이동 후 복귀도 감지
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  세부정보 클릭 감지 → edit 이동 후 복귀해도 자동화 가능
// @license      MIT
// @author       JOJM
// @match        https://studio.youtube.com/channel/*
// @match        https://studio.youtube.com/video/*/edit
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531735/YouTube%20Studio%20%EA%B4%91%EA%B3%A0%20%EC%A0%81%ED%95%A9%EC%84%B1%20%EC%9E%90%EB%8F%99%20%ED%81%B4%EB%A6%AD%20%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8%20-%20edit%20%EC%9D%B4%EB%8F%99%20%ED%9B%84%20%EB%B3%B5%EA%B7%80%EB%8F%84%20%EA%B0%90%EC%A7%80.user.js
// @updateURL https://update.greasyfork.org/scripts/531735/YouTube%20Studio%20%EA%B4%91%EA%B3%A0%20%EC%A0%81%ED%95%A9%EC%84%B1%20%EC%9E%90%EB%8F%99%20%ED%81%B4%EB%A6%AD%20%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8%20-%20edit%20%EC%9D%B4%EB%8F%99%20%ED%9B%84%20%EB%B3%B5%EA%B7%80%EB%8F%84%20%EA%B0%90%EC%A7%80.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const FLAG_KEY = 'gpt_auto_trigger';

    const currentUrl = window.location.href;

    // 🟥 edit 페이지에서는 자동화 실행 X
    if (currentUrl.includes('/video/') && currentUrl.includes('/edit')) {
        console.log('⛔ edit 페이지에서는 자동화 실행 안 함');
        return;
    }

    // ✅ channel 페이지
    if (currentUrl.includes('/channel/')) {
        // 매번 세부정보 클릭 감지 시 플래그 설정
        function pollDetailsClick() {
            const detailButtons = document.querySelectorAll('[aria-label="세부정보"]');
            detailButtons.forEach(btn => {
                if (!btn.dataset.listenerAttached) {
                    btn.addEventListener('click', () => {
                        console.log('📍 세부정보 클릭 감지됨');
                        sessionStorage.setItem(FLAG_KEY, 'true');
                    });
                    btn.dataset.listenerAttached = "true";
                }
            });
            setTimeout(pollDetailsClick, 1000);
        }

        // 자동화 실행 조건 감지
        function watchAutomationTrigger() {
            if (sessionStorage.getItem(FLAG_KEY) === 'true') {
                const nextButton = document.querySelector('button[aria-label="다음"]');
                if (nextButton) {
                    console.log('🚀 자동화 조건 충족 → 실행 시작');
                    sessionStorage.removeItem(FLAG_KEY);
                    startAutomation();
                } else {
                    console.log('⏳ 세부정보 내부 로딩 대기 중...');
                }
            }
            setTimeout(watchAutomationTrigger, 1000);
        }

        // ✅ 자동화 시작
        function startAutomation() {
            let isRunning = true;

            function clickNextButtonStep1() {
                const nextButton = document.querySelector('button[aria-label="다음"]');
                if (nextButton && !nextButton.disabled) {
                    nextButton.click();
                    console.log('✅ [1단계] 첫 번째 "다음" 클릭');
                    setTimeout(clickCheckbox, 2000);
                } else {
                    setTimeout(clickNextButtonStep1, 1000);
                }
            }

            function clickCheckbox() {
                const checkbox = document.querySelector('ytcp-checkbox-lit[label="해당 사항 없음"] div#checkbox');
                if (checkbox) {
                    checkbox.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    checkbox.click();
                    console.log('✅ [2단계] 해당 사항 없음 체크');
                    setTimeout(clickSubmitButton, 2000);
                } else {
                    setTimeout(clickCheckbox, 1000);
                }
            }

            function clickSubmitButton() {
                const submitButton = document.querySelector('button[aria-label="평가 제출"]');
                if (submitButton && !submitButton.disabled) {
                    submitButton.click();
                    console.log('✅ [3단계] 평가 제출 클릭');
                    setTimeout(clickNextButtonStep4, 2000);
                } else {
                    setTimeout(clickSubmitButton, 1000);
                }
            }

            function clickNextButtonStep4() {
                const nextButton = document.querySelector('#next-button button');
                if (nextButton && !nextButton.disabled) {
                    nextButton.click();
                    console.log('✅ [4단계] 두 번째 "다음" 클릭');
                    setTimeout(clickNextButtonStep5, 2000);
                } else {
                    setTimeout(clickNextButtonStep4, 1000);
                }
            }

            function clickNextButtonStep5() {
                const nextButton = document.querySelector('#next-button button');
                if (nextButton && !nextButton.disabled) {
                    nextButton.click();
                    console.log('✅ [5단계] 세 번째 "다음" 클릭');
                    setTimeout(clickNextButtonStep6, 2000);
                } else {
                    setTimeout(clickNextButtonStep5, 1000);
                }
            }

            function clickNextButtonStep6() {
                const nextButton = document.querySelector('#next-button button');
                if (nextButton && !nextButton.disabled) {
                    nextButton.click();
                    console.log('✅ [6단계] 네 번째 "다음" 클릭');
                    setTimeout(clickSaveButton, 2000);
                } else {
                    setTimeout(clickNextButtonStep6, 1000);
                }
            }

            function clickSaveButton() {
                const saveButton = document.querySelector('button[aria-label="저장"]');
                if (saveButton && !saveButton.disabled) {
                    saveButton.click();
                    console.log('✅ [7단계] 저장 클릭 완료 🎉');
                    isRunning = false;
                } else {
                    setTimeout(clickSaveButton, 1000);
                }
            }

            clickNextButtonStep1();
        }

        // 실행
        window.addEventListener('load', () => {
            console.log('📌 세부정보 감시 및 실행 감시 시작');
            pollDetailsClick();
            watchAutomationTrigger();
        });
    }
})();
