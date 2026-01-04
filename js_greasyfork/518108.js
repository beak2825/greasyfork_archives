// ==UserScript==
// @name         토끼 광고차단
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  마나토끼, 뉴토끼, 북토끼 광고차단
// @author       You
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/518108/%ED%86%A0%EB%81%BC%20%EA%B4%91%EA%B3%A0%EC%B0%A8%EB%8B%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/518108/%ED%86%A0%EB%81%BC%20%EA%B4%91%EA%B3%A0%EC%B0%A8%EB%8B%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 마나토끼, 뉴토끼, 북토끼 광고차단
    const url = window.location.hostname;
    if (url.includes("newtoki") || url.includes("manatoki") || url.includes("booktoki")) {
        // URL차단은 안됨 브라우저가 스크립트보다 요청하는 속도가 더 빠름
        const blockedKeywordURL = "tokinbtoki"; // 차단할 키워드 URL

        // 숨길 요소들 선택자 정의
        const selectors = [
            "#hd_pop",
            "#id_mbv",
            ".col-15.col-md-9.col-sm-9",
            ".board-tail-banner",
            ".basic-banner",
            "#main-banner-view"
        ];

        // CSS 스타일로 요소 숨기기
        const addStyle = () => {
            const style = document.createElement("style");
            style.textContent = selectors.map(selector => `${selector} { display: none !important; visibility: hidden !important; }`).join("\n");
            (document.head || document.documentElement).appendChild(style);
        };

        // DOM로드 확인
        if (document.head) {
            addStyle(); // DOM렌더링되기 전에 새로운 CSS삽입
        } else {
            document.addEventListener("DOMContentLoaded", addStyle); // 해당 스크립트 파일 실행 시점이 늦는 앱 대비용 코드(잠깐 광고 여백이 보임)
        }

    }
})();
