// ==UserScript==
// @name         치지직 1080p 해상도 고정
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  치지직 1080p 해상도로 고정합니다
// @match        *://chzzk.naver.com/*
// @match        https://chzzk.naver.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/514991/%EC%B9%98%EC%A7%80%EC%A7%81%201080p%20%ED%95%B4%EC%83%81%EB%8F%84%20%EA%B3%A0%EC%A0%95.user.js
// @updateURL https://update.greasyfork.org/scripts/514991/%EC%B9%98%EC%A7%80%EC%A7%81%201080p%20%ED%95%B4%EC%83%81%EB%8F%84%20%EA%B3%A0%EC%A0%95.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 해상도 설정 함수 (1080p 시도, 없으면 720p 시도)
    function setResolution() {
        const qualityItem = document.querySelector(
            `.pzp-pc-setting-quality-pane__list-container > li:first-child:not(.pzp-pc-ui-setting-item--checked)`
        );

        if (qualityItem) {
            qualityItem.click();
            console.log("1080p 해상도로 설정되었습니다.");
        } else {
            console.log("1080p 해상도를 사용할 수 없습니다.");
        }
    }

    // 스크롤 오류 수정 함수
    function fixScrollIssue() {
        document.body.style.overflow = 'auto';
        document.documentElement.style.overflow = 'auto';

        // `position: fixed` 속성 제거
        document.body.style.position = 'relative';
        document.documentElement.style.position = 'relative';

        // `height` 속성 재설정
        document.body.style.height = 'auto';
        document.documentElement.style.height = 'auto';

        console.log("스크롤 오류가 수정되었습니다.");
    }

    // 특정 페이지에서 해상도 및 스크롤 설정 적용
    function applySettingsOnSpecificPages() {
        if (
            location.href.startsWith("https://chzzk.naver.com/live/") ||
            location.href.startsWith("https://chzzk.naver.com/video")
        ) {
            const interval = setInterval(() => {
                setResolution();
                clearInterval(interval); // 해상도 설정 후 간격 해제
            }, 500);
            fixScrollIssue(); // 스크롤 문제 해결
        } else {
            fixScrollIssue(); // 다른 페이지에서도 스크롤 문제 해결
        }
    }

    // 페이지 로드 시 설정 적용
    window.addEventListener("load", () => {
        applySettingsOnSpecificPages();
    });

    // URL 변경 감지하여 설정 재적용
    let lastUrl = location.href;
    setInterval(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            applySettingsOnSpecificPages();
        }
    }, 1000);
})();
