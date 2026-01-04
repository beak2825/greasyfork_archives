// ==UserScript==
// @name         치지직 Pretendard(사이드바만)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  aside_wrapper__Eq1-b에만 Pretendard 폰트 적용 + name_text 포함 클래스는 굵게
// @author       ChatGPT
// @match        https://chzzk.naver.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543312/%EC%B9%98%EC%A7%80%EC%A7%81%20Pretendard%28%EC%82%AC%EC%9D%B4%EB%93%9C%EB%B0%94%EB%A7%8C%29.user.js
// @updateURL https://update.greasyfork.org/scripts/543312/%EC%B9%98%EC%A7%80%EC%A7%81%20Pretendard%28%EC%82%AC%EC%9D%B4%EB%93%9C%EB%B0%94%EB%A7%8C%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 1. Pretendard 폰트 로드
    const loadFont = () => {
        const link = document.createElement("link");
        link.href = "https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
        link.rel = "stylesheet";
        document.head.appendChild(link);
    };

    // 2. 폰트와 굵기 적용
    const applyFontToAside = () => {
        const wrapper = document.querySelector(".aside_wrapper__Eq1-b");
        if (!wrapper) return;

        const elements = wrapper.querySelectorAll("*");
        elements.forEach(el => {
            el.style.setProperty("font-family", "'Pretendard Variable', Pretendard, sans-serif", "important");

            // classList로 안전하게 체크
            if (el.classList && Array.from(el.classList).some(cls => cls.includes("name_text"))) {
                el.style.setProperty("font-weight", "bold", "important");
            }
        });
    };

    // 3. DOM 변경 감지
    const observer = new MutationObserver(() => {
        applyFontToAside();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // 4. 초기 실행
    loadFont();
    applyFontToAside();
})();