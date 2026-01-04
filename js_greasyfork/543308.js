// ==UserScript==
// @name         치지직 Pretendard
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  nemony 제외 Pretendard 적용 + name_text 클래스는 굵게 처리
// @author       ChatGPT
// @match        https://chzzk.naver.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543308/%EC%B9%98%EC%A7%80%EC%A7%81%20Pretendard.user.js
// @updateURL https://update.greasyfork.org/scripts/543308/%EC%B9%98%EC%A7%80%EC%A7%81%20Pretendard.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 1. Pretendard 웹폰트 로드
    const link = document.createElement('link');
    link.href = 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // 2. Pretendard 적용 + name_text 처리 함수
    function applyStyles() {
        const allElements = document.body.getElementsByTagName("*");

        for (let el of allElements) {
            const style = window.getComputedStyle(el);
            const font = style.fontFamily.toLowerCase();

            // 2-1. nemony 포함된 요소는 무시
            if (font.includes("nemony")) continue;

            // 2-2. Pretendard 폰트 강제 적용
            el.style.setProperty("font-family", "'Pretendard', sans-serif", "important");

            // 2-3. class에 name_text 포함되면 굵게
            const className = el.className || "";
            if (typeof className === 'string' && className.includes("name_text")) {
                el.style.setProperty("font-weight", "bold", "important");
            }
        }
    }

    // 3. 초기 적용 + DOM 변화 감지
    window.addEventListener('load', () => {
        applyStyles();

        const observer = new MutationObserver(() => {
            applyStyles();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
})();
