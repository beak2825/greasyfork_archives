// ==UserScript==
// @name         Chzzk Auto Click Confirm and 1080p
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Automatically click the ad block confirmation button and set streaming quality to 1080p on Chzzk
// @match        *://chzzk.naver.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/515485/Chzzk%20Auto%20Click%20Confirm%20and%201080p.user.js
// @updateURL https://update.greasyfork.org/scripts/515485/Chzzk%20Auto%20Click%20Confirm%20and%201080p.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 광고차단 팝업의 "확인" 버튼 클릭 함수 (광고 차단 프로그램 팝업일 때만)
    const autoClickAdBlockConfirmButton = () => {
        const confirmButton = document.querySelector('.button_container__ppWwB.button_primary__b63Y7');
        
        // "광고 차단 프로그램을 사용 중이신가요?" 텍스트가 포함된 요소 확인
        const adBlockMessage = Array.from(document.querySelectorAll('div')).find(div => div.innerText.includes("광고 차단 프로그램을 사용 중이신가요?"));
        
        // "광고 차단 프로그램" 텍스트가 있는 팝업이 나타날 때만 "확인" 버튼을 클릭
        if (confirmButton && adBlockMessage) {
            confirmButton.click(); // "확인" 버튼 클릭
        }
    };

    // 화질을 1080p로 설정하는 함수
    const setQualityTo1080p = () => {
        const qualityItems = document.querySelectorAll('.pzp-pc-ui-setting-quality-item');

        qualityItems.forEach(item => {
            const qualityLabel = item.querySelector('.pzp-pc-ui-setting-quality-item__prefix');
            if (qualityLabel && qualityLabel.textContent.includes('1080p')) {
                item.click(); // 1080p를 클릭하여 화질 변경
            }
        });
    };

    // 페이지 로드 시 작업 초기화
    const initialize = () => {
        autoClickAdBlockConfirmButton();
        setQualityTo1080p();

        // MutationObserver로 팝업이 다시 나타나는 경우 자동 클릭 및 화질 설정
        const observer = new MutationObserver(() => {
            autoClickAdBlockConfirmButton();
            setQualityTo1080p();
        });

        observer.observe(document.body, { childList: true, subtree: true });
    };

    // 페이지 로드 및 뒤로 가기 시 이벤트 트리거
    window.addEventListener('load', initialize);
    window.addEventListener('popstate', initialize);
})();
