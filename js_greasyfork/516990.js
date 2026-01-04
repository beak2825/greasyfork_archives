// ==UserScript==
// @name         Chzzk Auto Click Confirm and Setting 241112
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Automatically click the ad block confirmation button and set streaming quality on Chzzk
// @match        *://chzzk.naver.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/516990/Chzzk%20Auto%20Click%20Confirm%20and%20Setting%20241112.user.js
// @updateURL https://update.greasyfork.org/scripts/516990/Chzzk%20Auto%20Click%20Confirm%20and%20Setting%20241112.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 초기 화질 설정값 (Tampermonkey 메뉴에서 기본 값이 없다면 1080p)
    GM_setValue('qualitySetting', GM_getValue('qualitySetting', '1080p'));

    // 광고차단 팝업의 "확인" 버튼 클릭 함수 (광고 차단 프로그램 팝업일 때만)
    const autoClickAdBlockConfirmButton = () => {
        const confirmButton = document.querySelector('.button_container__ppWwB.button_primary__b63Y7');
        const adBlockMessage = Array.from(document.querySelectorAll('div')).find(div => div.innerText.includes("광고 차단 프로그램을 사용 중이신가요?"));

        if (confirmButton && adBlockMessage) {
            confirmButton.click();
        }
    };

    // 화질을 설정 값으로 적용하는 함수
    const setQuality = () => {
        const qualitySetting = GM_getValue('qualitySetting'); // 현재 설정된 화질 불러오기
        const qualityPanel = document.querySelector('.pzp-pc__setting-quality-pane');
        if (qualityPanel) {
            qualityPanel.click();
        }

        const qualityItems = document.querySelectorAll('span.pzp-pc-ui-setting-quality-item__prefix');
        qualityItems.forEach(item => {
            if (item.textContent.includes(qualitySetting)) {
                item.click();
            }
        });
    };

    // 화질 변경을 위한 메뉴 옵션 추가
    const setQualityOption = (quality) => {
        GM_setValue('qualitySetting', quality);
        setQuality(); // 실시간 화질 변경
    };

    GM_registerMenuCommand("Set Quality to 1080p", () => setQualityOption('1080p'));
    GM_registerMenuCommand("Set Quality to 720p", () => setQualityOption('720p'));
    GM_registerMenuCommand("Set Quality to 480p", () => setQualityOption('480p'));
    GM_registerMenuCommand("Set Quality to 360p", () => setQualityOption('360p'));

    // 페이지 로드 시 작업 초기화
    const initialize = () => {
        autoClickAdBlockConfirmButton();
        setQuality();

        // MutationObserver로 팝업이 다시 나타나는 경우 자동 클릭 및 화질 설정
        const observer = new MutationObserver(() => {
            autoClickAdBlockConfirmButton();
            setQuality();
        });

        observer.observe(document.body, { childList: true, subtree: true });
    };

    // 페이지 로드 및 뒤로 가기 시 이벤트 트리거
    window.addEventListener('load', initialize);
    window.addEventListener('popstate', initialize);
})();
