// ==UserScript==
// @name         치지직 후원 메시지 색깔 롤백
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  색깔 쨍한거 ㅈㄴ 보기 싫네
// @author       ㅇㅇ
// @match        https://chzzk.naver.com/live/*
// @grant        ㅇㅇ
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/531009/%EC%B9%98%EC%A7%80%EC%A7%81%20%ED%9B%84%EC%9B%90%20%EB%A9%94%EC%8B%9C%EC%A7%80%20%EC%83%89%EA%B9%94%20%EB%A1%A4%EB%B0%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/531009/%EC%B9%98%EC%A7%80%EC%A7%81%20%ED%9B%84%EC%9B%90%20%EB%A9%94%EC%8B%9C%EC%A7%80%20%EC%83%89%EA%B9%94%20%EB%A1%A4%EB%B0%B1.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // CSS를 문서에 추가하는 함수
    function addCustomStyle() {
        // 이미 스타일이 추가되어 있는지 확인
        if (document.getElementById('chzzk-custom-style')) {
            return;
        }

        const styleElement = document.createElement('style');
        styleElement.id = 'chzzk-custom-style';
        styleElement.textContent = `
            /* 모든 가능한 변수명 타겟팅 */
            :root {
                --Surface-Donation-Violet: #3c2a5e !important;
            }
        `;

        // 문서에 스타일 추가
        if (document.head) {
            document.head.appendChild(styleElement);
        } else if (document.documentElement) {
            document.documentElement.appendChild(styleElement);
        }
    }

    // 가능한 빨리 스타일 적용
    addCustomStyle();

    // DOM이 로드되면 스타일 재적용
    document.addEventListener('DOMContentLoaded', () => {
        addCustomStyle();
        overrideCSSVariables();
    });

    // 페이지가 완전히 로드된 후 실행
    window.addEventListener('load', () => {
        addCustomStyle();
        overrideCSSVariables();
        scanAllElements();

        // 동적으로 변경되는 요소 감지
        const observer = new MutationObserver(() => {
            addCustomStyle();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class']
        });
    });
})();
